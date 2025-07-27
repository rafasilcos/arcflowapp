import { ProjectTemplate } from '../../data/projectTemplates';

const RestauranteTemplate: ProjectTemplate = {
  id: 'comercial-restaurante',
  nome: 'Restaurante Comercial',
  tipologia: 'comercial',
  subtipo: 'restaurante',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#DC2626',
      cor_secundaria: '#FEF2F2',
      icone: '🍽️'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Cozinha Industrial'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Gastronômico',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#DC2626',
      icone: '🍽️',
      tarefas: [
        {
          id: 1,
          nome: 'Layout gastronômico',
          descricao: 'Projeto completo do restaurante',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '32h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-05',
          template_notas: 'Restaurante:\n- Salão principal\n- Cozinha industrial\n- Área de serviço\n- Sanitários\n- Estoque',
          checklist: ['Layout', 'Cozinha', 'Fluxo', 'Sanitários'],
          historico: []
        }
      ]
    }
  ]
};

export default RestauranteTemplate; 