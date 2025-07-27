'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Interfaces das Configurações do Escritório
interface EspecializacaoEscritorio {
  residencialAlto: boolean
  residencialMedio: boolean  
  residencialSimples: boolean
  comercial: boolean
  industrial: boolean
  institucional: boolean
}

interface ConfiguracaoEscritorio {
  nomeEscritorio: string
  porte: 'solo' | 'pequeno' | 'medio' | 'grande'
  faturamentoMensal: number
  anosExperiencia: number
  disciplinaPrincipal: 'arquitetura' | 'engenharia' | 'construcao'
  especializacoes: EspecializacaoEscritorio
  onboardingCompleto: boolean
}

interface EscritorioContextType {
  configuracao: ConfiguracaoEscritorio
  atualizarConfiguracao: (novaConfig: Partial<ConfiguracaoEscritorio>) => void
  getTipologiasDisponiveis: () => string[]
  getPerfilEscritorio: () => string
}

const EscritorioContext = createContext<EscritorioContextType | undefined>(undefined)

// Mock de configurações baseadas no onboarding
const CONFIGURACAO_INICIAL: ConfiguracaoEscritorio = {
  nomeEscritorio: 'Costa Arquitetura',
  porte: 'pequeno',
  faturamentoMensal: 45000,
  anosExperiencia: 8,
  disciplinaPrincipal: 'arquitetura',
  especializacoes: {
    residencialAlto: true,    // ✅ Especializado em alto padrão
    residencialMedio: false,  // ❌ Não atende médio padrão  
    residencialSimples: false, // ❌ Não atende simples
    comercial: true,          // ✅ Atende comercial
    industrial: false,        // ❌ Não atende industrial
    institucional: false      // ❌ Não atende institucional
  },
  onboardingCompleto: true
}

export function EscritorioProvider({ children }: { children: ReactNode }) {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEscritorio>(CONFIGURACAO_INICIAL)

  const atualizarConfiguracao = (novaConfig: Partial<ConfiguracaoEscritorio>) => {
    setConfiguracao(prev => ({
      ...prev,
      ...novaConfig,
      especializacoes: {
        ...prev.especializacoes,
        ...(novaConfig.especializacoes || {})
      }
    }))
  }

  const getTipologiasDisponiveis = (): string[] => {
    const tipologias: string[] = []
    
    if (configuracao.especializacoes.residencialAlto) tipologias.push('residencial-alto')
    if (configuracao.especializacoes.residencialMedio) tipologias.push('residencial-medio')
    if (configuracao.especializacoes.residencialSimples) tipologias.push('residencial-simples')
    if (configuracao.especializacoes.comercial) tipologias.push('comercial')
    if (configuracao.especializacoes.industrial) tipologias.push('industrial')
    if (configuracao.especializacoes.institucional) tipologias.push('institucional')
    
    return tipologias
  }

  const getPerfilEscritorio = (): string => {
    const ativas = Object.values(configuracao.especializacoes).filter(Boolean).length
    
    if (ativas >= 5) return 'Generalista Completo'
    if (ativas >= 3) return 'Multiespecialista'
    if (ativas === 2) return 'Biespecialista'
    if (ativas === 1) return 'Especialista'
    return 'Sem Especialização'
  }

  return (
    <EscritorioContext.Provider value={{
      configuracao,
      atualizarConfiguracao,
      getTipologiasDisponiveis,
      getPerfilEscritorio
    }}>
      {children}
    </EscritorioContext.Provider>
  )
}

export function useEscritorio() {
  const context = useContext(EscritorioContext)
  if (context === undefined) {
    throw new Error('useEscritorio must be used within an EscritorioProvider')
  }
  return context
}

// Presets de escritórios para demonstração
export const PRESETS_ESCRITORIOS = {
  altopadrao: {
    nomeEscritorio: 'Luxo Design Studio',
    porte: 'pequeno' as const,
    especializacoes: {
      residencialAlto: true,
      residencialMedio: false,
      residencialSimples: false,
      comercial: true,
      industrial: false,
      institucional: false
    }
  },
  generalista: {
    nomeEscritorio: 'Arquitetura Total',
    porte: 'medio' as const,
    especializacoes: {
      residencialAlto: true,
      residencialMedio: true,
      residencialSimples: true,
      comercial: true,
      industrial: true,
      institucional: true
    }
  },
  popular: {
    nomeEscritorio: 'Moradia Fácil',
    porte: 'pequeno' as const,
    especializacoes: {
      residencialAlto: false,
      residencialMedio: true,
      residencialSimples: true,
      comercial: false,
      industrial: false,
      institucional: false
    }
  },
  industrial: {
    nomeEscritorio: 'Engenharia Pro',
    porte: 'medio' as const,
    especializacoes: {
      residencialAlto: false,
      residencialMedio: false,
      residencialSimples: false,
      comercial: true,
      industrial: true,
      institucional: true
    }
  }
} 