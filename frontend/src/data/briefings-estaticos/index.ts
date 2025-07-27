// 🚀 SISTEMA ESCALÁVEL PARA 150K+ USUÁRIOS SIMULTÂNEOS
// Lazy Loading Dinâmico + Cache Inteligente + Performance O(1)

import { BriefingEstatico } from './types';

// ===== MAPA DE ROTAS PARA LAZY LOADING =====
const BRIEFING_ROUTES: Record<string, () => Promise<any>> = {
  // Residencial - Implementados
  'RESIDENCIAL_CASA_UNIFAMILIAR_SIMPLES_PADRAO': () => import('./residencial/casa-simples').then(m => m.CASA_SIMPLES),
  'RESIDENCIAL_CASA_UNIFAMILIAR_MEDIO_PADRAO': () => import('./residencial/casa-medio').then(m => m.CASA_MEDIO),
  
  // Comercial - Implementados
  'COMERCIAL_ESCRITORIO_UNICO': () => import('./comercial/escritorio').then(m => m.ESCRITORIO_COMERCIAL),
  
  // Futuros (comentados até serem implementados)
  // 'RESIDENCIAL_CASA_UNIFAMILIAR_ALTO': () => import('./residencial/casa-alto').then(m => m.CASA_ALTO),
  // 'COMERCIAL_LOJA_UNICO': () => import('./comercial/loja').then(m => m.LOJA_COMERCIAL),
  // 'INDUSTRIAL_GALPAO_UNICO': () => import('./industrial/galpao').then(m => m.GALPAO_INDUSTRIAL),
  // 'INSTITUCIONAL_ESCOLA_UNICO': () => import('./institucional/escola').then(m => m.ESCOLA),
  // 'INSTITUCIONAL_SAUDE_UNICO': () => import('./institucional/saude').then(m => m.SAUDE),
};

// ===== CACHE EM MEMÓRIA PARA PERFORMANCE =====
const briefingCache = new Map<string, any>();
const loadingPromises = new Map<string, Promise<any>>();

// ===== FUNÇÃO PRINCIPAL ESCALÁVEL =====
export async function obterBriefingEstatico(
  area: string,
  tipologia: string,
  padrao: string = 'UNICO'
): Promise<BriefingEstatico | any> {
  
  // Gerar chave única
  const chave = `${area.toUpperCase()}_${tipologia.toUpperCase()}_${padrao.toUpperCase()}`;
  
  console.log('🚀 BRIEFING ESCALÁVEL | Buscando:', chave);
  console.log('🔍 DEBUG COMPLETO:', { area, tipologia, padrao, chave });
  console.log('📋 BRIEFING_ROUTES disponíveis:', Object.keys(BRIEFING_ROUTES));
  
  // ===== 1. VERIFICAR CACHE (O(1)) =====
  if (briefingCache.has(chave)) {
    console.log('⚡ CACHE HIT | Retornando do cache:', chave);
    return briefingCache.get(chave);
  }
  
  // ===== 2. VERIFICAR SE JÁ ESTÁ CARREGANDO =====
  if (loadingPromises.has(chave)) {
    console.log('⏳ LOADING | Aguardando carregamento em andamento:', chave);
    return await loadingPromises.get(chave);
  }
  
  // ===== 3. VERIFICAR SE EXISTE A ROTA =====
  const loader = BRIEFING_ROUTES[chave];
  if (!loader) {
    console.warn('❌ BRIEFING NÃO ENCONTRADO:', chave);
    return null;
  }
  
  // ===== 4. LAZY LOADING COM CACHE =====
  const loadingPromise = loader()
    .then((briefing: any) => {
      console.log('✅ BRIEFING CARREGADO:', chave);
      
      // Armazenar no cache
      briefingCache.set(chave, briefing);
      
      // Limpar promise de loading
      loadingPromises.delete(chave);
      
      return briefing;
    })
    .catch((error: any) => {
      console.error('💥 ERRO ao carregar briefing:', chave, error);
      
      // Limpar promise de loading em caso de erro
      loadingPromises.delete(chave);
      
      return null;
    });
  
  // Armazenar promise para evitar múltiplos carregamentos
  loadingPromises.set(chave, loadingPromise);
  
  return await loadingPromise;
}

// ===== FUNÇÃO DE CHECK RÁPIDO (SEM CARREGAR) =====
export function verificarDisponibilidade(
  disciplina: string,
  area: string, 
  tipologia: string,
  padrao: string
): boolean {
  
  const chave = `${area.toUpperCase()}_${tipologia.toUpperCase()}_${padrao.toUpperCase()}`;
  
  // Check se existe no mapa de rotas
  return chave in BRIEFING_ROUTES;
}

// ===== PRELOAD INTELIGENTE (OPCIONAL) =====
export async function preloadBriefing(
  area: string,
  tipologia: string,
  padrao: string = 'UNICO'
): Promise<void> {
  
  const chave = `${area.toUpperCase()}_${tipologia.toUpperCase()}_${padrao.toUpperCase()}`;
  
  // Se já está no cache, não precisa fazer nada
  if (briefingCache.has(chave)) {
    return;
  }
  
  // Carregar em background sem bloquear
  obterBriefingEstatico(area, tipologia, padrao)
    .catch(error => {
      console.warn('⚠️ PRELOAD FALHOU:', chave, error);
    });
}

