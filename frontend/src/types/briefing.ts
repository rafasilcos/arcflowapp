// TIPOS UNIFICADOS DO SISTEMA DE BRIEFINGS ARCFLOW
// Versão 2.0 - Interfaces consolidadas

export interface Pergunta {
  id: string | number;
  tipo: 'text' | 'textarea' | 'texto_longo' | 'select' | 'radio' | 'checkbox' | 'multiple' | 'number' | 'numero' | 'date' | 'data' | 'valor' | 'moeda' | 'slider' | 'file';
  pergunta: string;
  opcoes?: string[];
  obrigatoria: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  descricao?: string;
  formatacao?: 'moeda' | 'percentual' | 'metros' | 'telefone' | 'email' | 'cpf' | 'cnpj';
  validacao?: {
    regex?: string;
    mensagem?: string;
  };
  dependeDe?: string | {
    perguntaId: string;
    valoresQueExibem: string[];
  };
  observacoes?: string;
  label?: string;
  multiple?: boolean;
  help?: string;
}

export interface Secao {
  id: string;
  nome: string;
  descricao: string;
  icon?: string;
  perguntas: Pergunta[];
  observacoes?: string;
  obrigatoria: boolean;
  condicional?: boolean;
  condicao?: CondicaoPergunta;
}

export interface BriefingCompleto {
  id: string;
  tipologia: string;
  subtipo: string;
  padrao: string;
  nome: string;
  descricao: string;
  totalPerguntas: number;
  tempoEstimado: string;
  versao: string;
  criadoEm: string;
  atualizadoEm: string;
  secoes: Secao[];
  metadata: {
    tags: string[];
    categoria: string;
    complexidade: 'baixa' | 'media' | 'alta' | 'muito_alta';
    publico: string[];
    adaptativo?: boolean;
  };
  secoesCondicionais?: SecaoCondicional[];
}

export interface BriefingResposta {
  id: string;
  briefingId: string;
  clienteId: string;
  projetoId?: string;
  respostas: Record<string, any>;
  status: 'em_andamento' | 'concluido' | 'em_edicao' | 'orcamento_elaboracao' | 'projeto_iniciado';
  progresso: number;
  criadoEm: string;
  atualizadoEm: string;
  tempoPreenchimento?: number;
  analiseIA?: {
    score: number;
    categoria: string;
    pontosFortres: string[];
    pontosAtencao: string[];
    recomendacoes: string[];
    geradoEm: string;
  };
}

export interface SeletorBriefing {
  tipologias: string[];
  subtipos: Record<string, string[]>;
  padroes: Record<string, string[]>;
  briefings: Record<string, BriefingCompleto>;
}

// Tipos para compatibilidade
export type QuestionarioTipologia = {
  secoes: Secao[];
};

// Constantes
export const TIPOS_PERGUNTA = [
  'text', 'textarea', 'texto_longo', 'select', 'radio', 'checkbox', 'multiple',
  'number', 'numero', 'date', 'data', 'valor', 'moeda', 'slider', 'file'
] as const;

export const STATUS_BRIEFING = [
  'em_andamento', 'concluido', 'em_edicao', 'orcamento_elaboracao', 'projeto_iniciado'
] as const;

export const FORMATACAO_CAMPOS = [
  'moeda', 'percentual', 'metros', 'telefone', 'email', 'cpf', 'cnpj'
] as const;

// Adicionar novos tipos de pergunta para briefings estruturais
export type TipoPergunta = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'number' 
  | 'checkbox'
  | 'upload'
  | 'date'
  | 'signature'
  | 'multi_upload'
  | 'numeric_range';

// Interface para lógica condicional
export interface CondicaoPergunta {
  perguntaId: number;
  valores: string[];
  operador: 'equals' | 'includes' | 'not_equals';
}

// Interface expandida para perguntas condicionais
export interface PerguntaCondicional extends Pergunta {
  condicao?: CondicaoPergunta;
  subSecoes?: SecaoCondicional[];
}

// Interface para seções condicionais
export interface SecaoCondicional {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  condicao: CondicaoPergunta;
  perguntas: PerguntaCondicional[];
} 