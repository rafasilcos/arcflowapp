// ============================================================================
// MODELO TÉCNICO PROFISSIONAL DE ORÇAMENTO - ArcFlow
// Baseado em 30+ anos de experiência no mercado AEC
// ============================================================================

export interface DadosProjeto {
  // Identificação Básica
  codigo: string;
  titulo: string;
  cliente: {
    nome: string;
    cpfCnpj: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone: string;
    email: string;
    responsavelTecnico?: string;
  };
  
  // Características Técnicas
  localizacao: {
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    coordenadas?: { lat: number; lng: number };
    caracteristicasTerreno?: string;
  };
  
  // Dados Técnicos Fundamentais
  dadosTecnicos: {
    areaTerreno?: number;
    areaConstruida: number;
    areaUtil?: number;
    numeroAndares?: number;
    numeroPavimentos?: number;
    tipologia: TipologiaProjeto;
    padraoConstrutivo: PadraoConstrutivo;
    sistemaConstrutivo?: SistemaConstrutivo;
    classificacaoUso: ClassificacaoUso;
  };
}

export interface EscopoTecnico {
  // Projetos Básicos (Obrigatórios)
  projetosBasicos: {
    arquitetonico: {
      incluido: boolean;
      fases: FaseProjeto[];
      observacoes?: string;
    };
    estrutural: {
      incluido: boolean;
      tipo: 'concreto' | 'aco' | 'madeira' | 'misto';
      fases: FaseProjeto[];
      observacoes?: string;
    };
    instalacoes: {
      hidrossanitarias: { incluido: boolean; fases: FaseProjeto[] };
      eletricas: { incluido: boolean; fases: FaseProjeto[] };
      gasGLP: { incluido: boolean; fases: FaseProjeto[] };
      observacoes?: string;
    };
  };
  
  // Projetos Complementares (Opcionais)
  projetosComplementares: {
    paisagismo: { incluido: boolean; fases: FaseProjeto[] };
    interiores: { incluido: boolean; fases: FaseProjeto[] };
    luminotecnico: { incluido: boolean; fases: FaseProjeto[] };
    automacao: { incluido: boolean; fases: FaseProjeto[] };
    sustentabilidade: { incluido: boolean; certificacao?: string };
    acessibilidade: { incluido: boolean; norma: 'NBR9050' };
    seguranca: { incluido: boolean; tipo: 'incendio' | 'patrimonial' | 'ambos' };
  };
  
  // Consultoria Especializada
  consultoriaEspecializada: {
    estrutural: { incluido: boolean; escopo?: string };
    instalacoes: { incluido: boolean; escopo?: string };
    sustentabilidade: { incluido: boolean; escopo?: string };
    aprovacoes: { incluido: boolean; orgaos?: string[] };
    acompanhamentoObra: { incluido: boolean; periodicidade?: string };
  };
  
  // Serviços Adicionais
  servicosAdicionais: {
    levantamentoTopografico: boolean;
    sondagemSolo: boolean;
    laudoEstruturalExistente: boolean;
    maqueteEletronica: boolean;
    renderizacoes: { incluido: boolean; quantidade?: number };
    animacoes3D: boolean;
    realidadeVirtual: boolean;
  };
}

export interface ComposicaoCustos {
  // Custos Diretos
  custosDirectos: {
    horasTecnicas: {
      arquiteto: { horas: number; valorHora: number; total: number };
      engenheiro: { horas: number; valorHora: number; total: number };
      desenhista: { horas: number; valorHora: number; total: number };
      estagiario: { horas: number; valorHora: number; total: number };
      consultor: { horas: number; valorHora: number; total: number };
    };
    
    deslocamentos: {
      visitasTecnicas: { quantidade: number; valorUnitario: number; total: number };
      reunioes: { quantidade: number; valorUnitario: number; total: number };
      aprovacoes: { quantidade: number; valorUnitario: number; total: number };
    };
    
    materiaisInsumos: {
      plotagem: { quantidade: number; valorUnitario: number; total: number };
      impressoes: { quantidade: number; valorUnitario: number; total: number };
      maquetes: { quantidade: number; valorUnitario: number; total: number };
      software: { licencas: number; valorMensal: number; meses: number; total: number };
    };
    
    terceirizados: {
      topografia: { incluido: boolean; valor: number };
      sondagem: { incluido: boolean; valor: number };
      consultores: { incluido: boolean; valor: number };
      aprovacoes: { incluido: boolean; valor: number };
    };
  };
  
