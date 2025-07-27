const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// 🛡️ RATE LIMITING ESPECÍFICO PARA AUTENTICAÇÃO
// Otimizado para 10k usuários simultâneos

/**
 * 🚨 RATE LIMIT PARA /api/auth/status
 * Protege contra DDoS de validação JWT
 */
const authStatusLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo 10 validações por usuário por minuto
  
  // Key generator inteligente - por usuário, não por IP
  keyGenerator: (req) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token); // Decode sem validar
        if (decoded?.id) {
          return `auth_status:${decoded.id}`;
        }
      }
      
      // Fallback para IP se não conseguir extrair user ID
      return `auth_status:${req.ip}`;
    } catch (error) {
      return `auth_status:${req.ip}`;
    }
  },
  
  message: {
    error: 'Muitas validações de token',
    message: 'Você está fazendo muitas validações. Aguarde 1 minuto.',
    code: 'AUTH_STATUS_RATE_LIMIT',
    retryAfter: 60
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  // Handler customizado com logs
  handler: (req, res) => {
    const userAgent = req.headers['user-agent'];
    const authHeader = req.headers.authorization;
    
    console.warn('🚨 [RATE-LIMIT] Auth status limit exceeded', {
      ip: req.ip,
      userAgent,
      hasToken: !!authHeader,
      timestamp: new Date().toISOString()
    });
    
    res.status(429).json({
      error: 'Muitas validações de token',
      message: 'Você está fazendo muitas validações. Aguarde 1 minuto.',
      code: 'AUTH_STATUS_RATE_LIMIT',
      retryAfter: 60
    });
  }
});

/**
 * 🔥 RATE LIMIT PARA LOGIN - Mais restritivo
 * Protege contra ataques de força bruta
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por email por 15 minutos
  
  // Key generator por email
  keyGenerator: (req) => {
    const email = req.body?.email || req.ip;
    return `login:${email.toLowerCase()}`;
  },
  
  message: {
    error: 'Muitas tentativas de login',
    message: 'Você fez muitas tentativas de login. Aguarde 15 minutos.',
    code: 'LOGIN_RATE_LIMIT',
    retryAfter: 15 * 60
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    const email = req.body?.email || 'unknown';
    const userAgent = req.headers['user-agent'];
    
    console.warn('🚨 [RATE-LIMIT] Login limit exceeded', {
      email,
      ip: req.ip,
      userAgent,
      timestamp: new Date().toISOString()
    });
    
    res.status(429).json({
      error: 'Muitas tentativas de login',
      message: 'Você fez muitas tentativas de login. Aguarde 15 minutos.',
      code: 'LOGIN_RATE_LIMIT',
      retryAfter: 15 * 60
    });
  }
});

/**
 * 🔄 RATE LIMIT PARA REFRESH TOKEN
 * Protege contra abuso de refresh
 */
const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // máximo 10 refresh por usuário por 5 minutos
  
  keyGenerator: (req) => {
    try {
      const refreshToken = req.body?.refreshToken || req.headers.authorization?.substring(7);
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken);
        if (decoded?.id) {
          return `refresh:${decoded.id}`;
        }
      }
      return `refresh:${req.ip}`;
    } catch (error) {
      return `refresh:${req.ip}`;
    }
  },
  
  message: {
    error: 'Muitas renovações de token',
    message: 'Você está renovando o token com muita frequência. Aguarde 5 minutos.',
    code: 'REFRESH_RATE_LIMIT',
    retryAfter: 5 * 60
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    console.warn('🚨 [RATE-LIMIT] Refresh limit exceeded', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    
    res.status(429).json({
      error: 'Muitas renovações de token',
      message: 'Você está renovando o token com muita frequência. Aguarde 5 minutos.',
      code: 'REFRESH_RATE_LIMIT',
      retryAfter: 5 * 60
    });
  }
});

/**
 * 📊 RATE LIMIT PARA OPERAÇÕES GERAIS
 * Protege APIs sensíveis
 */
const generalAPILimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1500, // 1500 requests por usuário por 15 minutos (mais generoso)
  
  keyGenerator: (req) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token);
        if (decoded?.id) {
          return `api:${decoded.id}`;
        }
      }
      return `api:${req.ip}`;
    } catch (error) {
      return `api:${req.ip}`;
    }
  },
  
  message: {
    error: 'Muitas requisições',
    message: 'Você está fazendo muitas requisições. Aguarde 15 minutos.',
    code: 'API_RATE_LIMIT',
    retryAfter: 15 * 60
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    console.warn('🚨 [RATE-LIMIT] API limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    
    res.status(429).json({
      error: 'Muitas requisições',
      message: 'Você está fazendo muitas requisições. Aguarde 15 minutos.',
      code: 'API_RATE_LIMIT',
      retryAfter: 15 * 60
    });
  }
});

/**
 * 🔧 RATE LIMIT PARA CRIAÇÃO DE RECURSOS
 * Protege contra spam de criação
 */
const createResourceLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // máximo 20 criações por usuário por 5 minutos
  
  keyGenerator: (req) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token);
        if (decoded?.id) {
          return `create:${decoded.id}`;
        }
      }
      return `create:${req.ip}`;
    } catch (error) {
      return `create:${req.ip}`;
    }
  },
  
  message: {
    error: 'Muitas criações',
    message: 'Você está criando muitos recursos. Aguarde 5 minutos.',
    code: 'CREATE_RATE_LIMIT',
    retryAfter: 5 * 60
  },
  
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    console.warn('🚨 [RATE-LIMIT] Create limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });
    
    res.status(429).json({
      error: 'Muitas criações',
      message: 'Você está criando muitos recursos. Aguarde 5 minutos.',
      code: 'CREATE_RATE_LIMIT',
      retryAfter: 5 * 60
    });
  }
});

/**
 * 📈 MONITORING DE RATE LIMITING
 */
const rateLimitMonitor = {
  stats: {
    authStatus: 0,
    login: 0,
    refresh: 0,
    general: 0,
    create: 0
  },
  
  incrementStat(type) {
    if (this.stats[type] !== undefined) {
      this.stats[type]++;
    }
  },
  
  getStats() {
    return {
      ...this.stats,
      timestamp: new Date().toISOString()
    };
  },
  
  resetStats() {
    Object.keys(this.stats).forEach(key => {
      this.stats[key] = 0;
    });
  }
};

module.exports = {
  authStatusLimiter,
  loginLimiter,
  refreshLimiter,
  generalAPILimiter,
  createResourceLimiter,
  rateLimitMonitor
}; 