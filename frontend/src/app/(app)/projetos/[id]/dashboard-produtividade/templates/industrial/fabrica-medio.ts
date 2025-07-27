import { ProjectTemplate } from '../../data/projectTemplates';

const FabricaMedioTemplate: ProjectTemplate = {
  id: 'industrial-fabrica-medio',
  nome: 'Fábrica Industrial - Padrão Médio',
  tipologia: 'industrial',
  subtipo: 'fabrica',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#4B5563',
      cor_secundaria: '#F3F4F6',
      icone: '🏭'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações Industriais', 'Automação'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Industrial Médio',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#4B5563',
      icone: '🏭',
      tarefas: [
        {
          id: 1,
          nome: 'Layout industrial avançado',
          descricao: 'Desenvolvimento do layout da fábrica de médio porte',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '60h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Fábrica média:\n- Múltiplas linhas de produção\n- Laboratório\n- Refeitório\n- Manutenção\n- Automação',
          checklist: ['Layout', 'Automação', 'Segurança', 'Meio ambiente'],
          historico: []
        }
      ]
    }
  ]
};

export default FabricaMedioTemplate; 