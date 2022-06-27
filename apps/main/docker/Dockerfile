# этап компиляции ts -> js
FROM node:lts-alpine
WORKDIR /usr/app
# для ускорения сборки сохраняем зависимости в отдельный слой
COPY tsconfig.json tsconfig.build.json package.json pnpm-lock.yaml nest-cli.json ./
RUN corepack enable \
    && corepack prepare pnpm@7.3.0 --activate \
    && pnpm install --prod --frozen-lockfile --ignore-scripts \
    && mv ./node_modules /usr/node_modules_prod \
    && pnpm install --frozen-lockfile --ignore-scripts
COPY src ./src
RUN pnpm run build

# копируем с первой стадии dist и node_modules
FROM node:lts-alpine
WORKDIR /usr/app
COPY --from=0 /usr/node_modules_prod ./node_modules
COPY --from=0 /usr/app/dist .
EXPOSE 3000
ENTRYPOINT ["node", "main.js"]
