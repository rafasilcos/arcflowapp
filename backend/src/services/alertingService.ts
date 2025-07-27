import { loggingService } from './loggingService';
import { metricsCollectorService } from './metricsCollectorService';

interface AlertaConfig {
  tipo: 'ERRO_ORCAMENTO' | 'PERFORMANCE_BAIXA' | 'FALHA_SISTEMA' | 'LIMITE_RECURSOS';
  threshold: number;
  janelaTempo: number; // em minutos
  ativo: boolean;
  notificarEmail?: boolean;
  notificarSlack?: boolean;
}

interface Alerta {
  id: string;
  tipo: string;
  severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  titulo: string;
  descricao: string;
  dados: any;
  timestamp: Date;
  resolvido: boolean;
  resolvidoEm?: Date;
  resolvidoPor?: string;
}

class AlertingService {
  private alertasAtivos: Map<string, Alerta> = new Map();
  private configuracoes: Map<string, AlertaConfig> = new Map();
  private contadoresErro: Map<string, { count: number; ultimoReset: Date }> = new Map();

  constructor() {
    this.inicializarConfiguracoes();
    this.iniciarMonitoramento();
  }

  private inicializarConfiguracoes() {
    // Configurações padrão de alertas
    this.configuracoes.set('ERRO_ORCAMENTO', {
      tipo: 'ERRO_ORCAMENTO',
      threshold: 5, // 5 erros em 15 minutos
      janelaTempo: 15,
      ativo: true,
      notificarEmail: true
    });

    this.configuracoes.set('PERFORMANCE_BAIXA', {
      tipo: 'PERFORMANCE_BAIXA',
      threshold: 10000, // 10 segundos
      janelaTempo: 5,
      ativo: true,
      notificarEmail: false
    });

    this.configuracoes.set('FALHA_SISTEMA', {
      tipo: 'FALHA_SISTEMA',
      threshold: 1, // 1 falha crítica
      janelaTempo: 1,
      ativo: true,
      notificarEmail: true,
      notificarSlack: true
    });

    this.configuracoes.set('LIMITE_RECURSOS', {
      tipo: 'LIMITE_RECURSOS',
      threshold: 80, // 80% de uso de memória
      janelaTempo: 5,
      ativo: true,
      notificarEmail: true
    });
  }

  // Registrar erro de orçamento
  async registrarErroOrcamento(briefingId: string, erro: Error, contexto?: any) {
    const chave = 'ERRO_ORCAMENTO';
    const config = this.configuracoes.get(chave);
    
    if (!config || !config.ativo) return;

    // Incrementar contador
    this.incrementarContador(chave);
    
    // Verificar se atingiu threshold
    const contador = this.contadoresErro.get(chave);
    if (contador && contador.count >= config.threshold) {
      await this.criarAlerta({
        tipo: 'ERRO_ORCAMENTO',
        severidade: 'ALTA',
        titulo: 'Múltiplos erros na geração de orçamentos',
        descricao: `${contador.count} erros de orçamento nos últimos ${config.janelaTempo} minutos`,
        dados: {
          ultimoErro: {
            briefingId,
            erro: erro.message,
            contexto
          },
          totalErros: contador.count,
          janelaTempo: config.janelaTempo
        }
      });
      
      // Reset contador
      this.contadoresErro.delete(chave);
    }

    // Log do erro
    loggingService.logOrcamentoError(briefingId, erro, contexto);
  }

  // Registrar problema de performance
  async registrarPerformanceBaixa(operacao: string, tempoExecucao: number, contexto?: any) {
    const chave = 'PERFORMANCE_BAIXA';
    const config = this.configuracoes.get(chave);
    
    if (!config || !config.ativo || tempoExecucao < config.threshold) return;

    await this.criarAlerta({
      tipo: 'PERFORMANCE_BAIXA',
      severidade: 'MEDIA',
      titulo: 'Performance baixa detectada',
      descricao: `Operação ${operacao} levou ${tempoExecucao}ms para executar`,
      dados: {
        operacao,
        tempoExecucao,
        threshold: config.threshold,
        contexto
      }
    });
  }

