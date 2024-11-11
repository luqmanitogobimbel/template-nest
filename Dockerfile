# Stage 1: Base
FROM public.ecr.aws/p6p1b6s9/nodejs:lts-alpine3.19 AS base

# Stage 2: Install dependencies
FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --omit=dev; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# Stage 3: Build the app
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Stage 4: Run the app
FROM base AS runner

ENV NODE_ENV production

COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/src ./src
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 3220

CMD ["node", "dist/main"]