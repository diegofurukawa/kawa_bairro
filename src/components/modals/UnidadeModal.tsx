'use client'

import * as React from 'react'
import { X, Edit, Eye, Save, Users, Phone, MapPin, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChipInput } from '@/components/forms/ChipInput'
import { QuadraSelect } from '@/components/forms/QuadraSelect'
import { cn } from '@/lib/utils'
import { parseJsonArray } from '@/lib/utils/data'
import type { Unidade, Quadra } from '@/types'

export interface UnidadeModalProps {
  unidade: Unidade | null
  quadras: Quadra[]
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    unidade_numero: string
    quadra_id: number
    mora: string[]
    contato: string[]
  }) => Promise<void>
}

export function UnidadeModal({ 
  unidade, 
  quadras, 
  isOpen, 
  onClose, 
  onSave 
}: UnidadeModalProps) {
  const [mode, setMode] = React.useState<'view' | 'edit'>('view')
  const [isLoading, setIsLoading] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    unidade_numero: '',
    quadra_name: '',
    mora: [] as string[],
    contato: [] as string[]
  })

  const [errors, setErrors] = React.useState<Partial<typeof formData>>({})

  // Atualizar dados quando unidade muda
  React.useEffect(() => {
    if (unidade) {
      setFormData({
        unidade_numero: unidade.unidade_numero,
        quadra_name: unidade.quadra?.quadra_name || '',
        mora: parseJsonArray(unidade.mora),
        contato: parseJsonArray(unidade.contato)
      })
      setMode('view')
      setErrors({})
    }
  }, [unidade])

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {}
    
    if (!formData.unidade_numero.trim()) {
      newErrors.unidade_numero = 'Número da unidade é obrigatório'
    }
    
    if (!formData.quadra_name.trim()) {
      newErrors.quadra_name = 'Quadra é obrigatória'
    }
    
    if (formData.mora.length === 0) {
      newErrors.mora = 'Deve ter pelo menos um morador'
    }
    
    // Contato é opcional - removida validação obrigatória
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !unidade) return
    
    setIsLoading(true)
    try {
      const quadra = quadras.find(q => q.quadra_name === formData.quadra_name)
      if (!quadra) throw new Error('Quadra não encontrada')
      
      await onSave({
        unidade_numero: formData.unidade_numero,
        quadra_id: quadra.quadra_id,
        mora: formData.mora,
        contato: formData.contato
      })
      
      setMode('view')
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewQuadra = (quadraName: string) => {
    setFormData(prev => ({ ...prev, quadra_name: quadraName }))
  }

  if (!isOpen || !unidade) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'view' ? 'Visualizar Unidade' : 'Editar Unidade'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'view' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode('edit')}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMode('view')}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidade_numero">Número da Unidade</Label>
              {mode === 'view' ? (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formData.unidade_numero}</span>
                </div>
              ) : (
                <Input
                  id="unidade_numero"
                  value={formData.unidade_numero}
                  onChange={(e) => handleInputChange('unidade_numero', e.target.value)}
                  className={cn(errors.unidade_numero && 'border-destructive')}
                />
              )}
              {errors.unidade_numero && (
                <p className="text-sm text-destructive">{errors.unidade_numero}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quadra">Quadra</Label>
              {mode === 'view' ? (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{formData.quadra_name}</span>
                </div>
              ) : (
                <QuadraSelect
                  quadras={quadras}
                  value={formData.quadra_name}
                  onChange={(value) => handleInputChange('quadra_name', value)}
                  onNewQuadra={handleNewQuadra}
                  error={errors.quadra_name}
                />
              )}
            </div>
          </div>

          {/* Moradores */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Moradores ({formData.mora.length})
            </Label>
            {mode === 'view' ? (
              <div className="p-3 bg-gray-50 rounded-md">
                {formData.mora.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.mora.map((morador, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {morador}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">Nenhum morador cadastrado</span>
                )}
              </div>
            ) : (
              <ChipInput
                value={formData.mora}
                onChange={(value) => handleInputChange('mora', value)}
                placeholder="Digite o nome do morador"
                maxItems={10}
                error={errors.mora}
              />
            )}
          </div>

          {/* Contatos */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contatos (opcional) ({formData.contato.length})
            </Label>
            {mode === 'view' ? (
              <div className="p-3 bg-gray-50 rounded-md">
                {formData.contato.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.contato.map((contato, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {contato}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">Nenhum contato cadastrado</span>
                )}
              </div>
            ) : (
              <ChipInput
                value={formData.contato}
                onChange={(value) => handleInputChange('contato', value)}
                placeholder="Digite telefone, email, etc."
                maxItems={5}
                error={errors.contato}
              />
            )}
          </div>

          {/* Informações do Sistema */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Criado em:</span>
                <span className="ml-2">
                  {new Date(unidade.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div>
                <span className="font-medium">Atualizado em:</span>
                <span className="ml-2">
                  {new Date(unidade.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
