// ===== SERVIÇO DE ALERTAS CRÍTICOS =====
// Extraído da V7-Otimizado - Sistema de alertas e notificações

import { Tarefa, Projeto } from '@/types/dashboard-core';

export interface AlertaCritico {
  id: string;
  tipo: 'atrasada' | 'vencendo_hoje' | 'aguardando_aprovacao' | 'em_revisao' | 'aprovada_hoje';
  titulo: string;
  descricao: string;
  tarefa: Tarefa;
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
  data_criacao: Date;
  data_vencimento?: Date;
  acao_requerida?: string;
}

export interface ContagemAlertas {
  atrasadas: number;
  vencendo_hoje: number;
  aguardando_aprovacao: number;
  em_revisao: number;
  aprovadas_hoje: number;
  total: number;
}

class AlertasService {
  private alertas: AlertaCritico[] = [];
  private callbacks: ((alertas: AlertaCritico[], contagem: ContagemAlertas) => void)[] = [];

  // ===== ANÁLISE DE TAREFAS =====
  
  analisarProjeto(projeto: Projeto): void {
    this.alertas = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    projeto.etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        // Tarefas atrasadas
        if (this.isTarefaAtrasada(tarefa)) {
          this.alertas.push(this.criarAlertaAtrasada(tarefa));
        }

        // Tarefas vencendo hoje
        if (this.isTarefaVencendoHoje(tarefa, hoje)) {
          this.alertas.push(this.criarAlertaVencendoHoje(tarefa));
        }

        // Tarefas aguardando aprovação
        if (tarefa.status === 'aguardando_aprovacao') {
          this.alertas.push(this.criarAlertaAguardandoAprovacao(tarefa));
        }

        // Tarefas em revisão
        if (tarefa.status === 'em_revisao') {
          this.alertas.push(this.criarAlertaEmRevisao(tarefa));
        }

        // Tarefas aprovadas hoje (mock - em produção viria do backend)
        if (this.isTarefaAprovadaHoje(tarefa, hoje)) {
          this.alertas.push(this.criarAlertaAprovadaHoje(tarefa));
        }
      });
    });

    this.notificarCallbacks();
  }

  // ===== VERIFICAÇÕES DE STATUS =====

  private isTarefaAtrasada(tarefa: Tarefa): boolean {
    return tarefa.tempo_total > tarefa.tempo_estimado;
  }

  private isTarefaVencendoHoje(tarefa: Tarefa, hoje: Date): boolean {
    if (!tarefa.data_entrega) return false;
    
    const dataEntrega = new Date(tarefa.data_entrega);
    dataEntrega.setHours(0, 0, 0, 0);
    
    return dataEntrega.getTime() === hoje.getTime() && 
           tarefa.status !== 'concluida';
  }

  private isTarefaAprovadaHoje(tarefa: Tarefa, hoje: Date): boolean {
    // Mock - em produção verificaria data de aprovação
    return tarefa.status === 'concluida' && 
           Math.random() > 0.7; // Simula algumas aprovadas hoje
  }

  // ===== CRIAÇÃO DE ALERTAS =====

  private criarAlertaAtrasada(tarefa: Tarefa): AlertaCritico {
    const horasAtraso = Math.floor((tarefa.tempo_total - tarefa.tempo_estimado) / 3600);
    
    return {
      id: `alerta_atrasada_${tarefa.id}`,
      tipo: 'atrasada',
      titulo: 'Tarefa Atrasada',
      descricao: `${tarefa.nome} está ${horasAtraso}h atrasada`,
      tarefa,
      urgencia: horasAtraso > 8 ? 'critica' : horasAtraso > 4 ? 'alta' : 'media',
      data_criacao: new Date(),
      acao_requerida: 'Revisar prazo ou redistribuir recursos'
    };
  }

  private criarAlertaVencendoHoje(tarefa: Tarefa): AlertaCritico {
    return {
      id: `alerta_vencendo_${tarefa.id}`,
      tipo: 'vencendo_hoje',
      titulo: 'Vence Hoje',
      descricao: `${tarefa.nome} deve ser entregue hoje`,
      tarefa,
      urgencia: 'alta',
      data_criacao: new Date(),
      data_vencimento: new Date(tarefa.data_entrega!),
      acao_requerida: 'Priorizar conclusão'
    };
  }

  private criarAlertaAguardandoAprovacao(tarefa: Tarefa): AlertaCritico {
    const diasEspera = this.calcularDiasEspera(tarefa);
    
    return {
      id: `alerta_aprovacao_${tarefa.id}`,
      tipo: 'aguardando_aprovacao',
      titulo: 'Aguardando Aprovação',
      descricao: `${tarefa.nome} aguarda aprovação há ${diasEspera} dias`,
      tarefa,
      urgencia: diasEspera > 3 ? 'alta' : diasEspera > 1 ? 'media' : 'baixa',
      data_criacao: new Date(),
      acao_requerida: 'Revisar e aprovar/rejeitar'
    };
  }

  private criarAlertaEmRevisao(tarefa: Tarefa): AlertaCritico {
    return {
      id: `alerta_revisao_${tarefa.id}`,
      tipo: 'em_revisao',
      titulo: 'Em Revisão',
      descricao: `${tarefa.nome} precisa de correções`,
      tarefa,
      urgencia: 'media',
      data_criacao: new Date(),
      acao_requerida: 'Aplicar correções solicitadas'
    };
  }

  private criarAlertaAprovadaHoje(tarefa: Tarefa): AlertaCritico {
    return {
      id: `alerta_aprovada_${tarefa.id}`,
      tipo: 'aprovada_hoje',
      titulo: 'Aprovada Hoje',
      descricao: `${tarefa.nome} foi aprovada`,
      tarefa,
      urgencia: 'baixa',
      data_criacao: new Date(),
      acao_requerida: 'Prosseguir para próxima etapa'
    };
  }

  // ===== UTILITÁRIOS =====

  private calcularDiasEspera(tarefa: Tarefa): number {
    if (!tarefa.data_inicio) return 0;
    
    const dataInicio = new Date(tarefa.data_inicio);
    const hoje = new Date();
    const diferenca = hoje.getTime() - dataInicio.getTime();
    
    return Math.floor(diferenca / (1000 * 60 * 60 * 24));
  }

  // ===== MÉTODOS PÚBLICOS =====

  obterAlertas(): AlertaCritico[] {
    return [...this.alertas];
  }

  obterAlertasPorTipo(tipo: AlertaCritico['tipo']): AlertaCritico[] {
    return this.alertas.filter(alerta => alerta.tipo === tipo);
  }

  obterContagem(): ContagemAlertas {
    const contagem = {
      atrasadas: 0,
      vencendo_hoje: 0,
      aguardando_aprovacao: 0,
      em_revisao: 0,
      aprovadas_hoje: 0,
      total: 0
    };

    this.alertas.forEach(alerta => {
      switch (alerta.tipo) {
        case 'atrasada':
          contagem.atrasadas++;
          break;
        case 'vencendo_hoje':
          contagem.vencendo_hoje++;
          break;
        case 'aguardando_aprovacao':
          contagem.aguardando_aprovacao++;
          break;
        case 'em_revisao':
          contagem.em_revisao++;
          break;
        case 'aprovada_hoje':
          contagem.aprovadas_hoje++;
          break;
      }
    });

    contagem.total = this.alertas.length;
    return contagem;
  }

  obterAlertasCriticos(): AlertaCritico[] {
    return this.alertas.filter(alerta => 
      alerta.urgencia === 'critica' || alerta.urgencia === 'alta'
    );
  }

  marcarComoLido(alertaId: string): void {
    this.alertas = this.alertas.filter(alerta => alerta.id !== alertaId);
    this.notificarCallbacks();
  }

  limparAlertasTipo(tipo: AlertaCritico['tipo']): void {
    this.alertas = this.alertas.filter(alerta => alerta.tipo !== tipo);
    this.notificarCallbacks();
  }

  // ===== SISTEMA DE CALLBACKS =====

  adicionarCallback(callback: (alertas: AlertaCritico[], contagem: ContagemAlertas) => void): void {
    this.callbacks.push(callback);
  }

  removerCallback(callback: (alertas: AlertaCritico[], contagem: ContagemAlertas) => void): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  private notificarCallbacks(): void {
    const contagem = this.obterContagem();
    this.callbacks.forEach(callback => callback(this.alertas, contagem));
  }
}

// Instância singleton
export const alertasService = new AlertasService(); 