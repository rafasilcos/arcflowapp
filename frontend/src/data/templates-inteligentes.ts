import { TarefaTemplate, TemplateInteligente, AnaliseInteligente } from '@/types/validacao';

// ===== TEMPLATES DE TAREFAS POR CATEGORIA =====
export const TEMPLATES_TAREFAS: TarefaTemplate[] = [
  // ARQUITETURA
  {
    id: 'arq_estudo_preliminar',
    nome: 'Estudo Preliminar',
    categoria: 'arquitetura',
    tempo_estimado_base: 28800, // 8 horas
    complexidade: 'media',
    requer_aprovacao: true,
    responsavel_sugerido: 'arquiteto',
    posicao_recomendada: 1,
    etapa_recomendada: 'concepcao',
    dependencias: [],
    multiplicadores: {
      porte_pequeno: 0.7,
      porte_medio: 1.0,
      porte_grande: 1.5,
      complexidade_baixa: 0.8,
      complexidade_media: 1.0,
      complexidade_alta: 1.3
    },
    palavras_chave: ['estudo', 'preliminar', 'conceito', 'partido', 'volumetria'],
    descricao: 'Desenvolvimento do partido arquitetônico e volumetria inicial'
  },
  {
    id: 'arq_anteprojeto',
    nome: 'Anteprojeto Arquitetônico',
    categoria: 'arquitetura',
    tempo_estimado_base: 57600, // 16 horas
    complexidade: 'alta',
    requer_aprovacao: true,
    responsavel_sugerido: 'arquiteto',
    posicao_recomendada: 2,
    etapa_recomendada: 'desenvolvimento',
    dependencias: ['arq_estudo_preliminar'],
    multiplicadores: {
      porte_pequeno: 0.6,
      porte_medio: 1.0,
      porte_grande: 1.8,
      complexidade_baixa: 0.7,
      complexidade_media: 1.0,
      complexidade_alta: 1.5
    },
    palavras_chave: ['anteprojeto', 'plantas', 'cortes', 'fachadas', 'detalhamento'],
    descricao: 'Desenvolvimento completo do anteprojeto com plantas, cortes e fachadas'
  },
  {
    id: 'arq_projeto_executivo',
    nome: 'Projeto Executivo Arquitetônico',
    categoria: 'arquitetura',
    tempo_estimado_base: 86400, // 24 horas
    complexidade: 'critica',
    requer_aprovacao: true,
    responsavel_sugerido: 'arquiteto',
    posicao_recomendada: 3,
    etapa_recomendada: 'detalhamento',
    dependencias: ['arq_anteprojeto'],
    multiplicadores: {
      porte_pequeno: 0.5,
      porte_medio: 1.0,
      porte_grande: 2.0,
      complexidade_baixa: 0.6,
      complexidade_media: 1.0,
      complexidade_alta: 1.7
    },
    palavras_chave: ['executivo', 'detalhamento', 'especificações', 'memoriais'],
    descricao: 'Projeto executivo completo com todos os detalhes construtivos'
  },

  // ESTRUTURAL
  {
    id: 'est_concepcao_estrutural',
    nome: 'Concepção Estrutural',
    categoria: 'estrutural',
    tempo_estimado_base: 21600, // 6 horas
    complexidade: 'media',
    requer_aprovacao: true,
    responsavel_sugerido: 'engenheiro',
    posicao_recomendada: 1,
    etapa_recomendada: 'concepcao',
    dependencias: ['arq_estudo_preliminar'],
    multiplicadores: {
      porte_pequeno: 0.8,
      porte_medio: 1.0,
      porte_grande: 1.4,
      complexidade_baixa: 0.7,
      complexidade_media: 1.0,
      complexidade_alta: 1.6
    },
    palavras_chave: ['estrutural', 'concepcao', 'sistema', 'cargas', 'fundacao'],
    descricao: 'Definição do sistema estrutural e pré-dimensionamento'
  },
  {
    id: 'est_calculo_estrutural',
    nome: 'Cálculo Estrutural',
    categoria: 'estrutural',
    tempo_estimado_base: 72000, // 20 horas
    complexidade: 'critica',
    requer_aprovacao: true,
    responsavel_sugerido: 'engenheiro',
    posicao_recomendada: 2,
    etapa_recomendada: 'desenvolvimento',
    dependencias: ['est_concepcao_estrutural', 'arq_anteprojeto'],
    multiplicadores: {
      porte_pequeno: 0.6,
      porte_medio: 1.0,
      porte_grande: 2.2,
      complexidade_baixa: 0.5,
      complexidade_media: 1.0,
      complexidade_alta: 2.0
    },
    palavras_chave: ['calculo', 'dimensionamento', 'verificacao', 'normas', 'software'],
    descricao: 'Cálculo completo da estrutura com dimensionamento de elementos'
  },

  // INSTALAÇÕES
  {
    id: 'inst_hidraulica_concepcao',
    nome: 'Concepção Hidráulica',
    categoria: 'instalacoes',
    tempo_estimado_base: 14400, // 4 horas
    complexidade: 'baixa',
    requer_aprovacao: false,
    responsavel_sugerido: 'tecnico',
    posicao_recomendada: 1,
    etapa_recomendada: 'concepcao',
    dependencias: ['arq_estudo_preliminar'],
    multiplicadores: {
      porte_pequeno: 0.8,
      porte_medio: 1.0,
      porte_grande: 1.3,
      complexidade_baixa: 0.8,
      complexidade_media: 1.0,
      complexidade_alta: 1.4
    },
    palavras_chave: ['hidraulica', 'agua', 'esgoto', 'concepcao', 'pontos'],
    descricao: 'Definição dos pontos hidráulicos e concepção do sistema'
  },
  {
    id: 'inst_eletrica_projeto',
    nome: 'Projeto Elétrico',
    categoria: 'instalacoes',
    tempo_estimado_base: 25200, // 7 horas
    complexidade: 'media',
    requer_aprovacao: true,
    responsavel_sugerido: 'tecnico',
    posicao_recomendada: 2,
    etapa_recomendada: 'desenvolvimento',
    dependencias: ['arq_anteprojeto'],
    multiplicadores: {
      porte_pequeno: 0.7,
      porte_medio: 1.0,
      porte_grande: 1.5,
      complexidade_baixa: 0.7,
      complexidade_media: 1.0,
      complexidade_alta: 1.6
    },
    palavras_chave: ['eletrica', 'iluminacao', 'tomadas', 'quadro', 'circuitos'],
    descricao: 'Projeto elétrico completo com dimensionamento de circuitos'
  },

  // APROVAÇÕES
  {
    id: 'apr_prefeitura',
    nome: 'Aprovação na Prefeitura',
    categoria: 'aprovacoes',
    tempo_estimado_base: 18000, // 5 horas (tempo de preparação)
    complexidade: 'media',
    requer_aprovacao: false,
    responsavel_sugerido: 'arquiteto',
    posicao_recomendada: 1,
    etapa_recomendada: 'aprovacoes',
    dependencias: ['arq_projeto_executivo'],
    multiplicadores: {
      porte_pequeno: 0.8,
      porte_medio: 1.0,
      porte_grande: 1.2,
      complexidade_baixa: 0.8,
      complexidade_media: 1.0,
      complexidade_alta: 1.3
    },
    palavras_chave: ['aprovacao', 'prefeitura', 'alvara', 'documentacao'],
    descricao: 'Preparação e protocolo da documentação para aprovação municipal'
  },

  // COMPATIBILIZAÇÃO
  {
    id: 'comp_arquitetura_estrutura',
    nome: 'Compatibilização ARQ x EST',
    categoria: 'compatibilizacao',
    tempo_estimado_base: 10800, // 3 horas
    complexidade: 'media',
    requer_aprovacao: true,
    responsavel_sugerido: 'arquiteto',
    posicao_recomendada: 1,
    etapa_recomendada: 'compatibilizacao',
    dependencias: ['arq_anteprojeto', 'est_calculo_estrutural'],
    multiplicadores: {
      porte_pequeno: 0.7,
      porte_medio: 1.0,
      porte_grande: 1.4,
      complexidade_baixa: 0.6,
      complexidade_media: 1.0,
      complexidade_alta: 1.8
    },
    palavras_chave: ['compatibilizacao', 'arquitetura', 'estrutura', 'interferencias'],
    descricao: 'Verificação e resolução de interferências entre arquitetura e estrutura'
  }
];

