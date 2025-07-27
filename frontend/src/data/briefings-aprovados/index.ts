// SISTEMA DE BRIEFINGS APROVADOS - ARCFLOW
// Importações dinâmicas por categoria para melhor performance

import { BriefingCompleto } from '../../types/briefing';

// Importações das categorias
// import { briefingsComercial, metadataComercial } from './comercial';
// import { briefingsResidencial, metadataResidencial } from './residencial';
// import { briefingsIndustrial, metadataIndustrial } from './industrial';
// import { briefingsUrbanistico, metadataUrbanistico } from './urbanistico';
// import { briefingsEstruturais } from './estrutural';
import { briefingInstalacoes, metadataInstalacoes } from './instalacoes';

// Mapa de briefings por categoria (importação dinâmica)
const BRIEFINGS_POR_CATEGORIA = new Map<string, Map<string, () => Promise<{ default: BriefingCompleto }>>>([
  // CATEGORIA COMERCIAL (100% implementada)
  ['comercial', new Map([
    ['escritorios', () => import('./comercial/escritorios').then(m => ({ default: m.BRIEFING_COMERCIAL_ESCRITORIOS }))],
    ['lojas', () => import('./comercial/lojas').then(m => ({ default: m.BRIEFING_COMERCIAL_LOJAS }))],
    ['restaurantes', () => import('./comercial/restaurantes').then(m => ({ default: m.BRIEFING_COMERCIAL_RESTAURANTES }))],
    ['hotel-pousada', () => import('./comercial/hotel-pousada').then(m => ({ default: m.BRIEFING_COMERCIAL_HOTEL_POUSADA }))],
  ])],
  
  // CATEGORIA RESIDENCIAL (Parcialmente implementada)
  ['residencial', new Map([
    ['unifamiliar', () => import('./residencial/unifamiliar').then(m => ({ default: m.BRIEFING_RESIDENCIAL_UNIFAMILIAR }))],
    ['multifamiliar', () => import('./residencial/multifamiliar').then(m => ({ default: m.BRIEFING_RESIDENCIAL_MULTIFAMILIAR }))],
    ['paisagismo', () => import('./residencial/paisagismo').then(m => ({ default: m.briefingPaisagismo }))],
    ['design-interiores', () => import('./residencial/design-interiores').then(m => ({ default: m.designInteriores }))],
    ['loteamentos', () => import('./residencial/loteamentos').then(m => ({ default: m.briefingLoteamentos }))],
  ])],
  
  // CATEGORIA INDUSTRIAL (100% implementada)
  ['industrial', new Map([
    ['galpao-industrial', () => import('./industrial/galpao-industrial').then(m => ({ default: m.briefingGalpaoIndustrial }))],
    // Futuros briefings industriais:
    // ['fabrica-producao', () => import('./industrial/fabrica-producao').then(m => ({ default: m.briefingFabricaProducao }))],
    // ['centro-distribuicao', () => import('./industrial/centro-distribuicao').then(m => ({ default: m.briefingCentroDistribuicao }))],
  ])],
  
  // CATEGORIA URBANÍSTICA (100% implementada - PIONEIRA NO BRASIL)
  ['urbanistico', new Map([
    ['projeto-urbano', () => import('./urbanistico/projeto-urbano').then(m => ({ default: m.briefingProjetoUrbano }))],
    // Futuros briefings urbanísticos:
    // ['revitalizacao-urbana', () => import('./urbanistico/revitalizacao-urbana').then(m => ({ default: m.briefingRevitalizacaoUrbana }))],
    // ['plano-diretor', () => import('./urbanistico/plano-diretor').then(m => ({ default: m.briefingPlanoDiretor }))],
  ])],
  
  // CATEGORIA ESTRUTURAL (100% implementada - PRIMEIRO BRIEFING ADAPTATIVO DO BRASIL)
  ['estrutural', new Map([
    ['projeto-estrutural-adaptativo', () => import('./estrutural/projeto-estrutural-adaptativo').then(m => ({ default: m.briefingEstrutural }))],
    // Futuros briefings estruturais:
    // ['reforco-estrutural', () => import('./estrutural/reforco-estrutural').then(m => ({ default: m.briefingReforcoEstrutural }))],
    // ['estruturas-especiais', () => import('./estrutural/estruturas-especiais').then(m => ({ default: m.briefingEstruturasEspeciais }))],
  ])],
  
  // CATEGORIA INSTALAÇÕES (100% implementada - PRIMEIRO BRIEFING ADAPTATIVO DE INSTALAÇÕES DO BRASIL)
  ['instalacoes', new Map([
    ['instalacoes-adaptativo-completo', () => import('./instalacoes/briefing-instalacoes-adaptativo-completo').then(m => ({ default: m.briefingInstalacoes }))],
  ])],
  
  // CATEGORIAS FUTURAS (planejadas para 2025)
  // ['institucional', new Map([...])],
]);

