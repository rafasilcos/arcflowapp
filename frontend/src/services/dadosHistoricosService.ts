import { 
  ProjetoHistorico, 
  DadosBenchmarking, 
  AnaliseComparativa, 
  MetricasDesempenho,
  RelatorioInsights,
  TipoProjeto,
  CategoriaProjeto,
  PeriodoAnalise,
  CriterioSimilaridade,
  TipoRelatorio,
  PrevisaoOrcamento,
  PrevisaoPrazo,
  RiscoProvavel
} from '../types/dadosHistoricos';

class DadosHistoricosService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // ==================== PROJETOS HISTÓRICOS ====================

  /**
   * Busca projetos históricos com filtros avançados
   */
  async buscarProjetosHistoricos(filtros: {
    tipoProjeto?: TipoProjeto[];
    categoria?: CategoriaProjeto[];
    periodo?: PeriodoAnalise;
    orcamentoMin?: number;
    orcamentoMax?: number;
    areaMin?: number;
    areaMax?: number;
    clienteId?: string;
    status?: string[];
    tags?: string[];
    ordenacao?: 'data' | 'orcamento' | 'prazo' | 'satisfacao';
    limite?: number;
    offset?: number;
  }): Promise<{
    projetos: ProjetoHistorico[];
    total: number;
    estatisticas: {
      orcamentoMedio: number;
      prazoMedio: number;
      satisfacaoMedia: number;
      margemLucroMedia: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filtros.tipoProjeto?.length) {
        params.append('tipoProjeto', filtros.tipoProjeto.join(','));
      }
      if (filtros.categoria?.length) {
        params.append('categoria', filtros.categoria.join(','));
      }
      if (filtros.periodo) {
        params.append('periodo', filtros.periodo);
      }
      if (filtros.orcamentoMin) {
        params.append('orcamentoMin', filtros.orcamentoMin.toString());
      }
      if (filtros.orcamentoMax) {
        params.append('orcamentoMax', filtros.orcamentoMax.toString());
      }
      if (filtros.areaMin) {
        params.append('areaMin', filtros.areaMin.toString());
      }
      if (filtros.areaMax) {
        params.append('areaMax', filtros.areaMax.toString());
      }
      if (filtros.clienteId) {
        params.append('clienteId', filtros.clienteId);
      }
      if (filtros.status?.length) {
        params.append('status', filtros.status.join(','));
      }
      if (filtros.tags?.length) {
        params.append('tags', filtros.tags.join(','));
      }
      if (filtros.ordenacao) {
        params.append('ordenacao', filtros.ordenacao);
      }
      if (filtros.limite) {
        params.append('limite', filtros.limite.toString());
      }
      if (filtros.offset) {
        params.append('offset', filtros.offset.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/dados-historicos/projetos?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar projetos históricos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar projetos históricos:', error);
      throw error;
    }
  }

  /**
   * Salva dados de projeto histórico
   */
  async salvarProjetoHistorico(projeto: Omit<ProjetoHistorico, 'id'>): Promise<ProjetoHistorico> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/projetos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projeto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar projeto histórico: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao salvar projeto histórico:', error);
      throw error;
    }
  }

  /**
   * Atualiza dados de projeto histórico
   */
  async atualizarProjetoHistorico(id: string, dados: Partial<ProjetoHistorico>): Promise<ProjetoHistorico> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/projetos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar projeto histórico: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar projeto histórico:', error);
      throw error;
    }
  }

  // ==================== BENCHMARKING ====================

  /**
   * Gera dados de benchmarking para categoria e período específicos
   */
  async gerarBenchmarking(
    categoria: CategoriaProjeto,
    tipoProjeto: TipoProjeto,
    periodo: PeriodoAnalise
  ): Promise<DadosBenchmarking> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/benchmarking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoria,
          tipoProjeto,
          periodo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar benchmarking: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar benchmarking:', error);
      throw error;
    }
  }

  /**
   * Busca dados de benchmarking existentes
   */
  async buscarBenchmarking(filtros: {
    categoria?: CategoriaProjeto;
    tipoProjeto?: TipoProjeto;
    periodo?: PeriodoAnalise;
  }): Promise<DadosBenchmarking[]> {
    try {
      const params = new URLSearchParams();
      
      if (filtros.categoria) {
        params.append('categoria', filtros.categoria);
      }
      if (filtros.tipoProjeto) {
        params.append('tipoProjeto', filtros.tipoProjeto);
      }
      if (filtros.periodo) {
        params.append('periodo', filtros.periodo);
      }

      const response = await fetch(`${this.baseUrl}/api/dados-historicos/benchmarking?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar benchmarking: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar benchmarking:', error);
      throw error;
    }
  }

  // ==================== ANÁLISE COMPARATIVA ====================

  /**
   * Gera análise comparativa para um briefing atual
   */
  async gerarAnaliseComparativa(
    briefingId: string,
    criterios: CriterioSimilaridade[],
    limiteProjetos: number = 10
  ): Promise<AnaliseComparativa> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/analise-comparativa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefingId,
          criterios,
          limiteProjetos,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar análise comparativa: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar análise comparativa:', error);
      throw error;
    }
  }

  /**
   * Busca projetos similares baseado em critérios
   */
  async buscarProjetosSimilares(
    dadosBriefing: {
      tipoProjeto: TipoProjeto;
      categoria: CategoriaProjeto;
      orcamento: number;
      areaConstruida: number;
      complexidade: string;
      localizacao?: string;
    },
    criterios: CriterioSimilaridade[],
    limite: number = 5
  ): Promise<{
    projetos: ProjetoHistorico[];
    similaridade: { [projetoId: string]: number };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/projetos-similares`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dadosBriefing,
          criterios,
          limite,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar projetos similares: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar projetos similares:', error);
      throw error;
    }
  }

  // ==================== PREVISÕES ====================

  /**
   * Gera previsão de orçamento baseada em dados históricos
   */
  async preverOrcamento(
    dadosProjeto: {
      tipoProjeto: TipoProjeto;
      categoria: CategoriaProjeto;
      areaConstruida: number;
      complexidade: string;
      localizacao?: string;
      materiais?: string[];
      acabamentos?: string;
    }
  ): Promise<PrevisaoOrcamento> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/previsao-orcamento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProjeto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao prever orçamento: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao prever orçamento:', error);
      throw error;
    }
  }

  /**
   * Gera previsão de prazo baseada em dados históricos
   */
  async preverPrazo(
    dadosProjeto: {
      tipoProjeto: TipoProjeto;
      categoria: CategoriaProjeto;
      areaConstruida: number;
      complexidade: string;
      numeroComodos?: number;
      tipoTerreno?: string;
    }
  ): Promise<PrevisaoPrazo> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/previsao-prazo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProjeto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao prever prazo: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao prever prazo:', error);
      throw error;
    }
  }

  /**
   * Identifica riscos prováveis baseado em projetos similares
   */
  async identificarRiscos(
    dadosProjeto: {
      tipoProjeto: TipoProjeto;
      categoria: CategoriaProjeto;
      orcamento: number;
      complexidade: string;
      localizacao?: string;
    }
  ): Promise<RiscoProvavel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/identificar-riscos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProjeto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao identificar riscos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao identificar riscos:', error);
      throw error;
    }
  }

  // ==================== MÉTRICAS DE DESEMPENHO ====================

  /**
   * Calcula métricas de desempenho do escritório
   */
  async calcularMetricasDesempenho(
    escritorioId: string,
    periodo: PeriodoAnalise
  ): Promise<MetricasDesempenho> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/metricas-desempenho`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          escritorioId,
          periodo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao calcular métricas de desempenho: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao calcular métricas de desempenho:', error);
      throw error;
    }
  }

  /**
   * Busca histórico de métricas de desempenho
   */
  async buscarHistoricoMetricas(
    escritorioId: string,
    periodos: PeriodoAnalise[]
  ): Promise<MetricasDesempenho[]> {
    try {
      const params = new URLSearchParams();
      params.append('escritorioId', escritorioId);
      params.append('periodos', periodos.join(','));

      const response = await fetch(`${this.baseUrl}/api/dados-historicos/historico-metricas?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico de métricas: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico de métricas:', error);
      throw error;
    }
  }

  // ==================== RELATÓRIOS E INSIGHTS ====================

  /**
   * Gera relatório de insights personalizado
   */
  async gerarRelatorioInsights(
    configuracao: {
      tipo: TipoRelatorio;
      periodo: PeriodoAnalise;
      escritorioId: string;
      filtros?: {
        tipoProjeto?: TipoProjeto[];
        categoria?: CategoriaProjeto[];
        clienteId?: string;
      };
      incluirPrevisoes?: boolean;
      incluirBenchmarking?: boolean;
      incluirRecomendacoes?: boolean;
    }
  ): Promise<RelatorioInsights> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/relatorio-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracao),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar relatório de insights: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar relatório de insights:', error);
      throw error;
    }
  }

  /**
   * Busca relatórios de insights existentes
   */
  async buscarRelatoriosInsights(filtros: {
    tipo?: TipoRelatorio;
    periodo?: PeriodoAnalise;
    escritorioId: string;
    dataInicio?: Date;
    dataFim?: Date;
  }): Promise<RelatorioInsights[]> {
    try {
      const params = new URLSearchParams();
      params.append('escritorioId', filtros.escritorioId);
      
      if (filtros.tipo) {
        params.append('tipo', filtros.tipo);
      }
      if (filtros.periodo) {
        params.append('periodo', filtros.periodo);
      }
      if (filtros.dataInicio) {
        params.append('dataInicio', filtros.dataInicio.toISOString());
      }
      if (filtros.dataFim) {
        params.append('dataFim', filtros.dataFim.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/api/dados-historicos/relatorios-insights?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar relatórios de insights: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar relatórios de insights:', error);
      throw error;
    }
  }

  // ==================== ANÁLISES AVANÇADAS ====================

  /**
   * Analisa tendências de mercado baseado em dados históricos
   */
  async analisarTendenciasMercado(
    periodo: PeriodoAnalise,
    categoria?: CategoriaProjeto
  ): Promise<{
    tendenciasPrecos: { periodo: string; valor: number; variacao: number }[];
    tendenciasPrazos: { periodo: string; valor: number; variacao: number }[];
    tendenciasQualidade: { periodo: string; valor: number; variacao: number }[];
    materiaisEmAlta: { material: string; crescimento: number; projetos: number }[];
    estilosEmAlta: { estilo: string; crescimento: number; projetos: number }[];
    insights: string[];
    recomendacoes: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/tendencias-mercado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          periodo,
          categoria,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao analisar tendências de mercado: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao analisar tendências de mercado:', error);
      throw error;
    }
  }

  /**
   * Analisa sazonalidade dos projetos
   */
  async analisarSazonalidade(
    tipoProjeto?: TipoProjeto,
    categoria?: CategoriaProjeto
  ): Promise<{
    demandaPorMes: { mes: number; demanda: number; receita: number }[];
    picos: { mes: number; tipo: 'alta' | 'baixa'; intensidade: number }[];
    recomendacoes: string[];
    estrategias: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/sazonalidade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoProjeto,
          categoria,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao analisar sazonalidade: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao analisar sazonalidade:', error);
      throw error;
    }
  }

  /**
   * Gera recomendações personalizadas baseadas em dados históricos
   */
  async gerarRecomendacoesPersonalizadas(
    dadosBriefing: {
      tipoProjeto: TipoProjeto;
      categoria: CategoriaProjeto;
      orcamento: number;
      areaConstruida: number;
      clienteId?: string;
    }
  ): Promise<{
    recomendacoesProjeto: string[];
    recomendacoesOrcamento: string[];
    recomendacoesPrazo: string[];
    recomendacoesMateriais: string[];
    recomendacoesQualidade: string[];
    alertas: string[];
    oportunidades: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/recomendacoes-personalizadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosBriefing),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar recomendações personalizadas: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gerar recomendações personalizadas:', error);
      throw error;
    }
  }

  // ==================== EXPORTAÇÃO E IMPORTAÇÃO ====================

  /**
   * Exporta dados históricos para análise externa
   */
  async exportarDadosHistoricos(
    formato: 'json' | 'csv' | 'excel',
    filtros: {
      periodo?: PeriodoAnalise;
      tipoProjeto?: TipoProjeto[];
      categoria?: CategoriaProjeto[];
      incluirMetricas?: boolean;
      incluirBenchmarking?: boolean;
    }
  ): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/exportar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formato,
          filtros,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao exportar dados históricos: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Erro ao exportar dados históricos:', error);
      throw error;
    }
  }

  /**
   * Importa dados históricos de arquivo
   */
  async importarDadosHistoricos(
    arquivo: File,
    configuracao: {
      sobrescreverExistentes?: boolean;
      validarDados?: boolean;
      mapeamentoCampos?: { [key: string]: string };
    }
  ): Promise<{
    sucesso: boolean;
    projetosImportados: number;
    erros: string[];
    avisos: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);
      formData.append('configuracao', JSON.stringify(configuracao));

      const response = await fetch(`${this.baseUrl}/api/dados-historicos/importar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao importar dados históricos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao importar dados históricos:', error);
      throw error;
    }
  }

  // ==================== CACHE E OTIMIZAÇÃO ====================

  /**
   * Limpa cache de análises e recalcula dados
   */
  async limparCacheAnalises(): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/limpar-cache`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Erro ao limpar cache: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      throw error;
    }
  }

  /**
   * Otimiza base de dados históricos
   */
  async otimizarBaseDados(): Promise<{
    sucesso: boolean;
    estatisticas: {
      projetosAnalisados: number;
      duplicatasRemovidas: number;
      dadosInconsistentesCorrigidos: number;
      indicesOtimizados: number;
    };
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/dados-historicos/otimizar`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Erro ao otimizar base de dados: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao otimizar base de dados:', error);
      throw error;
    }
  }
}

export const dadosHistoricosService = new DadosHistoricosService(); 