const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function adicionarColunasOrcamentos() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verificar colunas existentes
    const currentColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY ordinal_position
    `);

    console.log('📋 Colunas atuais:');
    currentColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Adicionar colunas que estão faltando
    const colunasParaAdicionar = [
      { nome: 'cliente_id', tipo: 'UUID', existe: false },
      { nome: 'escritorio_id', tipo: 'UUID', existe: false },
      { nome: 'responsavel_id', tipo: 'UUID', existe: false }
    ];

    // Verificar quais colunas já existem
    for (const coluna of colunasParaAdicionar) {
      const existe = currentColumns.rows.some(row => row.column_name === coluna.nome);
      coluna.existe = existe;
    }

    // Adicionar colunas UUID que estão faltando
    for (const coluna of colunasParaAdicionar) {
      if (!coluna.existe) {
        console.log(`📋 Adicionando coluna ${coluna.nome} (${coluna.tipo})...`);
        await client.query(`
          ALTER TABLE orcamentos 
          ADD COLUMN ${coluna.nome} UUID
        `);
        console.log(`✅ Coluna ${coluna.nome} adicionada com sucesso!`);
      } else {
        console.log(`✅ Coluna ${coluna.nome} já existe`);
      }
    }

    // Criar índices nas novas colunas
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente_uuid ON orcamentos(cliente_id)',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_escritorio_uuid ON orcamentos(escritorio_id)',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_responsavel_uuid ON orcamentos(responsavel_id)'
    ];

    for (const index of indices) {
      await client.query(index);
    }
    console.log('✅ Índices UUID criados com sucesso!');

    // Verificar estrutura final da tabela
    const verifyResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Estrutura final da tabela orcamentos:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    console.log('\n🎉 Tabela orcamentos atualizada e pronta para uso!');
    
  } catch (error) {
    console.error('❌ Erro ao adicionar colunas:', error);
  } finally {
    await client.end();
  }
}

// Executar
adicionarColunasOrcamentos(); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 