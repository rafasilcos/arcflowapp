// Componentes de Orçamento
export { default as BudgetPreview } from './BudgetPreview';
export { default as BudgetBreakdown } from './BudgetBreakdown';
export { default as HistoryViewer } from './HistoryViewer';
export { default as ConfigurationPanel } from './ConfigurationPanel';
export { default as BudgetIntegrationExample } from './BudgetIntegrationExample';
export { default as DataRequestModal } from './DataRequestModal';

// Tipos exportados
export type { 
  DadosExtraidos,
  OrcamentoPreview,
  BudgetPreviewProps 
} from './BudgetPreview';

export type {
  Disciplina,
  Fase,
  BudgetBreakdownProps
} from './BudgetBreakdown';

export type {
  VersaoOrcamento,
  DiferencaVersao,
  ComparacaoVersoes,
  HistoryViewerProps
} from './HistoryViewer';

export type {
  TabelaPrecos,
  MultiplicadoresTipologia,
  ParametrosComplexidade,
  ConfiguracoesPadrao,
  ConfiguracaoEscritorio,
  ConfigurationPanelProps
} from './ConfigurationPanel';

export type {
  CampoSolicitacao,
  SolicitacaoDados,
  DataRequestModalProps
} from './DataRequestModal';