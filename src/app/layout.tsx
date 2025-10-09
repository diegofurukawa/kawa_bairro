import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/layout/Navigation'
import { ToastProvider } from '@/components/ui/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeuBairro - Jd Das Oliveiras',
  description: 'Sistema de cadastro de unidades e moradores do Jardim das Oliveiras',
  keywords: ['bairro', 'cadastro', 'unidade', 'moradores', 'jardim das oliveiras'],
  authors: [{ name: 'MeuBairro' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
