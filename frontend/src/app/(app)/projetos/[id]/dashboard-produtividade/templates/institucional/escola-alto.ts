import { ProjectTemplate } from '../../data/projectTemplates';

const EscolaAltoTemplate: ProjectTemplate = {
  id: 'institucional-escola-alto',
  nome: 'Escola Institucional - Padrão Alto',
  tipologia: 'institucional',
  subtipo: 'escola',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#7C3AED',
      cor_secundaria: '#F3E8FF',
      icone: '🏫'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Acessibilidade', 'Sustentabilidade', 'Tecnologia'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Campus Educacional',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#7C3AED',
      icone: '🏫',
      tarefas: [
        {
          id: 1,
          nome: 'Masterplan educacional',
          descricao: 'Desenvolvimento do campus educacional completo',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '100h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-03-10',
          template_notas: 'Campus educacional:\n- Múltiplos pavilhões\n- Centro de pesquisa\n- Complexo esportivo\n- Tecnologia avançada\n- Sustentabilidade',
          checklist: ['Masterplan', 'Tecnologia', 'Sustentabilidade', 'Certificações'],
          historico: []
        }
      ]
    }
  ]
};

export default EscolaAltoTemplate; 