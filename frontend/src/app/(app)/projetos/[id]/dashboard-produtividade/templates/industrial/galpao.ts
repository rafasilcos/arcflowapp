import { ProjectTemplate } from '../../data/projectTemplates';

const GalpaoTemplate: ProjectTemplate = {
  id: 'industrial-galpao',
  nome: 'Galpão Industrial',
  tipologia: 'industrial',
  subtipo: 'galpao',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#6B7280',
      cor_secundaria: '#F3F4F6',
      icone: '🏗️'
    },
    disciplinas: ['Arquitetura', 'Estrutural'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Projeto de Galpão',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '🏗️',
      tarefas: [
        {
          id: 1,
          nome: 'Estrutura do galpão',
          descricao: 'Projeto estrutural do galpão industrial',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '32h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-05',
          template_notas: 'Galpão:\n- Estrutura metálica\n- Cobertura\n- Fechamentos\n- Instalações básicas',
          checklist: ['Estrutura', 'Cobertura', 'Fechamentos', 'Instalações'],
          historico: []
        }
      ]
    }
  ]
};

export default GalpaoTemplate; 