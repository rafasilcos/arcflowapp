const { Client } = require('pg');

// Usar a mesma string de conexão do server-simple.js
const DATABASE_URL = "postgresql://postgres.mhbhvyrdcpgjlnfmjhji:arcflow2024!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function verificarColunas() {
  console.log('🔍 VERIFICANDO COLUNAS DA TABELA CLIENTES');
  console.log('========================================');

  const client = new Client({
    connectionString: DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');

    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 COLUNAS EXISTENTES:');
    result.rows.forEach((col, i) => {
      console.log(`${i+1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log('\n🔍 Total de colunas:', result.rows.length);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarColunas(); 