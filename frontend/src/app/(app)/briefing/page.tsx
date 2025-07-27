'use client'

import { motion } from 'framer-motion'
import { 
  ClipboardList, Plus, Search, Filter, Eye, Edit, 
  CheckCircle, Clock, AlertTriangle, FileText, 
  Users, Calendar, TrendingUp, BarChart3, Download,
  Building, MapPin, Star, DollarSign, Timer,
  Phone, MessageCircle, UserCheck, Activity,
  AlertCircle, RefreshCw, ArrowUp, ArrowDown,
  ChevronRight, SortAsc, SortDesc, FilterX,
  Target, Zap, Award, Settings, Bell
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { listarBriefingsDisponiveis, obterEstatisticasBriefings } from '@/data/briefings'
import { salvamentoBriefing } from '@/services/salvamentoBriefing'
import { briefingApiService, BriefingListItem, BriefingMetrics } from '@/services/briefingApiService'
import PainelNotificacoes from '@/components/briefing/PainelNotificacoes'
import ModalExportacao from '@/components/briefing/ModalExportacao'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// 🎯 FUNÇÃO PARA GERAR MÉTRICAS DINÂMICAS
const gerarMetricasPrincipais = (estatisticas: BriefingMetrics | null, totalBriefings: number) => {
  const briefingsAtivos = estatisticas?.briefingsAtivos || 0;
  const briefingsConcluidos = estatisticas?.briefingsConcluidos || 0;
  const taxaConversao = totalBriefings > 0 ? Math.round((briefingsConcluidos / totalBriefings) * 100) : 0;
  
  return [
    {
      titulo: 'Briefings Ativos',
      valor: briefingsAtivos.toString(),
      icone: ClipboardList,
      cor: 'text-blue-600',
      bgCor: 'bg-blue-50',
      detalhe: 'Em andamento'
    },
    {
      titulo: 'Taxa de Conversão',
      valor: `${taxaConversao}%`,
      icone: Target,
      cor: 'text-green-600',
      bgCor: 'bg-green-50',
      detalhe: 'Briefing → Projeto'
    },
    {
      titulo: 'Total de Briefings',
      valor: totalBriefings.toString(),
      icone: FileText,
      cor: 'text-purple-600',
      bgCor: 'bg-purple-50',
      detalhe: 'Todos os projetos'
    },
    {
      titulo: 'Concluídos',
      valor: briefingsConcluidos.toString(),
      icone: CheckCircle,
      cor: 'text-green-600',
      bgCor: 'bg-green-50',
      detalhe: 'Finalizados'
    }
  ];
}

// 🚨 FUNÇÃO PARA GERAR ALERTAS DINÂMICOS
const gerarAlertasImportantes = (briefings: BriefingListItem[]) => {
  const alertas = [];
  
  // Verificar briefings em andamento há muito tempo
  const briefingsAntigos = briefings.filter(b => {
    const diasAtras = Math.floor((Date.now() - new Date(b.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return b.status === 'EM_ANDAMENTO' && diasAtras > 3;
  });
  
  if (briefingsAntigos.length > 0) {
    alertas.push({
      id: 1,
      tipo: 'urgente',
      titulo: `${briefingsAntigos.length} briefing${briefingsAntigos.length > 1 ? 's' : ''} aguardando há 3+ dias`,
      valor: 'Requer atenção',
      icone: AlertTriangle,
      cor: 'text-red-600',
      bgCor: 'bg-red-50',
      borderCor: 'border-red-200'
    });
  }
  
  // Verificar briefings em edição
  const briefingsEdicao = briefings.filter(b => b.status === 'EM_EDICAO');
  if (briefingsEdicao.length > 0) {
    alertas.push({
      id: 2,
      tipo: 'atencao',
      titulo: `${briefingsEdicao.length} briefing${briefingsEdicao.length > 1 ? 's' : ''} em edição`,
      valor: 'Aguardando revisão',
      icone: Edit,
      cor: 'text-orange-600',
      bgCor: 'bg-orange-50',
      borderCor: 'border-orange-200'
    });
  }
  
  // Verificar briefings concluídos recentemente
  const briefingsConcluidos = briefings.filter(b => {
    const diasAtras = Math.floor((Date.now() - new Date(b.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    return b.status === 'CONCLUIDO' && diasAtras <= 7;
  });
  
  if (briefingsConcluidos.length > 0) {
    alertas.push({
      id: 3,
      tipo: 'oportunidade',
      titulo: `${briefingsConcluidos.length} briefing${briefingsConcluidos.length > 1 ? 's' : ''} concluído${briefingsConcluidos.length > 1 ? 's' : ''} recentemente`,
      valor: 'Prontos para orçamento',
      icone: CheckCircle,
      cor: 'text-green-600',
      bgCor: 'bg-green-50',
      borderCor: 'border-green-200'
    });
  }
  
  // Se não há alertas, mostrar mensagem positiva
  if (alertas.length === 0) {
    alertas.push({
      id: 1,
      tipo: 'info',
      titulo: 'Tudo em ordem!',
      valor: 'Nenhum alerta no momento',
      icone: CheckCircle,
      cor: 'text-green-600',
      bgCor: 'bg-green-50',
      borderCor: 'border-green-200'
    });
  }
  
  return alertas;
}

// 🔍 FILTROS SIMPLIFICADOS
const FILTROS_SIMPLES = {
  status: ['Todos', 'Em Andamento', 'Concluído', 'Em Edição', 'Orçamento em Elaboração', 'Projeto Iniciado', 'Dados de Teste'],
  tipologia: ['Todas', 'Residencial', 'Comercial', 'Industrial']
}

export default function BriefingDashboard() {
  const { tema, temaId, personalizacao } = useTheme()
  const router = useRouter()
  
  // Estados simplificados
  const [estatisticas, setEstatisticas] = useState<BriefingMetrics | null>(null)
  const [briefingsRecentes, setBriefingsRecentes] = useState<BriefingListItem[]>([])
  const [todosOsBriefings, setTodosOsBriefings] = useState<BriefingListItem[]>([])
  const [briefingsFiltrados, setBriefingsFiltrados] = useState<BriefingListItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    busca: '',
    status: 'Todos',
    tipologia: 'Todas'
  })
  const [ordenacao, setOrdenacao] = useState({
    campo: 'data',
    direcao: 'desc' as 'asc' | 'desc'
  })

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)
        
        console.log('🔄 [BRIEFING-DASHBOARD] Carregando dados...')

        const response = await briefingApiService.listarBriefings()
        console.log('📊 [BRIEFING-DASHBOARD] Dados recebidos:', response)
        
        if (response.briefings) {
          const briefings = response.briefings
          setTodosOsBriefings(briefings)
          setBriefingsRecentes(briefings.slice(0, 5))
          
          // Métricas básicas
          const metrics = await briefingApiService.calcularMetricas()
          setEstatisticas(metrics)
          
          console.log('✅ [BRIEFING-DASHBOARD] Dados processados:', {
            totalBriefings: briefings.length,
            briefingsRecentes: briefings.slice(0, 5).length,
            metricas: metrics
          })
           } else {
          setErro('Erro ao carregar dados')
        }
      } catch (error) {
        console.error('❌ [BRIEFING-DASHBOARD] Erro ao carregar:', error)
        setErro('Erro ao conectar com o servidor')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  // Filtrar briefings
  useEffect(() => {
    let resultado = [...todosOsBriefings]

    // Filtro por busca
    if (filtros.busca) {
      resultado = resultado.filter(briefing => 
        briefing.nomeProjeto?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        briefing.cliente?.nome?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        briefing.tipologia?.toLowerCase().includes(filtros.busca.toLowerCase())
      )
    }

    // Filtro por status
    if (filtros.status !== 'Todos') {
      if (filtros.status === 'Dados de Teste') {
        // Filtrar apenas briefings de teste (que começam com [TESTE])
        resultado = resultado.filter(briefing => 
          briefing.nomeProjeto?.startsWith('[TESTE]') || 
          briefing.nomeProjeto?.toLowerCase().includes('teste')
        )
      } else {
        resultado = resultado.filter(briefing => {
          const statusInfo = briefingApiService.formatarStatus(briefing.status)
          return statusInfo.texto === filtros.status
        })
      }
    }

    // Filtro por tipologia
    if (filtros.tipologia !== 'Todas') {
      resultado = resultado.filter(briefing => briefing.tipologia === filtros.tipologia)
    }

    // Ordenação
    const direcao = ordenacao.direcao === 'asc' ? 1 : -1
    resultado.sort((a, b) => {
             switch (ordenacao.campo) {
        case 'data':
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * direcao
        case 'cliente':
          return (a.cliente?.nome || '').localeCompare(b.cliente?.nome || '') * direcao
        default:
          return 0
      }
    })

    setBriefingsFiltrados(resultado)
  }, [todosOsBriefings, filtros, ordenacao])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
      
        {/* 🎯 CABEÇALHO LIMPO E FOCADO */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Briefings</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seus briefings de forma profissional
          </p>
        </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:flex items-center">
            <Download className="w-4 h-4 mr-2" />
              Exportar
          </Button>
          <Link 
            href="/briefing/novo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center font-medium"
          >
              <Plus className="w-4 h-4 mr-2" />
            Novo Briefing
          </Link>
        </div>
      </div>

        {/* 📊 MÉTRICAS PRINCIPAIS - DESIGN LIMPO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {gerarMetricasPrincipais(estatisticas, todosOsBriefings.length).map((metrica, index) => {
          const IconeMetrica = metrica.icone
          return (
            <motion.div
              key={metrica.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${metrica.bgCor} flex items-center justify-center`}>
                    <IconeMetrica className={`w-6 h-6 ${metrica.cor}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrica.valor}</h3>
                  <p className="text-sm font-medium text-gray-900 mb-1">{metrica.titulo}</p>
                  <p className="text-xs text-gray-500">{metrica.detalhe}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* 📋 SEÇÃO PRINCIPAL - BRIEFINGS */}
        <div className="lg:col-span-2 space-y-6">
          
            {/* 🚨 ALERTAS IMPORTANTES - DESIGN MINIMALISTA */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-500" />
                  Alertas Importantes
              </CardTitle>
            </CardHeader>
              <CardContent className="space-y-3">
                {gerarAlertasImportantes(todosOsBriefings).map((alerta) => {
                const IconeAlerta = alerta.icone
                return (
                    <div key={alerta.id} className={`p-4 rounded-xl border ${alerta.borderCor} ${alerta.bgCor}`}>
                      <div className="flex items-start space-x-3">
                        <IconeAlerta className={`w-5 h-5 mt-0.5 ${alerta.cor}`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{alerta.titulo}</h4>
                          <p className="text-sm font-semibold text-gray-700">{alerta.valor}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

            {/* 📋 LISTA DE BRIEFINGS - DESIGN ORGANIZADO */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
                    Todos os Briefings ({briefingsFiltrados.length})
                  </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOrdenacao(prev => ({
                      ...prev,
                      direcao: prev.direcao === 'asc' ? 'desc' : 'asc'
                    }))}
                  >
                    {ordenacao.direcao === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
                {/* 🔍 SISTEMA DE BUSCA SIMPLIFICADO */}
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                  <input
                    type="text"
                      placeholder="Buscar briefings..."
                    value={filtros.busca}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {FILTROS_SIMPLES.status.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={filtros.tipologia}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipologia: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {FILTROS_SIMPLES.tipologia.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

                {/* 📄 LISTA DE BRIEFINGS - LAYOUT LIMPO */}
                <div className="space-y-3">
                 {carregando ? (
                   Array.from({ length: 3 }).map((_, index) => (
                     <div key={index} className="p-4 rounded-xl border border-gray-200 bg-gray-50 animate-pulse">
                        <div className="h-5 bg-gray-300 rounded mb-3"></div>
                       <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
                       <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                     </div>
                   ))
                 ) : erro ? (
                   <div className="text-center p-8">
                     <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                      <h4 className="text-lg font-medium text-red-700 mb-2">Erro ao carregar briefings</h4>
                     <p className="text-sm text-red-600 mb-4">{erro}</p>
                     <Button 
                       onClick={() => window.location.reload()}
                       className="bg-red-600 hover:bg-red-700 text-white"
                     >
                       Tentar Novamente
                     </Button>
                   </div>
                 ) : briefingsFiltrados.length === 0 ? (
                   <div className="text-center p-8">
                      <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum briefing encontrado</h4>
                      <p className="text-sm text-gray-600 mb-4">Crie seu primeiro briefing para começar</p>
                     <Link 
                       href="/briefing/novo"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                     >
                       <Plus className="w-4 h-4 mr-2" />
                        Criar Briefing
                     </Link>
                   </div>
                ) : (
                  briefingsFiltrados.map((briefing, index) => {
                    const statusInfo = briefingApiService.formatarStatus(briefing.status)
                                         const progresso = briefingApiService.calcularProgresso(briefing)
                    
                    return (
                      <motion.div
                        key={briefing.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all bg-white"
                        onClick={() => router.push(`/briefing/${briefing.id}`)}
                      >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{briefing.nomeProjeto}</h4>
                              <p className="text-sm text-gray-600">{briefing.cliente?.nome || 'Cliente não informado'}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={statusInfo.cor}>{statusInfo.texto}</Badge>
                              <span className="text-sm font-medium text-gray-900">{progresso}%</span>
                            </div>
                              </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {briefing.tipologia || 'Não definida'}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(briefing.updatedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  // Ação rápida
                                  }}
                                >
                                <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progresso}%` }}
                              />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

          {/* 📊 SIDEBAR - INFORMAÇÕES COMPLEMENTARES */}
        <div className="space-y-6">
          
            {/* 📈 ATIVIDADE RECENTE - DESIGN MINIMALISTA */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {carregando ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))
              ) : briefingsRecentes.length === 0 ? (
                  <div className="text-center p-4">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Nenhuma atividade recente</p>
                </div>
              ) : (
                briefingsRecentes.map((briefing, index) => {
                  const statusInfo = briefingApiService.formatarStatus(briefing.status)
                  return (
                    <motion.div
                      key={briefing.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                      onClick={() => router.push(`/briefing/${briefing.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 text-sm truncate">{briefing.nomeProjeto}</h5>
                        <Badge className={statusInfo.cor + ' text-xs'}>{statusInfo.texto}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {briefing.cliente?.nome || 'Cliente não informado'}
                        </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                              {briefing.tipologia || 'Não definida'}
                           </span>
                          <span>{new Date(briefing.updatedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </CardContent>
          </Card>

            {/* 🚀 AÇÕES RÁPIDAS - DESIGN SIMPLIFICADO */}
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push('/briefing/novo')}
              >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Briefing
              </Button>
              <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* Ação de relatório */}}
              >
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Relatório
              </Button>
              <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* Ação de exportar */}}
              >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 