  // Registrar falha crítica do sistema
  async registrarFalhaSistema(componente: string, erro: Error, contexto?: any) {
    await this.criarAlerta({
      tipo: 'FALHA_SISTEMA',
      severidade: 'CRITICA',
      titulo: `Falha crítica no componente ${componente}`,
      descricao: erro.message,
      dados: {
        componente,
        erro: {
          message: erro.message,
          stack: erro.stack,
          name: erro.name
        },
        contexto
      }
    });
  }

  // Monitorar uso de recursos
  async monitorarRecursos() {
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    const memoryLimitMB = (memoryUsage.heapTotal / 1024 / 1024) * 0.8; // 80% do limite

    if (memoryUsedMB > memoryLimitMB) {
      await this.criarAlerta({
        tipo: 'LIMITE_RECURSOS',
        severidade: 'ALTA',
        titulo: 'Alto uso de memória detectado',
        descricao: `Uso de memória: ${memoryUsedMB.toFixed(2)}MB (${((memoryUsedMB / memoryLimitMB) * 100).toFixed(1)}%)`,
        dados: {
          memoryUsedMB: memoryUsedMB.toFixed(2),
          memoryLimitMB: memoryLimitMB.toFixed(2),
          percentual: ((memoryUsedMB / memoryLimitMB) * 100).toFixed(1)
        }
      });
    }
  }

  // Criar alerta
  private async criarAlerta(dadosAlerta: Omit<Alerta, 'id' | 'timestamp' | 'resolvido'>) {
    const alerta: Alerta = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolvido: false,
      ...dadosAlerta
    };

    // Verificar se já existe alerta similar ativo
    const alertaSimilar = Array.from(this.alertasAtivos.values())
      .find(a => a.tipo === alerta.tipo && !a.resolvido);

    if (alertaSimilar) {
      // Atualizar alerta existente
      alertaSimilar.dados = { ...alertaSimilar.dados, ...alerta.dados };
      alertaSimilar.timestamp = new Date();
    } else {
      // Criar novo alerta
      this.alertasAtivos.set(alerta.id, alerta);
    }

    // Log do alerta
    loggingService.logWorkerOperacao('ALERTING_SERVICE', 'ALERTA_CRIADO', alerta);

    // Enviar notificações
    await this.enviarNotificacoes(alerta);

