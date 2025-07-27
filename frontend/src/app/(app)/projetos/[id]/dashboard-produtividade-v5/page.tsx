'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, Pause, Square, Clock, MessageSquare, Users, AlertTriangle,
  ChevronDown, ChevronRight, Plus, Edit3, Trash2, Check, X,
  Filter, Search, Calendar, Target, Zap, Eye, EyeOff,
  MoreHorizontal, Bell, Star, Flag, Archive, Send
} from 'lucide-react'

// Interfaces TypeScript
interface Cronometro {
  id: string
  tarefaId: string
  tempoInicial: number
  tempoAtual: number
  ativo: boolean
  pausado: boolean
  sessoes: SessaoCronometro[]
}

interface SessaoCronometro {
  id: string
  inicio: Date
  fim?: Date
  duracao: number
  anotacoes: string
  produtividade: 'baixa' | 'media' | 'alta'
}

interface Tarefa {
  id: string
  etapaId: string
  titulo: string
  descricao: string
  status: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  responsavel: string
  colaboradores: string[]
  tempoEstimado: number
  tempoGasto: number
  prazo: Date
  cronometros: Cronometro[]
  comentarios: Comentario[]
  arquivos: string[]
  dependencias: string[]
  tags: string[]
}

interface Etapa {
  id: string
  projetoId: string
  titulo: string
  descricao: string
  status: 'nao_iniciada' | 'em_andamento' | 'concluida'
  ordem: number
  tarefas: Tarefa[]
  prazo: Date
  responsavel: string
}

interface Projeto {
  id: string
  titulo: string
  cliente: string
  tipologia: string
  status: 'planejamento' | 'execucao' | 'revisao' | 'entregue'
  progresso: number
  etapas: Etapa[]
  equipe: Membro[]
  prazoFinal: Date
  orcamento: number
}

interface Membro {
  id: string
  nome: string
  avatar: string
  role: string
  online: boolean
}

interface Comentario {
  id: string
  autor: string
  avatar: string
  conteudo: string
  timestamp: Date
  mencoes: string[]
  anexos: string[]
}

interface Notificacao {
  id: string
  tipo: 'atraso' | 'prazo_proximo' | 'revisao' | 'mencao' | 'aprovacao'
  titulo: string
  descricao: string
  timestamp: Date
  lida: boolean
  link: string
}

