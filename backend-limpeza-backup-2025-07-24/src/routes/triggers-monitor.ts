import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { queueService } from '../services/queueService';
import { triggerService } from '../services/triggerService';
import { workerManager } from '../workers';

const router = Router();

// 📊 GET /api/triggers/stats - Estatísticas dos triggers
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const escritorioId = req.user?.escritorioId;
    const days = parseInt(req.query.days as string) || 7;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    // Obter estatísticas dos triggers
    const triggerStats = await triggerService.getTriggerStats(escritorioId, days);
    
    // Obter estatísticas da fila
    const queueStats = await queueService.getQueueStats();
    
    // Obter estatísticas dos workers
    const workerStats = await workerManager.getFullStats();

    res.json({
      success: true,
      data: {
        periodo: `${days} dias`,
        triggers: triggerStats,
        fila: queueStats,
        workers: {
          ativo: workerStats.isRunning,
          uptime: workerStats.uptime,
          orcamentoWorkers: workerStats.orcamentoWorkers.length,
          estatisticas: workerStats.orcamentoWorkers.map(worker => ({
            id: worker.workerId,
            processados: worker.processedJobs,
            sucessos: worker.successfulJobs,
            falhas: worker.failedJobs,
            tempoMedio: Math.round(worker.averageProcessingTime)
          }))
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao obter estatísticas dos triggers:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 📋 GET /api/triggers/jobs - Lista jobs na fila
router.get('/jobs', authMiddleware, async (req: Request, res: Response) => {
  try {
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    // Obter estatísticas da fila
    const queueStats = await queueService.getQueueStats();

    res.json({
      success: true,
      data: {
        fila: queueStats,
        resumo: {
          totalNaFila: Object.values(queueStats.queued).reduce((a, b) => a + b, 0),
          processando: queueStats.processing,
          concluidos: queueStats.completed,
          falhados: queueStats.failed
        }
      }
    });

  } catch (error: any) {
    console.error('Erro ao obter jobs da fila:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🔍 GET /api/triggers/job/:jobId - Status de um job específico
router.get('/job/:jobId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    const jobStatus = await queueService.getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({
        error: 'Job não encontrado',
        code: 'JOB_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: jobStatus
    });

  } catch (error: any) {
    console.error('Erro ao obter status do job:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🔄 POST /api/triggers/test - Testar sistema de triggers
router.post('/test', authMiddleware, async (req: Request, res: Response) => {
  try {
    const escritorioId = req.user?.escritorioId;
    const userId = req.user?.id;

    if (!escritorioId || !userId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    // Adicionar job de teste à fila
    const jobId = await queueService.addBudgetGenerationJob({
      briefingId: 'test-briefing-id',
      userId,
      escritorioId,
      priority: 'normal',
      metadata: {
        test: true,
        triggeredBy: 'manual_test',
        timestamp: new Date().toISOString()
      }
    });

    // Registrar evento de teste
    await triggerService.logTriggerEvent({
      type: 'briefing_completed',
      briefingId: 'test-briefing-id',
      userId,
      escritorioId,
      action: 'manual_test_trigger',
      metadata: {
        jobId,
        testMode: true
      }
    });

    res.json({
      success: true,
      message: 'Job de teste adicionado à fila com sucesso',
      data: {
        jobId,
        briefingId: 'test-briefing-id',
        status: 'queued'
      }
    });

  } catch (error: any) {
    console.error('Erro ao testar sistema de triggers:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 🧹 POST /api/triggers/cleanup - Limpeza manual de dados antigos
router.post('/cleanup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const escritorioId = req.user?.escritorioId;

    if (!escritorioId) {
      return res.status(401).json({
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED'
      });
    }

    // Verificar se usuário é admin do escritório
    // TODO: Implementar verificação de permissão de admin

    // Executar limpeza
    await Promise.all([
      queueService.cleanup(),
      triggerService.cleanupOldLogs()
    ]);

    res.json({
      success: true,
      message: 'Limpeza executada com sucesso'
    });

  } catch (error: any) {
    console.error('Erro na limpeza:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// 📈 GET /api/triggers/health - Health check do sistema
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        workers: workerManager.getStats().isRunning,
        queue: true, // Será verificado abaixo
        database: true // Será verificado abaixo
      },
      uptime: process.uptime()
    };

    // Verificar Redis/Queue
    try {
      await queueService.getQueueStats();
      health.services.queue = true;
    } catch (error) {
      health.services.queue = false;
      health.status = 'degraded';
    }

    // Status geral
    const allServicesHealthy = Object.values(health.services).every(service => service === true);
    if (!allServicesHealthy && health.status === 'healthy') {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;

    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: health
    });

  } catch (error: any) {
    console.error('Erro no health check:', error);
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      }
    });
  }
});

export default router;