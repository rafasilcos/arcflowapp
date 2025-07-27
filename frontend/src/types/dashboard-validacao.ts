// ===== SISTEMA DE VALIDAÇÃO INTELIGENTE =====
// Extraído da V7-Otimizado para análise de impacto e dependências

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

// ===== HISTÓRICO DE AÇÕES CRUD =====
export interface AcaoCrud {
  id: string;
  acao: string;
  tipo: 'projeto' | 'etapa' | 'tarefa';
  itemId: string;
  dadosAnteriores: any;
  dadosNovos: any;
  timestamp: Date;
  usuario: string;
}

// ===== ESTADOS DOS MODAIS =====
export interface EstadoModalEdicao {
  aberto: boolean;
  tipo: 'projeto' | 'etapa' | 'tarefa' | null;
  id: string | null;
  acao: 'criar' | 'editar' | 'duplicar' | null;
}

export interface EstadoConfirmacaoExclusao {
  aberto: boolean;
  tipo: 'projeto' | 'etapa' | 'tarefa' | null;
  id: string | null;
  nome: string;
} 