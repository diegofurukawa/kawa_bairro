import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface UnidadeData {
  numero: string
  moradores: string[]
}

interface QuadraData {
  nome: string
  unidades: UnidadeData[]
}

function parseCargaFile(filePath: string): QuadraData[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const quadras: QuadraData[] = []
  let currentQuadra: QuadraData | null = null
  
  for (const line of lines) {
    // Verifica se é uma linha de quadra
    if (line.startsWith('QUADRA ')) {
      // Salva a quadra anterior se existir
      if (currentQuadra) {
        quadras.push(currentQuadra)
      }
      
      // Cria nova quadra
      const quadraName = line.replace('QUADRA ', '').trim()
      currentQuadra = {
        nome: quadraName.toUpperCase(),
        unidades: []
      }
    } else if (currentQuadra && line.length > 0) {
      // Processa linha de unidade
      const parts = line.split('\t')
      if (parts.length >= 2) {
        const numero = parts[0].trim()
        const moradoresText = parts[1].trim()
        
        // Separa os moradores por " e " ou " e"
        const moradores = moradoresText
          .split(/ e | e$/)
          .map(m => m.trim())
          .filter(m => m.length > 0)
        
        currentQuadra.unidades.push({
          numero,
          moradores
        })
      }
    }
  }
  
  // Adiciona a última quadra
  if (currentQuadra) {
    quadras.push(currentQuadra)
  }
  
  return quadras
}

async function importCargaData() {
  try {
    console.log('🚀 Iniciando importação dos dados de carga...')
    
    // Verificar se já existem dados para evitar importação duplicada
    const existingQuadras = await prisma.quadra.count()
    const existingUnidades = await prisma.unidade.count()
    
    if (existingQuadras > 0 || existingUnidades > 0) {
      console.log('⚠️ Dados já existem no banco. Pulando importação para evitar duplicação.')
      console.log(`📊 Dados existentes: ${existingQuadras} quadras, ${existingUnidades} unidades`)
      return
    }
    
    console.log('📥 Nenhum dado existente encontrado. Prosseguindo com a importação...')
    
    // Parse do arquivo
    const filePath = path.join(process.cwd(), 'upload', 'carga.txt')
    const quadrasData = parseCargaFile(filePath)
    
    console.log(`📊 Encontradas ${quadrasData.length} quadras`)
    
    // Importar quadras e unidades
    for (const quadraData of quadrasData) {
      console.log(`\n🏘️ Processando quadra: ${quadraData.nome}`)
      
      // Criar quadra
      const quadra = await prisma.quadra.create({
        data: {
          quadra_name: quadraData.nome
        }
      })
      
      console.log(`   ✅ Quadra criada: ${quadra.quadra_name}`)
      
      // Criar unidades
      for (const unidadeData of quadraData.unidades) {
        try {
          // Gerar contatos fictícios baseados nos moradores
          const contatos = unidadeData.moradores.map((_, index) => {
            // Simular telefone
            const telefone = `119${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
            return telefone
          })
          
          await prisma.unidade.create({
            data: {
              unidade_numero: unidadeData.numero,
              quadra_id: quadra.quadra_id,
              mora: JSON.stringify(unidadeData.moradores),
              contato: JSON.stringify(contatos)
            }
          })
          
          console.log(`   ✅ Unidade ${unidadeData.numero}: ${unidadeData.moradores.join(', ')}`)
        } catch (error) {
          console.error(`   ❌ Erro ao criar unidade ${unidadeData.numero}:`, error)
        }
      }
    }
    
    // Estatísticas finais
    const totalQuadras = await prisma.quadra.count()
    const totalUnidades = await prisma.unidade.count()
    const totalMoradores = await prisma.unidade.findMany({
      select: { mora: true }
    }).then(unidades => 
      unidades.reduce((total, unidade) => {
        const moradores = unidade.mora ? JSON.parse(unidade.mora) : []
        return total + moradores.length
      }, 0)
    )
    
    console.log('\n🎉 Importação concluída!')
    console.log(`📊 Estatísticas:`)
    console.log(`   🏘️ Quadras: ${totalQuadras}`)
    console.log(`   🏠 Unidades: ${totalUnidades}`)
    console.log(`   👥 Moradores: ${totalMoradores}`)
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  importCargaData()
    .then(() => {
      console.log('✅ Script executado com sucesso!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Erro:', error)
      process.exit(1)
    })
}

export { importCargaData }
