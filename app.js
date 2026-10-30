/**
 * AgentLab Pro - Motor de Execução Interativo
 */

const IC = {
  msg: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2-5.3A8.5 8.5 0 1 1 21 11.5z"/>',
  spark: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  book: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13"/>',
  calsearch: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="11.5" cy="15" r="2.2"/><path d="M13.2 16.7l1.8 1.8"/>',
  calcheck: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15.5l2 2 4-4"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.5"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  cart: '<path d="M3 4h2l2.4 11h11l2-8H6.2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5.5.8 1.5 1.5 2 2.5 2C11.5 7 11.5 5 12 3z"/>',
  paw: '<circle cx="6.5" cy="10" r="1.8"/><circle cx="10.5" cy="6" r="1.8"/><circle cx="15.5" cy="6.5" r="1.8"/><circle cx="18.5" cy="11" r="1.8"/><path d="M12 13c-3 0-6 3.5-6 5.5 0 1.5 1.5 2 3 1.5 1-.3 2-.7 3-.7s2 .4 3 .7c1.5.5 3 0 3-1.5 0-2-3-5.5-6-5.5z"/>',
  truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  headset: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="14" width="5" height="6" rx="1.5"/><rect x="17" y="14" width="5" height="6" rx="1.5"/>',
  scale: '<path d="M12 3v18M6 21h12M4 7h16M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1L20 20M8.1 15.9L20 4"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  brush: '<path d="M14 4l6 6-8 8H6v-6z"/><path d="M4 20l2-2"/>',
  tooth: '<path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7 .5 2.5 1 6.5 2.8 6.5 1.6 0 1.7-3.5 2.2-5 .3-1 .7-1.5 2-1.5s1.7.5 2 1.5c.5 1.5.6 5 2.2 5 1.8 0 2.3-4 2.8-6.5.5-2.5 2-4 2-7C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  fork: '<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8M7 7h4M17 3c-2 2-2 6 0 8v10"/>'
};

const ic = (k) => `<svg class="i" viewBox="0 0 24 24">${IC[k] || IC.spark}</svg>`;

const LIB = {
  kb: { id: 'kb', icon: 'book', t: 'Base de conhecimento', d: 'Busca a resposta nos dados do negócio', tool: 'Base do negócio' },
  handoff: { id: 'handoff', icon: 'headset', t: 'Transferência humana', d: 'Encaminha para a equipe com o resumo', tool: 'Inbox da equipe' }
};

const CH = {
  wa: { name: 'WhatsApp', api: 'WhatsApp Cloud API' },
  ig: { name: 'Instagram', api: 'Instagram Graph API' }
};

const $ = s => document.getElementById(s);

// Estado da Aplicação
const NICHES = { ...NICHES_DATA.niches };
let cur = 'adv';
let ch = 'wa';
let runId = 0;
let paused = false;
let speed = 1;
let clock = 0;
let elapsed = 0;
let lastMsgAt = -1e9;
let lastPix = null;
let stats = { msg: 0, act: 0, botT: [] };

const feed = $('feed');

function fmtClock(withSec) {
  const base = (NICHES[cur]?.start || 51600) + clock;
  const h = Math.floor(base / 3600) % 24;
  const m = Math.floor(base / 60) % 60;
  const s = Math.floor(base) % 60;
  const p = x => String(x).padStart(2, '0');
  return withSec ? `${p(h)}:${p(m)}:${p(s)}` : `${p(h)}:${p(m)}`;
}

function sleep(ms, my) {
  return new Promise(res => {
    let left = ms;
    const t = setInterval(() => {
      if (my !== runId) { clearInterval(t); res(false); return; }
      if (paused) return;
      left -= 50 * speed;
      elapsed += 50 * speed;
      clock += 0.05 * speed * 1.6;
      if (left <= 0) { clearInterval(t); res(true); }
    }, 50);
  });
}

