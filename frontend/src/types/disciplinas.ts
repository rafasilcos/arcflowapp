// Arquivo de tipos para disciplinas

// ===== ESTRUTURA DE DISCIPLINAS COMPATÍVEL COM BRIEFINGS REAIS =====
// Sistema hierárquico: Disciplina → Área → Tipologia

export interface DisciplinaConfig {
  nome: string;
  icone: string;
  descricao: string;
  areas: Record<string, AreaConfig>;
  adaptativo?: boolean; // Para indicar se tem briefing adaptativo
}

export interface AreaConfig {
  nome: string;
  icone: string;
  descricao: string;
  tipologias: Record<string, TipologiaConfig>;
  adaptativo?: boolean; // Para áreas com briefing adaptativo
}

export interface TipologiaConfig {
  nome: string;
  icone: string;
  descricao: string;
  briefingId: string; // ID do briefing correspondente
  tempoEstimado: string;
  complexidade: 'baixa' | 'media' | 'alta' | 'muito_alta';
}

// ===== ESTRUTURA PRINCIPAL DE DISCIPLINAS BASEADA NOS BRIEFINGS REAIS =====
export const ESTRUTURA_DISCIPLINAS: Record<string, DisciplinaConfig> = {
  arquitetura: {
    nome: 'Arquitetura',
    icone: '🏛️',
    descricao: 'Projetos arquitetônicos completos para diferentes tipologias',
    areas: {
      residencial: {
        nome: 'Residencial',
        icone: '🏠',
        descricao: 'Projetos habitacionais unifamiliares e multifamiliares',
        tipologias: {
          unifamiliar: {
            nome: 'Unifamiliar',
            icone: '🏡',
            descricao: 'Casa, sobrado, geminado, apartamento',
            briefingId: 'unifamiliar',
            tempoEstimado: '60-75 min',
            complexidade: 'muito_alta'
          },
          multifamiliar: {
            nome: 'Multifamiliar',
            icone: '🏢',
            descricao: 'Prédios, conjunto de casas, condomínios de casas',
            briefingId: 'multifamiliar',
            tempoEstimado: '60-90 min',
            complexidade: 'muito_alta'
          }
        }
      },
      comercial: {
        nome: 'Comercial',
        icone: '🏪',
        descricao: 'Projetos para estabelecimentos comerciais e corporativos',
        tipologias: {
          escritorios: {
            nome: 'Escritórios e Consultórios',
            icone: '💼',
            descricao: 'Ambientes corporativos e profissionais',
            briefingId: 'escritorios',
            tempoEstimado: '45-60 min',
            complexidade: 'alta'
          },
          lojas: {
            nome: 'Lojas e Comércio',
            icone: '🛍️',
            descricao: 'Estabelecimentos comerciais e retail',
            briefingId: 'lojas',
            tempoEstimado: '45-60 min',
            complexidade: 'alta'
          },
          restaurantes: {
            nome: 'Restaurantes e Food Service',
            icone: '🍽️',
            descricao: 'Estabelecimentos de alimentação',
            briefingId: 'restaurantes',
            tempoEstimado: '45-60 min',
            complexidade: 'alta'
          },
          hotel_pousada: {
            nome: 'Hotéis e Pousadas',
            icone: '🏨',
            descricao: 'Empreendimentos de hospedagem',
            briefingId: 'hotel-pousada',
            tempoEstimado: '45-60 min',
            complexidade: 'muito_alta'
          }
        }
      },
      industrial: {
        nome: 'Industrial',
        icone: '🏭',
        descricao: 'Projetos para indústrias e galpões',
        tipologias: {
          galpao_industrial: {
            nome: 'Galpão Industrial',
            icone: '🏗️',
            descricao: 'Galpões industriais para armazenagem, produção e operações mistas',
            briefingId: 'galpao-industrial',
            tempoEstimado: '180-240 min',
            complexidade: 'muito_alta'
          }
        }
      },
      urbanismo: {
        nome: 'Urbanismo',
        icone: '🌆',
        descricao: 'Projetos urbanos e planejamento territorial',
        tipologias: {
          loteamentos: {
            nome: 'Loteamentos e Parcelamentos',
            icone: '🗺️',
            descricao: 'Loteamentos residenciais, parcelamentos urbanos e desenvolvimento imobiliário',
            briefingId: 'loteamentos',
            tempoEstimado: '120-180 min',
            complexidade: 'muito_alta'
          },
          projeto_urbano: {
            nome: 'Projeto Urbano',
            icone: '🏙️',
            descricao: 'Projetos urbanos com desenho urbano, planejamento territorial e desenvolvimento urbano integrado',
            briefingId: 'projeto-urbano',
            tempoEstimado: '65-80 min',
            complexidade: 'muito_alta'
          }
        }
      },
      design_interiores: {
        nome: 'Design de Interiores',
        icone: '🛋️',
        descricao: 'Projetos de ambientação e decoração',
        tipologias: {
          design_interiores: {
            nome: 'Design de Interiores',
            icone: '🏠',
            descricao: 'Projetos de design de interiores para residências',
            briefingId: 'design-interiores',
            tempoEstimado: '150-180 min',
            complexidade: 'muito_alta'
          }
        }
      },
      paisagismo: {
        nome: 'Paisagismo',
        icone: '🌿',
        descricao: 'Projetos de paisagismo e jardins',
        tipologias: {
          paisagismo: {
            nome: 'Paisagismo Especializado',
            icone: '🌳',
            descricao: 'Projetos de paisagismo residencial com análise climática e sustentabilidade',
            briefingId: 'paisagismo',
            tempoEstimado: '180-210 min',
            complexidade: 'muito_alta'
          }
        }
      }
    }
  },
  engenharia: {
    nome: 'Engenharia',
    icone: '⚙️',
    descricao: 'Projetos de engenharia com briefings adaptativos',
    adaptativo: true,
    areas: {
      estrutural: {
        nome: 'Estrutural',
        icone: '🏗️',
        descricao: 'Projetos estruturais adaptativos - PIONEIRO NO BRASIL',
        adaptativo: true,
        tipologias: {
          projeto_estrutural_adaptativo: {
            nome: 'Sistema Adaptativo',
            icone: '🔧',
            descricao: 'Briefing adaptativo que se ajusta automaticamente ao tipo de estrutura',
            briefingId: 'projeto-estrutural-adaptativo',
            tempoEstimado: '45-60 min',
            complexidade: 'alta'
          }
        }
      }
    }
  },
  instalacoes: {
    nome: 'Instalações',
    icone: '🔌',
    descricao: 'Projetos de instalações prediais com briefings adaptativos',
    adaptativo: true,
    areas: {
      prediais: {
        nome: 'Prediais',
        icone: '⚡',
        descricao: 'Instalações prediais adaptativas',
        adaptativo: true,
        tipologias: {
          instalacoes_adaptativo: {
            nome: 'Sistema Adaptativo',
            icone: '🔧',
            descricao: 'Briefing adaptativo para todas as instalações prediais',
            briefingId: 'instalacoes-adaptativo',
            tempoEstimado: '30-45 min',
            complexidade: 'media'
          }
        }
      }
    }
  }
};

