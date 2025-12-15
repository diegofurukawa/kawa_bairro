'use client'

import * as React from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ShareButtonProps {
  className?: string
  url?: string
  title?: string
  text?: string
}

export function ShareButton({ 
  className,
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'MeuBairro - Jd Das Oliveiras',
  text = 'Cadastre sua unidade no MeuBairro!'
}: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)

  React.useEffect(() => {
    // Verificar se o navegador suporta Web Share API
    setIsSupported(!!navigator.share)
  }, [])

  const handleShare = async () => {
    if (isSupported && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        })
      } catch (error) {
        // Usuário cancelou ou erro no compartilhamento
        console.log('Compartilhamento cancelado ou erro:', error)
      }
    } else {
      // Fallback: copiar para área de transferência
      await copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={cn('gap-2', className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          {isSupported ? 'Compartilhar' : 'Copiar Link'}
        </>
      )}
    </Button>
  )
}
