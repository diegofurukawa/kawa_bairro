FROM node:20-alpine

# Install required dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

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

# Set database URL for build
ENV DATABASE_URL="file:/app/data/dev.db"

# Initialize database and import data from carga.txt
RUN npm run db:init && npm run db:import

# Build the application
RUN npm run build

# Accept build arguments from .env
ARG EXTERNAL_PORT=3313
ARG INTERNAL_PORT=3313

# Set environment variables
ENV NODE_ENV=production
ENV PORT=${INTERNAL_PORT}
ENV EXTERNAL_PORT=${EXTERNAL_PORT}

# Expose the external port
EXPOSE ${EXTERNAL_PORT}

# Start the application (simplificado)
CMD ["sh", "-c", "echo '🚀 Starting...' && PORT=${EXTERNAL_PORT} npm start"]