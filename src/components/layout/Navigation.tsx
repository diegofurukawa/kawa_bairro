'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">
              MeuBairro
            </span>
            <span className="text-sm text-gray-600">
              Jd das Oliveiras
            </span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
