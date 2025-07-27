'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Edit, Share2, Download, MoreVertical, Calculator,
  CheckCircle, Clock, AlertTriangle, User, Calendar,
  FileText, MapPin, Building, DollarSign, Star,
  Bot, Lightbulb, AlertCircle, Zap, Target, Users,
  Loader2, Eye, History, RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import ModalExportacao from './ModalExportacao'

interface BriefingData {
  id: string
  nome_projeto?: string
  nomeProjeto?: string  // 🔥 CORREÇÃO: Backend retorna em camelCase
  status: 'RASCUNHO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'APROVADO'
  progresso: number
  disciplina: string
  area: string
  tipologia: string
  created_at?: string
  createdAt?: string    // 🔥 CORREÇÃO: Backend retorna em camelCase
  updated_at?: string
  updatedAt?: string    // 🔥 CORREÇÃO: Backend retorna em camelCase
  cliente_id?: string
  clienteId?: string    // 🔥 CORREÇÃO: Backend retorna em camelCase
  responsavel_id?: string
  responsavelId?: string // 🔥 CORREÇÃO: Backend retorna em camelCase
  escritorio_id?: string
  escritorioId?: string  // 🔥 CORREÇÃO: Backend retorna em camelCase
  created_by: string
  descricao?: string
  objetivos?: string
  prazo?: string
  orcamento?: string
  respostas?: any
  // 💰 Orçamento
  temOrcamento?: boolean
  orcamentoId?: string
}

interface ClienteData {
  id: string
  nome: string
  email?: string
  telefone?: string
  empresa?: string
}

interface BriefingDashboardProps {
  briefingData: BriefingData
  onEdit?: () => void
}

interface RespostasBriefing {
  [key: string]: any
}

interface HistoricoItem {
  id: string
  acao: string
  data: string
  tempo_inicio?: string
  tempo_fim?: string
  usuario: string
  detalhes?: string
}

