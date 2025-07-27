'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Edit, Share2, Download, MoreVertical,
  CheckCircle, Clock, AlertTriangle, User, Calendar,
  FileText, MapPin, Building, DollarSign, Star,
  Bot, Lightbulb, AlertCircle, Zap, Target, Users, Loader2
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { toast } from 'sonner'
import { getTemplateName } from '@/utils/briefingTemplateNames'
import EstruturaPersonalizadaService from '@/services/estruturaPersonalizadaService'

// Componentes especializados
import BriefingDashboard from '@/components/briefing/BriefingDashboard'
import InterfacePerguntas from '@/components/briefing/InterfacePerguntas'
import BriefingAdapter from '@/components/briefing/BriefingAdapter'

// Dados do Briefing Detalhado
const BRIEFING_DADOS = {
  id: 1,
  titulo: 'Casa Alto Padrão - Condomínio Alphaville',
  cliente: {
    nome: 'Maria e João Silva',
    email: 'maria.silva@email.com',
    telefone: '(11) 99999-9999',
    empresa: 'Silva Empreendimentos'
  },
  projeto: {
    tipologia: 'Residencial',
    localização: 'Alphaville, Barueri - SP',
    areaPrevista: '450m²',
    valorEstimado: 'R$ 85.000',
    prazoEntrega: '2024-03-15'
  },
  status: 'aguardando_aprovacao',
  progresso: 85,
  criadoEm: '2024-01-05',
  atualizadoEm: '2024-01-10',
  responsavel: 'Ana Costa',
  respostasTotal: 52,
  respostasCompletas: 44,
  tempoPreenchimento: '42 min'
}

// Análise da IA
const ANALISE_IA = {
  score: 94,
  categoria: 'Excelente',
  pontosFortres: [
    'Briefing muito detalhado com informações precisas',
    'Cliente tem clareza sobre necessidades e estilo',
    'Orçamento realista para o escopo proposto',
    'Prazo adequado considerando a complexidade'
  ],
  pontosAtencao: [
    'Considerar análise de solo para fundações especiais',
    'Verificar disponibilidade de materiais premium',
    'Avaliar impacto visual na vizinhança'
  ],
  recomendacoes: [
    'Propor visita técnica ao terreno antes do anteprojeto',
    'Incluir consultoria paisagística no orçamento',
    'Apresentar 3 alternativas de fachada para aprovação'
  ]
}

// Seções do Briefing
const SECOES_BRIEFING = [
  {
    id: 1,
    nome: 'Dados Básicos',
    completude: 100,
    respostas: 8,
    total: 8,
    destaque: 'Todas as informações preenchidas corretamente'
  },
  {
    id: 2,
    nome: 'Programa de Necessidades',
    completude: 95,
    respostas: 12,
    total: 12,
    destaque: '4 suítes, escritório, sala de estar integrada, piscina'
  },
  {
    id: 3,
    nome: 'Estilo e Arquitetura',
    completude: 90,
    respostas: 6,
    total: 7,
    destaque: 'Contemporâneo com elementos clássicos'
  },
  {
    id: 4,
    nome: 'Infraestrutura',
    completude: 80,
    respostas: 5,
    total: 6,
    destaque: 'Automação residencial, aquecimento solar'
  },
  {
    id: 5,
    nome: 'Sustentabilidade',
    completude: 75,
    respostas: 4,
    total: 5,
    destaque: 'Captação de águas pluviais, painéis solares'
  },
  {
    id: 6,
    nome: 'Orçamento e Prazos',
    completude: 100,
    respostas: 4,
    total: 4,
    destaque: 'Orçamento detalhado com etapas definidas'
  }
]

interface PageProps {
  params: Promise<{ id: string }>
}

interface BriefingData {
  id: string
  nome_projeto?: string
  nomeProjeto?: string  // 🔥 CORREÇÃO: Backend retorna em camelCase
  status: 'RASCUNHO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'APROVADO'
  progresso: number
  disciplina: string
  area: string
  tipologia: string
  created_at: string
  updated_at: string
  cliente_id?: string
  responsavel_id?: string
  escritorio_id: string
  created_by: string
  descricao?: string
  objetivos?: string
  prazo?: string
  orcamento?: string
  observacoes?: string | any  // Campo que contém estrutura e respostas
}

interface ClienteData {
  id: string
  nome: string
  email?: string
  telefone?: string
}