    return alerta;
  }

  // Resolver alerta
  async resolverAlerta(alertaId: string, resolvidoPor: string) {
    const alerta = this.alertasAtivos.get(alertaId);
    
    if (alerta && !alerta.resolvido) {
      alerta.resolvido = true;
      alerta.resolvidoEm = new Date();
      alerta.resolvidoPor = resolvidoPor;

      loggingService.logWorkerOperacao('ALERTING_SERVICE', 'ALERTA_RESOLVIDO', {
        alertaId,
        resolvidoPor,
        tempoResolucao: alerta.resolvidoEm.getTime() - alerta.timestamp.getTime()
      });
    }
  }

  // Obter alertas ativos
  obterAlertasAtivos(): Alerta[] {
    return Array.from(this.alertasAtivos.values())
      .filter(a => !a.resolvido)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Obter histórico de alertas
  obterHistoricoAlertas(limite: number = 50): Alerta[] {
    return Array.from(this.alertasAtivos.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limite);
  }

  // Incrementar contador de erro
  private incrementarContador(chave: string) {
    const agora = new Date();
    const contador = this.contadoresErro.get(chave);
    const config = this.configuracoes.get(chave);
    
    if (!config) return;

    if (!contador) {
      this.contadoresErro.set(chave, { count: 1, ultimoReset: agora });
    } else {
      // Verificar se precisa resetar contador (janela de tempo expirou)
      const tempoDecorrido = (agora.getTime() - contador.ultimoReset.getTime()) / (1000 * 60); // minutos
      
      if (tempoDecorrido > config.janelaTempo) {
        this.contadoresErro.set(chave, { count: 1, ultimoReset: agora });
      } else {
        contador.count++;
      }
    }
  }

  // Enviar notificações
  private async enviarNotificacoes(alerta: Alerta) {
    const config = this.configuracoes.get(alerta.tipo);
    
    if (!config) return;

    try {
      // Email (simulado - implementar integração real)
      if (config.notificarEmail) {
        await this.enviarNotificacaoEmail(alerta);
      }

      // Slack (simulado - implementar integração real)
      if (config.notificarSlack) {
        await this.enviarNotificacaoSlack(alerta);
      }
    } catch (error) {
      loggingService.logOrcamentoError('NOTIFICACAO_ALERTA', error as Error, { alerta });
    }
  }

  // Enviar notificação por email (simulado)
  private async enviarNotificacaoEmail(alerta: Alerta) {
    // Implementar integração com serviço de email
    loggingService.logWorkerOperacao('ALERTING_SERVICE', 'EMAIL_ENVIADO', {
      alertaId: alerta.id,
      tipo: alerta.tipo,
      severidade: alerta.severidade
    });
  }

  // Enviar notificação para Slack (simulado)
  private async enviarNotificacaoSlack(alerta: Alerta) {
    // Implementar integração com Slack
    loggingService.logWorkerOperacao('ALERTING_SERVICE', 'SLACK_ENVIADO', {
      alertaId: alerta.id,
      tipo: alerta.tipo,
      severidade: alerta.severidade
    });
  }

  // Iniciar monitoramento automático
  private iniciarMonitoramento() {
    // Monitorar recursos a cada 5 minutos
    setInterval(() => {
      this.monitorarRecursos();
    }, 5 * 60 * 1000);

    // Limpar alertas resolvidos antigos a cada hora
    setInterval(() => {
      this.limparAlertasAntigos();
    }, 60 * 60 * 1000);
  }

  // Limpar alertas antigos
  private limparAlertasAntigos() {
    const agora = new Date();
    const limiteTempo = 24 * 60 * 60 * 1000; // 24 horas

    for (const [id, alerta] of this.alertasAtivos.entries()) {
      if (alerta.resolvido && alerta.resolvidoEm) {
        const tempoDecorrido = agora.getTime() - alerta.resolvidoEm.getTime();
        
        if (tempoDecorrido > limiteTempo) {
          this.alertasAtivos.delete(id);
        }
      }
    }
  }

  // Gerar relatório de alertas
  async gerarRelatorioAlertas(diasAtras: number = 7): Promise<any> {
    const agora = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - diasAtras);

    const alertasPeriodo = Array.from(this.alertasAtivos.values())
      .filter(a => a.timestamp >= inicio);

    const relatorio = {
      periodo: {
        inicio: inicio.toISOString(),
        fim: agora.toISOString()
      },
      resumo: {
        totalAlertas: alertasPeriodo.length,
        alertasAtivos: alertasPeriodo.filter(a => !a.resolvido).length,
        alertasResolvidos: alertasPeriodo.filter(a => a.resolvido).length,
        porSeveridade: {
          critica: alertasPeriodo.filter(a => a.severidade === 'CRITICA').length,
          alta: alertasPeriodo.filter(a => a.severidade === 'ALTA').length,
          media: alertasPeriodo.filter(a => a.severidade === 'MEDIA').length,
          baixa: alertasPeriodo.filter(a => a.severidade === 'BAIXA').length
        },
        porTipo: alertasPeriodo.reduce((acc, alerta) => {
          acc[alerta.tipo] = (acc[alerta.tipo] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      },
      alertas: alertasPeriodo.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    };

    return relatorio;
  }
}

export const alertingService = new AlertingService();
export { AlertingService, Alerta, AlertaConfig };