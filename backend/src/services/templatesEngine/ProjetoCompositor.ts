// ProjetoCompositor.ts - Combina múltiplos templates em projeto unificado

import { logger } from '../../config/logger';
import { CacheService } from '../../config/redis';
import { TemplateNecessario, AnaliseNecessidades } from './NecessidadesDetector';

export interface AtividadeComposta {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  templateOrigem: string;
  tipo: string;
  ordem: number;
  dependencias: string[];
  tempoEstimado: number;
  complexidade: string;
  obrigatoria: boolean;
  recursos?: any;
  entregaveis?: any;
}

export interface ProjetoComposto {
  id: string;
  projetoId: string;
  templateIds: string[];
  tipoComposicao: 'automatica' | 'manual';
  atividades: AtividadeComposta[];
  dependencias: Record<string, string[]>;
  cronograma: CronogramaItem[];
  orcamento: OrcamentoComposicao;
  configuracao: ConfiguracaoComposicao;
  metadados: MetadadosComposicao;
  status: 'ativo' | 'pausado' | 'concluido';
  createdAt: Date;
  updatedAt: Date;
}

export interface CronogramaItem {
  id: string;
  atividadeId: string;
  titulo: string;
  categoria: string;
  dataInicio: Date;
  dataFim: Date;
  duracao: number; // em dias
  dependencias: string[];
  marco: boolean;
  critico: boolean;
}

export interface OrcamentoComposicao {
  total: number;
  porCategoria: Record<string, number>;
  porTemplate: Record<string, number>;
  detalhamento: any[];
}

export interface ConfiguracaoComposicao {
  prioridadeTemplates: Record<string, number>;
  parametrosPersonalizados: any;
  regrasAplicadas: string[];
}

export interface MetadadosComposicao {
  analiseOriginal: AnaliseNecessidades;
  estatisticas: {
    totalTarefas: number;
    tempoEstimadoTotal: number;
    complexidadeGeral: string;
    categoriasEnvolvidas: string[];
  };
  historico: HistoricoComposicao[];
}

export interface HistoricoComposicao {
  timestamp: Date;
  acao: string;
  detalhes: any;
  usuario?: string;
}

/**
 * Projeto Compositor - Engine de Composição de Templates Dinâmicos
 * 
 * Combina múltiplos templates em um projeto unificado, gerando
 * cronograma automático, dependências entre atividades e orçamento consolidado.
 */
export class ProjetoCompositor {

  /**
   * Compõe projeto unificado baseado nos templates detectados
   */
  async comporProjeto(
    projetoId: string,
    analiseNecessidades: AnaliseNecessidades,
    configuracao?: any
  ): Promise<ProjetoComposto> {
    try {
      logger.info('🔨 Iniciando composição de projeto', {
        projetoId,
        totalTemplates: analiseNecessidades.templatesPrincipais.length + 
                       analiseNecessidades.templatesComplementares.length + 
                       analiseNecessidades.templatesOpcionais.length,
        complexidade: analiseNecessidades.complexidade
      });

      // Cache key para reutilização
      const cacheKey = `composicao:${projetoId}:${this.gerarHashAnalise(analiseNecessidades)}`;
      
      // Verificar cache
      const cached = await CacheService.get<ProjetoComposto>(cacheKey);
      if (cached && !configuracao?.forceRegenerate) {
        logger.info('✅ Composição encontrada no cache');
        return cached;
      }

      // Composição principal
      const projetoComposto = await this.executarComposicao(
        projetoId, 
        analiseNecessidades, 
        configuracao
      );

      // Salvar no cache por 1 hora
      await CacheService.set(cacheKey, projetoComposto, 3600);

      logger.info('✅ Composição de projeto concluída', {
        projetoId: projetoComposto.id,
        totalAtividades: projetoComposto.atividades.length,
        duracaoEstimada: this.calcularDuracaoTotal(projetoComposto.cronograma),
        orcamentoTotal: projetoComposto.orcamento.total
      });

      return projetoComposto;

    } catch (error: any) {
      logger.error('❌ Erro na composição de projeto', {
        error: error.message,
        projetoId,
        analiseNecessidades
      });
      throw new Error(`Falha na composição do projeto: ${error.message}`);
    }
  }

