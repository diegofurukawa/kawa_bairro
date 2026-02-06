'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CreateAvisoSchema, UpdateAvisoSchema } from '@/lib/validations/aviso'
import type { Aviso, CreateAvisoInput, UpdateAvisoInput, AvisoTipo } from '@/types'

export interface AvisoFormProps {
  aviso?: Aviso
  onSubmit: (data: CreateAvisoInput | UpdateAvisoInput) => Promise<void>
  onCancel?: () => void
  className?: string
  isLoading?: boolean
  fixedTipo?: AvisoTipo // When provided, tipo is locked to this value
}

export function AvisoForm({
  aviso,
  onSubmit,
  onCancel,
  className,
  isLoading = false,
  fixedTipo
}: AvisoFormProps) {
  const [formData, setFormData] = React.useState({
    titulo: aviso?.titulo || '',
    corpo: aviso?.corpo || '',
    url: aviso?.url || '',
    autor: aviso?.autor || '',
    fixado: aviso?.fixado || false,
    tipo: fixedTipo || aviso?.tipo || 'Publi',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validar dados
      const schema = aviso ? UpdateAvisoSchema : CreateAvisoSchema
      const validatedData = schema.parse(formData)

      await onSubmit(validatedData)

      // Limpar erros em caso de sucesso
      setErrors({})
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="titulo">
          Título <span className="text-red-500">*</span>
        </Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => handleInputChange('titulo', e.target.value)}
          placeholder="Digite o título do aviso"
          className={cn(errors.titulo && 'border-red-500')}
          disabled={isLoading}
        />
        {errors.titulo && (
          <p className="text-sm text-red-500">{errors.titulo}</p>
        )}
      </div>

      {/* Corpo */}
      <div className="space-y-2">
        <Label htmlFor="corpo">
          Mensagem <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="corpo"
          value={formData.corpo}
          onChange={(e) => handleInputChange('corpo', e.target.value)}
          placeholder="Digite a mensagem do aviso"
          rows={6}
          className={cn(
            'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            errors.corpo && 'border-red-500'
          )}
          disabled={isLoading}
        />
        {errors.corpo && (
          <p className="text-sm text-red-500">{errors.corpo}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="url">URL (opcional)</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://exemplo.com"
          className={cn(errors.url && 'border-red-500')}
          disabled={isLoading}
        />
        {errors.url && (
          <p className="text-sm text-red-500">{errors.url}</p>
        )}
        <p className="text-xs text-gray-500">
          Ao incluir uma URL, tentaremos extrair automaticamente título, descrição e imagem
        </p>
      </div>

      {/* Autor */}
      <div className="space-y-2">
        <Label htmlFor="autor">Autor (opcional)</Label>
        <Input
          id="autor"
          value={formData.autor}
          onChange={(e) => handleInputChange('autor', e.target.value)}
          placeholder="Nome do autor"
          className={cn(errors.autor && 'border-red-500')}
          disabled={isLoading}
        />
        {errors.autor && (
          <p className="text-sm text-red-500">{errors.autor}</p>
        )}
      </div>

      {/* Tipo - Hidden when fixedTipo is provided, shown as read-only when editing with different tipo */}
      {!fixedTipo && (
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value as AvisoTipo)}
            className={cn(
              'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            )}
            disabled={isLoading}
          >
            <option value="Publi">Publicidade (Publi)</option>
            <option value="Aviso">Aviso</option>
          </select>
          <p className="text-xs text-gray-500">
            Publi: Exibe imagem no carrossel | Aviso: Exibe título e descrição no carrossel
          </p>
        </div>
      )}
      
      {/* Show fixed tipo as read-only info */}
      {fixedTipo && (
        <div className="space-y-2">
          <Label>Tipo</Label>
          <div className={cn(
            'flex w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm text-gray-700'
          )}>
            {fixedTipo === 'Aviso' ? 'Aviso (Mensagem/Notificação)' : 'Publicidade (Publi)'}
          </div>
          <p className="text-xs text-gray-500">
            {fixedTipo === 'Aviso' 
              ? 'Este item será exibido como mensagem no Mural de Avisos' 
              : 'Este item será exibido no carrossel de Publicidades'}
          </p>
        </div>
      )}

      {/* Fixado */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="fixado"
          checked={formData.fixado}
          onChange={(e) => handleInputChange('fixado', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={isLoading}
        />
        <Label htmlFor="fixado" className="cursor-pointer">
          Fixar aviso (aparecerá no topo da lista)
        </Label>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Salvando...' : aviso ? 'Atualizar Aviso' : 'Criar Aviso'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
