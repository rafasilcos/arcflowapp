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
  PanelRightOpen, Workflow, BarChart3, Menu, X, Minimize2, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces baseadas na especificação (mantendo as mesmas da V2)
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

export default function DashboardProdutividadeV3({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>('tarefa_002');
  const [anotacaoRapida, setAnotacaoRapida] = useState('');
  const [hierarquiaExpandida, setHierarquiaExpandida] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mensagemChat, setMensagemChat] = useState('');
  
  // Estados do layout colapsável
  const [sidebarEsquerdaAberta, setSidebarEsquerdaAberta] = useState(true);
  const [painelDireitoAberto, setPainelDireitoAberto] = useState(false);
  const [modoFoco, setModoFoco] = useState(false);
  const [densidadeLayout, setDensidadeLayout] = useState<'minima' | 'media' | 'maxima'>('media');

  // Dados do projeto (mesmos da V2)
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
        mensagem: 'Equipe, preciso do briefing aprovado para iniciar a validação com o cliente. Prazo?',
        data: '2024-03-08T16:20:00',
        mencoes: []
      }
    ]
  };

  // Funções utilitárias (mesmas da V2)
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
      case 'nao_iniciada': return '⏳';
      case 'em_progresso': return '🔄';
      case 'em_revisao': return '👁️';
      case 'concluida': return '✅';
      case 'atrasada': return '🔴';
      default: return '📋';
    }
  };

  // Dados derivados
  const tarefaAtivaData = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .find(tarefa => tarefa.id === tarefaAtiva);

  const tarefasAtrasadas = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .filter(tarefa => tarefa.status === 'atrasada');

  const proximasVencimento = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .filter(tarefa => tarefa.status === 'em_progresso')
    .slice(0, 2);

  const aguardandoAprovacao = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .filter(tarefa => tarefa.requer_aprovacao && tarefa.status === 'em_revisao');

  const proximasTarefas = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .filter(tarefa => tarefa.status === 'nao_iniciada')
    .slice(0, 3);

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
          {/* Controle de Densidade */}
          <select 
            value={densidadeLayout} 
            onChange={(e) => setDensidadeLayout(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="minima">Mínima</option>
            <option value="media">Média</option>
            <option value="maxima">Máxima</option>
          </select>
          
          <select className="text-sm border border-gray-300 rounded px-3 py-1">
            <option>Lista</option>
            <option>Kanban</option>
            <option>Timeline</option>
          </select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setModoFoco(!modoFoco)}
          >
            <Focus className="h-4 w-4 mr-2" />
            Foco
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {tarefasAtrasadas.length + aguardandoAprovacao.length}
            </span>
          </div>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            AP
          </div>
        </div>
      </div>

      {/* COMMAND BAR */}
      <div className="bg-blue-50 border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Controles de Layout */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarEsquerdaAberta(!sidebarEsquerdaAberta)}
              className="flex items-center"
            >
              <Menu className="h-4 w-4 mr-1" />
              {sidebarEsquerdaAberta ? 'Ocultar' : 'Mostrar'} Sidebar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPainelDireitoAberto(!painelDireitoAberto)}
              className="flex items-center"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {painelDireitoAberto ? 'Ocultar' : 'Mostrar'} Chat
            </Button>
          </div>

          <div className="h-4 w-px bg-gray-300"></div>

          {/* Ações Principais */}
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

      {/* LAYOUT PRINCIPAL ADAPTATIVO */}
      <div className="flex h-[calc(100vh-140px)]">
        
        {/* SIDEBAR ESQUERDA - COLAPSÁVEL */}
        <AnimatePresence>
          {sidebarEsquerdaAberta && densidadeLayout !== 'minima' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-r overflow-hidden"
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Header da Sidebar */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Mission Control
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarEsquerdaAberta(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Visão Geral Compacta */}
                <div className="mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
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
                            <span className="text-sm font-bold text-gray-900">{projeto.progresso_geral}%</span>
                          </div>
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="text-sm text-gray-600">Progresso Geral</div>
                          <div className="text-lg font-bold text-gray-900">{projeto.progresso_geral}%</div>
                          <div className="text-xs text-gray-500">
                            {projeto.tempo_total_trabalhado}h / {projeto.tempo_total_estimado}h
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alertas Críticos */}
                {(tarefasAtrasadas.length > 0 || aguardandoAprovacao.length > 0) && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                      Alertas
                    </h4>
                    <div className="space-y-2">
                      {tarefasAtrasadas.length > 0 && (
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded text-sm">
                          <span className="text-red-700">🔴 Atrasadas</span>
                          <span className="font-bold text-red-700">{tarefasAtrasadas.length}</span>
                        </div>
                      )}
                      {aguardandoAprovacao.length > 0 && (
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                          <span className="text-blue-700">🔵 Aprovação</span>
                          <span className="font-bold text-blue-700">{aguardandoAprovacao.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Próximas Tarefas */}
                {densidadeLayout === 'maxima' && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-purple-600" />
                      Próximas
                    </h4>
                    <div className="space-y-2">
                      {proximasTarefas.map((tarefa, index) => (
                        <div 
                          key={tarefa.id} 
                          className="p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setTarefaAtiva(tarefa.id)}
                        >
                          <div className="font-medium text-gray-900 truncate">
                            {index + 1}. {tarefa.nome}
                          </div>
                          <div className="text-xs text-gray-600">
                            👤 {tarefa.responsavel}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ÁREA CENTRAL - ADAPTATIVA */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* MODO FOCO - Só tarefa ativa */}
          {modoFoco || densidadeLayout === 'minima' ? (
            <div className="max-w-4xl mx-auto">
              {tarefaAtivaData ? (
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        🎯 Foco Total
                      </h2>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {tarefaAtivaData.nome}
                      </h3>
                      <div className="text-gray-600">
                        👤 {tarefaAtivaData.responsavel}
                      </div>
                    </div>

                    {/* Cronômetro Grande */}
                    <div className="text-center mb-8">
                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
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
                            strokeDashoffset={283 - (tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 283}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-gray-900 font-mono">
                            {formatarTempo(tarefaAtivaData.tempo_total + tarefaAtivaData.tempo_sessao_atual)}
                          </span>
                          <span className="text-sm text-gray-600">tempo total</span>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4 mb-8">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar
                        </Button>
                        <Button variant="outline" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </Button>
                        <Button variant="outline" size="lg">
                          <Square className="h-5 w-5 mr-2" />
                          Parar
                        </Button>
                      </div>
                    </div>

                    {/* Notas da Sessão */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Notas da Sessão</h4>
                      <Textarea
                        placeholder="Anote suas ideias e observações..."
                        value={anotacaoRapida}
                        onChange={(e) => setAnotacaoRapida(e.target.value)}
                        rows={4}
                        className="mb-4"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Auto-save ativo</span>
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
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhuma tarefa ativa
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Selecione uma tarefa para começar a trabalhar
                  </p>
                  <Button onClick={() => setModoFoco(false)}>
                    Ver todas as tarefas
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* MODO NORMAL - Layout completo */
            <div className="space-y-6">
              {/* Tarefa Ativa */}
              {tarefaAtivaData && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Tarefa Ativa
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setModoFoco(true)}
                    >
                      <Maximize2 className="h-4 w-4 mr-1" />
                      Expandir
                    </Button>
                  </div>
                  
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Info da Tarefa */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            📝 {tarefaAtivaData.nome}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {tarefaAtivaData.responsavel}
                            </span>
                            <Badge className={getStatusColor(tarefaAtivaData.status)}>
                              {getStatusIcon(tarefaAtivaData.status)} Em progresso
                            </Badge>
                          </div>
                          
                          {/* Controles do Timer */}
                          <div className="flex space-x-2 mb-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Play className="h-4 w-4 mr-1" />
                              Iniciar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-1" />
                              Pausar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Square className="h-4 w-4 mr-1" />
                              Parar
                            </Button>
                          </div>

                          {/* Métricas */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Estimado</div>
                              <div className="font-bold">{formatarTempoSimples(tarefaAtivaData.tempo_estimado)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Trabalhado</div>
                              <div className="font-bold">{formatarTempoSimples(tarefaAtivaData.tempo_total)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Cronômetro */}
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
                                strokeDashoffset={283 - (tarefaAtivaData.tempo_total / tarefaAtivaData.tempo_estimado) * 283}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-xl font-bold text-gray-900 font-mono">
                                {formatarTempo(tarefaAtivaData.tempo_total + tarefaAtivaData.tempo_sessao_atual)}
                              </span>
                              <span className="text-xs text-gray-600">total</span>
                            </div>
                          </div>
                          
                          {/* Notas Rápidas */}
                          <Textarea
                            placeholder="Notas da sessão..."
                            value={anotacaoRapida}
                            onChange={(e) => setAnotacaoRapida(e.target.value)}
                            rows={3}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Hierarquia do Projeto */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Workflow className="h-5 w-5 mr-2 text-blue-600" />
                    Hierarquia do Projeto
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHierarquiaExpandida(!hierarquiaExpandida)}
                  >
                    {hierarquiaExpandida ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {hierarquiaExpandida ? 'Colapsar' : 'Expandir'}
                  </Button>
                </div>

                {hierarquiaExpandida && (
                  <div className="space-y-4">
                    {projeto.etapas.map((etapa) => (
                      <Card key={etapa.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-gray-900">
                                ETAPA {etapa.numero}: {etapa.nome}
                              </h4>
                              <Badge className={getStatusColor(etapa.status)}>
                                {etapa.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Progress value={etapa.progresso} className="w-24" />
                              <span className="text-sm font-medium text-gray-600">
                                {etapa.progresso}%
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {etapa.tarefas.map((tarefa) => (
                              <div
                                key={tarefa.id}
                                className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                                  tarefa.id === tarefaAtiva 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => setTarefaAtiva(tarefa.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 flex-1">
                                    <span className="text-lg">
                                      {getStatusIcon(tarefa.status)}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {tarefa.nome}
                                    </span>
                                    <Badge className={getStatusColor(tarefa.status)}>
                                      {tarefa.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    <div className="text-sm text-gray-600">
                                      👤 {tarefa.responsavel}
                                    </div>
                                                                         <div className="text-sm text-gray-600">
                                       ⏱️ {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {tarefa.status === 'nao_iniciada' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTarefaAtiva(tarefa.id);
                                        }}
                                      >
                                        <Play className="h-4 w-4 mr-1" />
                                        Iniciar
                                      </Button>
                                    )}
                                    
                                    {tarefa.status === 'em_progresso' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-300 text-green-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setTarefaAtiva(tarefa.id);
                                        }}
                                      >
                                        <Play className="h-4 w-4 mr-1" />
                                        Retomar
                                      </Button>
                                    )}
                                    
                                    <Button variant="ghost" size="sm">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    
                                    <Button variant="ghost" size="sm">
                                      <MessageSquare className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4">
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Tarefa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PAINEL DIREITO - COMUNICAÇÃO (COLAPSÁVEL) */}
        <AnimatePresence>
          {painelDireitoAberto && densidadeLayout !== 'minima' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-l overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Comunicação
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPainelDireitoAberto(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)] p-4">
                <div className="space-y-4 mb-4">
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
                        <p className="text-sm text-gray-700">{msg.mensagem}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={mensagemChat}
                      onChange={(e) => setMensagemChat(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setMensagemChat('');
                        }
                      }}
                    />
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}