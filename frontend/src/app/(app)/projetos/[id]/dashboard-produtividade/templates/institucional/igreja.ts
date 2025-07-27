import { ProjectTemplate } from '../../data/projectTemplates';

const IgrejaTemplate: ProjectTemplate = {
  id: 'institucional-igreja',
  nome: 'Igreja Institucional',
  tipologia: 'institucional',
  subtipo: 'igreja',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#7C2D12',
      cor_secundaria: '#FEF7ED',
      icone: '⛪'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Acústica', 'Instalações'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Religioso',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#7C2D12',
      icone: '⛪',
      tarefas: [
        {
          id: 1,
          nome: 'Programa religioso',
          descricao: 'Desenvolvimento do programa da igreja',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '50h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-25',
          template_notas: 'Igreja:\n- Nave principal\n- Altar\n- Sacristia\n- Salão de eventos\n- Estacionamento',
          checklist: ['Nave', 'Altar', 'Acústica', 'Acessibilidade'],
          historico: []
        }
      ]
    }
  ]
};

export default IgrejaTemplate; 