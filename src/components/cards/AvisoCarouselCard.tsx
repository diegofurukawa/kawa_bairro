import * as React from 'react'
import { MessageSquare, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Aviso, UrlMetadata } from '@/types'

export interface AvisoCarouselCardProps {
  aviso: Aviso
  className?: string
  onClick?: () => void
}

// Helper function to detect Instagram URL
const isInstagramUrl = (url?: string | null): boolean => {
  if (!url) return false
  return url.includes('instagram.com') || url.includes('instagr.am')
}

// Helper function to extract Instagram username from URL
const getInstagramUsername = (url?: string | null): string | null => {
  if (!url || !isInstagramUrl(url)) return null

  try {
    // Patterns: instagram.com/username or instagram.com/username/
    const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)\/?/)
    if (match && match[1] && match[1] !== 'p' && match[1] !== 'reel') {
      return match[1]
    }
  } catch (e) {
    return null
  }

  return null
}

// Helper function to get Instagram icon SVG
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export function AvisoCarouselCard({ aviso, className, onClick }: AvisoCarouselCardProps) {
  const metadata = aviso.url_metadata as UrlMetadata | null
  const hasUrl = !!aviso.url
  const isInstagram = isInstagramUrl(aviso.url)
  const instagramUsername = getInstagramUsername(aviso.url)
  const [isActive, setIsActive] = React.useState(false)
  const isAviso = aviso.tipo === 'Aviso'

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (hasUrl) {
        // Se tem URL, o link já vai abrir, não precisa fazer nada aqui
        return
      }
      // Se não tem URL e tem onClick, chama onClick
      if (onClick) {
        e.preventDefault()
        onClick()
      }
    },
    [hasUrl, onClick]
  )

  const handleMouseDown = React.useCallback(() => {
    setIsActive(true)
  }, [])

  const handleMouseUp = React.useCallback(() => {
    setIsActive(false)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsActive(false)
  }, [])

  // Render Aviso layout (title on top, description in place of image)
  const renderAvisoContent = () => (
    <>
      {/* Title on top */}
      <div className="h-16 md:h-20 flex items-center justify-center p-3 md:p-4 bg-white border-b border-gray-100">
        <h3
          className="font-bold text-sm md:text-base text-center text-gray-900 line-clamp-2 leading-tight w-full px-2"
          title={aviso.titulo}
        >
          {aviso.titulo}
        </h3>
      </div>

      {/* Description in place of image */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 md:p-6 min-h-0 overflow-hidden">
        <p className="text-sm text-gray-700 text-center line-clamp-4 whitespace-pre-line">
          {aviso.corpo}
        </p>
      </div>

      {/* URL link at bottom */}
      {hasUrl && (
        <div className="h-12 flex items-center justify-center p-2 bg-white border-t border-gray-100">
          <a
            href={aviso.url!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate max-w-[150px]">
              {new URL(aviso.url!).hostname}
            </span>
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>
      )}
    </>
  )

  // Render Publi layout (image on top, title at bottom - original)
  const renderPubliContent = () => (
    <>
      {/* Image container with padding and centered image */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 md:p-6 min-h-0">
        {metadata?.image ? (
          <div className="w-full h-full max-w-full max-h-full flex items-center justify-center relative">
            <img
              src={metadata.image}
              alt={metadata.title || aviso.titulo}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-md"
              loading="lazy"
            />
            {/* Instagram badge overlay */}
            {isInstagram && (
              <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                <InstagramIcon className="h-4 w-4 text-pink-600" />
              </div>
            )}
          </div>
        ) : isInstagram ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            <InstagramIcon className="h-16 w-16 md:h-20 md:w-20 text-pink-500" />
            {instagramUsername && (
              <div className="text-center">
                <span className="text-xs text-pink-600 font-medium">Instagram</span>
                <p className="text-base md:text-lg font-semibold text-pink-700">@{instagramUsername}</p>
              </div>
            )}
            {!instagramUsername && (
              <span className="text-sm font-medium text-pink-700">Instagram</span>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-purple-300" />
          </div>
        )}
      </div>

      {/* Title only - compact */}
      <div className="h-16 md:h-20 flex items-center justify-center p-3 md:p-4 bg-white border-t border-gray-100">
        <h3
          className="font-bold text-sm md:text-base text-center text-gray-900 line-clamp-2 leading-tight w-full px-2"
          title={aviso.titulo}
        >
          {aviso.titulo}
        </h3>
      </div>
    </>
  )

  const cardContent = isAviso ? renderAvisoContent() : renderPubliContent()

  const baseClasses = cn(
    'relative bg-white rounded-2xl shadow-sm border-2 border-olive-600 transition-all duration-300 flex flex-col overflow-hidden',
    'h-[240px] md:h-[280px]',
    (hasUrl || onClick) && 'cursor-pointer',
    isActive ? 'scale-[0.98] shadow-md border-olive-700' : 'hover:scale-[1.02] hover:shadow-xl hover:border-olive-500',
    !hasUrl && !onClick && 'hover:shadow-md',
    className
  )

  if (hasUrl) {
    return (
      <a
        href={aviso.url!}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {cardContent}
      </a>
    )
  }

  return (
    <div
      className={baseClasses}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {cardContent}
    </div>
  )
}
