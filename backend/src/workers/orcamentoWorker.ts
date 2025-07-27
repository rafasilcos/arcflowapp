import { queueService } from '../services/queueService';
import { triggerService } from '../services/triggerService';
import { briefingAnalysisEngine } from '../services/briefingAnalysisEngine';
import { budgetCalculationService } from '../services/budgetCalculationService';
import { configurationManagementService } from '../services/configurationManagementService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WorkerStats {
  processedJobs: number;
  successfulJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  startTime: Date;
}

class OrcamentoWorker {
  private isRunning: boolean = false;
  private stats: WorkerStats;
  private workerId: string;

  constructor(workerId: string = `worker-${Date.now()}`) {
    this.workerId = workerId;
    this.stats = {
      processedJobs: 0,
      successfulJobs: 0,
      failedJobs: 0,
      averageProcessingTime: 0,
      startTime: new Date()
    };
  }

  /**
   * Inicia o worker para processar jobs da fila
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log(`[OrcamentoWorker:${this.workerId}] Worker já está rodando`);
      return;
    }

    this.isRunning = true;
    console.log(`[OrcamentoWorker:${this.workerId}] Iniciando worker de orçamentos`);

    // Loop principal do worker
    while (this.isRunning) {
      try {
        const job = await queueService.getNextJob();
        
        if (job) {
          await this.processJob(job);
        } else {
          // Aguarda um pouco antes de verificar novamente
          await this.sleep(1000);
        }
      } catch (error) {
        console.error(`[OrcamentoWorker:${this.workerId}] Erro no loop principal:`, error);
        await this.sleep(5000); // Aguarda mais tempo em caso de erro
      }
    }

    console.log(`[OrcamentoWorker:${this.workerId}] Worker parado`);
  }

  /**
   * Para o worker
   */
  stop(): void {
    console.log(`[OrcamentoWorker:${this.workerId}] Parando worker...`);
    this.isRunning = false;
  }

  /**
   * Processa um job individual de geração de orçamento
   */
  private async processJob(job: any): Promise<void> {
    const startTime = Date.now();
    console.log(`[OrcamentoWorker:${this.workerId}] Processando job ${job.id} para briefing ${job.briefingId}`);

    try {
      // 1. Busca dados do briefing
      const briefing = await this.getBriefingData(job.briefingId);
      if (!briefing) {
        throw new Error(`Briefing ${job.briefingId} não encontrado`);
      }

      // 2. Verifica se já existe orçamento
      if (briefing.orcamento_gerado && briefing.orcamento_id) {
        console.log(`[OrcamentoWorker:${this.workerId}] Briefing ${job.briefingId} já possui orçamento`);
        await queueService.completeJob(job.id, {
          success: true,
          orcamentoId: briefing.orcamento_id,
          processedAt: new Date().toISOString(),
          processingTime: Date.now() - startTime
        });
        return;
      }

      // 3. Analisa o briefing para extrair dados
      console.log(`[OrcamentoWorker:${this.workerId}] Analisando briefing ${job.briefingId}`);
      const dadosExtraidos = await briefingAnalysisEngine.analisarBriefing(briefing);

      // 4. Obtém configurações do escritório
      const configuracoes = await configurationManagementService.getConfiguracoes(briefing.escritorio_id);

      // 5. Calcula horas e valores
      console.log(`[OrcamentoWorker:${this.workerId}] Calculando orçamento para briefing ${job.briefingId}`);
      const horasCalculadas = await budgetCalculationService.calcularHoras(dadosExtraidos, configuracoes);
      const valoresCalculados = await budgetCalculationService.calcularValores(horasCalculadas, configuracoes.tabelaPrecos);

      // 6. Cria o orçamento no banco
      const orcamento = await this.createOrcamento({
        briefingId: job.briefingId,
        escritorioId: briefing.escritorio_id,
        userId: job.userId || briefing.created_by,
        dadosExtraidos,
        horasCalculadas,
        valoresCalculados,
        metadata: job.metadata
      });

      // 7. Atualiza dados extraídos no briefing
      await prisma.briefings.update({
        where: { id: job.briefingId },
        data: {
          dados_extraidos: dadosExtraidos,
          ultima_analise: new Date()
        }
      });

      // 8. Processa trigger de sucesso
      await triggerService.processBudgetGeneratedTrigger(orcamento.id, job.briefingId);

      // 9. Marca job como concluído
      const processingTime = Date.now() - startTime;
      await queueService.completeJob(job.id, {
        success: true,
        orcamentoId: orcamento.id,
        processedAt: new Date().toISOString(),
        processingTime
      });

      // Atualiza estatísticas
      this.updateStats(true, processingTime);

      console.log(`[OrcamentoWorker:${this.workerId}] Job ${job.id} processado com sucesso em ${processingTime}ms`);

    } catch (error) {
      console.error(`[OrcamentoWorker:${this.workerId}] Erro ao processar job ${job.id}:`, error);

      // Processa trigger de falha
      await triggerService.processBudgetFailedTrigger(job.briefingId, error.message);

      // Marca job como falhado
      await queueService.failJob(job.id, error.message, true);

      // Atualiza estatísticas
      this.updateStats(false, Date.now() - startTime);
    }
  }

