// ===== CRIAR TABELAS NO SUPABASE =====

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelas() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar tabelas existentes
    console.log('\n📋 Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tabelas encontradas:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    // Criar tabelas necessárias
    console.log('\n🔧 Criando tabelas necessárias...');
    
    // 1. Tabela escritorios
    console.log('📋 Criando tabela escritorios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS escritorios (
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
    
    // 2. Tabela usuarios
    console.log('👥 Criando tabela usuarios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
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
    
    // 3. Tabela refresh_tokens
    console.log('🔑 Criando tabela refresh_tokens...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 4. Tabela clientes
    console.log('🏢 Criando tabela clientes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        tipo_pessoa VARCHAR(10) DEFAULT 'fisica',
        cpf VARCHAR(14),
        cnpj VARCHAR(18),
        endereco JSONB,
        observacoes TEXT,
        status VARCHAR(20) DEFAULT 'ativo',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 5. Tabela convites
    console.log('✉️ Criando tabela convites...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS convites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        cargo VARCHAR(100),
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        remetente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        mensagem TEXT,
        status VARCHAR(20) DEFAULT 'pendente',
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        aceito_em TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Agora criar usuário de teste
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
      ON CONFLICT (cnpj) DO NOTHING
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
      ON CONFLICT (email) DO NOTHING
    `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
    
    console.log('✅ Usuário de teste criado:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('   👑 Role: ADMIN');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    
    console.log('\n🎯 SISTEMA PRONTO!');
    console.log('🔗 Agora você pode testar:');
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

criarTabelas(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelas() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar tabelas existentes
    console.log('\n📋 Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tabelas encontradas:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    // Criar tabelas necessárias
    console.log('\n🔧 Criando tabelas necessárias...');
    
    // 1. Tabela escritorios
    console.log('📋 Criando tabela escritorios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS escritorios (
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
    
    // 2. Tabela usuarios
    console.log('👥 Criando tabela usuarios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
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
    
    // 3. Tabela refresh_tokens
    console.log('🔑 Criando tabela refresh_tokens...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 4. Tabela clientes
    console.log('🏢 Criando tabela clientes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        tipo_pessoa VARCHAR(10) DEFAULT 'fisica',
        cpf VARCHAR(14),
        cnpj VARCHAR(18),
        endereco JSONB,
        observacoes TEXT,
        status VARCHAR(20) DEFAULT 'ativo',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 5. Tabela convites
    console.log('✉️ Criando tabela convites...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS convites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        cargo VARCHAR(100),
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        remetente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        mensagem TEXT,
        status VARCHAR(20) DEFAULT 'pendente',
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        aceito_em TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Agora criar usuário de teste
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
      ON CONFLICT (cnpj) DO NOTHING
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
      ON CONFLICT (email) DO NOTHING
    `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
    
    console.log('✅ Usuário de teste criado:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('   👑 Role: ADMIN');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    
    console.log('\n🎯 SISTEMA PRONTO!');
    console.log('🔗 Agora você pode testar:');
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

criarTabelas(); 
 
 
 
 
 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelas() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar tabelas existentes
    console.log('\n📋 Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tabelas encontradas:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    // Criar tabelas necessárias
    console.log('\n🔧 Criando tabelas necessárias...');
    
    // 1. Tabela escritorios
    console.log('📋 Criando tabela escritorios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS escritorios (
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
    
    // 2. Tabela usuarios
    console.log('👥 Criando tabela usuarios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
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
    
    // 3. Tabela refresh_tokens
    console.log('🔑 Criando tabela refresh_tokens...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 4. Tabela clientes
    console.log('🏢 Criando tabela clientes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        tipo_pessoa VARCHAR(10) DEFAULT 'fisica',
        cpf VARCHAR(14),
        cnpj VARCHAR(18),
        endereco JSONB,
        observacoes TEXT,
        status VARCHAR(20) DEFAULT 'ativo',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 5. Tabela convites
    console.log('✉️ Criando tabela convites...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS convites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        cargo VARCHAR(100),
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        remetente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        mensagem TEXT,
        status VARCHAR(20) DEFAULT 'pendente',
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        aceito_em TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Agora criar usuário de teste
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
      ON CONFLICT (cnpj) DO NOTHING
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
      ON CONFLICT (email) DO NOTHING
    `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
    
    console.log('✅ Usuário de teste criado:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('   👑 Role: ADMIN');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    
    console.log('\n🎯 SISTEMA PRONTO!');
    console.log('🔗 Agora você pode testar:');
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

criarTabelas(); 

const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 Conectando ao Supabase...');

async function criarTabelas() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao Supabase');
    
    // Verificar tabelas existentes
    console.log('\n📋 Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Tabelas encontradas:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
    // Criar tabelas necessárias
    console.log('\n🔧 Criando tabelas necessárias...');
    
    // 1. Tabela escritorios
    console.log('📋 Criando tabela escritorios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS escritorios (
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
    
    // 2. Tabela usuarios
    console.log('👥 Criando tabela usuarios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
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
    
    // 3. Tabela refresh_tokens
    console.log('🔑 Criando tabela refresh_tokens...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 4. Tabela clientes
    console.log('🏢 Criando tabela clientes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        tipo_pessoa VARCHAR(10) DEFAULT 'fisica',
        cpf VARCHAR(14),
        cnpj VARCHAR(18),
        endereco JSONB,
        observacoes TEXT,
        status VARCHAR(20) DEFAULT 'ativo',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // 5. Tabela convites
    console.log('✉️ Criando tabela convites...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS convites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        cargo VARCHAR(100),
        role VARCHAR(50) DEFAULT 'USER',
        escritorio_id UUID REFERENCES escritorios(id) ON DELETE CASCADE,
        remetente_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        mensagem TEXT,
        status VARCHAR(20) DEFAULT 'pendente',
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        aceito_em TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Criar índices para performance
    console.log('⚡ Criando índices...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_escritorio ON usuarios(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clientes_escritorio ON clientes(escritorio_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_convites_email ON convites(email)`);
    
    console.log('✅ Todas as tabelas criadas com sucesso!');
    
    // Agora criar usuário de teste
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
      ON CONFLICT (cnpj) DO NOTHING
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
      ON CONFLICT (email) DO NOTHING
    `, [userId, 'Rafael Costa', 'rafael@teste.com', hashedPassword, 'ADMIN', escritorioId, 'Administrador']);
    
    console.log('✅ Usuário de teste criado:');
    console.log('   📧 Email: rafael@teste.com');
    console.log('   🔑 Senha: 123456');
    console.log('   👑 Role: ADMIN');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    
    console.log('\n🎯 SISTEMA PRONTO!');
    console.log('🔗 Agora você pode testar:');
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

criarTabelas(); 
 
 
 
 
 
 
 
 