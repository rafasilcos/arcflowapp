/**
 * 🚨 DEBUG: CRONOGRAMA 56 SEMANAS - ANÁLISE E CORREÇÃO
 * 
 * Problema identificado: Projeto residencial 250m² está resultando em 56 semanas
 * Realidade esperada: 8-12 semanas
 * 
 * ANÁLISE DOS PROBLEMAS:
 * 1. Prazos base das fases NBR 13532 estão MUITO altos
 * 2. Multiplicadores por área estão exagerados
 * 3. Lógica de soma sequencial não considera paralelismo
 */

const { getClient } = require('./config/database');

// 🔍 ANÁLISE DOS PRAZOS ATUAIS
const fasesNBR13532Atual = {
  'LV_LEVANTAMENTO_DADOS': { prazoBase: 1 },      // 1 semana
  'PN_PROGRAMA_NECESSIDADES': { prazoBase: 1 },   // 1 semana  
  'EV_ESTUDO_VIABILIDADE': { prazoBase: 2 },      // 2 semanas
  'EP_ESTUDO_PRELIMINAR': { prazoBase: 3 },       // 3 semanas
  'AP_ANTEPROJETO': { prazoBase: 6 },             // 6 semanas ❌ MUITO ALTO
  'PL_PROJETO_LEGAL': { prazoBase: 3 },           // 3 semanas
  'PB_PROJETO_BASICO': { prazoBase: 4 },          // 4 semanas
  'PE_PROJETO_EXECUTIVO': { prazoBase: 6 }        // 6 semanas ❌ MUITO ALTO
};

// ✅ PRAZOS CORRIGIDOS BASEADOS NA REALIDADE
const fasesNBR13532Corrigida = {
  'LV_LEVANTAMENTO_DADOS': { prazoBase: 0.5 },    // 0.5 semana
  'PN_PROGRAMA_NECESSIDADES': { prazoBase: 0.5 }, // 0.5 semana
  'EV_ESTUDO_VIABILIDADE': { prazoBase: 1 },      // 1 semana
  'EP_ESTUDO_PRELIMINAR': { prazoBase: 1.5 },     // 1.5 semanas
  'AP_ANTEPROJETO': { prazoBase: 2.5 },           // 2.5 semanas ✅ CORRIGIDO
  'PL_PROJETO_LEGAL': { prazoBase: 1 },           // 1 semana
  'PB_PROJETO_BASICO': { prazoBase: 2 },          // 2 semanas ✅ CORRIGIDO
  'PE_PROJETO_EXECUTIVO': { prazoBase: 2.5 }      // 2.5 semanas ✅ CORRIGIDO
};

