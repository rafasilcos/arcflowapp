// ===== TIPOS PARA GESTÃO DE EQUIPE =====
// Estrutura correta separando cargo (formação) de função (papel na equipe)

export interface CargoProfissional {
  value: string;
  label: string;
  desc: string;
  area: string;
}

export interface FuncaoOrganizacional {
  value: string;
  label: string;
  desc: string;
  nivel: 'DIRETORIA' | 'COORDENACAO' | 'OPERACIONAL' | 'APOIO';
}

export interface PermissaoSistema {
  value: string;
  label: string;
  desc: string;
}

// Cargos profissionais (formação)
export const CARGOS_PROFISSIONAIS: CargoProfissional[] = [
  {
    value: 'ARQUITETO',
    label: 'Arquiteto',
    desc: 'Profissional formado em Arquitetura e Urbanismo',
    area: 'ARQUITETURA'
  },
  {
    value: 'ENGENHEIRO_CIVIL',
    label: 'Engenheiro Civil',
    desc: 'Profissional formado em Engenharia Civil',
    area: 'ENGENHARIA'
  },
  {
    value: 'ENGENHEIRO_ELETRICO',
    label: 'Engenheiro Elétrico',
    desc: 'Profissional formado em Engenharia Elétrica',
    area: 'ENGENHARIA'
  },
  {
    value: 'ENGENHEIRO_MECANICO',
    label: 'Engenheiro Mecânico',
    desc: 'Profissional formado em Engenharia Mecânica',
    area: 'ENGENHARIA'
  },
  {
    value: 'ENGENHEIRO_ESTRUTURAL',
    label: 'Engenheiro Estrutural',
    desc: 'Especialista em estruturas e fundações',
    area: 'ENGENHARIA'
  },
  {
    value: 'ENGENHEIRO_SANITARIO',
    label: 'Engenheiro Sanitário',
    desc: 'Especialista em sistemas hidráulicos e sanitários',
    area: 'ENGENHARIA'
  },
  {
    value: 'DESIGNER_INTERIORES',
    label: 'Designer de Interiores',
    desc: 'Profissional especializado em design de interiores',
    area: 'DESIGN'
  },
  {
    value: 'DESIGNER_GRAFICO',
    label: 'Designer Gráfico',
    desc: 'Profissional de comunicação visual',
    area: 'DESIGN'
  },
  {
    value: 'URBANISTA',
    label: 'Urbanista',
    desc: 'Especialista em planejamento urbano',
    area: 'ARQUITETURA'
  },
  {
    value: 'PAISAGISTA',
    label: 'Paisagista',
    desc: 'Especialista em paisagismo e jardinagem',
    area: 'ARQUITETURA'
  },
  {
    value: 'TECNICO_EDIFICACOES',
    label: 'Técnico em Edificações',
    desc: 'Técnico especializado em construção civil',
    area: 'TECNICO'
  },
  {
    value: 'TECNICO_SEGURANCA',
    label: 'Técnico em Segurança',
    desc: 'Técnico em segurança do trabalho',
    area: 'TECNICO'
  },
  {
    value: 'ADMINISTRADOR',
    label: 'Administrador',
    desc: 'Profissional formado em Administração',
    area: 'ADMINISTRATIVO'
  },
  {
    value: 'CONTADOR',
    label: 'Contador',
    desc: 'Profissional formado em Contabilidade',
    area: 'FINANCEIRO'
  },
  {
    value: 'ADVOGADO',
    label: 'Advogado',
    desc: 'Profissional formado em Direito',
    area: 'JURIDICO'
  },
  {
    value: 'ESTAGIARIO',
    label: 'Estagiário',
    desc: 'Estudante em período de estágio',
    area: 'ACADEMICO'
  },
  {
    value: 'AUXILIAR_TECNICO',
    label: 'Auxiliar Técnico',
    desc: 'Profissional de apoio técnico',
    area: 'TECNICO'
  },
  {
    value: 'OUTROS',
    label: 'Outros',
    desc: 'Outras formações profissionais',
    area: 'OUTROS'
  }
];

