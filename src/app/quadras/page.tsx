'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuadraForm } from '@/components/forms/QuadraForm'
import { cn } from '@/lib/utils'
import type { Quadra, CreateQuadraInput, UpdateQuadraInput } from '@/types'

export default function QuadrasPage() {
  const [quadras, setQuadras] = React.useState<Quadra[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingQuadra, setEditingQuadra] = React.useState<Quadra | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Carregar quadras
  const loadQuadras = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quadras')
      const data = await response.json()
      
      if (data.success) {
        setQuadras(data.data)
      } else {
        console.error('Erro ao carregar quadras:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar quadras:', error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar quadras na montagem do componente
  React.useEffect(() => {
    loadQuadras()
  }, [])

  // Filtrar quadras por termo de busca
  const filteredQuadras = quadras.filter(quadra =>
    quadra.quadra_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quadra.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quadra.bairro?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Criar nova quadra
  const handleCreateQuadra = async (data: CreateQuadraInput | UpdateQuadraInput) => {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/quadras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (result.success) {
        await loadQuadras()
        setShowForm(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Erro ao criar quadra:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Atualizar quadra
  const handleUpdateQuadra = async (data: CreateQuadraInput | UpdateQuadraInput) => {
    if (!editingQuadra) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/quadras/${editingQuadra.quadra_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (result.success) {
        await loadQuadras()
        setEditingQuadra(null)
        setShowForm(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar quadra:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Deletar quadra
  const handleDeleteQuadra = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta quadra?')) return

    try {
      const response = await fetch(`/api/quadras/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        await loadQuadras()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Erro ao deletar quadra:', error)
    }
  }

  // Iniciar edição
  const handleEditQuadra = (quadra: Quadra) => {
    setEditingQuadra(quadra)
    setShowForm(true)
  }

  // Cancelar edição/criação
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingQuadra(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando quadras...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Quadras</h1>
            <p className="text-muted-foreground">
              Gerencie as quadras e seus endereços
            </p>
          </div>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto"
          >
            Nova Quadra
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingQuadra ? 'Editar Quadra' : 'Nova Quadra'}
            </h2>
            
            <QuadraForm
              quadra={editingQuadra || undefined}
              onSubmit={editingQuadra ? handleUpdateQuadra : handleCreateQuadra}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Busca */}
        <div className="space-y-4">
          <Input
            placeholder="Buscar por nome, cidade ou bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Lista de Quadras */}
        <div className="space-y-4">
          {filteredQuadras.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhuma quadra encontrada' : 'Nenhuma quadra cadastrada'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQuadras.map((quadra) => (
                <div key={quadra.quadra_id} className="bg-card border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{quadra.quadra_name}</h3>
                      
                      {/* Endereço completo */}
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        {quadra.endereco && (
                          <div>
                            {quadra.endereco}
                            {quadra.numero && `, ${quadra.numero}`}
                            {quadra.complemento && ` - ${quadra.complemento}`}
                          </div>
                        )}
                        
                        {quadra.bairro && (
                          <div>{quadra.bairro}</div>
                        )}
                        
                        <div>
                          {quadra.cidade && quadra.estado && (
                            `${quadra.cidade} - ${quadra.estado}`
                          )}
                          {quadra.cep && ` - ${quadra.cep}`}
                        </div>
                        
                        {quadra.pais && (
                          <div>{quadra.pais}</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuadra(quadra)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuadra(quadra.quadra_id)}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}