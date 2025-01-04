FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --chown=node:node . .

USER node
EXPOSE 5000

ENTRYPOINT ["node", "proxy-server"]

