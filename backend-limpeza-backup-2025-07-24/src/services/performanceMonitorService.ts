import { loggingService } from './loggingService';
import { alertingService } from './alertingService';
import { metricsCollectorService } from './metricsCollectorService';

interface PerformanceThreshold {
  operacao: string;
  tempoMaximo: number; // em ms
  memoriaMaxima: number; // em bytes
  alertarApos: number; // número de violações antes de alertar
}

interface MonitoringConfig {
  intervalos: {
    coleta: number; // ms
    limpeza: number; // ms
    relatorio: number; // ms
  };
  thresholds: PerformanceThreshold[];
  alertas: {
    habilitado: boolean;
    emailAdmin: boolean;
    slackChannel?: string;
  };
}

class PerformanceMonitorService {
  private config: MonitoringConfig;
  private intervalos: NodeJS.Timeout[] = [];
  private violacoes: Map<string, number> = new Map();
  private ultimaLimpeza: Date = new Date();

  constructor() {
    this.config = this.carregarConfiguracao();
    this.iniciarMonitoramento();
  }

  private carregarConfiguracao(): MonitoringConfig {
    return {
      intervalos: {
        coleta: 30000, // 30 segundos
        limpeza: 3600000, // 1 hora
        relatorio: 86400000 // 24 horas
      },
      thresholds: [
        {
          operacao: 'GERAR_ORCAMENTO',
          tempoMaximo: 10000, // 10 segundos
          memoriaMaxima: 50 * 1024 * 1024, // 50MB
          alertarApos: 3
        },
        {
          operacao: 'ANALISAR_BRIEFING',
          tempoMaximo: 5000, // 5 segundos
          memoriaMaxima: 25 * 1024 * 1024, // 25MB
          alertarApos: 5
        },
        {
          operacao: 'CALCULAR_VALORES',
          tempoMaximo: 3000, // 3 segundos
          memoriaMaxima: 10 * 1024 * 1024, // 10MB
          alertarApos: 5
        },
        {
          operacao: 'DATABASE_QUERY',
          tempoMaximo: 2000, // 2 segundos
          memoriaMaxima: 5 * 1024 * 1024, // 5MB
          alertarApos: 10
        }
      ],
      alertas: {
        habilitado: true,
        emailAdmin: true
      }
    };
  }

  // Iniciar monitoramento automático
  private iniciarMonitoramento() {
    // Coleta de métricas do sistema
    const intervalColeta = setInterval(() => {
      this.coletarMetricasSistema();
    }, this.config.intervalos.coleta);

    // Limpeza de dados antigos
    const intervalLimpeza = setInterval(() => {
      this.executarLimpeza();
    }, this.config.intervalos.limpeza);

    // Geração de relatórios
    const intervalRelatorio = setInterval(() => {
      this.gerarRelatorioPerformance();
    }, this.config.intervalos.relatorio);

    this.intervalos.push(intervalColeta, intervalLimpeza, intervalRelatorio);

    loggingService.logWorkerOperacao('PERFORMANCE_MONITOR', 'MONITORAMENTO_INICIADO', {
      intervalos: this.config.intervalos
    });
  }

  // Coletar métricas do sistema
  private async coletarMetricasSistema() {
    try {
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      // Registrar métricas de sistema
      await metricsCollectorService.registrarMetricaPerformance({
        operacao: 'SYSTEM_METRICS',
        tempoExecucao: 0,
        memoriaUsada: memoryUsage.heapUsed,
        cpuUsado: cpuUsage.user + cpuUsage.system,
        quantidadeRegistros: 1,
        timestamp: new Date()
      });

      // Verificar thresholds de sistema
      await this.verificarThresholdsSistema(memoryUsage);

    } catch (error) {
      loggingService.logOrcamentoError('SYSTEM_METRICS', error as Error);
    }
  }

  // Verificar thresholds do sistema
  private async verificarThresholdsSistema(memoryUsage: NodeJS.MemoryUsage) {
    const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    const memoryLimitMB = 1024; // 1GB

    // Verificar uso de memória
    if (memoryUsedMB > memoryLimitMB * 0.8) { // 80% do limite
      await alertingService.registrarFalhaSistema(
        'HIGH_MEMORY_USAGE',
        new Error(`Alto uso de memória: ${memoryUsedMB.toFixed(2)}MB`),
        {
          memoryUsage,
          percentual: (memoryUsedMB / memoryLimitMB) * 100,
          limite: memoryLimitMB
        }
      );
    }

    // Verificar heap usage
    const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    if (heapUsedPercent > 90) {
      await alertingService.registrarFalhaSistema(
        'HEAP_EXHAUSTION',
        new Error(`Heap quase esgotado: ${heapUsedPercent.toFixed(1)}%`),
        {
          memoryUsage,
          heapUsedPercent
        }
      );
    }
  }

  // Monitorar operação específica
  async monitorarOperacao(operacao: string, funcao: () => Promise<any>): Promise<any> {
    const timer = loggingService.criarTimerPerformance(operacao);
    const memoriaInicial = process.memoryUsage();

    try {
      const resultado = await funcao();
      
      const tempoExecucao = timer.finalizar();
      const memoriaFinal = process.memoryUsage();
      const memoriaUsada = memoriaFinal.heapUsed - memoriaInicial.heapUsed;

      // Verificar thresholds
      await this.verificarThresholds(operacao, tempoExecucao, memoriaUsada);

      // Registrar métrica
      await metricsCollectorService.registrarMetricaPerformance({
        operacao,
        tempoExecucao,
        memoriaUsada,
        quantidadeRegistros: 1,
        timestamp: new Date()
      });

      return resultado;

    } catch (error) {
      const tempoExecucao = timer.finalizar();
      
      // Registrar erro com contexto de performance
      loggingService.logOrcamentoError(operacao, error as Error, {
        tempoExecucao,
        memoriaInicial,
        memoriaFinal: process.memoryUsage()
      });

      throw error;
    }
  }