// Mapeamento de todos os briefings por categoria
// export const briefingsAprovados = {
//   comercial: briefingsComercial,
//   residencial: briefingsResidencial,
//   industrial: briefingsIndustrial,
//   urbanistico: briefingsUrbanistico,
//   estrutural: briefingsEstruturais
// };

// Metadados de todas as categorias
// export const metadatasCategorias = {
//   comercial: metadataComercial,
//   residencial: metadataResidencial,
//   industrial: metadataIndustrial,  
//   urbanistico: metadataUrbanistico,
//   estrutural: {
//     nome: 'Estrutural',
//     descricao: 'Briefings estruturais adaptativos - PIONEIRO NO BRASIL',
//     icone: '🏗️',
//     totalBriefings: 1,
//     totalPerguntas: 162,
//     status: 'revolucionario',
//     implementado: true,
//     caracteristicas: [
//       'PRIMEIRO BRIEFING ADAPTATIVO DO BRASIL',
//       'Seções condicionais inteligentes',
//       'Suporte a 6 sistemas estruturais',
//       'Lógica condicional avançada',
//       'Assinatura digital integrada'
//     ]
//   }
// };

// Função principal para obter briefing
export async function getBriefingAprovado(categoria: string, tipo: string): Promise<BriefingCompleto | null> {
  const categoriaBriefings = BRIEFINGS_POR_CATEGORIA.get(categoria);
  if (!categoriaBriefings) {
    console.warn(`Categoria '${categoria}' não encontrada`);
    return null;
  }

  const briefingLoader = categoriaBriefings.get(tipo);
  if (!briefingLoader) {
    console.warn(`Briefing '${tipo}' não encontrado na categoria '${categoria}'`);
    return null;
  }

  try {
    const briefingModule = await briefingLoader();
    return briefingModule.default;
  } catch (error) {
    console.error(`Erro ao carregar briefing '${categoria}/${tipo}':`, error);
    return null;
  }
}

