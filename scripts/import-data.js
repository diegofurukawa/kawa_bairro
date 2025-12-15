const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

function parseCargaFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  const quadras = []
  let currentQuadra = null
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    
    // Ignora linhas vazias, cabeçalhos e linhas de legenda
    if (line.length === 0 || 
        line.startsWith('Lista de') || 
        line.startsWith('Última atualização') ||
        line === '❌ Vistoria Reprovada' ||
        line === '✅ Vistoria Aprovada') {
      continue
    }
    
    // Verifica se é uma linha de quadra (pode começar com * ou QUADRA)
    const quadraMatch = line.match(/^\*?(?:QUADRA\s+)?([A-Z0-9]+)\*?$/i)
    if (quadraMatch) {
      // Salva a quadra anterior se existir
      if (currentQuadra) {
        quadras.push(currentQuadra)
      }
      
      // Cria nova quadra
      const quadraName = quadraMatch[1].toUpperCase()
      currentQuadra = {
        nome: `QUADRA - ${quadraName}`,
        unidades: []
      }
    } else if (currentQuadra && line.length > 0) {
      // Processa linha de unidade - pode ter tab ou espaço
      let numero = ''
      let moradoresText = ''
      let vistoria = null
      
      // Extrai status da vistoria (✅ ou ❌) do final da linha
      // Procura pelo primeiro emoji encontrado (prioriza ✅ sobre ❌ se ambos existirem)
      const hasAprovada = line.includes('✅')
      const hasReprovada = line.includes('❌')
      
      if (hasAprovada || hasReprovada) {
        // Se tem ambos, prioriza o último (mais à direita)
        if (hasAprovada && hasReprovada) {
          const lastAprovada = line.lastIndexOf('✅')
          const lastReprovada = line.lastIndexOf('❌')
          vistoria = lastAprovada > lastReprovada ? 'realizado' : 'reprovada'
        } else {
          vistoria = hasAprovada ? 'realizado' : 'reprovada'
        }
        // Remove o emoji e qualquer texto relacionado do final (palavras como "Reprovada", "Aprovada", etc)
        line = line.replace(/[✅❌].*$/, '').replace(/\b(Reprovada|Aprovada|reprovado|aprovado)\b/gi, '').trim()
      }
      
      // Verifica se tem tab
      if (line.includes('\t')) {
        const parts = line.split('\t')
        numero = parts[0].trim()
        moradoresText = parts[1] ? parts[1].trim() : ''
      } else {
        // Se não tem tab, tenta separar por espaço
        const match = line.match(/^([A-Z0-9\-\s]+?)\s+(.+)$/)
        if (match) {
          numero = match[1].trim().replace(/\s+/g, '') // Remove espaços extras do número
          moradoresText = match[2].trim()
        }
      }
      
      // Valida se o número da unidade tem formato válido (deve ter pelo menos um número)
      const isValidNumero = numero && /[0-9]/.test(numero) && numero.length >= 2
      
      if (isValidNumero && moradoresText) {
        // Remove qualquer emoji ou texto de status que possa ter sobrado
        moradoresText = moradoresText.replace(/[✅❌].*$/, '').trim()
        
        // Separa os moradores por " e " ou " e"
        const moradores = moradoresText
          .split(/ e | e$/)
          .map(m => m.trim())
          .filter(m => m.length > 0 && !m.match(/^[✅❌]/))
        
        if (moradores.length > 0) {
          currentQuadra.unidades.push({
            numero,
            moradores,
            vistoria
          })
        }
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
      
      // Buscar ou criar quadra
      let quadra = await prisma.quadra.findUnique({
        where: { quadra_name: quadraData.nome }
      })
      
      if (!quadra) {
        quadra = await prisma.quadra.create({
          data: {
            quadra_name: quadraData.nome
          }
        })
        console.log(`   ✅ Quadra criada: ${quadra.quadra_name}`)
      } else {
        console.log(`   ℹ️ Quadra já existe: ${quadra.quadra_name}`)
      }
      
      // Criar ou atualizar unidades
      for (const unidadeData of quadraData.unidades) {
        try {
          // Verificar se a unidade já existe
          const existingUnidade = await prisma.unidade.findUnique({
            where: { unidade_numero: unidadeData.numero }
          })
          
          if (existingUnidade) {
            // Unidade já existe - preservar o que está no banco
            const vistoriaToUpdate = existingUnidade.vistoria 
              ? null // Se já tem vistoria no banco, não atualizar
              : unidadeData.vistoria // Se não tem, usar o do arquivo
            
            if (vistoriaToUpdate !== null) {
              await prisma.unidade.update({
                where: { unidade_numero: unidadeData.numero },
                data: {
                  vistoria: vistoriaToUpdate
                }
              })
              console.log(`   🔄 Unidade ${unidadeData.numero} atualizada (vistoria: ${vistoriaToUpdate || 'null'})`)
            } else {
              console.log(`   ⏭️ Unidade ${unidadeData.numero} já existe com vistoria - preservando valor do banco`)
            }
          } else {
            // Criar nova unidade
            await prisma.unidade.create({
              data: {
                unidade_numero: unidadeData.numero,
                quadra_id: quadra.quadra_id,
                mora: JSON.stringify(unidadeData.moradores),
                contato: JSON.stringify([]), // Array vazio - sem contatos fictícios
                vistoria: unidadeData.vistoria
              }
            })
            
            const vistoriaInfo = unidadeData.vistoria ? ` (vistoria: ${unidadeData.vistoria})` : ''
            console.log(`   ✅ Unidade ${unidadeData.numero}: ${unidadeData.moradores.join(', ')}${vistoriaInfo}`)
          }
        } catch (error) {
          console.error(`   ❌ Erro ao processar unidade ${unidadeData.numero}:`, error)
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

// Executar
importCargaData()
  .then(() => {
    console.log('✅ Script executado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
