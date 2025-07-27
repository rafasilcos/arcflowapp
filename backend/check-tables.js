const { Client } = require('pg');

async function checkTables() {
  const client = new Client({ 
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
  });

  try {
    await client.connect();
    console.log('✅ Conectado!');

    // Listar todas as tabelas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await client.query(tablesQuery);
    console.log('📊 TABELAS DO BANCO:');
    result.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.table_name}`);
    });

    // Verificar estrutura da tabela briefings
    console.log('\n🔍 COLUNAS DA TABELA BRIEFINGS:');
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position;
    `;
    
    const columns = await client.query(columnsQuery);
    columns.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await client.end();
  }
}

checkTables(); 