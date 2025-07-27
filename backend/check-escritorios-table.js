const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function checkEscritoriosTable() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados');

    // Verificar estrutura da tabela escritorios
    console.log('\n📋 Verificando estrutura da tabela escritorios...');
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'escritorios'
      ORDER BY ordinal_position;
    `);

    if (structure.rows.length === 0) {
      console.log('❌ Tabela escritorios não existe');
    } else {
      console.log('Colunas da tabela escritorios:');
      structure.rows.forEach(row => {
        console.log(`  ✅ ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }

    // Verificar se existe algum escritório
    const count = await client.query('SELECT COUNT(*) FROM escritorios');
    console.log(`\n📊 Total de escritórios: ${count.rows[0].count}`);

    // Listar escritórios existentes
    const escritorios = await client.query('SELECT * FROM escritorios LIMIT 5');
    console.log('\n📝 Escritórios existentes:');
    escritorios.rows.forEach(escritorio => {
      console.log(`  - ID: ${escritorio.id}, Nome: ${escritorio.nome}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

checkEscritoriosTable(); 