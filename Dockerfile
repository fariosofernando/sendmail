FROM oven/bun:1-debian

WORKDIR /app

ENV NODE_ENV=development

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3015

CMD ["sh", "-c", "bun run $(test \"$NODE_ENV\" = 'development' && echo 'dev' || echo 'start')"]
