/**
 * 🎯 TIPOS PARA SISTEMA DE DISCIPLINAS DINÂMICAS
 * Estrutura robusta e escalável para gerenciamento de disciplinas
 */

export interface Disciplina {
  id: string;
  codigo: string; // 'ARQUITETURA', 'ESTRUTURAL', etc.
  nome: string;
  descricao: string;
  categoria: 'ESSENCIAL' | 'COMPLEMENTAR' | 'ESPECIALIZADA';
  dependencias?: string[]; // disciplinas que dependem desta
  incompatibilidades?: string[]; // disciplinas incompatíveis
  valorBase: number;
  horasBase: number;
  ativa: boolean;
  ordem: number;
  icone?: string;
}

export interface DisciplinaConfig {
  ativa: boolean;
  valorPersonalizado?: number;
  prazoPersonalizado?: number;
  observacoes?: string;
  multiplicadorComplexidade?: number;
}

export interface ConfiguracaoOrcamento {
  id: string;
  escritorioId: string;
  disciplinasAtivas: string[]; // array de códigos das disciplinas ativas
  configuracoesPorDisciplina: Record<string, DisciplinaConfig>;
  updatedAt: string;
  versao: string;
}

export interface FaseCronograma {
  id: string;
  ordem: number;
  etapa: string;
  nome: string;
  prazo: number;
  valor: number;
  percentual: number;
  disciplinas: string[];
  responsavel: string;
  entregaveis: string[];
  observacoes?: string;
  ativa: boolean; // se a fase está ativa baseado nas disciplinas
  disciplinasAtivasNaFase: Disciplina[];
}

export interface CalculoOrcamento {
  valorTotal: number;
  valorPorDisciplina: Record<string, number>;
  cronograma: FaseCronograma[];
  prazoTotal: number;
  disciplinasAtivas: string[];
  estatisticas: {
    totalFases: number;
    totalEntregaveis: number;
    fasesAtivas: number;
    disciplinasCount: number;
  };
}

// Disciplinas padrão do sistema
// Mapeamento detalhado de entregáveis por disciplina e fase
export const ENTREGAVEIS_POR_DISCIPLINA: Record<string, Record<string, string[]>> = {
  'ARQUITETURA': {
    'LV_LEVANTAMENTO': [
      'Levantamento topográfico georreferenciado',
      'Cadastro técnico da edificação existente',
      'Levantamento de dados climáticos e orientação solar'
    ],
    'PN_PROGRAMA': [
      'Programa arquitetônico detalhado',
      'Organograma funcional',
      'Fluxograma de atividades'
    ],
    'EV_VIABILIDADE': [
      'Estudo de massa arquitetônico (volumetria, implantação, ocupação do solo)',
      'Análise de viabilidade legal e urbanística conforme o plano diretor e legislação local',
      'Pré-dimensionamento estrutural e avaliação da solução técnica adotada',
      'Análise de custos preliminar com base em índices e benchmarking',
      'Relatório de viabilidade técnica, econômica e operacional',
      'Avaliação de impacto ambiental preliminar (quando aplicável)',
      'Matriz de riscos iniciais e proposição de soluções ou mitigação'
    ],
    'EP_PRELIMINAR': [
      'Plantas baixas preliminares',
      'Cortes e fachadas principais',
      'Implantação e locação',
      'Memorial justificativo'
    ],
    'AP_ANTEPROJETO': [
      'Plantas baixas definitivas cotadas',
      'Cortes e fachadas detalhadas',
      'Planta de cobertura',
      'Detalhes construtivos básicos'
    ],
    'PL_LEGAL': [
      'Plantas para aprovação legal',
      'Memorial descritivo conforme legislação',
      'Quadro de áreas NBR 13531',
      'Documentação para prefeitura'
    ],
    'PB_BASICO': [
      'Projeto arquitetônico básico completo',
      'Definição de materiais e acabamentos',
      'Indicação de acessos e fluxos'
    ],
    'PE_EXECUTIVO': [
      'Projeto arquitetônico executivo completo',
      'Detalhamentos construtivos em escala apropriada',
      'Paginações e acabamentos detalhados'
    ]
  },
  'MODELAGEM_3D': {
    'EP_PRELIMINAR': [
      'Maquete eletrônica volumétrica',
      '2 renderizações conceituais'
    ],
    'AP_ANTEPROJETO': [
      'Modelagem 3D detalhada',
      '4 renderizações fotorrealísticas',
      'Vistas aéreas do projeto'
    ],
    'PE_EXECUTIVO': [
      'Modelo 3D executivo completo',
      '6 renderizações finais de alta qualidade',
      'Tour virtual 360°'
    ]
  },
  'APROVACAO_LEGAL': {
    'EV_VIABILIDADE': [
      'Análise preliminar da legislação urbanística aplicável',
      'Verificação de parâmetros de ocupação do solo',
      'Consulta prévia aos órgãos competentes'
    ],
    'PL_LEGAL': [
      'Projeto legal conforme código de obras',
      'Memorial descritivo para aprovação',
      'Formulários e documentação oficial',
      'ART/RRT de responsabilidade técnica',
      'Acompanhamento do processo de aprovação'
    ],
    'PB_BASICO': [
      'Alvará de construção aprovado',
      'Certidões e licenças necessárias',
      'Documentação para início da obra'
    ]
  },
  'ESTRUTURAL': {
    'EV_VIABILIDADE': [
      'Análise preliminar do sistema estrutural',
      'Avaliação de viabilidade técnica da solução estrutural',
      'Estimativa de custos estruturais'
    ],
    'AP_ANTEPROJETO': [
      'Lançamento estrutural (pilares, vigas, lajes)',
      'Pré-dimensionamento dos elementos',
      'Compatibilização com arquitetura'
    ],
    'PB_BASICO': [
      'Projeto estrutural básico',
      'Dimensionamento preliminar',
      'Memorial de cálculo básico'
    ],
    'PE_EXECUTIVO': [
      'Projeto estrutural executivo completo',
      'Detalhamento de armaduras',
      'Projeto de fundações detalhado',
      'Memorial de cálculo completo',
      'Especificações de materiais estruturais'
    ]
  },
  'INSTALACOES': {
    'AP_ANTEPROJETO': [
      'Esquema vertical elétrico e hidráulico',
      'Pontos principais de instalações',
      'Compatibilização com estrutura'
    ],
    'PB_BASICO': [
      'Projeto elétrico básico',
      'Projeto hidrossanitário básico',
      'Dimensionamento de quadros e reservatórios'
    ],
    'PE_EXECUTIVO': [
      'Projeto elétrico executivo completo',
      'Projeto hidrossanitário executivo',
      'Detalhamento de instalações especiais',
      'Lista de materiais e componentes',
      'Diagramas unifilares e esquemas'
    ]
  },
  'PAISAGISMO': {
    'EP_PRELIMINAR': [
      'Conceito paisagístico preliminar',
      'Zoneamento de áreas verdes'
    ],
    'AP_ANTEPROJETO': [
      'Projeto paisagístico básico',
      'Especificação de espécies vegetais',
      'Sistema de irrigação preliminar'
    ],
    'PE_EXECUTIVO': [
      'Projeto paisagístico executivo',
      'Detalhamento de plantios',
      'Projeto de irrigação completo',
      'Especificações técnicas de jardinagem'
    ]
  },
  'INTERIORES': {
    'AP_ANTEPROJETO': [
      'Conceito de design de interiores',
      'Layout de mobiliário',
      'Paleta de cores e materiais'
    ],
    'PB_BASICO': [
      'Projeto de interiores básico',
      'Especificação de acabamentos',
      'Detalhamento de mobiliário fixo'
    ],
    'PE_EXECUTIVO': [
      'Projeto de interiores executivo',
      'Detalhamento completo de acabamentos',
      'Projeto de mobiliário personalizado',
      'Especificações técnicas de materiais'
    ]
  }
};

