import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ArcFlow - Gestão Inteligente para Escritórios AEC',
  description: 'A primeira plataforma de otimização baseada em dados para arquitetos e engenheiros. Aumente sua margem em 35% com gestão inteligente.',
  keywords: 'gestão escritório arquitetura, software arquitetos, gestão projetos AEC, otimização escritório',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
} 