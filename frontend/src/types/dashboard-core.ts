// ===== INTERFACES PRINCIPAIS DO DASHBOARD =====
// Extraídas da V7-Otimizado para modularização

export interface Tarefa {
  id: string;
  nome: string;
  status: 'nao_iniciada' | 'em_progresso' | 'em_revisao' | 'concluida' | 'atrasada' | 'aguardando_aprovacao' | 'aprovada';
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
  notas_sessoes: NotaSessao[];
  arquivos: ArquivoTarefa[];
  revisoes: RevisaoTarefa[];
  // NOVOS CAMPOS INTELIGENTES
  horas_estimadas?: number; // Estimativa em horas fornecida pelo usuário
  dependencia_tarefa_id?: string; // ID da tarefa da qual esta depende
  tem_dependencia?: boolean; // Se tem dependência de outra tarefa
}

export interface Etapa {
  id: string;
  numero: number;
  nome: string;
  progresso: number;
  status: string;
  tarefas: Tarefa[];
}

export interface Projeto {
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
  comunicacao: MensagemComunicacao[];
  equipe: MembroEquipe[];
  atividades: AtividadeProjeto[];
  arquivos: ArquivoProjeto[];
}

export interface NotaSessao {
  id: string;
  conteudo: string;
  timestamp: string;
  duracao_sessao: number;
}

export interface ArquivoTarefa {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  upload_por: string;
  upload_em: string;
}

export interface RevisaoTarefa {
  id: string;
  tipo: 'aprovacao' | 'rejeicao' | 'correcao';
  comentario: string;
  revisor: string;
  data_revisao: string;
}

export interface MensagemComunicacao {
  id: string;
  usuario: string;
  avatar: string;
  mensagem: string;
  data: string;
  mencoes: string[];
}

export interface MembroEquipe {
  nome: string;
  avatar: string;
  status: 'Online' | 'Ausente' | 'Ocupada';
}

export interface AtividadeProjeto {
  id: string;
  usuario: string;
  acao: string;
  tipo: string;
  tempo: string;
}

export interface ArquivoProjeto {
  nome: string;
  usuario: string;
  tempo: string;
}

export interface DashboardProps {
  params: Promise<{ id: string }>;
}

// ===== ESTADOS DO DASHBOARD =====
export interface EstadoDashboard {
  projeto: Projeto;
  tarefaAtiva: string | null;
  cronometroAtivo: boolean;
  tempoSessaoAtual: number;
  numeroSessoes: number;
  anotacaoSessao: string;
  anotacaoSalva: boolean;
  modoFoco: boolean;
  tarefaModoFoco: string | null;
  visualizacao: 'lista' | 'kanban' | 'timeline';
  etapasExpandidas: Set<string>;
  tarefasDetalhadas: Set<string>;
  salvandoCrud: boolean;
}

// ===== MÉTRICAS DE PRODUTIVIDADE =====
export interface MetricasProdutividade {
  precisaoEstimativas: number; // % de precisão das estimativas do usuário
  tarefasConcluidas: number;
  horasTrabalhadasReal: number;
  horasEstimadasTotal: number;
  padroesDependencia: Map<string, string[]>; // Mapa de dependências mais comuns
  temposMediosPorTipo: Map<string, number>; // Tempos médios por tipo de tarefa
}

// ===== PRÓXIMAS TAREFAS INTELIGENTES =====
export interface ProximaTarefaInteligente extends Tarefa {
  urgencia: number;
  pontuacaoPrioridade: number;
  diasParaVencimento: number;
  labelPrazo: string;
  corBadge: string;
}

// ===== TOOLTIPS E UI =====
export interface EstadoTooltips {
  tooltipVisible: boolean;
  tooltipAguardandoVisible: boolean;
  tooltipRevisaoVisible: boolean;
  tooltipModoFocoVisible: boolean;
}

// ===== SISTEMA DE VALIDAÇÃO INTELIGENTE =====
export interface ValidacaoImpacto {
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

export interface OperacaoCrud {
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

export interface ResultadoValidacao {
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