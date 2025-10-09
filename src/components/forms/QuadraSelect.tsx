'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Quadra } from '@/types'

export interface QuadraSelectProps {
  quadras: Quadra[]
  value: string
  onChange: (value: string) => void
  onNewQuadra: (quadraName: string) => void
  className?: string
  label?: string
  error?: string
  onQuadraCreated?: () => void
}

export function QuadraSelect({
  quadras,
  value,
  onChange,
  onNewQuadra,
  className,
  label,
  error,
  onQuadraCreated
}: QuadraSelectProps) {
  const [isCreatingNew, setIsCreatingNew] = React.useState(false)
  const [newQuadraName, setNewQuadraName] = React.useState('')

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'new') {
      setIsCreatingNew(true)
    } else {
      onChange(selectedValue)
      setIsCreatingNew(false)
    }
  }

  const handleCreateNew = async () => {
    if (newQuadraName.trim()) {
      try {
        await onNewQuadra(newQuadraName.trim().toUpperCase())
        setNewQuadraName('')
        setIsCreatingNew(false)
        // Notificar que uma nova quadra foi criada
        if (onQuadraCreated) {
          onQuadraCreated()
        }
      } catch (error) {
        console.error('Erro ao criar quadra:', error)
      }
    }
  }

  const handleCancel = () => {
    setIsCreatingNew(false)
    setNewQuadraName('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      {!isCreatingNew ? (
        <Select value={value} onValueChange={handleSelectChange}>
          <SelectTrigger className={cn(error && 'border-destructive')}>
            <SelectValue placeholder="Selecione ou crie uma quadra" />
          </SelectTrigger>
          <SelectContent>
            {quadras.map((quadra) => (
              <SelectItem key={quadra.quadra_id} value={quadra.quadra_name}>
                {quadra.quadra_name}
              </SelectItem>
            ))}
            <SelectItem value="new" className="text-primary">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar nova quadra
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={newQuadraName}
            onChange={(e) => setNewQuadraName(e.target.value)}
            placeholder="Nome da nova quadra"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateNew()
              } else if (e.key === 'Escape') {
                handleCancel()
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCreateNew}
            disabled={!newQuadraName.trim()}
          >
            Criar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
