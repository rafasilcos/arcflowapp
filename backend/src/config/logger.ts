import winston from 'winston';
import path from 'path';

// Configuração do logger para alta performance
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

// Criar diretório de logs se não existir
const logDir = path.join(process.cwd(), 'logs');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'arcflow-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console para desenvolvimento
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      )
    }),

    // Arquivo para todos os logs
    new winston.transports.File({
      filename: path.join(logDir, 'arcflow.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),

    // Arquivo apenas para erros
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),

    // Arquivo para performance (info level)
    new winston.transports.File({
      filename: path.join(logDir, 'performance.log'),
      level: 'info',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, duration, ...meta }) => {
          if (duration) {
            return JSON.stringify({
              timestamp,
              level,
              message,
              duration,
              ...meta
            });
          }
          return '';
        })
      )
    })
  ],

  // Não sair em caso de erro
  exitOnError: false
});

// Stream para Morgan (HTTP logging)
(logger as any).stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Função para log de performance
export const logPerformance = (operation: string, startTime: number, metadata?: any) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation}`, {
    duration: `${duration}ms`,
    operation,
    ...metadata
  });
};

// Função para log de erro com contexto
export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context
  });
};

// Função para log de segurança
export const logSecurity = (event: string, details: any, userId?: string) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Função para log de database
export const logDatabase = (query: string, duration: number, params?: any) => {
  if (duration > 1000) { // Log apenas queries lentas (> 1s)
    logger.warn('Slow Database Query', {
      query,
      duration: `${duration}ms`,
      params
    });
  }
};

export { logger }; 