const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Testar usuários
    const users = await client.query('SELECT id, nome, email FROM users LIMIT 5');
    console.log('👥 Usuários:', users.rows);
    
    // Testar clientes
    const clientes = await client.query('SELECT id, nome, email FROM clientes LIMIT 5');
    console.log('🏢 Clientes:', clientes.rows);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

test(); 