'use client'

import * as React from 'react'
import { Toast } from './toast'
import type { ToastProps } from './toast'

interface ToastContextType {
  toast: (props: Omit<ToastProps, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const addToast = React.useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...props,
      id,
      onClose: () => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }
    }
    
    setToasts(prev => [...prev, newToast])
  }, [])

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, variant: 'success' })
  }, [addToast])

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, variant: 'error' })
  }, [addToast])

  const warning = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, variant: 'warning' })
  }, [addToast])

  const info = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, variant: 'info' })
  }, [addToast])

  const contextValue = React.useMemo(() => ({
    toast: addToast,
    success,
    error,
    warning,
    info,
  }), [addToast, success, error, warning, info])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