const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = s => esc(s).replace(/\*(.+?)\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const fill = s => String(s || '').replace('{canal}', CH[ch].name).replace('{api}', CH[ch].api);
const scroll = () => { feed.scrollTop = feed.scrollHeight; };

function setStatus(kind, txt) {
  const el = $('status');
  el.className = 'status ' + kind;
  el.querySelector('span').textContent = txt;
}

function renderStats() {
  $('sMsg').textContent = stats.msg;
  $('sAct').textContent = stats.act;
  const a = stats.botT.length ? stats.botT.reduce((x, y) => x + y, 0) / stats.botT.length : 0;
  $('sTime').textContent = a ? a.toFixed(1).replace('.', ',') + ' s' : '0 s';
}

function addMsg(who, html) {
  lastMsgAt = elapsed;
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerHTML = html + `<span class="tm">${fmtClock()}${who === 'me' ? ' <span class="tk">✓✓</span>' : ''}</span>`;
  feed.appendChild(d);
  stats.msg++;
  renderStats();
  scroll();
  return d;
}

function typing(on) {
  let t = feed.querySelector('.typing');
  $('bizSt').textContent = on ? 'digitando…' : (ch === 'wa' ? 'online' : 'Ativo(a) agora');
  if (on && !t) {
    t = document.createElement('div');
    t.className = 'typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    feed.appendChild(t);
    scroll();
  }
  if (!on && t) t.remove();
}

async function botWait(my, T, pre) {
  if (pre && !await sleep(pre, my)) return false;
  typing(true);
  const ok = await sleep(T, my);
  typing(false);
  return ok;
}

// Renderizador de Cartões no Chat
function card(c) {
  const d = document.createElement('div');
  d.className = 'card';
  let h = '';

  if (c.type === 'slots') {
    h = `<div class="ch"><b>${esc(c.title)}</b><small>${esc(c.sub || '')}</small></div><div class="opts">${c.opts.map(o => `<button class="opt" tabindex="-1">${esc(o)}</button>`).join('')}</div>`;
  } else if (c.type === 'product') {
    h = `<div class="ch"><b>${esc(c.title)}</b></div><div class="price"><b>${c.price}</b>${c.old ? `<s>${c.old}</s>` : ''}</div><div class="note">${esc(c.note || '')}</div>`;
  } else if (c.type === 'listing') {
    h = `<div class="ch"><b>${esc(c.title)}</b><small>${esc(c.sub || '')}</small></div>${c.items.map((i, k) => `<div class="lst"><div class="lst-img">${ic('home')}</div><div class="lst-tx"><b>${esc(i.t)}</b><small>${esc(i.d)}</small></div><b class="lst-p">${i.p}</b></div>`).join('')}<div class="note" style="padding-top:8px">${esc(c.note || '')}</div>`;
  } else if (c.type === 'menu') {
    h = `<div class="ch"><b>${esc(c.title)}</b><small>Disponível agora</small></div>${c.items.map(i => `<div class="row"><span style="color:#111B21">${esc(i[0])}</span><b>${i[1]}</b></div>`).join('')}`;
  } else if (c.type === 'confirm') {
    h = `<div class="ok">${ic('check')}${esc(c.title)}</div>${c.rows.map(r => `<div class="row"><span>${esc(r[0])}</span><span>${esc(r[1])}</span></div>`).join('')}${c.total ? `<div class="row tot"><span>${c.total[0]}</span><span>${c.total[1]}</span></div>` : ''}`;
  } else if (c.type === 'pix') {
    const rawPixCode = PixEMV.generate({
      amount: c.amount,
      name: c.to,
      key: 'pix@agentlab.app',
      city: 'Belo Horizonte',
      txid: 'AG' + Date.now().toString(36).slice(-6).toUpperCase()
    });
    h = `<div class="ch"><b>Pagamento Oficial via Pix</b><small>${esc(c.to)}</small></div>
         <div class="qr"><canvas width="68" height="68"></canvas><div><b style="font-size:18px">${c.amount}</b><br><small style="color:#667781">Banco Central · Expira em 30 min</small></div></div>
         <div class="pixcode">${rawPixCode}</div>
         <button class="copy" type="button" tabindex="-1">Copiar código Pix (EMV)</button>`;
    lastPix = c;
    lastPix.emv = rawPixCode;
  }

  d.innerHTML = h;
  feed.appendChild(d);
  lastMsgAt = elapsed;

  // Renderizar QR Code real em Canvas
  const cv = d.querySelector('canvas');
  if (cv && lastPix && lastPix.emv) {
    PixEMV.drawQRCode(cv, lastPix.emv);
  }

  // Ação de copiar código Pix
  const copyBtn = d.querySelector('.copy');
  if (copyBtn && lastPix && lastPix.emv) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(lastPix.emv).then(() => {
        copyBtn.textContent = 'Código Pix Copiado! ✓';
        setTimeout(() => { copyBtn.textContent = 'Copiar código Pix (EMV)'; }, 2000);
      });
    };
  }

  stats.msg++;
  renderStats();
  scroll();
}

// Visualizador de Pipeline de Nós
function renderFlow() {
  const N = NICHES[cur];
  const ol = $('nodes');
  ol.innerHTML = '';
  N.flow.forEach((f, i) => {
    if (i > 0) {
      const c = document.createElement('li');
      c.className = 'conn';
      c.setAttribute('aria-hidden', 'true');
      c.dataset.to = f.id;
      ol.appendChild(c);
    }
    ol.appendChild(nodeEl(f));
  });
}

function nodeEl(f) {
  const li = document.createElement('li');
  li.className = 'node pending';
  li.dataset.id = f.id;
  li.innerHTML = `<div class="ic">${ic(f.icon)}</div><div class="tx"><b>${esc(f.t)}</b><span>${esc(fill(f.d))}</span></div><span class="tool">${esc(fill(f.tool))}</span>`;
  return li;
}

