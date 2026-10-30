/**
 * AgentLab Pro - Servidor HTTP 24/7 de Alta Resiliência
 * Suporta monitoramento em nuvem (/api/health), resolução estática universal e APIs REST.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

// Cálculo de CRC16 oficial do Banco Central (Polinômio 0x1021)
function calcCRC16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatEMV(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

function generatePixPayload({ key, name, city, amount, txid = '***' }) {
  const cleanName = (name || 'AGENTE IA').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 25);
  const cleanCity = (city || 'BRASIL').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().slice(0, 15);
  const cleanKey = (key || 'pix@agentlab.app').trim();
  const cleanTxid = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').slice(0, 25) || '***';

  const merchantAccount = formatEMV('00', 'BR.GOV.BCB.PIX') + formatEMV('01', cleanKey);

  let payload = 
    formatEMV('00', '01') +
    formatEMV('26', merchantAccount) +
    formatEMV('52', '0000') +
    formatEMV('53', '986');

  if (amount && Number(amount) > 0) {
    const formattedAmount = Number(amount).toFixed(2);
    payload += formatEMV('54', formattedAmount);
  }

  payload += 
    formatEMV('58', 'BR') +
    formatEMV('59', cleanName) +
    formatEMV('60', cleanCity) +
    formatEMV('62', formatEMV('05', cleanTxid)) +
    '6304';

  const crc = calcCRC16(payload);
  return payload + crc;
}

// Resolução resiliente de caminhos estáticos
function resolveStaticPath(pathname) {
  const normalizedSlash = (pathname || '/').replace(/\\/g, '/');
  const safePath = path.normalize(normalizedSlash).replace(/\\/g, '/').replace(/^(\.\.[\/\\])+/, '');
  const searchRoots = [
    __dirname,
    process.cwd(),
    path.join(__dirname, 'public'),
    path.join(__dirname, 'public', 'css'),
    path.join(__dirname, 'public', 'js'),
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'public', 'css'),
    path.join(process.cwd(), 'public', 'js')
  ];

  // Mapeamento de rotas legais amigáveis
  if (safePath === '/termos' || safePath === '/termos/' || safePath === 'termos') {
    for (const root of searchRoots) {
      const p = path.join(root, 'termos.html');
      if (fs.existsSync(p)) return p;
    }
  }
  if (safePath === '/privacidade' || safePath === '/privacidade/' || safePath === 'privacidade') {
    for (const root of searchRoots) {
      const p = path.join(root, 'privacidade.html');
      if (fs.existsSync(p)) return p;
    }
  }

  for (const root of searchRoots) {
    const candidate = path.join(root, safePath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
    // Suporte a arquivos soltos na raiz (sem pastas css/ ou js/)
    const baseName = path.basename(safePath);
    const baseCandidate = path.join(root, baseName);
    if (fs.existsSync(baseCandidate) && fs.statSync(baseCandidate).isFile()) {
      return baseCandidate;
    }
    // Index dentro de diretório
    const indexCandidate = path.join(candidate, 'index.html');
    if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
      return indexCandidate;
    }
  }

  // SPA fallback
  for (const root of searchRoots) {
    const fallback = path.join(root, 'index.html');
    if (fs.existsSync(fallback)) return fallback;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // CORS universal e cabeçalhos de segurança
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, 'http://127.0.0.1');
  const pathname = parsedUrl.pathname;

  // 1. ENDPOINT OBRIGATÓRIO DE MONITORAMENTO (/api/health)
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      app: 'AgentLab Pro - Laboratório de Agentes IA',
      version: '2.0.0',
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. API PIX OFICIAL DO BANCO CENTRAL
  if (pathname === '/api/pix/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const payload = generatePixPayload(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          pix_payload: payload,
          amount: data.amount,
          receiver: data.name
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'JSON inválido' }));
      }
    });
    return;
  }

  // 3. API DE EXPORTAÇÃO PARA N8N / TYPEBOT / EVOLUTION API
  if (pathname === '/api/export' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const agent = JSON.parse(body || '{}');
        const type = parsedUrl.searchParams ? (parsedUrl.searchParams.get('type') || 'n8n') : 'n8n';

        let exportPayload = {};
        if (type === 'n8n') {
          exportPayload = {
            name: `Workflow Agente IA - ${agent.biz || 'AgentLab'}`,
            nodes: [
              {
                parameters: { path: "webhook-whatsapp", responseMode: "responseNode" },
                name: "Webhook WhatsApp (Evolution API / Cloud API)",
                type: "n8n-nodes-base.webhook",
                typeVersion: 1,
                position: [250, 300]
              },
              {
                parameters: {
                  promptType: "define",
                  text: `Você é ${agent.who || 'o assistente'}, atendente virtual de ${agent.biz || 'nossa empresa'}.
Especialidade: ${agent.agent || 'Atendimento ao cliente'}.
Diretrizes: Seja cordial, rápido, use emojis adequados e siga o fluxo de triagem e agendamento.`
                },
                name: "Inteligência Artificial (OpenAI / Gemini)",
                type: "@n8n/n8n-nodes-langchain.agent",
                typeVersion: 1.6,
                position: [480, 300]
              },
              {
                parameters: {
                  url: "https://calendar.google.com/api",
                  sendHeaders: true
                },
                name: "Google Calendar Booking",
                type: "n8n-nodes-base.httpRequest",
                typeVersion: 4.1,
                position: [700, 200]
              },
              {
                parameters: {
                  url: "https://api.banco.com/v2/pix",
                  sendHeaders: true
                },
                name: "Geração de Pix Oficial",
                type: "n8n-nodes-base.httpRequest",
                typeVersion: 4.1,
                position: [700, 400]
              }
            ],
            connections: {}
          };
        } else if (type === 'typebot') {
          exportPayload = {
            version: "6",
            name: `Typebot - ${agent.biz || 'Agente IA'}`,
            groups: [
              {
                id: "welcome",
                title: "Boas-vindas & Triagem",
                blocks: [
                  { type: "text", content: `Olá! Sou ${agent.who || 'o assistente'} do ${agent.biz || 'escritório'}. Como posso te ajudar hoje?` }
                ]
              }
            ]
          };
        } else {
          exportPayload = {
            system_prompt: `Você é ${agent.who || 'Assistente'}, atendente oficial de ${agent.biz || 'Empresa'}.
Atuação: ${agent.agent || 'Atendimento comercial e suporte'}.
Capacidades: ${(agent.caps || []).join(', ')}.
Regras Éticas: Software de assistência não substitui consulta médica, odontológica ou parecer jurídico conclusivo.
Instruções: Faça perguntas breves, esclareça dúvidas do catálogo e colete dados essenciais para o fechamento.`,
            meta: {
              nicho: agent.label,
              complexidade: agent.price?.name,
              preco_sugerido_implantacao: agent.price?.impl,
              preco_sugerido_mensalidade: agent.price?.sup
            }
          };
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, type, export: exportPayload }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Dados inválidos' }));
      }
    });
    return;
  }

  // 4. SERVIÇO DE ARQUIVOS ESTÁTICOS UNIVERSAL
  if (req.method === 'GET') {
    const filePath = resolveStaticPath(pathname);
    if (filePath) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Erro interno ao ler arquivo');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 - Página não encontrada');
});

server.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(` AgentLab Pro - Laboratório de Agentes IA no Ar!`);
  console.log(` Servidor 24/7 Ativo em: http://localhost:${PORT}`);
  console.log(` Monitoramento de Saúde: http://localhost:${PORT}/api/health`);
  console.log(` Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=======================================================`);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Finalizando servidor...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('SIGINT recebido. Finalizando servidor...');
  server.close(() => process.exit(0));
});
