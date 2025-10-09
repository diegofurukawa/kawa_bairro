import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChipProps {
  children: React.ReactNode
  onRemove?: () => void
  variant?: 'default' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const chipVariants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
}

const chipSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function Chip({ 
  children, 
  onRemove, 
  variant = 'default', 
  size = 'md',
  className 
}: ChipProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
        chipVariants[variant],
        chipSizes[size],
        className
      )}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Remover"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
