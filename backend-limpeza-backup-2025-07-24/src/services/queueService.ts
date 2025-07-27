import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

interface BudgetGenerationJob {
  briefingId: string;
  userId?: string;
  escritorioId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  retryCount?: number;
  maxRetries?: number;
}

interface JobResult {
  success: boolean;
  orcamentoId?: string;
  error?: string;
  processedAt: string;
  processingTime: number;
}

class QueueService {
  private redis: Redis;
  private readonly QUEUE_KEY = 'budget_generation_queue';
  private readonly PROCESSING_KEY = 'budget_processing';
  private readonly RESULTS_KEY = 'budget_results';
  private readonly FAILED_KEY = 'budget_failed';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    this.redis.on('error', (error) => {
      console.error('[QueueService] Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('[QueueService] Connected to Redis');
    });
  }

  /**
   * Adiciona um job de geração de orçamento à fila
   */
  async addBudgetGenerationJob(job: BudgetGenerationJob): Promise<string> {
    try {
      const jobId = uuidv4();
      const jobData = {
        id: jobId,
        ...job,
        createdAt: new Date().toISOString(),
        status: 'queued',
        retryCount: job.retryCount || 0,
        maxRetries: job.maxRetries || 3
      };

      // Determina a prioridade da fila
      const queueKey = this.getQueueKeyByPriority(job.priority);
      
      // Adiciona o job à fila apropriada
      await this.redis.lpush(queueKey, JSON.stringify(jobData));
      
      // Salva detalhes do job para consulta
      await this.redis.hset(`job:${jobId}`, jobData);
      await this.redis.expire(`job:${jobId}`, 86400); // Expira em 24 horas

      console.log(`[QueueService] Job ${jobId} adicionado à fila ${queueKey}`);
      
      // Notifica workers disponíveis
      await this.redis.publish('budget_queue_notification', JSON.stringify({
        action: 'new_job',
        jobId,
        priority: job.priority,
        briefingId: job.briefingId
      }));

      return jobId;
    } catch (error) {
      console.error('[QueueService] Erro ao adicionar job à fila:', error);
      throw new Error(`Falha ao adicionar job à fila: ${error.message}`);
    }
  }

  /**
   * Obtém o próximo job da fila para processamento
   */
  async getNextJob(): Promise<BudgetGenerationJob & { id: string } | null> {
    try {
      // Verifica filas por ordem de prioridade
      const priorities = ['urgent', 'high', 'normal', 'low'];
      
      for (const priority of priorities) {
        const queueKey = this.getQueueKeyByPriority(priority as any);
        const jobData = await this.redis.brpop(queueKey, 1); // Timeout de 1 segundo
        
        if (jobData && jobData[1]) {
          const job = JSON.parse(jobData[1]);
          
          // Move para fila de processamento
          await this.redis.hset(`${this.PROCESSING_KEY}:${job.id}`, {
            ...job,
            status: 'processing',
            startedAt: new Date().toISOString()
          });
          
          console.log(`[QueueService] Job ${job.id} retirado da fila para processamento`);
          return job;
        }
      }

      return null;
    } catch (error) {
      console.error('[QueueService] Erro ao obter próximo job:', error);
      return null;
    }
  }

