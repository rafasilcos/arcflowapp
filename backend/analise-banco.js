/**
 * 🔍 ANÁLISE CRITERIOSA DE INCONSISTÊNCIAS
 * Verificar todas as possíveis inconsistências entre briefing e orçamento
 */

const { Client } = require('pg');

async function analiseCriteriosa() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 ANÁLISE CRITERIOSA DE INCONSISTÊNCIAS');
    console.log('='.repeat(60));
    
    const briefingId = '947cbfa7-00db-4bda-b86b-033aa665dae5';
    
    // 1. Buscar dados do briefing
    const briefingResult = await client.query(`
      SELECT 
        nome_projeto,
        observacoes,
        created_at,
        updated_at
      FROM briefings 
      WHERE id = $1
    `, [briefingId]);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing não encontrado');
      return;
    }
    
    const briefing = briefingResult.rows[0];
    const observacoes = JSON.parse(briefing.observacoes);
    const respostas = observacoes.respostas;
    
    console.log('📋 DADOS DO BRIEFING:');
    console.log('Nome:', briefing.nome_projeto);
    console.log('Criado:', new Date(briefing.created_at).toLocaleString('pt-BR'));
    console.log('Atualizado:', new Date(briefing.updated_at).toLocaleString('pt-BR'));
    
    // 2. Buscar dados do orçamento
    const orcamentoResult = await client.query(`
      SELECT 
        codigo,
        area_construida,
        area_terreno,
        valor_total,
        valor_por_m2,
        localizacao,
        dados_extraidos,
        created_at
      FROM orcamentos 
      WHERE briefing_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [briefingId]);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ Orçamento não encontrado');
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    const dadosExtraidos = orcamento.dados_extraidos;
    
    console.log('\n💰 DADOS DO ORÇAMENTO:');
    console.log('Código:', orcamento.codigo);
    console.log('Criado:', new Date(orcamento.created_at).toLocaleString('pt-BR'));
    console.log('Área construída:', orcamento.area_construida, 'm²');
    console.log('Área terreno:', orcamento.area_terreno, 'm²');
    console.log('Localização:', orcamento.localizacao);
    
    console.log('\n🔍 ANÁLISE DETALHADA DAS RESPOSTAS:');
    console.log('-'.repeat(50));
    
    // Mapear perguntas importantes
    const perguntasImportantes = {
      '24': 'Área total desejada (m²)',
      '61': 'Localização do projeto',
      '62': 'Área do terreno (m²)',
      '63': 'Dimensões do terreno',
      '2': 'Investimento total disponível',
      '1': 'Tipo de projeto',
      '13': 'Localização (cidade/bairro)'
    };
    
    // Verificar cada pergunta importante
    for (const [perguntaId, descricao] of Object.entries(perguntasImportantes)) {
      const resposta = respostas[perguntaId];
      console.log(`P${perguntaId}: ${descricao}`);
      console.log(`     Resposta: ${resposta || 'NÃO RESPONDIDA'}`);
    }
    
    console.log('\n🤖 DADOS EXTRAÍDOS PELA IA:');
    console.log('-'.repeat(50));
    if (dadosExtraidos) {
      console.log('Área construída IA:', dadosExtraidos.areaConstruida, 'm²');
      console.log('Área terreno IA:', dadosExtraidos.areaTerreno, 'm²');
      console.log('Localização IA:', dadosExtraidos.localizacao);
      console.log('Nome projeto IA:', dadosExtraidos.nomeProjeto);
      console.log('Tipologia IA:', dadosExtraidos.tipologia);
      console.log('Complexidade IA:', dadosExtraidos.complexidade);
      console.log('Confiança IA:', dadosExtraidos.confiancaAnalise);
      console.log('Timestamp análise:', new Date(dadosExtraidos.timestampAnalise).toLocaleString('pt-BR'));
    }
    
    console.log('\n⚠️ INCONSISTÊNCIAS DETECTADAS:');
    console.log('='.repeat(60));
    
    let inconsistencias = 0;
    
    // 1. Verificar área construída
    const areaResposta = respostas['24'];
    const areaIA = dadosExtraidos?.areaConstruida;
    const areaOrcamento = orcamento.area_construida;
    
    if (areaResposta && areaIA && parseInt(areaResposta) !== areaIA) {
      inconsistencias++;
      console.log(`❌ ${inconsistencias}. ÁREA CONSTRUÍDA:`);
      console.log(`   Briefing (P24): ${areaResposta}m²`);
      console.log(`   IA extraiu: ${areaIA}m²`);
      console.log(`   Orçamento: ${areaOrcamento}m²`);
      console.log(`   🔧 CORREÇÃO: Usar ${areaResposta}m² do briefing`);
    }
    
    // 2. Verificar localização
    const localizacaoResposta61 = respostas['61'];
    const localizacaoResposta13 = respostas['13'];
    const localizacaoIA = dadosExtraidos?.localizacao;
    const localizacaoOrcamento = orcamento.localizacao;
    
    if (localizacaoResposta61 || localizacaoResposta13) {
      const localizacaoCorreta = localizacaoResposta61 || localizacaoResposta13;
      if (localizacaoIA !== localizacaoCorreta && !localizacaoCorreta.toLowerCase().includes('são paulo')) {
        inconsistencias++;
        console.log(`❌ ${inconsistencias}. LOCALIZAÇÃO:`);
        console.log(`   Briefing (P61): ${localizacaoResposta61 || 'N/A'}`);
        console.log(`   Briefing (P13): ${localizacaoResposta13 || 'N/A'}`);
        console.log(`   IA extraiu: ${localizacaoIA}`);
        console.log(`   Orçamento: ${localizacaoOrcamento}`);
        console.log(`   🔧 CORREÇÃO: Usar "${localizacaoCorreta}" do briefing`);
      }
    }
    
    // 3. Verificar área do terreno
    const areaTerreno = respostas['62'];
    const areaTerrenoIA = dadosExtraidos?.areaTerreno;
    const areaTerrenoOrcamento = orcamento.area_terreno;
    
    if (areaTerreno && areaTerrenoIA && parseInt(areaTerreno) !== areaTerrenoIA) {
      inconsistencias++;
      console.log(`❌ ${inconsistencias}. ÁREA DO TERRENO:`);
      console.log(`   Briefing (P62): ${areaTerreno}m²`);
      console.log(`   IA extraiu: ${areaTerrenoIA}m²`);
      console.log(`   Orçamento: ${areaTerrenoOrcamento}m²`);
      console.log(`   🔧 CORREÇÃO: Usar ${areaTerreno}m² do briefing`);
    }
    
    // 4. Verificar investimento
    const investimento = respostas['2'];
    const valorOrcamento = parseFloat(orcamento.valor_total);
    
    if (investimento) {
      const valorLimpo = investimento.replace(/[R$\s.]/g, '').replace(',', '.');
      const valorInvestimento = parseFloat(valorLimpo);
      
      if (valorInvestimento && valorOrcamento > valorInvestimento) {
        inconsistencias++;
        console.log(`❌ ${inconsistencias}. INVESTIMENTO:`);
        console.log(`   Briefing (P2): ${investimento}`);
        console.log(`   Valor numérico: R$ ${valorInvestimento.toLocaleString('pt-BR')}`);
        console.log(`   Orçamento gerado: R$ ${valorOrcamento.toLocaleString('pt-BR')}`);
        console.log(`   ⚠️ ATENÇÃO: Orçamento excede investimento disponível`);
      }
    }
    
    console.log('\n📊 RESUMO DA ANÁLISE:');
    console.log('='.repeat(60));
    
    if (inconsistencias === 0) {
      console.log('✅ NENHUMA INCONSISTÊNCIA DETECTADA');
      console.log('🎯 Sistema funcionando corretamente');
    } else {
      console.log(`❌ ${inconsistencias} INCONSISTÊNCIAS DETECTADAS`);
      console.log('🔧 CORREÇÕES NECESSÁRIAS IDENTIFICADAS');
      console.log('⚠️ CONFIABILIDADE DO SISTEMA COMPROMETIDA');
      
      console.log('\n🤖 POSSÍVEIS CAUSAS:');
      console.log('1. IA não está analisando corretamente as respostas');
      console.log('2. Mapeamento incorreto entre perguntas e campos');
      console.log('3. Valores padrão sendo usados incorretamente');
      console.log('4. Problemas na extração de dados estruturados');
    }
    
    console.log('\n🔍 RECOMENDAÇÕES:');
    console.log('1. Revisar algoritmo de extração da IA');
    console.log('2. Implementar validação cruzada briefing vs orçamento');
    console.log('3. Adicionar logs detalhados do processo de análise');
    console.log('4. Criar testes automatizados para detectar inconsistências');
    
  } catch (error) {
    console.error('❌ Erro na análise:', error);
  } finally {
    await client.end();
  }
}

analiseCriteriosa();