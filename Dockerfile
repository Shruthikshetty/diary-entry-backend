# image 
FROM oven/bun:1-alpine

# dir
WORKDIR /app

# install deps copy package and lock for caching
COPY package.json bun.lock ./

# install packages --production
RUN bun install --frozen-lockfile --production

# Copy application source code
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["bun", "start"]