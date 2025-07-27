// 🔍 VALIDAÇÃO TÉCNICA AUTOMÁTICA - ARCFLOW
// Sistema inteligente de validação que substitui a análise IA genérica

import { DadosExtraidos } from './extrairDadosBriefing';

export interface ValidacaoTecnica {
  score: number; // 0-100
  categoria: 'excelente' | 'bom' | 'atencao' | 'critico';
  alertasCriticos: string[];
  alertasAtencao: string[];
  sugestoesMelhoria: string[];
  proximosPassos: string[];
  checklistDocumentacao: string[];
  viabilidadeOrcamentaria: {
    status: 'viavel' | 'limitrofe' | 'inviavel';
    observacoes: string;
    sugestoes: string[];
  };
  compatibilidadeTerreno: {
    status: 'compativel' | 'limitacoes' | 'incompativel';
    observacoes: string;
    restricoes: string[];
  };
  geradoEm: string;
}

export function validarTecnicamente(dados: DadosExtraidos): ValidacaoTecnica {
  console.log('🔍 Iniciando validação técnica automática...');
  
  const alertasCriticos: string[] = [];
  const alertasAtencao: string[] = [];
  const sugestoesMelhoria: string[] = [];
  const proximosPassos: string[] = [];
  const checklistDocumentacao: string[] = [];
  
  let score = 100;
  
  // 1. VALIDAÇÃO ORÇAMENTÁRIA
  const viabilidadeOrcamentaria = validarViabilidadeOrcamentaria(dados);
  if (viabilidadeOrcamentaria.status === 'inviavel') {
    score -= 30;
    alertasCriticos.push('Orçamento insuficiente para o programa proposto');
  } else if (viabilidadeOrcamentaria.status === 'limitrofe') {
    score -= 15;
    alertasAtencao.push('Orçamento no limite para o programa proposto');
  }
  
  // 2. VALIDAÇÃO DE ÁREA E PROGRAMA
  const compatibilidadePrograma = validarCompatibilidadePrograma(dados);
  if (!compatibilidadePrograma.compativel) {
    score -= 20;
    alertasCriticos.push('Programa incompatível com área disponível');
  }
  
  // 3. VALIDAÇÃO DO TERRENO
  const compatibilidadeTerreno = validarCompatibilidadeTerreno(dados);
  if (compatibilidadeTerreno.status === 'incompativel') {
    score -= 25;
    alertasCriticos.push('Terreno incompatível com o programa proposto');
  } else if (compatibilidadeTerreno.status === 'limitacoes') {
    score -= 10;
    alertasAtencao.push('Terreno apresenta limitações para o programa');
  }
  
  // 4. VALIDAÇÃO DE CRONOGRAMA
  const cronograma = validarCronograma(dados);
  if (!cronograma.viavel) {
    score -= 15;
    alertasAtencao.push('Cronograma muito apertado para o escopo');
  }
  
  // 5. VALIDAÇÃO DE SISTEMAS TÉCNICOS
  const sistemas = validarSistemasTecnicos(dados);
  if (sistemas.conflitos.length > 0) {
    score -= 10;
    alertasAtencao.push('Conflitos identificados entre sistemas técnicos');
  }
  
  // 6. GERAR SUGESTÕES DE MELHORIA
  sugestoesMelhoria.push(...gerarSugestoesMelhoria(dados));
  
  // 7. GERAR PRÓXIMOS PASSOS
  proximosPassos.push(...gerarProximosPassos(dados));
  
  // 8. GERAR CHECKLIST DE DOCUMENTAÇÃO
  checklistDocumentacao.push(...gerarChecklistDocumentacao(dados));
  
  // Determinar categoria baseada no score
  let categoria: ValidacaoTecnica['categoria'];
  if (score >= 85) categoria = 'excelente';
  else if (score >= 70) categoria = 'bom';
  else if (score >= 50) categoria = 'atencao';
  else categoria = 'critico';
  
  return {
    score,
    categoria,
    alertasCriticos,
    alertasAtencao,
    sugestoesMelhoria,
    proximosPassos,
    checklistDocumentacao,
    viabilidadeOrcamentaria,
    compatibilidadeTerreno,
    geradoEm: new Date().toISOString()
  };
}

