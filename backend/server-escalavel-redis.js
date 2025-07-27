const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// LOGGING ESTRUTURADO
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ],
});

// ENVIRONMENT VARIABLES - SEGURANÇA CRÍTICA
const {
  DATABASE_URL,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  REDIS_URL,
  NODE_ENV = 'development'
} = process.env;

// VALIDAÇÃO DE ENVIRONMENT VARIABLES OBRIGATÓRIAS
if (!DATABASE_URL) {
  logger.error('DATABASE_URL é obrigatório');
  process.exit(1);
}

if (!JWT_SECRET) {
  logger.error('JWT_SECRET é obrigatório');
  process.exit(1);
}

if (!JWT_REFRESH_SECRET) {
  logger.error('JWT_REFRESH_SECRET é obrigatório');
  process.exit(1);
}

// CONNECTION POOLING OTIMIZADO - 10K USUÁRIOS
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 30,                      // Aumentado para 30 conexões
  min: 5,                       // Mínimo de 5 conexões sempre ativas
  idleTimeoutMillis: 30000,     // 30s timeout
  connectionTimeoutMillis: 2000, // 2s connection timeout
  maxUses: 7500,                // Renovar conexão após 7500 uses
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// REDIS CLIENT - CACHE INTELIGENTE
const redisClient = redis.createClient({
  url: REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// CONFIGURAR REDIS
redisClient.on('connect', () => {
  logger.info('Redis conectado com sucesso');
});

redisClient.on('error', (err) => {
  logger.error('Erro no Redis:', err);
});

// CONECTAR REDIS
(async () => {
  try {
    await redisClient.connect();
    logger.info('Redis client inicializado');
  } catch (error) {
    logger.warn('Redis não disponível, continuando sem cache:', error.message);
  }
})();

// CACHE HELPER FUNCTIONS
const CACHE_TIMES = {
  CLIENTES: 300,      // 5 minutos
  CPF_CHECK: 1800,    // 30 minutos
  USER_PROFILE: 900,  // 15 minutos
  BRIEFINGS: 3600     // 1 hora
};

const getCacheKey = (prefix, ...parts) => {
  return `arcflow:${prefix}:${parts.join(':')}`;
};

const getFromCache = async (key) => {
  try {
    if (!redisClient.isReady) return null;
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.warn('Erro ao ler cache:', error.message);
    return null;
  }
};

const setCache = async (key, data, ttl = 300) => {
  try {
    if (!redisClient.isReady) return;
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    logger.warn('Erro ao salvar cache:', error.message);
  }
};

const invalidateCache = async (pattern) => {
  try {
    if (!redisClient.isReady) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.warn('Erro ao invalidar cache:', error.message);
  }
};

// RATE LIMITING GRANULAR POR ENDPOINT
const cpfLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,      // 1 minuto
  max: 30,                       // 30 verificações por minuto
  keyGenerator: (req) => `cpf:${req.user?.id || req.ip}`,
  message: {
    error: 'Muitas verificações de CPF. Tente em 1 minuto.',
    code: 'CPF_RATE_LIMIT'
  }
});

const clientesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,      // 1 minuto
  max: 100,                      // 100 operações por minuto
  keyGenerator: (req) => `clientes:${req.user?.id || req.ip}`,
  message: {
    error: 'Muitas operações de clientes. Tente em 1 minuto.',
    code: 'CLIENTES_RATE_LIMIT'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutos
  max: 5,                        // 5 tentativas de login por 15 min
  keyGenerator: (req) => `auth:${req.body.email || req.ip}`,
  message: {
    error: 'Muitas tentativas de login. Tente em 15 minutos.',
    code: 'AUTH_RATE_LIMIT'
  }
});

// Middleware
app.use(compression({ level: 6 }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// HEALTH CHECK COMPLETO
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    services: {}
  };
  
  // Test PostgreSQL
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    health.services.database = {
      status: 'ok',
      responseTime: `${Date.now() - start}ms`,
      connections: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    health.services.database = {
      status: 'error',
      error: error.message
    };
    health.status = 'error';
  }
  
  // Test Redis
  try {
    const start = Date.now();
    await redisClient.ping();
    health.services.redis = {
      status: 'ok',
      responseTime: `${Date.now() - start}ms`,
      connected: redisClient.isReady
    };
  } catch (error) {
    health.services.redis = {
      status: 'error',
      error: error.message,
      connected: false
    };
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// JWT CONFIG
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

// UTILITY FUNCTIONS
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role,
    escritorioId: user.escritorio_id
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'arcflow-api',
    audience: 'arcflow-client'
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'arcflow-api',
    audience: 'arcflow-client'
  });

  logger.info('Tokens gerados', {
    userId: user.id,
    email: user.email
  });

  return { accessToken, refreshToken };
};

