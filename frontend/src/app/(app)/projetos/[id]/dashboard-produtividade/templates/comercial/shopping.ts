import { ProjectTemplate } from '../../data/projectTemplates';

const ShoppingTemplate: ProjectTemplate = {
  id: 'comercial-shopping',
  nome: 'Shopping Center',
  tipologia: 'comercial',
  subtipo: 'shopping',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#7C3AED',
      cor_secundaria: '#F3E8FF',
      icone: '🏬'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Segurança', 'Urbanismo'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Masterplan Shopping',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#7C3AED',
      icone: '🏬',
      tarefas: [
        {
          id: 1,
          nome: 'Conceito do shopping',
          descricao: 'Desenvolvimento do masterplan do shopping center',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '80h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-03-01',
          template_notas: 'Shopping Center:\n- Lojas âncora\n- Praça de alimentação\n- Estacionamento\n- Cinemas\n- Infraestrutura',
          checklist: ['Masterplan', 'Âncoras', 'Fluxo', 'Estacionamento'],
          historico: []
        }
      ]
    }
  ]
};

export default ShoppingTemplate; 