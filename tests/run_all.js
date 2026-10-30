/**
 * Suíte de Testes Formais Automatizados - AgentLab Pro
 * Valida integridade do servidor, rotas de monitoramento, geração de PIX e integridade dos nichos.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log(`\n=======================================================`);
  console.log(` INICIANDO SUÍTE DE TESTES LOCAIS: AGENTLAB PRO`);
  console.log(`=======================================================\n`);

  // 1. Testar Arquivos de Infraestrutura Obrigatórios
  console.log(`[1] Verificação de Arquivos de Infraestrutura`);
  const rootDir = path.join(__dirname, '..');
  assert(fs.existsSync(path.join(rootDir, 'render.yaml')), 'render.yaml existe');
  assert(fs.existsSync(path.join(rootDir, 'Dockerfile')), 'Dockerfile existe');
  assert(fs.existsSync(path.join(rootDir, '.gitignore')), '.gitignore existe');
  assert(fs.existsSync(path.join(rootDir, '.dockerignore')), '.dockerignore existe');
  assert(fs.existsSync(path.join(rootDir, 'public', 'index.html')), 'public/index.html existe');
  assert(fs.existsSync(path.join(rootDir, 'public', 'termos.html')), 'public/termos.html existe');
  assert(fs.existsSync(path.join(rootDir, 'public', 'privacidade.html')), 'public/privacidade.html existe');

  // 2. Testar Servidor HTTP e Monitoramento /api/health
  console.log(`\n[2] Verificação do Servidor HTTP e /api/health`);
  const testPort = 3989;
  process.env.PORT = String(testPort);
  
  // Requisitar servidor
  let serverInstance;
  try {
    // Iniciar servidor em porta de teste
    const serverCode = require('../server.js');
  } catch (err) {
    console.log(`Aviso ao importar server.js: ${err.message}`);
  }

  // Esperar o servidor subir brevemente
  await new Promise(r => setTimeout(r, 600));

  // Requisição HTTP para /api/health
  await new Promise(resolve => {
    http.get(`http://127.0.0.1:${testPort}/api/health`, res => {
      assert(res.statusCode === 200, 'GET /api/health retorna status HTTP 200');
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          assert(json.status === 'ok', 'Status é "ok"');
          assert(json.app.includes('AgentLab Pro'), 'Nome da aplicação condiz');
          assert(json.version === '2.0.0', 'Versão é 2.0.0');
          assert(typeof json.uptime_seconds === 'number', 'uptime_seconds é numérico');
          assert(Boolean(json.timestamp), 'timestamp ISO está presente');
        } catch (e) {
          assert(false, `Falha ao interpretar JSON de health: ${e.message}`);
        }
        resolve();
      });
    }).on('error', err => {
      assert(false, `Erro ao conectar no servidor de teste: ${err.message}`);
      resolve();
    });
  });

  // 3. Testar Rota de Termos e Privacidade
  console.log(`\n[3] Verificação das Páginas Legais (LGPD / Código Civil / ECA)`);
  await new Promise(resolve => {
    http.get(`http://127.0.0.1:${testPort}/termos`, res => {
      assert(res.statusCode === 200, 'GET /termos retorna status HTTP 200');
      resolve();
    }).on('error', () => { assert(false, 'Falha ao acessar /termos'); resolve(); });
  });

  await new Promise(resolve => {
    http.get(`http://127.0.0.1:${testPort}/privacidade`, res => {
      assert(res.statusCode === 200, 'GET /privacidade retorna status HTTP 200');
      resolve();
    }).on('error', () => { assert(false, 'Falha ao acessar /privacidade'); resolve(); });
  });

  // 4. Testar Endpoint de Geração de PIX Oficial (EMV + CRC16)
  console.log(`\n[4] Teste da API de PIX Oficial do Banco Central`);
  await new Promise(resolve => {
    const postData = JSON.stringify({
      amount: '150.00',
      name: 'Clinica Lumiere LTDA',
      key: 'contato@lumiere.com.br',
      city: 'Belo Horizonte',
      txid: 'CLI150'
    });

    const req = http.request(`http://127.0.0.1:${testPort}/api/pix/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      assert(res.statusCode === 200, 'POST /api/pix/generate retorna HTTP 200');
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          assert(json.success === true, 'Geração de PIX reporta sucesso');
          assert(json.pix_payload.startsWith('000201'), 'Payload EMV inicia com 000201');
          assert(json.pix_payload.includes('BR.GOV.BCB.PIX'), 'Contém domínio oficial do Bacen');
          assert(json.pix_payload.length > 50, 'Tamanho do payload é compatível');
        } catch (e) {
          assert(false, `Falha no parse do payload PIX: ${e.message}`);
        }
        resolve();
      });
    });
    req.on('error', err => {
      assert(false, `Erro na requisição PIX: ${err.message}`);
      resolve();
    });
    req.write(postData);
    req.end();
  });

  // 5. Testar Endpoint de Exportação n8n / Typebot / Prompt
  console.log(`\n[5] Teste de Exportação de Agentes (n8n & Typebot)`);
  await new Promise(resolve => {
    const agentData = JSON.stringify({
      biz: 'Ferraz & Lima',
      who: 'Júlia',
      agent: 'Recepção jurídica',
      label: 'Advocacia',
      caps: ['Triagem', 'Google Agenda', 'CRM'],
      price: { impl: 3800, sup: 1100, name: 'Avançada' }
    });

    const req = http.request(`http://127.0.0.1:${testPort}/api/export?type=n8n`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(agentData)
      }
    }, res => {
      assert(res.statusCode === 200, 'POST /api/export?type=n8n retorna HTTP 200');
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          assert(json.success === true, 'Exportação n8n retornou success=true');
          assert(json.export.nodes.length >= 3, 'Exportação contém os nós necessários');
        } catch (e) {
          assert(false, `Falha no parse do n8n: ${e.message}`);
        }
        resolve();
      });
    });
    req.write(agentData);
    req.end();
  });

  console.log(`\n=======================================================`);
  console.log(` RESULTADO FINAL DOS TESTES`);
  console.log(` Total Aprovados : ${testsPassed}`);
  console.log(` Total Reprovados: ${testsFailed}`);
  console.log(`=======================================================\n`);

  if (testsFailed > 0) {
    console.error(`💥 HOUVE FALHA NOS TESTES LOCAIS!`);
    process.exit(1);
  } else {
    console.log(`✨ TODOS OS TESTES PASSARAM COM SUCESSO!`);
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Erro fatal durante execução dos testes:', err);
  process.exit(1);
});