// ===== TEMPLATES COMPLETOS POR TIPOLOGIA =====
export const TEMPLATES_PROJETOS: TemplateInteligente[] = [
  {
    id: 'residencial_unifamiliar',
    nome: 'Residencial Unifamiliar',
    tipologia: 'residencial',
    porte: 'pequeno',
    complexidade: 'baixa',
    etapas_obrigatorias: ['concepcao', 'desenvolvimento', 'detalhamento', 'aprovacoes'],
    tarefas_criticas: ['arq_estudo_preliminar', 'arq_projeto_executivo', 'apr_prefeitura'],
    tempo_total_estimado: 180, // horas
    margem_seguranca: 20, // %
    tarefas_templates: [
      'arq_estudo_preliminar',
      'arq_anteprojeto',
      'arq_projeto_executivo',
      'est_concepcao_estrutural',
      'est_calculo_estrutural',
      'inst_hidraulica_concepcao',
      'inst_eletrica_projeto',
      'comp_arquitetura_estrutura',
      'apr_prefeitura'
    ]
  },
  {
    id: 'comercial_medio',
    nome: 'Edifício Comercial Médio Porte',
    tipologia: 'comercial',
    porte: 'medio',
    complexidade: 'media',
    etapas_obrigatorias: ['concepcao', 'desenvolvimento', 'detalhamento', 'compatibilizacao', 'aprovacoes'],
    tarefas_criticas: ['arq_projeto_executivo', 'est_calculo_estrutural', 'comp_arquitetura_estrutura'],
    tempo_total_estimado: 320, // horas
    margem_seguranca: 25, // %
    tarefas_templates: [
      'arq_estudo_preliminar',
      'arq_anteprojeto',
      'arq_projeto_executivo',
      'est_concepcao_estrutural',
      'est_calculo_estrutural',
      'inst_hidraulica_concepcao',
      'inst_eletrica_projeto',
      'comp_arquitetura_estrutura',
      'apr_prefeitura'
    ]
  },
  {
    id: 'industrial_grande',
    nome: 'Complexo Industrial',
    tipologia: 'industrial',
    porte: 'grande',
    complexidade: 'alta',
    etapas_obrigatorias: ['concepcao', 'desenvolvimento', 'detalhamento', 'compatibilizacao', 'aprovacoes', 'execucao'],
    tarefas_criticas: ['est_calculo_estrutural', 'comp_arquitetura_estrutura', 'apr_prefeitura'],
    tempo_total_estimado: 580, // horas
    margem_seguranca: 30, // %
    tarefas_templates: [
      'arq_estudo_preliminar',
      'arq_anteprojeto',
      'arq_projeto_executivo',
      'est_concepcao_estrutural',
      'est_calculo_estrutural',
      'inst_hidraulica_concepcao',
      'inst_eletrica_projeto',
      'comp_arquitetura_estrutura',
      'apr_prefeitura'
    ]
  }
];

