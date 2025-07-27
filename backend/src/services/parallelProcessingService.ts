/**
 * Serviço de Processamento Paralelo para Análise de Briefings
 * Tarefa 13: Implementar otimizações de performance
 */

import { Worker } from 'worker_threads';
import { cpus } from 'os';
import path from 'path';

interface ProcessingTask {
  id: string;
  type: 'briefing_analysis' | 'budget_calculation' | 'adaptive_parsing';
  data: any;
  priority: 'low' | 'normal' | 'high';
  timeout?: number;
}

interface ProcessingResult {
  taskId: string;
  success: boolean;
  result?: any;
  error?: string;
  processingTime: number;
}

interface WorkerInfo {
  id: string;
  worker: Worker;
  busy: boolean;
  currentTask?: string;
  tasksCompleted: number;
  startTime: number;
}

class ParallelProcessingService {
  private workers: Map<string, WorkerInfo> = new Map();
  private taskQueue: ProcessingTask[] = [];
  private processingTasks: Map<string, ProcessingTask> = new Map();
  private maxWorkers: number;
  private workerScript: string;

  constructor() {
    this.maxWorkers = Math.min(cpus().length, 4); // Máximo 4 workers
    this.workerScript = path.join(__dirname, '../workers/analysisWorker.js');
    this.initializeWorkers();
  }

  private initializeWorkers(): void {
    console.log(`🚀 Inicializando ${this.maxWorkers} workers para processamento paralelo`);

    for (let i = 0; i < this.maxWorkers; i++) {
      this.createWorker(`worker-${i + 1}`);
    }
  }

