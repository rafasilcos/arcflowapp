import { ProjectTemplate } from '../../data/projectTemplates';

const UniversidadeTemplate: ProjectTemplate = {
  id: 'institucional-universidade',
  nome: 'Universidade Institucional',
  tipologia: 'institucional',
  subtipo: 'universidade',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#581C87',
      cor_secundaria: '#FAF5FF',
      icone: '🎓'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Sustentabilidade', 'Urbanismo', 'Tecnologia'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Campus Universitário',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#581C87',
      icone: '🎓',
      tarefas: [
        {
          id: 1,
          nome: 'Masterplan universitário',
          descricao: 'Desenvolvimento do masterplan do campus universitário',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '200h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-04-01',
          template_notas: 'Universidade:\n- Múltiplas faculdades\n- Biblioteca central\n- Centro de pesquisa\n- Residência estudantil\n- Complexo esportivo',
          checklist: ['Masterplan', 'Faculdades', 'Pesquisa', 'Moradia', 'Esportes'],
          historico: []
        }
      ]
    }
  ]
};

export default UniversidadeTemplate; 