export default function DashboardProdutividadeV5() {
  // Estados principais
  const [projeto, setProjeto] = useState<Projeto>(mockProjeto)
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null)
  const [cronometroAtivo, setCronometroAtivo] = useState<string | null>(null)
  const [modoFoco, setModoFoco] = useState(false)
  const [chatAberto, setChatAberto] = useState(false)
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false)
  const [filtros, setFiltros] = useState({
    status: 'todos',
    prioridade: 'todas',
    responsavel: 'todos'
  })
  const [etapasExpandidas, setEtapasExpandidas] = useState<string[]>([])
  const [anotacaoSessao, setAnotacaoSessao] = useState('')
  const [mensagemChat, setMensagemChat] = useState('')
  
  // Estados de tempo
  const [tempoAtual, setTempoAtual] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Efeito para cronômetro
  useEffect(() => {
    if (cronometroAtivo) {
      intervalRef.current = setInterval(() => {
        setTempoAtual(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [cronometroAtivo])

  // Funções de cronômetro
  const iniciarCronometro = (tarefaId: string) => {
    setTarefaAtiva(tarefaId)
    setCronometroAtivo(`cronometro-${tarefaId}`)
    setTempoAtual(0)
  }

  const pausarCronometro = () => {
    setCronometroAtivo(null)
  }

  const pararCronometro = () => {
    setCronometroAtivo(null)
    setTarefaAtiva(null)
    setTempoAtual(0)
    setAnotacaoSessao('')
  }

  const salvarSessao = () => {
    if (tarefaAtiva && tempoAtual > 0) {
      // Lógica para salvar sessão
      console.log('Sessão salva:', {
        tarefaId: tarefaAtiva,
        duracao: tempoAtual,
        anotacoes: anotacaoSessao
      })
      pararCronometro()
    }
  }

  // Função para formatar tempo
  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  // Função para expandir/colapsar etapas
  const toggleEtapa = (etapaId: string) => {
    setEtapasExpandidas(prev => 
      prev.includes(etapaId) 
        ? prev.filter(id => id !== etapaId)
        : [...prev, etapaId]
    )
  }

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    const cores = {
      pendente: 'bg-gray-100 text-gray-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      em_revisao: 'bg-yellow-100 text-yellow-800',
      concluida: 'bg-green-100 text-green-800'
    }
    return cores[status as keyof typeof cores] || cores.pendente
  }

  // Função para obter cor da prioridade
  const getPriorityColor = (prioridade: string) => {
    const cores = {
      baixa: 'bg-green-500',
      media: 'bg-yellow-500',
      alta: 'bg-orange-500',
      urgente: 'bg-red-500'
    }
    return cores[prioridade as keyof typeof cores] || cores.baixa
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Compacto */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{projeto.titulo}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {projeto.status}
            </span>
            <span className="text-sm text-gray-500">
              {projeto.progresso}% concluído
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filtros */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({...prev, status: e.target.value}))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="todos">Todos Status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="em_revisao">Em Revisão</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>

            {/* Notificações */}
            <button
              onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
              className="relative p-2 text-gray-400 hover:text-gray-600"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Chat */}
            <button
              onClick={() => setChatAberto(!chatAberto)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Modo Foco */}
            <button
              onClick={() => setModoFoco(!modoFoco)}
              className={`p-2 rounded ${modoFoco ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {modoFoco ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Área Principal - Hierarquia de Projetos */}
        <div className={`flex-1 overflow-y-auto p-6 ${modoFoco ? 'opacity-50' : ''}`}>
          <div className="space-y-6">
            {projeto.etapas.map((etapa) => (
              <motion.div
                key={etapa.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Header da Etapa */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleEtapa(etapa.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {etapasExpandidas.includes(etapa.id) ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">{etapa.titulo}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(etapa.status)}`}>
                        {etapa.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {etapa.tarefas.filter(t => t.status === 'concluida').length}/{etapa.tarefas.length} tarefas
                      </span>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tarefas da Etapa */}
                <AnimatePresence>
                  {etapasExpandidas.includes(etapa.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {etapa.tarefas.map((tarefa) => (
                          <motion.div
                            key={tarefa.id}
                            className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${
                              tarefaAtiva === tarefa.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(tarefa.prioridade)}`}></div>
                                  <h4 className="font-medium text-gray-900">{tarefa.titulo}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tarefa.status)}`}>
                                    {tarefa.status.replace('_', ' ')}
                                  </span>
                                  {tarefa.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{tarefa.descricao}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>Estimado: {Math.floor(tarefa.tempoEstimado / 60)}h</span>
                                  <span>Gasto: {Math.floor(tarefa.tempoGasto / 60)}h</span>
                                  <span>Prazo: {new Date(tarefa.prazo).toLocaleDateString()}</span>
                                  <span>{tarefa.responsavel}</span>
                                </div>
                              </div>

                              {/* Controles de Cronômetro */}
                              <div className="flex items-center space-x-2">
                                {tarefaAtiva === tarefa.id && cronometroAtivo ? (
                                  <>
                                    <span className="text-lg font-mono font-bold text-blue-600">
                                      {formatarTempo(tempoAtual)}
                                    </span>
                                    <button
                                      onClick={pausarCronometro}
                                      className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                      <Pause className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={pararCronometro}
                                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      <Square className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => iniciarCronometro(tarefa.id)}
                                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    <Play className="w-4 h-4" />
                                  </button>
                                )}
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Painel Lateral Direito - Comunicação e Status */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Abas */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setChatAberto(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                chatAberto ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
            >
              Chat da Equipe
            </button>
            <button
              onClick={() => setChatAberto(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                !chatAberto ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
              }`}
            >
              Status & Alertas
            </button>
          </div>

          {/* Conteúdo do Painel */}
          <div className="flex-1 overflow-y-auto">
            {chatAberto ? (
              /* Chat da Equipe */
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 space-y-4">
                  {mockComentarios.map((comentario) => (
                    <div key={comentario.id} className="flex space-x-3">
                      <img
                        src={comentario.avatar}
                        alt={comentario.autor}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comentario.autor}</span>
                            <span className="text-xs text-gray-500">
                              {comentario.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800">{comentario.conteudo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Input de Mensagem */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={mensagemChat}
                      onChange={(e) => setMensagemChat(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Status & Alertas */
              <div className="p-4 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium text-red-800">Tarefas Atrasadas</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-red-700">
                      • Aprovação de plantas - 2 dias de atraso
                    </div>
                    <div className="text-sm text-red-700">
                      • Revisão estrutural - 1 dia de atraso
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-medium text-yellow-800">Próximas do Prazo</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-yellow-700">
                      • Detalhamento hidráulico - vence em 2 dias
                    </div>
                    <div className="text-sm text-yellow-700">
                      • Memorial descritivo - vence em 3 dias
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium text-blue-800">Equipe Online</h4>
                  </div>
                  <div className="space-y-2">
                    {projeto.equipe.filter(m => m.online).map(membro => (
                      <div key={membro.id} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-700">{membro.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cronômetro Flutuante */}
      <AnimatePresence>
        {cronometroAtivo && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Cronômetro Ativo</h4>
              <button
                onClick={pararCronometro}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-mono font-bold text-blue-600">
                {formatarTempo(tempoAtual)}
              </div>
              <div className="text-sm text-gray-600">
                {projeto.etapas
                  .flatMap(e => e.tarefas)
                  .find(t => t.id === tarefaAtiva)?.titulo}
              </div>
            </div>

            <textarea
              value={anotacaoSessao}
              onChange={(e) => setAnotacaoSessao(e.target.value)}
              placeholder="Anotações da sessão..."
              className="w-full p-2 border border-gray-300 rounded text-sm mb-3"
              rows={2}
            />

            <div className="flex space-x-2">
              <button
                onClick={cronometroAtivo ? pausarCronometro : () => setCronometroAtivo(`cronometro-${tarefaAtiva}`)}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium ${
                  cronometroAtivo 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {cronometroAtivo ? 'Pausar' : 'Retomar'}
              </button>
              <button
                onClick={salvarSessao}
                className="flex-1 py-2 px-3 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
              >
                Salvar Sessão
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de Modo Foco */}
      <AnimatePresence>
        {modoFoco && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-8 max-w-md text-center">
              <Zap className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modo Foco Ativado</h3>
              <p className="text-gray-600 mb-6">
                Concentre-se na tarefa atual. Distrações minimizadas.
              </p>
              <button
                onClick={() => setModoFoco(false)}
                className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Sair do Modo Foco
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Dados Mock
const mockProjeto: Projeto = {
  id: '1',
  titulo: 'Edifício Comercial Aurora',
  cliente: 'Construtora Inovação Ltda',
  tipologia: 'Comercial',
  status: 'execucao',
  progresso: 65,
  prazoFinal: new Date('2024-06-30'),
  orcamento: 2500000,
  equipe: [
    { id: '1', nome: 'Ana Silva', avatar: '/avatars/ana.jpg', role: 'Arquiteta', online: true },
    { id: '2', nome: 'Carlos Santos', avatar: '/avatars/carlos.jpg', role: 'Engenheiro', online: true },
    { id: '3', nome: 'Maria Costa', avatar: '/avatars/maria.jpg', role: 'Designer', online: false }
  ],
  etapas: [
    {
      id: 'etapa-1',
      projetoId: '1',
      titulo: 'Projeto Arquitetônico',
      descricao: 'Desenvolvimento do projeto arquitetônico completo',
      status: 'em_andamento',
      ordem: 1,
      prazo: new Date('2024-04-15'),
      responsavel: 'Ana Silva',
      tarefas: [
        {
          id: 'tarefa-1',
          etapaId: 'etapa-1',
          titulo: 'Estudo Preliminar',
          descricao: 'Desenvolvimento do estudo preliminar do projeto',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Ana Silva',
          colaboradores: ['Carlos Santos'],
          tempoEstimado: 14400, // 4 horas
          tempoGasto: 16200, // 4.5 horas
          prazo: new Date('2024-03-20'),
          cronometros: [],
          comentarios: [],
          arquivos: ['estudo-preliminar.dwg'],
          dependencias: [],
          tags: ['arquitetura', 'preliminar']
        },
        {
          id: 'tarefa-2',
          etapaId: 'etapa-1',
          titulo: 'Anteprojeto',
          descricao: 'Desenvolvimento do anteprojeto arquitetônico',
          status: 'em_andamento',
          prioridade: 'alta',
          responsavel: 'Ana Silva',
          colaboradores: ['Maria Costa'],
          tempoEstimado: 28800, // 8 horas
          tempoGasto: 18000, // 5 horas
          prazo: new Date('2024-04-05'),
          cronometros: [],
          comentarios: [],
          arquivos: ['anteprojeto-v1.dwg'],
          dependencias: ['tarefa-1'],
          tags: ['arquitetura', 'anteprojeto']
        }
      ]
    },
    {
      id: 'etapa-2',
      projetoId: '1',
      titulo: 'Projeto Estrutural',
      descricao: 'Desenvolvimento do projeto estrutural',
      status: 'nao_iniciada',
      ordem: 2,
      prazo: new Date('2024-05-15'),
      responsavel: 'Carlos Santos',
      tarefas: [
        {
          id: 'tarefa-3',
          etapaId: 'etapa-2',
          titulo: 'Análise Estrutural',
          descricao: 'Análise e dimensionamento da estrutura',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'Carlos Santos',
          colaboradores: [],
          tempoEstimado: 36000, // 10 horas
          tempoGasto: 0,
          prazo: new Date('2024-04-25'),
          cronometros: [],
          comentarios: [],
          arquivos: [],
          dependencias: ['tarefa-2'],
          tags: ['estrutural', 'calculo']
        }
      ]
    }
  ]
}

const mockComentarios: Comentario[] = [
  {
    id: '1',
    autor: 'Ana Silva',
    avatar: '/avatars/ana.jpg',
    conteudo: 'Finalizei o estudo preliminar. Podem revisar?',
    timestamp: new Date('2024-03-20T10:30:00'),
    mencoes: [],
    anexos: []
  },
  {
    id: '2',
    autor: 'Carlos Santos',
    avatar: '/avatars/carlos.jpg',
    conteudo: '@Ana Silva Revisado! Algumas observações no arquivo.',
    timestamp: new Date('2024-03-20T14:15:00'),
    mencoes: ['Ana Silva'],
    anexos: ['observacoes.pdf']
  }
] 