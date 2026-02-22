FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build

# Start the application
CMD ["pnpm", "start"]
