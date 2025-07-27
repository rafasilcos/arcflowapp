import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TriggerEvent {
  type: 'briefing_completed' | 'budget_generated' | 'budget_failed' | 'configuration_changed';
  briefingId?: string;
  orcamentoId?: string;
  userId?: string;
  escritorioId?: string;
  action: string;
  metadata?: Record<string, any>;
}

interface NotificationPayload {
  userId: string;
  type: 'budget_generated' | 'budget_failed' | 'budget_processing';
  title: string;
  message: string;
  data?: Record<string, any>;
}

class TriggerService {
  /**
   * Registra evento de trigger para auditoria
   */
  async logTriggerEvent(event: TriggerEvent): Promise<void> {
    try {
      // Salva no banco de dados para auditoria
      await prisma.$executeRaw`
        INSERT INTO trigger_logs (
          type, briefing_id, orcamento_id, user_id, escritorio_id, 
          action, metadata, created_at
        ) VALUES (
          ${event.type}, ${event.briefingId}, ${event.orcamentoId}, 
          ${event.userId}, ${event.escritorioId}, ${event.action}, 
          ${JSON.stringify(event.metadata || {})}, NOW()
        )
      `;

      console.log(`[TriggerService] Evento ${event.type} registrado para auditoria`);
    } catch (error) {
      console.error('[TriggerService] Erro ao registrar evento de trigger:', error);
      // Não propaga erro para não afetar fluxo principal
    }
  }

  /**
   * Processa trigger automático quando briefing é finalizado
   */
  async processBriefingCompletedTrigger(briefingId: string, userId?: string): Promise<void> {
    try {
      console.log(`[TriggerService] Processando trigger para briefing ${briefingId}`);

      // Busca dados do briefing
      const briefing = await prisma.briefings.findUnique({
        where: { id: briefingId },
        include: {
          user: true,
          escritorio: true
        }
      });

      if (!briefing) {
        throw new Error(`Briefing ${briefingId} não encontrado`);
      }

      // Verifica se já tem orçamento gerado
      if (briefing.orcamento_gerado) {
        console.log(`[TriggerService] Briefing ${briefingId} já possui orçamento gerado`);
        return;
      }

      // Registra início do processamento
      await this.logTriggerEvent({
        type: 'briefing_completed',
        briefingId,
        userId: userId || briefing.created_by,
        escritorioId: briefing.escritorio_id,
        action: 'trigger_processing_started',
        metadata: {
          briefingType: briefing.tipo_briefing,
          briefingStatus: briefing.status,
          hasCustomData: !!briefing.dados_personalizados
        }
      });

      // Atualiza status do briefing para indicar processamento
      await prisma.briefings.update({
        where: { id: briefingId },
        data: {
          orcamento_em_processamento: true,
          ultima_analise: new Date()
        }
      });

      console.log(`[TriggerService] Trigger processado com sucesso para briefing ${briefingId}`);

    } catch (error) {
      console.error(`[TriggerService] Erro ao processar trigger para briefing ${briefingId}:`, error);
      
      // Registra erro
      await this.logTriggerEvent({
        type: 'briefing_completed',
        briefingId,
        userId,
        action: 'trigger_processing_failed',
        metadata: {
          error: error.message,
          stack: error.stack
        }
      });

      throw error;
    }
  }

  /**
   * Processa notificação quando orçamento é gerado com sucesso
   */
  async processBudgetGeneratedTrigger(orcamentoId: string, briefingId: string): Promise<void> {
    try {
      console.log(`[TriggerService] Processando trigger de orçamento gerado: ${orcamentoId}`);

      // Busca dados do orçamento e briefing
      const [orcamento, briefing] = await Promise.all([
        prisma.orcamentos.findUnique({
          where: { id: orcamentoId }
        }),
        prisma.briefings.findUnique({
          where: { id: briefingId },
          include: {
            user: true,
            escritorio: true
          }
        })
      ]);

      if (!orcamento || !briefing) {
        throw new Error('Orçamento ou briefing não encontrado');
      }

      // Atualiza briefing
      await prisma.briefings.update({
        where: { id: briefingId },
        data: {
          orcamento_gerado: true,
          orcamento_id: orcamentoId,
          orcamento_em_processamento: false
        }
      });

      // Envia notificação para o usuário
      await this.sendNotification({
        userId: briefing.created_by,
        type: 'budget_generated',
        title: 'Orçamento Gerado com Sucesso',
        message: `O orçamento para o projeto "${briefing.nome_projeto}" foi gerado automaticamente.`,
        data: {
          briefingId,
          orcamentoId,
          valorTotal: orcamento.valor_total,
          horasTotal: orcamento.horas_total
        }
      });

      // Registra evento
      await this.logTriggerEvent({
        type: 'budget_generated',
        briefingId,
        orcamentoId,
        userId: briefing.created_by,
        escritorioId: briefing.escritorio_id,
        action: 'budget_generated_successfully',
        metadata: {
          valorTotal: orcamento.valor_total,
          horasTotal: orcamento.horas_total,
          disciplinas: orcamento.disciplinas_incluidas
        }
      });

      console.log(`[TriggerService] Trigger de orçamento gerado processado com sucesso`);

    } catch (error) {
      console.error('[TriggerService] Erro ao processar trigger de orçamento gerado:', error);
      throw error;
    }
  }

