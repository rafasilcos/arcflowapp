// ===== DASHBOARD V8 MODULAR COMPLETO - CONECTADO COM BACKEND =====
'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
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
  PanelRightOpen, Workflow, BarChart3, X, Download, ArrowLeft,
  Edit, Copy, Move, RotateCcw, Check, AlertCircle, Trash,
  RefreshCw, Share2, Maximize2, Loader2, Info, DollarSign, LogOut,
  Wifi, WifiOff, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== IMPORTS PARA CONEXÃO COM BACKEND =====
import { useBackendConnection } from '@/hooks/useBackendConnection';
import { BackendConnectionTest } from '@/components/debug/BackendConnectionTest';

// ===== IMPORTS DOS MÓDULOS =====
import { CardsMetricas } from '@/components/dashboard/CardsMetricas';
import { ModoFoco } from '@/components/dashboard/ModoFoco';
import { AlertasStatusCriticos } from '@/components/dashboard/AlertasStatusCriticos';
import { ProdutividadeHoje } from '@/components/dashboard/ProdutividadeHoje';
import { AprovacoesPendentes } from '@/components/dashboard/AprovacoesPendentes';
import { ComunicacaoEquipe } from '@/components/dashboard/ComunicacaoEquipe';
import { AtividadesRecentes } from '@/components/dashboard/AtividadesRecentes';
import { ArquivosProjeto } from '@/components/dashboard/ArquivosProjeto';
import { cronometroService } from '@/services/cronometroService';
import { alertasService } from '@/services/alertasService';
import { ProdutividadeService } from '@/services/produtividadeService';

// ===== IMPORTS DOS TIPOS =====
import { 
  Projeto, 
  Tarefa, 
  Etapa, 
  DashboardProps,
  EstadoDashboard,
  EstadoTooltips 
} from '@/types/dashboard-core';

