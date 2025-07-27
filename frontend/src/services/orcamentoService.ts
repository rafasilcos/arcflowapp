import { Orcamento, OrcamentoItem } from '../types/orcamento';

const orcamentosMock: Orcamento[] = [
  {
    id: 'orc-1',
    clienteId: '1',
    briefingId: 'brief-1',
    valorTotal: 150000,
    status: 'pendente',
    criadoEm: '2024-06-14T10:00:00Z',
    atualizadoEm: '2024-06-14T10:00:00Z',
    itens: [
      { descricao: 'Projeto Arquitetônico', quantidade: 1, unidade: 'un', valorUnitario: 100000, valorTotal: 100000 },
      { descricao: 'Consultoria Técnica', quantidade: 1, unidade: 'un', valorUnitario: 50000, valorTotal: 50000 }
    ],
    observacoes: 'Orçamento inicial gerado automaticamente.'
  }
];

export const orcamentoService = {
  gerarOrcamento: async (clienteId: string, briefingId: string): Promise<Orcamento> => {
    // Simula geração de orçamento
    const novo: Orcamento = {
      id: 'orc-' + Date.now(),
      clienteId,
      briefingId,
      valorTotal: 120000,
      status: 'pendente',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      itens: [
        { descricao: 'Projeto Arquitetônico', quantidade: 1, unidade: 'un', valorUnitario: 80000, valorTotal: 80000 },
        { descricao: 'Consultoria Técnica', quantidade: 1, unidade: 'un', valorUnitario: 40000, valorTotal: 40000 }
      ],
      observacoes: 'Orçamento simulado.'
    };
    orcamentosMock.push(novo);
    return novo;
  },
  buscarOrcamentosPorCliente: async (clienteId: string): Promise<Orcamento[]> => {
    return orcamentosMock.filter(o => o.clienteId === clienteId);
  },
  atualizarStatus: async (orcamentoId: string, status: Orcamento['status']): Promise<Orcamento | null> => {
    const idx = orcamentosMock.findIndex(o => o.id === orcamentoId);
    if (idx === -1) return null;
    orcamentosMock[idx].status = status;
    orcamentosMock[idx].atualizadoEm = new Date().toISOString();
    return orcamentosMock[idx];
  }
}; 