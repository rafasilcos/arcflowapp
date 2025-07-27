// SERVIÇO DE INTEGRAÇÃO COMERCIAL - ARCFLOW
// Conecta todo o fluxo: CRM → Briefing → Orçamento → Projeto

import { 
  Lead, 
  Cliente, 
  ContextoBriefing, 
  OrcamentoAutomatico, 
  ProjetoAutomatico, 
  WorkflowIntegracao,
  IntegracaoComercialService,
  ProjetoAnterior,
  ConversaComercial
} from '../types/integracaoComercial';

// Mock de clientes para simulação
const clientesMock: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria@email.com',
    telefone: '(11) 99999-1234',
    endereco: {
      cep: '01310-100',
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      pais: 'Brasil',
    },
    origem: {
      fonte: 'indicacao',
      dataContato: '2024-01-15T10:00:00Z',
      responsavelComercial: 'Ana Costa',
      conversasAnteriores: [
        {
          data: '2024-01-10T09:00:00Z',
          responsavel: 'Ana Costa',
          canal: 'telefone',
          resumo: 'Primeiro contato, interesse em casa nova.'
        }
      ]
    },
    historicoProjetos: [
      {
        projetoId: 'proj-001',
        tipologia: 'Residencial',
        ano: 2022,
        valor: 450000,
        satisfacao: 9.5,
        observacoes: 'Cliente satisfeita, indicou amigos.'
      }
    ],
    preferencias: {
      estilosArquitetonicos: ['Contemporâneo'],
      materiaisPreferidos: ['Concreto', 'Vidro'],
      coresPreferidas: ['Branco', 'Cinza'],
      orcamentoMedioHistorico: 600000,
      prazoTipicoPreferido: 180
    },
    status: 'ativo',
    criadoEm: '2024-01-15T10:00:00Z',
    atualizadoEm: '2024-06-14T10:00:00Z',
  },
  // ... outros clientes mockados ...
];

export const integracaoComercialService = {
  buscarCliente: async (termo: string): Promise<Cliente[]> => {
    return clientesMock.filter(c =>
      c.nome.toLowerCase().includes(termo.toLowerCase()) ||
      c.email.toLowerCase().includes(termo.toLowerCase()) ||
      c.telefone.includes(termo)
    );
  },
  criarCliente: async (cliente: Partial<Cliente>): Promise<Cliente> => {
    const novo: Cliente = {
      ...cliente,
      id: String(Date.now()),
      historicoProjetos: [],
      preferencias: cliente.preferencias || {
        estilosArquitetonicos: [],
        materiaisPreferidos: [],
        coresPreferidas: [],
        orcamentoMedioHistorico: 0,
        prazoTipicoPreferido: 0
      },
      status: 'ativo',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    } as Cliente;
    clientesMock.push(novo);
    return novo;
  },
  atualizarCliente: async (id: string, dados: Partial<Cliente>): Promise<Cliente | null> => {
    const idx = clientesMock.findIndex(c => c.id === id);
    if (idx === -1) return null;
    clientesMock[idx] = { ...clientesMock[idx], ...dados, atualizadoEm: new Date().toISOString() };
    return clientesMock[idx];
  },
  buscarHistorico: async (id: string): Promise<{ projetos: ProjetoAnterior[]; conversas: ConversaComercial[] }> => {
    const cliente = clientesMock.find(c => c.id === id);
    return cliente ? { projetos: cliente.historicoProjetos, conversas: cliente.origem.conversasAnteriores || [] } : { projetos: [], conversas: [] };
  },
  executarWorkflowPosBriefing: async (briefingId: string, configuracoes: any): Promise<void> => {
    // Mock: apenas simula delay
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
}; 