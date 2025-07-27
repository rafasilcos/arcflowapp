const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function testarClientes() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔗 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');
    
    // 1. Verificar se a tabela existe
    console.log('\n📋 Verificando estrutura da tabela clientes...');
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Colunas da tabela clientes:');
    tableInfo.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // 2. Contar total de registros
    console.log('\n🔢 Contando total de clientes...');
    const countAll = await client.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`📊 Total de registros na tabela: ${countAll.rows[0].total}`);
    
    // 3. Contar clientes ativos (não deletados)
    console.log('\n🔢 Contando clientes ativos...');
    const countActive = await client.query('SELECT COUNT(*) as total FROM clientes WHERE deleted_at IS NULL');
    console.log(`📊 Clientes ativos (não deletados): ${countActive.rows[0].total}`);
    
    // 4. Listar todos os clientes (sem filtro)
    console.log('\n📋 Listando TODOS os clientes...');
    const allClientes = await client.query('SELECT id, nome, email, deleted_at, is_active FROM clientes ORDER BY created_at DESC');
    console.log(`📊 Encontrados ${allClientes.rows.length} clientes:`);
    allClientes.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email}) - Deletado: ${cliente.deleted_at ? 'SIM' : 'NÃO'} - Ativo: ${cliente.is_active}`);
    });
    
    // 5. Testar query da API (com filtro deleted_at IS NULL)
    console.log('\n🔍 Testando query da API (deleted_at IS NULL)...');
    const apiQuery = await client.query(`
      SELECT * FROM clientes 
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC 
      LIMIT 25 OFFSET 0
    `);
    console.log(`📊 Query da API retornou: ${apiQuery.rows.length} clientes`);
    
    if (apiQuery.rows.length > 0) {
      console.log('📋 Clientes retornados pela query da API:');
      apiQuery.rows.forEach((cliente, index) => {
        console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
      });
    } else {
      console.log('❌ PROBLEMA: Query da API não retornou clientes!');
      
      // Verificar se o problema é o campo deleted_at
      console.log('\n🔍 Verificando valores do campo deleted_at...');
      const deletedCheck = await client.query('SELECT id, nome, deleted_at FROM clientes');
      deletedCheck.rows.forEach(row => {
        console.log(`  - ${row.nome}: deleted_at = ${row.deleted_at} (tipo: ${typeof row.deleted_at})`);
      });
    }
    
    // 6. Verificar se existe o usuário admin@arcflow.com
    console.log('\n👤 Verificando usuário admin@arcflow.com...');
    const adminUser = await client.query(`
      SELECT id, nome, email FROM users 
      WHERE email = 'admin@arcflow.com'
    `);
    
    if (adminUser.rows.length > 0) {
      console.log('✅ Usuário admin encontrado:', adminUser.rows[0]);
      
      // Verificar clientes deste escritório
      const escritorioId = adminUser.rows[0].id;
      console.log(`\n🏢 Verificando clientes do escritório ${escritorioId}...`);
      const clientesEscritorio = await client.query(`
        SELECT id, nome, email FROM clientes 
        WHERE escritorio_id = $1 OR created_by = $1
      `, [escritorioId]);
      
      console.log(`📊 Clientes do escritório: ${clientesEscritorio.rows.length}`);
      clientesEscritorio.rows.forEach(cliente => {
        console.log(`  - ${cliente.nome} (${cliente.email})`);
      });
    } else {
      console.log('❌ Usuário admin@arcflow.com não encontrado!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
    console.log('\n🔚 Conexão encerrada.');
  }
}

// Executar teste
testarClientes().catch(console.error); 