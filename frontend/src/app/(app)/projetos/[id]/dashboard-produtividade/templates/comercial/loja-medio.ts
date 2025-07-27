import { ProjectTemplate } from '../../data/projectTemplates';

const LojaMedioTemplate: ProjectTemplate = {
  id: 'comercial-loja-medio',
  nome: 'Loja Comercial - Padrão Médio',
  tipologia: 'comercial',
  subtipo: 'loja',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#0891B2',
      cor_secundaria: '#E0F7FA',
      icone: '🏪'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Design'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Comercial',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#0891B2',
      icone: '🏪',
      tarefas: [
        {
          id: 1,
          nome: 'Design comercial',
          descricao: 'Projeto completo da loja média',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '24h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-30',
          template_notas: 'Loja média:\n- Múltiplos ambientes\n- Provadores\n- Estoque amplo\n- Design elaborado',
          checklist: ['Design', 'Ambientes', 'Fluxo', 'Identidade'],
          historico: []
        }
      ]
    }
  ]
};

export default LojaMedioTemplate; 