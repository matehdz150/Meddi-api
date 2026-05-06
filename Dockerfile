FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["pnpm", "run", "start:dev"]