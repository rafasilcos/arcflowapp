/**
 * 🔍 TESTE ESPECÍFICO: CRONOGRAMA DO ORÇAMENTO 65
 * 
 * Verificar exatamente como o cronograma está sendo gerado
 */

const { gerarCronogramaCompleto, validarCronograma } = require('./utils/cronogramaCompleto');

async function testarCronogramaOrcamento65() {
  console.log('🔍 TESTE ESPECÍFICO DO CRONOGRAMA - ORÇAMENTO 65\n');
  
  // 1. Validar estrutura base do cronograma
  console.log('1. 📋 VALIDANDO ESTRUTURA BASE...');
  const validacao = validarCronograma();
  
  console.log(`   - Total de entregáveis: ${validacao.total}`);
  console.log(`   - Esperado: ${validacao.esperado}`);
  console.log(`   - Status: ${validacao.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  
  if (!validacao.correto) {
    console.log('\n❌ PROBLEMA NA ESTRUTURA BASE!');
    console.log('   Detalhamento por fase:');
    Object.keys(validacao.detalhamento).forEach(fase => {
      console.log(`     ${fase}: ${validacao.detalhamento[fase]} entregáveis`);
    });
    return;
  }
  
  // 2. Testar geração com dados similares ao orçamento 65
  console.log('\n2. 🔧 TESTANDO GERAÇÃO COM DADOS DO ORÇAMENTO 65...');
  
  const valorTotal = 18000;
  const disciplinas = ['arquitetura', 'estrutural', 'hidraulica', 'eletrica'];
  
  console.log(`   - Valor total: R$ ${valorTotal.toLocaleString('pt-BR')}`);
  console.log(`   - Disciplinas: ${disciplinas.join(', ')}`);
  
  const cronograma = gerarCronogramaCompleto(valorTotal, disciplinas);
  
  console.log('\n📊 RESULTADO DA GERAÇÃO:');
  console.log(`   - Prazo total: ${cronograma.prazoTotal} semanas`);
  console.log(`   - Metodologia: ${cronograma.metodologia}`);
  console.log(`   - Total entregáveis: ${cronograma.totalEntregaveis}`);
  console.log(`   - Número de fases: ${Object.keys(cronograma.fases).length}`);
  
  // 3. Analisar cada fase gerada
  console.log('\n3. 📋 ANÁLISE DETALHADA DAS FASES GERADAS:');
  
  let totalContado = 0;
  Object.keys(cronograma.fases).forEach((faseKey, index) => {
    const fase = cronograma.fases[faseKey];
    const numEntregaveis = fase.entregaveis ? fase.entregaveis.length : 0;
    totalContado += numEntregaveis;
    
    console.log(`\n   ${index + 1}. ${fase.codigo} - ${fase.nome}:`);
    console.log(`      - Etapa: ${fase.etapa}`);
    console.log(`      - Ordem: ${fase.ordem}`);
    console.log(`      - Prazo: ${fase.prazo} semanas`);
    console.log(`      - Valor: R$ ${fase.valor.toLocaleString('pt-BR')}`);
    console.log(`      - Entregáveis: ${numEntregaveis} itens`);
    console.log(`      - Disciplinas: ${fase.disciplinas.join(', ')}`);
    console.log(`      - Ativa: ${fase.ativa ? 'Sim' : 'Não'}`);
    
    // Mostrar primeiros entregáveis
    if (fase.entregaveis && fase.entregaveis.length > 0) {
      console.log(`      📝 Primeiros entregáveis:`);
      fase.entregaveis.slice(0, 2).forEach((entregavel, i) => {
        console.log(`         ${i + 1}. ${entregavel}`);
      });
      if (fase.entregaveis.length > 2) {
        console.log(`         ... e mais ${fase.entregaveis.length - 2} entregáveis`);
      }
    }
  });
  
  console.log(`\n📊 CONTAGEM FINAL:`);
  console.log(`   - Total contado: ${totalContado}`);
  console.log(`   - Total informado: ${cronograma.totalEntregaveis}`);
  console.log(`   - Status: ${totalContado === 72 && cronograma.totalEntregaveis === 72 ? '✅ CORRETO' : '❌ INCORRETO'}`);
  
  // 4. Testar com disciplinas diferentes
  console.log('\n4. 🔧 TESTANDO COM DISCIPLINAS DIFERENTES...');
  
  const disciplinasReduzidas = ['arquitetura'];
  const cronogramaReduzido = gerarCronogramaCompleto(valorTotal, disciplinasReduzidas);
  
  console.log(`   - Disciplinas: ${disciplinasReduzidas.join(', ')}`);
  console.log(`   - Total entregáveis: ${cronogramaReduzido.totalEntregaveis}`);
  
  let totalReduzido = 0;
  Object.keys(cronogramaReduzido.fases).forEach(faseKey => {
    const fase = cronogramaReduzido.fases[faseKey];
    totalReduzido += fase.entregaveis.length;
    console.log(`     ${fase.codigo}: ${fase.entregaveis.length} entregáveis, disciplinas: ${fase.disciplinas.join(', ')}`);
  });
  
  console.log(`   - Total contado: ${totalReduzido}`);
  
  // 5. Diagnóstico final
  console.log('\n🎯 DIAGNÓSTICO FINAL:');
  
  if (totalContado === 72 && cronograma.totalEntregaveis === 72) {
    console.log('✅ A função gerarCronogramaCompleto está funcionando corretamente');
    console.log('✅ O problema NÃO está na geração do cronograma');
    console.log('🔍 O problema pode estar em:');
    console.log('   - Como os dados são salvos no banco');
    console.log('   - Como os dados são recuperados do banco');
    console.log('   - Como o frontend exibe os dados');
    console.log('   - Alguma transformação dos dados após a geração');
  } else {
    console.log('❌ A função gerarCronogramaCompleto tem problemas');
    console.log('🔧 Necessário corrigir a lógica de geração');
  }
}

testarCronogramaOrcamento65();