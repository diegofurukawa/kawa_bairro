'use client'

import { AvisoCarousel } from './AvisoCarousel'
import type { Aviso } from '@/types'

export interface AvisoCarouselClientProps {
  avisos: Aviso[]
  className?: string
}

export function AvisoCarouselClient({ avisos, className }: AvisoCarouselClientProps) {
  return <AvisoCarousel avisos={avisos} className={className} />
}
