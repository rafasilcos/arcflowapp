import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientWrapper from '@/components/ClientWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArcFlow - Sistema de Gestão para Escritórios AEC',
  description: 'Plataforma completa para gestão de projetos, briefings e fluxos de trabalho em escritórios de Arquitetura, Engenharia e Construção.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
