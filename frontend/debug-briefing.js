// DEBUG DIRETO - TESTAR CARREGAMENTO DO BRIEFING
console.log('🔍 INICIANDO DEBUG DO BRIEFING...');

async function debugBriefing() {
  try {
    console.log('\n1️⃣ TESTANDO IMPORT DIRETO:');
    const { CASA_SIMPLES_FINAL } = await import('./src/data/briefings-estaticos/residencial/casa-simples-final.js');
    console.log('✅ Import direto funcionou!');
    console.log('📊 Dados:', {
      id: CASA_SIMPLES_FINAL.id,
      nome: CASA_SIMPLES_FINAL.nome,
      totalPerguntas: CASA_SIMPLES_FINAL.totalPerguntas,
      secoes: CASA_SIMPLES_FINAL.secoes.length
    });

    console.log('\n2️⃣ TESTANDO SISTEMA ESTÁTICO:');
    const { obterBriefingEstatico } = await import('./src/data/briefings-estaticos/index.js');
    
    console.log('🔍 Testando chave: RESIDENCIAL_CASA_UNIFAMILIAR_SIMPLES');
    const briefing1 = await obterBriefingEstatico('RESIDENCIAL', 'CASA_UNIFAMILIAR', 'SIMPLES');
    console.log('Resultado 1:', briefing1 ? '✅ ENCONTRADO' : '❌ NULL');

    console.log('🔍 Testando chave: residencial_casa_unifamiliar_simples');
    const briefing2 = await obterBriefingEstatico('residencial', 'casa_unifamiliar', 'simples');
    console.log('Resultado 2:', briefing2 ? '✅ ENCONTRADO' : '❌ NULL');

    console.log('\n3️⃣ TESTANDO SISTEMA PRINCIPAL:');
    const { obterBriefingModular } = await import('./src/data/briefings/index.js');
    
    console.log('🔍 Testando: arquitetura + residencial + simples_padrao');
    const briefing3 = await obterBriefingModular('arquitetura', 'residencial', 'simples_padrao');
    console.log('Resultado 3:', briefing3 ? '✅ ENCONTRADO' : '❌ NULL');

    if (briefing3) {
      console.log('📋 Dados do briefing:', {
        nome: briefing3.nome,
        totalPerguntas: briefing3.totalPerguntas,
        secoes: briefing3.secoes.length
      });
    }

  } catch (error) {
    console.error('💥 ERRO:', error);
  }
}

debugBriefing(); 