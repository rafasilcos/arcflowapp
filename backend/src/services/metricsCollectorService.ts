import { createClient } from 'redis';
import { loggingService } from './loggingService';

interface MetricaOrcamento {
  escritorioId: string;
  briefingId: string;
  orcamentoId: string;
  tempoGeracao: number;
  valorTotal: number;
  tipologia: string;
  complexidade: string;
  sucesso: boolean;
  erro?: string;
  timestamp: Date;
}

interface MetricaPerformance {
  operacao: string;
  tempoExecucao: number;
  memoriaUsada: number;
  cpuUsado?: number;
  quantidadeRegistros: number;
  timestamp: Date;
}

interface EstatisticasEscritorio {
  escritorioId: string;
  totalOrcamentos: number;
  orcamentosSucesso: number;
  orcamentosErro: number;
  tempoMedioGeracao: number;
  valorMedioOrcamento: number;
  tipologiasMaisUsadas: { [key: string]: number };
  periodo: { inicio: Date; fim: Date };
}

class MetricsCollectorService {
  private redisClient: any;

  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.redisClient.on('error', (err: any) => {
      loggingService.logOrcamentoError('REDIS_CONNECTION', err);
    });
  }

  async conectar() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect();
    }
  }

  // Registrar métrica de orçamento
  async registrarMetricaOrcamento(metrica: MetricaOrcamento) {
    try {
      await this.conectar();
      
      const chave = `metricas:orcamento:${metrica.escritorioId}:${new Date().toISOString().split('T')[0]}`;
      
      // Armazenar métrica individual
      await this.redisClient.lPush(chave, JSON.stringify(metrica));
      
      // Definir TTL de 90 dias
      await this.redisClient.expire(chave, 90 * 24 * 60 * 60);
      
      // Atualizar contadores globais
      await this.atualizarContadoresGlobais(metrica);
      
      loggingService.logPerformance({
        operacao: 'REGISTRAR_METRICA_ORCAMENTO',
        tempoExecucao: 0,
        escritorioId: metrica.escritorioId
      });
      
    } catch (error) {
      loggingService.logOrcamentoError('METRICS_COLLECTOR', error as Error, { metrica });
    }
  }

  // Registrar métrica de performance
  async registrarMetricaPerformance(metrica: MetricaPerformance) {
    try {
      await this.conectar();
      
      const chave = `metricas:performance:${new Date().toISOString().split('T')[0]}`;
      
      await this.redisClient.lPush(chave, JSON.stringify(metrica));
      await this.redisClient.expire(chave, 30 * 24 * 60 * 60); // 30 dias
      
    } catch (error) {
      loggingService.logOrcamentoError('METRICS_PERFORMANCE', error as Error, { metrica });
    }
  }

  // Atualizar contadores globais
  private async atualizarContadoresGlobais(metrica: MetricaOrcamento) {
    const hoje = new Date().toISOString().split('T')[0];
    const chaveContadores = `contadores:${metrica.escritorioId}:${hoje}`;
    
    // Incrementar contadores
    await this.redisClient.hIncrBy(chaveContadores, 'total_orcamentos', 1);
    
    if (metrica.sucesso) {
      await this.redisClient.hIncrBy(chaveContadores, 'orcamentos_sucesso', 1);
      await this.redisClient.hIncrBy(chaveContadores, 'tempo_total_geracao', metrica.tempoGeracao);
      await this.redisClient.hIncrBy(chaveContadores, 'valor_total_orcamentos', Math.round(metrica.valorTotal * 100)); // Centavos
    } else {
      await this.redisClient.hIncrBy(chaveContadores, 'orcamentos_erro', 1);
    }
    
    // Incrementar contador de tipologia
    await this.redisClient.hIncrBy(chaveContadores, `tipologia_${metrica.tipologia}`, 1);
    
    // TTL de 90 dias
    await this.redisClient.expire(chaveContadores, 90 * 24 * 60 * 60);
  }

  // Obter estatísticas de escritório
  async obterEstatisticasEscritorio(escritorioId: string, diasAtras: number = 30): Promise<EstatisticasEscritorio> {
    try {
      await this.conectar();
      
      const fim = new Date();
      const inicio = new Date();
      inicio.setDate(inicio.getDate() - diasAtras);
      
      let totalOrcamentos = 0;
      let orcamentosSucesso = 0;
      let orcamentosErro = 0;
      let tempoTotalGeracao = 0;
      let valorTotalOrcamentos = 0;
      const tipologias: { [key: string]: number } = {};
      
      // Iterar pelos dias do período
      for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
        const dia = d.toISOString().split('T')[0];
        const chaveContadores = `contadores:${escritorioId}:${dia}`;
        
        const contadores = await this.redisClient.hGetAll(chaveContadores);
        
        if (contadores && Object.keys(contadores).length > 0) {
          totalOrcamentos += parseInt(contadores.total_orcamentos || '0');
          orcamentosSucesso += parseInt(contadores.orcamentos_sucesso || '0');
          orcamentosErro += parseInt(contadores.orcamentos_erro || '0');
          tempoTotalGeracao += parseInt(contadores.tempo_total_geracao || '0');
          valorTotalOrcamentos += parseInt(contadores.valor_total_orcamentos || '0');
          
          // Agregar tipologias
          Object.keys(contadores).forEach(chave => {
            if (chave.startsWith('tipologia_')) {
              const tipologia = chave.replace('tipologia_', '');
              tipologias[tipologia] = (tipologias[tipologia] || 0) + parseInt(contadores[chave]);
            }
          });
        }
      }
      
      return {
        escritorioId,
        totalOrcamentos,
        orcamentosSucesso,
        orcamentosErro,
        tempoMedioGeracao: orcamentosSucesso > 0 ? tempoTotalGeracao / orcamentosSucesso : 0,
        valorMedioOrcamento: orcamentosSucesso > 0 ? (valorTotalOrcamentos / 100) / orcamentosSucesso : 0,
        tipologiasMaisUsadas: tipologias,
        periodo: { inicio, fim }
      };
      
    } catch (error) {
      loggingService.logOrcamentoError('ESTATISTICAS_ESCRITORIO', error as Error, { escritorioId });
      throw error;
    }
  }

  // Obter métricas de performance do sistema
  async obterMetricasPerformance(diasAtras: number = 7): Promise<MetricaPerformance[]> {
    try {
      await this.conectar();
      
      const metricas: MetricaPerformance[] = [];
      
      for (let i = 0; i < diasAtras; i++) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        const dia = data.toISOString().split('T')[0];
        
        const chave = `metricas:performance:${dia}`;
        const metricasDia = await this.redisClient.lRange(chave, 0, -1);
        
        metricasDia.forEach((metricaStr: string) => {
          try {
            const metrica = JSON.parse(metricaStr);
            metricas.push(metrica);
          } catch (parseError) {
            // Ignorar métricas com erro de parse
          }
        });
      }
      
      return metricas.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
    } catch (error) {
      loggingService.logOrcamentoError('METRICAS_PERFORMANCE', error as Error);
      return [];
    }
  }

  // Limpar métricas antigas
  async limparMetricasAntigas() {
    try {
      await this.conectar();
      
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 90);
      
      // Buscar chaves antigas
      const chavesMetricas = await this.redisClient.keys('metricas:*');
      const chavesContadores = await this.redisClient.keys('contadores:*');
      
      let chavesRemovidas = 0;
      
      for (const chave of [...chavesMetricas, ...chavesContadores]) {
        // Extrair data da chave
        const partesChave = chave.split(':');
        const dataChave = partesChave[partesChave.length - 1];
        
        if (dataChave.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const dataMetrica = new Date(dataChave);
          
          if (dataMetrica < dataLimite) {
            await this.redisClient.del(chave);
            chavesRemovidas++;
          }
        }
      }
      
      loggingService.logWorkerOperacao('METRICS_CLEANER', 'LIMPEZA_CONCLUIDA', {
        chavesRemovidas,
        dataLimite: dataLimite.toISOString()
      });
      
    } catch (error) {
      loggingService.logOrcamentoError('LIMPEZA_METRICAS', error as Error);
    }
  }

  // Gerar relatório de saúde do sistema
  async gerarRelatorioSaude(): Promise<any> {
    try {
      await this.conectar();
      
      const agora = new Date();
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      
      // Métricas das últimas 24 horas
      const metricasPerformance = await this.obterMetricasPerformance(1);
      
      // Calcular médias
      const temposExecucao = metricasPerformance.map(m => m.tempoExecucao);
      const memoriaUsada = metricasPerformance.map(m => m.memoriaUsada);
      
      const relatorio = {
        timestamp: agora.toISOString(),
        periodo: {
          inicio: ontem.toISOString(),
          fim: agora.toISOString()
        },
        performance: {
          totalOperacoes: metricasPerformance.length,
          tempoMedioExecucao: temposExecucao.length > 0 ? 
            temposExecucao.reduce((a, b) => a + b, 0) / temposExecucao.length : 0,
          memoriaMediaUsada: memoriaUsada.length > 0 ? 
            memoriaUsada.reduce((a, b) => a + b, 0) / memoriaUsada.length : 0,
          operacaoMaisLenta: Math.max(...temposExecucao, 0),
          operacaoMaisRapida: Math.min(...temposExecucao, 0)
        },
        redis: {
          conectado: this.redisClient.isOpen,
          memoria: await this.redisClient.memory('usage') || 0
        }
      };
      
      return relatorio;
      
    } catch (error) {
      loggingService.logOrcamentoError('RELATORIO_SAUDE', error as Error);
      return null;
    }
  }
}

export const metricsCollectorService = new MetricsCollectorService();
export { MetricsCollectorService, MetricaOrcamento, MetricaPerformance, EstatisticasEscritorio };