  /**
   * Busca dados completos do briefing
   */
  private async getBriefingData(briefingId: string): Promise<any> {
    try {
      const briefing = await prisma.briefings.findUnique({
        where: { id: briefingId },
        include: {
          user: true,
          escritorio: true,
          respostas: true
        }
      });

      return briefing;
    } catch (error) {
      console.error(`[OrcamentoWorker:${this.workerId}] Erro ao buscar briefing:`, error);
      throw error;
    }
  }

  /**
   * Cria orçamento no banco de dados
   */
  private async createOrcamento(data: {
    briefingId: string;
    escritorioId: string;
    userId: string;
    dadosExtraidos: any;
    horasCalculadas: any;
    valoresCalculados: any;
    metadata?: any;
  }): Promise<any> {
    try {
      const orcamento = await prisma.orcamentos.create({
        data: {
          briefing_id: data.briefingId,
          escritorio_id: data.escritorioId,
          created_by: data.userId,
          nome_projeto: data.dadosExtraidos.nomeProjetoOuEmpreendimento || 'Projeto sem nome',
          tipologia: data.dadosExtraidos.tipologia,
          area_construida: data.dadosExtraidos.areaConstruida,
          area_terreno: data.dadosExtraidos.areaTerreno,
          padrao_acabamento: data.dadosExtraidos.padrao,
          complexidade: data.dadosExtraidos.complexidade,
          disciplinas_incluidas: data.horasCalculadas.disciplinasIncluidas,
          horas_total: data.horasCalculadas.horasTotal,
          horas_por_disciplina: data.horasCalculadas.horasPorDisciplina,
          horas_por_fase: data.horasCalculadas.horasPorFase,
          valor_total: data.valoresCalculados.valorTotal,
          valor_por_disciplina: data.valoresCalculados.valorPorDisciplina,
          valor_por_fase: data.valoresCalculados.valorPorFase,
          custos_indiretos: data.valoresCalculados.custosIndiretos,
          impostos: data.valoresCalculados.impostos,
          margem_lucro: data.valoresCalculados.margemLucro,
          cronograma_horas: data.horasCalculadas.distribuicaoTemporal,
          dados_calculo: {
            dadosExtraidos: data.dadosExtraidos,
            configuracoes: data.valoresCalculados.configuracoes,
            metadata: data.metadata
          },
          status: 'ATIVO',
          gerado_automaticamente: true,
          versao: 1
        }
      });

      return orcamento;
    } catch (error) {
      console.error(`[OrcamentoWorker:${this.workerId}] Erro ao criar orçamento:`, error);
      throw error;
    }
  }

  /**
   * Atualiza estatísticas do worker
   */
  private updateStats(success: boolean, processingTime: number): void {
    this.stats.processedJobs++;
    
    if (success) {
      this.stats.successfulJobs++;
    } else {
      this.stats.failedJobs++;
    }

    // Calcula tempo médio de processamento
    const totalTime = this.stats.averageProcessingTime * (this.stats.processedJobs - 1) + processingTime;
    this.stats.averageProcessingTime = totalTime / this.stats.processedJobs;
  }

  /**
   * Obtém estatísticas do worker
   */
  getStats(): WorkerStats & { workerId: string; uptime: number } {
    return {
      ...this.stats,
      workerId: this.workerId,
      uptime: Date.now() - this.stats.startTime.getTime()
    };
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
    console.log(`[OrcamentoWorker:${this.workerId}] Iniciando shutdown graceful...`);
    this.stop();
    
    // Aguarda um pouco para terminar processamento atual
    await this.sleep(2000);
    
    // Fecha conexão com banco
    await prisma.$disconnect();
    
    console.log(`[OrcamentoWorker:${this.workerId}] Shutdown concluído`);
  }
}

export { OrcamentoWorker };