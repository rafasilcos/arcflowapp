// ===== SISTEMA DE TEMPLATES DE PROJETOS - ARCFLOW =====
// Templates de dados para diferentes tipos de projetos
// Página fixa + dados dinâmicos = Performance otimizada

// ===== TIPOS E INTERFACES =====
export interface HistoricoItem {
  id: number;
  tipo: 'iniciada' | 'pausada' | 'retomada' | 'concluida' | 'revisao_solicitada' | 'comentario' | 'nota';
  descricao: string;
  timestamp: string;
  usuario: string;
  detalhes?: string;
}

export interface Tarefa {
  id: number;
  nome: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'pausada' | 'concluida' | 'atrasada' | 'em_revisao';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  responsavel: string;
  disciplina: string;
  tempoEstimado: string;
  tempoGasto: string;
  progresso: number;
  dataVencimento: string;
  historico: HistoricoItem[];
  template_notas?: string;
  checklist?: string[];
}

export interface Etapa {
  id: number;
  nome: string;
  status: 'nao_iniciada' | 'em_andamento' | 'concluida';
  progresso: number;
  tarefas: Tarefa[];
  cor_tema?: string;
  icone?: string;
}

export interface ProjectTemplate {
  id: string;
  nome: string;
  tipologia: string;
  subtipo: string;
  padrao: string;
  configuracoes: {
    tema: {
      cor_primaria: string;
      cor_secundaria: string;
      icone: string;
    };
    disciplinas: string[];
    comunicacao_equipe: boolean;
    modo_foco: boolean;
    gamificacao: boolean;
  };
  etapas: Etapa[];
}

