import { OrcamentoWorker } from './orcamentoWorker';
import { NotificationWorker } from './notificationWorker';
import { queueService } from '../services/queueService';

class WorkerManager {
  private orcamentoWorkers: OrcamentoWorker[] = [];
  private notificationWorker: NotificationWorker | null = null;
  private isRunning: boolean = false;

  /**
   * Inicia todos os workers
   */
  async start(options: {
    orcamentoWorkers?: number;
    enableNotifications?: boolean;
  } = {}): Promise<void> {
    if (this.isRunning) {
      console.log('[WorkerManager] Workers já estão rodando');
      return;
    }

    this.isRunning = true;
    console.log('[WorkerManager] Iniciando workers...');

    try {
      // Inicia workers de orçamento
      const numOrcamentoWorkers = options.orcamentoWorkers || parseInt(process.env.ORCAMENTO_WORKERS || '2');
      
      for (let i = 0; i < numOrcamentoWorkers; i++) {
        const worker = new OrcamentoWorker(`orcamento-worker-${i + 1}`);
        this.orcamentoWorkers.push(worker);
        
        // Inicia worker em background
        worker.start().catch(error => {
          console.error(`[WorkerManager] Erro no worker de orçamento ${i + 1}:`, error);
        });
      }

      console.log(`[WorkerManager] ${numOrcamentoWorkers} workers de orçamento iniciados`);

      // Inicia worker de notificações se habilitado
      if (options.enableNotifications !== false) {
        this.notificationWorker = new NotificationWorker();
        this.notificationWorker.start().catch(error => {
          console.error('[WorkerManager] Erro no worker de notificações:', error);
        });
        
        console.log('[WorkerManager] Worker de notificações iniciado');
      }

      // Configura limpeza automática
      this.setupCleanupTasks();

      console.log('[WorkerManager] Todos os workers iniciados com sucesso');

    } catch (error) {
      console.error('[WorkerManager] Erro ao iniciar workers:', error);
      throw error;
    }
  }

  /**
   * Para todos os workers
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('[WorkerManager] Workers já estão parados');
      return;
    }

    console.log('[WorkerManager] Parando workers...');

    try {
      // Para workers de orçamento
      const stopPromises = this.orcamentoWorkers.map(worker => worker.shutdown());
      await Promise.all(stopPromises);
      this.orcamentoWorkers = [];

      // Para worker de notificações
      if (this.notificationWorker) {
        await this.notificationWorker.shutdown();
        this.notificationWorker = null;
      }

      this.isRunning = false;
      console.log('[WorkerManager] Todos os workers parados');

    } catch (error) {
      console.error('[WorkerManager] Erro ao parar workers:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de todos os workers
   */
  getStats(): {
    orcamentoWorkers: any[];
    queueStats: any;
    isRunning: boolean;
  } {
    const orcamentoStats = this.orcamentoWorkers.map(worker => worker.getStats());
    
    return {
      orcamentoWorkers: orcamentoStats,
      queueStats: null, // Será preenchido assincronamente
      isRunning: this.isRunning
    };
  }

  /**
   * Obtém estatísticas completas (incluindo fila)
   */
  async getFullStats(): Promise<{
    orcamentoWorkers: any[];
    queueStats: any;
    isRunning: boolean;
    uptime: number;
  }> {
    const orcamentoStats = this.orcamentoWorkers.map(worker => worker.getStats());
    const queueStats = await queueService.getQueueStats();
    
    return {
      orcamentoWorkers: orcamentoStats,
      queueStats,
      isRunning: this.isRunning,
      uptime: this.isRunning ? Date.now() - (orcamentoStats[0]?.startTime || Date.now()) : 0
    };
  }

  /**
   * Configura tarefas de limpeza automática
   */
  private setupCleanupTasks(): void {
    // Limpeza da fila a cada hora
    setInterval(async () => {
      try {
        await queueService.cleanup();
        console.log('[WorkerManager] Limpeza automática da fila executada');
      } catch (error) {
        console.error('[WorkerManager] Erro na limpeza automática:', error);
      }
    }, 60 * 60 * 1000); // 1 hora

    console.log('[WorkerManager] Tarefas de limpeza automática configuradas');
  }

  /**
   * Reinicia um worker específico
   */
  async restartOrcamentoWorker(workerId: string): Promise<void> {
    try {
      const workerIndex = this.orcamentoWorkers.findIndex(w => w.getStats().workerId === workerId);
      
      if (workerIndex === -1) {
        throw new Error(`Worker ${workerId} não encontrado`);
      }

      // Para o worker atual
      await this.orcamentoWorkers[workerIndex].shutdown();

      // Cria e inicia novo worker
      const newWorker = new OrcamentoWorker(workerId);
      this.orcamentoWorkers[workerIndex] = newWorker;
      
      newWorker.start().catch(error => {
        console.error(`[WorkerManager] Erro ao reiniciar worker ${workerId}:`, error);
      });

      console.log(`[WorkerManager] Worker ${workerId} reiniciado com sucesso`);

    } catch (error) {
      console.error(`[WorkerManager] Erro ao reiniciar worker ${workerId}:`, error);
      throw error;
    }
  }

  /**
   * Adiciona worker adicional de orçamento
   */
  async addOrcamentoWorker(): Promise<string> {
    try {
      const workerId = `orcamento-worker-${this.orcamentoWorkers.length + 1}`;
      const worker = new OrcamentoWorker(workerId);
      
      this.orcamentoWorkers.push(worker);
      
      worker.start().catch(error => {
        console.error(`[WorkerManager] Erro no novo worker ${workerId}:`, error);
      });

      console.log(`[WorkerManager] Novo worker ${workerId} adicionado`);
      return workerId;

    } catch (error) {
      console.error('[WorkerManager] Erro ao adicionar worker:', error);
      throw error;
    }
  }

  /**
   * Remove worker de orçamento
   */
  async removeOrcamentoWorker(workerId: string): Promise<void> {
    try {
      const workerIndex = this.orcamentoWorkers.findIndex(w => w.getStats().workerId === workerId);
      
      if (workerIndex === -1) {
        throw new Error(`Worker ${workerId} não encontrado`);
      }

      if (this.orcamentoWorkers.length <= 1) {
        throw new Error('Não é possível remover o último worker');
      }

      // Para e remove o worker
      await this.orcamentoWorkers[workerIndex].shutdown();
      this.orcamentoWorkers.splice(workerIndex, 1);

      console.log(`[WorkerManager] Worker ${workerId} removido`);

    } catch (error) {
      console.error(`[WorkerManager] Erro ao remover worker ${workerId}:`, error);
      throw error;
    }
  }
}

// Instância singleton
export const workerManager = new WorkerManager();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[WorkerManager] Recebido SIGTERM, parando workers...');
  await workerManager.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[WorkerManager] Recebido SIGINT, parando workers...');
  await workerManager.stop();
  process.exit(0);
});

export { OrcamentoWorker, NotificationWorker };