// 🏠 MODELO ORÇAMENTO RESIDENCIAL COMPLETO - ARCFLOW
// Baseado em 30+ anos de experiência em escritórios AEC
// Metodologia NBR + Fluxo de Trabalho Profissional

export interface DadosBasicosResidencial {
  // Identificação do Projeto
  nomeCliente: string
  nomeProjeto: string
  endereco: string
  
  // Características Técnicas
  areaConstruida: number // m²
  areaTerreno: number // m²
  numeroPavimentos: number
  numeroQuartos: number
  numeroBanheiros: number
  numeroVagas: number
  
  // Padrão Construtivo
  padraoConstrutivo: 'simples' | 'medio' | 'alto' | 'luxo' | 'premium'
  sistemaConstrutivo: 'convencional' | 'steel_frame' | 'wood_frame' | 'concreto_armado' | 'alvenaria_estrutural'
  
  // Localização (afeta custos)
  regiao: 'norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul'
  cidade: string
  
  // Prazos
  prazoDesejado: number // dias
  dataInicio: string
}

export interface DisciplinaAEC {
  id: string
  nome: string
  descricao: string
  responsavelTecnico: string
  crea_cau: string
  
  // Fases do Projeto (NBR 13531/13532)
  fases: FaseProjeto[]
  
  // Custos
  valorHorasTecnicas: number
  horasEstimadas: number
  valorTotal: number
  
  // Produtos Entregues
  produtos: ProdutoEntregue[]
  
  // Observações Técnicas
  observacoes: string[]
}

export interface FaseProjeto {
  id: string
  nome: string
  sigla: string // LV, EP, AP, PE, AS, DE
  descricao: string
  
  // Atividades Detalhadas
  atividades: AtividadeFase[]
  
  // Prazos
  duracaoDias: number
  dependencias: string[] // IDs de outras fases
  
  // Recursos
  horasTecnicas: number
  horasDesenhista: number
  horasEstagiario: number
  
  // Custos
  valorFase: number
  percentualProjeto: number
}

export interface AtividadeFase {
  id: string
  nome: string
  descricao: string
  responsavel: 'arquiteto' | 'engenheiro' | 'desenhista' | 'estagiario'
  horasEstimadas: number
  produtos: string[] // Pranchas, relatórios, etc.
  observacoes?: string
}

export interface ProdutoEntregue {
  id: string
  nome: string
  formato: 'dwg' | 'pdf' | 'doc' | 'xls' | 'revit' | 'skp'
  escala?: string
  folha?: string // A0, A1, A2, A3, A4
  quantidade: number
  descricao: string
}