// ===== SERVIÇO DE ANÁLISE INTELIGENTE =====
export class AnaliseInteligenteService {
  
  static analisarTarefaInteligente(nomeTarefa: string, etapaId: string): AnaliseInteligente {
    const nomeLimpo = nomeTarefa.toLowerCase().trim();
    
    // Encontrar templates similares
    const templatesSimilares = TEMPLATES_TAREFAS
      .map(template => ({
        template,
        similaridade: this.calcularSimilaridade(nomeLimpo, template)
      }))
      .filter(item => item.similaridade > 0.3)
      .sort((a, b) => b.similaridade - a.similaridade);
    
    if (templatesSimilares.length === 0) {
      // Análise genérica
      return {
        tempo_estimado: 14400, // 4 horas padrão
        posicao_recomendada: 1,
        etapa_recomendada: etapaId,
        responsavel_sugerido: 'Não definido',
        requer_aprovacao: false,
        justificativa: 'Análise baseada em padrões gerais - nenhum template específico encontrado',
        confianca: 30,
        alternativas: []
      };
    }
    
    const melhorMatch = templatesSimilares[0];
    const template = melhorMatch.template;
    
    // Calcular tempo estimado baseado na complexidade detectada
    const complexidadeDetectada = this.detectarComplexidade(nomeLimpo);
    const porteDetectado = this.detectarPorte(nomeLimpo);
    
    let tempoEstimado = template.tempo_estimado_base;
    
    // Aplicar multiplicadores
    if (porteDetectado === 'pequeno') tempoEstimado *= template.multiplicadores.porte_pequeno;
    else if (porteDetectado === 'grande') tempoEstimado *= template.multiplicadores.porte_grande;
    
    if (complexidadeDetectada === 'baixa') tempoEstimado *= template.multiplicadores.complexidade_baixa;
    else if (complexidadeDetectada === 'alta') tempoEstimado *= template.multiplicadores.complexidade_alta;
    
    return {
      tarefa_sugerida: template,
      tempo_estimado: Math.round(tempoEstimado),
      posicao_recomendada: template.posicao_recomendada,
      etapa_recomendada: template.etapa_recomendada,
      responsavel_sugerido: this.traduzirResponsavel(template.responsavel_sugerido),
      requer_aprovacao: template.requer_aprovacao,
      justificativa: `Baseado no template "${template.nome}" com ${Math.round(melhorMatch.similaridade * 100)}% de similaridade`,
      confianca: Math.round(melhorMatch.similaridade * 100),
      alternativas: templatesSimilares.slice(1, 4).map(item => item.template)
    };
  }
  
