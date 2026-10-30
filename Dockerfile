# syntax=docker/dockerfile:1
FROM node:20-alpine AS runner

WORKDIR /app

# Definir ambiente de produção
ENV NODE_ENV=production
ENV PORT=3000

# Copiar arquivos de configuração
COPY package.json ./

# Copiar código fonte completo
COPY . .

# Execução de testes de integridade pré-inicialização (se presentes)
RUN if [ -f "tests/run_all.js" ]; then node tests/run_all.js; else echo "Testes pré-build ignorados"; fi

# Expor porta
EXPOSE 3000

# Inicialização resiliente
CMD ["node", "server.js"]

