###################
# BUILD STAGE
###################
FROM node:20-bookworm-slim AS builder

WORKDIR /usr/src/adgeniusback

# 1. Instala dependências de build (Debian)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 2. Copia arquivos de dependência
COPY --chown=node:node package.json yarn.lock ./

# 3. Instalação forçando engine (se necessário)
RUN yarn config set ignore-engines true && \
    yarn install --frozen-lockfile --network-timeout 1000000

# 4. Build do projeto
COPY --chown=node:node . .
RUN npx prisma generate && \
    npm run build

###################
# PRODUCTION STAGE
###################
FROM node:20-alpine AS production 

RUN apk add --no-cache openssl libc6-compat dumb-init

WORKDIR /usr/src/adgeniusback

COPY --chown=node:node --from=builder /usr/src/adgeniusback/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/adgeniusback/dist ./dist
COPY --chown=node:node --from=builder /usr/src/adgeniusback/.env .env
COPY --chown=node:node ./prisma ./prisma

ENV NODE_ENV=production
USER node


RUN npm install pm2 -g
CMD ["dumb-init", "pm2-runtime", "dist/main.js"]

###################
# BUILD FOR PRODUCTION
###################

#FROM node:18-alpine AS build

# Atualiza APK com limite de memória
#RUN apk update --no-cache && \
    #apk add --no-cache --virtual .build-deps \
   # openssl \
   # libc6-compat \
  #  && rm -rf /var/cache/apk/*
		
# FROM node:20-alpine AS build
#RUN apk update
#RUN apk add --no-cache libc6-compat

#WORKDIR /usr/src/adgeniusback

#COPY --chown=node:node package.json ./
#COPY --chown=node:node yarn.lock ./

#RUN npm pkg delete scripts.prepare

#RUN yarn

#COPY --chown=node:node . .
#COPY --chown=node:node .env .env

#RUN npx prisma generate
#RUN npm run build

#RUN npm pkg delete scripts.prepare

#ENV NODE_ENV=production

#RUN yarn install --prod

#USER node

###################
# PRODUCTION
###################

#FROM node:20-alpine AS production

#RUN apk add --no-cache openssl libc6-compat

#COPY --chown=node:node --from=build /usr/src/adgeniusback/node_modules ./node_modules
#COPY --chown=node:node --from=build /usr/src/adgeniusback/dist ./dist
#COPY --chown=node:node ./prisma ./prisma
#COPY --chown=node:node .env .env

#RUN npx prisma generate

#RUN npm install pm2 -g

#CMD ["pm2-runtime", "dist/main.js"]
