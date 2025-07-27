const { Pool } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarESenha() {
  try {
    console.log('🔍 Verificando usuário rafael@teste.com...');
    
    const user = await pool.query(`
      SELECT id, email, nome, password_hash, escritorio_id, is_active
      FROM users 
      WHERE email = $1
    `, ['rafael@teste.com']);
    
    if (user.rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    const userData = user.rows[0];
    console.log('📋 Dados do usuário:');
    console.log('   ID:', userData.id);
    console.log('   Email:', userData.email);
    console.log('   Nome:', userData.nome);
    console.log('   Senha atual:', userData.password_hash);
    console.log('   Escritório ID:', userData.escritorio_id);
    console.log('   Ativo:', userData.is_active);
    
    // Corrigir a senha para '123456' (o que auth-working.ts espera)
    console.log('\n🔧 Corrigindo senha para "123456"...');
    await pool.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = $2
    `, ['123456', 'rafael@teste.com']);
    
    console.log('✅ Senha corrigida!');
    console.log('📝 Agora você pode fazer login com:');
    console.log('   Email: rafael@teste.com');
    console.log('   Senha: 123456');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

verificarESenha(); 