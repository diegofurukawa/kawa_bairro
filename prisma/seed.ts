import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar quadras iniciais
  const quadras = [
    { quadra_name: 'QUADRA A' },
    { quadra_name: 'QUADRA B' },
    { quadra_name: 'QUADRA C' },
    { quadra_name: 'QUADRA D' },
    { quadra_name: 'QUADRA E' },
  ]

  for (const quadra of quadras) {
    await prisma.quadra.upsert({
      where: { quadra_name: quadra.quadra_name },
      update: {},
      create: quadra,
    })
  }

  console.log('✅ Quadras criadas com sucesso!')

  // Buscar quadras criadas para usar nos relacionamentos
  const quadrasCriadas = await prisma.quadra.findMany()

  // Criar algumas unidades de exemplo
  const unidades = [
    {
      unidade_numero: '101',
      quadra_id: quadrasCriadas[0].quadra_id,
      mora: JSON.stringify(['João Silva', 'Maria Silva']),
      contato: JSON.stringify(['11999999999', 'joao@email.com']),
    },
    {
      unidade_numero: '102',
      quadra_id: quadrasCriadas[0].quadra_id,
      mora: JSON.stringify(['Pedro Santos']),
      contato: JSON.stringify(['11888888888']),
    },
    {
      unidade_numero: '201',
      quadra_id: quadrasCriadas[1].quadra_id,
      mora: JSON.stringify(['Ana Costa', 'Carlos Costa', 'Lucas Costa']),
      contato: JSON.stringify(['11777777777', 'ana@email.com']),
    },
  ]

  for (const unidade of unidades) {
    await prisma.unidade.upsert({
      where: { unidade_numero: unidade.unidade_numero },
      update: {},
      create: unidade,
    })
  }

  console.log('✅ Unidades de exemplo criadas com sucesso!')
  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
