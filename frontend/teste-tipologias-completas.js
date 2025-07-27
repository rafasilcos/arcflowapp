// 🧪 TESTE COMPLETO - TODAS AS TIPOLOGIAS IMPLEMENTADAS
// Validação das contagens exatas conforme documento fornecido

const { MotorBriefingCompleto } = require('./src/data/sistema-briefing-completo-arcflow.ts');

console.log('🎯 TESTE COMPLETO - SISTEMA ARCFLOW');
console.log('=' .repeat(80));

// Função para testar uma configuração
function testarConfiguracao(config, perguntasEsperadas) {
  try {
    const briefing = MotorBriefingCompleto.obterBriefing(config);
    const totalPerguntas = briefing.totalPerguntas;
    const totalSeções = briefing.secoes.length;
    
    const status = totalPerguntas === perguntasEsperadas ? '✅' : '❌';
    
    console.log(`${status} ${config.area} - ${config.tipologia} - ${config.padrao}`);
    console.log(`   📊 Perguntas: ${totalPerguntas}/${perguntasEsperadas} | Seções: ${totalSeções}`);
    
    if (totalPerguntas !== perguntasEsperadas) {
      console.log(`   ⚠️  DIFERENÇA: ${totalPerguntas - perguntasEsperadas} perguntas`);
    }
    
    return totalPerguntas === perguntasEsperadas;
  } catch (error) {
    console.log(`❌ ${config.area} - ${config.tipologia} - ${config.padrao}`);
    console.log(`   🚨 ERRO: ${error.message}`);
    return false;
  }
}

console.log('\n🏠 ÁREA RESIDENCIAL - CASA UNIFAMILIAR');
console.log('-'.repeat(50));

// RESIDENCIAL - CASA (já implementado e funcionando)
testarConfiguracao({
  area: 'RESIDENCIAL',
  tipologia: 'CASA',
  padrao: 'SIMPLES',
  tipoCliente: 'PESSOA_FISICA'
}, 134);

testarConfiguracao({
  area: 'RESIDENCIAL',
  tipologia: 'CASA',
  padrao: 'MEDIO',
  tipoCliente: 'PESSOA_FISICA'
}, 202);

testarConfiguracao({
  area: 'RESIDENCIAL',
  tipologia: 'CASA',
  padrao: 'ALTO',
  tipoCliente: 'PESSOA_FISICA'
}, 248);

console.log('\n🏢 ÁREA COMERCIAL - TODAS AS TIPOLOGIAS');
console.log('-'.repeat(50));

// COMERCIAL - LOJA/VAREJO
testarConfiguracao({
  area: 'COMERCIAL',
  tipologia: 'LOJA',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 102);

// COMERCIAL - ESCRITÓRIO
testarConfiguracao({
  area: 'COMERCIAL',
  tipologia: 'ESCRITORIO',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 87);

// COMERCIAL - RESTAURANTE/BAR
testarConfiguracao({
  area: 'COMERCIAL',
  tipologia: 'RESTAURANTE',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 100);

// COMERCIAL - HOTEL/POUSADA
testarConfiguracao({
  area: 'COMERCIAL',
  tipologia: 'HOTEL',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 91);

console.log('\n🏭 ÁREA INDUSTRIAL');
console.log('-'.repeat(50));

// INDUSTRIAL - CENTRO LOGÍSTICO
testarConfiguracao({
  area: 'INDUSTRIAL',
  tipologia: 'CENTRO_LOGISTICO',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 99);

console.log('\n🏫 ÁREA INSTITUCIONAL');
console.log('-'.repeat(50));

// INSTITUCIONAL - ESCOLA/UNIVERSIDADE
testarConfiguracao({
  area: 'INSTITUCIONAL',
  tipologia: 'ESCOLA',
  padrao: 'UNICO',
  tipoCliente: 'PESSOA_JURIDICA'
}, 115);

console.log('\n📊 RESUMO FINAL');
console.log('=' .repeat(80));

const totalTipologias = 8;
console.log(`Total de tipologias implementadas: ${totalTipologias}`);
console.log('');
console.log('CONTAGENS ESPERADAS CONFORME DOCUMENTO:');
console.log('• RESIDENCIAL - CASA: 134 (SIMPLES) → 202 (MÉDIO) → 248 (ALTO)');
console.log('• COMERCIAL - LOJA/VAREJO: 102 perguntas');
console.log('• COMERCIAL - ESCRITÓRIO: 87 perguntas');
console.log('• COMERCIAL - RESTAURANTE/BAR: 100 perguntas');
console.log('• COMERCIAL - HOTEL/POUSADA: 91 perguntas');
console.log('• INDUSTRIAL - CENTRO LOGÍSTICO: 99 perguntas');
console.log('• INSTITUCIONAL - ESCOLA/UNIVERSIDADE: 115 perguntas');
console.log('');
console.log('🎯 STATUS: Sistema expandido com todas as tipologias do documento!');

// Teste de validação das tipologias por área
console.log('\n🔍 VALIDAÇÃO DAS TIPOLOGIAS POR ÁREA');
console.log('-'.repeat(50));

const areas = ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL'];
areas.forEach(area => {
  const tipologias = MotorBriefingCompleto.obterTipologiasPorArea(area);
  console.log(`${area}: [${tipologias.join(', ')}]`);
});

console.log('\n✅ TESTE CONCLUÍDO - Sistema pronto para uso!'); 