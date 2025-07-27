// Utilitário para obter nomes formatados dos templates de briefing

interface TemplateNameMap {
  [disciplina: string]: {
    [area: string]: {
      [tipologia: string]: string;
    };
  };
}

// Mapeamento completo dos nomes dos templates
const TEMPLATE_NAMES: TemplateNameMap = {
  arquitetura: {
    residencial: {
      unifamiliar: 'Casa Unifamiliar',
      multifamiliar: 'Residencial Multifamiliar',
      design_interiores: 'Design de Interiores',
      'design-interiores': 'Design de Interiores',
      paisagismo: 'Paisagismo Residencial',
      loteamentos: 'Loteamentos Residenciais'
    },
    comercial: {
      escritorios: 'Escritórios e Consultórios',
      lojas: 'Lojas e Comércio',
      restaurantes: 'Restaurantes e Food Service',
      'hotel-pousada': 'Hotéis e Pousadas'
    },
    industrial: {
      'galpao-industrial': 'Galpão Industrial',
      galpao: 'Galpão Industrial'
    },
    urbanistico: {
      'projeto-urbano': 'Projeto Urbano',
      urbano: 'Projeto Urbano'
    }
  },
  engenharia: {
    estrutural: {
      'projeto-estrutural-adaptativo': 'Engenharia Estrutural',
      adaptativo: 'Engenharia Estrutural',
      estrutural: 'Engenharia Estrutural'
    }
  },
  instalacoes: {
    adaptativo: {
      'instalacoes-adaptativo-completo': 'Instalações Técnicas',
      completo: 'Instalações Técnicas',
      adaptativo: 'Instalações Técnicas'
    }
  }
};

/**
 * Obtém o nome formatado do template baseado na disciplina, área e tipologia
 */
export function getTemplateName(
  disciplina?: string, 
  area?: string, 
  tipologia?: string
): string {
  if (!disciplina) return 'Briefing';

  const disciplinaMap = TEMPLATE_NAMES[disciplina.toLowerCase()];
  if (!disciplinaMap) return 'Briefing';

  if (!area) return 'Briefing';

  const areaMap = disciplinaMap[area.toLowerCase()];
  if (!areaMap) return 'Briefing';

  if (!tipologia) {
    // Se não tem tipologia, usa o primeiro da área
    const firstKey = Object.keys(areaMap)[0];
    return areaMap[firstKey] || 'Briefing';
  }

  const templateName = areaMap[tipologia.toLowerCase()];
  return templateName || 'Briefing';
}

/**
 * Lista todos os templates disponíveis organizados por disciplina
 */
export function getAllTemplates() {
  const templates: Array<{
    disciplina: string;
    area: string;
    tipologia: string;
    nome: string;
  }> = [];

  Object.entries(TEMPLATE_NAMES).forEach(([disciplina, areas]) => {
    Object.entries(areas).forEach(([area, tipologias]) => {
      Object.entries(tipologias).forEach(([tipologia, nome]) => {
        templates.push({
          disciplina,
          area,
          tipologia,
          nome
        });
      });
    });
  });

  return templates;
}

/**
 * Obtém o ícone apropriado para a disciplina/área
 */
export function getTemplateIcon(disciplina?: string, area?: string): string {
  if (disciplina === 'engenharia') return '🏗️';
  if (disciplina === 'instalacoes') return '⚡';
  if (area === 'comercial') return '🏢';
  if (area === 'industrial') return '🏭';
  if (area === 'design_interiores' || area === 'design-interiores') return '🎨';
  if (area === 'paisagismo') return '��';
  return '🏠';
} 