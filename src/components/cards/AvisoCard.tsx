import * as React from 'react'
import { MessageSquare, Link as LinkIcon, Pin, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Aviso, UrlMetadata } from '@/types'

export interface AvisoCardProps {
  aviso: Aviso
  className?: string
  onEdit?: (aviso: Aviso) => void
  onDelete?: (aviso: Aviso) => void
  onTogglePin?: (aviso: Aviso) => void
}

export function AvisoCard({ aviso, className, onEdit, onDelete, onTogglePin }: AvisoCardProps) {
  const metadata = aviso.url_metadata as UrlMetadata | null

  return (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-5',
      aviso.fixado && 'border-blue-500 border-2',
      className
    )}>
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
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(aviso)}
              className="h-7 w-7 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(aviso)}
              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Deletar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
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
          <MessageSquare className="h-3 w-3" />
          <span>{new Date(aviso.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>

        {aviso.fixado && (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Fixado
          </span>
        )}
      </div>
    </div>
  )
}
