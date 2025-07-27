import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

interface NotificationJob {
  id: string;
  type: 'email' | 'websocket' | 'push';
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'normal' | 'high';
  scheduledFor?: Date;
}

class NotificationWorker {
  private redis: Redis;
  private isRunning: boolean = false;
  private workerId: string;
  private emailTransporter: nodemailer.Transporter;

  constructor(workerId: string = `notification-worker-${Date.now()}`) {
    this.workerId = workerId;
    
    // Configuração Redis
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });

    // Configuração do email transporter
    this.setupEmailTransporter();
  }

  /**
   * Configura o transporter de email
   */
  private setupEmailTransporter(): void {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      console.log(`[NotificationWorker:${this.workerId}] Email transporter configurado`);
    } else {
      console.log(`[NotificationWorker:${this.workerId}] Email não configurado - notificações por email desabilitadas`);
    }
  }

  /**
   * Inicia o worker de notificações
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log(`[NotificationWorker:${this.workerId}] Worker já está rodando`);
      return;
    }

    this.isRunning = true;
    console.log(`[NotificationWorker:${this.workerId}] Iniciando worker de notificações`);

    // Processa notificações pendentes
    while (this.isRunning) {
      try {
        await this.processNotifications();
        await this.sleep(2000); // Verifica a cada 2 segundos
      } catch (error) {
        console.error(`[NotificationWorker:${this.workerId}] Erro no loop principal:`, error);
        await this.sleep(5000);
      }
    }
  }

  /**
   * Para o worker
   */
  stop(): void {
    console.log(`[NotificationWorker:${this.workerId}] Parando worker...`);
    this.isRunning = false;
  }

  /**
   * Processa notificações pendentes
   */
  private async processNotifications(): Promise<void> {
    try {
      // Busca notificações não enviadas
      const notifications = await prisma.notifications.findMany({
        where: {
          sent: false,
          OR: [
            { scheduled_for: null },
            { scheduled_for: { lte: new Date() } }
          ]
        },
        include: {
          user: {
            include: {
              escritorio: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { created_at: 'asc' }
        ],
        take: 10 // Processa até 10 por vez
      });

      for (const notification of notifications) {
        await this.processNotification(notification);
      }

    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificações:`, error);
    }
  }

  /**
   * Processa uma notificação individual
   */
  private async processNotification(notification: any): Promise<void> {
    try {
      console.log(`[NotificationWorker:${this.workerId}] Processando notificação ${notification.id}`);

      const user = notification.user;
      if (!user) {
        console.error(`[NotificationWorker:${this.workerId}] Usuário não encontrado para notificação ${notification.id}`);
        return;
      }

      // Marca como sendo processada
      await prisma.notifications.update({
        where: { id: notification.id },
        data: { processing: true }
      });

      let success = false;
      const errors: string[] = [];

      // Processa diferentes tipos de notificação
      switch (notification.type) {
        case 'budget_generated':
          success = await this.processBudgetGeneratedNotification(notification, user);
          break;
        
        case 'budget_failed':
          success = await this.processBudgetFailedNotification(notification, user);
          break;
        
        case 'budget_processing':
          success = await this.processBudgetProcessingNotification(notification, user);
          break;
        
        default:
          success = await this.processGenericNotification(notification, user);
      }

      // Atualiza status da notificação
      await prisma.notifications.update({
        where: { id: notification.id },
        data: {
          sent: success,
          processing: false,
          sent_at: success ? new Date() : null,
          error_message: success ? null : errors.join('; ')
        }
      });

      if (success) {
        console.log(`[NotificationWorker:${this.workerId}] Notificação ${notification.id} enviada com sucesso`);
      } else {
        console.error(`[NotificationWorker:${this.workerId}] Falha ao enviar notificação ${notification.id}:`, errors);
      }

    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificação ${notification.id}:`, error);
      
      // Marca como erro
      await prisma.notifications.update({
        where: { id: notification.id },
        data: {
          processing: false,
          error_message: error.message
        }
      });
    }
  }

  /**
   * Processa notificação de orçamento gerado
   */
  private async processBudgetGeneratedNotification(notification: any, user: any): Promise<boolean> {
    try {
      const data = notification.data || {};
      
      // Envia notificação WebSocket se usuário estiver online
      await this.sendWebSocketNotification(user.id, {
        type: 'budget_generated',
        title: notification.title,
        message: notification.message,
        data: {
          briefingId: data.briefingId,
          orcamentoId: data.orcamentoId,
          valorTotal: data.valorTotal,
          horasTotal: data.horasTotal
        }
      });

      // Envia email se configurado e usuário tem email
      if (this.emailTransporter && user.email) {
        await this.sendEmailNotification(user.email, {
          subject: '🎉 Orçamento Gerado Automaticamente - ArcFlow',
          title: notification.title,
          message: notification.message,
          actionUrl: `${process.env.FRONTEND_URL}/orcamentos/${data.orcamentoId}`,
          actionText: 'Ver Orçamento',
          additionalInfo: [
            `Valor Total: R$ ${data.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || 'N/A'}`,
            `Horas Estimadas: ${data.horasTotal || 'N/A'}h`
          ]
        });
      }

      return true;
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificação de orçamento gerado:`, error);
      return false;
    }
  }

  /**
   * Processa notificação de falha na geração de orçamento
   */
  private async processBudgetFailedNotification(notification: any, user: any): Promise<boolean> {
    try {
      const data = notification.data || {};
      
      // Envia notificação WebSocket
      await this.sendWebSocketNotification(user.id, {
        type: 'budget_failed',
        title: notification.title,
        message: notification.message,
        data: {
          briefingId: data.briefingId,
          error: data.error
        }
      });

      // Envia email se configurado
      if (this.emailTransporter && user.email) {
        await this.sendEmailNotification(user.email, {
          subject: '⚠️ Erro na Geração de Orçamento - ArcFlow',
          title: notification.title,
          message: notification.message,
          actionUrl: `${process.env.FRONTEND_URL}/briefings/${data.briefingId}`,
          actionText: 'Ver Briefing',
          additionalInfo: [
            'Você pode tentar gerar o orçamento manualmente ou entrar em contato com o suporte.'
          ]
        });
      }

      return true;
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificação de falha:`, error);
      return false;
    }
  }

  /**
   * Processa notificação de processamento em andamento
   */
  private async processBudgetProcessingNotification(notification: any, user: any): Promise<boolean> {
    try {
      const data = notification.data || {};
      
      // Envia apenas WebSocket para este tipo (não spam de email)
      await this.sendWebSocketNotification(user.id, {
        type: 'budget_processing',
        title: notification.title,
        message: notification.message,
        data: {
          briefingId: data.briefingId
        }
      });

      return true;
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificação de processamento:`, error);
      return false;
    }
  }

  /**
   * Processa notificação genérica
   */
  private async processGenericNotification(notification: any, user: any): Promise<boolean> {
    try {
      // Envia WebSocket
      await this.sendWebSocketNotification(user.id, {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data
      });

      return true;
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao processar notificação genérica:`, error);
      return false;
    }
  }

  /**
   * Envia notificação via WebSocket
   */
  private async sendWebSocketNotification(userId: string, payload: any): Promise<void> {
    try {
      // Publica no canal Redis para ser capturado pelo servidor WebSocket
      await this.redis.publish(`user:${userId}:notifications`, JSON.stringify(payload));
      console.log(`[NotificationWorker:${this.workerId}] Notificação WebSocket enviada para usuário ${userId}`);
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao enviar WebSocket:`, error);
      throw error;
    }
  }

  /**
   * Envia notificação por email
   */
  private async sendEmailNotification(email: string, options: {
    subject: string;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    additionalInfo?: string[];
  }): Promise<void> {
    if (!this.emailTransporter) {
      throw new Error('Email transporter não configurado');
    }

    try {
      const htmlContent = this.generateEmailTemplate(options);
      
      await this.emailTransporter.sendMail({
        from: `"ArcFlow" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: options.subject,
        html: htmlContent
      });

      console.log(`[NotificationWorker:${this.workerId}] Email enviado para ${email}`);
    } catch (error) {
      console.error(`[NotificationWorker:${this.workerId}] Erro ao enviar email:`, error);
      throw error;
    }
  }

  /**
   * Gera template HTML para email
   */
  private generateEmailTemplate(options: {
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    additionalInfo?: string[];
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ArcFlow - Notificação</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">ArcFlow</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Plataforma para Arquitetura e Engenharia</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #333; margin-top: 0;">${options.title}</h2>
          <p style="font-size: 16px; margin-bottom: 20px;">${options.message}</p>
          
          ${options.additionalInfo && options.additionalInfo.length > 0 ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${options.additionalInfo.map(info => `<p style="margin: 5px 0; font-size: 14px;">• ${info}</p>`).join('')}
            </div>
          ` : ''}
          
          ${options.actionUrl && options.actionText ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${options.actionUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold;
                        display: inline-block;">
                ${options.actionText}
              </a>
            </div>
          ` : ''}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            Esta é uma notificação automática do ArcFlow.<br>
            Se você não deseja mais receber estes emails, entre em contato conosco.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Função auxiliar para sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log(`[NotificationWorker:${this.workerId}] Iniciando shutdown...`);
    this.stop();
    
    await this.sleep(2000);
    
    if (this.emailTransporter) {
      this.emailTransporter.close();
    }
    
    await this.redis.disconnect();
    await prisma.$disconnect();
    
    console.log(`[NotificationWorker:${this.workerId}] Shutdown concluído`);
  }
}

export { NotificationWorker };