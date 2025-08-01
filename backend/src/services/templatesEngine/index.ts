// index.ts - Exporta todos os serviços do Templates Engine

// ===== TEMPLATES ENGINE - EXPORTAÇÕES PRINCIPAIS =====

export { NecessidadesDetector } from './NecessidadesDetector';
export type { 
  TemplateNecessario, 
  AnaliseNecessidades 
} from './NecessidadesDetector';

export { ProjetoCompositor } from './ProjetoCompositor';
export type { 
  AtividadeComposta,
  ProjetoComposto,
  CronogramaItem,
  OrcamentoComposicao,
  ConfiguracaoComposicao,
  MetadadosComposicao
} from './ProjetoCompositor';

export { TemplatesEngine } from './TemplatesEngine';
export type {
  ResultadoTemplatesDinamicos,
  MetricasProcessamento,
  ConfiguracaoTemplatesEngine
} from './TemplatesEngine';
