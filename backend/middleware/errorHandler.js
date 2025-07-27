/**
 * 🚨 MIDDLEWARE DE TRATAMENTO DE ERROS
 * 
 * Handler centralizado para todos os erros da aplicação
 */

// Tipos de erro conhecidos
const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

// Mapeamento de códigos de erro do PostgreSQL
const PG_ERROR_CODES = {
  '23505': 'DUPLICATE_KEY', // Violação de unique constraint
  '23503': 'FOREIGN_KEY_VIOLATION', // Violação de foreign key
  '23502': 'NOT_NULL_VIOLATION', // Violação de not null
  '42P01': 'UNDEFINED_TABLE', // Tabela não existe
  '42703': 'UNDEFINED_COLUMN', // Coluna não existe
  '08006': 'CONNECTION_FAILURE', // Falha de conexão
  '53300': 'TOO_MANY_CONNECTIONS' // Muitas conexões
};

/**
 * Classificar erro baseado no tipo
 */
function classifyError(error) {
  // Erros de validação (Joi, express-validator)
  if (error.name === 'ValidationError' || error.isJoi) {
    return {
      type: ERROR_TYPES.VALIDATION_ERROR,
      statusCode: 400,
      message: 'Dados inválidos',
      details: error.details || error.message
    };
  }
  
  // Erros de autenticação JWT
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return {
      type: ERROR_TYPES.AUTHENTICATION_ERROR,
      statusCode: 401,
      message: 'Token inválido ou expirado',
      details: error.message
    };
  }
  
  // Erros de autorização
  if (error.name === 'UnauthorizedError' || error.code === 'INSUFFICIENT_PERMISSIONS') {
    return {
      type: ERROR_TYPES.AUTHORIZATION_ERROR,
      statusCode: 403,
      message: 'Acesso negado',
      details: error.message
    };
  }
  
  // Erros de não encontrado
  if (error.name === 'NotFoundError' || error.code === 'RESOURCE_NOT_FOUND') {
    return {
      type: ERROR_TYPES.NOT_FOUND_ERROR,
      statusCode: 404,
      message: 'Recurso não encontrado',
      details: error.message
    };
  }
  
  // Erros do PostgreSQL
  if (error.code && PG_ERROR_CODES[error.code]) {
    const pgErrorType = PG_ERROR_CODES[error.code];
    
    switch (pgErrorType) {
      case 'DUPLICATE_KEY':
        return {
          type: ERROR_TYPES.DUPLICATE_ERROR,
          statusCode: 409,
          message: 'Recurso já existe',
          details: 'Um registro com estes dados já existe no sistema'
        };
        
      case 'FOREIGN_KEY_VIOLATION':
        return {
          type: ERROR_TYPES.DATABASE_ERROR,
          statusCode: 400,
          message: 'Referência inválida',
          details: 'O recurso referenciado não existe'
        };
        
      case 'NOT_NULL_VIOLATION':
        return {
          type: ERROR_TYPES.VALIDATION_ERROR,
          statusCode: 400,
          message: 'Campo obrigatório',
          details: 'Um campo obrigatório não foi fornecido'
        };
        
      default:
        return {
          type: ERROR_TYPES.DATABASE_ERROR,
          statusCode: 500,
          message: 'Erro no banco de dados',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
        };
    }
  }
  
  // Erros de rate limiting
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return {
      type: ERROR_TYPES.RATE_LIMIT_ERROR,
      statusCode: 429,
      message: 'Muitas requisições',
      details: error.message
    };
  }
  
  // Erro interno genérico
  return {
    type: ERROR_TYPES.INTERNAL_ERROR,
    statusCode: 500,
    message: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
  };
}

/**
 * Gerar ID único para o erro
 */
function generateErrorId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Logar erro com contexto
 */
function logError(error, req, errorInfo) {
  const errorLog = {
    id: errorInfo.id,
    type: errorInfo.type,
    message: error.message,
    stack: error.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
      body: req.method !== 'GET' ? req.body : undefined
    },
    timestamp: new Date().toISOString()
  };
  
  // Log baseado na severidade
  if (errorInfo.statusCode >= 500) {
    console.error('🚨 ERRO CRÍTICO:', errorLog);
  } else if (errorInfo.statusCode >= 400) {
    console.warn('⚠️ ERRO CLIENTE:', errorLog);
  } else {
    console.log('ℹ️ INFO:', errorLog);
  }
}

/**
 * Middleware principal de tratamento de erros
 */
const errorHandler = (error, req, res, next) => {
  // Se response já foi enviado, delegar para handler padrão do Express
  if (res.headersSent) {
    return next(error);
  }
  
  // Classificar erro
  const errorInfo = classifyError(error);
  errorInfo.id = generateErrorId();
  
  // Logar erro
  logError(error, req, errorInfo);
  
  // Preparar resposta
  const response = {
    error: errorInfo.message,
    code: errorInfo.type,
    errorId: errorInfo.id,
    timestamp: new Date().toISOString()
  };
  
  // Adicionar detalhes em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    response.details = errorInfo.details;
    response.stack = error.stack;
  }
  
  // Adicionar informações específicas do tipo de erro
  if (errorInfo.type === ERROR_TYPES.VALIDATION_ERROR && error.details) {
    response.validationErrors = error.details;
  }
  
  // Enviar resposta
  res.status(errorInfo.statusCode).json(response);
};

/**
 * Middleware para capturar erros assíncronos
 */
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware para tratar rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  error.name = 'NotFoundError';
  error.code = 'RESOURCE_NOT_FOUND';
  next(error);
};

/**
 * Criar erro customizado
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  asyncErrorHandler,
  notFoundHandler,
  AppError,
  ERROR_TYPES,
  classifyError
};