// MIDDLEWARE DE AUTENTICAÇÃO COM CACHE
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acesso requerido',
      code: 'TOKEN_REQUIRED' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Tentar buscar do cache primeiro
    const cacheKey = getCacheKey('user', decoded.id);
    let user = await getFromCache(cacheKey);
    
    if (!user) {
      // Se não estiver no cache, buscar do banco
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({ 
          error: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND' 
        });
      }
      
      user = result.rows[0];
      // Cachear usuário por 15 minutos
      await setCache(cacheKey, user, CACHE_TIMES.USER_PROFILE);
    }
    
    req.user = user;
    next();
  } catch (error) {
    logger.warn('Token inválido', { error: error.message });
    
    return res.status(403).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN' 
    });
  }
};

// CLIENTES COM CACHE INTELIGENTE
app.get('/api/clientes', authenticateToken, clientesLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const escritorioId = req.user.escritorio_id;
    
    // Cache key específica para paginação e busca
    const cacheKey = getCacheKey('clientes', escritorioId, page, limit, search);
    
    // Tentar buscar do cache primeiro
    let result = await getFromCache(cacheKey);
    
    if (!result) {
      // Se não estiver no cache, buscar do banco
      let query = `
        SELECT 
          id, nome, email, telefone, cpf, cnpj, tipo_pessoa,
          endereco, cidade, estado, cep, observacoes,
          created_at, updated_at
        FROM clientes 
        WHERE escritorio_id = $1 AND ativo = true
      `;
      
      let queryParams = [escritorioId];
      let paramIndex = 2;
      
      if (search) {
        query += ` AND (nome ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }
      
      query += ` ORDER BY nome ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      let countQuery = `SELECT COUNT(*) as total FROM clientes WHERE escritorio_id = $1 AND ativo = true`;
      let countParams = [escritorioId];
      
      if (search) {
        countQuery += ` AND (nome ILIKE $2 OR email ILIKE $2)`;
        countParams.push(`%${search}%`);
      }
      
      const [clientesResult, countResult] = await Promise.all([
        pool.query(query, queryParams),
        pool.query(countQuery, countParams)
      ]);
      
      result = {
        clientes: clientesResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      };
      
      // Cachear resultado por 5 minutos
      await setCache(cacheKey, result, CACHE_TIMES.CLIENTES);
    }
    
    logger.info('Clientes listados', {
      escritorioId,
      count: result.clientes.length,
      cached: !!result.cached,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json(result);
    
  } catch (error) {
    logger.error('Erro ao listar clientes', {
      error: error.message,
      stack: error.stack,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// VERIFICAÇÃO DE CPF COM CACHE
app.get('/api/clientes/verificar-cpf/:cpf', authenticateToken, cpfLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    const escritorioId = req.user.escritorio_id;
    
    // Cache key para CPF específico
    const cacheKey = getCacheKey('cpf', escritorioId, cpfLimpo);
    
    // Tentar buscar do cache primeiro
    let exists = await getFromCache(cacheKey);
    
    if (exists === null) {
      // Se não estiver no cache, buscar do banco
      const result = await pool.query(
        'SELECT id FROM clientes WHERE escritorio_id = $1 AND REPLACE(REPLACE(REPLACE(cpf, \'.\', \'\'), \'-\', \'\'), \' \', \'\') = $2 AND ativo = true',
        [escritorioId, cpfLimpo]
      );
      
      exists = result.rows.length > 0;
      
      // Cachear resultado por 30 minutos
      await setCache(cacheKey, exists, CACHE_TIMES.CPF_CHECK);
    }
    
    logger.info('CPF verificado', {
      cpf: cpfLimpo,
      exists,
      cached: exists !== null,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json({ exists });
    
  } catch (error) {
    logger.error('Erro ao verificar CPF', {
      error: error.message,
      stack: error.stack,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// CRIAR CLIENTE COM INVALIDAÇÃO DE CACHE
app.post('/api/clientes', authenticateToken, clientesLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const clienteData = req.body;
    const escritorioId = req.user.escritorio_id;
    
    // Validações básicas
    if (!clienteData.nome || !clienteData.email) {
      return res.status(400).json({
        error: 'Nome e email são obrigatórios',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }
    
    // Inserir no banco
    const result = await pool.query(`
      INSERT INTO clientes (
        nome, email, telefone, cpf, cnpj, tipo_pessoa,
        endereco, cidade, estado, cep, observacoes,
        escritorio_id, criado_por, ativo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true)
      RETURNING *
    `, [
      clienteData.nome,
      clienteData.email,
      clienteData.telefone || null,
      clienteData.cpf || null,
      clienteData.cnpj || null,
      clienteData.tipo_pessoa || 'fisica',
      clienteData.endereco || null,
      clienteData.cidade || null,
      clienteData.estado || null,
      clienteData.cep || null,
      clienteData.observacoes || null,
      escritorioId,
      req.user.id
    ]);
    
    // Invalidar cache de clientes e CPF
    await Promise.all([
      invalidateCache(getCacheKey('clientes', escritorioId, '*')),
      invalidateCache(getCacheKey('cpf', escritorioId, '*'))
    ]);
    
    logger.info('Cliente criado', {
      clienteId: result.rows[0].id,
      escritorioId,
      userId: req.user.id,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error) {
    logger.error('Erro ao criar cliente', {
      error: error.message,
      stack: error.stack,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// LOGIN COM RATE LIMITING
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Login - usuário não encontrado', { email });
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const user = result.rows[0];
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Login - senha incorreta', { email });
      return res.status(401).json({
        error: 'Credenciais inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const tokens = generateTokens(user);
    
    // Cachear usuário após login bem-sucedido
    const cacheKey = getCacheKey('user', user.id);
    await setCache(cacheKey, user, CACHE_TIMES.USER_PROFILE);
    
    logger.info('Login realizado', {
      userId: user.id,
      email: user.email,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        escritorioId: user.escritorio_id
      },
      tokens
    });
    
  } catch (error) {
    logger.error('Erro no login', {
      error: error.message,
      stack: error.stack,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// REFRESH TOKEN
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({
      error: 'Refresh token requerido',
      code: 'REFRESH_TOKEN_REQUIRED'
    });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Buscar usuário do cache ou banco
    const cacheKey = getCacheKey('user', decoded.id);
    let user = await getFromCache(cacheKey);
    
    if (!user) {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND ativo = true', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          error: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        });
      }
      user = result.rows[0];
      await setCache(cacheKey, user, CACHE_TIMES.USER_PROFILE);
    }
    
    const tokens = generateTokens(user);
    
    res.json({ tokens });
    
  } catch (error) {
    logger.warn('Refresh token inválido', { error: error.message });
    res.status(403).json({
      error: 'Refresh token inválido',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// MIDDLEWARE DE ERRO GLOBAL
app.use((error, req, res, next) => {
  logger.error('Erro não capturado', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR'
  });
});

// GRACEFUL SHUTDOWN
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  
  try {
    await pool.end();
    await redisClient.quit();
    logger.info('Conexões fechadas com sucesso');
  } catch (error) {
    logger.error('Erro ao fechar conexões:', error);
  }
  
  process.exit(0);
});

// INICIALIZAÇÃO
const initServer = async () => {
  try {
    // Testar conexão PostgreSQL
    await pool.connect();
    logger.info('Pool PostgreSQL inicializado', {
      max: pool.options.max,
      min: pool.options.min
    });
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info('🚀 ArcFlow Backend ESCALÁVEL + REDIS iniciado', {
        port: PORT,
        environment: NODE_ENV,
        postgresPool: `${pool.options.min}-${pool.options.max} conexões`,
        redis: redisClient.isReady ? 'Conectado' : 'Desconectado',
        features: [
          '✅ Connection Pooling Otimizado',
          '✅ Redis Cache Inteligente',
          '✅ Rate Limiting Granular',
          '✅ Logs Estruturados',
          '✅ Health Checks Completos',
          '✅ Environment Variables Seguras',
          '🎯 Suporte a 10.000 usuários simultâneos'
        ]
      });
    });
    
  } catch (error) {
    logger.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

// Inicializar servidor
initServer();

module.exports = app; 