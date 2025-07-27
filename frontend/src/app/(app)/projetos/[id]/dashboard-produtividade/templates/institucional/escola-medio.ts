import { ProjectTemplate } from '../../data/projectTemplates';

const EscolaMedioTemplate: ProjectTemplate = {
  id: 'institucional-escola-medio',
  nome: 'Escola Institucional - Padrão Médio',
  tipologia: 'institucional',
  subtipo: 'escola',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#0891B2',
      cor_secundaria: '#E0F7FA',
      icone: '🏫'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Acessibilidade', 'Sustentabilidade'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Complexo Educacional',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#0891B2',
      icone: '🏫',
      tarefas: [
        {
          id: 1,
          nome: 'Programa educacional completo',
          descricao: 'Desenvolvimento do complexo educacional',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '60h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Escola média:\n- Múltiplos blocos\n- Laboratórios\n- Quadra esportiva\n- Auditório\n- Área verde',
          checklist: ['Blocos', 'Laboratórios', 'Esportes', 'Sustentabilidade'],
          historico: []
        }
      ]
    }
  ]
};

export default EscolaMedioTemplate; 