/**
 * 🔍 VERIFICAÇÃO: ESTRUTURA DA TABELA ORÇAMENTOS
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarEstrutura() {
  console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA ORÇAMENTOS\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Verificar estrutura da tabela
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
    
    console.log('📋 ESTRUTURA DA TABELA ORÇAMENTOS:');
    console.log('=' .repeat(60));
    
    estruturaResult.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(20)} | ${col.data_type.padEnd(15)} | ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('=' .repeat(60));
    
    // Verificar se existem orçamentos
    const countResult = await client.query('SELECT COUNT(*) as total FROM orcamentos');
    console.log(`\n📊 TOTAL DE ORÇAMENTOS: ${countResult.rows[0].total}`);
    
    // Listar alguns orçamentos
    if (parseInt(countResult.rows[0].total) > 0) {
      const orcamentosResult = await client.query(`
        SELECT id, codigo, nome, valor_total, prazo_entrega, status, created_at
        FROM orcamentos 
        ORDER BY id 
        LIMIT 10
      `);
      
      console.log('\n📋 ORÇAMENTOS EXISTENTES:');
      orcamentosResult.rows.forEach(orc => {
        console.log(`ID ${orc.id}: ${orc.codigo || 'SEM_CODIGO'} - ${orc.nome || 'SEM_NOME'} - R$ ${orc.valor_total || 0} - ${orc.prazo_entrega || 0} sem`);
      });
      
      // Verificar especificamente o ID 61
      const orc61Result = await client.query('SELECT * FROM orcamentos WHERE id = $1', [61]);
      
      if (orc61Result.rows.length > 0) {
        console.log('\n✅ ORÇAMENTO 61 ENCONTRADO:');
        const orc61 = orc61Result.rows[0];
        Object.keys(orc61).forEach(key => {
          console.log(`   ${key}: ${orc61[key]}`);
        });
      } else {
        console.log('\n❌ ORÇAMENTO 61 NÃO ENCONTRADO');
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

verificarEstrutura()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 FALHA:', error);
    process.exit(1);
  });