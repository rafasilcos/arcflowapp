import { ProjectTemplate } from '../../data/projectTemplates';

const SobradoMedioTemplate: ProjectTemplate = {
  id: 'residencial-sobrado-medio',
  nome: 'Sobrado Residencial - Padrão Médio',
  tipologia: 'residencial',
  subtipo: 'sobrado',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#0891B2',
      cor_secundaria: '#E0F7FA',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Paisagismo'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Levantamento Detalhado',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento completo',
          descricao: 'Levantamento para sobrado de padrão médio',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '14h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Sobrado médio:\n- 4 quartos (2 suítes)\n- Sala de estar e jantar\n- Cozinha planejada\n- Área gourmet',
          checklist: ['Topografia', 'Solo', 'Orientação', 'Infraestrutura'],
          historico: []
        }
      ]
    }
  ]
};

export default SobradoMedioTemplate; 