function setNode(id) {
  const ol = $('nodes');
  let el = ol.querySelector(`.node[data-id="${id}"]`);
  if (!el && LIB[id]) {
    const c = document.createElement('li');
    c.className = 'conn';
    c.dataset.to = id;
    ol.appendChild(c);
    el = nodeEl(LIB[id]);
    ol.appendChild(el);
  }
  if (!el) return;

  ol.querySelectorAll('.node.active').forEach(a => {
    if (a !== el) { a.classList.remove('active'); a.classList.add('done'); }
  });
  ol.querySelectorAll('.conn.flowing').forEach(c => c.classList.remove('flowing'));

  el.classList.remove('pending', 'done');
  el.classList.add('active');

  const prev = el.previousElementSibling;
  if (prev && prev.classList.contains('conn')) {
    prev.classList.add('lit', 'flowing');
  }

  if (id !== 'receive') {
    stats.act++;
    renderStats();
  }
}

function finishFlow() {
  $('nodes').querySelectorAll('.node.active').forEach(a => {
    a.classList.remove('active');
    a.classList.add('done');
  });
  $('nodes').querySelectorAll('.conn.flowing').forEach(c => c.classList.remove('flowing'));
}

function resetFlowStates() {
  $('nodes').querySelectorAll('.node').forEach(e => { e.className = 'node pending'; });
  $('nodes').querySelectorAll('.conn').forEach(c => { c.className = 'conn'; });
}

// Painel de Contexto e Logs
function setCtx(o) {
  const kv = $('kv');
  const em = kv.querySelector('.empty');
  if (em) em.remove();
  for (const [k, v] of Object.entries(o)) {
    let row = [...kv.children].find(r => r.dataset.k === k);
    if (!row) {
      row = document.createElement('div');
      row.dataset.k = k;
      row.innerHTML = `<dt>${esc(k)}</dt><dd></dd>`;
      kv.appendChild(row);
    }
    row.querySelector('dd').textContent = v;
    row.classList.remove('new');
    void row.offsetWidth;
    row.classList.add('new');
  }
}

function log(txt, cls) {
  const l = $('log');
  const p = document.createElement('p');
  if (cls === 'sep') {
    p.className = 'sep';
    p.textContent = txt;
  } else {
    const [a, b] = txt.split(' → ');
    p.innerHTML = `<span class="t">${fmtClock(true)}</span> <span class="k">${esc(a.replace('{ch}', ch))}</span>${b ? ` → <span class="${/✓|confirmado|ok/.test(b) ? 'o' : ''}">${esc(b)}</span>` : ''}`;
  }
  l.appendChild(p);
  l.scrollTop = l.scrollHeight;
}

// Indicador de Toque
function hideTouch() { $('touch').classList.remove('on', 'press'); }

async function tapEl(el, my) {
  const t = $('touch');
  const sr = $('screen').getBoundingClientRect();
  const r = el.getBoundingClientRect();
  t.style.left = (r.left - sr.left + r.width / 2) + 'px';
  t.style.top = (r.top - sr.top + r.height / 2) + 'px';
  t.classList.add('on');
  if (!await sleep(600, my)) return false;
  t.classList.remove('press');
  void t.offsetWidth;
  t.classList.add('press');
  return sleep(380, my);
}

// Comprovante Bancário Pix
function addReceipt() {
  const N = NICHES[cur];
  const c = N.cli;
  const p = lastPix || { amount: 'R$ 0,00', to: N.biz };
  const id = 'E' + '31872495' + '20261018' + fmtClock(true).replace(/:/g, '') + 's' + Math.random().toString(36).slice(2, 10).toUpperCase();
  const m = addMsg('me', `<div class="rc" style="--bk:${c.bkc || '#1E293B'}">
    <div class="rc-top"><span>${esc(c.bank || 'Banco Digital')}</span><span>Pix</span></div>
    <div class="rc-amt">Comprovante de Transferência<b>${p.amount}</b></div>
    <div class="rc-row"><span>Data</span><span>Hoje · ${fmtClock()}</span></div>
    <div class="rc-row"><span>De</span><span>${esc(c.name)}</span></div>
    <div class="rc-row"><span>Para</span><span>${esc(p.to)}</span></div>
    <div class="rc-row"><span>Autenticação</span><span class="rc-id">${id}</span></div>
    <div class="rc-foot">Transação do Banco Central · Demonstração</div>
  </div>`);
  m.classList.add('rcpt-msg');
}

// Google Calendar Interativo
const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WDF = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const wd = d => WD[new Date(2026, 9, d).getDay()];
const wdf = d => WDF[new Date(2026, 9, d).getDay()];

function calHead(c) {
  const N = NICHES[cur];
  return `<div class="gc-app"><i>${ic('calcheck')}</i>Google Agenda · Agendamento</div>
    <div class="gc-org">${esc(N.biz)}</div><div class="gc-title">${esc(c.title)}</div>
    <div class="gc-meta"><span>${ic('clock')}${esc(c.dur)}</span><span>${ic('pin')}${esc(c.place)}</span><span>${ic('user')}${esc(c.who)}</span></div>`;
}

function calGrid(c) {
  let h = `<div class="gc-month">Outubro de 2026</div><div class="gc-grid">` + ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(x => `<div class="wd">${x}</div>`).join('');
  const off = new Date(2026, 9, 1).getDay();
  for (let i = 0; i < off; i++) h += '<div></div>';
  for (let d = 1; d <= 31; d++) {
    const cls = d < 18 ? 'past' : d === 18 ? 'today' : c.days[d] ? 'av' : '';
    h += `<div class="d ${cls}" data-d="${d}">${d}</div>`;
  }
  return h + `</div><div class="gc-h" id="gch">Escolha um dia disponível</div><div class="gc-slots" id="gcs"></div>`;
}

