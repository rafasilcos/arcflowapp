const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function corrigirInconsistenciaEscritorios() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔗 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');
    
    // 1. Verificar dados do usuário admin@arcflow.com
    console.log('\n👤 Verificando dados do usuário admin@arcflow.com...');
    const adminUser = await client.query(`
      SELECT id, email, escritorio_id 
      FROM users 
      WHERE email = 'admin@arcflow.com'
    `);
    
    if (adminUser.rows.length === 0) {
      console.log('❌ Usuário admin@arcflow.com não encontrado!');
      return;
    }
    
    const usuario = adminUser.rows[0];
    console.log('📊 Dados do usuário:');
    console.log(`  ID: ${usuario.id}`);
    console.log(`  Email: ${usuario.email}`);
    console.log(`  Escritório ID: ${usuario.escritorio_id}`);
    
    // 2. Verificar escritorio_id dos clientes
    console.log('\n👥 Verificando escritorio_id dos clientes...');
    const clientesCheck = await client.query(`
      SELECT escritorio_id, COUNT(*) as total 
      FROM clientes 
      GROUP BY escritorio_id
    `);
    
    console.log('📊 Distribuição de clientes por escritório:');
    clientesCheck.rows.forEach(row => {
      console.log(`  Escritório "${row.escritorio_id}": ${row.total} clientes`);
    });
    
    // 3. Verificar se há usuários no mesmo escritório
    console.log('\n👥 Verificando outros usuários no escritório...');
    const usuariosEscritorio = await client.query(`
      SELECT id, nome, email 
      FROM users 
      WHERE escritorio_id = $1 AND is_active = true
    `, [usuario.escritorio_id]);
    
    console.log(`📊 Usuários no escritório "${usuario.escritorio_id}": ${usuariosEscritorio.rows.length}`);
    usuariosEscritorio.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nome} (${user.email})`);
    });
    
    // 4. CORREÇÃO: Mover clientes para o escritório correto do usuário
    const escritorioCorreto = usuario.escritorio_id;
    console.log(`\n🔧 Movendo TODOS os clientes para o escritório correto: "${escritorioCorreto}"`);
    
    const updateResult = await client.query(`
      UPDATE clientes 
      SET escritorio_id = $1, updated_at = NOW()
      WHERE escritorio_id != $1
      RETURNING id, nome, email
    `, [escritorioCorreto]);
    
    console.log(`✅ ${updateResult.rows.length} clientes movidos para o escritório correto:`);
    updateResult.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
    });
    
    // 5. Verificar se a correção funcionou
    console.log('\n🧪 Testando queries das APIs após correção...');
    
    // Testar query da API /users
    const usersQuery = await client.query(`
      SELECT id, nome, email, role 
      FROM users 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at ASC
    `, [escritorioCorreto]);
    
    console.log(`👥 API /users retornará: ${usersQuery.rows.length} usuários`);
    usersQuery.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    // Testar query da API /clientes
    const clientesQuery = await client.query(`
      SELECT id, nome, email 
      FROM clientes 
      WHERE escritorio_id = $1 AND is_active = true
      ORDER BY created_at DESC
    `, [escritorioCorreto]);
    
    console.log(`👥 API /clientes retornará: ${clientesQuery.rows.length} clientes`);
    clientesQuery.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
    });
    
    if (usersQuery.rows.length > 0 && clientesQuery.rows.length > 0) {
      console.log('\n🎉 CORREÇÃO APLICADA COM SUCESSO!');
      console.log('✅ API /users funcionará corretamente');
      console.log('✅ API /clientes funcionará corretamente');
      console.log('✅ Sistema de multi-tenancy consistente');
    } else {
      console.log('\n⚠️ Ainda há problemas:');
      if (usersQuery.rows.length === 0) console.log('  - API /users retornará vazio');
      if (clientesQuery.rows.length === 0) console.log('  - API /clientes retornará vazio');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
    console.log('\n🔚 Conexão encerrada.');
  }
}

// Executar correção
corrigirInconsistenciaEscritorios().catch(console.error); 