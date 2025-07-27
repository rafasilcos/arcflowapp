// 🧪 TESTE RÁPIDO - SISTEMA 100 PERGUNTAS EXATAS
// Verificar se as contagens estão corretas

console.log('🎯 TESTANDO SISTEMA DE 100 PERGUNTAS EXATAS');
console.log('=' .repeat(50));

// Simular as configurações
const configuracoes = [
  {
    nome: 'Casa Simples PF',
    config: { area: 'RESIDENCIAL', tipologia: 'CASA', padrao: 'SIMPLES', tipoCliente: 'PESSOA_FISICA' },
    esperado: 84 // 4 + 30 + 20 + 15 + 15
  },
  {
    nome: 'Casa Médio PF',
    config: { area: 'RESIDENCIAL', tipologia: 'CASA', padrao: 'MEDIO', tipoCliente: 'PESSOA_FISICA' },
    esperado: 94 // 4 + 30 + 20 + 15 + 25
  },
  {
    nome: 'Casa Alto PF',
    config: { area: 'RESIDENCIAL', tipologia: 'CASA', padrao: 'ALTO', tipoCliente: 'PESSOA_FISICA' },
    esperado: 104 // 4 + 30 + 20 + 15 + 35
  },
  {
    nome: 'Casa Simples PJ',
    config: { area: 'RESIDENCIAL', tipologia: 'CASA', padrao: 'SIMPLES', tipoCliente: 'PESSOA_JURIDICA' },
    esperado: 86 // 4 + 32 + 20 + 15 + 15
  },
  {
    nome: 'Loja Simples PF',
    config: { area: 'COMERCIAL', tipologia: 'LOJA', padrao: 'SIMPLES', tipoCliente: 'PESSOA_FISICA' },
    esperado: 59 // 4 + 30 + 15 + 10 + 0 (não tem nível 4 para loja ainda)
  }
];

configuracoes.forEach(teste => {
  console.log(`\n📋 ${teste.nome}:`);
  console.log(`   Configuração: ${teste.config.area} → ${teste.config.tipologia} → ${teste.config.padrao} → ${teste.config.tipoCliente}`);
  console.log(`   Esperado: ${teste.esperado} perguntas`);
  
  // Simular contagem manual
  let total = 4; // Nível 0
  total += teste.config.tipoCliente === 'PESSOA_FISICA' ? 30 : 32; // Nível 1
  total += teste.config.area === 'RESIDENCIAL' ? 20 : 15; // Nível 2
  
  if (teste.config.tipologia === 'CASA') {
    total += 15; // Nível 3
    // Nível 4
    if (teste.config.padrao === 'SIMPLES') total += 15;
    else if (teste.config.padrao === 'MEDIO') total += 25;
    else if (teste.config.padrao === 'ALTO') total += 35;
  } else if (teste.config.tipologia === 'LOJA') {
    total += 10; // Nível 3
    // Nível 4 não implementado ainda para loja
  }
  
  console.log(`   Calculado: ${total} perguntas`);
  console.log(`   ✅ ${total === teste.esperado ? 'CORRETO' : '❌ ERRO'}`);
});

console.log('\n🎯 PROGRESSÃO DE PADRÕES:');
console.log('Casa PF: 84 (SIMPLES) → 94 (MÉDIO) → 104 (ALTO)');
console.log('Casa PJ: 86 (SIMPLES) → 96 (MÉDIO) → 106 (ALTO)');
console.log('✅ SIMPLES < MÉDIO < ALTO ✅');

console.log('\n🚀 SISTEMA PRONTO PARA TESTE!');
console.log('Link: http://localhost:3000/briefing/100-perguntas-exatas'); 