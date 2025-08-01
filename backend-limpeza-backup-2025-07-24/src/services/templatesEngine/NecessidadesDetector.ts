// NecessidadesDetector.ts - Motor de IA para detectar templates necessários

import { logger } from '../../config/logger';
import { CacheService } from '../../config/redis';

export interface TemplateNecessario {
  templateId: string;
  categoria: string;
  prioridade: number;
  score: number; // Confiança da detecção (0-1)
  motivo: string;
  dependencias?: string[];
  configuracao?: any;
}

export interface AnaliseNecessidades {
  templatesPrincipais: TemplateNecessario[];
  templatesComplementares: TemplateNecessario[];
  templatesOpcionais: TemplateNecessario[];
  scoreGeral: number;
  resumo: string;
  complexidade: 'baixa' | 'media' | 'alta' | 'critica';
  tempoEstimado: number; // em minutos
  totalTarefas: number;
}

/**
 * Detector de Necessidades - Motor de IA para Templates Dinâmicos
 * 
 * Analisa dados de briefing e detecta automaticamente quais templates
 * de projeto são necessários, aplicando regras inteligentes baseadas
 * no conteúdo do briefing.
 */
export class NecessidadesDetector {
  
  /**
   * Detecta necessidades de templates com base no briefing
   */
  async detectarNecessidades(briefingData: any): Promise<AnaliseNecessidades> {
    try {
      logger.info('🔍 Iniciando detecção de necessidades', { 
        briefingId: briefingData.id,
        tipologia: briefingData.tipologia 
      });

      // Cache key para evitar reprocessamento
      const cacheKey = `necessidades:${this.gerarHashBriefing(briefingData)}`;
      
      // Verificar cache primeiro
      const cached = await CacheService.get<AnaliseNecessidades>(cacheKey);
      if (cached) {
        logger.info('✅ Necessidades encontradas no cache');
        return cached;
      }

      // Análise principal
      const analise = await this.analisarBriefing(briefingData);
      
      // Salvar no cache por 30 minutos
      await CacheService.set(cacheKey, analise, 1800);
      
      logger.info('✅ Detecção de necessidades concluída', {
        templatesPrincipais: analise.templatesPrincipais.length,
        templatesComplementares: analise.templatesComplementares.length,
        scoreGeral: analise.scoreGeral,
        complexidade: analise.complexidade
      });

      return analise;

    } catch (error: any) {
      logger.error('❌ Erro na detecção de necessidades', { 
        error: error.message,
        briefingData 
      });
      throw new Error(`Falha na detecção de necessidades: ${error.message}`);
    }
  }

  /**
   * Análise principal do briefing
   */
  private async analisarBriefing(briefingData: any): Promise<AnaliseNecessidades> {
    const templatesPrincipais: TemplateNecessario[] = [];
    const templatesComplementares: TemplateNecessario[] = [];
    const templatesOpcionais: TemplateNecessario[] = [];

    // 1. DETECTAR TEMPLATE PRINCIPAL (obrigatório)
    const templatePrincipal = await this.detectarTemplatePrincipal(briefingData);
    if (templatePrincipal) {
      templatesPrincipais.push(templatePrincipal);
    }

    // 2. DETECTAR TEMPLATES COMPLEMENTARES (arquitetura, estrutura, instalações)
    const complementares = await this.detectarTemplatesComplementares(briefingData);
    templatesComplementares.push(...complementares);

    // 3. DETECTAR TEMPLATES OPCIONAIS (paisagismo, interiores, etc.)
    const opcionais = await this.detectarTemplatesOpcionais(briefingData);
    templatesOpcionais.push(...opcionais);

    // 4. CALCULAR MÉTRICAS GERAIS
    const allTemplates = [...templatesPrincipais, ...templatesComplementares, ...templatesOpcionais];
    const scoreGeral = this.calcularScoreGeral(allTemplates);
    const complexidade = this.determinarComplexidade(allTemplates);
    const tempoEstimado = this.calcularTempoEstimado(allTemplates);
    const totalTarefas = this.calcularTotalTarefas(allTemplates);

    return {
      templatesPrincipais,
      templatesComplementares,
      templatesOpcionais,
      scoreGeral,
      resumo: this.gerarResumo(allTemplates, complexidade),
      complexidade,
      tempoEstimado,
      totalTarefas
    };
  }

  /**
   * Detecta o template principal baseado na tipologia
   */
  private async detectarTemplatePrincipal(briefingData: any): Promise<TemplateNecessario | null> {
    const tipologia = briefingData.tipologia?.toLowerCase();
    
    // Mapeamento tipologia → template principal
    const mapeamento: Record<string, any> = {
      'residencial': {
        templateId: 'residencial-unifamiliar-completo',
        categoria: 'arquitetura',
        prioridade: 1,
        score: 1.0,
        motivo: 'Template principal para projetos residenciais'
      },
      'comercial': {
        templateId: 'comercial-escritorios-completo',
        categoria: 'arquitetura', 
        prioridade: 1,
        score: 1.0,
        motivo: 'Template principal para projetos comerciais'
      },
      'industrial': {
        templateId: 'industrial-galpao-completo',
        categoria: 'arquitetura',
        prioridade: 1, 
        score: 1.0,
        motivo: 'Template principal para projetos industriais'
      }
    };

    return mapeamento[tipologia] || null;
  }