function calSum(c) {
  const [d, t] = c.pick;
  return `<div class="gc-sum"><span>${ic('calcheck')}${wdf(d)}, ${d} de outubro · ${t}</span><span>${ic('clock')}${esc(c.dur)}</span><span>${ic('user')}${esc(c.who)}</span></div>`;
}

async function runCal(c, my) {
  const N = NICHES[cur];
  const g = $('gcal');
  if (!await botWait(my, 900, 450)) return false;

  const m = addMsg('ai', `<div class="lnk" style="display:flex;gap:10px;align-items:center;background:rgba(0,0,0,0.05);border-radius:8px;padding:8px;margin-bottom:6px;">
    <div style="width:38px;height:38px;border-radius:8px;background:#1A73E8;color:#fff;display:grid;place-items:center;">${ic('calcheck')}</div>
    <div><b>${esc(c.title)}</b><br><small style="color:#667781">calendar.google.com</small></div>
  </div><span style="color:#027EB5;font-weight:600;font-size:13.5px;">Escolher dia e horário</span>`);

  setStatus('wait', 'Cliente escolhendo horário');
  if (!await sleep(1300, my)) return false;
  if (!await tapEl(m.querySelector('.lnk'), my)) return false;
  hideTouch();

  g.innerHTML = `<div class="gc-bar"><div class="gc-url">${ic('calcheck')}calendar.google.com</div><span>✕</span></div><div class="gc-body" id="gcb">${calHead(c)}${calGrid(c)}</div>`;
  g.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => g.classList.add('open'));
  log('calendar.page_view → cliente abriu a agenda');

  if (!await sleep(1500, my)) return false;
  const body = $('gcb');
  const [pd, pt] = c.pick;
  const dEl = g.querySelector(`.d[data-d="${pd}"]`);
  if (!await tapEl(dEl, my)) return false;
  dEl.classList.add('sel');

  $('gch').textContent = `Horários de ${wdf(pd)}, ${pd}/10`;
  $('gcs').innerHTML = c.days[pd].map(t => `<button tabindex="-1">${t}</button>`).join('');
  body.scrollTop = body.scrollHeight;

  if (!await sleep(1100, my)) return false;
  const tEl = [...$('gcs').children].find(b => b.textContent === pt);
  if (!await tapEl(tEl, my)) return false;
  tEl.classList.add('sel');
  hideTouch();

  if (!await sleep(700, my)) return false;
  body.scrollTop = 0;
  body.innerHTML = `<div class="gc-app"><i>${ic('calcheck')}</i>Google Agenda · Confirmação</div>
    <div class="gc-title">Confirmar Dados da Reserva</div>${calSum(c)}
    <div class="gc-h">Dados do Contato</div>
    <div class="gc-field"><small>Nome Completo</small>${esc(N.cli.name)}</div>
    <div class="gc-field"><small>E-mail de Notificação</small>${esc(N.cli.email)}</div>
    <div class="gc-field"><small>WhatsApp</small>${esc(N.cli.phone)}</div>
    <button class="gc-btn" tabindex="-1">Confirmar Reserva no Calendário</button>`;

  if (!await sleep(1600, my)) return false;
  const btn = body.querySelector('.gc-btn');
  if (!await tapEl(btn, my)) return false;
  btn.classList.add('pressed');
  hideTouch();

  if (!await sleep(500, my)) return false;
  body.innerHTML = `<div class="gc-ok"><div class="ck">${ic('check')}</div><h4>Reserva Confirmada com Sucesso</h4><p>Convite e link enviados para ${esc(N.cli.email)}</p></div>${calSum(c)}`;
  log(`calendar.booking → ${wd(pd).toLowerCase()} ${pd}/10 ${pt} reservado com Google Meet ✓`);

  if (!await sleep(1900, my)) return false;
  g.classList.remove('open');
  g.setAttribute('aria-hidden', 'true');
  return sleep(600, my);
}

