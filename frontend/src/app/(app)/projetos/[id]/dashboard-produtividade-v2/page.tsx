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

export default function DashboardProdutividadeV2({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>('tarefa_002');
  const [anotacaoRapida, setAnotacaoRapida] = useState('');
  const [hierarquiaExpandida, setHierarquiaExpandida] = useState(false);
  const [painelDireitoAberto, setPainelDireitoAberto] = useState(true);
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

      {/* LAYOUT PRINCIPAL */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* PAINEL ESQUERDO - MISSION CONTROL */}
        <div className="w-80 bg-white border-r p-6 overflow-y-auto">
          {/* Visão Geral */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Visão Geral
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4">
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
                
                <div className="space-y-2 text-sm">
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Críticos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Alertas Críticos
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-700">🔴 Tarefas atrasadas</span>
                <span className="font-bold text-red-700">{tarefasAtrasadas.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-700">🟡 Próximas do prazo</span>
                <span className="font-bold text-yellow-700">{proximasVencimento.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">🔵 Aguardando aprovação</span>
                <span className="font-bold text-blue-700">{aguardandoAprovacao.length}</span>
              </div>
            </div>
          </div>

          {/* Produtividade Hoje */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Produtividade Hoje
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">• Flow time:</span>
                <span className="font-medium text-green-600">4h 30min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">• Interrupções:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">• Foco score:</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
            </div>
          </div>

          {/* Próximas Tarefas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Próximas Tarefas
            </h3>
            <div className="space-y-2">
              {proximasTarefas.map((tarefa, index) => (
                <div key={tarefa.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {index + 1}. {tarefa.nome}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    👤 {tarefa.responsavel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ÁREA CENTRAL - WORKSPACE ATIVO */}
        <div className="flex-1 p-6 overflow-y-auto">
          {tarefaAtivaData ? (
            <div className="max-w-4xl">
              {/* Tarefa Ativa */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-green-600" />
                  Tarefa Ativa
                </h2>
                
                <Card className="border-2 border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          📝 {tarefaAtivaData.nome}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {tarefaAtivaData.responsavel}
                          </span>
                          <Badge className={getStatusColor(tarefaAtivaData.status)}>
                            {getStatusIcon(tarefaAtivaData.status)} Estudos Preliminares
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Cronômetro Principal */}
                    <div className="bg-white p-6 rounded-lg border-2 border-blue-200 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                        ⏱️ Cronômetro Principal
                      </h4>
                      
                      <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32">
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
                              initial={{ strokeDashoffset: 283 }}
                              animate={{ strokeDashoffset: 70 }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatarTempo(tarefaAtivaData.tempo_sessao_atual)}
                            </span>
                            <span className="text-xs text-gray-600">sessão atual</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600">Total Trabalhado</div>
                          <div className="font-bold text-blue-600">
                            {formatarTempoSimples(tarefaAtivaData.tempo_total)}
                          </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">Tempo Estimado</div>
                          <div className="font-bold text-green-600">
                            {formatarTempoSimples(tarefaAtivaData.tempo_estimado)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Métricas da Tarefa */}
                    <div className="bg-white p-4 rounded-lg border mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Métricas da Tarefa
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Progresso</div>
                          <div className="flex items-center space-x-2">
                            <Progress value={73} className="flex-1" />
                            <span className="text-sm font-medium">73%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Eficiência</div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">87%</span>
                            <span className="text-sm">✅</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anotação Rápida */}
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Anotação Rápida
                      </h4>
                      <Textarea
                        placeholder="Anote ideias, observações ou próximos passos..."
                        value={anotacaoRapida}
                        onChange={(e) => setAnotacaoRapida(e.target.value)}
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Salvo automaticamente • Última edição: há 2 min
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                          </Button>
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
        </div>

        {/* PAINEL DIREITO - COMUNICAÇÃO */}
        <AnimatePresence>
          {painelDireitoAberto && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-l overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Comunicação</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPainelDireitoAberto(false)}
                  >
                    <PanelRightClose className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {['chat', 'arquivos', 'atividades', 'equipe'].map((aba) => (
                    <button
                      key={aba}
                      onClick={() => setAbaComunicacao(aba)}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        abaComunicacao === aba
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
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

              <div className="flex-1 overflow-y-auto h-[calc(100vh-250px)]">
                {abaComunicacao === 'chat' && (
                  <div className="p-4">
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
                          placeholder="Digite sua mensagem... @mencionar"
                          value={mensagemChat}
                          onChange={(e) => setMensagemChat(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {abaComunicacao === 'arquivos' && (
                  <div className="p-4">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Nenhum arquivo compartilhado</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Arquivo
                      </Button>
                    </div>
                  </div>
                )}

                {abaComunicacao === 'atividades' && (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Ana concluiu</span>
                        <span className="font-medium">Levantamento topográfico</span>
                        <span className="text-gray-500">2h atrás</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Carlos iniciou</span>
                        <span className="font-medium">Programa de necessidades</span>
                        <span className="text-gray-500">4h atrás</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Marina pausou</span>
                        <span className="font-medium">Briefing cliente</span>
                        <span className="text-gray-500">1d atrás</span>
                      </div>
                    </div>
                  </div>
                )}

                {abaComunicacao === 'equipe' && (
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão para abrir painel direito quando fechado */}
        {!painelDireitoAberto && (
          <div className="w-12 bg-white border-l flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPainelDireitoAberto(true)}
              className="h-full w-full"
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ÁREA INFERIOR - HIERARQUIA COLAPSÁVEL */}
      <div className="bg-white border-t">
        <div className="px-6 py-4">
          <button
            onClick={() => setHierarquiaExpandida(!hierarquiaExpandida)}
            className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {hierarquiaExpandida ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
            <Workflow className="h-5 w-5" />
            <span>Etapas e Tarefas</span>
            <Badge variant="outline" className="ml-2">
              {projeto.etapas.length} etapas
            </Badge>
          </button>
        </div>

        <AnimatePresence>
          {hierarquiaExpandida && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 max-h-96 overflow-y-auto">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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