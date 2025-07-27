import { ProjectTemplate } from '../../data/projectTemplates';

// ===== TEMPLATE: RESIDENCIAL - CASA SIMPLES =====
const template: ProjectTemplate = {
  id: 'residencial-casa-simples',
  nome: 'Casa Residencial - Padrão Simples',
  tipologia: 'residencial',
  subtipo: 'casa',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#3B82F6',
      cor_secundaria: '#EFF6FF', 
      icone: '🏠'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  etapas: [
    {
      id: 1,
      nome: 'Levantamento e Análise',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '📐',
      tarefas: [
        {
          id: 1,
          nome: 'Levantamento topográfico',
          descricao: 'Realizar medições precisas do terreno e identificar características geotécnicas',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '8h',
          tempoGasto: '8h 30m',
          progresso: 100,
          dataVencimento: '2024-01-25',
          template_notas: 'Levantamento topográfico:\n- Medições realizadas: \n- Características do solo: \n- Orientação solar: \n- Observações importantes: ',
          checklist: ['Medir dimensões do terreno', 'Verificar topografia', 'Analisar orientação solar', 'Fotografar terreno', 'Verificar infraestrutura'],
          historico: [
            { id: 1, tipo: 'iniciada', descricao: 'Tarefa iniciada', timestamp: '2024-01-20 09:00', usuario: 'Ana Arquiteta' },
            { id: 2, tipo: 'pausada', descricao: 'Pausa para reunião com cliente', timestamp: '2024-01-20 14:30', usuario: 'Ana Arquiteta' },
            { id: 3, tipo: 'retomada', descricao: 'Retomada após reunião', timestamp: '2024-01-20 16:00', usuario: 'Ana Arquiteta' },
            { id: 4, tipo: 'concluida', descricao: 'Levantamento finalizado com sucesso', timestamp: '2024-01-22 17:30', usuario: 'Ana Arquiteta' }
          ]
        }
      ]
    },
    {
      id: 2,
      nome: 'Estudo Preliminar',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '✏️',
      tarefas: [
        {
          id: 2,
          nome: 'Plantas baixas preliminares',
          descricao: 'Desenvolvimento das plantas baixas com layout inicial dos ambientes',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '24h',
          tempoGasto: '26h 15m',
          progresso: 100,
          dataVencimento: '2024-02-15',
          template_notas: 'Plantas baixas preliminares:\n- Programa atendido: \n- Distribuição dos ambientes: \n- Circulação: \n- Aprovação do cliente: ',
          checklist: ['Distribuir ambientes conforme programa', 'Otimizar circulação', 'Verificar orientação solar', 'Apresentar ao cliente'],
          historico: [
            { id: 5, tipo: 'iniciada', descricao: 'Início do desenvolvimento das plantas', timestamp: '2024-02-01 08:00', usuario: 'Ana Arquiteta' },
            { id: 6, tipo: 'revisao_solicitada', descricao: 'Cliente solicitou ajustes no layout da sala', timestamp: '2024-02-10 10:30', usuario: 'João Silva', detalhes: 'Aumentar área da sala de estar e reposicionar lareira' },
            { id: 7, tipo: 'nota', descricao: 'Ajustes realizados conforme solicitação', timestamp: '2024-02-12 14:20', usuario: 'Ana Arquiteta' },
            { id: 8, tipo: 'concluida', descricao: 'Plantas aprovadas pelo cliente', timestamp: '2024-02-14 16:45', usuario: 'Ana Arquiteta' }
          ]
        }
      ]
    },
    {
      id: 3,
      nome: 'Anteprojeto',
      status: 'em_andamento',
      progresso: 60,
      cor_tema: '#3B82F6',
      icone: '🏗️',
      tarefas: [
        {
          id: 3,
          nome: 'Projeto estrutural preliminar',
          descricao: 'Dimensionamento inicial da estrutura e definição do sistema construtivo',
          status: 'em_andamento',
          prioridade: 'alta',
          responsavel: 'Carlos Estrutural',
          disciplina: 'Estrutural',
          tempoEstimado: '32h',
          tempoGasto: '18h 45m',
          progresso: 60,
          dataVencimento: '2024-12-20',
          template_notas: 'Projeto estrutural:\n- Sistema construtivo: \n- Dimensionamento: \n- Cargas aplicadas: \n- Interferências: ',
          checklist: ['Definir sistema construtivo', 'Calcular cargas', 'Dimensionar elementos', 'Verificar interferências'],
          historico: [
            { id: 9, tipo: 'iniciada', descricao: 'Início dos cálculos estruturais', timestamp: '2024-12-10 09:15', usuario: 'Carlos Estrutural' },
            { id: 10, tipo: 'nota', descricao: 'Definido sistema de lajes nervuradas', timestamp: '2024-12-12 11:30', usuario: 'Carlos Estrutural' },
            { id: 11, tipo: 'pausada', descricao: 'Aguardando aprovação do cliente para prosseguir', timestamp: '2024-12-15 15:20', usuario: 'Carlos Estrutural' }
          ]
        }
      ]
    },
    {
      id: 4,
      nome: 'Projeto Executivo',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '📋',
      tarefas: [
        {
          id: 7,
          nome: 'Detalhamento arquitetônico',
          descricao: 'Desenvolvimento de todos os detalhes construtivos e especificações finais',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '48h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-15',
          template_notas: 'Detalhamento arquitetônico:\n- Detalhes construtivos: \n- Especificações finais: \n- Pranchas técnicas: ',
          checklist: ['Detalhar elementos construtivos', 'Finalizar especificações', 'Organizar pranchas', 'Revisar conjunto'],
          historico: []
        }
      ]
    }
  ]
};

export default template; 