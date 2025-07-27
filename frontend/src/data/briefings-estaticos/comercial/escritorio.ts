// 🏢 BRIEFING ESTÁTICO: ESCRITÓRIO COMERCIAL
// 72 perguntas | 108 min estimado | Extraído do sistema hierárquico

import { BriefingEstatico } from '../types';

export const ESCRITORIO_COMERCIAL: BriefingEstatico = {
  id: 'COM_ESCRITORIO',
  nome: 'Escritório Comercial',
  area: 'COMERCIAL',
  tipologia: 'ESCRITORIO',
  padrao: 'UNICO',
  totalPerguntas: 72,
  tempoEstimado: 108,
  categoria: 'comercial-escritorio',
  versao: '4.0',
  perguntas: [
      // CONFIGURAÇÃO (4 perguntas)
      {
        id: 'CONFIG_00_01',
        texto: 'Nome do briefing',
        tipo: 'texto',
        obrigatoria: true,
        placeholder: 'Ex: Escritório Comercial - Empresa ABC',
        secao: 'CONFIGURAÇÃO'
      },
      {
        id: 'CONFIG_00_02',
        texto: 'Selecionar cliente existente',
        tipo: 'select',
        obrigatoria: true,
        opcoes: [],
        secao: 'CONFIGURAÇÃO'
      },
      {
        id: 'CONFIG_00_03',
        texto: 'Responsável pelo preenchimento',
        tipo: 'texto',
        obrigatoria: true,
        placeholder: 'Nome completo de quem está preenchendo',
        secao: 'CONFIGURAÇÃO'
      },
      {
        id: 'CONFIG_00_04',
        texto: 'Data de criação',
        tipo: 'data',
        obrigatoria: true,
        secao: 'CONFIGURAÇÃO'
      },

      // DADOS BÁSICOS (10 perguntas)
      {
        id: 'COM_01_01',
        texto: 'Qual é o nome da empresa?',
        tipo: 'texto',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_02',
        texto: 'Qual é o CNPJ da empresa?',
        tipo: 'cnpj',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_03',
        texto: 'Qual é o ramo de atividade específico?',
        tipo: 'texto',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_04',
        texto: 'Quantos funcionários trabalharão no escritório?',
        tipo: 'numero',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_05',
        texto: 'Qual é o horário de funcionamento?',
        tipo: 'texto',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_06',
        texto: 'Há previsão de crescimento da equipe em 3 anos?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_07',
        texto: 'Qual é o perfil dos clientes atendidos?',
        tipo: 'select',
        opcoes: ['Pessoas físicas', 'Pessoas jurídicas', 'Ambos'],
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_08',
        texto: 'Há atendimento presencial de clientes?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_09',
        texto: 'Qual é a frequência de reuniões com clientes?',
        tipo: 'select',
        opcoes: ['Raramente', 'Ocasionalmente', 'Frequentemente', 'Diariamente'],
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },
      {
        id: 'COM_01_10',
        texto: 'É necessário sigilo/confidencialidade especial?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DADOS BÁSICOS'
      },

      // PROGRAMA ARQUITETÔNICO (15 perguntas)
      {
        id: 'ESC_01_01',
        texto: 'Quantas salas individuais são necessárias?',
        tipo: 'numero',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_02',
        texto: 'É necessário espaço de trabalho colaborativo/open space?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_03',
        texto: 'Quantas salas de reunião são necessárias?',
        tipo: 'numero',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_04',
        texto: 'É necessário auditório/sala de apresentações?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_05',
        texto: 'É necessária recepção/área de espera?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_06',
        texto: 'É necessária copa/cozinha?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_07',
        texto: 'Quantos banheiros são necessários?',
        tipo: 'numero',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_08',
        texto: 'É necessário depósito/arquivo?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_09',
        texto: 'É necessária sala do servidor/TI?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_10',
        texto: 'É necessário vestiário para funcionários?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_11',
        texto: 'É necessária área de descanso/relaxamento?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_12',
        texto: 'É necessário estacionamento? Para quantas vagas?',
        tipo: 'numero',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_13',
        texto: 'É necessária área externa/terraço?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_14',
        texto: 'É necessário espaço para impressoras/equipamentos?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },
      {
        id: 'ESC_01_15',
        texto: 'Há outros ambientes específicos necessários?',
        tipo: 'texto_longo',
        obrigatoria: false,
        secao: 'PROGRAMA ARQUITETÔNICO'
      },

      // INFRAESTRUTURA E TECNOLOGIA (12 perguntas)
      {
        id: 'ESC_02_01',
        texto: 'Qual é a necessidade de pontos de rede/internet?',
        tipo: 'select',
        opcoes: ['Básica', 'Média', 'Alta', 'Muito alta'],
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_02',
        texto: 'É necessário cabeamento estruturado?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_03',
        texto: 'É necessário sistema de telefonia?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_04',
        texto: 'É necessário sistema de videoconferência?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_05',
        texto: 'É necessário sistema de projeção/TV corporativa?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_06',
        texto: 'É necessário sistema de ar condicionado?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_07',
        texto: 'É necessário sistema de segurança eletrônica?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_08',
        texto: 'É necessário controle de acesso?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_09',
        texto: 'É necessário no-break/gerador?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_10',
        texto: 'É necessário sistema de automação (luzes, cortinas)?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_11',
        texto: 'É necessário sistema de som ambiente?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },
      {
        id: 'ESC_02_12',
        texto: 'É necessário sistema de backup de dados local?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'INFRAESTRUTURA E TECNOLOGIA'
      },

      // LOCALIZAÇÃO E ACESSIBILIDADE (8 perguntas)
      {
        id: 'ESC_03_01',
        texto: 'Qual é o endereço desejado/região prioritária?',
        tipo: 'endereco',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_02',
        texto: 'É importante proximidade com transporte público?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_03',
        texto: 'É importante proximidade com bancos/comércio?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_04',
        texto: 'É necessário acesso para pessoas com deficiência?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_05',
        texto: 'É importante visibilidade da fachada/identificação?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_06',
        texto: 'Qual o andar preferido (térreo, intermediário, alto)?',
        tipo: 'select',
        opcoes: ['Térreo', 'Intermediário', 'Alto', 'Indiferente'],
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_07',
        texto: 'É necessário entrada independente?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },
      {
        id: 'ESC_03_08',
        texto: 'É necessário acesso para entrega/carga e descarga?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'LOCALIZAÇÃO E ACESSIBILIDADE'
      },

      // DESIGN E AMBIENTE (8 perguntas)
      {
        id: 'ESC_04_01',
        texto: 'Qual estilo de design é preferido?',
        tipo: 'select',
        opcoes: ['Moderno', 'Contemporâneo', 'Clássico', 'Industrial', 'Minimalista', 'Corporativo tradicional'],
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_02',
        texto: 'Qual é a paleta de cores da marca/preferida?',
        tipo: 'texto',
        obrigatoria: false,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_03',
        texto: 'É importante transmitir modernidade/inovação?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_04',
        texto: 'É importante transmitir credibilidade/tradição?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_05',
        texto: 'É importante aproveitamento de luz natural?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_06',
        texto: 'É importante privacidade visual entre setores?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_07',
        texto: 'É importante flexibilidade para futuras mudanças de layout?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'DESIGN E AMBIENTE'
      },
      {
        id: 'ESC_04_08',
        texto: 'É necessário espaço para plantas/jardim interno?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'DESIGN E AMBIENTE'
      },

      // ORÇAMENTO E CRONOGRAMA (8 perguntas)
      {
        id: 'ESC_05_01',
        texto: 'Qual é o orçamento total disponível?',
        tipo: 'moeda',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_02',
        texto: 'Este orçamento inclui mobiliário?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_03',
        texto: 'Este orçamento inclui equipamentos de TI?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_04',
        texto: 'Qual é o prazo desejado para conclusão?',
        tipo: 'data',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_05',
        texto: 'É necessário trabalhar por etapas/fases?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_06',
        texto: 'A obra pode interferir no funcionamento atual?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_07',
        texto: 'É necessário local temporário durante a obra?',
        tipo: 'boolean',
        obrigatoria: false,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      },
      {
        id: 'ESC_05_08',
        texto: 'Há flexibilidade de prazo para melhor resultado?',
        tipo: 'boolean',
        obrigatoria: true,
        secao: 'ORÇAMENTO E CRONOGRAMA'
      }
    ],

  secoes: [
    {
      id: 'configuracao',
      nome: 'CONFIGURAÇÃO',
      icone: '⚙️',
      descricao: 'Configurações iniciais do briefing',
      ordem: 1
    },
    {
      id: 'dados_basicos',
      nome: 'DADOS BÁSICOS',
      icone: '🏢',
      descricao: 'Informações gerais da empresa',
      ordem: 2
    },
    {
      id: 'programa_arquitetonico',
      nome: 'PROGRAMA ARQUITETÔNICO',
      icone: '📐',
      descricao: 'Necessidades de espaços e ambientes',
      ordem: 3
    },
    {
      id: 'infraestrutura_tecnologia',
      nome: 'INFRAESTRUTURA E TECNOLOGIA',
      icone: '💻',
      descricao: 'Sistemas e tecnologias necessárias',
      ordem: 4
    },
    {
      id: 'localizacao_acessibilidade',
      nome: 'LOCALIZAÇÃO E ACESSIBILIDADE',
      icone: '📍',
      descricao: 'Localização e requisitos de acesso',
      ordem: 5
    },
    {
      id: 'design_ambiente',
      nome: 'DESIGN E AMBIENTE',
      icone: '🎨',
      descricao: 'Estilo e ambiente de trabalho',
      ordem: 6
    },
    {
      id: 'orcamento_cronograma',
      nome: 'ORÇAMENTO E CRONOGRAMA',
      icone: '💰',
      descricao: 'Orçamento e prazos do projeto',
      ordem: 7
    }
  ],

  metadados: {
    criadoEm: '2024-12-19',
    atualizadoEm: '2024-12-19',
    baseadoEm: 'Sistema Hierárquico ARCFLOW V3.0 + NBR 13532',
    tags: ['comercial', 'escritorio', 'corporativo', 'profissional'],
    status: 'ativo'
  }
}; 