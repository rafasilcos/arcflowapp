'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface FooterSectionProps {
  titulo?: string
  subtitulo?: string
  className?: string
}

export default function FooterSection({ 
  titulo = "🚀 ArcFlow - Sistema AEC Completo",
  subtitulo = "✨ Arquitetura • Engenharia • Construção",
  className = ""
}: FooterSectionProps) {
  const { tema, temaId } = useTheme()

  return (
    <footer className={`py-8 px-6 mt-12 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center text-sm ${tema.textSecondary}`}>
          <p className="font-medium">{titulo}</p>
          <p className="mt-1 opacity-75">{subtitulo}</p>
        </div>
      </div>
    </footer>
  )
} 