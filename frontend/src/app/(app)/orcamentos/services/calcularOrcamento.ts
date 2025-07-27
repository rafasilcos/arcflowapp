// Serviço de cálculo automatizado de orçamento para projetos AEC
import type { BriefingCompleto, OrcamentoDetalhado } from "./types";
import { gerenciadorPrazos } from "../../../../services/configuracaoPrazos";

export interface OrcamentoMultidisciplinar {
  arquitetura: number;
  interiores: number;
  decoracao: number;
  paisagismo: number;
  coordenacao: number;
  total: number;
}

// 🎯 FUNÇÃO PRINCIPAL DE CÁLCULO COM DADOS REAIS
export function calcularOrcamento(
  briefing: BriefingCompleto,
  cub: number,
  historico: any[] = []
): OrcamentoDetalhado {
  
  // 📊 DETECTAR SE É TEMPLATE PERSONALIZADO
  const isTemplatePersonalizado = briefing.metadata?.categoria === 'personalizado' || 
                                  briefing.metadata?.tipo === 'template-personalizado';
  
  console.log('🎯 Calculando orçamento - Tipo:', isTemplatePersonalizado ? 'Template Personalizado' : 'Template Padrão');
  
  // 📊 USAR DADOS REAIS EXTRAÍDOS DO BRIEFING
  const dadosReais = (briefing as any).dadosExtraidos || briefing;
  
  // Para templates personalizados, usar dados específicos do template
  let area, tipologia, complexidade, urgencia, disciplinas, localizacao, padrao;
  
  if (isTemplatePersonalizado) {
    // Dados específicos de templates personalizados
    area = dadosReais.area || briefing.areaTotal || extrairAreaDeTemplate(briefing) || 200;
    tipologia = briefing.tipologia || dadosReais.tipologia || 'Personalizado';
    complexidade = dadosReais.complexidade || inferirComplexidadeDeTemplate(briefing);
    urgencia = dadosReais.urgencia || briefing.urgencia || 'Normal';
    disciplinas = extrairDisciplinasDeTemplate(briefing);
    localizacao = dadosReais.localizacao?.estado || briefing.localizacao || 'SP';
    padrao = briefing.padrao || dadosReais.padrao || 'Médio';
    
    console.log('🎯 Template personalizado - Dados extraídos:', {
      area, tipologia, complexidade, urgencia, disciplinas, localizacao, padrao,
      totalPerguntas: briefing.totalPerguntas,
      secoes: briefing.secoes?.length
    });
  } else {
    // Lógica original para templates padrão
    area = dadosReais.area || briefing.areaTotal || 200;
    tipologia = dadosReais.tipologia || briefing.tipologia || 'Residencial';
    complexidade = dadosReais.complexidade || briefing.complexidade || 'Média';
    urgencia = dadosReais.urgencia || briefing.urgencia || 'Normal';
    disciplinas = dadosReais.disciplinas || briefing.disciplinasSelecionadas || ['Arquitetura'];
    localizacao = dadosReais.localizacao?.estado || briefing.localizacao || 'SP';
    padrao = dadosReais.padrao || 'Médio';
  }
  
  console.log('🎯 Calculando orçamento com dados:', {
    area, tipologia, complexidade, urgencia, disciplinas, localizacao, padrao
  });

  // 💰 CÁLCULO BASE POR M² INTELIGENTE
  const valorBaseM2 = calcularValorBaseM2(tipologia, complexidade, localizacao, padrao);
  const valorBaseArquitetura = valorBaseM2 * area;

  // 🏗️ CÁLCULO MULTIDISCIPLINAR BASEADO NAS DISCIPLINAS SELECIONADAS
  const incluirInteriores = disciplinas.includes("Design de Interiores") || disciplinas.includes("Interiores");
  const incluirDecoracao = disciplinas.includes("Decoração");
  const incluirPaisagismo = disciplinas.includes("Paisagismo");
  const incluirEstrutura = disciplinas.includes("Projeto Estrutural") || disciplinas.includes("Estrutural");
  const incluirInstalacoes = disciplinas.includes("Projetos de Instalações") || disciplinas.includes("Instalações");

  const interiores = incluirInteriores ? valorBaseArquitetura * 0.4 : 0;
  const decoracao = incluirDecoracao ? valorBaseArquitetura * 0.2 : 0;
  const paisagismo = incluirPaisagismo ? valorBaseArquitetura * 0.3 : 0;
  const estrutural = incluirEstrutura ? valorBaseArquitetura * 0.6 : 0;
  const instalacoes = incluirInstalacoes ? valorBaseArquitetura * 0.47 : 0;
  const coordenacao = (valorBaseArquitetura + interiores + decoracao + paisagismo + estrutural + instalacoes) * 0.1;

  const subtotal = valorBaseArquitetura + interiores + decoracao + paisagismo + estrutural + instalacoes + coordenacao;

  // ⚡ APLICAR FATORES DE URGÊNCIA E MARGEM
  let valorTotal = subtotal * buscarFatorUrgencia(urgencia);
  
  // 🎨 AJUSTES POR CARACTERÍSTICAS ESPECÍFICAS
  valorTotal = aplicarAjustesEspecificos(valorTotal, dadosReais);

  // 📋 BREAKDOWN DETALHADO
  const breakdownMultidisciplinar: OrcamentoMultidisciplinar = {
    arquitetura: Math.round(valorBaseArquitetura),
    interiores: Math.round(interiores + decoracao), // Agrupando design
    decoracao: Math.round(estrutural + instalacoes), // Agrupando engenharia
    paisagismo: Math.round(paisagismo),
    coordenacao: Math.round(coordenacao),
    total: Math.round(subtotal),
  };

  // 📊 CUSTOS POR ETAPA (PARA COMPATIBILIDADE COM DASHBOARD)
  const custoTotalPorEtapa = {
    estudo_preliminar: Math.round(valorTotal * 0.15),
    anteprojeto: Math.round(valorTotal * 0.25),
    projeto_executivo: Math.round(valorTotal * 0.35),
    detalhamento: Math.round(valorTotal * 0.15),
    aprovacao: Math.round(valorTotal * 0.10)
  };

  const { sugestoes, alertas } = gerarSugestoesEAlertas(breakdownMultidisciplinar, dadosReais);

  // 📅 CRONOGRAMA BASEADO NA COMPLEXIDADE E ÁREA
  const cronograma = gerarCronograma(area, complexidade, disciplinas);

  // 💳 PROPOSTA DE PAGAMENTO
  const proposta = gerarProposta(valorTotal, cronograma);

  return {
    valorTotal: Math.round(valorTotal),
    breakdown: {
      area,
      valorBase: valorBaseArquitetura,
      fatorTipologia: buscarFatorTipologia(tipologia),
      fatorComplexidade: buscarFatorComplexidade(complexidade),
      valorDisciplinas: interiores + decoracao + paisagismo + estrutural + instalacoes + coordenacao,
      fatoresExtras: {
        urgencia: urgencia,
        margem: 15,
      },
      multidisciplinar: breakdownMultidisciplinar,
      sugestoes,
      alertas,
    },
    // 🎯 DADOS PARA COMPATIBILIDADE COM DASHBOARD
    calculos: {
      custoTotalPorEtapa,
      margemAplicada: 15
    },
    proposta,
    cronograma,
    prazoEntrega: cronograma.prazoTotal,
    briefingUtilizado: briefing,
  };
}

