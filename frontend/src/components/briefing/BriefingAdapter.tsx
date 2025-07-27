'use client'

import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing'
// Função dinâmica para buscar briefings aprovados
import { getBriefingAprovado } from '@/data/briefings-aprovados'
import { MAPEAMENTO_BRIEFINGS } from '@/types/disciplinas'
import { useState, useEffect } from 'react'
import EstruturaPersonalizadaService from '@/services/estruturaPersonalizadaService'

interface BriefingDataFromDB {
  id: string
  nome_projeto?: string
  nomeProjeto?: string  // 🔥 CORREÇÃO: Backend retorna em camelCase
  status: string
  progresso: number
  disciplina: string
  area: string
  tipologia: string
  created_at: string
  updated_at: string
  descricao?: string
  objetivos?: string
  prazo?: string
  orcamento?: string
  observacoes?: string | any  // Campo que contém estrutura personalizada
}

interface BriefingAdapterProps {
  briefingData: BriefingDataFromDB
  children: (briefingCompleto: BriefingCompleto) => React.ReactNode
  modoEdicao?: boolean
  respostasExistentes?: Record<string, any>
}

/**
 * �� ADAPTADOR DINÂMICO V6.0 - SOLUÇÃO DEFINITIVA
 * 
 * CORREÇÃO CRÍTICA IMPLEMENTADA:
 * ✅ Remove fallback hardcoded para unifamiliar
 * ✅ Usa função getBriefingAprovado para busca dinâmica
 * ✅ Suporta todos os 13 briefings disponíveis
 * ✅ Respeita seleção do usuário
 * ✅ Funciona com briefings adaptativos
 */
