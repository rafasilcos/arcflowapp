'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'

interface ThemeLoaderProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ThemeLoader({ children, fallback }: ThemeLoaderProps) {
  const { isLoading } = useTheme()

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white/80 text-sm font-medium">
              Carregando ArcFlow...
            </div>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

// Loading simples para componentes menores
export function ThemeLoaderSimple({ children }: { children: ReactNode }) {
  const { isLoading } = useTheme()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    )
  }

  return <>{children}</>
} 