// 💰 CÁLCULO INTELIGENTE DO VALOR BASE POR M²
function calcularValorBaseM2(tipologia: string, complexidade: string, localizacao: string, padrao: string): number {
  // Base nacional: R$ 75/m² para arquitetura residencial média
  let valorBase = 75;
  
  // Multiplicador por tipologia
  valorBase *= buscarFatorTipologia(tipologia);
  
  // Multiplicador por complexidade
  valorBase *= buscarFatorComplexidade(complexidade);
  
  // Ajuste regional
  valorBase *= buscarFatorRegional(localizacao);
  
  // Ajuste por padrão
  valorBase *= buscarFatorPadrao(padrao);
  
  return valorBase;
}

// 🎯 FUNÇÕES INTELIGENTES BASEADAS EM DADOS REAIS
function buscarFatorTipologia(tipologia: string): number {
  const fatores: Record<string, number> = {
    'Residencial': 1.0,
    'Comercial': 1.2,
    'Industrial': 1.4,
    'Institucional': 1.3,
    'Urbanístico': 1.5
  };
  return fatores[tipologia] || 1.0;
}

function buscarFatorComplexidade(complexidade: string): number {
  const fatores: Record<string, number> = {
    'Baixa': 0.8,
    'Média': 1.0,
    'Alta': 1.3,
    'Muito Alta': 1.6
  };
  return fatores[complexidade] || 1.0;
}

