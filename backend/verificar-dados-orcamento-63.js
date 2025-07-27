/**
 * 🔍 VERIFICAÇÃO DETALHADA: DADOS DO ORÇAMENTO 63
 */

const { connectDatabase, getClient } = require('./config/database');

async function verificarDadosOrcamento63() {
  console.log('🔍 VERIFICANDO DADOS DETALHADOS DO ORÇAMENTO 63\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    const result = await client.query(`
      SELECT 
        id, codigo, nome, disciplinas, cronograma, 
        composicao_financeira, proposta
      FROM orcamentos 
      WHERE id = 63
    `);
    
    if (result.rows.length > 0) {
      const orc = result.rows[0];
      
      console.log('📊 DADOS BRUTOS DO BANCO:');
      console.log(`ID: ${orc.id}`);
      console.log(`Código: ${orc.codigo}`);
      console.log(`Nome: ${orc.nome}`);
      
      console.log('\n🔍 ANÁLISE DOS CAMPOS JSON:');
      
      // Disciplinas
      console.log('1. DISCIPLINAS:');
      console.log(`   Tipo: ${typeof orc.disciplinas}`);
      console.log(`   Valor: ${orc.disciplinas}`);
      console.log(`   É JSON válido?`, isValidJSON(orc.disciplinas));
      
      // Cronograma
      console.log('\n2. CRONOGRAMA:');
      console.log(`   Tipo: ${typeof orc.cronograma}`);
      console.log(`   Valor (primeiros 100 chars): ${String(orc.cronograma).substring(0, 100)}...`);
      console.log(`   É JSON válido?`, isValidJSON(orc.cronograma));
      
      // Composição Financeira
      console.log('\n3. COMPOSIÇÃO FINANCEIRA:');
      console.log(`   Tipo: ${typeof orc.composicao_financeira}`);
      console.log(`   Valor (primeiros 100 chars): ${String(orc.composicao_financeira).substring(0, 100)}...`);
      console.log(`   É JSON válido?`, isValidJSON(orc.composicao_financeira));
      
      // Proposta
      console.log('\n4. PROPOSTA:');
      console.log(`   Tipo: ${typeof orc.proposta}`);
      console.log(`   Valor (primeiros 100 chars): ${String(orc.proposta).substring(0, 100)}...`);
      console.log(`   É JSON válido?`, isValidJSON(orc.proposta));
      
    } else {
      console.log('❌ ORÇAMENTO 63 NÃO ENCONTRADO!');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

function isValidJSON(str) {
  if (typeof str !== 'string') return false;
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

verificarDadosOrcamento63();