'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home, CheckCircle, Clock, FileText, Save, Send } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { briefingService, type BriefingTemplate, type BriefingPergunta } from '@/services/briefingService'

interface ConfiguracaoInicial {
  nomeProjeto: string
  descricao: string
  objetivos: string
  prazo: string
  orcamento: string
  clienteId: string
  responsavelId: string
}

export default function PreencherBriefing() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados
  const [configuracao, setConfiguracao] = useState<ConfiguracaoInicial | null>(null)
  const [briefingIds, setBriefingIds] = useState<string[]>([])
  const [briefingId, setBriefingId] = useState<string | null>(null)
  const [briefings, setBriefings] = useState<BriefingTemplate[]>([])
  const [briefingAtual, setBriefingAtual] = useState<number>(0)
  const [respostas, setRespostas] = useState<Record<string, Record<string, string>>>({})
  const [salvandoAutomatico, setSalvandoAutomatico] = useState(false)
  const [loading, setLoading] = useState(true)

  // Carregar dados da URL
  useEffect(() => {
    const idsParam = searchParams.get('ids')
    const configParam = searchParams.get('config')
    const briefingIdParam = searchParams.get('briefingId')
    
    if (idsParam && configParam) {
      try {
        const ids = JSON.parse(decodeURIComponent(idsParam))
        const config = JSON.parse(decodeURIComponent(configParam))
        setBriefingIds(ids)
        setConfiguracao(config)
        if (briefingIdParam) {
          setBriefingId(briefingIdParam)
        }
        carregarBriefings(ids)
      } catch (error) {
        toast.error('Erro ao carregar dados do briefing')
        router.push('/briefing/novo')
      }
    } else {
      router.push('/briefing/novo')
    }
  }, [searchParams, router])

  // Carregar templates de briefing
  const carregarBriefings = async (ids: string[]) => {
    setLoading(true)
    try {
      // Gerar templates baseados nos IDs selecionados
      const templates: BriefingTemplate[] = ids.map((id, index) => ({
        id: `template_${index}`,
        templateId: id,
        nome: `Briefing ${id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ')}`,
        categoria: id.split('-')[0] || 'geral',
        status: index === 0 ? 'EM_ANDAMENTO' : 'PENDENTE',
        progresso: index === 0 ? 10 : 0,
        perguntas: briefingService.generateTemplateQuestions(id)
      }))
      
      setBriefings(templates)
    } catch (error) {
      toast.error('Erro ao carregar templates de briefing')
    } finally {
      setLoading(false)
    }
  }

  // Atualizar resposta
  const atualizarResposta = (templateId: string, perguntaId: string, valor: string) => {
    setRespostas(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [perguntaId]: valor
      }
    }))

    // Auto-save após 2 segundos
    setTimeout(() => {
      salvarAutomaticamente(templateId)
    }, 2000)
  }

  // Salvar automaticamente
  const salvarAutomaticamente = async (templateId: string) => {
    if (!briefingId) return

    setSalvandoAutomatico(true)
    try {
      await briefingService.saveRespostas(briefingId, respostas)
      
      // Atualizar progresso
      const template = briefings.find(b => b.id === templateId)
      if (template) {
        const respostasTemplate = respostas[templateId] || {}
        const totalPerguntas = template.perguntas?.length || 0
        const perguntasRespondidas = Object.keys(respostasTemplate).length
        const novoProgresso = totalPerguntas > 0 ? Math.round((perguntasRespondidas / totalPerguntas) * 100) : 0
        
        setBriefings(prev => prev.map(b => 
          b.id === templateId 
            ? { ...b, progresso: novoProgresso, status: novoProgresso > 0 ? 'EM_ANDAMENTO' : 'PENDENTE' }
            : b
        ))
      }
    } catch (error: any) {
      console.error('Erro no auto-save:', error)
      toast.error('Erro ao salvar automaticamente')
    } finally {
      setSalvandoAutomatico(false)
    }
  }

  // Finalizar briefing atual
  const finalizarBriefingAtual = async () => {
    const template = briefings[briefingAtual]
    const respostasTemplate = respostas[template.id] || {}
    const perguntasObrigatorias = template.perguntas?.filter(p => p.obrigatoria) || []
    const perguntasRespondidas = perguntasObrigatorias.filter(p => respostasTemplate[p.id])
    
    if (perguntasRespondidas.length < perguntasObrigatorias.length) {
      toast.error('Preencha todas as perguntas obrigatórias')
      return
    }

    // Salvar respostas antes de finalizar
    if (briefingId) {
      try {
        await briefingService.saveRespostas(briefingId, respostas)
      } catch (error: any) {
        toast.error('Erro ao salvar respostas')
        return
      }
    }

    // Marcar como concluído
    setBriefings(prev => prev.map(b => 
      b.id === template.id 
        ? { ...b, status: 'CONCLUIDO', progresso: 100 }
        : b
    ))

    // Ir para próximo briefing ou finalizar
    if (briefingAtual < briefings.length - 1) {
      setBriefingAtual(prev => prev + 1)
      toast.success('Briefing concluído! Avançando para o próximo.')
    } else {
      finalizarTodosBriefings()
    }
  }

  // Finalizar todos os briefings
  const finalizarTodosBriefings = async () => {
    if (!briefingId) {
      toast.error('ID do briefing não encontrado')
      return
    }

    try {
      // Atualizar status do briefing principal
      await briefingService.updateBriefing(briefingId, {
        status: 'CONCLUIDO'
      })
      
      toast.success('Todos os briefings foram concluídos com sucesso!')
      router.push('/briefing')
    } catch (error: any) {
      toast.error('Erro ao finalizar briefings: ' + error.message)
    }
  }

  // Renderizar campo de pergunta
  const renderizarCampoPergunta = (pergunta: BriefingPergunta, templateId: string) => {
    const valor = respostas[templateId]?.[pergunta.id] || ''
    
    switch (pergunta.tipo) {
      case 'TEXTO':
        return (
          <Input
            value={valor}
            onChange={(e) => atualizarResposta(templateId, pergunta.id, e.target.value)}
            placeholder="Digite sua resposta..."
          />
        )
      
      case 'TEXTAREA':
        return (
          <Textarea
            value={valor}
            onChange={(e) => atualizarResposta(templateId, pergunta.id, e.target.value)}
            placeholder="Digite sua resposta..."
            rows={4}
          />
        )
      
      case 'NUMERO':
        return (
          <Input
            type="number"
            value={valor}
            onChange={(e) => atualizarResposta(templateId, pergunta.id, e.target.value)}
            placeholder="Digite um número..."
          />
        )
      
      case 'MULTIPLA_ESCOLHA':
        return (
          <div className="grid grid-cols-2 gap-2">
            {pergunta.opcoes?.map((opcao) => (
              <button
                key={opcao}
                onClick={() => atualizarResposta(templateId, pergunta.id, opcao)}
                className={`p-3 text-left rounded-lg border transition-all ${
                  valor === opcao
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>
        )
      
      case 'DATA':
        return (
          <Input
            type="date"
            value={valor}
            onChange={(e) => atualizarResposta(templateId, pergunta.id, e.target.value)}
          />
        )
      
      default:
        return (
          <Input
            value={valor}
            onChange={(e) => atualizarResposta(templateId, pergunta.id, e.target.value)}
            placeholder="Digite sua resposta..."
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <h3 className="text-lg font-semibold">Carregando briefings...</h3>
              <p className="text-gray-600">Preparando templates personalizados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const briefingAtualData = briefings[briefingAtual]
  const progressoGeral = Math.round(briefings.reduce((acc, b) => acc + b.progresso, 0) / briefings.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 bg-white border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              href="/briefing/novo"
              className="p-2 rounded-lg transition-all text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {configuracao?.nomeProjeto || 'Preenchimento de Briefing'}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Briefing {briefingAtual + 1} de {briefings.length}</span>
                <span>•</span>
                <span>{briefingAtualData?.nome}</span>
                {salvandoAutomatico && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">Salvando...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right text-sm">
              <div className="font-medium">{progressoGeral}% Concluído</div>
              <Progress value={progressoGeral} className="w-24" />
            </div>
            <Link 
              href="/dashboard"
              className="p-2 rounded-lg transition-all text-gray-600 hover:bg-gray-100"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Lista de Briefings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Briefings</CardTitle>
                <CardDescription>
                  Progresso geral: {progressoGeral}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {briefings.map((briefing, index) => (
                  <button
                    key={briefing.id}
                    onClick={() => setBriefingAtual(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      index === briefingAtual
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{briefing.nome}</span>
                      {briefing.status === 'CONCLUIDO' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {briefing.status === 'EM_ANDAMENTO' && (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={briefing.progresso} className="flex-1 h-1" />
                      <span className="text-xs text-gray-500">{briefing.progresso}%</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal - Formulário */}
          <div className="lg:col-span-3">
            <motion.div
              key={briefingAtual}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {briefingAtualData?.nome}
                      </CardTitle>
                      <CardDescription>
                        Categoria: {briefingAtualData?.categoria}
                      </CardDescription>
                    </div>
                    <Badge variant={briefingAtualData?.status === 'CONCLUIDO' ? 'default' : 'secondary'}>
                      {briefingService.getBriefingStatusLabel(briefingAtualData?.status || '')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {briefingAtualData?.perguntas?.map((pergunta) => (
                    <div key={pergunta.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {pergunta.titulo}
                        {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {pergunta.descricao && (
                        <p className="text-sm text-gray-500">{pergunta.descricao}</p>
                      )}

                      {renderizarCampoPergunta(pergunta, briefingAtualData.id)}
                    </div>
                  ))}

                  {/* Botões de Ação */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setBriefingAtual(Math.max(0, briefingAtual - 1))}
                      disabled={briefingAtual === 0}
                    >
                      Anterior
                    </Button>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => salvarAutomaticamente(briefingAtualData.id)}
                        disabled={salvandoAutomatico}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>

                      <Button
                        onClick={finalizarBriefingAtual}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {briefingAtual === briefings.length - 1 ? (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Finalizar Todos
                          </>
                        ) : (
                          'Próximo Briefing'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 