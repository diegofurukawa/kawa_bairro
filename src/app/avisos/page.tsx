'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { Plus, Loader2, AlertCircle, Megaphone, ArrowLeft, MessageCircle, ExternalLink, Link as LinkIcon, Pin } from 'lucide-react'
import { AvisoCarousel } from '@/components/carousel/AvisoCarousel'
import { Button } from '@/components/ui/button'
import { AvisoForm } from '@/components/forms/AvisoForm'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Aviso, CreateAvisoInput, UpdateAvisoInput, UrlMetadata } from '@/types'

type ViewMode = 'aviso' | 'publi'

// Notification/Message style card for Avisos
function AvisoMessageCard({ 
  aviso, 
  onEdit, 
  onDelete 
}: { 
  aviso: Aviso
  onEdit?: (aviso: Aviso) => void
  onDelete?: (aviso: Aviso) => void 
}) {
  const [mounted, setMounted] = React.useState(false)
  const [isRead, setIsRead] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Prevent hydration mismatch by rendering consistent initial state
  const showAsRead = mounted ? isRead : false
  
  return (
    <div 
      className={cn(
        'relative bg-white rounded-lg border-l-4 p-4 transition-all hover:shadow-md cursor-pointer',
        showAsRead ? 'border-l-gray-300 bg-gray-50' : 'border-l-blue-500 bg-white'
      )}
      onClick={() => setIsRead(true)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          showAsRead ? 'bg-gray-200' : 'bg-blue-100'
        )}>
          <MessageCircle className={cn('h-5 w-5', showAsRead ? 'text-gray-500' : 'text-blue-600')} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn('font-semibold text-gray-900', !showAsRead && 'font-bold')}>
              {aviso.titulo}
            </h3>
            {!showAsRead && mounted && (
              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {aviso.corpo}
          </p>
          
          {aviso.url && (
            <a
              href={aviso.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              {new URL(aviso.url).hostname}
            </a>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {aviso.autor && <span>por {aviso.autor}</span>}
              {aviso.autor && <span>•</span>}
              <span>{new Date(aviso.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(aviso)
                    }}
                    className="h-7 text-xs"
                  >
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(aviso)
                    }}
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Publi style card (advertising) with URL preview
function PubliCard({ 
  aviso, 
  onEdit, 
  onDelete,
  onTogglePin
}: { 
  aviso: Aviso
  onEdit?: (aviso: Aviso) => void
  onDelete?: (aviso: Aviso) => void
  onTogglePin?: (aviso: Aviso) => void
}) {
  const metadata = aviso.url_metadata as UrlMetadata | null

  return (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow',
      aviso.fixado && 'border-blue-500 border-2'
    )}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2 flex-1">
            {aviso.fixado && (
              <Pin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0 fill-current" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                {aviso.titulo}
              </h3>
              {aviso.autor && (
                <p className="text-xs text-gray-500 mt-1">
                  por {aviso.autor}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {onTogglePin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePin(aviso)}
                className={cn(
                  "h-7 w-7 p-0",
                  aviso.fixado ? "text-blue-600 hover:text-blue-700" : "text-gray-400 hover:text-gray-600"
                )}
                title={aviso.fixado ? "Desafixar" : "Fixar"}
              >
                <Pin className="h-4 w-4" />
              </Button>
            )}
            <Megaphone className="h-5 w-5 text-purple-500 flex-shrink-0" />
          </div>
        </div>
        
        {/* Corpo do texto */}
        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {aviso.corpo}
        </p>

        {/* Preview da URL com metadados */}
        {aviso.url && (
          <div className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors mb-3">
            <a
              href={aviso.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex gap-3">
                {/* Imagem */}
                {metadata?.image && (
                  <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={metadata.image}
                      alt={metadata.title || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {metadata?.logo && (
                      <img
                        src={metadata.logo}
                        alt=""
                        className="w-4 h-4"
                      />
                    )}
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {metadata?.title || aviso.url}
                    </h4>
                  </div>

                  {metadata?.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {metadata.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <LinkIcon className="h-3 w-3" />
                    <span className="truncate">
                      {new URL(aviso.url).hostname}
                    </span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MessageCircle className="h-3 w-3" />
            <span>{new Date(aviso.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>

          {aviso.fixado && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Fixado
            </span>
          )}
        </div>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-end gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(aviso)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(aviso)}
              className="text-red-600 hover:text-red-700"
            >
              Excluir
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Inner component that uses useSearchParams
function AvisosPageContent() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get('tipo')
  
  // Determine view mode from URL param
  const viewMode: ViewMode = tipoParam === 'publi' ? 'publi' : 'aviso'
  const isAvisoView = viewMode === 'aviso'
  
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

      // Auto-set tipo based on view mode
      const dataWithTipo = {
        ...data,
        tipo: isAvisoView ? 'Aviso' : 'Publi'
      }

      if (editingAviso) {
        // Atualizar
        const response = await fetch(`/api/avisos/${editingAviso.aviso_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataWithTipo)
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
          body: JSON.stringify(dataWithTipo)
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
    if (!confirm(`Deseja realmente deletar "${aviso.titulo}"?`)) return

    try {
      const response = await fetch(`/api/avisos/${aviso.aviso_id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        await fetchAvisos()
      } else {
        alert('Erro ao deletar: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar')
    }
  }

  const handleEdit = (aviso: Aviso) => {
    setEditingAviso(aviso)
    setShowForm(false)
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
        alert('Erro ao fixar/desafixar: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao fixar/desafixar:', error)
      alert('Erro ao fixar/desafixar')
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingAviso(null)
  }

  // Filter avisos based on view mode
  const filteredAvisos = React.useMemo(() => {
    return avisos.filter(a => 
      isAvisoView ? a.tipo === 'Aviso' : a.tipo === 'Publi'
    )
  }, [avisos, isAvisoView])

  // Get carousel avisos (only Publi)
  const carouselAvisos = React.useMemo(() => {
    return avisos.filter(a => a.tipo === 'Publi')
  }, [avisos])

  // Page title and description based on view mode
  const pageTitle = isAvisoView ? 'Mural de Avisos' : 'Espaço de Publicidades'
  const pageDescription = isAvisoView 
    ? 'Mensagens e notificações importantes para a comunidade'
    : 'Publicidades e anúncios do bairro'
  const newButtonLabel = isAvisoView ? 'Novo Aviso' : 'Nova Publicidade'
  const emptyMessage = isAvisoView 
    ? 'Nenhum aviso encontrado'
    : 'Nenhuma publicidade encontrada'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-1">{pageDescription}</p>
            </div>
            {!showForm && !editingAviso && (
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {newButtonLabel}
              </Button>
            )}
          </div>
        </div>

        {/* Carrossel de Publicidade (somente na view de publi) */}
        {!isLoading && !isAvisoView && carouselAvisos.length > 0 && (
          <div className="mb-8 -mx-6">
            <AvisoCarousel avisos={carouselAvisos} />
          </div>
        )}

        {/* Formulário */}
        {(showForm || editingAviso) && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingAviso ? 'Editar' : newButtonLabel}
            </h2>
            <AvisoForm
              aviso={editingAviso || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isLoading={isSubmitting}
              fixedTipo={isAvisoView ? 'Aviso' : 'Publi'}
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
            {filteredAvisos.length === 0 ? (
              <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">{emptyMessage}</p>
                <Button onClick={() => setShowForm(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {newButtonLabel}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAvisos.map((aviso) => (
                  isAvisoView ? (
                    <AvisoMessageCard
                      key={aviso.aviso_id}
                      aviso={aviso}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <PubliCard
                      key={aviso.aviso_id}
                      aviso={aviso}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                    />
                  )
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Main export with Suspense wrapper
export default function AvisosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <AvisosPageContent />
    </Suspense>
  )
}
