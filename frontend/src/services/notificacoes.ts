// SERVIÇO DE NOTIFICAÇÕES - ARCFLOW
// Sistema completo de notificações para briefings

export interface Notificacao {
  id: string;
  tipo: 'sucesso' | 'info' | 'alerta' | 'erro';
  titulo: string;
  mensagem: string;
  criadaEm: string;
  lida: boolean;
  acao?: {
    texto: string;
    url: string;
  };
  metadados?: {
    briefingId?: string;
    clienteId?: string;
    categoria?: string;
  };
}

export interface ConfigNotificacao {
  emailAtivo: boolean;
  pushAtivo: boolean;
  desktopAtivo: boolean;
  categorias: {
    analiseIA: boolean;
    autoSave: boolean;
    aprovacao: boolean;
    sistema: boolean;
  };
}

// Classe principal do serviço
export class NotificacoesService {
  private static instance: NotificacoesService;
  private notificacoes: Notificacao[] = [];
  private config: ConfigNotificacao = {
    emailAtivo: true,
    pushAtivo: true,
    desktopAtivo: true,
    categorias: {
      analiseIA: true,
      autoSave: true,
      aprovacao: true,
      sistema: true
    }
  };

  static getInstance(): NotificacoesService {
    if (!NotificacoesService.instance) {
      NotificacoesService.instance = new NotificacoesService();
    }
    return NotificacoesService.instance;
  }

  // Criar notificação
  async criarNotificacao(
    tipo: Notificacao['tipo'],
    titulo: string,
    mensagem: string,
    acao?: Notificacao['acao'],
    metadados?: Notificacao['metadados']
  ): Promise<Notificacao> {
    const notificacao: Notificacao = {
      id: this.gerarId(),
      tipo,
      titulo,
      mensagem,
      criadaEm: new Date().toISOString(),
      lida: false,
      acao,
      metadados
    };

    this.notificacoes.unshift(notificacao);
    
    // Salvar no localStorage
    this.salvarNotificacoes();

    // Enviar notificação desktop se ativada
    if (this.config.desktopAtivo) {
      await this.enviarNotificacaoDesktop(notificacao);
    }

    return notificacao;
  }

  // Notificações específicas para briefings
  async notificarAnaliseIAConcluida(
    briefingTitulo: string,
    score: number,
    categoria: string,
    briefingId: string
  ): Promise<void> {
    if (!this.config.categorias.analiseIA) return;

    const emoji = score >= 90 ? '🎉' : score >= 80 ? '✅' : score >= 70 ? '⚠️' : '❌';
    
    await this.criarNotificacao(
      score >= 80 ? 'sucesso' : score >= 70 ? 'info' : 'alerta',
      'Análise IA Concluída',
      `${emoji} ${briefingTitulo} - Score ${score}% (${categoria})`,
      {
        texto: 'Ver Análise',
        url: `/briefing/${briefingId}`
      },
      {
        briefingId,
        categoria: 'analiseIA'
      }
    );
  }

  async notificarAutoSave(
    briefingTitulo: string,
    progresso: number,
    briefingId: string
  ): Promise<void> {
    if (!this.config.categorias.autoSave) return;

    await this.criarNotificacao(
      'info',
      'Auto-save Executado',
      `💾 ${briefingTitulo} - Progresso ${progresso}% salvo`,
      {
        texto: 'Continuar',
        url: `/briefing/completo?id=${briefingId}`
      },
      {
        briefingId,
        categoria: 'autoSave'
      }
    );
  }

  async notificarAprovacaoPendente(
    briefingTitulo: string,
    cliente: string,
    briefingId: string,
    tempoEspera: string
  ): Promise<void> {
    if (!this.config.categorias.aprovacao) return;

    await this.criarNotificacao(
      'alerta',
      'Aprovação Pendente',
      `⏰ ${briefingTitulo} aguarda ${cliente} há ${tempoEspera}`,
      {
        texto: 'Enviar Lembrete',
        url: `/briefing/${briefingId}/lembrete`
      },
      {
        briefingId,
        categoria: 'aprovacao'
      }
    );
  }

  async notificarBriefingAprovado(
    briefingTitulo: string,
    cliente: string,
    briefingId: string
  ): Promise<void> {
    if (!this.config.categorias.aprovacao) return;

    await this.criarNotificacao(
      'sucesso',
      'Briefing Aprovado! 🎉',
      `${briefingTitulo} foi aprovado por ${cliente}`,
      {
        texto: 'Iniciar Projeto',
        url: `/projetos/novo?briefing=${briefingId}`
      },
      {
        briefingId,
        categoria: 'aprovacao'
      }
    );
  }

