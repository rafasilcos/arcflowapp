// SERVIÇO DE SALVAMENTO ROBUSTO - ARCFLOW
// Sistema completo de persistência para briefings

import { BriefingCompleto, BriefingResposta } from '../types/briefing';
import { AnaliseIA } from './analiseIA';

// Tipos para o sistema de salvamento
export interface RascunhoBriefing {
  id: string;
  briefingId: string;
  clienteId: string;
  projetoId?: string;
  respostas: Record<string, any>;
  progresso: number;
  ultimaSecao: number;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
  dispositivo: string;
  backup?: {
    local: boolean;
    nuvem: boolean;
    ultimoBackup: string;
  };
}

export interface BriefingConcluido {
  id: string;
  briefingId: string;
  clienteId: string;
  projetoId?: string;
  respostas: Record<string, any>;
  analiseIA?: AnaliseIA;
  status: 'concluido' | 'aprovado' | 'rejeitado' | 'em_revisao';
  concluidoEm: string;
  tempoPreenchimento: number;
  versao: number;
  historico: HistoricoVersao[];
  metadados: {
    dispositivo: string;
    navegador: string;
    ip?: string;
    localizacao?: string;
  };
}

export interface HistoricoVersao {
  versao: number;
  respostas: Record<string, any>;
  modificadoEm: string;
  modificadoPor: string;
  observacoes?: string;
}

// Configuração do salvamento
const CONFIG_SALVAMENTO = {
  intervalAutoSave: 30000, // 30 segundos
  maxVersoes: 10,
  backupLocal: true,
  backupNuvem: true,
  compressao: true
};

