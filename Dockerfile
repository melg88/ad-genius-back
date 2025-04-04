###################
# BUILD FOR PRODUCTION (usando bullseye-slim)
###################

FROM node:18-bullseye-slim AS build

# Configurações essenciais
ENV NODE_ENV=development

WORKDIR /usr/src/adgeniusback

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY --chown=node:node . .
COPY --chown=node:node .env .env

RUN npx prisma generate && \
    npm run build && \
    yarn install --production --ignore-scripts --prefer-offline

###################
# PRODUCTION (Alpine leve)
###################

FROM node:20-alpine AS production

RUN apk add --no-cache openssl libc6-compat dumb-init

WORKDIR /usr/src/adgeniusback

COPY --chown=node:node --from=build /usr/src/adgeniusback/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/adgeniusback/dist ./dist
COPY --chown=node:node --from=build /usr/src/adgeniusback/.env .env
COPY --chown=node:node ./prisma ./prisma

ENV NODE_ENV=production
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["pm2-runtime", "dist/main.js"]


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
