const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function verificarTiposClientesUsers() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verificar estrutura da tabela clientes
    console.log('\n📋 Verificando estrutura da tabela clientes...');
    const estruturaClientes = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Estrutura da tabela clientes:');
    estruturaClientes.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    // Verificar estrutura da tabela users
    console.log('\n📋 Verificando estrutura da tabela users...');
    const estruturaUsers = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Estrutura da tabela users:');
    estruturaUsers.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}) ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    // Verificar dados específicos do briefing
    console.log('\n🔍 Verificando dados específicos do briefing...');
    const briefingId = '8320013b-8caf-405e-aefc-401e29b61ef8';
    
    const briefingData = await client.query(`
      SELECT 
        id, 
        cliente_id, 
        responsavel_id, 
        escritorio_id,
        pg_typeof(cliente_id) as tipo_cliente_id,
        pg_typeof(responsavel_id) as tipo_responsavel_id,
        pg_typeof(escritorio_id) as tipo_escritorio_id
      FROM briefings 
      WHERE id::text = $1
    `, [briefingId]);

    if (briefingData.rows.length > 0) {
      const data = briefingData.rows[0];
      console.log('\n📋 Tipos de dados do briefing:');
      console.log('  - cliente_id:', data.cliente_id, '(tipo:', data.tipo_cliente_id + ')');
      console.log('  - responsavel_id:', data.responsavel_id, '(tipo:', data.tipo_responsavel_id + ')');
      console.log('  - escritorio_id:', data.escritorio_id, '(tipo:', data.tipo_escritorio_id + ')');
    }

    // Testar query simplificada sem JOINs
    console.log('\n🧪 Testando query sem JOINs...');
    try {
      const testResult = await client.query(`
        SELECT b.*
        FROM briefings b
        WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
      `, [briefingId, 'f47ac10b-58cc-4372-a567-0e02b2c3d479']);
      console.log('✅ Query sem JOINs funcionou');
    } catch (error) {
      console.log('❌ Query sem JOINs falhou:', error.message);
    }

    // Testar query com JOIN de clientes
    console.log('\n🧪 Testando query com JOIN de clientes...');
    try {
      const testResult = await client.query(`
        SELECT b.*, c.nome as cliente_nome
        FROM briefings b
        LEFT JOIN clientes c ON b.cliente_id::text = c.id
        WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
      `, [briefingId, 'f47ac10b-58cc-4372-a567-0e02b2c3d479']);
      console.log('✅ Query com JOIN de clientes funcionou');
    } catch (error) {
      console.log('❌ Query com JOIN de clientes falhou:', error.message);
    }

    // Testar query com JOIN de users
    console.log('\n🧪 Testando query com JOIN de users...');
    try {
      const testResult = await client.query(`
        SELECT b.*, u.nome as responsavel_nome
        FROM briefings b
        LEFT JOIN users u ON b.responsavel_id::text = u.id
        WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
      `, [briefingId, 'f47ac10b-58cc-4372-a567-0e02b2c3d479']);
      console.log('✅ Query com JOIN de users funcionou');
    } catch (error) {
      console.log('❌ Query com JOIN de users falhou:', error.message);
    }

    // Testar query completa
    console.log('\n🧪 Testando query completa...');
    try {
      const testResult = await client.query(`
        SELECT 
          b.*,
          c.nome as cliente_nome,
          c.email as cliente_email,
          c.telefone as cliente_telefone,
          u.nome as responsavel_nome
        FROM briefings b
        LEFT JOIN clientes c ON b.cliente_id::text = c.id
        LEFT JOIN users u ON b.responsavel_id::text = u.id
        WHERE b.id = $1::uuid AND b.escritorio_id = $2::uuid AND b.deleted_at IS NULL
      `, [briefingId, 'f47ac10b-58cc-4372-a567-0e02b2c3d479']);
      console.log('✅ Query completa funcionou');
    } catch (error) {
      console.log('❌ Query completa falhou:', error.message);
      console.log('📋 Detalhes:', error.code, error.position);
    }

  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
  } finally {
    await client.end();
  }
}

// Executar verificação
verificarTiposClientesUsers();