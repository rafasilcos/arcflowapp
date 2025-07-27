// CATEGORIA RESIDENCIAL - BRIEFINGS APROVADOS
// Exportações dos briefings especializados para projetos residenciais

import { BriefingCompleto } from '../../../types/briefing';

// Importações dos briefings aprovados
import { BRIEFING_RESIDENCIAL_MULTIFAMILIAR } from './multifamiliar';
import { BRIEFING_RESIDENCIAL_UNIFAMILIAR } from './unifamiliar';
import { briefingLoteamentos } from './loteamentos';
import { designInteriores } from './design-interiores';
import { briefingPaisagismo } from './paisagismo';

// Mapa de briefings residenciais aprovados
export const BRIEFINGS_RESIDENCIAIS: Record<string, BriefingCompleto> = {
  'multifamiliar': BRIEFING_RESIDENCIAL_MULTIFAMILIAR,
  'unifamiliar': BRIEFING_RESIDENCIAL_UNIFAMILIAR,
  'loteamentos': briefingLoteamentos,
  'design-interiores': designInteriores,
  'paisagismo': briefingPaisagismo
};

// Função para obter briefing por subtipo
export function obterBriefingResidencial(subtipo: string): BriefingCompleto | null {
  return BRIEFINGS_RESIDENCIAIS[subtipo] || null;
}

// Lista de subtipos disponíveis
export const SUBTIPOS_RESIDENCIAIS = [
  'multifamiliar',
  'unifamiliar',
  'loteamentos',
  'design-interiores',
  'paisagismo'
];

export {
  BRIEFING_RESIDENCIAL_MULTIFAMILIAR,
  BRIEFING_RESIDENCIAL_UNIFAMILIAR,
  briefingLoteamentos,
  designInteriores,
  briefingPaisagismo
};

// Importação dinâmica dos briefings residenciais
const BRIEFINGS_RESIDENCIAL = new Map<string, () => Promise<{ default: BriefingCompleto }>>([
  ['multifamiliar', () => import('./multifamiliar').then(m => ({ default: m.BRIEFING_RESIDENCIAL_MULTIFAMILIAR }))],
  ['unifamiliar', () => import('./unifamiliar').then(m => ({ default: m.BRIEFING_RESIDENCIAL_UNIFAMILIAR }))],
  ['loteamentos', () => import('./loteamentos').then(m => ({ default: m.briefingLoteamentos }))],
  ['design-interiores', () => import('./design-interiores').then(m => ({ default: m.designInteriores }))],
  ['paisagismo', () => import('./paisagismo').then(m => ({ default: m.briefingPaisagismo }))],
  // Futuros briefings residenciais:
  // ['habitacao-social', () => import('./habitacao-social').then(m => ({ default: m.BRIEFING_RESIDENCIAL_SOCIAL }))],
]);

// Função para obter briefing específico
export async function getBriefingResidencial(tipo: string): Promise<BriefingCompleto | null> {
  const briefingLoader = BRIEFINGS_RESIDENCIAL.get(tipo);
  if (!briefingLoader) {
    console.warn(`Briefing residencial '${tipo}' não encontrado`);
    return null;
  }
  
  try {
    const briefingModule = await briefingLoader();
    return briefingModule.default;
  } catch (error) {
    console.error(`Erro ao carregar briefing residencial '${tipo}':`, error);
    return null;
  }
}

// Lista de briefings disponíveis na categoria residencial
export const BRIEFINGS_RESIDENCIAL_DISPONIVEIS = [
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
    id: 'unifamiliar',
    nome: 'Residencial Unifamiliar',
    descricao: 'Casas, sobrados, apartamentos e residências individuais',
    totalPerguntas: 235,
    tempoEstimado: '60-75 min',
    complexidade: 'muito_alta' as const,
    status: 'disponivel' as const
  },
  {
    id: 'loteamentos',
    nome: 'Loteamentos e Parcelamentos',
    descricao: 'Loteamentos residenciais, parcelamentos urbanos e desenvolvimento imobiliário',
    totalPerguntas: 150,
    tempoEstimado: '120-180 min',
    complexidade: 'muito_alta' as const,
    status: 'disponivel' as const
  },
  {
    id: 'design-interiores',
    nome: 'Design de Interiores',
    descricao: 'Projetos de design de interiores para residências',
    totalPerguntas: 200,
    tempoEstimado: '150-180 min',
    complexidade: 'muito_alta' as const,
    status: 'disponivel' as const
  },
  {
    id: 'paisagismo',
    nome: 'Paisagismo Especializado',
    descricao: 'Projetos de paisagismo residencial com análise climática e sustentabilidade',
    totalPerguntas: 180,
    tempoEstimado: '180-210 min',
    complexidade: 'muito_alta' as const,
    status: 'disponivel' as const
  }
];

// Função para listar todos os briefings residenciais
export function listarBriefingsResidenciais() {
  return BRIEFINGS_RESIDENCIAL_DISPONIVEIS;
}


