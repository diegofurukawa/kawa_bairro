import * as React from 'react'
import { Home, Users, Phone, Calendar, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/utils'
import { parseJsonArray } from '@/lib/utils/data'
import type { Unidade } from '@/types'

export interface UnidadeCardProps {
  unidade: Unidade
  className?: string
  variant?: 'grid' | 'list'
  onEdit?: (unidade: Unidade) => void
  onView?: (unidade: Unidade) => void
}

export function UnidadeCard({ unidade, className, variant = 'grid', onEdit, onView }: UnidadeCardProps) {
  // Converter strings JSON para arrays
  const moradores = React.useMemo(() => 
    parseJsonArray(unidade.mora), [unidade.mora]
  )

  const contatos = React.useMemo(() => 
    parseJsonArray(unidade.contato), [unidade.contato]
  )

  if (variant === 'list') {
    return (
      <div className={cn(
        'bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4',
        className
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Header compacto */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Home className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {unidade.unidade_numero}
                </span>
                <span className="text-sm text-gray-500">
                  {unidade.quadra?.quadra_name}
                </span>
              </div>
            </div>
          </div>

          {/* Moradores e contatos compactos */}
          <div className="flex flex-wrap gap-2">
            {moradores.slice(0, 2).map((morador, index) => (
              <Chip key={index} variant="secondary" size="sm">
                {morador}
              </Chip>
            ))}
            {moradores.length > 2 && (
              <Chip variant="secondary" size="sm">
                +{moradores.length - 2}
              </Chip>
            )}
            {contatos.slice(0, 1).map((contato, index) => (
              <Chip key={index} variant="default" size="sm">
                {contato}
              </Chip>
            ))}
            {contatos.length > 1 && (
              <Chip variant="default" size="sm">
                +{contatos.length - 1}
              </Chip>
            )}
          </div>

          {/* Data */}
          <div className="text-xs text-gray-500 flex-shrink-0">
            {new Date(unidade.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-gray-900">
            {unidade.unidade_numero}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(unidade.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {/* Quadra */}
      <div className="mb-3">
        <span className="text-sm text-gray-600">Quadra: </span>
        <span className="text-sm font-medium text-gray-900">
          {unidade.quadra?.quadra_name || 'Não informada'}
        </span>
      </div>

      {/* Moradores */}
      {moradores.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Moradores ({moradores.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {moradores.slice(0, 3).map((morador, index) => (
              <Chip key={index} variant="secondary" size="sm">
                {morador}
              </Chip>
            ))}
            {moradores.length > 3 && (
              <Chip variant="secondary" size="sm">
                +{moradores.length - 3} mais
              </Chip>
            )}
          </div>
        </div>
      )}

      {/* Contatos */}
      {contatos.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Contatos ({contatos.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {contatos.slice(0, 2).map((contato, index) => (
              <Chip key={index} variant="default" size="sm">
                {contato}
              </Chip>
            ))}
            {contatos.length > 2 && (
              <Chip variant="default" size="sm">
                +{contatos.length - 2} mais
              </Chip>
            )}
          </div>
        </div>
      )}

      {/* Footer com estatísticas e ações */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{moradores.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{contatos.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(unidade.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(unidade)}
                className="h-7 w-7 p-0"
                title="Visualizar"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(unidade)}
                className="h-7 w-7 p-0"
                title="Editar"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