// ===== MAPEAMENTO DE BRIEFINGS POR CATEGORIA =====
export const MAPEAMENTO_BRIEFINGS = {
  // CATEGORIA RESIDENCIAL
  'unifamiliar': {
    categoria: 'residencial',
    tipo: 'unifamiliar',
    nome: 'Residencial Unifamiliar',
    descricao: 'Casas, sobrados, apartamentos e residências individuais'
  },
  'multifamiliar': {
    categoria: 'residencial',
    tipo: 'multifamiliar',
    nome: 'Residencial Multifamiliar',
    descricao: 'Prédios, condomínios e conjuntos habitacionais'
  },
  
  // CATEGORIA COMERCIAL
  'escritorios': {
    categoria: 'comercial',
    tipo: 'escritorios',
    nome: 'Escritórios e Consultórios',
    descricao: 'Ambientes corporativos e profissionais'
  },
  'lojas': {
    categoria: 'comercial',
    tipo: 'lojas',
    nome: 'Lojas e Comércio',
    descricao: 'Estabelecimentos comerciais e retail'
  },
  'restaurantes': {
    categoria: 'comercial',
    tipo: 'restaurantes',
    nome: 'Restaurantes e Food Service',
    descricao: 'Estabelecimentos de alimentação'
  },
  'hotel-pousada': {
    categoria: 'comercial',
    tipo: 'hotel-pousada',
    nome: 'Hotéis e Pousadas',
    descricao: 'Empreendimentos de hospedagem'
  },
  
  // CATEGORIA INDUSTRIAL
  'galpao-industrial': {
    categoria: 'industrial',
    tipo: 'galpao-industrial',
    nome: 'Galpão Industrial',
    descricao: 'Galpões industriais para armazenagem, produção e operações mistas'
  },
  
  // CATEGORIA URBANÍSTICA
  'loteamentos': {
    categoria: 'residencial',
    tipo: 'loteamentos',
    nome: 'Loteamentos e Parcelamentos',
    descricao: 'Loteamentos residenciais, parcelamentos urbanos e desenvolvimento imobiliário'
  },
  'projeto-urbano': {
    categoria: 'urbanistico',
    tipo: 'projeto-urbano',
    nome: 'Projeto Urbano',
    descricao: 'Projetos urbanos com desenho urbano, planejamento territorial e desenvolvimento urbano integrado'
  },
  
  // CATEGORIA DESIGN E PAISAGISMO
  'design-interiores': {
    categoria: 'residencial',
    tipo: 'design-interiores',
    nome: 'Design de Interiores',
    descricao: 'Projetos de design de interiores para residências'
  },
  'paisagismo': {
    categoria: 'residencial',
    tipo: 'paisagismo',
    nome: 'Paisagismo Especializado',
    descricao: 'Projetos de paisagismo residencial com análise climática e sustentabilidade'
  },
  
  // CATEGORIA ESTRUTURAL (ADAPTATIVO)
  'projeto-estrutural-adaptativo': {
    categoria: 'estrutural',
    tipo: 'projeto-estrutural-adaptativo',
    nome: 'Projeto Estrutural Adaptativo',
    descricao: 'PRIMEIRO BRIEFING ADAPTATIVO DO BRASIL - Sistema inteligente que se adapta ao tipo de estrutura'
  },
  
  // CATEGORIA INSTALAÇÕES (ADAPTATIVO)
  'instalacoes-adaptativo': {
    categoria: 'instalacoes',
    tipo: 'instalacoes-adaptativo',
    nome: 'Instalações Prediais Adaptativas',
    descricao: 'Sistema adaptativo para todas as instalações prediais'
  }
};

