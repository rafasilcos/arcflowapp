'use client'

import { BriefingCompleto, Secao, Pergunta } from '@/types/briefing'
// RESIDENCIAL (6 briefings)
import { BRIEFING_RESIDENCIAL_UNIFAMILIAR } from '@/data/briefings-aprovados/residencial/unifamiliar'
import { BRIEFING_RESIDENCIAL_MULTIFAMILIAR } from '@/data/briefings-aprovados/residencial/multifamiliar'
import { briefingPaisagismo } from '@/data/briefings-aprovados/residencial/paisagismo'
import { designInteriores } from '@/data/briefings-aprovados/residencial/design-interiores'
import { briefingLoteamentos } from '@/data/briefings-aprovados/residencial/loteamentos'
// COMERCIAL (4 briefings)
import { BRIEFING_COMERCIAL_ESCRITORIOS, BRIEFING_COMERCIAL_LOJAS, BRIEFING_COMERCIAL_RESTAURANTES, BRIEFING_COMERCIAL_HOTEL_POUSADA } from '@/data/briefings-aprovados/comercial'
// INDUSTRIAL (1 briefing)
import { briefingGalpaoIndustrial } from '@/data/briefings-aprovados/industrial'
// ESTRUTURAL (1 adaptativo)
import { briefingEstrutural } from '@/data/briefings-aprovados/estrutural/projeto-estrutural-adaptativo'
// INSTALAÇÕES (2 adaptativos)
import { briefingInstalacoes } from '@/data/briefings-aprovados/instalacoes'
// URBANÍSTICO (1 briefing)
import { briefingProjetoUrbano } from '@/data/briefings-aprovados/urbanistico/projeto-urbano'

interface BriefingDataFromDB {
  id: string
  nome_projeto: string
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
}

interface BriefingAdapterProps {
  briefingData: BriefingDataFromDB
  children: (briefingCompleto: BriefingCompleto) => React.ReactNode
}

/**
 * 🚀 ADAPTADOR DINÂMICO ENTERPRISE-GRADE V5.0 - TODOS OS 15 BRIEFINGS
 * 
 * SOLUÇÃO COMPLETA PARA BRIEFINGS ADAPTATIVOS:
 * ✅ SUPORTA TODOS OS 15 BRIEFINGS APROVADOS
 * ✅ 2 BRIEFINGS ADAPTATIVOS COM PERGUNTAS CONDICIONAIS
 * ✅ Preserva seções originais do template
 * ✅ Suporta perguntas condicionais (dependeDe)
 * ✅ Mantém ordem natural das perguntas
 * ✅ Flexível para qualquer tipo de briefing
 * ✅ Zero hardcoding de seções
 */
