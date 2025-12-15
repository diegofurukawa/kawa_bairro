const { execSync } = require('child_process');

async function deployDatabase() {
  try {
    console.log('🔄 Configurando banco de dados...');
    
    // Define DATABASE_URL para SQLite local
    process.env.DATABASE_URL = 'file:./dev.db';
    
    console.log('🔄 Executando prisma db push...');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
    });
    
    console.log('🔄 Importando dados do arquivo carga.txt...');
    execSync('npm run db:import', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: 'file:./dev.db' }
    });
    
    console.log('✅ Banco de dados configurado e dados importados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error.message);
    process.exit(1);
  }
}

deployDatabase();
