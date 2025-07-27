import { ProjectTemplate } from '../../data/projectTemplates';

const EscolaSimplesTemplate: ProjectTemplate = {
  id: 'institucional-escola-simples',
  nome: 'Escola Institucional - Padrão Simples',
  tipologia: 'institucional',
  subtipo: 'escola',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#059669',
      cor_secundaria: '#ECFDF5',
      icone: '🏫'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Acessibilidade'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Educacional',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#059669',
      icone: '🏫',
      tarefas: [
        {
          id: 1,
          nome: 'Programa pedagógico',
          descricao: 'Desenvolvimento do programa da escola',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '40h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-10',
          template_notas: 'Escola simples:\n- Salas de aula\n- Pátio\n- Biblioteca\n- Refeitório\n- Administração',
          checklist: ['Salas de aula', 'Pátio', 'Biblioteca', 'Acessibilidade'],
          historico: []
        }
      ]
    }
  ]
};

export default EscolaSimplesTemplate; 