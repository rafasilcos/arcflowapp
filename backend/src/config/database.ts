import { PrismaClient } from '@prisma/client';
import { logger, logDatabase, logError } from './logger';

// Configuração otimizada do Prisma para alta performance
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Event listeners para logging
prisma.$on('query', (e: any) => {
  logDatabase(e.query, e.duration, e.params);
});

prisma.$on('error', (e: any) => {
  logError(new Error(e.message), { target: e.target });
});

prisma.$on('info', (e: any) => {
  logger.info('Database Info', { message: e.message, target: e.target });
});

prisma.$on('warn', (e: any) => {
  logger.warn('Database Warning', { message: e.message, target: e.target });
});

// Função para conectar ao banco
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    
    // Teste de conexão
    await prisma.$queryRaw`SELECT 1`;
    
    logger.info('✅ Banco de dados conectado com sucesso');
    
    // Configurações de otimização do PostgreSQL
    if (process.env.NODE_ENV === 'production') {
      await prisma.$executeRaw`SET statement_timeout = '30s'`;
      await prisma.$executeRaw`SET lock_timeout = '10s'`;
      await prisma.$executeRaw`SET idle_in_transaction_session_timeout = '60s'`;
    }
    
  } catch (error) {
    logError(error as Error, { context: 'Database Connection' });
    throw new Error('Falha ao conectar com o banco de dados');
  }
};

// Função para desconectar do banco
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('✅ Banco de dados desconectado');
  } catch (error) {
    logError(error as Error, { context: 'Database Disconnection' });
  }
};

// Health check do banco
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logError(error as Error, { context: 'Database Health Check' });
    return false;
  }
};

// Função para executar transações com retry
export const executeTransaction = async <T>(
  fn: (prisma: PrismaClient) => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(fn, {
        maxWait: 5000, // 5 segundos
        timeout: 30000, // 30 segundos
        isolationLevel: 'ReadCommitted'
      });
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        logError(lastError, { 
          context: 'Transaction Failed', 
          attempts: attempt,
          maxRetries 
        });
        throw lastError;
      }
      
      // Aguardar antes de retry (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      logger.warn(`Transaction retry ${attempt}/${maxRetries}`, {
        error: lastError.message,
        delay: `${delay}ms`
      });
    }
  }
  
  throw lastError!;
};

// Middleware para logging de queries lentas
export const slowQueryMiddleware = async (params: any, next: any) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;
  
  if (duration > 1000) {
    logger.warn('Slow Query Detected', {
      model: params.model,
      action: params.action,
      duration: `${duration}ms`,
      args: params.args
    });
  }
  
  return result;
};

// Aplicar middleware
prisma.$use(slowQueryMiddleware);

export { prisma };
export default prisma; 