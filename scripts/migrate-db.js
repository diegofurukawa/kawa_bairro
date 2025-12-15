const { PrismaClient } = require('@prisma/client');

async function migrateDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Verificando estado do banco de dados...');
    
    // Testa a conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida!');
    
    // Verificar se as tabelas existem
    const tablesExist = await checkTablesExist(prisma);
    
    if (!tablesExist) {
      console.log('🔄 Tabelas não existem. Executando migração inicial...');
      await createInitialTables(prisma);
      console.log('✅ Tabelas criadas com sucesso!');
    } else {
      console.log('✅ Tabelas já existem. Verificando campos...');
      await checkAndAddMissingFields(prisma);
    }
    
    // Verificar se há dados
    const quadraCount = await prisma.quadra.count();
    const unidadeCount = await prisma.unidade.count();
    
    console.log(`📊 Estado atual do banco:`);
    console.log(`   🏘️ Quadras: ${quadraCount}`);
    console.log(`   🏠 Unidades: ${unidadeCount}`);
    
    if (quadraCount === 0 && unidadeCount === 0) {
      console.log('📥 Banco vazio. Execute "yarn db:import" para importar dados iniciais.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createInitialTables(prisma) {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "quadra" (
    "quadra_id" SERIAL PRIMARY KEY,
    "quadra_name" TEXT UNIQUE NOT NULL,
    "cep" TEXT,
    "numero" TEXT,
    "endereco" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "estado_codigo" TEXT,
    "pais" TEXT,
    "pais_iso" TEXT,
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
}

async function checkAndAddMissingFields(prisma) {
  try {
    // Verificar se os campos de endereço existem na tabela quadra
    await prisma.$queryRaw`SELECT "cep" FROM "quadra" LIMIT 1`;
    console.log('✅ Campos de endereço já existem na tabela quadra');
  } catch (error) {
    console.log('🔄 Adicionando campos de endereço à tabela quadra...');
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "cep" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "numero" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "endereco" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "complemento" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "bairro" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "cidade" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "estado" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "estado_codigo" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "pais" TEXT`;
    await prisma.$executeRaw`ALTER TABLE "quadra" ADD COLUMN IF NOT EXISTS "pais_iso" TEXT`;
    console.log('✅ Campos de endereço adicionados com sucesso!');
  }
}

async function checkTablesExist(prisma) {
  try {
    // Tenta fazer uma query simples para verificar se as tabelas existem
    await prisma.$queryRaw`SELECT 1 FROM "quadra" LIMIT 1`;
    await prisma.$queryRaw`SELECT 1 FROM "unidade" LIMIT 1`;
    return true;
  } catch (error) {
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('✅ Migração concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na migração:', error);
      process.exit(1);
    });
}

module.exports = { migrateDatabase };
