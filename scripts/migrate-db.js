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
      
      console.log('✅ Tabelas criadas com sucesso!');
    } else {
      console.log('✅ Tabelas já existem. Nenhuma migração necessária.');
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
