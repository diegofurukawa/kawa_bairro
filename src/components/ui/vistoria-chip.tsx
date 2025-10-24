import * as React from 'react'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/utils'
import type { VistoriaStatus } from '@/types'

export interface VistoriaChipProps {
  status: VistoriaStatus | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const vistoriaConfig: Record<VistoriaStatus, { label: string; className: string }> = {
  agendado: {
    label: 'Agendado',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-300'
  },
  realizado: {
    label: 'Realizado',
    className: 'bg-green-100 text-green-800 border border-green-300'
  },
  remarcado: {
    label: 'Remarcado',
    className: 'bg-orange-100 text-orange-800 border border-orange-300'
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-gray-100 text-gray-600 border border-gray-300'
  }
}

export function VistoriaChip({ status, className, size = 'sm' }: VistoriaChipProps) {
  if (!status) {
    return (
      <Chip
        size={size}
        className={cn('bg-gray-100 text-gray-600 border border-gray-300', className)}
      >
        Pendente
      </Chip>
    )
  }

  const config = vistoriaConfig[status]

  return (
    <Chip
      size={size}
      className={cn(config.className, className)}
    >
      {config.label}
    </Chip>
  )
}
