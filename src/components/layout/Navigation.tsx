'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Início',
      icon: Home,
      description: 'Página inicial e cadastro'
    },
    {
      href: '/quadras',
      label: 'Quadras',
      icon: MapPin,
      description: 'Visualizar quadras e unidades'
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
