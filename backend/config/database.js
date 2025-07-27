/**
 * 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS
 * 
 * Configuração centralizada do PostgreSQL com pool de conexões otimizado
 */

const { Client, Pool } = require('pg');

// Configuração do banco de dados
const DATABASE_CONFIG = {
  connectionString: process.env.DATABASE_URL || 
    "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  
  // Configurações do pool para alta performance
  max: 20,                    // Máximo de 20 conexões simultâneas
  idleTimeoutMillis: 30000,   // 30 segundos para timeout de idle
  connectionTimeoutMillis: 2000, // 2 segundos para timeout de conexão
  
  // Configurações SSL para produção
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Pool de conexões global
let pool = null;
let client = null;

/**
 * Conectar ao banco de dados
 */
async function connectDatabase() {
  try {
    // Criar pool de conexões
    pool = new Pool(DATABASE_CONFIG);
    
    // Criar cliente único para compatibilidade com código legado
    client = new Client({ connectionString: DATABASE_CONFIG.connectionString });
    await client.connect();
    
    // Testar conexão
    const result = await pool.query('SELECT NOW() as timestamp, version() as version');
    console.log('📊 Banco conectado:', {
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].version.split(' ')[0]
    });
    
    // Configurar listeners de eventos
    pool.on('connect', () => {
      console.log('🔌 Nova conexão estabelecida no pool');
    });
    
    pool.on('error', (err) => {
      console.error('❌ Erro no pool de conexões:', err);
    });
    
    return { pool, client };
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco:', error);
    throw error;
  }
}

/**
 * Fechar conexões do banco
 */
async function closeDatabase() {
  try {
    if (client) {
      await client.end();
      console.log('🔌 Cliente PostgreSQL desconectado');
    }
    
    if (pool) {
      await pool.end();
      console.log('🔌 Pool PostgreSQL desconectado');
    }
  } catch (error) {
    console.error('❌ Erro ao fechar conexões:', error);
    throw error;
  }
}

/**
 * Obter pool de conexões
 */
function getPool() {
  if (!pool) {
    throw new Error('Pool de conexões não inicializado. Chame connectDatabase() primeiro.');
  }
  return pool;
}

/**
 * Obter cliente único (compatibilidade com código legado)
 */
function getClient() {
  if (!client) {
    throw new Error('Cliente não inicializado. Chame connectDatabase() primeiro.');
  }
  return client;
}

/**
 * Executar query com pool
 */
async function query(text, params) {
  const pool = getPool();
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log apenas queries lentas (> 100ms)
    if (duration > 100) {
      console.log('🐌 Query lenta:', {
        duration: `${duration}ms`,
        rows: result.rowCount,
        query: text.substring(0, 100) + '...'
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erro na query:', {
      error: error.message,
      query: text.substring(0, 100) + '...',
      params: params
    });
    throw error;
  }
}

/**
 * Executar transação
 */
async function transaction(callback) {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  connectDatabase,
  closeDatabase,
  getPool,
  getClient,
  query,
  transaction,
  
  // Exportar instâncias para compatibilidade com código legado
  get pool() { return pool; },
  get client() { return client; }
};