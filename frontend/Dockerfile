FROM node:24.0.2-alpine3.21 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/

COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile


FROM base AS builder
WORKDIR /app/
COPY --from=deps /app/node_modules/ ./node_modules/
COPY ./ ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app/

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public/ ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static/ ./.next/
COPY ./.env* ./

USER nextjs

EXPOSE 5173

ENV PORT=5173

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
