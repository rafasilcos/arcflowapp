// CATEGORIA INDUSTRIAL - BRIEFINGS APROVADOS
// Exportações dos briefings especializados para projetos industriais

import { BriefingCompleto } from '../../../types/briefing';

// Importações dos briefings aprovados
import { briefingGalpaoIndustrial } from './galpao-industrial';

// Mapa de briefings industriais aprovados
export const BRIEFINGS_INDUSTRIAIS: Record<string, BriefingCompleto> = {
  'galpao-industrial': briefingGalpaoIndustrial
};

// Função para obter briefing por subtipo
export function obterBriefingIndustrial(subtipo: string): BriefingCompleto | null {
  return BRIEFINGS_INDUSTRIAIS[subtipo] || null;
}

// Lista de subtipos disponíveis
export const SUBTIPOS_INDUSTRIAIS = [
  'galpao-industrial'
];

export {
  briefingGalpaoIndustrial
};

// Importação dinâmica dos briefings industriais
const BRIEFINGS_INDUSTRIAL = new Map<string, () => Promise<{ default: BriefingCompleto }>>([
  ['galpao-industrial', () => import('./galpao-industrial').then(m => ({ default: m.briefingGalpaoIndustrial }))],
  // Futuros briefings industriais:
  // ['fabrica-producao', () => import('./fabrica-producao').then(m => ({ default: m.briefingFabricaProducao }))],
  // ['centro-distribuicao', () => import('./centro-distribuicao').then(m => ({ default: m.briefingCentroDistribuicao }))],
]);

// Função para obter briefing específico
export async function getBriefingIndustrial(tipo: string): Promise<BriefingCompleto | null> {
  const briefingLoader = BRIEFINGS_INDUSTRIAL.get(tipo);
  if (!briefingLoader) {
    console.warn(`Briefing industrial '${tipo}' não encontrado`);
    return null;
  }
  
  try {
    const briefingModule = await briefingLoader();
    return briefingModule.default;
  } catch (error) {
    console.error(`Erro ao carregar briefing industrial '${tipo}':`, error);
    return null;
  }
}

// Lista de briefings disponíveis na categoria industrial
export const BRIEFINGS_INDUSTRIAL_DISPONIVEIS = [
  {
    id: 'galpao-industrial',
    nome: 'Galpão Industrial Especializado',
    descricao: 'Galpões industriais para armazenagem, produção e operações mistas',
    totalPerguntas: 170,
    tempoEstimado: '180-240 min',
    complexidade: 'muito_alta' as const,
    status: 'disponivel' as const
  }
];

// Função para listar todos os briefings industriais
export function listarBriefingsIndustriais() {
  return BRIEFINGS_INDUSTRIAL_DISPONIVEIS;
} 