'use client'

import * as React from 'react'
import { Search, MapPin, Home, Users, Phone, Grid3X3, List, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Chip } from '@/components/ui/chip'
import { UnidadeCard } from '@/components/cards/UnidadeCard'
import { UnidadeModal } from '@/components/modals/UnidadeModal'
import { cn } from '@/lib/utils'
import { parseJsonArray } from '@/lib/utils/data'
import type { Quadra, Unidade } from '@/types'

export interface QuadrasViewProps {
  quadras: Quadra[]
  unidades: Unidade[]
}

export function QuadrasView({ quadras, unidades }: QuadrasViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedQuadra, setSelectedQuadra] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [selectedUnidade, setSelectedUnidade] = React.useState<Unidade | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Force list view on mobile
  React.useEffect(() => {
    if (isMobile) {
      setViewMode('list')
    }
  }, [isMobile])

  // Filtrar unidades baseado na pesquisa e filtros
  const filteredUnidades = React.useMemo(() => {
    return unidades.filter(unidade => {
      // Converter dados JSON para arrays se necessário
      const moradores = parseJsonArray(unidade.mora)
      const contatos = parseJsonArray(unidade.contato)

      const matchesSearch = searchTerm === '' || 
        unidade.unidade_numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidade.quadra?.quadra_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moradores.some((morador: string) => 
          morador.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        contatos.some((contato: string) => 
          contato.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesQuadra = selectedQuadra === 'all' || 
        unidade.quadra?.quadra_name === selectedQuadra

      return matchesSearch && matchesQuadra
    })
  }, [unidades, searchTerm, selectedQuadra])

  // Agrupar unidades por quadra
  const unidadesPorQuadra = React.useMemo(() => {
    const grouped: { [key: string]: Unidade[] } = {}
    
    filteredUnidades.forEach(unidade => {
      const quadraName = unidade.quadra?.quadra_name || 'Sem quadra'
      if (!grouped[quadraName]) {
        grouped[quadraName] = []
      }
      grouped[quadraName].push(unidade)
    })

    return grouped
  }, [filteredUnidades])

  const totalMoradores = React.useMemo(() => {
    return filteredUnidades.reduce((total, unidade) => {
      const moradores = parseJsonArray(unidade.mora)
      return total + moradores.length
    }, 0)
  }, [filteredUnidades])

  const totalContatos = React.useMemo(() => {
    return filteredUnidades.reduce((total, unidade) => {
      const contatos = parseJsonArray(unidade.contato)
      return total + contatos.length
    }, 0)
  }, [filteredUnidades])

  // Funções do modal
  const handleViewUnidade = (unidade: Unidade) => {
    setSelectedUnidade(unidade)
    setIsModalOpen(true)
  }

  const handleEditUnidade = (unidade: Unidade) => {
    setSelectedUnidade(unidade)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUnidade(null)
  }

  const handleSaveUnidade = async (data: {
    unidade_numero: string
    quadra_id: number
    mora: string[]
    contato: string[]
  }) => {
    try {
      const response = await fetch(`/api/unidades/${selectedUnidade?.unidade_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar unidade')
      }

      // Recarregar a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      console.error('Erro ao salvar unidade:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas - Hidden on mobile */}
      {!isMobile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xl font-bold text-gray-900">{Object.keys(unidadesPorQuadra).length}</p>
                <p className="text-sm text-gray-600">Quadras</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xl font-bold text-gray-900">{filteredUnidades.length}</p>
                <p className="text-sm text-gray-600">Unidades</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xl font-bold text-gray-900">{totalMoradores}</p>
                <p className="text-sm text-gray-600">Moradores</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-xl font-bold text-gray-900">{totalContatos}</p>
                <p className="text-sm text-gray-600">Contatos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de pesquisa */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Campo de pesquisa */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por unidade, quadra, morador ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro de Quadra */}
          <div className="w-full lg:w-64">
            <Select value={selectedQuadra} onValueChange={setSelectedQuadra}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as quadras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as quadras</SelectItem>
                {quadras.map(quadra => (
                  <SelectItem key={quadra.quadra_id} value={quadra.quadra_name}>
                    {quadra.quadra_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão Remover Filtros */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedQuadra('all')
            }}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Remover Filtros
          </Button>
        </div>
      </div>


      {/* Controles de visualização e resultados */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Controles de visualização - Hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              {viewMode === 'grid' ? 'Visualização em grade' : 'Visualização em lista'}
            </div>
          </div>
        )}

        {/* Resultados encontrados */}
        <div className="text-sm text-gray-500">
          {filteredUnidades.length} unidade{filteredUnidades.length !== 1 ? 's' : ''} encontrada{filteredUnidades.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Resultados */}
      <div className="space-y-6">
        {Object.keys(unidadesPorQuadra).length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma unidade encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de pesquisa
            </p>
          </div>
        ) : (
          Object.entries(unidadesPorQuadra).map(([quadraName, unidadesDaQuadra]) => (
            <div key={quadraName} className="space-y-4">
              {/* Header da Quadra */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {quadraName}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Chip variant="secondary" size="sm">
                    {unidadesDaQuadra.length} unidade{unidadesDaQuadra.length !== 1 ? 's' : ''}
                  </Chip>
                  <Chip variant="default" size="sm">
                    {unidadesDaQuadra.reduce((total, unidade) => {
                      const moradores = parseJsonArray(unidade.mora)
                      return total + moradores.length
                    }, 0)} morador{unidadesDaQuadra.reduce((total, unidade) => {
                      const moradores = parseJsonArray(unidade.mora)
                      return total + moradores.length
                    }, 0) !== 1 ? 'es' : ''}
                  </Chip>
                </div>
              </div>
              
              {/* Grid de Unidades */}
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              }>
                {unidadesDaQuadra.map(unidade => (
                  <UnidadeCard 
                    key={unidade.unidade_id} 
                    unidade={unidade}
                    variant={viewMode}
                    onView={handleViewUnidade}
                    onEdit={handleEditUnidade}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <UnidadeModal
        unidade={selectedUnidade}
        quadras={quadras}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUnidade}
      />
    </div>
  )
}
