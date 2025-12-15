'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-to-r from-olive-50 to-purple-brand-50 border-b border-olive-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-horizontal-jd-das-oliveiras-1000px.webp"
              alt="Jardim das Oliveiras"
              width={280}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}