// ===== TEMPLATE: RESIDENCIAL - CASA SIMPLES =====
export const TEMPLATE_RESIDENCIAL_CASA_SIMPLES: ProjectTemplate = {
  id: 'residencial-casa-simples',
  nome: 'Casa Residencial - Padrão Simples',
  tipologia: 'residencial',
  subtipo: 'casa_unifamiliar',
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
        },
        {
          id: 4,
          nome: 'Projeto elétrico preliminar',
          descricao: 'Definição dos pontos elétricos e dimensionamento da entrada de energia',
          status: 'em_revisao',
          prioridade: 'media',
          responsavel: 'Marina Elétrica',
          disciplina: 'Elétrica',
          tempoEstimado: '20h',
          tempoGasto: '16h 30m',
          progresso: 85,
          dataVencimento: '2024-12-22',
          template_notas: 'Projeto elétrico:\n- Pontos de iluminação: \n- Tomadas: \n- Carga total: \n- Entrada de energia: ',
          checklist: ['Definir pontos de iluminação', 'Posicionar tomadas', 'Calcular carga total', 'Dimensionar entrada'],
          historico: [
            { id: 12, tipo: 'iniciada', descricao: 'Início do projeto elétrico', timestamp: '2024-12-08 08:00', usuario: 'Marina Elétrica' },
            { id: 13, tipo: 'revisao_solicitada', descricao: 'Necessário revisar carga da cozinha', timestamp: '2024-12-16 14:10', usuario: 'Ana Arquiteta', detalhes: 'Cliente quer instalar forno industrial, revisar dimensionamento' },
            { id: 14, tipo: 'nota', descricao: 'Revisão em andamento, aguardando especificações do equipamento', timestamp: '2024-12-17 10:45', usuario: 'Marina Elétrica' }
          ]
        },
        {
          id: 5,
          nome: 'Memorial descritivo preliminar',
          descricao: 'Elaboração do memorial com especificações técnicas preliminares',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '12h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2024-12-25',
          template_notas: 'Memorial descritivo:\n- Especificações técnicas: \n- Materiais: \n- Sistemas construtivos: \n- Normas aplicáveis: ',
          checklist: ['Especificar materiais', 'Descrever sistemas', 'Listar normas', 'Revisar compatibilidade'],
          historico: []
        },
        {
          id: 6,
          nome: 'Compatibilização preliminar',
          descricao: 'Verificação de interferências entre disciplinas',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Coordenação',
          tempoEstimado: '8h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2024-12-19',
          template_notas: 'Compatibilização:\n- Interferências identificadas: \n- Soluções propostas: \n- Aprovações necessárias: ',
          checklist: ['Verificar interferências', 'Propor soluções', 'Validar com equipe', 'Documentar ajustes'],
          historico: []
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

// ===== TEMPLATE: COMERCIAL - ESCRITÓRIO =====
export const TEMPLATE_COMERCIAL_ESCRITORIO: ProjectTemplate = {
  id: 'comercial-escritorio',
  nome: 'Escritório Comercial',
  tipologia: 'comercial',
  subtipo: 'escritorio',
  padrao: 'medio',
  configuracoes: {
    tema: {
      cor_primaria: '#059669',
      cor_secundaria: '#ECFDF5',
      icone: '🏢'
    },
    disciplinas: ['Arquitetura', 'Instalações', 'Design', 'Sustentabilidade'],
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
      nome: 'Conceito e Layout Corporativo',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '🎨',
      tarefas: [
        {
          id: 2,
          nome: 'Conceito arquitetônico corporativo',
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
      nome: 'Projeto Corporativo Completo',
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
          nome: 'Instalações comerciais especializadas',
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
        },
        {
          id: 5,
          nome: 'Design de interiores corporativo',
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
    },
    {
      id: 4,
      nome: 'Sustentabilidade e Eficiência',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '🌱',
      tarefas: [
        {
          id: 6,
          nome: 'Estratégias sustentáveis',
          descricao: 'Implementação de soluções sustentáveis e eficiência energética',
          status: 'pendente',
          prioridade: 'media',
          responsavel: 'João Sustentabilidade',
          disciplina: 'Sustentabilidade',
          tempoEstimado: '16h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-10',
          template_notas: 'Sustentabilidade:\n- Eficiência energética: \n- Uso racional da água: \n- Materiais sustentáveis: \n- Certificações ambientais: ',
          checklist: ['Otimizar eficiência energética', 'Reduzir consumo de água', 'Especificar materiais sustentáveis', 'Buscar certificações'],
          historico: []
        }
      ]
    }
  ]
};

// ===== TEMPLATE: INSTITUCIONAL - ESCOLA =====
export const TEMPLATE_INSTITUCIONAL_ESCOLA: ProjectTemplate = {
  id: 'institucional-escola',
  nome: 'Escola/Universidade',
  tipologia: 'institucional',
  subtipo: 'educacional',
  padrao: 'alto',
  configuracoes: {
    tema: {
      cor_primaria: '#7C3AED',
      cor_secundaria: '#F3E8FF',
      icone: '🎓'
    },
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações', 'Paisagismo', 'Segurança', 'Acústica'],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  etapas: [
    {
      id: 1,
      nome: 'Viabilidade e Programa Educacional',
      status: 'concluida',
      progresso: 100,
      cor_tema: '#10B981',
      icone: '📚',
      tarefas: [
        {
          id: 1,
          nome: 'Estudo de viabilidade educacional',
          descricao: 'Análise de viabilidade técnica, legal e pedagógica',
          status: 'concluida',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '16h',
          tempoGasto: '17h 45m',
          progresso: 100,
          dataVencimento: '2024-01-20',
          template_notas: 'Viabilidade educacional:\n- Legislação educacional: \n- Capacidade de alunos: \n- Programa pedagógico: \n- Normas de segurança: ',
          checklist: ['Verificar legislação', 'Definir capacidade', 'Analisar programa', 'Aplicar normas de segurança'],
          historico: [
            { id: 1, tipo: 'iniciada', descricao: 'Início do estudo de viabilidade', timestamp: '2024-01-10 08:00', usuario: 'Ana Arquiteta' },
            { id: 2, tipo: 'concluida', descricao: 'Viabilidade aprovada pelos órgãos competentes', timestamp: '2024-01-18 16:00', usuario: 'Ana Arquiteta' }
          ]
        }
      ]
    },
    {
      id: 2,
      nome: 'Conceito Arquitetônico Educacional',
      status: 'em_andamento',
      progresso: 75,
      cor_tema: '#3B82F6',
      icone: '🎨',
      tarefas: [
        {
          id: 2,
          nome: 'Conceito pedagógico espacial',
          descricao: 'Desenvolvimento do conceito arquitetônico focado na pedagogia',
          status: 'em_andamento',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '20h',
          tempoGasto: '15h 20m',
          progresso: 75,
          dataVencimento: '2024-12-20',
          template_notas: 'Conceito educacional:\n- Filosofia pedagógica: \n- Espaços de aprendizagem: \n- Áreas de convivência: \n- Integração com exterior: ',
          checklist: ['Definir filosofia espacial', 'Criar espaços de aprendizagem', 'Planejar convivência', 'Integrar com paisagismo'],
          historico: [
            { id: 3, tipo: 'iniciada', descricao: 'Desenvolvimento do conceito iniciado', timestamp: '2024-12-10 09:00', usuario: 'Ana Arquiteta' },
            { id: 4, tipo: 'nota', descricao: 'Conceito 75% desenvolvido, aguardando validação pedagógica', timestamp: '2024-12-17 15:30', usuario: 'Ana Arquiteta' }
          ]
        }
      ]
    },
    {
      id: 3,
      nome: 'Projeto Multidisciplinar',
      status: 'nao_iniciada',
      progresso: 0,
      cor_tema: '#6B7280',
      icone: '🏗️',
      tarefas: [
        {
          id: 3,
          nome: 'Projeto arquitetônico educacional',
          descricao: 'Desenvolvimento completo do projeto arquitetônico',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Ana Arquiteta',
          disciplina: 'Arquitetura',
          tempoEstimado: '60h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-15',
          template_notas: 'Projeto educacional:\n- Salas de aula: \n- Laboratórios: \n- Áreas administrativas: \n- Espaços de convivência: ',
          checklist: ['Projetar salas de aula', 'Desenvolver laboratórios', 'Organizar administração', 'Criar espaços de convivência'],
          historico: []
        },
        {
          id: 4,
          nome: 'Projeto acústico especializado',
          descricao: 'Tratamento acústico para ambientes educacionais',
          status: 'pendente',
          prioridade: 'alta',
          responsavel: 'Carlos Acústica',
          disciplina: 'Acústica',
          tempoEstimado: '24h',
          tempoGasto: '0h',
          progresso: 0,
          dataVencimento: '2025-01-20',
          template_notas: 'Projeto acústico:\n- Isolamento acústico: \n- Tratamento de salas: \n- Controle de ruído: \n- Sistemas de som: ',
          checklist: ['Calcular isolamento', 'Tratar salas de aula', 'Controlar ruídos', 'Integrar sistemas de som'],
          historico: []
        }
      ]
    }
  ]
};

// ===== MAPEAMENTO DE TEMPLATES =====
export const PROJECT_TEMPLATES: Record<string, ProjectTemplate> = {
  'residencial-casa-simples': TEMPLATE_RESIDENCIAL_CASA_SIMPLES,
  'comercial-escritorio': TEMPLATE_COMERCIAL_ESCRITORIO,
  'institucional-escola': TEMPLATE_INSTITUCIONAL_ESCOLA
};

// ===== FUNÇÃO PARA DETECTAR TEMPLATE =====
export function detectProjectTemplate(projetoId: string, briefingData?: any): ProjectTemplate {
  // Por enquanto, vamos usar um sistema simples baseado no ID do projeto
  // No futuro, isso seria baseado nos dados do briefing/projeto
  
  if (projetoId === '1') {
    return PROJECT_TEMPLATES['residencial-casa-simples'];
  } else if (projetoId === '2') {
    return PROJECT_TEMPLATES['comercial-escritorio'];
  } else if (projetoId === '3') {
    return PROJECT_TEMPLATES['institucional-escola'];
  }
  
  // Template padrão
  return PROJECT_TEMPLATES['residencial-casa-simples'];
}

// ===== FUNÇÃO PARA LISTAR TEMPLATES DISPONÍVEIS =====
export function getAvailableTemplates(): ProjectTemplate[] {
  return Object.values(PROJECT_TEMPLATES);
}

// ===== FUNÇÃO PARA OBTER TEMPLATE POR ID =====
export function getTemplateById(templateId: string): ProjectTemplate | null {
  return PROJECT_TEMPLATES[templateId] || null;
} 