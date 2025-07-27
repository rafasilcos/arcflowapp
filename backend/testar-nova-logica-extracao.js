/**
 * 🧪 TESTE DA NOVA LÓGICA DE EXTRAÇÃO DE DADOS DO BRIEFING
 */

const { connectDatabase, getClient } = require('./config/database');
const BriefingAnalyzer = require('./utils/briefingAnalyzer');
const OrcamentoCalculator = require('./utils/orcamentoCalculator');

async function testarNovaLogica() {
  await connectDatabase();
  const client = getClient();
  
  try {
    console.log('🧪 TESTANDO NOVA LÓGICA DE EXTRAÇÃO DE DADOS\n');
    
    // 1. Buscar briefing de teste
    const briefingResult = await client.query(`
      SELECT 
        b.*,
        c.nome as cliente_nome,
        u.nome as responsavel_nome
      FROM briefings b
      LEFT JOIN clientes c ON b.cliente_id::text = c.id
      LEFT JOIN users u ON b.responsavel_id::text = u.id
      WHERE b.id = '123e4567-e89b-12d3-a456-426614174003'
        AND b.deleted_at IS NULL
    `);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing de teste não encontrado');
      return;
    }
    
    const briefing = briefingResult.rows[0];
    console.log('📋 BRIEFING DE TESTE CARREGADO:');
    console.log(`   Nome: ${briefing.nome_projeto}`);
    console.log(`   Tipologia original: ${briefing.tipologia}`);
    console.log(`   Área original: ${briefing.area}`);
    console.log(`   Cliente: ${briefing.cliente_nome}`);
    console.log('');
    
    // 2. Testar análise inteligente
    console.log('🧠 TESTANDO ANÁLISE INTELIGENTE...');
    const analyzer = new BriefingAnalyzer();
    const dadosEstruturados = await analyzer.extrairDadosEstruturados(briefing);
    
    console.log('✅ DADOS EXTRAÍDOS PELA IA:');
    console.log(`   📊 Tipologia: ${dadosEstruturados.tipologia} (original: ${briefing.tipologia})`);
    console.log(`   📐 Área construída: ${dadosEstruturados.areaConstruida}m² (original: ${briefing.area})`);
    console.log(`   🌍 Área terreno: ${dadosEstruturados.areaTerreno}m²`);
    console.log(`   ⭐ Padrão: ${dadosEstruturados.padrao}`);
    console.log(`   🎯 Complexidade: ${dadosEstruturados.complexidade}`);
    console.log(`   📍 Localização: ${dadosEstruturados.localizacao}`);
    console.log(`   🔧 Disciplinas: ${dadosEstruturados.disciplinasNecessarias.join(', ')}`);
    console.log(`   ✨ Características: ${dadosEstruturados.caracteristicasEspeciais.join(', ')}`);
    console.log(`   ⏱️ Prazo estimado: ${dadosEstruturados.prazoEstimado} dias`);
    console.log(`   🎯 Confiança: ${dadosEstruturados.confianca}%`);
    console.log('');
    
    // 3. Testar cálculo de orçamento
    console.log('💰 TESTANDO CÁLCULO DE ORÇAMENTO...');
    const calculator = new OrcamentoCalculator();
    const orcamentoCalculado = await calculator.calcularOrcamentoAvancado(dadosEstruturados);
    
    console.log('✅ ORÇAMENTO CALCULADO:');
    console.log(`   💰 Valor total: R$ ${orcamentoCalculado.valorTotal.toLocaleString('pt-BR')}`);
    console.log(`   📊 Valor por m²: R$ ${orcamentoCalculado.valorPorM2.toLocaleString('pt-BR')}`);
    console.log(`   📐 Área: ${orcamentoCalculado.areaConstruida}m²`);
    console.log(`   🏠 Tipologia: ${orcamentoCalculado.tipologia}`);
    console.log(`   ⭐ Padrão: ${orcamentoCalculado.padrao}`);
    console.log(`   🎯 Complexidade: ${orcamentoCalculado.complexidade}`);
    console.log(`   📍 Localização: ${orcamentoCalculado.localizacao}`);
    console.log(`   ⏱️ Prazo: ${orcamentoCalculado.prazoEntrega} dias`);
    console.log('');
    
    // 4. Mostrar disciplinas detalhadas
    console.log('🔧 DISCIPLINAS DETALHADAS:');
    orcamentoCalculado.disciplinas.forEach((disc, index) => {
      console.log(`   ${index + 1}. ${disc.nome}`);
      console.log(`      - Horas: ${disc.horasEstimadas}h`);
      console.log(`      - Valor/hora: R$ ${disc.valorHora}`);
      console.log(`      - Total: R$ ${disc.valorTotal.toLocaleString('pt-BR')}`);
      console.log(`      - Percentual: ${disc.percentualTotal}%`);
    });
    console.log('');
    
    // 5. Mostrar composição financeira
    console.log('💼 COMPOSIÇÃO FINANCEIRA:');
    const comp = orcamentoCalculado.composicaoFinanceira;
    console.log(`   💰 Custos de horas: R$ ${comp.custosHoras.toLocaleString('pt-BR')}`);
    console.log(`   📊 Custos indiretos: R$ ${comp.custosIndiretos.toLocaleString('pt-BR')}`);
    console.log(`   🏛️ Impostos: R$ ${comp.impostos.toLocaleString('pt-BR')}`);
    console.log(`   📈 Margem de lucro: R$ ${comp.margemLucro.toLocaleString('pt-BR')}`);
    console.log(`   🎯 Total: R$ ${comp.total.toLocaleString('pt-BR')}`);
    console.log('');
    
    // 6. Mostrar cronograma
    console.log('📅 CRONOGRAMA:');
    if (orcamentoCalculado.cronograma && orcamentoCalculado.cronograma.fases) {
      Object.entries(orcamentoCalculado.cronograma.fases).forEach(([key, fase]) => {
        console.log(`   📋 ${fase.nome}`);
        console.log(`      - Prazo: ${fase.prazo} dias`);
        console.log(`      - Valor: R$ ${fase.valor?.toLocaleString('pt-BR') || 'N/A'}`);
      });
    } else {
      console.log('   ⚠️ Cronograma não disponível');
    }
    console.log('');
    
    // 7. Comparação com lógica antiga
    console.log('🔄 COMPARAÇÃO COM LÓGICA ANTIGA:');
    
    // Simular lógica antiga (simplificada)
    const logicaAntiga = {
      tipologia: 'comercial', // Era detectado incorretamente
      area: 18, // Era calculado incorretamente
      valorPorM2: 1000,
      valorTotal: 18000
    };
    
    console.log('   ❌ LÓGICA ANTIGA (INCORRETA):');
    console.log(`      - Tipologia: ${logicaAntiga.tipologia}`);
    console.log(`      - Área: ${logicaAntiga.area}m²`);
    console.log(`      - Valor/m²: R$ ${logicaAntiga.valorPorM2}`);
    console.log(`      - Valor total: R$ ${logicaAntiga.valorTotal.toLocaleString('pt-BR')}`);
    console.log('');
    
    console.log('   ✅ LÓGICA NOVA (CORRIGIDA):');
    console.log(`      - Tipologia: ${dadosEstruturados.tipologia}`);
    console.log(`      - Área: ${dadosEstruturados.areaConstruida}m²`);
    console.log(`      - Valor/m²: R$ ${orcamentoCalculado.valorPorM2.toLocaleString('pt-BR')}`);
    console.log(`      - Valor total: R$ ${orcamentoCalculado.valorTotal.toLocaleString('pt-BR')}`);
    console.log('');
    
    // 8. Calcular diferenças
    const diferencaArea = ((dadosEstruturados.areaConstruida - logicaAntiga.area) / logicaAntiga.area) * 100;
    const diferencaValor = ((orcamentoCalculado.valorTotal - logicaAntiga.valorTotal) / logicaAntiga.valorTotal) * 100;
    
    console.log('📊 IMPACTO DAS CORREÇÕES:');
    console.log(`   📐 Diferença na área: ${diferencaArea.toFixed(1)}% (${dadosEstruturados.areaConstruida - logicaAntiga.area}m²)`);
    console.log(`   💰 Diferença no valor: ${diferencaValor.toFixed(1)}% (R$ ${(orcamentoCalculado.valorTotal - logicaAntiga.valorTotal).toLocaleString('pt-BR')})`);
    console.log(`   🏠 Tipologia corrigida: ${logicaAntiga.tipologia} → ${dadosEstruturados.tipologia}`);
    console.log('');
    
    // 9. Validar se os dados fazem sentido
    console.log('✅ VALIDAÇÃO DOS DADOS:');
    const validacoes = [
      {
        nome: 'Tipologia coerente',
        valido: dadosEstruturados.tipologia === 'RESIDENCIAL',
        esperado: 'RESIDENCIAL',
        atual: dadosEstruturados.tipologia
      },
      {
        nome: 'Área realista',
        valido: dadosEstruturados.areaConstruida >= 100 && dadosEstruturados.areaConstruida <= 500,
        esperado: '100-500m²',
        atual: `${dadosEstruturados.areaConstruida}m²`
      },
      {
        nome: 'Padrão identificado',
        valido: dadosEstruturados.padrao === 'alto',
        esperado: 'alto',
        atual: dadosEstruturados.padrao
      },
      {
        nome: 'Valor coerente',
        valido: orcamentoCalculado.valorPorM2 >= 2000 && orcamentoCalculado.valorPorM2 <= 4000,
        esperado: 'R$ 2.000-4.000/m²',
        atual: `R$ ${orcamentoCalculado.valorPorM2.toLocaleString('pt-BR')}/m²`
      }
    ];
    
    validacoes.forEach(validacao => {
      const status = validacao.valido ? '✅' : '❌';
      console.log(`   ${status} ${validacao.nome}: ${validacao.atual} (esperado: ${validacao.esperado})`);
    });
    
    const validacoesPassaram = validacoes.filter(v => v.valido).length;
    const totalValidacoes = validacoes.length;
    
    console.log('');
    console.log(`🎯 RESULTADO FINAL: ${validacoesPassaram}/${totalValidacoes} validações passaram`);
    
    if (validacoesPassaram === totalValidacoes) {
      console.log('🎉 SUCESSO! A nova lógica está funcionando corretamente!');
    } else {
      console.log('⚠️ Algumas validações falharam. Revisar lógica.');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testarNovaLogica();