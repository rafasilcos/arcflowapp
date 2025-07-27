// BRIEFINGS DESIGN DE INTERIORES - ARCFLOW
// 12 briefings especializados para design de interiores

import { BriefingCompleto } from '../../types/briefing';

export const BRIEFINGS_DESIGN_INTERIORES: Record<string, BriefingCompleto> = {
  // DESIGN RESIDENCIAL - BÁSICO
  'design-residencial-basico': {
    id: 'design-residencial-basico',
    tipologia: 'design',
    subtipo: 'residencial',
    padrao: 'basico',
    nome: 'Design de Interiores Residencial Básico',
    descricao: 'Briefing para projetos de interiores residenciais simples e funcionais',
    totalPerguntas: 95,
    tempoEstimado: '25-35 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'residencial', 'basico'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'perfil-moradores',
        nome: '👥 Perfil dos Moradores',
        descricao: 'Características e necessidades dos moradores',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'number',
            pergunta: 'Quantas pessoas moram na residência?',
            obrigatoria: true,
            min: 1,
            max: 10
          },
          {
            id: 2,
            tipo: 'checkbox',
            pergunta: 'Faixa etária dos moradores:',
            opcoes: ['Crianças (0-12)', 'Adolescentes (13-17)', 'Adultos (18-59)', 'Idosos (60+)'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN RESIDENCIAL - INTERMEDIÁRIO
  'design-residencial-intermediario': {
    id: 'design-residencial-intermediario',
    tipologia: 'design',
    subtipo: 'residencial',
    padrao: 'intermediario',
    nome: 'Design de Interiores Residencial Intermediário',
    descricao: 'Briefing para projetos residenciais com elementos elaborados',
    totalPerguntas: 140,
    tempoEstimado: '35-45 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'residencial', 'intermediario'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'estilo-conceito',
        nome: '🎨 Estilo e Conceito',
        descricao: 'Definição do estilo e conceito do projeto',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Estilo de design preferido:',
            opcoes: ['Contemporâneo', 'Moderno', 'Clássico', 'Industrial', 'Escandinavo', 'Tropical'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN RESIDENCIAL - AVANÇADO
  'design-residencial-avancado': {
    id: 'design-residencial-avancado',
    tipologia: 'design',
    subtipo: 'residencial',
    padrao: 'avancado',
    nome: 'Design de Interiores Residencial Avançado',
    descricao: 'Briefing completo para projetos residenciais sofisticados',
    totalPerguntas: 190,
    tempoEstimado: '45-60 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'residencial', 'avancado'],
      categoria: 'avancado',
      complexidade: 'alta',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'automacao-tecnologia',
        nome: '🤖 Automação e Tecnologia',
        descricao: 'Integração de tecnologia e automação',
        icon: '🤖',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Sistemas de automação desejados:',
            opcoes: ['Iluminação inteligente', 'Climatização automatizada', 'Som ambiente', 'Cortinas motorizadas'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN COMERCIAL - BÁSICO
  'design-comercial-basico': {
    id: 'design-comercial-basico',
    tipologia: 'design',
    subtipo: 'comercial',
    padrao: 'basico',
    nome: 'Design de Interiores Comercial Básico',
    descricao: 'Briefing para projetos comerciais funcionais',
    totalPerguntas: 105,
    tempoEstimado: '30-40 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'comercial', 'basico'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'identidade-marca',
        nome: '🏪 Identidade da Marca',
        descricao: 'Alinhamento do design com a identidade da marca',
        icon: '🏪',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'text',
            pergunta: 'Nome da marca/estabelecimento:',
            obrigatoria: true,
            placeholder: 'Ex: Café da Esquina'
          }
        ]
      }
    ]
  },

  // DESIGN COMERCIAL - INTERMEDIÁRIO
  'design-comercial-intermediario': {
    id: 'design-comercial-intermediario',
    tipologia: 'design',
    subtipo: 'comercial',
    padrao: 'intermediario',
    nome: 'Design de Interiores Comercial Intermediário',
    descricao: 'Briefing para projetos comerciais diferenciados',
    totalPerguntas: 145,
    tempoEstimado: '35-50 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'comercial', 'intermediario'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'experiencia-cliente',
        nome: '✨ Experiência do Cliente',
        descricao: 'Design focado na experiência do cliente',
        icon: '✨',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Objetivo principal do ambiente:',
            opcoes: ['Aumentar tempo de permanência', 'Facilitar circulação', 'Destacar produtos', 'Criar atmosfera única'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN COMERCIAL - AVANÇADO
  'design-comercial-avancado': {
    id: 'design-comercial-avancado',
    tipologia: 'design',
    subtipo: 'comercial',
    padrao: 'avancado',
    nome: 'Design de Interiores Comercial Avançado',
    descricao: 'Briefing completo para projetos comerciais sofisticados',
    totalPerguntas: 175,
    tempoEstimado: '40-55 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'comercial', 'avancado'],
      categoria: 'avancado',
      complexidade: 'alta',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'inovacao-design',
        nome: '🚀 Inovação em Design',
        descricao: 'Elementos inovadores e diferenciadores',
        icon: '🚀',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Elementos inovadores desejados:',
            opcoes: ['Realidade aumentada', 'Superfícies interativas', 'Iluminação dinâmica', 'Materiais inteligentes'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN CORPORATIVO - BÁSICO
  'design-corporativo-basico': {
    id: 'design-corporativo-basico',
    tipologia: 'design',
    subtipo: 'corporativo',
    padrao: 'basico',
    nome: 'Design de Interiores Corporativo Básico',
    descricao: 'Briefing para escritórios e ambientes corporativos básicos',
    totalPerguntas: 110,
    tempoEstimado: '30-40 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'corporativo', 'basico'],
      categoria: 'basico',
      complexidade: 'baixa',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'cultura-organizacional',
        nome: '🏢 Cultura Organizacional',
        descricao: 'Alinhamento do design com a cultura da empresa',
        icon: '🏢',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de empresa:',
            opcoes: ['Startup', 'Empresa tradicional', 'Consultoria', 'Tecnologia', 'Financeira'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN CORPORATIVO - INTERMEDIÁRIO
  'design-corporativo-intermediario': {
    id: 'design-corporativo-intermediario',
    tipologia: 'design',
    subtipo: 'corporativo',
    padrao: 'intermediario',
    nome: 'Design de Interiores Corporativo Intermediário',
    descricao: 'Briefing para ambientes corporativos elaborados',
    totalPerguntas: 150,
    tempoEstimado: '35-50 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'corporativo', 'intermediario'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'bem-estar-produtividade',
        nome: '💼 Bem-estar e Produtividade',
        descricao: 'Design focado no bem-estar e produtividade',
        icon: '💼',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Elementos para bem-estar:',
            opcoes: ['Plantas e verde', 'Luz natural', 'Espaços de descanso', 'Acústica controlada'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN CORPORATIVO - AVANÇADO
  'design-corporativo-avancado': {
    id: 'design-corporativo-avancado',
    tipologia: 'design',
    subtipo: 'corporativo',
    padrao: 'avancado',
    nome: 'Design de Interiores Corporativo Avançado',
    descricao: 'Briefing completo para grandes corporações',
    totalPerguntas: 185,
    tempoEstimado: '45-60 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'corporativo', 'avancado'],
      categoria: 'avancado',
      complexidade: 'alta',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'workplace-futuro',
        nome: '🔮 Workplace do Futuro',
        descricao: 'Conceitos avançados de ambiente de trabalho',
        icon: '🔮',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Conceitos do workplace do futuro:',
            opcoes: ['Trabalho híbrido', 'Espaços flexíveis', 'Tecnologia integrada', 'Sustentabilidade'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN HOSPITALITY - BÁSICO
  'design-hospitality-basico': {
    id: 'design-hospitality-basico',
    tipologia: 'design',
    subtipo: 'hospitality',
    padrao: 'basico',
    nome: 'Design de Interiores Hospitality Básico',
    descricao: 'Briefing para hotéis, restaurantes e hospitalidade básica',
    totalPerguntas: 115,
    tempoEstimado: '30-45 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'hospitality', 'basico'],
      categoria: 'basico',
      complexidade: 'media',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'conceito-hospitalidade',
        nome: '🏨 Conceito de Hospitalidade',
        descricao: 'Definição do conceito e experiência desejada',
        icon: '🏨',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de estabelecimento:',
            opcoes: ['Hotel', 'Restaurante', 'Café', 'Bar', 'Pousada'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN HOSPITALITY - INTERMEDIÁRIO
  'design-hospitality-intermediario': {
    id: 'design-hospitality-intermediario',
    tipologia: 'design',
    subtipo: 'hospitality',
    padrao: 'intermediario',
    nome: 'Design de Interiores Hospitality Intermediário',
    descricao: 'Briefing para projetos de hospitalidade elaborados',
    totalPerguntas: 155,
    tempoEstimado: '40-55 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'hospitality', 'intermediario'],
      categoria: 'intermediario',
      complexidade: 'media',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'experiencia-sensorial',
        nome: '🌟 Experiência Sensorial',
        descricao: 'Design focado na experiência sensorial completa',
        icon: '🌟',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Elementos sensoriais:',
            opcoes: ['Aromatização', 'Trilha sonora', 'Texturas especiais', 'Iluminação cênica'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN HOSPITALITY - AVANÇADO
  'design-hospitality-avancado': {
    id: 'design-hospitality-avancado',
    tipologia: 'design',
    subtipo: 'hospitality',
    padrao: 'avancado',
    nome: 'Design de Interiores Hospitality Avançado',
    descricao: 'Briefing completo para projetos de hospitalidade sofisticados',
    totalPerguntas: 195,
    tempoEstimado: '50-70 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'hospitality', 'avancado'],
      categoria: 'avancado',
      complexidade: 'muito_alta',
      publico: ['designers', 'arquitetos']
    },
    secoes: [
      {
        id: 'luxury-experience',
        nome: '💎 Experiência de Luxo',
        descricao: 'Elementos de design para experiências de luxo',
        icon: '💎',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'checkbox',
            pergunta: 'Elementos de luxo:',
            opcoes: ['Materiais nobres', 'Arte exclusiva', 'Tecnologia invisível', 'Serviços personalizados'],
            obrigatoria: true
          }
        ]
      }
    ]
  }
};

// Função auxiliar para obter briefings de design
export function obterBriefingsDesign() {
  return BRIEFINGS_DESIGN_INTERIORES;
}

// Função para obter briefing específico de design
export function obterBriefingDesign(subtipo: string, padrao: string) {
  const chave = `design-${subtipo}-${padrao}`;
  return BRIEFINGS_DESIGN_INTERIORES[chave] || null;
} 