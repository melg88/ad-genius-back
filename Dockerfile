###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build

RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/adgeniusback

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

# Remove scripts.prepare (evita problemas com husky, por exemplo)
RUN npm pkg delete scripts.prepare

RUN apk add --no-cache openssl
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate

# Instala dependências e faz o build
RUN yarn
COPY --chown=node:node . .
RUN npm run build

# Instala apenas dependências de produção
ENV NODE_ENV=production
RUN yarn install --prod

# Configura usuário seguro
USER node

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

WORKDIR /usr/src/adgeniusback

# Copia apenas o necessário da fase `build`
COPY --chown=node:node --from=build /usr/src/adgeniusback/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/adgeniusback/dist ./dist
COPY --chown=node:node --from=build /usr/src/adgeniusback/prisma ./prisma

# Usa PM2 para gerenciar o processo
RUN npm install pm2 -g

CMD ["pm2-runtime", "dist/main.js"]
