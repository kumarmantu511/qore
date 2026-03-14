FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY dashboard ./dashboard

RUN npm run build

ENV NODE_ENV=production
ENV RENDER=true
ENV BROWSER_HEADLESS=true
ENV BROWSER_SLOW_MO=0
ENV STORAGE_BASE_DIR=/var/data/qorechain-bot

CMD ["npm", "run", "worker"]
