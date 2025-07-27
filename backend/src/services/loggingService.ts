import winston from 'winston';
import path from 'path';

// Configuração do logger estruturado
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'arcflow-orcamento' },
  transports: [
    // Log de erros em arquivo separado
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log geral
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    // Console em desenvolvimento
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Interface para logs de orçamento
interface OrcamentoLogData {
  briefingId: string;
  orcamentoId?: string;
  escritorioId: string;
  userId: string;
  operacao: 'GERAR' | 'REGENERAR' | 'APROVAR' | 'REJEITAR' | 'CONFIGURAR';
  dadosOriginais?: any;
  dadosCalculados?: any;
  tempoProcessamento?: number;
  erro?: string;
  metadata?: any;
}

// Interface para logs de performance
interface PerformanceLogData {
  operacao: string;
  tempoExecucao: number;
  memoriaUsada?: number;
  cpuUsado?: number;
  quantidadeRegistros?: number;
  escritorioId?: string;
  userId?: string;
}

class LoggingService {
  // Log de operações de orçamento
  logOrcamentoOperacao(data: OrcamentoLogData) {
    logger.info('Operação de orçamento', {
      type: 'ORCAMENTO_OPERACAO',
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Log de performance
  logPerformance(data: PerformanceLogData) {
    logger.info('Métrica de performance', {
      type: 'PERFORMANCE_METRIC',
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Log de erro específico de orçamento
  logOrcamentoError(briefingId: string, erro: Error, contexto?: any) {
    logger.error('Erro na geração de orçamento', {
      type: 'ORCAMENTO_ERROR',
      briefingId,
      error: {
        message: erro.message,
        stack: erro.stack,
        name: erro.name
      },
      contexto,
      timestamp: new Date().toISOString()
    });
  }

  // Log de configuração alterada
  logConfiguracaoAlterada(escritorioId: string, userId: string, alteracoes: any) {
    logger.info('Configuração de orçamento alterada', {
      type: 'CONFIGURACAO_ALTERADA',
      escritorioId,
      userId,
      alteracoes,
      timestamp: new Date().toISOString()
    });
  }

  // Log de análise de briefing
  logAnaliseBriefing(briefingId: string, dadosExtraidos: any, tempoProcessamento: number) {
    logger.info('Análise de briefing concluída', {
      type: 'BRIEFING_ANALISE',
      briefingId,
      dadosExtraidos,
      tempoProcessamento,
      timestamp: new Date().toISOString()
    });
  }

  // Log de cache hit/miss
  logCacheOperacao(operacao: 'HIT' | 'MISS' | 'SET' | 'DELETE', chave: string, ttl?: number) {
    logger.debug('Operação de cache', {
      type: 'CACHE_OPERACAO',
      operacao,
      chave,
      ttl,
      timestamp: new Date().toISOString()
    });
  }

  // Log de worker/queue
  logWorkerOperacao(worker: string, operacao: string, dados?: any) {
    logger.info('Operação de worker', {
      type: 'WORKER_OPERACAO',
      worker,
      operacao,
      dados,
      timestamp: new Date().toISOString()
    });
  }

  // Método para criar timer de performance
  criarTimerPerformance(operacao: string) {
    const inicio = Date.now();
    const inicioMemoria = process.memoryUsage();

    return {
      finalizar: (metadata?: any) => {
        const tempoExecucao = Date.now() - inicio;
        const fimMemoria = process.memoryUsage();
        
        this.logPerformance({
          operacao,
          tempoExecucao,
          memoriaUsada: fimMemoria.heapUsed - inicioMemoria.heapUsed,
          ...metadata
        });

        return tempoExecucao;
      }
    };
  }

  // Log de auditoria
  logAuditoria(acao: string, recurso: string, resourceId: string, userId: string, dadosAnteriores?: any, dadosNovos?: any) {
    logger.info('Auditoria', {
      type: 'AUDITORIA',
      acao,
      recurso,
      resourceId,
      userId,
      dadosAnteriores,
      dadosNovos,
      timestamp: new Date().toISOString()
    });
  }
}

export const loggingService = new LoggingService();
export { LoggingService, OrcamentoLogData, PerformanceLogData };