/**
 * 🔧 CORREÇÃO COMPLETA DE TODAS AS INCONSISTÊNCIAS
 */

const { Client } = require('pg');

async function correcaoCompleta() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔧 CORREÇÃO COMPLETA DE INCONSISTÊNCIAS');
    console.log('='.repeat(60));
    
    const briefingId = '947cbfa7-00db-4bda-b86b-033aa665dae5';
    const orcamentoId = 61;
    
    // 1. Buscar dados corretos do briefing
    const briefingResult = await client.query(`
      SELECT observacoes FROM briefings WHERE id = $1
    `, [briefingId]);
    
    const observacoes = JSON.parse(briefingResult.rows[0].observacoes);
    const respostas = observacoes.respostas;
    
    // 2. Extrair dados corretos
    const dadosCorretos = {
      areaConstruida: parseInt(respostas['24']), // 250m²
      areaTerreno: parseInt(respostas['62']), // 450m²
      localizacao: respostas['61'] || respostas['13'], // Garopaba/SC
      investimento: respostas['2'], // R$ 1.000.000,00
      tipoProjeto: respostas['1'] // Casa térrea
    };
    
    console.log('📋 DADOS CORRETOS DO BRIEFING:');
    console.log('Área construída:', dadosCorretos.areaConstruida, 'm²');
    console.log('Área terreno:', dadosCorretos.areaTerreno, 'm²');
    console.log('Localização:', dadosCorretos.localizacao);
    console.log('Investimento:', dadosCorretos.investimento);
    console.log('Tipo:', dadosCorretos.tipoProjeto);
    
    // 3. Buscar orçamento atual
    const orcamentoResult = await client.query(`
      SELECT valor_total, dados_extraidos FROM orcamentos WHERE id = $1
    `, [orcamentoId]);
    
    const orcamento = orcamentoResult.rows[0];
    const valorTotal = parseFloat(orcamento.valor_total);
    
    // 4. Calcular novos valores
    const novoValorPorM2 = (valorTotal / dadosCorretos.areaConstruida).toFixed(2);
    
    // 5. Atualizar dados extraídos com valores corretos
    const dadosExtraidos = orcamento.dados_extraidos;
    dadosExtraidos.areaConstruida = dadosCorretos.areaConstruida;
    dadosExtraidos.areaTerreno = dadosCorretos.areaTerreno;
    dadosExtraidos.localizacao = dadosCorretos.localizacao;
    dadosExtraidos.confiancaAnalise = 0.95; // Agora com dados corretos
    dadosExtraidos.timestampCorrecao = new Date().toISOString();
    dadosExtraidos.corrigidoManualmente = true;
    
    // 6. Aplicar correção completa
    const updateResult = await client.query(`
      UPDATE orcamentos 
      SET 
        area_construida = $1,
        area_terreno = $2,
        valor_por_m2 = $3,
        localizacao = $4,
        dados_extraidos = $5,
        updated_at = NOW()
      WHERE id = $6
    `, [
      dadosCorretos.areaConstruida,
      dadosCorretos.areaTerreno,
      novoValorPorM2,
      dadosCorretos.localizacao,
      JSON.stringify(dadosExtraidos),
      orcamentoId
    ]);
    
    console.log('\n✅ CORREÇÕES APLICADAS:');
    console.log('📏 Área construída:', dadosCorretos.areaConstruida, 'm²');
    console.log('📏 Área terreno:', dadosCorretos.areaTerreno, 'm²');
    console.log('📍 Localização:', dadosCorretos.localizacao);
    console.log('💵 Valor por m²:', novoValorPorM2);
    console.log('🔄 Linhas afetadas:', updateResult.rowCount);
    
    // 7. Verificar correção
    const verificacao = await client.query(`
      SELECT 
        area_construida, 
        area_terreno, 
        valor_por_m2, 
        localizacao,
        dados_extraidos
      FROM orcamentos 
      WHERE id = $1
    `, [orcamentoId]);
    
    if (verificacao.rows.length > 0) {
      const corrigido = verificacao.rows[0];
      console.log('\n🎯 VERIFICAÇÃO FINAL:');
      console.log('📏 Área construída:', corrigido.area_construida, 'm²');
      console.log('📏 Área terreno:', corrigido.area_terreno, 'm²');
      console.log('📍 Localização:', corrigido.localizacao);
      console.log('💵 Valor por m²:', corrigido.valor_por_m2);
      
      const dadosVerificacao = corrigido.dados_extraidos;
      console.log('🤖 Confiança IA:', dadosVerificacao.confiancaAnalise);
      console.log('🔧 Corrigido manualmente:', dadosVerificacao.corrigidoManualmente);
      
      // Verificar se todas as correções foram aplicadas
      let todasCorretas = true;
      
      if (corrigido.area_construida != dadosCorretos.areaConstruida) {
        console.log('❌ Área construída não corrigida');
        todasCorretas = false;
      }
      
      if (corrigido.area_terreno != dadosCorretos.areaTerreno) {
        console.log('❌ Área terreno não corrigida');
        todasCorretas = false;
      }
      
      if (corrigido.localizacao !== dadosCorretos.localizacao) {
        console.log('❌ Localização não corrigida');
        todasCorretas = false;
      }
      
      if (todasCorretas) {
        console.log('\n🎉 TODAS AS CORREÇÕES CONFIRMADAS!');
        console.log('✅ Sistema agora reflete dados reais do briefing');
        console.log('✅ Confiabilidade restaurada');
      } else {
        console.log('\n❌ ALGUMAS CORREÇÕES FALHARAM');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro na correção:', error);
  } finally {
    await client.end();
  }
}

correcaoCompleta();