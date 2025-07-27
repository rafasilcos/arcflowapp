// Tipos principais para o módulo de orçamento

export interface OrcamentoMultidisciplinar {
  arquitetura: number;
  interiores: number;
  decoracao: number;
  paisagismo: number;
  coordenacao: number;
  total: number;
}

export interface BriefingCompleto {
  areaTotal: number;
  tipologia: string;
  complexidade: string;
  disciplinasSelecionadas: string[];
  urgencia: string;
  margem: number;
  perfilCliente: string;
  [key: string]: any;
}

export interface OrcamentoDetalhado {
  valorTotal: number;
  breakdown: {
    area: number;
    valorBase: number;
    fatorTipologia: number;
    fatorComplexidade: number;
    valorDisciplinas: number;
    fatoresExtras: {
      urgencia: string;
      margem: number;
    };
    multidisciplinar: OrcamentoMultidisciplinar;
    sugestoes: string[];
    alertas: string[];
  };
  // 🎯 CAMPOS PARA COMPATIBILIDADE COM DASHBOARD
  calculos?: {
    custoTotalPorEtapa: {
      [key: string]: number;
    };
    margemAplicada: number;
  };
  proposta?: {
    formaPagamento: {
      entrada: number;
      parcelas: number;
      valorParcela: number;
    };
    validadeProposta: number;
    prazoEntrega: number;
  };
  cronograma?: {
    prazoTotal: number;
    etapas: Array<{
      nome: string;
      duracao: number;
      responsavel: string;
      entregaveis: string[];
    }>;
    marcosPrincipais: Array<{
      nome: string;
      data: string;
      tipo: string;
    }>;
  };
  prazoEntrega?: number;
  briefingUtilizado: BriefingCompleto;
} 