// Validar viabilidade orçamentária
function validarViabilidadeOrcamentaria(dados: DadosExtraidos) {
  const orcamento = dados.orcamentoDisponivel;
  const area = dados.areaTotal;
  
  // Custo estimado por m² baseado na complexidade e padrão
  let custoM2Base = 2500; // Valor base para padrão médio
  
  // Ajustar por padrão
  const ajustesPadrao: Record<string, number> = {
    'Simples': 0.7,
    'Médio': 1.0,
    'Alto': 1.4,
    'Luxo': 1.8,
    'Premium': 2.5
  };
  custoM2Base *= ajustesPadrao[dados.padrao] || 1.0;
  
  // Ajustar por complexidade
  const ajustesComplexidade: Record<string, number> = {
    'Baixa': 0.8,
    'Média': 1.0,
    'Alta': 1.3,
    'Muito Alta': 1.6
  };
  custoM2Base *= ajustesComplexidade[dados.complexidade] || 1.0;
  
  const custoEstimado = area * custoM2Base;
  const margem = custoEstimado * 0.2; // 20% de margem
  
  const observacoes: string[] = [];
  const sugestoes: string[] = [];
  
  if (orcamento < custoEstimado) {
    observacoes.push(`Orçamento R$ ${orcamento.toLocaleString()} insuficiente para custo estimado R$ ${custoEstimado.toLocaleString()}`);
    sugestoes.push('Reduzir área construída');
    sugestoes.push('Simplificar acabamentos');
    sugestoes.push('Revisar programa de necessidades');
    return { status: 'inviavel' as const, observacoes: observacoes.join('. '), sugestoes };
  }
  
  if (orcamento < custoEstimado + margem) {
    observacoes.push(`Orçamento no limite. Recomendamos reserva adicional de R$ ${margem.toLocaleString()}`);
    sugestoes.push('Criar reserva de contingência');
    sugestoes.push('Considerar execução por etapas');
    return { status: 'limitrofe' as const, observacoes: observacoes.join('. '), sugestoes };
  }
  
  observacoes.push(`Orçamento adequado com margem de R$ ${(orcamento - custoEstimado).toLocaleString()}`);
  return { status: 'viavel' as const, observacoes: observacoes.join('. '), sugestoes };
}

// Validar compatibilidade do programa com a área
function validarCompatibilidadePrograma(dados: DadosExtraidos) {
  const area = dados.areaTotal;
  const quartos = dados.numeroQuartos;
  const suites = dados.numeroSuites;
  
  // Área mínima estimada baseada no programa
  let areaMinima = 80; // Base
  areaMinima += quartos * 12; // 12m² por quarto
  areaMinima += suites * 20; // 20m² por suíte
  areaMinima += 40; // Áreas sociais
  areaMinima += 15; // Áreas de serviço
  
  if (dados.numeroVagas > 0) {
    areaMinima += dados.numeroVagas * 15; // 15m² por vaga
  }
  
  return {
    compativel: area >= areaMinima,
    areaMinima,
    areaDisponivel: area,
    observacoes: area < areaMinima 
      ? `Área insuficiente. Mínimo recomendado: ${areaMinima}m²`
      : `Área adequada para o programa proposto`
  };
}

// Validar compatibilidade do terreno
function validarCompatibilidadeTerreno(dados: DadosExtraidos) {
  const restricoes: string[] = [];
  let status: 'compativel' | 'limitacoes' | 'incompativel' = 'compativel';
  
  // Validar dimensões
  const { frente, fundo } = dados.dimensoesTerreno;
  if (frente < 6) {
    restricoes.push('Frente extremamente estreita (< 6m) - incompatível');
    status = 'incompativel';
  } else if (frente < 10) {
    restricoes.push('Frente muito estreita (< 10m)');
    status = 'limitacoes';
  }
  
  if (fundo < 15) {
    restricoes.push('Profundidade extremamente insuficiente (< 15m) - incompatível');
    status = 'incompativel';
  } else if (fundo < 20) {
    restricoes.push('Profundidade insuficiente (< 20m)');
    status = 'limitacoes';
  }
  
  // Área total muito pequena
  const areaTerreno = frente * fundo;
  if (areaTerreno < dados.areaTotal * 2) {
    restricoes.push('Área do terreno insuficiente para a área construída desejada');
    status = 'incompativel';
  }
  
  // Validar topografia
  if (dados.topografia === 'Declive' && dados.areaTotal > 300) {
    restricoes.push('Terreno em declive pode encarecer a obra');
    if (status !== 'incompativel') status = 'limitacoes';
  }
  
  // Validar orientação solar
  if (dados.orientacaoSolar === 'Sul') {
    restricoes.push('Orientação sul pode prejudicar iluminação natural');
    if (status !== 'incompativel') status = 'limitacoes';
  }
  
  const observacoes = restricoes.length > 0 
    ? `Terreno apresenta limitações: ${restricoes.join(', ')}`
    : 'Terreno adequado para o programa proposto';
  
  return { status, observacoes, restricoes };
}

