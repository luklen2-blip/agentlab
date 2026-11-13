# Template Padrão de Nichos & Demonstração Comercial para Clientes (Padrão Luciano)

> **REGRA DE OURO:** Qualquer agente de IA apresentado a um cliente final (médico, advogado, corretor, comerciante) **NUNCA deve exibir dados de faturamento da agência**, margens de lucro, tabelas de "quanto você fatura" ou preços de implantação/suporte. A demonstração deve ser **100% voltada aos ganhos e ao fluxo de atendimento do próprio cliente**.

---

## 🏛️ Arquitetura dos 2 Modelos de Referência

| Componente | Modelo 1: Dr. Sérgio (`psico`) | Modelo 2: Rafael Silva (`rafael`) | Novo Nicho (Seu Futuro Cliente) |
| :--- | :--- | :--- | :--- |
| **Segmento** | Psicologia Clínica / Saúde Mental | Imobiliário de Alto Padrão | Qualquer nicho comercial |
| **Atendente IA** | Sofia (Acolhimento Humanizado) | Sofia IA (Concierge Imobiliária) | Atendente com nome empático |
| **Credenciamento** | CRP 06/148920 • CFP 011/2018 | CRECI/SP 248.910-F • COFECI | Registro de classe profissional (se houver) |
| **Qualificação** | Triagem de ansiedade e modalidade | Perfil financeiro (R$ 1.5M - 2.5M) | Filtro de orçamento / necessidade do lead |
| **Apresentação** | Explicação da sessão e sigilo | Cards interativos de imóveis | Cards de serviços, produtos ou cardápio |
| **Agendamento** | Google Meet / Consultório presencial | Visita presencial VIP / Tour Virtual | Google Calendar com horários disponíveis |
| **Cobrança** | PIX Oficial da sessão (R$ 180) | Sinal de reserva do imóvel (R$ 500 a R$ 2.500) | PIX Bacen EMV oficial com CRC-16 e QR Code |
| **CRM / Notificação** | Registro de prontuário e lembrete | Envio da ficha e comprovante ao WhatsApp | Disparo ao WhatsApp pessoal do profissional |
| **Anti-No-Show** | Régua 24h e 2h antes da consulta | Lembrete de confirmação com link do imóvel | Lembretes automáticos com botões interativos |

---

## 🚀 Como Criar um Novo Nicho no AgentLab Studio

### 1. Adicionar o Bloco em `data-niches.js` (e `public/js/data-niches.js`):

```javascript
// Exemplo: NOVO NICHO
seu_nicho: {
  price: { impl: 3800, sup: 1100, lvl: 3, name: 'Intermediária', why: ['Automação WhatsApp', 'Pix Integrado', 'Agenda'] },
  label: 'Nome do Nicho',
  icon: 'star', // ícone SVG do AgentLab
  biz: 'Nome da Empresa / Profissional',
  ini: 'NP', // Iniciais para o avatar
  color: '#2563EB', // Cor temática da marca
  who: 'Sofia', // Nome do atendente
  agent: 'Sofia · recepção e vendas',
  start: 14 * 3600 + 20 * 60,
  cli: { name: 'Nome do Cliente Exemplo', email: 'cliente@email.com', phone: '(11) 98888-7777', bank: 'Nubank', bkc: '#820AD1' },
  caps: ['Qualificação de clientes', 'Apresentação de serviços', 'Agendamento automático', 'PIX Oficial'],
  
  // Nós do fluxo n8n que acendem na tela
  flow: [
    n('receive', 'msg', 'Mensagem recebida', 'Lead chama no {canal}', '{api}'),
    n('intent', 'spark', 'Entende o que a pessoa precisa', 'Classificador de intenções', 'Classificador'),
    n('qualify', 'filter', 'Qualificação do cliente', 'Filtro de perfil e necessidade', 'Roteiro'),
    n('search', 'star', 'Catálogo de serviços', 'Apresenta as melhores opções', 'Portfólio'),
    AG('Cliente escolhe o melhor dia e horário na agenda'), BK(),
    PAY('Pagamento ou sinal via PIX Oficial'),
    n('crm', 'db', 'Registro no CRM', 'Notificação e ficha completa enviada', 'CRM'),
    n('done', 'check', 'Atendimento concluído', 'Confirmação e lembrete anti-falta ativo', 'Handoff')
  ],

  // Roteiro do WhatsApp (mensagens, cards, agenda e PIX)
  script: [
    { in: 'Olá, gostaria de saber como funciona o atendimento e valores' },
    { node: 'receive', log: 'message.received · canal={ch}' },
    { node: 'intent', log: 'intent.classify → servico_principal (0.98)' },
    { bot: 'Olá! Sou a Sofia, assistente virtual da [Nome da Empresa] ✨' },
    { bot: 'Seja muito bem-vindo(a)! Como posso te ajudar hoje?' },
    // ...
  ],

  faq: [
    { k: ['valor', 'preco'], tag: 'preco', a: 'Informações claras sobre valores e formas de pagamento.' }
  ],
  chips: ['Quais os horários disponíveis?', 'Valores e Formas de Pagamento', 'Onde fica localizado?']
}
```

---

## 🔒 Modo Apresentação do Cliente (Sem Ganhos de Desenvolvedor)

Ao enviar o link para o cliente final, utilize o parâmetro `&client=1` ou acesse pelo nome do nicho:

* **Link Nuvem (Render):** `https://agentlab-studio.onrender.com/?niche=seu_nicho&client=1`
* **Link Local:** `http://localhost:3055/?niche=seu_nicho&client=1`

### O que o sistema faz automaticamente no Modo Cliente:
1. Oculta o selo `#seal` (*Valor Recomendado deste Agente*);
2. Oculta a seção `#simulador` (*Quanto você fatura implementando agentes de IA*);
3. Oculta botões de exportação de JSON;
4. Exibe o card com os **benefícios reais para o negócio daquele cliente** (mais vendas, zero faltas, mais tempo livre).

---

## 🖥️ Painel Standalone Complementar (24/7 Cloud Ready)

Para clientes que contratam o sistema independente (como o Dr. Sérgio e o Rafael):
1. **Porta dedicada:** (ex: 3000, 3080, etc.);
2. **Endpoint obrigatório:** `/api/health` retornando 200 OK com uptime e versão;
3. **Páginas legais:** `/termos` e `/privacidade` (LGPD e Código Civil);
4. **PIX oficial:** `pix_utils.js` gerando EMV com CRC-16 CCITT oficial do Bacen;
5. **Launcher .bat em janela única:** Executa testes (`node tests/run_all.js`), abre o navegador (`start "" http://localhost:PORT`) e mantém `node server.js` rodando em primeiro plano;
6. **Deploy limpo:** Script `gerar-pacote-deploy.ps1` criando `.zip` limpo na Área de Trabalho para Render/Railway.
