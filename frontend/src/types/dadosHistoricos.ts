export interface ProjetoHistorico {
  id: string;
  clienteId: string;
  nomeCliente: string;
  tipoProjeto: TipoProjeto;
  categoria: CategoriaProjeto;
  dataInicio: Date;
  dataConclusao?: Date;
  status: StatusProjeto;
  
  // Dados do Briefing Original
  briefingOriginal: {
    objetivos: string[];
    restricoes: string[];
    orcamentoInicial: number;
    prazoInicial: number;
    complexidade: NivelComplexidade;
    tipoTerreno: TipoTerreno;
    areaTerreno: number;
    areaConstruida: number;
    numeroComodos: number;
    estilo: EstiloArquitetonico;
    sustentabilidade: boolean;
  };
  
  // Dados Reais do Projeto
  dadosReais: {
    orcamentoFinal: number;
    prazoFinal: number;
    areaConstruidaFinal: number;
    alteracoesProjeto: number;
    satisfacaoCliente: number; // 1-10
    margemLucro: number;
    custoPorM2: number;
    horasTrabalho: number;
    desafiosEncontrados: string[];
    licoesAprendidas: string[];
  };
  
  // Métricas de Performance
  metricas: {
    desvioOrcamento: number; // %
    desvioPrazo: number; // %
    eficienciaEquipe: number; // 1-10
    qualidadeEntrega: number; // 1-10
    inovacaoTecnica: number; // 1-10
    sustentabilidadeReal: number; // 1-10
  };
  
  // Dados Técnicos
  dadosTecnicos: {
    materiaisUtilizados: string[];
    tecnologiasAplicadas: string[];
    certificacoesSustentabilidade: string[];
    desafiosTecnicos: string[];
    solucoesInovadoras: string[];
  };
  
  // Contexto do Mercado
  contextoMercado: {
    periodoEconomico: string;
    custoMateriais: number; // índice base 100
    disponibilidadeMaoObra: number; // 1-10
    regulamentacoesMunicipais: string[];
    tendenciasArquitetonicas: string[];
  };
  
  tags: string[];
  observacoes: string;
  arquivosAnexos: string[];
  fotosAntesDurante: string[];
  fotosFinais: string[];
}

export interface DadosBenchmarking {
  id: string;
  categoria: CategoriaProjeto;
  tipoProjeto: TipoProjeto;
  periodo: PeriodoAnalise;
  
  // Métricas Agregadas
  metricas: {
    // Custos
    custoMedioM2: number;
    custoMinimoM2: number;
    custoMaximoM2: number;
    desviopadraoCusto: number;
    
    // Prazos
    prazoMedioDias: number;
    prazoMinimoDias: number;
    prazoMaximoDias: number;
    desviopadraoPrazo: number;
    
    // Qualidade
    satisfacaoMediaCliente: number;
    margemLucroMedia: number;
    eficienciaMediaEquipe: number;
    qualidadeMediaEntrega: number;
    
    // Produtividade
    horasTrabalhoMedias: number;
    alteracoesProjeto: number;
    taxaSucesso: number; // %
    taxaRetrabalho: number; // %
  };
  
  // Análises Comparativas
  comparacoes: {
    mercadoLocal: ComparacaoMercado;
    concorrencia: ComparacaoConcorrencia;
    tendenciasTemporais: TendenciaTemporal[];
    benchmarkSetorial: BenchmarkSetorial;
  };
  
  // Insights e Recomendações
  insights: {
    pontosFortes: string[];
    areasmelhorias: string[];
    oportunidadesMercado: string[];
    riscosIdentificados: string[];
    recomendacoesEstrategicas: string[];
  };
  
  dataAtualizacao: Date;
  fonteDados: string[];
  confiabilidade: number; // 1-10
}

export interface AnaliseComparativa {
  id: string;
  projetoAtual: string; // ID do briefing atual
  projetosSimilares: ProjetoHistorico[];
  criteriosSimilaridade: CriterioSimilaridade[];
  
  // Comparações Específicas
  comparacoes: {
    orcamento: ComparacaoOrcamento;
    prazo: ComparacaoPrazo;
    complexidade: ComparacaoComplexidade;
    qualidade: ComparacaoQualidade;
    sustentabilidade: ComparacaoSustentabilidade;
  };
  