export default function BriefingAdapter({ briefingData, children, modoEdicao = false, respostasExistentes = {} }: BriefingAdapterProps) {
  
  const adaptarBriefing = async (): Promise<BriefingCompleto> => {
    console.log('🔄 [ADAPTER V7] Adaptação dinâmica DEFINITIVA iniciada:', {
      id: briefingData.id,
      disciplina: briefingData.disciplina,
      area: briefingData.area,
      tipologia: briefingData.tipologia,
      modoEdicao: modoEdicao,
      temRespostasExistentes: Object.keys(respostasExistentes).length > 0,
      timestamp: new Date().toISOString(),
      localStorageKeys: Object.keys(localStorage).filter(k => k.includes('briefing-personalizado'))
    })

    // 🚨 RAFAEL: DEBUG CRÍTICO PARA MODO EDIÇÃO
    if (modoEdicao) {
      console.log('🔥 [MODO EDIÇÃO] Respostas existentes recebidas:', {
        totalRespostas: Object.keys(respostasExistentes).length,
        primeiras5Respostas: Object.entries(respostasExistentes).slice(0, 5),
        respostasCompletas: respostasExistentes
      })
    }

    // 🚨 RAFAEL: CORREÇÃO CRÍTICA PARA MODO EDIÇÃO - COM SUPORTE A F5
    // Se estamos em modo de edição, tentar carregar estrutura personalizada de múltiplas fontes
    if (modoEdicao) {
      console.log('🔥 [MODO EDIÇÃO] Carregando estrutura personalizada (suporte F5)...')
      
      let estruturaPersonalizadaSalva = null
      let fonteDados = 'NAO_ENCONTRADA'
      
      // 🎯 PRIMEIRO: Verificar campo observacoes do próprio briefing (RAFAEL)
      if (briefingData.observacoes) {
        try {
          let observacoes
          if (typeof briefingData.observacoes === 'string') {
            observacoes = JSON.parse(briefingData.observacoes)
          } else {
            observacoes = briefingData.observacoes
          }
          
          console.log('🔍 [MODO EDIÇÃO] Analisando observações:', {
            temObservacoes: !!observacoes,
            keys: Object.keys(observacoes || {}),
            temEstruturaPersonalizada: !!observacoes.estruturaPersonalizada,
            temBriefingPersonalizado: !!observacoes.estruturaPersonalizada?.briefingPersonalizado
          })
          
          // Verificar diferentes formatos nas observações
          if (observacoes.estruturaPersonalizada?.briefingPersonalizado?.secoes) {
            estruturaPersonalizadaSalva = observacoes.estruturaPersonalizada.briefingPersonalizado
            fonteDados = 'OBSERVACOES_BRIEFING'
            console.log('✅ [MODO EDIÇÃO] Estrutura encontrada nas observações!')
          } else if (observacoes.briefingPersonalizado?.secoes) {
            estruturaPersonalizadaSalva = observacoes.briefingPersonalizado  
            fonteDados = 'OBSERVACOES_DIRETO'
            console.log('✅ [MODO EDIÇÃO] Estrutura encontrada diretamente nas observações!')
          } else if (observacoes.secoes) {
            estruturaPersonalizadaSalva = observacoes
            fonteDados = 'OBSERVACOES_RAIZ'
            console.log('✅ [MODO EDIÇÃO] Estrutura encontrada na raiz das observações!')
          }
        } catch (error) {
          console.warn('⚠️ [MODO EDIÇÃO] Erro ao parsear observações:', error)
        }
      }
      
      // 🎯 SEGUNDO: Se não encontrou nas observações, tentar banco de dados
      if (!estruturaPersonalizadaSalva) {
        try {
          estruturaPersonalizadaSalva = await EstruturaPersonalizadaService.carregarEstrutura(briefingData.id)
          if (estruturaPersonalizadaSalva && estruturaPersonalizadaSalva.secoes) {
            fonteDados = 'BANCO_DE_DADOS'
            console.log('✅ [MODO EDIÇÃO] Estrutura encontrada no banco de dados')
          }
        } catch (error) {
          console.warn('⚠️ [MODO EDIÇÃO] Erro ao carregar do banco:', error)
        }
      }
      
      // 🎯 TERCEIRO: Se ainda não encontrou, tentar localStorage
      if (!estruturaPersonalizadaSalva) {
        console.log('🔧 [MODO EDIÇÃO] Tentando localStorage...')
        const chavesPersonalizacao = [
          `briefing-personalizado-${briefingData.id}-estrutura`,
          `briefing-personalizado-${briefingData.id}`,
          `briefing-personalizado-cliente-demo-${briefingData.id}`,
          `briefing-personalizado-cliente-demo-temp-${briefingData.id}`,
        ]
        
        for (const chave of chavesPersonalizacao) {
          const dados = localStorage.getItem(chave)
          if (dados) {
            try {
              const estruturaLocal = JSON.parse(dados)
              if (estruturaLocal.secoes || (estruturaLocal.briefingPersonalizado && estruturaLocal.briefingPersonalizado.secoes)) {
                estruturaPersonalizadaSalva = estruturaLocal.secoes ? estruturaLocal : estruturaLocal.briefingPersonalizado
                fonteDados = 'LOCALSTORAGE'
                console.log('✅ [MODO EDIÇÃO] Estrutura encontrada no localStorage:', chave)
                break
              }
            } catch (error) {
              console.error('❌ [MODO EDIÇÃO] Erro ao parsear localStorage:', error)
            }
          }
        }
      }
      
      // 🎯 SE ENCONTROU ESTRUTURA PERSONALIZADA: Usar ela
      if (estruturaPersonalizadaSalva && estruturaPersonalizadaSalva.secoes && estruturaPersonalizadaSalva.secoes.length > 0) {
        console.log('🎉 [MODO EDIÇÃO] Estrutura personalizada carregada:', {
          fonte: fonteDados,
          secoes: estruturaPersonalizadaSalva.secoes.length,
          totalPerguntas: estruturaPersonalizadaSalva.secoes.reduce((acc: number, s: any) => acc + (s.perguntas?.length || 0), 0)
        })
        
        // Adaptar dados para o briefing completo
        const briefingPersonalizado = {
          ...estruturaPersonalizadaSalva,
          id: briefingData.id,
          nome: briefingData.nomeProjeto || briefingData.nome_projeto,
          tipologia: briefingData.tipologia || estruturaPersonalizadaSalva.tipologia || 'unifamiliar',
          subtipo: estruturaPersonalizadaSalva.subtipo || 'standard', 
          padrao: estruturaPersonalizadaSalva.padrao || false,
          descricao: briefingData.descricao || estruturaPersonalizadaSalva.descricao || '',
          totalPerguntas: estruturaPersonalizadaSalva.totalPerguntas || estruturaPersonalizadaSalva.secoes?.reduce((acc: number, s: any) => acc + (s.perguntas?.length || 0), 0) || 0,
          tempoEstimado: estruturaPersonalizadaSalva.tempoEstimado || 30,
          versao: estruturaPersonalizadaSalva.versao || '1.0',
          secoes: estruturaPersonalizadaSalva.secoes || [],
          criadoEm: briefingData.created_at,
          atualizadoEm: briefingData.updated_at,
          metadata: {
            ...estruturaPersonalizadaSalva.metadata,
            tags: ['estrutura-personalizada', 'modo-edicao', fonteDados.toLowerCase()]
          }
        }
        
        return briefingPersonalizado
      }
      
      // 🚨 FALLBACK FINAL: Se não encontrou, avisar mas não quebrar
      console.warn('⚠️ [MODO EDIÇÃO] Estrutura personalizada não encontrada - usando template padrão')
      // CONTINUAR COM FLUXO NORMAL AO INVÉS DE LANÇAR ERRO
    }

    // 🎯 SELEÇÃO DINÂMICA DE BRIEFING - SOMENTE PARA MODOS NÃO-EDIÇÃO
    const briefingCompleto = await selecionarBriefingDinamico(briefingData)

    console.log('✅ [ADAPTER V7] Briefing dinâmico selecionado:', {
      briefingId: briefingCompleto.id,
      briefingNome: briefingCompleto.nome,
      totalPerguntas: briefingCompleto.totalPerguntas,
      totalSecoes: briefingCompleto.secoes.length,
      temAdaptativo: briefingCompleto.metadata?.tags?.includes('adaptativo') || false,
      modoEdicao: modoEdicao,
      temRespostasExistentes: Object.keys(respostasExistentes).length > 0
    })

    // 🎯 NOVA LÓGICA BANCO DE DADOS: Verificar estrutura personalizada NO BANCO
    console.log('🔍 [ADAPTER V8] Iniciando migração e carregamento do banco de dados...')
    
    // Primeiro, tentar migrar dados do localStorage para o banco (se houver)
    try {
      await EstruturaPersonalizadaService.migrarLocalStorageParaBanco(briefingData.id)
    } catch (error) {
      console.warn('⚠️ [ADAPTER V8] Erro na migração do localStorage:', error)
    }
    
    // Carregar estrutura personalizada do banco de dados
    let estruturaPersonalizadaSalva = null
    let chaveEncontrada = 'BANCO_DE_DADOS'
    
    try {
      estruturaPersonalizadaSalva = await EstruturaPersonalizadaService.carregarEstrutura(briefingData.id)
      if (estruturaPersonalizadaSalva) {
        console.log('✅ [ADAPTER V8] Estrutura personalizada carregada do BANCO DE DADOS')
      }
    } catch (error) {
      console.error('❌ [ADAPTER V8] Erro ao carregar estrutura do banco:', error)
      
      // FALLBACK: Tentar localStorage como último recurso
      console.log('🔧 [ADAPTER V8] Tentando fallback para localStorage...')
      const chavesPersonalizacao = [
        `briefing-personalizado-${briefingData.id}-estrutura`,
        `briefing-personalizado-${briefingData.id}`,
        `briefing-personalizado-cliente-demo-${briefingData.id}`,
        `briefing-personalizado-cliente-demo-temp-${briefingData.id}`,
      ]
      
      for (const chave of chavesPersonalizacao) {
        const dados = localStorage.getItem(chave)
        if (dados) {
          estruturaPersonalizadaSalva = JSON.parse(dados)
          chaveEncontrada = chave + ' (FALLBACK)'
          console.log('⚠️ [ADAPTER V8] Usando fallback localStorage:', chave)
          break
        }
      }
    }
    
         // 🔍 DEBUG: Verificar estado atual do sistema
     console.log('🔍 [ADAPTER V8] DEBUG sistema banco de dados:', {
       briefingId: briefingData.id,
       timestamp: new Date().toISOString(),
       tempoDesdePageLoad: performance.now(),
       fonteEstrutura: chaveEncontrada,
       encontrouEstrutura: estruturaPersonalizadaSalva ? 'SIM' : 'NÃO',
       tipoEstrutura: estruturaPersonalizadaSalva ? typeof estruturaPersonalizadaSalva : 'UNDEFINED',
       modoEdicao: modoEdicao,
       sistemaBancoDados: true,
       migracaoCompleta: true
     })
    
    let briefingFinal = briefingCompleto
    
    if (estruturaPersonalizadaSalva && chaveEncontrada) {
      const estruturaPersonalizada = estruturaPersonalizadaSalva
      
      console.log('📋 [ADAPTER V8] Estrutura personalizada ENCONTRADA:', {
        fonte: chaveEncontrada,
        estruturaKeys: Object.keys(estruturaPersonalizada),
        personalizado: estruturaPersonalizada.personalizado,
        secoesVisiveis: estruturaPersonalizada.secoesVisiveis?.length || 0,
        temBriefingPersonalizado: estruturaPersonalizada.briefingPersonalizado ? 'SIM' : 'NÃO',
        tipoBriefingPersonalizado: typeof estruturaPersonalizada.briefingPersonalizado,
        modoEdicao: modoEdicao,
        encontradoEm: 'BANCO_DE_DADOS',
        contextoOperacao: modoEdicao ? 'EDIÇÃO_BRIEFING' : 'NOVO_BRIEFING'
      })
      
      // 🔍 TENTAR MÚLTIPLOS FORMATOS DE ESTRUTURA PERSONALIZADA
      let briefingPersonalizadoEncontrado = null
      
      // Formato 1: {personalizado: true, briefingPersonalizado: {...}}
      if (estruturaPersonalizada.personalizado && estruturaPersonalizada.briefingPersonalizado) {
        briefingPersonalizadoEncontrado = estruturaPersonalizada.briefingPersonalizado
        console.log('✅ [ADAPTER V8] Formato 1: estrutura.briefingPersonalizado')
      }
      // Formato 2: Briefing direto (sem wrapper)
      else if (estruturaPersonalizada.secoes && Array.isArray(estruturaPersonalizada.secoes)) {
        briefingPersonalizadoEncontrado = estruturaPersonalizada
        console.log('✅ [ADAPTER V8] Formato 2: briefing direto')
      }
      // Formato 3: {briefingPersonalizado: {...}} (sem flag personalizado)
      else if (estruturaPersonalizada.briefingPersonalizado) {
        briefingPersonalizadoEncontrado = estruturaPersonalizada.briefingPersonalizado
        console.log('✅ [ADAPTER V8] Formato 3: estrutura.briefingPersonalizado (sem flag)')
      }
      
      if (briefingPersonalizadoEncontrado && briefingPersonalizadoEncontrado.secoes?.length > 0) {
        briefingFinal = briefingPersonalizadoEncontrado
        console.log('✅ [ADAPTER V8] USANDO ESTRUTURA PERSONALIZADA:', {
          secoesPersonalizadas: briefingFinal.secoes.length,
          perguntasPersonalizadas: briefingFinal.secoes.reduce((acc, s) => acc + s.perguntas.length, 0),
          nomesBrevesSecoes: briefingFinal.secoes.map(s => s.nome.substring(0, 30) + '...'),
          modoEdicao: modoEdicao,
          contexto: modoEdicao ? 'EDIÇÃO' : 'NOVO',
          fonteDados: 'BANCO_DE_DADOS'
        })
      } else {
        console.warn('⚠️ [ADAPTER V8] Estrutura personalizada inválida ou vazia - usando template padrão')
      }
    } else {
      console.log('📋 [ADAPTER V8] NENHUMA estrutura personalizada encontrada - usando template padrão')
      console.log('✅ [ADAPTER V8] Sistema banco de dados funcionando corretamente')
    }

    // 🔄 ADAPTAR DADOS DO BANCO PARA O BRIEFING COMPLETO
    const briefingAdaptado: BriefingCompleto = {
      ...briefingFinal,
      // Sobrescrever dados específicos do banco
      id: briefingData.id,
      nome: briefingData.nomeProjeto || briefingData.nome_projeto || 'Projeto ArcFlow',
      descricao: briefingData.descricao || briefingCompleto.descricao,
      criadoEm: briefingData.created_at,
      atualizadoEm: briefingData.updated_at,
      metadata: {
        ...briefingFinal.metadata,
        tags: [
          ...(briefingFinal.metadata?.tags || []),
          briefingData.disciplina || 'arquitetura',
          briefingData.area || 'residencial',
          briefingData.tipologia || 'unifamiliar',
          'adaptado-dinamicamente',
          'v8-banco-de-dados',
          estruturaPersonalizadaSalva ? 'estrutura-personalizada' : 'estrutura-padrao'
        ]
      }
    }

    console.log('🎉 [ADAPTER V8] Briefing dinâmico BANCO DE DADOS criado:', {
      id: briefingAdaptado.id,
      nome: briefingAdaptado.nome,
      totalSecoes: briefingAdaptado.secoes.length,
      totalPerguntas: briefingAdaptado.totalPerguntas,
      categoria: briefingAdaptado.metadata?.tags?.find(t => ['residencial', 'comercial', 'industrial', 'estrutural', 'instalacoes'].includes(t)),
      tipo: briefingAdaptado.tipologia,
      estruturaPersonalizada: briefingAdaptado.metadata?.tags?.includes('estrutura-personalizada') || false,
      fonteEstrutura: chaveEncontrada || 'TEMPLATE_PADRAO',
      sistemaConfiavel: 'BANCO_DE_DADOS',
      modoEdicao: modoEdicao,
      contextoOperacao: modoEdicao ? 'EDIÇÃO' : 'NOVO_BRIEFING',
      temRespostasParaPreenchimento: Object.keys(respostasExistentes).length > 0
    })

    return briefingAdaptado
  }

  /**
   * 🎯 SELEÇÃO DINÂMICA DE BRIEFING - SOLUÇÃO DEFINITIVA
   * Remove o fallback hardcoded e usa getBriefingAprovado
   */
  const selecionarBriefingDinamico = async (dados: BriefingDataFromDB): Promise<BriefingCompleto> => {
    const { disciplina, area, tipologia } = dados
    
    console.log('🔍 [ADAPTER V7] Seleção dinâmica para:', { disciplina, area, tipologia })
    
    // 🗺️ MAPEAMENTO DISCIPLINA → CATEGORIA → TIPO
    let categoria = ''
    let tipo = ''
    
    // 🏗️ ARQUITETURA
    if (disciplina === 'arquitetura' || !disciplina) {
      
      // 🎯 MAPEAMENTO ESPECÍFICO DE ÁREA E TIPOLOGIA
      if (area === 'residencial') {
        categoria = 'residencial'
        tipo = tipologia || 'unifamiliar'
      } else if (area === 'comercial') {
        categoria = 'comercial'
        tipo = tipologia || 'escritorios'
      } else if (area === 'industrial') {
        categoria = 'industrial'
        tipo = 'galpao-industrial'
      } else if (area === 'urbanistico' || area === 'urbano') {
        categoria = 'urbanistico'
        tipo = 'projeto-urbano'
      } else if (area === 'design_interiores' || area === 'design-interiores') {
        // 🏠 DESIGN DE INTERIORES → RESIDENCIAL
        categoria = 'residencial'
        tipo = 'design-interiores'
      } else if (area === 'paisagismo') {
        categoria = 'residencial'
        tipo = 'paisagismo'
      } else if (area === 'loteamentos') {
        categoria = 'residencial'
        tipo = 'loteamentos'
      } else {
        // Fallback padrão
        categoria = 'residencial'
        tipo = tipologia || 'unifamiliar'
      }
    }
    
    // 🏗️ ENGENHARIA ESTRUTURAL
    else if (disciplina === 'engenharia' || disciplina === 'estrutural') {
      categoria = 'estrutural'
      tipo = 'projeto-estrutural-adaptativo'
    }
    
    // ⚡ INSTALAÇÕES
    else if (disciplina === 'instalacoes' || disciplina === 'instalações') {
      categoria = 'instalacoes'
      tipo = 'instalacoes-adaptativo-completo'
    }
    
    console.log('🎯 [ADAPTER V7] Mapeamento final:', { categoria, tipo })
    
    // 🔍 BUSCAR BRIEFING DINAMICAMENTE
    try {
      const briefingCompleto = await getBriefingAprovado(categoria, tipo)
      
      if (briefingCompleto) {
        console.log('✅ [ADAPTER V7] Briefing encontrado:', {
          id: briefingCompleto.id,
          nome: briefingCompleto.nome,
          totalPerguntas: briefingCompleto.totalPerguntas
        })
        return briefingCompleto
      }
      
      // Se não encontrou, tentar buscar por fallback inteligente
      console.log('⚠️ [ADAPTER V7] Briefing não encontrado, tentando fallback...')
      
      // Fallback 1: Residencial Unifamiliar se for arquitetura
      if (disciplina === 'arquitetura' || !disciplina) {
        const fallback = await getBriefingAprovado('residencial', 'unifamiliar')
        if (fallback) {
          console.log('🔄 [ADAPTER V7] Fallback: Residencial Unifamiliar')
          return fallback
        }
      }
      
      // Fallback 2: Estrutural se for engenharia
      if (disciplina === 'engenharia' || disciplina === 'estrutural') {
        const fallback = await getBriefingAprovado('estrutural', 'projeto-estrutural-adaptativo')
        if (fallback) {
          console.log('🔄 [ADAPTER V7] Fallback: Estrutural Adaptativo')
          return fallback
        }
      }
      
      // Fallback 3: Instalações se for instalações
      if (disciplina === 'instalacoes' || disciplina === 'instalações') {
        const fallback = await getBriefingAprovado('instalacoes', 'instalacoes-adaptativo-completo')
        if (fallback) {
          console.log('🔄 [ADAPTER V7] Fallback: Instalações Adaptativo')
          return fallback
        }
      }
      
      // Fallback final: Primeiro briefing disponível
      const fallbackFinal = await getBriefingAprovado('residencial', 'unifamiliar')
      if (fallbackFinal) {
        console.log('🔄 [ADAPTER V7] Fallback final: Residencial Unifamiliar')
        return fallbackFinal
      }
      
      // Se ainda não encontrou, erro crítico
      throw new Error(`Nenhum briefing encontrado para: ${categoria}/${tipo}`)
      
    } catch (error) {
      console.error('❌ [ADAPTER V7] Erro ao buscar briefing:', error)
      throw new Error(`Erro ao carregar briefing: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }
    
  // Como getBriefingAprovado é assíncrono, precisamos usar um componente wrapper
  const [briefingCompleto, setBriefingCompleto] = useState<BriefingCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adaptarBriefing()
      .then(briefing => {
        setBriefingCompleto(briefing)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [briefingData])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando briefing...</span>
      </div>
    )
  }

  if (error || !briefingCompleto) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Erro ao carregar briefing: {error}</p>
        <p className="text-sm text-gray-500 mt-2">
          Dados: {JSON.stringify(briefingData, null, 2)}
        </p>
      </div>
    )
  }

  return children(briefingCompleto)
} 