'use client'

import * as React from 'react'
import { Search, MapPin, Home, Grid3X3, List, X, BarChart3, LayoutList } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Chip } from '@/components/ui/chip'
import { UnidadeCard } from '@/components/cards/UnidadeCard'
import { UnidadeModal } from '@/components/modals/UnidadeModal'
import { DashboardStats } from '@/components/cards/DashboardStats'
import { cn } from '@/lib/utils'
import { parseJsonArray } from '@/lib/utils/data'
import type { Quadra, Unidade } from '@/types'

export interface QuadrasViewProps {
  quadras: Quadra[]
  unidades: Unidade[]
}

export function QuadrasView({ quadras, unidades }: QuadrasViewProps) {
  
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedQuadras, setSelectedQuadras] = React.useState<string[]>([])
  const [dropdownValue, setDropdownValue] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [selectedUnidade, setSelectedUnidade] = React.useState<Unidade | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [mobileTab, setMobileTab] = React.useState<'stats' | 'lista'>('lista')

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

  // Funções para gerenciar seleção múltipla de quadras
  const toggleQuadra = (quadraName: string) => {
    setSelectedQuadras(prev => {
      if (prev.includes(quadraName)) {
        return prev.filter(name => name !== quadraName)
      } else {
        return [...prev, quadraName]
      }
    })
  }

  const removeQuadra = (quadraName: string) => {
    setSelectedQuadras(prev => prev.filter(name => name !== quadraName))
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedQuadras([])
    setDropdownValue('all')
  }

  // Filtrar unidades baseado na pesquisa e filtros
  const filteredUnidades = React.useMemo(() => {
    const filtered = unidades.filter(unidade => {
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

      const matchesQuadra = selectedQuadras.length === 0 || 
        selectedQuadras.includes(unidade.quadra?.quadra_name || '')

      return matchesSearch && matchesQuadra
    })
    
    return filtered
  }, [unidades, searchTerm, selectedQuadras])

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

  // Contadores de status de vistoria
  const vistoriaStats = React.useMemo(() => {
    const stats = {
      agendado: 0,
      realizado: 0,
      remarcado: 0,
      pendente: 0,
      reprovada: 0
    }
    
    filteredUnidades.forEach(unidade => {
      const status = unidade.vistoria || 'pendente'
      if (status in stats) {
        stats[status as keyof typeof stats]++
      } else {
        stats.pendente++
      }
    })
    
    const total = filteredUnidades.length
    const percentages = {
      agendado: total > 0 ? (stats.agendado / total) * 100 : 0,
      realizado: total > 0 ? (stats.realizado / total) * 100 : 0,
      remarcado: total > 0 ? (stats.remarcado / total) * 100 : 0,
      pendente: total > 0 ? (stats.pendente / total) * 100 : 0,
      reprovada: total > 0 ? (stats.reprovada / total) * 100 : 0
    }
    
    return { ...stats, total, percentages }
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
    vistoria: string | null
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

  // Stats data
  const statsData = {
    totalQuadras: Object.keys(unidadesPorQuadra).length,
    totalUnidades: filteredUnidades.length,
    totalMoradores: totalMoradores,
    totalContatos: totalContatos,
    vistoria: {
      pendente: vistoriaStats.pendente,
      agendado: vistoriaStats.agendado,
      remarcado: vistoriaStats.remarcado,
      realizado: vistoriaStats.realizado,
      reprovada: vistoriaStats.reprovada,
      total: vistoriaStats.total,
      percentages: vistoriaStats.percentages
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Mobile Tabs - Only show on mobile */}
        {isMobile && (
          <div className="flex border border-gray-200 rounded-xl overflow-hidden p-1 bg-gray-50">
            <Button
              variant={mobileTab === 'stats' ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobileTab('stats')}
              className={cn(
                "flex-1 rounded-lg px-4 transition-all duration-200 gap-2",
                mobileTab === 'stats' ? "bg-white shadow-sm text-purple-brand-700" : "text-gray-500"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </Button>
            <Button
              variant={mobileTab === 'lista' ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobileTab('lista')}
              className={cn(
                "flex-1 rounded-lg px-4 transition-all duration-200 gap-2",
                mobileTab === 'lista' ? "bg-white shadow-sm text-purple-brand-700" : "text-gray-500"
              )}
            >
              <LayoutList className="h-4 w-4" />
              Lista
            </Button>
          </div>
        )}

        {/* Mobile Stats View */}
        {isMobile && mobileTab === 'stats' && (
          <DashboardStats stats={statsData} />
        )}

        {/* Lista View Content - Hidden on mobile when stats tab is active */}
        {(!isMobile || mobileTab === 'lista') && (
          <div className="space-y-6">
            {/* Barra de pesquisa */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Campo de pesquisa */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Pesquisar por unidade, quadra, morador ou contato..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:ring-purple-brand-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Filtro de Quadras - Dropdown */}
                <div className="w-full lg:w-64">
                  <Select 
                    value={dropdownValue}
                    onValueChange={(value) => {
                      setDropdownValue(value)
                      if (value === 'all') {
                        setSelectedQuadras([])
                      } else {
                        toggleQuadra(value)
                      }
                    }}
                  >
                    <SelectTrigger className="border-gray-200 rounded-xl">
                      <SelectValue placeholder="Selecionar quadras" />
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
                  onClick={clearAllFilters}
                  className="gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl"
                >
                  <X className="h-4 w-4" />
                  Remover Filtros
                </Button>
              </div>
            </div>

            {/* Chips das Quadras Selecionadas */}
            {selectedQuadras.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Quadras selecionadas ({selectedQuadras.length}):
                  </span>
                  {selectedQuadras.map(quadraName => (
                    <Chip
                      key={quadraName}
                      variant="default"
                      size="sm"
                      onRemove={() => removeQuadra(quadraName)}
                      className="bg-purple-brand-100 text-purple-brand-800 hover:bg-purple-brand-200 border-purple-brand-200 rounded-full"
                    >
                      {quadraName}
                    </Chip>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700 ml-2 rounded-full"
                  >
                    Limpar todas
                  </Button>
                </div>
              </div>
            )}

            {/* Controles de visualização e resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Controles de visualização - Hidden on mobile */}
              {!isMobile && (
                <div className="flex items-center gap-4">
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden p-1 bg-gray-50">
                    <Button
                      variant={viewMode === 'grid' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "rounded-lg px-4 transition-all duration-200",
                        viewMode === 'grid' ? "bg-white shadow-sm text-purple-brand-700" : "text-gray-500"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Grade
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "rounded-lg px-4 transition-all duration-200",
                        viewMode === 'list' ? "bg-white shadow-sm text-purple-brand-700" : "text-gray-500"
                      )}
                    >
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </Button>
                  </div>
                </div>
              )}

              {/* Resultados encontrados */}
              <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
                {filteredUnidades.length} unidade{filteredUnidades.length !== 1 ? 's' : ''} encontrada{filteredUnidades.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-8">
              {Object.keys(unidadesPorQuadra).length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Nenhuma unidade encontrada
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar os filtros ou termo de pesquisa
                  </p>
                </div>
              ) : (
                Object.entries(unidadesPorQuadra).map(([quadraName, unidadesDaQuadra]) => (
                  <div key={quadraName} className="space-y-4">
                    {/* Header da Quadra */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 bg-gradient-to-r from-purple-brand-50/70 to-white rounded-2xl border border-purple-brand-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-brand-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-brand-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {quadraName}
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Chip variant="secondary" className="bg-white border-purple-brand-100 text-purple-brand-700 rounded-full">
                          {unidadesDaQuadra.length} unidade{unidadesDaQuadra.length !== 1 ? 's' : ''}
                        </Chip>
                        <Chip variant="default" className="bg-purple-brand-500 text-white border-none rounded-full">
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
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
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
          </div>
        )}
      </div>

      {/* Sidebar - Stats - Hidden on mobile */}
      <aside className="hidden lg:block lg:col-span-1 space-y-6">
        <div className="lg:sticky lg:top-24">
          <DashboardStats stats={statsData} />
        </div>
      </aside>

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
