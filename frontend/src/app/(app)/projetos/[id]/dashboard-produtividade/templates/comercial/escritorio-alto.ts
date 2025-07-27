import { ProjectTemplate } from '../../data/projectTemplates';

const EscritorioAltoTemplate: ProjectTemplate = {
  id: 'comercial-escritorio-alto',
  nome: 'Escritório Comercial - Padrão Alto',
  tipologia: 'comercial',
  subtipo: 'escritorio',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#111827',
      cor_secundaria: '#F3F4F6',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Automação', 'Acústica', 'Sustentabilidade'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Conceituação Corporativa',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📋',
      tarefas: [
        {
          id: 1,
          nome: 'Desenvolvimento conceitual premium',
          descricao: 'Conceito premium para escritório de alto padrão',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '32h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-30',
          template_notas: 'Escritório alto padrão:\n- +100 funcionários\n- Salas executivas\n- Auditório\n- Tecnologia avançada\n- Sustentabilidade',
          checklist: ['Conceito', 'Sustentabilidade', 'Tecnologia', 'Execução'],
          historico: []
        }
      ]
    }
  ]
};

export default EscritorioAltoTemplate; 