// Processador de Eventos da Simulação
async function handle(ev, my) {
  if (ev.in) {
    const t = ch === 'ig' && ev.ig ? ev.ig : ev.in;
    addMsg('me', rich(t));
    setStatus('run', 'IA processando');
    return sleep(700, my);
  }
  if (ev.photo) {
    addMsg('me', `<div class="photo">${ic('image')} ${typeof ev.photo === 'string' ? ev.photo : 'anexo_foto.jpg'}</div>`);
    setStatus('run', 'IA processando');
    return sleep(700, my);
  }
  if (ev.node) {
    setNode(ev.node);
    setStatus('run', 'IA processando');
    if (ev.log) log(ev.log);
    if (ev.ctx) setCtx(ev.ctx);
    return sleep(ev.d || 1100, my);
  }
  if (ev.bot) {
    const t0 = clock;
    if (!await botWait(my, Math.min(800 + ev.bot.length * 20, 3200), 450)) return false;
    stats.botT.push(clock - t0 + 0.4);
    addMsg('ai', rich(ev.bot));
    setStatus('wait', 'Aguardando cliente');
    return sleep(900, my);
  }
  if (ev.card) {
    if (!await botWait(my, 700, 0)) return false;
    card(ev.card);
    setStatus('wait', 'Aguardando cliente');
    return sleep(1300, my);
  }
  if (ev.cal) return runCal(ev.cal, my);
  if (ev.receipt) {
    addReceipt();
    setStatus('run', 'IA processando');
    return sleep(800, my);
  }
  if (ev.tap) {
    const btn = [...feed.querySelectorAll('.card .opt')].reverse().find(b => b.textContent === ev.tap);
    if (btn) {
      if (!await tapEl(btn, my)) return false;
      btn.classList.add('sel');
    }
    hideTouch();
    addMsg('me', esc(ev.tap));
    setStatus('run', 'IA processando');
    return sleep(600, my);
  }
  return true;
}

async function run(script, my, free) {
  for (const ev of script) {
    if (my !== runId) return;
    const ok = await handle(ev, my);
    if (ok === false) return;
  }
  if (my !== runId) return;
  finishFlow();
  setStatus('done', free ? 'Resposta enviada' : 'Atendimento concluído');
  enableInput();
}

function enableInput() {
  const inp = $('inp');
  inp.disabled = false;
  inp.placeholder = 'Digite sua pergunta para testar o agente…';
  if (!feed.querySelector('.sugg')) {
    const s = document.createElement('div');
    s.className = 'sugg';
    s.innerHTML = (NICHES[cur].chips || []).map(c => `<button type="button">${esc(c)}</button>`).join('');
    s.querySelectorAll('button').forEach(b => b.onclick = () => ask(b.textContent));
    feed.appendChild(s);
    scroll();
  }
}

function ask(text) {
  if (!text.trim()) return;
  const s = feed.querySelector('.sugg');
  if (s) s.remove();

  const N = NICHES[cur];
  const t = norm(text);
  const botMatch = /\b(robo|bot|chatbot|ia|inteligencia artificial|maquina|humano|atendente real)\b/.test(t);

  const f = botMatch ? {
    tag: 'pergunta_sobre_atendente',
    a: `Sou o(a) ${N.who}, assistente digital de ${N.biz} 🙂 Consigo tirar dúvidas sobre nossos serviços, agendamentos e orçamentos. Se desejar atendimento humano, basta me avisar que chamo a equipe!`
  } : (N.faq || []).find(q => q.k.some(k => t.includes(k)));

  const my = ++runId;
  paused = false;
  syncPause();
  $('inp').disabled = true;
  $('inp').value = '';
  resetFlowStates();
  log('── nova mensagem recebida do usuário ──', 'sep');

  const sc = [{ in: text }, { node: 'receive', log: 'message.received · canal={ch}' }];
  if (f) {
    sc.push(
      { node: 'intent', log: `intent.classify → ${f.tag} (0.97)` },
      { node: 'kb', log: `kb.search → ${f.tag} ✓`, ctx: { 'Última Consulta': f.tag } },
      { bot: f.a }
    );
  } else {
    sc.push(
      { node: 'intent', log: 'intent.classify → fora_da_base (0.42)' },
      { node: 'handoff', log: 'handoff.create → chamado transferido à equipe humana ✓', ctx: { 'Status Atendimento': 'Transferido para Humano' } },
      { bot: 'Excelente pergunta! Como essa questão exige uma análise específica, acabei de notificar a nossa equipe humana e em instantes um especialista continuará com você por aqui, tá bom?' }
    );
  }

  run(sc, my, true);
}

function start() {
  const my = ++runId;
  paused = false;
  syncPause();
  clock = 0;
  elapsed = 0;
  lastMsgAt = -1e9;
  stats = { msg: 0, act: 0, botT: [] };
  renderStats();

  $('gcal').classList.remove('open');
  $('gcal').innerHTML = '';
  hideTouch();

  const N = NICHES[cur];
  feed.innerHTML = `<div class="day">${ch === 'wa' ? 'HOJE' : 'Hoje ' + fmtClock()}</div>`;
  $('screen').className = 'screen ' + ch;
  $('bizName').innerHTML = esc(N.biz) + (ch === 'ig' ? ' <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#3897F0" d="M12 2l2.4 2.1 3.2-.3.9 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.9 3.1-3.2-.3L12 22l-2.4-2.1-3.2.3-.9-3.1-2.8-1.6 1.2-3-1.2-3 2.8-1.6.9-3.1 3.2.3z"/><path d="M8 12l3 3 5-6" stroke="#fff" stroke-width="2" fill="none"/></svg>' : '');
  $('av').textContent = N.ini;
  $('av').style.background = N.color;
  typing(false);

  $('nicheTitle').textContent = N.biz;
  $('agentLbl').textContent = N.agent;
  $('caps').innerHTML = N.caps.map(c => `<span class="cap">${esc(c)}</span>`).join('');
  $('kv').innerHTML = '<p class="empty" style="color:var(--muted);font-size:13px;margin:0;">Os dados que a IA identificar na conversa aparecem aqui.</p>';
  $('log').innerHTML = '';
  $('logCh').textContent = CH[ch].api;

  log(`agent.boot → ${N.who} · nicho=${cur}`);
  const inp = $('inp');
  inp.disabled = true;
  inp.placeholder = 'Aguarde a demonstração inicial…';

  renderFlow();
  renderSeal();
  setStatus('wait', 'Iniciando demonstração');

  sleep(600, my).then(ok => {
    if (ok) run(N.script, my, false);
  });
}

