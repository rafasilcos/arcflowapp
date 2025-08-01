// TemplatesEngine.ts - Orquestrador principal do sistema

import { logger } from '../../config/logger';
import { CacheService } from '../../config/redis';
import { NecessidadesDetector, AnaliseNecessidades, TemplateNecessario } from './NecessidadesDetector';
import { ProjetoCompositor, ProjetoComposto } from './ProjetoCompositor';

export interface ResultadoTemplatesDinamicos {
  success: boolean;
  analiseNecessidades: AnaliseNecessidades;
  projetoComposto: ProjetoComposto;
  metricas: MetricasProcessamento;
  recomendacoes: string[];
  alertas?: string[];
}

export interface MetricasProcessamento {
  tempoDeteccao: number; // ms
  tempoComposicao: number; // ms
  tempoTotal: number; // ms
  templatesPrincipais: number;
  templatesComplementares: number;
  templatesOpcionais: number;
  totalAtividades: number;
  duracaoEstimada: number; // dias
  orcamentoEstimado: number; // reais
  complexidade: string;
}

export interface ConfiguracaoTemplatesEngine {
  forceRegenerate?: boolean;
  incluirOpcionais?: boolean;
  prioridadeMinima?: number;
  scoreMinimo?: number;
  parametrosCustomizados?: any;
}

/**
 * Templates Engine - Orquestrador Principal do Sistema de Templates Dinâmicos
 * 
 * Integra a detecção de necessidades com a composição de projetos,
 * fornecendo uma interface unificada para gerar projetos automaticamente
 * baseados em briefings estruturados.
 */
export class TemplatesEngine {
  private necessidadesDetector: NecessidadesDetector;
  private projetoCompositor: ProjetoCompositor;

  constructor() {
    this.necessidadesDetector = new NecessidadesDetector();
    this.projetoCompositor = new ProjetoCompositor();
  }

  /**
   * MÉTODO PRINCIPAL - Gera projeto composto automaticamente
   */
  async gerarProjetoDinamico(
    projetoId: string,
    briefingData: any,
    configuracao?: ConfiguracaoTemplatesEngine
  ): Promise<ResultadoTemplatesDinamicos> {
    const inicioProcessamento = Date.now();
    
    try {
      logger.info('🚀 Iniciando geração de projeto dinâmico', {
        projetoId,
        tipologia: briefingData.tipologia,
        configuracao
      });

      // FASE 1: DETECÇÃO DE NECESSIDADES
      const inicioDeteccao = Date.now();
      const analiseNecessidades = await this.necessidadesDetector.detectarNecessidades(briefingData);
      const tempoDeteccao = Date.now() - inicioDeteccao;

      // APLICAR FILTROS DE CONFIGURAÇÃO
      const analiseFilterada = this.aplicarFiltros(analiseNecessidades, configuracao);

      // FASE 2: COMPOSIÇÃO DO PROJETO
      const inicioComposicao = Date.now();
      const projetoComposto = await this.projetoCompositor.comporProjeto(
        projetoId,
        analiseFilterada,
        configuracao?.parametrosCustomizados
      );
      const tempoComposicao = Date.now() - inicioComposicao;

      // FASE 3: ANÁLISE E VALIDAÇÃO
      const { recomendacoes, alertas } = this.gerarRecomendacoes(analiseNecessidades, projetoComposto);

      // FASE 4: MÉTRICAS E RESULTADO FINAL
      const tempoTotal = Date.now() - inicioProcessamento;
      const metricas = this.calcularMetricas(
        analiseNecessidades,
        projetoComposto,
        { tempoDeteccao, tempoComposicao, tempoTotal }
      );

      logger.info('🎉 Projeto dinâmico gerado com sucesso', {
        projetoId: projetoComposto.id,
        tempoTotal: `${tempoTotal}ms`,
        totalAtividades: projetoComposto.atividades.length,
        orcamento: projetoComposto.orcamento.total
      });

      return {
        success: true,
        analiseNecessidades,
        projetoComposto,
        metricas,
        recomendacoes,
        alertas
      };

    } catch (error: any) {
      logger.error('❌ Erro na geração de projeto dinâmico', {
        error: error.message,
        projetoId,
        briefingData
      });
      throw new Error(`Falha na geração do projeto dinâmico: ${error.message}`);
    }
  }

  /**
   * Detecta apenas as necessidades (sem composição)
   */
  async detectarNecessidades(briefingData: any): Promise<AnaliseNecessidades> {
    return this.necessidadesDetector.detectarNecessidades(briefingData);
  }

  /**
   * Compõe projeto baseado em análise existente
   */
  async comporProjeto(
    projetoId: string,
    analiseNecessidades: AnaliseNecessidades,
    configuracao?: any
  ): Promise<ProjetoComposto> {
    return this.projetoCompositor.comporProjeto(projetoId, analiseNecessidades, configuracao);
  }

