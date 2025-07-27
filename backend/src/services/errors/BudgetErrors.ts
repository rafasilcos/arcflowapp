/**
 * Classes de erro específicas para o sistema de orçamentos
 * Tarefa 11: Implementar validações e tratamento de erros
 */

export class BriefingAnalysisError extends Error {
  public readonly briefingId: string;
  public readonly camposFaltantes: string[];
  public readonly sugestoes: string[];
  public readonly codigo: string;

  constructor(
    message: string,
    briefingId: string,
    camposFaltantes: string[] = [],
    sugestoes: string[] = [],
    codigo: string = 'BRIEFING_ANALYSIS_ERROR'
  ) {
    super(message);
    this.name = 'BriefingAnalysisError';
    this.briefingId = briefingId;
    this.camposFaltantes = camposFaltantes;
    this.sugestoes = sugestoes;
    this.codigo = codigo;
    
    // Mantém o stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BriefingAnalysisError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      briefingId: this.briefingId,
      camposFaltantes: this.camposFaltantes,
      sugestoes: this.sugestoes,
      codigo: this.codigo,
      stack: this.stack
    };
  }
}

export class BudgetCalculationError extends Error {
  public readonly orcamentoId?: string;
  public readonly briefingId: string;
  public readonly dadosInvalidos: Record<string, any>;
  public readonly valorCalculado?: number;
  public readonly codigo: string;

  constructor(
    message: string,
    briefingId: string,
    dadosInvalidos: Record<string, any> = {},
    orcamentoId?: string,
    valorCalculado?: number,
    codigo: string = 'BUDGET_CALCULATION_ERROR'
  ) {
    super(message);
    this.name = 'BudgetCalculationError';
    this.briefingId = briefingId;
    this.orcamentoId = orcamentoId;
    this.dadosInvalidos = dadosInvalidos;
    this.valorCalculado = valorCalculado;
    this.codigo = codigo;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BudgetCalculationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      briefingId: this.briefingId,
      orcamentoId: this.orcamentoId,
      dadosInvalidos: this.dadosInvalidos,
      valorCalculado: this.valorCalculado,
      codigo: this.codigo,
      stack: this.stack
    };
  }
}

export class ConfigurationError extends Error {
  public readonly escritorioId: string;
  public readonly configuracaoInvalida: Record<string, any>;
  public readonly codigo: string;

  constructor(
    message: string,
    escritorioId: string,
    configuracaoInvalida: Record<string, any> = {},
    codigo: string = 'CONFIGURATION_ERROR'
  ) {
    super(message);
    this.name = 'ConfigurationError';
    this.escritorioId = escritorioId;
    this.configuracaoInvalida = configuracaoInvalida;
    this.codigo = codigo;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      escritorioId: this.escritorioId,
      configuracaoInvalida: this.configuracaoInvalida,
      codigo: this.codigo,
      stack: this.stack
    };
  }
}

export class DataValidationError extends Error {
  public readonly campo: string;
  public readonly valorRecebido: any;
  public readonly valorEsperado: string;
  public readonly codigo: string;

  constructor(
    message: string,
    campo: string,
    valorRecebido: any,
    valorEsperado: string,
    codigo: string = 'DATA_VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'DataValidationError';
    this.campo = campo;
    this.valorRecebido = valorRecebido;
    this.valorEsperado = valorEsperado;
    this.codigo = codigo;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataValidationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      campo: this.campo,
      valorRecebido: this.valorRecebido,
      valorEsperado: this.valorEsperado,
      codigo: this.codigo,
      stack: this.stack
    };
  }
}

export class InsufficientDataError extends Error {
  public readonly briefingId: string;
  public readonly dadosNecessarios: string[];
  public readonly dadosDisponiveis: string[];
  public readonly sugestoesFallback: string[];
  public readonly codigo: string;

  constructor(
    message: string,
    briefingId: string,
    dadosNecessarios: string[] = [],
    dadosDisponiveis: string[] = [],
    sugestoesFallback: string[] = [],
    codigo: string = 'INSUFFICIENT_DATA_ERROR'
  ) {
    super(message);
    this.name = 'InsufficientDataError';
    this.briefingId = briefingId;
    this.dadosNecessarios = dadosNecessarios;
    this.dadosDisponiveis = dadosDisponiveis;
    this.sugestoesFallback = sugestoesFallback;
    this.codigo = codigo;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InsufficientDataError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      briefingId: this.briefingId,
      dadosNecessarios: this.dadosNecessarios,
      dadosDisponiveis: this.dadosDisponiveis,
      sugestoesFallback: this.sugestoesFallback,
      codigo: this.codigo,
      stack: this.stack
    };
  }
}

// Tipos para facilitar o uso
export type BudgetError = 
  | BriefingAnalysisError 
  | BudgetCalculationError 
  | ConfigurationError 
  | DataValidationError 
  | InsufficientDataError;

// Helper para verificar se é um erro do sistema de orçamento
export function isBudgetError(error: any): error is BudgetError {
  return error instanceof BriefingAnalysisError ||
         error instanceof BudgetCalculationError ||
         error instanceof ConfigurationError ||
         error instanceof DataValidationError ||
         error instanceof InsufficientDataError;
}

// Códigos de erro padronizados
export const ERROR_CODES = {
  // Análise de Briefing
  BRIEFING_NOT_FOUND: 'BRIEFING_NOT_FOUND',
  BRIEFING_INCOMPLETE: 'BRIEFING_INCOMPLETE',
  BRIEFING_INVALID_FORMAT: 'BRIEFING_INVALID_FORMAT',
  BRIEFING_MISSING_AREA: 'BRIEFING_MISSING_AREA',
  BRIEFING_MISSING_TIPOLOGIA: 'BRIEFING_MISSING_TIPOLOGIA',
  
  // Cálculo de Orçamento
  BUDGET_INVALID_AREA: 'BUDGET_INVALID_AREA',
  BUDGET_INVALID_COMPLEXITY: 'BUDGET_INVALID_COMPLEXITY',
  BUDGET_CALCULATION_FAILED: 'BUDGET_CALCULATION_FAILED',
  BUDGET_NEGATIVE_VALUE: 'BUDGET_NEGATIVE_VALUE',
  BUDGET_UNREALISTIC_VALUE: 'BUDGET_UNREALISTIC_VALUE',
  
  // Configuração
  CONFIG_NOT_FOUND: 'CONFIG_NOT_FOUND',
  CONFIG_INVALID_PRICES: 'CONFIG_INVALID_PRICES',
  CONFIG_INVALID_MULTIPLIERS: 'CONFIG_INVALID_MULTIPLIERS',
  CONFIG_INVALID_COMPLEXITY: 'CONFIG_INVALID_COMPLEXITY',
  
  // Dados Insuficientes
  INSUFFICIENT_DATA: 'INSUFFICIENT_DATA',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  
  // Validação de Dados
  INVALID_DATA_TYPE: 'INVALID_DATA_TYPE',
  INVALID_DATA_RANGE: 'INVALID_DATA_RANGE',
  INVALID_DATA_FORMAT: 'INVALID_DATA_FORMAT'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];