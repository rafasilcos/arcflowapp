import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Tipos para o briefing
export interface BriefingData {
  // Dados básicos do projeto
  nomeCliente: string
  emailCliente: string
  telefoneCliente: string
  empresaCliente?: string
  
  // Dados do projeto
  nomeProjeto: string
  tipologia: string
  areaTotal: number
  localizacao: string
  
  // Disciplinas e complexidade
  disciplinasSelecionadas: string[]
  complexidade: 'Baixa' | 'Média' | 'Alta'
  urgencia: 'Normal' | 'Urgente' | 'Crítica'
  
  // Dados comerciais
  orcamentoEstimado?: number
  prazoDesejado?: string
  margem: number
  
  // Dados específicos por tipologia
  dadosEspecificos: Record<string, any>
  
  // Metadados
  criadoEm: string
  atualizadoEm: string
  status: 'rascunho' | 'completo' | 'enviado' | 'aprovado'
  
  // SaaS específico
  tenantId?: string
  usuarioId?: string
  versao: number
}

export interface BriefingStore {
  // Estado atual
  briefingAtual: BriefingData | null
  briefingsSalvos: BriefingData[]
  
  // Estados de UI
  etapaAtual: number
  carregando: boolean
  erro: string | null
  
  // Configurações SaaS
  limiteBriefings: number
  briefingsUsados: number
  planoAtual: 'free' | 'basic' | 'professional' | 'enterprise'
  
  // Actions básicas
  setBriefingAtual: (briefing: BriefingData | null) => void
  atualizarBriefing: (dados: Partial<BriefingData>) => void
  salvarBriefing: () => Promise<void>
  carregarBriefing: (id: string) => Promise<void>
  excluirBriefing: (id: string) => Promise<void>
  
  // Actions de navegação
  proximaEtapa: () => void
  etapaAnterior: () => void
  irParaEtapa: (etapa: number) => void
  
  // Actions de estado
  setCarregando: (carregando: boolean) => void
  setErro: (erro: string | null) => void
  limparErro: () => void
  
  // Actions SaaS
  verificarLimites: () => boolean
  atualizarPlano: (plano: string) => void
  sincronizarComServidor: () => Promise<void>
  
  // Utilitários
  resetar: () => void
  exportarBriefing: (formato: 'json' | 'pdf') => Promise<void>
}

const estadoInicial = {
  briefingAtual: null,
  briefingsSalvos: [],
  etapaAtual: 0,
  carregando: false,
  erro: null,
  limiteBriefings: 5, // Padrão para plano free
  briefingsUsados: 0,
  planoAtual: 'free' as const,
}

export const useBriefingStore = create<BriefingStore>()(
  persist(
    (set, get) => ({
      ...estadoInicial,
      
      // Actions básicas
      setBriefingAtual: (briefing) => {
        set({ briefingAtual: briefing })
      },
      
      atualizarBriefing: (dados) => {
        const { briefingAtual } = get()
        if (!briefingAtual) return
        
        const briefingAtualizado = {
          ...briefingAtual,
          ...dados,
          atualizadoEm: new Date().toISOString(),
          versao: briefingAtual.versao + 1,
        }
        
        set({ briefingAtual: briefingAtualizado })
      },
      
      salvarBriefing: async () => {
        const { briefingAtual, briefingsSalvos, verificarLimites } = get()
        if (!briefingAtual) return
        
        // Verificar limites do plano
        if (!verificarLimites()) {
          set({ erro: 'Limite de briefings atingido. Faça upgrade do seu plano.' })
          return
        }
        
        set({ carregando: true, erro: null })
        
        try {
          // Simular salvamento no servidor
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const briefingParaSalvar = {
            ...briefingAtual,
            status: 'completo' as const,
            atualizadoEm: new Date().toISOString(),
          }
          
          const briefingsAtualizados = [
            ...briefingsSalvos.filter(b => b.criadoEm !== briefingAtual.criadoEm),
            briefingParaSalvar
          ]
          
          set({ 
            briefingsSalvos: briefingsAtualizados,
            briefingsUsados: briefingsAtualizados.length,
            carregando: false 
          })
          
        } catch (error) {
          set({ 
            erro: 'Erro ao salvar briefing. Tente novamente.',
            carregando: false 
          })
        }
      },
      
      carregarBriefing: async (id) => {
        set({ carregando: true, erro: null })
        
        try {
          const { briefingsSalvos } = get()
          const briefing = briefingsSalvos.find(b => b.criadoEm === id)
          
          if (briefing) {
            set({ briefingAtual: briefing, carregando: false })
          } else {
            set({ erro: 'Briefing não encontrado', carregando: false })
          }
        } catch (error) {
          set({ 
            erro: 'Erro ao carregar briefing',
            carregando: false 
          })
        }
      },
      
      excluirBriefing: async (id) => {
        set({ carregando: true, erro: null })
        
        try {
          const { briefingsSalvos } = get()
          const briefingsAtualizados = briefingsSalvos.filter(b => b.criadoEm !== id)
          
          set({ 
            briefingsSalvos: briefingsAtualizados,
            briefingsUsados: briefingsAtualizados.length,
            carregando: false 
          })
        } catch (error) {
          set({ 
            erro: 'Erro ao excluir briefing',
            carregando: false 
          })
        }
      },
      
      // Actions de navegação
      proximaEtapa: () => {
        const { etapaAtual } = get()
        set({ etapaAtual: etapaAtual + 1 })
      },
      
      etapaAnterior: () => {
        const { etapaAtual } = get()
        if (etapaAtual > 0) {
          set({ etapaAtual: etapaAtual - 1 })
        }
      },
      
      irParaEtapa: (etapa) => {
        set({ etapaAtual: etapa })
      },
      
      // Actions de estado
      setCarregando: (carregando) => set({ carregando }),
      setErro: (erro) => set({ erro }),
      limparErro: () => set({ erro: null }),
      
      // Actions SaaS
      verificarLimites: () => {
        const { briefingsUsados, limiteBriefings } = get()
        return briefingsUsados < limiteBriefings
      },
      
      atualizarPlano: (plano) => {
        const limites = {
          free: 5,
          basic: 25,
          professional: 100,
          enterprise: 500,
        }
        
        set({ 
          planoAtual: plano as any,
          limiteBriefings: limites[plano as keyof typeof limites] || 5
        })
      },
      
      sincronizarComServidor: async () => {
        set({ carregando: true })
        
        try {
          // Simular sincronização
          await new Promise(resolve => setTimeout(resolve, 2000))
          set({ carregando: false })
        } catch (error) {
          set({ 
            erro: 'Erro na sincronização',
            carregando: false 
          })
        }
      },
      
      // Utilitários
      resetar: () => {
        set(estadoInicial)
      },
      
      exportarBriefing: async (formato) => {
        const { briefingAtual } = get()
        if (!briefingAtual) return
        
        set({ carregando: true })
        
        try {
          if (formato === 'json') {
            const dataStr = JSON.stringify(briefingAtual, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `briefing-${briefingAtual.nomeProjeto}.json`
            link.click()
            URL.revokeObjectURL(url)
          }
          
          set({ carregando: false })
        } catch (error) {
          set({ 
            erro: 'Erro ao exportar briefing',
            carregando: false 
          })
        }
      },
    }),
    {
      name: 'arcflow-briefing-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        briefingsSalvos: state.briefingsSalvos,
        planoAtual: state.planoAtual,
        limiteBriefings: state.limiteBriefings,
        briefingsUsados: state.briefingsUsados,
      }),
    }
  )
) 