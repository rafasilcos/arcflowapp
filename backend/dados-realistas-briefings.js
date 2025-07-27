// DADOS REALISTAS PARA PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS
// Templates de respostas por tipologia para geração de orçamentos

const DADOS_REALISTAS_BRIEFINGS = {
  // TEMPLATES POR CATEGORIA
  templates: {
    // COMERCIAL - ESCRITÓRIOS
    'comercial-escritorios': [
      {
        nome: 'Escritório Pequeno - Consultório',
        respostas: {
          // Dados básicos
          nome_projeto: 'Consultório Médico Moderno',
          tipo_escritorio: 'Consultório',
          atividade_principal: 'Consultório médico especializado',
          
          // Área e dimensões
          area_total: 120,
          funcionarios: 5,
          salas_privativas: 2,
          
          // Padrão e acabamento
          padrao_acabamento: 'Alto',
          nivel_acabamento: 'alto',
          qualidade_acabamento: 'superior',
          
          // Localização
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Vila Madalena',
          
          // Complexidade
          pavimentos: 1,
          elevador: 'não',
          acessibilidade: 'sim',
          
          // Prazo e orçamento
          prazo_desejado: '4 meses',
          prazo_execucao: '120 dias',
          
          // Requisitos especiais
          sustentabilidade: 'sim',
          automacao: 'não',
          casa_inteligente: 'não'
        }
      },
      {
        nome: 'Escritório Médio - Corporativo',
        respostas: {
          nome_projeto: 'Escritório Corporativo Tech',
          tipo_escritorio: 'Corporativo',
          atividade_principal: 'Empresa de tecnologia',
          area_total: 350,
          funcionarios: 25,
          salas_privativas: 5,
          padrao_acabamento: 'Alto',
          nivel_acabamento: 'alto',
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Faria Lima',
          pavimentos: 1,
          elevador: 'não',
          acessibilidade: 'sim',
          prazo_desejado: '6 meses',
          sustentabilidade: 'sim',
          automacao: 'sim'
        }
      },
      {
        nome: 'Escritório Grande - Multinacional',
        respostas: {
          nome_projeto: 'Sede Corporativa Internacional',
          tipo_escritorio: 'Corporativo',
          atividade_principal: 'Multinacional de consultoria',
          area_total: 800,
          funcionarios: 60,
          salas_privativas: 12,
          padrao_acabamento: 'Luxo',
          nivel_acabamento: 'luxo',
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Itaim Bibi',
          pavimentos: 2,
          elevador: 'sim',
          acessibilidade: 'sim',
          prazo_desejado: '9 meses',
          sustentabilidade: 'sim',
          automacao: 'sim'
        }
      }
    ],

    // COMERCIAL - RESTAURANTES
    'comercial-restaurantes': [
      {
        nome: 'Restaurante Médio - Familiar',
        respostas: {
          nome_projeto: 'Restaurante Familiar Aconchegante',
          tipo_comercio: 'Restaurante',
          segmento: 'Culinária brasileira',
          area_total: 180,
          area_cozinha: 60,
          area_salao: 120,
          padrao_acabamento: 'Médio',
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Vila Madalena',
          pavimentos: 1,
          prazo_desejado: '5 meses'
        }
      }
    ],

    // COMERCIAL - HOTEL POUSADA
    'comercial-hotel-pousada': [
      {
        nome: 'Pousada Pequena - Turismo',
        respostas: {
          nome_projeto: 'Pousada Aconchegante do Interior',
          tipo_comercio: 'Pousada',
          segmento: 'Turismo rural',
          area_total: 400,
          quartos: '8',
          area_comum: 150,
          padrao_acabamento: 'Alto',
          estado: 'MG',
          cidade: 'Tiradentes',
          pavimentos: 2,
          prazo_desejado: '12 meses'
        }
      }
    ],

    // COMERCIAL - LOJAS
    'comercial-lojas': [
      {
        nome: 'Loja Pequena - Boutique',
        respostas: {
          nome_projeto: 'Boutique de Moda Feminina',
          tipo_comercio: 'Varejo',
          segmento: 'Moda feminina',
          area_total: 80,
          area_vendas: 60,
          area_estoque: 20,
          padrao_acabamento: 'Alto',
          estado: 'RJ',
          cidade: 'Rio de Janeiro',
          bairro: 'Ipanema',
          pavimentos: 1,
          prazo_desejado: '3 meses'
        }
      },
      {
        nome: 'Loja Média - Eletrônicos',
        respostas: {
          nome_projeto: 'Loja de Eletrônicos e Games',
          tipo_comercio: 'Varejo',
          segmento: 'Eletrônicos e games',
          area_total: 200,
          area_vendas: 150,
          area_estoque: 50,
          padrao_acabamento: 'Médio',
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Centro',
          pavimentos: 1,
          prazo_desejado: '4 meses'
        }
      }
    ],

    // RESIDENCIAL - UNIFAMILIAR
    'residencial-unifamiliar': [
      {
        nome: 'Casa Pequena - Família Jovem',
        respostas: {
          nome_projeto: 'Casa Moderna para Família Jovem',
          tipo_residencia: 'Casa térrea',
          area_total: 150,
          area_terreno: 300,
          quartos: '3',
          banheiros: '2',
          suites: '1',
          garagem: '2 vagas',
          padrao_acabamento: 'Médio',
          estado: 'MG',
          cidade: 'Belo Horizonte',
          pavimentos: 1,
          piscina: 'não',
          elevador: 'não',
          prazo_desejado: '8 meses',
          sustentabilidade: 'sim'
        }
      },
      {
        nome: 'Casa Média - Família Estabelecida',
        respostas: {
          nome_projeto: 'Residência Familiar Confortável',
          tipo_residencia: 'Sobrado',
          area_total: 280,
          area_terreno: 500,
          quartos: '4',
          banheiros: '3',
          suites: '2',
          garagem: '3 vagas',
          padrao_acabamento: 'Alto',
          estado: 'RS',
          cidade: 'Porto Alegre',
          pavimentos: 2,
          piscina: 'sim',
          elevador: 'não',
          prazo_desejado: '12 meses',
          sustentabilidade: 'sim',
          automacao: 'sim'
        }
      },
      {
        nome: 'Casa Grande - Alto Padrão',
        respostas: {
          nome_projeto: 'Residência de Alto Padrão',
          tipo_residencia: 'Sobrado',
          area_total: 450,
          area_terreno: 800,
          quartos: '5',
          banheiros: '4',
          suites: '3',
          garagem: '4 vagas',
          padrao_acabamento: 'Luxo',
          estado: 'SP',
          cidade: 'São Paulo',
          bairro: 'Morumbi',
          pavimentos: 2,
          piscina: 'sim',
          spa: 'sim',
          elevador: 'sim',
          prazo_desejado: '18 meses',
          sustentabilidade: 'sim',
          automacao: 'sim'
        }
      }
    ],

    // RESIDENCIAL - MULTIFAMILIAR
    'residencial-multifamiliar': [
      {
        nome: 'Prédio Pequeno - 12 Apartamentos',
        respostas: {
          nome_projeto: 'Edifício Residencial Compacto',
          numero_unidades: 12,
          mix_tipologias: '8 apartamentos de 2 dormitórios, 4 apartamentos de 3 dormitórios',
          area_unidade: '65m² (2 dorm), 85m² (3 dorm)',
          area_terreno: '600m² - 15m x 40m',
          pavimentos: 4,
          elevador: 'sim',
          garagem: '1 vaga por unidade',
          padrao_acabamento: 'Médio',
          estado: 'PR',
          cidade: 'Curitiba',
          prazo_desejado: '24 meses'
        }
      },
      {
        nome: 'Prédio Médio - 40 Apartamentos',
        respostas: {
          nome_projeto: 'Condomínio Residencial Moderno',
          numero_unidades: 40,
          mix_tipologias: '10 studios, 20 apartamentos de 2 dormitórios, 10 apartamentos de 3 dormitórios',
          area_unidade: '35m² (studio), 55m² (2 dorm), 75m² (3 dorm)',
          area_terreno: '1200m² - 30m x 40m',
          pavimentos: 8,
          elevador: 'sim',
          garagem: '1 vaga por unidade',
          padrao_acabamento: 'Alto',
          estado: 'SC',
          cidade: 'Florianópolis',
          prazo_desejado: '30 meses'
        }
      }
    ],

    // INDUSTRIAL - GALPÃO
    'industrial-galpao': [
      {
        nome: 'Galpão Pequeno - Armazenagem',
        respostas: {
          nome_projeto: 'Galpão Logístico Compacto',
          uso_galpao: 'Armazenagem',
          tipo_atividade: 'Centro de distribuição local',
          area_total: 800,
          pe_direito: 8,
          padrao_acabamento: 'Simples',
          estado: 'SP',
          cidade: 'Guarulhos',
          pavimentos: 1,
          prazo_desejado: '6 meses'
        }
      },
      {
        nome: 'Galpão Médio - Produção',
        respostas: {
          nome_projeto: 'Galpão Industrial de Produção',
          uso_galpao: 'Produção',
          tipo_atividade: 'Indústria de alimentos',
          area_total: 2500,
          pe_direito: 10,
          padrao_acabamento: 'Médio',
          estado: 'SP',
          cidade: 'São Bernardo do Campo',
          pavimentos: 1,
          prazo_desejado: '10 meses'
        }
      },
      {
        nome: 'Galpão Grande - Logística',
        respostas: {
          nome_projeto: 'Centro de Distribuição Regional',
          uso_galpao: 'Logística',
          tipo_atividade: 'Hub logístico e-commerce',
          area_total: 5000,
          pe_direito: 12,
          padrao_acabamento: 'Alto',
          estado: 'SP',
          cidade: 'Cajamar',
          pavimentos: 1,
          prazo_desejado: '14 meses'
        }
      }
    ],

    // URBANÍSTICO - PROJETO URBANO
    'urbanistico-projeto-urbano': [
      {
        nome: 'Projeto Pequeno - Novo Bairro',
        respostas: {
          nome_projeto: 'Loteamento Residencial Sustentável',
          tipo_projeto: 'Novo bairro/distrito',
          escala_projeto: 'Bairro',
          area_total: 15000, // 150 hectares em m²
          insercao_cidade: 'Periferia em expansão',
          conectividade: 'Moderadamente conectada',
          padrao_acabamento: 'Médio',
          estado: 'GO',
          cidade: 'Goiânia',
          prazo_desejado: '36 meses'
        }
      }
    ],

    // INDUSTRIAL - GALPÃO INDUSTRIAL
    'industrial-galpao-industrial': [
      {
        nome: 'Galpão Industrial Médio',
        respostas: {
          nome_projeto: 'Galpão Industrial Moderno',
          uso_galpao: 'Produção',
          tipo_atividade: 'Indústria metalúrgica',
          area_total: 1500,
          pe_direito: 9,
          padrao_acabamento: 'Médio',
          estado: 'SP',
          cidade: 'São José dos Campos',
          pavimentos: 1,
          prazo_desejado: '8 meses'
        }
      }
    ],

    // ESTRUTURAL - PROJETO ESTRUTURAL ADAPTATIVO
    'estrutural-projeto-estrutural-adaptativo': [
      {
        nome: 'Projeto Estrutural Residencial',
        respostas: {
          nome_projeto: 'Estrutura Residencial Moderna',
          tipo_estrutura: 'Concreto armado',
          sistema_estrutural: 'Lajes maciças',
          area_total: 300,
          pavimentos: 2,
          padrao_acabamento: 'Alto',
          estado: 'SP',
          cidade: 'São Paulo',
          prazo_desejado: '4 meses'
        }
      }
    ],

    // INSTALAÇÕES - ADAPTATIVO COMPLETO
    'instalacoes-instalacoes-adaptativo-completo': [
      {
        nome: 'Instalações Residenciais Completas',
        respostas: {
          nome_projeto: 'Instalações Residenciais Modernas',
          tipo_instalacao: 'Residencial',
          sistemas: 'Elétrica, Hidráulica, HVAC',
          area_total: 250,
          padrao_acabamento: 'Alto',
          estado: 'SP',
          cidade: 'São Paulo',
          prazo_desejado: '3 meses'
        }
      }
    ],

    // RESIDENCIAL - PAISAGISMO
    'residencial-paisagismo': [
      {
        nome: 'Paisagismo Residencial Completo',
        respostas: {
          nome_projeto: 'Jardim Residencial Sustentável',
          tipo_paisagismo: 'Residencial',
          area_total: 500,
          area_jardim: 300,
          padrao_acabamento: 'Alto',
          estado: 'SP',
          cidade: 'São Paulo',
          prazo_desejado: '4 meses'
        }
      }
    ],

    // RESIDENCIAL - DESIGN INTERIORES
    'residencial-design-interiores': [
      {
        nome: 'Design de Interiores Residencial',
        respostas: {
          nome_projeto: 'Interiores Residenciais Modernos',
          tipo_design: 'Residencial',
          area_total: 200,
          ambientes: 'Sala, quartos, cozinha',
          padrao_acabamento: 'Alto',
          estado: 'SP',
          cidade: 'São Paulo',
          prazo_desejado: '3 meses'
        }
      }
    ],

    // RESIDENCIAL - LOTEAMENTOS
    'residencial-loteamentos': [
      {
        nome: 'Loteamento Residencial',
        respostas: {
          nome_projeto: 'Loteamento Residencial Planejado',
          tipo_loteamento: 'Residencial',
          area_total: 50000, // 5 hectares
          numero_lotes: 100,
          padrao_acabamento: 'Médio',
          estado: 'SP',
          cidade: 'Campinas',
          prazo_desejado: '24 meses'
        }
      }
    ]
  },

  // VARIAÇÕES PARA CADA TEMPLATE
  variacoes: {
    localizacao: {
      'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'Santos', 'São Bernardo do Campo'],
      'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu'],
      'MG': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem'],
      'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Santa Maria'],
      'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
      'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó']
    },
    
    bairros: {
      'São Paulo': ['Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Faria Lima', 'Moema', 'Brooklin'],
      'Rio de Janeiro': ['Ipanema', 'Copacabana', 'Leblon', 'Barra da Tijuca', 'Botafogo'],
      'Belo Horizonte': ['Savassi', 'Funcionários', 'Lourdes', 'Belvedere', 'Buritis'],
      'Porto Alegre': ['Moinhos de Vento', 'Auxiliadora', 'Mont Serrat', 'Petrópolis']
    },

    nomes_projetos: {
      comercial: [
        'Centro Empresarial Moderno', 'Complexo Corporativo Inovador', 'Escritório Sustentável',
        'Hub de Negócios', 'Torre Comercial Premium', 'Espaço Coworking Criativo'
      ],
      residencial: [
        'Residência Familiar Contemporânea', 'Casa Sustentável Moderna', 'Lar Inteligente',
        'Residência Bioclimática', 'Casa dos Sonhos', 'Moradia Ecológica'
      ],
      industrial: [
        'Complexo Industrial Moderno', 'Centro Logístico Avançado', 'Galpão Inteligente',
        'Hub de Distribuição', 'Parque Industrial Sustentável'
      ]
    }
  },

  // FUNÇÃO PARA GERAR VARIAÇÕES
  gerarVariacao: function(template, categoria) {
    const variacao = { ...template.respostas };
    
    // Variar localização
    const estados = Object.keys(this.variacoes.localizacao);
    const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
    const cidadesEstado = this.variacoes.localizacao[estadoAleatorio];
    const cidadeAleatoria = cidadesEstado[Math.floor(Math.random() * cidadesEstado.length)];
    
    variacao.estado = estadoAleatorio;
    variacao.cidade = cidadeAleatoria;
    
    // Variar bairro se disponível
    if (this.variacoes.bairros[cidadeAleatoria]) {
      const bairros = this.variacoes.bairros[cidadeAleatoria];
      variacao.bairro = bairros[Math.floor(Math.random() * bairros.length)];
    }
    
    // Variar nome do projeto
    if (this.variacoes.nomes_projetos[categoria]) {
      const nomes = this.variacoes.nomes_projetos[categoria];
      variacao.nome_projeto = nomes[Math.floor(Math.random() * nomes.length)];
    }
    
    // Variar valores numéricos (±20%)
    Object.keys(variacao).forEach(key => {
      if (typeof variacao[key] === 'number' && key.includes('area')) {
        const valor = variacao[key];
        const variacao_percentual = 0.8 + (Math.random() * 0.4); // 80% a 120%
        variacao[key] = Math.round(valor * variacao_percentual);
      }
    });
    
    return variacao;
  },

  // FUNÇÃO PARA OBTER TEMPLATE ALEATÓRIO
  obterTemplateAleatorio: function(categoria, subtipo) {
    const chave = `${categoria}-${subtipo}`;
    const templates = this.templates[chave];
    
    if (!templates || templates.length === 0) {
      return null;
    }
    
    const templateAleatorio = templates[Math.floor(Math.random() * templates.length)];
    return this.gerarVariacao(templateAleatorio, categoria);
  },

  // VALIDAÇÃO DE DADOS ESSENCIAIS
  validarDadosEssenciais: function(respostas) {
    const essenciais = ['area_total', 'padrao_acabamento', 'estado', 'cidade'];
    
    for (const campo of essenciais) {
      if (!respostas[campo]) {
        return false;
      }
    }
    
    return true;
  }
};

module.exports = DADOS_REALISTAS_BRIEFINGS;