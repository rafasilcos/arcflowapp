// 💰 SERVIÇO DE CONFIGURAÇÃO DE PRECIFICAÇÃO - ARCFLOW
// Gerencia valores, multiplicadores e configurações de orçamento

import { useState, useEffect } from 'react'

export interface ConfiguracaoPrecificacao {
  disciplinas: {
    [key: string]: {
      nome: string
      valorPorM2: number
      valorPorHora: number
      horasEstimadas: number
      ativo: boolean
    }
  }
  multiplicadoresRegionais: {
    [key: string]: {
      nome: string
      multiplicador: number
    }
  }
  padroesConstrucao: {
    [key: string]: {
      nome: string
      multiplicador: number
      descricao: string
    }
  }
  custosIndiretos: {
    margemLucro: number
    overhead: number
    impostos: number
  }
}

// 🎯 CONFIGURAÇÃO PADRÃO BASEADA NA PESQUISA DE MERCADO
export const CONFIGURACAO_PRECIFICACAO_PADRAO: ConfiguracaoPrecificacao = {
  disciplinas: {
    arquitetura: {
      nome: 'Projeto Arquitetônico',
      valorPorM2: 75,
      valorPorHora: 150,
      horasEstimadas: 110,
      ativo: true
    },
    modelagem3d: {
      nome: 'Modelagem 3D + 6 Renderizações',
      valorPorM2: 17,
      valorPorHora: 120,
      horasEstimadas: 45,
      ativo: true
    },
    aprovacao: {
      nome: 'Aprovação Prefeitura + Alvará',
      valorPorM2: 12,
      valorPorHora: 100,
      horasEstimadas: 35,
      ativo: true
    },
    estrutural: {
      nome: 'Projeto Estrutural',
      valorPorM2: 45,
      valorPorHora: 180,
      horasEstimadas: 88,
      ativo: false
    },
    instalacoes: {
      nome: 'Projetos de Instalações',
      valorPorM2: 35,
      valorPorHora: 160,
      horasEstimadas: 75,
      ativo: false
    },
    paisagismo: {
      nome: 'Projeto Paisagístico',
      valorPorM2: 25,
      valorPorHora: 140,
      horasEstimadas: 60,
      ativo: false
    },
    interiores: {
      nome: 'Design de Interiores',
      valorPorM2: 30,
      valorPorHora: 130,
      horasEstimadas: 65,
      ativo: false
    }
  },
  multiplicadoresRegionais: {
    norte: { nome: 'Norte', multiplicador: 0.85 },
    nordeste: { nome: 'Nordeste', multiplicador: 0.90 },
    centro_oeste: { nome: 'Centro-Oeste', multiplicador: 0.95 },
    sudeste: { nome: 'Sudeste', multiplicador: 1.15 },
    sul: { nome: 'Sul', multiplicador: 1.05 }
  },
  padroesConstrucao: {
    simples: { nome: 'Simples', multiplicador: 0.7, descricao: 'Acabamentos básicos' },
    medio: { nome: 'Médio', multiplicador: 1.0, descricao: 'Acabamentos intermediários' },
    alto: { nome: 'Alto', multiplicador: 1.4, descricao: 'Acabamentos superiores' },
    luxo: { nome: 'Luxo', multiplicador: 1.8, descricao: 'Acabamentos premium' },
    premium: { nome: 'Premium', multiplicador: 2.5, descricao: 'Acabamentos exclusivos' }
  },
  custosIndiretos: {
    margemLucro: 15,
    overhead: 25,
    impostos: 12
  }
}

// 🔧 CLASSE DE SERVIÇO
export class ConfiguracaoPrecificacaoService {
  private static readonly STORAGE_KEY = 'arcflow-configuracao-precificacao'
  
