// 🏢 MODELO ORÇAMENTO COMERCIAL COMPLETO - ARCFLOW
// Baseado em 30+ anos de experiência em escritórios AEC
// Metodologia NBR + Fluxo de Trabalho Profissional para Projetos Comerciais

export interface DadosBasicosComercial {
  // Identificação do Projeto
  nomeCliente: string
  nomeProjeto: string
  endereco: string
  
  // Características Técnicas
  areaConstruida: number // m²
  areaTerreno: number // m²
  numeroPavimentos: number
  peDirecto: number // metros
  numeroVagas: number
  
  // Tipologia Comercial
  tipologiaComercial: 'escritorio' | 'loja' | 'restaurante' | 'clinica' | 'escola' | 'industria' | 'hotel' | 'shopping'
  padraoConstrutivo: 'simples' | 'medio' | 'alto' | 'corporativo' | 'premium'
  sistemaConstrutivo: 'convencional' | 'steel_frame' | 'concreto_armado' | 'alvenaria_estrutural' | 'pre_moldado'
  
  // Características Específicas
  capacidadePessoas: number
  numeroSalas: number
  numeroSanitarios: number
  necessidadeElevador: boolean
  necessidadeAr: boolean
  necessidadeIncendio: boolean
  
  // Localização (afeta custos)
  regiao: 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul'
  cidade: string
  
  // Prazos
  prazoDesejado: number // dias
  dataInicio: string
}

