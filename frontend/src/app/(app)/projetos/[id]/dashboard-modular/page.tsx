'use client';

// ===== DASHBOARD ENTERPRISE REDESIGN - FASE 1 =====
// Implementação com Progressive Disclosure, Loading States e Design System
// CORREÇÃO: Duplicações removidas + UX otimizada

import React, { useState, use, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, Play, Pause, Square, CheckCircle2, AlertTriangle, Clock,
  Users, MessageSquare, Bell, Settings, Eye, EyeOff, Plus, Edit3,
  List, Calendar, Columns, Upload, Send, Trash2, GripVertical,
  MoreHorizontal, User, ChevronDown, ChevronRight, Focus, FileText,
  Paperclip, Target, Search, Filter, Home, ArrowRight, Timer,
  Zap, TrendingUp, Activity, Save, ChevronUp, PanelRightClose,
  PanelRightOpen, Workflow, BarChart3, X, Download, ArrowLeft,
  DollarSign, TrendingDown, AlertCircle, Info, LayoutGrid,
  Maximize2, Minimize2
} from 'lucide-react';

// ===== IMPORTS DOS COMPONENTES E HOOKS =====
import { useTarefasCrud } from '@/hooks/useTarefasCrud';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useCronometro } from '@/hooks/useCronometro';
import { useProgressiveDisclosure } from '@/hooks/useProgressiveDisclosure';
import { useSmartLoading } from '@/hooks/useSmartLoading';
import { LoadingIndicator } from '@/design-system/molecules/LoadingIndicator';
import { ModoFoco } from '@/components/dashboard/ModoFoco';
import HistoricoAnotacoes from '@/components/dashboard/HistoricoAnotacoes';
import KanbanView from '@/components/dashboard/KanbanView';
import { ModalEdicao, ModalConfirmacao, FeedbackSucesso } from '@/components/crud/CrudModals';
import { formatarTempo, formatarTempoSimples, getStatusColor, getStatusIcon, CacheManager, debounce } from '@/utils/dashboard-formatters';
import { Projeto, Tarefa, Etapa, DashboardProps } from '@/types/dashboard';

