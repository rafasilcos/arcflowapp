/**
 * 📝 MIDDLEWARE DE LOG DE REQUISIÇÕES
 * 
 * Logger otimizado para requisições HTTP com métricas de performance
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

/**
 * Obter cor baseada no status code
 */
function getStatusColor(statusCode) {
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  if (statusCode >= 200) return colors.green;
  return colors.white;
}

/**
 * Obter cor baseada no método HTTP
 */
function getMethodColor(method) {
  switch (method) {
    case 'GET': return colors.green;
    case 'POST': return colors.yellow;
    case 'PUT': return colors.blue;
    case 'DELETE': return colors.red;
    case 'PATCH': return colors.magenta;
    default: return colors.white;
  }
}

/**
 * Formatar duração da requisição
 */
function formatDuration(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Formatar tamanho em bytes
 */
function formatBytes(bytes) {
  if (!bytes) return '0B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
}

/**
 * Verificar se deve logar a requisição
 */
function shouldLog(req) {
  // Não logar health checks
  if (req.path === '/health' || req.path === '/api/health') {
    return false;
  }
  
  // Não logar assets estáticos
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    return false;
  }
  
  // Não logar preflight OPTIONS em produção
  if (process.env.NODE_ENV === 'production' && req.method === 'OPTIONS') {
    return false;
  }
  
  return true;
}

/**
 * Extrair informações do usuário
 */
function getUserInfo(req) {
  if (req.user) {
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };
  }
  return null;
}

/**
 * Middleware de logging de requisições
 */
const requestLogger = (req, res, next) => {
  // Verificar se deve logar
  if (!shouldLog(req)) {
    return next();
  }
  
  const startTime = Date.now();
  const startHrTime = process.hrtime();
  
  // Capturar informações da requisição
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    contentLength: req.headers['content-length'],
    timestamp: new Date().toISOString()
  };
  
  // Override do res.end para capturar resposta
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    // Calcular duração
    const duration = Date.now() - startTime;
    const hrDuration = process.hrtime(startHrTime);
    const durationMs = hrDuration[0] * 1000 + hrDuration[1] / 1000000;
    
    // Informações da resposta
    const responseInfo = {
      statusCode: res.statusCode,
      contentLength: res.get('content-length'),
      duration: durationMs
    };
    
    // Informações do usuário (se autenticado)
    const userInfo = getUserInfo(req);
    
    // Preparar log
    const logData = {
      ...requestInfo,
      ...responseInfo,
      user: userInfo
    };
    
    // Log colorido no console
    const methodColor = getMethodColor(req.method);
    const statusColor = getStatusColor(res.statusCode);
    const durationColor = durationMs > 1000 ? colors.red : durationMs > 500 ? colors.yellow : colors.green;
    
    console.log(
      `${colors.cyan}[${new Date().toLocaleTimeString()}]${colors.reset} ` +
      `${methodColor}${req.method}${colors.reset} ` +
      `${statusColor}${res.statusCode}${colors.reset} ` +
      `${req.originalUrl} ` +
      `${durationColor}${formatDuration(durationMs)}${colors.reset} ` +
      `${formatBytes(parseInt(res.get('content-length') || 0))} ` +
      `${req.ip}` +
      (userInfo ? ` ${colors.blue}[${userInfo.email}]${colors.reset}` : '')
    );
    
    // Log detalhado para requisições lentas (> 1s)
    if (durationMs > 1000) {
      console.warn('🐌 REQUISIÇÃO LENTA:', {
        method: req.method,
        url: req.originalUrl,
        duration: `${durationMs.toFixed(2)}ms`,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    }
    
    // Log para erros 4xx e 5xx
    if (res.statusCode >= 400) {
      const logLevel = res.statusCode >= 500 ? 'error' : 'warn';
      const emoji = res.statusCode >= 500 ? '🚨' : '⚠️';
      
      console[logLevel](`${emoji} HTTP ${res.statusCode}:`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${durationMs.toFixed(2)}ms`,
        ip: req.ip,
        user: userInfo?.email,
        body: req.method !== 'GET' ? req.body : undefined
      });
    }
    
    // Chamar método original
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * Middleware de métricas de performance
 */
const performanceMetrics = {
  requests: {
    total: 0,
    byMethod: {},
    byStatus: {},
    byEndpoint: {}
  },
  
  performance: {
    totalDuration: 0,
    slowRequests: 0,
    averageDuration: 0
  },
  
  // Registrar requisição
  record: (method, endpoint, statusCode, duration) => {
    // Contadores gerais
    performanceMetrics.requests.total++;
    
    // Por método
    performanceMetrics.requests.byMethod[method] = 
      (performanceMetrics.requests.byMethod[method] || 0) + 1;
    
    // Por status
    performanceMetrics.requests.byStatus[statusCode] = 
      (performanceMetrics.requests.byStatus[statusCode] || 0) + 1;
    
    // Por endpoint
    performanceMetrics.requests.byEndpoint[endpoint] = 
      (performanceMetrics.requests.byEndpoint[endpoint] || 0) + 1;
    
    // Performance
    performanceMetrics.performance.totalDuration += duration;
    performanceMetrics.performance.averageDuration = 
      performanceMetrics.performance.totalDuration / performanceMetrics.requests.total;
    
    if (duration > 1000) {
      performanceMetrics.performance.slowRequests++;
    }
  },
  
  // Obter estatísticas
  getStats: () => {
    return {
      ...performanceMetrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  },
  
  // Resetar métricas
  reset: () => {
    performanceMetrics.requests = {
      total: 0,
      byMethod: {},
      byStatus: {},
      byEndpoint: {}
    };
    
    performanceMetrics.performance = {
      totalDuration: 0,
      slowRequests: 0,
      averageDuration: 0
    };
  }
};

module.exports = {
  requestLogger,
  performanceMetrics,
  shouldLog,
  formatDuration,
  formatBytes
};