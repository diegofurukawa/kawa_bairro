import * as React from 'react'
import { Home, Users, Phone, Calendar, Edit, Eye, MessageCircle, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { VistoriaChip } from '@/components/ui/vistoria-chip'
import { cn } from '@/lib/utils'
import { parseJsonArray } from '@/lib/utils/data'
import { analyzeContact, openWhatsApp } from '@/lib/utils/phone'
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

          {/* Moradores, contatos e vistoria compactos com ícones */}
          <div className="flex flex-wrap gap-2">
            {/* Vistoria */}
            <div className="flex items-center gap-1">
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              <VistoriaChip status={unidade.vistoria} size="sm" />
            </div>

            {/* Moradores com ícone */}
            {moradores.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600">{moradores.length}</span>
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
              </div>
            )}
            
            {/* Contatos - linha a linha */}
            {contatos.length > 0 && (
              <div className="flex flex-col gap-1 w-full items-end">
                {contatos.map((contato, index) => {
                  const contactInfo = analyzeContact(contato)
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <div
                        className={contactInfo.isPhone ? "cursor-pointer" : ""}
                        onClick={contactInfo.isPhone ? () => openWhatsApp(contato) : undefined}
                        title={contactInfo.isPhone ? "Clique para abrir no WhatsApp" : ""}
                      >
                        <Chip
                          variant="default"
                          size="sm"
                          className={contactInfo.isPhone ? "hover:bg-green-100" : ""}
                        >
                          {contactInfo.formatted}
                        </Chip>
                      </div>
                      {contactInfo.isPhone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                          onClick={() => openWhatsApp(contato)}
                          title="Abrir no WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Data - Oculto em mobile */}
          <div className="text-xs text-gray-500 flex-shrink-0 hidden sm:block">
            {new Date(unidade.createdAt).toLocaleDateString('pt-BR')}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-1 flex-shrink-0 ml-auto sm:ml-0">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(unidade)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Visualizar"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(unidade)}
                className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
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

      {/* Vistoria */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Status da Vistoria
          </span>
        </div>
        <VistoriaChip status={unidade.vistoria} />
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

      {/* Contatos em Lista */}
      {contatos.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              Contatos ({contatos.length})
            </span>
          </div>
          <div className="space-y-2">
            {contatos.map((contato, index) => {
              const contactInfo = analyzeContact(contato)
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Phone className="h-3 w-3 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {contactInfo.formatted}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {contactInfo.isPhone && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openWhatsApp(contato)}
                          title="Abrir no WhatsApp"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => window.open(`tel:${contactInfo.cleanNumber}`, '_self')}
                          title="Ligar"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {!contactInfo.isPhone && (
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded">
                        Email
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
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
                className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                className="h-7 w-7 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
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