  /**
   * Processa notificação quando geração de orçamento falha
   */
  async processBudgetFailedTrigger(briefingId: string, error: string): Promise<void> {
    try {
      console.log(`[TriggerService] Processando trigger de falha na geração de orçamento`);

      // Busca dados do briefing
      const briefing = await prisma.briefings.findUnique({
        where: { id: briefingId },
        include: {
          user: true
        }
      });

      if (!briefing) {
        throw new Error(`Briefing ${briefingId} não encontrado`);
      }

      // Atualiza briefing
      await prisma.briefings.update({
        where: { id: briefingId },
        data: {
          orcamento_em_processamento: false,
          ultimo_erro_orcamento: error
        }
      });

      // Envia notificação para o usuário
      await this.sendNotification({
        userId: briefing.created_by,
        type: 'budget_failed',
        title: 'Erro na Geração de Orçamento',
        message: `Não foi possível gerar o orçamento automaticamente para o projeto "${briefing.nome_projeto}". Você pode tentar gerar manualmente.`,
        data: {
          briefingId,
          error: error
        }
      });

      // Registra evento
      await this.logTriggerEvent({
        type: 'budget_failed',
        briefingId,
        userId: briefing.created_by,
        escritorioId: briefing.escritorio_id,
        action: 'budget_generation_failed',
        metadata: {
          error: error,
          briefingType: briefing.tipo_briefing
        }
      });

      console.log(`[TriggerService] Trigger de falha processado para briefing ${briefingId}`);

    } catch (err) {
      console.error('[TriggerService] Erro ao processar trigger de falha:', err);
    }
  }

  /**
   * Envia notificação para usuário
   */
  private async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Salva notificação no banco
      await prisma.$executeRaw`
        INSERT INTO notifications (
          user_id, type, title, message, data, read, created_at
        ) VALUES (
          ${payload.userId}, ${payload.type}, ${payload.title}, 
          ${payload.message}, ${JSON.stringify(payload.data || {})}, 
          false, NOW()
        )
      `;

      // TODO: Implementar envio via WebSocket para notificação em tempo real
      // TODO: Implementar envio via email se configurado

      console.log(`[TriggerService] Notificação enviada para usuário ${payload.userId}`);

    } catch (error) {
      console.error('[TriggerService] Erro ao enviar notificação:', error);
    }
  }

  /**
   * Obtém estatísticas de triggers processados
   */
  async getTriggerStats(escritorioId?: string, days: number = 7): Promise<{
    briefingsProcessados: number;
    orcamentosGerados: number;
    falhas: number;
    tempoMedioProcessamento: number;
  }> {
    try {
      const whereClause = escritorioId 
        ? `WHERE escritorio_id = '${escritorioId}' AND created_at >= NOW() - INTERVAL '${days} days'`
        : `WHERE created_at >= NOW() - INTERVAL '${days} days'`;

      const stats = await prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN type = 'briefing_completed' THEN 1 END) as briefings_processados,
          COUNT(CASE WHEN type = 'budget_generated' THEN 1 END) as orcamentos_gerados,
          COUNT(CASE WHEN type = 'budget_failed' THEN 1 END) as falhas,
          AVG(CASE 
            WHEN type = 'budget_generated' AND metadata->>'processingTime' IS NOT NULL 
            THEN (metadata->>'processingTime')::numeric 
          END) as tempo_medio_processamento
        FROM trigger_logs 
        ${whereClause}
      `;

      return {
        briefingsProcessados: Number(stats[0]?.briefings_processados || 0),
        orcamentosGerados: Number(stats[0]?.orcamentos_gerados || 0),
        falhas: Number(stats[0]?.falhas || 0),
        tempoMedioProcessamento: Number(stats[0]?.tempo_medio_processamento || 0)
      };

    } catch (error) {
      console.error('[TriggerService] Erro ao obter estatísticas:', error);
      return {
        briefingsProcessados: 0,
        orcamentosGerados: 0,
        falhas: 0,
        tempoMedioProcessamento: 0
      };
    }
  }

  /**
   * Limpa logs antigos de triggers
   */
  async cleanupOldLogs(daysToKeep: number = 90): Promise<void> {
    try {
      await prisma.$executeRaw`
        DELETE FROM trigger_logs 
        WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
      `;

      await prisma.$executeRaw`
        DELETE FROM notifications 
        WHERE created_at < NOW() - INTERVAL '30 days' AND read = true
      `;

      console.log(`[TriggerService] Logs antigos removidos (mantidos últimos ${daysToKeep} dias)`);

    } catch (error) {
      console.error('[TriggerService] Erro ao limpar logs antigos:', error);
    }
  }
}

export const triggerService = new TriggerService();