/**
 * 🔍 ANÁLISE: CRONOGRAMA DO ORÇAMENTO 63
 * 
 * Verificar se os entregáveis estão sendo armazenados corretamente
 */

const { connectDatabase, getClient } = require('./config/database');

async function analisarCronogramaOrcamento63() {
  console.log('🔍 ANALISANDO CRONOGRAMA DO ORÇAMENTO 61\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Primeiro listar orçamentos existentes
    const listResult = await client.query(`
      SELECT id, codigo, nome
      FROM orcamentos 
      ORDER BY id DESC
      LIMIT 10
    `);
    
    console.log('📋 ORÇAMENTOS EXISTENTES:');
    listResult.rows.forEach(orc => {
      console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome}`);
    });
    
    // Agora analisar o cronograma do orçamento 63
    const result = await client.query(`
      SELECT id, codigo, nome, cronograma
      FROM orcamentos 
      WHERE id = 63
    `);
    
    if (result.rows.length > 0) {
      const orc = result.rows[0];
      
      console.log('\n📊 DADOS DO ORÇAMENTO 63:');
      console.log(`   - ID: ${orc.id}`);
      console.log(`   - Código: ${orc.codigo}`);
      console.log(`   - Nome: ${orc.nome}`);
      
      console.log('\n🔍 ANÁLISE DO CRONOGRAMA:');
      console.log(`   - Tipo: ${typeof orc.cronograma}`);
      
      if (orc.cronograma && typeof orc.cronograma === 'object') {
        console.log('✅ Cronograma é um objeto válido');
        
        // Se é array (formato antigo)
        if (Array.isArray(orc.cronograma)) {
          console.log(`   - Formato: Array com ${orc.cronograma.length} fases`);
          
          orc.cronograma.forEach((fase, index) => {
            console.log(`\n📋 FASE ${index + 1}:`);
            console.log(`   - Nome: ${fase.etapa || fase.nome || 'N/A'}`);
            console.log(`   - Prazo: ${fase.prazo || 'N/A'} semanas`);
            console.log(`   - Valor: R$ ${fase.valor || 0}`);
            console.log(`   - Entregáveis: ${fase.entregaveis ? fase.entregaveis.length : 0} itens`);
            
            if (fase.entregaveis && fase.entregaveis.length > 0) {
              console.log('   📝 ENTREGÁVEIS:');
              fase.entregaveis.forEach((entregavel, i) => {
                console.log(`      ${i + 1}. ${entregavel}`);
              });
            } else {
              console.log('   ❌ NENHUM ENTREGÁVEL ENCONTRADO!');
            }
          });
        }
        
        // Se é objeto com fases (formato novo)
        else if (orc.cronograma.fases) {
          console.log(`   - Formato: Objeto com fases estruturadas`);
          console.log(`   - Prazo Total: ${orc.cronograma.prazoTotal || 'N/A'} semanas`);
          console.log(`   - Metodologia: ${orc.cronograma.metodologia || 'N/A'}`);
          
          const fases = Object.keys(orc.cronograma.fases);
          console.log(`   - Número de fases: ${fases.length}`);
          
          fases.forEach((faseKey, index) => {
            const fase = orc.cronograma.fases[faseKey];
            console.log(`\n📋 FASE ${index + 1} (${faseKey}):`);
            console.log(`   - Nome: ${fase.nome || 'N/A'}`);
            console.log(`   - Etapa: ${fase.etapa || 'N/A'}`);
            console.log(`   - Ordem: ${fase.ordem || 'N/A'}`);
            console.log(`   - Prazo: ${fase.prazo || 'N/A'} semanas`);
            console.log(`   - Valor: R$ ${fase.valor || 0}`);
            console.log(`   - Entregáveis: ${fase.entregaveis ? fase.entregaveis.length : 0} itens`);
            
            if (fase.entregaveis && fase.entregaveis.length > 0) {
              console.log('   📝 ENTREGÁVEIS:');
              fase.entregaveis.slice(0, 3).forEach((entregavel, i) => {
                console.log(`      ${i + 1}. ${entregavel}`);
              });
              if (fase.entregaveis.length > 3) {
                console.log(`      ... e mais ${fase.entregaveis.length - 3} entregáveis`);
              }
            } else {
              console.log('   ❌ NENHUM ENTREGÁVEL ENCONTRADO!');
            }
          });
        }
        
        // Formato desconhecido
        else {
          console.log('   ⚠️ Formato de cronograma desconhecido');
          console.log('   📊 Estrutura:', Object.keys(orc.cronograma));
        }
        
      } else {
        console.log('❌ Cronograma não é um objeto válido ou está vazio');
      }
      
    } else {
      console.log('❌ ORÇAMENTO 63 NÃO ENCONTRADO!');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

analisarCronogramaOrcamento63();