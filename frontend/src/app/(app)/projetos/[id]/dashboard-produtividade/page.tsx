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
  Zap, TrendingUp, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces baseadas na especificação
interface NotaSessao {
  data: string;
  duracao: number;
  anotacao: string;
}

interface Arquivo {
  nome: string;
  url: string;
  data_upload: string;
}

interface Revisao {
  id: string;
  data: string;
  revisor: string;
  status: 'aprovado' | 'ajustes_necessarios';
  comentarios: string;
}

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
  notas_sessoes: NotaSessao[];
  arquivos: Arquivo[];
  revisoes: Revisao[];
}

interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: string;
  tarefas: Tarefa[];
}

interface MensagemChat {
  id: string;
  usuario: string;
  avatar: string;
  mensagem: string;
  data: string;
  mencoes: string[];
  arquivos: Arquivo[];
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
  comunicacao: MensagemChat[];
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

export default function DashboardProdutividade({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [modoFoco, setModoFoco] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'kanban' | 'timeline'>('lista');
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null);
  const [mensagemChat, setMensagemChat] = useState('');
  const [anotacaoSessao, setAnotacaoSessao] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados do projeto baseados na especificação
  const projeto: Projeto = {
    id: projetoId,
    nome: 'Casa Residencial Alto Padrão - Família Silva',
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
        nome: 'Levantamento e Estudos Preliminares',
        progresso: 85,
        status: 'em_andamento',
        tarefas: [
          {
            id: 'tarefa_001',
            nome: 'Levantamento topográfico e análise do terreno',
            status: 'concluida',
            responsavel: 'Carlos Topógrafo',
            tempo_estimado: 14400,
            tempo_total: 13800,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-01',
            data_conclusao: '2024-03-03',
            requer_aprovacao: false,
            notas_sessoes: [
              {
                data: '2024-03-01T09:00:00',
                duracao: 7200,
                anotacao: 'Iniciado levantamento, terreno com declive de 15%'
              }
            ],
            arquivos: [
              {
                nome: 'levantamento-topografico.dwg',
                url: '/uploads/proj_001/levantamento.dwg',
                data_upload: '2024-03-03T16:30:00'
              }
            ],
            revisoes: []
          },
          {
            id: 'tarefa_002',
            nome: 'Programa de necessidades e briefing detalhado',
            status: 'em_progresso',
            responsavel: 'Ana Paula Arquiteta',
            tempo_estimado: 21600,
            tempo_total: 16200,
            tempo_sessao_atual: 1847,
            cronometro_ativo: true,
            data_inicio: '2024-03-04',
            requer_aprovacao: true,
            anotacao_sessao_atual: 'Reunião com cliente agendada para revisar programa final',
            notas_sessoes: [
              {
                data: '2024-03-04T08:30:00',
                duracao: 10800,
                anotacao: 'Primeira versão do briefing elaborada com base nas necessidades'
              }
            ],
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
            id: 'tarefa_003',
            nome: 'Plantas baixas - Pavimento Térreo',
            status: 'em_progresso',
            responsavel: 'Marina Arquiteta Jr.',
            tempo_estimado: 28800,
            tempo_total: 21600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-06',
            requer_aprovacao: true,
            notas_sessoes: [
              {
                data: '2024-03-06T09:00:00',
                duracao: 14400,
                anotacao: 'Iniciado desenho da planta baixa, definidas áreas sociais'
              }
            ],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_004',
            nome: 'Revisão e aprovação da fachada principal',
            status: 'em_revisao',
            responsavel: 'Carlos Designer',
            tempo_estimado: 18000,
            tempo_total: 19800,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-08',
            data_conclusao: '2024-03-10',
            requer_aprovacao: true,
            notas_sessoes: [
              {
                data: '2024-03-08T10:00:00',
                duracao: 18000,
                anotacao: 'Primeira versão da fachada concluída'
              }
            ],
            arquivos: [
              {
                nome: 'fachada-principal-v2.pdf',
                url: '/uploads/proj_001/fachada-v2.pdf',
                data_upload: '2024-03-10T17:00:00'
              }
            ],
            revisoes: [
              {
                id: 'rev_001',
                data: '2024-03-11T09:30:00',
                revisor: 'Ana Paula Arquiteta',
                status: 'ajustes_necessarios',
                comentarios: 'Ótimo trabalho! Apenas ajustar a cor da esquadria para melhor harmonização.'
              }
            ]
          }
        ]
      }
    ],
    comunicacao: [
      {
        id: 'msg_001',
        usuario: 'Ana Paula Arquiteta',
        avatar: 'AP',
        mensagem: 'Pessoal, revisem os prazos das plantas baixas. Cliente antecipou a apresentação.',
        data: '2024-03-11T14:30:00',
        mencoes: ['Marina Arquiteta Jr.', 'Carlos Designer'],
        arquivos: []
      },
      {
        id: 'msg_002',
        usuario: 'Marina Arquiteta Jr.',
        avatar: 'MJ',
        mensagem: '@Ana Paula Arquiteta Conseguimos entregar até quinta-feira. Estou adiantando o térreo.',
        data: '2024-03-11T14:45:00',
        mencoes: ['Ana Paula Arquiteta'],
        arquivos: []
      }
    ]
  };

  // Timer para cronômetros ativos
  useEffect(() => {
    const interval = setInterval(() => {
      if (tarefaAtiva) {
        // Incrementar tempo da sessão atual em produção
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tarefaAtiva]);

  // Funções utilitárias
  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const obterTarefasAtrasadas = () => {
    return projeto.etapas.flatMap(etapa => 
      etapa.tarefas.filter(tarefa => tarefa.tempo_total > tarefa.tempo_estimado)
    );
  };

  const obterTarefasProximasAtraso = () => {
    return projeto.etapas.flatMap(etapa => 
      etapa.tarefas.filter(tarefa => 
        tarefa.tempo_total > (tarefa.tempo_estimado * 0.8) && 
        tarefa.tempo_total <= tarefa.tempo_estimado
      )
    );
  };

  const obterTarefasEmRevisao = () => {
    return projeto.etapas.flatMap(etapa =>
      etapa.tarefas.filter(tarefa => tarefa.status === 'em_revisao')
    );
  };

  const iniciarCronometro = (tarefaId: string) => {
    setTarefaAtiva(tarefaId);
    // Em produção: pausar outros cronômetros, iniciar novo, solicitar anotação
  };

  const pausarCronometro = () => {
    setTarefaAtiva(null);
    // Em produção: salvar tempo da sessão, solicitar anotação final
  };

  const getStatusColor = (status: Tarefa['status']) => {
    switch (status) {
      case 'nao_iniciada': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'em_progresso': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'em_revisao': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'concluida': return 'bg-green-100 text-green-700 border-green-300';
      case 'atrasada': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: Tarefa['status']) => {
    switch (status) {
      case 'nao_iniciada': return <Clock className="h-4 w-4" />;
      case 'em_progresso': return <Timer className="h-4 w-4" />;
      case 'em_revisao': return <Eye className="h-4 w-4" />;
      case 'concluida': return <CheckCircle2 className="h-4 w-4" />;
      case 'atrasada': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const tarefaAtivaData = projeto.etapas
    .flatMap(etapa => etapa.tarefas)
    .find(tarefa => tarefa.id === tarefaAtiva);

  // MODO FOCO - Tela simplificada quando cronômetro ativo
  if (modoFoco && tarefaAtivaData) {
  return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full text-center"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {tarefaAtivaData.nome}
                </h1>
            <p className="text-gray-400">
              {projeto.nome} • Etapa {projeto.etapas.find(e => e.id === tarefaAtivaData.id)?.numero}
            </p>
              </div>
              
          {/* Cronômetro circular grande */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(55 65 81)"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(59 130 246)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${(tarefaAtivaData.tempo_sessao_atual / tarefaAtivaData.tempo_estimado) * 283} 283`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-mono font-bold text-blue-400 mb-1">
                  {formatarTempo(tarefaAtivaData.tempo_sessao_atual)}
                </p>
                <p className="text-sm text-gray-400">sessão atual</p>
              </div>
            </div>
              </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total da Tarefa</p>
              <p className="text-xl font-mono font-bold text-white">
                {formatarTempo(tarefaAtivaData.tempo_total)}
              </p>
              </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Estimado</p>
              <p className="text-xl font-mono font-bold text-gray-300">
                {formatarTempo(tarefaAtivaData.tempo_estimado)}
              </p>
            </div>
          </div>

          {/* Campo de anotação rápida */}
          <div className="mb-6">
            <Textarea
              placeholder="Anotação da sessão atual..."
              value={anotacaoSessao}
              onChange={(e) => setAnotacaoSessao(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
        </div>
        
          <div className="flex justify-center space-x-4">
            <Button
              onClick={pausarCronometro}
              variant="outline"
              size="lg"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pausar Sessão
            </Button>
            <Button
              onClick={() => setModoFoco(false)}
              variant="outline" 
              size="lg"
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              <EyeOff className="h-5 w-5 mr-2" />
              Sair do Foco
            </Button>
                  </div>
        </motion.div>
                </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CRONÔMETRO FLUTUANTE - Sempre visível quando há tarefa ativa */}
      <AnimatePresence>
        {tarefaAtiva && !modoFoco && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Tarefa Ativa</span>
              </div>
              <Button
                onClick={() => setModoFoco(true)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <Focus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mb-3">
              <p className="text-xs text-gray-500 truncate">
                {tarefaAtivaData?.nome}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sessão:</span>
                <span className="font-mono font-bold text-blue-600">
                  {formatarTempo(tarefaAtivaData?.tempo_sessao_atual || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-mono font-bold">
                  {formatarTempo(tarefaAtivaData?.tempo_total || 0)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={pausarCronometro}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pausar
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-1" />
                Nota
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER FIXO */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard de Produtividade</h1>
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                  <Home className="h-4 w-4" />
                  <ArrowRight className="h-3 w-3" />
                  <span>Projetos</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-gray-900 font-medium">Dashboard</span>
                </nav>
              </div>
            </div>
              </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar tarefas, responsáveis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              AP
            </div>
              </div>
            </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. CARD STATUS GERAL DO PROJETO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                  <h2 className="text-lg font-bold">Status Geral do Projeto</h2>
                  <p className="text-sm text-gray-600">{projeto.nome}</p>
                </div>
              </div>
              <Badge className={
                projeto.status === 'em_andamento' ? 'bg-blue-500' :
                projeto.status === 'atrasado' ? 'bg-red-500' : 'bg-green-500'
              }>
                {projeto.status.replace('_', ' ')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Progresso Geral */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-2">
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
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{projeto.progresso_geral}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Progresso Geral</p>
                </div>
              </div>

              {/* Cronograma */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="p-4 bg-green-50 rounded-lg mb-2">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">15/30</p>
                    <p className="text-xs text-gray-600">dias decorridos</p>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Cronograma</p>
                </div>
              </div>

              {/* Métricas de Tempo */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className="p-4 bg-purple-50 rounded-lg mb-2">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{projeto.tempo_total_trabalhado}h</p>
                    <p className="text-xs text-gray-600">de {projeto.tempo_total_estimado}h</p>
                </div>
                  <p className="text-sm font-medium text-gray-700">Tempo Trabalhado</p>
                </div>
              </div>

              {/* Alertas Críticos */}
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Alertas Críticos</h3>
                  <div className="space-y-2">
                    {obterTarefasAtrasadas().length > 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">
                          {obterTarefasAtrasadas().length} atrasada(s)
                  </span>
                </div>
                    )}
                    {obterTarefasEmRevisao().length > 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <Eye className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-yellow-700">
                          {obterTarefasEmRevisao().length} em revisão
                        </span>
              </div>
                    )}
                    {obterTarefasProximasAtraso().length > 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-700">
                          {obterTarefasProximasAtraso().length} próxima(s) atraso
                  </span>
                      </div>
                    )}
                    {obterTarefasAtrasadas().length === 0 && 
                     obterTarefasEmRevisao().length === 0 && 
                     obterTarefasProximasAtraso().length === 0 && (
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">Tudo em dia!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. ÁREA PRINCIPAL DE VISUALIZAÇÃO HIERÁRQUICA */}
          <div className="lg:col-span-2">
            <Card>
          <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <List className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                      <h2 className="text-lg font-bold">Estrutura do Projeto</h2>
                      <p className="text-sm text-gray-600">Projeto &gt; Etapas &gt; Tarefas</p>
                    </div>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-2">
                     <Button
                       variant={visualizacao === 'lista' ? 'primary' : 'outline'}
                       size="sm"
                       onClick={() => setVisualizacao('lista')}
                     >
                       <List className="h-4 w-4 mr-2" />
                       Lista
                     </Button>
                     <Button
                       variant={visualizacao === 'kanban' ? 'primary' : 'outline'}
                       size="sm"
                       onClick={() => setVisualizacao('kanban')}
                     >
                       <Columns className="h-4 w-4 mr-2" />
                       Kanban
                     </Button>
                     <Button
                       variant={visualizacao === 'timeline' ? 'primary' : 'outline'}
                       size="sm"
                       onClick={() => setVisualizacao('timeline')}
                     >
                       <Calendar className="h-4 w-4 mr-2" />
                       Timeline
                     </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
                {/* VISUALIZAÇÃO LISTA (Padrão) */}
                {visualizacao === 'lista' && (
                  <div className="space-y-6">
                    {projeto.etapas.map((etapa, etapaIndex) => (
                      <motion.div
                        key={etapa.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: etapaIndex * 0.1 }}
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* Cabeçalho da Etapa */}
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  Etapa {etapa.numero}: {etapa.nome}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {etapa.tarefas.length} tarefa(s)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{etapa.progresso}%</p>
                                <Progress value={etapa.progresso} className="w-24 h-2" />
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Tarefas da Etapa */}
                        <div className="p-4 space-y-3">
                          {etapa.tarefas.map((tarefa) => (
                            <motion.div
                              key={tarefa.id}
                              whileHover={{ scale: 1.01 }}
                              className="border rounded-lg p-4 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start space-x-3 flex-1">
                                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move mt-1" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h4 className="font-medium text-gray-900">{tarefa.nome}</h4>
                                      <Badge className={`text-xs ${getStatusColor(tarefa.status)}`}>
                                        <span className="flex items-center space-x-1">
                                          {getStatusIcon(tarefa.status)}
                                          <span>{tarefa.status.replace('_', ' ')}</span>
                                        </span>
                                      </Badge>
      </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                      <span className="flex items-center space-x-1">
                                        <User className="h-4 w-4" />
                                        <span>{tarefa.responsavel}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatarTempo(tarefa.tempo_total)} / {formatarTempo(tarefa.tempo_estimado)}</span>
                                      </span>
                                    </div>

                                    {/* Barra de progresso de tempo */}
                                    <div className="mb-3">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progresso de tempo</span>
                                        <span>{Math.round((tarefa.tempo_total / tarefa.tempo_estimado) * 100)}%</span>
                                      </div>
                                      <Progress 
                                        value={(tarefa.tempo_total / tarefa.tempo_estimado) * 100} 
                                        className={`h-2 ${
                                          tarefa.tempo_total > tarefa.tempo_estimado 
                                            ? '[&>div]:bg-red-500' 
                                            : '[&>div]:bg-blue-500'
                                        }`}
                                      />
                                    </div>

                                    {/* Cronômetro da tarefa */}
                                    {tarefa.cronometro_ativo && (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium text-blue-700">Sessão ativa</span>
                                          </div>
                                          <span className="font-mono font-bold text-blue-700">
                                            {formatarTempo(tarefa.tempo_sessao_atual)}
                                          </span>
                                        </div>
                                        {tarefa.anotacao_sessao_atual && (
                                          <p className="text-sm text-blue-600 mt-2">
                                            📝 {tarefa.anotacao_sessao_atual}
                                          </p>
                                        )}
                </div>
                                    )}

                                    {/* Revisões pendentes */}
                                    {tarefa.revisoes.length > 0 && (
                                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                        <div className="flex items-start space-x-2">
                                          <Eye className="h-4 w-4 text-yellow-500 mt-0.5" />
                                          <div>
                                            <p className="text-sm font-medium text-yellow-700">
                                              Feedback de revisão - {tarefa.revisoes[0].revisor}
                                            </p>
                                            <p className="text-sm text-yellow-600 mt-1">
                                              {tarefa.revisoes[0].comentarios}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
              </div>

                                {/* Botões de ação */}
                                <div className="flex flex-col space-y-2 ml-4">
                                  {tarefa.status === 'nao_iniciada' || tarefa.status === 'em_progresso' ? (
                                                                         <div className="flex space-x-1">
                                       <Button
                                         size="sm"
                                         variant={tarefa.cronometro_ativo ? "destructive" : "primary"}
                                         onClick={() => tarefa.cronometro_ativo ? pausarCronometro() : iniciarCronometro(tarefa.id)}
                                         className="h-8 w-8 p-0"
                                       >
                                         {tarefa.cronometro_ativo ? (
                                           <Pause className="h-4 w-4" />
                                         ) : (
                                           <Play className="h-4 w-4" />
                                         )}
                                       </Button>
                <Button
                                        size="sm"
                  variant="outline"
                                        className="h-8 w-8 p-0"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : null}
                                  
                                  {tarefa.status === 'em_progresso' && tarefa.requer_aprovacao && (
                                    <Button
                  size="sm"
                                      variant="outline"
                                      className="h-8 px-3 text-xs"
                >
                                      <Send className="h-3 w-3 mr-1" />
                                      Revisar
                </Button>
                                  )}

                                  {tarefa.status === 'em_revisao' && (
                                    <div className="flex space-x-1">
                                                                             <Button
                                         size="sm"
                                         variant="primary"
                                         className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                       >
                                         <CheckCircle2 className="h-4 w-4" />
                                       </Button>
                <Button
                                        size="sm"
                  variant="outline"
                                        className="h-8 w-8 p-0"
                >
                                        <Edit3 className="h-4 w-4" />
                </Button>
                                    </div>
                                  )}
                
                <Button
                  size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                >
                                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                                </div>
                              </div>

                              {/* Arquivos anexados */}
                              {tarefa.arquivos.length > 0 && (
                                <div className="border-t pt-3 mt-3">
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Paperclip className="h-4 w-4" />
                                    <span>{tarefa.arquivos.length} arquivo(s) anexado(s)</span>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* VISUALIZAÇÃO KANBAN */}
                {visualizacao === 'kanban' && (
                  <div className="grid grid-cols-4 gap-4">
                    {['nao_iniciada', 'em_progresso', 'em_revisao', 'concluida'].map((status) => (
                      <div key={status} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-4 capitalize">
                          {status.replace('_', ' ')}
                        </h3>
                        <div className="space-y-3">
                          {projeto.etapas.flatMap(etapa => 
                            etapa.tarefas.filter(tarefa => tarefa.status === status)
                          ).map((tarefa) => (
                            <div key={tarefa.id} className="bg-white rounded-lg p-3 shadow-sm border">
                              <h4 className="font-medium text-sm text-gray-900 mb-2">{tarefa.nome}</h4>
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>{tarefa.responsavel}</span>
                                <span>{formatarTempo(tarefa.tempo_total)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VISUALIZAÇÃO TIMELINE */}
                {visualizacao === 'timeline' && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline em Desenvolvimento</h3>
                    <p className="text-gray-600">A visualização em timeline estará disponível em breve.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 3. PAINEL DE COMUNICAÇÃO DA EQUIPE */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Comunicação</h2>
                    <p className="text-sm text-gray-600">Chat da equipe</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {/* Lista de mensagens */}
                <div className="flex-1 space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {projeto.comunicacao.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900 truncate">
                            {msg.usuario}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.data).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {msg.mensagem}
                        </p>
                        {msg.mencoes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.mencoes.map((mencao, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                @{mencao}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Campo de input para nova mensagem */}
                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem... Use @nome para mencionar"
                      value={mensagemChat}
                      onChange={(e) => setMensagemChat(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && mensagemChat.trim()) {
                          // Em produção: enviar mensagem
                          setMensagemChat('');
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!mensagemChat.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-gray-500">
                      Arraste arquivos aqui ou clique para anexar
                    </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      </div>
    </div>
  );
} 