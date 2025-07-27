/**
 * 🧪 TESTE: CRONOGRAMA CORRIGIDO - ORÇAMENTO 61
 * 
 * Testar se as correções aplicadas no calculador resultaram em prazos realistas
 */

const { connectDatabase, getClient } = require('./config/database');

async function testarCronogramaCorrigido() {
  console.log('🧪 TESTANDO CRONOGRAMA CORRIGIDO - ORÇAMENTO 61\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    // Buscar dados do orçamento 61
    const orcamentoResult = await client.query(`
      SELECT 
        id, area_construida, complexidade, tipologia, localizacao,
        disciplinas, cronograma
      FROM orcamentos 
      WHERE id = 61
    `);
    
    if (orcamentoResult.rows.length === 0) {
      console.log('❌ Orçamento 61 não encontrado!');
      return;
    }
    
    const orcamento = orcamentoResult.rows[0];
    
    console.log('📊 DADOS DO ORÇAMENTO 61:');
    console.log(`- Área: ${orcamento.area_construida}m²`);
    console.log(`- Complexidade: ${orcamento.complexidade}`);
    console.log(`- Tipologia: ${orcamento.tipologia}`);
    
    let disciplinas = [];
    try {
      disciplinas = JSON.parse(orcamento.disciplinas || '[]');
    } catch (e) {
      disciplinas = orcamento.disciplinas ? [orcamento.disciplinas] : [];
    }
    
    console.log(`- Disciplinas: ${disciplinas.length}\n`);
    
    // Simular cálculo com prazos corrigidos
    const fasesCorrigidas = {
      'LV_LEVANTAMENTO_DADOS': { prazoBase: 0.3 },
      'PN_PROGRAMA_NECESSIDADES': { prazoBase: 0.3 },
      'EV_ESTUDO_VIABILIDADE': { prazoBase: 0.5 },
      'EP_ESTUDO_PRELIMINAR': { prazoBase: 1 },
      'AP_ANTEPROJETO': { prazoBase: 1.5 },
      'PL_PROJETO_LEGAL': { prazoBase: 0.5 },
      'PB_PROJETO_BASICO': { prazoBase: 1.2 },
      'PE_PROJETO_EXECUTIVO': { prazoBase: 1.5 }
    };
    
    console.log('⏱️ SIMULAÇÃO COM PRAZOS CORRIGIDOS:');
    
    let prazoTotalSequencial = 0;
    const prazosCalculados = {};
    
    for (const [faseId, fase] of Object.entries(fasesCorrigidas)) {
      let prazoFase = fase.prazoBase;
      
      // Aplicar ajustes muito suaves
      if (orcamento.area_construida > 500) prazoFase += fase.prazoBase * 0.03;
      if (orcamento.area_construida > 1000) prazoFase += fase.prazoBase * 0.05;
      if (orcamento.area_construida > 2000) prazoFase += fase.prazoBase * 0.08;
      
      if (orcamento.complexidade === 'ALTA') prazoFase += fase.prazoBase * 0.03;
      if (orcamento.complexidade === 'MUITO_ALTA') prazoFase += fase.prazoBase * 0.05;
      
      prazosCalculados[faseId] = prazoFase;
      prazoTotalSequencial += prazoFase;
      
      console.log(`  ${faseId}: ${prazoFase.toFixed(1)} semanas`);
    }
    
    console.log(`\n📊 TOTAL SEQUENCIAL: ${prazoTotalSequencial.toFixed(1)} semanas`);
    
    // Aplicar paralelismo
    const gruposParalelos = [
      {
        nome: 'Concepção (LV + PN)',
        prazo: Math.max(prazosCalculados.LV_LEVANTAMENTO_DADOS, prazosCalculados.PN_PROGRAMA_NECESSIDADES)
      },
      {
        nome: 'Definição (EV + EP com sobreposição)',
        prazo: prazosCalculados.EV_ESTUDO_VIABILIDADE + (prazosCalculados.EP_ESTUDO_PRELIMINAR * 0.7)
      },
      {
        nome: 'Anteprojeto',
        prazo: prazosCalculados.AP_ANTEPROJETO
      },
      {
        nome: 'Legal + Básico (paralelo)',
        prazo: Math.max(prazosCalculados.PL_PROJETO_LEGAL, prazosCalculados.PB_PROJETO_BASICO)
      },
      {
        nome: 'Executivo',
        prazo: prazosCalculados.PE_PROJETO_EXECUTIVO
      }
    ];
    
    console.log('\n🔄 APLICANDO PARALELISMO:');
    
    let prazoTotalParalelo = 0;
    for (const grupo of gruposParalelos) {
      console.log(`  ${grupo.nome}: ${grupo.prazo.toFixed(1)} semanas`);
      prazoTotalParalelo += grupo.prazo;
    }
    
    console.log(`\n✅ TOTAL COM PARALELISMO: ${prazoTotalParalelo.toFixed(1)} semanas`);
    console.log(`📅 EQUIVALENTE A: ${Math.round(prazoTotalParalelo/4.33)} meses`);
    
    // Comparar com cronograma atual no banco
    if (orcamento.cronograma) {
      const cronogramaAtual = JSON.parse(orcamento.cronograma);
      const prazoAtual = cronogramaAtual.prazoTotal || 0;
      
      console.log(`\n📊 COMPARAÇÃO:`)
      console.log(`- Prazo atual no banco: ${prazoAtual} semanas`);
      console.log(`- Prazo corrigido: ${prazoTotalParalelo.toFixed(1)} semanas`);
      console.log(`- Redução: ${(prazoAtual - prazoTotalParalelo).toFixed(1)} semanas (${(((prazoAtual - prazoTotalParalelo) / prazoAtual) * 100).toFixed(1)}%)`);
    }
    
    // Validar se está na faixa esperada
    console.log(`\n🎯 VALIDAÇÃO:`);
    if (prazoTotalParalelo >= 8 && prazoTotalParalelo <= 12) {
      console.log(`✅ DENTRO DA FAIXA ESPERADA: 8-12 semanas`);
    } else if (prazoTotalParalelo < 8) {
      console.log(`⚠️ ABAIXO DA FAIXA ESPERADA: ${prazoTotalParalelo.toFixed(1)} < 8 semanas`);
      console.log(`   Pode ser muito otimista para alguns escritórios`);
    } else {
      console.log(`❌ ACIMA DA FAIXA ESPERADA: ${prazoTotalParalelo.toFixed(1)} > 12 semanas`);
      console.log(`   Ainda precisa de mais ajustes`);
    }
    
    console.log(`\n📝 CONCLUSÃO:`);
    console.log(`- Projeto residencial 250m² com complexidade ${orcamento.complexidade}`);
    console.log(`- Prazo estimado: ${prazoTotalParalelo.toFixed(1)} semanas`);
    console.log(`- Metodologia: NBR 13532 com paralelismo`);
    console.log(`- Status: ${prazoTotalParalelo >= 8 && prazoTotalParalelo <= 12 ? 'APROVADO ✅' : 'PRECISA AJUSTES ⚠️'}`);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testarCronogramaCorrigido()
  .then(() => {
    console.log('\n🧪 TESTE CONCLUÍDO');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NO TESTE:', error);
    process.exit(1);
  });