export default function BriefingDashboard({ briefingData, onEdit }: BriefingDashboardProps) {
  const [abaSelecionada, setAbaSelecionada] = useState<'resumo' | 'respostas' | 'analise' | 'historico'>('resumo')
  const [secaoExpandida, setSecaoExpandida] = useState<number | null>(null)
  const [gerandoOrcamento, setGerandoOrcamento] = useState(false)
  const [orcamentoGerado, setOrcamentoGerado] = useState<any>(null)
  
  // 🔥 MODAL EXPORTAÇÃO
  const [modalExportacaoAberto, setModalExportacaoAberto] = useState(false)
  
  // 🔥 NOVOS ESTADOS PARA FUNCIONALIDADES
  const [clienteData, setClienteData] = useState<ClienteData | null>(null)
  const [responsavelData, setResponsavelData] = useState<{ nome: string; email: string } | null>(null)
  const [respostasBriefing, setRespostasBriefing] = useState<RespostasBriefing | null>(null)
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRespostas, setLoadingRespostas] = useState(false)
  const [mostrarTodasRespostas, setMostrarTodasRespostas] = useState(false)
  const [analiseIA, setAnaliseIA] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 🔥 CORREÇÃO RAFAEL: Estado para usuário logado
  const [usuarioLogado, setUsuarioLogado] = useState<{nome: string; email: string} | null>(null)

  // 🔥 FUNÇÃO PARA FORMATAR DATA BRASILEIRA
  const formatarDataBrasileira = (dataString: string, opcoes: 'data' | 'hora' | 'completa' = 'completa') => {
    try {
      // Criar data e ajustar para fuso horário brasileiro
      const data = new Date(dataString)
      
      // Verificar se é uma data válida
      if (isNaN(data.getTime())) {
        return 'Data inválida'
      }
      
      const opcoesFormatacao: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Sao_Paulo'
      }
      
      switch (opcoes) {
        case 'data':
          return data.toLocaleDateString('pt-BR', {
            ...opcoesFormatacao,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        case 'hora':
          return data.toLocaleTimeString('pt-BR', {
            ...opcoesFormatacao,
            hour: '2-digit',
            minute: '2-digit'
          })
        default:
          return data.toLocaleDateString('pt-BR', {
            ...opcoesFormatacao,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
      }
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error, dataString)
      return 'Data inválida'
    }
  }

  // 🔄 CARREGAR USUÁRIO LOGADO - NOVO
  useEffect(() => {
    const carregarUsuarioLogado = () => {
      try {
        const userData = localStorage.getItem('arcflow_user')
        if (userData && userData !== 'undefined') {
          const user = JSON.parse(userData)
          setUsuarioLogado({
            nome: user.name || user.nome || 'Usuário',
            email: user.email || 'Não informado'
          })
          console.log('✅ [USUARIO] Usuário logado carregado:', user.name || user.nome)
        } else {
          setUsuarioLogado({
            nome: 'Usuário ArcFlow',
            email: 'Não informado'
          })
          console.log('⚠️ [USUARIO] Dados do usuário não encontrados no localStorage')
        }
      } catch (error) {
        console.error('❌ [USUARIO] Erro ao carregar usuário logado:', error)
        setUsuarioLogado({
          nome: 'Usuário ArcFlow',
          email: 'Não informado'
        })
      }
    }

    carregarUsuarioLogado()
  }, [])

  // 🔄 CARREGAR DADOS DO CLIENTE - MELHORADO POR RAFAEL
  useEffect(() => {
    const carregarDadosCliente = async () => {
      const clienteId = briefingData.clienteId || briefingData.cliente_id
      if (!clienteId) {
        console.log('⚠️ [CLIENTE] Sem cliente_id para carregar')
        setClienteData(null)
        return
      }

      console.log('🔍 [CLIENTE] Carregando cliente:', clienteId)
      
      try {
        const token = localStorage.getItem('arcflow_auth_token')
        if (!token) {
          console.warn('⚠️ [CLIENTE] Token não encontrado')
          return
        }

        const response = await fetch(`http://localhost:3001/api/clientes/${clienteId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const cliente = data.cliente || data
          setClienteData(cliente)
          console.log('✅ [CLIENTE] Cliente carregado:', cliente.nome)
        } else {
          console.warn('⚠️ [CLIENTE] Erro HTTP:', response.status)
          setClienteData(null)
        }
      } catch (error) {
        console.error('❌ [CLIENTE] Erro ao buscar cliente:', error)
        setClienteData(null)
      }
    }

    carregarDadosCliente()
      }, [briefingData.clienteId, briefingData.cliente_id, briefingData.id]) // Adicionar briefingData.id para recarregar quando briefing muda

  // 🔄 CARREGAR DADOS DO RESPONSÁVEL
  useEffect(() => {
    const carregarDadosResponsavel = async () => {
      const responsavelId = briefingData.responsavelId || briefingData.responsavel_id
      if (!responsavelId) {
        console.log('⚠️ [RESPONSÁVEL] Sem responsavel_id para carregar')
        setResponsavelData({ nome: 'Responsável não identificado', email: 'Não informado' })
        return
      }

      console.log('🔍 [RESPONSÁVEL] Carregando responsável:', responsavelId)
      
      try {
        const token = localStorage.getItem('arcflow_auth_token')
        if (!token) {
          console.warn('⚠️ [RESPONSÁVEL] Token não encontrado')
          return
        }

        const response = await fetch(`http://localhost:3001/api/users/${responsavelId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const responsavel = {
            nome: data.user?.name || data.name || data.nome || 'Responsável não identificado',
            email: data.user?.email || data.email || 'Não informado'
          }
          setResponsavelData(responsavel)
          console.log('✅ [RESPONSÁVEL] Responsável carregado:', responsavel.nome)
        } else {
          console.warn('⚠️ [RESPONSÁVEL] Erro HTTP:', response.status)
          setResponsavelData({ nome: 'Responsável não identificado', email: 'Não informado' })
        }
      } catch (error) {
        console.error('❌ [RESPONSÁVEL] Erro ao buscar responsável:', error)
        setResponsavelData({ nome: 'Responsável não identificado', email: 'Não informado' })
      }
    }

    carregarDadosResponsavel()
      }, [briefingData.responsavelId, briefingData.responsavel_id, briefingData.id])

  // 🔄 CARREGAR RESPOSTAS DO BRIEFING
  useEffect(() => {
    const carregarRespostasBriefing = async () => {
      if (!briefingData.id) return

      try {
        const token = localStorage.getItem('arcflow_auth_token')
        const response = await fetch(`http://localhost:3001/api/briefings/${briefingData.id}/respostas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ [RESPOSTAS] Carregadas via API:', Object.keys(data.respostas || {}).length)
          setRespostasBriefing(data.respostas || briefingData.respostas || {})
        } else {
          console.log('⚠️ [RESPOSTAS] API retornou erro, usando dados locais')
          setRespostasBriefing(briefingData.respostas || {})
        }
      } catch (error) {
        console.warn('⚠️ Erro ao buscar respostas:', error)
        setRespostasBriefing(briefingData.respostas || {})
      }
    }

    carregarRespostasBriefing()
  }, [briefingData.id, briefingData.respostas])



  // 🔄 CARREGAR HISTÓRICO COMPLETO - CORREÇÃO RAFAEL
  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const token = localStorage.getItem('arcflow_auth_token')
        
        // 🎯 CARREGAR HISTÓRICO DO BACKEND E DAS OBSERVAÇÕES
        console.log('🔍 [HISTORICO] Carregando histórico completo do briefing:', briefingData.id)
        
        const response = await fetch(`http://localhost:3001/api/briefings/${briefingData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const briefingCompleto = await response.json()
          const briefing = briefingCompleto.briefing || briefingCompleto
          
          console.log('✅ [HISTORICO] Briefing completo carregado:', briefing)
          
          let historicoCompleto: HistoricoItem[] = []
          
          // 🔥 PRIMEIRO: Histórico das observações (edições)
          if (briefing.observacoes) {
            try {
              const observacoes = typeof briefing.observacoes === 'string' 
                ? JSON.parse(briefing.observacoes) 
                : briefing.observacoes
                
              if (observacoes.historico && Array.isArray(observacoes.historico)) {
                console.log('📋 [HISTORICO] Encontrado histórico nas observações:', observacoes.historico.length, 'eventos')
                historicoCompleto = [...observacoes.historico]
              }
            } catch (error) {
              console.warn('⚠️ [HISTORICO] Erro ao parsear observações:', error)
            }
          }
          
          // 🔥 SEGUNDO: Histórico básico (criação/atualização) - CORREÇÃO RAFAEL
          const historicoBasico: HistoricoItem[] = []
          
          // 🔥 CORREÇÃO: Usar datas em camelCase e fallback para snake_case
          const createdAt = briefing.createdAt || briefing.created_at || new Date().toISOString()
          const updatedAt = briefing.updatedAt || briefing.updated_at || new Date().toISOString()
          
          // Evento de criação - CORREÇÃO RAFAEL: Usar usuário logado real
          historicoBasico.push({
            id: `${briefing.id}-criado`,
            acao: 'Briefing criado',
            data: createdAt,
            tempo_inicio: createdAt,
            tempo_fim: createdAt,
            usuario: usuarioLogado?.nome || 'Sistema',
            detalhes: `Briefing "${briefing.nomeProjeto || briefing.nome_projeto}" criado no sistema`
          })
          
          // 🔥 CORREÇÃO RAFAEL: Só mostrar atualização se houve diferença significativa (mais de 30 segundos)
          const createdTime = new Date(createdAt).getTime()
          const updatedTime = new Date(updatedAt).getTime()
          const diferencaSegundos = (updatedTime - createdTime) / 1000
          
          console.log('🔍 [HISTORICO] Comparação de datas:', {
            createdAt,
            updatedAt,
            diferencaSegundos,
            mostrarAtualizacao: diferencaSegundos > 30
          })
          
          if (diferencaSegundos > 30) { // Diferença de mais de 30 segundos
            historicoBasico.push({
              id: `${briefing.id}-atualizado`,
              acao: 'Briefing atualizado',
              data: updatedAt,
              tempo_inicio: createdAt,
              tempo_fim: updatedAt,
              usuario: usuarioLogado?.nome || 'Usuário',
              detalhes: `Briefing "${briefing.nomeProjeto || briefing.nome_projeto}" foi atualizado`
            })
          }
          
          // 🔥 COMBINAR E ORDENAR POR DATA
          const todoHistorico = [...historicoCompleto, ...historicoBasico]
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          
          console.log('✅ [HISTORICO] Histórico completo montado:', todoHistorico.length, 'eventos')
          setHistorico(todoHistorico)
          
        } else {
          console.warn('⚠️ [HISTORICO] Erro na API, usando histórico básico')
          // Histórico básico como fallback - CORREÇÃO RAFAEL
          const createdAt = briefingData.createdAt || briefingData.created_at || new Date().toISOString()
          const updatedAt = briefingData.updatedAt || briefingData.updated_at || new Date().toISOString()
          
          const historicoBasico: HistoricoItem[] = [
            {
              id: '1',
              acao: 'Briefing criado',
              data: createdAt,
              tempo_inicio: createdAt,
              tempo_fim: updatedAt,
              usuario: usuarioLogado?.nome || 'Sistema',
              detalhes: 'Briefing inicial criado no sistema'
            }
          ]
          
          // Adicionar evento de atualização se necessário - CORREÇÃO RAFAEL
          const createdTime = new Date(createdAt).getTime()
          const updatedTime = new Date(updatedAt).getTime()
          const diferencaSegundos = (updatedTime - createdTime) / 1000
          
          if (diferencaSegundos > 30) {
            historicoBasico.unshift({
              id: '2',
              acao: 'Briefing atualizado',
              data: updatedAt,
              tempo_inicio: createdAt,
              tempo_fim: updatedAt,
              usuario: usuarioLogado?.nome || 'Usuário',
              detalhes: 'Briefing foi atualizado'
            })
          }
          
          setHistorico(historicoBasico)
        }
      } catch (error) {
        console.error('❌ [HISTORICO] Erro ao carregar histórico:', error)
        // Histórico mínimo de emergência - CORREÇÃO RAFAEL
        const createdAt = briefingData.createdAt || briefingData.created_at || new Date().toISOString()
        
        setHistorico([
          {
            id: 'emergency-1',
            acao: 'Briefing criado',
            data: createdAt,
            tempo_inicio: createdAt,
            tempo_fim: createdAt,
            usuario: usuarioLogado?.nome || 'Sistema',
            detalhes: 'Briefing inicial criado no sistema'
          }
        ])
      }
    }

    // Só carregar histórico se já temos os dados do usuário
    if (usuarioLogado) {
      carregarHistorico()
    }
  }, [briefingData.id, briefingData.updatedAt, briefingData.updated_at, usuarioLogado]) // ✅ Incluir usuário logado como dependência

  // 🎯 ANÁLISE IA INTELIGENTE BASEADA NAS RESPOSTAS REAIS
  useEffect(() => {
    if (!respostasBriefing) return

    const analisarBriefing = () => {
      const respostasArray = Object.values(respostasBriefing)
      const totalRespostas = respostasArray.length
      const respostasPreenchidas = respostasArray.filter(r => r && r !== '').length
      const completude = totalRespostas > 0 ? (respostasPreenchidas / totalRespostas) * 100 : 0

      let score = Math.min(Math.round(completude * 0.8 + 20), 100) // Base score baseado na completude
      let categoria = 'Regular'
      let pontosFortres: string[] = []
      let pontosAtencao: string[] = []
      let recomendacoes: string[] = []

      // Análise baseada na completude
      if (completude >= 90) {
        categoria = 'Excelente'
        pontosFortres.push('Briefing muito detalhado com informações precisas')
        pontosFortres.push('Cliente demonstra clareza sobre necessidades')
        recomendacoes.push('Pronto para início do anteprojeto')
      } else if (completude >= 70) {
        categoria = 'Bom'
        pontosFortres.push('Informações essenciais fornecidas')
        pontosAtencao.push('Algumas informações podem precisar de clarificação')
        recomendacoes.push('Revisar pontos não preenchidos antes do projeto')
      } else {
        categoria = 'Incompleto'
        pontosAtencao.push('Muitas informações ainda não fornecidas')
        pontosAtencao.push('Briefing precisa ser complementado')
        recomendacoes.push('Agendar reunião para completar informações')
      }

      // Análise específica baseada no tipo
      if (briefingData.tipologia?.toLowerCase().includes('residencial')) {
        pontosFortres.push('Projeto residencial bem definido')
        recomendacoes.push('Considerar aspectos de sustentabilidade')
      }

      if (briefingData.orcamento) {
        pontosFortres.push('Orçamento definido pelo cliente')
      } else {
        pontosAtencao.push('Orçamento não especificado')
        recomendacoes.push('Definir faixa orçamentária com o cliente')
      }

      setAnaliseIA({
        score,
        categoria,
        pontosFortres,
        pontosAtencao,
        recomendacoes,
        completude: Math.round(completude),
        totalRespostas,
        respostasPreenchidas
      })
    }

    analisarBriefing()
  }, [respostasBriefing, briefingData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADO': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
      case 'CONCLUIDO': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' }
      case 'EM_ANDAMENTO': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APROVADO': return 'Aprovado'
      case 'CONCLUIDO': return 'Concluído'
      case 'EM_ANDAMENTO': return 'Em Andamento'
      default: return 'Rascunho'
    }
  }

  const statusStyle = getStatusColor(briefingData.status)

  // 🔥 FUNÇÃO PARA EDITAR BRIEFING (MELHORADA - RAFAEL)
  const editarBriefing = async () => {
    if (!onEdit) {
      toast.error('Função de edição não disponível')
      return
    }

    try {
      setLoading(true)
      
      console.log('🔧 [EDITAR-RAFAEL] ====== INICIANDO EDIÇÃO COMPLETA ======')
      console.log('🔧 [EDITAR-RAFAEL] Briefing ID:', briefingData.id)
      console.log('🔧 [EDITAR-RAFAEL] Respostas já carregadas:', Object.keys(respostasBriefing || {}).length)
      console.log('🔧 [EDITAR-RAFAEL] Timestamp:', new Date().toISOString())
      
      // 🔥 PRIMEIRO: Verificar se já temos respostas carregadas
      let respostasParaEdicao = { ...respostasBriefing }
      
      if (Object.keys(respostasParaEdicao).length === 0) {
        console.log('🔄 [EDITAR-RAFAEL] Nenhuma resposta carregada - forçando carregamento...')
        
        // 🔥 TENTAR CARREGAR RESPOSTAS DE MÚLTIPLAS FONTES
        const fontes = [
          // 1. Tentar da API
          async () => {
            try {
              const token = localStorage.getItem('arcflow_auth_token')
              if (!token) return null
              
              const response = await fetch(`http://localhost:3001/api/briefings/${briefingData.id}/respostas`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(5000)
              })
              
              if (response.ok) {
                const data = await response.json()
                const respostasApi = data.respostas || data.data?.respostas || data
                if (respostasApi && Object.keys(respostasApi).length > 0) {
                  console.log('✅ [EDITAR-RAFAEL] Respostas carregadas da API:', Object.keys(respostasApi).length)
                  return respostasApi
                }
              }
              return null
            } catch (error) {
              console.log('❌ [EDITAR-RAFAEL] Erro na API:', error)
              return null
            }
          },
          
          // 2. Tentar das observações do briefing
          async () => {
            try {
                             if ((briefingData as any).observacoes) {
                 let observacoes = (briefingData as any).observacoes
                if (typeof observacoes === 'string') {
                  observacoes = JSON.parse(observacoes)
                }
                
                const respostasObservacoes = observacoes?.respostas || observacoes?.estruturaPersonalizada?.respostas
                if (respostasObservacoes && Object.keys(respostasObservacoes).length > 0) {
                  console.log('✅ [EDITAR-RAFAEL] Respostas encontradas nas observações:', Object.keys(respostasObservacoes).length)
                  return respostasObservacoes
                }
              }
              return null
            } catch (error) {
              console.log('❌ [EDITAR-RAFAEL] Erro nas observações:', error)
              return null
            }
          },
          
          // 3. Tentar do localStorage
          async () => {
            try {
              const chavesBackup = [
                `briefing-backup-respostas-${briefingData.id}`,
                `briefing-emergency-${briefingData.id}`,
                `briefing-originais-${briefingData.id}`
              ]
              
              for (const chave of chavesBackup) {
                const backup = localStorage.getItem(chave)
                if (backup) {
                  const respostasBackup = JSON.parse(backup)
                  if (respostasBackup && Object.keys(respostasBackup).length > 0) {
                    console.log('✅ [EDITAR-RAFAEL] Respostas recuperadas do localStorage:', chave, Object.keys(respostasBackup).length)
                    return respostasBackup
                  }
                }
              }
              return null
            } catch (error) {
              console.log('❌ [EDITAR-RAFAEL] Erro no localStorage:', error)
              return null
            }
          }
        ]
        
        // 🔥 TENTAR CADA FONTE ATÉ ENCONTRAR RESPOSTAS
        for (const fonte of fontes) {
          const respostasEncontradas = await fonte()
          if (respostasEncontradas && Object.keys(respostasEncontradas).length > 0) {
            respostasParaEdicao = respostasEncontradas
            setRespostasBriefing(respostasEncontradas)
            console.log('✅ [EDITAR-RAFAEL] Respostas carregadas com sucesso:', Object.keys(respostasEncontradas).length)
            break
          }
        }
      }
      
      // 🔥 VALIDAR SE TEMOS RESPOSTAS PARA EDITAR
      if (Object.keys(respostasParaEdicao).length === 0) {
        console.log('⚠️ [EDITAR-RAFAEL] Nenhuma resposta encontrada para edição')
        toast.warning('Nenhuma resposta encontrada para editar. Você pode criar um novo briefing.')
        return
      }
      
      console.log('🎯 [EDITAR-RAFAEL] Respostas finais para edição:', {
        totalRespostas: Object.keys(respostasParaEdicao).length,
        primeiras3: Object.entries(respostasParaEdicao).slice(0, 3).map(([k, v]) => ({ 
          pergunta: k, 
          resposta: String(v).substring(0, 30) + (String(v).length > 30 ? '...' : '') 
        }))
      })
      
      // 🔥 REGISTRAR AÇÃO NO HISTÓRICO
      const novoHistorico: HistoricoItem = {
        id: Date.now().toString(),
        acao: 'Edição iniciada',
        data: new Date().toISOString(),
        tempo_inicio: new Date().toISOString(),
        usuario: usuarioLogado?.nome || 'Usuário Atual',
        detalhes: `Usuário iniciou edição do briefing com ${Object.keys(respostasParaEdicao).length} respostas`
      }
      
      setHistorico(prev => [novoHistorico, ...prev])
      
      toast.success(`Modo de edição ativado com ${Object.keys(respostasParaEdicao).length} respostas`)
      
      // 🔥 CHAMAR FUNÇÃO DE EDIÇÃO COM SEGURANÇA
      console.log('🚀 [EDITAR-RAFAEL] Ativando modo de edição...')
      onEdit()
      
    } catch (error) {
      console.error('❌ [EDITAR-RAFAEL] Erro ao iniciar edição:', error)
      toast.error('Erro ao iniciar edição: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // 💰 FUNÇÃO PARA GERAR ORÇAMENTO (MELHORADA)
  const gerarOrcamentoAutomatico = async () => {
    if (briefingData.status !== 'CONCLUIDO' && briefingData.status !== 'APROVADO') {
      toast.error('O briefing deve estar concluído para gerar orçamento')
      return
    }

    setGerandoOrcamento(true)
    
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      
      toast.loading('🧠 Analisando briefing com IA e gerando orçamento inteligente...', { id: 'gerando-orcamento' })
      
      // 🧠 USAR NOVA API INTELIGENTE
      const response = await fetch(`http://localhost:3001/api/orcamentos-inteligentes/gerar/${briefingData.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setOrcamentoGerado(data.data)
        
        toast.success(`✅ Orçamento inteligente gerado com sucesso!\n\nCódigo: ${data.data.codigo}\nValor: R$ ${data.data.valorTotal?.toLocaleString('pt-BR') || 'N/A'}\nÁrea: ${data.data.areaConstruida}m²\nPrazo: ${data.data.prazoEntrega} dias`, {
          id: 'gerando-orcamento',
          duration: 6000
        })
        
        // Mostrar dados extraídos pela IA
        if (data.data.dadosExtaidosIA) {
          setTimeout(() => {
            toast.info(`🧠 IA extraiu: ${data.data.dadosExtaidosIA.tipologia} • ${data.data.dadosExtaidosIA.complexidade} • ${data.data.dadosExtaidosIA.disciplinas?.join(', ')}`, {
              duration: 4000
        })
          }, 1000)
        }
        
        // Registrar no histórico
        const novoHistorico: HistoricoItem = {
          id: Date.now().toString(),
          acao: 'Orçamento inteligente gerado',
          data: new Date().toISOString(),
          usuario: usuarioLogado?.nome || 'Sistema IA',
          detalhes: `Orçamento ${data.data.codigo} gerado com IA - ${data.data.dadosExtaidosIA?.tipologia} (${data.data.dadosExtaidosIA?.complexidade})`
        }
        setHistorico(prev => [novoHistorico, ...prev])
        
        // Atualizar estado do briefing para mostrar que tem orçamento
        briefingData.temOrcamento = true
        briefingData.orcamentoId = data.data.orcamentoId
        
        // Redirecionar para o orçamento específico gerado
        setTimeout(() => {
          window.open(`/orcamentos/${data.data.orcamentoId}`, '_blank')
        }, 2000)
        
      } else {
        if (response.status === 400 && data.code === 'ORCAMENTO_ALREADY_EXISTS') {
          toast.error(`❌ Já existe um orçamento para este briefing\n\nID: ${data.orcamentoId}`, { id: 'gerando-orcamento' })
          
          // Atualizar estado do briefing para mostrar que tem orçamento
          briefingData.temOrcamento = true
          briefingData.orcamentoId = data.orcamentoId
          
          // Oferecer opção de ir para o orçamento existente
          setTimeout(() => {
            toast.info('Redirecionando para o orçamento existente...', { duration: 2000 })
            window.open(`/orcamentos/${data.orcamentoId}`, '_blank')
          }, 2000)
        } else {
          throw new Error(data.error || 'Erro ao gerar orçamento')
        }
      }
    } catch (error: any) {
      console.error('❌ Erro ao gerar orçamento inteligente:', error)
      toast.error(`❌ Erro ao gerar orçamento inteligente: ${error.message || 'Erro desconhecido'}`, { 
        id: 'gerando-orcamento',
        duration: 4000
      })
    } finally {
      setGerandoOrcamento(false)
    }
  }

  // 👁️ FUNÇÃO PARA VER ORÇAMENTO EXISTENTE
  const verOrcamentoExistente = () => {
    if (briefingData.orcamentoId) {
      // Redirecionar para o orçamento específico
      window.open(`/orcamentos/${briefingData.orcamentoId}`, '_blank')
      
      toast.success('🔍 Redirecionando para o orçamento existente...', {
        duration: 2000
      })
    } else {
      toast.error('❌ ID do orçamento não encontrado', {
        duration: 3000
      })
    }
  }

  // 👁️ FUNÇÃO PARA VER TODAS AS RESPOSTAS
  const verTodasRespostas = async () => {
    setLoadingRespostas(true)
    
    try {
      console.log('🔍 [VER RESPOSTAS] ======= INICIANDO BUSCA =======')
      console.log('🔍 [VER RESPOSTAS] ID do briefing:', briefingData.id)
      console.log('🔍 [VER RESPOSTAS] Status do briefing:', briefingData.status)
      console.log('🔍 [VER RESPOSTAS] Progresso:', briefingData.progresso)
      
      // 🔥 VERIFICAR SE JÁ TEMOS RESPOSTAS LOCAIS
      if (respostasBriefing && Object.keys(respostasBriefing).length > 0) {
        console.log('✅ [VER RESPOSTAS] Usando respostas já carregadas:', Object.keys(respostasBriefing).length)
        setMostrarTodasRespostas(true)
        toast.success(`${Object.keys(respostasBriefing).length} respostas exibidas`)
        return
      }

      // 🔥 TENTAR API COM TIMEOUT RÁPIDO
      const token = localStorage.getItem('arcflow_auth_token')
      const url = `http://localhost:3001/api/briefings/${briefingData.id}/respostas`
      
      console.log('🔍 [VER RESPOSTAS] Fazendo requisição para:', url)
      console.log('🔍 [VER RESPOSTAS] Token presente:', !!token)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // 🔥 TIMEOUT RÁPIDO para não travar
        signal: AbortSignal.timeout(5000)
      })

      console.log('🔍 [VER RESPOSTAS] Response status:', response.status)
      console.log('🔍 [VER RESPOSTAS] Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ [VER RESPOSTAS] Dados recebidos da API:', data)
        console.log('✅ [VER RESPOSTAS] Tipo de dados:', typeof data)
        console.log('✅ [VER RESPOSTAS] Chaves disponíveis:', Object.keys(data))
        
        // 🔥 VERIFICAR MÚLTIPLOS FORMATOS DE RESPOSTA
        const respostasEncontradas = data.respostasParaEdicao || data.respostas || data.data?.respostas || {}
        console.log('✅ [VER RESPOSTAS] Respostas encontradas:', respostasEncontradas)
        console.log('✅ [VER RESPOSTAS] Quantidade de respostas:', Object.keys(respostasEncontradas).length)
        
        if (respostasEncontradas && Object.keys(respostasEncontradas).length > 0) {
          setRespostasBriefing(respostasEncontradas)
          setMostrarTodasRespostas(true)
          toast.success(`${Object.keys(respostasEncontradas).length} respostas carregadas`)
          return
        } else {
          console.log('⚠️ [VER RESPOSTAS] Nenhuma resposta encontrada na API')
        }
      } else {
        console.log('⚠️ [VER RESPOSTAS] API retornou erro:', response.status, response.statusText)
        
        // 🔥 TENTAR LER ERRO DA API
        try {
          const errorData = await response.text()
          console.log('⚠️ [VER RESPOSTAS] Erro da API:', errorData)
        } catch (e) {
          console.log('⚠️ [VER RESPOSTAS] Não foi possível ler erro da API')
        }
      }
      
      // 🔄 FALLBACK: Usar dados do briefing se não conseguir da API
      console.log('🔄 [VER RESPOSTAS] API indisponível, verificando dados do briefing')
      console.log('🔄 [VER RESPOSTAS] briefingData.respostas:', briefingData.respostas)
      
      if (briefingData.respostas && Object.keys(briefingData.respostas).length > 0) {
        console.log('✅ [VER RESPOSTAS] Usando briefingData.respostas')
        setRespostasBriefing(briefingData.respostas)
        setMostrarTodasRespostas(true)
        toast.info(`Exibindo ${Object.keys(briefingData.respostas).length} respostas (API indisponível)`)
      } else {
        console.log('❌ [VER RESPOSTAS] Nenhuma resposta encontrada')
        toast.error('Erro ao carregar respostas. Verifique se o backend está funcionando.')
      setMostrarTodasRespostas(false)
      }
      
    } catch (error) {
      console.log('⚠️ [VER RESPOSTAS] Erro na API:', error instanceof Error ? error.message : 'Erro desconhecido')
      console.log('⚠️ [VER RESPOSTAS] Stack trace:', error instanceof Error ? error.stack : 'N/A')
      
      // 🔥 FALLBACK FINAL: Tentar usar qualquer dado disponível
      if (respostasBriefing && Object.keys(respostasBriefing).length > 0) {
        console.log('🔄 [VER RESPOSTAS] Usando respostas em cache')
        setMostrarTodasRespostas(true)
        toast.info('Exibindo respostas em cache (API indisponível)')
      } else if (briefingData.respostas && Object.keys(briefingData.respostas).length > 0) {
        console.log('🔄 [VER RESPOSTAS] Usando respostas do briefingData como fallback')
        setRespostasBriefing(briefingData.respostas)
        setMostrarTodasRespostas(true)
        toast.info('Exibindo respostas locais (API com erro)')
      } else {
        console.log('❌ [VER RESPOSTAS] Nenhuma resposta disponível')
        toast.error('Não foi possível carregar as respostas')
        setMostrarTodasRespostas(false)
      }
    } finally {
      setLoadingRespostas(false)
      console.log('🔍 [VER RESPOSTAS] ======= BUSCA FINALIZADA =======')
    }
  }

  // 🎨 COMPONENTE PARA EXIBIR RESPOSTAS
  const RespostasDetalhadas = () => {
    if (!respostasBriefing) return null

    // 🔧 Filtrar apenas respostas reais (excluir metadados)
    const respostasArray = Object.entries(respostasBriefing)
      .filter(([key]) => !key.startsWith('_')) // Excluir _briefingId, _dashboardUrl, etc.
      .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">
            Respostas Detalhadas ({respostasArray.length} perguntas respondidas)
          </h4>
          <button
            onClick={() => setMostrarTodasRespostas(false)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Minimizar
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto space-y-3">
          {respostasArray.map(([pergunta, resposta], index) => (
            <div key={pergunta} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 text-sm">
                  {!isNaN(Number(pergunta)) ? `${pergunta}. ` : ''}Pergunta {index + 1}
                </h5>
                <p className="text-gray-700 text-sm bg-white p-2 rounded border">
                  {resposta ? (
                    typeof resposta === 'string' ? resposta : 
                    typeof resposta === 'number' ? resposta.toString() :
                    typeof resposta === 'boolean' ? (resposta ? 'Sim' : 'Não') :
                    typeof resposta === 'object' && resposta !== null ? 
                      JSON.stringify(resposta, null, 2) :
                    String(resposta)
                  ) : (
                    <span className="text-gray-400 italic">Não respondido</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Informações Principais */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm rounded-lg border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {getStatusText(briefingData.status)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">
              {briefingData.progresso}% completo
            </span>
            {analiseIA && (
              <>
                <span className="text-gray-500">•</span>
                <span className={`text-sm font-medium ${
                  analiseIA.categoria === 'Excelente' ? 'text-green-600' :
                  analiseIA.categoria === 'Bom' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  IA: {analiseIA.categoria}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={editarBriefing}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
              ) : (
              <Edit className="w-4 h-4 inline mr-2" />
              )}
              Editar
            </button>
            <button 
              onClick={() => setModalExportacaoAberto(true)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Exportar
            </button>
            <button className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors">
              <Share2 className="w-4 h-4 inline mr-2" />
              Compartilhar
            </button>
            {/* Botão Dinâmico - Gerar/Ver Orçamento */}
            <button 
              onClick={briefingData.temOrcamento ? verOrcamentoExistente : gerarOrcamentoAutomatico}
              disabled={gerandoOrcamento || (!briefingData.temOrcamento && briefingData.status !== 'CONCLUIDO' && briefingData.status !== 'APROVADO')}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                briefingData.temOrcamento
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  : (briefingData.status === 'CONCLUIDO' || briefingData.status === 'APROVADO')
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {gerandoOrcamento ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Gerando...
                </>
              ) : briefingData.temOrcamento ? (
                <>
                  <Eye className="w-4 h-4 inline mr-2" />
                  Ver Orçamento
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 inline mr-2" />
                  Gerar Orçamento
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cards de Informações - DADOS REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Cliente</p>
                <p className="text-blue-800 font-semibold">
                  {clienteData?.nome || 'Carregando...'}
                </p>
                {clienteData?.empresa && (
                  <p className="text-xs text-blue-600">{clienteData.empresa}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-indigo-600 font-medium">Responsável</p>
                <p className="text-indigo-800 font-semibold">
                  {responsavelData?.nome || 'Carregando...'}
                </p>
                {responsavelData?.email && responsavelData.email !== 'Não informado' && (
                  <p className="text-xs text-indigo-600">{responsavelData.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">Tipologia</p>
                <p className="text-green-800 font-semibold">{briefingData.tipologia}</p>
                <p className="text-xs text-green-600">{briefingData.area}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600 font-medium">Orçamento</p>
                <p className="text-purple-800 font-semibold">{briefingData.orcamento || 'A definir'}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600 font-medium">Prazo</p>
                <p className="text-orange-800 font-semibold">{briefingData.prazo || 'A definir'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progresso do Briefing</h3>
          <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">{briefingData.progresso}%</span>
            {analiseIA && (
              <span className="text-sm text-gray-500">
                ({analiseIA.respostasPreenchidas}/{analiseIA.totalRespostas} respostas)
              </span>
            )}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${briefingData.progresso}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'resumo', nome: 'Resumo Executivo', icon: FileText },
              { id: 'respostas', nome: 'Respostas Detalhadas', icon: CheckCircle },
              { id: 'analise', nome: 'Análise IA', icon: Bot },
              { id: 'historico', nome: 'Histórico', icon: Clock }
            ].map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  abaSelecionada === aba.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <aba.icon className="w-4 h-4" />
                <span className="font-medium">{aba.nome}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {abaSelecionada === 'resumo' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações do Projeto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-700">Nome do Projeto</h5>
                      <p className="text-gray-900">{briefingData.nomeProjeto || briefingData.nome_projeto}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700">Disciplina</h5>
                      <p className="text-gray-900">{briefingData.disciplina}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700">Descrição</h5>
                      <p className="text-gray-900">{briefingData.descricao || 'Não informado'}</p>
                    </div>
                        </div>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-700">Cliente</h5>
                      <p className="text-gray-900">{clienteData?.nome || 'Carregando...'}</p>
                      {clienteData?.email && (
                        <p className="text-sm text-gray-600">{clienteData.email}</p>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700">Responsável</h5>
                      <p className="text-gray-900">{responsavelData?.nome || 'Carregando...'}</p>
                      {responsavelData?.email && responsavelData.email !== 'Não informado' && (
                        <p className="text-sm text-gray-600">{responsavelData.email}</p>
                      )}
                      </div>
                    <div>
                      <h5 className="font-medium text-gray-700">Criado em</h5>
                      <p className="text-gray-900">
                        {/* 🔥 CORREÇÃO RAFAEL: Usar formatação brasileira correta */}
                        {formatarDataBrasileira(briefingData.createdAt || briefingData.created_at || new Date().toISOString())}
                      </p>
                      </div>
                    <div>
                      <h5 className="font-medium text-gray-700">Última atualização</h5>
                      <p className="text-gray-900">
                        {/* 🔥 CORREÇÃO RAFAEL: Buscar data mais recente do histórico */}
                        {formatarDataBrasileira(
                          // 1. Primeiro tentar a data mais recente do histórico
                          (historico.length > 0 ? historico[0].data : null) ||
                          // 2. Fallback para updatedAt do banco
                          briefingData.updatedAt || briefingData.updated_at || 
                          // 3. Fallback final para data atual
                          new Date().toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaSelecionada === 'analise' && analiseIA && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Bot className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Análise Inteligente</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Score: {analiseIA.score}/100
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analiseIA.categoria === 'Excelente' ? 'bg-green-100 text-green-800' :
                    analiseIA.categoria === 'Bom' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {analiseIA.categoria}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Pontos Fortes
                    </h5>
                    <ul className="space-y-1">
                      {analiseIA.pontosFortres.map((ponto: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600">• {ponto}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-orange-700 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Pontos de Atenção
                    </h5>
                    <ul className="space-y-1">
                      {analiseIA.pontosAtencao.map((ponto: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600">• {ponto}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-blue-700 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Recomendações
                    </h5>
                    <ul className="space-y-1">
                      {analiseIA.recomendacoes.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaSelecionada === 'respostas' && (
            <div className="space-y-6">
              {!mostrarTodasRespostas ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Respostas Detalhadas</h4>
              <p className="text-gray-600 mb-6">
                Visualização detalhada de todas as respostas do briefing
              </p>
                  {respostasBriefing && Object.keys(respostasBriefing).length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        {Object.keys(respostasBriefing).length} perguntas respondidas
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={verTodasRespostas}
                    disabled={loadingRespostas}
                    className={`px-6 py-3 rounded-xl transition-colors disabled:opacity-50 ${
                      respostasBriefing && Object.keys(respostasBriefing).length > 0
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {loadingRespostas ? (
                      <>
                        <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                        Carregando...
                      </>
                    ) : respostasBriefing && Object.keys(respostasBriefing).length > 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Respostas Carregadas
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 inline mr-2" />
                Ver Todas as Respostas
                      </>
                    )}
              </button>
                </div>
              ) : (
                <RespostasDetalhadas />
              )}
            </div>
          )}

          {abaSelecionada === 'historico' && (
            <div className="space-y-6">
                  <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Histórico de Alterações</h4>
                <button 
                  onClick={async () => {
                    console.log('🔄 [HISTORICO] Recarregando histórico completo...')
                    try {
                      const token = localStorage.getItem('arcflow_auth_token')
                      
                      // 🔥 CORREÇÃO RAFAEL: Buscar briefing completo em vez de rota de histórico
                      const response = await fetch(`http://localhost:3001/api/briefings/${briefingData.id}`, {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      })

                      if (response.ok) {
                        const briefingCompleto = await response.json()
                        const briefing = briefingCompleto.briefing || briefingCompleto
                        
                        let historicoCompleto: HistoricoItem[] = []
                        
                        // 🔥 HISTÓRICO DAS OBSERVAÇÕES
                        if (briefing.observacoes) {
                          try {
                            const observacoes = typeof briefing.observacoes === 'string' 
                              ? JSON.parse(briefing.observacoes) 
                              : briefing.observacoes
                              
                            if (observacoes.historico && Array.isArray(observacoes.historico)) {
                              historicoCompleto = [...observacoes.historico]
                            }
                          } catch (error) {
                            console.warn('⚠️ [HISTORICO] Erro ao parsear observações:', error)
                          }
                        }
                        
                        // 🔥 HISTÓRICO BÁSICO (CRIAÇÃO/ATUALIZAÇÃO)
                        const historicoBasico: HistoricoItem[] = []
                        
                        const createdAt = briefing.createdAt || briefing.created_at || new Date().toISOString()
                        const updatedAt = briefing.updatedAt || briefing.updated_at || new Date().toISOString()
                        
                        // Evento de criação - CORREÇÃO RAFAEL: Usar usuário logado
                        historicoBasico.push({
                          id: `${briefing.id}-criado`,
                          acao: 'Briefing criado',
                          data: createdAt,
                          tempo_inicio: createdAt,
                          tempo_fim: createdAt,
                          usuario: usuarioLogado?.nome || 'Sistema',
                          detalhes: `Briefing "${briefing.nomeProjeto || briefing.nome_projeto}" criado no sistema`
                        })
                        
                        // 🔥 CORREÇÃO RAFAEL: Só mostrar atualização se houve diferença significativa
                        const createdTime = new Date(createdAt).getTime()
                        const updatedTime = new Date(updatedAt).getTime()
                        const diferencaSegundos = (updatedTime - createdTime) / 1000
                        
                        if (diferencaSegundos > 30) {
                          historicoBasico.push({
                            id: `${briefing.id}-atualizado`,
                            acao: 'Briefing atualizado',
                            data: updatedAt,
                            tempo_inicio: createdAt,
                            tempo_fim: updatedAt,
                            usuario: usuarioLogado?.nome || 'Usuário',
                            detalhes: `Briefing "${briefing.nomeProjeto || briefing.nome_projeto}" foi atualizado`
                          })
                        }
                        
                        // 🔥 COMBINAR E ORDENAR
                        const todoHistorico = [...historicoCompleto, ...historicoBasico]
                          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                        
                        setHistorico(todoHistorico)
                        console.log('✅ [HISTORICO] Histórico recarregado:', todoHistorico.length, 'eventos')
                        console.log('📅 [HISTORICO] Última atualização encontrada:', todoHistorico[0]?.data || 'N/A')
                        console.log('🔄 [HISTORICO] Campo "Última atualização" será atualizado automaticamente')
                        
                        // 🔥 NOTIFICAR SUCESSO COM INFORMAÇÃO DA ÚLTIMA ATUALIZAÇÃO
                        const ultimaAtualizacao = todoHistorico[0]?.data
                        if (ultimaAtualizacao) {
                          const dataFormatada = formatarDataBrasileira(ultimaAtualizacao)
                          toast.success(`Histórico atualizado! Última alteração: ${dataFormatada}`)
                        } else {
                          toast.success('Histórico atualizado com sucesso!')
                        }
                      } else {
                        console.warn('⚠️ [HISTORICO] Erro ao recarregar:', response.status)
                        toast.error('Erro ao atualizar histórico - verifique a conexão')
                      }
                    } catch (error) {
                      console.error('❌ [HISTORICO] Erro ao recarregar histórico:', error)
                      toast.error('Erro ao carregar histórico atualizado')
                    }
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
                  title="Atualizar histórico e última atualização"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Atualizar</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {historico.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <History className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{item.acao}</span>
                          <span className="text-sm text-gray-500">por {item.usuario}</span>
                        </div>
                        {item.detalhes && (
                          <p className="text-sm text-gray-600 mb-2">{item.detalhes}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            📅 {formatarDataBrasileira(item.data, 'data')}
                          </span>
                          {item.tempo_inicio && (
                            <span>
                              🕐 Início: {formatarDataBrasileira(item.tempo_inicio, 'hora')}
                            </span>
                          )}
                          {item.tempo_fim && (
                            <span>
                              🕑 Fim: {formatarDataBrasileira(item.tempo_fim, 'hora')}
                            </span>
                          )}
                          {item.tempo_inicio && item.tempo_fim && (
                            <span className="font-medium text-blue-600">
                              ⏱️ Duração: {Math.round((new Date(item.tempo_fim).getTime() - new Date(item.tempo_inicio).getTime()) / (1000 * 60))} min
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatarDataBrasileira(item.data, 'hora')}
                    </span>
                    </div>
                  </div>
                ))}
                
                {historico.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Nenhum histórico disponível</p>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 MODAL EXPORTAÇÃO */}
      <ModalExportacao
        isOpen={modalExportacaoAberto}
        onClose={() => setModalExportacaoAberto(false)}
        briefings={[{
          id: briefingData.id,
          briefingId: briefingData.id,
          clienteId: briefingData.cliente_id || '',
          projetoId: briefingData.id,
          respostas: respostasBriefing || {},
          analiseIA: analiseIA,
          status: briefingData.status === 'CONCLUIDO' ? 'concluido' : 
                  briefingData.status === 'APROVADO' ? 'aprovado' : 
                  'em_revisao',
          concluidoEm: briefingData.updatedAt || briefingData.updated_at || new Date().toISOString(),
          tempoPreenchimento: 0,
          versao: 1,
          historico: [],
          metadados: {
            dispositivo: 'web',
            navegador: 'unknown'
          }
        }]}
      />
    </div>
  )
} 