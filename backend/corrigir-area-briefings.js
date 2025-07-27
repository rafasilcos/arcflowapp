/**
 * 🔧 CORRIGIR ÁREA DOS BRIEFINGS
 */

const { Client } = require('pg');

async function corrigirAreaBriefings() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 CORRIGINDO ÁREA DOS ORÇAMENTOS');
    console.log('='.repeat(50));
    
    // 1. Buscar orçamento específico
    const orcamentoId = 61;
    const briefingId = '947cbfa7-00db-4bda-b86b-033aa665dae5';
    
    // 2. Buscar área correta do briefing
    const briefingResult = await client.query(`
      SELECT observacoes FROM briefings WHERE id = $1
    `, [briefingId]);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing não encontrado');
      return;
    }
    
    const observacoes = JSON.parse(briefingResult.rows[0].observacoes);
    const areaCorreta = parseInt(observacoes.respostas['24']);
    
    console.log('📝 Área correta do briefing:', areaCorreta, 'm²');
    
    // 3. Calcular novo valor por m²
    const orcamentoResult = await client.query(`
      SELECT valor_total, area_construida, dados_extraidos FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ Orçamento não encontrado');
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    const valorTotal = parseFloat(orcamento.valor_total);
    const areaAtual = orcamento.area_construida;
    const novoValorPorM2 = (valorTotal / areaCorreta).toFixed(2);
    
    console.log('💰 Valor total:', valorTotal);
    console.log('📏 Área atual:', areaAtual, 'm²');
    console.log('📏 Área correta:', areaCorreta, 'm²');
    console.log('💵 Novo valor por m²:', novoValorPorM2);
    
    // 4. Atualizar dados extraídos
    const dadosExtraidos = orcamento.dados_extraidos;
    dadosExtraidos.areaConstruida = areaCorreta;
    
    // 5. Executar correção
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        area_construida = $1,
        valor_por_m2 = $2,
        dados_extraidos = $3,
        updated_at = NOW()
      WHERE id = $4
    `, [areaCorreta, novoValorPorM2, JSON.stringify(dadosExtraidos), orcamentoId]);
    
    console.log('\n✅ CORREÇÃO APLICADA:');
    console.log('📏 Área atualizada:', areaCorreta, 'm²');
    console.log('💵 Valor por m² atualizado:', novoValorPorM2);
    console.log('🔄 Linhas afetadas:', updateResult.rowCount);
    
    // 6. Verificar correção
    const verificacao = await client.query(`
      SELECT area_construida, valor_por_m2 FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    if (verificacao.rows.length > 0) {
      const corrigido = verificacao.rows[0];
      console.log('\n🎯 VERIFICAÇÃO:');
      console.log('📏 Área final:', corrigido.area_construida, 'm²');
      console.log('💵 Valor por m² final:', corrigido.valor_por_m2);
      
      if (corrigido.area_construida == areaCorreta) {
        console.log('✅ CORREÇÃO CONFIRMADA!');
      } else {
        console.log('❌ Erro na correção');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

corrigirAreaBriefings();