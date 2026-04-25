# =============================================================================
# STAGE 1: Dependencies
# =============================================================================
FROM node:20-alpine AS deps

# Install required dependencies for Prisma and build tools
RUN apk add --no-cache openssl libc6-compat python3 make g++

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY prisma ./prisma

# Install dependencies without lifecycle scripts; Prisma Client is generated explicitly below.
RUN yarn install --frozen-lockfile --production=false --network-timeout 300000 --non-interactive --ignore-scripts
RUN yarn prisma generate

# =============================================================================
# STAGE 2: Builder
# =============================================================================
FROM node:20-alpine AS builder

# Install required dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/yarn.lock ./
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Build the application
RUN yarn build

# =============================================================================
# STAGE 3: Runtime
# =============================================================================
FROM node:20-alpine AS runtime

ARG FRONTEND_PORT

# Install minimal runtime dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Ensure upload directory exists
RUN mkdir -p /app/upload && chown nextjs:nodejs /app/upload

# Switch to non-root user
USER nextjs

# Set environment
ENV NODE_ENV=production
ENV PORT=${FRONTEND_PORT}
ENV HOSTNAME="0.0.0.0"

EXPOSE ${FRONTEND_PORT}

# Start the application
CMD ["node", "server.js"]
