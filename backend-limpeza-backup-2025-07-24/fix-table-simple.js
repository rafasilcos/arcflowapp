const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixTable() {
  try {
    await client.connect();
    console.log('🔧 Corrigindo tabela clientes...');

    // Adicionar colunas CPF e CNPJ separadas
    try {
      await client.query('ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cpf VARCHAR(20)');
      console.log('✅ Coluna CPF adicionada');
    } catch (e) {
      console.log('⚠️ CPF:', e.message);
    }

    try {
      await client.query('ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cnpj VARCHAR(30)');
      console.log('✅ Coluna CNPJ adicionada');
    } catch (e) {
      console.log('⚠️ CNPJ:', e.message);
    }

    // Adicionar outras colunas essenciais
    const columns = [
      'profissao VARCHAR(255)',
      'tipo_pessoa VARCHAR(20)',
      'data_nascimento DATE',
      'data_fundacao DATE',
      'endereco_numero VARCHAR(20)',
      'endereco_complemento VARCHAR(255)',
      'endereco_bairro VARCHAR(255)',
      'endereco_cep VARCHAR(20)',
      'endereco_pais VARCHAR(100)',
      'familia JSONB',
      'origem JSONB',
      'preferencias JSONB',
      'historico_projetos JSONB',
      'status VARCHAR(20)'
    ];

    for (const col of columns) {
      try {
        await client.query(`ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ${col}`);
        console.log(`✅ ${col.split(' ')[0]}`);
      } catch (e) {
        if (!e.message.includes('already exists')) {
          console.log(`⚠️ ${col}:`, e.message);
        }
      }
    }

    // Verificar estrutura final
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Colunas na tabela:');
    result.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.column_name}`);
    });

    console.log('\n🎉 Tabela corrigida! Agora teste o servidor.');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

fixTable(); 