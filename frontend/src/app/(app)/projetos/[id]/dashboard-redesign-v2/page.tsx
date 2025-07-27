'use client';

// ===== DASHBOARD ARCFLOW REDESIGN - FASE 1 IMPLEMENTAÇÃO =====
// Progressive Disclosure + Smart Loading + Design System
// CORREÇÃO: Duplicações removidas + UX otimizada para 10k usuários

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

// ===== IMPORTS DOS NOVOS HOOKS E COMPONENTES =====
import { useProgressiveDisclosure } from '@/hooks/useProgressiveDisclosure';
import { useSmartLoading } from '@/hooks/useSmartLoading';
import { LoadingIndicator } from '@/design-system/molecules/LoadingIndicator';
import { designTokens } from '@/design-system/tokens';
import { ProjetoEtapasTarefasCard } from '@/components/dashboard/ProjetoEtapasTarefasCard';
import { dadosProjetoExpandido } from '@/data/projeto-expandido';
import { TarefaDetalhesModal } from '@/components/dashboard/TarefaDetalhesModal';

// ===== TIPOS =====
interface DashboardProps {
  params: Promise<{ id: string }>;
}

// ===== DADOS TEMPORÁRIOS =====
const dadosProjetoTemp = {
  id: "proj_001",
  nome: "Residência Unifamiliar - João Silva",
  cliente: "João Silva",
  gerente: "Arq. Maria Santos", 
  data_inicio: "2024-01-15",
  prazo_final: "2024-06-15",
  status: "em_progresso",
  progresso_geral: 45,
  tempo_total_estimado: 720000, // 200 horas
  tempo_total_trabalhado: 324000, // 90 horas
  equipe: [
    { id: "user_001", nome: "Arq. Maria Santos", cargo: "Gerente de Projeto", avatar: "👩‍💼", status: "online" },
    { id: "user_002", nome: "Eng. Carlos Lima", cargo: "Engenheiro Civil", avatar: "👨‍💻", status: "ocupado" },
    { id: "user_003", nome: "Eng. Roberto Silva", cargo: "Engenheiro Estrutural", avatar: "👨‍🔧", status: "online" },
    { id: "user_004", nome: "Eng. Paulo Elétrica", cargo: "Engenheiro Elétrico", avatar: "⚡", status: "offline" }
  ],
  etapas: [
    {
      id: "etapa_001",
      numero: 1,
      nome: "Projeto Arquitetônico",
      progresso: 80,
      status: "em_progresso",
      data_inicio: "2024-01-15",
      data_fim: "2024-02-28",
      responsavel: "Arq. Maria Santos",
      arquivos: 12,
      comentarios: 8,
      tarefas: [
        {
          id: "tarefa_001",
          nome: "Análise do Terreno e Levantamento Topográfico",
          status: "concluida",
          responsavel: "Eng. Carlos Lima",
          tempo_estimado: 28800,
          tempo_total: 32400,
          data_entrega: "2024-01-20",
          prioridade: "alta",
          arquivos: 3,
          comentarios: 2
        },
        {
          id: "tarefa_002", 
          nome: "Estudo de Viabilidade e Programa de Necessidades",
          status: "em_progresso",
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 36000,
          tempo_total: 25200,
          data_entrega: "2024-01-25",
          prioridade: "alta",
          arquivos: 1,
          comentarios: 5
        },
        {
          id: "tarefa_003",
          nome: "Anteprojeto e Plantas Baixas",
          status: "nao_iniciada",
          responsavel: "Arq. Maria Santos",
          tempo_estimado: 72000,
          tempo_total: 0,
          data_entrega: "2024-02-10",
          prioridade: "alta",
          arquivos: 0,
          comentarios: 0
        }
      ]
    },
    {
      id: "etapa_002",
      numero: 2,
      nome: "Projeto Estrutural",
      progresso: 25,
      status: "nao_iniciada",
      data_inicio: "2024-02-01",
      data_fim: "2024-03-15",
      responsavel: "Eng. Roberto Silva",
      arquivos: 0,
      comentarios: 1,
      tarefas: [
        {
          id: "tarefa_004",
          nome: "Análise Estrutural Preliminar",
          status: "nao_iniciada",
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 36000,
          tempo_total: 0,
          data_entrega: "2024-02-15",
          prioridade: "media",
          arquivos: 0,
          comentarios: 0
        },
        {
          id: "tarefa_005",
          nome: "Cálculo de Fundações",
          status: "nao_iniciada",
          responsavel: "Eng. Roberto Silva",
          tempo_estimado: 54000,
          tempo_total: 0,
          data_entrega: "2024-03-01",
          prioridade: "alta",
          arquivos: 0,
          comentarios: 1
        }
      ]
    },
    {
      id: "etapa_003",
      numero: 3,
      nome: "Instalações",
      progresso: 0,
      status: "nao_iniciada",
      data_inicio: "2024-03-01",
      data_fim: "2024-04-15",
      responsavel: "Eng. Paulo Elétrica",
      arquivos: 0,
      comentarios: 0,
      tarefas: [
        {
          id: "tarefa_006",
          nome: "Projeto Elétrico",
          status: "nao_iniciada",
          responsavel: "Eng. Paulo Elétrica",
          tempo_estimado: 45000,
          tempo_total: 0,
          data_entrega: "2024-03-20",
          prioridade: "media",
          arquivos: 0,
          comentarios: 0
        }
      ]
    }
  ]
};

