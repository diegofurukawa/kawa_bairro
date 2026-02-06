import { QuadraService } from '@/lib/services/quadraService'
import { UnidadeService } from '@/lib/services/unidadeService'
import { AvisoService } from '@/lib/services/avisoService'
import { QuadrasView } from '@/components/views/QuadrasView'
import { AvisoCarouselClient } from '@/components/carousel/AvisoCarouselClient'
import type { Quadra, Unidade, Aviso } from '@/types'

async function getData() {
  try {
    const [quadras, unidades, avisos] = await Promise.all([
      QuadraService.findAll(),
      UnidadeService.findAll(),
      AvisoService.findAll()
    ])

    return { quadras, unidades, avisos }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return { quadras: [], unidades: [], avisos: [] }
  }
}

// Forçar Server-Side Rendering
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { quadras, unidades, avisos } = await getData()

  // Filter only Publi avisos for carousel
  const publiAvisos = avisos.filter(a => a.tipo === 'Publi')

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-olive-800">
          Quadras e Unidades
        </h1>
        <p className="text-olive-700">
          Visualize todas as quadras e unidades cadastradas no bairro
        </p>
      </div>

      {/* Carrossel de Publicidade (somente Publi) */}
      {publiAvisos.length > 0 && (
        <div className="-mx-6">
          <AvisoCarouselClient avisos={publiAvisos} />
        </div>
      )}

      <QuadrasView quadras={quadras} unidades={unidades} />
    </div>
  )
}
