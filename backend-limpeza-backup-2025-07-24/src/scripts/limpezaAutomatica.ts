import cron from 'node-cron';
import historicoOrcamentoService from '../services/historicoOrcamentoService';
import auditoriaService from '../services/auditoriaService';

/**
 * Script para limpeza automática de dados antigos
 * Executa diariamente às 2:00 AM
 */

class LimpezaAutomatica {
  private static instance: LimpezaAutomatica;
  private cronJob: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): LimpezaAutomatica {
    if (!LimpezaAutomatica.instance) {
      LimpezaAutomatica.instance = new LimpezaAutomatica();
    }
    return LimpezaAutomatica.instance;
  }

  /**
   * Inicia o agendamento de limpeza automática
   */
  public iniciar(): void {
    if (this.cronJob) {
      console.log('Limpeza automática já está em execução');
      return;
    }

    // Executa todos os dias às 2:00 AM
    this.cronJob = cron.schedule('0 2 * * *', async () => {
      console.log('Iniciando limpeza automática de dados antigos...');
      await this.executarLimpeza();
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });

    console.log('Limpeza automática agendada para executar diariamente às 2:00 AM');
  }

  /**
   * Para o agendamento de limpeza automática
   */
  public parar(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('Limpeza automática parada');
    }
  }

  /**
   * Executa a limpeza de dados antigos
   */
  public async executarLimpeza(): Promise<void> {
    try {
      const inicioLimpeza = new Date();
      console.log(`Iniciando limpeza automática em ${inicioLimpeza.toISOString()}`);

      // Limpar versões antigas de orçamentos (mais de 1 ano)
      const versõesRemovidas = await this.limparVersõesAntigas();

      // Limpar registros antigos de auditoria (mais de 2 anos)
      const registrosRemovidos = await this.limparRegistrosAuditoria();

      // Limpar logs antigos (mais de 6 meses)
      const logsRemovidos = await this.limparLogsAntigos();

      const fimLimpeza = new Date();
      const tempoExecucao = fimLimpeza.getTime() - inicioLimpeza.getTime();

      console.log(`Limpeza automática concluída em ${tempoExecucao}ms:`);
      console.log(`- ${versõesRemovidas} versões de orçamentos removidas`);
      console.log(`- ${registrosRemovidos} registros de auditoria removidos`);
      console.log(`- ${logsRemovidos} logs antigos removidos`);

      // Registrar a execução da limpeza
      await this.registrarExecucaoLimpeza({
        versõesRemovidas,
        registrosRemovidos,
        logsRemovidos,
        tempoExecucao
      });

    } catch (error) {
      console.error('Erro durante limpeza automática:', error);
      
      // Registrar erro na auditoria
      await this.registrarErroLimpeza(error);
    }
  }

  /**
   * Remove versões antigas de orçamentos
   */
  private async limparVersõesAntigas(): Promise<number> {
    try {
      return await historicoOrcamentoService.limparVersõesAntigas();
    } catch (error) {
      console.error('Erro ao limpar versões antigas:', error);
      return 0;
    }
  }

  /**
   * Remove registros antigos de auditoria
   */
  private async limparRegistrosAuditoria(): Promise<number> {
    try {
      return await auditoriaService.limparRegistrosAntigos();
    } catch (error) {
      console.error('Erro ao limpar registros de auditoria:', error);
      return 0;
    }
  }

  /**
   * Remove logs antigos do sistema
   */
  private async limparLogsAntigos(): Promise<number> {
    try {
      // Implementar limpeza de logs se necessário
      // Por enquanto, retorna 0
      return 0;
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      return 0;
    }
  }

  /**
   * Registra a execução bem-sucedida da limpeza
   */
  private async registrarExecucaoLimpeza(resultado: {
    versõesRemovidas: number;
    registrosRemovidos: number;
    logsRemovidos: number;
    tempoExecucao: number;
  }): Promise<void> {
    try {
      // Registrar na auditoria como ação do sistema
      await auditoriaService.registrarAcao(
        'configuracao',
        'limpeza-automatica',
        'atualizacao',
        'sistema',
        'sistema',
        null,
        resultado,
        `Limpeza automática executada com sucesso`
      );
    } catch (error) {
      console.error('Erro ao registrar execução da limpeza:', error);
    }
  }

  /**
   * Registra erro durante a limpeza
   */
  private async registrarErroLimpeza(error: any): Promise<void> {
    try {
      await auditoriaService.registrarAcao(
        'configuracao',
        'limpeza-automatica',
        'atualizacao',
        'sistema',
        'sistema',
        null,
        { erro: error.message },
        `Erro durante limpeza automática: ${error.message}`
      );
    } catch (auditError) {
      console.error('Erro ao registrar erro da limpeza:', auditError);
    }
  }

  /**
   * Executa limpeza manual (para testes ou execução sob demanda)
   */
  public async executarLimpezaManual(): Promise<{
    versõesRemovidas: number;
    registrosRemovidos: number;
    logsRemovidos: number;
    tempoExecucao: number;
  }> {
    const inicioLimpeza = new Date();
    
    const versõesRemovidas = await this.limparVersõesAntigas();
    const registrosRemovidos = await this.limparRegistrosAuditoria();
    const logsRemovidos = await this.limparLogsAntigos();
    
    const fimLimpeza = new Date();
    const tempoExecucao = fimLimpeza.getTime() - inicioLimpeza.getTime();

    const resultado = {
      versõesRemovidas,
      registrosRemovidos,
      logsRemovidos,
      tempoExecucao
    };

    await this.registrarExecucaoLimpeza(resultado);

    return resultado;
  }

  /**
   * Verifica o status do agendamento
   */
  public getStatus(): {
    ativo: boolean;
    proximaExecucao?: Date;
  } {
    if (!this.cronJob) {
      return { ativo: false };
    }

    return {
      ativo: true,
      proximaExecucao: this.cronJob.nextDate()?.toDate()
    };
  }

  /**
   * Configura horário personalizado para limpeza
   */
  public configurarHorario(cronExpression: string): void {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    this.cronJob = cron.schedule(cronExpression, async () => {
      console.log('Iniciando limpeza automática de dados antigos...');
      await this.executarLimpeza();
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });

    console.log(`Limpeza automática reconfigurada com expressão: ${cronExpression}`);
  }
}

// Exportar instância singleton
export default LimpezaAutomatica.getInstance();

// Função para inicializar a limpeza automática no servidor
export const iniciarLimpezaAutomatica = (): void => {
  const limpeza = LimpezaAutomatica.getInstance();
  limpeza.iniciar();
};

// Função para parar a limpeza automática
export const pararLimpezaAutomatica = (): void => {
  const limpeza = LimpezaAutomatica.getInstance();
  limpeza.parar();
};

// Função para executar limpeza manual
export const executarLimpezaManual = async () => {
  const limpeza = LimpezaAutomatica.getInstance();
  return await limpeza.executarLimpezaManual();
};