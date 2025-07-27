'use client';

import React, { useState, useEffect, use, useMemo, useCallback, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ModalEdicao, ModalConfirmacao } from '@/components/crud/CrudModals';
import { 
  Building, Play, Pause, Square, CheckCircle2, AlertTriangle, Clock,
  Users, MessageSquare, Bell, Settings, Eye, EyeOff, Plus, Edit3,
  List, Calendar, Columns, Upload, Send, Trash2, GripVertical,
  MoreHorizontal, User, ChevronDown, ChevronRight, Focus, FileText,
  Paperclip, Target, Search, Filter, Home, ArrowRight, Timer,
  Zap, TrendingUp, Activity, Save, ChevronUp, PanelRightClose,
  PanelRightOpen, Workflow, BarChart3, X, Download, ArrowLeft,
  Edit, Copy, Move, RotateCcw, Check, AlertCircle, Trash,
  RefreshCw, Share2, Maximize2, Loader2, Info, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== UTILITÁRIOS DE PERFORMANCE =====
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ===== CACHE MANAGER LOCAL =====
const CacheManager = {
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`arcflow_${key}`, JSON.stringify(item));
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`arcflow_${key}`);
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`arcflow_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  
  clear: (pattern?: string) => {
    if (pattern) {
      Object.keys(localStorage)
        .filter(key => key.includes(pattern))
        .forEach(key => localStorage.removeItem(key));
    }
  }
};

// ===== ERROR BOUNDARY =====
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
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
    console.error('Dashboard Error:', error, errorInfo);
    // Em produção: enviar para Sentry
  }
  
  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DashboardFallback;
      return <Fallback error={this.state.error} onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

// ===== FALLBACK COMPONENT =====
const DashboardFallback = ({ error, onRetry }: { error: Error | null; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Card className="p-8 text-center max-w-md">
      <CardContent>
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-600 mb-4">
          Ocorreu um erro no dashboard de produtividade. Nossa equipe foi notificada.
        </p>
        <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  </div>
);

// ===== COMPONENTES MEMOIZADOS =====
const MemoizedCard = React.memo(Card);
const MemoizedBadge = React.memo(Badge);
const MemoizedButton = React.memo(Button);

// ===== LOADING SKELETON =====
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

// ===== INTERFACES =====
// Interfaces baseadas na especificação
interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada' | 'aguardando_aprovacao';
  responsavel: string;
  tempo_estimado: number;
  tempo_total: number;
  tempo_sessao_atual: number;
  cronometro_ativo: boolean;
  data_inicio?: string;
  data_conclusao?: string;
  data_entrega?: string; // Data real de entrega planejada
  prioridade?: 'baixa' | 'media' | 'alta' | 'critica'; // Prioridade definida pelo usuário
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
  equipe: any[];
  atividades: any[];
  arquivos: any[];
}

interface DashboardProps {
  params: Promise<{ id: string }>;
}

// ===== INTERFACES PARA SISTEMA DE VALIDAÇÃO INTELIGENTE =====
interface ValidacaoImpacto {
  id: string;
  tipo: 'warning' | 'error' | 'info';
  categoria: 'prazo' | 'dependencia' | 'custo' | 'qualidade' | 'equipe';
  mensagem: string;
  impacto_estimado: {
    horas_adicionais?: number;
    dias_atraso?: number;
    custo_adicional?: number;
    risco_qualidade?: 'baixo' | 'medio' | 'alto';
  };
  sugestoes: string[];
  pode_prosseguir: boolean;
}

interface OperacaoCrud {
  tipo: 'criar' | 'editar' | 'excluir' | 'mover' | 'reordenar';
  entidade: 'projeto' | 'etapa' | 'tarefa';
  id?: string;
  dados?: any;
  contexto?: {
    etapa_origem?: string;
    etapa_destino?: string;
    posicao_origem?: number;
    posicao_destino?: number;
  };
}

interface ResultadoValidacao {
  pode_prosseguir: boolean;
  requer_confirmacao: boolean;
  validacoes: ValidacaoImpacto[];
  impacto_calculado: {
    tempo_total_novo: number;
    data_entrega_nova: string;
    dias_atraso: number;
    custo_adicional: number;
    tarefas_afetadas: string[];
  };
  sugestoes_alternativas: Array<{
    id: string;
    descricao: string;
    acao: () => void;
  }>;
}

interface DependenciaInteligente {
  tarefa_origem: string;
  tarefa_destino: string;
  tipo: 'obrigatoria' | 'recomendada' | 'logica';
  flexibilidade: 'rigida' | 'moderada' | 'flexivel';
  justificativa: string;
}

// ===== SISTEMA DE TEMPLATES INTELIGENTES =====
interface TarefaTemplate {
  id: string;
  nome: string;
  categoria: string;
  tempo_estimado_base: number; // em segundos
  complexidade: 'baixa' | 'media' | 'alta' | 'critica';
  requer_aprovacao: boolean;
  responsavel_sugerido: 'arquiteto' | 'engenheiro' | 'tecnico' | 'designer' | 'gerente';
  posicao_recomendada: number;
  etapa_recomendada: string;
  dependencias: string[];
  multiplicadores: {
    porte_pequeno: number;
    porte_medio: number;
    porte_grande: number;
    complexidade_baixa: number;
    complexidade_media: number;
    complexidade_alta: number;
  };
  palavras_chave: string[];
  descricao: string;
}

interface TemplateInteligente {
  id: string;
  nome: string;
  tipologia: 'residencial' | 'comercial' | 'industrial' | 'institucional';
  porte: 'pequeno' | 'medio' | 'grande';
  complexidade: 'baixa' | 'media' | 'alta';
  etapas_obrigatorias: string[];
  tarefas_criticas: string[];
  tempo_total_estimado: number;
  margem_seguranca: number; // %
  tarefas_templates: TarefaTemplate[];
}

interface AnaliseInteligente {
  tarefa_sugerida?: TarefaTemplate;
  tempo_estimado: number;
  posicao_recomendada: number;
  etapa_recomendada: string;
  responsavel_sugerido: string;
  requer_aprovacao: boolean;
  justificativa: string;
  confianca: number; // 0-100%
  alternativas: TarefaTemplate[];
}

export default function DashboardProdutividadeV7Otimizado({ params }: DashboardProps) {
  const { id: projetoId } = use(params);
  
  // Estados principais
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null);
  const [cronometroAtivo, setCronometroAtivo] = useState<string | null>(null);
  const [tempoSessaoAtual, setTempoSessaoAtual] = useState(0);
  const [anotacaoSessao, setAnotacaoSessao] = useState('');
  const [modoFoco, setModoFoco] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'lista' | 'kanban' | 'timeline'>('lista');
  const [abaComunicacao, setAbaComunicacao] = useState('chat');
  const [mensagemChat, setMensagemChat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [arquivoUpload, setArquivoUpload] = useState<File | null>(null);
  
  // ===== OTIMIZAÇÕES DE PERFORMANCE =====
  
  // Debounced search para não fazer busca a cada tecla
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  );
  
  // Cache do projeto no localStorage
  const projetoCache = useMemo(() => {
    const cached = CacheManager.get(`projeto_${projetoId}`);
    return cached;
  }, [projetoId]);
  
  // Salvar no cache quando dados mudarem
  const salvarCache = useCallback((dados: any) => {
    CacheManager.set(`projeto_${projetoId}`, dados, 10 * 60 * 1000); // 10 min
  }, [projetoId]);
  const [etapasExpandidas, setEtapasExpandidas] = useState<string[]>(['etapa_001']);
  const [tarefasDetalhesExpandidos, setTarefasDetalhesExpandidos] = useState<string[]>([]);
  const [tooltipRevisaoVisible, setTooltipRevisaoVisible] = useState(false);
  const [tooltipAguardandoVisible, setTooltipAguardandoVisible] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [numeroSessoes, setNumeroSessoes] = useState(1); // Contador de sessões
  const [sessoesHistorico, setSessoesHistorico] = useState<Array<{
    id: string;
    inicio: Date;
    fim?: Date;
    duracao: number;
    anotacao: string;
  }>>([]);
  const [anotacoesSalvas, setAnotacoesSalvas] = useState<Array<{
    id: string;
    sessao: number;
    tempo: number;
    texto: string;
    timestamp: Date;
    tarefaId: string;
  }>>([]);
  const [anotacaoSalva, setAnotacaoSalva] = useState(false); // Feedback visual
  
  // Estados para tempos acumulados (não dependem do cronômetro ativo)
  const [tempoTotalTarefaAtual, setTempoTotalTarefaAtual] = useState(0); // Tempo já trabalhado na tarefa ativa
  const [tempoTotalProjeto, setTempoTotalProjeto] = useState(163*3600); // Tempo total do projeto (mantém valor inicial)
  
  // Estados para drag and drop
  const [draggedItem, setDraggedItem] = useState<{type: 'etapa' | 'tarefa', id: string} | null>(null);

  // ===== ESTADOS PARA SISTEMA CRUD =====
  const [modoEdicao, setModoEdicao] = useState<{
    tipo: 'projeto' | 'etapa' | 'tarefa' | null;
    id: string | null;
    acao: 'criar' | 'editar' | 'duplicar' | 'mover' | 'excluir' | null;
  }>({
    tipo: null,
    id: null,
    acao: null
  });
  const [formData, setFormData] = useState<any>({});
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<{
    aberto: boolean;
    tipo: 'projeto' | 'etapa' | 'tarefa' | null;
    id: string | null;
    nome: string;
  }>({
    aberto: false,
    tipo: null,
    id: null,
    nome: ''
  });
  const [historicoCrud, setHistoricoCrud] = useState<Array<{
    id: string;
    acao: string;
    tipo: 'projeto' | 'etapa' | 'tarefa';
    itemId: string;
    dadosAnteriores: any;
    dadosNovos: any;
    timestamp: Date;
    usuario: string;
  }>>([]);
  const [salvandoCrud, setSalvandoCrud] = useState(false);

  // ===== ESTADOS PARA SISTEMA DE VALIDAÇÃO INTELIGENTE =====
  const [validacaoAtiva, setValidacaoAtiva] = useState<ResultadoValidacao | null>(null);
  const [operacaoPendente, setOperacaoPendente] = useState<OperacaoCrud | null>(null);

  // Efeito para atualizar cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cronometroAtivo) {
      interval = setInterval(() => {
        setTempoSessaoAtual(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cronometroAtivo]);





  // Dados do projeto - agora como estado para permitir edição
  const [projeto, setProjeto] = useState<Projeto>({
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
            data_entrega: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0], // Amanhã
            prioridade: 'alta',
            requer_aprovacao: true,
            anotacao_sessao_atual: 'Reunião com cliente agendada para revisar programa final',
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_003',
            nome: 'Briefing cliente e validação final',
            status: 'aguardando_aprovacao',
            responsavel: 'Marina Arquiteta Jr.',
            tempo_estimado: 6*3600,
            tempo_total: 4*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-05',
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
            data_entrega: new Date().toISOString().split('T')[0], // Hoje
            prioridade: 'critica',
            requer_aprovacao: true,
            notas_sessoes: [],
            arquivos: [],
            revisoes: []
          },
          {
            id: 'tarefa_005',
            nome: 'Cortes e fachadas principais',
            status: 'em_revisao',
            responsavel: 'Carlos Designer',
            tempo_estimado: 16*3600,
            tempo_total: 12*3600,
            tempo_sessao_atual: 0,
            cronometro_ativo: false,
            data_inicio: '2024-03-07',
            data_entrega: new Date().toISOString().split('T')[0], // Hoje
            prioridade: 'alta',
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
    ],
    equipe: [
      { nome: 'Ana Paula', avatar: 'AP', status: 'Online' },
      { nome: 'Carlos', avatar: 'CD', status: 'Ausente' },
      { nome: 'Marina', avatar: 'MJ', status: 'Ocupada' }
    ],
    atividades: [
      { id: 'atividade_001', usuario: 'Ana', acao: 'concluiu', tipo: 'concluiu', tempo: '2h' },
      { id: 'atividade_002', usuario: 'Carlos', acao: 'iniciou', tipo: 'iniciou', tempo: '4h' },
      { id: 'atividade_003', usuario: 'Marina', acao: 'validou', tipo: 'validou', tempo: '1d' }
    ],
    arquivos: [
      { nome: 'plantas-v3.dwg', usuario: 'Ana', tempo: '2h' },
      { nome: 'briefing.pdf', usuario: 'Marina', tempo: '1d' }
    ]
  });

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

  // Efeito para teclas de atalho no Modo Foco
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (modoFoco) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setModoFoco(false);
        } else if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          if (tarefaAtivaData) {
            if (cronometroAtivo) {
              pausarTarefa();
            } else {
              iniciarTarefa(tarefaAtivaData.id);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modoFoco, cronometroAtivo, tarefaAtivaData]);

  // Função para calcular próximas tarefas baseada em dados reais
  const calcularProximasTarefas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    const amanha = new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0];
    
    // Pegar todas as tarefas não concluídas
    const todasTarefas = projeto.etapas.flatMap(e => e.tarefas)
      .filter(t => t.status !== 'concluida');
    
    // Processar tarefas com dados REAIS
    const tarefasComAnalise = todasTarefas.map(tarefa => {
      let urgencia = 0;
      let labelPrazo = '';
      let corBadge = '';
      let dataEntregaReal = tarefa.data_entrega || null;
      
      // LÓGICA REAL baseada em data_entrega e status
      if (!dataEntregaReal) {
        // Se não tem data de entrega, não aparece no card
        return null;
      }
      
      const dataEntrega = new Date(dataEntregaReal);
      const hojeDate = new Date(hoje);
      const amanhaDate = new Date(amanha);
      
      // Verificar se está atrasada
      if (dataEntrega < hojeDate) {
        urgencia = 4; // Máxima prioridade
        labelPrazo = 'ATRASADA';
        corBadge = 'bg-red-100 text-red-700 border-red-200';
      }
      // Verificar se é para hoje
      else if (dataEntrega.toDateString() === hojeDate.toDateString()) {
        if (tarefa.status === 'em_revisao') {
          urgencia = 3;
          labelPrazo = 'CORRIGIR HOJE';
          corBadge = 'bg-purple-100 text-purple-700 border-purple-200';
        } else if (tarefa.status === 'em_progresso') {
          urgencia = 3;
          labelPrazo = 'FINALIZAR HOJE';
          corBadge = 'bg-orange-100 text-orange-700 border-orange-200';
        } else if (tarefa.status === 'nao_iniciada') {
          urgencia = 2;
          labelPrazo = 'INICIAR HOJE';
          corBadge = 'bg-blue-100 text-blue-700 border-blue-200';
        }
      }
      // Verificar se é para amanhã
      else if (dataEntrega.toDateString() === amanhaDate.toDateString()) {
        if (tarefa.status === 'em_progresso') {
          urgencia = 2;
          labelPrazo = 'FINALIZAR AMANHÃ';
          corBadge = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        } else if (tarefa.status === 'nao_iniciada') {
          urgencia = 1;
          labelPrazo = 'INICIAR AMANHÃ';
          corBadge = 'bg-green-100 text-green-700 border-green-200';
        }
      }
      
      // Se não tem urgência, não aparece no card
      if (urgencia === 0) return null;
      
      return {
        ...tarefa,
        dataEntregaReal,
        urgencia,
        labelPrazo,
        corBadge,
        // Combinar prioridade do usuário com complexidade técnica
        pontuacaoPrioridade: (
          (tarefa.prioridade === 'critica' ? 4 : 
           tarefa.prioridade === 'alta' ? 3 :
           tarefa.prioridade === 'media' ? 2 : 1) * 100 +
          tarefa.tempo_estimado / 3600 // Horas estimadas como peso secundário
        )
      };
    }).filter(t => t !== null); // Remove tarefas sem data de entrega
    
    // Ordenar por: 1) Urgência (desc), 2) Prioridade combinada (desc)
    return tarefasComAnalise
      .sort((a, b) => {
        if (a.urgencia !== b.urgencia) {
          return b.urgencia - a.urgencia; // Mais urgente primeiro
        }
        return b.pontuacaoPrioridade - a.pontuacaoPrioridade; // Maior prioridade primeiro
      })
      .slice(0, 4); // Máximo 4 tarefas
  };

  // Obter próximas tarefas com lógica inteligente
  const proximasTarefas = calcularProximasTarefas();

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
  
  // Tarefas que foram enviadas para aprovação e estão aguardando
  const aguardandoAprovacao = projeto.etapas.flatMap(etapa =>
    etapa.tarefas.filter(tarefa => tarefa.status === 'aguardando_aprovacao')
  );

  // Tarefas que foram rejeitadas e precisam ser corrigidas
  const tarefasEmRevisao = projeto.etapas.flatMap(etapa => 
    etapa.tarefas.filter(tarefa => tarefa.status === 'em_revisao')
  );

  // Tarefas aprovadas hoje (mock data)
  const tarefasAprovadas = [
    {
      id: 'tarefa_aprovada_001',
      nome: 'Análise de viabilidade técnica',
      responsavel: 'Carlos Engenheiro',
      dataAprovacao: new Date().toLocaleDateString('pt-BR'),
      horaAprovacao: '09:15'
    },
    {
      id: 'tarefa_aprovada_002', 
      nome: 'Estudo de insolação e ventilação',
      responsavel: 'Marina Arquiteta Jr.',
      dataAprovacao: new Date().toLocaleDateString('pt-BR'),
      horaAprovacao: '14:30'
    }
  ];

  // Calcular progresso de tarefas
  const totalTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas).length;
  const tarefasConcluidas = projeto.etapas.flatMap(etapa => 
    etapa.tarefas.filter(tarefa => tarefa.status === 'concluida')
  ).length;

  // Calcular tempo total em tempo real (incluindo sessão atual)
  const calcularTempoTotalRealTime = () => {
    // Retorna o tempo total do projeto + tempo da sessão atual (se ativo)
    const tempoSessaoAtiva = cronometroAtivo ? tempoSessaoAtual : 0;
    return tempoTotalProjeto + tempoSessaoAtiva;
  };

  const calcularTempoTarefaAtualRealTime = () => {
    // Retorna o tempo total da tarefa atual + tempo da sessão atual (se ativo)
    const tempoSessaoAtiva = cronometroAtivo ? tempoSessaoAtual : 0;
    return tempoTotalTarefaAtual + tempoSessaoAtiva;
  };

  // Formatar tempo total em HH:MM:SS
  const formatarTempoTotalRealTime = () => {
    const segundosTotal = calcularTempoTotalRealTime();
    return formatarTempo(segundosTotal);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nao_iniciada': return 'bg-gray-100 text-gray-700';
      case 'em_progresso': return 'bg-blue-100 text-blue-700';
      case 'em_revisao': return 'bg-yellow-100 text-yellow-700';
      case 'aguardando_aprovacao': return 'bg-purple-100 text-purple-700';
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
      case 'aguardando_aprovacao': return '⏳';
      case 'concluida': return '✅';
      case 'atrasada': return '🔴';
      default: return '⏸️';
    }
  };

  // Funções de cronômetro e sessões
  const iniciarTarefa = (tarefaId: string) => {
    setTarefaAtiva(tarefaId);
    setCronometroAtivo(tarefaId);
    setTempoSessaoAtual(0);
    setAnotacaoSessao('');
    
    // Se é uma nova tarefa, reinicia contador de sessões e define tempos acumulados
    if (tarefaAtiva !== tarefaId) {
      setNumeroSessoes(1);
      setSessoesHistorico([]);
      
      // Define os tempos acumulados baseados na tarefa selecionada
      const tarefa = projeto.etapas
        .flatMap(e => e.tarefas)
        .find(t => t.id === tarefaId);
      
      if (tarefa) {
        setTempoTotalTarefaAtual(tarefa.tempo_total);
      }
    }
  };

  const pausarTarefa = () => {
    if (cronometroAtivo && tempoSessaoAtual > 0) {
      // Salva a sessão atual no histórico
      const novaSessao = {
        id: `sessao_${Date.now()}`,
        inicio: new Date(Date.now() - tempoSessaoAtual * 1000),
        fim: new Date(),
        duracao: tempoSessaoAtual,
        anotacao: anotacaoSessao.trim()
      };
      
      setSessoesHistorico(prev => [...prev, novaSessao]);
      setNumeroSessoes(prev => prev + 1);
      
      // IMPORTANTE: Atualiza os tempos acumulados antes de pausar
      setTempoTotalTarefaAtual(prev => prev + tempoSessaoAtual);
      setTempoTotalProjeto(prev => prev + tempoSessaoAtual);
    }
    
    setCronometroAtivo(null);
    setTarefaAtiva(null); // Remove a tarefa ativa para ocultar o card
    setTempoSessaoAtual(0); // Apenas a sessão zera
    setAnotacaoSessao('');
  };

  const retomarTarefa = (tarefaId: string) => {
    setCronometroAtivo(tarefaId);
    setTempoSessaoAtual(0); // Nova sessão começa do zero
  };

  const salvarNota = () => {
    if (tarefaAtiva && anotacaoSessao.trim()) {
      // Cria uma nova anotação salva
      const novaAnotacao = {
        id: `anotacao_${Date.now()}`,
        sessao: numeroSessoes,
        tempo: tempoSessaoAtual,
        texto: anotacaoSessao.trim(),
        timestamp: new Date(),
        tarefaId: tarefaAtiva
      };

      // Adiciona ao histórico de anotações salvas
      setAnotacoesSalvas(prev => [...prev, novaAnotacao]);

      console.log('Anotação salva com sucesso:', novaAnotacao);
      
      // Limpa o campo após salvar
      setAnotacaoSessao('');
      
      // Mostra feedback visual
      setAnotacaoSalva(true);
      setTimeout(() => setAnotacaoSalva(false), 2000); // Remove após 2 segundos
    }
  };

  const concluirTarefa = (tarefaId: string) => {
    const tarefa = projeto.etapas
      .flatMap(e => e.tarefas)
      .find(t => t.id === tarefaId);
    
    // Salva o tempo da sessão atual nos acumulados antes de concluir
    if (cronometroAtivo && tempoSessaoAtual > 0) {
      setTempoTotalTarefaAtual(prev => prev + tempoSessaoAtual);
      setTempoTotalProjeto(prev => prev + tempoSessaoAtual);
    }
    
    if (tarefa?.requer_aprovacao) {
      // Vai para revisão do manager
      console.log('Tarefa enviada para revisão:', tarefaId);
    } else {
      // Marca como concluída
      console.log('Tarefa concluída:', tarefaId);
    }
    
    setCronometroAtivo(null);
    setTarefaAtiva(null);
    setTempoSessaoAtual(0);
    setAnotacaoSessao('');
  };

  const uploadArquivo = (tarefaId: string, arquivo: File) => {
    console.log('Upload arquivo:', { tarefaId, arquivo: arquivo.name });
    setArquivoUpload(null);
  };

  const toggleEtapa = (etapaId: string) => {
    setEtapasExpandidas(prev => 
      prev.includes(etapaId) 
        ? prev.filter(id => id !== etapaId)
        : [...prev, etapaId]
    );
  };

  const toggleDetalheTarefa = (tarefaId: string) => {
    setTarefasDetalhesExpandidos(prev => 
      prev.includes(tarefaId) 
        ? prev.filter(id => id !== tarefaId)
        : [...prev, tarefaId]
    );
  };

  // Drag and Drop functions
  const handleDragStart = (type: 'etapa' | 'tarefa', id: string) => {
    setDraggedItem({ type, id });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string, targetType: 'etapa' | 'tarefa') => {
    e.preventDefault();
    if (draggedItem) {
      try {
        if (draggedItem.type === 'etapa' && targetType === 'etapa') {
          // Reordenar etapas
          const etapaIndex = projeto.etapas.findIndex(e => e.id === draggedItem.id);
          const targetIndex = projeto.etapas.findIndex(e => e.id === targetId);
          if (etapaIndex !== -1 && targetIndex !== -1) {
            reordenarEtapa(draggedItem.id, targetIndex);
          }
        } else if (draggedItem.type === 'tarefa' && targetType === 'tarefa') {
          // Reordenar tarefas dentro da mesma etapa ou mover entre etapas
          const etapaOrigemId = projeto.etapas.find(e => e.tarefas.some(t => t.id === draggedItem.id))?.id;
          const etapaDestinoId = projeto.etapas.find(e => e.tarefas.some(t => t.id === targetId))?.id;
          
          if (etapaOrigemId && etapaDestinoId) {
            if (etapaOrigemId === etapaDestinoId) {
              // Reordenar dentro da mesma etapa
              reordenarTarefaDentroEtapa(draggedItem.id, targetId, etapaOrigemId);
            } else {
              // Mover entre etapas diferentes
              const novaPosicao = projeto.etapas.find(e => e.id === etapaDestinoId)?.tarefas.findIndex(t => t.id === targetId) || 0;
              moverTarefa(draggedItem.id, etapaOrigemId, etapaDestinoId, novaPosicao);
            }
          }
        }
      } catch (error) {
        console.error('Erro no drag & drop:', error);
      }
      setDraggedItem(null);
    }
  };

  // Nova função para reordenar tarefas dentro da mesma etapa
  const reordenarTarefaDentroEtapa = (tarefaId: string, targetId: string, etapaId: string) => {
    setSalvandoCrud(true);
    try {
      const etapa = projeto.etapas.find(e => e.id === etapaId);
      if (!etapa) throw new Error('Etapa não encontrada');

      const tarefaIndex = etapa.tarefas.findIndex(t => t.id === tarefaId);
      const targetIndex = etapa.tarefas.findIndex(t => t.id === targetId);
      
      if (tarefaIndex === -1 || targetIndex === -1) throw new Error('Tarefa não encontrada');

      const novasTarefas = [...etapa.tarefas];
      const [tarefaMovida] = novasTarefas.splice(tarefaIndex, 1);
      novasTarefas.splice(targetIndex, 0, tarefaMovida);

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(e => 
          e.id === etapaId 
            ? { ...e, tarefas: novasTarefas }
            : e
        )
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Reordenar Tarefa', 'tarefa', tarefaId, 
        { posicaoAnterior: tarefaIndex, etapa: etapaId }, 
        { novaPosicao: targetIndex, etapa: etapaId }
      );
      
      console.log('✅ Tarefa reordenada com sucesso dentro da etapa:', tarefaId);
    } catch (error) {
      console.error('❌ Erro ao reordenar tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  // Funções para tarefas em revisão
  const irParaTarefa = (tarefaId: string) => {
    console.log('Navegando para tarefa:', tarefaId);
    // Expandir a etapa que contém a tarefa
    const etapa = projeto.etapas.find(e => e.tarefas.some(t => t.id === tarefaId));
    if (etapa && !etapasExpandidas.includes(etapa.id)) {
      setEtapasExpandidas([...etapasExpandidas, etapa.id]);
    }
    setTooltipRevisaoVisible(false);
  };

  const marcarComoCorrigida = (tarefaId: string) => {
    console.log('Marcando tarefa como corrigida:', tarefaId);
    // Aqui você implementaria a lógica para alterar o status da tarefa
    setTooltipRevisaoVisible(false);
  };

  // Funções para controlar tooltip com delay
  const handleMouseEnterTooltip = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setTooltipRevisaoVisible(true);
  };

  const handleMouseLeaveTooltip = () => {
    const timeout = setTimeout(() => {
      setTooltipRevisaoVisible(false);
    }, 300); // 300ms delay
    setTooltipTimeout(timeout);
  };

  // Funções para tooltip de aguardando aprovação
  const handleMouseEnterAguardando = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setTooltipAguardandoVisible(true);
  };

  const handleMouseLeaveAguardando = () => {
    const timeout = setTimeout(() => {
      setTooltipAguardandoVisible(false);
    }, 300); // 300ms delay
    setTooltipTimeout(timeout);
  };

  const aprovarTarefa = (tarefaId: string) => {
    console.log('Aprovando tarefa:', tarefaId);
    // Aqui você implementaria a lógica para aprovar a tarefa
    setTooltipAguardandoVisible(false);
  };

  const rejeitarTarefa = (tarefaId: string) => {
    console.log('Rejeitando tarefa:', tarefaId);
    // Aqui você implementaria a lógica para rejeitar e enviar para revisão
    setTooltipAguardandoVisible(false);
  };

  // ===== SISTEMA DE VALIDAÇÃO INTELIGENTE =====

  // Dependências inteligentes entre tarefas
  const dependenciasInteligentes: DependenciaInteligente[] = [
    {
      tarefa_origem: 'levantamento_topografico',
      tarefa_destino: 'projeto_arquitetonico',
      tipo: 'obrigatoria',
      flexibilidade: 'rigida',
      justificativa: 'Impossível projetar sem conhecer o terreno'
    },
    {
      tarefa_origem: 'briefing_inicial',
      tarefa_destino: 'projeto_arquitetonico',
      tipo: 'obrigatoria',
      flexibilidade: 'rigida',
      justificativa: 'Projeto deve atender às necessidades do cliente'
    },
    {
      tarefa_origem: 'projeto_arquitetonico',
      tarefa_destino: 'projeto_estrutural',
      tipo: 'recomendada',
      flexibilidade: 'moderada',
      justificativa: 'Estrutura deve seguir arquitetura, mas pode ser paralelo'
    }
  ];

  // Função para validar dependências
  const validarDependencias = (operacao: OperacaoCrud): ValidacaoImpacto[] => {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.tipo === 'reordenar' && operacao.entidade === 'tarefa') {
      const etapa = projeto.etapas.find(e => e.tarefas.some(t => t.id === operacao.id));
      if (!etapa) return validacoes;

      const tarefaIndex = etapa.tarefas.findIndex(t => t.id === operacao.id);
      const novaPosicao = operacao.contexto?.posicao_destino || 0;

      // Verificar dependências violadas
      dependenciasInteligentes.forEach(dep => {
        const tarefaOrigemIndex = etapa.tarefas.findIndex(t => t.nome.toLowerCase().includes(dep.tarefa_origem));
        const tarefaDestinoIndex = etapa.tarefas.findIndex(t => t.nome.toLowerCase().includes(dep.tarefa_destino));

        if (tarefaOrigemIndex !== -1 && tarefaDestinoIndex !== -1) {
          // Se estamos movendo a tarefa destino para antes da origem
          if (operacao.id === etapa.tarefas[tarefaDestinoIndex]?.id && novaPosicao <= tarefaOrigemIndex) {
            validacoes.push({
              id: `dep_${dep.tarefa_origem}_${dep.tarefa_destino}`,
              tipo: dep.flexibilidade === 'rigida' ? 'error' : 'warning',
              categoria: 'dependencia',
              mensagem: `Dependência violada: ${dep.justificativa}`,
              impacto_estimado: {
                risco_qualidade: dep.flexibilidade === 'rigida' ? 'alto' : 'medio'
              },
              sugestoes: [
                'Manter ordem original',
                'Ajustar dependência manualmente',
                dep.flexibilidade !== 'rigida' ? 'Confirmar exceção' : 'Cancelar operação'
              ],
              pode_prosseguir: dep.flexibilidade !== 'rigida'
            });
          }
        }
      });
    }

    return validacoes;
  };

  // Função para calcular impacto em prazos
  const calcularImpactoPrazos = (operacao: OperacaoCrud): ValidacaoImpacto[] => {
    const validacoes: ValidacaoImpacto[] = [];

    if (operacao.tipo === 'criar' && operacao.entidade === 'tarefa') {
      const horasEstimadas = operacao.dados?.tempo_estimado || 8 * 3600; // 8h padrão
      const diasAdicionais = Math.ceil(horasEstimadas / (8 * 3600));

      validacoes.push({
        id: 'impacto_prazo_nova_tarefa',
        tipo: diasAdicionais > 2 ? 'warning' : 'info',
        categoria: 'prazo',
        mensagem: `Nova tarefa adicionará ${Math.round(horasEstimadas / 3600)}h ao projeto`,
        impacto_estimado: {
          horas_adicionais: horasEstimadas,
          dias_atraso: diasAdicionais
        },
        sugestoes: [
          'Ajustar prazo final do projeto',
          'Redistribuir tarefas na equipe',
          'Otimizar outras tarefas para compensar'
        ],
        pode_prosseguir: true
      });
    }

    if (operacao.tipo === 'excluir' && operacao.entidade === 'tarefa') {
      const tarefa = projeto.etapas.flatMap(e => e.tarefas).find(t => t.id === operacao.id);
      if (tarefa) {
        const horasEconomizadas = tarefa.tempo_estimado;
        
        validacoes.push({
          id: 'impacto_prazo_excluir_tarefa',
          tipo: 'info',
          categoria: 'prazo',
          mensagem: `Exclusão economizará ${Math.round(horasEconomizadas / 3600)}h do projeto`,
          impacto_estimado: {
            horas_adicionais: -horasEconomizadas
          },
          sugestoes: [
            'Projeto será finalizado mais cedo',
            'Considere adicionar revisões extras',
            'Realoque tempo para outras tarefas'
          ],
          pode_prosseguir: true
        });
      }
    }

    return validacoes;
  };

  // Função principal de validação
  const validarOperacao = async (operacao: OperacaoCrud): Promise<ResultadoValidacao> => {
    const validacoes: ValidacaoImpacto[] = [];

    // Executar todas as validações
    validacoes.push(...validarDependencias(operacao));
    validacoes.push(...calcularImpactoPrazos(operacao));

    // Calcular impacto total
    const horasAdicionais = validacoes.reduce((total, v) => 
      total + (v.impacto_estimado.horas_adicionais || 0), 0);
    
    const diasAtraso = validacoes.reduce((total, v) => 
      total + (v.impacto_estimado.dias_atraso || 0), 0);

    const tempoTotalNovo = projeto.tempo_total_estimado + horasAdicionais;
    const dataEntregaAtual = new Date(projeto.prazo_final);
    const dataEntregaNova = new Date(dataEntregaAtual.getTime() + (diasAtraso * 24 * 60 * 60 * 1000));

    const temErros = validacoes.some(v => v.tipo === 'error');
    const temAvisos = validacoes.some(v => v.tipo === 'warning');

    return {
      pode_prosseguir: !temErros,
      requer_confirmacao: temAvisos,
      validacoes,
      impacto_calculado: {
        tempo_total_novo: tempoTotalNovo,
        data_entrega_nova: dataEntregaNova.toISOString().split('T')[0],
        dias_atraso: diasAtraso,
        custo_adicional: horasAdicionais * 150, // R$ 150/hora
        tarefas_afetadas: []
      },
      sugestoes_alternativas: []
    };
  };

  // ===== FUNÇÕES CRUD COMPLETAS =====

  // Função utilitária para registrar ações no histórico
  const registrarAcaoCrud = (acao: string, tipo: 'projeto' | 'etapa' | 'tarefa', itemId: string, dadosAnteriores: any, dadosNovos: any) => {
    const novaAcao = {
      id: `acao_${Date.now()}`,
      acao,
      tipo,
      itemId,
      dadosAnteriores: JSON.parse(JSON.stringify(dadosAnteriores)), // Deep clone
      dadosNovos: JSON.parse(JSON.stringify(dadosNovos)),
      timestamp: new Date(),
      usuario: 'Ana Paula Arquiteta' // Em produção, vem do contexto de autenticação
    };
    setHistoricoCrud(prev => [novaAcao, ...prev].slice(0, 50)); // Mantém apenas as últimas 50 ações
  };

  // === CRUD ETAPAS ===
  const criarEtapa = (dadosEtapa: Partial<Etapa>) => {
    setSalvandoCrud(true);
    try {
      const novaEtapa: Etapa = {
        id: `etapa_${Date.now()}`,
        numero: projeto.etapas.length + 1,
        nome: dadosEtapa.nome || 'Nova Etapa',
        progresso: 0,
        status: 'nao_iniciada',
        tarefas: []
      };

      const projetoAtualizado = {
        ...projeto,
        etapas: [...projeto.etapas, novaEtapa]
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Criar Etapa', 'etapa', novaEtapa.id, null, novaEtapa);
      
      // Expandir automaticamente a nova etapa
      setEtapasExpandidas(prev => [...prev, novaEtapa.id]);
      
      console.log('✅ Etapa criada com sucesso:', novaEtapa);
      return novaEtapa;
    } catch (error) {
      console.error('❌ Erro ao criar etapa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const editarEtapa = (etapaId: string, dadosAtualizados: Partial<Etapa>) => {
    setSalvandoCrud(true);
    try {
      const etapaAnterior = projeto.etapas.find(e => e.id === etapaId);
      if (!etapaAnterior) throw new Error('Etapa não encontrada');

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa =>
          etapa.id === etapaId
            ? { ...etapa, ...dadosAtualizados }
            : etapa
        )
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Editar Etapa', 'etapa', etapaId, etapaAnterior, { ...etapaAnterior, ...dadosAtualizados });
      
      console.log('✅ Etapa editada com sucesso:', etapaId);
    } catch (error) {
      console.error('❌ Erro ao editar etapa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const duplicarEtapa = (etapaId: string) => {
    setSalvandoCrud(true);
    try {
      const etapaOriginal = projeto.etapas.find(e => e.id === etapaId);
      if (!etapaOriginal) throw new Error('Etapa não encontrada');

      const novaEtapa: Etapa = {
        ...etapaOriginal,
        id: `etapa_${Date.now()}`,
        numero: projeto.etapas.length + 1,
        nome: `${etapaOriginal.nome} (Cópia)`,
        progresso: 0,
        status: 'nao_iniciada',
        tarefas: etapaOriginal.tarefas.map(tarefa => ({
          ...tarefa,
          id: `tarefa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'nao_iniciada' as const,
          tempo_total: 0,
          tempo_sessao_atual: 0,
          cronometro_ativo: false,
          data_inicio: undefined,
          data_conclusao: undefined
        }))
      };

      const projetoAtualizado = {
        ...projeto,
        etapas: [...projeto.etapas, novaEtapa]
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Duplicar Etapa', 'etapa', novaEtapa.id, etapaOriginal, novaEtapa);
      
      console.log('✅ Etapa duplicada com sucesso:', novaEtapa);
      return novaEtapa;
    } catch (error) {
      console.error('❌ Erro ao duplicar etapa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const excluirEtapa = (etapaId: string) => {
    setSalvandoCrud(true);
    try {
      const etapaParaExcluir = projeto.etapas.find(e => e.id === etapaId);
      if (!etapaParaExcluir) throw new Error('Etapa não encontrada');

      // Verificar se há tarefas em andamento
      const tarefasEmAndamento = etapaParaExcluir.tarefas.filter(t => 
        t.status === 'em_progresso' || t.cronometro_ativo
      );
      
      if (tarefasEmAndamento.length > 0) {
        throw new Error('Não é possível excluir etapa com tarefas em andamento');
      }

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas
          .filter(etapa => etapa.id !== etapaId)
          .map((etapa, index) => ({ ...etapa, numero: index + 1 })) // Reordenar números
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Excluir Etapa', 'etapa', etapaId, etapaParaExcluir, null);
      
      // Remover da lista de expandidas
      setEtapasExpandidas(prev => prev.filter(id => id !== etapaId));
      
      console.log('✅ Etapa excluída com sucesso:', etapaId);
    } catch (error) {
      console.error('❌ Erro ao excluir etapa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const reordenarEtapa = (etapaId: string, novaPosicao: number) => {
    setSalvandoCrud(true);
    try {
      const etapas = [...projeto.etapas];
      const etapaIndex = etapas.findIndex(e => e.id === etapaId);
      
      if (etapaIndex === -1) throw new Error('Etapa não encontrada');
      
      // Remover etapa da posição atual
      const [etapaMovida] = etapas.splice(etapaIndex, 1);
      
      // Inserir na nova posição
      etapas.splice(novaPosicao, 0, etapaMovida);
      
      // Atualizar números das etapas
      const etapasReordenadas = etapas.map((etapa, index) => ({
        ...etapa,
        numero: index + 1
      }));

      const projetoAtualizado = {
        ...projeto,
        etapas: etapasReordenadas
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Reordenar Etapa', 'etapa', etapaId, { posicaoAnterior: etapaIndex }, { novaPosicao });
      
      console.log('✅ Etapa reordenada com sucesso:', etapaId);
    } catch (error) {
      console.error('❌ Erro ao reordenar etapa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  // === CRUD TAREFAS ===
  const criarTarefa = async (etapaId: string, dadosTarefa: Partial<Tarefa>) => {
    // Criar operação para validação
    const operacao: OperacaoCrud = {
      tipo: 'criar',
      entidade: 'tarefa',
      dados: dadosTarefa,
      contexto: { etapa_destino: etapaId }
    };

    // Validar operação
    const validacao = await validarOperacao(operacao);

    // Se há erros ou avisos, mostrar modal de validação
    if (!validacao.pode_prosseguir || validacao.requer_confirmacao) {
      setValidacaoAtiva(validacao);
      setOperacaoPendente(operacao);
      return;
    }

    // Executar criação
    executarCriacaoTarefa(etapaId, dadosTarefa, validacao);
  };

  const executarCriacaoTarefa = (etapaId: string, dadosTarefa: Partial<Tarefa>, validacao?: ResultadoValidacao) => {
    setSalvandoCrud(true);
    try {
      const novaTarefa: Tarefa = {
        id: `tarefa_${Date.now()}`,
        nome: dadosTarefa.nome || 'Nova Tarefa',
        status: 'nao_iniciada',
        responsavel: dadosTarefa.responsavel || 'Não atribuído',
        tempo_estimado: dadosTarefa.tempo_estimado || 3600, // 1 hora padrão
        tempo_total: 0,
        tempo_sessao_atual: 0,
        cronometro_ativo: false,
        prioridade: dadosTarefa.prioridade || 'media',
        requer_aprovacao: dadosTarefa.requer_aprovacao || false,
        notas_sessoes: [],
        arquivos: [],
        revisoes: []
      };

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa =>
          etapa.id === etapaId
            ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
            : etapa
        ),
        // Atualizar tempo total se há validação
        tempo_total_estimado: validacao?.impacto_calculado.tempo_total_novo || projeto.tempo_total_estimado,
        prazo_final: validacao?.impacto_calculado.data_entrega_nova || projeto.prazo_final
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Criar Tarefa', 'tarefa', novaTarefa.id, null, novaTarefa);
      
      // Mostrar notificação de impacto se necessário
      if (validacao && validacao.impacto_calculado.dias_atraso > 0) {
        console.log(`⚠️ Nova tarefa adicionou ${validacao.impacto_calculado.dias_atraso} dias ao projeto`);
      }
      
      console.log('✅ Tarefa criada com sucesso:', novaTarefa);
      return novaTarefa;
    } catch (error) {
      console.error('❌ Erro ao criar tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const editarTarefa = (tarefaId: string, dadosAtualizados: Partial<Tarefa>) => {
    setSalvandoCrud(true);
    try {
      let tarefaAnterior: Tarefa | undefined;
      
      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas.map(tarefa => {
            if (tarefa.id === tarefaId) {
              tarefaAnterior = tarefa;
              return { ...tarefa, ...dadosAtualizados };
            }
            return tarefa;
          })
        }))
      };

      if (!tarefaAnterior) throw new Error('Tarefa não encontrada');

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Editar Tarefa', 'tarefa', tarefaId, tarefaAnterior, { ...tarefaAnterior, ...dadosAtualizados });
      
      console.log('✅ Tarefa editada com sucesso:', tarefaId);
    } catch (error) {
      console.error('❌ Erro ao editar tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const duplicarTarefa = (tarefaId: string) => {
    setSalvandoCrud(true);
    try {
      let tarefaOriginal: Tarefa | undefined;
      let etapaId: string | undefined;
      
      // Encontrar a tarefa e sua etapa
      for (const etapa of projeto.etapas) {
        const tarefa = etapa.tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
          tarefaOriginal = tarefa;
          etapaId = etapa.id;
          break;
        }
      }

      if (!tarefaOriginal || !etapaId) throw new Error('Tarefa não encontrada');

      const novaTarefa: Tarefa = {
        ...tarefaOriginal,
        id: `tarefa_${Date.now()}`,
        nome: `${tarefaOriginal.nome} (Cópia)`,
        status: 'nao_iniciada',
        tempo_total: 0,
        tempo_sessao_atual: 0,
        cronometro_ativo: false,
        data_inicio: undefined,
        data_conclusao: undefined
      };

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa =>
          etapa.id === etapaId
            ? { ...etapa, tarefas: [...etapa.tarefas, novaTarefa] }
            : etapa
        )
      };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Duplicar Tarefa', 'tarefa', novaTarefa.id, tarefaOriginal, novaTarefa);
      
      console.log('✅ Tarefa duplicada com sucesso:', novaTarefa);
      return novaTarefa;
    } catch (error) {
      console.error('❌ Erro ao duplicar tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const excluirTarefa = (tarefaId: string) => {
    setSalvandoCrud(true);
    try {
      let tarefaParaExcluir: Tarefa | undefined;
      
      // Verificar se a tarefa está ativa ou com cronômetro rodando
      if (tarefaAtiva === tarefaId || cronometroAtivo === tarefaId) {
        throw new Error('Não é possível excluir tarefa que está em andamento');
      }

      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa => ({
          ...etapa,
          tarefas: etapa.tarefas.filter(tarefa => {
            if (tarefa.id === tarefaId) {
              tarefaParaExcluir = tarefa;
              return false;
            }
            return true;
          })
        }))
      };

      if (!tarefaParaExcluir) throw new Error('Tarefa não encontrada');

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Excluir Tarefa', 'tarefa', tarefaId, tarefaParaExcluir, null);
      
      // Remover dos detalhes expandidos
      setTarefasDetalhesExpandidos(prev => prev.filter(id => id !== tarefaId));
      
      console.log('✅ Tarefa excluída com sucesso:', tarefaId);
    } catch (error) {
      console.error('❌ Erro ao excluir tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  const moverTarefa = (tarefaId: string, etapaOrigemId: string, etapaDestinoId: string, novaPosicao?: number) => {
    setSalvandoCrud(true);
    try {
      let tarefaParaMover: Tarefa | undefined;
      
      const projetoAtualizado = {
        ...projeto,
        etapas: projeto.etapas.map(etapa => {
          if (etapa.id === etapaOrigemId) {
            // Remover da etapa origem
            const tarefaIndex = etapa.tarefas.findIndex(t => t.id === tarefaId);
            if (tarefaIndex !== -1) {
              tarefaParaMover = etapa.tarefas[tarefaIndex];
              return {
                ...etapa,
                tarefas: etapa.tarefas.filter(t => t.id !== tarefaId)
              };
            }
          } else if (etapa.id === etapaDestinoId && tarefaParaMover) {
            // Adicionar na etapa destino
            const novasTarefas = [...etapa.tarefas];
            if (novaPosicao !== undefined) {
              novasTarefas.splice(novaPosicao, 0, tarefaParaMover);
            } else {
              novasTarefas.push(tarefaParaMover);
            }
            return {
              ...etapa,
              tarefas: novasTarefas
            };
          }
          return etapa;
        })
      };

      if (!tarefaParaMover) throw new Error('Tarefa não encontrada');

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Mover Tarefa', 'tarefa', tarefaId, 
        { etapaOrigem: etapaOrigemId }, 
        { etapaDestino: etapaDestinoId, novaPosicao }
      );
      
      console.log('✅ Tarefa movida com sucesso:', tarefaId);
    } catch (error) {
      console.error('❌ Erro ao mover tarefa:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  // === CRUD PROJETO ===
  const editarProjeto = (dadosAtualizados: Partial<Projeto>) => {
    setSalvandoCrud(true);
    try {
      const projetoAnterior = { ...projeto };
      const projetoAtualizado = { ...projeto, ...dadosAtualizados };

      setProjeto(projetoAtualizado);
      registrarAcaoCrud('Editar Projeto', 'projeto', projeto.id, projetoAnterior, projetoAtualizado);
      
      console.log('✅ Projeto editado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao editar projeto:', error);
      throw error;
    } finally {
      setSalvandoCrud(false);
    }
  };

  // === FUNÇÕES DE CONTROLE DE INTERFACE ===
  const abrirModalEdicao = (tipo: 'projeto' | 'etapa' | 'tarefa', id: string | null, acao: 'criar' | 'editar' | 'duplicar') => {
    setModoEdicao({ tipo, id, acao });
    
    // Pré-carregar dados no formulário se for edição
    if (acao === 'editar' && id) {
      if (tipo === 'projeto') {
        setFormData(projeto);
      } else if (tipo === 'etapa') {
        const etapa = projeto.etapas.find(e => e.id === id);
        setFormData(etapa || {});
      } else if (tipo === 'tarefa') {
        const tarefa = projeto.etapas.flatMap(e => e.tarefas).find(t => t.id === id);
        setFormData(tarefa || {});
      }
    } else {
      setFormData({});
    }
  };

  const fecharModalEdicao = () => {
    setModoEdicao({ tipo: null, id: null, acao: null });
    setFormData({});
  };

  const abrirConfirmacaoExclusao = (tipo: 'projeto' | 'etapa' | 'tarefa', id: string, nome: string) => {
    setConfirmacaoExclusao({ aberto: true, tipo, id, nome });
  };

  const fecharConfirmacaoExclusao = () => {
    setConfirmacaoExclusao({ aberto: false, tipo: null, id: null, nome: '' });
  };

  const confirmarExclusao = () => {
    const { tipo, id } = confirmacaoExclusao;
    if (!tipo || !id) return;

    try {
      if (tipo === 'etapa') {
        excluirEtapa(id);
      } else if (tipo === 'tarefa') {
        excluirTarefa(id);
      }
      fecharConfirmacaoExclusao();
    } catch (error) {
      console.error('Erro na exclusão:', error);
      // Em produção, mostrar toast de erro
    }
  };

  // Funções para os botões misteriosos
  const gerarRelatorios = () => {
    console.log('📊 Gerando relatórios de produtividade...');
    // Aqui implementaria a geração de relatórios
    alert('📊 Relatórios de produtividade e progresso serão gerados em breve!');
  };

  const abrirConfiguracoes = () => {
    console.log('⚙️ Abrindo configurações do projeto...');
    // Aqui implementaria as configurações
    alert('⚙️ Configurações do projeto: prazos, responsáveis, notificações, etc.');
  };

  const salvarTudo = async () => {
    console.log('💾 Salvando todas as alterações...');
    setSalvandoCrud(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ Todas as alterações foram salvas com sucesso!');
    } catch (error) {
      alert('❌ Erro ao salvar alterações');
    } finally {
      setSalvandoCrud(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER LIMPO COM BREADCRUMB */}
      <div className="bg-white border-b w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
            {/* Breadcrumb de Navegação */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Projetos</span>
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{projeto.nome}</span>
            </div>
            
            {/* Controles de Visualização */}
            <div className="flex items-center space-x-3">
              <select 
                value={visualizacao}
                onChange={(e) => setVisualizacao(e.target.value as 'lista' | 'kanban' | 'timeline')}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="lista">📋 Lista</option>
                <option value="kanban">📊 Kanban</option>
                <option value="timeline">📅 Timeline</option>
              </select>
              <button
                onClick={() => setModoFoco(!modoFoco)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  modoFoco 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Focus className="h-4 w-4" />
                <span>{modoFoco ? 'Sair do Foco' : 'Modo Foco'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTAINER PARA O CONTEÚDO */}
      <div className="max-w-7xl mx-auto px-4">



      {/* MODO FOCO - TAREFA ATIVA CENTRALIZADA */}
      <AnimatePresence>
        {modoFoco && tarefaAtivaData && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden"
          >
              {/* Header Elegante */}
              <div className="relative bg-gradient-to-r from-blue-50/30 via-slate-50/30 to-white border-b border-slate-200/30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"></div>
                <div className="relative px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h1 className="text-2xl font-bold text-slate-800">Modo Foco Ativo</h1>
                    <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      Sessão {numeroSessoes}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setModoFoco(false)}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="p-8">
                {/* Nome da Tarefa */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">{tarefaAtivaData.nome}</h2>
                  <div className="flex items-center justify-center space-x-4 text-slate-600">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {tarefaAtivaData.responsavel}
                    </span>
                    <span className="text-slate-400">•</span>
                    <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-700">
                      {tarefaAtivaData.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Cronômetro Central Elegante */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="relative">
                      {/* Círculo de fundo */}
                      <div className="w-48 h-48 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                        {/* Cronômetro SVG */}
                        <div className="relative w-36 h-36">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="42"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="transparent"
                              className="text-slate-200"
                            />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="42"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray="264"
                              strokeDashoffset={cronometroAtivo ? "66" : "264"}
                              className="text-blue-500"
                              strokeLinecap="round"
                              animate={{
                                strokeDashoffset: cronometroAtivo ? ["66", "264", "66"] : "264"
                              }}
                              transition={{
                                duration: 3,
                                repeat: cronometroAtivo ? Infinity : 0,
                                ease: "linear"
                              }}
                            />
                          </svg>
                          
                          {/* Tempo no centro */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-mono font-bold text-slate-800 mb-1">
                                {formatarTempo(tempoSessaoAtual)}
                              </div>
                              <div className="text-sm text-slate-500">sessão atual</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicador de status */}
                      {cronometroAtivo && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métricas e Controles */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Cards de Métricas */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-blue-700">
                          {formatarTempoSimples(tempoSessaoAtual)}
                        </div>
                        <div className="text-sm text-blue-600">Sessão</div>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {formatarTempoSimples(calcularTempoTarefaAtualRealTime())}
                        </div>
                        <div className="text-sm text-green-600">Total</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-slate-700">
                          {formatarTempoSimples(tarefaAtivaData.tempo_estimado)}
                        </div>
                        <div className="text-sm text-slate-600">Estimado</div>
                      </div>
                    </div>

                    {/* Controles Principais */}
                    <div className="flex justify-center space-x-4">
                      {!cronometroAtivo ? (
                        <Button 
                          size="lg" 
                          onClick={() => iniciarTarefa(tarefaAtivaData.id)}
                          className="px-8 py-3 rounded-full text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar Sessão
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          variant="outline"
                          onClick={pausarTarefa}
                          className="px-8 py-3 rounded-full text-lg font-medium border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
                        >
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </Button>
                      )}
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => concluirTarefa(tarefaAtivaData.id)}
                        className="px-8 py-3 rounded-full text-lg font-medium border-2 border-green-300 text-green-700 hover:bg-green-50 transition-all duration-200"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Concluir
                      </Button>
                    </div>

                    {/* Campo de Anotações */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Anotações da Sessão
                      </label>
                      <Textarea
                        value={anotacaoSessao}
                        onChange={(e) => setAnotacaoSessao(e.target.value)}
                        placeholder="Digite suas anotações sobre o progresso..."
                        className="w-full h-24 resize-none rounded-xl border-2 border-slate-200 bg-slate-50/50 backdrop-blur-sm focus:bg-white focus:border-blue-300 transition-all duration-200"
                      />
                      <div className="flex justify-end">
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={salvarNota}
                          disabled={!anotacaoSessao.trim()}
                          className="rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Nota
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer com Dicas */}
                <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
                  <p className="text-sm text-slate-500">
                    <kbd className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded">Esc</kbd> para sair do modo foco • 
                    <kbd className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded ml-2">Space</kbd> para pausar/continuar
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {!modoFoco && (
        <>
          {/* LAYOUT HORIZONTAL - TODAS AS SEÇÕES EMPILHADAS VERTICALMENTE */}
          <div className="py-6 space-y-6 max-w-full">
        
        {/* SEÇÃO 1: VISÃO GERAL DO PROJETO */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Visão Geral do Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Cards em linha - 5 cards lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {/* Card 1: Dados do Projeto */}
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardContent className="p-3 text-center">
                  <Building className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-sm font-bold text-indigo-700 mb-2">{projeto.nome}</div>
                  <div className="space-y-1 text-xs">
                    <div className="text-indigo-600">👤 {projeto.cliente}</div>
                    <div className="text-indigo-600">🏗️ {projeto.gerente}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Tempo - CRONÔMETRO EM TEMPO REAL */}
              <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 ${cronometroAtivo ? 'ring-2 ring-green-400 ring-opacity-60' : ''}`}>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className={`h-6 w-6 text-blue-600 ${cronometroAtivo ? 'animate-pulse' : ''}`} />
                    {cronometroAtivo && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></div>
                    )}
                  </div>
                  <div className={`font-mono text-base font-bold ${cronometroAtivo ? 'text-green-700' : 'text-blue-700'}`}>
                    {formatarTempoTotalRealTime()}
                  </div>
                  <div className="text-xs text-blue-600">de {formatarTempoSimples(projeto.tempo_total_estimado * 3600)}</div>
                  <div className={`text-xs mt-1 ${cronometroAtivo ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                    {cronometroAtivo ? '⏱️ Tempo Real' : 'Tempo Total'}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Prazo */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-3 text-center">
                  <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-700">97</div>
                  <div className="text-xs text-green-600">dias restantes</div>
                  <div className="text-xs text-gray-600 mt-1">Até 15/06</div>
                </CardContent>
              </Card>

              {/* Card 4: Equipe */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-3 text-center">
                  <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-700">4</div>
                  <div className="text-xs text-purple-600">pessoas ativas</div>
                  <div className="text-xs text-gray-600 mt-1">Equipe</div>
                </CardContent>
              </Card>

              {/* Card 5: Tarefas Concluídas */}
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-3 text-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-emerald-700">{tarefasConcluidas}/{totalTarefas}</div>
                  <div className="text-xs text-emerald-600">tarefas concluídas</div>
                  <div className="text-xs text-gray-600 mt-1">Progresso</div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de Progresso Geral */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Progresso Geral do Projeto</h4>
                <span className="text-lg font-bold text-blue-600">{projeto.progresso_geral}%</span>
              </div>
              {/* Barra de Progresso Customizada */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${projeto.progresso_geral}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Iniciado em {new Date(projeto.data_inicio).toLocaleDateString('pt-BR')}</span>
                <span>Prazo: {new Date(projeto.prazo_final).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Segunda linha - Cards Consolidados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              
              {/* CARD 1: ALERTAS & STATUS CRÍTICOS */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-red-800">Alertas & Status Críticos</h4>
                      <p className="text-xs text-red-600">🚨 Atenção Necessária</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-red-100/70">
                      <span className="text-sm text-red-700 flex items-center">
                        🔴 <span className="ml-2">Tarefas atrasadas</span>
                      </span>
                      <Badge variant="destructive" className="bg-red-600">0</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-yellow-100/70">
                      <span className="text-sm text-yellow-700 flex items-center">
                        🟡 <span className="ml-2">Vencendo hoje</span>
                      </span>
                      <Badge className="bg-yellow-600">1</Badge>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70 cursor-pointer hover:bg-blue-200/70 transition-colors relative"
                      onMouseEnter={handleMouseEnterAguardando}
                      onMouseLeave={handleMouseLeaveAguardando}
                    >
                      <span className="text-sm text-blue-700 flex items-center">
                        🔵 <span className="ml-2">Aguardando aprovação</span>
                      </span>
                      <Badge className="bg-blue-600">{aguardandoAprovacao.length}</Badge>
                      
                      {/* Tooltip para aguardando aprovação */}
                      {tooltipAguardandoVisible && aguardandoAprovacao.length > 0 && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
                          onMouseEnter={handleMouseEnterAguardando}
                          onMouseLeave={handleMouseLeaveAguardando}
                        >
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm">Aguardando Decisão do Manager</h4>
                            <p className="text-xs text-gray-500">{aguardandoAprovacao.length} tarefa(s) enviada(s) pelo colaborador</p>
                          </div>
                          
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {aguardandoAprovacao.map((tarefa) => (
                              <div key={tarefa.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm text-gray-900 mb-1">{tarefa.nome}</h5>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      <div>👤 {tarefa.responsavel}</div>
                                      <div>📅 Enviado: {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                    </div>
                                  </div>
                                  <Badge className="bg-blue-500 text-white text-xs">Aguardando</Badge>
                                </div>
                                
                                <div className="flex justify-center mt-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs px-3 py-1 h-7 border-blue-300 text-blue-700 hover:bg-blue-50"
                                    onClick={() => irParaTarefa(tarefa.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver Detalhes
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                              Passe o mouse fora para fechar
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    

                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: PRODUTIVIDADE HOJE */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Zap className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-green-800">Produtividade Hoje</h4>
                      <p className="text-xs text-green-600">📊 Performance Atual</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-green-100/70">
                      <span className="text-sm text-green-700 flex items-center">
                        ⏱️ <span className="ml-2">Flow time</span>
                      </span>
                      <Badge className="bg-green-600 text-white">4h 30min</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-emerald-100/70">
                      <span className="text-sm text-emerald-700 flex items-center">
                        🎯 <span className="ml-2">Foco score</span>
                      </span>
                      <Badge className="bg-emerald-600 text-white">85%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70">
                      <span className="text-sm text-blue-700 flex items-center">
                        ✅ <span className="ml-2">Tarefas concluídas</span>
                      </span>
                      <Badge className="bg-blue-600 text-white">3</Badge>
                    </div>
                    

                  </div>
                </CardContent>
              </Card>

              {/* CARD 3: APROVAÇÕES CONSOLIDADO */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Aprovações</h4>
                      <p className="text-xs text-blue-600">🔍 Central de Aprovações</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div 
                      className="flex items-center justify-between py-1.5 px-2 rounded bg-orange-100/70 cursor-pointer hover:bg-orange-200/70 transition-colors relative"
                      onMouseEnter={handleMouseEnterTooltip}
                      onMouseLeave={handleMouseLeaveTooltip}
                    >
                      <span className="text-sm text-orange-700 flex items-center">
                        ⏳ <span className="ml-2">Aguardando revisão</span>
                      </span>
                      <Badge className="bg-orange-600">{tarefasEmRevisao.length}</Badge>
                      
                      {/* Tooltip para tarefas em revisão */}
                      {tooltipRevisaoVisible && tarefasEmRevisao.length > 0 && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
                          onMouseEnter={handleMouseEnterTooltip}
                          onMouseLeave={handleMouseLeaveTooltip}
                        >
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm">Aguardando Decisão do Manager</h4>
                            <p className="text-xs text-gray-500">{tarefasEmRevisao.length} tarefa(s) enviada(s) pelo colaborador</p>
                          </div>
                          
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {tarefasEmRevisao.map((tarefa) => (
                              <div key={tarefa.id} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-sm text-gray-900 mb-1">{tarefa.nome}</h5>
                                    <div className="text-xs text-gray-600 space-y-1">
                                      <div>👤 {tarefa.responsavel}</div>
                                      <div>📅 Desde: {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</div>
                                    </div>
                                  </div>
                                  <Badge className="bg-orange-500 text-white text-xs">Aguardando</Badge>
                                </div>
                                
                                <div className="flex justify-center mt-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-xs px-3 py-1 h-7 border-blue-300 text-blue-700 hover:bg-blue-50"
                                    onClick={() => irParaTarefa(tarefa.id)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Ver Detalhes
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                              Passe o mouse fora para fechar
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-emerald-100/70">
                      <span className="text-sm text-emerald-700 flex items-center">
                        ✅ <span className="ml-2">Aprovadas hoje</span>
                      </span>
                      <Badge className="bg-emerald-600">{tarefasAprovadas.length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-blue-100/70">
                      <span className="text-sm text-blue-700 flex items-center">
                        🔄 <span className="ml-2">Em correção</span>
                      </span>
                      <Badge className="bg-blue-600">0</Badge>
                    </div>
                    

                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* SEÇÃO 2: TAREFA ATIVA - Layout Compacto */}
        {tarefaAtiva && tarefaAtivaData && (
          <Card className="w-full">
            <CardContent className="p-4">
              {/* Header com Cronômetro e Controles */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h2 className="text-base font-semibold text-gray-900">Tarefa Atual</h2>
                  </div>
                  
                  {/* Cronômetro da Sessão */}
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                      <span className="text-green-600 font-mono font-semibold">
                        ⏱️ {formatarTempo(tempoSessaoAtual)}
                      </span>
                      <span className="text-green-500 text-xs ml-1">sessão</span>
                    </div>
                    <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      <span className="text-blue-600 font-mono font-semibold">
                        🕒 {formatarTempo(calcularTempoTarefaAtualRealTime())}
                      </span>
                      <span className="text-blue-500 text-xs ml-1">total</span>
                    </div>
                    <div className="bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                      <span className="text-purple-600 font-mono font-semibold">
                        📊 {numeroSessoes}
                      </span>
                      <span className="text-purple-500 text-xs ml-1">sessões</span>
                    </div>
                  </div>
                </div>

                {/* Controles de Cronômetro */}
                <div className="flex items-center space-x-2">
                  {cronometroAtivo !== tarefaAtivaData.id ? (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white h-8"
                      onClick={() => iniciarTarefa(tarefaAtivaData.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {cronometroAtivo ? 'Retomar' : 'Iniciar'}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-orange-300 text-orange-700 hover:bg-orange-50 h-8"
                      onClick={pausarTarefa}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pausar
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                    onClick={() => concluirTarefa(tarefaAtivaData.id)}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Concluir
                  </Button>
                </div>
              </div>

              {/* Nome da Tarefa */}
              <div className="mb-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{tarefaAtivaData.nome}</h3>
                <p className="text-sm text-gray-600">Desenvolvimento do programa de necessidades detalhado</p>
              </div>

              {/* Informações Compactas */}
              <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">👤 Responsável</span>
                  <span className="font-medium text-gray-900">{tarefaAtivaData.responsavel}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">📊 Estimado</span>
                  <span className="font-medium text-gray-900">{formatarTempoSimples(tarefaAtivaData.tempo_estimado)}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">📅 Iniciado</span>
                  <span className="font-medium text-gray-900">{tarefaAtivaData.data_inicio ? new Date(tarefaAtivaData.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 block">📈 Progresso</span>
                  <span className="font-medium text-gray-900">73%</span>
                </div>
              </div>

              {/* Barra de Progresso Compacta */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" style={{ width: '73%' }}></div>
                </div>
              </div>

              {/* Anotações da Sessão Compacta */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Anotações da Sessão Atual
                </label>
                <Textarea
                  value={anotacaoSessao}
                  onChange={(e) => setAnotacaoSessao(e.target.value)}
                  placeholder="O que está sendo feito nesta sessão..."
                  className="w-full h-16 text-xs resize-none"
                />
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className={`${anotacaoSalva ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {anotacaoSalva ? '✅ Anotação salva com sucesso!' : 'Digite sua anotação e clique em Salvar'}
                  </span>
                  <Button 
                    size="sm"
                    variant={anotacaoSalva ? "primary" : "outline"}
                    onClick={salvarNota}
                    disabled={!anotacaoSessao.trim() || anotacaoSalva}
                    className={`text-xs h-6 px-2 ${anotacaoSalva ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                  >
                    {anotacaoSalva ? (
                      <>
                        <CheckCircle2 className="h-2 w-2 mr-1" />
                        Salvo
                      </>
                    ) : (
                      <>
                        <Save className="h-2 w-2 mr-1" />
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}



        {/* SEÇÃO 4: PRÓXIMAS TAREFAS */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasTarefas.length > 0 ? (
                proximasTarefas.map((tarefa) => (
                  <div key={tarefa.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{tarefa.nome}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{tarefa.responsavel}</span>
                        <span>•</span>
                        <span>{formatarTempoSimples(tarefa.tempo_estimado)}</span>
                        <span>•</span>
                        <Badge className={tarefa.corBadge}>
                          {tarefa.labelPrazo}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => iniciarTarefa(tarefa.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {tarefa.status === 'em_progresso' ? 'Continuar' : 'Iniciar'}
                    </Button>
                  </div>
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

        {/* SEÇÃO 5: ESTRUTURA DO PROJETO - ETAPAS E TAREFAS */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Workflow className="h-5 w-5 mr-2 text-purple-600" />
                Estrutura do Projeto - Etapas e Tarefas
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline">
                  {projeto.etapas.length} etapas
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* VISUALIZAÇÃO LISTA */}
              {visualizacao === 'lista' && projeto.etapas.map((etapa) => (
                <Card 
                  key={etapa.id} 
                  className="border-l-4 border-l-purple-500"
                  draggable
                  onDragStart={() => handleDragStart('etapa', etapa.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, etapa.id, 'etapa')}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEtapa(etapa.id)}
                          className="p-1"
                        >
                          {etapasExpandidas.includes(etapa.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <h4 className="font-semibold text-gray-900">
                          ETAPA {etapa.numero}: {etapa.nome}
                        </h4>
                        <Badge className={getStatusColor(etapa.status)}>
                          {etapa.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          ({etapa.tarefas.length} tarefas)
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Progress value={etapa.progresso} className="w-24" />
                          <span className="text-sm font-medium text-gray-600">
                            {etapa.progresso}%
                          </span>
                        </div>
                        {/* Menu CRUD da Etapa - ESTILO CORRIGIDO */}
                        <div className="relative group">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-1">
                              <button
                                onClick={() => abrirModalEdicao('etapa', null, 'criar')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Etapa
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => abrirModalEdicao('etapa', etapa.id, 'editar')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Etapa
                              </button>
                              <button
                                onClick={() => abrirModalEdicao('etapa', etapa.id, 'duplicar')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicar Etapa
                              </button>
                              <button
                                onClick={() => abrirModalEdicao('tarefa', null, 'criar')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Tarefa
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => abrirConfirmacaoExclusao('etapa', etapa.id, etapa.nome)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Excluir Etapa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {etapasExpandidas.includes(etapa.id) && (
                    <CardContent className="pt-0">
                    <div className="space-y-3">
                      {etapa.tarefas.map((tarefa) => (
                        <div key={tarefa.id}>
                          {/* CARD PRINCIPAL DA TAREFA - FORMATO FINO */}
                          <div
                            className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                              tarefa.id === tarefaAtiva 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 bg-white'
                            }`}
                            draggable
                            onDragStart={() => handleDragStart('tarefa', tarefa.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, tarefa.id, 'tarefa')}
                          >
                            <div className="flex items-center justify-between">
                              {/* INFORMAÇÕES PRINCIPAIS */}
                              <div className="flex items-center space-x-3 flex-1">
                                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 text-sm">{tarefa.nome}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {tarefa.responsavel} • {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                  </div>
                                </div>
                                <Badge className={`${getStatusColor(tarefa.status)} text-xs`}>
                                  {tarefa.status.replace('_', ' ')}
                                </Badge>
                              </div>

                              {/* BOTÕES DE AÇÃO CONTEXTUAIS */}
                              <div className="flex items-center space-x-1">
                                {/* BOTÃO PRINCIPAL - BASEADO NO ESTADO */}
                                {tarefa.id === tarefaAtiva && cronometroAtivo ? (
                                  // Tarefa ativa com cronômetro rodando - PAUSAR
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 h-7 px-3"
                                    onClick={pausarTarefa}
                                  >
                                    <Pause className="h-3 w-3 mr-1" />
                                    Pausar
                                  </Button>
                                ) : tarefa.id === tarefaAtiva && !cronometroAtivo ? (
                                  // Tarefa ativa mas cronômetro parado - CONTINUAR
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-3"
                                    onClick={() => iniciarTarefa(tarefa.id)}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Continuar
                                  </Button>
                                ) : tarefa.status === 'em_progresso' ? (
                                  // Tarefa em progresso mas não ativa - INICIAR
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3"
                                    onClick={() => iniciarTarefa(tarefa.id)}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Iniciar
                                  </Button>
                                ) : tarefa.status === 'nao_iniciada' ? (
                                  // Tarefa não iniciada - COMEÇAR
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-50 h-7 px-3"
                                    onClick={() => iniciarTarefa(tarefa.id)}
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    Começar
                                  </Button>
                                ) : tarefa.status === 'concluida' ? (
                                  // Tarefa concluída - SEM BOTÃO (já tem badge)
                                  null
                                ) : (
                                  // Outros status - ÍCONE CONTEXTUAL
                                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded text-gray-700 h-7">
                                    <span className="text-sm">{getStatusIcon(tarefa.status)}</span>
                                    <span className="text-xs font-medium ml-1">
                                      {tarefa.status === 'em_revisao' ? 'Em Revisão' : 
                                       tarefa.status === 'aguardando_aprovacao' ? 'Aguardando' : 
                                       tarefa.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                )}

                                {/* BOTÕES SECUNDÁRIOS */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 text-gray-700 h-7 px-2"
                                  onClick={() => toggleDetalheTarefa(tarefa.id)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>

                                {tarefa.requer_aprovacao && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-300 text-purple-700 h-7 px-2"
                                  >
                                    <Upload className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* CRONÔMETRO ATIVO (só aparece quando a tarefa está ativa) */}
                            {tarefa.id === tarefaAtiva && cronometroAtivo && (
                              <div className="mt-2 p-2 bg-green-100 rounded-md">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-green-800">
                                    ⏱️ Sessão Atual: <span className="font-mono font-bold">{formatarTempo(tempoSessaoAtual)}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-orange-300 text-orange-700 h-6 px-2 text-xs"
                                      onClick={pausarTarefa}
                                    >
                                      Pausar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* DETALHES EXPANDÍVEIS */}
                          {tarefasDetalhesExpandidos.includes(tarefa.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 bg-white rounded-lg border shadow-sm overflow-hidden"
                            >
                              {/* HEADER COM INFORMAÇÕES PRINCIPAIS */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <div>
                                      <div className="text-xs text-gray-600">Tempo Total</div>
                                      <div className="font-semibold text-gray-900">
                                        {tarefa.id === tarefaAtiva ? formatarTempo(calcularTempoTarefaAtualRealTime()) : formatarTempo(tarefa.tempo_total)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Target className="h-4 w-4 text-green-600" />
                                    <div>
                                      <div className="text-xs text-gray-600">Estimado</div>
                                      <div className="font-semibold text-gray-900">{formatarTempo(tarefa.tempo_estimado)}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-purple-600" />
                                    <div>
                                      <div className="text-xs text-gray-600">Responsável</div>
                                      <div className="font-semibold text-gray-900">{tarefa.responsavel}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                    <div>
                                      <div className="text-xs text-gray-600">Iniciado</div>
                                      <div className="font-semibold text-gray-900">
                                        {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* CONTEÚDO PRINCIPAL */}
                              <div className="p-4">
                                {/* Sessão Atual Ativa */}
                                {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-green-800">Sessão Atual - Em Andamento</span>
                                      </div>
                                      <div className="font-mono text-lg font-bold text-green-700">
                                        {formatarTempo(tempoSessaoAtual)}
                                      </div>
                                    </div>
                                    {anotacaoSessao && (
                                      <div className="bg-white/70 rounded p-2 text-sm text-green-700">
                                        💭 {anotacaoSessao}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Histórico de Anotações */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-900 flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                    Histórico de Anotações
                                    <Badge className="ml-2 bg-blue-100 text-blue-700">
                                      {anotacoesSalvas.filter(a => a.tarefaId === tarefa.id).length}
                                    </Badge>
                                  </h4>
                                  
                                  {anotacoesSalvas.filter(a => a.tarefaId === tarefa.id).length > 0 ? (
                                    <div className="space-y-2">
                                      {anotacoesSalvas
                                        .filter(a => a.tarefaId === tarefa.id)
                                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                        .map((anotacao, index) => (
                                        <div key={anotacao.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                              <span className="font-medium text-gray-900">Sessão {anotacao.sessao}</span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(anotacao.timestamp).toLocaleDateString('pt-BR')} • {new Date(anotacao.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </div>
                                            <div className="font-mono font-semibold text-blue-600">
                                              {formatarTempo(anotacao.tempo)}
                                            </div>
                                          </div>
                                          <div className="bg-white rounded p-2 text-sm text-gray-700">
                                            💭 {anotacao.texto}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 text-gray-500">
                                      <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                      <p className="text-sm">
                                        {tarefa.id === tarefaAtiva 
                                          ? 'Nenhuma anotação salva ainda. Digite uma anotação na sessão atual e clique em "Salvar Nota".'
                                          : 'Nenhuma anotação registrada para esta tarefa'
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Revisões Pendentes */}
                                {tarefa.requer_aprovacao && (
                                  <div className="mt-6 pt-4 border-t">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                                      Revisões Pendentes
                                    </h4>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-yellow-800">⚠️ Aguardando aprovação do cliente</span>
                                        <Badge className="bg-yellow-500">Pendente</Badge>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* VISUALIZAÇÃO KANBAN */}
              {visualizacao === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {['nao_iniciada', 'em_progresso', 'em_revisao', 'concluida'].map(status => {
                    const tarefasStatus = projeto.etapas
                      .flatMap(e => e.tarefas)
                      .filter(t => t.status === status);
                    
                    const statusConfig = {
                      nao_iniciada: { title: '📋 Não Iniciadas', color: 'bg-gray-100 border-gray-300' },
                      em_progresso: { title: '🔄 Em Progresso', color: 'bg-blue-100 border-blue-300' },
                      em_revisao: { title: '👁️ Em Revisão', color: 'bg-yellow-100 border-yellow-300' },
                      concluida: { title: '✅ Concluídas', color: 'bg-green-100 border-green-300' }
                    };

                    return (
                      <div key={status} className={`rounded-lg border-2 ${statusConfig[status as keyof typeof statusConfig].color} p-4`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">
                            {statusConfig[status as keyof typeof statusConfig].title}
                          </h3>
                          <Badge variant="outline">{tarefasStatus.length}</Badge>
                        </div>
                        
                        <div className="space-y-3 min-h-[400px]">
                          {tarefasStatus.map(tarefa => (
                            <motion.div
                              key={tarefa.id}
                              layout
                              className={`p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                                tarefa.id === tarefaAtiva ? 'ring-2 ring-green-500' : ''
                              }`}
                              onClick={() => setTarefaAtiva(tarefa.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">{tarefa.nome}</span>
                                <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                              </div>
                              
                              <div className="text-xs text-gray-600 mb-2">
                                👤 {tarefa.responsavel}
                              </div>
                              
                              <div className="text-xs text-gray-500 mb-2">
                                {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                              </div>

                              {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                <div className="text-xs font-mono font-bold text-green-600 mb-2">
                                  ⏱️ {formatarTempo(tempoSessaoAtual)}
                                </div>
                              )}
                              
                              {tarefa.id === tarefaAtiva && (
                                <div className="mt-2 pt-2 border-t">
                                  <div className="flex space-x-1">
                                    {!cronometroAtivo ? (
                                      <Button 
                                        size="sm" 
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          iniciarTarefa(tarefa.id);
                                        }}
                                      >
                                        <Play className="h-3 w-3" />
                                      </Button>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-orange-300 text-orange-700 text-xs px-2 py-1 h-6"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          pausarTarefa();
                                        }}
                                      >
                                        <Pause className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="border-blue-300 text-blue-700 text-xs px-2 py-1 h-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        concluirTarefa(tarefa.id);
                                      }}
                                    >
                                      <CheckCircle2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VISUALIZAÇÃO TIMELINE */}
              {visualizacao === 'timeline' && (
                <div className="space-y-6">
                  <div className="relative">
                    {/* Linha do tempo */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    
                    {projeto.etapas.map((etapa, etapaIndex) => (
                      <div key={etapa.id} className="relative mb-8">
                        {/* Marco da etapa */}
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md z-10 relative"></div>
                          <div className="ml-4 flex-1 bg-white p-4 rounded-lg border shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-gray-900">
                                  ETAPA {etapa.numero}: {etapa.nome}
                                </h3>
                                <Badge className={getStatusColor(etapa.status)}>
                                  {etapa.status}
                                </Badge>
                                <div className="text-sm text-gray-600">
                                  {etapa.progresso}% concluído
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tarefas da etapa */}
                        <div className="ml-8 space-y-3">
                          {etapa.tarefas.map((tarefa, tarefaIndex) => (
                            <motion.div
                              key={tarefa.id}
                              className={`p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                                tarefa.id === tarefaAtiva ? 'ring-2 ring-green-500' : ''
                              }`}
                              onClick={() => setTarefaAtiva(tarefa.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                                  <span className="font-medium text-gray-900">{tarefa.nome}</span>
                                  <div className="text-sm text-gray-600">👤 {tarefa.responsavel}</div>
                                  <Badge className={getStatusColor(tarefa.status)}>
                                    {tarefa.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">
                                    {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                  </div>

                                  {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                    <div className="text-sm font-mono font-bold text-green-600">
                                      ⏱️ {formatarTempo(tempoSessaoAtual)}
                                    </div>
                                  )}
                                  
                                  {tarefa.id === tarefaAtiva && (
                                    <div className="flex space-x-2">
                                      {!cronometroAtivo ? (
                                        <Button 
                                          size="sm" 
                                          className="bg-green-600 hover:bg-green-700 text-white"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            iniciarTarefa(tarefa.id);
                                          }}
                                        >
                                          <Play className="h-4 w-4 mr-1" />
                                          Iniciar
                                        </Button>
                                      ) : (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="border-orange-300 text-orange-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            pausarTarefa();
                                          }}
                                        >
                                          <Pause className="h-4 w-4 mr-1" />
                                          Pausar
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-blue-300 text-blue-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          concluirTarefa(tarefa.id);
                                        }}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Concluir
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Etapa
              </Button>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={gerarRelatorios}
                  disabled={salvandoCrud}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button 
                  variant="outline"
                  onClick={abrirConfiguracoes}
                  disabled={salvandoCrud}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
                <Button 
                  variant="outline"
                  onClick={salvarTudo}
                  disabled={salvandoCrud}
                >
                  {salvandoCrud ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Tudo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      )}

      {/* CRONÔMETRO FLUTUANTE */}
      <AnimatePresence>
        {cronometroAtivo && tarefaAtivaData && (
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
                  {formatarTempo(tempoSessaoAtual)}
                </div>
                <div className="text-gray-600 truncate max-w-32">
                  {tarefaAtivaData.nome}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={pausarTarefa}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => tarefaAtiva && concluirTarefa(tarefaAtiva)}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* SEÇÃO 3.5: COMUNICAÇÃO DA EQUIPE - DESIGN INTELIGENTE E LEGÍVEL */}
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Workflow className="h-5 w-5 mr-2 text-purple-600" />
                  Estrutura do Projeto - Etapas e Tarefas
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">
                    {projeto.etapas.length} etapas
                  </Badge>
                  {/* Botão "Nova Etapa" removido daqui */}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* VISUALIZAÇÃO LISTA */}
                {visualizacao === 'lista' && projeto.etapas.map((etapa) => (
                  <Card 
                    key={etapa.id} 
                    className="border-l-4 border-l-purple-500"
                    draggable
                    onDragStart={() => handleDragStart('etapa', etapa.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, etapa.id, 'etapa')}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEtapa(etapa.id)}
                            className="p-1"
                          >
                            {etapasExpandidas.includes(etapa.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <h4 className="font-semibold text-gray-900">
                            ETAPA {etapa.numero}: {etapa.nome}
                          </h4>
                          <Badge className={getStatusColor(etapa.status)}>
                            {etapa.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            ({etapa.tarefas.length} tarefas)
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Progress value={etapa.progresso} className="w-24" />
                            <span className="text-sm font-medium text-gray-600">
                              {etapa.progresso}%
                            </span>
                          </div>
                          {/* Menu CRUD da Etapa - ESTILO CORRIGIDO */}
                          <div className="relative group">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                              <div className="py-1">
                                <button
                                  onClick={() => abrirModalEdicao('etapa', null, 'criar')}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Nova Etapa
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => abrirModalEdicao('etapa', etapa.id, 'editar')}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar Etapa
                                </button>
                                <button
                                  onClick={() => abrirModalEdicao('etapa', etapa.id, 'duplicar')}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicar Etapa
                                </button>
                                <button
                                  onClick={() => abrirModalEdicao('tarefa', null, 'criar')}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Nova Tarefa
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => abrirConfirmacaoExclusao('etapa', etapa.id, etapa.nome)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Excluir Etapa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {etapasExpandidas.includes(etapa.id) && (
                      <CardContent className="pt-0">
                      <div className="space-y-3">
                        {etapa.tarefas.map((tarefa) => (
                          <div key={tarefa.id}>
                            {/* CARD PRINCIPAL DA TAREFA - FORMATO FINO */}
                            <div
                              className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                                tarefa.id === tarefaAtiva 
                                  ? 'border-green-300 bg-green-50' 
                                  : 'border-gray-200 bg-white'
                              }`}
                              draggable
                              onDragStart={() => handleDragStart('tarefa', tarefa.id)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, tarefa.id, 'tarefa')}
                            >
                              <div className="flex items-center justify-between">
                                {/* INFORMAÇÕES PRINCIPAIS */}
                                <div className="flex items-center space-x-3 flex-1">
                                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">{tarefa.nome}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {tarefa.responsavel} • {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(tarefa.status)} text-xs`}>
                                    {tarefa.status.replace('_', ' ')}
                                  </Badge>
                                </div>

                                {/* BOTÕES DE AÇÃO CONTEXTUAIS */}
                                <div className="flex items-center space-x-1">
                                  {/* BOTÃO PRINCIPAL - BASEADO NO ESTADO */}
                                  {tarefa.id === tarefaAtiva && cronometroAtivo ? (
                                    // Tarefa ativa com cronômetro rodando - PAUSAR
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-orange-300 text-orange-700 hover:bg-orange-50 h-7 px-3"
                                      onClick={pausarTarefa}
                                    >
                                      <Pause className="h-3 w-3 mr-1" />
                                      Pausar
                                    </Button>
                                  ) : tarefa.id === tarefaAtiva && !cronometroAtivo ? (
                                    // Tarefa ativa mas cronômetro parado - CONTINUAR
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white h-7 px-3"
                                      onClick={() => iniciarTarefa(tarefa.id)}
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Continuar
                                    </Button>
                                  ) : tarefa.status === 'em_progresso' ? (
                                    // Tarefa em progresso mas não ativa - INICIAR
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3"
                                      onClick={() => iniciarTarefa(tarefa.id)}
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Iniciar
                                    </Button>
                                  ) : tarefa.status === 'nao_iniciada' ? (
                                    // Tarefa não iniciada - COMEÇAR
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-300 text-green-700 hover:bg-green-50 h-7 px-3"
                                      onClick={() => iniciarTarefa(tarefa.id)}
                                    >
                                      <Play className="h-3 w-3 mr-1" />
                                      Começar
                                    </Button>
                                  ) : tarefa.status === 'concluida' ? (
                                    // Tarefa concluída - SEM BOTÃO (já tem badge)
                                    null
                                  ) : (
                                    // Outros status - ÍCONE CONTEXTUAL
                                    <div className="flex items-center px-3 py-1 bg-gray-100 rounded text-gray-700 h-7">
                                      <span className="text-sm">{getStatusIcon(tarefa.status)}</span>
                                      <span className="text-xs font-medium ml-1">
                                        {tarefa.status === 'em_revisao' ? 'Em Revisão' : 
                                         tarefa.status === 'aguardando_aprovacao' ? 'Aguardando' : 
                                         tarefa.status.replace('_', ' ')}
                                      </span>
                                    </div>
                                  )}

                                  {/* BOTÕES SECUNDÁRIOS */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 h-7 px-2"
                                    onClick={() => toggleDetalheTarefa(tarefa.id)}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>

                                  {tarefa.requer_aprovacao && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-purple-300 text-purple-700 h-7 px-2"
                                    >
                                      <Upload className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* CRONÔMETRO ATIVO (só aparece quando a tarefa está ativa) */}
                              {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                <div className="mt-2 p-2 bg-green-100 rounded-md">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-green-800">
                                      ⏱️ Sessão Atual: <span className="font-mono font-bold">{formatarTempo(tempoSessaoAtual)}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-orange-300 text-orange-700 h-6 px-2 text-xs"
                                        onClick={pausarTarefa}
                                      >
                                        Pausar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* DETALHES EXPANDÍVEIS */}
                            {tarefasDetalhesExpandidos.includes(tarefa.id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 bg-white rounded-lg border shadow-sm overflow-hidden"
                              >
                                {/* HEADER COM INFORMAÇÕES PRINCIPAIS */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <div>
                                        <div className="text-xs text-gray-600">Tempo Total</div>
                                        <div className="font-semibold text-gray-900">
                                          {tarefa.id === tarefaAtiva ? formatarTempo(calcularTempoTarefaAtualRealTime()) : formatarTempo(tarefa.tempo_total)}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Target className="h-4 w-4 text-green-600" />
                                      <div>
                                        <div className="text-xs text-gray-600">Estimado</div>
                                        <div className="font-semibold text-gray-900">{formatarTempo(tarefa.tempo_estimado)}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Users className="h-4 w-4 text-purple-600" />
                                      <div>
                                        <div className="text-xs text-gray-600">Responsável</div>
                                        <div className="font-semibold text-gray-900">{tarefa.responsavel}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4 text-orange-600" />
                                      <div>
                                        <div className="text-xs text-gray-600">Iniciado</div>
                                        <div className="font-semibold text-gray-900">
                                          {tarefa.data_inicio ? new Date(tarefa.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* CONTEÚDO PRINCIPAL */}
                                <div className="p-4">
                                  {/* Sessão Atual Ativa */}
                                  {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                          <span className="font-semibold text-green-800">Sessão Atual - Em Andamento</span>
                                        </div>
                                        <div className="font-mono text-lg font-bold text-green-700">
                                          {formatarTempo(tempoSessaoAtual)}
                                        </div>
                                      </div>
                                      {anotacaoSessao && (
                                        <div className="bg-white/70 rounded p-2 text-sm text-green-700">
                                          💭 {anotacaoSessao}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Histórico de Anotações */}
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                      Histórico de Anotações
                                      <Badge className="ml-2 bg-blue-100 text-blue-700">
                                        {anotacoesSalvas.filter(a => a.tarefaId === tarefa.id).length}
                                      </Badge>
                                    </h4>
                                    
                                    {anotacoesSalvas.filter(a => a.tarefaId === tarefa.id).length > 0 ? (
                                      <div className="space-y-2">
                                        {anotacoesSalvas
                                          .filter(a => a.tarefaId === tarefa.id)
                                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                          .map((anotacao, index) => (
                                          <div key={anotacao.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="font-medium text-gray-900">Sessão {anotacao.sessao}</span>
                                                <span className="text-xs text-gray-500">
                                                  {new Date(anotacao.timestamp).toLocaleDateString('pt-BR')} • {new Date(anotacao.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                              </div>
                                              <div className="font-mono font-semibold text-blue-600">
                                                {formatarTempo(anotacao.tempo)}
                                              </div>
                                            </div>
                                            <div className="bg-white rounded p-2 text-sm text-gray-700">
                                              💭 {anotacao.texto}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 text-gray-500">
                                        <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm">
                                          {tarefa.id === tarefaAtiva 
                                            ? 'Nenhuma anotação salva ainda. Digite uma anotação na sessão atual e clique em "Salvar Nota".'
                                            : 'Nenhuma anotação registrada para esta tarefa'
                                          }
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Revisões Pendentes */}
                                  {tarefa.requer_aprovacao && (
                                    <div className="mt-6 pt-4 border-t">
                                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                                        Revisões Pendentes
                                      </h4>
                                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-yellow-800">⚠️ Aguardando aprovação do cliente</span>
                                          <Badge className="bg-yellow-500">Pendente</Badge>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                      </CardContent>
                    )}
                  </Card>
                ))}

                {/* VISUALIZAÇÃO KANBAN */}
                {visualizacao === 'kanban' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {['nao_iniciada', 'em_progresso', 'em_revisao', 'concluida'].map(status => {
                      const tarefasStatus = projeto.etapas
                        .flatMap(e => e.tarefas)
                        .filter(t => t.status === status);
                      
                      const statusConfig = {
                        nao_iniciada: { title: '📋 Não Iniciadas', color: 'bg-gray-100 border-gray-300' },
                        em_progresso: { title: '🔄 Em Progresso', color: 'bg-blue-100 border-blue-300' },
                        em_revisao: { title: '👁️ Em Revisão', color: 'bg-yellow-100 border-yellow-300' },
                        concluida: { title: '✅ Concluídas', color: 'bg-green-100 border-green-300' }
                      };

                      return (
                        <div key={status} className={`rounded-lg border-2 ${statusConfig[status as keyof typeof statusConfig].color} p-4`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">
                              {statusConfig[status as keyof typeof statusConfig].title}
                            </h3>
                            <Badge variant="outline">{tarefasStatus.length}</Badge>
                          </div>
                          
                          <div className="space-y-3 min-h-[400px]">
                            {tarefasStatus.map(tarefa => (
                              <motion.div
                                key={tarefa.id}
                                layout
                                className={`p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                                  tarefa.id === tarefaAtiva ? 'ring-2 ring-green-500' : ''
                                }`}
                                onClick={() => setTarefaAtiva(tarefa.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-sm text-gray-900">{tarefa.nome}</span>
                                  <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                                </div>
                                
                                <div className="text-xs text-gray-600 mb-2">
                                  👤 {tarefa.responsavel}
                                </div>
                                
                                <div className="text-xs text-gray-500 mb-2">
                                  {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                </div>

                                {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                  <div className="text-xs font-mono font-bold text-green-600 mb-2">
                                    ⏱️ {formatarTempo(tempoSessaoAtual)}
                                  </div>
                                )}
                                
                                {tarefa.id === tarefaAtiva && (
                                  <div className="mt-2 pt-2 border-t">
                                    <div className="flex space-x-1">
                                      {!cronometroAtivo ? (
                                        <Button 
                                          size="sm" 
                                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            iniciarTarefa(tarefa.id);
                                          }}
                                        >
                                          <Play className="h-3 w-3" />
                                        </Button>
                                      ) : (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="border-orange-300 text-orange-700 text-xs px-2 py-1 h-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            pausarTarefa();
                                          }}
                                        >
                                          <Pause className="h-3 w-3" />
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="border-blue-300 text-blue-700 text-xs px-2 py-1 h-6"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          concluirTarefa(tarefa.id);
                                        }}
                                      >
                                        <CheckCircle2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* VISUALIZAÇÃO TIMELINE */}
                {visualizacao === 'timeline' && (
                  <div className="space-y-6">
                    <div className="relative">
                      {/* Linha do tempo */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      {projeto.etapas.map((etapa, etapaIndex) => (
                        <div key={etapa.id} className="relative mb-8">
                          {/* Marco da etapa */}
                          <div className="flex items-center mb-4">
                            <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md z-10 relative"></div>
                            <div className="ml-4 flex-1 bg-white p-4 rounded-lg border shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-semibold text-gray-900">
                                    ETAPA {etapa.numero}: {etapa.nome}
                                  </h3>
                                  <Badge className={getStatusColor(etapa.status)}>
                                    {etapa.status}
                                  </Badge>
                                  <div className="text-sm text-gray-600">
                                    {etapa.progresso}% concluído
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Tarefas da etapa */}
                          <div className="ml-8 space-y-3">
                            {etapa.tarefas.map((tarefa, tarefaIndex) => (
                              <div key={tarefa.id}>
                                {/* Área de drop antes da tarefa para reordenação */}
                                <div
                                  className="h-2 w-full rounded transition-colors hover:bg-blue-100 border-2 border-dashed border-transparent hover:border-blue-300 mb-1"
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedItem && draggedItem.type === 'tarefa' && draggedItem.id !== tarefa.id) {
                                      const etapaOrigemId = projeto.etapas.find(e => e.tarefas.some(t => t.id === draggedItem.id))?.id;
                                      if (etapaOrigemId === etapa.id) {
                                        // Reordenar dentro da mesma etapa - inserir antes da tarefa atual
                                        reordenarTarefaDentroEtapa(draggedItem.id, tarefa.id, etapa.id);
                                      } else if (etapaOrigemId) {
                                        // Mover entre etapas - inserir antes da tarefa atual
                                        moverTarefa(draggedItem.id, etapaOrigemId, etapa.id, tarefaIndex);
                                      }
                                    }
                                    setDraggedItem(null);
                                  }}
                                />
                                
                                <motion.div
                                  className={`p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                                    tarefa.id === tarefaAtiva ? 'ring-2 ring-green-500' : ''
                                  } ${draggedItem?.id === tarefa.id ? 'opacity-50' : ''}`}
                                  onClick={() => setTarefaAtiva(tarefa.id)}
                                  draggable
                                  onDragStart={() => handleDragStart('tarefa', tarefa.id)}
                                >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-lg">{getStatusIcon(tarefa.status)}</span>
                                    <span className="font-medium text-gray-900">{tarefa.nome}</span>
                                    <div className="text-sm text-gray-600">👤 {tarefa.responsavel}</div>
                                    <Badge className={getStatusColor(tarefa.status)}>
                                      {tarefa.status.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <div className="text-sm text-gray-500">
                                      {formatarTempoSimples(tarefa.tempo_total)} / {formatarTempoSimples(tarefa.tempo_estimado)}
                                    </div>

                                    {tarefa.id === tarefaAtiva && cronometroAtivo && (
                                      <div className="text-sm font-mono font-bold text-green-600">
                                        ⏱️ {formatarTempo(tempoSessaoAtual)}
                                      </div>
                                    )}
                                    
                                    {tarefa.id === tarefaAtiva && (
                                      <div className="flex space-x-2">
                                        {!cronometroAtivo ? (
                                          <Button 
                                            size="sm" 
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              iniciarTarefa(tarefa.id);
                                            }}
                                          >
                                            <Play className="h-4 w-4 mr-1" />
                                            Iniciar
                                          </Button>
                                        ) : (
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-orange-300 text-orange-700"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              pausarTarefa();
                                            }}
                                          >
                                            <Pause className="h-4 w-4 mr-1" />
                                            Pausar
                                          </Button>
                                        )}
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          className="border-blue-300 text-blue-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            concluirTarefa(tarefa.id);
                                          }}
                                        >
                                          <CheckCircle2 className="h-4 w-4 mr-1" />
                                          Concluir
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                              
                              {/* Área de drop no final da lista de tarefas */}
                              {tarefaIndex === etapa.tarefas.length - 1 && (
                                <div
                                  className="h-2 w-full rounded transition-colors hover:bg-blue-100 border-2 border-dashed border-transparent hover:border-blue-300 mt-1"
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedItem && draggedItem.type === 'tarefa') {
                                      const etapaOrigemId = projeto.etapas.find(e => e.tarefas.some(t => t.id === draggedItem.id))?.id;
                                      if (etapaOrigemId === etapa.id) {
                                        // Reordenar para o final da etapa
                                        const targetIndex = etapa.tarefas.length - 1;
                                        const sourceIndex = etapa.tarefas.findIndex(t => t.id === draggedItem.id);
                                        if (sourceIndex < targetIndex) {
                                          reordenarTarefaDentroEtapa(draggedItem.id, tarefa.id, etapa.id);
                                        }
                                      } else if (etapaOrigemId) {
                                        // Mover para o final da etapa
                                        moverTarefa(draggedItem.id, etapaOrigemId, etapa.id, etapa.tarefas.length);
                                      }
                                    }
                                    setDraggedItem(null);
                                  }}
                                />
                              )}
                            </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => abrirModalEdicao('etapa', null, 'criar')}
                  disabled={salvandoCrud}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Etapa
                </button>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={gerarRelatorios}
                    disabled={salvandoCrud}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatórios
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={abrirConfiguracoes}
                    disabled={salvandoCrud}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={salvarTudo}
                    disabled={salvandoCrud}
                  >
                    {salvandoCrud ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Tudo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEÇÃO 4: ARQUIVOS DO PROJETO - ORGANIZADOS POR ETAPAS */}
          <Card className="w-full mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Arquivos do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projeto.etapas.map((etapa) => (
                  <div key={etapa.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">{etapa.numero}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800">{etapa.nome}</h3>
                      <Badge variant="outline" className="text-xs">
                        {etapa.progresso}% concluído
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-10">
                      {/* Arquivos simulados por etapa */}
                      {etapa.numero === 1 && (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                            <FileText className="h-6 w-6 text-red-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">levantamento-topografico.dwg</p>
                              <p className="text-sm text-slate-500">Carlos • 5d atrás</p>
                            </div>
                            <Button variant="ghost" className="px-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">briefing-inicial.pdf</p>
                              <p className="text-sm text-slate-500">Ana • 3d atrás</p>
                            </div>
                            <Button variant="ghost" className="px-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                      
                      {etapa.numero === 2 && (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                            <FileText className="h-6 w-6 text-red-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">plantas-v3.dwg</p>
                              <p className="text-sm text-slate-500">Ana • 2h atrás</p>
                            </div>
                            <Button variant="ghost" className="px-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
                            <FileText className="h-6 w-6 text-green-600" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate">cortes-fachadas.dwg</p>
                              <p className="text-sm text-slate-500">Carlos • 4h atrás</p>
                            </div>
                            <Button variant="ghost" className="px-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                      
                      {/* Área de upload por etapa */}
                      <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 cursor-pointer transition-colors">
                        <div className="text-center">
                          <Upload className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-600 font-medium">Adicionar arquivo</p>
                          <p className="text-xs text-slate-500">para {etapa.nome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Espaçamento para rodapé */}
        <div className="h-20"></div>
      </div>

      {/* ===== MODAIS CRUD ===== */}
      <ModalEdicao
        aberto={modoEdicao.tipo !== null}
        tipo={modoEdicao.tipo}
        acao={modoEdicao.acao}
        dados={formData}
        salvando={salvandoCrud}
        etapas={projeto.etapas}
        onSalvar={(dados) => {
          try {
            if (modoEdicao.tipo === 'projeto') {
              editarProjeto(dados);
            } else if (modoEdicao.tipo === 'etapa') {
              if (modoEdicao.acao === 'criar') {
                criarEtapa(dados);
              } else if (modoEdicao.acao === 'editar' && modoEdicao.id) {
                editarEtapa(modoEdicao.id, dados);
              } else if (modoEdicao.acao === 'duplicar' && modoEdicao.id) {
                duplicarEtapa(modoEdicao.id);
              }
            } else if (modoEdicao.tipo === 'tarefa') {
              if (modoEdicao.acao === 'criar' && dados.etapaId) {
                criarTarefa(dados.etapaId, dados);
              } else if (modoEdicao.acao === 'editar' && modoEdicao.id) {
                editarTarefa(modoEdicao.id, dados);
              } else if (modoEdicao.acao === 'duplicar' && modoEdicao.id) {
                duplicarTarefa(modoEdicao.id);
              }
            }
            fecharModalEdicao();
          } catch (error) {
            console.error('Erro na operação CRUD:', error);
          }
        }}
        onFechar={fecharModalEdicao}
      />

      <ModalConfirmacao
        aberto={confirmacaoExclusao.aberto}
        tipo={confirmacaoExclusao.tipo}
        nome={confirmacaoExclusao.nome}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharConfirmacaoExclusao}
      />

      {/* Modal de Validação Inteligente */}
      {validacaoAtiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header com resumo do impacto */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Análise de Impacto</h2>
                <button 
                  onClick={() => {
                    setValidacaoAtiva(null);
                    setOperacaoPendente(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {validacaoAtiva.impacto_calculado.horas_adicionais !== 0 && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <div>
                        <div className="text-sm opacity-90">Impacto em Tempo</div>
                        <div className="font-bold">
                          {validacaoAtiva.impacto_calculado.horas_adicionais > 0 ? '+' : ''}
                          {Math.round(validacaoAtiva.impacto_calculado.horas_adicionais / 3600)}h
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {validacaoAtiva.impacto_calculado.dias_atraso > 0 && (
                  <div className="bg-orange-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <div>
                        <div className="text-sm opacity-90">Atraso</div>
                        <div className="font-bold">{validacaoAtiva.impacto_calculado.dias_atraso} dias</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {validacaoAtiva.impacto_calculado.custo_adicional > 0 && (
                  <div className="bg-green-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <div>
                        <div className="text-sm opacity-90">Custo Adicional</div>
                        <div className="font-bold">R$ {validacaoAtiva.impacto_calculado.custo_adicional.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de validações */}
            <div className="p-6 space-y-4">
              {validacaoAtiva.validacoes.map(validacao => (
                <div 
                  key={validacao.id}
                  className={`border rounded-lg p-4 ${
                    validacao.tipo === 'error' ? 'border-red-300 bg-red-50' :
                    validacao.tipo === 'warning' ? 'border-orange-300 bg-orange-50' :
                    'border-blue-300 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${
                      validacao.tipo === 'error' ? 'text-red-600' :
                      validacao.tipo === 'warning' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      {validacao.tipo === 'error' ? <AlertTriangle className="w-5 h-5" /> :
                       validacao.tipo === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                       <Info className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          validacao.categoria === 'dependencia' ? 'bg-purple-100 text-purple-700' :
                          validacao.categoria === 'prazo' ? 'bg-orange-100 text-orange-700' :
                          validacao.categoria === 'custo' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {validacao.categoria.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-800 font-medium mb-2">{validacao.mensagem}</p>
                      
                      {validacao.sugestoes.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Sugestões:</h4>
                          <ul className="space-y-1">
                            {validacao.sugestoes.map((sugestao, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>{sugestao}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ações */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setValidacaoAtiva(null);
                  setOperacaoPendente(null);
                }}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-3">
                {validacaoAtiva.pode_prosseguir && (
                  <button
                    onClick={() => {
                      if (operacaoPendente) {
                        // Executar operação pendente
                        if (operacaoPendente.tipo === 'criar' && operacaoPendente.entidade === 'tarefa') {
                          executarCriacaoTarefa(
                            operacaoPendente.contexto?.etapa_destino || '',
                            operacaoPendente.dados,
                            validacaoAtiva
                          );
                        }
                      }
                      setValidacaoAtiva(null);
                      setOperacaoPendente(null);
                    }}
                    className={`px-6 py-2 text-white rounded-lg font-medium ${
                      validacaoAtiva.requer_confirmacao
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {validacaoAtiva.requer_confirmacao ? 'Confirmar Mesmo Assim' : 'Continuar'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 