/**
 * Middleware de Tratamento de Erros para Sistema de Orçamentos
 * Tarefa 11: Implementar validações e tratamento de erros
 */

import { Request, Response, NextFunction } from 'express';
import { 
  BudgetError, 
  isBudgetError,
  BriefingAnalysisError,
  BudgetCalculationError,
  ConfigurationError,
  DataValidationError,
  InsufficientDataError,
  ERROR_CODES
} from '../services/errors/BudgetErrors';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    suggestions?: string[];
    timestamp: string;
    requestId?: string;
  };
}

export interface ValidationErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    validation: {
      missingFields?: string[];
      invalidFields?: Array<{
        field: string;
        received: any;
        expected: string;
      }>;
      suggestions?: string[];
    };
  };
}

/**
 * Middleware principal de tratamento de erros do sistema de orçamentos
 */
export function budgetErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log do erro para debugging
  console.error('Budget Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  // Se não é um erro do sistema de orçamento, passa para o próximo handler
  if (!isBudgetError(error)) {
    return next(error);
  }

  const requestId = req.headers['x-request-id'] as string || generateRequestId();
  const timestamp = new Date().toISOString();

  // Tratamento específico por tipo de erro
  if (error instanceof BriefingAnalysisError) {
    handleBriefingAnalysisError(error, res, requestId, timestamp);
  } else if (error instanceof BudgetCalculationError) {
    handleBudgetCalculationError(error, res, requestId, timestamp);
  } else if (error instanceof ConfigurationError) {
    handleConfigurationError(error, res, requestId, timestamp);
  } else if (error instanceof DataValidationError) {
    handleDataValidationError(error, res, requestId, timestamp);
  } else if (error instanceof InsufficientDataError) {
    handleInsufficientDataError(error, res, requestId, timestamp);
  } else {
    // Erro genérico do sistema de orçamento
    handleGenericBudgetError(error, res, requestId, timestamp);
  }
}

/**
 * Trata erros de análise de briefing
 */
function handleBriefingAnalysisError(
  error: BriefingAnalysisError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const statusCode = getStatusCodeByErrorCode(error.codigo);
  
  const response: ValidationErrorResponse = {
    success: false,
    error: {
      code: error.codigo,
      message: error.message,
      details: {
        briefingId: error.briefingId,
        missingFields: error.camposFaltantes
      },
      suggestions: error.sugestoes,
      timestamp,
      requestId
    },
    validation: {
      missingFields: error.camposFaltantes,
      suggestions: error.sugestoes
    }
  };

  res.status(statusCode).json(response);
}

/**
 * Trata erros de cálculo de orçamento
 */
function handleBudgetCalculationError(
  error: BudgetCalculationError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const statusCode = getStatusCodeByErrorCode(error.codigo);
  
  const response: ErrorResponse = {
    success: false,
    error: {
      code: error.codigo,
      message: error.message,
      details: {
        briefingId: error.briefingId,
        orcamentoId: error.orcamentoId,
        invalidData: error.dadosInvalidos,
        calculatedValue: error.valorCalculado
      },
      suggestions: [
        'Verificar dados de entrada do briefing',
        'Revisar configurações de cálculo do escritório',
        'Contatar suporte se o problema persistir'
      ],
      timestamp,
      requestId
    }
  };

  res.status(statusCode).json(response);
}

/**
 * Trata erros de configuração
 */
function handleConfigurationError(
  error: ConfigurationError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const statusCode = getStatusCodeByErrorCode(error.codigo);
  
  const response: ErrorResponse = {
    success: false,
    error: {
      code: error.codigo,
      message: error.message,
      details: {
        escritorioId: error.escritorioId,
        invalidConfiguration: error.configuracaoInvalida
      },
      suggestions: [
        'Verificar configurações do escritório',
        'Usar valores padrão temporariamente',
        'Contatar administrador do sistema'
      ],
      timestamp,
      requestId
    }
  };

  res.status(statusCode).json(response);
}

/**
 * Trata erros de validação de dados
 */
function handleDataValidationError(
  error: DataValidationError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const response: ValidationErrorResponse = {
    success: false,
    error: {
      code: error.codigo,
      message: error.message,
      details: {
        field: error.campo,
        received: error.valorRecebido,
        expected: error.valorEsperado
      },
      timestamp,
      requestId
    },
    validation: {
      invalidFields: [{
        field: error.campo,
        received: error.valorRecebido,
        expected: error.valorEsperado
      }]
    }
  };

  res.status(400).json(response);
}

/**
 * Trata erros de dados insuficientes
 */
