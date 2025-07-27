// ===== SISTEMA DE DETECÇÃO E IMPORTAÇÃO DINÂMICA DE TEMPLATES =====
// Este arquivo gerencia automaticamente todos os templates do sistema

import { ProjectTemplate } from '../data/projectTemplates';

// ===== INTERFACE PARA DADOS DE BRIEFING =====
export interface BriefingData {
  tipologia: 'residencial' | 'comercial' | 'industrial' | 'institucional';
  subtipo: string;
  padrao: 'simples' | 'medio' | 'alto' | 'premium' | 'luxo';
  area?: string;
  disciplinas?: string[];
  complexidade?: 'baixa' | 'media' | 'alta';
  localizacao?: string;
}

// ===== MAPEAMENTO DE TEMPLATES =====
const TEMPLATE_MAPPING: Record<string, () => Promise<{ default: ProjectTemplate }>> = {
  // RESIDENCIAL
  'residencial-casa-simples': () => import('./residencial/casa-simples'),
  'residencial-casa-medio': () => import('./residencial/casa-medio'),
  'residencial-casa-alto': () => import('./residencial/casa-alto'),
  'residencial-sobrado-simples': () => import('./residencial/sobrado-simples'),
  'residencial-sobrado-medio': () => import('./residencial/sobrado-medio'),
  'residencial-apartamento': () => import('./residencial/apartamento'),
  'residencial-condominio': () => import('./residencial/condominio'),
  
  // COMERCIAL
  'comercial-escritorio-simples': () => import('./comercial/escritorio-simples'),
  'comercial-escritorio-medio': () => import('./comercial/escritorio-medio'),
  'comercial-escritorio-alto': () => import('./comercial/escritorio-alto'),
  'comercial-loja-simples': () => import('./comercial/loja-simples'),
  'comercial-loja-medio': () => import('./comercial/loja-medio'),
  'comercial-restaurante': () => import('./comercial/restaurante'),
  'comercial-shopping': () => import('./comercial/shopping'),
  'comercial-hotel': () => import('./comercial/hotel'),
  
  // INDUSTRIAL
  'industrial-fabrica-simples': () => import('./industrial/fabrica-simples'),
  'industrial-fabrica-medio': () => import('./industrial/fabrica-medio'),
  'industrial-fabrica-alto': () => import('./industrial/fabrica-alto'),
  'industrial-galpao': () => import('./industrial/galpao'),
  'industrial-usina': () => import('./industrial/usina'),
  'industrial-armazem': () => import('./industrial/armazem'),
  
  // INSTITUCIONAL
  'institucional-escola-simples': () => import('./institucional/escola-simples'),
  'institucional-escola-medio': () => import('./institucional/escola-medio'),
  'institucional-escola-alto': () => import('./institucional/escola-alto'),
  'institucional-hospital': () => import('./institucional/hospital'),
  'institucional-igreja': () => import('./institucional/igreja'),
  'institucional-biblioteca': () => import('./institucional/biblioteca'),
  'institucional-universidade': () => import('./institucional/universidade'),
};

// ===== ALGORITMO DE DETECÇÃO INTELIGENTE =====
export function detectTemplateId(briefingData: BriefingData): string {
  const { tipologia, subtipo, padrao, area, complexidade } = briefingData;
  
  // Construir ID do template baseado nos dados do briefing
  let templateId = `${tipologia}-${subtipo}`;
  
  // Adicionar padrão se relevante
  if (padrao && padrao !== 'medio') {
    templateId += `-${padrao}`;
  } else if (complexidade) {
    templateId += `-${complexidade}`;
  }
  
  // Verificar se template existe
  if (TEMPLATE_MAPPING[templateId]) {
    return templateId;
  }
  
  // Fallback para padrão médio
  const fallbackId = `${tipologia}-${subtipo}-medio`;
  if (TEMPLATE_MAPPING[fallbackId]) {
    return fallbackId;
  }
  
  // Fallback para padrão simples
  const simpleFallbackId = `${tipologia}-${subtipo}-simples`;
  if (TEMPLATE_MAPPING[simpleFallbackId]) {
    return simpleFallbackId;
  }
  
  // Fallback final para tipologia
  const typologyFallback = Object.keys(TEMPLATE_MAPPING)
    .find(key => key.startsWith(tipologia));
  
  if (typologyFallback) {
    return typologyFallback;
  }
  
  // Fallback absoluto
  return 'residencial-casa-simples';
}

// ===== FUNÇÃO DE CARREGAMENTO DINÂMICO =====
export async function loadTemplate(templateId: string): Promise<ProjectTemplate> {
  try {
    console.log(`🔍 Carregando template: ${templateId}`);
    
    const templateLoader = TEMPLATE_MAPPING[templateId];
    if (!templateLoader) {
      console.warn(`⚠️ Template não encontrado: ${templateId}`);
      // Carregar template padrão
      const defaultTemplate = await TEMPLATE_MAPPING['residencial-casa-simples']();
      return defaultTemplate.default;
    }
    
    const templateModule = await templateLoader();
    console.log(`✅ Template carregado com sucesso: ${templateId}`);
    
    return templateModule.default;
  } catch (error) {
    console.error(`❌ Erro ao carregar template ${templateId}:`, error);
    
    // Fallback para template padrão
    try {
      const defaultTemplate = await TEMPLATE_MAPPING['residencial-casa-simples']();
      return defaultTemplate.default;
    } catch (fallbackError) {
      console.error('❌ Erro crítico: não foi possível carregar nem o template padrão');
      throw new Error('Sistema de templates indisponível');
    }
  }
}

// ===== FUNÇÃO PRINCIPAL DE DETECÇÃO E CARREGAMENTO =====
export async function detectAndLoadTemplate(
  projetoId: string, 
  briefingData?: BriefingData
): Promise<ProjectTemplate> {
  
  // Se temos dados de briefing, usar detecção inteligente
  if (briefingData) {
    const templateId = detectTemplateId(briefingData);
    console.log(`🎯 Template detectado via briefing: ${templateId}`);
    return await loadTemplate(templateId);
  }
  
  // Fallback baseado no ID do projeto (para desenvolvimento/teste)
  let templateId: string;
  
  switch (projetoId) {
    case '1':
      templateId = 'residencial-casa-simples';
      break;
    case '2':
      templateId = 'comercial-escritorio-simples';
      break;
    case '3':
      templateId = 'industrial-fabrica-simples';
      break;
    case '4':
      templateId = 'institucional-escola-simples';
      break;
    default:
      templateId = 'residencial-casa-simples';
  }
  
  console.log(`🎯 Template detectado via ID do projeto: ${templateId}`);
  return await loadTemplate(templateId);
}

// ===== FUNÇÃO PARA LISTAR TEMPLATES DISPONÍVEIS =====
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_MAPPING);
}

// ===== FUNÇÃO PARA VERIFICAR SE TEMPLATE EXISTE =====
export function templateExists(templateId: string): boolean {
  return templateId in TEMPLATE_MAPPING;
}

// ===== FUNÇÃO PARA OBTER INFORMAÇÕES DO TEMPLATE =====
export function getTemplateInfo(templateId: string) {
  const parts = templateId.split('-');
  return {
    tipologia: parts[0],
    subtipo: parts[1],
    padrao: parts[2] || 'medio',
    id: templateId,
    exists: templateExists(templateId)
  };
} 