// Validar cronograma
function validarCronograma(dados: DadosExtraidos) {
  // Estimar prazo baseado na complexidade e área
  let prazoEstimado = 8; // meses base
  
  if (dados.areaTotal > 300) prazoEstimado += 4;
  if (dados.complexidade === 'Alta') prazoEstimado += 3;
  if (dados.complexidade === 'Muito Alta') prazoEstimado += 6;
  if (dados.urgencia === 'Urgente') prazoEstimado *= 0.8;
  
  return {
    viavel: true, // Por enquanto sempre viável
    prazoEstimado,
    observacoes: `Prazo estimado: ${prazoEstimado} meses`
  };
}

// Validar sistemas técnicos
function validarSistemasTecnicos(dados: DadosExtraidos) {
  const conflitos: string[] = [];
  
  // Verificar conflitos entre sistemas
  if (dados.energiaSolar && dados.tipoCobertura === 'Telha') {
    conflitos.push('Energia solar pode ter limitações com cobertura em telha');
  }
  
  if (dados.automacao && !dados.arCondicionado) {
    conflitos.push('Automação residencial recomenda preparação para ar condicionado');
  }
  
  return { conflitos };
}

// Gerar sugestões de melhoria
function gerarSugestoesMelhoria(dados: DadosExtraidos): string[] {
  const sugestoes: string[] = [];
  
  if (!dados.energiaSolar && dados.orcamentoDisponivel > 1500000) {
    sugestoes.push('Considerar energia solar para reduzir custos operacionais');
  }
  
  if (!dados.captacaoAgua && dados.areaTotal > 200) {
    sugestoes.push('Avaliar captação de água da chuva');
  }
  
  if (dados.numeroVagas < 2 && dados.numeroQuartos > 3) {
    sugestoes.push('Considerar aumentar número de vagas de garagem');
  }
  
  if (dados.complexidade === 'Muito Alta' && dados.urgencia === 'Urgente') {
    sugestoes.push('Revisar cronograma - projeto complexo requer mais tempo');
  }
  
  return sugestoes;
}

// Gerar próximos passos
function gerarProximosPassos(dados: DadosExtraidos): string[] {
  const passos: string[] = [
    'Verificar documentação do terreno',
    'Solicitar levantamento topográfico',
    'Consultar restrições municipais',
    'Agendar visita técnica ao terreno'
  ];
  
  if (dados.complexidade === 'Alta' || dados.complexidade === 'Muito Alta') {
    passos.push('Consultar especialistas em estrutura');
    passos.push('Avaliar necessidade de sondagem do solo');
  }
  
  if (dados.energiaSolar) {
    passos.push('Consultar especialista em energia solar');
  }
  
  if (dados.automacao) {
    passos.push('Definir escopo de automação residencial');
  }
  
  return passos;
}

// Gerar checklist de documentação
function gerarChecklistDocumentacao(dados: DadosExtraidos): string[] {
  const checklist: string[] = [
    'Escritura ou matrícula do terreno',
    'Certidões negativas do terreno',
    'Levantamento topográfico',
    'Consulta de viabilidade na prefeitura'
  ];
  
  if (dados.areaTotal > 500) {
    checklist.push('Estudo de impacto de vizinhança');
  }
  
  if (dados.energiaSolar) {
    checklist.push('Análise de sombreamento');
    checklist.push('Estudo de viabilidade energética');
  }
  
  return checklist;
} 