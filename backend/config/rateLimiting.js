/**
 * ⚡ CONFIGURAÇÃO DE RATE LIMITING
 * 
 * Rate limiting otimizado para diferentes tipos de endpoints
 */

const rateLimit = require('express-rate-limit');

// Configuração base do rate limiting
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 1000, // Máximo de requests por window
    message: {
      error: 'Muitas requisições',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutos'
    },
    standardHeaders: true, // Retornar rate limit info nos headers
    legacyHeaders: false, // Desabilitar headers X-RateLimit-*
    
    // Função para gerar chave única por IP
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress;
    },
    
    // Função para pular rate limiting em certas condições
    skip: (req) => {
      // Pular para health checks
      if (req.path === '/health' || req.path === '/api/health') {
        return true;
      }
      
      // Pular para IPs whitelistados em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        const whitelistedIPs = ['127.0.0.1', '::1', 'localhost'];
        return whitelistedIPs.includes(req.ip);
      }
      
      return false;
    },
    
    // Handler customizado quando limite é excedido
    handler: (req, res) => {
      console.warn('🚨 Rate limit excedido:', {
        ip: req.ip,
        path: req.path,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
      
      res.status(429).json({
        error: 'Muitas requisições',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Você excedeu o limite de requisições. Tente novamente em alguns minutos.',
        retryAfter: Math.ceil(options.windowMs / 1000 / 60) + ' minutos'
      });
    }
  };
  
  return rateLimit({ ...defaultOptions, ...options });
};

// Rate limiters específicos por tipo de endpoint

// Rate limiter geral para todas as APIs
const generalAPILimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por 15 minutos
  message: {
    error: 'Limite de requisições excedido',
    code: 'GENERAL_RATE_LIMIT',
    retryAfter: '15 minutos'
  }
});

// Rate limiter para login (mais restritivo)
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Apenas 10 tentativas de login por 15 minutos
  message: {
    error: 'Muitas tentativas de login',
    code: 'LOGIN_RATE_LIMIT',
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    retryAfter: '15 minutos'
  },
  skipSuccessfulRequests: true // Não contar logins bem-sucedidos
});

// Rate limiter para criação de recursos
const createResourceLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 50, // 50 criações por 5 minutos
  message: {
    error: 'Limite de criação excedido',
    code: 'CREATE_RATE_LIMIT',
    retryAfter: '5 minutos'
  }
});

// Rate limiter para refresh tokens
const refreshLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // 20 refresh por 5 minutos
  message: {
    error: 'Muitas renovações de token',
    code: 'REFRESH_RATE_LIMIT',
    retryAfter: '5 minutos'
  }
});

// Rate limiter para status/heartbeat
const statusLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // 60 checks por minuto
  message: {
    error: 'Muitas verificações de status',
    code: 'STATUS_RATE_LIMIT',
    retryAfter: '1 minuto'
  }
});

// Rate limiter para upload de arquivos
const uploadLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 20, // 20 uploads por 10 minutos
  message: {
    error: 'Limite de upload excedido',
    code: 'UPLOAD_RATE_LIMIT',
    retryAfter: '10 minutos'
  }
});

// Rate limiter específico para orçamentos
const rateLimitOrcamentos = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requests por minuto para orçamentos
  message: {
    error: 'Muitas operações de orçamento',
    code: 'ORCAMENTO_RATE_LIMIT_EXCEEDED',
    message: 'Muitas operações de orçamento. Aguarde um momento.',
    retryAfter: '1 minuto'
  },
  keyGenerator: (req) => {
    // Chave específica para geração de orçamentos
    if (req.path.includes('/gerar')) {
      return `${req.ip}-${req.user?.id || 'anonymous'}-gerar`;
    }
    return `${req.ip}-${req.user?.id || 'anonymous'}`;
  }
});

// Rate limiter para geração de orçamentos (mais restritivo)
const rateLimitGerarOrcamento = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 gerações por usuário por 5 minutos
  message: {
    error: 'Limite de geração de orçamentos atingido',
    code: 'ORCAMENTO_GENERATION_LIMIT_EXCEEDED',
    message: 'Limite de geração de orçamentos atingido. Aguarde 5 minutos.',
    retryAfter: '5 minutos'
  },
  keyGenerator: (req) => `${req.user?.id || req.ip}-gerar-orcamento`
});

// Middleware para aplicar rate limiting baseado na rota
const rateLimitConfig = (req, res, next) => {
  // Aplicar rate limiting específico baseado na rota
  if (req.path.includes('/auth/login')) {
    return loginLimiter(req, res, next);
  }
  
  if (req.path.includes('/auth/refresh')) {
    return refreshLimiter(req, res, next);
  }
  
  if (req.path.includes('/auth/status') || req.path.includes('/auth/heartbeat')) {
    return statusLimiter(req, res, next);
  }
  
  if (req.method === 'POST' && (req.path.includes('/clientes') || req.path.includes('/briefings'))) {
    return createResourceLimiter(req, res, next);
  }
  
  if (req.path.includes('/upload')) {
    return uploadLimiter(req, res, next);
  }
  
  // Rate limiting geral para outras rotas
  return generalAPILimiter(req, res, next);
};

// Monitor de rate limiting
const rateLimitMonitor = {
  // Estatísticas de rate limiting
  stats: {
    totalBlocked: 0,
    blockedByIP: new Map(),
    blockedByEndpoint: new Map()
  },
  
  // Registrar bloqueio
  recordBlock: (ip, endpoint) => {
    rateLimitMonitor.stats.totalBlocked++;
    
    // Contar por IP
    const ipCount = rateLimitMonitor.stats.blockedByIP.get(ip) || 0;
    rateLimitMonitor.stats.blockedByIP.set(ip, ipCount + 1);
    
    // Contar por endpoint
    const endpointCount = rateLimitMonitor.stats.blockedByEndpoint.get(endpoint) || 0;
    rateLimitMonitor.stats.blockedByEndpoint.set(endpoint, endpointCount + 1);
  },
  
  // Obter estatísticas
  getStats: () => {
    return {
      totalBlocked: rateLimitMonitor.stats.totalBlocked,
      topBlockedIPs: Array.from(rateLimitMonitor.stats.blockedByIP.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      topBlockedEndpoints: Array.from(rateLimitMonitor.stats.blockedByEndpoint.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  },
  
  // Resetar estatísticas
  resetStats: () => {
    rateLimitMonitor.stats.totalBlocked = 0;
    rateLimitMonitor.stats.blockedByIP.clear();
    rateLimitMonitor.stats.blockedByEndpoint.clear();
  }
};

module.exports = {
  rateLimitConfig,
  generalAPILimiter,
  loginLimiter,
  createResourceLimiter,
  refreshLimiter,
  statusLimiter,
  uploadLimiter,
  rateLimitOrcamentos,
  rateLimitGerarOrcamento,
  rateLimitMonitor,
  createRateLimiter
};