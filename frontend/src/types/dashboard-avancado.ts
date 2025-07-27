// ===== TIPOS AVANÇADOS PARA DASHBOARD V8 =====
// Migrados da V7-Otimizado para V8-Modular

// ===== INTERFACES PRINCIPAIS =====
export interface Tarefa {
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
  comunicacao: any[];
  equipe: any[];
  atividades: any[];
  arquivos: any[];
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

export interface DependenciaInteligente {
  tarefa_origem: string;
  tarefa_destino: string;
  tipo: 'obrigatoria' | 'recomendada' | 'logica';
  flexibilidade: 'rigida' | 'moderada' | 'flexivel';
  justificativa: string;
}

// ===== SISTEMA DE TEMPLATES INTELIGENTES =====
export interface TarefaTemplate {
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

export interface TemplateInteligente {
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

export interface AnaliseInteligente {
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

// ===== TIPOS DE UI =====
export type VisualizacaoTipo = 'lista' | 'kanban' | 'timeline';

export interface ModoEdicao {
  tipo: 'projeto' | 'etapa' | 'tarefa' | null;
  acao: 'criar' | 'editar' | 'duplicar';
  id: string | null;
}

export interface ConfirmacaoExclusao {
  aberto: boolean;
  tipo: 'projeto' | 'etapa' | 'tarefa';
  id: string;
  nome: string;
}

// ===== PRÓXIMAS TAREFAS =====
export interface ProximaTarefa extends Tarefa {
  labelPrazo: string;
  corBadge: string;
  diasRestantes: number;
  prioridadeCalculada: number;
} 