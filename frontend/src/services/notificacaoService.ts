import { Notificacao } from '../types/notificacao';

const notificacoesMock: Notificacao[] = [
  {
    id: 'not-1',
    destinatario: 'ana@arcflow.com',
    titulo: 'Novo Briefing Realizado',
    mensagem: 'Um novo briefing foi preenchido para o cliente Maria Silva.',
    dataEnvio: '2024-06-14T10:00:00Z',
    lida: false,
    tipo: 'sistema'
  }
];

export const notificacaoService = {
  enviarNotificacao: async (destinatario: string, titulo: string, mensagem: string, tipo: Notificacao['tipo'] = 'sistema'): Promise<Notificacao> => {
    const nova: Notificacao = {
      id: 'not-' + Date.now(),
      destinatario,
      titulo,
      mensagem,
      dataEnvio: new Date().toISOString(),
      lida: false,
      tipo
    };
    notificacoesMock.push(nova);
    return nova;
  },
  buscarNotificacoesPorDestinatario: async (destinatario: string): Promise<Notificacao[]> => {
    return notificacoesMock.filter(n => n.destinatario === destinatario);
  },
  marcarComoLida: async (notificacaoId: string): Promise<Notificacao | null> => {
    const idx = notificacoesMock.findIndex(n => n.id === notificacaoId);
    if (idx === -1) return null;
    notificacoesMock[idx].lida = true;
    return notificacoesMock[idx];
  }
}; 