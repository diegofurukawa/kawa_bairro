'use client'

import { ComponentProps, useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { tv, type VariantProps } from '@/lib/utils'

const toastVariants = tv({
  base: 'fixed top-4 right-4 z-50 max-w-sm w-full rounded-lg shadow-lg p-4 transition-all duration-300',
  variants: {
    variant: {
      default: 'bg-white border border-gray-200 text-gray-900',
      success: 'bg-green-50 border border-green-200 text-green-900',
      error: 'bg-red-50 border border-red-200 text-red-900',
      warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
      info: 'bg-blue-50 border border-blue-200 text-blue-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const toastIcons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

export interface ToastProps
  extends Omit<ComponentProps<'div'>, 'id'>,
    VariantProps<typeof toastVariants> {
  id: string
  title?: string
  description?: string
  duration?: number
  onClose?: () => void
}

export function Toast({
  id,
  title,
  description,
  variant,
  duration = 5000,
  onClose,
  className,
  ...props
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = toastIcons[variant || 'default']

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // Delay para animação
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={toastVariants({
        variant,
        className: isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      })}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-medium text-sm">{title}</p>
          )}
          {description && (
            <p className="text-sm mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
