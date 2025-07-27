import { ProjectTemplate } from '../../data/projectTemplates';

const ApartamentoTemplate: ProjectTemplate = {
  id: 'residencial-apartamento',
  nome: 'Apartamento Residencial',
  tipologia: 'residencial',
  subtipo: 'apartamento',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#DC2626',
      cor_secundaria: '#FEF2F2',
      icone: '🏠'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Design de Interiores'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Levantamento',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento do apartamento',
          descricao: 'Medições e análise do apartamento existente',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '8h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Apartamento:\n- Reforma/decoração\n- 3 quartos, 2 banheiros\n- Sala integrada\n- Cozinha americana',
          checklist: ['Medições', 'Estado atual', 'Instalações', 'Estrutura'],
          historico: []
        }
      ]
    }
  ]
};

export default ApartamentoTemplate; 