import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { 
  ConfiguracaoGeral, 
  ConfigTipo, 
  CONFIGURACOES_PADRAO,
  ConfiguracaoEmpresa,
  ConfiguracaoFinanceira,
  ConfiguracaoOperacional,
  ConfiguracaoProjeto,
  ConfiguracaoSeguranca,
  ConfiguracaoSugerida
} from '../types/configuracoes'

interface ConfiguracaoState {
  // Estado
  configuracoes: ConfiguracaoGeral
  isLoading: boolean
  lastSaved: Date | null
  errors: Record<string, string>
  
  // Ações básicas
  carregarConfiguracoes: () => Promise<void>
  salvarConfiguracao: (tipo: ConfigTipo, dados: any) => Promise<void>
  salvarTodasConfiguracoes: () => Promise<void>
  resetarConfiguracoes: (tipo?: ConfigTipo) => void
  
  // Ações específicas por tipo
  atualizarEmpresa: (dados: Partial<ConfiguracaoEmpresa>) => Promise<void>
  atualizarFinanceira: (dados: Partial<ConfiguracaoFinanceira>) => Promise<void>
  atualizarOperacional: (dados: Partial<ConfiguracaoOperacional>) => Promise<void>
  atualizarProjeto: (dados: Partial<ConfiguracaoProjeto>) => Promise<void>
  atualizarSeguranca: (dados: Partial<ConfiguracaoSeguranca>) => Promise<void>
  
  // Utilitários
  exportarConfiguracoes: () => Blob
  importarConfiguracoes: (file: File) => Promise<void>
  validarConfiguracao: (tipo: ConfigTipo) => string[]
  obterSugestoes: () => ConfiguracaoSugerida[]
  
  // Estado da UI
  setLoading: (loading: boolean) => void
  setError: (campo: string, erro: string) => void
  clearErrors: () => void
}

