// MAPEAMENTO DE BRIEFINGS PARA GERAÇÃO DE ORÇAMENTOS
// Análise completa dos briefings disponíveis e suas perguntas essenciais

const MAPEAMENTO_BRIEFINGS_ORCAMENTO = {
  // CATEGORIAS DISPONÍVEIS
  categorias: {
    comercial: {
      nome: 'Comercial',
      briefings: ['escritorios', 'lojas', 'restaurantes', 'hotel-pousada'],
      totalPerguntas: 918,
      status: 'ativo'
    },
    residencial: {
      nome: 'Residencial', 
      briefings: ['unifamiliar', 'multifamiliar', 'paisagismo', 'design-interiores', 'loteamentos'],
      totalPerguntas: 337,
      status: 'ativo'
    },
    industrial: {
      nome: 'Industrial',
      briefings: ['galpao-industrial'],
      totalPerguntas: 170,
      status: 'ativo'
    },
    urbanistico: {
      nome: 'Urbanístico',
      briefings: ['projeto-urbano'],
      totalPerguntas: 260,
      status: 'ativo'
    },
    estrutural: {
      nome: 'Estrutural',
      briefings: ['projeto-estrutural-adaptativo'],
      totalPerguntas: 162,
      status: 'ativo'
    },
    instalacoes: {
      nome: 'Instalações',
      briefings: ['instalacoes-adaptativo-completo'],
      totalPerguntas: 150,
      status: 'ativo'
    }
  },

  // PALAVRAS-CHAVE PARA EXTRAÇÃO DE DADOS
  palavrasChave: {
    // ÁREA CONSTRUÍDA
    area: [
      'area_construida', 'area_total', 'metragem_aproximada', 'metragem',
      'área total', 'área construída', 'metros quadrados', 'm²',
      'area_desejada', 'area_projeto', 'dimensoes'
    ],
    
    // TIPOLOGIA E SUBTIPOLOGIA
    tipologia: [
      'tipologia', 'tipo_imovel', 'categoria_projeto', 'tipo_edificacao',
      'subtipologia', 'subtipo_imovel', 'subcategoria'
    ],
    
    // PADRÃO DE ACABAMENTO
    padrao: [
      'padrao_acabamento', 'nivel_acabamento', 'qualidade_acabamento',
      'padrao_construtivo', 'nivel_qualidade', 'categoria_acabamento'
    ],
    
    // COMPLEXIDADE
    complexidade: [
      'pavimentos', 'andares', 'quartos', 'dormitorios', 'banheiros', 'suites',
      'piscina', 'elevador', 'spa', 'sauna', 'terreno_irregular'
    ],
    
    // LOCALIZAÇÃO
    localizacao: [
      'estado', 'uf', 'cidade', 'bairro', 'endereco', 'cep'
    ],
    
    // PRAZO
    prazo: [
      'prazo_desejado', 'prazo_execucao', 'tempo_execucao', 'cronograma'
    ],
    
    // REQUISITOS ESPECIAIS
    especiais: [
      'sustentabilidade', 'energia_solar', 'acessibilidade', 
      'automacao', 'casa_inteligente', 'certificacao'
    ]
  },

  // PERGUNTAS ESSENCIAIS POR BRIEFING
  perguntasEssenciais: {
    // COMERCIAL - ESCRITÓRIOS
    'comercial-escritorios': {
      area: [
        { id: 'area_total', pergunta: 'Área total desejada para o escritório (m²)', tipo: 'numero' },
        { id: 'area_por_pessoa', pergunta: 'Quantos funcionários trabalharão no espaço?', tipo: 'numero' },
        { id: 'salas_privativas', pergunta: 'Quantas salas privativas são necessárias?', tipo: 'numero' }
      ],
      tipologia: [
        { id: 'tipo_escritorio', pergunta: 'Tipo de escritório', opcoes: ['Corporativo', 'Consultório', 'Coworking', 'Home office'] },
        { id: 'atividade_principal', pergunta: 'Atividade principal da empresa', tipo: 'texto' }
      ],
      padrao: [
        { id: 'padrao_acabamento', pergunta: 'Padrão de acabamento desejado', opcoes: ['Simples', 'Médio', 'Alto', 'Luxo'] }
      ]
    },

    // COMERCIAL - LOJAS
    'comercial-lojas': {
      area: [
        { id: 'area_vendas', pergunta: 'Área de vendas (m²)', tipo: 'numero' },
        { id: 'area_estoque', pergunta: 'Área de estoque (m²)', tipo: 'numero' },
        { id: 'area_total', pergunta: 'Área total da loja (m²)', tipo: 'numero' }
      ],
      tipologia: [
        { id: 'tipo_comercio', pergunta: 'Tipo de comércio', opcoes: ['Varejo', 'Atacado', 'Misto'] },
        { id: 'segmento', pergunta: 'Segmento comercial', tipo: 'texto' }
      ]
    },

    // RESIDENCIAL - UNIFAMILIAR
    'residencial-unifamiliar': {
      area: [
        { id: 'area_total', pergunta: 'Área total desejada (m²)', tipo: 'numero', min: 80, max: 1500 },
        { id: 'area_terreno', pergunta: 'Área do terreno (m²)', tipo: 'numero', min: 100, max: 10000 }
      ],
      tipologia: [
        { id: 'tipo_residencia', pergunta: 'Tipo de residência', opcoes: ['Casa térrea', 'Sobrado', 'Casa com mezanino'] },
        { id: 'quartos', pergunta: 'Número de quartos', opcoes: ['1', '2', '3', '4', '5+'] },
        { id: 'banheiros', pergunta: 'Número de banheiros', opcoes: ['1', '2', '3', '4+'] }
      ]
    },

    // RESIDENCIAL - MULTIFAMILIAR
    'residencial-multifamiliar': {
      area: [
        { id: 'area_terreno', pergunta: 'Área total e dimensões do terreno', tipo: 'texto' },
        { id: 'area_unidades', pergunta: 'Metragem quadrada privativa por tipologia', tipo: 'texto' }
      ],
      tipologia: [
        { id: 'mix_tipologias', pergunta: 'Mix de tipologias de apartamentos/casas', tipo: 'textarea' },
        { id: 'numero_unidades', pergunta: 'Número total de unidades', tipo: 'numero' }
      ]
    },

    // INDUSTRIAL - GALPÃO
    'industrial-galpao': {
      area: [
        { id: 'area_galpao', pergunta: 'Área total do galpão (m²)', tipo: 'numero' },
        { id: 'pe_direito', pergunta: 'Pé direito necessário (m)', tipo: 'numero' }
      ],
      tipologia: [
        { id: 'uso_galpao', pergunta: 'Uso principal do galpão', opcoes: ['Armazenagem', 'Produção', 'Logística', 'Misto'] },
        { id: 'tipo_atividade', pergunta: 'Tipo de atividade industrial', tipo: 'texto' }
      ]
    },

    // URBANÍSTICO - PROJETO URBANO
    'urbanistico-projeto-urbano': {
      area: [
        { id: 'area_total', pergunta: 'Área total', opcoes: ['Até 10 hectares', '10 a 50 hectares', '50 a 200 hectares', '200 a 500 hectares', 'Acima de 500 hectares'] }
      ],
      tipologia: [
        { id: 'tipo_projeto', pergunta: 'Tipo de projeto urbano', opcoes: ['Novo bairro/distrito', 'Expansão urbana', 'Adensamento urbano', 'Reestruturação urbana'] },
        { id: 'escala_projeto', pergunta: 'Escala do projeto', opcoes: ['Lote/quadra', 'Bairro', 'Distrito', 'Setor urbano', 'Cidade nova'] }
      ]
    }
  },

  // DADOS REALISTAS POR CATEGORIA
  dadosRealistas: {
    comercial: {
      escritorios: {
        area_total: { min: 50, max: 2000, media: 300 },
        funcionarios: { min: 2, max: 100, media: 15 },
        padrao: ['Médio', 'Alto'],
        localizacao: ['SP', 'RJ', 'MG', 'RS'],
        prazo: ['3 meses', '6 meses', '9 meses']
      },
      lojas: {
        area_total: { min: 30, max: 1500, media: 200 },
        area_vendas: { min: 20, max: 1000, media: 120 },
        padrao: ['Simples', 'Médio', 'Alto'],
        segmentos: ['Moda', 'Alimentação', 'Eletrônicos', 'Casa e decoração']
      }
    },
    residencial: {
      unifamiliar: {
        area_total: { min: 80, max: 800, media: 250 },
        area_terreno: { min: 200, max: 2000, media: 500 },
        quartos: ['2', '3', '4'],
        banheiros: ['2', '3', '4'],
        padrao: ['Médio', 'Alto']
      },
      multifamiliar: {
        unidades: { min: 8, max: 200, media: 50 },
        area_unidade: { min: 45, max: 300, media: 80 },
        tipologias: ['1 dorm', '2 dorm', '3 dorm'],
        padrao: ['Médio', 'Alto']
      }
    },
    industrial: {
      galpao: {
        area_total: { min: 500, max: 10000, media: 2000 },
        pe_direito: { min: 6, max: 15, media: 8 },
        uso: ['Armazenagem', 'Produção', 'Logística'],
        padrao: ['Simples', 'Médio']
      }
    }
  },

  // MAPEAMENTO DE RESPOSTAS PARA ORÇAMENTO
  mapeamentoOrcamento: {
    // Como as perguntas dos briefings se relacionam com os dados do orçamento
    area_construida: ['area_total', 'area_desejada', 'metragem_aproximada'],
    tipologia: ['tipo_imovel', 'categoria_projeto', 'tipo_edificacao'],
    subtipologia: ['subtipo_imovel', 'subcategoria', 'uso_principal'],
    padrao_acabamento: ['padrao_acabamento', 'nivel_acabamento', 'qualidade'],
    complexidade: {
      baixa: { pavimentos: 1, quartos: '1-2', elementos_especiais: 0 },
      media: { pavimentos: 2, quartos: '3-4', elementos_especiais: '1-2' },
      alta: { pavimentos: '3+', quartos: '5+', elementos_especiais: '3+' }
    },
    localizacao: ['estado', 'cidade', 'uf'],
    prazo_desejado: ['prazo_execucao', 'cronograma', 'tempo_obra']
  }
};

module.exports = MAPEAMENTO_BRIEFINGS_ORCAMENTO;