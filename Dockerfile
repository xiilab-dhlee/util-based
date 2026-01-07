# syntax=docker/dockerfile:1.4
FROM node:20.18.1-alpine3.20 AS base

# =============================================================================

FROM base AS deps

RUN apk add --no-cache libc6-compat git

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.3 --activate

COPY package.json pnpm-lock.yaml .npmrc ./

RUN --mount=type=secret,id=github_token \
    export GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/" && \
    pnpm install --frozen-lockfile

# =============================================================================

FROM base AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.3 --activate

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN rm -f .npmrc

RUN NODE_OPTIONS=--max_old_space_size=3072 pnpm build

# =============================================================================

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
