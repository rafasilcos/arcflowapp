'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Definição dos temas baseados no onboarding
export const TEMAS = {
  profissional: {
    id: 'profissional',
    nome: 'Profissional',
    primaria: '#2563eb',
    secundaria: '#1e40af', 
    acento: '#3b82f6',
    gradiente: 'from-blue-600 to-blue-700',
    gradienteHover: 'from-blue-700 to-blue-800',
    bg: 'from-slate-900 via-blue-900 to-slate-800',
    sidebar: 'bg-blue-900/20',
    card: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-100',
    textSecondary: 'text-blue-200/60'
  },
  elegante: {
    id: 'elegante',
    nome: 'ArcFlow Professional',
    primaria: '#0F62FE', // IBM Blue - ações principais
    secundaria: '#0043CE', // IBM Blue Hover
    acento: '#8B5CF6', // Accent Purple - IA e destaques
    gradiente: 'from-blue-600 to-blue-700', // Gradiente IBM Blue
    gradienteHover: 'from-blue-700 to-blue-800',
    bg: 'from-gray-50 via-gray-100 to-white', // Background limpo
    sidebar: 'bg-slate-800', // Menu lateral profissional
    card: 'bg-white border-gray-200 shadow-sm', // Cards limpos
    text: 'text-gray-900', // Texto principal
    textSecondary: 'text-gray-600' // Texto secundário
  },
  moderno: {
    id: 'moderno',
    nome: 'Moderno',
    primaria: '#10b981',
    secundaria: '#059669',
    acento: '#34d399',
    gradiente: 'from-emerald-600 to-emerald-700',
    gradienteHover: 'from-emerald-700 to-emerald-800',
    bg: 'from-slate-900 via-emerald-900 to-slate-800',
    sidebar: 'bg-emerald-900/20',
    card: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-100',
    textSecondary: 'text-emerald-200/60'
  },
  criativo: {
    id: 'criativo',
    nome: 'Criativo',
    primaria: '#7c3aed',
    secundaria: '#6d28d9',
    acento: '#8b5cf6',
    gradiente: 'from-violet-600 to-violet-700',
    gradienteHover: 'from-violet-700 to-violet-800',
    bg: 'from-slate-900 via-violet-900 to-slate-800',
    sidebar: 'bg-violet-900/20',
    card: 'bg-violet-500/10 border-violet-500/20',
    text: 'text-violet-100',
    textSecondary: 'text-violet-200/60'
  },
  energetico: {
    id: 'energetico',
    nome: 'Energético',
    primaria: '#ea580c',
    secundaria: '#c2410c',
    acento: '#fb923c',
    gradiente: 'from-orange-600 to-orange-700',
    gradienteHover: 'from-orange-700 to-orange-800',
    bg: 'from-slate-900 via-orange-900 to-slate-800',
    sidebar: 'bg-orange-900/20',
    card: 'bg-orange-500/10 border-orange-500/20',
    text: 'text-orange-100',
    textSecondary: 'text-orange-200/60'
  },
  premium: {
    id: 'premium',
    nome: 'Premium',
    primaria: '#d97706',
    secundaria: '#b45309',
    acento: '#f59e0b',
    gradiente: 'from-amber-600 to-amber-700',
    gradienteHover: 'from-amber-700 to-amber-800',
    bg: 'from-slate-900 via-amber-900 to-slate-800',
    sidebar: 'bg-amber-900/20',
    card: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-100',
    textSecondary: 'text-amber-200/60'
  }
} as const

export type TemaId = keyof typeof TEMAS
export type Tema = typeof TEMAS[TemaId]

interface PersonalizacaoCompleta {
  logo?: string
  paletaCores: TemaId
  estilo: 'moderno' | 'classico' | 'minimalista'
  textoPersonalizado: {
    cabecalho: string
    rodape: string
  }
  nomeEmpresa?: string
}

