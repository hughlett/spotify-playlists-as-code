FROM node:20-slim

# ARG USERNAME=node
# ARG USER_UID
# ARG USER_GID=$USER_UID

# RUN groupmod --gid $USER_GID $USERNAME \
#     && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
#     && chown -R $USER_UID:$USER_GID /home/$USERNAME

# USER node

WORKDIR /spac

COPY package*.json .

RUN npm ci

COPY ./ .

EXPOSE 5173

ENTRYPOINT ["/bin/sh", "-c" , "npx tsx src/index.ts"]