function buscarFatorUrgencia(urgencia: string): number {
  const fatores: Record<string, number> = {
    'Normal': 1.0,
    'Urgente': 1.25,
    'Muito Urgente': 1.5
  };
  return fatores[urgencia] || 1.0;
}

function buscarFatorRegional(estado: string): number {
  const fatores: Record<string, number> = {
    'SP': 1.15, 'RJ': 1.12, 'DF': 1.10, 'SC': 1.05, 'RS': 1.02,
    'MG': 0.95, 'BA': 0.90, 'PE': 0.88, 'CE': 0.85, 'GO': 0.92,
    'PR': 1.00, 'ES': 0.98, 'MT': 0.90, 'MS': 0.88, 'TO': 0.82
  };
  return fatores[estado] || 1.0;
}

function buscarFatorPadrao(padrao: string): number {
  const fatores: Record<string, number> = {
    'Simples': 0.85,
    'Médio': 1.0,
    'Alto': 1.25,
    'Luxo': 1.6,
    'Premium': 2.0
  };
  return fatores[padrao] || 1.0;
}

// 🎨 AJUSTES POR CARACTERÍSTICAS ESPECÍFICAS
function aplicarAjustesEspecificos(valor: number, dados: any): number {
  let ajuste = 1.0;
  
  // Sistemas especiais
  if (dados.automacao || dados.sistemasEspeciais?.includes('Automação')) ajuste *= 1.08;
  if (dados.energiaSolar || dados.sistemasEspeciais?.includes('Energia Solar')) ajuste *= 1.05;
  if (dados.captacaoAgua || dados.sistemasEspeciais?.includes('Captação de Água')) ajuste *= 1.03;
  if (dados.arCondicionado || dados.sistemasEspeciais?.includes('Ar Condicionado')) ajuste *= 1.04;
  
  // Terreno complexo
  if (dados.terrenoComplexo) ajuste *= 1.15;
  
  // Múltiplos pavimentos
  if (dados.pavimentos && dados.pavimentos > 2) {
    ajuste *= 1 + (dados.pavimentos - 2) * 0.05;
  }
  
  return valor * ajuste;
}

