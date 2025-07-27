// 🔍 TESTE DE DEBUG - CONTAGEM REAL DE PERGUNTAS
// Importar o sistema e testar as contagens

const { MotorBriefingHierarquico } = require('./src/data/sistema-briefing-hierarquico-completo-arcflow.ts');

function contarPerguntasReais(blocos, tipoCliente) {
  let totalReal = 0;
  
  console.log('\n📊 ANÁLISE DETALHADA POR BLOCO:');
  console.log('=' .repeat(60));
  
  blocos.forEach(bloco => {
    let perguntasBloco = 0;
    
    if (Array.isArray(bloco.perguntas)) {
      perguntasBloco = bloco.perguntas.length;
      console.log(`📋 ${bloco.titulo}: ${perguntasBloco} perguntas (normais)`);
    } else {
      // Perguntas condicionais - contar apenas a variação que será exibida
      const perguntasParaTipo = bloco.perguntas[tipoCliente] || [];
      perguntasBloco = perguntasParaTipo.length;
      console.log(`📋 ${bloco.titulo}: ${perguntasBloco} perguntas (condicionais para ${tipoCliente})`);
    }
    
    totalReal += perguntasBloco;
  });
  
  console.log('=' .repeat(60));
  console.log(`🎯 TOTAL REAL DE PERGUNTAS: ${totalReal}`);
  
  return totalReal;
}

// Testar CASA UNIFAMILIAR em todos os padrões
console.log('🏠 TESTE: CASA UNIFAMILIAR - PESSOA FÍSICA');

const configs = [
  {
    nome: 'Teste Casa Simples',
    clienteId: '1',
    responsavel: 'Teste',
    disciplina: 'ARQUITETURA',
    area: 'RESIDENCIAL',
    tipologia: 'CASA_UNIFAMILIAR',
    padrao: 'SIMPLES',
    tipoCliente: 'PESSOA_FISICA'
  },
  {
    nome: 'Teste Casa Médio',
    clienteId: '1',
    responsavel: 'Teste',
    disciplina: 'ARQUITETURA',
    area: 'RESIDENCIAL',
    tipologia: 'CASA_UNIFAMILIAR',
    padrao: 'MEDIO',
    tipoCliente: 'PESSOA_FISICA'
  },
  {
    nome: 'Teste Casa Alto',
    clienteId: '1',
    responsavel: 'Teste',
    disciplina: 'ARQUITETURA',
    area: 'RESIDENCIAL',
    tipologia: 'CASA_UNIFAMILIAR',
    padrao: 'ALTO',
    tipoCliente: 'PESSOA_FISICA'
  }
];

configs.forEach(config => {
  console.log(`\n🔍 TESTANDO: ${config.tipologia} - ${config.padrao}`);
  const blocos = MotorBriefingHierarquico.montarBriefingCompleto(config);
  const totalReal = contarPerguntasReais(blocos, config.tipoCliente);
  
  // Comparar com o que o sistema calcula
  const metricas = MotorBriefingHierarquico.calcularMetricas(config);
  console.log(`❌ Sistema calcula: ${metricas.totalPerguntas} perguntas`);
  console.log(`✅ Contagem real: ${totalReal} perguntas`);
  console.log(`🚨 DIFERENÇA: ${metricas.totalPerguntas - totalReal} perguntas a mais!`);
}); 