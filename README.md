# AgentLab Pro 🤖📱

> **Laboratório Interativo de Agentes de IA para Atendimento no WhatsApp e Instagram**  
> Simulação em tempo real, visualizador de pipeline de execução, gerador de Pix oficial do Banco Central (EMV), estúdio de criação de agentes e simulador de faturamento comercial com MRR.

---

## 🌟 Visão Geral e Análise Comparativa

O **AgentLab Pro** foi desenvolvido como uma evolução aprofundada da plataforma de demonstração de agentes (`platform.agentor.app/agent-lab`), trazendo arquitetura moderna para produção em nuvem 24/7, conformidade legal brasileira e ferramentas avançadas de exportação:

1. **Simulador de Smartphone Fiel (iOS iPhone com Dynamic Island):**
   - Alternância fluida entre interface do **WhatsApp** (balões clássicos verdes, status com ticks duplos) e **Instagram Direct** (balões em degradê, tipografia moderna).
   - Indicador de toque animado (cursor simulando o toque do usuário nos botões, opções e links).
   - Modal interno de agendamento do **Google Calendar** com grade do mês, horários livres e confirmação de reserva.
   - Cartões dinâmicos de produtos, cardápio de restaurante, listagem de imóveis e checkout Pix oficial com QR Code real em Canvas.
   - Comprovante bancário simulado com autenticação para validação via OCR.
   - Chat livre ao final da simulação com sugestões rápidas (chips) e IA respondendo dúvidas ou transferindo para atendimento humano (*handoff*).

2. **12 Nichos Brasileiros de Alta Demanda:**
   - **Advocacia (Júlia · Ferraz & Lima):** Triagem trabalhista, compliance OAB, agenda Google Meet e CRM jurídico.
   - **Clínica de Estética (Lívia · Clínica Lumière):** Objeções de procedimento, agendamento médico e sinal de R$ 150 via Pix.
   - **Barbearia (Rafa · Navalha 31):** Escolha de barbeiro, upsell de pomada matte e lembrete automático 2h antes.
   - **Salão de Beleza (Carol · Studio Íris):** Visão computacional para análise de foto de cabelo, teste de mecha e orçamento.
   - **Restaurante & Delivery (Gabi · Brasa Mineira):** Cardápio interativo, taxa de entrega por bairro, combo e comanda no KDS.
   - **Pet Shop (Lu · Patas & Cia):** Ficha do pet no CRM, táxi dog (leva e traz) e recompra automática de ração.
   - **Odontologia (Bia · Clínica Dentalle):** Triagem de urgência de fratura dental, OCR de carteirinha de convênio e encaixe.
   - **Imobiliária (Thiago · Alto Vale Imóveis):** Qualificação de lead, busca de apartamentos pet-friendly e visita com corretora.
   - **Condomínio & Síndico (Marcos · Residencial Aurora):** Reserva de salão de festas, regimento interno e taxa de limpeza via Pix.
   - **Autoescola (Natália · Piloto Seguro):** Matrícula CNH AB, tabela de preços e agendamento de aula teórica inaugural.
   - **Oficina Mecânica (Danilo · Auto Center V8):** Leitura de foto de luz de injeção no painel e reserva de box com scanner.
   - **Infoproduto & Mentoria (Sofia · Escala Digital):** Qualificação de faturamento high-ticket e entrevista estratégica.

3. **Estúdio de Criação & Exportação de Agentes:**
   - Crie seus próprios agentes com nome do negócio, avatar, paleta de cores, preços sugeridos e regras de roteiro.
   - Exporte com 1 clique para:
     * **Workflow n8n (.json)** (pronto para importar no n8n com nós de LangChain, Webhook e APIs).
     * **Typebot (.json)**.
     * **System Prompt otimizado para OpenAI / Gemini / Claude**.

