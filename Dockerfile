FROM node:20-bookworm-slim

WORKDIR /spac

COPY package*.json .

RUN npm ci

COPY ./ .

EXPOSE 5173 9229

ENTRYPOINT ["npm", "run"]
