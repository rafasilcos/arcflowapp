const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function verificarTabela() {
  try {
    await client.connect();
    console.log('🔍 Verificando estrutura da tabela briefings...\n');
    
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Colunas existentes na tabela briefings:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('\n🔍 Verificando se coluna "observacoes" existe...');
    const observacoesExiste = result.rows.some(row => row.column_name === 'observacoes');
    
    if (observacoesExiste) {
      console.log('✅ Coluna "observacoes" EXISTE');
    } else {
      console.log('❌ Coluna "observacoes" NÃO EXISTE');
      console.log('\n💡 Vou adicionar a coluna "observacoes" à tabela...');
      
      // Adicionar coluna observacoes
      await client.query(`
        ALTER TABLE briefings 
        ADD COLUMN IF NOT EXISTS observacoes TEXT
      `);
      
      console.log('✅ Coluna "observacoes" adicionada com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarTabela(); 