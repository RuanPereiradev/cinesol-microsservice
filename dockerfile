# Estágio de Build
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Copia arquivos de dependências
COPY package*.json pnpm-lock.yaml ./

# Instala o pnpm (se estiver usando) e dependências
RUN npm install -g pnpm && pnpm install

# Copia o restante do código e o Prisma
COPY . .

# Recebe o argumento do serviço (ex: auth-service)
ARG SERVICE
RUN npx nest build ${SERVICE}

# Estágio de Execução
FROM node:20-alpine AS production

ARG SERVICE
ENV SERVICE_NAME=${SERVICE}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules ./node_modules

# Comando para rodar o app específico
CMD node dist/apps/${SERVICE_NAME}/main