  // Verificar thresholds de operação
  private async verificarThresholds(operacao: string, tempoExecucao: number, memoriaUsada: number) {
    const threshold = this.config.thresholds.find(t => 
      operacao.includes(t.operacao) || t.operacao === 'ALL'
    );

    if (!threshold) return;

    let violacao = false;
    const detalhes: any = { operacao, tempoExecucao, memoriaUsada };

    // Verificar tempo de execução
    if (tempoExecucao > threshold.tempoMaximo) {
      violacao = true;
      detalhes.violacaoTempo = {
        atual: tempoExecucao,
        limite: threshold.tempoMaximo,
        excesso: tempoExecucao - threshold.tempoMaximo
      };
    }

    // Verificar uso de memória
    if (memoriaUsada > threshold.memoriaMaxima) {
      violacao = true;
      detalhes.violacaoMemoria = {
        atual: memoriaUsada,
        limite: threshold.memoriaMaxima,
        excesso: memoriaUsada - threshold.memoriaMaxima
      };
    }

    if (violacao) {
      // Incrementar contador de violações
      const chave = `${operacao}_${threshold.operacao}`;
      const violacoes = (this.violacoes.get(chave) || 0) + 1;
      this.violacoes.set(chave, violacoes);

      // Alertar se atingiu o threshold
      if (violacoes >= threshold.alertarApos) {
        await alertingService.registrarPerformanceBaixa(
          operacao,
          tempoExecucao,
          {
            ...detalhes,
            violacoesConsecutivas: violacoes,
            threshold
          }
        );

        // Reset contador após alertar
        this.violacoes.set(chave, 0);
      }
    }
  }

  // Executar limpeza de dados antigos
  private async executarLimpeza() {
    try {
      const agora = new Date();
      const tempoDecorrido = agora.getTime() - this.ultimaLimpeza.getTime();
      
      if (tempoDecorrido < this.config.intervalos.limpeza) return;

      // Limpar métricas antigas
      await metricsCollectorService.limparMetricasAntigas();

      // Limpar violações antigas
      this.violacoes.clear();

      this.ultimaLimpeza = agora;

      loggingService.logWorkerOperacao('PERFORMANCE_MONITOR', 'LIMPEZA_EXECUTADA', {
        timestamp: agora.toISOString()
      });

    } catch (error) {
      loggingService.logOrcamentoError('PERFORMANCE_CLEANUP', error as Error);
    }
  }

  // Gerar relatório de performance
  private async gerarRelatorioPerformance() {
    try {
      const metricas = await metricsCollectorService.obterMetricasPerformance(1); // Último dia
      
      if (metricas.length === 0) return;

      // Agrupar por operação
      const operacoes = metricas.reduce((acc, metrica) => {
        if (!acc[metrica.operacao]) {
          acc[metrica.operacao] = [];
        }
        acc[metrica.operacao].push(metrica);
        return acc;
      }, {} as { [operacao: string]: any[] });

      // Calcular estatísticas
      const relatorio = Object.entries(operacoes).map(([operacao, dados]) => {
        const tempos = dados.map(d => d.tempoExecucao);
        const memoria = dados.map(d => d.memoriaUsada);

        return {
          operacao,
          total: dados.length,
          tempoMedio: tempos.reduce((a, b) => a + b, 0) / tempos.length,
          tempoMinimo: Math.min(...tempos),
          tempoMaximo: Math.max(...tempos),
          memoriaMedia: memoria.reduce((a, b) => a + b, 0) / memoria.length,
          memoriaMaxima: Math.max(...memoria)
        };
      });

      loggingService.logWorkerOperacao('PERFORMANCE_MONITOR', 'RELATORIO_GERADO', {
        totalOperacoes: metricas.length,
        operacoesUnicas: Object.keys(operacoes).length,
        relatorio
      });

    } catch (error) {
      loggingService.logOrcamentoError('PERFORMANCE_REPORT', error as Error);
    }
  }

  // Obter estatísticas em tempo real
  async obterEstatisticasTempoReal(): Promise<any> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = process.uptime();

    return {
      timestamp: new Date().toISOString(),
      sistema: {
        uptime: uptime,
        memoria: {
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
          rss: Math.round(memoryUsage.rss / 1024 / 1024) // MB
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        }
      },
      violacoes: Object.fromEntries(this.violacoes),
      thresholds: this.config.thresholds,
      ultimaLimpeza: this.ultimaLimpeza.toISOString()
    };
  }

  // Atualizar configuração
  atualizarConfiguracao(novaConfig: Partial<MonitoringConfig>) {
    this.config = { ...this.config, ...novaConfig };
    
    loggingService.logWorkerOperacao('PERFORMANCE_MONITOR', 'CONFIGURACAO_ATUALIZADA', {
      novaConfig
    });
  }

  // Parar monitoramento
  pararMonitoramento() {
    this.intervalos.forEach(intervalo => clearInterval(intervalo));
    this.intervalos = [];
    
    loggingService.logWorkerOperacao('PERFORMANCE_MONITOR', 'MONITORAMENTO_PARADO', {
      timestamp: new Date().toISOString()
    });
  }
}

export const performanceMonitorService = new PerformanceMonitorService();
export { PerformanceMonitorService, PerformanceThreshold, MonitoringConfig };