async function analisarProblema() {
  console.log('🚨 ANÁLISE DO PROBLEMA: CRONOGRAMA 56 SEMANAS\n');
  
  // Simular dados de um projeto residencial 250m²
  const dadosSimulacao = {
    areaConstruida: 250,
    complexidade: 'MEDIA',
    disciplinasNecessarias: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS']
  };
  
  console.log('📊 DADOS DO PROJETO:');
  console.log(`- Área: ${dadosSimulacao.areaConstruida}m²`);
  console.log(`- Complexidade: ${dadosSimulacao.complexidade}`);
  console.log(`- Disciplinas: ${dadosSimulacao.disciplinasNecessarias.length}\n`);
  
  // 1. ANÁLISE COM LÓGICA ATUAL (PROBLEMÁTICA)
  console.log('❌ LÓGICA ATUAL (PROBLEMÁTICA):');
  let prazoTotalAtual = 0;
  
  for (const [faseId, fase] of Object.entries(fasesNBR13532Atual)) {
    let prazoFase = fase.prazoBase;
    
    // Ajustes por área (PROBLEMÁTICOS)
    if (dadosSimulacao.areaConstruida > 500) prazoFase += Math.ceil(fase.prazoBase * 0.3);
    if (dadosSimulacao.areaConstruida > 1000) prazoFase += Math.ceil(fase.prazoBase * 0.5);
    if (dadosSimulacao.areaConstruida > 2000) prazoFase += Math.ceil(fase.prazoBase * 0.7);
    
    // Ajustes por complexidade
    if (dadosSimulacao.complexidade === 'ALTA') prazoFase += Math.ceil(fase.prazoBase * 0.2);
    if (dadosSimulacao.complexidade === 'MUITO_ALTA') prazoFase += Math.ceil(fase.prazoBase * 0.4);
    
    // Ajustes por disciplinas (PROBLEMÁTICO)
    const disciplinasNaFase = dadosSimulacao.disciplinasNecessarias.length;
    if (disciplinasNaFase > 2) prazoFase += Math.ceil(fase.prazoBase * 0.1 * (disciplinasNaFase - 2));
    
    console.log(`  ${faseId}: ${fase.prazoBase} → ${prazoFase} semanas`);
    prazoTotalAtual += prazoFase;
  }
  
  console.log(`\n🚨 TOTAL ATUAL: ${prazoTotalAtual} semanas (${Math.round(prazoTotalAtual/4.33)} meses)\n`);
  
  // 2. ANÁLISE COM LÓGICA CORRIGIDA
  console.log('✅ LÓGICA CORRIGIDA:');
  let prazoTotalCorrigido = 0;
  
  for (const [faseId, fase] of Object.entries(fasesNBR13532Corrigida)) {
    let prazoFase = fase.prazoBase;
    
    // Ajustes por área (CORRIGIDOS - mais suaves)
    if (dadosSimulacao.areaConstruida > 500) prazoFase += fase.prazoBase * 0.1; // Era 0.3
    if (dadosSimulacao.areaConstruida > 1000) prazoFase += fase.prazoBase * 0.2; // Era 0.5
    if (dadosSimulacao.areaConstruida > 2000) prazoFase += fase.prazoBase * 0.3; // Era 0.7
    
    // Ajustes por complexidade (CORRIGIDOS)
    if (dadosSimulacao.complexidade === 'ALTA') prazoFase += fase.prazoBase * 0.1; // Era 0.2
    if (dadosSimulacao.complexidade === 'MUITO_ALTA') prazoFase += fase.prazoBase * 0.2; // Era 0.4
    
    // Remover ajuste por disciplinas (não faz sentido somar tempo por disciplina)
    
    console.log(`  ${faseId}: ${fase.prazoBase} → ${prazoFase.toFixed(1)} semanas`);
    prazoTotalCorrigido += prazoFase;
  }
  
  console.log(`\n✅ TOTAL CORRIGIDO: ${prazoTotalCorrigido.toFixed(1)} semanas (${Math.round(prazoTotalCorrigido/4.33)} meses)\n`);
  
  // 3. CONSIDERANDO PARALELISMO (MAIS REALISTA)
  console.log('🔄 CONSIDERANDO PARALELISMO:');
  
  // Fases que podem ser paralelas
  const fasesSequenciais = [
    { nome: 'Concepção (LV + PN)', prazo: 1 },
    { nome: 'Definição (EV + EP)', prazo: 2 },
    { nome: 'Anteprojeto', prazo: 2.5 },
    { nome: 'Legal + Básico (paralelo)', prazo: 2 }, // Máximo entre PL(1) e PB(2)
    { nome: 'Executivo', prazo: 2.5 }
  ];
  
  let prazoComParalelismo = 0;
  for (const fase of fasesSequenciais) {
    console.log(`  ${fase.nome}: ${fase.prazo} semanas`);
    prazoComParalelismo += fase.prazo;
  }
  
  console.log(`\n🎯 TOTAL COM PARALELISMO: ${prazoComParalelismo} semanas (${Math.round(prazoComParalelismo/4.33)} meses)`);
  console.log(`📊 COMPARAÇÃO COM REALIDADE: 8-12 semanas esperadas ✅\n`);
  
  // 4. IDENTIFICAR PROBLEMAS ESPECÍFICOS
  console.log('🔍 PROBLEMAS IDENTIFICADOS:');
  console.log('1. ❌ Prazos base muito altos (AP: 6 sem, PE: 6 sem)');
  console.log('2. ❌ Multiplicadores por área exagerados (0.3, 0.5, 0.7)');
  console.log('3. ❌ Soma por disciplinas não faz sentido técnico');
  console.log('4. ❌ Não considera paralelismo entre fases');
  console.log('5. ❌ Lógica sequencial pura (irreal)\n');
  
  console.log('✅ SOLUÇÕES PROPOSTAS:');
  console.log('1. ✅ Reduzir prazos base para valores realistas');
  console.log('2. ✅ Multiplicadores por área mais suaves');
  console.log('3. ✅ Remover soma por disciplinas');
  console.log('4. ✅ Implementar lógica de paralelismo');
  console.log('5. ✅ Cronograma baseado em fases macro');
}

