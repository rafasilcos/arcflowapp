/**
 * 📊 TIPOS TYPESCRIPT PARA DADOS DE ORÇAMENTO
 * 
 * Define todas as interfaces e tipos relacionados aos dados
 * de orçamento vindos da API e banco de dados.
 */

export interface BudgetData {
  id: string;
  codigo: string;
  nome: string;
  cliente_nome: string;
  status: 'RASCUNHO' | 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  area_construida: number;
  area_terreno: number;
  valor_total: number;
  valor_por_m2: number;
  tipologia: string;
  padrao: string;
  complexidade: string;
  localizacao: string;
  prazo_entrega: number;
  disciplinas: string[];
  cronograma: CronogramaData | null;
  composicao_financeira: ComposicaoFinanceira | null;
  proposta: PropostaData | null;
  created_at: string;
  updated_at: string;
}

export interface CronogramaData {
  prazoTotal: number;
  fases: Record<string, FaseData>;
}

export interface FaseData {
  nome: string;
  ordem: number;
  etapa: string;
  prazo: number;
  valor: number;
  percentual: number;
  disciplinas: string[];
  responsavel: string;
  entregaveis: string[];
  observacoes?: string;
}

export interface ComposicaoFinanceira {
  custosHoras: number;
  custosIndiretos: number;
  impostos: number;
  margemLucro: number;
  subtotal: number;
  total: number;
}

export interface PropostaData {
  formaPagamento: {
    entrada: number;
    parcelas: number;
  };
  validadeOferta: number;
  observacoes: string;
}

export interface CalculatedValues {
  disciplineValues: Record<string, number>;
  totalValue: number;
  breakdown: {
    subtotal: number;
    indirectCosts: number;
    taxes: number;
    margin: number;
  };
}

export interface ProjectParameters {
  area: number;
  region: string;
  standard: string;
  complexity: string;
}