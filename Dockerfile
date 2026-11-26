# image 
FROM oven/bun:1-alpine

# dir
WORKDIR /app

# install deps copy package and lock for caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# run the app in prod mode
RUN bun install --frozen-lockfile --production