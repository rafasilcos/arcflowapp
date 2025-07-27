import { Request, Response, NextFunction } from 'express';
import { queueService } from '../services/queueService';
import { triggerService } from '../services/triggerService';

/**
 * Middleware para interceptar atualizações de briefing e disparar triggers automáticos
 */
export const briefingTriggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Intercepta apenas rotas de atualização de briefing
    if (req.method === 'PUT' && req.path.includes('/briefings/')) {
      const briefingId = req.params.id || req.params.briefingId;
      const updateData = req.body;

      // Verifica se o status está sendo alterado para CONCLUIDO
      if (updateData.status === 'CONCLUIDO') {
        console.log(`[BriefingTrigger] Briefing ${briefingId} finalizado, adicionando à fila de orçamento`);
        
        // Adiciona à fila de processamento assíncrono
        await queueService.addBudgetGenerationJob({
          briefingId,
          userId: req.user?.id,
          escritorioId: req.user?.escritorio_id,
          priority: 'normal',
          metadata: {
            triggeredBy: 'status_change',
            timestamp: new Date().toISOString(),
            userAgent: req.get('User-Agent')
          }
        });

        // Registra o trigger para auditoria
        await triggerService.logTriggerEvent({
          type: 'briefing_completed',
          briefingId,
          userId: req.user?.id,
          action: 'budget_generation_queued',
          metadata: {
            previousStatus: updateData.previousStatus || 'unknown',
            newStatus: 'CONCLUIDO'
          }
        });
      }
    }

    next();
  } catch (error) {
    console.error('[BriefingTrigger] Erro no middleware de trigger:', error);
    // Não bloqueia a requisição principal em caso de erro no trigger
    next();
  }
};

/**
 * Middleware específico para interceptar criação de briefings personalizados
 */
export const customBriefingTriggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method === 'POST' && req.path.includes('/briefings/personalizado')) {
      const briefingData = req.body;

      // Se o briefing personalizado já vem com status CONCLUIDO
      if (briefingData.status === 'CONCLUIDO') {
        // Aguarda a criação do briefing para obter o ID
        const originalSend = res.send;
        res.send = function(data) {
          try {
            const responseData = typeof data === 'string' ? JSON.parse(data) : data;
            if (responseData.id) {
              // Adiciona à fila de processamento
              queueService.addBudgetGenerationJob({
                briefingId: responseData.id,
                userId: req.user?.id,
                escritorioId: req.user?.escritorio_id,
                priority: 'normal',
                metadata: {
                  triggeredBy: 'custom_briefing_creation',
                  timestamp: new Date().toISOString(),
                  isCustomBriefing: true
                }
              }).catch(error => {
                console.error('[CustomBriefingTrigger] Erro ao adicionar à fila:', error);
              });
            }
          } catch (error) {
            console.error('[CustomBriefingTrigger] Erro ao processar resposta:', error);
          }
          
          return originalSend.call(this, data);
        };
      }
    }

    next();
  } catch (error) {
    console.error('[CustomBriefingTrigger] Erro no middleware:', error);
    next();
  }
};