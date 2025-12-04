import { ComponentProps } from 'react'
import { X } from 'lucide-react'
import { tv, type VariantProps } from '@/lib/utils'

const chipVariants = tv({
  base: 'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
    size: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface ChipProps
  extends ComponentProps<'div'>,
    VariantProps<typeof chipVariants> {
  onRemove?: () => void
}

export function Chip({
  children,
  onRemove,
  variant,
  size,
  className,
  ...props
}: ChipProps) {
  return (
    <div
      className={chipVariants({ variant, size, className })}
      {...props}
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
