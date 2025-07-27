// ===== CRIAR TABELAS SIMPLES NO SUPABASE =====

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelasSimples() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar se escritorios já existe
    const escritoriosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'escritorios'
      )
    `);
    
    if (!escritoriosExist.rows[0].exists) {
      console.log('📋 Criando tabela escritorios...');
      await client.query(`
        CREATE TABLE escritorios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE,
          telefone VARCHAR(20),
          email VARCHAR(255),
          endereco JSONB,
          configuracoes JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'ativo',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela escritorios já existe');
    }
    
    // Verificar se usuarios já existe
    const usuariosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      )
    `);
    
    if (!usuariosExist.rows[0].exists) {
      console.log('👥 Criando tabela usuarios...');
      await client.query(`
        CREATE TABLE usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          avatar_url TEXT,
          telefone VARCHAR(20),
          cargo VARCHAR(100),
          departamento VARCHAR(100),
          status VARCHAR(20) DEFAULT 'ativo',
          ultimo_login TIMESTAMP WITH TIME ZONE,
          configuracoes JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela usuarios já existe');
    }
    
    // Verificar se refresh_tokens já existe
    const refreshTokensExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      )
    `);
    
    if (!refreshTokensExist.rows[0].exists) {
      console.log('🔑 Criando tabela refresh_tokens...');
      await client.query(`
        CREATE TABLE refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela refresh_tokens já existe');
    }
    
    // Verificar se convites já existe
    const convitesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'convites'
      )
    `);
    
    if (!convitesExist.rows[0].exists) {
      console.log('✉️ Criando tabela convites...');
      await client.query(`
        CREATE TABLE convites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          nome VARCHAR(255) NOT NULL,
          cargo VARCHAR(100),
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          remetente_id UUID,
          mensagem TEXT,
          status VARCHAR(20) DEFAULT 'pendente',
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          aceito_em TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela convites já existe');
    }
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Verificar se já existe usuário de teste
    const userExists = await client.query(`SELECT id FROM usuarios WHERE email = 'rafael@teste.com'`);
    
    if (userExists.rows.length === 0) {
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [escritorioId, 'Escritório Teste ArcFlow', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, cargo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
      
      console.log('✅ Usuário de teste criado com sucesso!');
    } else {
      console.log('✅ Usuário de teste já existe');
    }
    
    // Verificar dados finais
    const finalUsers = await client.query('SELECT nome, email, role FROM usuarios LIMIT 5');
    const finalEscritorios = await client.query('SELECT nome FROM escritorios LIMIT 5');
    
    console.log('\n📊 RESUMO FINAL:');
    console.log(`👥 Usuários: ${finalUsers.rows.length}`);
    finalUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log(`🏢 Escritórios: ${finalEscritorios.rows.length}`);
    finalEscritorios.rows.forEach((escritorio, index) => {
      console.log(`   ${index + 1}. ${escritorio.nome}`);
    });
    
    console.log('\n🎯 SISTEMA PRONTO PARA USAR!');
    console.log('🔗 Credenciais de teste:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('\n🌐 URLs para testar:');
    console.log('   - Backend: http://localhost:3001/health');
    console.log('   - Frontend: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

criarTabelasSimples(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelasSimples() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar se escritorios já existe
    const escritoriosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'escritorios'
      )
    `);
    
    if (!escritoriosExist.rows[0].exists) {
      console.log('📋 Criando tabela escritorios...');
      await client.query(`
        CREATE TABLE escritorios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE,
          telefone VARCHAR(20),
          email VARCHAR(255),
          endereco JSONB,
          configuracoes JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'ativo',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela escritorios já existe');
    }
    
    // Verificar se usuarios já existe
    const usuariosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      )
    `);
    
    if (!usuariosExist.rows[0].exists) {
      console.log('👥 Criando tabela usuarios...');
      await client.query(`
        CREATE TABLE usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          avatar_url TEXT,
          telefone VARCHAR(20),
          cargo VARCHAR(100),
          departamento VARCHAR(100),
          status VARCHAR(20) DEFAULT 'ativo',
          ultimo_login TIMESTAMP WITH TIME ZONE,
          configuracoes JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela usuarios já existe');
    }
    
    // Verificar se refresh_tokens já existe
    const refreshTokensExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      )
    `);
    
    if (!refreshTokensExist.rows[0].exists) {
      console.log('🔑 Criando tabela refresh_tokens...');
      await client.query(`
        CREATE TABLE refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela refresh_tokens já existe');
    }
    
    // Verificar se convites já existe
    const convitesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'convites'
      )
    `);
    
    if (!convitesExist.rows[0].exists) {
      console.log('✉️ Criando tabela convites...');
      await client.query(`
        CREATE TABLE convites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          nome VARCHAR(255) NOT NULL,
          cargo VARCHAR(100),
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          remetente_id UUID,
          mensagem TEXT,
          status VARCHAR(20) DEFAULT 'pendente',
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          aceito_em TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela convites já existe');
    }
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Verificar se já existe usuário de teste
    const userExists = await client.query(`SELECT id FROM usuarios WHERE email = 'rafael@teste.com'`);
    
    if (userExists.rows.length === 0) {
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [escritorioId, 'Escritório Teste ArcFlow', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, cargo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
      
      console.log('✅ Usuário de teste criado com sucesso!');
    } else {
      console.log('✅ Usuário de teste já existe');
    }
    
    // Verificar dados finais
    const finalUsers = await client.query('SELECT nome, email, role FROM usuarios LIMIT 5');
    const finalEscritorios = await client.query('SELECT nome FROM escritorios LIMIT 5');
    
    console.log('\n📊 RESUMO FINAL:');
    console.log(`👥 Usuários: ${finalUsers.rows.length}`);
    finalUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log(`🏢 Escritórios: ${finalEscritorios.rows.length}`);
    finalEscritorios.rows.forEach((escritorio, index) => {
      console.log(`   ${index + 1}. ${escritorio.nome}`);
    });
    
    console.log('\n🎯 SISTEMA PRONTO PARA USAR!');
    console.log('🔗 Credenciais de teste:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('\n🌐 URLs para testar:');
    console.log('   - Backend: http://localhost:3001/health');
    console.log('   - Frontend: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

criarTabelasSimples(); 
 
 
 
 
 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelasSimples() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar se escritorios já existe
    const escritoriosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'escritorios'
      )
    `);
    
    if (!escritoriosExist.rows[0].exists) {
      console.log('📋 Criando tabela escritorios...');
      await client.query(`
        CREATE TABLE escritorios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE,
          telefone VARCHAR(20),
          email VARCHAR(255),
          endereco JSONB,
          configuracoes JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'ativo',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela escritorios já existe');
    }
    
    // Verificar se usuarios já existe
    const usuariosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      )
    `);
    
    if (!usuariosExist.rows[0].exists) {
      console.log('👥 Criando tabela usuarios...');
      await client.query(`
        CREATE TABLE usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          avatar_url TEXT,
          telefone VARCHAR(20),
          cargo VARCHAR(100),
          departamento VARCHAR(100),
          status VARCHAR(20) DEFAULT 'ativo',
          ultimo_login TIMESTAMP WITH TIME ZONE,
          configuracoes JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela usuarios já existe');
    }
    
    // Verificar se refresh_tokens já existe
    const refreshTokensExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      )
    `);
    
    if (!refreshTokensExist.rows[0].exists) {
      console.log('🔑 Criando tabela refresh_tokens...');
      await client.query(`
        CREATE TABLE refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela refresh_tokens já existe');
    }
    
    // Verificar se convites já existe
    const convitesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'convites'
      )
    `);
    
    if (!convitesExist.rows[0].exists) {
      console.log('✉️ Criando tabela convites...');
      await client.query(`
        CREATE TABLE convites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          nome VARCHAR(255) NOT NULL,
          cargo VARCHAR(100),
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          remetente_id UUID,
          mensagem TEXT,
          status VARCHAR(20) DEFAULT 'pendente',
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          aceito_em TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela convites já existe');
    }
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Verificar se já existe usuário de teste
    const userExists = await client.query(`SELECT id FROM usuarios WHERE email = 'rafael@teste.com'`);
    
    if (userExists.rows.length === 0) {
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [escritorioId, 'Escritório Teste ArcFlow', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, cargo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
      
      console.log('✅ Usuário de teste criado com sucesso!');
    } else {
      console.log('✅ Usuário de teste já existe');
    }
    
    // Verificar dados finais
    const finalUsers = await client.query('SELECT nome, email, role FROM usuarios LIMIT 5');
    const finalEscritorios = await client.query('SELECT nome FROM escritorios LIMIT 5');
    
    console.log('\n📊 RESUMO FINAL:');
    console.log(`👥 Usuários: ${finalUsers.rows.length}`);
    finalUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log(`🏢 Escritórios: ${finalEscritorios.rows.length}`);
    finalEscritorios.rows.forEach((escritorio, index) => {
      console.log(`   ${index + 1}. ${escritorio.nome}`);
    });
    
    console.log('\n🎯 SISTEMA PRONTO PARA USAR!');
    console.log('🔗 Credenciais de teste:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('\n🌐 URLs para testar:');
    console.log('   - Backend: http://localhost:3001/health');
    console.log('   - Frontend: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

criarTabelasSimples(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelasSimples() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar se escritorios já existe
    const escritoriosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'escritorios'
      )
    `);
    
    if (!escritoriosExist.rows[0].exists) {
      console.log('📋 Criando tabela escritorios...');
      await client.query(`
        CREATE TABLE escritorios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          cnpj VARCHAR(18) UNIQUE,
          telefone VARCHAR(20),
          email VARCHAR(255),
          endereco JSONB,
          configuracoes JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'ativo',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela escritorios já existe');
    }
    
    // Verificar se usuarios já existe
    const usuariosExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      )
    `);
    
    if (!usuariosExist.rows[0].exists) {
      console.log('👥 Criando tabela usuarios...');
      await client.query(`
        CREATE TABLE usuarios (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          avatar_url TEXT,
          telefone VARCHAR(20),
          cargo VARCHAR(100),
          departamento VARCHAR(100),
          status VARCHAR(20) DEFAULT 'ativo',
          ultimo_login TIMESTAMP WITH TIME ZONE,
          configuracoes JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela usuarios já existe');
    }
    
    // Verificar se refresh_tokens já existe
    const refreshTokensExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      )
    `);
    
    if (!refreshTokensExist.rows[0].exists) {
      console.log('🔑 Criando tabela refresh_tokens...');
      await client.query(`
        CREATE TABLE refresh_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token TEXT UNIQUE NOT NULL,
          user_id UUID,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela refresh_tokens já existe');
    }
    
    // Verificar se convites já existe
    const convitesExist = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'convites'
      )
    `);
    
    if (!convitesExist.rows[0].exists) {
      console.log('✉️ Criando tabela convites...');
      await client.query(`
        CREATE TABLE convites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          token VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          nome VARCHAR(255) NOT NULL,
          cargo VARCHAR(100),
          role VARCHAR(50) DEFAULT 'USER',
          escritorio_id UUID,
          remetente_id UUID,
          mensagem TEXT,
          status VARCHAR(20) DEFAULT 'pendente',
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          aceito_em TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
    } else {
      console.log('✅ Tabela convites já existe');
    }
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Verificar se já existe usuário de teste
    const userExists = await client.query(`SELECT id FROM usuarios WHERE email = 'rafael@teste.com'`);
    
    if (userExists.rows.length === 0) {
      // Criar usuário de teste
      console.log('\n🔧 Criando usuário de teste...');
      const bcrypt = require('bcrypt');
      const { v4: uuidv4 } = require('uuid');
      
      const hashedPassword = await bcrypt.hash('123456', 12);
      const userId = uuidv4();
      const escritorioId = uuidv4();
      
      // Criar escritório primeiro
      await client.query(`
        INSERT INTO escritorios (id, nome, cnpj, telefone, email, endereco)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [escritorioId, 'Escritório Teste ArcFlow', '12345678901234', '11999999999', 'contato@teste.com', JSON.stringify({
        cep: '01234-567',
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP'
      })]);
      
      // Criar usuário
      await client.query(`
        INSERT INTO usuarios (id, nome, email, password_hash, role, escritorio_id, cargo)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
      
      console.log('✅ Usuário de teste criado com sucesso!');
    } else {
      console.log('✅ Usuário de teste já existe');
    }
    
    // Verificar dados finais
    const finalUsers = await client.query('SELECT nome, email, role FROM usuarios LIMIT 5');
    const finalEscritorios = await client.query('SELECT nome FROM escritorios LIMIT 5');
    
    console.log('\n📊 RESUMO FINAL:');
    console.log(`👥 Usuários: ${finalUsers.rows.length}`);
    finalUsers.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    
    console.log(`🏢 Escritórios: ${finalEscritorios.rows.length}`);
    finalEscritorios.rows.forEach((escritorio, index) => {
      console.log(`   ${index + 1}. ${escritorio.nome}`);
    });
    
    console.log('\n🎯 SISTEMA PRONTO PARA USAR!');
    console.log('🔗 Credenciais de teste:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('\n🌐 URLs para testar:');
    console.log('   - Backend: http://localhost:3001/health');
    console.log('   - Frontend: http://localhost:3000/auth/login');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
    console.log('\n🔌 Conexão fechada');
  }
}

criarTabelasSimples(); 
 
 
 
 
 
 
 
 