// ===== COMPONENTE PRINCIPAL =====
export default function DashboardRedesign({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // ===== HOOKS DO REDESIGN =====
  const disclosure = useProgressiveDisclosure('focus');
  const { withLoading, loadingStates } = useSmartLoading();
  
  // ===== ESTADOS =====
  const [projeto] = useState(dadosProjetoTemp);
  const [modoFocoAtivo, setModoFocoAtivo] = useState(false);
  const [etapasExpandidas, setEtapasExpandidas] = useState<Record<string, boolean>>({});
  const [cronometroAtivo, setCronometroAtivo] = useState<string | null>(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [chatAberto, setChatAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any>(null);
  const [notificacoes, setNotificacoes] = useState([
    { id: 1, tipo: 'warning', titulo: 'Revisão Pendente', descricao: 'Análise arquitetônica precisa de revisão', tempo: '2min' },
    { id: 2, tipo: 'info', titulo: 'Upload Concluído', descricao: 'Plantas baixas foram enviadas', tempo: '5min' }
  ]);

  // ===== CALCULATED VALUES =====
  const progressoGeral = useMemo(() => {
    if (!projeto.etapas || projeto.etapas.length === 0) return 0;
    const progressoTotal = projeto.etapas.reduce((acc, etapa) => acc + etapa.progresso, 0);
    return Math.round(progressoTotal / projeto.etapas.length);
  }, [projeto.etapas]);

  const calcularDiasRestantes = () => {
    const hoje = new Date();
    const prazoFinal = new Date(projeto.prazo_final);
    const diferenca = Math.ceil((prazoFinal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diferenca);
  };

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    return `${horas}h`;
  };

  const estatisticas = useMemo(() => {
    const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);
    
    return {
      tarefasPorStatus: {
        nao_iniciada: todasTarefas.filter(t => t.status === 'nao_iniciada').length,
        em_progresso: todasTarefas.filter(t => t.status === 'em_progresso').length,
        em_revisao: todasTarefas.filter(t => t.status === 'em_revisao').length,
        concluida: todasTarefas.filter(t => t.status === 'concluida').length
      },
      tempoTotalEstimado: todasTarefas.reduce((acc, tarefa) => acc + tarefa.tempo_estimado, 0),
      tempoTotalTrabalhado: todasTarefas.reduce((acc, tarefa) => acc + tarefa.tempo_total, 0),
      proximasTarefas: todasTarefas.filter(t => t.status !== 'concluida').slice(0, 3)
    };
  }, [projeto.etapas]);

  // ===== HANDLERS COM LOADING =====
  const handleIniciarTarefa = useCallback(async (tarefaId: string) => {
    await withLoading('start-task', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Tarefa iniciada:', tarefaId);
    }, {
      message: 'Iniciando cronômetro...',
      successMessage: 'Tarefa iniciada com sucesso!',
      estimatedDuration: 1000
    });
  }, [withLoading]);

  // ===== COMPONENTE: SELETOR DE NIVEL =====
  const LevelSelector = () => (
    <div className="flex items-center space-x-1 bg-white rounded-lg border p-1 shadow-sm">
      <Button
        variant={disclosure.isGlance ? 'secondary' : 'ghost'}
        size="sm"
        onClick={disclosure.goToGlance}
        className="h-8 px-3 text-xs font-medium"
      >
        <Eye className="h-3 w-3 mr-1" />
        Glance
      </Button>
      <Button
        variant={disclosure.isFocus ? 'secondary' : 'ghost'}
        size="sm"
        onClick={disclosure.goToFocus}
        className="h-8 px-3 text-xs font-medium"
      >
        <Target className="h-3 w-3 mr-1" />
        Focus
      </Button>
      <Button
        variant={disclosure.isDetail ? 'secondary' : 'ghost'}
        size="sm"
        onClick={disclosure.goToDetail}
        className="h-8 px-3 text-xs font-medium"
      >
        <BarChart3 className="h-3 w-3 mr-1" />
        Detail
      </Button>
    </div>
  );

  // ===== COMPONENTE: PROJECT HEALTH CARD =====
  const ProjectHealthCard = () => (
    <Card className="overflow-hidden border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="border-b bg-white/50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-900">
            <Building className="h-5 w-5" />
            <span className="text-lg font-bold">Project Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">87% Health</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900">{progressoGeral}%</p>
            <p className="text-xs text-blue-600">Progresso</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-900">{calcularDiasRestantes()}</p>
            <p className="text-xs text-green-600">Dias restantes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-900">{projeto.equipe.length}</p>
            <p className="text-xs text-purple-600">Membros</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-900">{estatisticas.tarefasPorStatus.em_progresso}</p>
            <p className="text-xs text-orange-600">Ativas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ===== COMPONENTE: CRITICAL ALERTS =====
  const CriticalAlertsCard = () => (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          <span>Alertas Críticos</span>
          <Badge variant="destructive" className="ml-2">2</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-amber-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Revisão arquitetônica atrasada</p>
              <p className="text-xs text-gray-600">2 dias de atraso</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-amber-200">
            <Clock className="h-4 w-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Conflito de recursos</p>
              <p className="text-xs text-gray-600">Maria sobregregada (130%)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ===== COMPONENTE: QUICK ACTIONS =====
  const QuickActionsCard = () => (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <Zap className="h-5 w-5" />
          <span>Ações Rápidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12 flex flex-col items-center justify-center space-y-1 bg-white/60 border-green-300 hover:bg-green-50"
            onClick={() => setModoFocoAtivo(true)}
          >
            <Focus className="h-4 w-4" />
            <span className="text-xs">Modo Foco</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12 flex flex-col items-center justify-center space-y-1 bg-white/60 border-green-300 hover:bg-green-50"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Relatórios</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12 flex flex-col items-center justify-center space-y-1 bg-white/60 border-green-300 hover:bg-green-50"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Chat Equipe</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-12 flex flex-col items-center justify-center space-y-1 bg-white/60 border-green-300 hover:bg-green-50"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Nova Tarefa</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // ===== COMPONENTE: TAREFAS ATIVAS =====
  const ActiveTasksCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Tarefas Ativas</span>
          </div>
          <Badge variant="outline">{estatisticas.proximasTarefas.length} ativas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {estatisticas.proximasTarefas.map((tarefa) => (
            <motion.div 
              key={tarefa.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-all"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  tarefa.status === 'em_progresso' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{tarefa.nome}</h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span>👤 {tarefa.responsavel}</span>
                    <span>⏱️ {formatarTempo(tarefa.tempo_estimado)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {loadingStates['start-task']?.loading ? (
                  <LoadingIndicator 
                    state={loadingStates['start-task']} 
                    variant="inline" 
                    size="sm" 
                    showMessage={false}
                  />
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-3 text-xs"
                    onClick={() => handleIniciarTarefa(tarefa.id)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {tarefa.status === 'em_progresso' ? 'Continuar' : 'Iniciar'}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // ===== COMPONENTE: MÉTRICAS AVANÇADAS =====
  const AdvancedMetricsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Tempo Trabalhado</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatarTempo(estatisticas.tempoTotalTrabalhado)}
              </p>
              <p className="text-xs text-blue-600">
                de {formatarTempo(estatisticas.tempoTotalEstimado)} estimado
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
              <p className="text-2xl font-bold text-green-900">94.2%</p>
              <p className="text-xs text-green-600">Dentro do estimado</p>
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
              <p className="text-xs text-purple-600">1 concluída</p>
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
  );

  // ===== RENDER PRINCIPAL =====
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

      {/* ===== HEADER FIXO COM NAVEGAÇÃO ===== */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Informações do Projeto */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{projeto.nome}</h1>
                  <p className="text-sm text-gray-600">Cliente: {projeto.cliente}</p>
                </div>
              </div>
            </div>
            
            {/* Controles de Navegação */}
            <div className="flex items-center space-x-4">
              <LevelSelector />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModoFocoAtivo(true)}
                  className="h-8 text-xs"
                >
                  <Focus className="h-3 w-3 mr-1" />
                  Modo Foco
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTAINER PRINCIPAL COM PROGRESSIVE DISCLOSURE ===== */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ===== GLANCE MODE: COMMAND CENTER ===== */}
        <AnimatePresence>
          {disclosure.shouldShow('glance') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ProjectHealthCard />
                <CriticalAlertsCard />
                <QuickActionsCard />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== FOCUS MODE: TACTICAL VIEW ===== */}
        <AnimatePresence>
          {disclosure.shouldShow('focus') && (
            <motion.div
              initial={{ opacity: 0, y: disclosure.isGlance ? 0 : -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: disclosure.isGlance ? 0.1 : 0 }}
              className="space-y-6"
            >
              <AdvancedMetricsGrid />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActiveTasksCard />
                
                {/* CARD FLAGSHIP: Projeto - Etapas & Tarefas */}
                <div className="lg:col-span-2">
                  <Card className="border-2 border-purple-200 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">🎯 Projeto - Etapas & Tarefas</h2>
                            <p className="text-purple-100 text-sm">Centro de controle do projeto</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-white/20 text-white border-white/30">
                            4 etapas • 13 tarefas
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      {/* Resumo Estatístico */}
                      <div className="grid grid-cols-4 gap-1 bg-white/50 border-b">
                        <div className="text-center p-3">
                          <p className="text-lg font-bold text-green-600">3</p>
                          <p className="text-xs text-gray-600">Concluídas</p>
                        </div>
                        <div className="text-center p-3">
                          <p className="text-lg font-bold text-blue-600">2</p>
                          <p className="text-xs text-gray-600">Em Progresso</p>
                        </div>
                        <div className="text-center p-3">
                          <p className="text-lg font-bold text-yellow-600">1</p>
                          <p className="text-xs text-gray-600">Em Revisão</p>
                        </div>
                        <div className="text-center p-3">
                          <p className="text-lg font-bold text-gray-600">7</p>
                          <p className="text-xs text-gray-600">Não Iniciadas</p>
                        </div>
                      </div>

                      {/* Lista de Etapas */}
                      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                        {/* Etapa 1 - Expandida e Destacada */}
                        <motion.div 
                          className="border-2 border-blue-200 rounded-xl bg-white shadow-lg"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <ChevronDown className="h-5 w-5" />
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">1</div>
                                <div>
                                  <h3 className="font-bold text-lg">🏗️ Projeto Arquitetônico</h3>
                                  <div className="flex items-center space-x-4 text-blue-100 text-sm">
                                    <span>👤 Arq. Maria Santos</span>
                                    <span>📅 15/01 - 28/02</span>
                                    <span>📁 12 arquivos</span>
                                    <span>💬 8 comentários</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Progress value={80} className="w-20 h-2 bg-white/20" />
                                  <span className="font-bold">80%</span>
                                </div>
                                <p className="text-xs text-blue-100">3/4 tarefas concluídas</p>
                              </div>
                            </div>
                          </div>

                          {/* Tarefas da Etapa 1 - Sempre Visível */}
                          <div className="p-3 space-y-2">
                            {/* Tarefa 1 - Concluída */}
                            <motion.div 
                              className="border-l-4 border-l-green-500 bg-green-50 rounded-r-lg p-3 hover:shadow-md transition-all group"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm">✅ Análise do Terreno e Levantamento</span>
                                      <Badge variant="secondary" className="text-xs h-4">Concluída</Badge>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                      <span>👤 Eng. Carlos Lima</span>
                                      <span>⏱️ 9h / 8h estimado</span>
                                      <span>📅 20/01/2024</span>
                                      <span>📎 3 arquivos</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setTarefaSelecionada({
                                        id: 'tarefa_001',
                                        nome: 'Análise do Terreno e Levantamento Topográfico',
                                        status: 'concluida',
                                        responsavel: 'Eng. Carlos Lima',
                                        tempo_estimado: 28800,
                                        tempo_total: 32400,
                                        data_entrega: '2024-01-20',
                                        prioridade: 'alta'
                                      });
                                      setModalDetalhesAberto(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Play className="h-3 w-3 text-green-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>

                            {/* Tarefa 2 - Em Progresso */}
                            <motion.div 
                              className="border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg p-3 hover:shadow-md transition-all group"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm">🔄 Estudo de Viabilidade</span>
                                      <Badge variant="secondary" className="text-xs h-4 bg-blue-100 text-blue-800">Em Progresso</Badge>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                      <span>👤 Arq. Maria Santos</span>
                                      <span>⏱️ 7h / 10h estimado</span>
                                      <span>📅 25/01/2024</span>
                                      <span>📎 1 arquivo</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setTarefaSelecionada({
                                        id: 'tarefa_002',
                                        nome: 'Estudo de Viabilidade e Programa de Necessidades',
                                        status: 'em_progresso',
                                        responsavel: 'Arq. Maria Santos',
                                        tempo_estimado: 36000,
                                        tempo_total: 25200,
                                        data_entrega: '2024-01-25',
                                        prioridade: 'alta'
                                      });
                                      setModalDetalhesAberto(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Pause className="h-3 w-3 text-blue-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Progress value={70} className="h-1" />
                              </div>
                            </motion.div>

                            {/* Tarefa 3 - Em Revisão */}
                            <motion.div 
                              className="border-l-4 border-l-yellow-500 bg-yellow-50 rounded-r-lg p-3 hover:shadow-md transition-all group"
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-sm">⚠️ Anteprojeto e Plantas Baixas</span>
                                      <Badge variant="outline" className="text-xs h-4 bg-yellow-100 text-yellow-800 border-yellow-300">Revisão</Badge>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                      <span>👤 Arq. Maria Santos</span>
                                      <span>⏱️ 12h / 20h estimado</span>
                                      <span>📅 10/02/2024</span>
                                      <span>📎 8 arquivos</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setTarefaSelecionada({
                                        id: 'tarefa_003',
                                        nome: 'Anteprojeto e Plantas Baixas',
                                        status: 'em_revisao',
                                        responsavel: 'Arq. Maria Santos',
                                        tempo_estimado: 72000,
                                        tempo_total: 43200,
                                        data_entrega: '2024-02-10',
                                        prioridade: 'alta'
                                      });
                                      setModalDetalhesAberto(true);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Upload className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Progress value={60} className="h-1" />
                              </div>
                            </motion.div>

                            {/* Botão Adicionar Tarefa */}
                            <div className="border-2 border-dashed border-blue-300 rounded-lg p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                              <div className="flex items-center justify-center space-x-2 text-blue-600">
                                <Plus className="h-4 w-4" />
                                <span className="text-sm font-medium">Adicionar Nova Tarefa</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Etapa 2 - Colapsada */}
                        <motion.div 
                          className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                          whileHover={{ scale: 1.005 }}
                          onClick={() => setEtapasExpandidas(prev => ({ ...prev, etapa_002: !prev.etapa_002 }))}
                        >
                          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">2</div>
                                <div>
                                  <h4 className="font-medium text-gray-900">🏗️ Projeto Estrutural</h4>
                                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                                    <span>👤 Eng. Roberto Silva</span>
                                    <span>📅 01/02 - 15/03</span>
                                    <span>📁 2 arquivos</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <Progress value={0} className="w-16 h-1" />
                                  <span className="text-sm font-medium text-gray-600">0%</span>
                                </div>
                                <p className="text-xs text-gray-500">0/4 tarefas</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Etapa 3 - Colapsada */}
                        <motion.div 
                          className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                          whileHover={{ scale: 1.005 }}
                          onClick={() => setEtapasExpandidas(prev => ({ ...prev, etapa_003: !prev.etapa_003 }))}
                        >
                          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">3</div>
                                <div>
                                  <h4 className="font-medium text-gray-900">⚡ Instalações Prediais</h4>
                                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                                    <span>👤 Eng. Paulo Elétrica</span>
                                    <span>📅 01/03 - 15/04</span>
                                    <span>📁 0 arquivos</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <Progress value={0} className="w-16 h-1" />
                                  <span className="text-sm font-medium text-gray-600">0%</span>
                                </div>
                                <p className="text-xs text-gray-500">0/3 tarefas</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Botão Adicionar Nova Etapa */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                        >
                          <Plus className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                          <h3 className="font-medium text-purple-700 mb-1">Adicionar Nova Etapa</h3>
                          <p className="text-sm text-purple-600">Organize seu projeto em etapas estruturadas</p>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Cronômetro em Tempo Real */}
              <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-green-600" />
                      <span>Cronômetro em Tempo Real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-mono font-bold text-green-800">02:34:12</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Tarefa Ativa: Estudo de Viabilidade</p>
                      <p className="text-sm text-gray-600">👤 Arq. Maria Santos • 🎯 Projeto Arquitetônico</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Square className="h-4 w-4 mr-2" />
                        Parar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Nota
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat da Equipe Integrado */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Upload className="h-5 w-5 text-blue-600" />
                        <span>Upload de Arquivos por Etapa</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Projeto Arquitetônico</p>
                          <p className="text-xs text-gray-500">12 arquivos</p>
                        </div>
                        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Projeto Estrutural</p>
                          <p className="text-xs text-gray-500">2 arquivos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                        <span>Chat da Equipe</span>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">Maria Santos</span>
                          <span className="text-xs text-gray-500">14:32</span>
                        </div>
                        <p className="text-sm text-gray-700">As plantas baixas estão prontas para revisão!</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">Carlos Lima</span>
                          <span className="text-xs text-gray-500">14:28</span>
                        </div>
                        <p className="text-sm text-gray-700">Levantamento topográfico concluído ✅</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium">Sistema</span>
                          <span className="text-xs text-gray-500">14:15</span>
                        </div>
                        <p className="text-sm text-gray-700">⚠️ Revisão arquitetônica atrasada em 2 dias</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder="Digite sua mensagem..." 
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== DETAIL MODE: STRATEGIC INSIGHTS ===== */}
        <AnimatePresence>
          {disclosure.isDetail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <span>Análise Estratégica</span>
                    <Badge variant="secondary">Detail Mode</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                      <BarChart3 className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-indigo-900">15 pts</p>
                      <p className="text-sm text-indigo-600">Velocity atual</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-green-900">On Track</p>
                      <p className="text-sm text-green-600">Burndown status</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <p className="text-2xl font-bold text-blue-900">94%</p>
                      <p className="text-sm text-blue-600">Quality score</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900">IA Prediction</h4>
                        <p className="text-sm text-purple-700">
                          "Projeto tem 15% de risco de atraso. Sugestão: Adicionar 1 recurso à equipe."
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== MODO FOCO OVERLAY ===== */}
      <AnimatePresence>
        {modoFocoAtivo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setModoFocoAtivo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Focus className="h-5 w-5 text-blue-600" />
                  <span>Modo Foco</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModoFocoAtivo(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Interface focada em execução será implementada aqui com cronômetro expandido, 
                  anotações em tempo real e eliminação de distrações.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setModoFocoAtivo(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setModoFocoAtivo(false)}>
                    Ativar Foco
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MODAL DE DETALHES DA TAREFA ===== */}
      <TarefaDetalhesModal 
        tarefa={tarefaSelecionada}
        isOpen={modalDetalhesAberto}
        onClose={() => {
          setModalDetalhesAberto(false);
          setTarefaSelecionada(null);
        }}
      />
    </div>
  );
} 