// 🏗️ DISCIPLINAS COMERCIAIS COMPLETAS
export const DISCIPLINAS_COMERCIAL = [
  {
    id: 'arquitetura_comercial',
    nome: 'Projeto Arquitetônico Comercial',
    descricao: 'Concepção e desenvolvimento de projeto arquitetônico para uso comercial',
    responsavelTecnico: 'Arquiteto e Urbanista',
    crea_cau: 'CAU',
    
    fases: [
      {
        id: 'lv_arq_com',
        nome: 'Levantamento e Análise Comercial',
        sigla: 'LV',
        descricao: 'Levantamento específico para projetos comerciais',
        atividades: [
          {
            id: 'lv_com_001',
            nome: 'Análise do Negócio',
            descricao: 'Estudo do tipo de negócio, fluxo de clientes, necessidades específicas',
            responsavel: 'arquiteto',
            horasEstimadas: 12,
            produtos: ['Relatório de Análise do Negócio', 'Estudo de Fluxos']
          },
          {
            id: 'lv_com_002',
            nome: 'Análise Legal Comercial',
            descricao: 'Código de obras, bombeiros, vigilância sanitária, acessibilidade',
            responsavel: 'arquiteto',
            horasEstimadas: 10,
            produtos: ['Relatório de Viabilidade Legal', 'Check-list de Aprovações']
          },
          {
            id: 'lv_com_003',
            nome: 'Programa Funcional',
            descricao: 'Definição de ambientes, dimensionamentos, fluxos operacionais',
            responsavel: 'arquiteto',
            horasEstimadas: 8,
            produtos: ['Programa Funcional Detalhado', 'Fluxograma Operacional']
          }
        ],
        duracaoDias: 10,
        dependencias: [],
        horasTecnicas: 30,
        horasDesenhista: 0,
        horasEstagiario: 6,
        valorFase: 0,
        percentualProjeto: 8
      },
      {
        id: 'ep_arq_com',
        nome: 'Estudo Preliminar Comercial',
        sigla: 'EP',
        descricao: 'Concepção inicial adaptada ao uso comercial',
        atividades: [
          {
            id: 'ep_com_001',
            nome: 'Layout Funcional',
            descricao: 'Desenvolvimento do layout otimizado para o negócio',
            responsavel: 'arquiteto',
            horasEstimadas: 20,
            produtos: ['Plantas de Layout 1:100', 'Estudo de Mobiliário']
          },
          {
            id: 'ep_com_002',
            nome: 'Fachada Comercial',
            descricao: 'Desenvolvimento da identidade visual da fachada',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Estudos de Fachada', 'Painel de Materiais']
          },
          {
            id: 'ep_com_003',
            nome: 'Acessibilidade',
            descricao: 'Adequação às normas de acessibilidade NBR 9050',
            responsavel: 'arquiteto',
            horasEstimadas: 8,
            produtos: ['Plantas de Acessibilidade', 'Memorial de Acessibilidade']
          }
        ],
        duracaoDias: 18,
        dependencias: ['lv_arq_com'],
        horasTecnicas: 44,
        horasDesenhista: 20,
        horasEstagiario: 10,
        valorFase: 0,
        percentualProjeto: 18
      },
      {
        id: 'ap_arq_com',
        nome: 'Anteprojeto Comercial',
        sigla: 'AP',
        descricao: 'Desenvolvimento técnico para aprovações',
        atividades: [
          {
            id: 'ap_com_001',
            nome: 'Projeto para Prefeitura',
            descricao: 'Adequação às exigências municipais',
            responsavel: 'desenhista',
            horasEstimadas: 24,
            produtos: ['Plantas para Aprovação 1:50', 'Quadro de Áreas']
          },
          {
            id: 'ap_com_002',
            nome: 'Projeto para Bombeiros',
            descricao: 'Adequação às normas de segurança contra incêndio',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Plantas de Segurança 1:100', 'Memorial de Segurança']
          },
          {
            id: 'ap_com_003',
            nome: 'Projeto para Vigilância Sanitária',
            descricao: 'Adequação às normas sanitárias (se aplicável)',
            responsavel: 'arquiteto',
            horasEstimadas: 12,
            produtos: ['Plantas Sanitárias', 'Memorial Sanitário']
          }
        ],
        duracaoDias: 25,
        dependencias: ['ep_arq_com'],
        horasTecnicas: 28,
        horasDesenhista: 36,
        horasEstagiario: 12,
        valorFase: 0,
        percentualProjeto: 28
      },
      {
        id: 'pe_arq_com',
        nome: 'Projeto Executivo Comercial',
        sigla: 'PE',
        descricao: 'Projeto completo para execução',
        atividades: [
          {
            id: 'pe_com_001',
            nome: 'Plantas Executivas Comerciais',
            descricao: 'Plantas executivas com todos os detalhes comerciais',
            responsavel: 'desenhista',
            horasEstimadas: 40,
            produtos: ['Plantas Executivas 1:50', 'Plantas de Forro 1:50']
          },
          {
            id: 'pe_com_002',
            nome: 'Detalhes Comerciais',
            descricao: 'Detalhes específicos para uso comercial',
            responsavel: 'desenhista',
            horasEstimadas: 32,
            produtos: ['Detalhes de Balcões 1:20', 'Detalhes de Vitrines 1:10']
          },
          {
            id: 'pe_com_003',
            nome: 'Especificações Comerciais',
            descricao: 'Especificações técnicas para uso comercial',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Memorial Executivo', 'Caderno de Especificações']
          }
        ],
        duracaoDias: 35,
        dependencias: ['ap_arq_com'],
        horasTecnicas: 16,
        horasDesenhista: 72,
        horasEstagiario: 20,
        valorFase: 0,
        percentualProjeto: 36
      },
      {
        id: 'as_arq_com',
        nome: 'Assistência Técnica Comercial',
        sigla: 'AS',
        descricao: 'Acompanhamento especializado para obras comerciais',
        atividades: [
          {
            id: 'as_com_001',
            nome: 'Acompanhamento de Obra',
            descricao: 'Visitas técnicas especializadas em projetos comerciais',
            responsavel: 'arquiteto',
            horasEstimadas: 48,
            produtos: ['Relatórios Técnicos', 'Controle de Qualidade']
          },
          {
            id: 'as_com_002',
            nome: 'Adequações Durante Obra',
            descricao: 'Ajustes necessários durante a execução',
            responsavel: 'arquiteto',
            horasEstimadas: 20,
            produtos: ['Detalhes Complementares', 'Revisões de Projeto']
          }
        ],
        duracaoDias: 120,
        dependencias: ['pe_arq_com'],
        horasTecnicas: 68,
        horasDesenhista: 12,
        horasEstagiario: 0,
        valorFase: 0,
        percentualProjeto: 10
      }
    ],
    
    valorHorasTecnicas: 160,
    horasEstimadas: 186,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'arq_com_001',
        nome: 'Plantas Comerciais Completas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 6,
        descricao: 'Todas as plantas do projeto comercial'
      },
      {
        id: 'arq_com_002',
        nome: 'Projeto de Aprovação',
        formato: 'pdf',
        escala: '1:100',
        folha: 'A1',
        quantidade: 1,
        descricao: 'Projeto formatado para aprovação municipal'
      }
    ],
    
    observacoes: [
      'Projeto adequado às normas comerciais vigentes',
      'Acessibilidade conforme NBR 9050',
      'Segurança contra incêndio conforme IT do Corpo de Bombeiros'
    ]
  },
  
  {
    id: 'estrutural_comercial',
    nome: 'Projeto Estrutural Comercial',
    descricao: 'Estrutura dimensionada para cargas comerciais',
    responsavelTecnico: 'Engenheiro Civil',
    crea_cau: 'CREA',
    
    fases: [
      {
        id: 'lv_est_com',
        nome: 'Análise Estrutural Comercial',
        sigla: 'LV',
        descricao: 'Análise específica para estruturas comerciais',
        atividades: [
          {
            id: 'lv_est_com_001',
            nome: 'Análise de Cargas Comerciais',
            descricao: 'Estudo das cargas específicas do uso comercial',
            responsavel: 'engenheiro',
            horasEstimadas: 10,
            produtos: ['Relatório de Cargas', 'Análise de Sobrecargas']
          },
          {
            id: 'lv_est_com_002',
            nome: 'Sistema Estrutural Comercial',
            descricao: 'Definição do sistema estrutural mais adequado',
            responsavel: 'engenheiro',
            horasEstimadas: 8,
            produtos: ['Concepção Estrutural', 'Análise de Viabilidade']
          }
        ],
        duracaoDias: 7,
        dependencias: ['ap_arq_com'],
        horasTecnicas: 18,
        horasDesenhista: 0,
        horasEstagiario: 4,
        valorFase: 0,
        percentualProjeto: 15
      },
      {
        id: 'pe_est_com',
        nome: 'Projeto Estrutural Executivo Comercial',
        sigla: 'PE',
        descricao: 'Dimensionamento completo para uso comercial',
        atividades: [
          {
            id: 'pe_est_com_001',
            nome: 'Cálculo Estrutural Comercial',
            descricao: 'Dimensionamento considerando cargas comerciais',
            responsavel: 'engenheiro',
            horasEstimadas: 45,
            produtos: ['Memorial de Cálculo Comercial', 'Análise Dinâmica']
          },
          {
            id: 'pe_est_com_002',
            nome: 'Plantas Estruturais Comerciais',
            descricao: 'Plantas adaptadas às necessidades comerciais',
            responsavel: 'desenhista',
            horasEstimadas: 35,
            produtos: ['Plantas de Formas 1:50', 'Detalhes Especiais 1:20']
          }
        ],
        duracaoDias: 28,
        dependencias: ['lv_est_com'],
        horasTecnicas: 45,
        horasDesenhista: 35,
        horasEstagiario: 10,
        valorFase: 0,
        percentualProjeto: 85
      }
    ],
    
    valorHorasTecnicas: 190,
    horasEstimadas: 112,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'est_com_001',
        nome: 'Projeto Estrutural Comercial Completo',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 8,
        descricao: 'Formas, armações e detalhes estruturais'
      }
    ],
    
    observacoes: [
      'Estrutura dimensionada para cargas comerciais NBR 6120',
      'Consideradas sobrecargas de equipamentos',
      'Análise de vibrações quando necessária'
    ]
  },
  
  {
    id: 'instalacoes_comerciais',
    nome: 'Instalações Prediais Comerciais',
    descricao: 'Instalações completas para uso comercial',
    responsavelTecnico: 'Engenheiro Civil/Mecânico',
    crea_cau: 'CREA',
    
    fases: [
      {
        id: 'pe_inst_com',
        nome: 'Instalações Comerciais Executivas',
        sigla: 'PE',
        descricao: 'Todas as instalações para uso comercial',
        atividades: [
          {
            id: 'pe_inst_com_001',
            nome: 'Hidráulicas Comerciais',
            descricao: 'Sistema hidráulico dimensionado para uso comercial',
            responsavel: 'engenheiro',
            horasEstimadas: 24,
            produtos: ['Plantas Hidráulicas Comerciais 1:50', 'Sistema de Incêndio']
          },
          {
            id: 'pe_inst_com_002',
            nome: 'Elétricas Comerciais',
            descricao: 'Sistema elétrico para cargas comerciais',
            responsavel: 'engenheiro',
            horasEstimadas: 28,
            produtos: ['Plantas Elétricas Comerciais 1:50', 'Quadros de Distribuição']
          },
          {
            id: 'pe_inst_com_003',
            nome: 'Ar Condicionado',
            descricao: 'Sistema de climatização comercial',
            responsavel: 'engenheiro',
            horasEstimadas: 32,
            produtos: ['Plantas de Ar Condicionado 1:50', 'Memorial de Cálculo Térmico']
          },
          {
            id: 'pe_inst_com_004',
            nome: 'Sistema de Segurança',
            descricao: 'CFTV, alarme e controle de acesso',
            responsavel: 'engenheiro',
            horasEstimadas: 20,
            produtos: ['Plantas de Segurança 1:100', 'Especificações de Equipamentos']
          }
        ],
        duracaoDias: 35,
        dependencias: ['ap_arq_com'],
        horasTecnicas: 104,
        horasDesenhista: 40,
        horasEstagiario: 12,
        valorFase: 0,
        percentualProjeto: 100
      }
    ],
    
    valorHorasTecnicas: 175,
    horasEstimadas: 156,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'inst_com_001',
        nome: 'Instalações Comerciais Completas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 12,
        descricao: 'Hidráulicas, elétricas, ar condicionado e segurança'
      }
    ],
    
    observacoes: [
      'Instalações dimensionadas para uso comercial intensivo',
      'Sistema de incêndio conforme IT-CB',
      'Ar condicionado com eficiência energética A'
    ]
  },
  
  {
    id: 'interiores_comercial',
    nome: 'Design de Interiores Comercial',
    descricao: 'Projeto de interiores focado na experiência do cliente',
    responsavelTecnico: 'Arquiteto e Urbanista / Designer',
    crea_cau: 'CAU',
    
    fases: [
      {
        id: 'pe_int_com',
        nome: 'Projeto de Interiores Comercial',
        sigla: 'PE',
        descricao: 'Design completo dos ambientes comerciais',
        atividades: [
          {
            id: 'pe_int_com_001',
            nome: 'Conceito e Identidade',
            descricao: 'Desenvolvimento do conceito visual da marca',
            responsavel: 'arquiteto',
            horasEstimadas: 20,
            produtos: ['Painel Conceitual', 'Paleta de Cores', 'Mood Board']
          },
          {
            id: 'pe_int_com_002',
            nome: 'Layout de Mobiliário',
            descricao: 'Projeto detalhado do mobiliário comercial',
            responsavel: 'desenhista',
            horasEstimadas: 28,
            produtos: ['Plantas de Mobiliário 1:50', 'Detalhes de Mobiliário 1:20']
          },
          {
            id: 'pe_int_com_003',
            nome: 'Projeto Luminotécnico',
            descricao: 'Iluminação focada na experiência comercial',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Plantas de Iluminação 1:50', 'Especificações Luminárias']
          }
        ],
        duracaoDias: 21,
        dependencias: ['ap_arq_com'],
        horasTecnicas: 36,
        horasDesenhista: 28,
        horasEstagiario: 8,
        valorFase: 0,
        percentualProjeto: 100
      }
    ],
    
    valorHorasTecnicas: 140,
    horasEstimadas: 72,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'int_com_001',
        nome: 'Projeto de Interiores Comercial',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 6,
        descricao: 'Mobiliário, iluminação e acabamentos'
      }
    ],
    
    observacoes: [
      'Design focado na experiência do cliente',
      'Materiais de alta durabilidade para uso comercial',
      'Iluminação com eficiência energética'
    ]
  }
]