  // 📥 CARREGAR CONFIGURAÇÃO
  static carregarConfiguracao(): ConfiguracaoPrecificacao {
    try {
      const configuracaoSalva = localStorage.getItem(this.STORAGE_KEY)
      if (configuracaoSalva) {
        const configuracao = JSON.parse(configuracaoSalva)
        // Mesclar com padrão para garantir que novos campos sejam incluídos
        return this.mesclarComPadrao(configuracao)
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração de precificação:', error)
    }
    return CONFIGURACAO_PRECIFICACAO_PADRAO
  }
  
  // 💾 SALVAR CONFIGURAÇÃO
  static salvarConfiguracao(configuracao: ConfiguracaoPrecificacao): boolean {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configuracao))
      return true
    } catch (error) {
      console.error('Erro ao salvar configuração de precificação:', error)
      return false
    }
  }
  
  // 🔄 MESCLAR COM PADRÃO
  private static mesclarComPadrao(configuracao: any): ConfiguracaoPrecificacao {
    return {
      disciplinas: {
        ...CONFIGURACAO_PRECIFICACAO_PADRAO.disciplinas,
        ...configuracao.disciplinas
      },
      multiplicadoresRegionais: {
        ...CONFIGURACAO_PRECIFICACAO_PADRAO.multiplicadoresRegionais,
        ...configuracao.multiplicadoresRegionais
      },
      padroesConstrucao: {
        ...CONFIGURACAO_PRECIFICACAO_PADRAO.padroesConstrucao,
        ...configuracao.padroesConstrucao
      },
      custosIndiretos: {
        ...CONFIGURACAO_PRECIFICACAO_PADRAO.custosIndiretos,
        ...configuracao.custosIndiretos
      }
    }
  }
  
  // 💰 CALCULAR ORÇAMENTO
  static calcularOrcamento(params: {
    areaConstruida: number
    regiao: keyof ConfiguracaoPrecificacao['multiplicadoresRegionais']
    padraoConstrucao: keyof ConfiguracaoPrecificacao['padroesConstrucao']
    disciplinasSelecionadas: string[]
    configuracao?: ConfiguracaoPrecificacao
  }) {
    const config = params.configuracao || this.carregarConfiguracao()
    
    const multiplicadorRegional = config.multiplicadoresRegionais[params.regiao]?.multiplicador || 1
    const multiplicadorPadrao = config.padroesConstrucao[params.padraoConstrucao]?.multiplicador || 1
    
    let valorTotal = 0
    const detalheDisciplinas: Array<{
      id: string
      nome: string
      valorBase: number
      valorFinal: number
      valorPorM2: number
    }> = []
    
    params.disciplinasSelecionadas.forEach(disciplinaId => {
      const disciplina = config.disciplinas[disciplinaId]
      if (disciplina && disciplina.ativo) {
        const valorBase = disciplina.valorPorM2 * params.areaConstruida
        const valorComMultiplicadores = valorBase * multiplicadorRegional * multiplicadorPadrao
        
        valorTotal += valorComMultiplicadores
        
        detalheDisciplinas.push({
          id: disciplinaId,
          nome: disciplina.nome,
          valorBase,
          valorFinal: valorComMultiplicadores,
          valorPorM2: disciplina.valorPorM2 * multiplicadorRegional * multiplicadorPadrao
        })
      }
    })
    
    // Aplicar custos indiretos
    const subtotal = valorTotal
    const overhead = (subtotal * config.custosIndiretos.overhead) / 100
    const impostos = (subtotal * config.custosIndiretos.impostos) / 100
    const margemLucro = (subtotal * config.custosIndiretos.margemLucro) / 100
    
    const valorFinalTotal = subtotal + overhead + impostos + margemLucro
    
    return {
      disciplinas: detalheDisciplinas,
      resumo: {
        subtotal,
        overhead,
        impostos,
        margemLucro,
        valorTotal: valorFinalTotal,
        valorPorM2: valorFinalTotal / params.areaConstruida
      },
      multiplicadores: {
        regional: multiplicadorRegional,
        padrao: multiplicadorPadrao
      },
      configuracaoUsada: config
    }
  }
  
  // 📊 OBTER DISCIPLINAS ATIVAS
  static obterDisciplinasAtivas(configuracao?: ConfiguracaoPrecificacao): Array<{
    id: string
    nome: string
    valorPorM2: number
    valorPorHora: number
  }> {
    const config = configuracao || this.carregarConfiguracao()
    
    return Object.entries(config.disciplinas)
      .filter(([_, disciplina]) => disciplina.ativo)
      .map(([id, disciplina]) => ({
        id,
        nome: disciplina.nome,
        valorPorM2: disciplina.valorPorM2,
        valorPorHora: disciplina.valorPorHora
      }))
  }
  
  // 🌍 OBTER REGIÕES
  static obterRegioes(configuracao?: ConfiguracaoPrecificacao) {
    const config = configuracao || this.carregarConfiguracao()
    return config.multiplicadoresRegionais
  }
  
  // 🏗️ OBTER PADRÕES DE CONSTRUÇÃO
  static obterPadroesConstrucao(configuracao?: ConfiguracaoPrecificacao) {
    const config = configuracao || this.carregarConfiguracao()
    return config.padroesConstrucao
  }
  
  // 📤 EXPORTAR CONFIGURAÇÃO
  static exportarConfiguracao(configuracao?: ConfiguracaoPrecificacao): string {
    const config = configuracao || this.carregarConfiguracao()
    return JSON.stringify(config, null, 2)
  }
  
  // 📥 IMPORTAR CONFIGURAÇÃO
  static importarConfiguracao(dadosJson: string): ConfiguracaoPrecificacao | null {
    try {
      const configuracao = JSON.parse(dadosJson)
      const configuracaoMesclada = this.mesclarComPadrao(configuracao)
      this.salvarConfiguracao(configuracaoMesclada)
      return configuracaoMesclada
    } catch (error) {
      console.error('Erro ao importar configuração:', error)
      return null
    }
  }
  
  // 🔄 RESETAR PARA PADRÃO
  static resetarParaPadrao(): ConfiguracaoPrecificacao {
    this.salvarConfiguracao(CONFIGURACAO_PRECIFICACAO_PADRAO)
    return CONFIGURACAO_PRECIFICACAO_PADRAO
  }
}

