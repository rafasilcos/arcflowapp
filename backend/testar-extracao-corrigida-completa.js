/**
 * 🧪 TESTE COMPLETO DA EXTRAÇÃO CORRIGIDA DE DADOS DO BRIEFING
 * 
 * Verifica se todos os problemas identificados foram resolvidos:
 * 1. Área extraída corretamente (250m² vs 150m²)
 * 2. Área de atuação extraída (RESIDENCIAL)
 * 3. Tipologia mantida correta
 * 4. Disciplinas e serviços corretos
 */

const { connectDatabase, getClient } = require('./config/database');
const BriefingAnalyzer = require('./utils/briefingAnalyzer');
const OrcamentoCalculator = require('./utils/orcamentoCalculator');

async function testarExtracaoCorrigida() {
  await connectDatabase();
  const client = getClient();
  
  try {
    console.log('🧪 TESTE COMPLETO DA EXTRAÇÃO CORRIGIDA\n');
    
    // Usar o briefing que sabemos que tem os dados corretos
    const briefingId = '6a9e3407-8da0-4bbc-8221-768b6e6d255e';
    
    // Buscar briefing completo
    const briefingResult = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        u.nome as responsavel_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      WHERE b.id = $1::uuid AND b.deleted_at IS NULL
    `, [briefingId]);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing não encontrado');
      return;
    }
    
    const briefing = briefingResult.rows[0];
    
    console.log('📋 BRIEFING DE TESTE:');
    console.log(`   Nome: ${briefing.nome_projeto}`);
    console.log(`   Tipologia original: ${briefing.tipologia}`);
    console.log(`   Área original: ${briefing.area}`);
    console.log(`   Cliente: ${briefing.cliente_nome}`);
    console.log('');
    
    // Testar análise inteligente
    console.log('🧠 TESTANDO ANÁLISE INTELIGENTE CORRIGIDA...');
    const analyzer = new BriefingAnalyzer();
    const dadosEstruturados = await analyzer.extrairDadosEstruturados(briefing);
    
    console.log('✅ DADOS EXTRAÍDOS:');
    console.log(`   🏢 Área de atuação: ${dadosEstruturados.areaAtuacao}`);
    console.log(`   🏠 Tipologia: ${dadosEstruturados.tipologia}`);
    console.log(`   📐 Área construída: ${dadosEstruturados.areaConstruida}m²`);
    console.log(`   🌍 Área terreno: ${dadosEstruturados.areaTerreno}m²`);
    console.log(`   ⭐ Padrão: ${dadosEstruturados.padrao}`);
    console.log(`   🎯 Complexidade: ${dadosEstruturados.complexidade}`);
    console.log(`   📍 Localização: ${dadosEstruturados.localizacao}`);
    console.log(`   🔧 Disciplinas: ${dadosEstruturados.disciplinasNecessarias.join(', ')}`);
    console.log(`   ✨ Características: ${dadosEstruturados.caracteristicasEspeciais.join(', ')}`);
    console.log(`   ⏱️ Prazo estimado: ${dadosEstruturados.prazoEstimado} dias`);
    console.log(`   🎯 Confiança: ${dadosEstruturados.confianca}%`);
    console.log('');
    
    // Testar cálculo de orçamento
    console.log('💰 TESTANDO CÁLCULO DE ORÇAMENTO CORRIGIDO...');
    const calculator = new OrcamentoCalculator();
    const orcamentoCalculado = await calculator.calcularOrcamentoAvancado(dadosEstruturados);
    
    console.log('✅ ORÇAMENTO CALCULADO:');
    console.log(`   💰 Valor total: R$ ${orcamentoCalculado.valorTotal.toLocaleString('pt-BR')}`);
    console.log(`   📊 Valor por m²: R$ ${orcamentoCalculado.valorPorM2.toLocaleString('pt-BR')}`);
    console.log(`   📐 Área: ${orcamentoCalculado.areaConstruida}m²`);
    console.log(`   🏢 Área de atuação: ${orcamentoCalculado.areaAtuacao}`);
    console.log(`   🏠 Tipologia: ${orcamentoCalculado.tipologia}`);
    console.log(`   ⭐ Padrão: ${orcamentoCalculado.padrao}`);
    console.log(`   🎯 Complexidade: ${orcamentoCalculado.complexidade}`);
    console.log(`   📍 Localização: ${orcamentoCalculado.localizacao}`);
    console.log(`   ⏱️ Prazo: ${orcamentoCalculado.prazoEntrega} dias`);
    console.log('');
    
    // Validar correções específicas
    console.log('🔍 VALIDAÇÃO DAS CORREÇÕES ESPECÍFICAS:');
    
    const validacoes = [
      {
        nome: '1. Área extraída corretamente',
        esperado: 250,
        atual: dadosEstruturados.areaConstruida,
        valido: dadosEstruturados.areaConstruida === 250,
        problema: 'Área estava sendo extraída como 150m² em vez de 250m²'
      },
      {
        nome: '2. Área de atuação extraída',
        esperado: 'RESIDENCIAL',
        atual: dadosEstruturados.areaAtuacao,
        valido: dadosEstruturados.areaAtuacao === 'RESIDENCIAL',
        problema: 'Área de atuação não estava sendo extraída'
      },
      {
        nome: '3. Tipologia mantida correta',
        esperado: 'UNIFAMILIAR',
        atual: dadosEstruturados.tipologia,
        valido: dadosEstruturados.tipologia === 'UNIFAMILIAR',
        problema: 'Tipologia já estava funcionando, deve continuar'
      },
      {
        nome: '4. Disciplinas identificadas',
        esperado: 'Múltiplas disciplinas',
        atual: `${dadosEstruturados.disciplinasNecessarias.length} disciplinas`,
        valido: dadosEstruturados.disciplinasNecessarias.length >= 4,
        problema: 'Disciplinas devem ser identificadas corretamente'
      },
      {
        nome: '5. Valor por m² coerente com área de atuação',
        esperado: 'Entre R$ 800-3600/m² (RESIDENCIAL)',
        atual: `R$ ${orcamentoCalculado.valorPorM2.toLocaleString('pt-BR')}/m²`,
        valido: orcamentoCalculado.valorPorM2 >= 800 && orcamentoCalculado.valorPorM2 <= 3600,
        problema: 'Valor deve usar tabela RESIDENCIAL, não COMERCIAL'
      },
      {
        nome: '6. Valor total proporcional à área',
        esperado: 'Proporcional a 250m²',
        atual: `R$ ${orcamentoCalculado.valorTotal.toLocaleString('pt-BR')}`,
        valido: orcamentoCalculado.valorTotal > 100000, // Valor realista para 250m²
        problema: 'Valor total deve refletir área real de 250m²'
      }
    ];
    
    let validacoesPassaram = 0;
    
    validacoes.forEach((validacao, index) => {
      const status = validacao.valido ? '✅' : '❌';
      console.log(`   ${status} ${validacao.nome}:`);
      console.log(`      Esperado: ${validacao.esperado}`);
      console.log(`      Atual: ${validacao.atual}`);
      if (!validacao.valido) {
        console.log(`      ⚠️ Problema: ${validacao.problema}`);
      }
      console.log('');
      
      if (validacao.valido) validacoesPassaram++;
    });
    
    // Comparação antes vs depois
    console.log('📊 COMPARAÇÃO ANTES vs DEPOIS:');
    
    const logicaAntiga = {
      areaAtuacao: 'NÃO EXTRAÍDA',
      area: 150,
      valorPorM2: 1000,
      valorTotal: 18000,
      tipologia: 'COMERCIAL (incorreto)'
    };
    
    const logicaNova = {
      areaAtuacao: dadosEstruturados.areaAtuacao,
      area: dadosEstruturados.areaConstruida,
      valorPorM2: orcamentoCalculado.valorPorM2,
      valorTotal: orcamentoCalculado.valorTotal,
      tipologia: dadosEstruturados.tipologia
    };
    
    console.log('   ❌ ANTES (PROBLEMAS):');
    console.log(`      Área de atuação: ${logicaAntiga.areaAtuacao}`);
    console.log(`      Área: ${logicaAntiga.area}m²`);
    console.log(`      Valor/m²: R$ ${logicaAntiga.valorPorM2.toLocaleString('pt-BR')}`);
    console.log(`      Valor total: R$ ${logicaAntiga.valorTotal.toLocaleString('pt-BR')}`);
    console.log(`      Tipologia: ${logicaAntiga.tipologia}`);
    console.log('');
    
    console.log('   ✅ DEPOIS (CORRIGIDO):');
    console.log(`      Área de atuação: ${logicaNova.areaAtuacao}`);
    console.log(`      Área: ${logicaNova.area}m²`);
    console.log(`      Valor/m²: R$ ${logicaNova.valorPorM2.toLocaleString('pt-BR')}`);
    console.log(`      Valor total: R$ ${logicaNova.valorTotal.toLocaleString('pt-BR')}`);
    console.log(`      Tipologia: ${logicaNova.tipologia}`);
    console.log('');
    
    // Calcular melhorias
    const melhorias = {
      areaCorrigida: ((logicaNova.area - logicaAntiga.area) / logicaAntiga.area) * 100,
      valorCorrigido: ((logicaNova.valorTotal - logicaAntiga.valorTotal) / logicaAntiga.valorTotal) * 100,
      areaAtuacaoAdicionada: logicaNova.areaAtuacao !== 'NÃO EXTRAÍDA'
    };
    
    console.log('📈 MELHORIAS IMPLEMENTADAS:');
    console.log(`   📐 Área corrigida: +${melhorias.areaCorrigida.toFixed(1)}% (${logicaNova.area - logicaAntiga.area}m² a mais)`);
    console.log(`   💰 Valor corrigido: +${melhorias.valorCorrigido.toFixed(1)}% (R$ ${(logicaNova.valorTotal - logicaAntiga.valorTotal).toLocaleString('pt-BR')} a mais)`);
    console.log(`   🏢 Área de atuação: ${melhorias.areaAtuacaoAdicionada ? 'ADICIONADA' : 'AINDA FALTANDO'}`);
    console.log(`   🎯 Confiança: ${dadosEstruturados.confianca}% (antes: 0%)`);
    console.log('');
    
    // Resultado final
    const totalValidacoes = validacoes.length;
    const percentualSucesso = (validacoesPassaram / totalValidacoes) * 100;
    
    console.log('🎯 RESULTADO FINAL:');
    console.log(`   Validações passaram: ${validacoesPassaram}/${totalValidacoes}`);
    console.log(`   Percentual de sucesso: ${percentualSucesso.toFixed(1)}%`);
    console.log('');
    
    if (validacoesPassaram === totalValidacoes) {
      console.log('🎉 SUCESSO COMPLETO!');
      console.log('✅ Todos os problemas identificados foram corrigidos');
      console.log('✅ A lógica de extração está funcionando perfeitamente');
      console.log('✅ Os orçamentos agora são gerados com dados corretos');
    } else if (validacoesPassaram >= totalValidacoes * 0.8) {
      console.log('✅ SUCESSO PARCIAL!');
      console.log('✅ A maioria dos problemas foi corrigida');
      console.log('⚠️ Algumas validações ainda precisam de ajustes');
    } else {
      console.log('⚠️ AINDA HÁ PROBLEMAS!');
      console.log('❌ Várias validações falharam');
      console.log('🔧 É necessário revisar a lógica de extração');
    }
    
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    if (validacoesPassaram === totalValidacoes) {
      console.log('✅ Sistema pronto para produção');
      console.log('✅ Pode gerar orçamentos com dados corretos');
      console.log('✅ Testar com outros briefings para confirmar robustez');
    } else {
      console.log('🔧 Corrigir validações que falharam');
      console.log('🧪 Executar testes adicionais');
      console.log('📊 Verificar outros briefings de teste');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarExtracaoCorrigida();