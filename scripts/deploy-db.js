const { PrismaClient } = require('@prisma/client');

async function deployDatabase() {
  // Define DATABASE_URL se não estiver definida
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
  }
  
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    // Testa a conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida!');
    
    // Executa as migrações
    console.log('🔄 Executando migrações...');
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "quadra" (
      "quadra_id" SERIAL PRIMARY KEY,
      "quadra_name" TEXT UNIQUE NOT NULL,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
    );`;
    
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "unidade" (
      "unidade_id" SERIAL PRIMARY KEY,
      "unidade_numero" TEXT UNIQUE NOT NULL,
      "quadra_id" INTEGER NOT NULL,
      "mora" TEXT,
      "contato" TEXT,
      "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("quadra_id") REFERENCES "quadra"("quadra_id") ON DELETE CASCADE
    );`;
    
    console.log('✅ Migrações executadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deployDatabase();
