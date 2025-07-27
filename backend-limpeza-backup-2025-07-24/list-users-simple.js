const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function listUsers() {
  try {
    console.log('🔍 Listando usuários no banco...');
    
    // Listar usuários (consulta simplificada)
    const users = await pool.query(`
      SELECT id, email, nome, escritorio_id, is_active, created_at
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10
    `);

    console.log(`\n👤 Total de usuários encontrados: ${users.rows.length}`);
    
    if (users.rows.length > 0) {
      console.log('\n📋 Usuários:');
      users.rows.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Nome: ${user.nome}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Escritório ID: ${user.escritorio_id}`);
        console.log(`   Ativo: ${user.is_active ? 'Sim' : 'Não'}`);
        console.log(`   Criado em: ${user.created_at}`);
        console.log('   ─────────────────────────────────────');
      });
      
      console.log('\n🔑 Para fazer login use:');
      console.log(`   Email: ${users.rows[0].email}`);
      console.log('   Senha: 123456');
    } else {
      console.log('\n❌ Nenhum usuário encontrado no banco');
      console.log('\n🚀 Vamos criar um usuário de teste...');
      
      // Criar usuário de teste
      try {
        const newUser = await pool.query(`
          INSERT INTO users (email, nome, escritorio_id, is_active, password_hash)
          VALUES ('admin@arcflow.com', 'Administrador ArcFlow', 'test-escritorio-id', true, 'hash_123456')
          RETURNING id, email, nome
        `);
        
        console.log('✅ Usuário criado:', newUser.rows[0]);
        console.log('\n🔑 Credenciais de login:');
        console.log('   Email: admin@arcflow.com');
        console.log('   Senha: 123456');
      } catch (createError) {
        console.log('❌ Erro ao criar usuário:', createError.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

listUsers(); 