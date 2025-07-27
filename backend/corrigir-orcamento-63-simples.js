/**
 * 🔧 CORREÇÃO SIMPLES: CRONOGRAMA DO ORÇAMENTO 63
 */

const { connectDatabase, getClient } = require('./config/database');
const { gerarCronogramaCompleto } = require('./utils/cronogramaCompleto');

async function corrigir() {
  console.log('🔧 CORRIGINDO CRONOGRAMA DO ORÇAMENTO 63');
  
  try {
    await connectDatabase();
    const client = getClient();
    
    // Buscar orçamento 63
    const result = await client.query('SELECT * FROM orcamentos WHERE id = 63');
    
    if (result.rows.length === 0) {
      console.log('❌ Orçamento 63 não encontrado');
      return;
    }
    
    const orcamento = result.rows[0];
    console.log(`✅ Orçamento encontrado: ${orcamento.codigo}`);
    
    // Processar disciplinas
    let disciplinas = ['ARQUITETURA', 'ESTRUTURAL', 'HIDRAULICA', 'ELETRICA'];
    
    // Gerar cronograma completo
    const cronogramaCompleto = gerarCronogramaCompleto(parseFloat(orcamento.valor_total), disciplinas);
    
    console.log(`✅ Cronograma gerado: ${Object.keys(cronogramaCompleto.fases).length} fases`);
    
    // Atualizar no banco
    await client.query(
      'UPDATE orcamentos SET cronograma = $1, updated_at = NOW() WHERE id = 63',
      [JSON.stringify(cronogramaCompleto)]
    );
    
    console.log('✅ Cronograma atualizado no banco!');
    
    // Verificar primeira fase
    const primeiraFase = Object.values(cronogramaCompleto.fases)[0];
    console.log(`📋 Exemplo: ${primeiraFase.nome} - ${primeiraFase.entregaveis.length} entregáveis`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
  
  process.exit(0);
}

corrigir();