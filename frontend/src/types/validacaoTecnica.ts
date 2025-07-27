// TIPOS PARA VALIDAÇÃO TÉCNICA - ARCFLOW
// Sistema de validação automática de viabilidade técnica e restrições

export interface DadosTerreno {
  id: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    coordenadas?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Características físicas
  caracteristicas: {
    area: number; // m²
    testada: number; // metros
    formato: 'retangular' | 'irregular' | 'esquina' | 'meio_quadra';
    topografia: 'plano' | 'aclive_suave' | 'aclive_acentuado' | 'declive_suave' | 'declive_acentuado';
    orientacao: 'norte' | 'sul' | 'leste' | 'oeste' | 'nordeste' | 'noroeste' | 'sudeste' | 'sudoeste';
    frentes: number;
    fundos: number;
    lateral_direita: number;
    lateral_esquerda: number;
  };
  
  // Infraestrutura disponível
  infraestrutura: {
    agua: boolean;
    esgoto: boolean;
    energia_eletrica: boolean;
    gas_natural: boolean;
    telefone: boolean;
    internet: boolean;
    pavimentacao: 'asfalto' | 'paralelepipedo' | 'terra' | 'cascalho';
    iluminacao_publica: boolean;
    coleta_lixo: boolean;
  };
  
  // Condições ambientais
  condicoes_ambientais: {
    vegetacao_existente: boolean;
    arvores_protegidas: boolean;
    nascentes: boolean;
    areas_alagaveis: boolean;
    solo_contaminado: boolean;
    patrimonio_historico_proximidade: boolean;
  };
}

export interface ZoneamentoMunicipal {
  id: string;
  municipio: string;
  zona: string;
  descricao: string;
  
  // Coeficientes urbanísticos
  coeficientes: {
    taxa_ocupacao_maxima: number; // %
    coeficiente_aproveitamento_basico: number;
    coeficiente_aproveitamento_maximo: number;
    permeabilidade_minima: number; // %
    taxa_permeabilidade: number; // %
  };
  
  // Recuos obrigatórios
  recuos: {
    frontal_minimo: number; // metros
    lateral_minimo: number; // metros
    fundos_minimo: number; // metros
    entre_edificacoes: number; // metros
  };
  
  // Alturas e gabaritos
  alturas: {
    maxima_edificacao: number; // metros
    pe_direito_minimo: number; // metros
    numero_pavimentos_maximo: number;
    restricoes_gabarito: string[];
  };
  
  // Usos permitidos
  usos_permitidos: {
    residencial_unifamiliar: boolean;
    residencial_multifamiliar: boolean;
    comercial_local: boolean;
    comercial_geral: boolean;
    servicos: boolean;
    institucional: boolean;
    industrial: boolean;
    misto: boolean;
  };
  
  // Restrições específicas
  restricoes: {
    areas_especiais: string[];
    limitacoes_uso: string[];
    exigencias_especiais: string[];
    documentacao_adicional: string[];
  };
  
  // Informações de aprovação
  aprovacao: {
    orgao_responsavel: string;
    prazo_medio_aprovacao: number; // dias
    documentos_necessarios: string[];
    taxas_aproximadas: number; // R$
  };
  
  ultima_atualizacao: string;
  fonte_dados: string;
}

export interface RestricaoAmbiental {
  id: string;
  tipo: 'app' | 'reserva_legal' | 'area_preservacao' | 'nascente' | 'vegetacao_nativa' | 'patrimonio_natural';
  descricao: string;
  area_afetada: number; // m²
  percentual_terreno: number; // %
  
  // Impactos na construção
  impactos: {
    area_construivel_reduzida: number; // m²
    restricoes_construtivas: string[];
    exigencias_compensatorias: string[];
    licencas_necessarias: string[];
  };
  
  // Órgãos responsáveis
  orgaos_fiscalizadores: string[];
  penalidades: string[];
  
  status: 'ativa' | 'em_analise' | 'revogada';
  data_vigencia: string;
}

export interface ValidacaoViabilidade {
  id: string;
  terreno_id: string;
  projeto_proposto: {
    tipologia: string;
    area_construida: number;
    numero_pavimentos: number;
    uso_principal: string;
    usos_secundarios: string[];
  };
  
  // Resultados da validação
  resultado_geral: 'viavel' | 'viavel_com_restricoes' | 'inviavel' | 'necessita_analise';
  score_viabilidade: number; // 0-100
  
