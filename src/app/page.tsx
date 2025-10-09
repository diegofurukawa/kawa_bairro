import { QuadraService } from '@/lib/services/quadraService'
import { UnidadeService } from '@/lib/services/unidadeService'
import { QuadrasView } from '@/components/views/QuadrasView'
import { Home, MapPin, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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

export default async function HomePage() {
  const { quadras, unidades } = await getData()
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Quadras e Unidades
        </h1>
        <p className="text-gray-600">
          Visualize todas as quadras e unidades cadastradas no bairro
        </p>
        
        {/* Navigation Buttons */}
        <div className="flex flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="default" className="gap-2">
              <MapPin className="h-4 w-4" />
              Quadras
            </Button>
          </Link>
          <Link href="/cadastrar">
            <Button variant="secondary" className="gap-2">
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
