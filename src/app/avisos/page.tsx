'use client'

import * as React from 'react'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AvisoCard } from '@/components/cards/AvisoCard'
import { AvisoForm } from '@/components/forms/AvisoForm'
import type { Aviso, CreateAvisoInput, UpdateAvisoInput } from '@/types'

export default function AvisosPage() {
  const [avisos, setAvisos] = React.useState<Aviso[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [editingAviso, setEditingAviso] = React.useState<Aviso | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Carregar avisos
  const fetchAvisos = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/avisos')
      const data = await response.json()

      if (data.success) {
        setAvisos(data.data)
      } else {
        setError('Erro ao carregar avisos')
      }
    } catch (error) {
      console.error('Erro ao carregar avisos:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAvisos()
  }, [fetchAvisos])

  // Manipular submit (criar ou atualizar)
  const handleSubmit = async (data: CreateAvisoInput | UpdateAvisoInput) => {
    try {
      setIsSubmitting(true)

      if (editingAviso) {
        // Atualizar
        const response = await fetch(`/api/avisos/${editingAviso.aviso_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (result.success) {
          setEditingAviso(null)
          await fetchAvisos()
        } else {
          alert('Erro ao atualizar aviso: ' + result.error)
        }
      } else {
        // Criar
        const response = await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (result.success) {
          setShowForm(false)
          await fetchAvisos()
        } else {
          alert('Erro ao criar aviso: ' + result.error)
        }
      }
    } catch (error) {
      console.error('Erro ao salvar aviso:', error)
      alert('Erro ao salvar aviso')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Deletar aviso
  const handleDelete = async (aviso: Aviso) => {
    if (!confirm(`Deseja realmente deletar o aviso "${aviso.titulo}"?`)) return

    try {
      const response = await fetch(`/api/avisos/${aviso.aviso_id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        await fetchAvisos()
      } else {
        alert('Erro ao deletar aviso: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao deletar aviso:', error)
      alert('Erro ao deletar aviso')
    }
  }

  // Toggle fixado
  const handleTogglePin = async (aviso: Aviso) => {
    try {
      const response = await fetch(`/api/avisos/${aviso.aviso_id}/toggle-pin`, {
        method: 'PATCH'
      })

      const result = await response.json()

      if (result.success) {
        await fetchAvisos()
      } else {
        alert('Erro ao fixar/desafixar aviso: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao fixar/desafixar aviso:', error)
      alert('Erro ao fixar/desafixar aviso')
    }
  }

  const handleEdit = (aviso: Aviso) => {
    setEditingAviso(aviso)
    setShowForm(false)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingAviso(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mural de Avisos</h1>
              <p className="text-gray-600 mt-1">
                Compartilhe informações importantes com a comunidade
              </p>
            </div>
            {!showForm && !editingAviso && (
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Aviso
              </Button>
            )}
          </div>
        </div>

        {/* Formulário */}
        {(showForm || editingAviso) && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingAviso ? 'Editar Aviso' : 'Novo Aviso'}
            </h2>
            <AvisoForm
              aviso={editingAviso || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Avisos */}
        {!isLoading && !error && (
          <>
            {avisos.length === 0 ? (
              <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">Nenhum aviso publicado ainda</p>
                <Button onClick={() => setShowForm(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro aviso
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {avisos.map((aviso) => (
                  <AvisoCard
                    key={aviso.aviso_id}
                    aviso={aviso}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
