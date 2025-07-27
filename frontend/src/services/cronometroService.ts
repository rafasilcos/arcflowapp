// ===== SERVIÇO DE CRONÔMETRO AVANÇADO =====
// Extraído da V7-Otimizado - Sistema completo de cronometragem

import { Tarefa } from '@/types/dashboard-core';

export interface SessaoCronometro {
  id: string;
  tarefa_id: string;
  inicio: Date;
  fim?: Date;
  duracao: number; // em segundos
  anotacao?: string;
  pausas: PausaCronometro[];
}

export interface PausaCronometro {
  inicio: Date;
  fim?: Date;
  duracao: number;
}

export interface EstadoCronometro {
  ativo: boolean;
  tarefa_ativa: string | null;
  sessao_atual: SessaoCronometro | null;
  tempo_sessao_atual: number;
  numero_sessoes: number;
  historico_sessoes: SessaoCronometro[];
}

class CronometroService {
  private estado: EstadoCronometro = {
    ativo: false,
    tarefa_ativa: null,
    sessao_atual: null,
    tempo_sessao_atual: 0,
    numero_sessoes: 0,
    historico_sessoes: []
  };

  private intervalo: NodeJS.Timeout | null = null;
  private callbacks: ((estado: EstadoCronometro) => void)[] = [];

  // ===== MÉTODOS PRINCIPAIS =====
  
  iniciarTarefa(tarefaId: string): void {
    // Se já há uma tarefa ativa, finaliza a sessão anterior
    if (this.estado.ativo && this.estado.tarefa_ativa) {
      this.finalizarSessaoAnterior();
    }

    // Verifica se há sessão pausada para esta tarefa
    const sessaoExistente = this.estado.historico_sessoes.find(
      s => s.tarefa_id === tarefaId && !s.fim
    );

    if (sessaoExistente) {
      this.continuarSessaoExistente(sessaoExistente);
    } else {
      this.iniciarNovaSessao(tarefaId);
    }

    this.iniciarContador();
    this.notificarCallbacks();
  }

  pausarTarefa(): void {
    if (!this.estado.ativo || !this.estado.sessao_atual) return;

    this.pararContador();
    
    // Adiciona pausa à sessão atual
    const agora = new Date();
    this.estado.sessao_atual.pausas.push({
      inicio: agora,
      fim: agora,
      duracao: 0
    });

    this.estado.ativo = false;
    this.notificarCallbacks();
  }

  finalizarTarefa(tarefaId: string): SessaoCronometro | null {
    if (this.estado.tarefa_ativa !== tarefaId) return null;

    this.pararContador();

    if (this.estado.sessao_atual) {
      this.estado.sessao_atual.fim = new Date();
      this.estado.sessao_atual.duracao = this.estado.tempo_sessao_atual;
      
      // Salva no histórico
      this.estado.historico_sessoes.push({...this.estado.sessao_atual});
    }

    const sessaoFinalizada = this.estado.sessao_atual;
    this.resetarEstado();
    this.notificarCallbacks();

    return sessaoFinalizada;
  }

  sairDaTarefa(): void {
    if (!this.estado.ativo) return;

    this.pararContador();
    this.resetarEstado();
    this.notificarCallbacks();
  }

  // ===== MÉTODOS AUXILIARES =====

  private iniciarNovaSessao(tarefaId: string): void {
    this.estado.sessao_atual = {
      id: `sessao_${Date.now()}`,
      tarefa_id: tarefaId,
      inicio: new Date(),
      duracao: 0,
      pausas: []
    };
    
    this.estado.tarefa_ativa = tarefaId;
    this.estado.tempo_sessao_atual = 0;
    this.estado.numero_sessoes += 1;
  }

  private continuarSessaoExistente(sessao: SessaoCronometro): void {
    this.estado.sessao_atual = sessao;
    this.estado.tarefa_ativa = sessao.tarefa_id;
    this.estado.tempo_sessao_atual = sessao.duracao;
  }

  private finalizarSessaoAnterior(): void {
    if (this.estado.sessao_atual) {
      this.estado.sessao_atual.fim = new Date();
      this.estado.sessao_atual.duracao = this.estado.tempo_sessao_atual;
    }
  }

  private iniciarContador(): void {
    this.estado.ativo = true;
    
    this.intervalo = setInterval(() => {
      this.estado.tempo_sessao_atual += 1;
      if (this.estado.sessao_atual) {
        this.estado.sessao_atual.duracao = this.estado.tempo_sessao_atual;
      }
      this.notificarCallbacks();
    }, 1000);
  }