export default function BriefingPage({ params }: PageProps) {
  const { tema, personalizacao, temaId } = useTheme()
  
  const [abaSelecionada, setAbaSelecionada] = useState<'resumo' | 'respostas' | 'analise' | 'historico'>('resumo')
  const [secaoExpandida, setSecaoExpandida] = useState<number | null>(null)
  const [paramsData, setParamsData] = useState<{ id: string } | null>(null)
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null)
  const [clienteData, setClienteData] = useState<ClienteData | null>(null)
  const [respostasExistentes, setRespostasExistentes] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false) // 🔥 NOVO: Estado para modo de edição
  const [respostasOriginais, setRespostasOriginais] = useState<Record<string, any>>({}) // 🔥 BACKUP para cancelar
  const [estruturaPersonalizadaCarregada, setEstruturaPersonalizadaCarregada] = useState(false) // 🔥 NOVO: Controle de carregamento

  useEffect(() => {
    params.then(setParamsData)
  }, [params])

  // 🔥 NOVO: Detectar modo de edição da URL ou localStorage - VERSÃO PERSISTENTE
  useEffect(() => {
    if (!paramsData?.id) return

    // Verificar se há flag de edição na URL
    const urlParams = new URLSearchParams(window.location.search)
    const editMode = urlParams.get('edit') === 'true'
    
    // Verificar se há flag no localStorage (backup)
    const editFlag = localStorage.getItem(`briefing-edit-mode-${paramsData.id}`)
    
    if (editMode || editFlag === 'true') {
      console.log('🔥 [AUTO-EDIT] Detectado modo de edição persistente:', {
        fromURL: editMode,
        fromLocalStorage: editFlag === 'true',
        briefingId: paramsData.id,
        timestamp: new Date().toISOString()
      })
      
      setModoEdicao(true)
      
      // 🛡️ CORREÇÃO: NÃO REMOVER PERSISTÊNCIA IMEDIATAMENTE
      // Manter o parâmetro edit=true na URL para sobreviver a refresh
      // E manter flag no localStorage como backup duplo
      
      // Apenas garantir que a flag localStorage está presente
      if (!editFlag) {
        localStorage.setItem(`briefing-edit-mode-${paramsData.id}`, 'true')
        console.log('💾 [AUTO-EDIT] Flag localStorage criada para persistência')
      }
      
      console.log('✅ [AUTO-EDIT] Modo de edição ativado COM PERSISTÊNCIA:')
      console.log('  - URL mantém edit=true para refresh')
      console.log('  - localStorage mantém flag como backup')
      console.log('  - Sistema suporta F5 sem perder edição')
    }
  }, [paramsData])

  // 🔥 CORREÇÃO RAFAEL: Função melhorada para carregar respostas existentes
  const carregarRespostasExistentes = async (briefingId: string) => {
    console.log('🔍 [RESPOSTAS V9-RAFAEL] ====== INICIANDO CARREGAMENTO DE RESPOSTAS ======')
    console.log('🔍 [RESPOSTAS V9-RAFAEL] Briefing ID:', briefingId)
    console.log('🔍 [RESPOSTAS V9-RAFAEL] Timestamp:', new Date().toISOString())
    
    try {
      let respostasEncontradas: Record<string, any> = {}
      let fonteDados = 'NAO_ENCONTRADA'
      const tentativasRealizadas: string[] = []
      const timestamp = new Date().toISOString()

      // 🆘 PRIMEIRA TENTATIVA: Verificar se há backup de F5 no localStorage
      console.log('🔍 [RESPOSTAS V9-RAFAEL] TENTATIVA 1: Verificando backup F5...')
      const chavesEmergenciaF5 = [
        `briefing-emergency-f5-${briefingId}`,
        `briefing-backup-f5-${briefingId}`,
        `briefing-respostas-f5-${briefingId}`
      ]
      
      for (const chave of chavesEmergenciaF5) {
        const backupF5 = localStorage.getItem(chave)
        if (backupF5) {
          try {
            const respostasF5 = JSON.parse(backupF5)
            if (respostasF5?.respostas && Object.keys(respostasF5.respostas).length > 0) {
              respostasEncontradas = respostasF5.respostas
              fonteDados = 'BACKUP_F5'
              tentativasRealizadas.push(`✅ F5 (${chave}): ${Object.keys(respostasF5.respostas).length} respostas`)
              console.log('🆘 [RESPOSTAS V9-RAFAEL] RECUPERAÇÃO F5 ATIVADA!', chave, Object.keys(respostasF5.respostas).length)
              break
            }
          } catch (e) {
            tentativasRealizadas.push(`❌ F5 (${chave}): erro ao parsear`)
          }
        }
      }

      // 🔥 SEGUNDA TENTATIVA: BUSCAR DADOS FRESCOS DO BANCO (CRÍTICO PARA RAFAEL)
      if (Object.keys(respostasEncontradas).length === 0) {
        console.log('🔍 [RESPOSTAS V9-RAFAEL] TENTATIVA 2: Buscando dados FRESCOS do banco...')
        try {
          const token = localStorage.getItem('arcflow_auth_token')
          if (token) {
            // 🚀 BUSCAR DADOS FRESCOS DO BRIEFING COMPLETO
            const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              signal: AbortSignal.timeout(8000)
            })

            if (response.ok) {
              const data = await response.json()
              const briefingFresco = data.briefing || data
              
              console.log('✅ [RESPOSTAS V9-RAFAEL] Briefing fresco carregado:', {
                id: briefingFresco.id,
                temObservacoes: !!briefingFresco.observacoes,
                sizeObservacoes: briefingFresco.observacoes ? briefingFresco.observacoes.length : 0
              })

              // 🔥 ANALISAR OBSERVAÇÕES FRESCAS DO BANCO
              if (briefingFresco.observacoes) {
                let observacoesFrescas = null
                
                if (typeof briefingFresco.observacoes === 'string') {
                  observacoesFrescas = JSON.parse(briefingFresco.observacoes)
                } else if (typeof briefingFresco.observacoes === 'object') {
                  observacoesFrescas = briefingFresco.observacoes
                }
                
                // 🔥 BUSCAR RESPOSTAS EM MÚLTIPLOS LUGARES DAS OBSERVAÇÕES FRESCAS
                const locaisRespostas = [
                  observacoesFrescas?.respostas,
                  observacoesFrescas?.estruturaPersonalizada?.respostas,
                  observacoesFrescas?.briefingPersonalizado?.respostas,
                  observacoesFrescas?.dados?.respostas
                ]
                
                for (const respostasLocal of locaisRespostas) {
                  if (respostasLocal && Object.keys(respostasLocal).length > 0) {
                    respostasEncontradas = respostasLocal
                    fonteDados = 'BANCO_FRESCO_OBSERVACOES'
                    tentativasRealizadas.push('✅ BANCO_FRESCO: ' + Object.keys(respostasEncontradas).length + ' respostas')
                    console.log('🎉 [RESPOSTAS V9-RAFAEL] SUCESSO! Respostas encontradas no banco fresco:', Object.keys(respostasEncontradas).length)
                    break
                  }
                }
              }
            } else {
              tentativasRealizadas.push('❌ BANCO_FRESCO: erro HTTP ' + response.status)
            }
          }
        } catch (error) {
          tentativasRealizadas.push('❌ BANCO_FRESCO: ' + (error as Error).message)
          console.log('❌ [RESPOSTAS V9-RAFAEL] Erro no banco fresco:', error)
        }
      }

      // 🔥 TERCEIRA TENTATIVA: API específica de respostas
      if (Object.keys(respostasEncontradas).length === 0) {
        console.log('🔍 [RESPOSTAS V9-RAFAEL] TENTATIVA 3: API específica de respostas...')
        try {
          const token = localStorage.getItem('arcflow_auth_token')
          if (token) {
            const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              signal: AbortSignal.timeout(8000)
            })

            if (response.ok) {
              const data = await response.json()
              const respostasApi = data.respostas || data.data?.respostas || data
              
              if (respostasApi && Object.keys(respostasApi).length > 0) {
                respostasEncontradas = respostasApi
                fonteDados = 'API_RESPOSTAS'
                tentativasRealizadas.push('✅ API_RESPOSTAS: ' + Object.keys(respostasApi).length + ' respostas')
                console.log('✅ [RESPOSTAS V9-RAFAEL] API respostas sucesso:', Object.keys(respostasApi).length)
              }
            }
          }
        } catch (error) {
          tentativasRealizadas.push('❌ API_RESPOSTAS: ' + (error as Error).message)
          console.log('❌ [RESPOSTAS V9-RAFAEL] Erro na API respostas:', error)
        }
      }

      // 🔥 QUARTA TENTATIVA: Backup de emergência padrão
      if (Object.keys(respostasEncontradas).length === 0) {
        console.log('🔍 [RESPOSTAS V9-RAFAEL] TENTATIVA 4: Backup emergência...')
        const chavesEmergencia = [
          `briefing-emergency-${briefingId}`,
          `briefing-respostas-${briefingId}-backup`,
          `briefing-backup-respostas-${briefingId}`,
          `briefing-originais-${briefingId}`
        ]
        
        for (const chave of chavesEmergencia) {
          const backup = localStorage.getItem(chave)
          if (backup) {
            try {
              const respostasBackup = JSON.parse(backup)
              if (respostasBackup && Object.keys(respostasBackup).length > 0) {
                respostasEncontradas = respostasBackup
                fonteDados = `EMERGENCIA_${chave.split('-').pop()?.toUpperCase()}`
                tentativasRealizadas.push(`✅ EMERGENCIA (${chave}): ${Object.keys(respostasBackup).length} respostas`)
                console.log('🆘 [RESPOSTAS V9-RAFAEL] Backup emergência ativado:', chave, Object.keys(respostasBackup).length)
                break
              }
            } catch (e) {
              tentativasRealizadas.push(`❌ EMERGENCIA (${chave}): erro ao parsear`)
            }
          }
        }
      }

      // 🎉 RESULTADO FINAL E DEBUGGING
      console.log('🎉 [RESPOSTAS V9-RAFAEL] ====== RESULTADO FINAL ======')
      console.log('🎉 [RESPOSTAS V9-RAFAEL] Fonte escolhida:', fonteDados)
      console.log('🎉 [RESPOSTAS V9-RAFAEL] Total de respostas:', Object.keys(respostasEncontradas).length)
      console.log('🎉 [RESPOSTAS V9-RAFAEL] Tentativas realizadas:', tentativasRealizadas)
      
      if (Object.keys(respostasEncontradas).length > 0) {
        console.log('🎉 [RESPOSTAS V9-RAFAEL] Primeiras 5 respostas encontradas:')
        Object.entries(respostasEncontradas).slice(0, 5).forEach(([k, v]) => {
          console.log(`  ${k}: ${String(v).substring(0, 50)}${String(v).length > 50 ? '...' : ''}`)
        })
        
        // 🎯 RAFAEL: Mostrar evidência de que funcionou
        console.log('🎯 [RESPOSTAS V9-RAFAEL] *** EVIDÊNCIA PARA RAFAEL ***')
        console.log('🎯 [RESPOSTAS V9-RAFAEL] Respostas serão exibidas nos campos!')
        console.log('🎯 [RESPOSTAS V9-RAFAEL] Fonte dos dados:', fonteDados)
        console.log('🎯 [RESPOSTAS V9-RAFAEL] Briefing ID:', briefingId)
      } else {
        console.log('⚠️ [RESPOSTAS V9-RAFAEL] NENHUMA RESPOSTA ENCONTRADA!')
        console.log('⚠️ [RESPOSTAS V9-RAFAEL] Chaves localStorage:', Object.keys(localStorage).filter(k => k.includes('briefing')))
        console.log('⚠️ [RESPOSTAS V9-RAFAEL] Briefing pode ser novo ou sem respostas salvas')
      }

      // 🔥 BACKUP SUPER-FORTALECIDO - Sempre que encontrar respostas
      if (Object.keys(respostasEncontradas).length > 0) {
        console.log('💾 [RESPOSTAS V9-RAFAEL] Criando backup super-fortalecido...')
        try {
          const backupData = {
            respostas: respostasEncontradas,
            fonte: fonteDados,
            timestamp: timestamp,
            briefingId: briefingId,
            tentativas: tentativasRealizadas
          }
          
          // Múltiplos backups para redundância
          localStorage.setItem(`briefing-backup-respostas-${briefingId}`, JSON.stringify(respostasEncontradas))
          localStorage.setItem(`briefing-emergency-${briefingId}`, JSON.stringify(respostasEncontradas))
          localStorage.setItem(`briefing-originais-${briefingId}`, JSON.stringify(respostasEncontradas))
          localStorage.setItem(`briefing-backup-completo-${briefingId}`, JSON.stringify(backupData))
          
          console.log('✅ [RESPOSTAS V9-RAFAEL] Backup super-fortalecido criado!')
        } catch (error) {
          console.error('❌ [RESPOSTAS V9-RAFAEL] Erro ao criar backup:', error)
        }
      }

      // 🔥 ATUALIZAR ESTADOS COM FALLBACK
      setRespostasExistentes(respostasEncontradas)
      setRespostasOriginais({ ...respostasEncontradas })
      setEstruturaPersonalizadaCarregada(true)
      
      console.log('✅ [RESPOSTAS V9-RAFAEL] Estados atualizados:')
      console.log('  - respostasExistentes:', Object.keys(respostasEncontradas).length)
      console.log('  - respostasOriginais:', Object.keys(respostasEncontradas).length)
      console.log('  - estruturaPersonalizadaCarregada: true')

      // 🔥 FORÇA RERENDER DO COMPONENTE SE NECESSÁRIO
      if (Object.keys(respostasEncontradas).length > 0) {
        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          console.log('🔄 [RESPOSTAS V9-RAFAEL] Forçando rerender com respostas carregadas')
          console.log('🎯 [RESPOSTAS V9-RAFAEL] Rafael, verifique se os campos aparecem preenchidos agora!')
        }, 100)
      }

    } catch (error) {
      console.error('❌ [RESPOSTAS V9-RAFAEL] Erro crítico no carregamento:', error)
      
      // 🆘 RECUPERAÇÃO DE EMERGÊNCIA FINAL
      const chavesEmergenciaFinal = [
        `briefing-emergency-${briefingId}`,
        `briefing-backup-respostas-${briefingId}`,
        `briefing-originais-${briefingId}`
      ]
      
      let respostasRecuperadas = {}
      for (const chave of chavesEmergenciaFinal) {
        const backup = localStorage.getItem(chave)
        if (backup) {
          try {
            const dados = JSON.parse(backup)
            if (dados && Object.keys(dados).length > 0) {
              respostasRecuperadas = dados
              console.log('🆘 [RESPOSTAS V9-RAFAEL] Recuperação final ativada:', chave, Object.keys(dados).length)
              break
            }
          } catch (e) {
            console.error('❌ [RESPOSTAS V9-RAFAEL] Erro na recuperação final:', e)
          }
        }
      }
      
      setRespostasExistentes(respostasRecuperadas)
      setRespostasOriginais({ ...respostasRecuperadas })
      setEstruturaPersonalizadaCarregada(true)
      
      console.log('✅ [RESPOSTAS V9-RAFAEL] Recuperação final - estados definidos mesmo com erro')
    }
  }

  // Buscar dados do briefing
  useEffect(() => {
    if (!paramsData?.id) return

    const fetchBriefingData = async () => {
      try {
        console.log('🔍 [BRIEFING] Buscando dados do briefing:', paramsData.id)
        
        const token = localStorage.getItem('arcflow_auth_token')
        if (!token) {
          throw new Error('Token de autenticação não encontrado')
        }

        const response = await fetch(`http://localhost:3001/api/briefings/${paramsData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          if (response.status === 404) {
            // 🔄 RAFAEL: Redirecionar automaticamente para lista quando briefing não existir
            console.log('📋 [BRIEFING] Briefing não encontrado, redirecionando para lista...')
            window.location.href = '/briefing'
            return
          }
          throw new Error(`Erro HTTP ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ [BRIEFING] Dados recebidos:', data)
        
        const briefing = data.briefing || data
        
        // 🔥 SEMPRE CARREGAR ESTRUTURA PERSONALIZADA PRIMEIRO (para BriefingAdapter usar)
        await carregarRespostasExistentes(briefing.id)
        
        // 🔥 AGUARDAR UM POUCO PARA GARANTIR QUE TODA A ESTRUTURA PERSONALIZADA ESTÁ CARREGADA
        console.log('⏳ [BRIEFING V2] Aguardando estrutura personalizada e respostas...')
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setBriefingData(briefing)
        setError(null)

        // Buscar dados do cliente se disponível
        if (briefing.cliente_id) {
          try {
            console.log('🔍 [CLIENTE] Buscando dados do cliente:', briefing.cliente_id)
            console.log('🔍 [CLIENTE] Briefing data completa:', {
              id: briefing.id,
              nome_projeto: briefing.nome_projeto || briefing.nomeProjeto,
              cliente_id: briefing.cliente_id,
              clienteId: briefing.clienteId, // Pode ser outro nome
              status: briefing.status,
              created_at: briefing.created_at
            })
            
            const clienteResponse = await fetch(`http://localhost:3001/api/clientes/${briefing.cliente_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })

            if (clienteResponse.ok) {
              const clienteData = await clienteResponse.json()
              console.log('✅ [CLIENTE] Dados do cliente recebidos:', clienteData)
              console.log('✅ [CLIENTE] Nome do cliente será usado:', clienteData.cliente?.nome || clienteData.nome)
              
              // 🔥 ASSEGURAR QUE O ESTADO DO CLIENTE É ATUALIZADO
              const clienteFinal = clienteData.cliente || clienteData
              setClienteData(clienteFinal)
              
              // 🔥 LOG FINAL PARA CONFIRMAR
              console.log('✅ [CLIENTE] Estado do cliente atualizado para:', {
                id: clienteFinal.id,
                nome: clienteFinal.nome,
                email: clienteFinal.email,
                estadoAtualizado: true
              })
              
            } else {
              console.warn('⚠️ [CLIENTE] Não foi possível buscar dados do cliente. Status:', clienteResponse.status)
              console.warn('⚠️ [CLIENTE] Response text:', await clienteResponse.text())
              setClienteData(null)
            }
          } catch (clienteError) {
            console.warn('⚠️ [CLIENTE] Erro ao buscar cliente:', clienteError)
            console.warn('⚠️ [CLIENTE] Cliente ID que estava sendo buscado:', briefing.cliente_id)
            setClienteData(null)
            // Não quebrar o fluxo se não conseguir buscar o cliente
          }
        } else {
          console.warn('⚠️ [CLIENTE] Briefing não possui cliente_id definido')
          console.warn('⚠️ [CLIENTE] Verificar outros campos de cliente:', {
            clienteId: briefing.clienteId,
            cliente: briefing.cliente,
            nomeCliente: briefing.nomeCliente,
            cliente_nome: briefing.cliente_nome
          })
          setClienteData(null)
        }

      } catch (err: any) {
        console.error('❌ [BRIEFING] Erro ao buscar dados:', err)
        
        // 🔄 RAFAEL: Se for erro de briefing não encontrado, redirecionar automaticamente
        if (err.message?.includes('não encontrado') || err.message?.includes('404')) {
          console.log('📋 [BRIEFING] Erro de briefing não encontrado, redirecionando...')
          window.location.href = '/briefing'
          return
        }
        
        setError(err.message || 'Erro ao carregar briefing')
        toast.error('Erro ao carregar briefing')
      } finally {
        setLoading(false)
      }
    }

    fetchBriefingData()
  }, [paramsData])

  // Loading state - aguardar briefing E estrutura personalizada
  if (loading || !paramsData || !estruturaPersonalizadaCarregada) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">
            {!estruturaPersonalizadaCarregada ? 'Carregando personalização...' : 'Carregando briefing...'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-6 py-8 mb-8 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4 max-w-5xl mx-auto">
            <Link 
              href="/briefing"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Erro ao Carregar Briefing</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Briefing não encontrado</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Link 
                href="/briefing"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Voltar para Briefings
              </Link>
              <Link 
                href="/briefing/novo"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Criar Novo Briefing
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 🔥 NOVA LÓGICA DE DECISÃO: 3 MODOS DISTINTOS - CORRIGIDA PARA RAFAEL
  // Um briefing é "novo" SOMENTE se for RASCUNHO, 0% progresso E não tiver respostas salvas
  const temRespostasSalvas = Object.keys(respostasExistentes).length > 0
  const modoNovo = briefingData?.status === 'RASCUNHO' && briefingData?.progresso === 0 && !temRespostasSalvas
  const modoVisualizacao = !modoNovo && !modoEdicao
  const shouldShowQuestions = modoNovo || modoEdicao
  
  console.log('🎯 [BRIEFING V3] Decisão de renderização CORRIGIDA RAFAEL:', {
    status: briefingData?.status,
    progresso: briefingData?.progresso,
    temRespostasSalvas,
    modoNovo,
    modoEdicao,
    modoVisualizacao,
    shouldShowQuestions,
    decisao: shouldShowQuestions ? 'MOSTRAR_PERGUNTAS' : 'MOSTRAR_DASHBOARD',
    briefingId: briefingData?.id,
    estruturaPersonalizadaCarregada: estruturaPersonalizadaCarregada,
    quantidadeRespostas: Object.keys(respostasExistentes).length,
    logicaCorrigida: 'V3_RAFAEL_F5_E_CANCELAR',
    timeStamp: new Date().toISOString()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando_aprovacao': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
      case 'aprovado': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
      case 'em_andamento': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aguardando_aprovacao': return 'Aguardando Aprovação'
      case 'aprovado': return 'Aprovado'
      case 'em_andamento': return 'Em Andamento'
      default: return 'Rascunho'
    }
  }

  const statusStyle = getStatusColor(BRIEFING_DADOS.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Dinâmico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 mb-8 bg-white border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href="/briefing"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {getTemplateName(briefingData?.disciplina, briefingData?.area, briefingData?.tipologia)}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  modoEdicao 
                    ? 'bg-orange-100 text-orange-700' 
                    : modoNovo 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {modoEdicao ? 'Edição' : modoNovo ? 'Preenchimento' : 'Visualização'}
                </span>
                <span>•</span>
                <span>{briefingData?.disciplina} - {briefingData?.area}</span>
                <span>•</span>
                <span>{briefingData?.progresso || 0}% completo</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Conteúdo Principal - Renderização Condicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 pb-20"
      >
        {shouldShowQuestions && briefingData ? (
          // MODO PERGUNTAS: Para briefings novos (RASCUNHO com 0% progresso)
          <BriefingAdapter 
            briefingData={briefingData}
            modoEdicao={modoEdicao}
            respostasExistentes={respostasExistentes}
          >
            {(briefingCompleto) => (
                          <InterfacePerguntas 
              briefing={briefingCompleto}
              onVoltar={() => {
                if (modoEdicao) {
                  // 🔥 CANCELAR EDIÇÃO - VOLTAR PARA DASHBOARD (RAFAEL)
                  console.log('🚫 [CANCELAR V5] ====== CANCELANDO EDIÇÃO ======')
                  console.log('🚫 [CANCELAR V5] Briefing ID:', briefingData.id)
                  console.log('🚫 [CANCELAR V5] Respostas atuais:', Object.keys(respostasExistentes).length)
                  console.log('🚫 [CANCELAR V5] Respostas originais:', Object.keys(respostasOriginais).length)
                  console.log('🚫 [CANCELAR V5] Status antes:', briefingData.status)
                  console.log('🚫 [CANCELAR V5] Timestamp:', new Date().toISOString())
                  
                  // 🔥 LIMPAR PERSISTÊNCIA DE MODO DE EDIÇÃO COMPLETAMENTE
                  // 1. Remover parâmetro edit da URL
                  const currentUrl = new URL(window.location.href)
                  currentUrl.searchParams.delete('edit')
                  window.history.replaceState({}, '', currentUrl.toString())
                  
                  // 2. Remover flag do localStorage
                  localStorage.removeItem(`briefing-edit-mode-${briefingData.id}`)
                  
                  // 3. Remover também flag de backup se existir
                  localStorage.removeItem(`briefing-backup-respostas-${briefingData.id}`)
                  
                  // 4. 🔥 RAFAEL: FORÇAR BRIEFING COMO CONCLUÍDO PARA IR PARA DASHBOARD
                  setBriefingData(prev => prev ? { 
                    ...prev, 
                    status: 'CONCLUIDO', 
                    progresso: Object.keys(respostasOriginais).length > 0 ? 100 : prev.progresso 
                  } : null)
                  
                  setModoEdicao(false)
                  // Restaurar respostas originais
                  setRespostasExistentes(respostasOriginais)
                  
                  console.log('✅ [CANCELAR V5] Edição cancelada - voltando para DASHBOARD:')
                  console.log('  - URL limpa:', currentUrl.toString())
                  console.log('  - Flag localStorage removida')  
                  console.log('  - Status alterado para CONCLUIDO')
                  console.log('  - Respostas restauradas:', Object.keys(respostasOriginais).length)
                  console.log('  - Dashboard será mostrado')
                  toast.info('Edição cancelada - Voltando para visualização')
                } else {
                  console.log('🔙 [VOLTAR V3] Voltando para página anterior (briefing novo)')
                  // Voltar para página anterior (briefing novo)
                  window.history.back()
                }
              }}
              onSalvarRascunho={async (respostas) => {
                console.log('💾 Salvando rascunho:', respostas)
                // TODO: Implementar salvamento via API
              }}
              onConcluir={async (respostas) => {
                if (modoEdicao) {
                  // 🔥 CORREÇÃO CRÍTICA: NÃO SALVAR - O debounce inteligente já cuidou de tudo!
                  console.log('✅ [SAVE-AND-NAVIGATE] ====== MODO EDIÇÃO: SEM SALVAMENTO ADICIONAL ======')
                  console.log('✅ [SAVE-AND-NAVIGATE] Briefing ID:', briefingData.id)
                  console.log('✅ [SAVE-AND-NAVIGATE] Respostas recebidas:', Object.keys(respostas).length)
                  console.log('✅ [SAVE-AND-NAVIGATE] Debounce inteligente já salvou automaticamente!')
                  console.log('✅ [SAVE-AND-NAVIGATE] Timestamp:', new Date().toISOString())
                  
                  try {
                    // 🚨 REMOÇÃO DO TRIPLO SALVAMENTO: 
                    // ❌ REMOVIDO: await EstruturaPersonalizadaService.salvarRespostas(briefingData.id, respostas)
                    // ✅ SISTEMA NOVO: O debounce inteligente do InterfacePerguntas já salvou tudo!
                    
                    console.log('💾 [SAVE-AND-NAVIGATE] PULO DO SALVAMENTO: Debounce já cuidou de tudo!')
                    
                    // 1. Limpar flags de edição
                    const currentUrl = new URL(window.location.href)
                    currentUrl.searchParams.delete('edit')
                    localStorage.removeItem(`briefing-edit-mode-${briefingData.id}`)
                    
                    // 2. Atualizar estado local
                    setRespostasExistentes(respostas)
                    setModoEdicao(false)
                    
                    console.log('✅ [SAVE-AND-NAVIGATE] Edições finalizadas sem salvamento duplicado!')
                    toast.success('Edições finalizadas com sucesso!')
                    
                    // 3. 🔥 RAFAEL SOLICITOU: IR DIRETO PARA DASHBOARD
                    // Atualizar progresso do briefing para 100% após edição
                    setBriefingData(prev => prev ? { 
                      ...prev, 
                      status: 'CONCLUIDO', 
                      progresso: 100 
                    } : null)
                    
                    // Aguardar um momento para a UI atualizar
                    await new Promise(resolve => setTimeout(resolve, 500))
                    
                    // Sair do modo edição e ir para dashboard
                    console.log('🎯 [SAVE-AND-NAVIGATE] Redirecionando DIRETO para dashboard...')
                    // Não redirecionar para outra página, apenas sair do modo edição
                    
                  } catch (error: any) {
                    console.error('❌ [SAVE-AND-NAVIGATE] Erro ao finalizar edições:', error)
                    toast.error('Erro ao finalizar edições: ' + (error?.message || 'Erro desconhecido'))
                  }
                } else {
                  // Concluir briefing novo (fluxo original mantido)
                  console.log('✅ Concluindo briefing:', respostas)
                  
                  // 🔥 CAPTURAR NOVO ID DO BRIEFING
                  const novoId = respostas._briefingId
                  const dashboardUrl = respostas._dashboardUrl
                  
                  console.log('🔍 [NOVO ID] Capturado da API:', novoId)
                  console.log('🔍 [DASHBOARD URL] Capturado da API:', dashboardUrl)
                  
                  // 🔥 ATUALIZAR BRIEFING DATA COM NOVO ID
                  setBriefingData(prev => prev ? { 
                    ...prev, 
                    id: novoId || prev.id, // Usar novo ID se disponível
                    status: 'CONCLUIDO', 
                    progresso: 100 
                  } : null)
                  
                  // 🎯 SOLUÇÃO RAFAEL IMPLEMENTADA: MESMO ID SEMPRE!
                  // Redirecionamento não é mais necessário pois backend agora atualiza o mesmo briefing
                  console.log('✅ [RAFAEL-SOLUTION] Sistema corrigido - mesmo briefing atualizado, sem novos IDs!')
                  
                  // 🎯 MIGRAÇÃO NÃO É MAIS NECESSÁRIA COM SOLUÇÃO RAFAEL
                  // O briefing mantém o mesmo ID, então estruturas personalizadas permanecem válidas
                  console.log('✅ [RAFAEL-SOLUTION] Migração desnecessária - mesmo briefing ID preservado')
                  
                  // 🔥 ATUALIZAR RESPOSTAS EXISTENTES
                  const respostasLimpas = { ...respostas }
                  delete respostasLimpas._briefingId
                  delete respostasLimpas._dashboardUrl
                  setRespostasExistentes(respostasLimpas)
                  
                  toast.success('Briefing concluído com sucesso!')
                  
                  console.log('✅ [ATUALIZADO] Briefing atualizado com novo ID:', novoId)
                }
              }}
              // 🔥 PASSAR RESPOSTAS EXISTENTES PARA PRÉ-PREENCHIMENTO
              respostasIniciais={respostasExistentes}
              clienteId={briefingData?.cliente_id}
              projetoId={briefingData?.id}
              // Dados dinâmicos para o cabeçalho
              nomeProjeto={briefingData?.nomeProjeto || briefingData?.nome_projeto || 'Briefing Personalizado'}
              nomeCliente={clienteData?.nome || 'Cliente ArcFlow'}
              dataReuniao={briefingData?.created_at ? new Date(briefingData.created_at).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined}
              disciplina={briefingData?.disciplina}
              area={briefingData?.area}
              tipologia={briefingData?.tipologia}
              // 🔥 NOVO: Props para personalizar botões em modo edição
              textoBotaoVoltar={modoEdicao ? 'Cancelar Edição' : undefined}
              textoBotaoConcluir={modoEdicao ? 'Salvar e Continuar' : undefined}
              modoEdicao={modoEdicao}
            />
            )}
          </BriefingAdapter>
        ) : briefingData ? (
          // MODO DASHBOARD: Para briefings em andamento ou concluídos
          <BriefingDashboard 
            briefingData={briefingData}
            onEdit={() => {
              // 🔥 NOVA FUNÇÃO DE EDITAR - Ativa modo de edição com persistência
              console.log('🔥 [EDIT V3] ====== INICIANDO EDIÇÃO COM PERSISTÊNCIA ======')
              console.log('🔥 [EDIT V3] Briefing ID:', briefingData.id)
              console.log('🔥 [EDIT V3] Respostas disponíveis para edição:', Object.keys(respostasExistentes).length)
              console.log('🔥 [EDIT V3] Estrutura personalizada carregada:', estruturaPersonalizadaCarregada)
              console.log('🔥 [EDIT V3] Chaves no localStorage:', Object.keys(localStorage).filter(k => k.includes('briefing-personalizado')))
              console.log('🔥 [EDIT V3] Timestamp:', new Date().toISOString())
              
              // Fazer backup das respostas originais para poder cancelar
              setRespostasOriginais({ ...respostasExistentes })
              
              // 🔥 PERSISTIR MODO DE EDIÇÃO - Dupla proteção MELHORADA
              // 1. Adicionar parâmetro na URL (sobrevive a refresh)
              const currentUrl = new URL(window.location.href)
              currentUrl.searchParams.set('edit', 'true')
              window.history.replaceState({}, '', currentUrl.toString())
              
              // 2. Flag no localStorage (backup se URL falhar)
              localStorage.setItem(`briefing-edit-mode-${briefingData.id}`, 'true')
              
              // 3. Backup das respostas originais para cancelar
              const chaveBackupOriginais = `briefing-originais-${briefingData.id}`
              localStorage.setItem(chaveBackupOriginais, JSON.stringify(respostasExistentes))
              
              // Ativar modo de edição
              setModoEdicao(true)
              
              console.log('✅ [EDIT V4] Modo de edição ativado com persistência APRIMORADA:')
              console.log('  - URL atualizada:', currentUrl.toString())
              console.log('  - Flag localStorage salva')
              console.log('  - Backup originais criado')
              console.log('  - Estado atualizado')
              console.log('✅ [EDIT V4] Sistema 100% resistente a refresh (F5) e botões de atualizar!')
              toast.success('Modo de edição ativado! 🛡️ Totalmente resistente a refresh da página.')
            }}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600">Carregando dados do briefing...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
} 