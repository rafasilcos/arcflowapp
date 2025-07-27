import { metricsCollectorService, EstatisticasEscritorio } from './metricsCollectorService';
import { alertingService } from './alertingService';
import { loggingService } from './loggingService';

interface RelatorioUso {
  escritorioId: string;
  periodo: { inicio: Date; fim: Date };
  orcamentos: {
    total: number;
    sucesso: number;
    erro: number;
    taxaSucesso: number;
  };
  performance: {
    tempoMedioGeracao: number;
    tempoMinimoGeracao: number;
    tempoMaximoGeracao: number;
  };
  valores: {
    valorMedioOrcamento: number;
    valorTotalOrcamentos: number;
    faixasValor: { [faixa: string]: number };
  };
  tipologias: {
    maisUsadas: { nome: string; quantidade: number }[];
    distribuicao: { [tipologia: string]: number };
  };
  usuarios: {
    maisAtivos: { userId: string; quantidade: number }[];
    distribuicaoUso: { [userId: string]: number };
  };
}

interface RelatorioSistema {
  timestamp: Date;
  periodo: { inicio: Date; fim: Date };
  performance: {
    operacoesPorMinuto: number;
    tempoMedioResposta: number;
    usoMemoria: number;
    usoCPU: number;
  };
  alertas: {
    total: number;
    ativos: number;
    porSeveridade: { [severidade: string]: number };
    porTipo: { [tipo: string]: number };
  };
  recursos: {
    conexoesBanco: number;
    conexoesRedis: number;
    filaProcessamento: number;
  };
  erros: {
    totalErros: number;
    errosPorTipo: { [tipo: string]: number };
    taxaErro: number;
  };
}

