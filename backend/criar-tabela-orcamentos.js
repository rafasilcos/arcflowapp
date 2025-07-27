const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function criarTabelaOrcamentos() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Criar tabela orcamentos
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orcamentos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo VARCHAR(50) UNIQUE NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        status VARCHAR(50) DEFAULT 'RASCUNHO',
        area_construida DECIMAL(10,2),
        area_terreno DECIMAL(10,2),
        valor_total DECIMAL(15,2),
        valor_por_m2 DECIMAL(10,2),
        tipologia VARCHAR(100),
        padrao VARCHAR(100),
        complexidade VARCHAR(100),
        localizacao VARCHAR(255),
        disciplinas JSONB,
        composicao_financeira JSONB,
        cronograma JSONB,
        proposta JSONB,
        briefing_id UUID,
        cliente_id UUID,
        escritorio_id UUID NOT NULL,
        responsavel_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      );
    `;

    await client.query(createTableQuery);
    console.log('✅ Tabela orcamentos criada com sucesso!');

    // Criar índices
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_escritorio ON orcamentos(escritorio_id);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_briefing ON orcamentos(briefing_id);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente ON orcamentos(cliente_id);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);',
      'CREATE INDEX IF NOT EXISTS idx_orcamentos_deleted ON orcamentos(deleted_at);'
    ];

    for (const indexQuery of createIndexes) {
      await client.query(indexQuery);
    }
    console.log('✅ Índices criados com sucesso!');

    // Verificar se a tabela foi criada
    const verifyResult = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY ordinal_position
    `);

    console.log('✅ Estrutura da tabela orcamentos:');
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    console.log('\n🎉 Tabela orcamentos configurada e pronta para uso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabela orcamentos:', error);
  } finally {
    await client.end();
  }
}

// Executar
criarTabelaOrcamentos(); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 