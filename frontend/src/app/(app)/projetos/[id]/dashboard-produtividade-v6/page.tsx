'use client';

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, Play, Pause, Square, CheckCircle2, AlertTriangle, Clock,
  Users, MessageSquare, Bell, Settings, Eye, EyeOff, Plus, Edit3,
  List, Calendar, Columns, Upload, Send, Trash2, GripVertical,
  MoreHorizontal, User, ChevronDown, ChevronRight, Focus, FileText,
  Paperclip, Target, Search, Filter, Home, ArrowRight, Timer,
  Zap, TrendingUp, Activity, Save, ChevronUp, PanelRightClose,
  PanelRightOpen, Workflow, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces baseadas na especificação
interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  tempo_sessao_atual: number;
  cronometro_ativo: boolean;
  data_inicio?: string;
  data_conclusao?: string;
  requer_aprovacao: boolean;
  anotacao_sessao_atual?: string;
  notas_sessoes: any[];
  arquivos: any[];
  revisoes: any[];
}

interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: string;
  tarefas: Tarefa[];
}

interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  gerente: string;
  data_inicio: string;
  prazo_final: string;
  status: string;
  progresso_geral: number;
  tempo_total_estimado: number;
  tempo_total_trabalhado: number;
  etapas: Etapa[];
  comunicacao: any[];
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

