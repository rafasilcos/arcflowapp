const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkClientesTable() {
  try {
    console.log('🔍 VERIFICANDO TABELA CLIENTES...\n');
    
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // 1. Verificar se tabela existe
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'clientes'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ ERRO: Tabela "clientes" não existe!');
      return;
    }
    
    console.log('✅ Tabela "clientes" existe');
    
    // 2. Verificar estrutura da tabela
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Estrutura da tabela clientes:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // 3. Contar registros
    const countResult = await client.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`\n📊 Total de clientes na tabela: ${countResult.rows[0].total}`);
    
    // 4. Mostrar últimos 5 registros
    if (parseInt(countResult.rows[0].total) > 0) {
      const recentClients = await client.query(`
        SELECT id, nome, email, escritorio_id, created_at 
        FROM clientes 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      console.log('\n📝 Últimos clientes cadastrados:');
      recentClients.rows.forEach((cliente, index) => {
        console.log(`  ${index + 1}. ${cliente.nome} - ${cliente.email} (${cliente.escritorio_id})`);
      });
    }
    
    // 5. Verificar escritórios
    const escritoriosResult = await client.query('SELECT id, nome FROM escritorios ORDER BY created_at DESC LIMIT 3');
    console.log('\n🏢 Escritórios disponíveis:');
    escritoriosResult.rows.forEach((escritorio, index) => {
      console.log(`  ${index + 1}. ${escritorio.nome} (ID: ${escritorio.id})`);
    });
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

checkClientesTable(); 