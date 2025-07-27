'use client'

import { ToastProvider } from '@/components/ui/Toast'
import { ThemeProvider } from '@/contexts/ThemeContext'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
} 