// 🎯 HOOK PARA REACT
export function useConfiguracaoPrecificacao() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoPrecificacao>(
    CONFIGURACAO_PRECIFICACAO_PADRAO
  )

  // Carregar configuração do backend quando disponível
  useEffect(() => {
    const carregarConfiguracaoBackend = async () => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('token')
          if (token) {
            // Tentar carregar do backend primeiro
            const response = await fetch('/api/configuracoes-orcamento/escritorio/' + 
              JSON.parse(atob(token.split('.')[1])).escritorio_id, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.data.configuracao) {
                // Converter formato do backend para frontend
                const configBackend = data.data.configuracao
                const configConvertida = {
                  disciplinas: configBackend.disciplinas || CONFIGURACAO_PRECIFICACAO_PADRAO.disciplinas,
                  multiplicadoresRegionais: configBackend.multiplicadoresRegionais || CONFIGURACAO_PRECIFICACAO_PADRAO.multiplicadoresRegionais,
                  padroesConstrucao: configBackend.padroesConstrucao || CONFIGURACAO_PRECIFICACAO_PADRAO.padroesConstrucao,
                  custosIndiretos: configBackend.custosIndiretos || CONFIGURACAO_PRECIFICACAO_PADRAO.custosIndiretos
                }
                setConfiguracao(configConvertida)
                return
              }
            }
          }
        } catch (error) {
          console.warn('Erro ao carregar configuração do backend, usando localStorage:', error)
        }
        
        // Fallback para localStorage
        const configCarregada = ConfiguracaoPrecificacaoService.carregarConfiguracao()
        setConfiguracao(configCarregada)
      }
    }
    
    carregarConfiguracaoBackend()
  }, [])
  
  const atualizarConfiguracao = (novaConfiguracao: ConfiguracaoPrecificacao) => {
    setConfiguracao(novaConfiguracao)
    ConfiguracaoPrecificacaoService.salvarConfiguracao(novaConfiguracao)
  }
  
  const calcularOrcamento = (params: {
    areaConstruida: number
    regiao: keyof ConfiguracaoPrecificacao['multiplicadoresRegionais']
    padraoConstrucao: keyof ConfiguracaoPrecificacao['padroesConstrucao']
    disciplinasSelecionadas: string[]
  }) => {
    return ConfiguracaoPrecificacaoService.calcularOrcamento({
      ...params,
      configuracao
    })
  }
  
  return {
    configuracao,
    atualizarConfiguracao,
    calcularOrcamento,
    disciplinasAtivas: ConfiguracaoPrecificacaoService.obterDisciplinasAtivas(configuracao),
    regioes: ConfiguracaoPrecificacaoService.obterRegioes(configuracao),
    padroesConstrucao: ConfiguracaoPrecificacaoService.obterPadroesConstrucao(configuracao),
    exportar: () => ConfiguracaoPrecificacaoService.exportarConfiguracao(configuracao),
    importar: ConfiguracaoPrecificacaoService.importarConfiguracao,
    resetar: () => {
      const configuracaoPadrao = ConfiguracaoPrecificacaoService.resetarParaPadrao()
      setConfiguracao(configuracaoPadrao)
      return configuracaoPadrao
    }
  }
}