// 🏗️ DISCIPLINAS RESIDENCIAIS COMPLETAS
export const DISCIPLINAS_RESIDENCIAL: DisciplinaAEC[] = [
  {
    id: 'arquitetura',
    nome: 'Projeto Arquitetônico',
    descricao: 'Concepção, desenvolvimento e detalhamento do projeto arquitetônico completo',
    responsavelTecnico: 'Arquiteto e Urbanista',
    crea_cau: 'CAU',
    
    fases: [
      {
        id: 'lv_arq',
        nome: 'Levantamento de Dados',
        sigla: 'LV',
        descricao: 'Levantamento topográfico, cadastral, legal e programa de necessidades',
        atividades: [
          {
            id: 'lv_001',
            nome: 'Análise do Terreno',
            descricao: 'Levantamento topográfico, orientação solar, ventos dominantes, vegetação existente',
            responsavel: 'arquiteto',
            horasEstimadas: 8,
            produtos: ['Relatório de Análise do Terreno', 'Levantamento Fotográfico']
          },
          {
            id: 'lv_002',
            nome: 'Análise Legal',
            descricao: 'Código de obras, zoneamento, recuos obrigatórios, coeficientes urbanísticos',
            responsavel: 'arquiteto',
            horasEstimadas: 6,
            produtos: ['Relatório de Viabilidade Legal', 'Quadro de Áreas Permitidas']
          },
          {
            id: 'lv_003',
            nome: 'Programa de Necessidades',
            descricao: 'Definição detalhada dos ambientes, fluxos, relações funcionais',
            responsavel: 'arquiteto',
            horasEstimadas: 4,
            produtos: ['Programa de Necessidades Detalhado', 'Organograma Funcional']
          }
        ],
        duracaoDias: 7,
        dependencias: [],
        horasTecnicas: 18,
        horasDesenhista: 0,
        horasEstagiario: 4,
        valorFase: 0,
        percentualProjeto: 5
      },
      {
        id: 'ep_arq',
        nome: 'Estudo Preliminar',
        sigla: 'EP',
        descricao: 'Concepção e representação do conjunto de informações técnicas iniciais',
        atividades: [
          {
            id: 'ep_001',
            nome: 'Concepção Arquitetônica',
            descricao: 'Desenvolvimento da ideia inicial, volumetria, implantação',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Croquis Conceituais', 'Maquete Volumétrica Digital']
          },
          {
            id: 'ep_002',
            nome: 'Plantas Baixas Preliminares',
            descricao: 'Desenho das plantas baixas com dimensionamento básico',
            responsavel: 'desenhista',
            horasEstimadas: 12,
            produtos: ['Plantas Baixas 1:100', 'Planta de Situação 1:500']
          },
          {
            id: 'ep_003',
            nome: 'Cortes e Fachadas Preliminares',
            descricao: 'Definição volumétrica e estética inicial',
            responsavel: 'desenhista',
            horasEstimadas: 10,
            produtos: ['Cortes Esquemáticos 1:100', 'Fachadas Principais 1:100']
          }
        ],
        duracaoDias: 14,
        dependencias: ['lv_arq'],
        horasTecnicas: 16,
        horasDesenhista: 22,
        horasEstagiario: 8,
        valorFase: 0,
        percentualProjeto: 15
      },
      {
        id: 'ap_arq',
        nome: 'Anteprojeto',
        sigla: 'AP',
        descricao: 'Desenvolvimento do estudo preliminar com definições técnicas',
        atividades: [
          {
            id: 'ap_001',
            nome: 'Plantas Baixas Definitivas',
            descricao: 'Plantas baixas com cotas, áreas, especificações básicas',
            responsavel: 'desenhista',
            horasEstimadas: 20,
            produtos: ['Plantas Baixas Cotadas 1:50', 'Planta de Cobertura 1:100']
          },
          {
            id: 'ap_002',
            nome: 'Cortes e Fachadas Detalhados',
            descricao: 'Cortes com pé-direito, fachadas com materiais definidos',
            responsavel: 'desenhista',
            horasEstimadas: 16,
            produtos: ['Cortes Longitudinais/Transversais 1:50', 'Fachadas Completas 1:50']
          },
          {
            id: 'ap_003',
            nome: 'Memorial Descritivo',
            descricao: 'Descrição técnica dos sistemas construtivos e materiais',
            responsavel: 'arquiteto',
            horasEstimadas: 8,
            produtos: ['Memorial Descritivo Arquitetônico', 'Especificações Técnicas']
          }
        ],
        duracaoDias: 21,
        dependencias: ['ep_arq'],
        horasTecnicas: 8,
        horasDesenhista: 36,
        horasEstagiario: 12,
        valorFase: 0,
        percentualProjeto: 25
      },
      {
        id: 'pe_arq',
        nome: 'Projeto Executivo',
        sigla: 'PE',
        descricao: 'Projeto completo para execução da obra',
        atividades: [
          {
            id: 'pe_001',
            nome: 'Plantas Executivas',
            descricao: 'Plantas baixas executivas com todos os detalhes construtivos',
            responsavel: 'desenhista',
            horasEstimadas: 32,
            produtos: ['Plantas Baixas Executivas 1:50', 'Plantas de Piso/Forro 1:50']
          },
          {
            id: 'pe_002',
            nome: 'Detalhes Construtivos',
            descricao: 'Detalhes de esquadrias, escadas, elementos especiais',
            responsavel: 'desenhista',
            horasEstimadas: 24,
            produtos: ['Detalhes Construtivos 1:20/1:10', 'Detalhes de Esquadrias 1:20']
          },
          {
            id: 'pe_003',
            nome: 'Especificações Técnicas',
            descricao: 'Memorial descritivo completo e especificações de materiais',
            responsavel: 'arquiteto',
            horasEstimadas: 12,
            produtos: ['Memorial Descritivo Executivo', 'Caderno de Especificações']
          }
        ],
        duracaoDias: 28,
        dependencias: ['ap_arq'],
        horasTecnicas: 12,
        horasDesenhista: 56,
        horasEstagiario: 16,
        valorFase: 0,
        percentualProjeto: 35
      },
      {
        id: 'as_arq',
        nome: 'Assistência à Execução',
        sigla: 'AS',
        descricao: 'Acompanhamento técnico durante a execução da obra',
        atividades: [
          {
            id: 'as_001',
            nome: 'Visitas Técnicas',
            descricao: 'Acompanhamento quinzenal da execução da obra',
            responsavel: 'arquiteto',
            horasEstimadas: 40,
            produtos: ['Relatórios de Visita', 'Registro Fotográfico']
          },
          {
            id: 'as_002',
            nome: 'Esclarecimentos Técnicos',
            descricao: 'Solução de dúvidas e adequações durante a obra',
            responsavel: 'arquiteto',
            horasEstimadas: 16,
            produtos: ['Detalhes Complementares', 'Especificações Adicionais']
          }
        ],
        duracaoDias: 180, // Durante toda a obra
        dependencias: ['pe_arq'],
        horasTecnicas: 56,
        horasDesenhista: 8,
        horasEstagiario: 0,
        valorFase: 0,
        percentualProjeto: 20
      }
    ],
    
    valorHorasTecnicas: 150,
    horasEstimadas: 110,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'arq_001',
        nome: 'Plantas Baixas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 3,
        descricao: 'Plantas baixas de todos os pavimentos'
      },
      {
        id: 'arq_002',
        nome: 'Cortes',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 2,
        descricao: 'Cortes longitudinal e transversal'
      },
      {
        id: 'arq_003',
        nome: 'Fachadas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 4,
        descricao: 'Todas as fachadas do projeto'
      }
    ],
    
    observacoes: [
      'Projeto desenvolvido conforme NBR 13532',
      'Responsável técnico com ART/RRT',
      'Compatibilização com projetos complementares incluída'
    ]
  },
  
  {
    id: 'estrutural',
    nome: 'Projeto Estrutural',
    descricao: 'Dimensionamento e detalhamento da estrutura em concreto armado',
    responsavelTecnico: 'Engenheiro Civil',
    crea_cau: 'CREA',
    
    fases: [
      {
        id: 'lv_est',
        nome: 'Levantamento Estrutural',
        sigla: 'LV',
        descricao: 'Análise das cargas e definição do sistema estrutural',
        atividades: [
          {
            id: 'lv_est_001',
            nome: 'Análise Arquitetônica',
            descricao: 'Estudo da arquitetura para definição da estrutura',
            responsavel: 'engenheiro',
            horasEstimadas: 6,
            produtos: ['Relatório de Análise Estrutural']
          },
          {
            id: 'lv_est_002',
            nome: 'Sondagem do Solo',
            descricao: 'Análise das características do solo para fundações',
            responsavel: 'engenheiro',
            horasEstimadas: 4,
            produtos: ['Relatório de Sondagem', 'Recomendações de Fundação']
          }
        ],
        duracaoDias: 5,
        dependencias: ['ap_arq'],
        horasTecnicas: 10,
        horasDesenhista: 0,
        horasEstagiario: 2,
        valorFase: 0,
        percentualProjeto: 10
      },
      {
        id: 'pe_est',
        nome: 'Projeto Estrutural Executivo',
        sigla: 'PE',
        descricao: 'Dimensionamento e detalhamento completo da estrutura',
        atividades: [
          {
            id: 'pe_est_001',
            nome: 'Cálculo Estrutural',
            descricao: 'Dimensionamento de vigas, pilares, lajes e fundações',
            responsavel: 'engenheiro',
            horasEstimadas: 32,
            produtos: ['Memorial de Cálculo', 'Planilhas de Dimensionamento']
          },
          {
            id: 'pe_est_002',
            nome: 'Plantas de Formas',
            descricao: 'Plantas com locação e dimensões dos elementos estruturais',
            responsavel: 'desenhista',
            horasEstimadas: 20,
            produtos: ['Plantas de Formas 1:50', 'Detalhes de Fundação 1:25']
          },
          {
            id: 'pe_est_003',
            nome: 'Plantas de Armação',
            descricao: 'Detalhamento das armaduras de todos os elementos',
            responsavel: 'desenhista',
            horasEstimadas: 28,
            produtos: ['Plantas de Armação 1:50', 'Detalhes de Armação 1:20']
          }
        ],
        duracaoDias: 21,
        dependencias: ['lv_est'],
        horasTecnicas: 32,
        horasDesenhista: 48,
        horasEstagiario: 8,
        valorFase: 0,
        percentualProjeto: 90
      }
    ],
    
    valorHorasTecnicas: 180,
    horasEstimadas: 88,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'est_001',
        nome: 'Plantas de Formas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 3,
        descricao: 'Formas de fundação, pilares, vigas e lajes'
      },
      {
        id: 'est_002',
        nome: 'Plantas de Armação',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 6,
        descricao: 'Detalhamento completo das armaduras'
      }
    ],
    
    observacoes: [
      'Cálculo conforme NBR 6118 (Concreto Armado)',
      'Fundações dimensionadas conforme sondagem',
      'ART de projeto e execução incluídas'
    ]
  },
  
  {
    id: 'instalacoes_hidraulicas',
    nome: 'Instalações Hidráulicas',
    descricao: 'Projeto de água fria, água quente e sistema de incêndio',
    responsavelTecnico: 'Engenheiro Civil/Mecânico',
    crea_cau: 'CREA',
    
    fases: [
      {
        id: 'pe_hid',
        nome: 'Projeto Hidráulico Executivo',
        sigla: 'PE',
        descricao: 'Dimensionamento completo das instalações hidráulicas',
        atividades: [
          {
            id: 'pe_hid_001',
            nome: 'Sistema de Água Fria',
            descricao: 'Dimensionamento da rede de distribuição de água fria',
            responsavel: 'engenheiro',
            horasEstimadas: 16,
            produtos: ['Plantas Hidráulicas 1:50', 'Isométricos', 'Memorial de Cálculo']
          },
          {
            id: 'pe_hid_002',
            nome: 'Sistema de Água Quente',
            descricao: 'Projeto do sistema de aquecimento solar/elétrico',
            responsavel: 'engenheiro',
            horasEstimadas: 12,
            produtos: ['Plantas de Água Quente 1:50', 'Detalhes de Instalação']
          },
          {
            id: 'pe_hid_003',
            nome: 'Sistema de Incêndio',
            descricao: 'Projeto preventivo contra incêndio (se aplicável)',
            responsavel: 'engenheiro',
            horasEstimadas: 8,
            produtos: ['Plantas de Incêndio 1:100', 'Memorial Descritivo']
          }
        ],
        duracaoDias: 14,
        dependencias: ['ap_arq'],
        horasTecnicas: 36,
        horasDesenhista: 16,
        horasEstagiario: 4,
        valorFase: 0,
        percentualProjeto: 100
      }
    ],
    
    valorHorasTecnicas: 160,
    horasEstimadas: 56,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'hid_001',
        nome: 'Plantas Hidráulicas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 3,
        descricao: 'Água fria, quente e incêndio'
      }
    ],
    
    observacoes: [
      'Projeto conforme NBR 5626 (Água Fria)',
      'Sistema de aquecimento solar dimensionado',
      'Compatibilização com estrutura e arquitetura'
    ]
  },
  
  {
    id: 'instalacoes_eletricas',
    nome: 'Instalações Elétricas',
    descricao: 'Projeto elétrico completo com automação básica',
    responsavelTecnico: 'Engenheiro Eletricista',
    crea_cau: 'CREA',
    
    fases: [
      {
        id: 'pe_ele',
        nome: 'Projeto Elétrico Executivo',
        sigla: 'PE',
        descricao: 'Dimensionamento completo das instalações elétricas',
        atividades: [
          {
            id: 'pe_ele_001',
            nome: 'Dimensionamento da Carga',
            descricao: 'Cálculo da demanda e dimensionamento do padrão',
            responsavel: 'engenheiro',
            horasEstimadas: 8,
            produtos: ['Memorial de Cálculo Elétrico', 'Quadro de Cargas']
          },
          {
            id: 'pe_ele_002',
            nome: 'Plantas Elétricas',
            descricao: 'Plantas com pontos elétricos e circuitos',
            responsavel: 'desenhista',
            horasEstimadas: 20,
            produtos: ['Plantas Elétricas 1:50', 'Diagrama Unifilar']
          },
          {
            id: 'pe_ele_003',
            nome: 'Sistema de Automação',
            descricao: 'Projeto básico de automação residencial',
            responsavel: 'engenheiro',
            horasEstimadas: 12,
            produtos: ['Plantas de Automação 1:50', 'Lista de Materiais']
          }
        ],
        duracaoDias: 12,
        dependencias: ['ap_arq'],
        horasTecnicas: 20,
        horasDesenhista: 20,
        horasEstagiario: 4,
        valorFase: 0,
        percentualProjeto: 100
      }
    ],
    
    valorHorasTecnicas: 170,
    horasEstimadas: 44,
    valorTotal: 0,
    
    produtos: [
      {
        id: 'ele_001',
        nome: 'Plantas Elétricas',
        formato: 'dwg',
        escala: '1:50',
        folha: 'A1',
        quantidade: 3,
        descricao: 'Pontos elétricos e circuitos'
      }
    ],
    
    observacoes: [
      'Projeto conforme NBR 5410',
      'Padrão de entrada dimensionado conforme concessionária',
      'Sistema de automação básica incluído'
    ]
  }
]

