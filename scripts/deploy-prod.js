const { execSync } = require('child_process');

async function deployProduction() {
  try {
    console.log('🔄 Configurando banco PostgreSQL para produção...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não encontrada!');
      console.log('💡 Configure a variável DATABASE_URL com sua string PostgreSQL');
      console.log('💡 Exemplo: postgresql://user:pass@host:5432/db');
      process.exit(1);
    }
    
    console.log('🔄 Executando migrações no PostgreSQL...');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: process.env
    });
    
    console.log('🔄 Importando dados do arquivo carga.txt...');
    execSync('npm run db:import', { 
      stdio: 'inherit',
      env: process.env
    });
    
    console.log('✅ Banco PostgreSQL configurado e dados importados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar PostgreSQL:', error.message);
    process.exit(1);
  }
}

deployProduction();