  // Previsões Baseadas em Histórico
  previsoes: {
    orcamentoEstimado: PrevisaoOrcamento;
    prazoEstimado: PrevisaoPrazo;
    riscosProvaveis: RiscoProvavel[];
    oportunidadesIdentificadas: string[];
    recomendacoesProjeto: string[];
  };
  
  // Confiança das Análises
  confianca: {
    similaridadeDados: number; // %
    tamanhoAmostra: number;
    qualidadeDados: number; // 1-10
    confiancaPrevisao: number; // %
  };
  
  dataAnalise: Date;
  validadeAnalise: Date;
}

export interface MetricasDesempenho {
  id: string;
  escritorioId: string;
  periodo: PeriodoAnalise;
  
  // KPIs Principais
  kpis: {
    // Financeiros
    receitaTotal: number;
    margemLucroMedia: number;
    custoOperacional: number;
    roi: number; // Return on Investment
    
    // Operacionais
    numeroProjetosConcluidos: number;
    tempoMedioProjeto: number;
    taxaConclusaoPrazo: number; // %
    taxaConclusaoOrcamento: number; // %
    
    // Qualidade
    satisfacaoMediaCliente: number;
    taxaRecomendacao: number; // %
    numeroReclamacoes: number;
    taxaRetrabalho: number; // %
    
    // Equipe
    produtividadeEquipe: number;
    horasTrabalhoTotais: number;
    eficienciaRecursos: number; // %
    taxaRotatividade: number; // %
  };
  
  // Comparações Temporais
  evolucao: {
    crescimentoReceita: number; // %
    melhoriaQualidade: number; // %
    otimizacaoPrazos: number; // %
    reducaoCustos: number; // %
  };
  
  // Análise por Categoria
  desempenhoPorCategoria: {
    categoria: CategoriaProjeto;
    numeroProjetosConcluidos: number;
    receitaGerada: number;
    margemLucro: number;
    satisfacaoCliente: number;
    tempoMedio: number;
  }[];
  
  // Tendências e Projeções
  tendencias: {
    projecaoReceita: number[];
    projecaoQualidade: number[];
    projecaoEficiencia: number[];
    sazonalidade: DadosSazonalidade[];
  };
  
  dataCalculo: Date;
  proximaAtualizacao: Date;
}

export interface RelatorioInsights {
  id: string;
  titulo: string;
  tipo: TipoRelatorio;
  periodo: PeriodoAnalise;
  
  // Resumo Executivo
  resumoExecutivo: {
    principaisAchados: string[];
    recomendacoesPrioritarias: string[];
    impactoEstimado: string[];
    proximosPassos: string[];
  };
  
  // Análises Detalhadas
  analises: {
    desempenhoFinanceiro: AnaliseFinanceira;
    eficienciaOperacional: AnaliseOperacional;
    qualidadeServico: AnaliseQualidade;
    satisfacaoCliente: AnaliseSatisfacao;
    competitividadeMercado: AnaliseCompetitividade;
  };
  
  // Visualizações e Gráficos
  visualizacoes: {
    graficos: ConfiguracaoGrafico[];
    tabelas: ConfiguracaoTabela[];
    mapasCalor: ConfiguracaoMapaCalor[];
    dashboards: ConfiguracaoDashboard[];
  };
  
  // Recomendações Estratégicas
  recomendacoes: {
    curtoprazo: RecomendacaoEstrategica[];
    medioPrazo: RecomendacaoEstrategica[];
    longoPrazo: RecomendacaoEstrategica[];
  };
  
  // Monitoramento
  indicadoresMonitoramento: IndicadorMonitoramento[];
  alertasConfigurados: AlertaPersonalizado[];
  
  dataGeracao: Date;
  autorRelatorio: string;
  destinatarios: string[];
  statusAprovacao: StatusAprovacao;
}

// Tipos Auxiliares
export type TipoProjeto = 
  | 'residencial_unifamiliar'
  | 'residencial_multifamiliar'
  | 'comercial_escritorio'
  | 'comercial_loja'
  | 'industrial'
  | 'institucional'
  | 'reforma_residencial'
  | 'reforma_comercial'
  | 'paisagismo'
  | 'interiores';

export type CategoriaProjeto = 
  | 'alto_padrao'
  | 'medio_padrao'
  | 'popular'
  | 'luxo'
  | 'sustentavel'
  | 'inovador'
  | 'tradicional';

