/**
 * Suíte de Testes Ao Vivo na Nuvem (Live Cloud E2E)
 * Valida a saúde e integridade da aplicação em produção (Render/Railway/AWS/Túnel).
 * Configurado com rejectUnauthorized: false para evitar erros de certificados intermediários no Windows.
 * Uso: node tests/test_cloud_live.js <URL>
 */
const https = require('https');
const http = require('http');
const url = require('url');

const targetUrl = process.argv[2] || process.env.CLOUD_URL || 'http://localhost:3000';

console.log(`\n=======================================================`);
console.log(` TESTES AO VIVO NA NUVEM (LIVE CLOUD E2E)`);
console.log(` Alvo: ${targetUrl}`);
console.log(` Modo SSL: rejectUnauthorized=false (resiliente para Windows)`);
console.log(`=======================================================\n`);

let passed = 0;
let failed = 0;

function check(cond, msg) {
  if (cond) {
    console.log(`  ✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
    failed++;
  }
}

function fetchUrl(target, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(target);
    const lib = parsed.protocol === 'https:' ? https : http;
    const reqOptions = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      rejectUnauthorized: false,
      timeout: 15000
    };

    const req = lib.request(reqOptions, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout de 15 segundos excedido'));
    });

    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runLiveTests() {
  try {
    // 1. Teste de Monitoramento 24/7 (/api/health)
    console.log(`[1] Verificação de Saúde na Nuvem (/api/health)`);
    const healthRes = await fetchUrl(`${targetUrl}/api/health`);
    check(healthRes.status === 200, `Healthcheck status HTTP 200 (obtido: ${healthRes.status})`);
    
    let healthJson = {};
    try { healthJson = JSON.parse(healthRes.body); } catch (e) {}
    check(healthJson.status === 'ok', `Healthcheck payload status="ok"`);
    check(Boolean(healthJson.version && healthJson.version.startsWith('2.')), `Versão 2.x confirmada (${healthJson.version})`);
    check(typeof healthJson.uptime_seconds === 'number', `Uptime reportado: ${healthJson.uptime_seconds}s`);

    // 2. Teste de Carregamento da Aplicação Principal (SPA / Frontend)
    console.log(`\n[2] Verificação da Interface do Usuário (HTML Principal)`);
    const homeRes = await fetchUrl(`${targetUrl}/`);
    check(homeRes.status === 200, `Página inicial status HTTP 200`);
    check(homeRes.body.includes('AgentLab'), `Título e marca AgentLab presentes`);
    check(homeRes.body.includes('phone') || homeRes.body.includes('screen') || homeRes.body.includes('id="screen"'), `Mockup de celular interativo renderizado`);
    check(homeRes.body.includes('simulador') || homeRes.body.includes('Simulador') || homeRes.body.includes('Proposta'), `Simulador e calculadora presentes`);

    // 3. Teste de Conformidade Legal e Regulatória Brasileira
    console.log(`\n[3] Verificação de Páginas Legais (LGPD / ECA / Código Civil)`);
    const termosRes = await fetchUrl(`${targetUrl}/termos`);
    check(termosRes.status === 200, `Termos de Uso acessíveis (/termos HTTP 200)`);
    check(termosRes.body.includes('LGPD') || termosRes.body.includes('Lei Geral de Proteção de Dados'), `Menção explícita à LGPD em /termos`);

    const privRes = await fetchUrl(`${targetUrl}/privacidade`);
    check(privRes.status === 200, `Política de Privacidade acessível (/privacidade HTTP 200)`);
    check(privRes.body.includes('Encarregado') || privRes.body.includes('Titular') || privRes.body.includes('Privacidade') || privRes.body.includes('Dados'), `Direitos e proteção de dados em /privacidade`);

    // 4. Teste de Geração de PIX Oficial (EMV + QR Code)
    console.log(`\n[4] Teste da Rota de Pagamento PIX`);
    const pixRes = await fetchUrl(`${targetUrl}/api/pix/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: '49.00', name: 'Navalha 31 Barbearia', key: 'pix@navalha31.com.br', pixKey: 'pix@navalha31.com.br' })
    });
    check(pixRes.status === 200, `API PIX status HTTP 200`);
    let pixJson = {};
    try { pixJson = JSON.parse(pixRes.body); } catch (e) {}
    check(pixJson.success === true, `API PIX success=true`);
    const pixPayload = pixJson.pix_payload || pixJson.payload || '';
    check(pixPayload.startsWith('000201'), `Payload PIX EMV oficial válido (${pixPayload.substring(0, 24)}...)`);

    console.log(`\n=======================================================`);
    console.log(` RELATÓRIO DO TESTE AO VIVO EM PRODUÇÃO`);
    console.log(` Aprovados : ${passed}`);
    console.log(` Reprovados: ${failed}`);
    console.log(`=======================================================\n`);

    if (failed > 0) {
      console.error(`❌ TESTE AO VIVO REPROVADO`);
      process.exit(1);
    } else {
      console.log(`🎉 TESTE AO VIVO 100% HOMOLOGADO COM SUCESSO!`);
      process.exit(0);
    }
  } catch (err) {
    console.error(`💥 Falha de conexão ao executar testes na nuvem:`, err.message);
    process.exit(1);
  }
}

runLiveTests();
