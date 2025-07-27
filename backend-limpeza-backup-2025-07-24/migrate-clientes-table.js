const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function migrateClientesTable() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Conectado ao banco de dados');

    // 1. Verificar se a tabela existe
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('❌ Tabela clientes não existe. Criando...');
      
      // Criar tabela completa
      await client.query(`
        CREATE TABLE "clientes" (
          "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "nome" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "telefone" TEXT,
          "tipoPessoa" TEXT,
          "cpf" TEXT,
          "cnpj" TEXT,
          "endereco" JSONB,
          "observacoes" TEXT,
          "status" TEXT NOT NULL DEFAULT 'ativo',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "deletedAt" TIMESTAMP(3),
          "createdBy" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "escritorioId" TEXT NOT NULL
        );
      `);
      
      console.log('✅ Tabela clientes criada');
    } else {
      console.log('✅ Tabela clientes já existe. Verificando colunas...');
    }

    // 2. Verificar e adicionar colunas que não existem
    const columns = [
      { name: 'tipoPessoa', type: 'TEXT', default: null },
      { name: 'cpf', type: 'TEXT', default: null },
      { name: 'cnpj', type: 'TEXT', default: null },
      { name: 'endereco', type: 'JSONB', default: null },
      { name: 'status', type: 'TEXT', default: "'ativo'" },
      { name: 'deletedAt', type: 'TIMESTAMP(3)', default: null },
      { name: 'createdBy', type: 'TEXT', default: null }
    ];

    for (const column of columns) {
      try {
        const columnExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'clientes' 
            AND column_name = $1
          );
        `, [column.name]);

        if (!columnExists.rows[0].exists) {
          const alterQuery = `ALTER TABLE "clientes" ADD COLUMN "${column.name}" ${column.type}${column.default ? ` DEFAULT ${column.default}` : ''}`;
          await client.query(alterQuery);
          console.log(`✅ Coluna ${column.name} adicionada`);
        } else {
          console.log(`ℹ️ Coluna ${column.name} já existe`);
        }
      } catch (error) {
        console.log(`⚠️ Erro ao adicionar coluna ${column.name}:`, error.message);
      }
    }

    // 3. Verificar e criar índices
    const indexes = [
      { name: 'clientes_escritorioId_idx', column: 'escritorioId' },
      { name: 'clientes_email_idx', column: 'email' },
      { name: 'clientes_cpf_idx', column: 'cpf' },
      { name: 'clientes_cnpj_idx', column: 'cnpj' },
      { name: 'clientes_status_idx', column: 'status' },
      { name: 'clientes_deletedAt_idx', column: 'deletedAt' }
    ];

    for (const index of indexes) {
      try {
        await client.query(`CREATE INDEX IF NOT EXISTS "${index.name}" ON "clientes" ("${index.column}");`);
        console.log(`✅ Índice ${index.name} criado/verificado`);
      } catch (error) {
        console.log(`⚠️ Erro ao criar índice ${index.name}:`, error.message);
      }
    }

    // 4. Atualizar registros existentes para ter status padrão
    await client.query(`
      UPDATE "clientes" 
      SET "status" = 'ativo' 
      WHERE "status" IS NULL;
    `);

    console.log('✅ Registros atualizados com status padrão');

    // 5. Verificar estrutura final
    const finalStructure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'clientes'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Estrutura final da tabela clientes:');
    finalStructure.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    // 6. Contar registros
    const count = await client.query('SELECT COUNT(*) FROM "clientes"');
    console.log(`\n📊 Total de clientes na tabela: ${count.rows[0].count}`);

    console.log('\n🎉 Migração da tabela clientes concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexão fechada');
  }
}

migrateClientesTable(); 