/**
 * Estúdio de Criação e Exportação de Agentes - AgentLab Pro
 * Permite criar novos agentes personalizados, testá-los na hora e exportar para n8n, Typebot e Prompt.
 */

const AgentStudio = (function() {
  function openCreateModal() {
    const modal = document.getElementById('studio-modal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCreateModal() {
    const modal = document.getElementById('studio-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function openExportModal(agent) {
    const modal = document.getElementById('export-modal');
    if (!modal) return;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const promptText = `Você é ${agent.who || 'Assistente Virtual'}, atendente oficial de ${agent.biz || 'Minha Empresa'}.
Nicho: ${agent.label || 'Geral'}.
Objetivo: Atender clientes no WhatsApp/Instagram com agilidade, cordialidade e conduzir para agendamento ou fechamento via Pix.

CAPACIDADES:
- ${(agent.caps || ['Atendimento', 'Agendamento', 'Tira-dúvidas']).join('\n- ')}

DIRETRIZES DE ATENDIMENTO:
1. Responda em no máximo 2 ou 3 parágrafos curtos, ideais para mensagens de celular.
2. Seja proativo e sempre termine suas mensagens com uma pergunta clara para avançar a conversa.
3. Se o cliente solicitar agendamento, envie o link do calendário ou os horários disponíveis.
4. Para fechamentos, solicite dados básicos e envie a chave Pix oficial do negócio.
5. Softwares de IA não substituem diagnósticos médicos ou pareceres jurídicos formais.`;

    const n8nPayload = {
      name: `AgentLab - ${agent.biz}`,
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
            text: promptText
          },
          name: "Agente IA (OpenAI / Gemini)",
          type: "@n8n/n8n-nodes-langchain.agent",
          typeVersion: 1.6,
          position: [480, 300]
        },
        {
          parameters: {
            url: "https://calendar.google.com/api",
            sendHeaders: true
          },
          name: "Integração Google Agenda",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.1,
          position: [700, 200]
        },
        {
          parameters: {
            url: "https://api.banco.com/v2/pix",
            sendHeaders: true
          },
          name: "Emissão de Pix EMV",
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 4.1,
          position: [700, 400]
        }
      ],
      connections: {}
    };

    document.getElementById('export-prompt').value = promptText;
    document.getElementById('export-n8n').value = JSON.stringify(n8nPayload, null, 2);
    document.getElementById('export-json').value = JSON.stringify(agent, null, 2);
  }

  function closeExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function copyTextFromInput(inputId, btnEl) {
    const el = document.getElementById(inputId);
    if (!el) return;
    navigator.clipboard.writeText(el.value).then(() => {
      const originalText = btnEl.textContent;
      btnEl.textContent = 'Copiado! ✓';
      btnEl.classList.add('copied');
      setTimeout(() => {
        btnEl.textContent = originalText;
        btnEl.classList.remove('copied');
      }, 2000);
    });
  }

  function downloadFile(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function saveCustomAgentFromForm(formEl) {
    const biz = formEl.biz.value.trim() || 'Minha Empresa';
    const who = formEl.who.value.trim() || 'Alex';
    const label = formEl.label.value.trim() || 'Personalizado';
    const color = formEl.color.value || '#2563EB';
    const impl = parseInt(formEl.impl.value || '3500', 10);
    const sup = parseInt(formEl.sup.value || '1000', 10);
    const firstMsg = formEl.firstMsg.value.trim() || 'Olá! Gostaria de mais informações sobre os serviços de vocês.';
    const botMsg = formEl.botMsg.value.trim() || `Olá! Sou ${who}, da ${biz}. Como posso te ajudar hoje?`;

    const id = 'custom_' + Date.now().toString(36);
    const ini = biz.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'IA';

    const customAgent = {
      id,
      label,
      icon: 'spark',
      biz,
      ini,
      color,
      who,
      agent: `${who} · atendimento inteligente`,
      start: 14 * 3600 + 20 * 60,
      cli: { name: 'Cliente Demonstração', email: 'cliente@email.com', phone: '(11) 99988-7766' },
      caps: ['Triagem com IA', 'Agenda Google', 'Pix Oficial', 'CRM'],
      price: {
        impl,
        sup,
        lvl: 3,
        name: 'Intermediária',
        why: ['Fluxo personalizado', 'Google Agenda', 'Pix copia e cola']
      },
      flow: [
        { id: 'receive', icon: 'msg', t: 'Mensagem recebida', d: 'Cliente inicia conversa no {canal}', tool: '{api}' },
        { id: 'intent', icon: 'spark', t: 'Classificação de intenção', d: 'Identifica necessidade e urgência', tool: 'Classificador IA' },
        { id: 'kb', icon: 'book', t: 'Base de conhecimento', d: 'Consulta dados do negócio', tool: 'Base da Empresa' },
        { id: 'agenda', icon: 'calsearch', t: 'Envia a agenda', d: 'Cliente seleciona dia e horário', tool: 'Google Agenda' },
        { id: 'book', icon: 'calcheck', t: 'Confirmação', d: 'Registra evento e link do Meet', tool: 'Google Agenda' },
        { id: 'payment', icon: 'card', t: 'Pix e comprovante', d: 'Gera Pix dinâmico e valida comprovante', tool: 'Pix Bacen' },
        { id: 'done', icon: 'check', t: 'Atendimento concluído', d: 'Cliente confirmado com orientações', tool: 'CRM' }
      ],
      script: [
        { in: firstMsg, ig: firstMsg },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → informacoes_gerais (0.95)', ctx: { 'Interesse': 'Atendimento Comercial', 'Origem': 'WhatsApp' } },
        { bot: botMsg },
        { in: 'Vocês têm horários disponíveis para esta semana?' },
        { node: 'agenda', log: 'calendar.booking_link → agenda aberta' },
        { bot: `Temos sim! Segue nossa agenda online para você escolher o melhor dia e horário 👇` },
        { cal: { title: `Atendimento Inicial · ${biz}`, who: who, dur: '30 min', place: 'Google Meet / Presencial', days: { 20: ['10:00', '15:00'], 21: ['14:00', '16:30'] }, pick: [20, '15:00'] } },
        { node: 'book', log: 'calendar.webhook → agendamento confirmado ter 20/10 15:00', ctx: { 'Agendamento': 'Ter 20/10 · 15:00' } },
        { bot: 'Excelente! Seu horário foi reservado com sucesso ✅ Te aguardamos!' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['preco', 'valor', 'quanto'], tag: 'preco', a: `Nossos planos e valores variam conforme o projeto. Entre em contato para um orçamento personalizado!` },
        { k: ['horario', 'onde', 'endereco'], tag: 'local', a: `Atendemos de segunda a sexta, das 9h às 18h.` }
      ],
      chips: ['Quais os planos e preços?', 'Onde vocês ficam?', 'Como agendar?']
    };

    return customAgent;
  }

  return {
    openCreateModal,
    closeCreateModal,
    openExportModal,
    closeExportModal,
    copyTextFromInput,
    downloadFile,
    saveCustomAgentFromForm
  };
})();

