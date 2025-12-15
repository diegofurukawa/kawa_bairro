'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CreateQuadraSchema, UpdateQuadraSchema } from '@/lib/validations/quadra'
import type { Quadra, CreateQuadraInput, UpdateQuadraInput } from '@/types'

export interface QuadraFormProps {
  quadra?: Quadra
  onSubmit: (data: CreateQuadraInput | UpdateQuadraInput) => Promise<void>
  onCancel?: () => void
  className?: string
  isLoading?: boolean
}

export function QuadraForm({ 
  quadra, 
  onSubmit, 
  onCancel, 
  className,
  isLoading = false 
}: QuadraFormProps) {
  const [formData, setFormData] = React.useState({
    quadra_name: quadra?.quadra_name || '',
    cep: quadra?.cep || '',
    numero: quadra?.numero || '',
    endereco: quadra?.endereco || '',
    complemento: quadra?.complemento || '',
    bairro: quadra?.bairro || '',
    cidade: quadra?.cidade || '',
    estado: quadra?.estado || '',
    estado_codigo: quadra?.estado_codigo || '',
    pais: quadra?.pais || '',
    pais_iso: quadra?.pais_iso || '',
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
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
      const schema = quadra ? UpdateQuadraSchema : CreateQuadraSchema
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

  const formatCEP = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara 00000-000
    if (numbers.length <= 5) {
      return numbers
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
    }
  }

  const handleCEPChange = (value: string) => {
    const formatted = formatCEP(value)
    handleInputChange('cep', formatted)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Nome da Quadra */}
      <div className="space-y-2">
        <Label htmlFor="quadra_name">Nome da Quadra *</Label>
        <Input
          id="quadra_name"
          value={formData.quadra_name}
          onChange={(e) => handleInputChange('quadra_name', e.target.value)}
          placeholder="Ex: QUADRA A"
          className={cn(errors.quadra_name && 'border-destructive')}
        />
        {errors.quadra_name && (
          <p className="text-sm text-destructive">{errors.quadra_name}</p>
        )}
      </div>

      {/* CEP */}
      <div className="space-y-2">
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          value={formData.cep}
          onChange={(e) => handleCEPChange(e.target.value)}
          placeholder="00000-000"
          maxLength={9}
          className={cn(errors.cep && 'border-destructive')}
        />
        {errors.cep && (
          <p className="text-sm text-destructive">{errors.cep}</p>
        )}
      </div>

      {/* Endereço e Número */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            placeholder="Rua, Avenida, etc."
            className={cn(errors.endereco && 'border-destructive')}
          />
          {errors.endereco && (
            <p className="text-sm text-destructive">{errors.endereco}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numero">Número</Label>
          <Input
            id="numero"
            value={formData.numero}
            onChange={(e) => handleInputChange('numero', e.target.value)}
            placeholder="123"
            className={cn(errors.numero && 'border-destructive')}
          />
          {errors.numero && (
            <p className="text-sm text-destructive">{errors.numero}</p>
          )}
        </div>
      </div>

      {/* Complemento */}
      <div className="space-y-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input
          id="complemento"
          value={formData.complemento}
          onChange={(e) => handleInputChange('complemento', e.target.value)}
          placeholder="Apartamento, Bloco, etc."
          className={cn(errors.complemento && 'border-destructive')}
        />
        {errors.complemento && (
          <p className="text-sm text-destructive">{errors.complemento}</p>
        )}
      </div>

      {/* Bairro e Cidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={(e) => handleInputChange('bairro', e.target.value)}
            placeholder="Nome do bairro"
            className={cn(errors.bairro && 'border-destructive')}
          />
          {errors.bairro && (
            <p className="text-sm text-destructive">{errors.bairro}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={formData.cidade}
            onChange={(e) => handleInputChange('cidade', e.target.value)}
            placeholder="Nome da cidade"
            className={cn(errors.cidade && 'border-destructive')}
          />
          {errors.cidade && (
            <p className="text-sm text-destructive">{errors.cidade}</p>
          )}
        </div>
      </div>

      {/* Estado e Código do Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Input
            id="estado"
            value={formData.estado}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            placeholder="Nome do estado"
            className={cn(errors.estado && 'border-destructive')}
          />
          {errors.estado && (
            <p className="text-sm text-destructive">{errors.estado}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estado_codigo">Código do Estado</Label>
          <Input
            id="estado_codigo"
            value={formData.estado_codigo}
            onChange={(e) => handleInputChange('estado_codigo', e.target.value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
            className={cn(errors.estado_codigo && 'border-destructive')}
          />
          {errors.estado_codigo && (
            <p className="text-sm text-destructive">{errors.estado_codigo}</p>
          )}
        </div>
      </div>

      {/* País e Código ISO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pais">País</Label>
          <Input
            id="pais"
            value={formData.pais}
            onChange={(e) => handleInputChange('pais', e.target.value)}
            placeholder="Nome do país"
            className={cn(errors.pais && 'border-destructive')}
          />
          {errors.pais && (
            <p className="text-sm text-destructive">{errors.pais}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pais_iso">Código ISO do País</Label>
          <Input
            id="pais_iso"
            value={formData.pais_iso}
            onChange={(e) => handleInputChange('pais_iso', e.target.value.toUpperCase())}
            placeholder="BR"
            maxLength={2}
            className={cn(errors.pais_iso && 'border-destructive')}
          />
          {errors.pais_iso && (
            <p className="text-sm text-destructive">{errors.pais_iso}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Salvando...' : (quadra ? 'Atualizar Quadra' : 'Criar Quadra')}
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