  private createWorker(workerId: string): void {
    try {
      const worker = new Worker(this.workerScript);
      
      const workerInfo: WorkerInfo = {
        id: workerId,
        worker,
        busy: false,
        tasksCompleted: 0,
        startTime: Date.now()
      };

      // Event handlers
      worker.on('message', (result: ProcessingResult) => {
        this.handleWorkerResult(workerId, result);
      });

      worker.on('error', (error) => {
        console.error(`❌ Erro no worker ${workerId}:`, error);
        this.handleWorkerError(workerId, error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`⚠️  Worker ${workerId} saiu com código ${code}`);
          // Recriar worker se necessário
          setTimeout(() => this.createWorker(workerId), 1000);
        }
      });

      this.workers.set(workerId, workerInfo);
      console.log(`✅ Worker ${workerId} criado`);

    } catch (error) {
      console.error(`❌ Erro ao criar worker ${workerId}:`, error);
    }
  }

  /**
   * Processar Briefing com Análise Paralela
   */
  async processBriefingAnalysis(briefingId: string, briefingData: any): Promise<any> {
    const tasks: ProcessingTask[] = [
      {
        id: `${briefingId}-area-analysis`,
        type: 'briefing_analysis',
        data: { briefingId, type: 'area_extraction', data: briefingData },
        priority: 'high'
      },
      {
        id: `${briefingId}-tipologia-analysis`,
        type: 'briefing_analysis', 
        data: { briefingId, type: 'tipologia_identification', data: briefingData },
        priority: 'high'
      },
      {
        id: `${briefingId}-complexity-analysis`,
        type: 'briefing_analysis',
        data: { briefingId, type: 'complexity_calculation', data: briefingData },
        priority: 'normal'
      },
      {
        id: `${briefingId}-disciplines-analysis`,
        type: 'briefing_analysis',
        data: { briefingId, type: 'disciplines_identification', data: briefingData },
        priority: 'normal'
      }
    ];

    // Processar tarefas em paralelo
    const results = await this.processTasksBatch(tasks);
    
    // Combinar resultados
    return this.combineAnalysisResults(results);
  }

  /**
   * Processar Briefing Personalizado com Parser Adaptativo
   */
  async processCustomBriefing(briefingId: string, customData: any): Promise<any> {
    const tasks: ProcessingTask[] = [
      {
        id: `${briefingId}-field-mapping`,
        type: 'adaptive_parsing',
        data: { briefingId, type: 'field_mapping', data: customData },
        priority: 'high'
      },
      {
        id: `${briefingId}-data-extraction`,
        type: 'adaptive_parsing',
        data: { briefingId, type: 'data_extraction', data: customData },
        priority: 'high'
      },
      {
        id: `${briefingId}-validation`,
        type: 'adaptive_parsing',
        data: { briefingId, type: 'data_validation', data: customData },
        priority: 'normal'
      }
    ];

    const results = await this.processTasksBatch(tasks);
    return this.combineParsingResults(results);
  }

  /**
   * Processar Cálculo de Orçamento em Paralelo
   */
  async processBudgetCalculation(briefingId: string, analysisData: any, configurations: any): Promise<any> {
    const tasks: ProcessingTask[] = [
      {
        id: `${briefingId}-hours-calculation`,
        type: 'budget_calculation',
        data: { briefingId, type: 'hours_calculation', analysisData, configurations },
        priority: 'high'
      },
      {
        id: `${briefingId}-values-calculation`,
        type: 'budget_calculation',
        data: { briefingId, type: 'values_calculation', analysisData, configurations },
        priority: 'high'
      },
      {
        id: `${briefingId}-multipliers-application`,
        type: 'budget_calculation',
        data: { briefingId, type: 'multipliers_application', analysisData, configurations },
        priority: 'normal'
      },
      {
        id: `${briefingId}-timeline-distribution`,
        type: 'budget_calculation',
        data: { briefingId, type: 'timeline_distribution', analysisData, configurations },
        priority: 'low'
      }
    ];

    const results = await this.processTasksBatch(tasks);
    return this.combineBudgetResults(results);
  }

  /**
   * Processar Lote de Tarefas
   */
  private async processTasksBatch(tasks: ProcessingTask[]): Promise<ProcessingResult[]> {
    return new Promise((resolve, reject) => {
      const results: ProcessingResult[] = [];
      let completedTasks = 0;
      const totalTasks = tasks.length;
      const timeout = 30000; // 30 segundos

      // Timeout geral
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout: ${totalTasks - completedTasks} tarefas não completadas`));
      }, timeout);

      // Callback para cada tarefa completada
      const onTaskComplete = (result: ProcessingResult) => {
        results.push(result);
        completedTasks++;

        if (completedTasks === totalTasks) {
          clearTimeout(timeoutId);
          resolve(results);
        }
      };

      // Adicionar tarefas à fila
      for (const task of tasks) {
        this.addTask(task, onTaskComplete);
      }
    });
  }

  /**
   * Adicionar Tarefa à Fila
   */
  private addTask(task: ProcessingTask, callback: (result: ProcessingResult) => void): void {
    // Adicionar callback à tarefa
    (task as any).callback = callback;
    
    // Adicionar à fila baseado na prioridade
    if (task.priority === 'high') {
      this.taskQueue.unshift(task);
    } else {
      this.taskQueue.push(task);
    }

    // Tentar processar imediatamente
    this.processNextTask();
  }

  /**
   * Processar Próxima Tarefa
   */
  private processNextTask(): void {
    if (this.taskQueue.length === 0) return;

    // Encontrar worker disponível
    const availableWorker = Array.from(this.workers.values()).find(w => !w.busy);
    if (!availableWorker) return;

    const task = this.taskQueue.shift();
    if (!task) return;

    // Marcar worker como ocupado
    availableWorker.busy = true;
    availableWorker.currentTask = task.id;
    this.processingTasks.set(task.id, task);

    // Enviar tarefa para worker
    availableWorker.worker.postMessage(task);

    console.log(`📤 Tarefa ${task.id} enviada para ${availableWorker.id}`);
  }

  /**
   * Tratar Resultado do Worker
   */
  private handleWorkerResult(workerId: string, result: ProcessingResult): void {
    const workerInfo = this.workers.get(workerId);
    const task = this.processingTasks.get(result.taskId);

    if (!workerInfo || !task) return;

    // Liberar worker
    workerInfo.busy = false;
    workerInfo.currentTask = undefined;
    workerInfo.tasksCompleted++;

    // Remover tarefa da lista de processamento
    this.processingTasks.delete(result.taskId);

    // Chamar callback se existir
    if ((task as any).callback) {
      (task as any).callback(result);
    }

    console.log(`📥 Resultado recebido de ${workerId}: ${result.taskId} (${result.processingTime}ms)`);

    // Processar próxima tarefa
    this.processNextTask();
  }

  /**
   * Tratar Erro do Worker
   */
  private handleWorkerError(workerId: string, error: Error): void {
    const workerInfo = this.workers.get(workerId);
    if (!workerInfo) return;

    // Se havia tarefa em processamento, marcar como erro
    if (workerInfo.currentTask) {
      const task = this.processingTasks.get(workerInfo.currentTask);
      if (task && (task as any).callback) {
        (task as any).callback({
          taskId: workerInfo.currentTask,
          success: false,
          error: error.message,
          processingTime: 0
        });
      }

      this.processingTasks.delete(workerInfo.currentTask);
    }

    // Liberar worker
    workerInfo.busy = false;
    workerInfo.currentTask = undefined;
  }

  /**
   * Combinar Resultados de Análise
   */
  private combineAnalysisResults(results: ProcessingResult[]): any {
    const combined: any = {
      success: true,
      data: {},
      errors: [],
      processingTime: 0
    };

    for (const result of results) {
      combined.processingTime += result.processingTime;

      if (result.success && result.result) {
        Object.assign(combined.data, result.result);
      } else {
        combined.errors.push({
          taskId: result.taskId,
          error: result.error
        });
      }
    }

    combined.success = combined.errors.length === 0;
    return combined;
  }

  /**
   * Combinar Resultados de Parsing
   */
  private combineParsingResults(results: ProcessingResult[]): any {
    const combined: any = {
      success: true,
      mappedFields: {},
      extractedData: {},
      validationResults: {},
      errors: [],
      processingTime: 0
    };

    for (const result of results) {
      combined.processingTime += result.processingTime;

      if (result.success && result.result) {
        if (result.taskId.includes('field-mapping')) {
          combined.mappedFields = result.result;
        } else if (result.taskId.includes('data-extraction')) {
          combined.extractedData = result.result;
        } else if (result.taskId.includes('validation')) {
          combined.validationResults = result.result;
        }
      } else {
        combined.errors.push({
          taskId: result.taskId,
          error: result.error
        });
      }
    }

    combined.success = combined.errors.length === 0;
    return combined;
  }

  /**
   * Combinar Resultados de Orçamento
   */
  private combineBudgetResults(results: ProcessingResult[]): any {
    const combined: any = {
      success: true,
      horasCalculadas: {},
      valoresCalculados: {},
      multiplicadoresAplicados: {},
      distribuicaoTemporal: {},
      errors: [],
      processingTime: 0
    };

    for (const result of results) {
      combined.processingTime += result.processingTime;

      if (result.success && result.result) {
        if (result.taskId.includes('hours-calculation')) {
          combined.horasCalculadas = result.result;
        } else if (result.taskId.includes('values-calculation')) {
          combined.valoresCalculados = result.result;
        } else if (result.taskId.includes('multipliers-application')) {
          combined.multiplicadoresAplicados = result.result;
        } else if (result.taskId.includes('timeline-distribution')) {
          combined.distribuicaoTemporal = result.result;
        }
      } else {
        combined.errors.push({
          taskId: result.taskId,
          error: result.error
        });
      }
    }

    combined.success = combined.errors.length === 0;
    return combined;
  }

  /**
   * Estatísticas e Monitoramento
   */
  getWorkerStats(): any {
    const stats = {
      totalWorkers: this.workers.size,
      busyWorkers: 0,
      queueSize: this.taskQueue.length,
      processingTasks: this.processingTasks.size,
      workers: [] as any[]
    };

    for (const [id, worker] of this.workers) {
      if (worker.busy) stats.busyWorkers++;

      stats.workers.push({
        id,
        busy: worker.busy,
        currentTask: worker.currentTask,
        tasksCompleted: worker.tasksCompleted,
        uptime: Date.now() - worker.startTime
      });
    }

    return stats;
  }

  /**
   * Limpeza e Encerramento
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Encerrando workers...');

    const shutdownPromises = Array.from(this.workers.values()).map(worker => {
      return new Promise<void>((resolve) => {
        worker.worker.once('exit', () => resolve());
        worker.worker.terminate();
      });
    });

    await Promise.all(shutdownPromises);
    this.workers.clear();
    this.taskQueue.length = 0;
    this.processingTasks.clear();

    console.log('✅ Todos os workers foram encerrados');
  }
}

// Instância singleton
let processingInstance: ParallelProcessingService | null = null;

export function createParallelProcessingService(): ParallelProcessingService {
  if (!processingInstance) {
    processingInstance = new ParallelProcessingService();
  }
  return processingInstance;
}

export { ParallelProcessingService };
export default createParallelProcessingService;