// Lista de briefings disponíveis organizados por categoria
export const BRIEFINGS_DISPONIVEIS = {
  comercial: [
    {
      id: 'escritorios',
      nome: 'Escritórios e Consultórios',
      descricao: 'Ambientes corporativos e profissionais',
      totalPerguntas: 238,
      tempoEstimado: '45-60 min',
      complexidade: 'alta' as const,
      status: 'disponivel' as const
    },
    {
      id: 'lojas',
      nome: 'Lojas e Comércio',
      descricao: 'Estabelecimentos comerciais e retail',
      totalPerguntas: 218,
      tempoEstimado: '45-60 min',
      complexidade: 'alta' as const,
      status: 'disponivel' as const
    },
    {
      id: 'restaurantes',
      nome: 'Restaurantes e Food Service',
      descricao: 'Estabelecimentos de alimentação',
      totalPerguntas: 238,
      tempoEstimado: '45-60 min',
      complexidade: 'alta' as const,
      status: 'disponivel' as const
    },
    {
      id: 'hotel-pousada',
      nome: 'Hotéis e Pousadas',
      descricao: 'Empreendimentos de hospedagem',
      totalPerguntas: 224,
      tempoEstimado: '45-60 min',
      complexidade: 'muito_alta' as const,
      status: 'disponivel' as const
    }
  ],
  residencial: [
    {
      id: 'multifamiliar',
      nome: 'Residencial Multifamiliar',
      descricao: 'Prédios, condomínios e conjuntos habitacionais',
      totalPerguntas: 157,
      tempoEstimado: '60-90 min',
      complexidade: 'muito_alta' as const,
      status: 'disponivel' as const
    },
    {
      id: 'paisagismo',
      nome: 'Paisagismo Residencial',
      descricao: 'Projetos de paisagismo e jardins residenciais',
      totalPerguntas: 180,
      tempoEstimado: '180-210 min',
      complexidade: 'muito_alta' as const,
      status: 'disponivel' as const
    }
  ],
  industrial: [
    {
      id: 'galpao-industrial',
      nome: 'Galpão Industrial Especializado',
      descricao: 'Galpões industriais para armazenagem, produção e operações mistas',
      totalPerguntas: 170,
      tempoEstimado: '180-240 min',
      complexidade: 'muito_alta' as const,
      status: 'disponivel' as const
    }
  ],
  urbanistico: [
    {
      id: 'projeto-urbano',
      nome: 'Projeto Urbano Especializado',
      descricao: 'Briefing completo para projetos urbanos com desenho urbano, planejamento territorial e desenvolvimento urbano integrado',
      totalPerguntas: 260,
      tempoEstimado: '65-80 min',
      complexidade: 'muito_alta' as const,
      status: 'disponivel' as const
    }
  ]
} as const;

// Função para listar briefings de uma categoria
export function listarBriefingsPorCategoria(categoria: keyof typeof BRIEFINGS_DISPONIVEIS) {
  return BRIEFINGS_DISPONIVEIS[categoria] || [];
}

// Função para obter estatísticas do sistema
export function getEstatisticasBriefings() {
  const totalCategorias = Object.keys(BRIEFINGS_DISPONIVEIS).length;
  const totalBriefings = Object.values(BRIEFINGS_DISPONIVEIS).reduce((acc, briefings) => acc + briefings.length, 0);
  const totalPerguntas = Object.values(BRIEFINGS_DISPONIVEIS)
    .flat()
    .reduce((acc, briefing) => acc + briefing.totalPerguntas, 0);

  return {
    totalCategorias,
    totalBriefings,
    totalPerguntas,
    categorias: Object.keys(BRIEFINGS_DISPONIVEIS),
    status: 'Sistema de Briefings Revolucionário - Primeira Categoria Industrial do Brasil 2024'
  };
}

// Função para buscar briefing específico - COMENTADA TEMPORARIAMENTE
// export async function buscarBriefing(tipologia: string, subtipo: string) {
//   const categoria = briefingsAprovados[tipologia as keyof typeof briefingsAprovados];
//   if (!categoria) {
//     throw new Error(`Categoria ${tipologia} não encontrada`);
//   }
//   
//   const briefingLoader = categoria[subtipo as keyof typeof categoria];
//   if (!briefingLoader) {
//     throw new Error(`Briefing ${subtipo} não encontrado na categoria ${tipologia}`);
//   }
//   
//   return await briefingLoader();
// }

// Estatísticas gerais do sistema
export const estatisticasGerais = {
  totalCategorias: 4,
  totalBriefings: 8,
  totalPerguntas: 1575,
  categorias: [
    {
      nome: 'Comercial',
      briefings: 4,
      perguntas: 918,
      status: 'ativo'
    },
    {
      nome: 'Residencial',
      briefings: 2,
      perguntas: 337,
      status: 'ativo' 
    },
    {
      nome: 'Industrial',
      briefings: 1,
      perguntas: 170,
      status: 'ativo'
    },
    {
      nome: 'Urbanístico',
      briefings: 1,
      perguntas: 260,
      status: 'ativo'
    }
  ]
};

// Exportações nomeadas removidas temporariamente devido a refatoração
// TODO: Reavaliar se essas exportações são necessárias após refatoração completa 