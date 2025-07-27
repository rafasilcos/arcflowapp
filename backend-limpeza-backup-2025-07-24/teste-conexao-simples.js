const { Pool } = require('pg');

async function testarConexao() {
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'arcflow_db',
    user: 'postgres',
    password: '123456'
  });

  try {
    console.log('🔌 Testando conexão com PostgreSQL...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Conexão estabelecida!');
    console.log('⏰ Hora atual:', result.rows[0].current_time);
    
    // Testar se as tabelas existem
    console.log('\n📋 Verificando tabelas...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'escritorios', 'briefings', 'clientes', 'orcamentos')
      ORDER BY table_name
    `);
    
    console.log('📊 Tabelas encontradas:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    console.error('🔍 Detalhes:', error.code);
  } finally {
    await pool.end();
  }
}

testarConexao();