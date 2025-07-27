export interface Orcamento {
  id: string;
  clienteId: string;
  briefingId: string;
  valorTotal: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  criadoEm: string;
  atualizadoEm: string;
  itens: OrcamentoItem[];
  observacoes?: string;
}

export interface OrcamentoItem {
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
} 