FROM node:20-slim

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY ./ .

EXPOSE 5173

ENTRYPOINT ["/bin/sh", "-c" , "npx tsx src/index.ts"]