function handleInsufficientDataError(
  error: InsufficientDataError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const response: ValidationErrorResponse = {
    success: false,
    error: {
      code: error.codigo,
      message: error.message,
      details: {
        briefingId: error.briefingId,
        requiredData: error.dadosNecessarios,
        availableData: error.dadosDisponiveis
      },
      suggestions: error.sugestoesFallback,
      timestamp,
      requestId
    },
    validation: {
      missingFields: error.dadosNecessarios,
      suggestions: error.sugestoesFallback
    }
  };

  res.status(422).json(response);
}

/**
 * Trata erros genéricos do sistema de orçamento
 */
function handleGenericBudgetError(
  error: BudgetError,
  res: Response,
  requestId: string,
  timestamp: string
): void {
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'BUDGET_SYSTEM_ERROR',
      message: error.message || 'Erro interno do sistema de orçamentos',
      timestamp,
      requestId
    }
  };

  res.status(500).json(response);
}

/**
 * Mapeia códigos de erro para status HTTP
 */
function getStatusCodeByErrorCode(errorCode: string): number {
  const statusMap: Record<string, number> = {
    // 400 - Bad Request
    [ERROR_CODES.BRIEFING_INVALID_FORMAT]: 400,
    [ERROR_CODES.BUDGET_INVALID_AREA]: 400,
    [ERROR_CODES.BUDGET_INVALID_COMPLEXITY]: 400,
    [ERROR_CODES.CONFIG_INVALID_PRICES]: 400,
    [ERROR_CODES.CONFIG_INVALID_MULTIPLIERS]: 400,
    [ERROR_CODES.CONFIG_INVALID_COMPLEXITY]: 400,
    [ERROR_CODES.INVALID_DATA_TYPE]: 400,
    [ERROR_CODES.INVALID_DATA_RANGE]: 400,
    [ERROR_CODES.INVALID_DATA_FORMAT]: 400,
    
    // 404 - Not Found
    [ERROR_CODES.BRIEFING_NOT_FOUND]: 404,
    [ERROR_CODES.CONFIG_NOT_FOUND]: 404,
    
    // 422 - Unprocessable Entity
    [ERROR_CODES.BRIEFING_INCOMPLETE]: 422,
    [ERROR_CODES.BRIEFING_MISSING_AREA]: 422,
    [ERROR_CODES.BRIEFING_MISSING_TIPOLOGIA]: 422,
    [ERROR_CODES.INSUFFICIENT_DATA]: 422,
    [ERROR_CODES.MISSING_REQUIRED_FIELDS]: 422,
    
    // 500 - Internal Server Error
    [ERROR_CODES.BUDGET_CALCULATION_FAILED]: 500,
    [ERROR_CODES.BUDGET_NEGATIVE_VALUE]: 500,
    [ERROR_CODES.BUDGET_UNREALISTIC_VALUE]: 500
  };

  return statusMap[errorCode] || 500;
}

/**
 * Gera um ID único para a requisição
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Middleware para capturar erros assíncronos
 */
export function asyncErrorHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Middleware de validação de entrada para APIs de orçamento
 */
export function validateBudgetRequest(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    const invalidFields: Array<{ field: string; received: any; expected: string }> = [];

    // Verifica campos obrigatórios
    for (const field of requiredFields) {
      const value = req.body[field] || req.params[field] || req.query[field];
      
      if (value === undefined || value === null || value === '') {
        missingFields.push(field);
      }
    }

    // Validações específicas por campo
    if (req.body.areaConstruida !== undefined) {
      const area = Number(req.body.areaConstruida);
      if (isNaN(area) || area <= 0) {
        invalidFields.push({
          field: 'areaConstruida',
          received: req.body.areaConstruida,
          expected: 'Número positivo maior que 0'
        });
      }
    }

    if (req.body.valorTotal !== undefined) {
      const valor = Number(req.body.valorTotal);
      if (isNaN(valor) || valor <= 0) {
        invalidFields.push({
          field: 'valorTotal',
          received: req.body.valorTotal,
          expected: 'Número positivo maior que 0'
        });
      }
    }

    // Se há erros de validação, retorna erro
    if (missingFields.length > 0 || invalidFields.length > 0) {
      const error = new DataValidationError(
        'Dados de entrada inválidos',
        missingFields[0] || invalidFields[0]?.field || 'unknown',
        invalidFields[0]?.received || null,
        invalidFields[0]?.expected || 'Campo obrigatório',
        ERROR_CODES.INVALID_DATA_FORMAT
      );
      
      return next(error);
    }

    next();
  };
}

/**
 * Middleware para log de erros em produção
 */
export function logBudgetError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (isBudgetError(error)) {
    // Em produção, você pode integrar com serviços como Sentry, LogRocket, etc.
    const logData = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...error.toJSON?.()
      },
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      user: {
        id: (req as any).user?.id,
        escritorioId: (req as any).user?.escritorioId
      }
    };

    // Log estruturado (pode ser enviado para serviços externos)
    console.error('BUDGET_ERROR_LOG:', JSON.stringify(logData, null, 2));
  }

  next(error);
}