  // Custos Indiretos
  custosIndiretos: {
    estruturaEscritorio: {
      percentual: number;
      valor: number;
      base: 'custos_diretos';
    };
    
    impostos: {
      issqn: { percentual: number; valor: number };
      pis: { percentual: number; valor: number };
      cofins: { percentual: number; valor: number };
      irpj: { percentual: number; valor: number };
      csll: { percentual: number; valor: number };
      total: number;
    };
    
    seguros: {
      responsabilidadeCivil: { valor: number };
      errosOmissoes: { valor: number };
      total: number;
    };
    
    contingencia: {
      percentual: number;
      valor: number;
      justificativa: string;
    };
  };
  
  // Margem e Lucro
  margemLucro: {
    percentual: number;
    valor: number;
    base: 'custos_totais';
  };
  
  // Resumo Financeiro
  resumoFinanceiro: {
    subtotalCustosDirectos: number;
    subtotalCustosIndiretos: number;
    subtotalCustos: number;
    margemLucro: number;
    valorTotal: number;
    valorPorM2: number;
  };
}

export interface CronogramaFisicoFinanceiro {
  fases: FaseCronograma[];
  resumoFinanceiro: {
    totalProjeto: number;
    distribuicaoPagamentos: { fase: string; percentual: number; valor: number }[];
  };
}

export interface FaseCronograma {
  id: string;
  nome: string;
  descricao: string;
  prazoInicio: Date;
  prazoFim: Date;
  duracaoDias: number;
  percentualFinanceiro: number;
  valorFase: number;
  entregaveis: string[];
  dependencias?: string[];
  marcosPagamento: MarcoPagamento[];
}

export interface MarcoPagamento {
  id: string;
  descricao: string;
  percentual: number;
  valor: number;
  condicoes: string[];
  prazoVencimento: number; // dias após entrega
}

export interface CondicoesContratuais {
  // Condições de Pagamento
  pagamento: {
    moeda: 'BRL';
    formaPagamento: 'transferencia' | 'boleto' | 'pix' | 'cheque';
    condicoes: string;
    reajuste: {
      indice: 'INCC' | 'IGPM' | 'IPCA';
      periodicidade: 'mensal' | 'trimestral' | 'semestral' | 'anual';
    };
    multa: {
      atraso: number; // percentual por dia
      inadimplencia: number; // percentual sobre valor em atraso
    };
  };
  
  // Prazos e Entregas
  prazos: {
    inicioServicos: Date;
    prazoTotal: number; // dias
    prazosParciais: { fase: string; prazo: number }[];
    condicoesInicioServicos: string[];
  };
  
  // Garantias e Seguros
  garantias: {
    seguroResponsabilidadeCivil: {
      valor: number;
      vigencia: number; // anos
      cobertura: string;
    };
    garantiaServicos: {
      prazo: number; // meses
      escopo: string;
    };
    caucaoTecnica: {
      percentual: number;
      valor: number;
      liberacao: string;
    };
  };
  
  // Responsabilidades
  responsabilidades: {
    contratante: string[];
    contratado: string[];
    compartilhadas: string[];
  };
  
  // Condições Especiais
  condicoesEspeciais: {
    alteracoesProjeto: string;
    aprovacaoOrgaos: string;
    fornecimentoDocumentos: string;
    acessoLocal: string;
    confidencialidade: string;
  };
  
  // Validade da Proposta
  validadeProposta: {
    dias: number;
    dataVencimento: Date;
    condicoesRenovacao: string;
  };
}

// ============================================================================
// ENUMS E TIPOS AUXILIARES
// ============================================================================

export enum TipologiaProjeto {
  RESIDENCIAL_UNIFAMILIAR = 'residencial_unifamiliar',
  RESIDENCIAL_MULTIFAMILIAR = 'residencial_multifamiliar',
  COMERCIAL_ESCRITORIO = 'comercial_escritorio',
  COMERCIAL_LOJA = 'comercial_loja',
  COMERCIAL_SHOPPING = 'comercial_shopping',
  INDUSTRIAL_FABRICA = 'industrial_fabrica',
  INDUSTRIAL_GALPAO = 'industrial_galpao',
  INSTITUCIONAL_ESCOLA = 'institucional_escola',
  INSTITUCIONAL_HOSPITAL = 'institucional_hospital',
  INSTITUCIONAL_RELIGIOSO = 'institucional_religioso',
  MISTO_RESIDENCIAL_COMERCIAL = 'misto_residencial_comercial',
  ESPECIAL_PATRIMONIO = 'especial_patrimonio',
  INFRAESTRUTURA_URBANA = 'infraestrutura_urbana'
}

export enum PadraoConstrutivo {
  SIMPLES = 'simples',
  MEDIO = 'medio',
  ALTO = 'alto',
  LUXO = 'luxo',
  PREMIUM = 'premium'
}