  /**
   * Marca um job como concluído com sucesso
   */
  async completeJob(jobId: string, result: JobResult): Promise<void> {
    try {
      // Remove da fila de processamento
      await this.redis.del(`${this.PROCESSING_KEY}:${jobId}`);
      
      // Salva resultado
      await this.redis.hset(`${this.RESULTS_KEY}:${jobId}`, {
        ...result,
        jobId,
        completedAt: new Date().toISOString()
      });
      await this.redis.expire(`${this.RESULTS_KEY}:${jobId}`, 604800); // 7 dias

      // Atualiza status do job
      await this.redis.hset(`job:${jobId}`, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        result: JSON.stringify(result)
      });

      console.log(`[QueueService] Job ${jobId} concluído com sucesso`);
      
      // Notifica conclusão
      await this.redis.publish('budget_job_completed', JSON.stringify({
        jobId,
        success: result.success,
        orcamentoId: result.orcamentoId
      }));
    } catch (error) {
      console.error('[QueueService] Erro ao marcar job como concluído:', error);
    }
  }

  /**
   * Marca um job como falhado
   */
  async failJob(jobId: string, error: string, shouldRetry: boolean = true): Promise<void> {
    try {
      const jobData = await this.redis.hgetall(`job:${jobId}`);
      const retryCount = parseInt(jobData.retryCount || '0');
      const maxRetries = parseInt(jobData.maxRetries || '3');

      if (shouldRetry && retryCount < maxRetries) {
        // Reagenda para retry
        const updatedJob = {
          ...jobData,
          retryCount: retryCount + 1,
          lastError: error,
          lastFailedAt: new Date().toISOString()
        };

        // Adiciona de volta à fila com prioridade reduzida
        const queueKey = this.getQueueKeyByPriority('low');
        await this.redis.lpush(queueKey, JSON.stringify(updatedJob));
        
        console.log(`[QueueService] Job ${jobId} reagendado para retry (${retryCount + 1}/${maxRetries})`);
      } else {
        // Falha definitiva
        await this.redis.hset(`${this.FAILED_KEY}:${jobId}`, {
          ...jobData,
          status: 'failed',
          finalError: error,
          failedAt: new Date().toISOString(),
          retryCount
        });
        await this.redis.expire(`${this.FAILED_KEY}:${jobId}`, 2592000); // 30 dias

        console.log(`[QueueService] Job ${jobId} falhou definitivamente após ${retryCount} tentativas`);
      }

      // Remove da fila de processamento
      await this.redis.del(`${this.PROCESSING_KEY}:${jobId}`);
      
      // Atualiza status do job
      await this.redis.hset(`job:${jobId}`, {
        status: shouldRetry && retryCount < maxRetries ? 'retrying' : 'failed',
        lastError: error,
        retryCount: retryCount + 1
      });

    } catch (err) {
      console.error('[QueueService] Erro ao processar falha do job:', err);
    }
  }

  /**
   * Obtém estatísticas da fila
   */
  async getQueueStats(): Promise<{
    queued: { urgent: number; high: number; normal: number; low: number };
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      const [urgent, high, normal, low, processing] = await Promise.all([
        this.redis.llen(this.getQueueKeyByPriority('urgent')),
        this.redis.llen(this.getQueueKeyByPriority('high')),
        this.redis.llen(this.getQueueKeyByPriority('normal')),
        this.redis.llen(this.getQueueKeyByPriority('low')),
        this.redis.keys(`${this.PROCESSING_KEY}:*`).then(keys => keys.length)
      ]);

      // Conta resultados dos últimos 7 dias
      const completedKeys = await this.redis.keys(`${this.RESULTS_KEY}:*`);
      const failedKeys = await this.redis.keys(`${this.FAILED_KEY}:*`);

      return {
        queued: { urgent, high, normal, low },
        processing,
        completed: completedKeys.length,
        failed: failedKeys.length
      };
    } catch (error) {
      console.error('[QueueService] Erro ao obter estatísticas:', error);
      return {
        queued: { urgent: 0, high: 0, normal: 0, low: 0 },
        processing: 0,
        completed: 0,
        failed: 0
      };
    }
  }

  /**
   * Obtém status de um job específico
   */
  async getJobStatus(jobId: string): Promise<any> {
    try {
      const jobData = await this.redis.hgetall(`job:${jobId}`);
      if (!jobData || Object.keys(jobData).length === 0) {
        return null;
      }

      // Se estiver processando, obtém dados adicionais
      if (jobData.status === 'processing') {
        const processingData = await this.redis.hgetall(`${this.PROCESSING_KEY}:${jobId}`);
        return { ...jobData, ...processingData };
      }

      // Se estiver concluído, obtém resultado
      if (jobData.status === 'completed') {
        const resultData = await this.redis.hgetall(`${this.RESULTS_KEY}:${jobId}`);
        return { ...jobData, result: resultData };
      }

      return jobData;
    } catch (error) {
      console.error('[QueueService] Erro ao obter status do job:', error);
      return null;
    }
  }

  /**
   * Limpa jobs antigos e dados expirados
   */
  async cleanup(): Promise<void> {
    try {
      // Remove jobs concluídos há mais de 7 dias
      const completedKeys = await this.redis.keys(`${this.RESULTS_KEY}:*`);
      for (const key of completedKeys) {
        const data = await this.redis.hgetall(key);
        if (data.completedAt) {
          const completedDate = new Date(data.completedAt);
          const daysDiff = (Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > 7) {
            await this.redis.del(key);
          }
        }
      }

      // Remove jobs falhados há mais de 30 dias
      const failedKeys = await this.redis.keys(`${this.FAILED_KEY}:*`);
      for (const key of failedKeys) {
        const data = await this.redis.hgetall(key);
        if (data.failedAt) {
          const failedDate = new Date(data.failedAt);
          const daysDiff = (Date.now() - failedDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > 30) {
            await this.redis.del(key);
          }
        }
      }

      console.log('[QueueService] Limpeza de dados antigos concluída');
    } catch (error) {
      console.error('[QueueService] Erro na limpeza:', error);
    }
  }

  private getQueueKeyByPriority(priority: 'low' | 'normal' | 'high' | 'urgent'): string {
    return `${this.QUEUE_KEY}:${priority}`;
  }

  /**
   * Fecha conexão Redis
   */
  async disconnect(): Promise<void> {
    await this.redis.disconnect();
  }
}

export const queueService = new QueueService();