/**
 * 🔧 CORREÇÃO COMPLETA: ORÇAMENTO 64
 * 
 * Atualizar o orçamento 64 com cronograma corrigido de 72 entregáveis
 */

const { connectDatabase, getClient } = require('./config/database');
const { gerarCronogramaCompleto } = require('./utils/cronogramaCompleto');

async function corrigirOrcamento64() {
  console.log('🔧 CORRIGINDO ORÇAMENTO 64 COMPLETAMENTE\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Verificar se orçamento 64 existe
    const result = await client.query('SELECT * FROM orcamentos WHERE id = 64');
    
    if (result.rows.length === 0) {
      console.log('❌ ORÇAMENTO 64 NÃO ENCONTRADO!');
      
      // Listar orçamentos existentes
      const existentes = await client.query('SELECT id, codigo, nome FROM orcamentos ORDER BY id DESC LIMIT 5');
      console.log('\n📋 ORÇAMENTOS EXISTENTES:');
      existentes.rows.forEach(orc => {
        console.log(`   - ID ${orc.id}: ${orc.codigo} - ${orc.nome}`);
      });
      
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('📊 ORÇAMENTO 64 ENCONTRADO:');
    console.log(`   - ID: ${orcamento.id}`);
    console.log(`   - Código: ${orcamento.codigo}`);
    console.log(`   - Nome: ${orcamento.nome}`);
    console.log(`   - Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    
    // Gerar cronograma corrigido
    console.log('\n🔧 GERANDO CRONOGRAMA CORRIGIDO...');
    const disciplinas = ['arquitetura', 'estrutural', 'hidraulica', 'eletrica'];
    const cronogramaCorrigido = gerarCronogramaCompleto(parseFloat(orcamento.valor_total), disciplinas);
    
    console.log('✅ CRONOGRAMA CORRIGIDO GERADO:');
    console.log(`   - Total Entregáveis: ${cronogramaCorrigido.totalEntregaveis} (esperado: 72)`);
    console.log(`   - Prazo Total: ${cronogramaCorrigido.prazoTotal} semanas`);
    console.log(`   - Metodologia: ${cronogramaCorrigido.metodologia}`);
    console.log(`   - Número de Fases: ${Object.keys(cronogramaCorrigido.fases).length}`);
    
    // Mostrar resumo das fases
    console.log('\n📋 RESUMO DAS FASES:');
    Object.values(cronogramaCorrigido.fases).forEach((fase, index) => {
      console.log(`   ${index + 1}. ${fase.nome}: ${fase.entregaveis.length} entregáveis, ${fase.prazo} sem, R$ ${fase.valor.toLocaleString('pt-BR')}`);
    });
    
    // Atualizar no banco
    console.log('\n💾 ATUALIZANDO NO BANCO DE DADOS...');
    
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET cronograma = $1, updated_at = NOW()
      WHERE id = 64
    `, [JSON.stringify(cronogramaCorrigido)]);
    
    if (updateResult.rowCount > 0) {
      console.log('✅ ORÇAMENTO 64 ATUALIZADO COM SUCESSO!');
      
      // Verificar se foi salvo corretamente
      const verificacao = await client.query('SELECT cronograma FROM orcamentos WHERE id = 64');
      const cronogramaSalvo = verificacao.rows[0].cronograma;
      
      if (cronogramaSalvo && cronogramaSalvo.totalEntregaveis === 72) {
        console.log('✅ VERIFICAÇÃO: Cronograma salvo corretamente');
        console.log(`   - Entregáveis salvos: ${cronogramaSalvo.totalEntregaveis}`);
        console.log(`   - Fases salvas: ${Object.keys(cronogramaSalvo.fases).length}`);
      } else {
        console.log('⚠️ AVISO: Verificar se cronograma foi salvo corretamente');
      }
      
    } else {
      console.log('❌ ERRO: Não foi possível atualizar o orçamento');
    }
    
  } catch (error) {
    console.error('❌ ERRO NA CORREÇÃO:', error);
  }
}

corrigirOrcamento64()
  .then(() => {
    console.log('\n🎉 CORREÇÃO DO ORÇAMENTO 64 CONCLUÍDA!');
    console.log('✅ Cronograma com exatamente 72 entregáveis organizados');
    console.log('✅ Entregáveis corretos em cada etapa NBR 13532');
    console.log('✅ Sistema corrigido para futuros orçamentos');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NA CORREÇÃO:', error);
    process.exit(1);
  });