const useConfiguracaoStore = create<ConfiguracaoState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      configuracoes: CONFIGURACOES_PADRAO,
      isLoading: false,
      lastSaved: null,
      errors: {},
      
      // ===== AÇÕES BÁSICAS =====
      carregarConfiguracoes: async () => {
        set({ isLoading: true })
        try {
          // Em produção, aqui faria uma chamada para API
          // Por enquanto, usa localStorage via persist
          const state = get()
          if (!state.configuracoes.versao) {
            set({ configuracoes: CONFIGURACOES_PADRAO })
          }
        } catch (error) {
          console.error('Erro ao carregar configurações:', error)
        } finally {
          set({ isLoading: false })
        }
      },
      
      salvarConfiguracao: async (tipo: ConfigTipo, dados: any) => {
        set({ isLoading: true })
        try {
          const state = get()
          const novasConfiguracoes = {
            ...state.configuracoes,
            [tipo]: {
              ...state.configuracoes[tipo],
              ...dados
            },
            ultimaAtualizacao: new Date()
          }
          
          // Simular delay de rede
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set({ 
            configuracoes: novasConfiguracoes,
            lastSaved: new Date(),
            isLoading: false
          })
          
          // Aqui enviaria para API em produção
          console.log(`✅ Configuração ${tipo} salva com sucesso`)
          
        } catch (error) {
          console.error(`Erro ao salvar configuração ${tipo}:`, error)
          set({ isLoading: false })
          throw error
        }
      },
      
      salvarTodasConfiguracoes: async () => {
        set({ isLoading: true })
        try {
          const state = get()
          
          // Simular delay de rede
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          set({ 
            configuracoes: {
              ...state.configuracoes,
              ultimaAtualizacao: new Date()
            },
            lastSaved: new Date(),
            isLoading: false
          })
          
          console.log('✅ Todas as configurações salvas com sucesso')
          
        } catch (error) {
          console.error('Erro ao salvar todas as configurações:', error)
          set({ isLoading: false })
          throw error
        }
      },
      
      resetarConfiguracoes: (tipo?: ConfigTipo) => {
        if (tipo) {
          const state = get()
          set({
            configuracoes: {
              ...state.configuracoes,
              [tipo]: CONFIGURACOES_PADRAO[tipo],
              ultimaAtualizacao: new Date()
            }
          })
        } else {
          set({ configuracoes: CONFIGURACOES_PADRAO })
        }
      },
      
      // ===== AÇÕES ESPECÍFICAS =====
      atualizarEmpresa: async (dados: Partial<ConfiguracaoEmpresa>) => {
        await get().salvarConfiguracao('empresa', dados)
      },
      
      atualizarFinanceira: async (dados: Partial<ConfiguracaoFinanceira>) => {
        await get().salvarConfiguracao('financeira', dados)
      },
      
      atualizarOperacional: async (dados: Partial<ConfiguracaoOperacional>) => {
        await get().salvarConfiguracao('operacional', dados)
      },
      
      atualizarProjeto: async (dados: Partial<ConfiguracaoProjeto>) => {
        await get().salvarConfiguracao('projeto', dados)
      },
      
      atualizarSeguranca: async (dados: Partial<ConfiguracaoSeguranca>) => {
        await get().salvarConfiguracao('seguranca', dados)
      },
      
      // ===== UTILITÁRIOS =====
      exportarConfiguracoes: () => {
        const state = get()
        const configuracoes = {
          ...state.configuracoes,
          exportadoEm: new Date(),
          versaoExportacao: '1.0.0'
        }
        
        const blob = new Blob([JSON.stringify(configuracoes, null, 2)], {
          type: 'application/json'
        })
        
        return blob
      },
      
      importarConfiguracoes: async (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          
          reader.onload = (e) => {
            try {
              const configuracoes = JSON.parse(e.target?.result as string)
              
              // Validações básicas
              if (!configuracoes.versao) {
                throw new Error('Arquivo de configuração inválido')
              }
              
              set({ 
                configuracoes: {
                  ...configuracoes,
                  ultimaAtualizacao: new Date(),
                  criadoPor: 'Importação'
                }
              })
              
              resolve(configuracoes)
            } catch (error) {
              reject(new Error('Erro ao processar arquivo de configuração'))
            }
          }
          
          reader.onerror = () => {
            reject(new Error('Erro ao ler arquivo'))
          }
          
          reader.readAsText(file)
        })
      },
      
      validarConfiguracao: (tipo: ConfigTipo) => {
        const state = get()
        const erros: string[] = []
        
        switch (tipo) {
          case 'empresa':
            const empresa = state.configuracoes.empresa
            if (!empresa.razaoSocial) erros.push('Razão Social é obrigatória')
            if (!empresa.cnpj) erros.push('CNPJ é obrigatório')
            if (!empresa.email) erros.push('Email é obrigatório')
            break
            
          case 'financeira':
            const financeira = state.configuracoes.financeira
            if (financeira.aliquotaISS < 0 || financeira.aliquotaISS > 5) {
              erros.push('Alíquota ISS deve estar entre 0% e 5%')
            }
            break
            
          case 'operacional':
            const operacional = state.configuracoes.operacional
            if (operacional.horariosTrabalho.horasDia < 4 || operacional.horariosTrabalho.horasDia > 12) {
              erros.push('Horas por dia deve estar entre 4 e 12')
            }
            break
            
          case 'seguranca':
            const seguranca = state.configuracoes.seguranca
            if (seguranca.politicaSenha.tamanhoMinimo < 6) {
              erros.push('Tamanho mínimo da senha deve ser pelo menos 6')
            }
            break
        }
        
        return erros
      },
      
      obterSugestoes: () => {
        const state = get()
        const sugestoes: ConfiguracaoSugerida[] = []
        
        // Sugestão para empresa
        if (!state.configuracoes.empresa.logo) {
          sugestoes.push({
            tipo: 'empresa',
            campo: 'logo',
            valorAtual: null,
            valorSugerido: 'Adicionar logo da empresa',
            motivo: 'Melhora a apresentação profissional',
            impacto: 'medio'
          })
        }
        
        // Sugestão para financeiro
        if (state.configuracoes.financeira.condicoesPagamento.length === 0) {
          sugestoes.push({
            tipo: 'financeira',
            campo: 'condicoesPagamento',
            valorAtual: [],
            valorSugerido: 'Configurar condições de pagamento',
            motivo: 'Acelera fechamento de negócios',
            impacto: 'alto'
          })
        }
        
        // Sugestão para operacional
        if (state.configuracoes.operacional.membrosEquipe.length === 0) {
          sugestoes.push({
            tipo: 'operacional',
            campo: 'membrosEquipe',
            valorAtual: [],
            valorSugerido: 'Cadastrar membros da equipe',
            motivo: 'Melhora controle de capacidade produtiva',
            impacto: 'alto'
          })
        }
        
        return sugestoes
      },
      
      // ===== ESTADO DA UI =====
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      setError: (campo: string, erro: string) => {
        const state = get()
        set({
          errors: {
            ...state.errors,
            [campo]: erro
          }
        })
      },
      
      clearErrors: () => {
        set({ errors: {} })
      }
    }),
    {
      name: 'arcflow-configuracoes',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configuracoes: state.configuracoes,
        lastSaved: state.lastSaved
      })
    }
  )
)

// ===== HOOKS AUXILIARES =====

// Hook para configurações da empresa
export const useConfigEmpresa = () => {
  const store = useConfiguracaoStore()
  return {
    configuracao: store.configuracoes.empresa,
    atualizar: store.atualizarEmpresa,
    validar: () => store.validarConfiguracao('empresa'),
    isLoading: store.isLoading
  }
}

// Hook para configurações financeiras
export const useConfigFinanceira = () => {
  const store = useConfiguracaoStore()
  return {
    configuracao: store.configuracoes.financeira,
    atualizar: store.atualizarFinanceira,
    validar: () => store.validarConfiguracao('financeira'),
    isLoading: store.isLoading
  }
}

// Hook para configurações operacionais
export const useConfigOperacional = () => {
  const store = useConfiguracaoStore()
  return {
    configuracao: store.configuracoes.operacional,
    atualizar: store.atualizarOperacional,
    validar: () => store.validarConfiguracao('operacional'),
    isLoading: store.isLoading
  }
}

// Hook para configurações de projeto
export const useConfigProjeto = () => {
  const store = useConfiguracaoStore()
  return {
    configuracao: store.configuracoes.projeto,
    atualizar: store.atualizarProjeto,
    validar: () => store.validarConfiguracao('projeto'),
    isLoading: store.isLoading
  }
}

// Hook para configurações de segurança
export const useConfigSeguranca = () => {
  const store = useConfiguracaoStore()
  return {
    configuracao: store.configuracoes.seguranca,
    atualizar: store.atualizarSeguranca,
    validar: () => store.validarConfiguracao('seguranca'),
    isLoading: store.isLoading
  }
}

export default useConfiguracaoStore 