FROM mcr.microsoft.com/playwright:v1.58.2-jammy

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

CMD ["node", "dist/multi-account-runner.js"]