  // Validações específicas
  validacoes: {
    zoneamento: {
      status: 'aprovado' | 'reprovado' | 'condicional';
      observacoes: string[];
      ajustes_necessarios: string[];
    };
    
    coeficientes: {
      taxa_ocupacao: {
        proposta: number;
        permitida: number;
        status: 'ok' | 'excede' | 'limite';
      };
      coeficiente_aproveitamento: {
        proposto: number;
        permitido: number;
        status: 'ok' | 'excede' | 'limite';
      };
      permeabilidade: {
        proposta: number;
        minima_exigida: number;
        status: 'ok' | 'insuficiente';
      };
    };
    
    recuos: {
      frontal: { proposto: number; minimo: number; status: 'ok' | 'insuficiente' };
      lateral: { proposto: number; minimo: number; status: 'ok' | 'insuficiente' };
      fundos: { proposto: number; minimo: number; status: 'ok' | 'insuficiente' };
    };
    
    altura_gabarito: {
      altura_proposta: number;
      altura_maxima: number;
      pavimentos_propostos: number;
      pavimentos_maximos: number;
      status: 'ok' | 'excede';
    };
    
    uso_solo: {
      uso_proposto: string;
      usos_permitidos: string[];
      status: 'permitido' | 'nao_permitido' | 'condicional';
      condicoes: string[];
    };
    
    restricoes_ambientais: {
      areas_protegidas: RestricaoAmbiental[];
      impacto_geral: 'baixo' | 'medio' | 'alto';
      licencas_necessarias: string[];
    };
    
    infraestrutura: {
      adequacao_geral: 'adequada' | 'parcial' | 'inadequada';
      melhorias_necessarias: string[];
      custos_estimados: number;
    };
  };
  
  // Recomendações e ajustes
  recomendacoes: {
    ajustes_projeto: string[];
    alternativas_viabilidade: string[];
    otimizacoes_sugeridas: string[];
    riscos_identificados: string[];
  };
  
  // Cronograma de aprovações
  cronograma_aprovacoes: {
    etapa: string;
    orgao: string;
    prazo_estimado: number; // dias
    documentos_necessarios: string[];
    custo_estimado: number;
  }[];
  
  // Custos estimados
  custos_aprovacao: {
    taxas_municipais: number;
    taxas_estaduais: number;
    taxas_federais: number;
    documentacao: number;
    projetos_complementares: number;
    total_estimado: number;
  };
  
  data_validacao: string;
  valido_ate: string;
  responsavel_validacao: string;
}

export interface IntegracaoMunicipal {
  municipio: string;
  uf: string;
  
  // APIs disponíveis
  apis_disponiveis: {
    zoneamento: boolean;
    codigo_obras: boolean;
    meio_ambiente: boolean;
    patrimonio_historico: boolean;
    cartografia: boolean;
  };
  
  // Configurações de integração
  configuracao: {
    base_url: string;
    api_key?: string;
    endpoints: {
      consulta_zoneamento: string;
      consulta_restricoes: string;
      validacao_projeto: string;
      documentos_necessarios: string;
    };
    rate_limit: number; // requests por minuto
    cache_duration: number; // minutos
  };
  
  // Mapeamento de dados
  mapeamento_campos: {
    zona_campo: string;
    taxa_ocupacao_campo: string;
    coeficiente_campo: string;
    recuos_campo: string;
  };
  
  // Status da integração
  status: 'ativa' | 'inativa' | 'manutencao' | 'erro';
  ultima_sincronizacao: string;
  proxima_atualizacao: string;
}

export interface AnaliseAutomatica {
  id: string;
  briefing_id: string;
  terreno_dados: DadosTerreno;
  
  // Análises realizadas
  analises: {
    viabilidade_basica: {
      score: number;
      fatores_positivos: string[];
      fatores_negativos: string[];
      recomendacoes: string[];
    };
    
    otimizacao_implantacao: {
      orientacao_recomendada: string;
      posicionamento_sugerido: string;
      aproveitamento_terreno: number; // %
      areas_livres_otimizadas: number; // m²
    };
    
    impacto_vizinhanca: {
      nivel_impacto: 'baixo' | 'medio' | 'alto';
      consideracoes: string[];
      medidas_mitigacao: string[];
    };
    
    sustentabilidade: {
      potencial_captacao_agua: boolean;
      orientacao_solar: 'otima' | 'boa' | 'regular' | 'ruim';
      ventilacao_natural: 'otima' | 'boa' | 'regular' | 'ruim';
      eficiencia_energetica: number; // score 0-100
    };
  };
  
