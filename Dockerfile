FROM node:14-16-alpine3.10 AS development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build

FROM node:14-16-alpine3.10 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY . .
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/.env /.dist

EXPOSE 3000 3000

CMD ["node", "dist/src/main"]