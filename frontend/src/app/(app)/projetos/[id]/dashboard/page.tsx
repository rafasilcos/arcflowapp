'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useBriefingTimer } from '@/hooks/useBriefingTimer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  FileText, Clock, CheckCircle, TrendingUp, User, Building2, Calendar,
  Search, ChevronDown, ChevronUp, Star, AlertCircle, Target, Mail,
  Lightbulb, ArrowRight, ArrowLeft, BarChart3, PieChart, Activity, Zap, Download,
  Users, Phone, MapPin, DollarSign, Ruler, Award, Eye, Filter, Printer
} from 'lucide-react'
import { buscarBriefingCompleto } from '@/services/briefingService'

interface BriefingData {
  id: string
  nomeProjeto: string
  nomeCliente: string
  emailCliente: string
  telefoneCliente: string
  nomeResponsavel: string
  emailResponsavel: string
  briefingTemplate: {
    id: string
    nome: string
    categoria: string
    totalPerguntas: number
  }
  respostas: Record<string, any>
  perguntasERespostas: Array<{
    secao: string
    pergunta: string
    resposta: any
    tipo: string
    importancia: 'alta' | 'media' | 'baixa'
  }>
  metadados: {
    totalRespostas: number
    progresso: number
    tempoGasto: number
    dataInicio: string
    dataFim: string
    tempoRealFormatado: string
  }
  createdAt: string
}

