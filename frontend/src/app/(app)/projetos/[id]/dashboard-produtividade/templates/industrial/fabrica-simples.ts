import { ProjectTemplate } from '../../data/projectTemplates';

const FabricaSimplesTemplate: ProjectTemplate = {
  id: 'industrial-fabrica-simples',
  nome: 'Fábrica Industrial - Padrão Simples',
  tipologia: 'industrial',
  subtipo: 'fabrica',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#374151',
      cor_secundaria: '#F9FAFB',
      icone: '🏭'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações Industriais'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto Industrial',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#374151',
      icone: '🏭',
      tarefas: [
        {
          id: 1,
          nome: 'Layout industrial',
          descricao: 'Desenvolvimento do layout da fábrica',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '40h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-10',
          template_notas: 'Fábrica simples:\n- Área de produção\n- Estoque\n- Escritórios\n- Vestiários\n- Portaria',
          checklist: ['Layout', 'Fluxo produtivo', 'Segurança', 'Instalações'],
          historico: []
        }
      ]
    }
  ]
};

export default FabricaSimplesTemplate; 