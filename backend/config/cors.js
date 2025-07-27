/**
 * 🌐 CONFIGURAÇÃO CORS
 * 
 * Configuração de CORS otimizada para desenvolvimento e produção
 */

const cors = require('cors');

// Origens permitidas baseadas no ambiente
const getAllowedOrigins = () => {
  const baseOrigins = [
    'http://localhost:3000',           // Frontend desenvolvimento
    'http://127.0.0.1:3000',          // Local alternativo
    'http://192.168.0.116:3000'       // Rede local
  ];
  
  // Em produção, adicionar domínios específicos
  if (process.env.NODE_ENV === 'production') {
    baseOrigins.push(
      'https://arcflow.com.br',
      'https://www.arcflow.com.br',
      'https://app.arcflow.com.br'
    );
  }
  
  // Adicionar origens customizadas via variável de ambiente
  if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(',');
    baseOrigins.push(...customOrigins);
  }
  
  return baseOrigins;
};

// Configuração CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Permitir requests sem origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se origin está na lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('🚫 CORS bloqueado para origin:', origin);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  
  // Métodos HTTP permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Headers permitidos
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  
  // Headers expostos para o cliente
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page'
  ],
  
  // Permitir cookies e credenciais
  credentials: true,
  
  // Cache do preflight por 24 horas
  maxAge: 86400,
  
  // Status de sucesso para OPTIONS
  optionsSuccessStatus: 200
};

// Middleware CORS configurado
const corsConfig = cors(corsOptions);

// Função para adicionar headers CORS customizados
const addCustomCorsHeaders = (req, res, next) => {
  // Headers de segurança adicionais
  res.header('Access-Control-Allow-Private-Network', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Em desenvolvimento, ser mais permissivo
  if (process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  }
  
  next();
};

// Middleware combinado
const corsMiddleware = [corsConfig, addCustomCorsHeaders];

module.exports = {
  corsConfig: corsMiddleware,
  corsOptions,
  getAllowedOrigins
};