export type StatusProjeto = 
  | 'em_andamento'
  | 'concluido'
  | 'pausado'
  | 'cancelado'
  | 'em_aprovacao';

export type NivelComplexidade = 
  | 'baixa'
  | 'media'
  | 'alta'
  | 'muito_alta';

export type TipoTerreno = 
  | 'plano'
  | 'aclive'
  | 'declive'
  | 'irregular'
  | 'esquina'
  | 'meio_quadra';

export type EstiloArquitetonico = 
  | 'contemporaneo'
  | 'moderno'
  | 'classico'
  | 'minimalista'
  | 'industrial'
  | 'rustico'
  | 'ecletico';

export type PeriodoAnalise = 
  | 'ultimo_mes'
  | 'ultimos_3_meses'
  | 'ultimos_6_meses'
  | 'ultimo_ano'
  | 'ultimos_2_anos'
  | 'historico_completo'
  | 'personalizado';

export type CriterioSimilaridade = 
  | 'tipo_projeto'
  | 'categoria'
  | 'orcamento'
  | 'area_construida'
  | 'complexidade'
  | 'localizacao'
  | 'cliente_perfil'
  | 'estilo_arquitetonico';

export type TipoRelatorio = 
  | 'desempenho_geral'
  | 'analise_financeira'
  | 'qualidade_servico'
  | 'benchmarking_mercado'
  | 'previsao_tendencias'
  | 'satisfacao_cliente'
  | 'eficiencia_operacional';

export type StatusAprovacao = 
  | 'rascunho'
  | 'em_revisao'
  | 'aprovado'
  | 'publicado'
  | 'arquivado';

// Interfaces de Comparação
export interface ComparacaoMercado {
  posicaoMercado: number; // 1-10
  diferencialCompetitivo: string[];
  vantagensIdentificadas: string[];
  desvantagensIdentificadas: string[];
}

export interface ComparacaoConcorrencia {
  concorrentesPrincipais: string[];
  vantagens: string[];
  desvantagens: string[];
  oportunidadesDiferenciacao: string[];
}

export interface TendenciaTemporal {
  periodo: string;
  metrica: string;
  valor: number;
  tendencia: 'crescente' | 'decrescente' | 'estavel';
}

export interface BenchmarkSetorial {
  setor: string;
  posicaoRelativa: number; // %
  metricasComparacao: { [key: string]: number };
  recomendacoesMelhoria: string[];
}

// Interfaces de Previsão
export interface PrevisaoOrcamento {
  valorEstimado: number;
  margemErro: number; // %
  faixaMinima: number;
  faixaMaxima: number;
  fatoresInfluencia: string[];
  confianca: number; // %
}

export interface PrevisaoPrazo {
  prazoEstimado: number; // dias
  margemErro: number; // %
  prazoMinimo: number;
  prazoMaximo: number;
  fatoresInfluencia: string[];
  confianca: number; // %
}

export interface RiscoProvavel {
  tipo: string;
  probabilidade: number; // %
  impacto: number; // 1-10
  descricao: string;
  medidaPreventiva: string;
}

// Interfaces de Análise
export interface AnaliseFinanceira {
  receita: DadosFinanceiros;
  custos: DadosFinanceiros;
  margem: DadosFinanceiros;
  roi: DadosFinanceiros;
  tendencias: TendenciaFinanceira[];
}

export interface AnaliseOperacional {
  eficiencia: DadosOperacionais;
  produtividade: DadosOperacionais;
  recursos: DadosOperacionais;
  processos: DadosOperacionais;
  melhorias: OportunidadeMelhoria[];
}

export interface AnaliseQualidade {
  metricas: MetricasQualidade;
  satisfacao: DadosSatisfacao;
  reclamacoes: DadosReclamacoes;
  melhorias: AcaoMelhoria[];
}

export interface AnaliseSatisfacao {
  nps: number;
  satisfacaoGeral: number;
  recomendacao: number;
  fidelizacao: number;
  feedback: FeedbackCliente[];
}

export interface AnaliseCompetitividade {
  posicaoMercado: number;
  vantagens: string[];
  desvantagens: string[];
  oportunidades: string[];
  ameacas: string[];
}