// ===== DADOS TEMPORÁRIOS ESTRUTURADOS =====
const dadosProjetoTemp: Projeto = {
  id: "proj_001",
  nome: "Residência Unifamiliar - João Silva",
  cliente: "João Silva",
  gerente: "Arq. Maria Santos", 
  data_inicio: "2024-01-15",
  prazo_final: "2024-06-15",
  status: "em_progresso",
  progresso_geral: 45,
  tempo_total_estimado: 720000, // 200 horas em segundos
  tempo_total_trabalhado: 324000, // 90 horas em segundos
  etapas: [
    {
      id: "etapa_001",
      numero: 1,
      nome: "Projeto Arquitetônico",
      progresso: 80,
      status: "em_progresso",
      tarefas: [
        {
          id: "tarefa_001",
          nome: "Análise do Terreno e Levantamento Topográfico",
          status: "concluida",
          responsavel: "Eng. Carlos Lima",
          tempo_estimado: 28800, // 8 horas
          tempo_total: 32400, // 9 horas
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: "2024-01-15",
          data_conclusao: "2024-01-16",
          data_entrega: "2024-01-20",
          prioridade: "alta",
          requer_aprovacao: true,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: "tarefa_002", 
          nome: "Estudo de Viabilidade e Programa de Necessidades",
          status: "em_progresso",
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 36000, // 10 horas
          tempo_total: 25200, // 7 horas
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: "2024-01-17",
          data_entrega: "2024-01-25",
          prioridade: "alta",
          requer_aprovacao: true,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: "tarefa_003",
          nome: "Anteprojeto Arquitetônico",
          status: "nao_iniciada",
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 54000, // 15 horas
          tempo_total: 0,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_entrega: "2024-02-05",
          prioridade: "media",
          requer_aprovacao: true,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        }
      ]
    },
    {
      id: "etapa_002",
      numero: 2,
      nome: "Projeto Estrutural",
      progresso: 25,
      status: "em_planejamento",
      tarefas: [
        {
          id: "tarefa_004",
          nome: "Dimensionamento de Fundações",
          status: "nao_iniciada",
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 43200, // 12 horas
          tempo_total: 0,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_entrega: "2024-02-10",
          prioridade: "media",
          requer_aprovacao: true,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        },
        {
          id: "tarefa_005",
          nome: "Projeto de Vigas e Pilares",
          status: "em_revisao",
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 36000, // 10 horas
          tempo_total: 39600, // 11 horas
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: "2024-02-01", 
          data_entrega: "2024-01-22", // Atrasada
          prioridade: "alta",
          requer_aprovacao: true,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        }
      ]
    },
    {
      id: "etapa_003",
      numero: 3,
      nome: "Instalações",
      progresso: 0,
      status: "nao_iniciada",
      tarefas: [
        {
          id: "tarefa_006",
          nome: "Projeto Elétrico",
          status: "nao_iniciada",
          responsavel: "Eng. Paulo Elétrica",
          tempo_estimado: 28800, // 8 horas
          tempo_total: 0,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_entrega: "2024-02-20",
          prioridade: "baixa",
          requer_aprovacao: false,
          anotacao_sessao_atual: "",
          notas_sessoes: [],
          arquivos: [],
          revisoes: []
        }
      ]
    }
  ],
  comunicacao: [],
  equipe: [
    { id: "user_001", nome: "Arq. Maria Santos", cargo: "Gerente de Projeto", avatar: "👩‍💼", status: "online" },
    { id: "user_002", nome: "Eng. Carlos Lima", cargo: "Engenheiro Civil", avatar: "👨‍💻", status: "ocupado" },
    { id: "user_003", nome: "Eng. Roberto Silva", cargo: "Engenheiro Estrutural", avatar: "👨‍🔧", status: "online" },
    { id: "user_004", nome: "Eng. Paulo Elétrica", cargo: "Engenheiro Elétrico", avatar: "⚡", status: "offline" }
  ],
  atividades: [],
  arquivos: []
};