  async notificarErroSistema(
    erro: string,
    detalhes?: string
  ): Promise<void> {
    if (!this.config.categorias.sistema) return;

    await this.criarNotificacao(
      'erro',
      'Erro do Sistema',
      `🚨 ${erro}${detalhes ? ` - ${detalhes}` : ''}`,
      undefined,
      {
        categoria: 'sistema'
      }
    );
  }

  // Listar notificações
  listarNotificacoes(limite?: number, apenasNaoLidas?: boolean): Notificacao[] {
    let notifs = [...this.notificacoes];

    if (apenasNaoLidas) {
      notifs = notifs.filter(n => !n.lida);
    }

    if (limite) {
      notifs = notifs.slice(0, limite);
    }

    return notifs;
  }

  // Marcar como lida
  marcarComoLida(id: string): void {
    const notificacao = this.notificacoes.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      this.salvarNotificacoes();
    }
  }

  // Marcar todas como lidas
  marcarTodasComoLidas(): void {
    this.notificacoes.forEach(n => n.lida = true);
    this.salvarNotificacoes();
  }

  // Remover notificação
  removerNotificacao(id: string): void {
    this.notificacoes = this.notificacoes.filter(n => n.id !== id);
    this.salvarNotificacoes();
  }

  // Limpar notificações antigas
  limparNotificacoesAntigas(dias: number = 7): void {
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);

    this.notificacoes = this.notificacoes.filter(n => {
      const data = new Date(n.criadaEm);
      return data > limite;
    });

    this.salvarNotificacoes();
  }

  // Contar não lidas
  contarNaoLidas(): number {
    return this.notificacoes.filter(n => !n.lida).length;
  }

  // Configurações
  obterConfig(): ConfigNotificacao {
    return { ...this.config };
  }

  atualizarConfig(novaConfig: Partial<ConfigNotificacao>): void {
    this.config = { ...this.config, ...novaConfig };
    localStorage.setItem('arcflow_notificacoes_config', JSON.stringify(this.config));
  }

  // Solicitar permissão para notificações desktop
  async solicitarPermissaoDesktop(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Enviar notificação desktop
  private async enviarNotificacaoDesktop(notificacao: Notificacao): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(notificacao.titulo, {
      body: notificacao.mensagem,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notificacao.id,
      requireInteraction: notificacao.tipo === 'erro'
    });

    notification.onclick = () => {
      if (notificacao.acao?.url) {
        window.open(notificacao.acao.url, '_blank');
      }
      notification.close();
    };

    // Auto-fechar após 5 segundos (exceto erros)
    if (notificacao.tipo !== 'erro') {
      setTimeout(() => notification.close(), 5000);
    }
  }

  // Métodos privados
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private salvarNotificacoes(): void {
    // Manter apenas as últimas 100 notificações
    if (this.notificacoes.length > 100) {
      this.notificacoes = this.notificacoes.slice(0, 100);
    }

    localStorage.setItem('arcflow_notificacoes', JSON.stringify(this.notificacoes));
  }

  private carregarNotificacoes(): void {
    try {
      const dados = localStorage.getItem('arcflow_notificacoes');
      if (dados) {
        this.notificacoes = JSON.parse(dados);
      }

      const config = localStorage.getItem('arcflow_notificacoes_config');
      if (config) {
        this.config = { ...this.config, ...JSON.parse(config) };
      }
    } catch (error) {
      console.warn('Erro ao carregar notificações:', error);
    }
  }

  // Inicializar serviço
  inicializar(): void {
    this.carregarNotificacoes();
    this.limparNotificacoesAntigas();
    
    // Solicitar permissão para notificações desktop
    this.solicitarPermissaoDesktop();
  }
}

// Instância singleton
export const notificacoesService = NotificacoesService.getInstance();

// Hook para React
export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = React.useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = React.useState<number>(0);

  React.useEffect(() => {
    const atualizarNotificacoes = () => {
      setNotificacoes(notificacoesService.listarNotificacoes(10));
      setNaoLidas(notificacoesService.contarNaoLidas());
    };

    atualizarNotificacoes();
    
    // Atualizar a cada 30 segundos
    const intervalo = setInterval(atualizarNotificacoes, 30000);
    
    return () => clearInterval(intervalo);
  }, []);

  return {
    notificacoes,
    naoLidas,
    marcarComoLida: (id: string) => {
      notificacoesService.marcarComoLida(id);
      setNotificacoes(notificacoesService.listarNotificacoes(10));
      setNaoLidas(notificacoesService.contarNaoLidas());
    },
    marcarTodasComoLidas: () => {
      notificacoesService.marcarTodasComoLidas();
      setNotificacoes(notificacoesService.listarNotificacoes(10));
      setNaoLidas(0);
    },
    remover: (id: string) => {
      notificacoesService.removerNotificacao(id);
      setNotificacoes(notificacoesService.listarNotificacoes(10));
      setNaoLidas(notificacoesService.contarNaoLidas());
    }
  };
}

// Importar React para o hook
import React from 'react'; 