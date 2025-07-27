const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/arcflow_db'
});

async function verificarTipos() {
  try {
    console.log('🔍 Verificando tipos de colunas users.escritorio_id e escritorios.id...\n');
    
    // Verificar tipo da coluna users.escritorio_id
    const usersResult = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'escritorio_id'
    `);
    
    // Verificar tipo da coluna escritorios.id
    const escritoriosResult = await pool.query(`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'escritorios' AND column_name = 'id'
    `);
    
    console.log('📊 users.escritorio_id:');
    console.log('   Tipo:', usersResult.rows[0]?.data_type || 'N/A');
    console.log('   Tamanho:', usersResult.rows[0]?.character_maximum_length || 'N/A');
    
    console.log('\n📊 escritorios.id:');
    console.log('   Tipo:', escritoriosResult.rows[0]?.data_type || 'N/A');
    console.log('   Tamanho:', escritoriosResult.rows[0]?.character_maximum_length || 'N/A');
    
    // Testar uma query simples de JOIN
    console.log('\n🧪 Testando query de JOIN...');
    try {
      const testResult = await pool.query(`
        SELECT u.id, u.nome, e.nome as escritorio_nome
        FROM users u
        LEFT JOIN escritorios e ON u.escritorio_id = e.id
        WHERE u.email = $1
        LIMIT 1
      `, ['admin@arcflow.com']);
      
      console.log('✅ Query de JOIN funcionou!');
      if (testResult.rows.length > 0) {
        console.log('   Resultado:', testResult.rows[0]);
      }
    } catch (error) {
      console.log('❌ Query de JOIN falhou:', error.message);
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    await pool.end();
  }
}

console.log('🔧 Iniciando verificação de tipos users <-> escritorios...');
verificarTipos();