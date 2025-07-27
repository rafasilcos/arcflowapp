const { Client } = require('pg');

async function verificarUsuarios() {
  const client = new Client({ 
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco!');

    // Verificar usuários existentes
    const usuarios = await client.query(`
      SELECT 
        u.id, 
        u.email, 
        u.nome, 
        u.role, 
        u.is_active,
        u.escritorio_id,
        e.nome as escritorio_nome,
        e.is_active as escritorio_ativo
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    console.log('\n📋 USUÁRIOS NO BANCO:');
    usuarios.rows.forEach((user, i) => {
      console.log(`${i+1}. ${user.email}`);
      console.log(`   Nome: ${user.nome}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Ativo: ${user.is_active}`);
      console.log(`   Escritório: ${user.escritorio_nome} (${user.escritorio_ativo})`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });

    // Verificar se rafael@teste.com existe
    const rafaelUser = await client.query(`
      SELECT id, email, nome, is_active, escritorio_id 
      FROM users 
      WHERE email = 'rafael@teste.com'
    `);

    if (rafaelUser.rows.length > 0) {
      console.log('✅ rafael@teste.com EXISTE!');
      console.log('   ID:', rafaelUser.rows[0].id);
      console.log('   Ativo:', rafaelUser.rows[0].is_active);
    } else {
      console.log('❌ rafael@teste.com NÃO EXISTE!');
    }

    // Verificar se teste@arcflow.com existe
    const testeUser = await client.query(`
      SELECT id, email, nome, is_active, escritorio_id 
      FROM users 
      WHERE email = 'teste@arcflow.com'
    `);

    if (testeUser.rows.length > 0) {
      console.log('✅ teste@arcflow.com EXISTE!');
      console.log('   ID:', testeUser.rows[0].id);
      console.log('   Ativo:', testeUser.rows[0].is_active);
    } else {
      console.log('❌ teste@arcflow.com NÃO EXISTE!');
    }

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await client.end();
  }
}

verificarUsuarios(); 