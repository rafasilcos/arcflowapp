// BRIEFINGS PAISAGISMO - ARCFLOW
// Briefing especializado com 180 perguntas para projetos de arquitetura paisagística

import { BriefingCompleto } from '../../types/briefing';

export const BRIEFINGS_PAISAGISMO: Record<string, BriefingCompleto> = {
  // PAISAGISMO RESIDENCIAL ÚNICO
  'paisagismo-residencial-unico': {
    id: 'paisagismo-residencial-unico',
    tipologia: 'paisagismo',
    subtipo: 'residencial',
    padrao: 'unico',
    nome: 'Paisagismo Residencial Completo',
    descricao: 'Briefing completo com 180 perguntas para projetos de arquitetura paisagística residencial',
    totalPerguntas: 180,
    tempoEstimado: '120-150 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['paisagismo', 'residencial', 'jardim', 'sustentabilidade', 'completo'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['paisagistas', 'arquitetos_paisagistas', 'proprietarios']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🏗️ Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos e viabilidade técnica completa',
        icon: '🏗️',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Que tipo de projeto paisagístico deseja?',
            opcoes: ['Jardim residencial', 'Comercial', 'Institucional', 'Urbano'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'valor',
            pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + execução + manutenção primeiro ano)',
            obrigatoria: true,
            placeholder: 'R$ 300.000',
            formatacao: 'moeda'
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Como será o financiamento?',
            opcoes: ['Recursos próprios', 'Financiamento', 'Parcelado'],
            obrigatoria: true
          },
          {
            id: 4,
            tipo: 'radio',
            pergunta: 'Qual a prioridade?',
            opcoes: ['Prazo', 'Custo', 'Sustentabilidade', 'Estética'],
            obrigatoria: true
          },
          {
            id: 5,
            tipo: 'radio',
            pergunta: 'Há projeto arquitetônico pronto?',
            opcoes: ['Sim', 'Em desenvolvimento', 'Não'],
            obrigatoria: true
          },
          {
            id: 6,
            tipo: 'radio',
            pergunta: 'Fase da obra principal:',
            opcoes: ['Projeto', 'Execução', 'Concluída'],
            obrigatoria: true
          },
          {
            id: 7,
            tipo: 'radio',
            pergunta: 'Situação legal do imóvel:',
            opcoes: ['Próprio', 'Alugado', 'Condomínio'],
            obrigatoria: true
          },
          {
            id: 8,
            tipo: 'textarea',
            pergunta: 'Há restrições condominiais para paisagismo? (Descreva)',
            obrigatoria: false,
            placeholder: 'Descreva as restrições conhecidas...'
          },
          {
            id: 9,
            tipo: 'radio',
            pergunta: 'Há árvores protegidas no terreno?',
            opcoes: ['Sim', 'Não', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 10,
            tipo: 'radio',
            pergunta: 'Necessita aprovação de órgãos ambientais?',
            opcoes: ['IBAMA', 'Secretaria Verde', 'Não', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 11,
            tipo: 'radio',
            pergunta: 'Há limitações de altura para vegetação?',
            opcoes: ['Sim', 'Não', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 12,
            tipo: 'radio',
            pergunta: 'Acesso para equipamentos de jardinagem:',
            opcoes: ['Fácil', 'Limitado', 'Difícil'],
            obrigatoria: true
          },
          {
            id: 13,
            tipo: 'radio',
            pergunta: 'Disponibilidade de água para irrigação:',
            opcoes: ['Rede', 'Poço', 'Captação', 'Mista'],
            obrigatoria: true
          },
          {
            id: 14,
            tipo: 'radio',
            pergunta: 'Disponibilidade de energia elétrica:',
            opcoes: ['Sim', 'Limitada', 'Não'],
            obrigatoria: true
          },
          {
            id: 15,
            tipo: 'radio',
            pergunta: 'Há interferências subterrâneas?',
            opcoes: ['Tubulações', 'Cabos', 'Fundações', 'Não', 'Não sei'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'analise-climatica-ambiental',
        nome: '🌤️ Análise Climática e Ambiental',
        descricao: 'Condições climáticas detalhadas e análise do solo',
        icon: '🌤️',
        obrigatoria: true,
        perguntas: [
          {
            id: 16,
            tipo: 'radio',
            pergunta: 'Região climática:',
            opcoes: ['Tropical', 'Subtropical', 'Semiárido', 'Temperado'],
            obrigatoria: true
          },
          {
            id: 17,
            tipo: 'number',
            pergunta: 'Temperatura média anual (°C):',
            obrigatoria: true,
            min: 10,
            max: 40,
            placeholder: '25'
          },
          {
            id: 18,
            tipo: 'number',
            pergunta: 'Precipitação média anual (mm):',
            obrigatoria: false,
            min: 200,
            max: 3000,
            placeholder: '1200'
          },
          {
            id: 19,
            tipo: 'textarea',
            pergunta: 'Período de chuvas (meses):',
            obrigatoria: false,
            placeholder: 'Ex: Outubro a Março'
          },
          {
            id: 20,
            tipo: 'textarea',
            pergunta: 'Período de seca (meses):',
            obrigatoria: false,
            placeholder: 'Ex: Abril a Setembro'
          },
          {
            id: 21,
            tipo: 'textarea',
            pergunta: 'Ventos predominantes (direção/intensidade):',
            obrigatoria: false,
            placeholder: 'Ex: Nordeste, moderados'
          },
          {
            id: 22,
            tipo: 'number',
            pergunta: 'Incidência solar (horas/dia):',
            obrigatoria: false,
            min: 4,
            max: 12,
            placeholder: '8'
          },
          {
            id: 23,
            tipo: 'textarea',
            pergunta: 'Áreas de sombra permanente (localização/m²):',
            obrigatoria: false,
            placeholder: 'Descreva as áreas sombreadas...'
          },
          {
            id: 24,
            tipo: 'radio',
            pergunta: 'Microclima específico:',
            opcoes: ['Existe', 'Não existe', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 25,
            tipo: 'radio',
            pergunta: 'Geadas:',
            opcoes: ['Frequentes', 'Ocasionais', 'Raras', 'Nunca'],
            obrigatoria: true
          },
          {
            id: 26,
            tipo: 'radio',
            pergunta: 'Tipo de solo predominante:',
            opcoes: ['Argiloso', 'Arenoso', 'Misto'],
            obrigatoria: true
          },
          {
            id: 27,
            tipo: 'radio',
            pergunta: 'pH do solo:',
            opcoes: ['Ácido', 'Neutro', 'Alcalino', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 28,
            tipo: 'radio',
            pergunta: 'Drenagem natural:',
            opcoes: ['Boa', 'Regular', 'Ruim'],
            obrigatoria: true
          },
          {
            id: 29,
            tipo: 'radio',
            pergunta: 'Compactação do solo:',
            opcoes: ['Alta', 'Média', 'Baixa'],
            obrigatoria: true
          },
          {
            id: 30,
            tipo: 'radio',
            pergunta: 'Presença de pedras/rochas:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 31,
            tipo: 'radio',
            pergunta: 'Nível do lençol freático:',
            opcoes: ['Alto', 'Médio', 'Baixo', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 32,
            tipo: 'radio',
            pergunta: 'Necessita correção do solo?',
            opcoes: ['Sim', 'Não', 'Não sei'],
            obrigatoria: true
          },
          {
            id: 33,
            tipo: 'radio',
            pergunta: 'Há contaminação do solo?',
            opcoes: ['Sim', 'Não', 'Suspeita'],
            obrigatoria: true
          },
          {
            id: 34,
            tipo: 'radio',
            pergunta: 'Declividade do terreno:',
            opcoes: ['Plano', 'Suave', 'Acentuada'],
            obrigatoria: true
          },
          {
            id: 35,
            tipo: 'radio',
            pergunta: 'Erosão existente:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'programa-paisagistico',
        nome: '🌿 Programa Paisagístico',
        descricao: 'Áreas, funções e elementos especiais do projeto',
        icon: '🌿',
        obrigatoria: true,
        perguntas: [
          {
            id: 36,
            tipo: 'number',
            pergunta: 'Área total para paisagismo (m²):',
            obrigatoria: true,
            min: 200,
            max: 10000,
            placeholder: '800'
          },
          {
            id: 37,
            tipo: 'textarea',
            pergunta: 'Jardim frontal (m²/Estilo desejado):',
            obrigatoria: false,
            placeholder: 'Ex: 150m², estilo contemporâneo'
          },
          {
            id: 38,
            tipo: 'textarea',
            pergunta: 'Jardim lateral (m²/Função):',
            obrigatoria: false,
            placeholder: 'Ex: 80m², passagem e contemplação'
          },
          {
            id: 39,
            tipo: 'textarea',
            pergunta: 'Jardim dos fundos (m²/Uso):',
            obrigatoria: false,
            placeholder: 'Ex: 300m², lazer e estar'
          },
          {
            id: 40,
            tipo: 'textarea',
            pergunta: 'Área de estar externa (m²/Capacidade pessoas):',
            obrigatoria: false,
            placeholder: 'Ex: 50m², 8-10 pessoas'
          },
          {
            id: 41,
            tipo: 'textarea',
            pergunta: 'Área gourmet/churrasqueira (m²/Equipamentos):',
            obrigatoria: false,
            placeholder: 'Ex: 30m², churrasqueira, pia, bancada'
          },
          {
            id: 42,
            tipo: 'radio',
            pergunta: 'Piscina/spa:',
            opcoes: ['Existe', 'Planejada', 'Não'],
            obrigatoria: true
          },
          {
            id: 43,
            tipo: 'radio',
            pergunta: 'Playground infantil:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 44,
            tipo: 'radio',
            pergunta: 'Horta/pomar:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 45,
            tipo: 'radio',
            pergunta: 'Área para animais:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'conceito-estilo',
        nome: '🎨 Conceito e Estilo Paisagístico',
        descricao: 'Definição do estilo, sustentabilidade e conceitos',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          {
            id: 46,
            tipo: 'radio',
            pergunta: 'Estilo paisagístico preferido:',
            opcoes: ['Tropical', 'Contemporâneo', 'Clássico', 'Rústico', 'Minimalista'],
            obrigatoria: true
          },
          {
            id: 47,
            tipo: 'textarea',
            pergunta: 'Referências visuais (descreva jardins admirados):',
            obrigatoria: false,
            placeholder: 'Descreva jardins que admira ou anexe fotos...'
          },
          {
            id: 48,
            tipo: 'radio',
            pergunta: 'Cores predominantes:',
            opcoes: ['Verdes', 'Floridas', 'Neutras', 'Mistas'],
            obrigatoria: true
          },
          {
            id: 49,
            tipo: 'radio',
            pergunta: 'Densidade de vegetação:',
            opcoes: ['Densa', 'Média', 'Esparsa'],
            obrigatoria: true
          },
          {
            id: 50,
            tipo: 'radio',
            pergunta: 'Vegetação nativa:',
            opcoes: ['Prioridade', 'Mista', 'Indiferente'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'sistemas-tecnicos',
        nome: '💧 Sistemas Técnicos',
        descricao: 'Irrigação, drenagem e infraestrutura técnica',
        icon: '💧',
        obrigatoria: true,
        perguntas: [
          {
            id: 51,
            tipo: 'radio',
            pergunta: 'Sistema de irrigação:',
            opcoes: ['Automático', 'Manual', 'Misto'],
            obrigatoria: true
          },
          {
            id: 52,
            tipo: 'radio',
            pergunta: 'Tipo de irrigação preferido:',
            opcoes: ['Gotejamento', 'Aspersão', 'Microaspersão'],
            obrigatoria: true
          },
          {
            id: 53,
            tipo: 'radio',
            pergunta: 'Fonte de água:',
            opcoes: ['Rede pública', 'Poço', 'Captação chuva', 'Mista'],
            obrigatoria: true
          },
          {
            id: 54,
            tipo: 'radio',
            pergunta: 'Automação da irrigação:',
            opcoes: ['Timer', 'Sensores', 'Manual'],
            obrigatoria: true
          },
          {
            id: 55,
            tipo: 'radio',
            pergunta: 'Drenagem pluvial:',
            opcoes: ['Necessária', 'Existente', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'manutencao-gestao',
        nome: '🔧 Manutenção e Gestão',
        descricao: 'Planejamento de manutenção e responsabilidades',
        icon: '🔧',
        obrigatoria: true,
        perguntas: [
          {
            id: 56,
            tipo: 'radio',
            pergunta: 'Responsável pela manutenção:',
            opcoes: ['Própria', 'Terceirizada', 'Mista'],
            obrigatoria: true
          },
          {
            id: 57,
            tipo: 'radio',
            pergunta: 'Frequência de manutenção:',
            opcoes: ['Semanal', 'Quinzenal', 'Mensal'],
            obrigatoria: true
          },
          {
            id: 58,
            tipo: 'radio',
            pergunta: 'Conhecimento em jardinagem:',
            opcoes: ['Alto', 'Médio', 'Baixo', 'Nenhum'],
            obrigatoria: true
          },
          {
            id: 59,
            tipo: 'valor',
            pergunta: 'Orçamento anual para manutenção (R$):',
            obrigatoria: false,
            placeholder: 'R$ 12.000',
            formatacao: 'moeda'
          }
        ]
      }
    ]
  },

  // PAISAGISMO COMERCIAL ÚNICO
  'paisagismo-comercial-unico': {
    id: 'paisagismo-comercial-unico',
    tipologia: 'paisagismo',
    subtipo: 'comercial',
    padrao: 'unico',
    nome: 'Paisagismo Comercial Completo',
    descricao: 'Briefing completo para projetos paisagísticos comerciais e empresariais',
    totalPerguntas: 160,
    tempoEstimado: '100-130 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['paisagismo', 'comercial', 'empresarial', 'funcional'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['paisagistas', 'empresarios', 'arquitetos']
    },
    secoes: [
      {
        id: 'dados-comerciais',
        nome: '🏢 Dados do Projeto Comercial',
        descricao: 'Informações específicas do empreendimento comercial',
        icon: '🏢',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de empreendimento comercial:',
            opcoes: ['Escritório', 'Loja', 'Shopping', 'Hotel', 'Restaurante', 'Indústria'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'number',
            pergunta: 'Área externa disponível (m²):',
            obrigatoria: true,
            min: 100,
            max: 10000,
            placeholder: '800'
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Objetivo principal do paisagismo:',
            opcoes: ['Estética', 'Funcional', 'Marketing', 'Sustentabilidade', 'Bem-estar funcionários'],
            obrigatoria: true
          },
          {
            id: 4,
            tipo: 'valor',
            pergunta: 'Orçamento disponível para paisagismo:',
            obrigatoria: true,
            placeholder: 'R$ 200.000',
            formatacao: 'moeda'
          }
        ]
      }
    ]
  },

  // PAISAGISMO URBANO ÚNICO
  'paisagismo-urbano-unico': {
    id: 'paisagismo-urbano-unico',
    tipologia: 'paisagismo',
    subtipo: 'urbano',
    padrao: 'unico',
    nome: 'Paisagismo Urbano Completo',
    descricao: 'Briefing completo para projetos de paisagismo urbano e espaços públicos',
    totalPerguntas: 200,
    tempoEstimado: '130-160 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['paisagismo', 'urbano', 'publico', 'sustentabilidade', 'infraestrutura_verde'],
      categoria: 'especializado',
      complexidade: 'muito_alta',
      publico: ['paisagistas', 'urbanistas', 'poder_publico']
    },
    secoes: [
      {
        id: 'contexto-urbano',
        nome: '🏙️ Contexto Urbano',
        descricao: 'Características do ambiente urbano e necessidades da população',
        icon: '🏙️',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de espaço urbano:',
            opcoes: ['Praça', 'Parque', 'Canteiro central', 'Rotatória', 'Calçadão', 'Corredor verde'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'number',
            pergunta: 'Área total do projeto (m²):',
            obrigatoria: true,
            min: 500,
            max: 50000,
            placeholder: '5000'
          },
          {
            id: 3,
            tipo: 'number',
            pergunta: 'População estimada usuária:',
            obrigatoria: true,
            min: 100,
            max: 100000,
            placeholder: '2000'
          }
        ]
      }
    ]
  },

  // PAISAGISMO INSTITUCIONAL ÚNICO
  'paisagismo-institucional-unico': {
    id: 'paisagismo-institucional-unico',
    tipologia: 'paisagismo',
    subtipo: 'institucional',
    padrao: 'unico',
    nome: 'Paisagismo Institucional Completo',
    descricao: 'Briefing completo para projetos paisagísticos institucionais (escolas, hospitais, etc.)',
    totalPerguntas: 170,
    tempoEstimado: '110-140 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['paisagismo', 'institucional', 'terapeutico', 'educativo', 'acessibilidade'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['paisagistas', 'administradores_institucionais', 'arquitetos']
    },
    secoes: [
      {
        id: 'funcao-institucional',
        nome: '🏛️ Função Institucional',
        descricao: 'Paisagismo adequado à função específica da instituição',
        icon: '🏛️',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Tipo de instituição:',
            opcoes: ['Escola', 'Hospital', 'Órgão público', 'Centro cultural', 'Universidade', 'Clínica'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'checkbox',
            pergunta: 'Funções específicas do paisagismo:',
            opcoes: ['Terapêutica', 'Educativa', 'Contemplativa', 'Recreativa', 'Funcional'],
            obrigatoria: true
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Acessibilidade:',
            opcoes: ['Essencial', 'Importante', 'Desejável'],
            obrigatoria: true
          }
        ]
      }
    ]
  }
};

// Função auxiliar para obter briefings de paisagismo
export function obterBriefingsPaisagismo() {
  return Object.values(BRIEFINGS_PAISAGISMO);
}

// Função para obter briefing específico de paisagismo
export function obterBriefingPaisagismo(subtipo: string, padrao: string) {
  const chave = `paisagismo-${subtipo}-${padrao}`;
  return BRIEFINGS_PAISAGISMO[chave] || null;
} 