  /**
   * Executa a composição principal do projeto
   */
  private async executarComposicao(
    projetoId: string,
    analise: AnaliseNecessidades,
    configuracao?: any
  ): Promise<ProjetoComposto> {
    
    // 1. COLETAR TODOS OS TEMPLATES
    const todosTemplates = [
      ...analise.templatesPrincipais,
      ...analise.templatesComplementares,
      ...analise.templatesOpcionais
    ];

    // 2. GERAR ATIVIDADES COMPOSTAS
    const atividades = await this.gerarAtividadesCompostas(todosTemplates);

    // 3. CALCULAR DEPENDÊNCIAS GLOBAIS
    const dependencias = await this.calcularDependenciasGlobais(atividades);

    // 4. GERAR CRONOGRAMA UNIFICADO
    const cronograma = await this.gerarCronogramaUnificado(atividades, dependencias);

    // 5. CALCULAR ORÇAMENTO CONSOLIDADO
    const orcamento = await this.calcularOrcamentoConsolidado(atividades, todosTemplates);

    // 6. PREPARAR CONFIGURAÇÃO E METADADOS
    const configuracaoComposicao = this.prepararConfiguracao(todosTemplates, configuracao);
    const metadados = this.prepararMetadados(analise, atividades, todosTemplates);

    return {
      id: this.gerarIdComposicao(),
      projetoId,
      templateIds: todosTemplates.map(t => t.templateId),
      tipoComposicao: 'automatica',
      atividades,
      dependencias,
      cronograma,
      orcamento,
      configuracao: configuracaoComposicao,
      metadados,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Gera atividades compostas de todos os templates
   */
  private async gerarAtividadesCompostas(templates: TemplateNecessario[]): Promise<AtividadeComposta[]> {
    const atividades: AtividadeComposta[] = [];
    let ordemGlobal = 1;

    for (const template of templates) {
      const atividadesTemplate = await this.obterAtividadesTemplate(template);
      
      // Ajustar ordem global e mapear atividades
      for (const atividade of atividadesTemplate) {
        atividades.push({
          ...atividade,
          id: `${template.templateId}_${atividade.id}`,
          templateOrigem: template.templateId,
          ordem: ordemGlobal++,
          // Prefixar dependências com templateId para evitar conflitos
          dependencias: atividade.dependencias.map(dep => 
            dep.includes('_') ? dep : `${template.templateId}_${dep}`
          )
        });
      }
    }

    return atividades;
  }

  /**
   * Obter atividades de um template específico
   */
  private async obterAtividadesTemplate(template: TemplateNecessario): Promise<AtividadeComposta[]> {
    // Base de atividades por template (simulação - em produção viria do banco)
    const atividadesBase: Record<string, AtividadeComposta[]> = {
      'residencial-unifamiliar-completo': this.getAtividadesResidencial(),
      'estrutural-adaptativo-completo': this.getAtividadesEstruturais(),
      'instalacoes-adaptativo-completo': this.getAtividadesInstalacoes(),
      'paisagismo-completo': this.getAtividadesPaisagismo(),
      'design-interiores-completo': this.getAtividadesInteriores()
    };

    return atividadesBase[template.templateId] || [];
  }

  /**
   * Calcula dependências globais entre templates
   */
  private async calcularDependenciasGlobais(atividades: AtividadeComposta[]): Promise<Record<string, string[]>> {
    const dependencias: Record<string, string[]> = {};

    // Regras de dependência entre categorias
    const regrasDependencia: Record<string, string[]> = {
      'estrutural': ['arquitetura'],
      'instalacoes': ['arquitetura', 'estrutural'],
      'paisagismo': ['arquitetura'],
      'interiores': ['arquitetura', 'instalacoes']
    };

    // Aplicar dependências entre categorias
    for (const atividade of atividades) {
      const categoriaDeps = regrasDependencia[atividade.categoria] || [];
      
      // Adicionar dependências baseadas em categorias
      for (const categoriaDep of categoriaDeps) {
        const atividadesDependentes = atividades.filter(a => 
          a.categoria === categoriaDep && 
          a.templateOrigem !== atividade.templateOrigem
        );

        if (atividadesDependentes.length > 0) {
          if (!dependencias[atividade.id]) {
            dependencias[atividade.id] = [];
          }
          
          // Adicionar última atividade da categoria dependente
          const ultimaAtividade = atividadesDependentes
            .sort((a, b) => b.ordem - a.ordem)[0];
          
          if (ultimaAtividade && !dependencias[atividade.id].includes(ultimaAtividade.id)) {
            dependencias[atividade.id].push(ultimaAtividade.id);
          }
        }
      }

      // Manter dependências internas do template
      dependencias[atividade.id] = [
        ...(dependencias[atividade.id] || []),
        ...atividade.dependencias
      ];
    }

    return dependencias;
  }

  /**
   * Gera cronograma unificado com dependências
   */
  private async gerarCronogramaUnificado(
    atividades: AtividadeComposta[],
    dependencias: Record<string, string[]>
  ): Promise<CronogramaItem[]> {
    const cronograma: CronogramaItem[] = [];
    const dataInicioProjeto = new Date();

    // Algoritmo de ordenação topológica para dependências
    const atividadesOrdenadas = this.ordenarPorDependencias(atividades, dependencias);

    let dataAtual = new Date(dataInicioProjeto);

    for (const atividade of atividadesOrdenadas) {
      const duracao = Math.ceil(atividade.tempoEstimado / (8 * 60)); // Converter minutos para dias úteis
      
      // Calcular data de início baseada nas dependências
      const dataInicioAtividade = this.calcularDataInicio(
        atividade,
        dependencias[atividade.id] || [],
        cronograma,
        dataAtual
      );

      const dataFim = this.adicionarDiasUteis(dataInicioAtividade, duracao || 1);

      cronograma.push({
        id: atividade.id,
        atividadeId: atividade.id,
        titulo: atividade.titulo,
        categoria: atividade.categoria,
        dataInicio: dataInicioAtividade,
        dataFim,
        duracao,
        dependencias: dependencias[atividade.id] || [],
        marco: atividade.categoria === 'arquitetura' && atividade.titulo.includes('Aprovação'),
        critico: atividade.obrigatoria && atividade.complexidade === 'alta'
      });

      // Atualizar data atual para próxima atividade
      if (dataFim > dataAtual) {
        dataAtual = dataFim;
      }
    }

    return cronograma;
  }

  /**
   * Calcula orçamento consolidado
   */
  private async calcularOrcamentoConsolidado(
    atividades: AtividadeComposta[],
    templates: TemplateNecessario[]
  ): Promise<OrcamentoComposicao> {
    // Valores base por categoria (em reais)
    const valoresPorCategoria: Record<string, number> = {
      'arquitetura': 15000,
      'estrutural': 8000,
      'instalacoes': 12000,
      'paisagismo': 5000,
      'interiores': 10000
    };

    // Calcular por categoria
    const porCategoria: Record<string, number> = {};
    for (const categoria of Object.keys(valoresPorCategoria)) {
      const atividadesCategoria = atividades.filter(a => a.categoria === categoria);
      if (atividadesCategoria.length > 0) {
        porCategoria[categoria] = valoresPorCategoria[categoria];
      }
    }

    // Calcular por template
    const porTemplate: Record<string, number> = {};
    for (const template of templates) {
      const atividadesTemplate = atividades.filter(a => a.templateOrigem === template.templateId);
      const categorias = [...new Set(atividadesTemplate.map(a => a.categoria))];
      
      porTemplate[template.templateId] = categorias.reduce((total, cat) => {
        return total + (porCategoria[cat] || 0);
      }, 0);
    }

    const total = Object.values(porCategoria).reduce((sum, valor) => sum + valor, 0);

    return {
      total,
      porCategoria,
      porTemplate,
      detalhamento: [] // Detalhamento específico seria implementado aqui
    };
  }

  // MÉTODOS AUXILIARES

  private prepararConfiguracao(templates: TemplateNecessario[], configuracao?: any): ConfiguracaoComposicao {
    return {
      prioridadeTemplates: templates.reduce((acc, t) => {
        acc[t.templateId] = t.prioridade;
        return acc;
      }, {} as Record<string, number>),
      parametrosPersonalizados: configuracao || {},
      regrasAplicadas: ['dependencias-categoria', 'cronograma-automatico', 'orcamento-consolidado']
    };
  }

  private prepararMetadados(
    analise: AnaliseNecessidades,
    atividades: AtividadeComposta[],
    templates: TemplateNecessario[]
  ): MetadadosComposicao {
    return {
      analiseOriginal: analise,
      estatisticas: {
        totalTarefas: atividades.length,
        tempoEstimadoTotal: atividades.reduce((total, a) => total + a.tempoEstimado, 0),
        complexidadeGeral: analise.complexidade,
        categoriasEnvolvidas: [...new Set(atividades.map(a => a.categoria))]
      },
      historico: [{
        timestamp: new Date(),
        acao: 'composicao-inicial',
        detalhes: { templatesUsados: templates.map(t => t.templateId) }
      }]
    };
  }

  private gerarIdComposicao(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private gerarHashAnalise(analise: AnaliseNecessidades): string {
    const data = {
      templatesPrincipais: analise.templatesPrincipais.map(t => t.templateId),
      templatesComplementares: analise.templatesComplementares.map(t => t.templateId),
      templatesOpcionais: analise.templatesOpcionais.map(t => t.templateId)
    };
    
    return Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 12);
  }

  private calcularDuracaoTotal(cronograma: CronogramaItem[]): number {
    if (cronograma.length === 0) return 0;
    
    const dataInicio = cronograma.reduce((min, item) => 
      item.dataInicio < min ? item.dataInicio : min, cronograma[0].dataInicio);
    
    const dataFim = cronograma.reduce((max, item) => 
      item.dataFim > max ? item.dataFim : max, cronograma[0].dataFim);
    
    return Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
  }

  private ordenarPorDependencias(
    atividades: AtividadeComposta[],
    dependencias: Record<string, string[]>
  ): AtividadeComposta[] {
    // Implementação simplificada de ordenação topológica
    const resultado: AtividadeComposta[] = [];
    const visitados = new Set<string>();
    const visitando = new Set<string>();

    const visitar = (atividade: AtividadeComposta) => {
      if (visitando.has(atividade.id)) {
        throw new Error('Dependência circular detectada');
      }
      
      if (visitados.has(atividade.id)) {
        return;
      }

      visitando.add(atividade.id);

      // Visitar dependências primeiro
      const deps = dependencias[atividade.id] || [];
      for (const depId of deps) {
        const depAtividade = atividades.find(a => a.id === depId);
        if (depAtividade) {
          visitar(depAtividade);
        }
      }

      visitando.delete(atividade.id);
      visitados.add(atividade.id);
      resultado.push(atividade);
    };

    for (const atividade of atividades) {
      if (!visitados.has(atividade.id)) {
        visitar(atividade);
      }
    }

    return resultado;
  }

  private calcularDataInicio(
    atividade: AtividadeComposta,
    dependencias: string[],
    cronograma: CronogramaItem[],
    dataMinima: Date
  ): Date {
    let dataMaxima = dataMinima;

    for (const depId of dependencias) {
      const itemDependencia = cronograma.find(c => c.id === depId);
      if (itemDependencia?.dataFim && itemDependencia.dataFim > dataMaxima) {
        dataMaxima = itemDependencia.dataFim;
      }
    }

    return dataMaxima;
  }

  private adicionarDiasUteis(data: Date, dias: number): Date {
    const resultado = new Date(data);
    let diasAdicionados = 0;

    while (diasAdicionados < dias) {
      resultado.setDate(resultado.getDate() + 1);
      
      // Pular fins de semana (sábado = 6, domingo = 0)
      if (resultado.getDay() !== 0 && resultado.getDay() !== 6) {
        diasAdicionados++;
      }
    }

    return resultado;
  }

  // ATIVIDADES BASE (simulação - em produção viria do banco)
  private getAtividadesResidencial(): AtividadeComposta[] {
    return [
      {
        id: 'res_01',
        titulo: 'Levantamento e Análise do Terreno',
        descricao: 'Análise topográfica e condições do terreno',
        categoria: 'arquitetura',
        templateOrigem: '',
        tipo: 'CONCEPCAO',
        ordem: 1,
        dependencias: [],
        tempoEstimado: 480, // 8 horas
        complexidade: 'media',
        obrigatoria: true
      },
      {
        id: 'res_02',
        titulo: 'Estudo Preliminar',
        descricao: 'Desenvolvimento do conceito arquitetônico',
        categoria: 'arquitetura',
        templateOrigem: '',
        tipo: 'CONCEPCAO',
        ordem: 2,
        dependencias: ['res_01'],
        tempoEstimado: 960, // 16 horas
        complexidade: 'alta',
        obrigatoria: true
      }
      // Mais atividades seriam adicionadas aqui
    ];
  }

  private getAtividadesEstruturais(): AtividadeComposta[] {
    return [
      {
        id: 'est_01',
        titulo: 'Análise Estrutural Preliminar',
        descricao: 'Definição do sistema estrutural',
        categoria: 'estrutural',
        templateOrigem: '',
        tipo: 'CALCULO',
        ordem: 1,
        dependencias: [],
        tempoEstimado: 720, // 12 horas
        complexidade: 'alta',
        obrigatoria: true
      }
      // Mais atividades estruturais
    ];
  }

  private getAtividadesInstalacoes(): AtividadeComposta[] {
    return [
      {
        id: 'inst_01',
        titulo: 'Projeto Elétrico Preliminar',
        descricao: 'Dimensionamento da instalação elétrica',
        categoria: 'instalacoes',
        templateOrigem: '',
        tipo: 'DESENHO',
        ordem: 1,
        dependencias: [],
        tempoEstimado: 600, // 10 horas
        complexidade: 'media',
        obrigatoria: true
      }
      // Mais atividades de instalações
    ];
  }

  private getAtividadesPaisagismo(): AtividadeComposta[] {
    return [
      {
        id: 'pais_01',
        titulo: 'Conceito Paisagístico',
        descricao: 'Desenvolvimento do partido paisagístico',
        categoria: 'paisagismo',
        templateOrigem: '',
        tipo: 'CONCEPCAO',
        ordem: 1,
        dependencias: [],
        tempoEstimado: 360, // 6 horas
        complexidade: 'media',
        obrigatoria: false
      }
      // Mais atividades de paisagismo
    ];
  }

  private getAtividadesInteriores(): AtividadeComposta[] {
    return [
      {
        id: 'int_01',
        titulo: 'Conceito de Design de Interiores',
        descricao: 'Desenvolvimento do conceito de interiores',
        categoria: 'interiores',
        templateOrigem: '',
        tipo: 'CONCEPCAO',
        ordem: 1,
        dependencias: [],
        tempoEstimado: 480, // 8 horas
        complexidade: 'media',
        obrigatoria: false
      }
      // Mais atividades de interiores
    ];
  }
}
