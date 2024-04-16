FROM node:20-slim
ENV UID = 1000
ENV GID = 1000
WORKDIR /spac

COPY package*.json .

RUN npm ci

COPY ./ .

EXPOSE 5173

ENTRYPOINT ["/bin/sh", "-c" , "npx tsx src/index.ts"]