// ===== COMPONENTE PRINCIPAL =====
export default function DashboardV8ModularCompleto({ params }: DashboardProps) {
  const resolvedParams = use(params);
  const projetoId = resolvedParams.id;

  // ===== CONEXÃO COM BACKEND =====
  const {
    isConnected,
    isLoading: backendLoading,
    error: backendError,
    user,
    currentProject,
    cronometroAtivo,
    loadProject,
    startTimer,
    stopTimer,
    loadDashboardData,
    reconnect
  } = useBackendConnection(projetoId);

  // ===== ESTADOS PRINCIPAIS =====
  const [estado, setEstado] = useState<EstadoDashboard>({
    projeto: {
      id: projetoId,
      nome: 'Carregando projeto...',
      cliente: 'Carregando...',
      gerente: user?.name || 'Carregando...',
      data_inicio: new Date().toISOString().split('T')[0],
      prazo_final: new Date().toISOString().split('T')[0],
      status: 'em_andamento',
      progresso_geral: 0,
      tempo_total_estimado: 0,
      tempo_total_trabalhado: 0,
      etapas: [],
      comunicacao: [],
      equipe: [],
      atividades: [],
      arquivos: []
    },
    cronometroAtivo: !!cronometroAtivo,
    tarefaAtiva: cronometroAtivo?.atividadeId || null,
    tempoSessaoAtual: cronometroAtivo?.elapsedTime || 0,
    numeroSessoes: 1,
    anotacaoSessao: '',
    anotacaoSalva: false,
    modoFoco: false,
    tarefaModoFoco: null,
    etapasExpandidas: new Set(['etapa_001', 'etapa_002']),
    visualizacao: 'lista' as 'lista' | 'kanban' | 'timeline'
  });

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // ===== EFEITOS PARA CARREGAR DADOS =====
  useEffect(() => {
    if (currentProject) {
      setEstado(prev => ({
        ...prev,
        projeto: {
          ...prev.projeto,
          id: currentProject.id,
          nome: currentProject.nome || 'Projeto sem nome',
          cliente: currentProject.cliente?.nome || 'Cliente não informado',
          status: currentProject.status || 'em_andamento',
          progresso_geral: currentProject.progresso || 0,
          gerente: user?.name || 'Não informado'
        }
      }));
    }
  }, [currentProject, user]);

  useEffect(() => {
    if (cronometroAtivo) {
      setEstado(prev => ({
        ...prev,
        cronometroAtivo: true,
        tarefaAtiva: cronometroAtivo.atividadeId,
        tempoSessaoAtual: cronometroAtivo.elapsedTime || 0
      }));
    } else {
      setEstado(prev => ({
        ...prev,
        cronometroAtivo: false,
        tarefaAtiva: null,
        tempoSessaoAtual: 0
      }));
    }
  }, [cronometroAtivo]);

  // ===== FUNÇÕES DE CRONÔMETRO =====
  const formatarTempo = useCallback((segundos: number): string => {
    return ProdutividadeService.formatarTempo(segundos);
  }, []);

  const formatarTempoSimples = useCallback((segundos: number): string => {
    return ProdutividadeService.formatarTempoSimples(segundos);
  }, []);

  const formatarTempoTotalRealTime = useCallback((): string => {
    const tempoTotal = estado.projeto.tempo_total_trabalhado + estado.tempoSessaoAtual;
    return formatarTempo(tempoTotal);
  }, [estado.projeto.tempo_total_trabalhado, estado.tempoSessaoAtual, formatarTempo]);

  // ===== FUNÇÕES DE CONTROLE =====
  const iniciarTarefa = useCallback(async (tarefaId: string) => {
    if (!isConnected) {
      alert('Sem conexão com o servidor');
      return;
    }

    try {
      await startTimer(projetoId, tarefaId, 'Iniciado via dashboard');
      setEstado(prev => ({
        ...prev,
        cronometroAtivo: true,
        tarefaAtiva: tarefaId,
        tempoSessaoAtual: 0
      }));
    } catch (error: any) {
      alert(`Erro ao iniciar cronômetro: ${error.message}`);
    }
  }, [isConnected, projetoId, startTimer]);

  const pausarTarefa = useCallback(async () => {
    if (!cronometroAtivo || !isConnected) return;

    try {
      await stopTimer(cronometroAtivo.id, estado.anotacaoSessao);
      setEstado(prev => ({
        ...prev,
        cronometroAtivo: false,
        tarefaAtiva: null,
        tempoSessaoAtual: 0,
        anotacaoSessao: ''
      }));
    } catch (error: any) {
      alert(`Erro ao pausar cronômetro: ${error.message}`);
    }
  }, [cronometroAtivo, isConnected, stopTimer, estado.anotacaoSessao]);

  const concluirTarefa = useCallback(async (tarefaId: string) => {
    if (cronometroAtivo && isConnected) {
      await stopTimer(cronometroAtivo.id, 'Tarefa concluída');
    }
    
    setEstado(prev => ({
      ...prev,
      cronometroAtivo: false,
      tarefaAtiva: null,
      tempoSessaoAtual: 0,
      projeto: {
        ...prev.projeto,
        etapas: prev.projeto.etapas.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas.map(tarefa =>
            tarefa.id === tarefaId
              ? { ...tarefa, status: 'concluida', data_conclusao: new Date().toISOString().split('T')[0] }
              : tarefa
          )
        }))
      }
    }));
  }, [cronometroAtivo, isConnected, stopTimer]);

  const sairDaTarefa = useCallback(async () => {
    if (cronometroAtivo && isConnected) {
      await stopTimer(cronometroAtivo.id, 'Saiu da tarefa');
    }
    
    setEstado(prev => ({
      ...prev,
      cronometroAtivo: false,
      tarefaAtiva: null,
      tempoSessaoAtual: 0,
      modoFoco: false
    }));
  }, [cronometroAtivo, isConnected, stopTimer]);

  const salvarNota = useCallback(() => {
    setEstado(prev => ({ ...prev, anotacaoSalva: true }));
    setTimeout(() => {
      setEstado(prev => ({ ...prev, anotacaoSalva: false }));
    }, 2000);
  }, []);

  // ===== CARREGAR DADOS DO DASHBOARD =====
  const carregarDashboard = useCallback(async () => {
    if (!isConnected || !user) return;

    try {
      const data = await loadDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  }, [isConnected, user, loadDashboardData]);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  // ===== DADOS CALCULADOS =====
  const tarefasConcluidas = estado.projeto.etapas
    .flatMap(e => e.tarefas)
    .filter(t => t.status === 'concluida' || t.status === 'aprovada').length;

  const totalTarefas = estado.projeto.etapas
    .flatMap(e => e.tarefas).length;

  const tarefaAtivaData = estado.tarefaAtiva 
    ? estado.projeto.etapas
        .flatMap(e => e.tarefas)
        .find(t => t.id === estado.tarefaAtiva)
    : null;

  const calcularTempoTotalTarefa = useCallback((tarefaId: string): number => {
    const tarefa = estado.projeto.etapas
      .flatMap(e => e.tarefas)
      .find(t => t.id === tarefaId);
    return tarefa ? tarefa.tempo_total + (tarefaId === estado.tarefaAtiva ? estado.tempoSessaoAtual : 0) : 0;
  }, [estado.projeto.etapas, estado.tarefaAtiva, estado.tempoSessaoAtual]);

  // ===== COMPONENTE DE STATUS DE CONEXÃO =====
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Offline</span>
        </>
      )}
      {backendLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
    </div>
  );

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER COM STATUS DE CONEXÃO */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Navegação e Info do Projeto */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Voltar</span>
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <div>
                <h1 className="font-semibold text-gray-900">{estado.projeto.nome}</h1>
                <p className="text-xs text-gray-500">{estado.projeto.cliente}</p>
              </div>
            </div>
            
            {/* Status e Controles */}
            <div className="flex items-center space-x-4">
              
              {/* Status de Conexão */}
              <ConnectionStatus />
              
              {/* Erro de Conexão */}
              {backendError && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{backendError}</span>
                  <Button onClick={reconnect} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Cronômetro Ativo */}
              {cronometroAtivo && (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Timer className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {formatarTempoSimples(estado.tempoSessaoAtual)}
                  </span>
                  <Button onClick={pausarTarefa} size="sm" variant="ghost">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Botão Debug */}
              <Button 
                onClick={() => setShowDebugPanel(!showDebugPanel)}
                size="sm" 
                variant="outline"
              >
                <Server className="h-4 w-4 mr-2" />
                Debug
              </Button>
              
              {/* Usuário */}
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL DE DEBUG */}
      {showDebugPanel && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <BackendConnectionTest />
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-full mx-auto px-6 py-6">
        
        {/* Loading State */}
        {backendLoading && !currentProject && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Carregando dados do projeto...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isConnected && !backendLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Sem conexão com o servidor</h3>
            <p className="text-red-600 mb-4">
              Não foi possível conectar com o backend. Verifique se o servidor está rodando.
            </p>
            <Button onClick={reconnect} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Reconectar
            </Button>
          </div>
        )}

        {/* Dashboard Content - Só mostra se conectado */}
        {isConnected && (
          <>
            {/* MODO FOCO */}
            <ModoFoco
              ativo={estado.modoFoco}
              tarefa={tarefaAtivaData}
              cronometroAtivo={estado.cronometroAtivo && estado.tarefaAtiva === estado.tarefaModoFoco}
              tempoSessaoAtual={estado.tempoSessaoAtual}
              numeroSessoes={estado.numeroSessoes}
              anotacaoSessao={estado.anotacaoSessao}
              onFechar={() => setEstado(prev => ({ ...prev, modoFoco: false }))}
              onIniciarTarefa={iniciarTarefa}
              onPausarTarefa={pausarTarefa}
              onConcluirTarefa={concluirTarefa}
              onSairDaTarefa={sairDaTarefa}
              onAnotacaoChange={(valor) => setEstado(prev => ({ ...prev, anotacaoSessao: valor }))}
              onSalvarNota={salvarNota}
              formatarTempo={formatarTempo}
              formatarTempoSimples={formatarTempoSimples}
              calcularTempoTotalTarefa={calcularTempoTotalTarefa}
            />

            {!estado.modoFoco && (
              <div className="space-y-6">
                
                {/* 1. CARDS DE MÉTRICAS PRINCIPAIS */}
                <CardsMetricas
                  projeto={estado.projeto}
                  cronometroAtivo={estado.cronometroAtivo}
                  tempoSessaoAtual={estado.tempoSessaoAtual}
                  formatarTempo={formatarTempo}
                  formatarTempoTotalRealTime={formatarTempoTotalRealTime}
                />

                {/* Cronômetro Ativo ou Prompt */}
                {estado.cronometroAtivo && tarefaAtivaData ? (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <h3 className="font-semibold text-green-800">{tarefaAtivaData.nome}</h3>
                            <p className="text-sm text-green-600">Trabalhando há {formatarTempoSimples(estado.tempoSessaoAtual)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => setEstado(prev => ({ ...prev, modoFoco: true, tarefaModoFoco: estado.tarefaAtiva }))}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Focus className="h-4 w-4 mr-2" />
                            Modo Foco
                          </Button>
                          <Button onClick={pausarTarefa} size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Timer className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tarefa ativa</h3>
                    <p className="text-gray-600 mb-4">Conectado ao backend. Pronto para iniciar cronômetro!</p>
                    <p className="text-sm text-green-600">✅ Dados em tempo real</p>
                  </div>
                )}

                {/* LAYOUT PRINCIPAL: INFORMAÇÕES DO PROJETO */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* COLUNA PRINCIPAL: VISÃO GERAL */}
                  <div className="lg:col-span-3 space-y-6">
                    
                    {/* Progresso do Projeto */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Progresso do Projeto</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progresso Geral</span>
                            <span className="text-lg font-bold text-blue-600">{estado.projeto.progresso_geral}%</span>
                          </div>
                          <Progress value={estado.projeto.progresso_geral} className="h-3" />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Início: {new Date(estado.projeto.data_inicio).toLocaleDateString('pt-BR')}</span>
                            <span>Prazo: {new Date(estado.projeto.prazo_final).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informações do Backend */}
                    {dashboardData && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Dados do Backend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-700">
                                {dashboardData.overview?.totalProjetos || 0}
                              </div>
                              <div className="text-xs text-blue-600">Total Projetos</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-700">
                                {dashboardData.overview?.projetosAtivos || 0}
                              </div>
                              <div className="text-xs text-green-600">Projetos Ativos</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className="text-2xl font-bold text-orange-700">
                                {dashboardData.overview?.minhasAtividades || 0}
                              </div>
                              <div className="text-xs text-orange-600">Minhas Atividades</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-700">
                                {Math.floor((dashboardData.overview?.tempoSemana || 0) / 3600)}h
                              </div>
                              <div className="text-xs text-purple-600">Tempo Semana</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* COLUNA LATERAL: INFORMAÇÕES RÁPIDAS */}
                  <div className="space-y-4">
                    
                    {/* Status de Conexão Detalhado */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Status do Sistema</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Backend</span>
                          {isConnected ? (
                            <Badge className="bg-green-100 text-green-800">Online</Badge>
                          ) : (
                            <Badge variant="destructive">Offline</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Usuário</span>
                          {user ? (
                            <Badge className="bg-blue-100 text-blue-800">Logado</Badge>
                          ) : (
                            <Badge variant="outline">Deslogado</Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cronômetro</span>
                          {cronometroAtivo ? (
                            <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                          ) : (
                            <Badge variant="outline">Parado</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informações do Projeto */}
                    {currentProject && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Detalhes do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <strong>ID:</strong> {currentProject.id}
                          </div>
                          <div className="text-sm">
                            <strong>Status:</strong> {currentProject.status}
                          </div>
                          <div className="text-sm">
                            <strong>Tipologia:</strong> {currentProject.tipologia}
                          </div>
                          <div className="text-sm">
                            <strong>Progresso:</strong> {currentProject.progresso}%
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 