4. **Simulador de Faturamento Comercial (MRR):**
   - Arraste o slider de clientes por mês (1 a 20).
   - Escolha o plano do agente (Essencial, Intermediário, Avançado ou Completo).
   - Adicione serviços complementares (Landing page, Gestão de tráfego, Social media, SEO local).
   - Visualize a evolução mês a mês (M1 a M12) em gráfico de barras com faturamento de setup vs receita recorrente acumulada.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js versão 18 ou superior instalado.

### Inicialização em 1 Clique (Windows)
Dê um duplo clique no atalho gerado na sua Área de Trabalho:
`INICIAR_AGENTLAB_PRO.bat`

Ou via terminal:
```bash
cd "c:\Users\luciano\OneDrive\Documentos\nova pasta\index.html\agent-lab"
npm start
```
Acesse no seu navegador: `http://localhost:3000` (ou `http://localhost:3055`).

---

## 🧪 Suíte de Testes Automatizados

### 1. Testes Locais Formais
Executa validação completa de rotas, infraestrutura, saúde, páginas legais, API Pix e exportação:
```bash
npm test
# ou: node tests/run_all.js
```

### 2. Testes Ao Vivo na Nuvem (Live Cloud E2E)
Testa a aplicação em produção ou em túnel com `rejectUnauthorized: false` para validação em 360 graus:
```bash
node tests/test_cloud_live.js https://seu-app.onrender.com
```

---

## ☁️ Deploy 24/7 na Nuvem

### Deploy no Render.com (Blueprint Automático)
1. Crie um novo repositório no GitHub ou faça upload do pacote ZIP.
2. No Render, clique em **New +** -> **Blueprint**.
3. Selecione o repositório. O Render lerá o arquivo `render.yaml` automaticamente:
   - **Build Command:** `npm install --production`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
   - **Auto-Deploy:** Ativo

### Deploy via Docker
```bash
docker build -t agentlab-pro .
docker run -p 3000:3000 agentlab-pro
```

---

## 🔒 Conformidade Legal e Regulatória Brasileira

- **Avisos Éticos:** Deixa explícito aos usuários que os agentes conversacionais são ferramentas de suporte e triagem e não substituem diagnósticos médicos ou pareceres jurídicos formais.
- **Faixa Etária:** Indicação de faixa etária recomendada (16+ anos) e restrição de compras comerciais para maiores de 18 anos nos termos do Estatuto da Criança e do Adolescente (ECA).
- **LGPD:** Rotas `/termos` e `/privacidade` em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
- **PIX Oficial do Banco Central:** Geração de código copia-e-cola no padrão EMV do Bacen com cálculo de redundância cíclica CRC16 oficial (polinômio 0x1021).

---

## 📁 Estrutura de Arquivos

```
agent-lab/
├── package.json               # Configurações e dependências
├── server.js                  # Servidor HTTP resiliente 24/7 (/api/health)
├── render.yaml                # Infraestrutura de nuvem Render.com
├── Dockerfile                 # Imagem multi-stage com testes prévios
├── .gitignore / .dockerignore # Isolamento de arquivos
├── README.md                  # Manual completo
├── public/                    # Frontend SPA
│   ├── index.html             # Interface interativa
│   ├── termos.html            # Termos de Uso (LGPD / ECA)
│   ├── privacidade.html       # Política de Privacidade (LGPD)
│   ├── css/app.css            # Estilos dos temas e componentes
│   └── js/
│       ├── pix-generator.js   # Gerador de Pix EMV com CRC16 e QR Code
│       ├── data-niches.js     # 12 nichos completos com roteiros
│       ├── agent-studio.js    # Criador e exportador de agentes
│       └── app.js             # Motor de execução e simulação
├── tests/
│   ├── run_all.js             # Testes automatizados locais (23 testes)
│   └── test_cloud_live.js     # Testes E2E de produção na nuvem (15 testes)
└── scripts/
    └── gerar_deploy_zip.ps1   # Gerador de pacote ZIP limpo na Área de Trabalho
```