export default function DashboardModular({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // ===== ESTADOS PRINCIPAIS =====
  const [projeto, setProjeto] = useState<Projeto>({
    ...dadosProjetoTemp,
    id: projetoId
  });
  const [visualizacao, setVisualizacao] = useState<'lista' | 'kanban' | 'timeline'>('lista');

  // ===== PROGRESSIVE DISCLOSURE =====
  const disclosure = useProgressiveDisclosure('focus');
  
  // ===== SMART LOADING =====
  const { withLoading, loadingStates } = useSmartLoading();

  // ===== HOOKS EXISTENTES =====
  const [expandirEtapa, setExpandirEtapa] = useState<Record<string, boolean>>({});
  const [modalEdicao, setModalEdicao] = useState<{
    aberto: boolean;
    tipo: 'projeto' | 'etapa' | 'tarefa' | null;
    item: any;
  }>({ aberto: false, tipo: null, item: null });
  
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<{
    tipo: 'projeto' | 'etapa' | 'tarefa';
    id: string;
    nome: string;
  } | null>(null);
  
  const [feedbackSucesso, setFeedbackSucesso] = useState<{
    visivel: boolean;
    mensagem: string;
  }>({ visivel: false, mensagem: '' });

  const [modoFocoAtivo, setModoFocoAtivo] = useState(false);
  const [etapaSelecionada, setEtapaSelecionada] = useState<string | null>(null);
  const [painelLateralAberto, setPainelLateralAberto] = useState(true);

  // ===== HOOKS FUNCIONAIS =====
  const cronometroHook = useCronometro(projeto, setProjeto);
  const crudHook = useTarefasCrud(projeto, setProjeto, setModalEdicao, setConfirmacaoExclusao, setFeedbackSucesso);
  const dragHook = useDragAndDrop(projeto, setProjeto);

  // ===== CALCULATED VALUES =====
  const progressoGeral = useMemo(() => {
    if (!projeto.etapas || projeto.etapas.length === 0) return 0;
    const progressoTotal = projeto.etapas.reduce((acc, etapa) => acc + etapa.progresso, 0);
    return Math.round(progressoTotal / projeto.etapas.length);
  }, [projeto.etapas]);

  const calcularTempoTotalRealTime = () => {
    return projeto.etapas.reduce((total, etapa) => {
      return total + etapa.tarefas.reduce((etapaTotal, tarefa) => {
        return etapaTotal + tarefa.tempo_total + (tarefa.tempo_sessao_atual || 0);
      }, 0);
    }, 0);
  };

  const calcularDiasUteisRestantes = () => {
    const hoje = new Date();
    const prazoFinal = new Date(projeto.prazo_final);
    const diferenca = Math.ceil((prazoFinal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diferenca);
  };

  const estatisticasAvancadas = useMemo(() => {
    const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);
    
    const tarefasPorStatus = {
      nao_iniciada: todasTarefas.filter(t => t.status === 'nao_iniciada').length,
      em_progresso: todasTarefas.filter(t => t.status === 'em_progresso').length,
      em_revisao: todasTarefas.filter(t => t.status === 'em_revisao').length,
      concluida: todasTarefas.filter(t => t.status === 'concluida').length
    };

    const tempoTotalEstimado = todasTarefas.reduce((acc, tarefa) => acc + tarefa.tempo_estimado, 0);
    const tempoTotalTrabalhado = calcularTempoTotalRealTime();
    const eficiencia = tempoTotalEstimado > 0 ? (tempoTotalTrabalhado / tempoTotalEstimado) * 100 : 0;

    const proximasTarefas = todasTarefas
      .filter(tarefa => {
        if (tarefa.status === 'concluida') return false;
        if (!tarefa.data_entrega) return false;
        
        const entrega = new Date(tarefa.data_entrega);
        const hoje = new Date();
        const diasAteEntrega = Math.ceil((entrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        
        return diasAteEntrega <= 2;
      })
      .map(tarefa => ({
        ...tarefa,
        diasAteEntrega: Math.ceil((new Date(tarefa.data_entrega!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        labelPrazo: (() => {
          const dias = Math.ceil((new Date(tarefa.data_entrega!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          if (dias < 0) return 'Atrasada';
          if (dias === 0) return 'Hoje';
          if (dias === 1) return 'Amanhã';
          return `${dias} dias`;
        })(),
        corBadge: (() => {
          const dias = Math.ceil((new Date(tarefa.data_entrega!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          if (dias < 0) return 'bg-red-100 text-red-800';
          if (dias === 0) return 'bg-orange-100 text-orange-800';
          if (dias === 1) return 'bg-yellow-100 text-yellow-800';
          return 'bg-blue-100 text-blue-800';
        })()
      }))
      .sort((a, b) => a.diasAteEntrega - b.diasAteEntrega);

    return {
      tarefasPorStatus,
      tempoTotalEstimado,
      tempoTotalTrabalhado,
      eficiencia,
      proximasTarefas
    };
  }, [projeto.etapas]);

  // ===== HANDLERS COM LOADING =====
  const handleIniciarTarefa = useCallback(async (tarefaId: string) => {
    await withLoading('start-task', async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      cronometroHook.iniciarTarefa(tarefaId);
    }, {
      message: 'Iniciando tarefa...',
      successMessage: 'Tarefa iniciada!',
      estimatedDuration: 800
    });
  }, [withLoading, cronometroHook]);

  // ===== LEVEL SELECTOR COMPONENT =====
  const LevelSelector = () => (
    <div className="flex items-center space-x-2 bg-white rounded-lg border p-1">
      <Button
        variant={disclosure.isGlance ? 'default' : 'ghost'}
        size="sm"
        onClick={disclosure.goToGlance}
        className="h-8 px-3 text-xs"
      >
        <Eye className="h-3 w-3 mr-1" />
        Glance
      </Button>
      <Button
        variant={disclosure.isFocus ? 'default' : 'ghost'}
        size="sm"
        onClick={disclosure.goToFocus}
        className="h-8 px-3 text-xs"
      >
        <Target className="h-3 w-3 mr-1" />
        Focus
      </Button>
      <Button
        variant={disclosure.isDetail ? 'default' : 'ghost'}
        size="sm"
        onClick={disclosure.goToDetail}
        className="h-8 px-3 text-xs"
      >
        <BarChart3 className="h-3 w-3 mr-1" />
        Detail
      </Button>
    </div>
  );

  // ===== RETURN JSX - RENDERIZAÇÃO PRINCIPAL =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ===== LOADING OVERLAY GLOBAL ===== */}
      <AnimatePresence>
        {Object.values(loadingStates).some(state => state.loading) && (
          <LoadingIndicator 
            state={Object.values(loadingStates).find(state => state.loading)!}
            variant="overlay"
            size="lg"
          />
        )}
      </AnimatePresence>

      {/* ===== MODO FOCO ===== */}
      <AnimatePresence>
        {modoFocoAtivo && (
          <ModoFoco
            projeto={projeto}
            etapaSelecionada={etapaSelecionada}
            onFechar={() => setModoFocoAtivo(false)}
            onIniciarTarefa={handleIniciarTarefa}
            cronometroHook={cronometroHook}
          />
        )}
      </AnimatePresence>

      {/* ===== HEADER FIXO ===== */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{projeto.nome}</h1>
                  <p className="text-sm text-gray-600">Cliente: {projeto.cliente}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LevelSelector />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModoFocoAtivo(true)}
                  className="h-8"
                >
                  <Focus className="h-3 w-3 mr-1" />
                  Modo Foco
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPainelLateralAberto(!painelLateralAberto)}
                  className="h-8"
                >
                  {painelLateralAberto ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTAINER PRINCIPAL ===== */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ===== GLANCE MODE: OVERVIEW RÁPIDO ===== */}
        <AnimatePresence>
          {disclosure.shouldShow('glance') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader className="border-b bg-white/50">
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Building className="h-6 w-6" />
                    <span>Overview do Projeto</span>
                    {disclosure.isGlance && (
                      <Badge variant="secondary" className="ml-2">
                        Glance Mode
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Informações Básicas */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Cliente</label>
                          <p className="text-lg font-semibold text-gray-900">{projeto.cliente}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Gerente</label>
                          <p className="text-lg font-semibold text-gray-900">{projeto.gerente}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Início</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(projeto.data_inicio).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Prazo Final</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(projeto.prazo_final).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status e Progresso */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge className={`${getStatusColor(projeto.status)} text-white mt-1`}>
                          {projeto.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Progresso Geral</label>
                        <Progress value={progressoGeral} className="h-3" />
                        <p className="text-right text-sm font-semibold text-gray-700 mt-1">{progressoGeral}%</p>
                      </div>
                    </div>

                    {/* Dias Restantes */}
                    <div className="flex flex-col items-center justify-center bg-white/80 rounded-lg p-4">
                      <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                      <p className="text-3xl font-bold text-gray-900">{calcularDiasUteisRestantes()}</p>
                      <p className="text-sm text-gray-600">dias restantes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== FOCUS MODE: MÉTRICAS DE PRODUTIVIDADE ===== */}
        <AnimatePresence>
          {disclosure.shouldShow('focus') && (
            <motion.div
              initial={{ opacity: 0, y: disclosure.isGlance ? 0 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: disclosure.isGlance ? 0 : 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Tempo Trabalhado</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatarTempoSimples(calcularTempoTotalRealTime())}
                        </p>
                        <p className="text-xs text-blue-600">
                          de {formatarTempoSimples(estatisticasAvancadas.tempoTotalEstimado)} estimado
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Eficiência</p>
                        <p className="text-2xl font-bold text-green-900">
                          {estatisticasAvancadas.eficiencia.toFixed(1)}%
                        </p>
                        <p className="text-xs text-green-600">
                          {estatisticasAvancadas.eficiencia > 100 ? 'Acima do estimado' : 'Dentro do estimado'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Etapas</p>
                        <p className="text-2xl font-bold text-purple-900">{projeto.etapas.length}</p>
                        <p className="text-xs text-purple-600">
                          {projeto.etapas.filter(e => e.status === 'concluida').length} concluídas
                        </p>
                      </div>
                      <Workflow className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Equipe</p>
                        <p className="text-2xl font-bold text-orange-900">{projeto.equipe.length}</p>
                        <p className="text-xs text-orange-600">
                          {projeto.equipe.filter(m => m.status === 'online').length} online
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== PRÓXIMAS TAREFAS PRIORITÁRIAS ===== */}
        <AnimatePresence>
          {disclosure.shouldShow('focus') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>Próximas Tarefas Prioritárias</span>
                    </div>
                    <Badge variant="outline">
                      {estatisticasAvancadas.proximasTarefas.length} tarefas urgentes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estatisticasAvancadas.proximasTarefas.length > 0 ? (
                      estatisticasAvancadas.proximasTarefas.map((tarefa) => (
                        <motion.div 
                          key={tarefa.id} 
                          className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{tarefa.nome}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>👤 {tarefa.responsavel}</span>
                                <span>⏱️ {formatarTempoSimples(tarefa.tempo_estimado)}</span>
                                <Badge className={tarefa.corBadge}>
                                  {tarefa.labelPrazo}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {loadingStates['start-task']?.loading ? (
                              <LoadingIndicator 
                                state={loadingStates['start-task']} 
                                variant="inline" 
                                size="sm" 
                              />
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                onClick={() => handleIniciarTarefa(tarefa.id)}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                {tarefa.status === 'em_progresso' ? 'Continuar' : 'Iniciar'}
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm">
                          Nenhuma tarefa urgente para hoje ou amanhã! 🎉
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Todas as tarefas estão no prazo
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== DETAIL MODE: ANÁLISE DETALHADA ===== */}
        <AnimatePresence>
          {disclosure.isDetail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* ESTATÍSTICAS DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">Em Progresso</p>
                        <p className="text-2xl font-bold text-blue-800">{estatisticasAvancadas.tarefasPorStatus.em_progresso}</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-yellow-600">Em Revisão</p>
                        <p className="text-2xl font-bold text-yellow-800">{estatisticasAvancadas.tarefasPorStatus.em_revisao}</p>
                      </div>
                      <Eye className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Concluídas</p>
                        <p className="text-2xl font-bold text-green-800">{estatisticasAvancadas.tarefasPorStatus.concluida}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Não Iniciadas</p>
                        <p className="text-2xl font-bold text-gray-800">{estatisticasAvancadas.tarefasPorStatus.nao_iniciada}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Mais conteúdo detalhado seria adicionado aqui */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Análise Detalhada</span>
                    <Badge variant="secondary">Detail Mode</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Conteúdo de análise detalhada seria implementado aqui com gráficos, 
                    relatórios e métricas avançadas.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ===== MODALS EXISTENTES ===== */}
      {modalEdicao.aberto && (
        <ModalEdicao
          tipo={modalEdicao.tipo}
          item={modalEdicao.item}
          onSalvar={crudHook.handleSalvarEdicao}
          onFechar={() => setModalEdicao({ aberto: false, tipo: null, item: null })}
        />
      )}

      {confirmacaoExclusao && (
        <ModalConfirmacao
          tipo={confirmacaoExclusao.tipo}
          nome={confirmacaoExclusao.nome}
          onConfirmar={() => crudHook.handleConfirmarExclusao(confirmacaoExclusao.id)}
          onCancelar={() => setConfirmacaoExclusao(null)}
        />
      )}

      <FeedbackSucesso
        visivel={feedbackSucesso.visivel}
        mensagem={feedbackSucesso.mensagem}
        onFechar={() => setFeedbackSucesso({ visivel: false, mensagem: '' })}
      />
    </div>
  );
} 