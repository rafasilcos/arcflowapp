import { ProjectTemplate } from '../../data/projectTemplates';

const EscritorioMedioTemplate: ProjectTemplate = {
  id: 'comercial-escritorio-medio',
  nome: 'Escritório Comercial - Padrão Médio',
  tipologia: 'comercial',
  subtipo: 'escritorio',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#1F2937',
      cor_secundaria: '#F9FAFB',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Automação', 'Acústica'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Briefing Corporativo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📋',
      tarefas: [
        {
          id: 1,
          nome: 'Análise das necessidades corporativas',
          descricao: 'Levantamento detalhado das necessidades do escritório',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-25',
          template_notas: 'Escritório médio:\n- 50-100 funcionários\n- Salas de reunião\n- Área de descanso\n- Recepção\n- Tecnologia integrada',
          checklist: ['Organograma', 'Fluxos', 'Tecnologia', 'Ergonomia'],
          historico: []
        }
      ]
    }
  ]
};

export default EscritorioMedioTemplate; 