// Funções organizacionais (papel na equipe)
export const FUNCOES_ORGANIZACIONAIS: FuncaoOrganizacional[] = [
  {
    value: 'PROPRIETARIO',
    label: 'Proprietário',
    desc: 'Dono do escritório',
    nivel: 'DIRETORIA'
  },
  {
    value: 'DIRETOR',
    label: 'Diretor',
    desc: 'Diretor do escritório',
    nivel: 'DIRETORIA'
  },
  {
    value: 'GERENTE_GERAL',
    label: 'Gerente Geral',
    desc: 'Gerente geral do escritório',
    nivel: 'DIRETORIA'
  },
  {
    value: 'COORDENADOR_PROJETOS',
    label: 'Coordenador de Projetos',
    desc: 'Coordena projetos e equipes de projeto',
    nivel: 'COORDENACAO'
  },
  {
    value: 'COORDENADOR_OBRAS',
    label: 'Coordenador de Obras',
    desc: 'Coordena execução de obras',
    nivel: 'COORDENACAO'
  },
  {
    value: 'COORDENADOR_ADMINISTRATIVO',
    label: 'Coordenador Administrativo',
    desc: 'Coordena atividades administrativas',
    nivel: 'COORDENACAO'
  },
  {
    value: 'COORDENADOR_FINANCEIRO',
    label: 'Coordenador Financeiro',
    desc: 'Coordena atividades financeiras',
    nivel: 'COORDENACAO'
  },
  {
    value: 'ARQUITETO_RESPONSAVEL',
    label: 'Arquiteto Responsável',
    desc: 'Arquiteto responsável técnico',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'ENGENHEIRO_RESPONSAVEL',
    label: 'Engenheiro Responsável',
    desc: 'Engenheiro responsável técnico',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'PROJETISTA_SENIOR',
    label: 'Projetista Sênior',
    desc: 'Projetista com experiência avançada',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'PROJETISTA_JUNIOR',
    label: 'Projetista Júnior',
    desc: 'Projetista em desenvolvimento',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'ANALISTA_FINANCEIRO',
    label: 'Analista Financeiro',
    desc: 'Analista financeiro e contábil',
    nivel: 'APOIO'
  },
  {
    value: 'ASSISTENTE_ADMINISTRATIVO',
    label: 'Assistente Administrativo',
    desc: 'Assistente administrativo geral',
    nivel: 'APOIO'
  },
  {
    value: 'ASSISTENTE_TECNICO',
    label: 'Assistente Técnico',
    desc: 'Assistente técnico especializado',
    nivel: 'APOIO'
  },
  {
    value: 'ESTAGIARIO',
    label: 'Estagiário',
    desc: 'Estudante em período de estágio',
    nivel: 'APOIO'
  },
  {
    value: 'CONSULTOR',
    label: 'Consultor',
    desc: 'Consultor externo especializado',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'TERCEIRIZADO',
    label: 'Terceirizado',
    desc: 'Profissional terceirizado',
    nivel: 'OPERACIONAL'
  },
  {
    value: 'COLABORADOR',
    label: 'Colaborador',
    desc: 'Colaborador geral',
    nivel: 'OPERACIONAL'
  }
];

// Permissões do sistema (mantém compatibilidade)
export const PERMISSOES_SISTEMA: PermissaoSistema[] = [
  {
    value: 'ADMIN',
    label: 'Administrador',
    desc: 'Acesso total ao sistema'
  },
  {
    value: 'OWNER',
    label: 'Proprietário',
    desc: 'Proprietário do escritório'
  },
  {
    value: 'MANAGER',
    label: 'Gerente',
    desc: 'Acesso a gestão e relatórios'
  },
  {
    value: 'ARCHITECT',
    label: 'Arquiteto',
    desc: 'Acesso a projetos e briefings'
  },
  {
    value: 'ENGINEER',
    label: 'Engenheiro',
    desc: 'Acesso a cálculos e estruturas'
  },
  {
    value: 'DESIGNER',
    label: 'Designer',
    desc: 'Acesso a design e visualização'
  },
  {
    value: 'USER',
    label: 'Usuário',
    desc: 'Acesso básico ao sistema'
  }
];

// Interfaces para a aplicação
export interface MembroEquipe {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  funcao: string;
  role: string;
  status: 'ATIVO' | 'INATIVO';
  ultimoLogin: string;
  createdAt: string;
}

export interface Convite {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  funcao: string;
  role: string;
  status: 'PENDENTE' | 'ACEITO' | 'CANCELADO' | 'EXPIRADO';
  createdAt: string;
  expiresAt: string;
  enviadoPor: string;
  mensagemPersonalizada?: string;
}

export interface NovoConvite {
  email: string;
  nome: string;
  cargo: string;
  funcao: string;
  role: string;
  mensagemPersonalizada?: string;
}

// Funções utilitárias
export const getCargoProfissional = (value: string): CargoProfissional | undefined => {
  return CARGOS_PROFISSIONAIS.find(cargo => cargo.value === value);
};

export const getFuncaoOrganizacional = (value: string): FuncaoOrganizacional | undefined => {
  return FUNCOES_ORGANIZACIONAIS.find(funcao => funcao.value === value);
};

export const getPermissaoSistema = (value: string): PermissaoSistema | undefined => {
  return PERMISSOES_SISTEMA.find(permissao => permissao.value === value);
};

// Agrupamento por área para melhor organização
export const getCargosPorArea = () => {
  const areas = CARGOS_PROFISSIONAIS.reduce((acc, cargo) => {
    if (!acc[cargo.area]) {
      acc[cargo.area] = [];
    }
    acc[cargo.area].push(cargo);
    return acc;
  }, {} as Record<string, CargoProfissional[]>);
  
  return areas;
};

// Agrupamento por nível hierárquico
export const getFuncoesPorNivel = () => {
  const niveis = FUNCOES_ORGANIZACIONAIS.reduce((acc, funcao) => {
    if (!acc[funcao.nivel]) {
      acc[funcao.nivel] = [];
    }
    acc[funcao.nivel].push(funcao);
    return acc;
  }, {} as Record<string, FuncaoOrganizacional[]>);
  
  return niveis;
}; 