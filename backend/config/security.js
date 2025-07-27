/**
 * 🛡️ CONFIGURAÇÃO DE SEGURANÇA
 * 
 * Configuração centralizada de segurança com Helmet e outras proteções
 */

const helmet = require('helmet');

// Configuração do Helmet para segurança
const helmetConfig = helmet({
  // Configurações específicas para desenvolvimento/produção
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  
  // Configurar HSTS apenas em produção
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  } : false,
  
  // Configurações adicionais
  crossOriginEmbedderPolicy: false, // Permitir embeds
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Middleware de segurança adicional
const additionalSecurity = (req, res, next) => {
  // Headers de segurança customizados
  res.setHeader('X-API-Version', '2.0.0');
  res.setHeader('X-Powered-By', 'ArcFlow');
  
  // Rate limiting headers
  res.setHeader('X-RateLimit-Limit', '1000');
  res.setHeader('X-RateLimit-Window', '15m');
  
  // Headers de cache para APIs
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

// Middleware de validação de entrada
const inputValidation = (req, res, next) => {
  // Limitar tamanho do body
  const maxBodySize = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxBodySize) {
    return res.status(413).json({
      error: 'Payload muito grande',
      code: 'PAYLOAD_TOO_LARGE',
      maxSize: '10MB'
    });
  }
  
  // Validar Content-Type para requests POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (contentType && !contentType.includes('application/json') && 
        !contentType.includes('multipart/form-data') && 
        !contentType.includes('application/x-www-form-urlencoded')) {
      return res.status(415).json({
        error: 'Content-Type não suportado',
        code: 'UNSUPPORTED_MEDIA_TYPE',
        supported: ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded']
      });
    }
  }
  
  next();
};

// Middleware de proteção contra ataques
const attackProtection = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /burpsuite/i,
    /nmap/i
  ];
  
  // Detectar ferramentas de scanning
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    console.warn('🚨 Possível tentativa de ataque detectada:', {
      ip: req.ip,
      userAgent: userAgent,
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    return res.status(403).json({
      error: 'Acesso negado',
      code: 'ACCESS_DENIED'
    });
  }
  
  next();
};

// Middleware combinado de segurança
const securityConfig = [
  helmetConfig,
  additionalSecurity,
  inputValidation,
  attackProtection
];

module.exports = {
  securityConfig,
  helmetConfig,
  additionalSecurity,
  inputValidation,
  attackProtection
};