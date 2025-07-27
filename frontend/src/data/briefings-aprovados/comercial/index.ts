// ÍNDICE DOS BRIEFINGS COMERCIAIS APROVADOS
export { BRIEFING_COMERCIAL_ESCRITORIOS } from './escritorios';
export { BRIEFING_COMERCIAL_LOJAS } from './lojas';
export { BRIEFING_COMERCIAL_RESTAURANTES } from './restaurantes';
export { BRIEFING_COMERCIAL_HOTEL_POUSADA } from './hotel-pousada';

// Futura exportação de outros briefings comerciais:
// export { BRIEFING_COMERCIAL_SHOPPING } from './shopping';

// Importar para uso interno
import { BRIEFING_COMERCIAL_ESCRITORIOS } from './escritorios';
import { BRIEFING_COMERCIAL_LOJAS } from './lojas';
import { BRIEFING_COMERCIAL_RESTAURANTES } from './restaurantes';
import { BRIEFING_COMERCIAL_HOTEL_POUSADA } from './hotel-pousada';

// Mapa para busca rápida
export const BRIEFINGS_COMERCIAIS_MAP = {
  'escritorios': 'BRIEFING_COMERCIAL_ESCRITORIOS',
  'lojas': 'BRIEFING_COMERCIAL_LOJAS',
  'restaurantes': 'BRIEFING_COMERCIAL_RESTAURANTES',
  'hotel-pousada': 'BRIEFING_COMERCIAL_HOTEL_POUSADA',
  // 'shopping': 'BRIEFING_COMERCIAL_SHOPPING'
};

// Lista de briefings disponíveis
export const BRIEFINGS_COMERCIAIS_DISPONIVEIS = [
  {
    id: 'escritorios',
    nome: 'Escritorios Profissionais',
    descricao: 'Escritorios corporativos, consultorios e ambientes profissionais',
    status: 'ativo'
  },
  {
    id: 'lojas',
    nome: 'Lojas / Varejo',
    descricao: 'Lojas, varejo, franquias e estabelecimentos comerciais',
    status: 'ativo'
  },
  {
    id: 'restaurantes',
    nome: 'Restaurantes / Gastronomia',
    descricao: 'Restaurantes, bares, cafes e estabelecimentos gastronomicos',
    status: 'ativo'
  },
  {
    id: 'hotel-pousada',
    nome: 'Hotel/Pousada',
    descricao: 'Empreendimentos hoteleiros e de hospedagem',
    status: 'ativo'
  }
  // Adicionar outros quando implementados
];

// Sistema de Briefings Aprovados - Categoria Comercial
// Importações dinâmicas para performance otimizada

// Mapa de briefings disponíveis
export const BRIEFINGS_COMERCIAIS = {
  'escritorios': BRIEFING_COMERCIAL_ESCRITORIOS,
  'lojas': BRIEFING_COMERCIAL_LOJAS,
  'restaurantes': BRIEFING_COMERCIAL_RESTAURANTES,
  'hotel-pousada': BRIEFING_COMERCIAL_HOTEL_POUSADA
} as const;

// Tipos para TypeScript
export type TipoBriefingComercial = keyof typeof BRIEFINGS_COMERCIAIS;

// Função para obter briefing específico
export async function obterBriefingComercial(tipo: TipoBriefingComercial) {
  return BRIEFINGS_COMERCIAIS[tipo];
}

// Lista de briefings disponíveis para interface
export const LISTA_BRIEFINGS_COMERCIAIS = [
  {
    id: 'escritorios',
    nome: 'Escritórios',
    descricao: 'Espaços corporativos e de trabalho',
    perguntas: 238,
    tempo: '60-90 min',
    complexidade: 'muito_alta'
  },
  {
    id: 'lojas',
    nome: 'Lojas/Varejo',
    descricao: 'Estabelecimentos comerciais de varejo',
    perguntas: 218,
    tempo: '45-60 min',
    complexidade: 'muito_alta'
  },
  {
    id: 'restaurantes',
    nome: 'Restaurantes',
    descricao: 'Estabelecimentos de alimentação',
    perguntas: 238,
    tempo: '50-70 min',
    complexidade: 'muito_alta'
  },
  {
    id: 'hotel-pousada',
    nome: 'Hotel/Pousada',
    descricao: 'Empreendimentos hoteleiros e de hospedagem',
    perguntas: 224,
    tempo: '45-60 min',
    complexidade: 'muito_alta'
  }
] as const; 