class ReportingService {
  // Gerar relatório de uso por escritório
  async gerarRelatorioUso(escritorioId: string, diasAtras: number = 30): Promise<RelatorioUso> {
    try {
      const timer = loggingService.criarTimerPerformance('GERAR_RELATORIO_USO');
      
      // Obter estatísticas básicas
      const estatisticas = await metricsCollectorService.obterEstatisticasEscritorio(escritorioId, diasAtras);
      
      // Obter dados detalhados de orçamentos (simulado - implementar consulta real)
      const dadosDetalhados = await this.obterDadosDetalhadosOrcamentos(escritorioId, diasAtras);
      
      const relatorio: RelatorioUso = {
        escritorioId,
        periodo: estatisticas.periodo,
        orcamentos: {
          total: estatisticas.totalOrcamentos,
          sucesso: estatisticas.orcamentosSucesso,
          erro: estatisticas.orcamentosErro,
          taxaSucesso: estatisticas.totalOrcamentos > 0 ? 
            (estatisticas.orcamentosSucesso / estatisticas.totalOrcamentos) * 100 : 0
        },
        performance: {
          tempoMedioGeracao: estatisticas.tempoMedioGeracao,
          tempoMinimoGeracao: dadosDetalhados.tempoMinimo,
          tempoMaximoGeracao: dadosDetalhados.tempoMaximo
        },
        valores: {
          valorMedioOrcamento: estatisticas.valorMedioOrcamento,
          valorTotalOrcamentos: estatisticas.valorMedioOrcamento * estatisticas.orcamentosSucesso,
          faixasValor: this.calcularFaixasValor(dadosDetalhados.valores)
        },
        tipologias: {
          maisUsadas: Object.entries(estatisticas.tipologiasMaisUsadas)
            .map(([nome, quantidade]) => ({ nome, quantidade }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 10),
          distribuicao: estatisticas.tipologiasMaisUsadas
        },
        usuarios: {
          maisAtivos: dadosDetalhados.usuariosMaisAtivos,
          distribuicaoUso: dadosDetalhados.distribuicaoUsuarios
        }
      };
      
      timer.finalizar({ escritorioId, diasAtras });
      
      return relatorio;
      
    } catch (error) {
      loggingService.logOrcamentoError('RELATORIO_USO', error as Error, { escritorioId, diasAtras });
      throw error;
    }
  }

  // Gerar relatório do sistema
  async gerarRelatorioSistema(diasAtras: number = 7): Promise<RelatorioSistema> {
    try {
      const timer = loggingService.criarTimerPerformance('GERAR_RELATORIO_SISTEMA');
      
      const fim = new Date();
      const inicio = new Date();
      inicio.setDate(inicio.getDate() - diasAtras);
      
      // Obter métricas de performance
      const metricasPerformance = await metricsCollectorService.obterMetricasPerformance(diasAtras);
      
      // Obter alertas
      const relatorioAlertas = await alertingService.gerarRelatorioAlertas(diasAtras);
      
      // Calcular métricas de performance
      const temposExecucao = metricasPerformance.map(m => m.tempoExecucao);
      const memoriaUsada = metricasPerformance.map(m => m.memoriaUsada);
      
      const relatorio: RelatorioSistema = {
        timestamp: new Date(),
        periodo: { inicio, fim },
        performance: {
          operacoesPorMinuto: metricasPerformance.length / (diasAtras * 24 * 60),
          tempoMedioResposta: temposExecucao.length > 0 ? 
            temposExecucao.reduce((a, b) => a + b, 0) / temposExecucao.length : 0,
          usoMemoria: memoriaUsada.length > 0 ? 
            memoriaUsada.reduce((a, b) => a + b, 0) / memoriaUsada.length : 0,
          usoCPU: await this.obterUsoCPU()
        },
        alertas: {
          total: relatorioAlertas.resumo.totalAlertas,
          ativos: relatorioAlertas.resumo.alertasAtivos,
          porSeveridade: relatorioAlertas.resumo.porSeveridade,
          porTipo: relatorioAlertas.resumo.porTipo
        },
        recursos: {
          conexoesBanco: await this.obterConexoesBanco(),
          conexoesRedis: await this.obterConexoesRedis(),
          filaProcessamento: await this.obterTamanhoFila()
        },
        erros: {
          totalErros: await this.contarErrosPeriodo(inicio, fim),
          errosPorTipo: await this.obterErrosPorTipo(inicio, fim),
          taxaErro: await this.calcularTaxaErro(inicio, fim)
        }
      };
      
      timer.finalizar({ diasAtras });
      
      return relatorio;
      
    } catch (error) {
      loggingService.logOrcamentoError('RELATORIO_SISTEMA', error as Error, { diasAtras });
      throw error;
    }
  }

  // Gerar relatório de comparação entre escritórios
  async gerarRelatorioComparativo(escritoriosIds: string[], diasAtras: number = 30): Promise<any> {
    try {
      const timer = loggingService.criarTimerPerformance('GERAR_RELATORIO_COMPARATIVO');
      
      const relatorios = await Promise.all(
        escritoriosIds.map(id => this.gerarRelatorioUso(id, diasAtras))
      );
      
      const comparativo = {
        periodo: relatorios[0]?.periodo,
        escritorios: relatorios.length,
        resumo: {
          totalOrcamentos: relatorios.reduce((sum, r) => sum + r.orcamentos.total, 0),
          taxaMediaSucesso: relatorios.reduce((sum, r) => sum + r.orcamentos.taxaSucesso, 0) / relatorios.length,
          tempoMedioGeracao: relatorios.reduce((sum, r) => sum + r.performance.tempoMedioGeracao, 0) / relatorios.length,
          valorMedioOrcamento: relatorios.reduce((sum, r) => sum + r.valores.valorMedioOrcamento, 0) / relatorios.length
        },
        ranking: {
          maisAtivos: relatorios
            .sort((a, b) => b.orcamentos.total - a.orcamentos.total)
            .map(r => ({ escritorioId: r.escritorioId, total: r.orcamentos.total })),
          maisEficientes: relatorios
            .sort((a, b) => a.performance.tempoMedioGeracao - b.performance.tempoMedioGeracao)
            .map(r => ({ escritorioId: r.escritorioId, tempo: r.performance.tempoMedioGeracao })),
          maioresValores: relatorios
            .sort((a, b) => b.valores.valorMedioOrcamento - a.valores.valorMedioOrcamento)
            .map(r => ({ escritorioId: r.escritorioId, valor: r.valores.valorMedioOrcamento }))
        },
        detalhes: relatorios
      };
      
      timer.finalizar({ escritorios: escritoriosIds.length, diasAtras });
      
      return comparativo;
      
    } catch (error) {
      loggingService.logOrcamentoError('RELATORIO_COMPARATIVO', error as Error, { escritoriosIds, diasAtras });
      throw error;
    }
  }

  // Gerar relatório de tendências
  async gerarRelatorioTendencias(escritorioId: string, mesesAtras: number = 6): Promise<any> {
    try {
      const timer = loggingService.criarTimerPerformance('GERAR_RELATORIO_TENDENCIAS');
      
      const tendencias = [];
      
      // Obter dados mês a mês
      for (let i = 0; i < mesesAtras; i++) {
        const fim = new Date();
        fim.setMonth(fim.getMonth() - i);
        fim.setDate(1); // Primeiro dia do mês
        
        const inicio = new Date(fim);
        inicio.setMonth(inicio.getMonth() - 1);
        
        const diasPeriodo = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        const estatisticas = await metricsCollectorService.obterEstatisticasEscritorio(escritorioId, diasPeriodo);
        
        tendencias.push({
          mes: fim.toISOString().substring(0, 7), // YYYY-MM
          orcamentos: estatisticas.totalOrcamentos,
          taxaSucesso: estatisticas.totalOrcamentos > 0 ? 
            (estatisticas.orcamentosSucesso / estatisticas.totalOrcamentos) * 100 : 0,
          tempoMedio: estatisticas.tempoMedioGeracao,
          valorMedio: estatisticas.valorMedioOrcamento
        });
      }
      
      // Calcular tendências
      const relatorio = {
        escritorioId,
        periodo: `${mesesAtras} meses`,
        tendencias: tendencias.reverse(), // Ordem cronológica
        analise: {
          crescimentoOrcamentos: this.calcularCrescimento(tendencias.map(t => t.orcamentos)),
          melhoriaPerformance: this.calcularCrescimento(tendencias.map(t => -t.tempoMedio)), // Negativo porque menor é melhor
          evolucaoTaxaSucesso: this.calcularCrescimento(tendencias.map(t => t.taxaSucesso)),
          evolucaoValorMedio: this.calcularCrescimento(tendencias.map(t => t.valorMedio))
        }
      };
      
      timer.finalizar({ escritorioId, mesesAtras });
      
      return relatorio;
      
    } catch (error) {
      loggingService.logOrcamentoError('RELATORIO_TENDENCIAS', error as Error, { escritorioId, mesesAtras });
      throw error;
    }
  }

  // Métodos auxiliares privados
  private async obterDadosDetalhadosOrcamentos(escritorioId: string, diasAtras: number): Promise<any> {
    // Implementar consulta real ao banco de dados
    // Por enquanto, retornando dados simulados
    return {
      tempoMinimo: 500,
      tempoMaximo: 15000,
      valores: [1000, 2500, 5000, 7500, 10000, 15000, 25000, 50000],
      usuariosMaisAtivos: [
        { userId: 'user1', quantidade: 25 },
        { userId: 'user2', quantidade: 18 },
        { userId: 'user3', quantidade: 12 }
      ],
      distribuicaoUsuarios: {
        'user1': 25,
        'user2': 18,
        'user3': 12,
        'user4': 8
      }
    };
  }

  private calcularFaixasValor(valores: number[]): { [faixa: string]: number } {
    const faixas = {
      'Até R$ 5.000': 0,
      'R$ 5.001 - R$ 15.000': 0,
      'R$ 15.001 - R$ 50.000': 0,
      'R$ 50.001 - R$ 100.000': 0,
      'Acima de R$ 100.000': 0
    };

    valores.forEach(valor => {
      if (valor <= 5000) faixas['Até R$ 5.000']++;
      else if (valor <= 15000) faixas['R$ 5.001 - R$ 15.000']++;
      else if (valor <= 50000) faixas['R$ 15.001 - R$ 50.000']++;
      else if (valor <= 100000) faixas['R$ 50.001 - R$ 100.000']++;
      else faixas['Acima de R$ 100.000']++;
    });

    return faixas;
  }

  private async obterUsoCPU(): Promise<number> {
    // Implementar monitoramento real de CPU
    return Math.random() * 100; // Simulado
  }

  private async obterConexoesBanco(): Promise<number> {
    // Implementar monitoramento real de conexões
    return Math.floor(Math.random() * 20) + 5; // Simulado
  }

  private async obterConexoesRedis(): Promise<number> {
    // Implementar monitoramento real de Redis
    return Math.floor(Math.random() * 10) + 2; // Simulado
  }

  private async obterTamanhoFila(): Promise<number> {
    // Implementar monitoramento real da fila
    return Math.floor(Math.random() * 50); // Simulado
  }

  private async contarErrosPeriodo(inicio: Date, fim: Date): Promise<number> {
    // Implementar contagem real de erros
    return Math.floor(Math.random() * 100); // Simulado
  }

  private async obterErrosPorTipo(inicio: Date, fim: Date): Promise<{ [tipo: string]: number }> {
    // Implementar análise real de erros
    return {
      'BRIEFING_ANALYSIS_ERROR': Math.floor(Math.random() * 20),
      'BUDGET_CALCULATION_ERROR': Math.floor(Math.random() * 15),
      'DATABASE_ERROR': Math.floor(Math.random() * 10),
      'VALIDATION_ERROR': Math.floor(Math.random() * 25)
    };
  }

  private async calcularTaxaErro(inicio: Date, fim: Date): Promise<number> {
    // Implementar cálculo real de taxa de erro
    return Math.random() * 5; // Simulado (0-5%)
  }

  private calcularCrescimento(valores: number[]): number {
    if (valores.length < 2) return 0;
    
    const primeiro = valores[0];
    const ultimo = valores[valores.length - 1];
    
    if (primeiro === 0) return ultimo > 0 ? 100 : 0;
    
    return ((ultimo - primeiro) / primeiro) * 100;
  }
}

export const reportingService = new ReportingService();
export { ReportingService, RelatorioUso, RelatorioSistema };