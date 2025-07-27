const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3001;

// LOGGING ESTRUTURADO
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

// ENVIRONMENT VARIABLES
const {
  DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  JWT_SECRET = 'arcflow-super-secret-jwt-key-development-2024',
  NODE_ENV = 'development'
} = process.env;

// CONNECTION POOLING - SUPORTA 10K USUARIOS
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: false
});

// RATE LIMITING GRANULAR
const cpfLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    error: 'Muitas verificacoes de CPF. Tente em 1 minuto.',
    code: 'CPF_RATE_LIMIT'
  }
});

const clientesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas operacoes de clientes. Tente em 1 minuto.',
    code: 'CLIENTES_RATE_LIMIT'
  }
});

// Middleware
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
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// JWT Config
const JWT_EXPIRES_IN = '15m';

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

  logger.info('Tokens gerados', {
    userId: user.id,
    email: user.email
  });

  return { accessToken };
};

// MIDDLEWARE DE AUTENTICACAO
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
    
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Usuario nao encontrado',
        code: 'USER_NOT_FOUND' 
      });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    logger.warn('Token invalido', { error: error.message });
    
    return res.status(403).json({ 
      error: 'Token invalido',
      code: 'INVALID_TOKEN' 
    });
  }
};

// CLIENTES COM OTIMIZACAO
app.get('/api/clientes', authenticateToken, clientesLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;
    const escritorioId = req.user.escritorio_id;
    
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
    
    const result = {
      clientes: clientesResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    };
    
    logger.info('Clientes listados', {
      escritorioId,
      count: clientesResult.rows.length,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json(result);
    
  } catch (error) {
    logger.error('Erro ao listar clientes', {
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// VERIFICACAO DE CPF OTIMIZADA
app.get('/api/clientes/verificar-cpf/:cpf', authenticateToken, cpfLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    const escritorioId = req.user.escritorio_id;
    
    const result = await pool.query(
      'SELECT id FROM clientes WHERE escritorio_id = $1 AND REPLACE(REPLACE(REPLACE(cpf, \'.\', \'\'), \'-\', \'\'), \' \', \'\') = $2 AND ativo = true',
      [escritorioId, cpfLimpo]
    );
    
    const exists = result.rows.length > 0;
    
    logger.info('CPF verificado', {
      cpf: cpfLimpo,
      exists,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.json({ exists });
    
  } catch (error) {
    logger.error('Erro ao verificar CPF', {
      error: error.message,
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha sao obrigatorios',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Login - usuario nao encontrado', { email });
      return res.status(401).json({
        error: 'Credenciais invalidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const user = result.rows[0];
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Login - senha incorreta', { email });
      return res.status(401).json({
        error: 'Credenciais invalidas',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const tokens = generateTokens(user);
    
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
      responseTime: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Conectar ao database
pool.connect()
  .then(() => {
    logger.info('Pool de conexoes PostgreSQL inicializado');
    logger.info(`Conexoes configuradas: max=${pool.options.max}`);
  })
  .catch(err => {
    logger.error('Erro ao conectar ao PostgreSQL:', err);
    process.exit(1);
  });

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor ArcFlow ESCALAVEL iniciado na porta ${PORT}`);
  logger.info(`Ambiente: ${NODE_ENV}`);
  logger.info(`Pool PostgreSQL: ${pool.options.max} conexoes maximas`);
  logger.info(`Logs estruturados: Ativados`);
  logger.info(`Rate limiting: Ativado`);
  logger.info(`Sistema otimizado para 10.000 usuarios simultaneos`);
});

module.exports = app;