// 💰 COMPOSIÇÃO DE CUSTOS RESIDENCIAL
export interface ComposicaoCustosResidencial {
  // Custos Diretos
  custosHorasTecnicas: {
    arquiteto: { horas: number; valorHora: number; total: number }
    engenheiro: { horas: number; valorHora: number; total: number }
    desenhista: { horas: number; valorHora: number; total: number }
    estagiario: { horas: number; valorHora: number; total: number }
  }
  
  // Custos Indiretos
  custosIndiretos: {
    impressoes: number
    plotagens: number
    transportes: number
    comunicacao: number
    software: number
    equipamentos: number
    overhead: number // % sobre custos diretos
  }
  
  // Impostos e Taxas
  impostos: {
    iss: number // %
    pis: number // %
    cofins: number // %
    ir: number // %
    csll: number // %
  }
  
  // Margem de Lucro
  margemLucro: number // %
  
  // Totais
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

// 📅 CRONOGRAMA FÍSICO-FINANCEIRO
export interface CronogramaResidencial {
  fases: FaseCronograma[]
  resumo: {
    duracaoTotal: number // dias
    valorTotal: number
    distribuicaoFinanceira: { fase: string; percentual: number; valor: number }[]
  }
}

export interface FaseCronograma {
  id: string
  nome: string
  disciplinas: string[]
  dataInicio: string
  dataFim: string
  duracaoDias: number
  percentualFisico: number
  percentualFinanceiro: number
  valor: number
  status: 'nao_iniciado' | 'em_andamento' | 'concluido'
  dependencias: string[]
}

// 📋 MEMORIAL DESCRITIVO COMPLETO
export interface MemorialDescritivoResidencial {
  introducao: string
  objetivos: string[]
  metodologia: string
  disciplinas: MemorialDisciplina[]
  cronograma: string
  responsabilidades: string
  observacoes: string[]
  anexos: string[]
}

export interface MemorialDisciplina {
  nome: string
  objetivo: string
  escopo: string[]
  metodologia: string
  produtos: string[]
  normasAplicaveis: string[]
  responsavelTecnico: string
}

// 🎯 MODELO COMPLETO RESIDENCIAL
export interface OrcamentoResidencialCompleto {
  // Dados Básicos
  dadosBasicos: DadosBasicosResidencial
  
  // Disciplinas
  disciplinas: DisciplinaAEC[]
  
  // Composição de Custos
  composicaoCustos: ComposicaoCustosResidencial
  
  // Cronograma
  cronograma: CronogramaResidencial
  
  // Memorial Descritivo
  memorial: MemorialDescritivoResidencial
  
  // Metadados
  versao: string
  dataGeracao: string
  validadeOrcamento: number // dias
  observacoesGerais: string[]
} 