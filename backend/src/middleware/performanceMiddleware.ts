import { Request, Response, NextFunction } from 'express';
import { loggingService } from '../services/loggingService';
import { metricsCollectorService } from '../services/metricsCollectorService';
import { alertingService } from '../services/alertingService';

interface PerformanceRequest extends Request {
  startTime?: number;
  startMemory?: NodeJS.MemoryUsage;
}

// Middleware para capturar métricas de performance
export const performanceMiddleware = (req: PerformanceRequest, res: Response, next: NextFunction) => {
  // Capturar tempo e memória inicial
  req.startTime = Date.now();
  req.startMemory = process.memoryUsage();
  
  // Interceptar o final da resposta
  const originalSend = res.send;
  const originalJson = res.json;
  
  const finalizarMetricas = () => {
    if (!req.startTime || !req.startMemory) return;
    
    const tempoExecucao = Date.now() - req.startTime;
    const memoriaFinal = process.memoryUsage();
    const memoriaUsada = memoriaFinal.heapUsed - req.startMemory.heapUsed;
    
    const operacao = `${req.method} ${req.route?.path || req.path}`;
    
    // Registrar métrica de performance
    metricsCollectorService.registrarMetricaPerformance({
      operacao,
      tempoExecucao,
      memoriaUsada,
      quantidadeRegistros: 1,
      timestamp: new Date()
    });
    
    // Log de performance
    loggingService.logPerformance({
      operacao,
      tempoExecucao,
      memoriaUsada,
      quantidadeRegistros: 1,
      escritorioId: (req as any).user?.escritorioId,
      userId: (req as any).user?.id
    });
    
    // Verificar se performance está baixa
    if (tempoExecucao > 5000) { // Mais de 5 segundos
      alertingService.registrarPerformanceBaixa(operacao, tempoExecucao, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        memoriaUsada,
        userId: (req as any).user?.id
      });
    }
  };
  
  // Override do res.send
  res.send = function(body) {
    finalizarMetricas();
    return originalSend.call(this, body);
  };
  
  // Override do res.json
  res.json = function(body) {
    finalizarMetricas();
    return originalJson.call(this, body);
  };
  
  next();
};

// Middleware específico para operações de orçamento
export const orcamentoPerformanceMiddleware = (req: PerformanceRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  req.startMemory = process.memoryUsage();
  
  const originalJson = res.json;
  
  res.json = function(body) {
    if (!req.startTime || !req.startMemory) {
      return originalJson.call(this, body);
    }
    
    const tempoExecucao = Date.now() - req.startTime;
    const memoriaFinal = process.memoryUsage();
    const memoriaUsada = memoriaFinal.heapUsed - req.startMemory.heapUsed;
    
    const operacao = `ORCAMENTO_${req.method}_${req.route?.path || req.path}`;
    
    // Registrar métrica específica de orçamento
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Sucesso
      metricsCollectorService.registrarMetricaOrcamento({
        escritorioId: (req as any).user?.escritorioId || 'unknown',
        briefingId: req.params.briefingId || req.body?.briefingId || 'unknown',
        orcamentoId: body?.orcamento?.id || body?.id || 'unknown',
        tempoGeracao: tempoExecucao,
        valorTotal: body?.orcamento?.valorTotal || body?.valorTotal || 0,
        tipologia: body?.orcamento?.tipologia || body?.tipologia || 'unknown',
        complexidade: body?.orcamento?.complexidade || body?.complexidade || 'unknown',
        sucesso: true,
        timestamp: new Date()
      });
    } else {
      // Erro
      metricsCollectorService.registrarMetricaOrcamento({
        escritorioId: (req as any).user?.escritorioId || 'unknown',
        briefingId: req.params.briefingId || req.body?.briefingId || 'unknown',
        orcamentoId: 'error',
        tempoGeracao: tempoExecucao,
        valorTotal: 0,
        tipologia: 'unknown',
        complexidade: 'unknown',
        sucesso: false,
        erro: body?.error || 'Erro desconhecido',
        timestamp: new Date()
      });
      
      // Registrar erro para alertas
      alertingService.registrarErroOrcamento(
        req.params.briefingId || 'unknown',
        new Error(body?.error || 'Erro na operação de orçamento'),
        {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          tempoExecucao,
          memoriaUsada,
          userId: (req as any).user?.id
        }
      );
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Middleware para capturar erros não tratados
export const errorTrackingMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Log do erro
  loggingService.logOrcamentoError(
    req.params.briefingId || 'unknown',
    error,
    {
      method: req.method,
      path: req.path,
      body: req.body,
      params: req.params,
      query: req.query,
      userId: (req as any).user?.id,
      escritorioId: (req as any).user?.escritorioId
    }
  );
  
  // Registrar para alertas se for erro crítico
  if (error.name === 'DatabaseError' || error.name === 'SystemError') {
    alertingService.registrarFalhaSistema(
      req.path,
      error,
      {
        method: req.method,
        userId: (req as any).user?.id,
        timestamp: new Date()
      }
    );
  }
  
  // Continuar com o tratamento de erro padrão
  next(error);
};

// Middleware para rate limiting com métricas
export const rateLimitWithMetrics = (limite: number = 100, janela: number = 15) => {
  const contadores = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const chave = `${req.ip}_${(req as any).user?.id || 'anonymous'}`;
    const agora = Date.now();
    const janelaMs = janela * 60 * 1000; // Converter para ms
    
    let contador = contadores.get(chave);
    
    if (!contador || agora > contador.resetTime) {
      contador = { count: 1, resetTime: agora + janelaMs };
      contadores.set(chave, contador);
    } else {
      contador.count++;
    }
    
    // Adicionar headers de rate limit
    res.setHeader('X-RateLimit-Limit', limite);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limite - contador.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(contador.resetTime / 1000));
    
    if (contador.count > limite) {
      // Log de rate limit excedido
      loggingService.logWorkerOperacao('RATE_LIMITER', 'LIMITE_EXCEDIDO', {
        ip: req.ip,
        userId: (req as any).user?.id,
        path: req.path,
        count: contador.count,
        limite
      });
      
      return res.status(429).json({
        error: 'Muitas requisições',
        message: `Limite de ${limite} requisições por ${janela} minutos excedido`,
        retryAfter: Math.ceil((contador.resetTime - agora) / 1000)
      });
    }
    
    next();
  };
};

// Middleware para monitorar recursos do sistema
export const systemResourcesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Verificar uso de memória
  const memoryUsage = process.memoryUsage();
  const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024;
  const memoryLimitMB = 512; // Limite de 512MB
  
  if (memoryUsedMB > memoryLimitMB) {
    alertingService.registrarFalhaSistema(
      'MEMORY_LIMIT',
      new Error(`Alto uso de memória: ${memoryUsedMB.toFixed(2)}MB`),
      {
        memoryUsage,
        path: req.path,
        method: req.method
      }
    );
  }
  
  // Verificar número de conexões ativas (simulado)
  const activeConnections = (global as any).activeConnections || 0;
  if (activeConnections > 1000) {
    alertingService.registrarFalhaSistema(
      'HIGH_CONNECTIONS',
      new Error(`Muitas conexões ativas: ${activeConnections}`),
      {
        activeConnections,
        path: req.path,
        method: req.method
      }
    );
  }
  
  next();
};

export default {
  performanceMiddleware,
  orcamentoPerformanceMiddleware,
  errorTrackingMiddleware,
  rateLimitWithMetrics,
  systemResourcesMiddleware
};