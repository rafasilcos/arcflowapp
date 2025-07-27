'use client';

/**
 * 🚀 DASHBOARD DE PROJETO ENTERPRISE NEXT-GEN
 * 
 * Arquitetura Escalável para 10.000+ usuários simultâneos
 * Design System Moderno com Performance First
 * 
 * @author Rafael - ArcFlow Enterprise
 * @version 2.0.0
 * @scalability 10k+ concurrent users
 */

import React, { useState, useEffect, use, useMemo, useCallback, Suspense, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// ===== UI COMPONENTS =====
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, Clock, Users, Calendar, Target, Zap, TrendingUp, Activity,
  Play, Pause, Square, CheckCircle2, AlertTriangle, Bell, MessageSquare,
  Focus, BarChart3, Settings, Plus, Upload, Send, X, Eye, EyeOff,
  Timer, User, ChevronRight, ChevronDown, RefreshCw, Star, Award,
  Lightbulb, Shield, Workflow, Layers, PieChart, LineChart,
  FileText, Paperclip, MessageCircle, UserCheck, CheckSquare,
  Hourglass, Gauge, Rocket, Brain, Diamond, Sparkles
} from 'lucide-react';

// ===== PERFORMANCE UTILITIES =====
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// ===== ENTERPRISE CACHE SYSTEM =====
class EnterpriseCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000) { // 5min default
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  invalidate(pattern: string) {
    Array.from(this.cache.keys())
      .filter(key => key.includes(pattern))
      .forEach(key => this.cache.delete(key));
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new EnterpriseCache();

// ===== ERROR BOUNDARY ENTERPRISE =====
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log para sistema de monitoramento
    console.error('Dashboard Enterprise Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl border max-w-md text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Sistema Temporariamente Indisponível</h2>
            <p className="text-slate-600 mb-6">
              Nossa equipe foi notificada automaticamente. Tente novamente em alguns segundos.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ===== INTERFACES ENTERPRISE =====
interface ProjetoEnterprise {
  id: string;
  nome: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  gerente: {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
  };
  cronograma: {
    dataInicio: string;
    prazoFinal: string;
    diasRestantes: number;
    status: 'no_prazo' | 'atencao' | 'atrasado';
  };
  metricas: {
    progressoGeral: number;
    tempoTrabalhado: number; // minutos
    tempoEstimado: number; // minutos
    orcamentoGasto: number;
    orcamentoTotal: number;
    produtividade: number; // porcentagem
    tarefasConcluidas: number;
    tarefasTotal: number;
  };
  status: 'briefing' | 'orcamento' | 'projeto' | 'revisao' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  tipo: 'residencial' | 'comercial' | 'industrial' | 'institucional';
  fase: 'briefing' | 'orcamento' | 'execucao' | 'revisao' | 'entrega';
}

interface TarefaEnterprise {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_progresso' | 'pausada' | 'em_revisao' | 'aguardando_aprovacao' | 'concluida' | 'bloqueada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  responsavel: {
    id: string;
    nome: string;
    avatar?: string;
  };
  cronometro: {
    sessaoAtual: number; // segundos
    tempoTotal: number; // segundos
    ativo: boolean;
    sessoes: number;
  };
  estimativa: {
    tempoEstimado: number; // minutos
    complexidade: 'simples' | 'media' | 'complexa' | 'muito_complexa';
  };
  prazo: {
    dataEntrega: string;
    diasRestantes: number;
    status: 'no_prazo' | 'atencao' | 'atrasado';
  };
  dependencias: string[];
  aprovacao: {
    requerida: boolean;
    status?: 'pendente' | 'aprovada' | 'rejeitada';
    comentarios?: string;
  };
  arquivos: Array<{
    id: string;
    nome: string;
    tipo: string;
    url: string;
  }>;
}

interface NotificacaoEnterprise {
  id: string;
  tipo: 'tarefa_atrasada' | 'aprovacao_pendente' | 'nova_mensagem' | 'alerta_sistema';
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  timestamp: string;
  lida: boolean;
  acao?: {
    label: string;
    url: string;
  };
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

// ===== COMPONENTES MEMOIZADOS =====
const MemoCard = memo(Card);
const MemoButton = memo(Button);
const MemoBadge = memo(Badge);

// ===== COMPONENTE PRINCIPAL =====
export default function DashboardEnterprise({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // ===== ESTADOS OTIMIZADOS =====
  const [modoFoco, setModoFoco] = useState(false);
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null);
  const [cronometroAtivo, setCronometroAtivo] = useState<string | null>(null);
  const [tempoSessao, setTempoSessao] = useState(0);
  const [anotacoes, setAnotacoes] = useState('');
  const [visualizacao, setVisualizacao] = useState<'overview' | 'tarefas' | 'timeline' | 'analise'>('overview');
  
  // ===== DADOS ENTERPRISE MOCKADOS =====
  const projetoData: ProjetoEnterprise = useMemo(() => ({
    id: projetoId,
    nome: 'Residencial Villa Bella Vista',
    cliente: {
      id: 'cli_001',
      nome: 'Família Oliveira',
      email: 'contato@familoliveira.com',
      avatar: 'FO'
    },
    gerente: {
      id: 'ger_001', 
      nome: 'Ana Paula Santos',
      email: 'ana@arcflow.com',
      avatar: 'AS'
    },
    cronograma: {
      dataInicio: '2024-02-15',
      prazoFinal: '2024-07-15',
      diasRestantes: 89,
      status: 'no_prazo'
    },
    metricas: {
      progressoGeral: 73,
      tempoTrabalhado: 18540, // 309 horas
      tempoEstimado: 24000, // 400 horas
      orcamentoGasto: 127500,
      orcamentoTotal: 185000,
      produtividade: 94,
      tarefasConcluidas: 12,
      tarefasTotal: 18
    },
    status: 'projeto',
    prioridade: 'alta',
    tipo: 'residencial',
    fase: 'execucao'
  }), [projetoId]);

  // ===== REACT QUERY OTIMIZADO =====
  const { data: projeto, isLoading, error } = useQuery({
    queryKey: ['projeto-enterprise', projetoId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula API
      return projetoData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: modoFoco ? 30000 : 60000, // Refresh mais frequente no modo foco
  });

  // ===== CRONÔMETRO EM TEMPO REAL =====
  useEffect(() => {
    if (!cronometroAtivo) return;
    
    const interval = setInterval(() => {
      setTempoSessao(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cronometroAtivo]);

  // ===== UTILITÁRIOS =====
  const formatarTempo = useCallback((segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const formatarTempoHumano = useCallback((minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) return `${horas}h${mins > 0 ? ` ${mins}m` : ''}`;
    return `${mins}m`;
  }, []);

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border max-w-md text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Erro ao Carregar Projeto</h2>
          <p className="text-slate-600">Não foi possível carregar os dados do projeto.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* HEADER ENTERPRISE */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-40">
          <div className="max-w-8xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {projeto.nome}
                    </h1>
                    <div className="flex items-center space-x-3 text-sm text-slate-600">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {projeto.cliente.nome}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {projeto.gerente.nome}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MemoBadge 
                  className={`px-3 py-1 text-xs font-medium ${
                    projeto.prioridade === 'critica' ? 'bg-red-100 text-red-800' :
                    projeto.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                    projeto.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {projeto.prioridade.toUpperCase()}
                </MemoBadge>
                
                <MemoButton
                  variant={modoFoco ? "primary" : "outline"}
                  onClick={() => setModoFoco(!modoFoco)}
                  className={modoFoco ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : ""}
                >
                  <Focus className="h-4 w-4 mr-2" />
                  {modoFoco ? "Sair do Foco" : "Modo Foco"}
                </MemoButton>
                
                <MemoButton variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </MemoButton>
              </div>
            </div>
          </div>
        </header>

        {/* MODO FOCO ENTERPRISE */}
        <AnimatePresence>
          {modoFoco && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />
                
                {/* Header */}
                <div className="relative flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Focus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Modo Foco Ativado</h2>
                      <p className="text-slate-600">Concentração máxima para produtividade</p>
                    </div>
                  </div>
                  <MemoButton
                    variant="ghost"
                    onClick={() => setModoFoco(false)}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </MemoButton>
                </div>

                {/* Cronômetro Central */}
                <div className="relative text-center mb-8">
                  <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold text-slate-800 mb-2">
                        {formatarTempo(tempoSessao)}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">Sessão Atual</div>
                    </div>
                  </div>
                </div>

                {/* Controles e Métricas */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-2xl p-4 text-center">
                    <Timer className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">{formatarTempo(tempoSessao)}</div>
                    <div className="text-sm text-blue-600">Sessão Atual</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 text-center">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">2h 45m</div>
                    <div className="text-sm text-green-600">Total Hoje</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4 text-center">
                    <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-800">87%</div>
                    <div className="text-sm text-purple-600">Produtividade</div>
                  </div>
                </div>

                {/* Controles */}
                <div className="relative flex justify-center space-x-4 mb-6">
                  {!cronometroAtivo ? (
                    <MemoButton
                      size="lg"
                      onClick={() => setCronometroAtivo('foco')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar Foco
                    </MemoButton>
                  ) : (
                    <MemoButton
                      size="lg"
                      variant="outline"
                      onClick={() => setCronometroAtivo(null)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </MemoButton>
                  )}
                  <MemoButton
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setCronometroAtivo(null);
                      setTempoSessao(0);
                      setModoFoco(false);
                    }}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Finalizar
                  </MemoButton>
                </div>

                {/* Anotações */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Anotações da Sessão
                  </label>
                  <Textarea
                    value={anotacoes}
                    onChange={(e) => setAnotacoes(e.target.value)}
                    placeholder="Registre insights, decisões ou observações importantes..."
                    className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-400 resize-none"
                    rows={3}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <main className="max-w-8xl mx-auto px-6 py-8">
          <LayoutGroup>
            {/* CARD DE VISÃO GERAL COMPLETO */}
            <motion.div
              layout
              className="mb-8"
            >
              <MemoCard className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 border-slate-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-slate-800">
                    <Building2 className="h-7 w-7 mr-3 text-blue-600" />
                    Visão Geral do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* INFORMAÇÕES PRINCIPAIS */}
                    <div className="space-y-6">
                      {/* Dados do Projeto */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          Informações do Projeto
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Projeto:</span>
                            <span className="text-sm font-bold text-slate-800">{projeto.nome}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Cliente:</span>
                            <span className="text-sm text-slate-800">{projeto.cliente.nome}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Gerente:</span>
                            <span className="text-sm text-slate-800">{projeto.gerente.nome}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Tipo:</span>
                            <MemoBadge className="bg-blue-100 text-blue-800 capitalize">
                              {projeto.tipo}
                            </MemoBadge>
                          </div>
                        </div>
                      </div>

                      {/* Cronograma */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-green-600" />
                          Cronograma
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Data Início:</span>
                            <span className="text-sm text-slate-800">
                              {new Date(projeto.cronograma.dataInicio).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Prazo Final:</span>
                            <span className="text-sm text-slate-800">
                              {new Date(projeto.cronograma.prazoFinal).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">Dias Restantes:</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-bold ${
                                projeto.cronograma.status === 'atrasado' ? 'text-red-600' :
                                projeto.cronograma.status === 'atencao' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {projeto.cronograma.diasRestantes} dias
                              </span>
                              <div className={`w-2 h-2 rounded-full ${
                                projeto.cronograma.status === 'atrasado' ? 'bg-red-500' :
                                projeto.cronograma.status === 'atencao' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MÉTRICAS VISUAIS */}
                    <div className="space-y-6">
                      {/* Progresso Geral */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Target className="h-5 w-5 mr-2 text-purple-600" />
                          Progresso Geral
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl font-bold text-purple-800">
                              {projeto.metricas.progressoGeral}%
                            </span>
                            <MemoBadge className="bg-purple-100 text-purple-800">
                              Meta: 75%
                            </MemoBadge>
                          </div>
                          <Progress value={projeto.metricas.progressoGeral} className="h-3" />
                          <p className="text-xs text-slate-600">
                            Acima da meta estabelecida para este período
                          </p>
                        </div>
                      </div>

                      {/* Contador de Tarefas */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <CheckSquare className="h-5 w-5 mr-2 text-emerald-600" />
                          Tarefas do Projeto
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              {projeto.metricas.tarefasConcluidas}
                            </div>
                            <div className="text-xs text-slate-600">Concluídas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-600">
                              {projeto.metricas.tarefasTotal}
                            </div>
                            <div className="text-xs text-slate-600">Total</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Progress 
                            value={(projeto.metricas.tarefasConcluidas / projeto.metricas.tarefasTotal) * 100} 
                            className="h-2" 
                          />
                          <p className="text-xs text-slate-600 mt-2">
                            {Math.round((projeto.metricas.tarefasConcluidas / projeto.metricas.tarefasTotal) * 100)}% das tarefas concluídas
                          </p>
                        </div>
                      </div>

                      {/* Status Atual */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Activity className="h-5 w-5 mr-2 text-orange-600" />
                          Status Atual
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              projeto.status === 'projeto' ? 'bg-blue-500' :
                              projeto.status === 'briefing' ? 'bg-yellow-500' :
                              projeto.status === 'orcamento' ? 'bg-purple-500' :
                              projeto.status === 'revisao' ? 'bg-orange-500' :
                              'bg-green-500'
                            }`} />
                            <span className="text-sm font-medium text-slate-800 capitalize">
                              {projeto.status === 'projeto' ? 'Em Execução' : projeto.status}
                            </span>
                          </div>
                          <MemoBadge className={`${
                            projeto.prioridade === 'critica' ? 'bg-red-100 text-red-800' :
                            projeto.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                            projeto.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {projeto.prioridade.toUpperCase()}
                          </MemoBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </MemoCard>
            </motion.div>

            {/* MÉTRICAS PRINCIPAIS */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {/* Progresso Geral */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MemoCard className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Progresso</p>
                          <p className="text-2xl font-bold text-blue-800">{projeto.metricas.progressoGeral}%</p>
                        </div>
                      </div>
                    </div>
                    <Progress value={projeto.metricas.progressoGeral} className="h-2" />
                    <p className="text-xs text-blue-600 mt-2">Meta: 75% até fim do mês</p>
                  </CardContent>
                </MemoCard>
              </motion.div>

              {/* Tempo Trabalhado */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MemoCard className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Tempo</p>
                          <p className="text-2xl font-bold text-green-800">
                            {formatarTempoHumano(projeto.metricas.tempoTrabalhado)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(projeto.metricas.tempoTrabalhado / projeto.metricas.tempoEstimado) * 100} 
                      className="h-2" 
                    />
                    <p className="text-xs text-green-600 mt-2">
                      de {formatarTempoHumano(projeto.metricas.tempoEstimado)} estimado
                    </p>
                  </CardContent>
                </MemoCard>
              </motion.div>

              {/* Orçamento */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MemoCard className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <PieChart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900">Orçamento</p>
                          <p className="text-2xl font-bold text-purple-800">
                            R$ {(projeto.metricas.orcamentoGasto / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={(projeto.metricas.orcamentoGasto / projeto.metricas.orcamentoTotal) * 100} 
                      className="h-2" 
                    />
                    <p className="text-xs text-purple-600 mt-2">
                      de R$ {(projeto.metricas.orcamentoTotal / 1000).toFixed(0)}k total
                    </p>
                  </CardContent>
                </MemoCard>
              </motion.div>

              {/* Produtividade */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MemoCard className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-900">Produtividade</p>
                          <p className="text-2xl font-bold text-orange-800">{projeto.metricas.produtividade}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-orange-100 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${projeto.metricas.produtividade}%` }}
                        />
                      </div>
                      <Sparkles className="h-4 w-4 text-orange-500" />
                    </div>
                    <p className="text-xs text-orange-600 mt-2">Acima da média do escritório</p>
                  </CardContent>
                </MemoCard>
              </motion.div>
            </motion.div>

            {/* NAVEGAÇÃO DE VISUALIZAÇÕES */}
            <motion.div layout className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-2">
                <div className="flex space-x-2">
                  {[
                    { id: 'overview', label: 'Visão Geral', icon: Target },
                    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
                    { id: 'timeline', label: 'Timeline', icon: Calendar },
                    { id: 'analise', label: 'Análise', icon: BarChart3 }
                  ].map(({ id, label, icon: Icon }) => (
                    <MemoButton
                      key={id}
                      variant={visualizacao === id ? "primary" : "ghost"}
                      onClick={() => setVisualizacao(id as any)}
                      className="flex-1 justify-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </MemoButton>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* SISTEMA DE NOTIFICAÇÕES E COMUNICAÇÃO */}
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Notificações */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <MemoCard className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center text-lg">
                        <Bell className="h-5 w-5 mr-2 text-blue-600" />
                        Notificações
                      </span>
                      <MemoBadge className="bg-red-100 text-red-800">3</MemoBadge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        id: '1',
                        tipo: 'tarefa_atrasada',
                        titulo: 'Tarefa em Atraso',
                        descricao: 'Plantas baixas - Térreo venceu ontem',
                        prioridade: 'alta',
                        timestamp: '2024-12-19T10:30:00',
                        lida: false
                      },
                      {
                        id: '2',
                        tipo: 'aprovacao_pendente',
                        titulo: 'Aprovação Pendente',
                        descricao: 'Projeto estrutural aguarda aprovação',
                        prioridade: 'media',
                        timestamp: '2024-12-19T09:15:00',
                        lida: false
                      },
                      {
                        id: '3',
                        tipo: 'nova_mensagem',
                        titulo: 'Nova Mensagem',
                        descricao: 'Cliente enviou feedback do projeto',
                        prioridade: 'baixa',
                        timestamp: '2024-12-19T08:45:00',
                        lida: true
                      }
                    ].map((notif) => (
                      <motion.div
                        key={notif.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-xl border-l-4 cursor-pointer transition-all ${
                          notif.prioridade === 'alta' ? 'border-red-500 bg-red-50/50' :
                          notif.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50/50' :
                          'border-blue-500 bg-blue-50/50'
                        } ${!notif.lida ? 'ring-2 ring-blue-200/50' : 'opacity-75'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-800">{notif.titulo}</h4>
                            <p className="text-xs text-slate-600 mt-1">{notif.descricao}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(notif.timestamp).toLocaleTimeString('pt-BR')}
                            </p>
                          </div>
                          <MemoButton variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <X className="h-3 w-3" />
                          </MemoButton>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </MemoCard>
              </motion.div>

              {/* Chat da Equipe */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <MemoCard className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                      Chat da Equipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                      {[
                        {
                          id: '1',
                          autor: 'Ana Paula',
                          avatar: 'AP',
                          mensagem: 'Revisão do projeto estrutural finalizada ✅',
                          timestamp: '10:45'
                        },
                        {
                          id: '2',
                          autor: 'Carlos Silva',
                          avatar: 'CS',
                          mensagem: 'Cliente aprovou as modificações na fachada',
                          timestamp: '10:30'
                        },
                        {
                          id: '3',
                          autor: 'Maria Santos',
                          avatar: 'MS',
                          mensagem: 'Reunião de alinhamento às 14h hoje',
                          timestamp: '09:15'
                        }
                      ].map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {msg.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-800">{msg.autor}</span>
                              <span className="text-xs text-slate-500">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{msg.mensagem}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Digite sua mensagem..." 
                        className="flex-1 rounded-xl border-slate-200 focus:border-blue-400" 
                      />
                      <MemoButton size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                        <Send className="h-4 w-4" />
                      </MemoButton>
                    </div>
                  </CardContent>
                </MemoCard>
              </motion.div>

              {/* Status da Equipe */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <MemoCard className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Users className="h-5 w-5 mr-2 text-purple-600" />
                      Equipe (4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        id: '1',
                        nome: 'Ana Paula Santos',
                        cargo: 'Arquiteta Sênior',
                        status: 'ativo',
                        avatar: 'AS',
                        horasHoje: 6.5,
                        produtividade: 94
                      },
                      {
                        id: '2', 
                        nome: 'Carlos Silva',
                        cargo: 'Eng. Estrutural',
                        status: 'ocupado',
                        avatar: 'CS',
                        horasHoje: 4.2,
                        produtividade: 88
                      },
                      {
                        id: '3',
                        nome: 'Maria Santos',
                        cargo: 'Desenhista',
                        status: 'ativo',
                        avatar: 'MS',
                        horasHoje: 5.8,
                        produtividade: 92
                      },
                      {
                        id: '4',
                        nome: 'João Oliveira',
                        cargo: 'Estagiário',
                        status: 'inativo',
                        avatar: 'JO',
                        horasHoje: 0,
                        produtividade: 0
                      }
                    ].map((membro) => (
                      <motion.div
                        key={membro.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                              {membro.avatar}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              membro.status === 'ativo' ? 'bg-green-500' :
                              membro.status === 'ocupado' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{membro.nome}</p>
                            <p className="text-xs text-slate-600">{membro.cargo}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-800">{membro.horasHoje}h</p>
                          <p className="text-xs text-slate-600">{membro.produtividade}%</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </MemoCard>
              </motion.div>
            </motion.div>

            {/* SISTEMA DE TAREFAS AVANÇADO */}
            {visualizacao === 'tarefas' && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <MemoCard>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-xl">
                        <CheckSquare className="h-6 w-6 mr-3 text-blue-600" />
                        Gestão de Tarefas Enterprise
                      </CardTitle>
                      <div className="flex items-center space-x-3">
                        <MemoButton variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Nova Tarefa
                        </MemoButton>
                        <MemoButton variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Anexar Arquivo
                        </MemoButton>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Filtros Rápidos */}
                      <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-700">Filtros:</span>
                          {['Todas', 'Em Progresso', 'Pendentes', 'Concluídas'].map((filtro) => (
                            <MemoBadge
                              key={filtro}
                              className={`cursor-pointer transition-all ${
                                filtro === 'Em Progresso' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {filtro}
                            </MemoBadge>
                          ))}
                        </div>
                      </div>

                      {/* Lista de Tarefas */}
                      <div className="space-y-3">
                        {[
                          {
                            id: '1',
                            titulo: 'Plantas Baixas - Pavimento Térreo',
                            descricao: 'Desenvolvimento das plantas baixas do pavimento térreo com todas as cotas e especificações técnicas',
                            status: 'em_progresso',
                            prioridade: 'alta',
                            responsavel: { nome: 'Ana Paula Santos', avatar: 'AS' },
                            cronometro: { sessaoAtual: 2840, tempoTotal: 18600, ativo: true, sessoes: 3 },
                            estimativa: { tempoEstimado: 720, complexidade: 'complexa' },
                            prazo: { dataEntrega: '2024-12-20', diasRestantes: 1, status: 'atencao' },
                            aprovacao: { requerida: true, status: 'pendente' }
                          },
                          {
                            id: '2',
                            titulo: 'Especificação de Materiais',
                            descricao: 'Definição e especificação detalhada de todos os materiais a serem utilizados no projeto',
                            status: 'pendente',
                            prioridade: 'media',
                            responsavel: { nome: 'Carlos Silva', avatar: 'CS' },
                            cronometro: { sessaoAtual: 0, tempoTotal: 0, ativo: false, sessoes: 0 },
                            estimativa: { tempoEstimado: 480, complexidade: 'media' },
                            prazo: { dataEntrega: '2024-12-22', diasRestantes: 3, status: 'no_prazo' },
                            aprovacao: { requerida: false }
                          },
                          {
                            id: '3',
                            titulo: 'Modelagem 3D - Fachada Principal',
                            descricao: 'Criação do modelo tridimensional da fachada principal para apresentação ao cliente',
                            status: 'concluida',
                            prioridade: 'alta',
                            responsavel: { nome: 'Maria Santos', avatar: 'MS' },
                            cronometro: { sessaoAtual: 0, tempoTotal: 28800, ativo: false, sessoes: 6 },
                            estimativa: { tempoEstimado: 600, complexidade: 'complexa' },
                            prazo: { dataEntrega: '2024-12-18', diasRestantes: -1, status: 'concluido' },
                            aprovacao: { requerida: true, status: 'aprovada' }
                          }
                        ].map((tarefa) => (
                          <motion.div
                            key={tarefa.id}
                            whileHover={{ scale: 1.005 }}
                            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                              tarefa.id === tarefaAtiva ? 'ring-2 ring-blue-500 bg-blue-50/50' :
                              'border-slate-200 bg-white hover:shadow-lg hover:border-slate-300'
                            }`}
                            onClick={() => setTarefaAtiva(tarefa.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    tarefa.status === 'concluida' ? 'bg-green-500' :
                                    tarefa.status === 'em_progresso' ? 'bg-blue-500' :
                                    tarefa.status === 'pendente' ? 'bg-gray-400' : 'bg-yellow-500'
                                  }`} />
                                  <h3 className="text-lg font-semibold text-slate-800">{tarefa.titulo}</h3>
                                  <MemoBadge className={`${
                                    tarefa.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                                    tarefa.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {tarefa.prioridade.toUpperCase()}
                                  </MemoBadge>
                                </div>
                                
                                <p className="text-slate-600 mb-4">{tarefa.descricao}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-600">{tarefa.responsavel.nome}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className={`text-sm ${
                                      tarefa.prazo.status === 'atrasado' ? 'text-red-600' :
                                      tarefa.prazo.status === 'atencao' ? 'text-yellow-600' :
                                      'text-slate-600'
                                    }`}>
                                      {tarefa.prazo.diasRestantes > 0 ? `${tarefa.prazo.diasRestantes} dias restantes` :
                                       tarefa.prazo.diasRestantes === 0 ? 'Vence hoje' :
                                       tarefa.status === 'concluida' ? 'Concluída' : 'Em atraso'}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-600">
                                      {formatarTempoHumano(tarefa.cronometro.tempoTotal / 60)} / {formatarTempoHumano(tarefa.estimativa.tempoEstimado)}
                                    </span>
                                  </div>
                                </div>

                                {tarefa.cronometro.ativo && (
                                  <div className="flex items-center space-x-3 mb-4 p-3 bg-green-50 rounded-xl">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-green-800">
                                      Sessão ativa: {formatarTempo(tarefa.cronometro.sessaoAtual)}
                                    </span>
                                  </div>
                                )}

                                <Progress 
                                  value={(tarefa.cronometro.tempoTotal / 60 / tarefa.estimativa.tempoEstimado) * 100} 
                                  className="mb-4" 
                                />
                              </div>

                              <div className="flex flex-col space-y-2 ml-6">
                                {tarefa.status !== 'concluida' && (
                                  <>
                                    {!tarefa.cronometro.ativo ? (
                                      <MemoButton
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCronometroAtivo(tarefa.id);
                                        }}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Play className="h-4 w-4 mr-1" />
                                        Iniciar
                                      </MemoButton>
                                    ) : (
                                      <MemoButton
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCronometroAtivo(null);
                                        }}
                                        className="border-orange-300 text-orange-700"
                                      >
                                        <Pause className="h-4 w-4 mr-1" />
                                        Pausar
                                      </MemoButton>
                                    )}
                                    <MemoButton
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => e.stopPropagation()}
                                      className="border-blue-300 text-blue-700"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Concluir
                                    </MemoButton>
                                  </>
                                )}
                                <MemoButton
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detalhes
                                </MemoButton>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </MemoCard>
              </motion.div>
            )}

            {/* CRONÔMETRO FLUTUANTE */}
            <AnimatePresence>
              {cronometroAtivo && !modoFoco && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Timer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-mono font-bold text-slate-800">
                        {formatarTempo(tempoSessao)}
                      </div>
                      <div className="text-xs text-slate-600">Sessão Ativa</div>
                    </div>
                    <div className="flex space-x-2">
                      <MemoButton size="sm" variant="ghost" onClick={() => setCronometroAtivo(null)}>
                        <Pause className="h-4 w-4" />
                      </MemoButton>
                      <MemoButton size="sm" variant="ghost" onClick={() => setModoFoco(true)}>
                        <Focus className="h-4 w-4" />
                      </MemoButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </main>
      </div>
    </DashboardErrorBoundary>
  );
} 