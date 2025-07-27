const { Pool } = require('pg');
const redis = require('redis');

console.log('🔍 Testando conexões ArcFlow Backend...\n');

// Teste PostgreSQL
async function testPostgreSQL() {
  console.log('📊 Testando PostgreSQL...');
  
  const pool = new Pool({
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
    ssl: false
  });
  
  try {
    const result = await pool.query('SELECT 1 as test');
    console.log('✅ PostgreSQL conectado!');
    console.log('   Resultado:', result.rows[0]);
    await pool.end();
  } catch (error) {
    console.log('❌ PostgreSQL erro:', error.message);
  }
}

// Teste Redis
async function testRedis() {
  console.log('\n⚡ Testando Redis...');
  
  const client = redis.createClient({
    url: 'redis://localhost:6379'
  });
  
  client.on('error', (err) => {
    console.log('❌ Redis erro:', err.message);
  });
  
  try {
    await client.connect();
    console.log('✅ Redis conectado!');
    
    // Teste básico
    await client.set('test', 'hello');
    const value = await client.get('test');
    console.log('   Teste cache:', value);
    
    await client.del('test');
    await client.quit();
  } catch (error) {
    console.log('❌ Redis não disponível:', error.message);
    console.log('💡 Instale Redis: docker run -d -p 6379:6379 redis:alpine');
  }
}

// Executar testes
async function runTests() {
  await testPostgreSQL();
  await testRedis();
  console.log('\n🎯 Testes concluídos!');
}

runTests().catch(console.error); 