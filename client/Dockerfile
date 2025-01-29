# Use Node.js image for building
FROM node:18.18.0-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm

# Generate pnpm-lock.yaml if it doesn't exist
RUN if [ ! -f pnpm-lock.yaml ]; then pnpm install; fi

RUN pnpm install

COPY . .

RUN pnpm run build

# Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]