const { Client } = require('pg');
const fs = require('fs');

const client = new Client({ 
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
});

async function verificarColunasFaltando() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Buscar todas as colunas da tabela
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    const colunasBanco = result.rows.map(row => row.column_name);
    
    // Extrair colunas da query INSERT no código
    const serverContent = fs.readFileSync('server-simple.js', 'utf8');
    const insertMatch = serverContent.match(/INSERT INTO clientes \(([\s\S]*?)\)/);
    
    let colunasQuery = [];
    if (insertMatch) {
      colunasQuery = insertMatch[1]
        .split(',')
        .map(c => c.trim().replace(/"/g, '').replace(/\s+/g, ' '))
        .filter(c => c.length > 0);
    }
    
    console.log('\n📊 COMPARAÇÃO DE COLUNAS:');
    console.log('='.repeat(70));
    console.log(`🏦 BANCO DE DADOS: ${colunasBanco.length} colunas`);
    console.log(`📝 QUERY INSERT: ${colunasQuery.length} colunas`);
    console.log('');
    
    // Encontrar colunas faltando na query
    const colunasFaltando = colunasBanco.filter(col => !colunasQuery.includes(col));
    
    console.log('❌ COLUNAS FALTANDO NA QUERY INSERT:');
    if (colunasFaltando.length > 0) {
      colunasFaltando.forEach((col, i) => {
        console.log(`  ${i+1}. ${col}`);
      });
    } else {
      console.log('  ✅ Nenhuma coluna faltando');
    }
    
    // Encontrar colunas extras na query
    const colunasExtras = colunasQuery.filter(col => !colunasBanco.includes(col));
    
    console.log('\n⚠️ COLUNAS EXTRAS NA QUERY (não existem no banco):');
    if (colunasExtras.length > 0) {
      colunasExtras.forEach((col, i) => {
        console.log(`  ${i+1}. ${col}`);
      });
    } else {
      console.log('  ✅ Nenhuma coluna extra');
    }
    
    console.log('\n📋 TODAS AS COLUNAS DO BANCO:');
    colunasBanco.forEach((col, i) => {
      const naQuery = colunasQuery.includes(col) ? '✅' : '❌';
      console.log(`  ${(i+1).toString().padStart(2, '0')}. ${naQuery} ${col}`);
    });
    
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarColunasFaltando(); 