import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Set default DATABASE_URL for development if not set
if (!process.env.DATABASE_URL) {
  console.log('⚠️ [Prisma] DATABASE_URL não definida, usando SQLite local')
  process.env.DATABASE_URL = 'file:./data/dev.db'
}

console.log('🔍 [Prisma] DATABASE_URL configurada:', process.env.DATABASE_URL)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
