import { ProjectTemplate } from '../../data/projectTemplates';

// ===== TEMPLATE: COMERCIAL - ESCRITÓRIO SIMPLES =====
const template: ProjectTemplate = {
  id: 'comercial-escritorio-simples',
  nome: 'Escritório Comercial - Padrão Simples',
  tipologia: 'comercial',
  subtipo: 'escritorio',
  padrao: 'simples',
  configuracoes: {
    tema: {
      cor_primaria: '#059669',
      cor_secundaria: '#ECFDF5',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Design'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  etapas: [
    {
      id: 1,
      nome: 'Briefing e Análise Comercial',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '📊',
      tarefas: [
        {
          id: 1,
          nome: 'Análise do negócio',
          descricao: 'Compreensão da atividade empresarial e necessidades específicas',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '6h',
          tempoGasto: '6h 15m',
          progresso: 100,
          dataVencimento: '2024-01-15',
          template_notas: 'Análise do negócio:\n- Atividade principal: \n- Fluxo de trabalho: \n- Necessidades específicas: \n- Crescimento previsto: ',
          checklist: ['Entender atividade principal', 'Mapear fluxos de trabalho', 'Identificar necessidades', 'Prever crescimento'],
          historico: [
            { id: 1, tipo: 'iniciada', descricao: 'Reunião inicial com cliente', timestamp: '2024-01-10 09:00', usuario: 'Ana Arquiteta' },
            { id: 2, tipo: 'concluida', descricao: 'Análise completa do negócio finalizada', timestamp: '2024-01-12 16:30', usuario: 'Ana Arquiteta' }
          ]
        }
      ]
    },
    {
      id: 2,
      nome: 'Conceito e Layout',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '🎨',
      tarefas: [
        {
          id: 2,
          nome: 'Conceito arquitetônico',
          descricao: 'Definição do conceito espacial e identidade da marca',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Marina Designer',
          disciplina: 'Design',
          tempoEstimado: '12h',
          tempoGasto: '13h 20m',
          progresso: 100,
          dataVencimento: '2024-02-01',
          template_notas: 'Conceito corporativo:\n- Identidade da marca: \n- Conceito espacial: \n- Paleta de cores: \n- Materiais conceituais: ',
          checklist: ['Definir identidade visual', 'Criar conceito espacial', 'Selecionar paleta', 'Especificar materiais'],
          historico: [
            { id: 3, tipo: 'iniciada', descricao: 'Desenvolvimento do conceito iniciado', timestamp: '2024-01-20 08:00', usuario: 'Marina Designer' },
            { id: 4, tipo: 'concluida', descricao: 'Conceito aprovado pelo cliente', timestamp: '2024-01-30 17:00', usuario: 'Marina Designer' }
          ]
        }
      ]
    },
    {
      id: 3,
      nome: 'Projeto Comercial',
      status: 'em_andamento',
      progresso: 45,
      cor_tema: '#3B82F6',
      icone: '🏗️',
      tarefas: [
        {
          id: 3,
          nome: 'Projeto arquitetônico comercial',
          descricao: 'Desenvolvimento de plantas, cortes e fachadas',
          status: 'em_andamento',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '30h',
          tempoGasto: '14h 30m',
          progresso: 50,
          dataVencimento: '2024-12-20',
          template_notas: 'Projeto arquitetônico comercial:\n- Plantas desenvolvidas: \n- Cortes e fachadas: \n- Normas comerciais: \n- Acessibilidade: ',
          checklist: ['Desenvolver plantas baixas', 'Criar cortes e fachadas', 'Verificar normas', 'Garantir acessibilidade'],
          historico: [
            { id: 5, tipo: 'iniciada', descricao: 'Início do projeto arquitetônico', timestamp: '2024-12-05 09:00', usuario: 'Ana Arquiteta' },
            { id: 6, tipo: 'nota', descricao: 'Plantas baixas 70% concluídas', timestamp: '2024-12-15 14:20', usuario: 'Ana Arquiteta' }
          ]
        },
        {
          id: 4,
          nome: 'Instalações comerciais',
          descricao: 'Projeto de instalações para ambiente corporativo',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Instalações',
          disciplina: 'Instalações',
          tempoEstimado: '24h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2024-12-22',
          template_notas: 'Instalações comerciais:\n- Elétrica e dados: \n- Ar condicionado: \n- Sistema de segurança: \n- Automação predial: ',
          checklist: ['Projetar elétrica e dados', 'Dimensionar ar condicionado', 'Planejar segurança', 'Integrar automação'],
          historico: []
        }
      ]
    },
    {
      id: 4,
      nome: 'Finalização',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '✅',
      tarefas: [
        {
          id: 5,
          nome: 'Design de interiores',
          descricao: 'Projeto de interiores focado na produtividade',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'Marina Designer',
          disciplina: 'Design',
          tempoEstimado: '28h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2024-12-25',
          template_notas: 'Design corporativo:\n- Especificações de acabamento: \n- Mobiliário corporativo: \n- Iluminação: \n- Identidade visual aplicada: ',
          checklist: ['Especificar acabamentos', 'Definir mobiliário', 'Projetar iluminação', 'Aplicar identidade'],
          historico: []
        }
      ]
    }
  ]
};

export default template; 