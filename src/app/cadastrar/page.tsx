import { UnidadeFormClient } from '@/components/forms/UnidadeFormClient'
import { ShareButton } from '@/components/ShareButton'
import { QuadraService } from '@/lib/services/quadraService'
import { UnidadeService } from '@/lib/services/unidadeService'
import { Home, Users, MapPin, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

export default async function CadastrarPage() {
  const { quadras, unidades } = await getData()
  
  const totalMoradores = unidades.reduce((total, unidade) => {
    return total + (unidade.mora?.length || 0)
  }, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Home className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-900">
            MeuBairro
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          Jardim das Oliveiras
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Cadastre sua unidade e conecte-se com seus vizinhos. 
          Mantenha-se informado sobre o que acontece no seu bairro.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row gap-4 justify-center items-center">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            Quadras
          </Button>
        </Link>
        <Link href="/cadastrar">
          <Button variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar
          </Button>
        </Link>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        <UnidadeFormClient initialQuadras={quadras} />
      </div>

      {/* Share Section */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Compartilhe com seus vizinhos
        </h2>
        <p className="text-gray-600">
          Ajude a construir uma comunidade mais conectada
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <ShareButton className="mx-auto" />
          <Link href="/">
            <Button className="gap-2">
              Ver todas as quadras
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats - Moved after the "Ver todas as quadras" button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{quadras.length}</p>
              <p className="text-sm text-gray-600">Quadras</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{unidades.length}</p>
              <p className="text-sm text-gray-600">Unidades</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMoradores}</p>
              <p className="text-sm text-gray-600">Moradores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Units */}
      {unidades.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Unidades Cadastradas Recentemente
          </h3>
          <div className="space-y-3">
            {unidades.slice(0, 5).map((unidade) => (
              <div key={unidade.unidade_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Unidade {unidade.unidade_numero}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quadra {unidade.quadra?.quadra_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {unidade.mora?.length || 0} morador(es)
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(unidade.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
