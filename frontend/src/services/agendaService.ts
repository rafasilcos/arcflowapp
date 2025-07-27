import { Reuniao, ParticipanteReuniao } from '../types/agenda';

const reunioesMock: Reuniao[] = [
  {
    id: 'reun-1',
    clienteId: '1',
    projetoId: 'proj-1',
    tipo: 'briefing',
    data: '2024-06-15T14:00:00Z',
    local: 'Escritório ArcFlow',
    participantes: [
      { nome: 'Maria Silva', email: 'maria@email.com', papel: 'Cliente' },
      { nome: 'Ana Costa', email: 'ana@arcflow.com', papel: 'Arquiteta' }
    ],
    observacoes: 'Reunião inicial de briefing.',
    status: 'agendada'
  }
];

export const agendaService = {
  agendarReuniao: async (clienteId: string, tipo: Reuniao['tipo'], data: string, local: string, participantes: ParticipanteReuniao[], projetoId?: string, observacoes?: string): Promise<Reuniao> => {
    const nova: Reuniao = {
      id: 'reun-' + Date.now(),
      clienteId,
      projetoId,
      tipo,
      data,
      local,
      participantes,
      observacoes,
      status: 'agendada'
    };
    reunioesMock.push(nova);
    return nova;
  },
  buscarReunioesPorCliente: async (clienteId: string): Promise<Reuniao[]> => {
    return reunioesMock.filter(r => r.clienteId === clienteId);
  },
  atualizarStatus: async (reuniaoId: string, status: Reuniao['status']): Promise<Reuniao | null> => {
    const idx = reunioesMock.findIndex(r => r.id === reuniaoId);
    if (idx === -1) return null;
    reunioesMock[idx].status = status;
    return reunioesMock[idx];
  }
}; 