interface ThemeContextType {
  tema: Tema
  temaId: TemaId
  personalizacao: PersonalizacaoCompleta
  isLoading: boolean
  mudarTema: (novoTemaId: TemaId) => void
  atualizarPersonalizacao: (novaPersonalizacao: Partial<PersonalizacaoCompleta>) => void
  carregarPersonalizacaoOnboarding: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Tema padrão para fallback e inicialização
const TEMA_PADRAO: TemaId = 'elegante'
const PERSONALIZACAO_PADRAO: PersonalizacaoCompleta = {
  paletaCores: TEMA_PADRAO,
  estilo: 'moderno',
  textoPersonalizado: {
    cabecalho: 'ArcFlow',
    rodape: 'Powered by ArcFlow'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [temaId, setTemaId] = useState<TemaId>(TEMA_PADRAO)
  const [personalizacao, setPersonalizacao] = useState<PersonalizacaoCompleta>(PERSONALIZACAO_PADRAO)
  const [isLoading, setIsLoading] = useState(true)

  // Garantir que sempre temos um tema válido
  const tema = TEMAS[temaId] || TEMAS[TEMA_PADRAO]

  // Carregar personalização do localStorage na inicialização
  useEffect(() => {
    // Garantir que só executa no cliente
    if (typeof window !== 'undefined') {
      carregarPersonalizacaoOnboarding()
    }
  }, [])

  const carregarPersonalizacaoOnboarding = () => {
    try {
      setIsLoading(true)
      
      const dadosOnboarding = localStorage.getItem('arcflow-onboarding-v3')
      if (dadosOnboarding) {
        const dados = JSON.parse(dadosOnboarding)
        
        // Extrair dados de personalização do onboarding
        const novaPersonalizacao: PersonalizacaoCompleta = {
          logo: dados.personalizacao?.logo?.preview || dados.personalizacao?.logo,
          paletaCores: dados.personalizacao?.cores?.paleta || TEMA_PADRAO,
          estilo: dados.personalizacao?.templates?.estilo || 'moderno',
          textoPersonalizado: {
            cabecalho: dados.personalizacao?.templates?.cabecalho || 
                      dados.identificacao?.nomeEmpresa || 'ArcFlow',
            rodape: dados.personalizacao?.templates?.rodape || 'Powered by ArcFlow'
          },
          nomeEmpresa: dados.identificacao?.nomeEmpresa
        }

        // Validar se o tema existe
        const temaValido = novaPersonalizacao.paletaCores in TEMAS ? novaPersonalizacao.paletaCores : TEMA_PADRAO
        
        setPersonalizacao({ ...novaPersonalizacao, paletaCores: temaValido })
        setTemaId(temaValido)

        // Salvar também no localStorage específico do tema
        localStorage.setItem('arcflow-theme', JSON.stringify({
          temaId: temaValido,
          personalizacao: { ...novaPersonalizacao, paletaCores: temaValido }
        }))
      } else {
        // Tentar carregar configuração de tema salva separadamente
        const temasSalvos = localStorage.getItem('arcflow-theme')
        if (temasSalvos) {
          const dados = JSON.parse(temasSalvos)
          const temaValido = dados.temaId in TEMAS ? dados.temaId : TEMA_PADRAO
          
          setTemaId(temaValido)
          setPersonalizacao(dados.personalizacao || PERSONALIZACAO_PADRAO)
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar personalização:', error)
      // Manter valores padrão em caso de erro
      setTemaId(TEMA_PADRAO)
      setPersonalizacao(PERSONALIZACAO_PADRAO)
    } finally {
      setIsLoading(false)
    }
  }

  const mudarTema = (novoTemaId: TemaId) => {
    setTemaId(novoTemaId)
    const novaPersonalizacao = {
      ...personalizacao,
      paletaCores: novoTemaId
    }
    setPersonalizacao(novaPersonalizacao)
    
    // Salvar no localStorage
    localStorage.setItem('arcflow-theme', JSON.stringify({
      temaId: novoTemaId,
      personalizacao: novaPersonalizacao
    }))
  }

  const atualizarPersonalizacao = (novaPersonalizacao: Partial<PersonalizacaoCompleta>) => {
    const personalizacaoAtualizada = {
      ...personalizacao,
      ...novaPersonalizacao
    }
    setPersonalizacao(personalizacaoAtualizada)
    
    // Atualizar tema se a paleta mudou
    if (novaPersonalizacao.paletaCores) {
      setTemaId(novaPersonalizacao.paletaCores)
    }
    
    // Salvar no localStorage
    localStorage.setItem('arcflow-theme', JSON.stringify({
      temaId: personalizacaoAtualizada.paletaCores,
      personalizacao: personalizacaoAtualizada
    }))
  }

  const contextValue: ThemeContextType = {
    tema,
    temaId,
    personalizacao,
    isLoading,
    mudarTema,
    atualizarPersonalizacao,
    carregarPersonalizacaoOnboarding
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return context
}

// Utilitários para aplicação de temas
export const aplicarCorTema = (tema: Tema, elemento: 'primaria' | 'secundaria' | 'acento') => {
  return tema[elemento]
}

export const aplicarGradienteTema = (tema: Tema, hover: boolean = false) => {
  return hover ? tema.gradienteHover : tema.gradiente
}

export const aplicarClassesTema = (tema: Tema) => ({
  bg: `bg-gradient-to-br ${tema.bg}`,
  sidebar: tema.sidebar,
  card: tema.card,
  text: tema.text,
  textSecondary: tema.textSecondary,
  gradiente: `bg-gradient-to-r ${tema.gradiente}`,
  gradienteHover: `bg-gradient-to-r ${tema.gradienteHover}`
}) 