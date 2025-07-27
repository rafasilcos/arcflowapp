/**
 * 📅 CRONOGRAMA NBR 13532 CORRIGIDO - EXATAMENTE 72 ENTREGÁVEIS
 * 
 * Sistema corrigido com entregáveis organizados corretamente por etapa
 * Total: 7+7+7+7+9+6+17+12 = 72 entregáveis
 */

const CRONOGRAMA_NBR_13532_COMPLETO = {
  'LV_LEVANTAMENTO_DADOS': {
    codigo: 'LV',
    nome: 'LV - Levantamento de Dados',
    etapa: 'A - CONCEPÇÃO',
    ordem: 1,
    prazo: 1,
    percentual: 0.05,
    responsavel: 'Equipe Técnica',
    objetivo: 'Obter todas as informações necessárias do terreno, entorno e possíveis construções existentes para embasar as fases iniciais do projeto.',
    disciplinas: ['ARQUITETURA'],
    entregaveis: [
      "Levantamento topográfico georreferenciado com curvas de nível e pontos notáveis",
      "Cadastro técnico da edificação existente (quando houver), incluindo levantamento arquitetônico, estrutural, instalações e patologias",
      "Levantamento de dados climáticos e orientação solar (heliodiagrama, rosa dos ventos, sombreamento)",
      "Levantamento geotécnico e sondagens do solo (SPT, análise estratigráfica)",
      "Levantamento de infraestrutura local (acessos, redes públicas de água, esgoto, energia, telecom, drenagem)",
      "Fotografias técnicas e relatório descritivo do entorno imediato",
      "Verificação de condicionantes ambientais e legais (APPs, tombamentos, zoneamento, etc.)"
    ]
  },
  
  'PN_PROGRAMA_NECESSIDADES': {
    codigo: 'PN',
    nome: 'PN - Programa de Necessidades',
    etapa: 'A - CONCEPÇÃO',
    ordem: 2,
    prazo: 1,
    percentual: 0.05,
    responsavel: 'Equipe Técnica',
    objetivo: 'Compreender, sistematizar e traduzir as necessidades do cliente em termos espaciais, funcionais e técnicos.',
    disciplinas: ['ARQUITETURA'],
    entregaveis: [
      "Programa arquitetônico detalhado com tabela de ambientes, áreas mínimas e inter-relações",
      "Organograma funcional por setor de uso",
      "Fluxograma das atividades e usuários (diagrama de uso e circulação)",
      "Pré-dimensionamento dos ambientes com base em normas e boas práticas",
      "Definição de padrão de acabamento desejado (nível de qualidade por ambiente)",
      "Levantamento de premissas e restrições técnicas, legais, operacionais e econômicas",
      "Relatório com diagnóstico das demandas, objetivos e prioridades do cliente"
    ]
  },
  
  'EV_ESTUDO_VIABILIDADE': {
    codigo: 'EV',
    nome: 'EV - Estudo de Viabilidade',
    etapa: 'B - DEFINIÇÃO',
    ordem: 3,
    prazo: 2,
    percentual: 0.10,
    responsavel: 'Equipe Técnica',
    objetivo: 'Avaliar se o empreendimento é viável nos aspectos técnico, legal, ambiental e econômico.',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL'],
    entregaveis: [
      "Estudo de massa arquitetônico (volumetria, implantação, ocupação do solo)",
      "Análise de viabilidade legal e urbanística conforme o plano diretor e legislação local",
      "Pré-dimensionamento estrutural e avaliação da solução técnica adotada",
      "Análise de custos preliminar com base em índices e benchmarking",
      "Relatório de viabilidade técnica, econômica e operacional",
      "Avaliação de impacto ambiental preliminar (quando aplicável)",
      "Matriz de riscos iniciais e proposição de soluções ou mitigação"
    ]
  },
  
  'EP_ESTUDO_PRELIMINAR': {
    codigo: 'EP',
    nome: 'EP - Estudo Preliminar',
    etapa: 'B - DEFINIÇÃO',
    ordem: 4,
    prazo: 3,
    percentual: 0.15,
    responsavel: 'Equipe Técnica',
    objetivo: 'Propor soluções espaciais iniciais, permitindo validar conceitualmente a proposta com o cliente.',
    disciplinas: ['ARQUITETURA'],
    entregaveis: [
      "Plantas baixas dos pavimentos com layout funcional",
      "Planta de cobertura com elementos técnicos (caimentos, equipamentos, etc.)",
      "Cortes longitudinais e transversais principais",
      "Fachadas principais com volumetria e linguagem arquitetônica",
      "Planta de situação e locação com afastamentos, acessos e orientação solar",
      "Memorial justificativo conceitual e técnico (implantação, partido, fluxos, materiais)",
      "Estudo volumétrico tridimensional (maquete eletrônica ou física simplificada)"
    ]
  },
  
  'AP_ANTEPROJETO': {
    codigo: 'AP',
    nome: 'AP - Anteprojeto Multidisciplinar',
    etapa: 'C - INTERFACES',
    ordem: 5,
    prazo: 6,
    percentual: 0.30,
    responsavel: 'Equipe Técnica',
    objetivo: 'Avançar na definição do projeto com integração entre disciplinas e maior nível de detalhamento.',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
    entregaveis: [
      "Plantas baixas com dimensionamento e layouts definitivos",
      "Cortes e fachadas cotados",
      "Planta de cobertura detalhada com elementos técnicos e construtivos",
      "Lançamento da estrutura (planta de pilares, vigas, lajes e fundações)",
      "Esquema vertical da distribuição elétrica e pontos principais",
      "Esquema vertical da rede hidráulica e pontos principais",
      "Compatibilização entre disciplinas (detecção de interferências)",
      "Memorial descritivo multidisciplinar consolidado",
      "Representações 3D ou maquetes eletrônicas para comunicação com o cliente"
    ]
  },
  
  'PL_PROJETO_LEGAL': {
    codigo: 'PL',
    nome: 'PL - Projeto Legal',
    etapa: 'D - APROVAÇÃO',
    ordem: 6,
    prazo: 3,
    percentual: 0.15,
    responsavel: 'Equipe Técnica',
    objetivo: 'Preparar documentação para aprovação junto à prefeitura e órgãos competentes.',
    disciplinas: ['ARQUITETURA'],
    entregaveis: [
      "Plantas, cortes e fachadas conforme exigências do órgão licenciador",
      "Memorial descritivo conforme legislação urbanística e edilícia",
      "Quadro de áreas conforme ABNT NBR 13531 e normas locais",
      "Relatório técnico de acessibilidade (se aplicável)",
      "Documentação complementar exigida pela prefeitura (ART/RRT, formulários, certidões, etc.)",
      "Indicação de parâmetros urbanísticos atendidos (gabarito, taxa de ocupação, etc.)"
    ]
  },
  
  'PB_PROJETO_BASICO': {
    codigo: 'PB',
    nome: 'PB - Projeto Básico Multidisciplinar',
    etapa: 'E - PROJETO BÁSICO',
    ordem: 7,
    prazo: 4,
    percentual: 0.20,
    responsavel: 'Equipe Técnica',
    objetivo: 'Consolidar todas as soluções projetuais em nível suficiente para planejamento executivo e orçamentação.',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
    entregaveis: [
      "Projeto arquitetônico básico completo (plantas, cortes, fachadas, cobertura)",
      "Definição preliminar de materiais e acabamentos por ambiente",
      "Indicação de acessos, fluxos, usos e zoneamentos funcionais",
      "Lançamento estrutural com dimensionamento preliminar (vigas, pilares, lajes, fundações)",
      "Memorial descritivo básico da estrutura",
      "Identificação dos principais sistemas estruturais adotados",
      "Planta baixa com pontos de energia, iluminação e quadros de distribuição",
      "Diagrama unifilar simplificado do sistema elétrico",
      "Indicação de carga estimada por ambiente e quadro geral de cargas",
      "Planta com traçado preliminar de redes hidráulicas e sanitárias",
      "Indicação dos principais pontos de consumo e coleta de esgoto",
      "Esquema do sistema de abastecimento de água e esgotamento sanitário",
      "Diretrizes para projeto executivo por disciplina",
      "Indicações de desempenho mínimo esperado (conforme NBR 15575)",
      "Estimativa de custos preliminar por disciplina baseada em projetos similares",
      "Cronograma físico-financeiro preliminar com macroetapas do empreendimento",
      "Diretrizes técnicas e operacionais para planejamento da execução da obra"
    ]
  },
  
  'PE_PROJETO_EXECUTIVO': {
    codigo: 'PE',
    nome: 'PE - Projeto Executivo Completo',
    etapa: 'F - PROJETO EXECUTIVO',
    ordem: 8,
    prazo: 6,
    percentual: 0.30,
    responsavel: 'Equipe Técnica',
    objetivo: 'Fornecer todas as informações técnicas necessárias à execução precisa da obra.',
    disciplinas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS'],
    entregaveis: [
      "Projeto arquitetônico executivo com todos os detalhes construtivos (plantas, cortes, fachadas, paginações)",
      "Projeto estrutural completo com detalhamento de armaduras, fundações, lajes e peças especiais",
      "Projeto elétrico executivo (plantas, quadros, detalhes, diagramas, lista de materiais e cargas)",
      "Projeto hidrossanitário executivo (plantas, cortes, detalhes, reservatórios, bombeamento, etc.)",
      "Projetos complementares: prevenção contra incêndio, lógica, SPDA, climatização (quando aplicável)",
      "Detalhamentos construtivos em escala apropriada (1:20, 1:10, 1:5, etc.)",
      "Especificações técnicas completas por disciplina",
      "Caderno de encargos com obrigações contratuais e critérios de medição",
      "Lista de materiais e componentes construtivos",
      "Memoriais de cálculo estrutural (fundações, lajes, vigas, etc.)",
      "Memoriais descritivos por disciplina atualizados e consolidados",
      "Planejamento executivo com sequenciamento de execução, logística e recomendações"
    ]
  }
};

