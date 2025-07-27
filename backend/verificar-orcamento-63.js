/**
 * 🔍 VERIFICAÇÃO: ORÇAMENTO 63 NO BANCO DE DADOS
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarOrcamento63() {
  console.log('🔍 VERIFICANDO ORÇAMENTO 63 NO BANCO DE DADOS\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    const result = await client.query(`SELECT * FROM orcamentos WHERE id = 63`);
    
    if (result.rows.length > 0) {
      const orc = result.rows[0];
      console.log('✅ ORÇAMENTO 63 ENCONTRADO:');
      console.log(`   - ID: ${orc.id}`);
      console.log(`   - Código: ${orc.codigo}`);
      console.log(`   - Nome: ${orc.nome}`);
      console.log(`   - Valor Total: R$ ${parseFloat(orc.valor_total || 0).toLocaleString('pt-BR')}`);
      console.log(`   - Status: ${orc.status}`);
      console.log(`   - Briefing ID: ${orc.briefing_id}`);
      console.log(`   - Criado em: ${orc.created_at}`);
    } else {
      console.log('❌ ORÇAMENTO 63 NÃO ENCONTRADO!');
      
      // Listar orçamentos existentes
      const existentesResult = await client.query('SELECT id, codigo, nome FROM orcamentos ORDER BY id DESC LIMIT 5');
      console.log('\n📋 ÚLTIMOS ORÇAMENTOS:');
      existentesResult.rows.forEach(orc => {
        console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome}`);
      });
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

verificarOrcamento63();