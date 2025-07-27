const { Client } = require('pg');
const bcrypt = require('bcrypt');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString: DATABASE_URL
});

async function createTestUser() {
  try {
    await client.connect();
    console.log('🔄 Conectado ao Supabase...');

    // 1. Verificar se já existe escritório de teste
    const existingEscritorio = await client.query(`
      SELECT id FROM escritorios WHERE id = 'escritorio_teste'
    `);

    if (existingEscritorio.rows.length === 0) {
      console.log('📋 Criando escritório de teste...');
      await client.query(`
        INSERT INTO escritorios (id, nome, email, estado, cep, "isActive", plano, "createdAt", "updatedAt")
        VALUES ('escritorio_teste', 'Escritório Teste ArcFlow', 'contato@arcflow.com', 'SP', '01000-000', true, 'PROFESSIONAL', NOW(), NOW())
      `);
    } else {
      console.log('✅ Escritório de teste já existe');
    }

    // 2. Verificar se já existe usuário de teste
    const existingUser = await client.query(`
      SELECT id FROM users WHERE email = 'admin@arcflow.com'
    `);

    if (existingUser.rows.length === 0) {
      console.log('📋 Criando usuário administrador de teste...');
      
      // Hash da senha "123456"
      const passwordHash = await bcrypt.hash('123456', 10);
      
      await client.query(`
        INSERT INTO users (id, email, password_hash, nome, role, escritorio_id, is_active, email_verified, created_at, updated_at)
        VALUES ('user_admin_teste', 'admin@arcflow.com', $1, 'Admin Teste', 'OWNER', 'escritorio_teste', true, true, NOW(), NOW())
      `, [passwordHash]);
    } else {
      console.log('✅ Usuário de teste já existe');
    }

    console.log('✅ Sistema de teste configurado com sucesso!');
    console.log('');
    console.log('🎯 DADOS DE TESTE CRIADOS:');
    console.log('   📧 Email: admin@arcflow.com');
    console.log('   🔑 Senha: 123456');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    console.log('   📋 Plano: PROFESSIONAL');
    console.log('');
    console.log('🚀 Agora podemos implementar as rotas de autenticação!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

createTestUser(); 