/**
 * Gera cronograma completo baseado na NBR 13532 - VERSÃO CORRIGIDA
 * Total garantido: 72 entregáveis
 */
function gerarCronogramaCompleto(valorTecnicoTotal, disciplinasAtivas = []) {
  const fases = {};
  let prazoTotal = 0;
  let totalEntregaveis = 0;
  
  console.log('📅 [CRONOGRAMA] Gerando cronograma NBR 13532 corrigido...');
  
  // Gerar cada fase com valores proporcionais
  Object.keys(CRONOGRAMA_NBR_13532_COMPLETO).forEach(faseKey => {
    const faseTemplate = CRONOGRAMA_NBR_13532_COMPLETO[faseKey];
    
    // Calcular valor da fase baseado no percentual
    const valorFase = Math.round(valorTecnicoTotal * faseTemplate.percentual);
    
    // Filtrar disciplinas da fase que estão ativas no projeto
    const disciplinasFase = faseTemplate.disciplinas.filter(disc => 
      disciplinasAtivas.length === 0 || disciplinasAtivas.includes(disc.toLowerCase())
    );
    
    fases[faseKey] = {
      ...faseTemplate,
      valor: valorFase,
      disciplinas: disciplinasFase,
      ativa: true
    };
    
    prazoTotal += faseTemplate.prazo;
    totalEntregaveis += faseTemplate.entregaveis.length;
  });
  
  console.log(`✅ [CRONOGRAMA] Gerado com ${totalEntregaveis} entregáveis (esperado: 72)`);
  
  if (totalEntregaveis !== 72) {
    console.warn(`⚠️ [CRONOGRAMA] ATENÇÃO: Total de entregáveis (${totalEntregaveis}) diferente do esperado (72)`);
  }
  
  return {
    prazoTotal,
    metodologia: 'NBR_13532_SEQUENCIAL',
    valorTecnicoTotal,
    totalEntregaveis,
    fases
  };
}

/**
 * Função para validar se o cronograma tem exatamente 72 entregáveis
 */
function validarCronograma() {
  let totalEntregaveis = 0;
  const detalhamento = {};
  
  Object.keys(CRONOGRAMA_NBR_13532_COMPLETO).forEach(faseKey => {
    const fase = CRONOGRAMA_NBR_13532_COMPLETO[faseKey];
    const quantidade = fase.entregaveis.length;
    totalEntregaveis += quantidade;
    detalhamento[fase.codigo] = quantidade;
  });
  
  return {
    total: totalEntregaveis,
    esperado: 72,
    correto: totalEntregaveis === 72,
    detalhamento
  };
}

module.exports = {
  CRONOGRAMA_NBR_13532_COMPLETO,
  gerarCronogramaCompleto,
  validarCronograma
};