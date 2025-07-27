const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable é obrigatória');
}

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redisClient.ping();
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', error: error.message });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const escritorioId = req.user?.escritorioId || 'escritorio_teste';
    const cacheKey = `clientes:${escritorioId}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const result = await pool.query(`
      SELECT id, nome, email, telefone, tipo_pessoa, cpf, cnpj,
             status, created_at
      FROM clientes 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `, [escritorioId]);

    const response = {
      clientes: result.rows,
      total: result.rows.length
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(response));
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/clientes/verificar-cpf/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const escritorioId = req.user?.escritorioId || 'escritorio_teste';
    const cacheKey = `cpf-check:${cpf}:${escritorioId}`;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(`
      SELECT nome FROM clientes 
      WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), ' ', '') = $1 
      AND escritorio_id = $2 AND is_active = true
      LIMIT 1
    `, [cpf, escritorioId]);

    const response = {
      duplicado: result.rows.length > 0,
      nomeCliente: result.rows[0]?.nome
    };

    await redisClient.setex(cacheKey, 60, JSON.stringify(response));
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Erro ao verificar CPF:', error);
    res.status(500).json({ duplicado: false });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    // ... mesma validação do código atual ...
    
    const result = await pool.query(`
      INSERT INTO clientes (id, nome, email, telefone, tipo_pessoa, cpf, cnpj, escritorio_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [/* ... mesmos parâmetros ... */]);

    const escritorioId = req.user?.escritorioId || 'escritorio_teste';
    await redisClient.del(`clientes:${escritorioId}`);
    
    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: result.rows[0]
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

app.listen(PORT, async () => {
  try {
    await pool.connect();
    await redisClient.connect();
    console.log(`🚀 ArcFlow Server ESCALÁVEL rodando na porta ${PORT}`);
    console.log(`✅ Database pool: 20 conexões`);
    console.log(`✅ Redis cache: Conectado`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down gracefully...');
  await pool.end();
  await redisClient.quit();
  process.exit(0);
}); 