// 📅 GERAÇÃO DE CRONOGRAMA INTELIGENTE COM SISTEMA PERSONALIZADO
function gerarCronograma(area: number, complexidade: string, disciplinas: string[]) {
  try {
    // 🎯 USAR SISTEMA INTELIGENTE DE PRAZOS PERSONALIZADO
    const disciplinasNormalizadas = disciplinas.map(d => {
      if (d.includes('Arquitetura') || d.includes('arquitetura')) return 'arquitetura';
      if (d.includes('Estrutural') || d.includes('estrutural')) return 'estrutural';
      if (d.includes('Instalações') || d.includes('instalacoes')) return 'instalacoes';
      if (d.includes('Paisagismo') || d.includes('paisagismo')) return 'paisagismo';
      if (d.includes('Interiores') || d.includes('interiores')) return 'interiores';
      return 'arquitetura'; // fallback
    });

    // Normalizar complexidade
    const complexidadeNormalizada = complexidade.toLowerCase().includes('baixa') ? 'simples' :
                                   complexidade.toLowerCase().includes('média') ? 'medio' :
                                   complexidade.toLowerCase().includes('alta') ? 'alto' : 'complexo';

    const resultado = gerenciadorPrazos.calcularPrazoTotal({
      disciplinas: disciplinasNormalizadas,
      areaConstruida: area,
      complexidade: complexidadeNormalizada as any
    });

    console.log('🎯 Cronograma calculado com sistema personalizado:', resultado);

    const diasTotais = resultado.prazoTotal;
    const semanasTotais = Math.ceil(diasTotais / 7);

    const etapas = [
      { nome: 'Estudo Preliminar', duracao: Math.ceil(semanasTotais * 0.2), responsavel: 'Arquiteto', entregaveis: ['Plantas de situação', 'Estudos volumétricos', 'Memorial descritivo'] },
      { nome: 'Anteprojeto', duracao: Math.ceil(semanasTotais * 0.3), responsavel: 'Equipe Técnica', entregaveis: ['Plantas baixas', 'Cortes e fachadas', 'Especificações básicas'] },
      { nome: 'Projeto Executivo', duracao: Math.ceil(semanasTotais * 0.35), responsavel: 'Equipe Multidisciplinar', entregaveis: ['Plantas executivas', 'Detalhamentos', 'Especificações técnicas'] },
      { nome: 'Detalhamento', duracao: Math.ceil(semanasTotais * 0.1), responsavel: 'Especialistas', entregaveis: ['Detalhes construtivos', 'Caderno de especificações'] },
      { nome: 'Aprovação', duracao: Math.ceil(semanasTotais * 0.05), responsavel: 'Coordenador', entregaveis: ['Documentos para aprovação', 'Acompanhamento de processos'] }
    ];
    
    const marcosPrincipais = [
      { nome: 'Aprovação do Estudo Preliminar', data: new Date(Date.now() + etapas[0].duracao * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'aprovacao' },
      { nome: 'Entrega do Anteprojeto', data: new Date(Date.now() + (etapas[0].duracao + etapas[1].duracao) * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'entrega' },
      { nome: 'Finalização do Projeto Executivo', data: new Date(Date.now() + semanasTotais * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'entrega' }
    ];
    
    return {
      prazoTotal: semanasTotais,
      prazoDias: diasTotais,
      etapas,
      marcosPrincipais,
      detalhePorDisciplina: resultado.detalhePorDisciplina,
      cronogramaCompleto: resultado.cronograma,
      configuracaoUtilizada: 'personalizada'
    };
  } catch (error) {
    console.error('❌ Erro ao calcular cronograma personalizado, usando fallback:', error);
    
    // 📅 FALLBACK: Sistema antigo caso haja erro
    const baseWeeks = Math.ceil(area / 50) + 8; // Base: 8 semanas + 1 semana por 50m²
    
    const multiplicadorComplexidade = {
      'Baixa': 0.8,
      'Média': 1.0,
      'Alta': 1.3,
      'Muito Alta': 1.6
    }[complexidade] || 1.0;
    
    const semanasTotais = Math.ceil(baseWeeks * multiplicadorComplexidade);
    
    const etapas = [
      { nome: 'Estudo Preliminar', duracao: Math.ceil(semanasTotais * 0.2), responsavel: 'Arquiteto', entregaveis: ['Plantas de situação', 'Estudos volumétricos', 'Memorial descritivo'] },
      { nome: 'Anteprojeto', duracao: Math.ceil(semanasTotais * 0.3), responsavel: 'Equipe Técnica', entregaveis: ['Plantas baixas', 'Cortes e fachadas', 'Especificações básicas'] },
      { nome: 'Projeto Executivo', duracao: Math.ceil(semanasTotais * 0.35), responsavel: 'Equipe Multidisciplinar', entregaveis: ['Plantas executivas', 'Detalhamentos', 'Especificações técnicas'] },
      { nome: 'Detalhamento', duracao: Math.ceil(semanasTotais * 0.1), responsavel: 'Especialistas', entregaveis: ['Detalhes construtivos', 'Caderno de especificações'] },
      { nome: 'Aprovação', duracao: Math.ceil(semanasTotais * 0.05), responsavel: 'Coordenador', entregaveis: ['Documentos para aprovação', 'Acompanhamento de processos'] }
    ];
    
    const marcosPrincipais = [
      { nome: 'Aprovação do Estudo Preliminar', data: new Date(Date.now() + etapas[0].duracao * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'aprovacao' },
      { nome: 'Entrega do Anteprojeto', data: new Date(Date.now() + (etapas[0].duracao + etapas[1].duracao) * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'entrega' },
      { nome: 'Finalização do Projeto Executivo', data: new Date(Date.now() + semanasTotais * 7 * 24 * 60 * 60 * 1000).toISOString(), tipo: 'entrega' }
    ];
    
    return {
      prazoTotal: semanasTotais,
      prazoDias: semanasTotais * 7,
      etapas,
      marcosPrincipais,
      configuracaoUtilizada: 'fallback'
    };
  }
}

// 💳 GERAÇÃO DE PROPOSTA DE PAGAMENTO
function gerarProposta(valorTotal: number, cronograma: any) {
  const entrada = 30; // 30% de entrada
  const parcelas = Math.min(cronograma.prazoTotal, 12); // Máximo 12 parcelas
  const valorEntrada = (valorTotal * entrada) / 100;
  const valorRestante = valorTotal - valorEntrada;
  const valorParcela = valorRestante / parcelas;
  
  return {
    formaPagamento: {
      entrada,
      parcelas,
      valorParcela: Math.round(valorParcela)
    },
    validadeProposta: 30,
    prazoEntrega: cronograma.prazoTotal
  };
}

function gerarSugestoesEAlertas(breakdown: OrcamentoMultidisciplinar, dados: any): { sugestoes: string[]; alertas: string[] } {
  const sugestoes: string[] = [];
  const alertas: string[] = [];
  
  if (breakdown.interiores > 0 && breakdown.interiores / breakdown.total > 0.3) {
    alertas.push("O orçamento de design está acima de 30% do total. Considere revisar o escopo ou reservar margem extra.");
  }
  
  if (breakdown.decoracao > 0 && breakdown.decoracao / breakdown.total > 0.4) {
    alertas.push("Projetos de engenharia representam mais de 40% do total. Verifique a complexidade técnica.");
  }
  
  if (dados.urgencia === "Urgente" || dados.urgencia === "Muito Urgente") {
    alertas.push("Prazo urgente pode impactar custos e disponibilidade de equipe.");
  }
  
  if (breakdown.total > 500000) {
    sugestoes.push("Considere negociar condições especiais para projetos de alto valor.");
  }
  
  if (dados.area && dados.area > 1000) {
    sugestoes.push("Projeto de grande porte. Avalie necessidade de coordenação especializada.");
  }
  
  return { sugestoes, alertas };
}

// 🎯 FUNÇÕES AUXILIARES PARA TEMPLATES PERSONALIZADOS

function extrairAreaDeTemplate(briefing: BriefingCompleto): number {
  // Procurar por perguntas relacionadas à área nas seções
  if (!briefing.secoes) return 200;
  
  for (const secao of briefing.secoes) {
    for (const pergunta of secao.perguntas || []) {
      if (pergunta.texto.toLowerCase().includes('área') || 
          pergunta.texto.toLowerCase().includes('metragem') ||
          pergunta.id.toLowerCase().includes('area')) {
        // Se encontrou pergunta sobre área, usar valor padrão baseado na tipologia
        return inferirAreaPorTipologia(briefing.tipologia);
      }
    }
  }
  
  return 200; // Valor padrão
}

function inferirComplexidadeDeTemplate(briefing: BriefingCompleto): string {
  const totalPerguntas = briefing.totalPerguntas || 0;
  const totalSecoes = briefing.secoes?.length || 0;
  
  // Inferir complexidade baseada no número de perguntas e seções
  if (totalPerguntas >= 150 && totalSecoes >= 12) return 'Muito Alta';
  if (totalPerguntas >= 100 && totalSecoes >= 8) return 'Alta';
  if (totalPerguntas >= 60 && totalSecoes >= 6) return 'Média';
  return 'Baixa';
}

function extrairDisciplinasDeTemplate(briefing: BriefingCompleto): string[] {
  const disciplinas = ['Arquitetura']; // Sempre inclui arquitetura
  
  if (!briefing.secoes) return disciplinas;
  
  // Analisar seções para inferir disciplinas
  const secoesNomes = briefing.secoes.map((s: any) => s.nome?.toLowerCase() || '');
  
  if (secoesNomes.some((nome: string) => nome.includes('interior') || nome.includes('design'))) {
    disciplinas.push('Design de Interiores');
  }
  
  if (secoesNomes.some((nome: string) => nome.includes('paisag') || nome.includes('jardim'))) {
    disciplinas.push('Paisagismo');
  }
  
  if (secoesNomes.some((nome: string) => nome.includes('estrutur') || nome.includes('fundaç'))) {
    disciplinas.push('Projeto Estrutural');
  }
  
  if (secoesNomes.some((nome: string) => nome.includes('instalaç') || nome.includes('hidrául') || nome.includes('elétric'))) {
    disciplinas.push('Projetos de Instalações');
  }
  
  if (secoesNomes.some((nome: string) => nome.includes('sustent') || nome.includes('energia'))) {
    disciplinas.push('Consultoria Sustentabilidade');
  }
  
  return disciplinas;
}

function inferirAreaPorTipologia(tipologia?: string): number {
  const areas: Record<string, number> = {
    'residencial': 180,
    'comercial': 300,
    'industrial': 800,
    'institucional': 500,
    'personalizado': 250
  };
  
  return areas[tipologia?.toLowerCase() || 'personalizado'] || 200;
} 