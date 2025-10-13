FROM node:20-alpine

# Install required dependencies for Prisma and PostgreSQL
RUN apk add --no-cache openssl libc6-compat postgresql-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema first (needed for postinstall)
COPY prisma ./prisma

# Install dependencies (this will run prisma generate via postinstall)
RUN npm install

# Copy rest of source code
COPY . .

# Ensure upload directory exists and copy carga.txt
RUN mkdir -p /app/upload
COPY upload/carga.txt /app/upload/carga.txt

# Database URL will be set via ARG and ENV from docker-compose

# Initialize database and import data from carga.txt
# RUN npm run db:init && npm run db:import
# RUN npx prisma db push && yarn db:init && yarn db:import

# Build the application
RUN yarn build

# Accept build arguments from .env
ARG EXTERNAL_PORT=3313
ARG INTERNAL_PORT=3313
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG POSTGRES_SSL=false
ARG DATABASE_URL

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${INTERNAL_PORT}
ENV EXTERNAL_PORT=${EXTERNAL_PORT}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_SSL=${POSTGRES_SSL}
ENV DATABASE_URL=${DATABASE_URL}

# Expose the external port
EXPOSE ${EXTERNAL_PORT}

# Create startup script for migrations
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting application..."' >> /app/start.sh && \
    echo 'echo "🔄 Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'npx prisma db push --accept-data-loss' >> /app/start.sh && \
    echo 'echo "✅ Database migrations completed!"' >> /app/start.sh && \
    echo 'echo "🔄 Running custom migrations..."' >> /app/start.sh && \
    echo 'node scripts/migrate-db.js' >> /app/start.sh && \
    echo 'echo "✅ Custom migrations completed!"' >> /app/start.sh && \
    echo 'echo "🚀 Starting application server..."' >> /app/start.sh && \
    echo 'yarn start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application with automatic migrations
CMD ["/app/start.sh"]