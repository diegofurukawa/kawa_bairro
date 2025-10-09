import { QuadraService } from '@/lib/services/quadraService'
import { UnidadeService } from '@/lib/services/unidadeService'
import { QuadrasView } from '@/components/views/QuadrasView'
import type { Quadra, Unidade } from '@/types'

async function getData() {
  try {
    const [quadras, unidades] = await Promise.all([
      QuadraService.findAll(),
      UnidadeService.findAll()
    ])
    
    return { quadras, unidades }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return { quadras: [], unidades: [] }
  }
}

export default async function QuadrasPage() {
  const { quadras, unidades } = await getData()
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Quadras e Unidades
        </h1>
        <p className="text-gray-600">
          Visualize todas as quadras e unidades cadastradas no bairro
        </p>
      </div>

      <QuadrasView quadras={quadras} unidades={unidades} />
    </div>
  )
}