  /**
   * Obtém cronograma de projeto existente
   */
  async obterCronograma(projetoId: string): Promise<any> {
    try {
      const cacheKey = `projeto_composto:${projetoId}`;
      const projetoComposto = await CacheService.get<ProjetoComposto>(cacheKey);
      
      if (!projetoComposto) {
        throw new Error('Projeto composto não encontrado');
      }

      return {
        cronograma: projetoComposto.cronograma,
        dependencias: projetoComposto.dependencias,
        metadados: {
          totalAtividades: projetoComposto.atividades.length,
          duracaoTotal: this.calcularDuracaoTotal(projetoComposto.cronograma),
          marcos: projetoComposto.cronograma.filter(item => item.marco),
          atividadesCriticas: projetoComposto.cronograma.filter(item => item.critico)
        }
      };

    } catch (error: any) {
      logger.error('❌ Erro ao obter cronograma', { error: error.message, projetoId });
      throw new Error(`Falha ao obter cronograma: ${error.message}`);
    }
  }

  /**
   * Analisa viabilidade de templates adicionais
   */
  async analisarTemplatesAdicionais(
    projetoId: string,
    templateIds: string[]
  ): Promise<any> {
    try {
      logger.info('🔍 Analisando viabilidade de templates adicionais', {
        projetoId,
        templateIds
      });

      // Obter projeto composto atual
      const cacheKey = `projeto_composto:${projetoId}`;
      const projetoAtual = await CacheService.get<ProjetoComposto>(cacheKey);
      
      if (!projetoAtual) {
        throw new Error('Projeto base não encontrado');
      }

      // Simular análise de compatibilidade
      const analise = {
        compativel: true,
        conflitos: [],
        dependenciasAdicionais: [],
        impactoOrcamento: 0,
        impactoCronograma: 0,
        recomendacao: 'Aprovado para inclusão'
      };

      return analise;

    } catch (error: any) {
      logger.error('❌ Erro na análise de templates adicionais', {
        error: error.message,
        projetoId,
        templateIds
      });
      throw new Error(`Falha na análise: ${error.message}`);
    }
  }

  /**
   * Obtém métricas de performance do sistema
   */
  async obterMetricasPerformance(): Promise<any> {
    try {
      // Simular métricas de performance (em produção viria do banco/Redis)
      return {
        templatesProcessados: 1247,
        projetosGerados: 89,
        tempoMedioDeteccao: 1250, // ms
        tempoMedioComposicao: 2100, // ms
        taxaSucesso: 0.94,
        templatesMaisUsados: [
          { id: 'residencial-unifamiliar-completo', uso: 45 },
          { id: 'estrutural-adaptativo-completo', uso: 89 },
          { id: 'instalacoes-adaptativo-completo', uso: 89 }
        ],
        complexidadeMedia: 'media',
        orcamentoMedio: 45000
      };

    } catch (error: any) {
      logger.error('❌ Erro ao obter métricas de performance', { error: error.message });
      throw new Error(`Falha ao obter métricas: ${error.message}`);
    }
  }

  // MÉTODOS PRIVADOS AUXILIARES

  private aplicarFiltros(
    analise: AnaliseNecessidades,
    configuracao?: ConfiguracaoTemplatesEngine
  ): AnaliseNecessidades {
    if (!configuracao) return analise;

    let templatesOpcionais = analise.templatesOpcionais;

    if (configuracao.scoreMinimo) {
      templatesOpcionais = templatesOpcionais.filter(t => t.score >= configuracao.scoreMinimo!);
    }

    if (configuracao.incluirOpcionais === false) {
      templatesOpcionais = [];
    }

    return { ...analise, templatesOpcionais };
  }

  private gerarRecomendacoes(
    analise: AnaliseNecessidades,
    projetoComposto: ProjetoComposto
  ): { recomendacoes: string[]; alertas?: string[] } {
    const recomendacoes: string[] = [];
    const alertas: string[] = [];

    if (analise.complexidade === 'alta' || analise.complexidade === 'critica') {
      recomendacoes.push('Considere dividir o projeto em fases para melhor controle');
    }

    if (projetoComposto.orcamento.total > 50000) {
      alertas.push('Orçamento elevado - revisar escopo com cliente');
    }

    recomendacoes.push('Validar briefing com cliente antes de iniciar execução');

    return { recomendacoes, alertas };
  }

  private calcularMetricas(
    analise: AnaliseNecessidades,
    projetoComposto: ProjetoComposto,
    tempos: { tempoDeteccao: number; tempoComposicao: number; tempoTotal: number }
  ): MetricasProcessamento {
    return {
      tempoDeteccao: tempos.tempoDeteccao,
      tempoComposicao: tempos.tempoComposicao,
      tempoTotal: tempos.tempoTotal,
      templatesPrincipais: analise.templatesPrincipais.length,
      templatesComplementares: analise.templatesComplementares.length,
      templatesOpcionais: analise.templatesOpcionais.length,
      totalAtividades: projetoComposto.atividades.length,
      duracaoEstimada: this.calcularDuracaoTotal(projetoComposto.cronograma),
      orcamentoEstimado: projetoComposto.orcamento.total,
      complexidade: analise.complexidade
    };
  }

  private calcularDuracaoTotal(cronograma: any[]): number {
    if (cronograma.length === 0) return 0;

    const dataInicio = cronograma.reduce((min, item) => 
      item.dataInicio < min ? item.dataInicio : min, cronograma[0]?.dataInicio || new Date());
    
    const dataFim = cronograma.reduce((max, item) => 
      item.dataFim > max ? item.dataFim : max, cronograma[0]?.dataFim || new Date());
    
    return Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
  }
}
