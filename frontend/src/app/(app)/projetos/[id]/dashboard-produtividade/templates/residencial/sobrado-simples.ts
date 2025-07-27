import { ProjectTemplate } from '../../data/projectTemplates';

const SobradoSimplesTemplate: ProjectTemplate = {
  id: 'residencial-sobrado-simples',
  nome: 'Sobrado Residencial - Padrão Simples',
  tipologia: 'residencial',
  subtipo: 'sobrado',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#059669',
      cor_secundaria: '#ECFDF5',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  
  etapas: [
    {
      id: 1,
      nome: 'Levantamento',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento topográfico',
          descricao: 'Medições do terreno para sobrado de 2 pavimentos',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '10h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Sobrado 2 pavimentos:\n- Térreo: garagem, sala, cozinha, lavabo\n- Superior: 3 quartos, 2 banheiros',
          checklist: ['Medições', 'Orientação', 'Acessos', 'Vizinhança'],
          historico: []
        }
      ]
    },
    {
      id: 2,
      nome: 'Estudo Preliminar',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#059669',
      icone: '✏️',
      tarefas: [
        {
          id: 2,
          nome: 'Plantas dos pavimentos',
          descricao: 'Desenvolver plantas térreo e superior',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '20h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-30',
          template_notas: 'Distribuição:\n- Térreo: social e serviços\n- Superior: íntimo',
          checklist: ['Planta térreo', 'Planta superior', 'Circulação vertical', 'Aprovação'],
          historico: []
        }
      ]
    },
    {
      id: 3,
      nome: 'Anteprojeto',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#10B981',
      icone: '🎨',
      tarefas: [
        {
          id: 3,
          nome: 'Cortes e fachadas',
          descricao: 'Desenvolver cortes e fachadas do sobrado',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '24h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-10',
          template_notas: 'Cortes e fachadas:\n- Pé-direito adequado\n- Escada interna\n- Fachadas harmoniosas',
          checklist: ['Cortes', 'Fachadas', 'Escada', 'Estrutura'],
          historico: []
        }
      ]
    },
    {
      id: 4,
      nome: 'Projeto Executivo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#F59E0B',
      icone: '🏗️',
      tarefas: [
        {
          id: 4,
          nome: 'Detalhamento construtivo',
          descricao: 'Detalhes construtivos específicos para sobrado',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '28h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-02-20',
          template_notas: 'Detalhamento:\n- Escada estrutural\n- Laje entre pavimentos\n- Instalações verticais',
          checklist: ['Detalhes construtivos', 'Memorial', 'Especificações', 'Quantitativos'],
          historico: []
        }
      ]
    }
  ]
};

export default SobradoSimplesTemplate; 