export default function BriefingAdapter({ briefingData, children }: BriefingAdapterProps) {
  
  const adaptarBriefing = (): BriefingCompleto => {
    console.log('🔄 [ADAPTER V5] Adaptação dinâmica COMPLETA:', {
      id: briefingData.id,
      disciplina: briefingData.disciplina,
      area: briefingData.area,
      tipologia: briefingData.tipologia
    })

    // 🎯 SELEÇÃO INTELIGENTE DE TEMPLATE - TODOS OS 15 BRIEFINGS
    const briefingCompleto = selecionarBriefingAprovado(briefingData)

    console.log('✅ [ADAPTER V5] Briefing aprovado selecionado:', {
      briefingId: briefingCompleto.id,
      briefingNome: briefingCompleto.nome,
      totalPerguntas: briefingCompleto.totalPerguntas,
      totalSecoes: briefingCompleto.secoes.length,
      temAdaptativo: briefingCompleto.metadata?.tags?.includes('adaptativo') || false
    })

    // 🔥 NOVO: Verificar se há estrutura personalizada salva
    const chavePersonalizacao = `briefing-personalizado-${briefingData.id}-estrutura`
    const estruturaPersonalizadaSalva = localStorage.getItem(chavePersonalizacao)
    
    console.log('🔍 [ADAPTER V5] Verificando estrutura personalizada:', {
      chave: chavePersonalizacao,
      encontrada: estruturaPersonalizadaSalva ? 'SIM' : 'NÃO',
      tamanho: estruturaPersonalizadaSalva ? estruturaPersonalizadaSalva.length : 0,
      preview: estruturaPersonalizadaSalva ? estruturaPersonalizadaSalva.substring(0, 100) + '...' : 'NENHUM'
    })
    
    let briefingFinal = briefingCompleto
    
    if (estruturaPersonalizadaSalva) {
      try {
        const estruturaPersonalizada = JSON.parse(estruturaPersonalizadaSalva)
        console.log('📋 [ADAPTER V5] Estrutura personalizada encontrada:', {
          personalizado: estruturaPersonalizada.personalizado,
          secoesVisiveis: estruturaPersonalizada.secoesVisiveis?.length || 0,
          temBriefingPersonalizado: estruturaPersonalizada.briefingPersonalizado ? 'SIM' : 'NÃO'
        })
        
        if (estruturaPersonalizada.personalizado && estruturaPersonalizada.briefingPersonalizado) {
          // Usar briefing personalizado salvo
          briefingFinal = estruturaPersonalizada.briefingPersonalizado
          console.log('✅ [ADAPTER V5] Usando estrutura personalizada salva com', briefingFinal.secoes.length, 'seções')
        } else {
          console.warn('⚠️ [ADAPTER V5] Estrutura personalizada inválida - usando template padrão')
        }
      } catch (error) {
        console.warn('⚠️ [ADAPTER V5] Erro ao carregar estrutura personalizada:', error)
      }
    } else {
      console.log('📋 [ADAPTER V5] Nenhuma estrutura personalizada encontrada - usando template padrão')
    }

    // 🔄 ADAPTAR DADOS DO BANCO PARA O BRIEFING COMPLETO
    const briefingAdaptado: BriefingCompleto = {
      ...briefingFinal,
      // Sobrescrever dados específicos do banco
      id: briefingData.id,
      nome: briefingData.nome_projeto,
      descricao: briefingData.descricao || briefingFinal.descricao,
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
          'v5-completo',
          estruturaPersonalizadaSalva ? 'personalizado' : 'padrao'
        ]
      }
    }

    console.log('🎉 [ADAPTER V5] Briefing dinâmico COMPLETO criado:', {
      id: briefingAdaptado.id,
      nome: briefingAdaptado.nome,
      totalSecoes: briefingAdaptado.secoes.length,
      totalPerguntas: briefingAdaptado.totalPerguntas,
      perguntasCondicionais: briefingAdaptado.secoes.reduce((acc, secao) => 
        acc + secao.perguntas.filter(p => p.dependeDe).length, 0
      ),
      secoesOriginais: briefingAdaptado.secoes.map(s => ({
        nome: s.nome,
        totalPerguntas: s.perguntas.length,
        perguntasCondicionais: s.perguntas.filter(p => p.dependeDe).length
      }))
    })

    return briefingAdaptado
  }

  /**
   * 🎯 SELEÇÃO INTELIGENTE DE BRIEFING APROVADO - TODOS OS 15 BRIEFINGS
   */
  const selecionarBriefingAprovado = (dados: BriefingDataFromDB): BriefingCompleto => {
    const { disciplina, area, tipologia } = dados
    
    console.log('🔍 [ADAPTER V5] Selecionando briefing para:', { disciplina, area, tipologia })
    
    // 🏗️ ARQUITETURA
    if (disciplina === 'arquitetura' || !disciplina) {
      
      // 🏠 RESIDENCIAL (6 briefings)
      if (area === 'residencial' || !area) {
        if (tipologia === 'unifamiliar' || tipologia === 'casa' || !tipologia) {
          console.log('✅ [ADAPTER V5] RESIDENCIAL_UNIFAMILIAR (235 perguntas)')
          return BRIEFING_RESIDENCIAL_UNIFAMILIAR
        }
        if (tipologia === 'multifamiliar' || tipologia === 'predio' || tipologia === 'apartamento') {
          console.log('✅ [ADAPTER V5] RESIDENCIAL_MULTIFAMILIAR (259 perguntas)')
          return BRIEFING_RESIDENCIAL_MULTIFAMILIAR
        }
        if (tipologia === 'paisagismo' || tipologia === 'jardim') {
          console.log('✅ [ADAPTER V5] RESIDENCIAL_PAISAGISMO (285 perguntas)')
          return briefingPaisagismo
        }
        if (tipologia === 'design-interiores' || tipologia === 'interiores') {
          console.log('✅ [ADAPTER V5] RESIDENCIAL_DESIGN_INTERIORES (344 perguntas)')
          return designInteriores
        }
        if (tipologia === 'loteamentos' || tipologia === 'loteamento') {
          console.log('✅ [ADAPTER V5] RESIDENCIAL_LOTEAMENTOS (1169 perguntas - MEGA!)')
          return briefingLoteamentos
        }
      }
      
      // 🏢 COMERCIAL (4 briefings)
      if (area === 'comercial') {
        if (tipologia === 'escritorios' || tipologia === 'escritorio') {
          console.log('✅ [ADAPTER V5] COMERCIAL_ESCRITORIOS (939 perguntas)')
          return BRIEFING_COMERCIAL_ESCRITORIOS
        }
        if (tipologia === 'lojas' || tipologia === 'loja' || tipologia === 'varejo') {
          console.log('✅ [ADAPTER V5] COMERCIAL_LOJAS (907 perguntas)')
          return BRIEFING_COMERCIAL_LOJAS
        }
        if (tipologia === 'restaurantes' || tipologia === 'restaurante' || tipologia === 'gastronomia') {
          console.log('✅ [ADAPTER V5] COMERCIAL_RESTAURANTES (1133 perguntas)')
          return BRIEFING_COMERCIAL_RESTAURANTES
        }
        if (tipologia === 'hotel' || tipologia === 'pousada' || tipologia === 'hospedagem') {
          console.log('✅ [ADAPTER V5] COMERCIAL_HOTEL_POUSADA (423 perguntas)')
          return BRIEFING_COMERCIAL_HOTEL_POUSADA
        }
      }
      
      // 🏭 INDUSTRIAL (1 briefing)
      if (area === 'industrial') {
        console.log('✅ [ADAPTER V5] INDUSTRIAL_GALPAO (311 perguntas)')
        return briefingGalpaoIndustrial
      }
      
      // 🌆 URBANÍSTICO (1 briefing)
      if (area === 'urbanistico' || area === 'urbano') {
        console.log('✅ [ADAPTER V5] PROJETO_URBANO (98 perguntas)')
        return briefingProjetoUrbano
      }
    }
    
    // 🏗️ ESTRUTURAL (1 adaptativo)
    if (disciplina === 'estrutural') {
      console.log('✅ [ADAPTER V5] ESTRUTURAL_ADAPTATIVO (292 perguntas - CONDICIONAL)')
      return briefingEstrutural
    }
    
    // ⚡ INSTALAÇÕES (2 adaptativos)
    if (disciplina === 'instalacoes' || disciplina === 'instalações') {
      console.log('✅ [ADAPTER V5] INSTALACOES_ADAPTATIVO (709 perguntas - CONDICIONAL)')
      return briefingInstalacoes
    }
    
    // Fallback: BRIEFING_RESIDENCIAL_UNIFAMILIAR como template base universal (235 perguntas)
    console.log('⚠️ [ADAPTER V5] FALLBACK: RESIDENCIAL_UNIFAMILIAR (235 perguntas)')
    return BRIEFING_RESIDENCIAL_UNIFAMILIAR
  }

  return children(adaptarBriefing())
} 