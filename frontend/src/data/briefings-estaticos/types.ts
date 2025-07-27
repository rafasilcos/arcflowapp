// 🎯 TIPOS E INTERFACES COMUNS - BRIEFINGS ESTÁTICOS ARCFLOW
// Estrutura padronizada para todos os briefings organizados

export interface PerguntaBriefing {
  id: string;
  texto: string;
  tipo: 'texto' | 'texto_longo' | 'numero' | 'moeda' | 'data' | 'select' | 'multiple' | 'boolean' | 'cpf' | 'cnpj' | 'telefone' | 'email' | 'endereco' | 'radio_condicional' | 'componente_customizado';
  opcoes?: string[];
  obrigatoria: boolean;
  validacao?: string | Record<string, any>;
  ajuda?: string;
  dependeDe?: string | {
    perguntaId: string;
    valoresQueExibem: string[];
  };
  placeholder?: string;
  secao?: string;
  maxLength?: number;
  unidade?: string;
  // Propriedades adicionais para tipos avançados
  mascara?: string;
  rows?: number;
  campoCondicional?: any;
  camposCondicionais?: any;
  estrutura?: any;
  min?: number;
  max?: number;
  pattern?: string;
  tooltip?: string;
  integracaoAPI?: string;
}

export interface SecaoBriefing {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  ordem: number;
}

export interface BriefingEstatico {
  id: string;
  nome: string;
  area: string;
  tipologia: string;
  padrao: string;
  totalPerguntas: number;
  tempoEstimado: number;
  categoria: string;
  versao: string;
  perguntas: PerguntaBriefing[];
  secoes: SecaoBriefing[];
  metadados: {
    criadoEm: string;
    atualizadoEm: string;
    baseadoEm: string;
    tags: string[];
    status: 'ativo' | 'desenvolvimento' | 'descontinuado';
    melhorias?: string[];
  };
}

export interface EstatisticasBriefing {
  totalPerguntas: number;
  perguntasObrigatorias: number;
  perguntasOpcionais: number;
  tempoEstimadoMin: number;
  tempoEstimadoMax: number;
  secoes: string[];
  complexidade: 'baixa' | 'media' | 'alta';
} 