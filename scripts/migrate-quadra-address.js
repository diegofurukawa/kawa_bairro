const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateQuadraAddress() {
  console.log('🚀 Iniciando migração para adicionar campos de endereço à tabela Quadra...')
  
  try {
    // Verificar se os campos já existem
    const existingColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quadra' 
      AND column_name IN ('cep', 'numero', 'endereco', 'complemento', 'bairro', 'cidade', 'estado', 'estado_codigo', 'pais', 'pais_iso')
    `
    
    console.log('📋 Colunas existentes:', existingColumns.map(col => col.column_name))
    
    // Adicionar campos que não existem
    const fieldsToAdd = [
      { name: 'cep', type: 'VARCHAR(20)' },
      { name: 'numero', type: 'VARCHAR(20)' },
      { name: 'endereco', type: 'VARCHAR(200)' },
      { name: 'complemento', type: 'VARCHAR(100)' },
      { name: 'bairro', type: 'VARCHAR(100)' },
      { name: 'cidade', type: 'VARCHAR(100)' },
      { name: 'estado', type: 'VARCHAR(50)' },
      { name: 'estado_codigo', type: 'VARCHAR(2)' },
      { name: 'pais', type: 'VARCHAR(50)' },
      { name: 'pais_iso', type: 'VARCHAR(2)' }
    ]
    
    const existingFieldNames = existingColumns.map(col => col.column_name)
    
    for (const field of fieldsToAdd) {
      if (!existingFieldNames.includes(field.name)) {
        console.log(`➕ Adicionando campo: ${field.name}`)
        await prisma.$executeRawUnsafe(`ALTER TABLE quadra ADD COLUMN ${field.name} ${field.type}`)
      } else {
        console.log(`✅ Campo ${field.name} já existe`)
      }
    }
    
    console.log('✅ Migração concluída com sucesso!')
    
    // Verificar estrutura final
    const finalColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'quadra'
      ORDER BY ordinal_position
    `
    
    console.log('📊 Estrutura final da tabela quadra:')
    finalColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateQuadraAddress()
    .then(() => {
      console.log('🎉 Migração finalizada!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Falha na migração:', error)
      process.exit(1)
    })
}

module.exports = { migrateQuadraAddress }