// ===== FUNÇÕES UTILITÁRIAS =====

// Interface para seleção composta de disciplinas
export interface SelecaoComposta {
  disciplinas: string[];
  areas: Record<string, string>;
  tipologias: Record<string, string>;
  briefingIds: string[];
  ordemPreenchimento: string[];
}

// Função para validar seleção
export function validarSelecao(selecao: SelecaoComposta): { valida: boolean; erros: string[] } {
  const erros: string[] = [];
  
  // Validar se todas as disciplinas têm áreas selecionadas
  for (const disciplina of selecao.disciplinas) {
    if (!selecao.areas[disciplina]) {
      erros.push(`Área não selecionada para ${disciplina}`);
    }
  }
  
  // Validar se há briefings selecionados
  if (selecao.briefingIds.length === 0) {
    erros.push('Nenhum briefing selecionado');
  }
  
  return {
    valida: erros.length === 0,
    erros
  };
}

// Função para obter briefings por seleção
export function obterBriefingsPorSelecao(selecao: SelecaoComposta): string[] {
  return selecao.briefingIds;
}

// Função para verificar se disciplina é adaptativa
export function isDisciplinaAdaptativa(disciplina: string): boolean {
  const config = ESTRUTURA_DISCIPLINAS[disciplina];
  return config?.adaptativo === true;
}

// Função para verificar se área é adaptativa
export function isAreaAdaptativa(disciplina: string, area: string): boolean {
  const config = ESTRUTURA_DISCIPLINAS[disciplina]?.areas[area];
  return config?.adaptativo === true;
}

// Função para calcular ordem de preenchimento
export function calcularOrdemPreenchimento(disciplinas: string[]): string[] {
  // Priorizar briefings adaptativos primeiro (mais rápidos)
  const adaptativos = disciplinas.filter(d => isDisciplinaAdaptativa(d));
  const convencionais = disciplinas.filter(d => !isDisciplinaAdaptativa(d));
  
  return [...adaptativos, ...convencionais];
}
