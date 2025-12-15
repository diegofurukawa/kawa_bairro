'use client'

import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AvisoCarouselCard } from '@/components/cards/AvisoCarouselCard'
import type { Aviso } from '@/types'

export interface AvisoCarouselProps {
  avisos: Aviso[]
  className?: string
}

export function AvisoCarousel({ avisos, className }: AvisoCarouselProps) {
  const [mounted, setMounted] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  // Check if user prefers reduced motion
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const autoplay = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      playOnInit: !prefersReducedMotion
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      skipSnaps: false,
      slidesToScroll: 1,
      duration: 30,
      dragFree: false,
      containScroll: 'trimSnaps'
    },
    [autoplay.current]
  )

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    // Iniciar em uma posição aleatória
    if (avisos.length > 0) {
      const randomIndex = Math.floor(Math.random() * avisos.length)
      emblaApi.scrollTo(randomIndex, false) // false = sem animação no início
    }

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect, avisos.length])

  // Keyboard navigation - only when carousel is focused
  const viewportRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!emblaApi) return

    const viewport = viewportRef.current
    if (!viewport) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== viewport) {
        return // Only handle keys when carousel viewport is focused
      }

      if (e.target instanceof HTMLElement && e.target.closest('[role="button"]')) {
        return // Don't interfere with button interactions
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [emblaApi, scrollPrev, scrollNext])

  // Don't render if no avisos
  if (!avisos || avisos.length === 0) {
    return null
  }

  // Show skeleton during mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn('w-full py-6', className)}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[240px] md:h-[280px] bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full py-6', className)}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Viewport */}
          <div 
            className="overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-brand-500 focus:ring-offset-2 rounded-lg" 
            ref={(node) => {
              viewportRef.current = node
              if (typeof emblaRef === 'function') {
                emblaRef(node)
              }
            }}
            role="region"
            aria-label="Carrossel de avisos"
            tabIndex={0}
          >
            <div className="flex gap-4 lg:gap-6 py-2">
              {avisos.map((aviso) => (
                <div
                  key={aviso.aviso_id}
                  className="flex-[0_0_100%] md:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)] min-w-0 px-1"
                >
                  <AvisoCarouselCard 
                    aviso={aviso} 
                    onClick={scrollNext}
                  />
                </div>
              ))}
              {/* Espaçamento fantasma com logo para garantir gap no loop */}
              <div 
                className="flex-[0_0_100%] md:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)] min-w-0 pointer-events-none flex items-center justify-center px-1 py-2"
                aria-hidden="true"
              >
                <div className="w-full h-full flex items-center justify-center p-4">
                  <Image
                    src="/logo-horizontal-jd-das-oliveiras-1000px.webp"
                    alt="Jardim das Oliveiras"
                    width={200}
                    height={60}
                    className="h-auto w-full max-w-[200px] opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Desktop only - Always enabled for infinite loop */}
          {avisos.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className={cn(
                  'hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10',
                  'h-12 w-12 items-center justify-center rounded-full',
                  'bg-white border-2 border-purple-brand-500 text-purple-brand-600',
                  'hover:bg-purple-brand-50 hover:scale-110 active:scale-95',
                  'transition-all duration-200 shadow-lg hover:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-purple-brand-500 focus:ring-offset-2'
                )}
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={scrollNext}
                className={cn(
                  'hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10',
                  'h-12 w-12 items-center justify-center rounded-full',
                  'bg-white border-2 border-purple-brand-500 text-purple-brand-600',
                  'hover:bg-purple-brand-50 hover:scale-110 active:scale-95',
                  'transition-all duration-200 shadow-lg hover:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-purple-brand-500 focus:ring-offset-2'
                )}
                aria-label="Próximo slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Dot Indicators */}
        {avisos.length > 1 && scrollSnaps.length > 0 && (
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Indicadores de slides">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-purple-brand-500 focus:ring-offset-2',
                  index === selectedIndex
                    ? 'w-8 bg-purple-brand-600 shadow-sm'
                    : 'w-2 bg-gray-300 hover:bg-gray-400 hover:w-3'
                )}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : 'false'}
                role="tab"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
