/**
 * ✅ VALIDAÇÃO: CRONOGRAMA CORRIGIDO
 * 
 * Verificar se o cronograma tem exatamente 72 entregáveis organizados corretamente
 */

const { validarCronograma, gerarCronogramaCompleto } = require('./utils/cronogramaCompleto');

function validarCronogramaCorrigido() {
  console.log('✅ VALIDANDO CRONOGRAMA CORRIGIDO\n');
  
  // 1. Validar estrutura estática
  console.log('1. 📋 VALIDAÇÃO DA ESTRUTURA ESTÁTICA:');
  const validacao = validarCronograma();
  
  console.log(`   - Total de entregáveis: ${validacao.total}`);
  console.log(`   - Esperado: ${validacao.esperado}`);
  console.log(`   - Status: ${validacao.correto ? '✅ CORRETO' : '❌ INCORRETO'}`);
  
  console.log('\n   📊 DETALHAMENTO POR FASE:');
  Object.keys(validacao.detalhamento).forEach(codigo => {
    const quantidade = validacao.detalhamento[codigo];
    console.log(`      ${codigo}: ${quantidade} entregáveis`);
  });
  
  // 2. Testar geração dinâmica
  console.log('\n2. 🔧 TESTANDO GERAÇÃO DINÂMICA:');
  const cronogramaTeste = gerarCronogramaCompleto(18000, ['arquitetura', 'estrutural']);
  
  console.log(`   - Prazo Total: ${cronogramaTeste.prazoTotal} semanas`);
  console.log(`   - Metodologia: ${cronogramaTeste.metodologia}`);
  console.log(`   - Total Entregáveis: ${cronogramaTeste.totalEntregaveis}`);
  console.log(`   - Número de Fases: ${Object.keys(cronogramaTeste.fases).length}`);
  
  // 3. Verificar primeira e última fase
  console.log('\n3. 🔍 VERIFICAÇÃO DE FASES:');
  const fases = Object.values(cronogramaTeste.fases);
  const primeiraFase = fases[0];
  const ultimaFase = fases[fases.length - 1];
  
  console.log(`   - Primeira Fase: ${primeiraFase.nome} (${primeiraFase.entregaveis.length} entregáveis)`);
  console.log(`   - Última Fase: ${ultimaFase.nome} (${ultimaFase.entregaveis.length} entregáveis)`);
  
  // 4. Resultado final
  console.log('\n🎯 RESULTADO FINAL:');
  if (validacao.correto && cronogramaTeste.totalEntregaveis === 72) {
    console.log('✅ CRONOGRAMA CORRIGIDO COM SUCESSO!');
    console.log('✅ Exatamente 72 entregáveis organizados corretamente');
    console.log('✅ Estrutura NBR 13532 respeitada');
    console.log('✅ Sistema pronto para gerar orçamentos corretos');
  } else {
    console.log('❌ CRONOGRAMA AINDA TEM PROBLEMAS!');
    console.log(`❌ Total atual: ${cronogramaTeste.totalEntregaveis} (esperado: 72)`);
  }
}

validarCronogramaCorrigido();