FROM node:20-slim

WORKDIR /spac

COPY package*.json .

RUN npm ci

COPY ./ .

RUN npx tsc

EXPOSE 5173

CMD [ "node", "dist/index.js" ] 
