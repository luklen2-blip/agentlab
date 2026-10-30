/**
 * Banco de Dados de Nichos e Roteiros de Atendimento - AgentLab Pro
 * Inclui os 8 nichos fundamentais + 4 nichos brasileiros de alta conversão.
 */

const NICHES_DATA = (function() {
  const n = (id, icon, t, d, tool) => ({ id, icon, t, d, tool });
  const AG = (desc) => n('agenda', 'calsearch', 'Envia a agenda', desc || 'Cliente escolhe dia e horário no Google Agenda', 'Google Agenda');
  const BK = () => n('book', 'calcheck', 'Confirmação do agendamento', 'Recebe o evento criado e confirma na conversa', 'Google Agenda');
  const PAY = (t) => n('payment', 'card', t || 'Pix e comprovante', 'Envia o Pix, lê o comprovante e confere no banco', 'Pix + leitura de comprovante');

  const niches = {
    // 1. ADVOCACIA
    adv: {
      price: { impl: 3800, sup: 1100, lvl: 4, name: 'Avançada', why: ['Triagem com regras da OAB', 'Google Agenda', 'CRM jurídico'] },
      label: 'Advocacia', icon: 'scale', biz: 'Ferraz & Lima Advocacia', ini: 'FL', color: '#1F3A5F', who: 'Júlia', agent: 'Júlia · recepção jurídica', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Marcos Vieira', email: 'marcos.vieira@email.com', phone: '(31) 98812-4471' },
      caps: ['Triagem de casos', 'Agenda de consultas', 'Documentos', 'CRM jurídico'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Cliente chega pelo {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica área do direito e urgência', 'Classificador'),
        n('triage', 'filter', 'Triagem do caso', 'Faz as perguntas certas, sem interrogatório', 'Roteiro jurídico'),
        n('kb', 'book', 'Orienta sem dar parecer', 'Informa o básico dentro das regras da OAB', 'Base do escritório'),
        AG('Cliente escolhe o horário na agenda do advogado'), BK(),
        n('crm', 'db', 'Registro no CRM', 'Cria o contato com o resumo do caso', 'CRM'),
        n('done', 'check', 'Atendimento concluído', 'Advogado recebe o caso pronto', 'Handoff')
      ],
      script: [
        { in: 'Boa tarde. Fui demitido essa semana sem justa causa e até agora nada da rescisão. Vocês conseguem me ajudar?', ig: 'Boa tarde! Vi o post de vocês sobre rescisão. Fui demitido essa semana e ainda não recebi nada, conseguem me ajudar?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → trabalhista/rescisao (0.96)', ctx: { 'Área': 'Direito do Trabalho', 'Assunto': 'Rescisão não paga', 'Urgência': 'Alta' } },
        { bot: 'Boa tarde! Aqui é a Júlia, do Ferraz & Lima Advocacia 🙂' },
        { bot: 'Sinto muito, sei que é um momento delicado. Consigo te orientar sim.' },
        { node: 'triage', log: 'triage.start · roteiro=trabalhista_v3' },
        { bot: 'Me conta só uns detalhes rápidos pra eu passar seu caso pro advogado certo: que dia foi a demissão, você era de carteira assinada e quanto tempo ficou na empresa?' },
        { in: 'Foi na terça, dia 13. Carteira assinada, 4 anos e meio' },
        { node: 'triage', log: 'entities.extract → data, vinculo, tempo_servico', ctx: { 'Desligamento': '13/10/2026', 'Vínculo': 'CLT · 4 anos e 6 meses', 'Contato': 'Qualificado' } },
        { node: 'kb', log: 'kb.search → clt_art477_prazo · guardrail: sem_parecer' },
        { bot: 'Entendi. Pela CLT (art. 477), a empresa tem 10 dias corridos após o término do contrato para pagar as verbas rescisórias.' },
        { bot: 'Se houver atraso injustificado, pode incidir multa equivalente a um salário. O Dr. Ricardo, especialista em Direito do Trabalho, pode analisar a rescisão e o extrato do FGTS com você.' },
        { bot: 'Gostaria de agendar uma consulta inicial com ele? Pode ser online por videochamada.' },
        { in: 'Quero sim, online é ótimo pra mim' },
        { node: 'agenda', log: 'calendar.booking_link → agenda dr_ricardo · consulta 30 min' },
        { bot: 'Perfeito! Vou abrir a agenda oficial do Dr. Ricardo, é só escolher o melhor dia e horário 👇' },
        { cal: { title: 'Consulta Inicial · Direito Trabalhista', who: 'Dr. Ricardo Ferraz', dur: '30 min', place: 'Videochamada (Google Meet)', days: { 19: ['10:00', '15:30', '17:00'], 20: ['09:00', '11:00', '16:00'], 21: ['14:00', '16:30'], 22: ['10:00', '15:00'], 23: ['09:30'] }, pick: [19, '15:30'] } },
        { node: 'book', log: 'calendar.webhook → evento criado seg 19/10 15:30 · Meet gerado ✓', ctx: { 'Consulta': 'Seg 19/10 · 15:30' } },
        { bot: 'Confirmado! Seu horário foi agendado para segunda, 19/10, às 15h30 ✅' },
        { bot: 'O link da sala de reunião foi enviado para o seu e-mail. Se puder, separe os 3 últimos holerites e a carteira de trabalho digital para a consulta.' },
        { node: 'crm', log: 'crm.create_contact → resumo do caso anexado' },
        { in: 'Excelente, muito obrigado Júlia!' },
        { bot: 'Disponha sempre! Qualquer dúvida estou por aqui. Até segunda! 🙏' },
        { node: 'done', log: 'conversation.closed · handoff → Dr. Ricardo' }
      ],
      faq: [
        { k: ['honorario', 'valor', 'preco', 'quanto', 'custa', 'cobra'], tag: 'honorarios', a: 'Os honorários são combinados individualmente após a análise da documentação. Na área trabalhista, em grande parte dos casos atuamos na modalidade de êxito.' },
        { k: ['familia', 'divorcio', 'pensao', 'guarda'], tag: 'area_familia', a: 'Atendemos sim! Quem lidera nossa equipe de Direito de Família é a Dra. Marina. Gostaria de verificar a agenda dela?' },
        { k: ['online', 'presencial', 'escritorio', 'onde', 'endereco'], tag: 'local', a: 'Atendemos online para todo o país e presencialmente em nosso escritório na Av. do Contorno, 6.594, sala 1.402, em Belo Horizonte.' }
      ],
      chips: ['Quanto custam os honorários?', 'Vocês fazem divórcio?', 'Onde fica o escritório?']
    },

    // 2. CLÍNICA DE ESTÉTICA
    est: {
      price: { impl: 3500, sup: 1000, lvl: 3, name: 'Intermediária', why: ['Google Agenda', 'Pix com leitura de comprovante', 'Base clínica'] },
      label: 'Clínica de estética', icon: 'drop', biz: 'Clínica Lumière', ini: 'CL', color: '#9A6B8F', who: 'Lívia', agent: 'Lívia · recepção e vendas', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Ana Paula Souza', email: 'anapaula.souza@email.com', phone: '(31) 99145-2280', bank: 'Banco Aurora', bkc: '#5B2A86' },
      caps: ['Tira-dúvidas', 'Venda de procedimentos', 'Agenda', 'Sinal via Pix'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Cliente inicia a conversa no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica procedimento e momento de compra', 'Classificador'),
        n('kb', 'book', 'Responde dúvidas', 'Procedimento, cuidados e contraindicações', 'Base clínica'),
        n('offer', 'tag', 'Oferta personalizada', 'Monta o valor e a condição do mês', 'Catálogo'),
        AG('Cliente escolhe o horário na agenda da doutora'), BK(), PAY('Sinal via Pix'),
        n('done', 'check', 'Atendimento concluído', 'Cliente confirmada com orientações', 'CRM')
      ],
      script: [
        { in: 'Oi! Quanto tá o botox de vocês?', ig: 'Oi! Vi o reels do botox, quanto tá?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → preco_procedimento (0.93)', ctx: { 'Interesse': 'Toxina botulínica', 'Etapa': 'Pesquisando preço' } },
        { bot: 'Oii, tudo bem? Aqui é a Lívia, da Clínica Lumière ✨' },
        { bot: 'O valor da aplicação varia conforme as regiões desejadas. Você gostaria de tratar testa, glabela (entre as sobrancelhas) ou pés de galinha?' },
        { in: 'Testa e entre as sobrancelhas. Dói muito? Morro de medo de agulha kkk' },
        { node: 'kb', log: 'kb.search → toxina_dor, toxina_duracao', ctx: { 'Áreas': 'Testa + glabela', 'Objeção': 'Medo de agulha' } },
        { bot: 'Pode ficar super tranquila! A agulha utilizada pela Dra. Camila é ultrafina (insulínica) e aplicamos anestésico tópico potente antes do procedimento.' },
        { bot: 'O procedimento dura cerca de 20 minutos. Os resultados iniciam em 3 a 5 dias e a durabilidade é de 4 a 6 meses.' },
        { node: 'offer', log: 'pricing.lookup → 2_areas · campanha_outubro' },
        { bot: 'Para essas duas regiões, nossa condição especial deste mês é:' },
        { card: { type: 'product', title: 'Toxina botulínica · 2 regiões', price: 'R$ 1.290', old: 'R$ 1.490', note: 'Inclui avaliação biométrica prévia e retorno de retoque em 15 dias.' } },
        { bot: 'Gostaria de garantir seu horário com a Dra. Camila?' },
        { in: 'Quero sim! Sábado agora tem horário?' },
        { node: 'agenda', log: 'calendar.booking_link → agenda dra_camila · 60 min' },
        { bot: 'Temos sim! Te enviei a agenda da Dra. Camila, escolha seu melhor horário 👇' },
        { cal: { title: 'Avaliação + Aplicação de Toxina', who: 'Dra. Camila Rocha', dur: '1 hora', place: 'Rua Paraíba, 1.200 · Savassi', days: { 20: ['10:00', '16:00'], 21: ['14:30'], 22: ['09:00', '17:30'], 23: ['11:00'], 24: ['09:30', '11:00'] }, pick: [24, '11:00'] } },
        { node: 'book', log: 'calendar.webhook → sáb 24/10 11:00 · status: aguardando sinal', ctx: { 'Agendamento': 'Sáb 24/10 · 11:00' } },
        { bot: 'Perfeito, sábado às 11h está pré-reservado!' },
        { node: 'payment', log: 'pix.charge_create → R$ 150,00 · expira em 30 min' },
        { bot: 'Para confirmar a reserva e garantir a sala médica, solicitamos um sinal de R$ 150, abatido integralmente no dia do procedimento:' },
        { card: { type: 'pix', amount: 'R$ 150,00', to: 'Clínica Lumière Estética LTDA' } },
        { in: 'Pronto, fiz o Pix! Segue o comprovante' },
        { receipt: true },
        { node: 'payment', log: 'receipt.ocr → R$ 150,00 · favorecido confere ✓' },
        { node: 'payment', log: 'pix.webhook → crédito confirmado no banco ✓', ctx: { 'Sinal': 'Pago · R$ 150' } },
        { bot: 'Comprovante verificado e valor compensado com sucesso! 💜' },
        { bot: 'Seu atendimento está 100% confirmado para sábado, 24/10 às 11h, na Rua Paraíba, 1.200 (Savassi). Evite consumo de álcool 24h antes. Te aguardamos!' },
        { node: 'done', log: 'conversation.closed · lembrete agendado sex 23/10' }
      ],
      faq: [
        { k: ['preenchimento', 'labio', 'boca'], tag: 'preenchimento', a: 'Realizamos preenchimento labial com ácido hialurônico certificado pela Anvisa. O valor inicia em R$ 1.150 por seringa de 1ml.' },
        { k: ['parcel', 'cartao', 'pagamento'], tag: 'pagamento', a: 'Aceitamos Pix, débito e parcelamento em até 6x sem juros no cartão de crédito.' },
        { k: ['gravida', 'gestante', 'amament'], tag: 'contraindicacao', a: 'A toxina botulínica é contraindicada durante gestação e lactação. Para esse período, temos protocolos seguros de hidratação e limpeza profunda.' }
      ],
      chips: ['Fazem preenchimento labial?', 'Parcela em quantas vezes?', 'Gestante pode fazer?']
    },

    // 3. BARBEARIA
    barb: {
      price: { impl: 2500, sup: 800, lvl: 1, name: 'Essencial', why: ['Google Agenda', 'Pix', 'Lembretes automáticos'] },
      label: 'Barbearia', icon: 'scissors', biz: 'Navalha 31 Barbearia', ini: 'N31', color: '#2B2B2B', who: 'Rafa', agent: 'Rafa · agenda e balcão', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Lucas Andrade', email: 'lucas.andrade@email.com', phone: '(31) 98701-3365', bank: 'Banco Serra', bkc: '#C2410C' },
      caps: ['Agenda por barbeiro', 'Venda de produtos', 'Lembretes'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Cliente chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Extrai serviço, dia e período', 'Classificador'),
        n('pro', 'user', 'Escolha do barbeiro', 'Mostra quem tem agenda no dia', 'Equipe'),
        AG('Cliente escolhe o horário na agenda do barbeiro'), BK(),
        n('upsell', 'cart', 'Venda complementar', 'Oferece produto no fechamento', 'Catálogo'),
        PAY(),
        n('reminder', 'bell', 'Lembrete', 'Agenda aviso 2h antes', 'Automação'),
        n('done', 'check', 'Atendimento concluído', 'Horário e venda registrados', 'CRM')
      ],
      script: [
        { in: 'Fala! Tem horário amanhã depois das 18h pra corte e barba?', ig: 'Salve! Curti demais o degradê do último post. Tem horário amanhã depois das 18h? Corte e barba' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → agendamento (0.97) · servico, data, periodo', ctx: { 'Serviço': 'Corte + barba', 'Preferência': 'Segunda · após 18h' } },
        { bot: 'Fala, meu chefe! Aqui é o Rafa, da Navalha 31 💈' },
        { bot: 'Temos sim! Combo corte + barba fica R$ 85 (cerca de 50 min). Prefere ser atendido por qual dos nossos barbeiros?' },
        { node: 'pro', log: 'team.list → barbeiros disponíveis na segunda' },
        { card: { type: 'slots', title: 'Escolha seu profissional', sub: 'Com horários disponíveis amanhã', opts: ['Diego · degradê e tesoura', 'Kaique · barba e navalha', 'Tanto faz (primeiro livre)'] } },
        { tap: 'Diego · degradê e tesoura' },
        { node: 'agenda', log: 'calendar.booking_link → agenda diego · combo 50 min', ctx: { 'Barbeiro': 'Diego' } },
        { bot: 'Boa pedida! Diego manda muito bem. Te mandei a agenda dele, escolhe aí 👇' },
        { cal: { title: 'Corte + Barba com Diego', who: 'Diego · Navalha 31', dur: '50 min', place: 'Rua Fernandes Tourinho, 31 · Savassi', days: { 19: ['18:10', '19:00', '19:50'], 20: ['10:00', '14:30', '18:00'], 21: ['09:00', '17:10'] }, pick: [19, '19:00'] } },
        { node: 'book', log: 'calendar.webhook → seg 19/10 19:00 · #N31-4821 ✓', ctx: { 'Horário': 'Seg 19/10 · 19:00' } },
        { bot: 'Fechou! Segunda-feira, 19h com o Diego ✅' },
        { node: 'upsell', log: 'upsell.suggest → pomada_matte' },
        { bot: 'Chegou lote novo da nossa Pomada Matte efeito seco, a mesma que o Diego usa na finalização. Quer garantir a sua com desconto?' },
        { card: { type: 'product', title: 'Pomada Matte Efeito Seco N31', price: 'R$ 49', note: 'Garante agora via Pix e retira direto na sua cadeira.' } },
        { in: 'Manda o Pix que eu levo!' },
        { node: 'payment', log: 'pix.charge_create → R$ 49,00' },
        { card: { type: 'pix', amount: 'R$ 49,00', to: 'Navalha 31 Barbearia LTDA' } },
        { in: 'Feito, segue o comprovante' },
        { receipt: true },
        { node: 'payment', log: 'receipt.ocr → R$ 49,00 · comprovante validado ✓' },
        { node: 'payment', log: 'pix.webhook → crédito confirmado no banco ✓', ctx: { 'Produto': 'Pomada Matte · Paga' } },
        { bot: 'Compensado! A pomada já está reservada com seu nome. Amanhã é só acertar o combo de R$ 85.' },
        { node: 'reminder', log: 'automation.schedule → lembrete 2h antes' },
        { bot: 'Te mando um aviso 2 horas antes para você não esquecer. Até amanhã! 👊' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['preco', 'valor', 'quanto', 'tabela', 'custa'], tag: 'tabela', a: 'Corte R$ 50, Barba na toalha quente R$ 40, Combo R$ 85, Pezinho R$ 15. Cerveja gelada cortesia da casa!' },
        { k: ['plano', 'assinatura', 'mensal'], tag: 'plano', a: 'Temos o Clube Navalha por R$ 129/mês para cortes ilimitados de segunda a quinta. Quer assinar?' }
      ],
      chips: ['Quanto é só a barba?', 'Como funciona o plano mensal?', 'Onde estacionar?']
    },

    // 4. SALÃO DE BELEZA
    salao: {
      price: { impl: 3200, sup: 900, lvl: 2, name: 'Intermediária', why: ['Análise de foto por IA', 'Regras técnicas do salão', 'Google Agenda'] },
      label: 'Salão de beleza', icon: 'brush', biz: 'Studio Íris', ini: 'SI', color: '#B07A2A', who: 'Carol', agent: 'Carol · recepção do salão', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Camila Torres', email: 'camila.torres@email.com', phone: '(31) 99230-8817' },
      caps: ['Análise por foto', 'Orçamento', 'Agenda'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Cliente inicia a conversa no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica o serviço desejado', 'Classificador'),
        n('vision', 'image', 'Análise da foto', 'Estima comprimento e volume do cabelo', 'Visão computacional'),
        n('diag', 'filter', 'Diagnóstico capilar', 'Cruza química recente com a indicação técnica', 'Regras do salão'),
        n('quote', 'tag', 'Orçamento', 'Calcula o valor pela tabela', 'Tabela de preços'),
        AG('Cliente escolhe o horário na agenda da especialista'), BK(),
        n('done', 'check', 'Atendimento concluído', 'Cliente confirmada', 'CRM')
      ],
      script: [
        { in: 'Oi, queria fazer progressiva. Quanto fica?', ig: 'Oi! Amei o antes e depois da progressiva, quanto fica?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → orcamento_servico (0.95)', ctx: { 'Serviço': 'Progressiva' } },
        { bot: 'Oi, tudo bem? Aqui é a Carol, do Studio Íris 💛' },
        { bot: 'O valor da progressiva varia de acordo com o comprimento e o volume. Consegue me enviar uma foto de costas do seu cabelo solto?' },
        { photo: true },
        { node: 'vision', log: 'vision.analyze → comprimento: abaixo do ombro · volume: alto', ctx: { 'Comprimento': 'Abaixo do ombro', 'Volume': 'Alto' } },
        { bot: 'Recebi a foto! Cabelo lindo 😍 Pela imagem está abaixo do ombro e com bom volume.' },
        { bot: 'Você realizou alguma química recente (coloração, luzes, descoloração)?' },
        { in: 'Fiz luzes há 2 meses' },
        { node: 'diag', log: 'rule.check → luzes < 90 dias → orgânica sem formol + teste de mecha', ctx: { 'Química Recente': 'Luzes (60 dias)' } },
        { bot: 'Nesse caso, a recomendação das nossas especialistas é a Progressiva Orgânica Sem Formol. Ela alinha os fios sem amarelar o loiro e mantém a fibra íntegra.' },
        { bot: 'No dia, iniciamos com teste de mecha para total segurança.' },
        { node: 'quote', log: 'pricing.calc → organica · longo · volume alto' },
        { card: { type: 'product', title: 'Progressiva Orgânica Premium · Fios Longos', price: 'R$ 380', note: 'Teste de mecha incluso · duração aproximada de 3h30.' } },
        { in: 'Gostei! Tem horário para essa quinta-feira?' },
        { node: 'agenda', log: 'calendar.booking_link → agenda bruna · especialista loiras' },
        { bot: 'Temos sim com a Bruna, nossa hair stylist especialista em cabelos com mechas 👇' },
        { cal: { title: 'Progressiva Orgânica com Bruna', who: 'Bruna · especialista em loiros', dur: '3h30', place: 'Rua Pernambuco, 880 · Funcionários', days: { 20: ['13:00'], 21: ['09:00'], 22: ['09:00', '13:30'], 24: ['09:00'] }, pick: [22, '09:00'] } },
        { node: 'book', log: 'calendar.webhook → qui 22/10 09:00 · #SI-1187 ✓', ctx: { 'Agendamento': 'Qui 22/10 · 09:00', 'Valor': 'R$ 380' } },
        { bot: 'Perfeito! Quinta, 22/10 às 09h com a Bruna está confirmadíssimo ✨' },
        { bot: 'Recomendação: venha com o cabelo lavado apenas com shampoo, sem cremes ou óleos finalizadores. Até quinta!' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['unha', 'manicure', 'pedicure', 'gel'], tag: 'manicure', a: 'Mão R$ 35, Pé R$ 40, Combo Pé+Mão R$ 70. Alongamento e esmaltação em gel a partir de R$ 90.' },
        { k: ['loiro', 'mechas', 'luzes'], tag: 'coloracao', a: 'Mechas e morena iluminada iniciam em R$ 450. Realizamos teste de mecha sem custo antes de iniciar o procedimento.' }
      ],
      chips: ['Fazem manicure e gel?', 'Quanto é o corte feminino?', 'Onde fica o salão?']
    },

    // 5. RESTAURANTE & DELIVERY
    rest: {
      price: { impl: 5000, sup: 1500, lvl: 5, name: 'Completa', why: ['Cardápio ligado ao PDV', 'Frete por bairro', 'Pix com comprovante', 'Comanda na cozinha'] },
      label: 'Restaurante', icon: 'fork', biz: 'Brasa Mineira', ini: 'BM', color: '#B5481E', who: 'Gabi', agent: 'Gabi · pedidos e delivery', start: 20 * 3600 + 5 * 60,
      cli: { name: 'Felipe Moreira', email: 'felipe.moreira@email.com', phone: '(31) 99604-1123', bank: 'Banco Horizonte', bkc: '#1E40AF' },
      caps: ['Cardápio no chat', 'Pedido completo', 'Pix', 'Envio para cozinha'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Cliente chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Detecta pedido de delivery', 'Classificador'),
        n('address', 'pin', 'Área de entrega e frete', 'Valida o bairro e calcula a taxa', 'Mapa de entrega'),
        n('menu', 'book', 'Cardápio do dia', 'Mostra só o que está disponível agora', 'Cardápio / PDV'),
        n('cart', 'cart', 'Montagem do pedido', 'Adiciona itens e sugere combo', 'Carrinho'),
        PAY(),
        n('kitchen', 'flame', 'Pedido na cozinha', 'Envia a comanda com previsão', 'KDS cozinha'),
        n('done', 'check', 'Venda concluída', 'Cliente acompanha pela conversa', 'PDV')
      ],
      script: [
        { in: 'Boa noite! Vocês entregam no Vila da Serra?', ig: 'Boa noite! Que costelinha é essa do stories 😍 Entregam no Vila da Serra?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → pedido_delivery (0.91)', ctx: { 'Intenção': 'Delivery', 'Bairro': 'Vila da Serra' } },
        { node: 'address', log: 'geo.check → Vila da Serra · taxa R$ 8 · tempo 40 min' },
        { bot: 'Boa noite! Aqui é a Gabi, do Brasa Mineira 🔥' },
        { bot: 'Entregamos sim no Vila da Serra! A taxa de entrega é R$ 8,00 e o tempo médio hoje é de 40 minutos. Quer dar uma olhada nas opções de hoje?' },
        { in: 'Manda o cardápio' },
        { node: 'menu', log: 'menu.fetch → pratos do dia' },
        { card: { type: 'menu', title: 'Cardápio Especial de Hoje', items: [['Costelinha Barbecue na Brasa', 'R$ 58'], ['Feijão Tropeiro Mineiro Completo', 'R$ 42'], ['Frango com Quiabo & Angu de Milho', 'R$ 46'], ['Pão de Queijo Recheado (6 un)', 'R$ 18']] } },
        { in: 'Quero uma costelinha e um tropeiro' },
        { node: 'cart', log: 'cart.add → costelinha x1, tropeiro x1', ctx: { 'Itens': 'Costelinha + Tropeiro' } },
        { bot: 'Excelente escolha! Quer adicionar os pães de queijo recheados? No combo sai por apenas R$ 12 (desconto de R$ 6).' },
        { in: 'Pode colocar o combo sim!' },
        { node: 'cart', log: 'upsell.accept → pao_de_queijo combo', ctx: { 'Combo': 'Pão de Queijo Adicionado' } },
        { card: { type: 'confirm', title: 'Resumo do Seu Pedido', rows: [['Costelinha na Brasa', 'R$ 58,00'], ['Feijão Tropeiro Completo', 'R$ 42,00'], ['Pão de Queijo Recheado (Combo)', 'R$ 12,00'], ['Taxa de Entrega (Vila da Serra)', 'R$ 8,00']], total: ['Total a Pagar', 'R$ 120,00'] } },
        { bot: 'Qual é o endereço e complemento para a entrega?' },
        { in: 'Rua dos Ipês, 45, apto 302' },
        { node: 'address', log: 'geo.validate → endereço validado ✓', ctx: { 'Endereço': 'R. dos Ipês, 45 · ap 302' } },
        { node: 'payment', log: 'pix.charge_create → R$ 120,00' },
        { bot: 'Perfeito! Segue o Pix copia e cola para liberação imediata na cozinha 👇' },
        { card: { type: 'pix', amount: 'R$ 120,00', to: 'Brasa Mineira Restaurante LTDA' } },
        { in: 'Pronto, paguei!' },
        { receipt: true },
        { node: 'payment', log: 'receipt.ocr → R$ 120,00 validado ✓' },
        { node: 'payment', log: 'pix.webhook → crédito confirmado no banco ✓', ctx: { 'Pagamento': 'Pix Recebido' } },
        { node: 'kitchen', log: 'kds.send → comanda #2291 impressa na chapa' },
        { bot: 'Pagamento confirmado! Seu pedido é o #2291 e já está sendo preparado pelo chef 👨‍🍳' },
        { bot: 'Previsão de entrega: 20h50. Assim que o entregador sair, te envio a localização em tempo real.' },
        { node: 'done', log: 'order.status → em_preparo' }
      ],
      faq: [
        { k: ['vegetar', 'vegano'], tag: 'restricao', a: 'Temos opção vegetariana: Tropeiro sem carnes com couve fininha e ovo caipira estalado por R$ 36.' },
        { k: ['reserva', 'mesa'], tag: 'reserva', a: 'Fazemos reservas de mesas no salão para até 20 pessoas de terça a domingo. Qual data deseja?' }
      ],
      chips: ['Tem prato vegetariano?', 'Aceita cartão na entrega?', 'Fazem reserva de mesa?']
    },

    // 6. PET SHOP
    pet: {
      price: { impl: 4200, sup: 1200, lvl: 4, name: 'Avançada', why: ['Histórico do pet (CRM)', 'Agenda com rotas de busca', 'Recompra', 'Pix com comprovante'] },
      label: 'Pet shop', icon: 'paw', biz: 'Patas & Cia', ini: 'P&C', color: '#2E7D6B', who: 'Lu', agent: 'Lu · banho, tosa e loja', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Renata Alves', email: 'renata.alves@email.com', phone: '(31) 98455-7609', bank: 'Banco Ipê', bkc: '#0F6E5C' },
      caps: ['Ficha do pet', 'Leva e traz', 'Recompra de ração', 'Agenda'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Tutor chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica o serviço e o pet', 'Classificador'),
        n('pet', 'paw', 'Ficha do pet', 'Consulta raça, porte e histórico', 'CRM pet'),
        AG('Tutor escolhe dia e horário com busca em casa'), BK(),
        n('logistics', 'truck', 'Leva e traz', 'Programa a busca no endereço', 'Rotas'),
        n('upsell', 'cart', 'Recompra', 'Lembra da ração no fim do ciclo', 'Histórico de compras'),
        PAY(),
        n('done', 'check', 'Atendimento concluído', 'Serviço e venda registrados', 'CRM')
      ],
      script: [
        { in: 'Oi, queria marcar banho e tosa pro Thor', ig: 'Oi! Quero marcar banho e tosa pro Thor 🐶' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → agendamento_banho (0.96)' },
        { node: 'pet', log: 'crm.lookup → Thor · Golden Retriever · 32 kg', ctx: { 'Pet': 'Thor (Golden Retriever)', 'Porte': 'Grande', 'Último Banho': '12/09' } },
        { bot: 'Oii Renata! Aqui é a Lu, da Patas & Cia 🐾' },
        { bot: 'Que saudade do Thor! O último banho dele foi em 12/09. Vai ser banho completo com tosa higiênica e corte de unhas?' },
        { in: 'Isso mesmo! Consegue buscar ele aqui em casa?' },
        { node: 'agenda', log: 'calendar.booking_link → banho_porte_g + rota busca' },
        { bot: 'Com certeza! Seguem os horários com rota do Táxi Dog no seu bairro 👇' },
        { cal: { title: 'Banho + Tosa Higiênica · Porte Grande', who: 'Patas & Cia · Leva e Traz', dur: '3 horas (com transporte)', place: 'Busca em Domicílio', days: { 20: ['14:00'], 21: ['08:30', '14:00'], 22: ['08:30'], 23: ['08:30', '14:00'] }, pick: [21, '08:30'] } },
        { node: 'book', log: 'calendar.webhook → qua 21/10 08:30 · #PC-5510 ✓', ctx: { 'Agendamento': 'Qua 21/10 · 08:30' } },
        { node: 'logistics', log: 'route.add → busca 08:30 · retorno ~12:00', ctx: { 'Leva e Traz': 'Confirmado (R$ 15)' } },
        { bot: 'Marcado! Buscamos o Thor na quarta às 8h30 e levamos ele de volta cheiroso até às 12h.' },
        { node: 'upsell', log: 'repurchase.check → ração comprada há 42 dias' },
        { bot: 'Ah, consultei a ficha do Thor e vi que o saco de 15kg da ração Golden Adulto foi comprado há 42 dias. Já está no finzinho? Quer que o motorista leve um pacote novo no retorno?' },
        { card: { type: 'product', title: 'Ração Premier Golden Fórmula Adulto 15kg', price: 'R$ 289', note: 'Entregue junto no Táxi Dog com frete grátis.' } },
        { in: 'Nossa, tá no finalzinho mesmo! Manda o Pix que já pago tudo' },
        { node: 'payment', log: 'pix.charge_create → R$ 289,00' },
        { card: { type: 'pix', amount: 'R$ 289,00', to: 'Patas & Cia Pet Shop LTDA' } },
        { in: 'Paguei, segue o comprovante' },
        { receipt: true },
        { node: 'payment', log: 'receipt.ocr → R$ 289,00 verificado ✓' },
        { node: 'payment', log: 'pix.webhook → crédito confirmado no banco ✓', ctx: { 'Ração': '15kg Paga' } },
        { bot: 'Pagamento recebido! A ração já está separada e vai junto no Táxi Dog. O valor do banho (R$ 95) + táxi (R$ 15) pode ser acertado na entrega. Lambeijos no Thor! 🦴' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['vacina', 'veterin'], tag: 'veterinario', a: 'Temos atendimento veterinário de segunda a sábado. Consulta R$ 150 e vacina V10 importada R$ 95 com aplicação.' },
        { k: ['gato', 'felino'], tag: 'gatos', a: 'Atendemos gatinhos em horário reservado, em sala acústica separada sem contato com cães para evitar estresse.' }
      ],
      chips: ['Vocês vacinam filhotes?', 'Dão banho em gatos?', 'Qual a tabela de banho?']
    },

    // 7. ODONTOLOGIA
    odonto: {
      price: { impl: 3600, sup: 1000, lvl: 3, name: 'Intermediária', why: ['Triagem de urgência', 'Leitura da carteirinha', 'Google Agenda'] },
      label: 'Odontologia', icon: 'tooth', biz: 'Clínica Dentalle', ini: 'DT', color: '#2A6F97', who: 'Bia', agent: 'Bia · recepção odontológica', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Juliana Costa', email: 'juliana.costa@email.com', phone: '(31) 99318-6650' },
      caps: ['Triagem de urgência', 'Convênios', 'Agenda de encaixes', 'Pós-atendimento'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Paciente chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica urgência e motivo da consulta', 'Classificador'),
        n('triage', 'filter', 'Triagem de urgência', 'Avalia dor, inchaço e sangramento', 'Protocolo clínico'),
        n('kb', 'book', 'Orienta sem diagnosticar', 'Passa os cuidados até a consulta', 'Base clínica'),
        n('plan', 'card', 'Confere o convênio', 'Lê a carteirinha e valida a cobertura', 'Operadora · elegibilidade'),
        AG('Paciente escolhe um encaixe na agenda do dentista'), BK(),
        n('done', 'check', 'Atendimento concluído', 'Ficha pronta e retorno agendado', 'Prontuário')
      ],
      script: [
        { in: 'Oi! Quebrou um pedacinho do meu dente agora no almoço 😩 Vocês conseguem me atender amanhã cedo?', ig: 'Oi! Sigo vocês aqui. Quebrou um pedaço do meu dente no almoço, conseguem me atender amanhã cedo?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → urgencia/fratura_dental (0.94)', ctx: { 'Motivo': 'Dente quebrado', 'Urgência': 'Alta' } },
        { bot: 'Olá Juliana! Aqui é a Bia, da Dentalle Odontologia 🦷' },
        { bot: 'Compreendo a preocupação! Vamos te acolher sim. Me responda rapidamente: há dor intensa, inchaço na gengiva ou sangramento ativo?' },
        { node: 'triage', log: 'triage.start · protocolo=urgencia_odonto' },
        { in: 'Dói um pouco quando bebo água fria. Sem inchaço e sem sangue' },
        { node: 'triage', log: 'entities.extract → sensibilidade_termica, sem_edema', ctx: { 'Sintomas': 'Sensibilidade ao frio · sem edema', 'Prioridade': 'Encaixe 24h' } },
        { node: 'kb', log: 'kb.search → fratura_esmalte · guardrail: sem_diagnostico' },
        { bot: 'Certo. Até o atendimento, evite mastigar alimentos duros desse lado e evite variações térmicas extremas.' },
        { bot: 'Seu atendimento será pelo convênio ou particular?' },
        { in: 'Pelo convênio Dental Plus, vou mandar a foto da carteirinha' },
        { photo: 'carteirinha_dental_plus.jpg' },
        { node: 'plan', log: 'ocr.card → Dental Plus Empresarial · elegibilidade ativa ✓', ctx: { 'Plano': 'Dental Plus (Ativo)' } },
        { bot: 'Carteirinha verificada! Seu plano cobre a consulta de urgência e a restauração estética em resina.' },
        { node: 'agenda', log: 'calendar.booking_link → encaixes urgência dr_paulo' },
        { bot: 'O Dr. Paulo Mendes liberou estes encaixes prioritários para amanhã cedo 👇' },
        { cal: { title: 'Avaliação de Urgência · Restauração', who: 'Dr. Paulo Mendes · Clínico Geral', dur: '40 min', place: 'Av. Getúlio Vargas, 1.420 · Funcionários', days: { 19: ['08:00', '08:40', '11:20'], 20: ['09:00', '14:00'] }, pick: [19, '08:00'] } },
        { node: 'book', log: 'calendar.webhook → seg 19/10 08:00 · #DT-3307 ✓', ctx: { 'Consulta': 'Seg 19/10 · 08:00' } },
        { bot: 'Agendado para amanhã às 08h00 com o Dr. Paulo! Chegue com 10 min de antecedência e documento com foto.' },
        { in: 'Muito obrigada pelo atendimento rápido Bia!' },
        { bot: 'Estamos aqui para cuidar de você! Tenha uma noite tranquila.' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['clareamento', 'branco'], tag: 'clareamento', a: 'Realizamos clareamento a laser em consultório (R$ 890) e caseiro com moldeiras personalizadas (R$ 690).' },
        { k: ['aparelho', 'invisalign', 'alinhador'], tag: 'ortodontia', a: 'Trabalhamos com alinhadores transparentes e aparelhos autoligáveis. A primeira avaliação ortodôntica com escaneamento 3D é sem custo.' }
      ],
      chips: ['Quanto custa clareamento?', 'Atendem plano odontológico?', 'Fazem alinhador invisível?']
    },

    // 8. IMOBILIÁRIA
    imob: {
      price: { impl: 4500, sup: 1300, lvl: 4, name: 'Avançada', why: ['Busca no catálogo de imóveis', 'Agenda dos corretores', 'CRM imobiliário'] },
      label: 'Imobiliária', icon: 'home', biz: 'Alto Vale Imóveis', ini: 'AV', color: '#4B5D3A', who: 'Thiago', agent: 'Thiago · atendimento de locação', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Pedro Henrique Lima', email: 'pedro.lima@email.com', phone: '(31) 99872-0314' },
      caps: ['Qualificação de lead', 'Busca de imóveis', 'Agenda de visitas', 'CRM'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Lead chega pelo {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica compra ou locação e a região', 'Classificador'),
        n('qualify', 'filter', 'Qualificação do lead', 'Orçamento, vaga, pet e prazo de mudança', 'Roteiro de locação'),
        n('search', 'home', 'Busca no catálogo', 'Filtra imóveis compatíveis e disponíveis', 'Catálogo de imóveis'),
        AG('Lead escolhe o horário da visita com o corretor'), BK(),
        n('crm', 'db', 'Registro no CRM', 'Lead com perfil e imóvel de interesse', 'CRM imobiliário'),
        n('done', 'check', 'Atendimento concluído', 'Corretor recebe a visita pronta', 'Handoff')
      ],
      script: [
        { in: 'Boa tarde! Tô procurando apê pra alugar perto da Savassi, 2 quartos', ig: 'Oi! Vi o reels do apê no Funcionários. Procuro 2 quartos pra alugar perto da Savassi, tem opções?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → locacao_residencial (0.95)', ctx: { 'Interesse': 'Locação Residencial', 'Região': 'Savassi / Funcionários', 'Tipologia': '2 Quartos' } },
        { bot: 'Boa tarde! Aqui é o Thiago, da Alto Vale Imóveis 🏠' },
        { bot: 'Temos excelentes oportunidades na região! Qual a sua faixa de orçamento total (aluguel + condomínio + IPTU) e você necessita de vaga de garagem ou aceitação de pet?' },
        { node: 'qualify', log: 'qualify.start · roteiro=locacao_v2' },
        { in: 'Até uns R$ 3.500 com tudo. Preciso de 1 vaga e tenho um gato' },
        { node: 'qualify', log: 'entities.extract → orcamento≤3500, vaga=1, pet=sim', ctx: { 'Orçamento Máx': 'R$ 3.500', 'Vagas': '1', 'Pet': 'Gato' } },
        { node: 'search', log: 'catalog.search → 3 imóveis pet-friendly compatíveis' },
        { bot: 'Filtrei 3 apartamentos impecáveis que aceitam pet e se encaixam exatamente no seu orçamento 👇' },
        { card: { type: 'listing', title: 'Apartamentos Selecionados na Savassi', sub: '2 quartos · 1 vaga · Pet friendly', items: [{ t: 'Rua Tomé de Souza · Savassi', d: '1 suíte · 68 m² · Lazer completo', p: 'R$ 3.380' }, { t: 'Rua dos Inconfidentes · Funcionários', d: 'Varanda gourmet · 72 m²', p: 'R$ 3.150' }, { t: 'Rua Cláudio Manoel · Funcionários', d: 'Reformado · 60 m² · Portaria 24h', p: 'R$ 2.900' }], note: 'Valores totais estimados com taxa condominial e IPTU.' } },
        { in: 'Gostei muito do apartamento da Rua dos Inconfidentes! Como faço pra visitar?' },
        { node: 'search', log: 'listing.select → #AV-2218 · Rua Inconfidentes', ctx: { 'Imóvel Escolhido': 'Inconfidentes (R$ 3.150)' } },
        { bot: 'Esse apartamento tem sol da manhã e varanda ventilada! Te enviei a agenda da corretora Ana Ribeiro para marcar a visita 👇' },
        { cal: { title: 'Visita Presencial · Imóvel Rua Inconfidentes', who: 'Ana Ribeiro · Corretora Credenciada', dur: '45 min', place: 'Rua dos Inconfidentes · Portaria', days: { 19: ['12:00', '18:30'], 20: ['10:00', '17:00'], 21: ['18:00'] }, pick: [20, '17:00'] } },
        { node: 'book', log: 'calendar.webhook → ter 20/10 17:00 · corretora notificada ✓', ctx: { 'Visita': 'Ter 20/10 · 17:00' } },
        { bot: 'Visita agendada para terça-feira, 20/10 às 17h! A Ana te encontrará na portaria do edifício.' },
        { bot: 'Trabalhamos com garantia digital sem fiador (seguro-fiança aprovado em 15 minutos). Bom domingo!' },
        { node: 'crm', log: 'crm.create_lead → ficha completa enviada à corretora' },
        { node: 'done', log: 'conversation.closed · handoff → Ana Ribeiro' }
      ],
      faq: [
        { k: ['fiador', 'garantia'], tag: 'garantia', a: 'Não precisa de fiador! Aceitamos seguro-fiança com análise instantânea, título de capitalização ou caução.' },
        { k: ['anunciar', 'proprietario', 'vender meu'], tag: 'captacao', a: 'Avaliamos e fotografamos seu imóvel profissionalmente sem custos de cadastro. Deseja agendar a visita de captação?' }
      ],
      chips: ['Precisa de fiador?', 'Aceita caução?', 'Quero anunciar meu imóvel']
    },

    // 9. CONDOMÍNIO & SÍNDICO PROFISSIONAL (NOVO)
    condo: {
      price: { impl: 4900, sup: 1400, lvl: 4, name: 'Avançada', why: ['Conciliação de conflitos via IA', 'Reserva de áreas comuns', '2ª via de boleto/Pix'] },
      label: 'Condomínio', icon: 'pin', biz: 'Condomínio Residencial Aurora', ini: 'RA', color: '#1A4D2E', who: 'Marcos', agent: 'Marcos · síndico virtual e portaria', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Gustavo Mendonça', email: 'gustavo.mendonca@email.com', phone: '(31) 98711-0022' },
      caps: ['Reservas de áreas comuns', 'Segunda via de cota', 'Abertura de chamados', 'Regimento interno'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Morador chama pelo {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Detecta reserva, 2ª via ou reclamação', 'Classificador'),
        n('auth', 'user', 'Identificação do morador', 'Valida bloco e unidade no banco predial', 'Cadastro de Moradores'),
        n('rules', 'book', 'Consulta o regulamento', 'Checa disponibilidade e regras de uso', 'Regimento Interno'),
        AG('Morador seleciona a data da reserva'), BK(), PAY('Taxa de limpeza via Pix'),
        n('done', 'check', 'Atendimento concluído', 'Comprovante emitido e portaria notificada', 'Gestão Predial')
      ],
      script: [
        { in: 'Olá! Sou o Gustavo do apê 402 bloco B. Queria reservar o salão de festas pro aniversário do meu filho no próximo sábado', ig: 'Boa tarde! Como faço pra reservar o salão de festas pro próximo sábado? Gustavo ap 402 B' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → reserva_area_comum (0.97)', ctx: { 'Solicitação': 'Reserva Salão de Festas', 'Unidade': 'Ap 402 · Bloco B' } },
        { node: 'auth', log: 'resident.lookup → Gustavo Mendonça · adimplente ✓' },
        { bot: 'Olá Gustavo! Aqui é o Marcos, assistente virtual do Residencial Aurora 🏢' },
        { node: 'rules', log: 'regimento.check → sábado 24/10 disponível · limite 50 pessoas · horário até 23h' },
        { bot: 'Verifiquei aqui: o Salão de Festas está disponível para sábado, 24/10! A taxa de limpeza condominial é de R$ 120,00 e o horário de uso vai até as 23h00 (conforme lei do silêncio do regimento).' },
        { bot: 'Deseja formalizar a reserva?' },
        { in: 'Sim, quero confirmar!' },
        { node: 'agenda', log: 'calendar.booking_link → reserva salaodefestas 24/10' },
        { cal: { title: 'Reserva do Salão de Festas · Ap 402 B', who: 'Gustavo Mendonça', dur: '12 horas', place: 'Espaço Social Aurora', days: { 24: ['12:00'] }, pick: [24, '12:00'] } },
        { node: 'book', log: 'calendar.webhook → reserva pré-aprovada 24/10', ctx: { 'Data Reserva': 'Sáb 24/10 · Salão de Festas' } },
        { node: 'payment', log: 'pix.charge_create → R$ 120,00' },
        { bot: 'Excelente! Segue o Pix oficial da conta do condomínio para quitação da taxa de limpeza:' },
        { card: { type: 'pix', amount: 'R$ 120,00', to: 'Condomínio Residencial Aurora' } },
        { in: 'Pix enviado, segue o comprovante' },
        { receipt: true },
        { node: 'payment', log: 'receipt.ocr → R$ 120,00 validado ✓' },
        { node: 'payment', log: 'pix.webhook → crédito em conta condominial ✓', ctx: { 'Taxa Limpeza': 'Paga (R$ 120)' } },
        { bot: 'Pagamento confirmado e reserva oficializada! A portaria já recebeu a liberação e os convidados poderão acessar mediante lista na recepção. Bom evento! 🎉' },
        { node: 'done', log: 'conversation.closed · portaria_notificada' }
      ],
      faq: [
        { k: ['boleto', 'cota', 'segunda via'], tag: 'boleto', a: 'Posso gerar a 2ª via da sua cota condominial na hora com chave Pix copia-e-cola e sem juros antes do vencimento. Deseja a via deste mês?' },
        { k: ['barulho', 'reclamacao', 'vizinho'], tag: 'conflito', a: 'Se houver perturbação do sossego, você pode registrar o relato anônimo por aqui. Nosso sistema notifica a portaria para verificação imediata.' }
      ],
      chips: ['Segunda via de condomínio', 'Regras de mudança e caçamba', 'Horário da piscina']
    },

    // 10. AUTOESCOLA & CFC (NOVO)
    auto: {
      price: { impl: 3900, sup: 1100, lvl: 3, name: 'Intermediária', why: ['Agendamento de aulas práticas', 'Simulador de parcelamento', 'Envio de taxas do Detran'] },
      label: 'Autoescola', icon: 'truck', biz: 'CFC Piloto Seguro', ini: 'PS', color: '#B45309', who: 'Natália', agent: 'Natália · matrícula e aulas', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Gabriel Souza', email: 'gabriel.souza@email.com', phone: '(31) 99120-7733' },
      caps: ['Matrícula 1ª CNH', 'Agendamento de aulas', 'Simulado Detran', 'Parcelamento'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Aluno chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica 1ª habilitação (A, B ou AB)', 'Classificador'),
        n('kb', 'book', 'Tira dúvidas das etapas', 'Explica exames, CFC e aulas práticas', 'Base Detran'),
        n('offer', 'tag', 'Apresenta pacotes', 'Preço à vista e parcelado no boleto', 'Tabela de Matrícula'),
        AG('Aluno escolhe o dia da aula prática com instrutor'), BK(),
        n('done', 'check', 'Atendimento concluído', 'Aluno cadastrado no sistema', 'CFC Cloud')
      ],
      script: [
        { in: 'Olá! Quanto custa pra tirar a primeira CNH de carro e moto?', ig: 'Oii! Quero começar a tirar minha carteira de carro e moto, quanto tá saindo?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → orcamento_cnh_ab (0.97)', ctx: { 'Categoria': 'CNH AB (Carro e Moto)', 'Tipo': '1ª Habilitação' } },
        { bot: 'Oi Gabriel, tudo bem? Aqui é a Natália, da Autoescola Piloto Seguro 🚗🏍️' },
        { bot: 'Tirar a CNH de carro e moto junta é a melhor escolha, porque você economiza nas taxas médicas e faz o curso teórico uma única vez!' },
        { node: 'offer', log: 'pricing.lookup → categoria_ab · promocao' },
        { card: { type: 'product', title: 'Pacote Completo 1ª Habilitação AB', price: 'R$ 2.490', old: 'R$ 2.890', note: 'Inclui: Matrícula, 45h de curso teórico, 20 aulas de carro + 20 aulas de moto e aluguel dos veículos para a prova.' } },
        { bot: 'Parcelamos em até 12x no cartão ou no boleto facilitado da autoescola. Quer que eu agende sua aula inaugural teórica?' },
        { in: 'Quero sim, prefiro turma da noite' },
        { node: 'agenda', log: 'calendar.booking_link → turma_noturna cfc' },
        { cal: { title: 'Início Curso Teórico CFC (Turma Noturna)', who: 'Instrutor Marcelo · Sala 2', dur: '4 horas', place: 'CFC Piloto Seguro · Unidade Centro', days: { 20: ['18:30'], 21: ['18:30'] }, pick: [20, '18:30'] } },
        { node: 'book', log: 'calendar.webhook → matricula confirmada 20/10 18:30', ctx: { 'Aula Inaugural': 'Ter 20/10 · 18:30' } },
        { bot: 'Matrícula pré-agendada para terça, 20/10 às 18h30! Traga seu RG, CPF e comprovante de endereço. Te aguardamos para conquistar sua CNH!' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['reprov', 'reprovou', 'taxa'], tag: 'taxa', a: 'Se precisar refazer o exame prático, cobramos apenas a taxa do Detran e a taxa de re-aluguel do veículo, sem multas.' }
      ],
      chips: ['Parcela no boleto?', 'Quanto tempo dura o processo?', 'Tem simulador?']
    },

    // 11. OFICINA MECÂNICA & AUTO CENTER (NOVO)
    ofic: {
      price: { impl: 4100, sup: 1200, lvl: 4, name: 'Avançada', why: ['Triagem mecânica por foto do painel', 'Orçamento de revisão preventiva', 'Google Agenda box'] },
      label: 'Oficina mecânica', icon: 'fork', biz: 'Auto Center V8', ini: 'V8', color: '#DC2626', who: 'Danilo', agent: 'Danilo · diagnóstico e balcão', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Marcelo Rezende', email: 'marcelo.rezende@email.com', phone: '(31) 98855-1199' },
      caps: ['Triagem mecânica', 'Foto de painel/luz de injeção', 'Orçamento de revisão', 'Agendamento de box'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Motorista chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica barulho, revisão ou luz no painel', 'Classificador'),
        n('vision', 'image', 'Análise de foto do painel', 'Lê luzes de alerta e código de falha', 'Visão Computacional'),
        n('diag', 'filter', 'Diagnóstico preliminar', 'Estima gravidade e orienta se pode rodar', 'Base Técnica'),
        AG('Motorista escolhe o box para check-up gratuito'), BK(),
        n('done', 'check', 'Atendimento concluído', 'Ficha do veículo aberta no sistema', 'Oficina ERP')
      ],
      script: [
        { in: 'Bom dia! Acendeu uma luz amarela de motor no painel do meu Onix e o carro tá meio sem força. Posso rodar?', ig: 'Opa, bom dia! Acendeu luz da injeção no painel do meu carro, vocês passam o scanner?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → luz_injecao_perda_potencia (0.98)', ctx: { 'Veículo': 'Chevrolet Onix', 'Sintoma': 'Luz injeção + Perda de força' } },
        { bot: 'Bom dia Marcelo! Aqui é o Danilo, do Auto Center V8 🚗🔧' },
        { bot: 'A luz da injeção eletrônica indica que a central identificou alguma falha (pode ser vela, bobina, sensor ou combustível adulterado). Consegue me mandar uma foto do painel?' },
        { photo: 'painel_onix_injecao.jpg' },
        { node: 'vision', log: 'vision.analyze → luz_injecao: acesa continua (nao piscando)' },
        { node: 'diag', log: 'rule.check → luz continua = pode rodar ate a oficina com cautela' },
        { bot: 'A luz está contínua (se estivesse piscando, seria risco de dano ao catalisador). Você pode rodar com cautela até a nossa oficina sem forçar o motor.' },
        { bot: 'O diagnóstico com scanner profissional para leitura da injeção não tem custo se realizar o serviço conosco. Quer agendar o box agora?' },
        { in: 'Quero sim, tem horário hoje às 14h?' },
        { node: 'agenda', log: 'calendar.booking_link → box 02 eletrica/injecao' },
        { cal: { title: 'Diagnóstico Scanner + Check-up Injeção', who: 'Mecânico Chefe Roberto', dur: '45 min', place: 'Auto Center V8 · Av. Amazonas, 3.200', days: { 19: ['14:00', '15:30', '17:00'] }, pick: [19, '14:00'] } },
        { node: 'book', log: 'calendar.webhook → box 2 reservado seg 14:00', ctx: { 'Box': 'Seg 19/10 · 14:00' } },
        { bot: 'Box 02 reservado para você às 14h00 de hoje com o Roberto! Venha tranquilo na faixa da direita e te recebemos no elevador.' },
        { node: 'done', log: 'conversation.closed' }
      ],
      faq: [
        { k: ['oleo', 'troca de oleo', 'filtro'], tag: 'oleo', a: 'Temos troca de óleo 100% sintético homologado com troca dos 4 filtros (óleo, ar, combustível e ar-condicionado) a partir de R$ 190.' }
      ],
      chips: ['Quanto custa troca de óleo?', 'Fazem alinhamento 3D?', 'Onde fica a oficina?']
    },

    // 12. INFOPRODUTO & MENTORIA HIGH-TICKET (NOVO)
    info: {
      price: { impl: 5500, sup: 1600, lvl: 5, name: 'Completa', why: ['Qualificação de faturamento do lead', 'Filtro anti-curioso com IA', 'Agenda com especialista'] },
      label: 'Mentoria & Infoprodutos', icon: 'flame', biz: 'Escala Digital Mentoria', ini: 'ED', color: '#4F46E5', who: 'Sofia', agent: 'Sofia · qualificação e fechamento', start: 14 * 3600 + 20 * 60,
      cli: { name: 'Rodrigo Brandão', email: 'rodrigo.brandao@email.com', phone: '(11) 97722-4411' },
      caps: ['Qualificação de faturamento', 'Filtro anti-curiosos', 'Agenda de entrevista', 'Checkout Pix'],
      flow: [
        n('receive', 'msg', 'Mensagem recebida', 'Lead chama no {canal}', '{api}'),
        n('intent', 'spark', 'Entende o que a pessoa precisa', 'Identifica interesse na mentoria exclusiva', 'Classificador'),
        n('qualify', 'filter', 'Qualificação avançada', 'Faturamento mensal, nicho e gargalo atual', 'Roteiro High-Ticket'),
        AG('Lead qualificado escolhe o horário da sessão estratégica'), BK(),
        n('crm', 'db', 'Envio de dossiê para o mentor', 'Cria ficha com metas e ROI projetado', 'HubSpot / Pipedrive'),
        n('done', 'check', 'Atendimento concluído', 'Entrevista confirmada com orientações', 'Handoff')
      ],
      script: [
        { in: 'Olá! Quero saber como funciona a Mentoria Escala Digital de vocês', ig: 'Vi o stories de faturamento de 7 dígitos. Como entro na mentoria?' },
        { node: 'receive', log: 'message.received · canal={ch}' },
        { node: 'intent', log: 'intent.classify → interesse_mentoria_high_ticket (0.99)', ctx: { 'Interesse': 'Mentoria Escala 7D', 'Origem': 'Tráfego Orgânico' } },
        { bot: 'Olá Rodrigo! Aqui é a Sofia, da equipe de admissão da Escala Digital 🚀' },
        { bot: 'Nossa mentoria é um acompanhamento direto de 6 meses focado em implementação de funis perpétuos e agentes de IA para escalar negócios digitais.' },
        { bot: 'Como temos apenas 10 vagas por turma, fazemos uma triagem prévia. Qual é o seu modelo de negócio atual e quanto você fatura em média por mês?' },
        { node: 'qualify', log: 'qualify.start · criteria: faturamento >= 30k' },
        { in: 'Tenho uma agência e cursos online. Faturamos entre 45k e 60k por mês, mas quero automatizar o atendimento e escalar pra 150k' },
        { node: 'qualify', log: 'entities.extract → faturamento: 50k · meta: 150k · lead: hiper_qualificado ✓', ctx: { 'Faturamento': 'R$ 45k - 60k/mês', 'Objetivo': 'Escalar para R$ 150k/mês', 'Classificação': 'Lead A+ (Aprovado)' } },
        { bot: 'Excelente, Rodrigo! Seu perfil e momento de empresa são exatamente o recorte dos nossos cases de maior sucesso na última turma.' },
        { bot: 'Liberamos uma Sessão Estratégica Individual de 45 minutos com o nosso diretor de operações para desenhar o seu plano de voo. Segue a agenda privada 👇' },
        { node: 'agenda', log: 'calendar.booking_link → sessao_estrategica high-ticket' },
        { cal: { title: 'Sessão Estratégica Individual · Escala Digital', who: 'Felipe Matos · Diretor de Operações', dur: '45 min', place: 'Google Meet Exclusivo', days: { 20: ['11:00', '16:00'], 21: ['10:00', '15:00'] }, pick: [20, '16:00'] } },
        { node: 'book', log: 'calendar.webhook → sessao marcada ter 20/10 16:00', ctx: { 'Entrevista': 'Ter 20/10 · 16:00' } },
        { bot: 'Sua sessão estratégica foi agendada para terça, 20/10 às 16h! O link confidencial do Meet já está no seu e-mail. Tenha em mãos seus números de CAC e conversão de vendas.' },
        { node: 'crm', log: 'crm.create_deal → negócio R$ 15.000 criado no pipeline' },
        { node: 'done', log: 'conversation.closed · handoff → Felipe Matos' }
      ],
      faq: [
        { k: ['investimento', 'preco', 'quanto custa'], tag: 'preco', a: 'O investimento na mentoria é de R$ 15.000 à vista no Pix ou 12x de R$ 1.500 no cartão. O retorno médio dos mentorados ocorre já no 2º mês.' }
      ],
      chips: ['Qual o valor do investimento?', 'Tem garantia de resultado?', 'Quantos meses dura?']
    }
  };

  return { niches };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NICHES_DATA;
}

