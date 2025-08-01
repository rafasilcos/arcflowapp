const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// ENVIRONMENT VARIABLES
const {
  DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  JWT_SECRET = 'arcflow-jwt-secret-super-secure-key-2024-development',
  REDIS_URL = 'redis://localhost:6379',
  NODE_ENV = 'development'
} = process.env;

// CONNECTION POOLING OTIMIZADO - 10K USUÁRIOS
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 30,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false
});

// REDIS CLIENT
const redisClient = redis.createClient({
  url: REDIS_URL
});

// CACHE HELPER FUNCTIONS
const CACHE_TIMES = {
  CLIENTES: 300,
  CPF_CHECK: 1800,
  USER_PROFILE: 900
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

// RATE LIMITING
const clientesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Rate limit exceeded', code: 'RATE_LIMIT' }
});

// MIDDLEWARE
app.use(compression({ level: 6 }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// HEALTH CHECK
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {}
  };
  
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    health.services.database = {
      status: 'ok',
      responseTime: `${Date.now() - start}ms`
    };
  } catch (error) {
    health.services.database = { status: 'error', error: error.message };
    health.status = 'error';
  }
  
  try {
    const start = Date.now();
    await redisClient.ping();
    health.services.redis = {
      status: 'ok',
      responseTime: `${Date.now() - start}ms`
    };
  } catch (error) {
    health.services.redis = { status: 'error', error: error.message };
  }
  
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

// AUTHENTICATION MIDDLEWARE
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Try cache first
    const cacheKey = getCacheKey('user', decoded.id);
    let user = await getFromCache(cacheKey);
    
    if (!user) {
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }
      user = result.rows[0];
      await setCache(cacheKey, user, CACHE_TIMES.USER_PROFILE);
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// CLIENTES API WITH CACHE
app.get('/api/clientes', authenticateToken, clientesLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const escritorioId = req.user.escritorio_id;
    
    const cacheKey = getCacheKey('clientes', escritorioId, page, limit, search);
    let result = await getFromCache(cacheKey);
    
    if (!result) {
      let query = `
        SELECT id, nome, email, telefone, cpf
        FROM clientes 
        WHERE escritorio_id = $1 AND ativo = true
      `;
      
      let queryParams = [escritorioId];
      
      if (search) {
        query += ` AND nome ILIKE $2`;
        queryParams.push(`%${search}%`);
      }
      
      query += ` ORDER BY nome ASC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(parseInt(limit), (page - 1) * limit);
      
      const clientesResult = await pool.query(query, queryParams);
      
      result = {
        clientes: clientesResult.rows,
        cached: false
      };
      
      await setCache(cacheKey, result, CACHE_TIMES.CLIENTES);
    } else {
      result.cached = true;
    }
    
    logger.info('Clientes listados', {
      count: result.clientes.length,
      cached: result.cached,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json(result);
    
  } catch (error) {
    logger.error('Erro ao listar clientes:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Cache user
    const cacheKey = getCacheKey('user', user.id);
    await setCache(cacheKey, user, CACHE_TIMES.USER_PROFILE);
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, nome: user.nome, email: user.email },
      token
    });
    
  } catch (error) {
    logger.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// INITIALIZATION
const initServer = async () => {
  try {
    // Connect Redis
    redisClient.on('connect', () => logger.info('✅ Redis connected'));
    redisClient.on('error', (err) => logger.error('❌ Redis error:', err));
    
    try {
      await redisClient.connect();
    } catch (error) {
      logger.warn('Redis not available, continuing without cache');
    }
    
    // Connect PostgreSQL
    await pool.connect();
    logger.info('✅ PostgreSQL connected');
    
    // Start server
    app.listen(PORT, () => {
      logger.info('🚀 ArcFlow Backend REDIS ESCALÁVEL iniciado!', {
        port: PORT,
        environment: NODE_ENV,
        redis: redisClient.isReady ? 'Connected' : 'Disconnected',
        features: [
          '✅ PostgreSQL Pool (5-30 connections)',
          '✅ Redis Cache',
          '✅ Rate Limiting',
          '✅ Health Checks',
          '🎯 Ready for 10K users!'
        ]
      });
    });
    
  } catch (error) {
    logger.error('❌ Server initialization error:', error);
    process.exit(1);
  }
};

// Start server
initServer();

module.exports = app;
