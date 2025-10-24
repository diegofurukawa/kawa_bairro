import { QuadraService } from '@/lib/services/quadraService'
import { UnidadeService } from '@/lib/services/unidadeService'
import { QuadrasView } from '@/components/views/QuadrasView'
import { Home, MapPin, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Quadra, Unidade } from '@/types'

async function getData() {
  try {
    console.log('🔍 [HomePage] Carregando dados...')
    console.log('🔍 [HomePage] DATABASE_URL:', process.env.DATABASE_URL)
    
    const [quadras, unidades] = await Promise.all([
      QuadraService.findAll(),
      UnidadeService.findAll()
    ])
    
    console.log(`📊 [HomePage] Dados carregados:`, {
      quadras: quadras.length,
      unidades: unidades.length,
      quadrasData: quadras.map(q => ({ id: q.quadra_id, nome: q.quadra_name })),
      unidadesData: unidades.map(u => ({ id: u.unidade_id, numero: u.unidade_numero, quadra: u.quadra?.quadra_name }))
    })
    
    // Log adicional para debug
    console.log('🔍 [HomePage] Primeira quadra:', quadras[0])
    console.log('🔍 [HomePage] Primeira unidade:', unidades[0])
    
    return { quadras, unidades }
  } catch (error) {
    console.error('❌ [HomePage] Erro ao carregar dados:', error)
    console.error('❌ [HomePage] Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return { quadras: [], unidades: [] }
  }
}

// Forçar Server-Side Rendering
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  console.log('🔍 [HomePage] Iniciando renderização...')
  
  const { quadras, unidades } = await getData()
  
  // Log adicional para debug no servidor
  console.log('🔍 [HomePage] Renderizando com dados:', {
    quadrasCount: quadras.length,
    unidadesCount: unidades.length
  })
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-olive-800">
          Quadras e Unidades
        </h1>
        <p className="text-olive-700">
          Visualize todas as quadras e unidades cadastradas no bairro
        </p>


        {/* Navigation Buttons */}
        <div className="flex flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="default" className="gap-2 bg-olive-600 hover:bg-olive-700 text-white">
              <MapPin className="h-4 w-4" />
              Quadras
            </Button>
          </Link>
          <Link href="/cadastrar">
            <Button variant="secondary" className="gap-2 bg-purple-brand-500 hover:bg-purple-brand-600 text-white">
              <Plus className="h-4 w-4" />
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>

      <QuadrasView quadras={quadras} unidades={unidades} />
    </div>
  )
}