export const DISCIPLINAS_PADRAO: Disciplina[] = [
  {
    id: '1',
    codigo: 'ARQUITETURA',
    nome: 'Projeto Arquitetônico',
    descricao: 'Desenvolvimento completo do projeto arquitetônico',
    categoria: 'ESSENCIAL',
    valorBase: 120,
    horasBase: 80,
    ativa: true,
    ordem: 1,
    icone: '🏗️'
  },
  {
    id: '2',
    codigo: 'MODELAGEM_3D',
    nome: 'Modelagem 3D + 6 Renderizações',
    descricao: 'Modelagem tridimensional e renderizações fotorrealísticas',
    categoria: 'COMPLEMENTAR',
    dependencias: ['ARQUITETURA'],
    valorBase: 45,
    horasBase: 30,
    ativa: false,
    ordem: 2,
    icone: '🎨'
  },
  {
    id: '3',
    codigo: 'APROVACAO_LEGAL',
    nome: 'Aprovação Prefeitura + Alvará',
    descricao: 'Projeto legal e acompanhamento de aprovações',
    categoria: 'COMPLEMENTAR',
    dependencias: ['ARQUITETURA'],
    valorBase: 35,
    horasBase: 25,
    ativa: false,
    ordem: 3,
    icone: '📋'
  },
  {
    id: '4',
    codigo: 'ESTRUTURAL',
    nome: 'Projeto Estrutural',
    descricao: 'Dimensionamento e detalhamento estrutural',
    categoria: 'ESPECIALIZADA',
    dependencias: ['ARQUITETURA'],
    valorBase: 25,
    horasBase: 40,
    ativa: false,
    ordem: 4,
    icone: '🏗️'
  },
  {
    id: '5',
    codigo: 'INSTALACOES',
    nome: 'Projetos de Instalações',
    descricao: 'Instalações elétricas, hidráulicas e sanitárias',
    categoria: 'ESPECIALIZADA',
    dependencias: ['ARQUITETURA'],
    incompatibilidades: [],
    valorBase: 20,
    horasBase: 35,
    ativa: false,
    ordem: 5,
    icone: '⚡'
  },
  {
    id: '6',
    codigo: 'PAISAGISMO',
    nome: 'Projeto Paisagístico',
    descricao: 'Projeto de paisagismo e áreas verdes',
    categoria: 'COMPLEMENTAR',
    dependencias: ['ARQUITETURA'],
    valorBase: 30,
    horasBase: 25,
    ativa: false,
    ordem: 6,
    icone: '🌿'
  },
  {
    id: '7',
    codigo: 'INTERIORES',
    nome: 'Design de Interiores',
    descricao: 'Projeto de interiores e especificação de acabamentos',
    categoria: 'COMPLEMENTAR',
    dependencias: ['ARQUITETURA'],
    valorBase: 35,
    horasBase: 30,
    ativa: false,
    ordem: 7,
    icone: '🛋️'
  }
];

export type DisciplinaCodigo = 
  | 'ARQUITETURA'
  | 'MODELAGEM_3D'
  | 'APROVACAO_LEGAL'
  | 'ESTRUTURAL'
  | 'INSTALACOES'
  | 'PAISAGISMO'
  | 'INTERIORES';