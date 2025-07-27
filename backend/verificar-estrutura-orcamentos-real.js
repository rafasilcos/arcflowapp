/**
 * 🔍 VERIFICAÇÃO: ESTRUTURA REAL DA TABELA ORÇAMENTOS
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarEstruturaOrcamentos() {
  console.log('🔍 VERIFICANDO ESTRUTURA REAL DA TABELA ORÇAMENTOS\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Verificar estrutura da tabela
    console.log('1. 📋 ESTRUTURA DA TABELA ORÇAMENTOS:');
    
    const estruturaQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'orcamentos'
      ORDER BY ordinal_position
    `;
    
    const estruturaResult = await client.query(estruturaQuery);
    
    if (estruturaResult.rows.length > 0) {
      console.log('✅ COLUNAS ENCONTRADAS:');
      estruturaResult.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
    } else {
      console.log('❌ TABELA ORÇAMENTOS NÃO ENCONTRADA!');
    }
    
    // Verificar orçamentos existentes
    console.log('\n2. 📊 ORÇAMENTOS EXISTENTES:');
    
    const orcamentosQuery = `
      SELECT id, codigo, nome, created_at
      FROM orcamentos 
      ORDER BY id DESC 
      LIMIT 10
    `;
    
    const orcamentosResult = await client.query(orcamentosQuery);
    
    if (orcamentosResult.rows.length > 0) {
      console.log('✅ ORÇAMENTOS ENCONTRADOS:');
      orcamentosResult.rows.forEach(orc => {
        console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome} (${orc.created_at})`);
      });
    } else {
      console.log('❌ NENHUM ORÇAMENTO ENCONTRADO!');
    }
    
    // Verificar se orçamento 62 existe
    console.log('\n3. 🎯 VERIFICANDO ORÇAMENTO 62:');
    
    const orc62Query = `SELECT * FROM orcamentos WHERE id = 62`;
    const orc62Result = await client.query(orc62Query);
    
    if (orc62Result.rows.length > 0) {
      console.log('✅ ORÇAMENTO 62 ENCONTRADO:');
      const orc = orc62Result.rows[0];
      Object.keys(orc).forEach(key => {
        console.log(`   - ${key}: ${orc[key]}`);
      });
    } else {
      console.log('❌ ORÇAMENTO 62 NÃO ENCONTRADO!');
    }
    
  } catch (error) {
    console.error('❌ ERRO NA VERIFICAÇÃO:', error);
  }
}

verificarEstruturaOrcamentos()
  .then(() => {
    console.log('\n🔍 VERIFICAÇÃO CONCLUÍDA');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NA VERIFICAÇÃO:', error);
    process.exit(1);
  });