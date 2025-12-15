import { ComponentProps } from 'react'
import { Chip } from '@/components/ui/chip'
import { twMerge } from 'tailwind-merge'
import type { VistoriaStatus } from '@/types'

export interface VistoriaChipProps extends Omit<ComponentProps<'div'>, 'children'> {
  status: VistoriaStatus | null
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
  },
  reprovada: {
    label: 'Reprovada',
    className: 'bg-red-100 text-red-800 border border-red-300'
  }
}

export function VistoriaChip({ status, className, size = 'sm', ...props }: VistoriaChipProps) {
  if (!status) {
    return (
      <Chip
        size={size}
        className={twMerge('bg-gray-100 text-gray-600 border border-gray-300', className)}
        {...props}
      >
        Pendente
      </Chip>
    )
  }

  const config = vistoriaConfig[status]

  return (
    <Chip
      size={size}
      className={twMerge(config.className, className)}
      {...props}
    >
      {config.label}
    </Chip>
  )
}
