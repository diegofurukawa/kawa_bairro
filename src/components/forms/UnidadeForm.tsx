'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QuadraSelect } from './QuadraSelect'
import { ChipInput } from './ChipInput'
import { useToast } from '@/components/ui/toast-provider'
import { cn } from '@/lib/utils'
import type { Quadra } from '@/types'

export interface UnidadeFormProps {
  quadras: Quadra[]
  className?: string
  onQuadraCreated?: () => void
}

export interface FormData {
  unidade_numero: string
  quadra_name: string
  mora: string[]
  contato: string[]
}

export interface FormErrors {
  unidade_numero?: string
  quadra_name?: string
  mora?: string
  contato?: string
}

export function UnidadeForm({ quadras, className, onQuadraCreated }: UnidadeFormProps) {
  const router = useRouter()
  const { success, error, info } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})
  
  const [formData, setFormData] = React.useState<FormData>({
    unidade_numero: '',
    quadra_name: '',
    mora: [],
    contato: []
  })

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    // Converter para maiúscula se for string
    const processedValue = typeof value === 'string' 
      ? value.toUpperCase() 
      : value
    
    setFormData(prev => ({ ...prev, [field]: processedValue }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
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

  const checkUnidadeExists = async (numero: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/unidades/check?numero=${encodeURIComponent(numero)}`)
      if (response.ok) {
        const data = await response.json()
        return data.exists
      }
      return false
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Verificar se a unidade já existe
    const unidadeExists = await checkUnidadeExists(formData.unidade_numero)
    if (unidadeExists) {
      setErrors(prev => ({
        ...prev,
        unidade_numero: 'Este número de unidade já existe'
      }))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Primeiro, garantir que a quadra existe
      const quadraResponse = await fetch('/api/quadras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quadra_name: formData.quadra_name })
      })
      
      if (!quadraResponse.ok) {
        throw new Error('Erro ao criar/encontrar quadra')
      }
      
      const quadraData = await quadraResponse.json()
      
      // Agora criar a unidade
      const unidadeResponse = await fetch('/api/unidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unidade_numero: formData.unidade_numero,
          quadra_id: quadraData.data.quadra_id,
          mora: formData.mora,
          contato: formData.contato
        })
      })
      
      if (!unidadeResponse.ok) {
        const errorData = await unidadeResponse.json()
        
        if (unidadeResponse.status === 409) {
          throw new Error(`Unidade ${formData.unidade_numero} já existe! Escolha outro número.`)
        }
        
        throw new Error(errorData.error || 'Erro ao criar unidade')
      }
      
      // Sucesso - limpar formulário e mostrar mensagem
      setFormData({
        unidade_numero: '',
        quadra_name: '',
        mora: [],
        contato: []
      })
      
      success('Unidade cadastrada com sucesso!', 'A unidade foi adicionada ao sistema.')
      
      // Redirecionar para a HomePage após 1 segundo
      setTimeout(() => {
        router.push('/')
      }, 1000)
      
    } catch (err) {
      console.error('Erro ao cadastrar unidade:', err)
      
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar unidade'
      
      // Se for erro de unidade duplicada, destacar o campo
      if (errorMessage.includes('já existe')) {
        setErrors(prev => ({
          ...prev,
          unidade_numero: 'Este número de unidade já existe'
        }))
        error('Unidade já existe', 'Escolha outro número para a unidade.')
      } else {
        error('Erro ao cadastrar', errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewQuadra = async (quadraName: string) => {
    try {
      // Criar a quadra via API
      const response = await fetch('/api/quadras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quadra_name: quadraName })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar quadra')
      }
      
      const quadraData = await response.json()
      
      // Atualizar o formulário com a nova quadra
      setFormData(prev => ({ ...prev, quadra_name: quadraData.data.quadra_name }))
      
      // Notificar que uma nova quadra foi criada
      if (onQuadraCreated) {
        onQuadraCreated()
      }
    } catch (err) {
      console.error('Erro ao criar quadra:', err)
      error('Erro ao criar quadra', 'Tente novamente ou escolha uma quadra existente.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Cadastro de Unidade - Jd Das Oliveiras
        </h2>
        
        <div className="grid gap-4">
          <QuadraSelect
            quadras={quadras}
            value={formData.quadra_name}
            onChange={(value) => handleInputChange('quadra_name', value)}
            onNewQuadra={handleNewQuadra}
            onQuadraCreated={onQuadraCreated}
            label="Quadra"
            error={errors.quadra_name}
          />
          
          <div className="space-y-2">
            <Label htmlFor="unidade_numero">Número da Unidade</Label>
            <Input
              id="unidade_numero"
              value={formData.unidade_numero}
              onChange={(e) => handleInputChange('unidade_numero', e.target.value)}
              placeholder="Ex: 101, A-12, Bloco 1"
              className={cn(errors.unidade_numero && 'border-destructive')}
            />
            {errors.unidade_numero && (
              <p className="text-sm text-destructive">{errors.unidade_numero}</p>
            )}
          </div>
          
          <ChipInput
            label="Moradores"
            value={formData.mora}
            onChange={(value) => handleInputChange('mora', value)}
            placeholder="Digite o nome do morador"
            maxItems={10}
            error={errors.mora}
          />
          
          <ChipInput
            label="Contatos (opcional)"
            value={formData.contato}
            onChange={(value) => handleInputChange('contato', value)}
            placeholder="Digite telefone, email, etc."
            maxItems={5}
            error={errors.contato}
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Unidade'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFormData({
              unidade_numero: '',
              quadra_name: '',
              mora: [],
              contato: []
            })
            setErrors({})
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  )
}
