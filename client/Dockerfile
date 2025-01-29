# Build React app
FROM node:18.18.0-alpine AS build

WORKDIR /app

COPY client/package.json client/pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY ./client /app

RUN pnpm run build

FROM node:18.18.0-alpine

RUN npm install -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "/app/dist", "-l", "3000"]