// Classe principal do serviço
export class SalvamentoBriefingService {
  private static instance: SalvamentoBriefingService;
  private intervalos: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): SalvamentoBriefingService {
    if (!SalvamentoBriefingService.instance) {
      SalvamentoBriefingService.instance = new SalvamentoBriefingService();
    }
    return SalvamentoBriefingService.instance;
  }

  // Salvar rascunho
  async salvarRascunho(rascunho: Partial<RascunhoBriefing>): Promise<RascunhoBriefing> {
    try {
      const agora = new Date().toISOString();
      const dispositivo = this.obterInfoDispositivo();

      const rascunhoCompleto: RascunhoBriefing = {
        id: rascunho.id || this.gerarId(),
        briefingId: rascunho.briefingId!,
        clienteId: rascunho.clienteId!,
        projetoId: rascunho.projetoId,
        respostas: rascunho.respostas || {},
        progresso: this.calcularProgresso(rascunho.respostas || {}),
        ultimaSecao: rascunho.ultimaSecao || 0,
        criadoEm: rascunho.criadoEm || agora,
        atualizadoEm: agora,
        versao: (rascunho.versao || 0) + 1,
        dispositivo,
        backup: {
          local: false,
          nuvem: false,
          ultimoBackup: agora
        }
      };

      // Salvar localmente primeiro (mais rápido)
      await this.salvarLocal(rascunhoCompleto);
      rascunhoCompleto.backup!.local = true;

      // Salvar na nuvem (assíncrono)
      this.salvarNuvem(rascunhoCompleto).then(() => {
        rascunhoCompleto.backup!.nuvem = true;
        this.atualizarStatusBackup(rascunhoCompleto.id, 'nuvem', true);
      }).catch(error => {
        console.warn('Erro no backup na nuvem:', error);
      });

      return rascunhoCompleto;

    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      throw new Error('Falha ao salvar rascunho');
    }
  }

  // Configurar auto-save
  configurarAutoSave(
    briefingId: string, 
    obterRespostas: () => Record<string, any>,
    obterSecaoAtual: () => number,
    clienteId: string,
    projetoId?: string
  ): void {
    // Limpar intervalo anterior se existir
    this.pararAutoSave(briefingId);

    const intervalo = setInterval(async () => {
      try {
        const respostas = obterRespostas();
        const secaoAtual = obterSecaoAtual();

        // Só salvar se houver respostas
        if (Object.keys(respostas).length > 0) {
          await this.salvarRascunho({
            briefingId,
            clienteId,
            projetoId,
            respostas,
            ultimaSecao: secaoAtual
          });
        }
      } catch (error) {
        console.warn('Erro no auto-save:', error);
      }
    }, CONFIG_SALVAMENTO.intervalAutoSave);

    this.intervalos.set(briefingId, intervalo);
  }

  // Parar auto-save
  pararAutoSave(briefingId: string): void {
    const intervalo = this.intervalos.get(briefingId);
    if (intervalo) {
      clearInterval(intervalo);
      this.intervalos.delete(briefingId);
    }
  }

  // Concluir briefing
  async concluirBriefing(
    briefing: BriefingCompleto,
    respostas: Record<string, any>,
    analiseIA: AnaliseIA,
    clienteId: string,
    projetoId?: string,
    tempoPreenchimento?: number
  ): Promise<BriefingConcluido> {
    try {
      const agora = new Date().toISOString();
      const metadados = this.obterMetadados();

      const briefingConcluido: BriefingConcluido = {
        id: this.gerarId(),
        briefingId: briefing.id,
        clienteId,
        projetoId,
        respostas,
        analiseIA,
        status: 'concluido',
        concluidoEm: agora,
        tempoPreenchimento: tempoPreenchimento || 0,
        versao: 1,
        historico: [{
          versao: 1,
          respostas,
          modificadoEm: agora,
          modificadoPor: clienteId,
          observacoes: 'Versão inicial'
        }],
        metadados
      };

      // Salvar briefing concluído
      await this.salvarBriefingConcluido(briefingConcluido);

      // Limpar rascunho
      await this.limparRascunho(briefing.id, clienteId);

      // Parar auto-save
      this.pararAutoSave(briefing.id);

      return briefingConcluido;

    } catch (error) {
      console.error('Erro ao concluir briefing:', error);
      throw new Error('Falha ao concluir briefing');
    }
  }

  // Carregar rascunho
  async carregarRascunho(briefingId: string, clienteId: string): Promise<RascunhoBriefing | null> {
    try {
      // Tentar carregar da nuvem primeiro
      let rascunho = await this.carregarDaNuvem(briefingId, clienteId);
      
      // Se não encontrar na nuvem, tentar local
      if (!rascunho) {
        rascunho = await this.carregarLocal(briefingId, clienteId);
      }

      return rascunho;

    } catch (error) {
      console.warn('Erro ao carregar rascunho:', error);
      return null;
    }
  }

  // Listar rascunhos do cliente
  async listarRascunhos(clienteId: string): Promise<RascunhoBriefing[]> {
    try {
      const rascunhosLocal = await this.listarRascunhosLocal(clienteId);
      const rascunhosNuvem = await this.listarRascunhosNuvem(clienteId);

      // Mesclar e deduplificar
      const todosRascunhos = [...rascunhosLocal, ...rascunhosNuvem];
      const rascunhosUnicos = this.deduplificarRascunhos(todosRascunhos);

      return rascunhosUnicos.sort((a, b) => 
        new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
      );

    } catch (error) {
      console.error('Erro ao listar rascunhos:', error);
      return [];
    }
  }

  // Listar briefings concluídos
  async listarBriefingsConcluidos(clienteId: string): Promise<BriefingConcluido[]> {
    try {
      // TODO: Implementar busca no backend
      const briefings = await this.buscarBriefingsConcluidos(clienteId);
      
      return briefings.sort((a, b) => 
        new Date(b.concluidoEm).getTime() - new Date(a.concluidoEm).getTime()
      );

    } catch (error) {
      console.error('Erro ao listar briefings concluídos:', error);
      return [];
    }
  }

  // Métodos privados
  private gerarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calcularProgresso(respostas: Record<string, any>): number {
    const totalRespostas = Object.keys(respostas).length;
    // TODO: Calcular baseado no total de perguntas do briefing
    return Math.min(100, (totalRespostas / 50) * 100);
  }

  private obterInfoDispositivo(): string {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);
    
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }

  private obterMetadados() {
    return {
      dispositivo: this.obterInfoDispositivo(),
      navegador: navigator.userAgent,
      ip: undefined, // Será preenchido pelo backend
      localizacao: undefined // Será preenchido pelo backend se permitido
    };
  }

  // Salvamento local (localStorage)
  private async salvarLocal(rascunho: RascunhoBriefing): Promise<void> {
    try {
      const chave = `arcflow_rascunho_${rascunho.briefingId}_${rascunho.clienteId}`;
      const dados = CONFIG_SALVAMENTO.compressao 
        ? this.comprimirDados(rascunho)
        : JSON.stringify(rascunho);
      
      localStorage.setItem(chave, dados);
    } catch (error) {
      console.warn('Erro ao salvar localmente:', error);
      throw error;
    }
  }

  private async carregarLocal(briefingId: string, clienteId: string): Promise<RascunhoBriefing | null> {
    try {
      const chave = `arcflow_rascunho_${briefingId}_${clienteId}`;
      const dados = localStorage.getItem(chave);
      
      if (!dados) return null;

      return CONFIG_SALVAMENTO.compressao 
        ? this.descomprimirDados(dados)
        : JSON.parse(dados);
    } catch (error) {
      console.warn('Erro ao carregar localmente:', error);
      return null;
    }
  }

  private async listarRascunhosLocal(clienteId: string): Promise<RascunhoBriefing[]> {
    const rascunhos: RascunhoBriefing[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave?.startsWith('arcflow_rascunho_') && chave.includes(clienteId)) {
        try {
          const dados = localStorage.getItem(chave);
          if (dados) {
            const rascunho = CONFIG_SALVAMENTO.compressao 
              ? this.descomprimirDados(dados)
              : JSON.parse(dados);
            rascunhos.push(rascunho);
          }
        } catch (error) {
          console.warn('Erro ao carregar rascunho local:', error);
        }
      }
    }
    
    return rascunhos;
  }

  // Salvamento na nuvem (placeholder - implementar com backend)
  private async salvarNuvem(rascunho: RascunhoBriefing): Promise<void> {
    // TODO: Implementar salvamento no backend
    console.log('Salvando na nuvem:', rascunho.id);
  }

  private async carregarDaNuvem(briefingId: string, clienteId: string): Promise<RascunhoBriefing | null> {
    // TODO: Implementar carregamento do backend
    return null;
  }

  private async listarRascunhosNuvem(clienteId: string): Promise<RascunhoBriefing[]> {
    // TODO: Implementar listagem do backend
    return [];
  }

  private async salvarBriefingConcluido(briefing: BriefingConcluido): Promise<void> {
    // TODO: Implementar salvamento no backend
    console.log('Salvando briefing concluído:', briefing.id);
  }

  private async buscarBriefingsConcluidos(clienteId: string): Promise<BriefingConcluido[]> {
    // TODO: Implementar busca no backend
    return [];
  }

  private async limparRascunho(briefingId: string, clienteId: string): Promise<void> {
    const chave = `arcflow_rascunho_${briefingId}_${clienteId}`;
    localStorage.removeItem(chave);
  }

  private async atualizarStatusBackup(rascunhoId: string, tipo: 'local' | 'nuvem', status: boolean): Promise<void> {
    // TODO: Implementar atualização de status
  }

  private deduplificarRascunhos(rascunhos: RascunhoBriefing[]): RascunhoBriefing[] {
    const mapa = new Map<string, RascunhoBriefing>();
    
    rascunhos.forEach(rascunho => {
      const chave = `${rascunho.briefingId}_${rascunho.clienteId}`;
      const existente = mapa.get(chave);
      
      if (!existente || new Date(rascunho.atualizadoEm) > new Date(existente.atualizadoEm)) {
        mapa.set(chave, rascunho);
      }
    });
    
    return Array.from(mapa.values());
  }

  private comprimirDados(dados: any): string {
    // TODO: Implementar compressão real (ex: LZ-string)
    return JSON.stringify(dados);
  }

  private descomprimirDados(dados: string): any {
    // TODO: Implementar descompressão real
    return JSON.parse(dados);
  }
}

// Instância singleton
export const salvamentoBriefing = SalvamentoBriefingService.getInstance(); 