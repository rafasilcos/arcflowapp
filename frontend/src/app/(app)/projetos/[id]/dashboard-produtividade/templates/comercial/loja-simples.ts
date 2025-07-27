import { ProjectTemplate } from '../../data/projectTemplates';

const LojaSimplesTemplate: ProjectTemplate = {
  id: 'comercial-loja-simples',
  nome: 'Loja Comercial - Padrão Simples',
  tipologia: 'comercial',
  subtipo: 'loja',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#059669',
      cor_secundaria: '#ECFDF5',
      icone: '🏪'
    },
    disciplinas: ['Arquitetura', 'Instalações'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto de Loja',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#059669',
      icone: '🏪',
      tarefas: [
        {
          id: 1,
          nome: 'Layout comercial',
          descricao: 'Desenvolvimento do layout da loja',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-25',
          template_notas: 'Loja simples:\n- Área de vendas\n- Estoque\n- Caixa\n- Vitrine',
          checklist: ['Layout', 'Vitrine', 'Fluxo', 'Instalações'],
          historico: []
        }
      ]
    }
  ]
};

export default LojaSimplesTemplate; 