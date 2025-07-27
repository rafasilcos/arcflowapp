const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarEstrutura() {
  try {
    await client.connect();
    
    console.log('🔍 Verificando estrutura da tabela escritorios...');
    
    // Verificar colunas da tabela escritorios
    const colunas = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'escritorios'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colunas da tabela escritorios:');
    colunas.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Verificar um escritório existente
    console.log('\n🔍 Exemplo de escritório existente:');
    
    const escritorioData = await client.query(`
      SELECT * FROM escritorios LIMIT 1
    `);
    
    if (escritorioData.rows.length > 0) {
      const escritorio = escritorioData.rows[0];
      console.log('✅ Escritório encontrado:');
      Object.keys(escritorio).forEach(key => {
        console.log(`  ${key}: ${escritorio[key]}`);
      });
    } else {
      console.log('❌ Nenhum escritório encontrado!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarEstrutura(); 