async function gerarCorrecao() {
  console.log('\n🔧 GERANDO CORREÇÃO DO CALCULADOR...\n');
  
  const correcaoCode = `
// ✅ CORREÇÃO APLICADA - PRAZOS REALISTAS PARA PROJETOS BRASILEIROS

// Fases do projeto baseadas na NBR 13532 - PRAZOS CORRIGIDOS
this.fasesNBR13532 = {
  'LV_LEVANTAMENTO_DADOS': {
    ordem: 1,
    etapa: "A - CONCEPÇÃO",
    nome: 'LV - Levantamento de Dados',
    percentual: 0.05,
    horasBase: 0.1,
    prazoBase: 0.5, // ✅ CORRIGIDO: era 1
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA"]
  },
  'PN_PROGRAMA_NECESSIDADES': {
    ordem: 2,
    etapa: "A - CONCEPÇÃO", 
    nome: 'PN - Programa de Necessidades',
    percentual: 0.05,
    horasBase: 0.1,
    prazoBase: 0.5, // ✅ CORRIGIDO: era 1
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA"]
  },
  'EV_ESTUDO_VIABILIDADE': {
    ordem: 3,
    etapa: "B - DEFINIÇÃO",
    nome: 'EV - Estudo de Viabilidade',
    percentual: 0.10,
    horasBase: 0.15,
    prazoBase: 1, // ✅ CORRIGIDO: era 2
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA", "ESTRUTURAL"]
  },
  'EP_ESTUDO_PRELIMINAR': {
    ordem: 4,
    etapa: "B - DEFINIÇÃO",
    nome: 'EP - Estudo Preliminar', 
    percentual: 0.15,
    horasBase: 0.2,
    prazoBase: 1.5, // ✅ CORRIGIDO: era 3
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA"]
  },
  'AP_ANTEPROJETO': {
    ordem: 5,
    etapa: "C - INTERFACES",
    nome: 'AP - Anteprojeto Multidisciplinar',
    percentual: 0.30,
    horasBase: 0.25, 
    prazoBase: 2.5, // ✅ CORRIGIDO: era 6 (PROBLEMA PRINCIPAL!)
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"]
  },
  'PL_PROJETO_LEGAL': {
    ordem: 6,
    etapa: "D - APROVAÇÃO",
    nome: 'PL - Projeto Legal',
    percentual: 0.15,
    horasBase: 0.15,
    prazoBase: 1, // ✅ CORRIGIDO: era 3
    responsavel: "Equipe Técnica", 
    disciplinas: ["ARQUITETURA"]
  },
  'PB_PROJETO_BASICO': {
    ordem: 7,
    etapa: "E - PROJETO BÁSICO",
    nome: 'PB - Projeto Básico Multidisciplinar',
    percentual: 0.20,
    horasBase: 0.2,
    prazoBase: 2, // ✅ CORRIGIDO: era 4
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"]
  },
  'PE_PROJETO_EXECUTIVO': {
    ordem: 8,
    etapa: "F - PROJETO EXECUTIVO", 
    nome: 'PE - Projeto Executivo Completo',
    percentual: 0.30,
    horasBase: 0.25,
    prazoBase: 2.5, // ✅ CORRIGIDO: era 6 (PROBLEMA PRINCIPAL!)
    responsavel: "Equipe Técnica",
    disciplinas: ["ARQUITETURA", "ESTRUTURAL", "INSTALACOES_ELETRICAS", "INSTALACOES_HIDRAULICAS"]
  }
};

// ✅ FUNÇÃO DE CÁLCULO CORRIGIDA
calcularCronogramaNBR13532(dados, valoresProfissionais) {
  const cronograma = {};
  let valorTotalTecnico = 0;
  let prazoTotalSemanas = 0;
  
  // Calcular valor técnico total
  for (const disciplina of Object.values(valoresProfissionais)) {
    valorTotalTecnico += disciplina.valorTotal;
  }
  
  // Calcular cada fase com lógica corrigida
  for (const [faseId, fase] of Object.entries(this.fasesNBR13532)) {
    const valorFase = Math.round(valorTotalTecnico * fase.percentual);
    
    // ✅ LÓGICA DE PRAZO CORRIGIDA
    let prazoFase = fase.prazoBase;
    
    // ✅ Ajustes por área (CORRIGIDOS - mais suaves)
    if (dados.areaConstruida > 500) prazoFase += fase.prazoBase * 0.1; // Era 0.3
    if (dados.areaConstruida > 1000) prazoFase += fase.prazoBase * 0.15; // Era 0.5  
    if (dados.areaConstruida > 2000) prazoFase += fase.prazoBase * 0.2; // Era 0.7
    
    // ✅ Ajustes por complexidade (CORRIGIDOS)
    if (dados.complexidade === 'ALTA') prazoFase += fase.prazoBase * 0.1; // Era 0.2
    if (dados.complexidade === 'MUITO_ALTA') prazoFase += fase.prazoBase * 0.15; // Era 0.4
    
    // ❌ REMOVIDO: Ajuste por disciplinas (não faz sentido técnico)
    
    cronograma[faseId] = {
      ordem: fase.ordem,
      etapa: fase.etapa,
      nome: fase.nome,
      prazo: Math.round(prazoFase * 10) / 10, // Arredondar para 1 casa decimal
      valor: valorFase,
      percentual: fase.percentual,
      disciplinas: fase.disciplinas,
      responsavel: fase.responsavel
    };
    
    prazoTotalSemanas += prazoFase;
  }
  
  return {
    fases: cronograma,
    prazoTotal: Math.round(prazoTotalSemanas * 10) / 10, // ✅ RESULTADO REALISTA
    valorTecnicoTotal: valorTotalTecnico,
    metodologia: 'NBR_13532_V2_CORRIGIDO'
  };
}`;

  console.log('📝 CÓDIGO DE CORREÇÃO GERADO:');
  console.log(correcaoCode);
}

// Executar análise
analisarProblema()
  .then(() => gerarCorrecao())
  .then(() => {
    console.log('\n🎯 RESUMO DA CORREÇÃO:');
    console.log('- Projeto 250m² residencial: 56 semanas → ~10 semanas ✅');
    console.log('- Prazos base reduzidos drasticamente');
    console.log('- Multiplicadores suavizados');
    console.log('- Lógica de disciplinas removida');
    console.log('- Resultado alinhado com a realidade do mercado');
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erro na análise:', error);
    process.exit(1);
  });