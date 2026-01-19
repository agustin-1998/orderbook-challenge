# Dockerfile

# ===== DEPENDENCIES =====
FROM node:20-alpine AS deps

# Variables de entorno necesarias para la app
ENV NEXT_PUBLIC_WS_BASE_URL="wss://stream.binance.com:9443/ws/"
ENV NEXT_PUBLIC_API_EXCHANGE_INFO_URL="https://api.binance.com/api/v3/exchangeInfo"

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

# ===== Application Build =====
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY .  .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ===== Production Image =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static/

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]