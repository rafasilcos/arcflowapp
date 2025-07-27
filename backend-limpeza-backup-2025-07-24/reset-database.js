const { Client } = require('pg');
const bcrypt = require('bcrypt');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString: DATABASE_URL
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('🔄 Conectado ao Supabase...');

    // 1. APAGAR TODAS AS TABELAS EXISTENTES
    console.log('🗑️ APAGANDO TABELAS EXISTENTES...');
    
    const dropTables = [
      'DROP TABLE IF EXISTS refresh_tokens CASCADE;',
      'DROP TABLE IF EXISTS payments CASCADE;',
      'DROP TABLE IF EXISTS clientes CASCADE;',
      'DROP TABLE IF EXISTS projetos CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
      'DROP TABLE IF EXISTS escritorios CASCADE;',
      'DROP TABLE IF EXISTS plans CASCADE;',
      'DROP TYPE IF EXISTS "UserRole" CASCADE;',
      'DROP TYPE IF EXISTS "PlanType" CASCADE;',
      'DROP TYPE IF EXISTS "PaymentStatus" CASCADE;'
    ];

    for (const dropSQL of dropTables) {
      try {
        await client.query(dropSQL);
        console.log(`   ✅ ${dropSQL.split(' ')[4]} removida`);
      } catch (err) {
        console.log(`   ⚠️ ${dropSQL.split(' ')[4]} não existia`);
      }
    }

    // 2. CRIAR ENUMS
    console.log('\n📋 CRIANDO ENUMS...');
    
    await client.query(`
      CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'ARCHITECT', 'INTERN', 'VIEWER');
    `);
    
    await client.query(`
      CREATE TYPE "PlanType" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');
    `);
    
    await client.query(`
      CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
    `);

    // 3. CRIAR TABELA DE PLANOS
    console.log('📋 Criando tabela de planos...');
    await client.query(`
      CREATE TABLE "plans" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "type" "PlanType" NOT NULL,
        "price_monthly" DECIMAL(10,2) NOT NULL,
        "price_yearly" DECIMAL(10,2) NOT NULL,
        "max_users" INTEGER NOT NULL,
        "max_projects" INTEGER NOT NULL,
        "features" JSONB NOT NULL DEFAULT '{}',
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. CRIAR TABELA DE ESCRITÓRIOS (TENANTS)
    console.log('📋 Criando tabela de escritórios (tenants)...');
    await client.query(`
      CREATE TABLE "escritorios" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "nome" TEXT NOT NULL,
        "cnpj" TEXT,
        "email" TEXT NOT NULL,
        "telefone" TEXT,
        "endereco" TEXT,
        "cidade" TEXT,
        "estado" TEXT,
        "cep" TEXT,
        "plan_id" TEXT NOT NULL REFERENCES "plans"("id"),
        "subscription_status" TEXT NOT NULL DEFAULT 'TRIAL',
        "trial_ends_at" TIMESTAMP(3),
        "subscription_ends_at" TIMESTAMP(3),
        "max_users" INTEGER NOT NULL DEFAULT 5,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. CRIAR TABELA DE USUÁRIOS
    console.log('📋 Criando tabela de usuários...');
    await client.query(`
      CREATE TABLE "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password_hash" TEXT NOT NULL,
        "nome" TEXT NOT NULL,
        "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
        "escritorio_id" TEXT NOT NULL REFERENCES "escritorios"("id") ON DELETE CASCADE,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "verification_token" TEXT,
        "reset_password_token" TEXT,
        "reset_password_expires" TIMESTAMP(3),
        "last_login" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. CRIAR TABELA DE REFRESH TOKENS
    console.log('📋 Criando tabela de refresh tokens...');
    await client.query(`
      CREATE TABLE "refresh_tokens" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "token" TEXT NOT NULL UNIQUE,
        "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "is_revoked" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. CRIAR TABELA DE PAGAMENTOS
    console.log('📋 Criando tabela de pagamentos...');
    await client.query(`
      CREATE TABLE "payments" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "escritorio_id" TEXT NOT NULL REFERENCES "escritorios"("id") ON DELETE CASCADE,
        "plan_id" TEXT NOT NULL REFERENCES "plans"("id"),
        "amount" DECIMAL(10,2) NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'BRL',
        "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "payment_method" TEXT,
        "external_id" TEXT,
        "paid_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. CRIAR TABELA DE CLIENTES
    console.log('📋 Criando tabela de clientes...');
    await client.query(`
      CREATE TABLE "clientes" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "nome" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "telefone" TEXT,
        "cpf_cnpj" TEXT,
        "endereco" TEXT,
        "cidade" TEXT,
        "estado" TEXT,
        "cep" TEXT,
        "observacoes" TEXT,
        "escritorio_id" TEXT NOT NULL REFERENCES "escritorios"("id") ON DELETE CASCADE,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 9. CRIAR TABELA DE PROJETOS
    console.log('📋 Criando tabela de projetos...');
    await client.query(`
      CREATE TABLE "projetos" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "nome" TEXT NOT NULL,
        "descricao" TEXT,
        "cliente_id" TEXT REFERENCES "clientes"("id"),
        "escritorio_id" TEXT NOT NULL REFERENCES "escritorios"("id") ON DELETE CASCADE,
        "status" TEXT NOT NULL DEFAULT 'PLANEJAMENTO',
        "data_inicio" TIMESTAMP(3),
        "data_fim_prevista" TIMESTAMP(3),
        "valor_total" DECIMAL(12,2),
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. CRIAR ÍNDICES PARA PERFORMANCE
    console.log('📋 Criando índices para performance...');
    await client.query(`CREATE INDEX idx_users_email ON users(email);`);
    await client.query(`CREATE INDEX idx_users_escritorio ON users(escritorio_id);`);
    await client.query(`CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);`);
    await client.query(`CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);`);
    await client.query(`CREATE INDEX idx_clientes_escritorio ON clientes(escritorio_id);`);
    await client.query(`CREATE INDEX idx_projetos_escritorio ON projetos(escritorio_id);`);
    await client.query(`CREATE INDEX idx_projetos_cliente ON projetos(cliente_id);`);

    // 11. INSERIR DADOS INICIAIS
    console.log('\n📋 INSERINDO DADOS INICIAIS...');
    
    // Planos
    await client.query(`
      INSERT INTO "plans" (id, name, type, price_monthly, price_yearly, max_users, max_projects, features) 
      VALUES 
        ('plan_free', 'ArcFlow Grátis', 'FREE', 0.00, 0.00, 2, 3, '{"briefings": true, "basic_reports": true}'),
        ('plan_basic', 'ArcFlow Básico', 'BASIC', 97.00, 970.00, 5, 15, '{"briefings": true, "reports": true, "crm": true}'),
        ('plan_pro', 'ArcFlow Profissional', 'PROFESSIONAL', 197.00, 1970.00, 15, 50, '{"all_features": true, "api_access": true, "priority_support": true}'),
        ('plan_enterprise', 'ArcFlow Enterprise', 'ENTERPRISE', 497.00, 4970.00, 100, 999, '{"all_features": true, "white_label": true, "custom_integrations": true}');
    `);

    // Escritório de teste
    await client.query(`
      INSERT INTO "escritorios" (id, nome, email, plan_id, subscription_status, trial_ends_at) 
      VALUES ('escritorio_teste', 'Escritório Teste ArcFlow', 'contato@arcflow.com', 'plan_pro', 'ACTIVE', NOW() + INTERVAL '30 days');
    `);

    // Usuário administrador de teste
    const passwordHash = await bcrypt.hash('123456', 10);
    await client.query(`
      INSERT INTO "users" (id, email, password_hash, nome, role, escritorio_id, email_verified) 
      VALUES ('user_admin_teste', 'admin@arcflow.com', $1, 'Admin Teste', 'OWNER', 'escritorio_teste', true);
    `, [passwordHash]);

    // Cliente de teste
    await client.query(`
      INSERT INTO "clientes" (id, nome, email, telefone, escritorio_id) 
      VALUES ('cliente_teste_1', 'João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'escritorio_teste');
    `);

    console.log('\n✅ SISTEMA DE AUTENTICAÇÃO COMPLETO CRIADO!');
    console.log('');
    console.log('🎯 DADOS DE TESTE CRIADOS:');
    console.log('   📧 Email: admin@arcflow.com');
    console.log('   🔑 Senha: 123456');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    console.log('   📋 Plano: ArcFlow Profissional (R$ 197/mês)');
    console.log('   👤 Cliente: João Silva');
    console.log('');
    console.log('🚀 PRÓXIMOS PASSOS:');
    console.log('   1. ✅ Banco limpo e recriado');
    console.log('   2. 🔄 Implementar rotas de autenticação');
    console.log('   3. 🔄 Criar middleware JWT');
    console.log('   4. 🔄 Sistema de login/registro');
    console.log('   5. 🔄 Conectar frontend');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

resetDatabase(); 