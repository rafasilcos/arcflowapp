const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function checkAndCreateUsers() {
  try {
    console.log('🔍 Verificando estrutura da tabela users...');
    
    // Verificar se a tabela users existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('❌ Tabela users não existe. Criando...');
      
      // Criar tabela users
      await pool.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          nome VARCHAR(255) NOT NULL,
          escritorio_id UUID REFERENCES escritorios(id),
          password_hash VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP NULL
        );
      `);
      
      console.log('✅ Tabela users criada com sucesso!');
    } else {
      console.log('✅ Tabela users já existe');
    }

    // Verificar estrutura da tabela
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estrutura da tabela users:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
    });

    // Verificar usuários existentes
    const userCount = await pool.query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
    console.log(`\n👥 Total de usuários ativos: ${userCount.rows[0].count}`);

    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('\n🚀 Criando usuário de teste...');
      
      // Buscar primeiro escritório
      const escritorioResult = await pool.query(`
        SELECT id, nome FROM escritorios 
        WHERE deleted_at IS NULL 
        ORDER BY created_at ASC 
        LIMIT 1
      `);

      if (escritorioResult.rows.length === 0) {
        console.log('❌ Nenhum escritório encontrado. Criando escritório de teste...');
        
        const novoEscritorio = await pool.query(`
          INSERT INTO escritorios (nome, cnpj, telefone, email)
          VALUES ('Escritório ArcFlow', '12.345.678/0001-90', '(11) 99999-9999', 'contato@arcflow.com')
          RETURNING id, nome
        `);
        
        console.log('✅ Escritório de teste criado:', novoEscritorio.rows[0]);
        
        // Criar usuário admin
        await pool.query(`
          INSERT INTO users (email, nome, escritorio_id, password_hash)
          VALUES ('admin@arcflow.com', 'Administrador ArcFlow', $1, 'hash_123456')
        `, [novoEscritorio.rows[0].id]);
        
      } else {
        // Criar usuário admin
        await pool.query(`
          INSERT INTO users (email, nome, escritorio_id, password_hash)
          VALUES ('admin@arcflow.com', 'Administrador ArcFlow', $1, 'hash_123456')
        `, [escritorioResult.rows[0].id]);
      }
      
      console.log('✅ Usuário admin@arcflow.com criado com sucesso!');
      console.log('🔑 Senha: 123456');
    }

    // Listar usuários
    const users = await pool.query(`
      SELECT u.id, u.email, u.nome, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
    `);

    console.log('\n👤 Usuários cadastrados:');
    users.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.nome}) - Escritório: ${user.escritorio_nome || 'N/A'}`);
    });

    console.log('\n✅ Verificação concluída!');
    console.log('\n🚀 Para fazer login use:');
    console.log('   Email: admin@arcflow.com');
    console.log('   Senha: 123456');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkAndCreateUsers(); 