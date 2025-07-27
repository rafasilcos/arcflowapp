import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Cliente Prisma simples
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL!
    }
  }
});

// Função simples para conectar ao banco
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Banco de dados conectado com sucesso');
  } catch (error) {
    logger.error('❌ Erro ao conectar banco:', error);
    throw new Error('Falha ao conectar com o banco de dados');
  }
};

// Função para desconectar do banco
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('✅ Banco de dados desconectado');
  } catch (error) {
    logger.error('❌ Erro ao desconectar banco:', error);
  }
};

// Função para criar todas as tabelas do sistema de autenticação
export const createAuthTables = async () => {
  console.log('🔄 Criando tabelas do sistema de autenticação...')
  
  const createTablesSQL = `
    -- Enum para planos
    DO $$ BEGIN
      CREATE TYPE "PlanType" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Enum para status de pagamento
    DO $$ BEGIN
      CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Enum para roles de usuário
    DO $$ BEGIN
      CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'ARCHITECT', 'INTERN', 'VIEWER');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- Tabela de planos
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

    -- Tabela de escritórios (tenants)
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

    -- Tabela de usuários
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

    -- Tabela de tokens de refresh
    CREATE TABLE IF NOT EXISTS "refresh_tokens" (
      "id" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "user_id" TEXT NOT NULL,
      "expires_at" TIMESTAMP(3) NOT NULL,
      "is_revoked" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
    );

    -- Tabela de pagamentos
    CREATE TABLE IF NOT EXISTS "payments" (
      "id" TEXT NOT NULL,
      "escritorio_id" TEXT NOT NULL,
      "plan_id" TEXT NOT NULL,
      "amount" DECIMAL(10,2) NOT NULL,
      "currency" TEXT NOT NULL DEFAULT 'BRL',
      "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
      "payment_method" TEXT,
      "external_id" TEXT, -- ID do gateway de pagamento
      "paid_at" TIMESTAMP(3),
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
    );

    -- Atualizar tabela de clientes para incluir escritorio_id
    ALTER TABLE "clientes" ADD COLUMN IF NOT EXISTS "escritorio_id" TEXT;

    -- Atualizar tabela de projetos para incluir escritorio_id  
    ALTER TABLE "projetos" ADD COLUMN IF NOT EXISTS "escritorio_id" TEXT;

    -- Índices para performance
    CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
    CREATE INDEX IF NOT EXISTS "idx_users_escritorio" ON "users"("escritorio_id");
    CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");
    CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_token" ON "refresh_tokens"("token");
    CREATE INDEX IF NOT EXISTS "idx_clientes_escritorio" ON "clientes"("escritorio_id");
    CREATE INDEX IF NOT EXISTS "idx_projetos_escritorio" ON "projetos"("escritorio_id");

    -- Foreign Keys
    ALTER TABLE "users" ADD CONSTRAINT IF NOT EXISTS "users_escritorio_id_fkey" 
      FOREIGN KEY ("escritorio_id") REFERENCES "escritorios"("id") ON DELETE CASCADE;
    
    ALTER TABLE "refresh_tokens" ADD CONSTRAINT IF NOT EXISTS "refresh_tokens_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

    ALTER TABLE "payments" ADD CONSTRAINT IF NOT EXISTS "payments_escritorio_id_fkey" 
      FOREIGN KEY ("escritorio_id") REFERENCES "escritorios"("id") ON DELETE CASCADE;

    ALTER TABLE "payments" ADD CONSTRAINT IF NOT EXISTS "payments_plan_id_fkey" 
      FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE;

    -- Inserir planos padrão
    INSERT INTO "plans" ("id", "name", "type", "price_monthly", "price_yearly", "max_users", "max_projects", "features") 
    VALUES 
      ('plan_free', 'ArcFlow Grátis', 'FREE', 0.00, 0.00, 2, 3, '{"briefings": true, "basic_reports": true}'),
      ('plan_basic', 'ArcFlow Básico', 'BASIC', 97.00, 970.00, 5, 15, '{"briefings": true, "reports": true, "crm": true}'),
      ('plan_pro', 'ArcFlow Profissional', 'PROFESSIONAL', 197.00, 1970.00, 15, 50, '{"all_features": true, "api_access": true, "priority_support": true}'),
      ('plan_enterprise', 'ArcFlow Enterprise', 'ENTERPRISE', 497.00, 4970.00, 100, 999, '{"all_features": true, "white_label": true, "custom_integrations": true}')
    ON CONFLICT ("id") DO NOTHING;

    -- Criar escritório de teste
    INSERT INTO "escritorios" ("id", "nome", "email", "plan_id", "subscription_status", "trial_ends_at") 
    VALUES ('escritorio_teste', 'Escritório Teste', 'teste@arcflow.com', 'plan_pro', 'ACTIVE', NOW() + INTERVAL '30 days')
    ON CONFLICT ("id") DO NOTHING;
  `;

  try {
    await prisma.$executeRawUnsafe(createTablesSQL);
    console.log('✅ Tabelas de autenticação criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

export { prisma };
export default prisma; 