// Interfaces de Configuração
export interface ConfiguracaoGrafico {
  tipo: 'linha' | 'barra' | 'pizza' | 'area' | 'scatter';
  dados: any[];
  configuracao: any;
}

export interface ConfiguracaoTabela {
  colunas: string[];
  dados: any[];
  configuracao: any;
}

export interface ConfiguracaoMapaCalor {
  dados: any[][];
  configuracao: any;
}

export interface ConfiguracaoDashboard {
  widgets: WidgetDashboard[];
  layout: LayoutDashboard;
}

// Interfaces de Recomendação
export interface RecomendacaoEstrategica {
  titulo: string;
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
  impactoEstimado: string;
  recursosNecessarios: string[];
  prazoImplementacao: number; // dias
  responsavel: string;
  kpisImpactados: string[];
}

export interface IndicadorMonitoramento {
  nome: string;
  metrica: string;
  valorAtual: number;
  valorMeta: number;
  tendencia: 'positiva' | 'negativa' | 'neutra';
  alertaConfigurado: boolean;
}

export interface AlertaPersonalizado {
  nome: string;
  condicao: string;
  valor: number;
  ativo: boolean;
  destinatarios: string[];
  frequencia: 'tempo_real' | 'diario' | 'semanal' | 'mensal';
}

// Interfaces de Dados Específicos
export interface DadosFinanceiros {
  atual: number;
  anterior: number;
  variacao: number; // %
  tendencia: 'positiva' | 'negativa' | 'neutra';
}

export interface DadosOperacionais {
  eficiencia: number;
  capacidade: number;
  utilizacao: number; // %
  gargalos: string[];
}

export interface MetricasQualidade {
  qualidadeGeral: number;
  conformidade: number; // %
  defeitos: number;
  retrabalho: number; // %
}

export interface DadosSatisfacao {
  nota: number;
  respostas: number;
  comentarios: string[];
  categorias: { [key: string]: number };
}

export interface DadosReclamacoes {
  total: number;
  resolvidas: number;
  tempoMedioResolucao: number; // horas
  categorias: { [key: string]: number };
}

export interface FeedbackCliente {
  cliente: string;
  projeto: string;
  nota: number;
  comentario: string;
  data: Date;
  categoria: string;
}

export interface OportunidadeMelhoria {
  area: string;
  descricao: string;
  impactoEstimado: number; // %
  esforcoImplementacao: 'baixo' | 'medio' | 'alto';
  prazoRetorno: number; // meses
}

export interface AcaoMelhoria {
  titulo: string;
  descricao: string;
  responsavel: string;
  prazo: Date;
  status: 'planejada' | 'em_andamento' | 'concluida';
  resultadoEsperado: string;
}

export interface TendenciaFinanceira {
  periodo: string;
  receita: number;
  custo: number;
  margem: number;
  projecao: number;
}

export interface DadosSazonalidade {
  mes: number;
  demanda: number;
  receita: number;
  eficiencia: number;
}

export interface WidgetDashboard {
  id: string;
  tipo: string;
  titulo: string;
  dados: any;
  posicao: { x: number; y: number; w: number; h: number };
}

export interface LayoutDashboard {
  colunas: number;
  linhas: number;
  responsivo: boolean;
  configuracao: any;
}

// Comparações Específicas
export interface ComparacaoOrcamento {
  orcamentoAtual: number;
  orcamentoMedio: number;
  desvio: number; // %
  faixaEsperada: { min: number; max: number };
  fatoresInfluencia: string[];
}

export interface ComparacaoPrazo {
  prazoAtual: number;
  prazoMedio: number;
  desvio: number; // %
  faixaEsperada: { min: number; max: number };
  fatoresInfluencia: string[];
}

export interface ComparacaoComplexidade {
  complexidadeAtual: NivelComplexidade;
  complexidadeMedia: NivelComplexidade;
  fatoresComplexidade: string[];
  impactoEstimado: string[];
}

export interface ComparacaoQualidade {
  qualidadeEsperada: number;
  qualidadeMedia: number;
  fatoresQualidade: string[];
  riscosQualidade: string[];
}

export interface ComparacaoSustentabilidade {
  nivelSustentabilidade: number;
  sustentabilidadeMedia: number;
  oportunidadesMelhoria: string[];
  certificacoesPossiveis: string[];
} 