  private pararContador(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private resetarEstado(): void {
    this.estado = {
      ativo: false,
      tarefa_ativa: null,
      sessao_atual: null,
      tempo_sessao_atual: 0,
      numero_sessoes: this.estado.numero_sessoes,
      historico_sessoes: this.estado.historico_sessoes
    };
  }

  // ===== MÉTODOS PÚBLICOS =====

  obterEstado(): EstadoCronometro {
    return { ...this.estado };
  }

  obterTempoTotalTarefa(tarefaId: string): number {
    return this.estado.historico_sessoes
      .filter(s => s.tarefa_id === tarefaId && s.fim)
      .reduce((total, sessao) => total + sessao.duracao, 0);
  }

  obterSessoesTarefa(tarefaId: string): SessaoCronometro[] {
    return this.estado.historico_sessoes.filter(s => s.tarefa_id === tarefaId);
  }

  formatarTempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos.toString().padStart(2, '0')}m`;
    } else if (minutos > 0) {
      return `${minutos}m ${segs.toString().padStart(2, '0')}s`;
    } else {
      return `${segs}s`;
    }
  }

  formatarTempoSimples(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}m`;
    }
  }

  // ===== SISTEMA DE CALLBACKS =====

  adicionarCallback(callback: (estado: EstadoCronometro) => void): void {
    this.callbacks.push(callback);
  }

  removerCallback(callback: (estado: EstadoCronometro) => void): void {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  private notificarCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.estado));
  }

  // ===== PERSISTÊNCIA =====

  salvarEstado(): void {
    localStorage.setItem('arcflow_cronometro', JSON.stringify({
      ...this.estado,
      sessao_atual: this.estado.sessao_atual ? {
        ...this.estado.sessao_atual,
        inicio: this.estado.sessao_atual.inicio.toISOString(),
        fim: this.estado.sessao_atual.fim?.toISOString()
      } : null,
      historico_sessoes: this.estado.historico_sessoes.map(s => ({
        ...s,
        inicio: s.inicio.toISOString(),
        fim: s.fim?.toISOString()
      }))
    }));
  }

  carregarEstado(): void {
    try {
      const estadoSalvo = localStorage.getItem('arcflow_cronometro');
      if (estadoSalvo) {
        const dados = JSON.parse(estadoSalvo);
        this.estado = {
          ...dados,
          sessao_atual: dados.sessao_atual ? {
            ...dados.sessao_atual,
            inicio: new Date(dados.sessao_atual.inicio),
            fim: dados.sessao_atual.fim ? new Date(dados.sessao_atual.fim) : undefined
          } : null,
          historico_sessoes: dados.historico_sessoes.map((s: any) => ({
            ...s,
            inicio: new Date(s.inicio),
            fim: s.fim ? new Date(s.fim) : undefined
          }))
        };
      }
    } catch (error) {
      console.error('Erro ao carregar estado do cronômetro:', error);
    }
  }

  // ===== MÉTODOS PARA COMPATIBILIDADE COM DASHBOARD =====
  
  async obterAtivo(projetoId: string): Promise<any> {
    // Para compatibilidade com React Query, simula uma chamada async
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.estado.ativo && this.estado.sessao_atual) {
          resolve({
            id: this.estado.sessao_atual.id,
            atividadeId: this.estado.tarefa_ativa,
            elapsedTime: this.estado.tempo_sessao_atual,
            projeto_id: projetoId,
            status: 'ATIVO',
            inicio: this.estado.sessao_atual.inicio
          });
        } else {
          resolve(null);
        }
      }, 100);
    });
  }

  async iniciar(projetoId: string, tarefaId: string, descricao: string = ''): Promise<any> {
    this.iniciarTarefa(tarefaId);
    
    return {
      id: this.estado.sessao_atual?.id,
      atividadeId: tarefaId,
      projeto_id: projetoId,
      descricao,
      status: 'ATIVO',
      inicio: new Date()
    };
  }

  async parar(cronometroId: string, observacoes: string = ''): Promise<any> {
    const sessaoFinalizada = this.finalizarTarefa(this.estado.tarefa_ativa || '');
    
    if (sessaoFinalizada && observacoes) {
      sessaoFinalizada.anotacao = observacoes;
    }
    
    return {
      id: cronometroId,
      status: 'PARADO',
      fim: new Date(),
      duracao: sessaoFinalizada?.duracao || 0,
      observacoes
    };
  }
}

// Instância singleton
export const cronometroService = new CronometroService(); 