  /**
   * Detecta templates complementares obrigatórios
   */
  private async detectarTemplatesComplementares(briefingData: any): Promise<TemplateNecessario[]> {
    const templates: TemplateNecessario[] = [];

    // ESTRUTURAL - sempre necessário
    templates.push({
      templateId: 'estrutural-adaptativo-completo',
      categoria: 'estrutural',
      prioridade: 2,
      score: 1.0,
      motivo: 'Projeto estrutural sempre necessário',
      dependencias: ['arquitetura']
    });

    // INSTALAÇÕES - sempre necessário
    templates.push({
      templateId: 'instalacoes-adaptativo-completo', 
      categoria: 'instalacoes',
      prioridade: 3,
      score: 1.0,
      motivo: 'Instalações elétricas e hidráulicas sempre necessárias',
      dependencias: ['arquitetura', 'estrutural']
    });

    return templates;
  }

  /**
   * Detecta templates opcionais baseados no briefing
   */
  private async detectarTemplatesOpcionais(briefingData: any): Promise<TemplateNecessario[]> {
    const templates: TemplateNecessario[] = [];

    // PAISAGISMO - se mencionado no briefing
    if (this.mencionaPaisagismo(briefingData)) {
      templates.push({
        templateId: 'paisagismo-completo',
        categoria: 'paisagismo',
        prioridade: 4,
        score: 0.8,
        motivo: 'Paisagismo mencionado no briefing'
      });
    }

    // DESIGN DE INTERIORES - se mencionado
    if (this.mencionaDesignInteriores(briefingData)) {
      templates.push({
        templateId: 'design-interiores-completo',
        categoria: 'interiores', 
        prioridade: 5,
        score: 0.7,
        motivo: 'Design de interiores mencionado no briefing'
      });
    }

    return templates;
  }

  /**
   * Verifica se briefing menciona paisagismo
   */
  private mencionaPaisagismo(briefingData: any): boolean {
    const texto = JSON.stringify(briefingData).toLowerCase();
    const palavrasChave = [
      'paisagismo', 'jardim', 'quintal', 'área verde', 
      'piscina', 'pergolado', 'deck', 'plantas'
    ];
    
    return palavrasChave.some(palavra => texto.includes(palavra));
  }

  /**
   * Verifica se briefing menciona design de interiores
   */
  private mencionaDesignInteriores(briefingData: any): boolean {
    const texto = JSON.stringify(briefingData).toLowerCase();
    const palavrasChave = [
      'design de interiores', 'decoração', 'mobiliário',
      'acabamentos internos', 'iluminação decorativa'
    ];
    
    return palavrasChave.some(palavra => texto.includes(palavra));
  }

  /**
   * Calcula score geral da análise
   */
  private calcularScoreGeral(templates: TemplateNecessario[]): number {
    if (templates.length === 0) return 0;
    
    const somaScores = templates.reduce((soma, t) => soma + t.score, 0);
    return Math.round((somaScores / templates.length) * 100) / 100;
  }

  /**
   * Determina complexidade do projeto
   */
  private determinarComplexidade(templates: TemplateNecessario[]): 'baixa' | 'media' | 'alta' | 'critica' {
    const numTemplates = templates.length;
    
    if (numTemplates <= 2) return 'baixa';
    if (numTemplates <= 4) return 'media';
    if (numTemplates <= 6) return 'alta';
    return 'critica';
  }

  /**
   * Calcula tempo estimado total
   */
  private calcularTempoEstimado(templates: TemplateNecessario[]): number {
    // Estimativa base por template (em minutos)
    const tempoBase: Record<string, number> = {
      'arquitetura': 2400,  // 40 horas
      'estrutural': 1800,   // 30 horas  
      'instalacoes': 1200,  // 20 horas
      'paisagismo': 600,    // 10 horas
      'interiores': 900     // 15 horas
    };

    return templates.reduce((total, template) => {
      return total + (tempoBase[template.categoria] || 600);
    }, 0);
  }

  /**
   * Calcula total de tarefas estimado
   */
  private calcularTotalTarefas(templates: TemplateNecessario[]): number {
    // Estimativa base de tarefas por template
    const tarefasBase: Record<string, number> = {
      'arquitetura': 160,
      'estrutural': 80,
      'instalacoes': 100,  
      'paisagismo': 50,
      'interiores': 70
    };

    return templates.reduce((total, template) => {
      return total + (tarefasBase[template.categoria] || 30);
    }, 0);
  }

  /**
   * Gera resumo da análise
   */
  private gerarResumo(templates: TemplateNecessario[], complexidade: string): string {
    const principais = templates.filter(t => t.prioridade <= 2);
    const complementares = templates.filter(t => t.prioridade > 2);
    
    return `Projeto de complexidade ${complexidade} com ${principais.length} template(s) principal(is) e ${complementares.length} complementar(es). Total: ${templates.length} templates detectados.`;
  }

  /**
   * Gera hash único do briefing para cache
   */
  private gerarHashBriefing(briefingData: any): string {
    const relevantData = {
      tipologia: briefingData.tipologia,
      id: briefingData.id,
      version: briefingData.version || 1
    };
    
    return Buffer.from(JSON.stringify(relevantData)).toString('base64').substring(0, 16);
  }
}
