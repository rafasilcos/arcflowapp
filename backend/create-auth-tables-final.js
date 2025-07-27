const { Client } = require('pg');

// String de conexão do Supabase
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString: DATABASE_URL
});

async function createAuthTables() {
  try {
    await client.connect();
    console.log('🔄 Conectado ao Supabase...');

    // 1. Criar ENUMs
    console.log('📋 Criando ENUMs...');
    
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "PlanType" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'ARCHITECT', 'INTERN', 'VIEWER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Criar tabela de planos
    console.log('📋 Criando tabela de planos...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "type" "PlanType" NOT NULL,
        "price_monthly" DECIMAL(10,2) NOT NULL,
        "price_yearly" DECIMAL(10,2) NOT NULL,
        "max_users" INTEGER NOT NULL,
        "max_projects" INTEGER NOT NULL,
        "features" JSONB NOT NULL DEFAULT '{}',
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
      );
    `);

    // 3. Criar tabela de escritórios
    console.log('📋 Criando tabela de escritórios...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "escritorios" (
        "id" TEXT NOT NULL,
        "nome" TEXT NOT NULL,
        "cnpj" TEXT,
        "email" TEXT NOT NULL,
        "telefone" TEXT,
        "endereco" TEXT,
        "cidade" TEXT,
        "estado" TEXT,
        "cep" TEXT,
        "plan_id" TEXT NOT NULL,
        "subscription_status" TEXT NOT NULL DEFAULT 'TRIAL',
        "trial_ends_at" TIMESTAMP(3),
        "subscription_ends_at" TIMESTAMP(3),
        "max_users" INTEGER NOT NULL DEFAULT 5,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "escritorios_pkey" PRIMARY KEY ("id")
      );
    `);

    // 4. Criar tabela de usuários
    console.log('📋 Criando tabela de usuários...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password_hash" TEXT NOT NULL,
        "nome" TEXT NOT NULL,
        "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
        "escritorio_id" TEXT NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "last_login" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `);

    // 5. Criar tabela de refresh tokens
    console.log('📋 Criando tabela de refresh tokens...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "refresh_tokens" (
        "id" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "expires_at" TIMESTAMP(3) NOT NULL,
        "is_revoked" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
      );
    `);

    // 6. Criar tabela de pagamentos
    console.log('📋 Criando tabela de pagamentos...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" TEXT NOT NULL,
        "escritorio_id" TEXT NOT NULL,
        "plan_id" TEXT NOT NULL,
        "amount" DECIMAL(10,2) NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'BRL',
        "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
        "payment_method" TEXT,
        "external_id" TEXT,
        "paid_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
      );
    `);

    // 7. Atualizar tabelas existentes
    console.log('📋 Atualizando tabelas existentes...');
    await client.query(`ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "escritorio_id" TEXT;`);
    await client.query(`ALTER TABLE "projetos" ADD COLUMN IF NOT EXISTS "escritorio_id" TEXT;`);

    // 8. Inserir dados iniciais
    console.log('📋 Inserindo planos padrão...');
    await client.query(`
      INSERT INTO "plans" ("id", "name", "type", "price_monthly", "price_yearly", "max_users", "max_projects", "features") 
      VALUES 
        ('plan_free', 'ArcFlow Grátis', 'FREE', 0.00, 0.00, 2, 3, '{"briefings": true, "basic_reports": true}'),
        ('plan_basic', 'ArcFlow Básico', 'BASIC', 97.00, 970.00, 5, 15, '{"briefings": true, "reports": true, "crm": true}'),
        ('plan_pro', 'ArcFlow Profissional', 'PROFESSIONAL', 197.00, 1970.00, 15, 50, '{"all_features": true, "api_access": true, "priority_support": true}'),
        ('plan_enterprise', 'ArcFlow Enterprise', 'ENTERPRISE', 497.00, 4970.00, 100, 999, '{"all_features": true, "white_label": true, "custom_integrations": true}')
      ON CONFLICT ("id") DO NOTHING;
    `);

    console.log('📋 Criando escritório de teste...');
    await client.query(`
      INSERT INTO "escritorios" ("id", "nome", "email", "plan_id", "subscription_status", "trial_ends_at") 
      VALUES ('escritorio_teste', 'Escritório Teste ArcFlow', 'teste@arcflow.com', 'plan_pro', 'ACTIVE', NOW() + INTERVAL '30 days')
      ON CONFLICT ("id") DO NOTHING;
    `);

    console.log('📋 Criando usuário administrador de teste...');
    // Senha: "123456" (hash bcrypt real)
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('123456', 10);
    
    await client.query(`
      INSERT INTO "users" ("id", "email", "password_hash", "nome", "role", "escritorio_id", "email_verified") 
      VALUES ('user_admin_teste', 'admin@arcflow.com', $1, 'Admin Teste', 'OWNER', 'escritorio_teste', true)
      ON CONFLICT ("id") DO NOTHING;
    `, [passwordHash]);

    console.log('✅ Sistema de autenticação criado com sucesso!');
    console.log('');
    console.log('🎯 DADOS DE TESTE CRIADOS:');
    console.log('   📧 Email: admin@arcflow.com');
    console.log('   🔑 Senha: 123456');
    console.log('   🏢 Escritório: Escritório Teste ArcFlow');
    console.log('   📋 Plano: ArcFlow Profissional (R$ 197/mês)');
    console.log('');
    console.log('🚀 Próximos passos:');
    console.log('   1. ✅ Banco configurado');
    console.log('   2. 🔄 Implementar rotas de autenticação');
    console.log('   3. 🔄 Criar sistema de login');
    console.log('   4. 🔄 Conectar frontend');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

createAuthTables(); 