// 💰 COMPOSIÇÃO DE CUSTOS COMERCIAL (valores mais altos devido à complexidade)
export interface ComposicaoCustosComercial {
  custosHorasTecnicas: {
    arquiteto: { horas: number; valorHora: number; total: number }
    engenheiro: { horas: number; valorHora: number; total: number }
    desenhista: { horas: number; valorHora: number; total: number }
    estagiario: { horas: number; valorHora: number; total: number }
  }
  
  custosIndiretos: {
    impressoes: number
    plotagens: number
    transportes: number
    comunicacao: number
    software: number
    equipamentos: number
    aprovacoes: number // Taxas de aprovação em órgãos
    consultoria: number // Consultorias especializadas
    overhead: number
  }
  
  impostos: {
    iss: number
    pis: number
    cofins: number
    ir: number
    csll: number
  }
  
  margemLucro: number
  
  resumoFinanceiro: {
    custosDirectos: number
    custosIndiretos: number
    subtotal: number
    impostos: number
    margemLucro: number
    valorTotal: number
    valorPorM2: number
  }
}

// 📋 MEMORIAL DESCRITIVO COMERCIAL
export interface MemorialDescritivoComercial {
  introducao: string
  caracteristicasNegocio: string
  objetivosProjeto: string[]
  metodologiaComercial: string
  disciplinasComerciais: {
    nome: string
    objetivoComercial: string
    escopoComercial: string[]
    metodologiaEspecifica: string
    produtosComerciais: string[]
    normasComerciais: string[]
  }[]
  cronogramaComercial: string
  aprovacoesNecessarias: string[]
  responsabilidadesComerciais: string
  observacoesComerciais: string[]
}

// 🎯 MODELO COMPLETO COMERCIAL
export interface OrcamentoComercialCompleto {
  dadosBasicos: DadosBasicosComercial
  disciplinas: typeof DISCIPLINAS_COMERCIAL
  composicaoCustos: ComposicaoCustosComercial
  cronograma: any // Similar ao residencial, adaptado
  memorial: MemorialDescritivoComercial
  versao: string
  dataGeracao: string
  validadeOrcamento: number
  observacoesGerais: string[]
} 