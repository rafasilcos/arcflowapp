import { Request, Response, NextFunction } from 'express';
// Não importar Prisma para evitar conflitos de tipo
import { logger, logError } from '../config/logger';

// Interface para erros customizados
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

// Classe para erros de validação
export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

// Classe para erros de autorização
export class AuthorizationError extends Error {
  statusCode = 403;
  code = 'AUTHORIZATION_ERROR';

  constructor(message: string = 'Acesso negado') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Classe para erros de não encontrado
export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(message: string = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Classe para erros de conflito
export class ConflictError extends Error {
  statusCode = 409;
  code = 'CONFLICT_ERROR';

  constructor(message: string = 'Conflito de dados') {
    super(message);
    this.name = 'ConflictError';
  }
}

// Classe para erros de rate limiting
export class RateLimitError extends Error {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';

  constructor(message: string = 'Muitas requisições') {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Função para tratar erros do Prisma
const handlePrismaError = (error: any): CustomError => {
  const customError: CustomError = new Error();

  switch (error.code) {
    case 'P2002':
      // Violação de constraint única
      const fields = error.meta?.target as string[] || [];
      customError.statusCode = 409;
      customError.code = 'UNIQUE_CONSTRAINT_VIOLATION';
      customError.message = `Dados duplicados: ${fields.join(', ')}`;
      customError.details = { fields, constraint: error.meta?.target };
      break;

    case 'P2014':
      // Violação de relação
      customError.statusCode = 400;
      customError.code = 'RELATION_VIOLATION';
      customError.message = 'Violação de relacionamento entre dados';
      customError.details = { relation: error.meta?.relation_name };
      break;

    case 'P2003':
      // Violação de foreign key
      customError.statusCode = 400;
      customError.code = 'FOREIGN_KEY_VIOLATION';
      customError.message = 'Referência inválida entre dados';
      customError.details = { field: error.meta?.field_name };
      break;

    case 'P2025':
      // Registro não encontrado
      customError.statusCode = 404;
      customError.code = 'RECORD_NOT_FOUND';
      customError.message = 'Registro não encontrado';
      break;

    case 'P2016':
      // Erro de interpretação de query
      customError.statusCode = 400;
      customError.code = 'QUERY_INTERPRETATION_ERROR';
      customError.message = 'Erro na consulta aos dados';
      break;

    case 'P2021':
      // Tabela não existe
      customError.statusCode = 500;
      customError.code = 'TABLE_NOT_FOUND';
      customError.message = 'Erro de estrutura do banco de dados';
      break;

    case 'P2024':
      // Timeout de conexão
      customError.statusCode = 503;
      customError.code = 'DATABASE_TIMEOUT';
      customError.message = 'Timeout na conexão com banco de dados';
      break;

    default:
      customError.statusCode = 500;
      customError.code = 'DATABASE_ERROR';
      customError.message = 'Erro interno do banco de dados';
      customError.details = { prismaCode: error.code };
  }

  return customError;
};

// Função para tratar erros de validação do Joi
const handleJoiError = (error: any): CustomError => {
  const customError: CustomError = new ValidationError(
    'Dados inválidos fornecidos',
    {
      fields: error.details?.map((detail: any) => ({
        field: detail.path?.join('.'),
        message: detail.message,
        value: detail.context?.value
      }))
    }
  );

  return customError;
};

// Middleware principal de tratamento de erros
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let customError: CustomError = error as CustomError;

  // Log do erro
  logError(error, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Tratar diferentes tipos de erro
  if (error.name === 'PrismaClientKnownRequestError') {
    customError = handlePrismaError(error);
  } else if (error.name === 'PrismaClientUnknownRequestError') {
    customError = {
      statusCode: 500,
      code: 'DATABASE_UNKNOWN_ERROR',
      message: 'Erro desconhecido no banco de dados',
      name: 'DatabaseError'
    };
  } else if (error.name === 'PrismaClientRustPanicError') {
    customError = {
      statusCode: 500,
      code: 'DATABASE_PANIC_ERROR',
      message: 'Erro crítico no banco de dados',
      name: 'DatabasePanicError'
    };
  } else if (error.name === 'PrismaClientInitializationError') {
    customError = {
      statusCode: 503,
      code: 'DATABASE_CONNECTION_ERROR',
      message: 'Erro de conexão com banco de dados',
      name: 'DatabaseConnectionError'
    };
  } else if (error.name === 'ValidationError' && error.message.includes('Joi')) {
    customError = handleJoiError(error);
  } else if (error.name === 'JsonWebTokenError') {
    customError = {
      statusCode: 401,
      code: 'INVALID_TOKEN',
      message: 'Token de autenticação inválido',
      name: 'AuthenticationError'
    };
  } else if (error.name === 'TokenExpiredError') {
    customError = {
      statusCode: 401,
      code: 'EXPIRED_TOKEN',
      message: 'Token de autenticação expirado',
      name: 'AuthenticationError'
    };
  } else if (error.name === 'MulterError') {
    customError = {
      statusCode: 400,
      code: 'FILE_UPLOAD_ERROR',
      message: 'Erro no upload de arquivo',
      details: { multerCode: (error as any).code },
      name: 'FileUploadError'
    };
  }

  // Definir valores padrão se não foram definidos
  const statusCode = customError.statusCode || 500;
  const code = customError.code || 'INTERNAL_SERVER_ERROR';
  const message = customError.message || 'Erro interno do servidor';

  // Resposta de erro padronizada
  const errorResponse: any = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  // Adicionar detalhes em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = customError.details;
    errorResponse.stack = error.stack;
  }

  // Adicionar ID de rastreamento para erros 500
  if (statusCode >= 500) {
    errorResponse.traceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    logger.error('Error 500 - Trace ID: ' + errorResponse.traceId, {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      userId: req.user?.id
    });
  }

  // Log de segurança para tentativas de acesso não autorizado
  if (statusCode === 401 || statusCode === 403) {
    logger.warn('Security Alert', {
      statusCode,
      message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      userId: req.user?.id
    });
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para 404 - deve ser usado após todas as rotas
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    error: 'Rota não encontrada',
    code: 'ROUTE_NOT_FOUND',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

// Função utilitária para criar erros customizados
export const createError = (
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  error.code = code || 'CUSTOM_ERROR';
  error.details = details;
  return error;
}; 