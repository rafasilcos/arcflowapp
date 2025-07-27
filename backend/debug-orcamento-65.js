/**
 * 🐛 DEBUG: ORÇAMENTO 65 - ANÁLISE FOCADA
 */

const { connectDatabase, getClient } = require('./config/database');

async function debugOrcamento65() {
  console.log('🐛 DEBUG ORÇAMENTO 65\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    const result = await client.query('SELECT id, codigo, cronograma FROM orcamentos WHERE id = 65');
    
    if (result.rows.length === 0) {
      console.log('❌ Orçamento 65 não encontrado');
      
      const existentes = await client.query('SELECT id, codigo FROM orcamentos ORDER BY id DESC LIMIT 3');
      console.log('Orçamentos existentes:');
      existentes.rows.forEach(orc => console.log(`  - ID ${orc.id}: ${orc.codigo}`));
      return;
    }
    
    const orcamento = result.rows[0];
    console.log(`✅ Orçamento encontrado: ${orcamento.codigo}`);
    
    if (!orcamento.cronograma) {
      console.log('❌ Cronograma não existe!');
      return;
    }
    
    const cronograma = orcamento.cronograma;
    
    if (cronograma.fases) {
      console.log(`📊 Cronograma: ${Object.keys(cronograma.fases).length} fases`);
      console.log(`📊 Total entregáveis: ${cronograma.totalEntregaveis || 'N/A'}`);
      
      let totalContado = 0;
      Object.keys(cronograma.fases).forEach(faseKey => {
        const fase = cronograma.fases[faseKey];
        const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
        totalContado += numEntregaveis;
        console.log(`  ${fase.codigo}: ${numEntregaveis} entregáveis`);
      });
      
      console.log(`📊 Total contado: ${totalContado}`);
      console.log(`📊 Status: ${totalContado === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
      
      if (totalContado !== 72) {
        console.log('\n❌ PROBLEMA IDENTIFICADO: Total de entregáveis incorreto!');
        console.log('🔧 Necessário corrigir a geração do cronograma');
      }
      
    } else {
      console.log('❌ Cronograma sem estrutura de fases!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugOrcamento65();