export enum SistemaConstrutivo {
  CONVENCIONAL_CONCRETO = 'convencional_concreto',
  ESTRUTURA_METALICA = 'estrutura_metalica',
  WOOD_FRAME = 'wood_frame',
  STEEL_FRAME = 'steel_frame',
  ALVENARIA_ESTRUTURAL = 'alvenaria_estrutural',
  CONCRETO_MOLDADO = 'concreto_moldado',
  PRE_FABRICADO = 'pre_fabricado',
  MISTO = 'misto'
}

export enum ClassificacaoUso {
  RESIDENCIAL = 'residencial',
  COMERCIAL = 'comercial',
  INDUSTRIAL = 'industrial',
  INSTITUCIONAL = 'institucional',
  MISTO = 'misto',
  ESPECIAL = 'especial'
}

export enum FaseProjeto {
  LEVANTAMENTO_DADOS = 'levantamento_dados',
  ESTUDO_PRELIMINAR = 'estudo_preliminar',
  ANTEPROJETO = 'anteprojeto',
  PROJETO_BASICO = 'projeto_basico',
  PROJETO_EXECUTIVO = 'projeto_executivo',
  DETALHAMENTO = 'detalhamento',
  APROVACAO_ORGAOS = 'aprovacao_orgaos',
  ACOMPANHAMENTO_OBRA = 'acompanhamento_obra'
}

// ============================================================================
// INTERFACE PRINCIPAL DO ORÇAMENTO
// ============================================================================

export interface OrcamentoTecnicoProfissional {
  // Metadados
  id: string;
  versao: string;
  dataElaboracao: Date;
  dataUltimaRevisao: Date;
  status: 'rascunho' | 'em_analise' | 'aprovado' | 'rejeitado' | 'revisao';
  elaboradoPor: {
    nome: string;
    crea: string;
    empresa: string;
    assinatura?: string;
  };
  
  // Conteúdo Principal
  dadosProjeto: DadosProjeto;
  escopoTecnico: EscopoTecnico;
  composicaoCustos: ComposicaoCustos;
  cronogramaFisicoFinanceiro: CronogramaFisicoFinanceiro;
  condicoesContratuais: CondicoesContratuais;
  
  // Anexos e Documentos
  anexos: {
    plantas?: string[];
    memoriais?: string[];
    especificacoes?: string[];
    planilhas?: string[];
    fotos?: string[];
    documentos?: string[];
  };
  
  // Observações Técnicas
  observacoesTecnicas: {
    premissas: string[];
    restricoes: string[];
    riscos: string[];
    oportunidades: string[];
    recomendacoes: string[];
  };
  
  // Controle de Qualidade
  controleQualidade: {
    revisadoPor?: string;
    dataRevisao?: Date;
    aprovadoPor?: string;
    dataAprovacao?: Date;
    observacoesQualidade?: string;
  };
}

// ============================================================================
// CONSTANTES E PARÂMETROS TÉCNICOS
// ============================================================================

export const PARAMETROS_TECNICOS = {
  // Valores de Referência por m² (Base 2024)
  VALORES_REFERENCIA_M2: {
    [TipologiaProjeto.RESIDENCIAL_UNIFAMILIAR]: {
      [PadraoConstrutivo.SIMPLES]: { min: 45, max: 65 },
      [PadraoConstrutivo.MEDIO]: { min: 65, max: 95 },
      [PadraoConstrutivo.ALTO]: { min: 95, max: 140 },
      [PadraoConstrutivo.LUXO]: { min: 140, max: 200 },
      [PadraoConstrutivo.PREMIUM]: { min: 200, max: 350 }
    },
    [TipologiaProjeto.COMERCIAL_ESCRITORIO]: {
      [PadraoConstrutivo.SIMPLES]: { min: 35, max: 55 },
      [PadraoConstrutivo.MEDIO]: { min: 55, max: 85 },
      [PadraoConstrutivo.ALTO]: { min: 85, max: 125 },
      [PadraoConstrutivo.LUXO]: { min: 125, max: 180 },
      [PadraoConstrutivo.PREMIUM]: { min: 180, max: 280 }
    }
  },
  
  // Multiplicadores de Complexidade
  MULTIPLICADORES_COMPLEXIDADE: {
    TERRENO_IRREGULAR: 1.15,
    TERRENO_ACLIVE: 1.20,
    TERRENO_DECLIVE: 1.25,
    PATRIMONIO_HISTORICO: 1.40,
    NORMAS_ESPECIAIS: 1.30,
    APROVACAO_MULTIPLA: 1.25,
    PRAZO_REDUZIDO: 1.35
  },
  
  // Percentuais Padrão
  PERCENTUAIS_PADRAO: {
    ESTRUTURA_ESCRITORIO: 0.25, // 25%
    IMPOSTOS_TOTAL: 0.165, // 16.5%
    CONTINGENCIA: 0.10, // 10%
    MARGEM_LUCRO: 0.20, // 20%
    SEGURO_RC: 0.02 // 2%
  }
} as const; 