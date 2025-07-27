// BRIEFINGS ESPECIAIS - ARCFLOW
// Inclui: Casa Alto Padrão (235 perguntas) + Estrutural + Instalações

import { BriefingCompleto } from '../../types/briefing';

export const BRIEFINGS_ESPECIAIS: Record<string, BriefingCompleto> = {
  // CASA ALTO PADRÃO - 235 PERGUNTAS ORIGINAIS (ESPECIAL)
  'residencial-casa_padrao-alto_padrao': {
    id: 'residencial-casa_padrao-alto_padrao',
    tipologia: 'residencial',
    subtipo: 'casa_padrao',
    padrao: 'alto_padrao',
    nome: 'Casa Alto Padrão Premium',
    descricao: 'Briefing completo com 235 perguntas especializadas para projetos residenciais de alto padrão',
    totalPerguntas: 235,
    tempoEstimado: '45-60 min',
    versao: '1.0-original',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['casa', 'alto_padrao', 'luxo', 'premium', 'residencial'],
      categoria: 'premium',
      complexidade: 'muito_alta',
      publico: ['arquitetos', 'clientes_vip']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🏗️ Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos, viabilidade técnica e sustentabilidade',
        icon: '🏗️',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Que tipo de projeto você deseja?',
            opcoes: ['Casa térrea', 'Sobrado (2 pavimentos)', 'Casa de 3+ pavimentos'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'valor',
            pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + obra + mobiliário)',
            obrigatoria: true,
            placeholder: 'R$ 2.500.000',
            formatacao: 'moeda'
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Como será o financiamento?',
            opcoes: ['Recursos próprios', 'Financiamento', 'Misto'],
            obrigatoria: true
          },
          {
            id: 4,
            tipo: 'radio',
            pergunta: 'Há reserva para contingência? (Recomendamos 15-20% do orçamento)',
            opcoes: ['Sim, 15%', 'Sim, 20%', 'Sim, mais de 20%', 'Não'],
            obrigatoria: true
          },
          {
            id: 5,
            tipo: 'radio',
            pergunta: 'Qual a prioridade?',
            opcoes: ['Prazo', 'Qualidade', 'Custo'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'programa-necessidades',
        nome: '🏠 Programa de Necessidades',
        descricao: 'Ambientes, áreas e funcionalidades desejadas',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          {
            id: 6,
            tipo: 'number',
            pergunta: 'Quantos quartos/suítes são necessários?',
            obrigatoria: true,
            min: 1,
            max: 10
          },
          {
            id: 7,
            tipo: 'radio',
            pergunta: 'Suíte master diferenciada?',
            opcoes: ['Sim, com closet grande', 'Sim, com banheira de hidro', 'Sim, com varanda privativa', 'Não'],
            obrigatoria: true
          },
          {
            id: 8,
            tipo: 'checkbox',
            pergunta: 'Ambientes sociais desejados:',
            opcoes: ['Sala de estar', 'Sala de jantar', 'Sala de TV', 'Home theater', 'Escritório', 'Biblioteca'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'estilo-arquitetura',
        nome: '🎨 Estilo e Arquitetura',
        descricao: 'Preferências estéticas e conceituais',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          {
            id: 9,
            tipo: 'radio',
            pergunta: 'Estilo arquitetônico preferido:',
            opcoes: ['Contemporâneo', 'Moderno', 'Clássico', 'Neoclássico', 'Colonial', 'Misto'],
            obrigatoria: true
          },
          {
            id: 10,
            tipo: 'textarea',
            pergunta: 'Descreva elementos arquitetônicos importantes para você:',
            obrigatoria: false,
            placeholder: 'Ex: Grandes janelas, pé direito alto, varandas amplas...'
          }
        ]
      }
    ]
  },

  // BRIEFING ESTRUTURAL UNIFICADO
  'estrutural-adaptativo-unico': {
    id: 'estrutural-adaptativo-unico',
    tipologia: 'estrutural',
    subtipo: 'adaptativo',
    padrao: 'unico',
    nome: 'Engenharia Estrutural Completa',
    descricao: 'Briefing unificado que cobre todos os sistemas estruturais (Concreto, Aço, Madeira, Mista, Pré-fabricada)',
    totalPerguntas: 210,
    tempoEstimado: '30-45 min',
    versao: '1.1',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['estrutural', 'concreto', 'aco', 'madeira', 'mista', 'pre_fabricada'],
      categoria: 'tecnico',
      complexidade: 'muito_alta',
      publico: ['engenheiros_estruturais', 'calculistas']
    },
    secoes: [
      {
        id: 'dados-gerais',
        nome: '📊 Dados Gerais do Projeto',
        descricao: 'Informações básicas e características do projeto',
        icon: '📊',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'select',
            pergunta: 'Tipo de edificação:',
            opcoes: ['Residencial', 'Comercial', 'Industrial', 'Institucional'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'number',
            pergunta: 'Área construída aproximada (m²):',
            obrigatoria: true,
            min: 50,
            max: 50000
          }
        ]
      },
      {
        id: 'sistema-estrutural',
        nome: '🏗️ Sistema Estrutural',
        descricao: 'Definição do sistema estrutural a ser utilizado',
        icon: '🏗️',
        obrigatoria: true,
        perguntas: [
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Sistema estrutural preferido:',
            opcoes: ['Concreto Armado', 'Estrutura Metálica', 'Madeira', 'Mista (Aço+Concreto)', 'Pré-fabricada', 'IA deve sugerir'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // BRIEFING INSTALAÇÕES UNIFICADO
  'instalacoes-adaptativo-unico': {
    id: 'instalacoes-adaptativo-unico',
    tipologia: 'instalacoes',
    subtipo: 'adaptativo',
    padrao: 'unico',
    nome: 'Engenharia de Instalações Completa',
    descricao: 'Briefing unificado para todos os sistemas de instalações (Hidráulicas, Elétricas, PPCI, AVAC, Gases)',
    totalPerguntas: 350,
    tempoEstimado: '50-70 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['instalacoes', 'hidraulicas', 'eletricas', 'ppci', 'avac', 'gases'],
      categoria: 'tecnico',
      complexidade: 'muito_alta',
      publico: ['engenheiros_instalacoes', 'projetistas']
    },
    secoes: [
      {
        id: 'dados-basicos',
        nome: '📋 Dados Básicos da Edificação',
        descricao: 'Informações gerais para dimensionamento das instalações',
        icon: '📋',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'select',
            pergunta: 'Tipo de edificação:',
            opcoes: ['Residencial', 'Comercial', 'Industrial', 'Institucional'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'number',
            pergunta: 'Número de pavimentos:',
            obrigatoria: true,
            min: 1,
            max: 50
          }
        ]
      },
      {
        id: 'instalacoes-hidraulicas',
        nome: '💧 Instalações Hidrossanitárias',
        descricao: 'Sistemas de água fria, quente, esgoto e águas pluviais',
        icon: '💧',
        obrigatoria: true,
        perguntas: [
          {
            id: 3,
            tipo: 'checkbox',
            pergunta: 'Sistemas hidráulicos necessários:',
            opcoes: ['Água fria', 'Água quente', 'Esgoto sanitário', 'Águas pluviais', 'Reuso de água'],
            obrigatoria: true
          }
        ]
      }
    ]
  }
};

// Função auxiliar para obter o briefing casa alto padrão original
export function obterBriefingCasaAltoPadrao() {
  return BRIEFINGS_ESPECIAIS['residencial-casa_padrao-alto_padrao'];
} 