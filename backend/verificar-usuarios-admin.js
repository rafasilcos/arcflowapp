/**
 * 🔍 VERIFICAR USUÁRIOS ADMIN NO BANCO
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarUsuarios() {
  console.log('🔍 VERIFICANDO USUÁRIOS NO BANCO\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    const result = await client.query(`
      SELECT id, nome, email, role, created_at
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log('👥 USUÁRIOS ENCONTRADOS:');
    console.log('=' .repeat(60));
    
    result.rows.forEach(user => {
      console.log(`${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log('=' .repeat(60));
    console.log(`Total: ${result.rows.length} usuários`);
    
    if (result.rows.length > 0) {
      const primeiroUser = result.rows[0];
      console.log('\n🔑 PARA TESTAR, USE:');
      console.log(`Email: ${primeiroUser.email}`);
      console.log('Senha: (a senha que foi definida para este usuário)');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

verificarUsuarios()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 FALHA:', error);
    process.exit(1);
  });