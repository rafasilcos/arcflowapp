const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function verificarTiposBriefings() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verificar estrutura da tabela briefings
    console.log('\n📋 Verificando estrutura da tabela briefings...');
    const estruturaResult = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Estrutura da tabela briefings:');
    estruturaResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    // Verificar estrutura da tabela orcamentos
    console.log('\n📋 Verificando estrutura da tabela orcamentos...');
    const estruturaOrcResult = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos' 
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Estrutura da tabela orcamentos:');
    estruturaOrcResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    // Verificar dados específicos do briefing
    console.log('\n🔍 Verificando dados do briefing específico...');
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8';
    
    const briefingData = await client.query(`
      SELECT id, escritorio_id, nome_projeto, status, 
             pg_typeof(id) as tipo_id, 
             pg_typeof(escritorio_id) as tipo_escritorio_id
      FROM briefings 
      WHERE id::text = $1
    `, [briefingId]);

    if (briefingData.rows.length > 0) {
      console.log('\n📋 Dados do briefing encontrado:');
      console.log('  - ID:', briefingData.rows[0].id, '(tipo:', briefingData.rows[0].tipo_id + ')');
      console.log('  - Escritório ID:', briefingData.rows[0].escritorio_id, '(tipo:', briefingData.rows[0].tipo_escritorio_id + ')');
      console.log('  - Nome:', briefingData.rows[0].nome_projeto);
      console.log('  - Status:', briefingData.rows[0].status);
    } else {
      console.log('❌ Briefing não encontrado');
    }

    // Testar query simples sem cast
    console.log('\n🧪 Testando query sem cast...');
    try {
      const testResult = await client.query(`
        SELECT id, escritorio_id FROM briefings WHERE id = $1 LIMIT 1
      `, [briefingId]);
      console.log('✅ Query sem cast funcionou');
    } catch (error) {
      console.log('❌ Query sem cast falhou:', error.message);
    }

    // Testar query com cast
    console.log('\n🧪 Testando query com cast...');
    try {
      const testResult = await client.query(`
        SELECT id, escritorio_id FROM briefings WHERE id = $1::uuid LIMIT 1
      `, [briefingId]);
      console.log('✅ Query com cast funcionou');
    } catch (error) {
      console.log('❌ Query com cast falhou:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  } finally {
    await client.end();
  }
}

// Executar verificação
verificarTiposBriefings();