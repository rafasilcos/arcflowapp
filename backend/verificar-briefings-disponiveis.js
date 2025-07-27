/**
 * 🔍 VERIFICAR ESTRUTURA DA TABELA
 */

const { Client } = require('pg');

async function verificarEstruturaTabelaConfig() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA configuracoes_orcamento');
    console.log('='.repeat(60));
    
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'configuracoes_orcamento'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 COLUNAS DA TABELA:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    // Verificar dados existentes
    const dataResult = await client.query(`
      SELECT * FROM configuracoes_orcamento LIMIT 1
    `);
    
    if (dataResult.rows.length > 0) {
      console.log('\n📄 DADOS EXISTENTES:');
      const row = dataResult.rows[0];
      Object.entries(row).forEach(([key, value]) => {
        console.log(`${key}:`, typeof value === 'object' ? JSON.stringify(value, null, 2) : value);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

verificarEstruturaTabelaConfig();