// @ts-nocheck
// 🚀 ARCFLOW - SISTEMA DE TEMPLATES DE PROJETOS INTELIGENTES
// Sistema revolucionário que gera projetos automaticamente baseado no briefing

// 🎯 SERVIÇO DE TEMPLATES DE PROJETO
// Gera etapas e tarefas automaticamente baseado no briefing preenchido

interface BriefingAnalysisResult {
  tipologia: string;
  subtipo: string;
  area: number;
  padrao: 'SIMPLES' | 'MEDIO' | 'ALTO_PADRAO' | 'PREMIUM';
  disciplinas: string[];
  complexidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';
  prazoEstimado: number;
  valorEstimado: number;
}

interface TarefaTemplate {
  id: string;
  nome: string;
  descricao: string;
  disciplina: string;
  estimativaHoras: number;
  prioridade: 'BAIXA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  dependeDe: string[];
  obrigatoria: boolean;
  condicoes?: string[];
}

interface EtapaTemplate {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  disciplinas: string[];
  prazoEstimado: number;
  tarefas: TarefaTemplate[];
  obrigatoria: boolean;
  dependeDe: string[];
  condicoes?: string[];
}

interface TemplateProjetoCompleto {
  id: string;
  nome: string;
  tipologia: string;
  subtipo: string;
  padrao: string;
  etapas: EtapaTemplate[];
  prazoTotal: number;
  valorEstimado: number;
  disciplinasEnvolvidas: string[];
  observacoes: string[];
}

