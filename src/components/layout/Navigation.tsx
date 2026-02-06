'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Plus, MapPin, MessageSquare, Megaphone, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gradient-to-r from-olive-50 to-purple-brand-50 border-b border-olive-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-horizontal-jd-das-oliveiras-1000px.webp"
              alt="Jardim das Oliveiras"
              width={220}
              height={50}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/cadastrar">
              <Button 
                variant={pathname === '/cadastrar' ? 'default' : 'secondary'} 
                className={cn(
                  "gap-2 transition-all duration-200",
                  pathname === '/cadastrar' 
                    ? "bg-purple-brand-500 hover:bg-purple-brand-600 text-white shadow-md" 
                    : "bg-white hover:bg-purple-brand-50 text-purple-brand-700 border-purple-brand-100"
                )}
              >
                <Plus className="h-4 w-4" />
                Cadastrar
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant={pathname === '/' ? 'default' : 'secondary'} 
                className={cn(
                  "gap-2 transition-all duration-200",
                  pathname === '/' 
                    ? "bg-olive-600 hover:bg-olive-700 text-white shadow-md" 
                    : "bg-white hover:bg-olive-50 text-olive-700 border-olive-100"
                )}
              >
                <MapPin className="h-4 w-4" />
                Quadras
              </Button>
            </Link>
            <Link href="/avisos?tipo=aviso">
              <Button 
                variant={pathname.startsWith('/avisos') ? 'default' : 'secondary'} 
                className={cn(
                  "gap-2 transition-all duration-200",
                  pathname.startsWith('/avisos')
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "bg-white hover:bg-blue-50 text-blue-700 border-blue-100"
                )}
              >
                <Bell className="h-4 w-4" />
                Avisos
              </Button>
            </Link>
            <Link href="/avisos?tipo=publi">
              <Button 
                variant={pathname === '/avisos' ? 'default' : 'secondary'} 
                className={cn(
                  "gap-2 transition-all duration-200",
                  pathname === '/avisos'
                    ? "bg-pink-600 hover:bg-pink-700 text-white shadow-md" 
                    : "bg-white hover:bg-pink-50 text-pink-700 border-pink-100"
                )}
              >
                <Megaphone className="h-4 w-4" />
                Publi&apos;s
              </Button>
            </Link>
          </div>

          {/* Mobile Actions - Simplified */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cadastrar">
              <Button size="icon" variant="secondary" className="bg-purple-brand-100 text-purple-brand-700">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="icon" variant="secondary" className="bg-olive-100 text-olive-700">
                <MapPin className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/avisos?tipo=aviso">
              <Button 
                size="icon" 
                variant="secondary" 
                className={cn(
                  "transition-all duration-200",
                  pathname.startsWith('/avisos')
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/avisos?tipo=publi">
              <Button 
                size="icon" 
                variant="secondary" 
                className={cn(
                  "transition-all duration-200",
                  pathname === '/avisos'
                    ? "bg-pink-600 text-white"
                    : "bg-pink-100 text-pink-700"
                )}
              >
                <Megaphone className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
