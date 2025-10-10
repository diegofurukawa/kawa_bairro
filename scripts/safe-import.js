const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseCargaFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const quadras = [];
  let currentQuadra = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Verifica se é uma linha de quadra
    if (line.startsWith('QUADRA ')) {
      // Salva a quadra anterior se existir
      if (currentQuadra) {
        quadras.push(currentQuadra);
      }
      
      // Cria nova quadra
      const quadraName = line.replace('QUADRA ', '').trim();
      currentQuadra = {
        nome: `QUADRA - ${quadraName.toUpperCase()}`,
        unidades: []
      };
    } else if (currentQuadra && line.length > 0 && !line.startsWith('QUADRA ')) {
      // Processa linha de unidade - pode ter tab ou espaço
      let numero = '';
      let moradoresText = '';
      
      // Verifica se tem tab
      if (line.includes('\t')) {
        const parts = line.split('\t');
        numero = parts[0].trim();
        moradoresText = parts[1] ? parts[1].trim() : '';
      } else {
        // Se não tem tab, tenta separar por espaço
        const match = line.match(/^([A-Z0-9\-]+)\s+(.+)$/);
        if (match) {
          numero = match[1].trim();
          moradoresText = match[2].trim();
        }
      }
      
      if (numero && moradoresText) {
        // Separa os moradores por " e " ou " e"
        const moradores = moradoresText
          .split(/ e | e$/)
          .map(m => m.trim())
          .filter(m => m.length > 0);
        
        currentQuadra.unidades.push({
          numero,
          moradores
        });
      }
    }
  }
  
  // Adiciona a última quadra
  if (currentQuadra) {
    quadras.push(currentQuadra);
  }
  
  return quadras;
}

async function safeImportData() {
  try {
    console.log('🚀 Iniciando importação segura dos dados...');
    
    // Verificar se já existem dados
    const existingQuadras = await prisma.quadra.count();
    const existingUnidades = await prisma.unidade.count();
    
    if (existingQuadras > 0 || existingUnidades > 0) {
      console.log('⚠️ Dados já existem no banco!');
      console.log(`📊 Dados existentes: ${existingQuadras} quadras, ${existingUnidades} unidades`);
      console.log('🛡️ Importação cancelada para preservar dados existentes.');
      console.log('💡 Use "yarn db:import --force" para forçar a importação (apagará dados existentes).');
      return;
    }
    
    console.log('📥 Banco vazio. Prosseguindo com a importação...');
    
    // Parse do arquivo
    const filePath = path.join(process.cwd(), 'upload', 'carga.txt');
    
    if (!fs.existsSync(filePath)) {
      console.log('⚠️ Arquivo carga.txt não encontrado. Pulando importação.');
      return;
    }
    
    const quadrasData = parseCargaFile(filePath);
    console.log(`📊 Encontradas ${quadrasData.length} quadras no arquivo`);
    
    // Importar quadras e unidades
    for (const quadraData of quadrasData) {
      console.log(`\n🏘️ Processando quadra: ${quadraData.nome}`);
      
      // Criar quadra
      const quadra = await prisma.quadra.create({
        data: {
          quadra_name: quadraData.nome
        }
      });
      
      console.log(`   ✅ Quadra criada: ${quadra.quadra_name}`);
      
      // Criar unidades
      for (const unidadeData of quadraData.unidades) {
        try {
          await prisma.unidade.create({
            data: {
              unidade_numero: unidadeData.numero,
              quadra_id: quadra.quadra_id,
              mora: JSON.stringify(unidadeData.moradores),
              contato: JSON.stringify([]) // Array vazio - sem contatos fictícios
            }
          });
          
          console.log(`   ✅ Unidade ${unidadeData.numero}: ${unidadeData.moradores.join(', ')}`);
        } catch (error) {
          console.error(`   ❌ Erro ao criar unidade ${unidadeData.numero}:`, error);
        }
      }
    }
    
    // Estatísticas finais
    const totalQuadras = await prisma.quadra.count();
    const totalUnidades = await prisma.unidade.count();
    const totalMoradores = await prisma.unidade.findMany({
      select: { mora: true }
    }).then(unidades => 
      unidades.reduce((total, unidade) => {
        const moradores = unidade.mora ? JSON.parse(unidade.mora) : [];
        return total + moradores.length;
      }, 0)
    );
    
    console.log('\n🎉 Importação concluída!');
    console.log(`📊 Estatísticas:`);
    console.log(`   🏘️ Quadras: ${totalQuadras}`);
    console.log(`   🏠 Unidades: ${totalUnidades}`);
    console.log(`   👥 Moradores: ${totalMoradores}`);
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
safeImportData()
  .then(() => {
    console.log('✅ Script executado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
