// ===== VERIFICAR USUÁRIOS NO SUPABASE =====

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function verificarUsuarios() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar usuários
    console.log('\n👥 Verificando usuários...');
    const usersResult = await client.query('SELECT id, nome, email, role FROM usuarios LIMIT 10');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [escritorioId, 'Escritório Teste', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId]);
      
      console.log('✅ Usuário de teste criado:');
      console.log('   Email: rafael@teste.com');
      console.log('   Senha: 123456');
      console.log('   Role: ADMIN');
      
    } else {
      console.log(`✅ ${usersResult.rows.length} usuário(s) encontrado(s):`);
      usersResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    }
    
    // Verificar escritórios
    console.log('\n🏢 Verificando escritórios...');
    const escritoriosResult = await client.query('SELECT id, nome FROM escritorios LIMIT 10');
    
    if (escritoriosResult.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado');
    } else {
      console.log(`✅ ${escritoriosResult.rows.length} escritório(s) encontrado(s):`);
      escritoriosResult.rows.forEach((escritorio, index) => {
        console.log(`   ${index + 1}. ${escritorio.nome}`);
      });
    }
    
    console.log('\n🎯 RESUMO:');
    console.log('✅ Banco de dados funcionando');
    console.log('✅ Tabelas acessíveis');
    console.log('🔗 Pode testar login em: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

verificarUsuarios(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function verificarUsuarios() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar usuários
    console.log('\n👥 Verificando usuários...');
    const usersResult = await client.query('SELECT id, nome, email, role FROM usuarios LIMIT 10');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [escritorioId, 'Escritório Teste', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId]);
      
      console.log('✅ Usuário de teste criado:');
      console.log('   Email: rafael@teste.com');
      console.log('   Senha: 123456');
      console.log('   Role: ADMIN');
      
    } else {
      console.log(`✅ ${usersResult.rows.length} usuário(s) encontrado(s):`);
      usersResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    }
    
    // Verificar escritórios
    console.log('\n🏢 Verificando escritórios...');
    const escritoriosResult = await client.query('SELECT id, nome FROM escritorios LIMIT 10');
    
    if (escritoriosResult.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado');
    } else {
      console.log(`✅ ${escritoriosResult.rows.length} escritório(s) encontrado(s):`);
      escritoriosResult.rows.forEach((escritorio, index) => {
        console.log(`   ${index + 1}. ${escritorio.nome}`);
      });
    }
    
    console.log('\n🎯 RESUMO:');
    console.log('✅ Banco de dados funcionando');
    console.log('✅ Tabelas acessíveis');
    console.log('🔗 Pode testar login em: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

verificarUsuarios(); 
 
 
 
 
 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function verificarUsuarios() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar usuários
    console.log('\n👥 Verificando usuários...');
    const usersResult = await client.query('SELECT id, nome, email, role FROM usuarios LIMIT 10');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [escritorioId, 'Escritório Teste', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId]);
      
      console.log('✅ Usuário de teste criado:');
      console.log('   Email: rafael@teste.com');
      console.log('   Senha: 123456');
      console.log('   Role: ADMIN');
      
    } else {
      console.log(`✅ ${usersResult.rows.length} usuário(s) encontrado(s):`);
      usersResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    }
    
    // Verificar escritórios
    console.log('\n🏢 Verificando escritórios...');
    const escritoriosResult = await client.query('SELECT id, nome FROM escritorios LIMIT 10');
    
    if (escritoriosResult.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado');
    } else {
      console.log(`✅ ${escritoriosResult.rows.length} escritório(s) encontrado(s):`);
      escritoriosResult.rows.forEach((escritorio, index) => {
        console.log(`   ${index + 1}. ${escritorio.nome}`);
      });
    }
    
    console.log('\n🎯 RESUMO:');
    console.log('✅ Banco de dados funcionando');
    console.log('✅ Tabelas acessíveis');
    console.log('🔗 Pode testar login em: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

verificarUsuarios(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function verificarUsuarios() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar usuários
    console.log('\n👥 Verificando usuários...');
    const usersResult = await client.query('SELECT id, nome, email, role FROM usuarios LIMIT 10');
    
    if (usersResult.rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [escritorioId, 'Escritório Teste', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId]);
      
      console.log('✅ Usuário de teste criado:');
      console.log('   Email: rafael@teste.com');
      console.log('   Senha: 123456');
      console.log('   Role: ADMIN');
      
    } else {
      console.log(`✅ ${usersResult.rows.length} usuário(s) encontrado(s):`);
      usersResult.rows.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    }
    
    // Verificar escritórios
    console.log('\n🏢 Verificando escritórios...');
    const escritoriosResult = await client.query('SELECT id, nome FROM escritorios LIMIT 10');
    
    if (escritoriosResult.rows.length === 0) {
      console.log('❌ Nenhum escritório encontrado');
    } else {
      console.log(`✅ ${escritoriosResult.rows.length} escritório(s) encontrado(s):`);
      escritoriosResult.rows.forEach((escritorio, index) => {
        console.log(`   ${index + 1}. ${escritorio.nome}`);
      });
    }
    
    console.log('\n🎯 RESUMO:');
    console.log('✅ Banco de dados funcionando');
    console.log('✅ Tabelas acessíveis');
    console.log('🔗 Pode testar login em: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

verificarUsuarios(); 
 
 
 
 
 
 
 
 