  private static calcularSimilaridade(nomeTarefa: string, template: TarefaTemplate): number {
    let pontuacao = 0;
    let totalPalavras = template.palavras_chave.length;
    
    // Verificar palavras-chave
    for (const palavra of template.palavras_chave) {
      if (nomeTarefa.includes(palavra.toLowerCase())) {
        pontuacao += 1;
      }
    }
    
    // Verificar nome do template
    const nomeTemplate = template.nome.toLowerCase();
    const palavrasNome = nomeTemplate.split(' ');
    
    for (const palavra of palavrasNome) {
      if (nomeTarefa.includes(palavra) && palavra.length > 2) {
        pontuacao += 0.5;
        totalPalavras += 0.5;
      }
    }
    
    // Verificar categoria
    if (nomeTarefa.includes(template.categoria)) {
      pontuacao += 0.3;
      totalPalavras += 0.3;
    }
    
    return totalPalavras > 0 ? pontuacao / totalPalavras : 0;
  }
  
  private static detectarComplexidade(nomeTarefa: string): 'baixa' | 'media' | 'alta' {
    const indicadoresAlta = ['executivo', 'detalhado', 'completo', 'complexo', 'avançado'];
    const indicadoresBaixa = ['preliminar', 'conceito', 'basico', 'simples', 'inicial'];
    
    for (const indicador of indicadoresAlta) {
      if (nomeTarefa.includes(indicador)) return 'alta';
    }
    
    for (const indicador of indicadoresBaixa) {
      if (nomeTarefa.includes(indicador)) return 'baixa';
    }
    
    return 'media';
  }
  
  private static detectarPorte(nomeTarefa: string): 'pequeno' | 'medio' | 'grande' {
    const indicadoresGrande = ['grande', 'complexo', 'industrial', 'shopping', 'hospital'];
    const indicadoresPequeno = ['pequeno', 'simples', 'residencial', 'casa', 'apartamento'];
    
    for (const indicador of indicadoresGrande) {
      if (nomeTarefa.includes(indicador)) return 'grande';
    }
    
    for (const indicador of indicadoresPequeno) {
      if (nomeTarefa.includes(indicador)) return 'pequeno';
    }
    
    return 'medio';
  }
  
  private static traduzirResponsavel(responsavel: string): string {
    const traducoes = {
      'arquiteto': 'Arquiteto',
      'engenheiro': 'Engenheiro',
      'tecnico': 'Técnico',
      'designer': 'Designer',
      'gerente': 'Gerente de Projeto'
    };
    
    return traducoes[responsavel as keyof typeof traducoes] || 'Não definido';
  }
  
  static obterTemplatePorTipologia(tipologia: string, porte: string, complexidade: string): TemplateInteligente | null {
    return TEMPLATES_PROJETOS.find(template => 
      template.tipologia === tipologia &&
      template.porte === porte &&
      template.complexidade === complexidade
    ) || null;
  }
  
  static sugerirEstruturaProjeto(tipologia: string, porte: string, complexidade: string): TemplateInteligente | null {
    // Buscar template exato
    let template = this.obterTemplatePorTipologia(tipologia, porte, complexidade);
    
    // Se não encontrar, buscar similar
    if (!template) {
      template = TEMPLATES_PROJETOS.find(t => t.tipologia === tipologia) ||
                 TEMPLATES_PROJETOS.find(t => t.porte === porte) ||
                 TEMPLATES_PROJETOS[0]; // Fallback para o primeiro
    }
    
    return template;
  }
} 