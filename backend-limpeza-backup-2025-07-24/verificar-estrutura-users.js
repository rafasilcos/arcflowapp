const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarEstrutura() {
  try {
    await client.connect();
    
    console.log('🔍 Verificando estrutura da tabela users...');
    
    // Verificar colunas da tabela
    const colunas = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Colunas da tabela users:');
    colunas.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Verificar alguns usuários
    const usuarios = await client.query(`
      SELECT 
        id, 
        email, 
        role, 
        escritorio_id,
        ativo,
        senha_hash
      FROM users 
      LIMIT 3
    `);
    
    console.log('\n👥 Usuários encontrados:');
    usuarios.rows.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Ativo: ${user.ativo}`);
      console.log(`   Tem senha: ${user.senha_hash ? 'Sim' : 'Não'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarEstrutura();