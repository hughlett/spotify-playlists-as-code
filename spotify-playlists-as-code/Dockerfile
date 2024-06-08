FROM node:20-bookworm-slim

WORKDIR /spotify-playlists-as-code

COPY package*.json .

RUN npm ci

COPY ./ .

RUN npm run compile

EXPOSE 5173 9229

ENTRYPOINT ["npm", "run"]