function syncPause() {
  $('pause').querySelector('span').textContent = paused ? 'Continuar' : 'Pausar';
  $('pause').querySelector('svg').innerHTML = paused ? '<path d="M7 5l12 7-12 7z"/>' : '<path d="M9 5v14M15 5v14"/>';
}

// Selo de Preço e Simulador de Renda
const brl = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const TIERS = [
  { k: 'niche' },
  { k: 't1', name: 'Essencial', impl: 2500, sup: 800 },
  { k: 't2', name: 'Intermediário', impl: 3500, sup: 1000 },
  { k: 't3', name: 'Avançado', impl: 4200, sup: 1200 },
  { k: 't4', name: 'Completo', impl: 5000, sup: 1500 }
];
const EXTRAS = [
  { k: 'site', name: 'Landing Page de Alta Conversão', v: 1800, once: true },
  { k: 'traf', name: 'Gestão de Tráfego Pago (Meta/Google Ads)', v: 1500 },
  { k: 'social', name: 'Social Media & Criativos Semanais', v: 800 },
  { k: 'seo', name: 'Google Meu Negócio + SEO Local', v: 1250, once: true }
];

let simTier = 'niche';
const simEx = {};

function renderSeal() {
  const P = NICHES[cur].price || { impl: 3500, sup: 1000, lvl: 3, name: 'Intermediária', why: ['Automação WhatsApp', 'Pix Integrado'] };
  $('psVal').innerHTML = `<span class="nw"><em>${brl(P.impl)}</em><small>implantação</small></span><span class="nw"><em>+ ${brl(P.sup)}</em><small>/mês de suporte</small></span>`;
  $('psCx').innerHTML = `<span>Complexidade</span><span class="dots">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= P.lvl ? 'on' : ''}"></i>`).join('')}</span><b>${P.name}</b>`;
  $('psWhy').innerHTML = (P.why || []).map(w => `<span>${esc(w)}</span>`).join('');
  renderTiers();
  calc();
}

function tierVal(t) {
  return t.k === 'niche' ? {
    name: 'Nicho Atual: ' + NICHES[cur].label,
    impl: NICHES[cur].price?.impl || 3500,
    sup: NICHES[cur].price?.sup || 1000
  } : t;
}

function renderTiers() {
  $('tiers').innerHTML = TIERS.map(t => {
    const v = tierVal(t);
    return `<button class="tier" type="button" data-k="${t.k}" aria-pressed="${simTier === t.k}"><b>${esc(v.name)}</b><span>${brl(v.impl)} + ${brl(v.sup)}/mês</span></button>`;
  }).join('');

  $('tiers').querySelectorAll('.tier').forEach(b => b.onclick = () => {
    simTier = b.dataset.k;
    renderTiers();
    calc();
  });
}

function renderExtras() {
  $('extras').innerHTML = EXTRAS.map(e => `
    <label class="ex" for="ex-${e.k}">
      <input type="checkbox" id="ex-${e.k}" ${simEx[e.k] ? 'checked' : ''}>
      <b>${e.name}</b>
      <span>${brl(e.v)}${e.once ? ' único' : '/mês'}</span>
    </label>
  `).join('');

  EXTRAS.forEach(e => {
    const el = $('ex-' + e.k);
    if (el) {
      el.onchange = ev => {
        simEx[e.k] = ev.target.checked;
        syncAll();
        calc();
      };
    }
  });
  syncAll();
}

function syncAll() {
  $('allEx').textContent = EXTRAS.every(e => simEx[e.k]) ? 'Desmarcar todos' : 'Marcar todos';
}

function calc() {
  const X = +$('qty').value;
  const t = tierVal(TIERS.find(x => x.k === simTier) || TIERS[0]);
  const exOnce = EXTRAS.filter(e => simEx[e.k] && e.once);
  const exMon = EXTRAS.filter(e => simEx[e.k] && !e.once);

  const once = t.impl + exOnce.reduce((a, e) => a + e.v, 0);
  const mon = t.sup + exMon.reduce((a, e) => a + e.v, 0);

  const L = X === 1 ? 'cliente' : 'clientes';
  const impY = 12 * X * once;
  const supY = 78 * X * mon;
  const tot = impY + supY;

  $('qN').textContent = X;
  $('cN').textContent = `${X} ${L}`;
  $('xLbl').textContent = `Fechando ${X} ${L} por mês`;

  const line = (a, b, c) => `<div class="rl${c ? ' tot' : ''}"><span>${a}</span><span>${b}</span></div>`;
  const pair = (a, b) => `<span class="pr"><span class="nw">${brl(a)}</span><span class="nw">+ ${brl(b)}</span></span>`;

  $('perCli').innerHTML = line('Implantação do agente', brl(t.impl))
    + exOnce.map(e => line(e.name, brl(e.v))).join('')
    + line('Suporte mensal do agente', brl(t.sup) + '/mês')
    + exMon.map(e => line(e.name, brl(e.v) + '/mês')).join('')
    + (exOnce.length ? line('Implantação total', brl(once)) : '')
    + (exMon.length ? line('Mensalidade total', brl(mon) + '/mês') : '')
    + line('1º mês <small>setup + suporte</small>', pair(once, mon), 1)
    + line(`12 mensalidades <small>12 × ${brl(mon)}</small>`, brl(12 * mon))
    + line('LTV 12 meses <small>setup + 12 mensalidades</small>', brl(once + 12 * mon), 1);

  $('perX').innerHTML = line(`Implantações por mês <small>${X} × ${brl(once)}</small>`, brl(X * once))
    + line(`Implantações no ano <small>12 × ${brl(X * once)}</small>`, brl(impY))
    + line(`Suporte no 1º mês <small>${X} ${L} × ${brl(mon)}</small>`, brl(X * mon) + '/mês')
    + line(`Suporte no 12º mês <small>${12 * X} clientes × ${brl(mon)}</small>`, brl(12 * X * mon) + '/mês')
    + line(`Suporte somado em 12 meses`, brl(supY))
    + line('Total bruto em 12 meses', brl(tot), 1);

  $('cumTot').textContent = brl(12 * X * mon) + '/mês';
  $('cumN').textContent = 12 * X;

  $('h1').textContent = brl(X * once);
  $('h1s').textContent = `${X} × ${brl(once)} · ${brl(impY)} em 1 ano`;
  $('h2').textContent = '+ ' + brl(X * mon) + '/mês';
  $('h2s').textContent = `aceleração contínua · atinge ${brl(12 * X * mon)}/mês no 12º mês`;
  $('h3').textContent = brl(tot);
  $('h3s').textContent = `${brl(impY)} de implantações + ${brl(supY)} de suporte`;

  const months = [...Array(12)].map((_, i) => ({ o: X * once, r: (i + 1) * X * mon }));
  const max = Math.max(...months.map(m => m.o + m.r));

  $('bars').innerHTML = months.map((m, i) => {
    const hr = (m.r / max) * 100;
    const ho = (m.o / max) * 100;
    return `<div class="bar" style="--h:${hr + ho}%" title="Mês ${i + 1}: ${brl(m.o)} de implantações + ${brl(m.r)} de suporte">
      ${i === 11 || i === 0 ? `<em>${brl(m.o)}<br>+ ${brl(m.r)}</em>` : ''}
      <i class="o" style="height:${ho}%"></i>
      <i class="r" style="height:${hr}%"></i>
    </div>`;
  }).join('');

  $('months').innerHTML = months.map((_, i) => `<span>M${i + 1}</span>`).join('');
}

// Inicialização dos Controles
function initControls() {
  $('qty').oninput = calc;
  $('allEx').onclick = () => {
    const all = !EXTRAS.every(e => simEx[e.k]);
    EXTRAS.forEach(e => simEx[e.k] = all);
    renderExtras();
    calc();
  };
  $('psBtn').onclick = () => {
    simTier = 'niche';
    renderTiers();
    calc();
    $('simulador').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  renderExtras();

  // Seletor de Tema
  document.querySelectorAll('[data-th]').forEach(b => {
    b.onclick = () => {
      const theme = b.dataset.th;
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('[data-th]').forEach(x => x.setAttribute('aria-pressed', x === b));
      try { localStorage.setItem('agentlab-theme', theme); } catch (e) {}
    };
  });

  // Seletor de Canal (WhatsApp / Instagram)
  document.querySelectorAll('.seg button[data-ch]').forEach(b => {
    b.onclick = () => {
      ch = b.dataset.ch;
      document.querySelectorAll('.seg button[data-ch]').forEach(x => x.setAttribute('aria-pressed', x === b));
      start();
    };
  });

  // Botões de Controle de Fluxo
  $('pause').onclick = () => { paused = !paused; syncPause(); };
  $('speed').onclick = () => {
    speed = speed === 1 ? 2 : speed === 2 ? 3 : 1;
    $('speed').textContent = speed + '×';
  };
  $('restart').onclick = start;
  $('reset2').onclick = start;
  $('form').onsubmit = e => {
    e.preventDefault();
    if (!$('inp').disabled) ask($('inp').value);
  };

  // Botões de Abertura de Modais
  $('btnCreateAgent').onclick = AgentStudio.openCreateModal;
  $('btnCloseStudio').onclick = AgentStudio.closeCreateModal;
  $('btnCancelStudio').onclick = AgentStudio.closeCreateModal;

  $('btnExportAgent').onclick = () => AgentStudio.openExportModal(NICHES[cur]);
  $('btnCloseExport').onclick = AgentStudio.closeExportModal;

  // Formulário de Criação de Agente
  $('formCreateAgent').onsubmit = e => {
    e.preventDefault();
    const newAgent = AgentStudio.saveCustomAgentFromForm(e.target);
    NICHES[newAgent.id] = newAgent;
    cur = newAgent.id;
    renderNicheRail();
    AgentStudio.closeCreateModal();
    start();
  };

  // Abas de Exportação
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      document.getElementById(targetId).style.display = 'block';
    };
  });

  // Botões de Cópia e Download
  $('btnCopyPrompt').onclick = e => AgentStudio.copyTextFromInput('export-prompt', e.target);
  $('btnCopyN8N').onclick = e => AgentStudio.copyTextFromInput('export-n8n', e.target);
  $('btnCopyJson').onclick = e => AgentStudio.copyTextFromInput('export-json', e.target);

  $('btnDownloadN8N').onclick = () => {
    const text = $('export-n8n').value;
    AgentStudio.downloadFile(`workflow_n8n_${cur}.json`, text);
  };

  // GUIA INTERATIVO PASSO A PASSO
  if ($('btnOpenGuide')) $('btnOpenGuide').onclick = openGuide;
  if ($('btnCloseGuide')) $('btnCloseGuide').onclick = closeGuide;
  if ($('btnSkipGuide')) $('btnSkipGuide').onclick = closeGuide;

  if ($('btnPrevGuide')) {
    $('btnPrevGuide').onclick = () => {
      if (guideCurrentStep > 1) goToGuideStep(guideCurrentStep - 1);
    };
  }

  if ($('btnNextGuide')) {
    $('btnNextGuide').onclick = () => {
      if (guideCurrentStep < 4) {
        goToGuideStep(guideCurrentStep + 1);
      } else {
        closeGuide();
      }
    };
  }

  document.querySelectorAll('.guide-step-btn').forEach(btn => {
    btn.onclick = () => {
      const step = parseInt(btn.dataset.step, 10);
      if (step) goToGuideStep(step);
    };
  });
}

// Lógica de Controle do Guia Interativo
let guideCurrentStep = 1;

function openGuide() {
  const modal = $('guide-modal');
  if (modal) {
    guideCurrentStep = 1;
    goToGuideStep(1);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeGuide() {
  const modal = $('guide-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function goToGuideStep(step) {
  guideCurrentStep = step;

  // Atualizar abas
  document.querySelectorAll('.guide-step-btn').forEach(b => {
    b.classList.remove('active');
    if (parseInt(b.dataset.step, 10) === step) {
      b.classList.add('active');
    }
  });

  // Alternar painéis
  for (let i = 1; i <= 4; i++) {
    const pane = $('guide-pane-' + i);
    if (pane) pane.style.display = i === step ? 'flex' : 'none';
  }

  // Atualizar botões de navegação
  const btnPrev = $('btnPrevGuide');
  const btnNext = $('btnNextGuide');

  if (btnPrev) btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
  if (btnNext) {
    btnNext.textContent = step === 4 ? 'Concluir Tutorial ✨' : 'Próximo Passo →';
  }
}

// Ações Rápidas Executadas a Partir do Guia
window.selectNicheFromGuide = function(k) {
  if (NICHES[k]) {
    cur = k;
    $('niches').querySelectorAll('.niche').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === cur));
    closeGuide();
    start();
  }
};

window.switchChannelFromGuide = function(channel) {
  ch = channel;
  document.querySelectorAll('.seg button[data-ch]').forEach(x => x.setAttribute('aria-pressed', x.dataset.ch === ch));
  closeGuide();
  start();
};

window.changeSpeedFromGuide = function() {
  speed = speed === 1 ? 2 : speed === 2 ? 3 : 1;
  $('speed').textContent = speed + '×';
  closeGuide();
};

window.goToSimulatorFromGuide = function() {
  closeGuide();
  $('simulador').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.openExportFromGuide = function() {
  closeGuide();
  AgentStudio.openExportModal(NICHES[cur]);
};

function renderNicheRail() {
  const container = $('niches');
  container.innerHTML = Object.entries(NICHES).map(([k, v]) => `
    <button class="niche" data-k="${k}" aria-pressed="${k === cur}">
      <span class="ni">${ic(v.icon)}</span>${esc(v.label)}
    </button>
  `).join('');

  container.querySelectorAll('.niche').forEach(b => {
    b.onclick = () => {
      cur = b.dataset.k;
      container.querySelectorAll('.niche').forEach(x => x.setAttribute('aria-pressed', x === b));
      try { localStorage.setItem('agentlab-niche', cur); } catch (e) {}
      start();
    };
  });
}

// Boot Inicial
window.addEventListener('DOMContentLoaded', () => {
  renderNicheRail();
  initControls();

  // Restaurar tema
  try {
    const savedTheme = localStorage.getItem('agentlab-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('[data-th]').forEach(b => b.setAttribute('aria-pressed', b.dataset.th === savedTheme));
  } catch (e) {}

  start();
});

