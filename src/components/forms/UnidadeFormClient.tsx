'use client'

import { useState } from 'react'
import { UnidadeForm } from './UnidadeForm'
import type { Quadra } from '@/types'

export interface UnidadeFormClientProps {
  initialQuadras: Quadra[]
}

export function UnidadeFormClient({ initialQuadras }: UnidadeFormClientProps) {
  const [quadras, setQuadras] = useState(initialQuadras)

  const handleQuadraCreated = async () => {
    try {
      // Recarregar as quadras da API
      const response = await fetch('/api/quadras')
      if (response.ok) {
        const data = await response.json()
        setQuadras(data.data)
      }
    } catch (error) {
      console.error('Erro ao recarregar quadras:', error)
    }
  }

  return (
    <UnidadeForm 
      quadras={quadras} 
      onQuadraCreated={handleQuadraCreated}
    />
  )
}