// 📋 TEMPLATES DE PROJETOS POR TIPOLOGIA
const TEMPLATES_RESIDENCIAL = {
  CASA_SIMPLES: {
    id: 'RES_CASA_SIMPLES',
    nome: 'Casa Unifamiliar - Padrão Simples',
    tipologia: 'RESIDENCIAL',
    subtipo: 'CASA_UNIFAMILIAR',
    padrao: 'SIMPLES',
    etapas: [
      {
        id: 'lv',
        nome: 'Levantamento de Dados',
        descricao: 'Coleta de informações e briefing detalhado',
        ordem: 1,
        disciplinas: ['ARQ'],
        prazoEstimado: 10,
        obrigatoria: true,
        dependeDe: [],
        tarefas: [
          {
            id: 'lv-01',
            nome: 'Briefing Detalhado com Cliente',
            descricao: 'Reunião para entender necessidades, estilo de vida e expectativas',
            disciplina: 'ARQ',
            estimativaHoras: 8,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'lv-02',
            nome: 'Levantamento Topográfico',
            descricao: 'Medição e análise das condições do terreno',
            disciplina: 'ARQ',
            estimativaHoras: 12,
            prioridade: 'ALTA',
            dependeDe: ['lv-01'],
            obrigatoria: true
          },
          {
            id: 'lv-03',
            nome: 'Análise Legal e Urbanística',
            descricao: 'Verificação de restrições e regulamentações municipais',
            disciplina: 'ARQ',
            estimativaHoras: 6,
            prioridade: 'ALTA',
            dependeDe: ['lv-02'],
            obrigatoria: true
          },
          {
            id: 'lv-04',
            nome: 'Estudo de Viabilidade',
            descricao: 'Análise de viabilidade técnica e econômica do projeto',
            disciplina: 'ARQ',
            estimativaHoras: 4,
            prioridade: 'ALTA',
            dependeDe: ['lv-03'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'ep',
        nome: 'Estudo Preliminar',
        descricao: 'Primeira proposta arquitetônica e conceitual',
        ordem: 2,
        disciplinas: ['ARQ'],
        prazoEstimado: 15,
        obrigatoria: true,
        dependeDe: ['lv'],
        tarefas: [
          {
            id: 'ep-01',
            nome: 'Estudo de Massas e Implantação',
            descricao: 'Definição da volumetria e posicionamento no terreno',
            disciplina: 'ARQ',
            estimativaHoras: 16,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'ep-02',
            nome: 'Plantas Conceituais',
            descricao: 'Desenho das plantas baixas preliminares',
            disciplina: 'ARQ',
            estimativaHoras: 20,
            prioridade: 'CRITICA',
            dependeDe: ['ep-01'],
            obrigatoria: true
          },
          {
            id: 'ep-03',
            nome: 'Fachadas Conceituais',
            descricao: 'Estudo das elevações principais',
            disciplina: 'ARQ',
            estimativaHoras: 12,
            prioridade: 'ALTA',
            dependeDe: ['ep-02'],
            obrigatoria: true
          },
          {
            id: 'ep-04',
            nome: 'Apresentação ao Cliente',
            descricao: 'Apresentação da proposta preliminar para aprovação',
            disciplina: 'ARQ',
            estimativaHoras: 4,
            prioridade: 'CRITICA',
            dependeDe: ['ep-03'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'ap',
        nome: 'Anteprojeto',
        descricao: 'Desenvolvimento da proposta com detalhamentos básicos',
        ordem: 3,
        disciplinas: ['ARQ', 'EST'],
        prazoEstimado: 25,
        obrigatoria: true,
        dependeDe: ['ep'],
        tarefas: [
          {
            id: 'ap-01',
            nome: 'Plantas Detalhadas',
            descricao: 'Desenvolvimento completo das plantas baixas',
            disciplina: 'ARQ',
            estimativaHoras: 32,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'ap-02',
            nome: 'Cortes e Fachadas',
            descricao: 'Desenhos técnicos de cortes e elevações',
            disciplina: 'ARQ',
            estimativaHoras: 24,
            prioridade: 'ALTA',
            dependeDe: ['ap-01'],
            obrigatoria: true
          },
          {
            id: 'ap-03',
            nome: 'Estrutura Preliminar',
            descricao: 'Dimensionamento estrutural básico',
            disciplina: 'EST',
            estimativaHoras: 20,
            prioridade: 'ALTA',
            dependeDe: ['ap-01'],
            obrigatoria: true
          },
          {
            id: 'ap-04',
            nome: 'Especificações Básicas',
            descricao: 'Definição de materiais e acabamentos principais',
            disciplina: 'ARQ',
            estimativaHoras: 8,
            prioridade: 'NORMAL',
            dependeDe: ['ap-02'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'pe',
        nome: 'Projeto Executivo',
        descricao: 'Projeto completo para execução da obra',
        ordem: 4,
        disciplinas: ['ARQ', 'EST', 'ELE', 'HID'],
        prazoEstimado: 45,
        obrigatoria: true,
        dependeDe: ['ap'],
        tarefas: [
          {
            id: 'pe-01',
            nome: 'Detalhamento Arquitetônico',
            descricao: 'Plantas, cortes e detalhes executivos completos',
            disciplina: 'ARQ',
            estimativaHoras: 60,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'pe-02',
            nome: 'Projeto Estrutural',
            descricao: 'Cálculo e detalhamento da estrutura',
            disciplina: 'EST',
            estimativaHoras: 40,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'pe-03',
            nome: 'Projeto Elétrico',
            descricao: 'Sistema elétrico completo',
            disciplina: 'ELE',
            estimativaHoras: 32,
            prioridade: 'ALTA',
            dependeDe: ['pe-01'],
            obrigatoria: true
          },
          {
            id: 'pe-04',
            nome: 'Projeto Hidrossanitário',
            descricao: 'Instalações hidráulicas e sanitárias',
            disciplina: 'HID',
            estimativaHoras: 28,
            prioridade: 'ALTA',
            dependeDe: ['pe-01'],
            obrigatoria: true
          },
          {
            id: 'pe-05',
            nome: 'Compatibilização Final',
            descricao: 'Revisão e compatibilização de todos os projetos',
            disciplina: 'ARQ',
            estimativaHoras: 16,
            prioridade: 'CRITICA',
            dependeDe: ['pe-01', 'pe-02', 'pe-03', 'pe-04'],
            obrigatoria: true
          }
        ]
      }
    ],
    prazoTotal: 95,
    valorEstimado: 25000,
    disciplinasEnvolvidas: ['ARQ', 'EST', 'ELE', 'HID'],
    observacoes: [
      'Template otimizado para casas de 80-200m²',
      'Estrutura convencional em concreto armado',
      'Instalações básicas residenciais',
      'Aprovação municipal simplificada'
    ]
  },

  CASA_ALTO_PADRAO: {
    id: 'RES_CASA_ALTO_PADRAO',
    nome: 'Casa Unifamiliar - Alto Padrão',
    tipologia: 'RESIDENCIAL',
    subtipo: 'CASA_UNIFAMILIAR',
    padrao: 'ALTO_PADRAO',
    etapas: [
      {
        id: 'lv',
        nome: 'Levantamento de Dados',
        descricao: 'Coleta de informações e briefing detalhado',
        ordem: 1,
        disciplinas: ['ARQ'],
        prazoEstimado: 15,
        obrigatoria: true,
        dependeDe: [],
        tarefas: [
          {
            id: 'lv-01',
            nome: 'Briefing Completo com Cliente',
            descricao: 'Reunião detalhada para entender lifestyle e necessidades específicas',
            disciplina: 'ARQ',
            estimativaHoras: 12,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'lv-02',
            nome: 'Levantamento Topográfico Detalhado',
            descricao: 'Levantamento planialtimétrico completo com sondagem',
            disciplina: 'ARQ',
            estimativaHoras: 16,
            prioridade: 'CRITICA',
            dependeDe: ['lv-01'],
            obrigatoria: true
          },
          {
            id: 'lv-03',
            nome: 'Análise Legal Completa',
            descricao: 'Verificação de todas as restrições legais e urbanísticas',
            disciplina: 'ARQ',
            estimativaHoras: 10,
            prioridade: 'ALTA',
            dependeDe: ['lv-02'],
            obrigatoria: true
          },
          {
            id: 'lv-04',
            nome: 'Estudo de Insolação e Ventilação',
            descricao: 'Análise bioclimática do terreno',
            disciplina: 'ARQ',
            estimativaHoras: 8,
            prioridade: 'ALTA',
            dependeDe: ['lv-02'],
            obrigatoria: true
          },
          {
            id: 'lv-05',
            nome: 'Análise de Vizinhança',
            descricao: 'Estudo do entorno e impacto na concepção',
            disciplina: 'ARQ',
            estimativaHoras: 6,
            prioridade: 'NORMAL',
            dependeDe: ['lv-03'],
            obrigatoria: true
          }
        ]
      },
      // Adicionar mais etapas para alto padrão...
    ],
    prazoTotal: 150,
    valorEstimado: 80000,
    disciplinasEnvolvidas: ['ARQ', 'EST', 'ELE', 'HID', 'AVAC', 'PCI', 'PAISAG', 'AUTOM'],
    observacoes: [
      'Template para casas acima de 300m²',
      'Inclui sistemas especiais (automação, AVAC, etc.)',
      'Paisagismo e projeto de interiores integrados',
      'Aprovações múltiplas necessárias'
    ]
  }
};

const TEMPLATES_COMERCIAL = {
  ESCRITORIO_SIMPLES: {
    id: 'COM_ESCRITORIO_SIMPLES',
    nome: 'Escritório Comercial - Padrão Simples',
    tipologia: 'COMERCIAL',
    subtipo: 'ESCRITORIO',
    padrao: 'SIMPLES',
    etapas: [
      {
        id: 'lv',
        nome: 'Levantamento de Dados',
        descricao: 'Análise do negócio e necessidades espaciais',
        ordem: 1,
        disciplinas: ['ARQ'],
        prazoEstimado: 8,
        obrigatoria: true,
        dependeDe: [],
        tarefas: [
          {
            id: 'lv-01',
            nome: 'Briefing Empresarial',
            descricao: 'Entendimento do negócio, cultura e necessidades',
            disciplina: 'ARQ',
            estimativaHoras: 6,
            prioridade: 'CRITICA',
            dependeDe: [],
            obrigatoria: true
          },
          {
            id: 'lv-02',
            nome: 'Análise de Fluxo de Trabalho',
            descricao: 'Estudo dos processos e fluxos internos',
            disciplina: 'ARQ',
            estimativaHoras: 8,
            prioridade: 'ALTA',
            dependeDe: ['lv-01'],
            obrigatoria: true
          },
          {
            id: 'lv-03',
            nome: 'Levantamento do Espaço Existente',
            descricao: 'Medição e análise das condições atuais',
            disciplina: 'ARQ',
            estimativaHoras: 4,
            prioridade: 'ALTA',
            dependeDe: ['lv-01'],
            obrigatoria: true
          }
        ]
      }
      // Adicionar mais etapas...
    ],
    prazoTotal: 60,
    valorEstimado: 15000,
    disciplinasEnvolvidas: ['ARQ', 'ELE', 'AVAC'],
    observacoes: [
      'Template para escritórios até 200m²',
      'Foco em produtividade e bem-estar',
      'Normas de acessibilidade aplicadas'
    ]
  }
};

export class TemplateProjetoService {
  
  // 🎯 MÉTODO PRINCIPAL: GERAR PROJETO BASEADO NO BRIEFING
  static gerarProjetoFromBriefing(briefingData: any): TemplateProjetoCompleto {
    // 1. Analisar o briefing
    const analysis = this.analisarBriefing(briefingData);
    
    // 2. Selecionar template apropriado
    const template = this.selecionarTemplate(analysis);
    
    // 3. Personalizar template baseado no briefing
    const projetoPersonalizado = this.personalizarTemplate(template, briefingData, analysis);
    
    return projetoPersonalizado;
  }

  // 🔍 ANALISAR BRIEFING PARA EXTRAIR INFORMAÇÕES CHAVE
  private static analisarBriefing(briefingData: any): BriefingAnalysisResult {
    // Extrair informações do briefing preenchido
    const tipologia = this.extrairTipologia(briefingData);
    const subtipo = this.extrairSubtipo(briefingData);
    const area = this.extrairArea(briefingData);
    const padrao = this.extrairPadrao(briefingData);
    const disciplinas = this.extrairDisciplinas(briefingData);
    const complexidade = this.calcularComplexidade(briefingData);
    
    return {
      tipologia,
      subtipo,
      area,
      padrao,
      disciplinas,
      complexidade,
      prazoEstimado: this.calcularPrazoEstimado(complexidade, disciplinas),
      valorEstimado: this.calcularValorEstimado(area, padrao, disciplinas)
    };
  }

  // 📋 SELECIONAR TEMPLATE APROPRIADO
  private static selecionarTemplate(analysis: BriefingAnalysisResult): TemplateProjetoCompleto {
    const templateKey = `${analysis.subtipo}_${analysis.padrao}`;
    
    if (analysis.tipologia === 'RESIDENCIAL') {
      return TEMPLATES_RESIDENCIAL[templateKey as keyof typeof TEMPLATES_RESIDENCIAL] || TEMPLATES_RESIDENCIAL.CASA_SIMPLES as TemplateProjetoCompleto;
    }
    
    if (analysis.tipologia === 'COMERCIAL') {
      return TEMPLATES_COMERCIAL[templateKey as keyof typeof TEMPLATES_COMERCIAL] || TEMPLATES_COMERCIAL.ESCRITORIO_SIMPLES as TemplateProjetoCompleto;
    }
    
    // Fallback para template básico
    return TEMPLATES_RESIDENCIAL.CASA_SIMPLES as TemplateProjetoCompleto;
  }

  // ⚙️ PERSONALIZAR TEMPLATE BASEADO NO BRIEFING
  private static personalizarTemplate(
    template: TemplateProjetoCompleto, 
    briefingData: any, 
    analysis: BriefingAnalysisResult
  ): TemplateProjetoCompleto {
    
    const templatePersonalizado = JSON.parse(JSON.stringify(template)); // Deep clone
    
    // 1. Ajustar disciplinas baseado no briefing
    templatePersonalizado.disciplinasEnvolvidas = analysis.disciplinas;
    
    // 2. Adicionar/remover etapas baseado nas necessidades
    templatePersonalizado.etapas = this.ajustarEtapas(template.etapas, briefingData, analysis);
    
    // 3. Personalizar tarefas baseado nas respostas
    templatePersonalizado.etapas.forEach(etapa => {
      etapa.tarefas = this.personalizarTarefas(etapa.tarefas, briefingData, analysis);
    });
    
    // 4. Recalcular prazos e valores
    templatePersonalizado.prazoTotal = this.calcularPrazoTotal(templatePersonalizado.etapas);
    templatePersonalizado.valorEstimado = analysis.valorEstimado;
    
    return templatePersonalizado;
  }

  // 🔧 MÉTODOS AUXILIARES DE EXTRAÇÃO
  private static extrairTipologia(briefingData: any): string {
    // Lógica para extrair tipologia do briefing
    if (briefingData.area === 'RESIDENCIAL') return 'RESIDENCIAL';
    if (briefingData.area === 'COMERCIAL') return 'COMERCIAL';
    if (briefingData.area === 'INDUSTRIAL') return 'INDUSTRIAL';
    return 'RESIDENCIAL'; // default
  }

  private static extrairSubtipo(briefingData: any): string {
    // Lógica para extrair subtipo
    if (briefingData.tipologia === 'CASA_UNIFAMILIAR') return 'CASA_UNIFAMILIAR';
    if (briefingData.tipologia === 'APARTAMENTO') return 'APARTAMENTO';
    if (briefingData.tipologia === 'ESCRITORIO') return 'ESCRITORIO';
    return 'CASA_UNIFAMILIAR'; // default
  }

  private static extrairArea(briefingData: any): number {
    // Extrair área do briefing
    const areaResposta = briefingData.respostas?.find((r: any) => 
      r.perguntaId?.includes('AREA') || r.perguntaId?.includes('area')
    );
    return areaResposta?.valor || 150; // default
  }

  private static extrairPadrao(briefingData: any): 'SIMPLES' | 'MEDIO' | 'ALTO_PADRAO' | 'PREMIUM' {
    // Lógica para determinar padrão baseado no orçamento e respostas
    const orcamentoResposta = briefingData.respostas?.find((r: any) => 
      r.perguntaId?.includes('ORCAMENTO') || r.perguntaId?.includes('orcamento')
    );
    
    const orcamento = orcamentoResposta?.valor || 0;
    
    if (orcamento < 500000) return 'SIMPLES';
    if (orcamento < 1000000) return 'MEDIO';
    if (orcamento < 2000000) return 'ALTO_PADRAO';
    return 'PREMIUM';
  }

  private static extrairDisciplinas(briefingData: any): string[] {
    const disciplinas = ['ARQ']; // Sempre inclui arquitetura
    
    // Lógica para adicionar disciplinas baseado nas respostas
    const respostas = briefingData.respostas || [];
    
    // Verificar necessidade de estrutura
    if (respostas.some((r: any) => r.valor === true && r.perguntaId?.includes('estrutura'))) {
      disciplinas.push('EST');
    }
    
    // Verificar necessidade de elétrica
    if (respostas.some((r: any) => r.valor === true && r.perguntaId?.includes('eletrica'))) {
      disciplinas.push('ELE');
    }
    
    // Verificar necessidade de hidráulica
    if (respostas.some((r: any) => r.valor === true && r.perguntaId?.includes('hidraulica'))) {
      disciplinas.push('HID');
    }
    
    // Verificar necessidade de AVAC
    if (respostas.some((r: any) => r.valor === true && r.perguntaId?.includes('climatizacao'))) {
      disciplinas.push('AVAC');
    }
    
    return disciplinas;
  }

  private static calcularComplexidade(briefingData: any): 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA' {
    // Lógica para calcular complexidade baseado em múltiplos fatores
    let pontuacao = 0;
    
    const respostas = briefingData.respostas || [];
    
    // Fatores que aumentam complexidade
    if (respostas.length > 100) pontuacao += 2;
    if (respostas.some((r: any) => r.perguntaId?.includes('automacao'))) pontuacao += 3;
    if (respostas.some((r: any) => r.perguntaId?.includes('piscina'))) pontuacao += 2;
    if (respostas.some((r: any) => r.perguntaId?.includes('sustentabilidade'))) pontuacao += 2;
    
    if (pontuacao <= 2) return 'BAIXA';
    if (pontuacao <= 5) return 'MEDIA';
    if (pontuacao <= 8) return 'ALTA';
    return 'MUITO_ALTA';
  }

  private static calcularPrazoEstimado(complexidade: string, disciplinas: string[]): number {
    let prazoBase = 60; // dias
    
    // Ajustar baseado na complexidade
    switch (complexidade) {
      case 'BAIXA': prazoBase = 45; break;
      case 'MEDIA': prazoBase = 75; break;
      case 'ALTA': prazoBase = 120; break;
      case 'MUITO_ALTA': prazoBase = 180; break;
    }
    
    // Adicionar tempo por disciplina extra
    prazoBase += (disciplinas.length - 1) * 15;
    
    return prazoBase;
  }

  private static calcularValorEstimado(area: number, padrao: string, disciplinas: string[]): number {
    let valorPorM2 = 150; // valor base por m²
    
    // Ajustar baseado no padrão
    switch (padrao) {
      case 'SIMPLES': valorPorM2 = 120; break;
      case 'MEDIO': valorPorM2 = 200; break;
      case 'ALTO_PADRAO': valorPorM2 = 350; break;
      case 'PREMIUM': valorPorM2 = 500; break;
    }
    
    // Adicionar valor por disciplina
    const valorDisciplinas = disciplinas.length * 2000;
    
    return (area * valorPorM2) + valorDisciplinas;
  }

  private static ajustarEtapas(etapas: EtapaTemplate[], briefingData: any, analysis: BriefingAnalysisResult): EtapaTemplate[] {
    // Lógica para adicionar/remover etapas baseado no briefing
    let etapasAjustadas = [...etapas];
    
    // Adicionar etapa de paisagismo se necessário
    if (briefingData.respostas?.some((r: any) => r.perguntaId?.includes('paisagismo') && r.valor === true)) {
      etapasAjustadas.push({
        id: 'paisag',
        nome: 'Projeto Paisagístico',
        descricao: 'Projeto de paisagismo e jardins',
        ordem: etapas.length + 1,
        disciplinas: ['PAISAG'],
        prazoEstimado: 20,
        obrigatoria: false,
        dependeDe: ['pe'],
        tarefas: [
          {
            id: 'paisag-01',
            nome: 'Projeto de Paisagismo',
            descricao: 'Desenvolvimento do projeto paisagístico',
            disciplina: 'PAISAG',
            estimativaHoras: 24,
            prioridade: 'NORMAL',
            dependeDe: [],
            obrigatoria: true
          }
        ]
      });
    }
    
    return etapasAjustadas;
  }

  private static personalizarTarefas(tarefas: TarefaTemplate[], briefingData: any, analysis: BriefingAnalysisResult): TarefaTemplate[] {
    // Lógica para personalizar tarefas baseado nas respostas
    return tarefas.map(tarefa => {
      // Ajustar estimativa de horas baseado na complexidade
      let multiplicador = 1;
      
      switch (analysis.complexidade) {
        case 'BAIXA': multiplicador = 0.8; break;
        case 'MEDIA': multiplicador = 1.0; break;
        case 'ALTA': multiplicador = 1.3; break;
        case 'MUITO_ALTA': multiplicador = 1.6; break;
      }
      
      return {
        ...tarefa,
        estimativaHoras: Math.round(tarefa.estimativaHoras * multiplicador)
      };
    });
  }

  private static calcularPrazoTotal(etapas: EtapaTemplate[]): number {
    return etapas.reduce((total, etapa) => total + etapa.prazoEstimado, 0);
  }

  // 🎯 MÉTODO PARA OBTER TEMPLATES DISPONÍVEIS
  static obterTemplatesDisponiveis() {
    return {
      RESIDENCIAL: Object.keys(TEMPLATES_RESIDENCIAL).map(key => ({
        id: key,
        nome: TEMPLATES_RESIDENCIAL[key as keyof typeof TEMPLATES_RESIDENCIAL].nome,
        prazo: TEMPLATES_RESIDENCIAL[key as keyof typeof TEMPLATES_RESIDENCIAL].prazoTotal,
        valor: TEMPLATES_RESIDENCIAL[key as keyof typeof TEMPLATES_RESIDENCIAL].valorEstimado
      })),
      COMERCIAL: Object.keys(TEMPLATES_COMERCIAL).map(key => ({
        id: key,
        nome: TEMPLATES_COMERCIAL[key as keyof typeof TEMPLATES_COMERCIAL].nome,
        prazo: TEMPLATES_COMERCIAL[key as keyof typeof TEMPLATES_COMERCIAL].prazoTotal,
        valor: TEMPLATES_COMERCIAL[key as keyof typeof TEMPLATES_COMERCIAL].valorEstimado
      }))
    };
  }
}

export type { TemplateProjetoCompleto, EtapaTemplate, TarefaTemplate, BriefingAnalysisResult }; 