// ===== GESTÃO DE CACHE =====
export function limparCache(): void {
  briefingCache.clear();
  loadingPromises.clear();
  console.log('🧹 CACHE LIMPO');
}

export function obterEstatisticasCache() {
  return {
    itensNoCache: briefingCache.size,
    carregamentosAtivos: loadingPromises.size,
    chavesEmCache: Array.from(briefingCache.keys()),
    memoryUsage: `~${briefingCache.size * 50}KB` // Estimativa
  };
}

// ===== LISTA DE BRIEFINGS DISPONÍVEIS =====
export function listarBriefingsDisponiveis() {
  return [
    {
      disciplina: 'ARQUITETURA',
      area: 'RESIDENCIAL',
      tipologia: 'CASA',
      padrao: 'SIMPLES',
      nome: 'Casa Unifamiliar - Sistema Completo',
      chave: 'RESIDENCIAL_CASA_UNIFAMILIAR_SIMPLES_PADRAO',
      totalPerguntas: 151,
      tempoEstimado: 170,
      disponivel: true
    },
    {
      disciplina: 'ARQUITETURA',
      area: 'RESIDENCIAL', 
      tipologia: 'CASA',
      padrao: 'MEDIO',
      nome: 'Casa Unifamiliar - Padrão Médio',
      chave: 'RESIDENCIAL_CASA_UNIFAMILIAR_MEDIO_PADRAO',
      totalPerguntas: 85,
      tempoEstimado: 128,
      disponivel: true
    },
    {
      disciplina: 'ARQUITETURA',
      area: 'COMERCIAL',
      tipologia: 'ESCRITORIO',
      padrao: 'UNICO',
      nome: 'Escritório Comercial',
      chave: 'COMERCIAL_ESCRITORIO_UNICO',
      totalPerguntas: 72,
      tempoEstimado: 108,
      disponivel: true
    },
    // Futuros briefings (ainda não implementados)
    {
      disciplina: 'ARQUITETURA',
      area: 'COMERCIAL',
      tipologia: 'LOJA',
      padrao: 'UNICO',
      nome: 'Loja Comercial',
      chave: 'COMERCIAL_LOJA_UNICO',
      totalPerguntas: 95,
      tempoEstimado: 140,
      disponivel: false // Ainda não implementado
    }
  ];
}

// ===== MAPEAMENTO PARA COMPATIBILIDADE =====
export function mapearParametrosLegacy(
  tipologia?: string,
  subtipo?: string,
  padrao?: string
): { area: string; tipologia: string; padrao: string } | null {
  
  console.log('🔧 MAPEAMENTO LEGACY:', { tipologia, subtipo, padrao });
  
  // Casa = RESIDENCIAL + CASA_UNIFAMILIAR
  if (tipologia?.toLowerCase() === 'casa') {
    // Ajustar padrão para incluir _PADRAO conforme as chaves do BRIEFING_ROUTES
    let padraoFormatado = padrao?.toUpperCase() || 'SIMPLES';
    if (padraoFormatado === 'SIMPLES') {
      padraoFormatado = 'SIMPLES_PADRAO';
    } else if (padraoFormatado === 'MEDIO') {
      padraoFormatado = 'MEDIO_PADRAO';
    } else if (padraoFormatado === 'ALTO') {
      padraoFormatado = 'ALTO_PADRAO';
    }
    
    const resultado = {
      area: 'RESIDENCIAL',
      tipologia: 'CASA_UNIFAMILIAR',
      padrao: padraoFormatado
    };
    
    console.log('✅ CASA MAPEADA:', resultado);
    return resultado;
  }
  
  // Escritorio = COMERCIAL + ESCRITORIO
  if (tipologia?.toLowerCase() === 'escritorio') {
    const resultado = {
      area: 'COMERCIAL',
      tipologia: 'ESCRITORIO',
      padrao: 'UNICO'
    };
    
    console.log('✅ ESCRITORIO MAPEADO:', resultado);
    return resultado;
  }
  
  // Loja = COMERCIAL + LOJA
  if (tipologia?.toLowerCase() === 'loja') {
    const resultado = {
      area: 'COMERCIAL',
      tipologia: 'LOJA',
      padrao: 'UNICO'
    };
    
    console.log('✅ LOJA MAPEADA:', resultado);
    return resultado;
  }
  
  console.warn('❌ MAPEAMENTO FALHOU:', { tipologia, subtipo, padrao });
  return null;
}

// ===== EXPORT DEFAULT =====
export default {
  obterBriefingEstatico,
  verificarDisponibilidade,
  preloadBriefing,
  limparCache,
  obterEstatisticasCache,
  listarBriefingsDisponiveis,
  mapearParametrosLegacy
}; 