export default function BriefingDashboard() {
  const params = useParams()
  const router = useRouter()
  const [briefingData, setBriefingData] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [exportingPDF, setExportingPDF] = useState(false)
  
  // Integrar timer para tempo real
  const { timer, obterEstatisticas } = useBriefingTimer(params.id as string)

  useEffect(() => {
    loadBriefingData()
  }, [params.id])

  const loadBriefingData = async () => {
    try {
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`http://localhost:3001/api/briefings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const briefingRaw = data.briefing
        
        // Processar observações
        let respostas = {}
        let metadados = {}
        let template = {}
        
        if (briefingRaw.observacoes) {
          try {
            const observacoesParsed = JSON.parse(briefingRaw.observacoes)
            respostas = observacoesParsed.respostas || {}
            metadados = observacoesParsed.metadados || {}
            template = observacoesParsed.template || {}
          } catch (parseError) {
            console.error('Erro ao parsear observações:', parseError)
          }
        }

        // Buscar dados REAIS do cliente
        let dadosCliente = { nome: 'Cliente não identificado', email: 'Não informado', telefone: 'Não informado' }
        if (briefingRaw.cliente_id) {
          try {
            console.log('🔍 Buscando dados do cliente ID:', briefingRaw.cliente_id)
            const clienteResponse = await fetch(`http://localhost:3001/api/clientes/${briefingRaw.cliente_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log('📡 Response status cliente:', clienteResponse.status)
            
            if (clienteResponse.ok) {
              const clienteData = await clienteResponse.json()
              console.log('✅ Dados do cliente recebidos:', clienteData)
              dadosCliente = {
                nome: clienteData.cliente?.nome || clienteData.nome || 'Cliente não identificado',
                email: clienteData.cliente?.email || clienteData.email || 'Não informado',
                telefone: clienteData.cliente?.telefone || clienteData.telefone || 'Não informado'
              }
            } else {
              console.log('❌ Erro na resposta do cliente:', await clienteResponse.text())
            }
          } catch (error) {
            console.error('❌ Erro ao buscar cliente:', error)
          }
        }

        // Buscar dados REAIS do responsável
        let dadosResponsavel = { nome: 'Responsável não identificado', email: 'Não informado' }
        if (briefingRaw.responsavel_id) {
          try {
            console.log('🔍 Buscando dados do responsável ID:', briefingRaw.responsavel_id)
            const responsavelResponse = await fetch(`http://localhost:3001/api/users/${briefingRaw.responsavel_id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log('📡 Response status responsável:', responsavelResponse.status)
            
            if (responsavelResponse.ok) {
              const responsavelData = await responsavelResponse.json()
              console.log('✅ Dados do responsável recebidos:', responsavelData)
              dadosResponsavel = {
                nome: responsavelData.user?.name || responsavelData.name || responsavelData.nome || 'Responsável não identificado',
                email: responsavelData.user?.email || responsavelData.email || 'Não informado'
              }
            } else {
              console.log('❌ Erro na resposta do responsável:', await responsavelResponse.text())
            }
          } catch (error) {
            console.error('❌ Erro ao buscar responsável:', error)
          }
        }

        // Calcular tempo REAL do briefing
        const dataInicio = new Date((metadados as any).dataInicio || briefingRaw.created_at)
        const dataFim = new Date((metadados as any).dataFim || briefingRaw.updated_at || briefingRaw.created_at)
        const tempoRealMs = dataFim.getTime() - dataInicio.getTime()
        const tempoRealSegundos = Math.floor(tempoRealMs / 1000)
        const tempoRealMinutos = Math.floor(tempoRealSegundos / 60)
        const tempoRealHoras = Math.floor(tempoRealMinutos / 60)
        const minutosRestantes = tempoRealMinutos % 60
        const segundosRestantes = tempoRealSegundos % 60
        
        const tempoRealFormatado = tempoRealHoras > 0 
          ? `${tempoRealHoras}h ${minutosRestantes}min`
          : tempoRealMinutos > 0 
            ? `${tempoRealMinutos}min ${segundosRestantes}s`
            : `${segundosRestantes}s`

        // Organizar perguntas e respostas por seções
        const perguntasERespostas = organizarPerguntasERespostas(respostas, briefingRaw)

        const processedData: BriefingData = {
          id: briefingRaw.id,
          nomeProjeto: briefingRaw.nomeProjeto || briefingRaw.nome_projeto || 'Projeto sem nome',
          nomeCliente: dadosCliente.nome,
          emailCliente: dadosCliente.email,
          telefoneCliente: dadosCliente.telefone,
          nomeResponsavel: dadosResponsavel.nome,
          emailResponsavel: dadosResponsavel.email,
          briefingTemplate: {
            id: (template as any).id || 'template-1',
            nome: (template as any).nome || 'Briefing Personalizado',
            categoria: (template as any).categoria || 'Geral',
            totalPerguntas: (template as any).totalPerguntas || Object.keys(respostas).length || 0
          },
          respostas,
          perguntasERespostas,
          metadados: {
            totalRespostas: Object.keys(respostas).length,
            progresso: briefingRaw.progresso || 100,
            tempoGasto: tempoRealMinutos,
            dataInicio: (metadados as any).dataInicio || briefingRaw.created_at,
            dataFim: (metadados as any).dataFim || briefingRaw.updated_at || briefingRaw.created_at,
            tempoRealFormatado
          },
          createdAt: briefingRaw.created_at
        }

        setBriefingData(processedData)
      } else if (response.status === 401) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Erro ao carregar briefing:', error)
    } finally {
      setLoading(false)
    }
  }

  const organizarPerguntasERespostas = (respostas: Record<string, any>, briefingRaw?: any) => {
    const perguntasERespostas: Array<{
      secao: string
      pergunta: string
      resposta: any
      tipo: string
      importancia: 'alta' | 'media' | 'baixa'
    }> = []
    
    // NOVO SISTEMA: Verificar se existe estrutura completa do briefing
    if (briefingRaw?.estrutura_briefing) {
      console.log('📋 Usando estrutura completa do briefing')
      
      // Processar seções e perguntas da estrutura completa
      briefingRaw.estrutura_briefing.secoes?.forEach((secao: any) => {
        secao.perguntas?.forEach((perguntaObj: any) => {
          const perguntaTexto = perguntaObj.pergunta_personalizada || perguntaObj.pergunta_original
          const resposta = perguntaObj.resposta || 'Não respondida'
          
          perguntasERespostas.push({
            secao: secao.nome_secao || secao.nome,
            pergunta: perguntaTexto,
            resposta: resposta,
            tipo: perguntaObj.tipo || 'text',
            importancia: perguntaObj.importancia || 'media'
          })
        })
      })
      
      console.log('📋 Perguntas e respostas organizadas:', perguntasERespostas)
    } else {
      console.log('📋 Usando método fallback - analisando respostas')
      
      // MÉTODO FALLBACK: Para compatibilidade com dados existentes
      // Tentar extrair perguntas do campo observacoes se existir
      let perguntasOriginais: Record<string, any> = {}
      
      if (briefingRaw?.observacoes) {
        try {
          const observacoesParsed = JSON.parse(briefingRaw.observacoes)
          perguntasOriginais = observacoesParsed.perguntas_originais || {}
        } catch (e) {
          console.warn('Erro ao parsear observações:', e)
        }
      }
      
      // Processar respostas existentes
      Object.entries(respostas).forEach(([chave, resposta]) => {
        // Tentar encontrar a pergunta original
        const perguntaOriginal = perguntasOriginais[chave] || chave
        
        let secao = '📋 Informações Gerais'
        let importancia: 'alta' | 'media' | 'baixa' = 'media'
        
        // Melhorar categorização com mais palavras-chave
        const perguntaLower = perguntaOriginal.toLowerCase()
        
        if (perguntaLower.includes('área') || perguntaLower.includes('metro') || perguntaLower.includes('tamanho') || perguntaLower.includes('dimensão') || perguntaLower.includes('espaço') || perguntaLower.includes('terreno')) {
          secao = '📐 Dimensões e Áreas'
          importancia = 'alta'
        } else if (perguntaLower.includes('orçamento') || perguntaLower.includes('custo') || perguntaLower.includes('preço') || perguntaLower.includes('valor') || perguntaLower.includes('investimento') || perguntaLower.includes('financeiro')) {
          secao = '💰 Orçamento e Custos'
          importancia = 'alta'
        } else if (perguntaLower.includes('prazo') || perguntaLower.includes('tempo') || perguntaLower.includes('cronograma') || perguntaLower.includes('entrega') || perguntaLower.includes('data') || perguntaLower.includes('mês')) {
          secao = '⏰ Prazos e Cronograma'
          importancia = 'alta'
        } else if (perguntaLower.includes('material') || perguntaLower.includes('acabamento') || perguntaLower.includes('revestimento') || perguntaLower.includes('piso') || perguntaLower.includes('parede')) {
          secao = '🏗️ Materiais e Acabamentos'
          importancia = 'media'
        } else if (perguntaLower.includes('sustentabilidade') || perguntaLower.includes('sustentável') || perguntaLower.includes('ambiental') || perguntaLower.includes('verde') || perguntaLower.includes('energia')) {
          secao = '🌱 Sustentabilidade'
          importancia = 'media'
        } else if (perguntaLower.includes('tecnologia') || perguntaLower.includes('automação') || perguntaLower.includes('smart') || perguntaLower.includes('digital') || perguntaLower.includes('app')) {
          secao = '🔧 Tecnologia e Automação'
          importancia = 'media'
        } else if (perguntaLower.includes('estilo') || perguntaLower.includes('design') || perguntaLower.includes('estética') || perguntaLower.includes('decoração') || perguntaLower.includes('cor')) {
          secao = '🎨 Design e Estética'
          importancia = 'media'
        } else if (perguntaLower.includes('instalação') || perguntaLower.includes('elétrica') || perguntaLower.includes('hidráulica') || perguntaLower.includes('água') || perguntaLower.includes('luz')) {
          secao = '⚡ Instalações'
          importancia = 'alta'
        } else if (perguntaLower.includes('segurança') || perguntaLower.includes('proteção') || perguntaLower.includes('alarme') || perguntaLower.includes('portão') || perguntaLower.includes('cerca')) {
          secao = '🔒 Segurança'
          importancia = 'alta'
        } else if (perguntaLower.includes('acessibilidade') || perguntaLower.includes('mobilidade') || perguntaLower.includes('cadeirante') || perguntaLower.includes('deficiente') || perguntaLower.includes('rampa')) {
          secao = '♿ Acessibilidade'
          importancia = 'alta'
        }

        // Verificar se a resposta está vazia ou muito curta
        const respostaString = typeof resposta === 'string' ? resposta : String(resposta)
        if (!respostaString || respostaString.length < 3) {
          importancia = 'baixa'
        }

        perguntasERespostas.push({
          secao,
          pergunta: perguntaOriginal,
          resposta,
          tipo: typeof resposta,
          importancia
        })
      })
    }
    
    // Ordenar por importância e seção
    return perguntasERespostas.sort((a, b) => {
      const importanciaOrder = { 'alta': 0, 'media': 1, 'baixa': 2 }
      const importanciaA = importanciaOrder[a.importancia]
      const importanciaB = importanciaOrder[b.importancia]
      
      if (importanciaA !== importanciaB) {
        return importanciaA - importanciaB
      }
      
      return a.secao.localeCompare(b.secao)
    })
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const exportarPDF = async () => {
    if (!briefingData) return
    
    setExportingPDF(true)
    try {
      console.log('🔍 Iniciando exportação PDF para:', briefingData.id)
      
      const response = await fetch('http://localhost:3001/api/briefings/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`
        },
        body: JSON.stringify({
          briefingData: briefingData,
          perguntasERespostas: secoesPerguntasRespostas
        })
      })
      
      console.log('📡 Response status PDF:', response.status)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `briefing-${briefingData.nomeProjeto.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        console.log('✅ PDF exportado com sucesso!')
      } else {
        throw new Error('Erro ao gerar PDF')
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Tente novamente.')
    } finally {
      setExportingPDF(false)
    }
  }

  const enviarPorEmail = async () => {
    if (!briefingData) return
    
    try {
      const response = await fetch('/api/briefings/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('arcflow_auth_token')}`
        },
        body: JSON.stringify({
          briefingId: briefingData.id,
          briefingData: briefingData,
          emailCliente: briefingData.emailCliente,
          emailResponsavel: briefingData.emailResponsavel
        })
      })
      
      if (response.ok) {
        alert('Email enviado com sucesso!')
      } else {
        throw new Error('Erro ao enviar email')
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      alert('Erro ao enviar email. Tente novamente.')
    }
  }

  const calcularQualidadeBriefing = () => {
    if (!briefingData) return 0
    
    const totalPerguntas = briefingData.briefingTemplate.totalPerguntas || briefingData.metadados.totalRespostas
    const respostasCompletas = Object.values(briefingData.respostas).filter(r => 
      r && r !== '' && r !== 'Não especificado' && r !== 'Não informado' && r !== 'N/A'
    ).length
    
    return Math.round((respostasCompletas / totalPerguntas) * 100)
  }

  const agruparPorSecao = () => {
    if (!briefingData) return {}
    
    const grupos: Record<string, Array<{pergunta: string, resposta: any, tipo: string, importancia: string}>> = {}
    
    briefingData.perguntasERespostas.forEach(item => {
      if (!grupos[item.secao]) {
        grupos[item.secao] = []
      }
      grupos[item.secao].push(item)
    })
    
    return grupos
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard do briefing...</p>
        </div>
      </div>
    )
  }

  if (!briefingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Briefing não encontrado</p>
          <Button onClick={() => router.push('/briefing')} className="mt-4">
            Voltar para Briefings
          </Button>
        </div>
      </div>
    )
  }

  const secoesPerguntasRespostas = agruparPorSecao()
  const qualidadeBriefing = calcularQualidadeBriefing()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Elegante e Minimalista */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Dashboard do Briefing</h1>
                  <p className="text-sm text-gray-600">{briefingData.nomeProjeto}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {briefingData.metadados.tempoRealFormatado}
                </span>
              </div>
              
              <Button 
                onClick={exportarPDF}
                disabled={exportingPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              >
                {exportingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => router.push('/briefing')} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm font-medium rounded-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Métricas Elegantes e Minimalistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Card 1 - Respostas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {Math.round((briefingData.metadados.totalRespostas / briefingData.briefingTemplate.totalPerguntas) * 100)}%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Total de Respostas</p>
              <p className="text-2xl font-bold text-gray-900">{briefingData.metadados.totalRespostas}</p>
              <p className="text-xs text-gray-500">de {briefingData.briefingTemplate.totalPerguntas} perguntas</p>
            </div>
          </div>

          {/* Card 2 - Completude */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                Completo
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Completude</p>
                <p className="text-2xl font-bold text-gray-900">{briefingData.metadados.progresso}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${briefingData.metadados.progresso}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Card 3 - Tempo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Tempo de Preenchimento</p>
              <p className="text-2xl font-bold text-gray-900">
                {timer?.tempoFormatado || briefingData.metadados.tempoRealFormatado}
              </p>
              <p className="text-xs text-gray-500">
                {timer ? 'Em tempo real' : 'Total gasto'}
              </p>
            </div>
          </div>

          {/* Card 4 - Qualidade */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(qualidadeBriefing / 20) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Qualidade das Respostas</p>
              <p className="text-2xl font-bold text-gray-900">{qualidadeBriefing}%</p>
              <p className="text-xs text-gray-500">Score geral</p>
            </div>
          </div>

          {/* Card 5 - Seções */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                {Object.keys(secoesPerguntasRespostas).length}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Seções Organizadas</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(secoesPerguntasRespostas).length}</p>
              <p className="text-xs text-gray-500">Categorias disponíveis</p>
            </div>
          </div>
        </div>

        {/* Tabs Elegantes e Minimalistas */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-lg p-1 h-12">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger 
              value="responses" 
              className="flex items-center space-x-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Perguntas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center space-x-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Análise</span>
            </TabsTrigger>
            <TabsTrigger 
              value="client" 
              className="flex items-center space-x-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Cliente</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="flex items-center space-x-2 rounded-md text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Informações do Projeto - Design Elegante */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Informações do Projeto</h3>
                      <p className="text-sm text-gray-600">Detalhes e configurações</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Nome do Projeto</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-xs truncate">{briefingData.nomeProjeto}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Categoria</span>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {briefingData.briefingTemplate.categoria}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Template</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 text-right max-w-xs truncate">{briefingData.briefingTemplate.nome}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Status</span>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Timeline do Projeto</h3>
                      <p className="text-sm text-gray-600">Cronologia e marcos</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Data de Início</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(briefingData.metadados.dataInicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Data de Conclusão</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(briefingData.metadados.dataFim).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Tempo Total</span>
                    </div>
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                      {briefingData.metadados.tempoRealFormatado}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Criado em</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(briefingData.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo por Seções - Design Elegante */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Resumo por Seções</h3>
                    <p className="text-sm text-gray-600">Distribuição de perguntas e respostas</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(secoesPerguntasRespostas).map(([secao, items], index) => (
                    <div key={secao} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{items.length}</div>
                        <div className="text-sm text-gray-600 font-medium mb-2">{secao}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${(items.length / briefingData.metadados.totalRespostas) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            {/* Busca e Filtros */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Perguntas e Respostas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por pergunta ou resposta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas as Seções</option>
                    {Object.keys(secoesPerguntasRespostas).map(secao => (
                      <option key={secao} value={secao}>{secao}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Perguntas e Respostas por Seções */}
            <div className="space-y-6">
              {Object.entries(secoesPerguntasRespostas)
                .filter(([secao]) => selectedCategory === 'all' || secao === selectedCategory)
                .map(([secao, items]) => (
                <Card key={secao} className="shadow-lg">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(secao)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        {secao} ({items.length})
                      </span>
                      {expandedSections.has(secao) ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </CardTitle>
                  </CardHeader>
                  
                  {expandedSections.has(secao) && (
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {items
                          .filter(({pergunta, resposta}) => 
                            searchTerm === '' || 
                            pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            String(resposta).toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(({pergunta, resposta, importancia}, index) => (
                          <div key={index} className={`border-l-4 pl-6 py-4 rounded-r-lg ${
                            importancia === 'alta' ? 'border-l-red-500 bg-red-50' :
                            importancia === 'media' ? 'border-l-yellow-500 bg-yellow-50' :
                            'border-l-green-500 bg-green-50'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="font-semibold text-gray-900 flex-1">
                                <strong>Pergunta:</strong> {pergunta}
                              </div>
                              <Badge variant="outline" className={`ml-2 ${
                                importancia === 'alta' ? 'border-red-500 text-red-700' :
                                importancia === 'media' ? 'border-yellow-500 text-yellow-700' :
                                'border-green-500 text-green-700'
                              }`}>
                                {importancia === 'alta' ? 'Alta' : importancia === 'media' ? 'Média' : 'Baixa'}
                              </Badge>
                            </div>
                            <div className="text-gray-700 bg-white p-3 rounded border">
                              <strong>Resposta:</strong> {typeof resposta === 'object' ? JSON.stringify(resposta, null, 2) : String(resposta)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Análise Inteligente */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Análise Inteligente do Briefing
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Pontos Fortes
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Briefing completo com {briefingData.metadados.totalRespostas} respostas detalhadas</li>
                      <li>• Informações suficientes para iniciar o projeto</li>
                      <li>• Qualidade das respostas: {qualidadeBriefing}%</li>
                      <li>• Tempo de preenchimento: {briefingData.metadados.tempoRealFormatado}</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Próximos Passos
                    </h4>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• Gerar orçamento detalhado baseado nas respostas</li>
                      <li>• Criar cronograma preliminar do projeto</li>
                      <li>• Agendar reunião de apresentação com o cliente</li>
                      <li>• Desenvolver proposta técnica e comercial</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client" className="space-y-8">
            {/* Cliente e Responsável */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{briefingData.nomeCliente}</div>
                        <div className="text-sm text-gray-600">Nome do Cliente</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{briefingData.emailCliente}</div>
                        <div className="text-sm text-gray-600">Email</div>
                      </div>
                    </div>
                    {briefingData.telefoneCliente && briefingData.telefoneCliente !== 'Não informado' && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Phone className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{briefingData.telefoneCliente}</div>
                          <div className="text-sm text-gray-600">Telefone</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    Responsável pelo Briefing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">{briefingData.nomeResponsavel}</div>
                        <div className="text-sm text-gray-600">Nome do Responsável</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{briefingData.emailResponsavel}</div>
                        <div className="text-sm text-gray-600">Email</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            {/* Exportação */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Opções de Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Exportar PDF Completo</h4>
                    <p className="text-sm text-gray-600">
                      Gera um documento PDF completo com todas as seções, perguntas e respostas, 
                      incluindo espaços para assinatura do cliente e responsável.
                    </p>
                    <Button 
                      onClick={exportarPDF}
                      disabled={exportingPDF}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {exportingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gerando PDF...
                        </>
                      ) : (
                        <>
                          <Printer className="h-4 w-4 mr-2" />
                          Gerar PDF Completo
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Enviar por Email</h4>
                    <p className="text-sm text-gray-600">
                      Envia o PDF automaticamente para o email do cliente e cópia para o responsável.
                    </p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={enviarPorEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar por Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
