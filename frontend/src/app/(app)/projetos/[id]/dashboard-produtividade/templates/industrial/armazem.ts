import { ProjectTemplate } from '../../data/projectTemplates';

const ArmazemTemplate: ProjectTemplate = {
  id: 'industrial-armazem',
  nome: 'Armazém Industrial',
  tipologia: 'industrial',
  subtipo: 'armazem',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#92400E',
      cor_secundaria: '#FEF7ED',
      icone: '📦'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Logística'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto de Armazém',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#92400E',
      icone: '📦',
      tarefas: [
        {
          id: 1,
          nome: 'Layout logístico',
          descricao: 'Projeto do layout do armazém e fluxos logísticos',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '48h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-15',
          template_notas: 'Armazém:\n- Área de estocagem\n- Docas de carga\n- Escritórios\n- Área de expedição',
          checklist: ['Layout', 'Fluxos', 'Docas', 'Armazenagem'],
          historico: []
        }
      ]
    }
  ]
};

export default ArmazemTemplate; 