  // Alertas e avisos
  alertas: {
    nivel: 'info' | 'atencao' | 'critico';
    categoria: 'legal' | 'tecnico' | 'ambiental' | 'financeiro';
    titulo: string;
    descricao: string;
    acao_recomendada: string;
  }[];
  
  // Documentação gerada
  documentos_gerados: {
    relatorio_viabilidade: string;
    memorial_justificativo: string;
    plantas_situacao: string[];
    analise_zoneamento: string;
  };
  
  data_analise: string;
  tempo_processamento: number; // segundos
  confiabilidade: number; // % de confiança nos dados
}

// Interfaces de serviços
export interface ValidacaoTecnicaService {
  // Consulta de dados municipais
  consultarZoneamento(endereco: string): Promise<ZoneamentoMunicipal>;
  consultarRestricoes(coordenadas: { lat: number; lng: number }): Promise<RestricaoAmbiental[]>;
  
  // Validação de viabilidade
  validarViabilidadeProjeto(terreno: DadosTerreno, projeto: any): Promise<ValidacaoViabilidade>;
  calcularCoeficientes(terreno: DadosTerreno, projeto: any): Promise<any>;
  
  // Análise automática
  executarAnaliseCompleta(briefingId: string, dadosTerreno: DadosTerreno): Promise<AnaliseAutomatica>;
  gerarRecomendacoes(validacao: ValidacaoViabilidade): Promise<string[]>;
  
  // Integração municipal
  configurarIntegracaoMunicipal(municipio: string, config: IntegracaoMunicipal): Promise<void>;
  sincronizarDadosMunicipais(municipio: string): Promise<void>;
  
  // Relatórios e documentação
  gerarRelatorioViabilidade(validacao: ValidacaoViabilidade): Promise<string>;
  exportarAnaliseCompleta(analise: AnaliseAutomatica, formato: 'pdf' | 'docx'): Promise<Blob>;
}

// Configurações e constantes
export const TIPOS_ZONEAMENTO = {
  'ZR1': 'Zona Residencial 1 - Baixa Densidade',
  'ZR2': 'Zona Residencial 2 - Média Densidade',
  'ZR3': 'Zona Residencial 3 - Alta Densidade',
  'ZC1': 'Zona Comercial 1 - Comércio Local',
  'ZC2': 'Zona Comercial 2 - Comércio Geral',
  'ZI1': 'Zona Industrial 1 - Indústria Leve',
  'ZI2': 'Zona Industrial 2 - Indústria Pesada',
  'ZM': 'Zona Mista',
  'ZEP': 'Zona Especial de Preservação'
} as const;

export const NIVEIS_RESTRICAO = {
  'BAIXO': { cor: '#10B981', label: 'Baixo Risco' },
  'MEDIO': { cor: '#F59E0B', label: 'Atenção' },
  'ALTO': { cor: '#EF4444', label: 'Alto Risco' },
  'CRITICO': { cor: '#DC2626', label: 'Crítico' }
} as const;

export const DOCUMENTOS_PADRAO = {
  'RESIDENCIAL': [
    'Planta de situação e localização',
    'Plantas baixas, cortes e fachadas',
    'Memorial descritivo',
    'ART/RRT do responsável técnico',
    'Certidão de uso do solo',
    'Comprovante de propriedade'
  ],
  'COMERCIAL': [
    'Planta de situação e localização',
    'Plantas baixas, cortes e fachadas',
    'Memorial descritivo',
    'ART/RRT do responsável técnico',
    'Certidão de uso do solo',
    'Comprovante de propriedade',
    'Projeto de prevenção contra incêndio',
    'Projeto de acessibilidade'
  ],
  'INDUSTRIAL': [
    'Planta de situação e localização',
    'Plantas baixas, cortes e fachadas',
    'Memorial descritivo',
    'ART/RRT do responsável técnico',
    'Certidão de uso do solo',
    'Comprovante de propriedade',
    'Estudo de impacto ambiental',
    'Projeto de prevenção contra incêndio',
    'Projeto de tratamento de efluentes'
  ]
} as const;

export default ValidacaoTecnicaService; 