export default function DashboardProdutividadeV6({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>('tarefa_002');
  const [anotacaoRapida, setAnotacaoRapida] = useState('');
  const [abaComunicacao, setAbaComunicacao] = useState('chat');
  const [mensagemChat, setMensagemChat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados do projeto
  const projeto: Projeto = {
    id: projetoId,
    nome: 'Casa Residencial - Família Silva',
    cliente: 'João e Maria Silva',
    gerente: 'Ana Paula Arquiteta',
    data_inicio: '2024-03-01',
    prazo_final: '2024-06-15',
    status: 'em_andamento',
    progresso_geral: 68,
    tempo_total_estimado: 240,
    tempo_total_trabalhado: 163,
    etapas: [
      {
        id: 'etapa_001',
        numero: 1,
        nome: 'Estudos Preliminares',
        progresso: 85,
        status: 'em_andamento',
        tarefas: [
          {
            id: 'tarefa_001',
            nome: 'Levantamento topográfico e análise do terreno',
            status: 'concluida',
            responsavel: 'Carlos Topógrafo',
            tempo_estimado: 14*3600,
            tempo_total: 13.5*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-01',
            data_conclusao: '2024-03-03',
            requer_aprovacao: false,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_002',
            nome: 'Programa de necessidades e briefing detalhado',
            status: 'em_progresso',
            responsavel: 'Ana Paula Arquiteta',
            tempo_estimado: 12*3600,
            tempo_total: 8.75*3600,
            tempo_sessao_atual: 2.25*3600,
            cronometro_ativo: true,
            data_inicio: '2024-03-04',
            requer_aprovacao: true,
            anotacao_sessao_atual: 'Reunião com cliente agendada para revisar programa final',
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_003',
            nome: 'Briefing cliente e validação final',
            status: 'nao_iniciada',
            responsavel: 'Marina Arquiteta Jr.',
            tempo_estimado: 6*3600,
            tempo_total: 0,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          }
        ]
      },
      {
        id: 'etapa_002',
        numero: 2,
        nome: 'Anteprojeto',
        progresso: 45,
        status: 'em_progresso',
        tarefas: [
          {
            id: 'tarefa_004',
            nome: 'Plantas baixas - Pavimento Térreo',
            status: 'em_progresso',
            responsavel: 'Ana Paula Arquiteta',
            tempo_estimado: 24*3600,
            tempo_total: 18.5*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-06',
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_005',
            nome: 'Cortes e fachadas principais',
            status: 'nao_iniciada',
            responsavel: 'Carlos Designer',
            tempo_estimado: 16*3600,
            tempo_total: 0,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          }
        ]
      }
    ],
    comunicacao: [
      {
        id: 'msg_001',
        usuario: 'Ana Paula Arquiteta',
        avatar: 'AP',
        mensagem: 'Pessoal, as plantas do térreo estão 90% prontas. Vou enviar para revisão ainda hoje.',
        data: '2024-03-08T15:30:00',
        mencoes: ['Carlos Designer', 'Marina Arquiteta Jr.']
      },
      {
        id: 'msg_002',
        usuario: 'Carlos Designer',
        avatar: 'CD',
        mensagem: '@Ana Paula Arquiteta Perfeito! Assim que aprovar, já inicio os cortes e fachadas.',
        data: '2024-03-08T15:45:00',
        mencoes: ['Ana Paula Arquiteta']
      },
      {
        id: 'msg_003',
        usuario: 'Marina Arquiteta Jr.',
        avatar: 'MJ',
        mensagem: 'Cliente confirmou reunião para sexta-feira às 14h para validação do briefing final.',
        data: '2024-03-08T16:20:00',
        mencoes: []
      }
    ]
  };

  // Função para formatar tempo
  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const formatarTempoSimples = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    if (horas > 0) {
      return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
    }
    return `${minutos}min`;
  };

  // Obter tarefa ativa
  const tarefaAtivaData = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .find(tarefa => tarefa.id === tarefaAtiva);

  // Obter próximas tarefas
  const proximasTarefas = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .filter(tarefa => tarefa.status === 'nao_iniciada' || tarefa.status === 'em_progresso')
    .slice(0, 3);

  // Obter alertas críticos
  const tarefasAtrasadas = projeto.etapas.flatMap(etapa => 
    etapa.tarefas.filter(tarefa => tarefa.tempo_total > tarefa.tempo_estimado)
  );
  
  const proximasVencimento = projeto.etapas.flatMap(etapa => 
    etapa.tarefas.filter(tarefa => 
      tarefa.tempo_total > (tarefa.tempo_estimado * 0.8) && 
      tarefa.tempo_total <= tarefa.tempo_estimado
    )
  );
  
  const aguardandoAprovacao = projeto.etapas.flatMap(etapa =>
    etapa.tarefas.filter(tarefa => tarefa.status === 'em_revisao')
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nao_iniciada': return 'bg-gray-100 text-gray-700';
      case 'em_progresso': return 'bg-blue-100 text-blue-700';
      case 'em_revisao': return 'bg-yellow-100 text-yellow-700';
      case 'concluida': return 'bg-green-100 text-green-700';
      case 'atrasada': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nao_iniciada': return '⏸️';
      case 'em_progresso': return '🔄';
      case 'em_revisao': return '👁️';
      case 'concluida': return '✅';
      case 'atrasada': return '🔴';
      default: return '⏸️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER COMPACTO */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900">ArcFlow</span>
          </div>
          <div className="text-gray-400">|</div>
          <h1 className="text-lg font-semibold text-gray-900">{projeto.nome}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Lista</option>
            <option>Kanban</option>
            <option>Timeline</option>
          </select>
          <Button variant="outline" size="sm">
            <Focus className="h-4 w-4 mr-2" />
            Foco
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            AP
          </div>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div className="bg-blue-50 border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Tarefa
          </Button>
          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
            <Pause className="h-4 w-4 mr-2" />
            Pausar Timer
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
            <Save className="h-4 w-4 mr-2" />
            Salvar Nota
          </Button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tarefas, pessoas, arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LAYOUT VERTICAL - TODAS AS SEÇÕES EMPILHADAS */}
      <div className="p-6 space-y-6">
        
        {/* SEÇÃO 1: VISÃO GERAL DO PROJETO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Visão Geral do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Progresso Circular */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(229 231 235)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(59 130 246)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${projeto.progresso_geral * 2.83} 283`}
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${projeto.progresso_geral * 2.83} 283` }}
                      transition={{ duration: 1.5 }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{projeto.progresso_geral}%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">Progresso Geral</p>
              </div>

              {/* Métricas */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">⏱️ Trabalhadas:</span>
                  <span className="font-medium">{projeto.tempo_total_trabalhado}h / {projeto.tempo_total_estimado}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">📅 Prazo:</span>
                  <span className="font-medium">15/06 (97 dias)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">👥 Equipe:</span>
                  <span className="font-medium">4 pessoas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">💰 Orçamento:</span>
                  <span className="font-medium">R$ 25.000</span>
                </div>
              </div>

              {/* Alertas Críticos */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">Alertas Críticos</h4>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-red-700">🔴 Atrasadas</span>
                  <span className="font-bold text-red-700">{tarefasAtrasadas.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-yellow-700">🟡 Próximas prazo</span>
                  <span className="font-bold text-yellow-700">{proximasVencimento.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-700">🔵 Em aprovação</span>
                  <span className="font-bold text-blue-700">{aguardandoAprovacao.length}</span>
                </div>
              </div>

              {/* Produtividade Hoje */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">Produtividade Hoje</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">• Flow time:</span>
                  <span className="font-medium text-green-600">4h 30min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">• Interrupções:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">• Foco score:</span>
                  <span className="font-medium text-blue-600">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">• Sessões:</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEÇÃO 2: TAREFA ATIVA E CRONÔMETRO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="h-5 w-5 mr-2 text-green-600" />
              Tarefa Ativa - Cronômetro
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tarefaAtivaData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cronômetro Principal */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(229 231 235)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(34 197 94)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="283"
                        strokeDashoffset="70"
                        animate={{ strokeDashoffset: [70, 283, 70] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-green-600">
                          {formatarTempo(tarefaAtivaData.tempo_sessao_atual)}
                        </div>
                        <div className="text-xs text-gray-500">Sessão Atual</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-700">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Detalhes da Tarefa */}
                <div className="lg:col-span-2">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{tarefaAtivaData.nome}</h3>
                      <Badge className="bg-green-100 text-green-700">Em Progresso</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">👤 Responsável:</span>
                        <span className="ml-2 font-medium">{tarefaAtivaData.responsavel}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">⏱️ Tempo Total:</span>
                        <span className="ml-2 font-medium">{formatarTempoSimples(tarefaAtivaData.tempo_total)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">📊 Estimado:</span>
                        <span className="ml-2 font-medium">{formatarTempoSimples(tarefaAtivaData.tempo_estimado)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">📅 Iniciado:</span>
                        <span className="ml-2 font-medium">{tarefaAtivaData.data_inicio}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{Math.round((tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Anotação da Sessão */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anotações da Sessão Atual
                      </label>
                      <Textarea
                        value={tarefaAtivaData.anotacao_sessao_atual || ''}
                        placeholder="Adicione suas anotações sobre o progresso..."
                        className="w-full"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Salvo automaticamente • Última edição: há 2 min
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Concluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma tarefa ativa</h3>
                <p className="text-gray-600 mb-4">Selecione uma tarefa para começar a trabalhar</p>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Tarefa
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEÇÃO 3: COMUNICAÇÃO DA EQUIPE */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
              Comunicação da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Abas de Comunicação */}
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  {['chat', 'arquivos', 'atividades', 'equipe'].map((aba) => (
                    <button
                      key={aba}
                      onClick={() => setAbaComunicacao(aba)}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${
                        abaComunicacao === aba
                          ? 'bg-blue-100 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {aba === 'chat' && '💬'} {aba === 'arquivos' && '📁'} 
                      {aba === 'atividades' && '📋'} {aba === 'equipe' && '👥'}
                      {' '}
                      {aba.charAt(0).toUpperCase() + aba.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo da Comunicação */}
              <div className="lg:col-span-3">
                {abaComunicacao === 'chat' && (
                  <div>
                    <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                      {projeto.comunicacao.map((msg) => (
                        <div key={msg.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {msg.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {msg.usuario.split(' ')[0]}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(msg.data).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{msg.mensagem}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite sua mensagem... @mencionar"
                          value={mensagemChat}
                          onChange={(e) => setMensagemChat(e.target.value)}
                          className="flex-1"
                        />
                        <Button>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {abaComunicacao === 'arquivos' && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Nenhum arquivo compartilhado</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Arquivo
                    </Button>
                  </div>
                )}

                {abaComunicacao === 'atividades' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Ana concluiu</span>
                      <span className="font-medium">Levantamento topográfico</span>
                      <span className="text-gray-500">2h atrás</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Carlos iniciou</span>
                      <span className="font-medium">Programa de necessidades</span>
                      <span className="text-gray-500">4h atrás</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Marina pausou</span>
                      <span className="font-medium">Briefing cliente</span>
                      <span className="text-gray-500">1d atrás</span>
                    </div>
                  </div>
                )}

                {abaComunicacao === 'equipe' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AP
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Ana Paula</div>
                        <div className="text-xs text-green-600 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Online • Trabalhando
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        CD
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Carlos Designer</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                          Ausente • Volta às 14h
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        MJ
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Marina Jr.</div>
                        <div className="text-xs text-yellow-600 flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                          Ocupada • Em reunião
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEÇÃO 4: ESTRUTURA DO PROJETO - ETAPAS E TAREFAS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Workflow className="h-5 w-5 mr-2 text-purple-600" />
                Estrutura do Projeto - Etapas e Tarefas
              </div>
              <Badge variant="outline">
                {projeto.etapas.length} etapas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projeto.etapas.map((etapa) => (
                <Card key={etapa.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">
                          ETAPA {etapa.numero}: {etapa.nome}
                        </h4>
                        <Badge className={getStatusColor(etapa.status)}>
                          {etapa.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Progress value={etapa.progresso} className="w-24" />
                          <span className="text-sm font-medium text-gray-600">
                            {etapa.progresso}%
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {etapa.tarefas.map((tarefa) => (
                        <div
                          key={tarefa.id}
                          className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                            tarefa.id === tarefaAtiva 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getStatusIcon(tarefa.status)}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {tarefa.nome}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                👤 {tarefa.responsavel}
                              </div>
                              
                              <div className="text-sm text-gray-600">
                                {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {tarefa.status === 'nao_iniciada' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setTarefaAtiva(tarefa.id)}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                              )}
                              
                              {tarefa.status === 'em_progresso' && (
                                <>
                                  {tarefa.cronometro_ativo ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-orange-300 text-orange-700"
                                    >
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pausar
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-300 text-green-700"
                                      onClick={() => setTarefaAtiva(tarefa.id)}
                                    >
                                      <Play className="h-4 w-4 mr-1" />
                                      Retomar
                                    </Button>
                                  )}
                                </>
                              )}
                              
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                              
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {tarefa.anotacao_sessao_atual && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                              💭 {tarefa.anotacao_sessao_atual}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Etapa
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Tudo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRONÔMETRO FLUTUANTE */}
      <AnimatePresence>
        {tarefaAtivaData?.cronometro_ativo && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg border-2 border-green-500 p-4 z-50"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(229 231 235)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(34 197 94)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                    animate={{ strokeDashoffset: [70, 283, 70] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-green-600" />
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-bold text-gray-900">
                  {formatarTempo(tarefaAtivaData.tempo_sessao_atual)}
                </div>
                <div className="text-gray-600 truncate max-w-32">
                  {tarefaAtivaData.nome}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 