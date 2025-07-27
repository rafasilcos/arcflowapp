// 🏗️ DADOS MOCK PARA DEMONSTRAÇÃO DO MÓDULO DE PROJETOS ARCFLOW
// Sistema Completo de Projetos AEC com Dados Realistas

import { 
  Projeto, 
  DisciplinaProjeto, 
  FaseProjeto, 
  TarefaProjeto, 
  MetricasProjeto,
  EquipeProjeto,
  AlertaProjeto,
  RiscoProjeto,
  PortalCliente,
  ConfiguracoesProjeto
} from '@/types/projeto';

// 📊 MÉTRICAS EXEMPLO
export const metricasExemplo: MetricasProjeto = {
  progressoGeral: 78,
  progressoPorDisciplina: {
    'ARQ': 85,
    'EST': 65,
    'ELE': 72,
    'HID': 68,
    'AVAC': 45
  },
  progressoPorFase: {
    'LV': 100,
    'PN': 100,
    'EP': 100,
    'AP': 95,
    'PE': 60,
    'AS': 0
  },
  diasDecorridos: 85,
  diasRestantes: 35,
  percentualTempo: 71,
  estimativaTermino: '2024-02-15',
  horasPlanejadas: 480,
  horasRealizadas: 445,
  eficienciaGeral: 93,
  velocidadeMedia: 12,
  tarefasRefeitas: 8,
  percentualRetrabalho: 12,
  satisfacaoCliente: 94,
  custoPlanejado: 125000,
  custoRealizado: 118500,
  margem: 45,
  roi: 185,
  riscosCriticos: 2,
  riscosAltos: 5,
  scoreFinal: 87,
  benchmarkMercado: {
    prazo: 'Melhor',
    custo: 'Melhor', 
    qualidade: 'Média'
  }
};

// 👥 EQUIPE EXEMPLO
export const equipeExemplo: EquipeProjeto[] = [
  {
    usuarioId: 'user-1',
    nome: 'João Silva',
    papel: 'Coordenador',
    disciplinas: ['ARQ', 'URB'],
    horasSemanais: 40,
    cargaAtual: 85,
    disponibilidade: 'Ocupado',
    produtividade: 92,
    qualidade: 88,
    pontualidade: 95,
    dataEntrada: '2024-01-10',
    ativo: true
  },
  {
    usuarioId: 'user-2',
    nome: 'Maria Santos',
    papel: 'Arquiteto Senior',
    disciplinas: ['ARQ', 'INT'],
    horasSemanais: 40,
    cargaAtual: 78,
    disponibilidade: 'Disponível',
    produtividade: 96,
    qualidade: 94,
    pontualidade: 97,
    dataEntrada: '2024-01-10',
    ativo: true
  },
  {
    usuarioId: 'user-3',
    nome: 'Pedro Costa',
    papel: 'Arquiteto',
    disciplinas: ['ARQ'],
    horasSemanais: 40,
    cargaAtual: 65,
    disponibilidade: 'Disponível',
    produtividade: 84,
    qualidade: 86,
    pontualidade: 89,
    dataEntrada: '2024-01-10',
    ativo: true
  }
];

// 🏛️ DISCIPLINAS EXEMPLO
export const disciplinasExemplo: DisciplinaProjeto[] = [
  {
    id: 'disc-arq-1',
    nome: 'Arquitetura',
    codigo: 'ARQ',
    icone: '🏛️',
    ativa: true,
    responsavelPrincipal: 'João Silva',
    equipe: ['user-1', 'user-2', 'user-3'],
    progresso: 85,
    status: 'Em Andamento',
    dataInicio: '2024-01-10',
    dataPrevisaoTermino: '2024-02-28',
    diasAtraso: 0,
    tarefas: [],
    tarefasConcluidas: 72,
    tarefasTotal: 85,
    arquivos: [],
    ultimaRevisao: '2024-01-25',
    dependeDe: [],
    horasPlanejadas: 200,
    horasRealizadas: 185,
    eficiencia: 93
  },
  {
    id: 'disc-est-1',
    nome: 'Estrutural',
    codigo: 'EST',
    icone: '🏗️',
    ativa: true,
    responsavelPrincipal: 'Carlos Lima',
    equipe: ['user-4'],
    progresso: 65,
    status: 'Em Andamento',
    dataInicio: '2024-01-20',
    dataPrevisaoTermino: '2024-03-15',
    diasAtraso: 0,
    tarefas: [],
    tarefasConcluidas: 26,
    tarefasTotal: 40,
    arquivos: [],
    ultimaRevisao: '2024-01-24',
    dependeDe: ['disc-arq-1'],
    horasPlanejadas: 120,
    horasRealizadas: 98,
    eficiencia: 82
  },
  {
    id: 'disc-ele-1',
    nome: 'Elétrica',
    codigo: 'ELE',
    icone: '💡',
    ativa: true,
    responsavelPrincipal: 'Ana Oliveira',
    equipe: ['user-5'],
    progresso: 72,
    status: 'Em Andamento',
    dataInicio: '2024-01-25',
    dataPrevisaoTermino: '2024-03-10',
    diasAtraso: -3,
    tarefas: [],
    tarefasConcluidas: 32,
    tarefasTotal: 45,
    arquivos: [],
    ultimaRevisao: '2024-01-26',
    dependeDe: ['disc-arq-1'],
    horasPlanejadas: 80,
    horasRealizadas: 72,
    eficiencia: 90
  },
  {
    id: 'disc-hid-1',
    nome: 'Hidráulica',
    codigo: 'HID',
    icone: '💧',
    ativa: true,
    responsavelPrincipal: 'Roberto Silva',
    equipe: ['user-6'],
    progresso: 68,
    status: 'Em Andamento',
    dataInicio: '2024-01-25',
    dataPrevisaoTermino: '2024-03-08',
    diasAtraso: 0,
    tarefas: [],
    tarefasConcluidas: 28,
    tarefasTotal: 42,
    arquivos: [],
    ultimaRevisao: '2024-01-25',
    dependeDe: ['disc-arq-1'],
    horasPlanejadas: 65,
    horasRealizadas: 58,
    eficiencia: 89
  },
  {
    id: 'disc-avac-1',
    nome: 'AVAC',
    codigo: 'AVAC',
    icone: '❄️',
    ativa: true,
    responsavelPrincipal: 'Fernanda Costa',
    equipe: ['user-7'],
    progresso: 45,
    status: 'Em Andamento',
    dataInicio: '2024-02-01',
    dataPrevisaoTermino: '2024-03-20',
    diasAtraso: 0,
    tarefas: [],
    tarefasConcluidas: 9,
    tarefasTotal: 20,
    arquivos: [],
    ultimaRevisao: '2024-02-05',
    dependeDe: ['disc-arq-1', 'disc-est-1'],
    horasPlanejadas: 45,
    horasRealizadas: 32,
    eficiencia: 71
  }
];

// 📋 TAREFAS EXEMPLO
export const tarefasExemplo: TarefaProjeto[] = [
  // ARQUITETURA - A FAZER
  {
    id: 'tar-arq-001',
    titulo: 'Planta de Cobertura',
    descricao: 'Desenvolver planta de cobertura com detalhamento de caimentos e captação de águas pluviais',
    disciplinaId: 'disc-arq-1',
    faseId: 'fase-pe',
    categoria: 'Plantas',
    prioridade: 'Alta',
    status: 'A Fazer',
    progresso: 0,
    responsavel: 'Maria Santos',
    colaboradores: ['user-3'],
    dataPrevisaoTermino: '2024-02-08',
    estimativaHoras: 12,
    horasRealizadas: 0,
    dependeDe: ['tar-arq-010'],
    bloqueia: [],
    arquivos: [],
    comentarios: [],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Definir caimentos', concluido: false, obrigatorio: true },
      { id: 'check-2', titulo: 'Posicionar rufos e calhas', concluido: false, obrigatorio: true },
      { id: 'check-3', titulo: 'Verificar compatibilização', concluido: false, obrigatorio: true }
    ],
    criadoEm: '2024-01-10T10:00:00Z',
    criadoPor: 'user-1',
    atualizadoEm: '2024-01-10T10:00:00Z'
  },
  
  // ARQUITETURA - FAZENDO
  {
    id: 'tar-arq-002',
    titulo: 'Cortes AA e BB',
    descricao: 'Desenvolvimento dos cortes longitudinal e transversal com cotas e especificações',
    disciplinaId: 'disc-arq-1',
    faseId: 'fase-pe',
    categoria: 'Cortes',
    prioridade: 'Alta',
    status: 'Fazendo',
    progresso: 65,
    responsavel: 'João Silva',
    colaboradores: [],
    dataPrevisaoTermino: '2024-02-05',
    estimativaHoras: 16,
    horasRealizadas: 10,
    dependeDe: [],
    bloqueia: ['tar-arq-001'],
    arquivos: ['corte-aa-r01.dwg'],
    comentarios: [
      {
        id: 'com-1',
        autor: 'João Silva',
        conteudo: 'Corte AA praticamente finalizado, iniciando corte BB',
        criadoEm: '2024-01-28T14:30:00Z'
      }
    ],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Corte AA', concluido: true, obrigatorio: true },
      { id: 'check-2', titulo: 'Corte BB', concluido: false, obrigatorio: true },
      { id: 'check-3', titulo: 'Cotas e especificações', concluido: false, obrigatorio: true }
    ],
    criadoEm: '2024-01-10T10:00:00Z',
    criadoPor: 'user-1',
    atualizadoEm: '2024-01-28T14:30:00Z'
  },

  // ARQUITETURA - REVISÃO
  {
    id: 'tar-arq-003',
    titulo: 'Fachada Principal',
    descricao: 'Desenho da fachada principal com materiais, cores e detalhamentos',
    disciplinaId: 'disc-arq-1',
    faseId: 'fase-pe',
    categoria: 'Fachadas',
    prioridade: 'Normal',
    status: 'Revisão',
    progresso: 100,
    responsavel: 'Maria Santos',
    colaboradores: ['user-3'],
    dataPrevisaoTermino: '2024-01-30',
    estimativaHoras: 14,
    horasRealizadas: 14,
    dependeDe: [],
    bloqueia: [],
    arquivos: ['fachada-principal-r02.dwg'],
    comentarios: [
      {
        id: 'com-2',
        autor: 'Maria Santos',
        conteudo: 'Fachada finalizada, aguardando aprovação do coordenador',
        criadoEm: '2024-01-29T16:00:00Z'
      }
    ],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Definir materiais', concluido: true, obrigatorio: true },
      { id: 'check-2', titulo: 'Aplicar cores', concluido: true, obrigatorio: true },
      { id: 'check-3', titulo: 'Detalhamentos', concluido: true, obrigatorio: true }
    ],
    criadoEm: '2024-01-10T10:00:00Z',
    criadoPor: 'user-2',
    atualizadoEm: '2024-01-29T16:00:00Z'
  },

  // ARQUITETURA - CONCLUÍDO
  {
    id: 'tar-arq-004',
    titulo: 'Planta Baixa Térreo',
    descricao: 'Planta baixa do pavimento térreo com layout, cotas e especificações completas',
    disciplinaId: 'disc-arq-1',
    faseId: 'fase-pe',
    categoria: 'Plantas',
    prioridade: 'Crítica',
    status: 'Concluído',
    progresso: 100,
    responsavel: 'João Silva',
    colaboradores: ['user-2'],
    dataPrevisaoTermino: '2024-01-25',
    dataTerminoReal: '2024-01-24',
    estimativaHoras: 20,
    horasRealizadas: 18,
    dependeDe: [],
    bloqueia: ['tar-est-001', 'tar-ele-001'],
    arquivos: ['planta-terreo-r03.dwg', 'layout-terreo-r03.dwg'],
    comentarios: [
      {
        id: 'com-3',
        autor: 'João Silva',
        conteudo: 'Planta finalizada e aprovada pelo cliente',
        criadoEm: '2024-01-24T17:00:00Z'
      }
    ],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Layout de ambientes', concluido: true, obrigatorio: true },
      { id: 'check-2', titulo: 'Cotas completas', concluido: true, obrigatorio: true },
      { id: 'check-3', titulo: 'Especificações', concluido: true, obrigatorio: true },
      { id: 'check-4', titulo: 'Aprovação cliente', concluido: true, obrigatorio: true }
    ],
    criadoEm: '2024-01-10T10:00:00Z',
    criadoPor: 'user-1',
    atualizadoEm: '2024-01-24T17:00:00Z'
  },

  // ESTRUTURAL - A FAZER
  {
    id: 'tar-est-001',
    titulo: 'Cálculo de Fundações',
    descricao: 'Dimensionamento das fundações conforme sondagem do terreno',
    disciplinaId: 'disc-est-1',
    faseId: 'fase-pe',
    categoria: 'Cálculos',
    prioridade: 'Crítica',
    status: 'A Fazer',
    progresso: 0,
    responsavel: 'Carlos Lima',
    colaboradores: [],
    dataPrevisaoTermino: '2024-02-10',
    estimativaHoras: 24,
    horasRealizadas: 0,
    dependeDe: ['tar-arq-004'],
    bloqueia: ['tar-est-002'],
    arquivos: [],
    comentarios: [],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Analisar sondagem', concluido: false, obrigatorio: true },
      { id: 'check-2', titulo: 'Calcular cargas', concluido: false, obrigatorio: true },
      { id: 'check-3', titulo: 'Dimensionar elementos', concluido: false, obrigatorio: true }
    ],
    criadoEm: '2024-01-20T10:00:00Z',
    criadoPor: 'user-4',
    atualizadoEm: '2024-01-20T10:00:00Z'
  },

  // ELÉTRICA - FAZENDO
  {
    id: 'tar-ele-001',
    titulo: 'Projeto de Iluminação',
    descricao: 'Desenvolvimento do projeto de iluminação com cálculos luminotécnicos',
    disciplinaId: 'disc-ele-1',
    faseId: 'fase-pe',
    categoria: 'Iluminação',
    prioridade: 'Normal',
    status: 'Fazendo',
    progresso: 40,
    responsavel: 'Ana Oliveira',
    colaboradores: [],
    dataPrevisaoTermino: '2024-02-12',
    estimativaHoras: 18,
    horasRealizadas: 7,
    dependeDe: ['tar-arq-004'],
    bloqueia: [],
    arquivos: ['iluminacao-calculos.xlsx'],
    comentarios: [
      {
        id: 'com-4',
        autor: 'Ana Oliveira',
        conteudo: 'Cálculos luminotécnicos em andamento, falta distribuição dos pontos',
        criadoEm: '2024-01-30T09:00:00Z'
      }
    ],
    historico: [],
    checklist: [
      { id: 'check-1', titulo: 'Cálculos luminotécnicos', concluido: true, obrigatorio: true },
      { id: 'check-2', titulo: 'Distribuição dos pontos', concluido: false, obrigatorio: true },
      { id: 'check-3', titulo: 'Especificação das luminárias', concluido: false, obrigatorio: true }
    ],
    criadoEm: '2024-01-25T10:00:00Z',
    criadoPor: 'user-5',
    atualizadoEm: '2024-01-30T09:00:00Z'
  }
];

// 🚨 ALERTAS EXEMPLO
export const alertasExemplo: AlertaProjeto[] = [
  {
    id: 'alert-1',
    tipo: 'Crítico',
    titulo: 'Aprovação Cliente Pendente',
    descricao: 'Fachada principal aguarda aprovação há 3 dias. Prazo limite: 2 dias.',
    icone: '⏰',
    cor: 'red',
    acao: {
      label: 'Enviar Lembrete',
      url: '/projetos/proj-1/portal'
    },
    criadoEm: '2024-01-30T10:00:00Z',
    visualizado: false
  },
  {
    id: 'alert-2',
    tipo: 'Atenção',
    titulo: 'Disciplina Elétrica Atrasada',
    descricao: 'Projeto elétrico está 3 dias atrasado. Verificar com responsável.',
    icone: '💡',
    cor: 'yellow',
    acao: {
      label: 'Ver Detalhes',
      url: '/projetos/proj-1/disciplinas/ele'
    },
    criadoEm: '2024-01-29T14:00:00Z',
    visualizado: true
  },
  {
    id: 'alert-3',
    tipo: 'Info',
    titulo: 'Novo Arquivo Carregado',
    descricao: 'Maria Santos adicionou "fachada-principal-r02.dwg" na disciplina Arquitetura.',
    icone: '📎',
    cor: 'blue',
    criadoEm: '2024-01-29T16:30:00Z',
    visualizado: true
  }
];

// 📊 FASES EXEMPLO
export const fasesExemplo: FaseProjeto[] = [
  {
    id: 'fase-lv',
    nome: 'Levantamento',
    codigo: 'LV',
    descricao: 'Levantamento de dados, medições e análise do terreno',
    ordem: 1,
    status: 'Concluída',
    progresso: 100,
    dataInicio: '2024-01-10',
    dataPrevisaoTermino: '2024-01-17',
    dataTerminoReal: '2024-01-16',
    duracaoPlanejada: 7,
    duracaoReal: 6,
    entregas: [],
    requererAprovacaoCliente: false,
    aprovadaCliente: true,
    marcos: [],
    dependeDe: [],
    obrigatoria: true,
    ativa: true
  },
  {
    id: 'fase-pe',
    nome: 'Projeto Executivo',
    codigo: 'PE',
    descricao: 'Desenvolvimento do projeto executivo completo',
    ordem: 5,
    status: 'Em Andamento',
    progresso: 78,
    dataInicio: '2024-01-25',
    dataPrevisaoTermino: '2024-03-15',
    duracaoPlanejada: 50,
    entregas: [],
    requererAprovacaoCliente: true,
    marcos: [
      {
        id: 'marco-1',
        titulo: 'Entrega Arquitetura',
        descricao: 'Entrega completa da disciplina de arquitetura',
        data: '2024-02-28',
        tipo: 'Entrega',
        concluido: false,
        atrasado: false
      }
    ],
    dependeDe: ['fase-ap'],
    obrigatoria: true,
    ativa: true
  }
];

// 🌐 PORTAL CLIENTE EXEMPLO
export const portalClienteExemplo: PortalCliente = {
  ativo: true,
  urlAcesso: 'https://app.arcflow.com/cliente/proj-1',
  senhaAcesso: 'silva2024',
  permitirDownloads: true,
  permitirComentarios: true,
  mostrarProgresso: true,
  mostrarEquipe: true,
  notificarPorEmail: true,
  notificarPorWhatsApp: true,
  frequenciaRelatorios: 'Semanal',
  aprovaçoesPendentes: [
    {
      id: 'aprov-1',
      titulo: 'Fachada Principal',
      descricao: 'Aprovação da fachada principal com materiais e cores definidos',
      fase: 'Projeto Executivo',
      disciplina: 'Arquitetura',
      arquivos: ['fachada-principal-r02.dwg', 'fachada-principal.pdf'],
      prazoAprovacao: '2024-02-05',
      criadoEm: '2024-01-29T16:00:00Z',
      status: 'Pendente'
    }
  ],
  acessos: [],
  ultimoAcesso: '2024-01-28T10:30:00Z'
};

// ⚙️ CONFIGURAÇÕES EXEMPLO
export const configuracoesExemplo: ConfiguracoesProjeto = {
  notificacoes: {
    emailEquipe: true,
    emailCliente: true,
    whatsappCliente: true,
    frequencia: 'diaria'
  },
  aprovacoes: {
    automaticarInterna: false,
    prazoAprovacaoCliente: 5,
    lembreteAntecedencia: 2
  },
  portalCliente: {
    ativo: true,
    mostrarProgresso: true,
    permitirDownload: true,
    permitirComentarios: true
  },
  automacoes: {
    criarTarefasProximaFase: true,
    notificarAtrasos: true,
    gerarRelatoriosSemanal: true,
    backupAutomatico: true
  }
};

// 🏗️ PROJETO COMPLETO EXEMPLO
export const projetoExemplo: Projeto = {
  id: 'proj-001',
  nome: 'Residência Silva - Casa Alto Padrão',
  codigo: 'RES-2024-001',
  clienteId: 'cli-001',
  briefingId: 'brief-001',
  orcamentoId: 'orc-001',
  tipologia: 'Residencial',
  subtipo: 'Casa Alto Padrão',
  complexidade: 'Média',
  status: 'Em Andamento',
  progressoGeral: 78,
  descricao: 'Residência unifamiliar de alto padrão com 4 suítes, área gourmet e piscina',
  endereco: {
    logradouro: 'Rua das Palmeiras',
    numero: '123',
    complemento: 'Lote 15',
    bairro: 'Jardim Botânico',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04301-000'
  },
  areaTerreno: 450,
  areaConstruida: 320,
  valorObra: 850000,
  dataInicio: '2024-01-10',
  dataPrevisaoTermino: '2024-04-15',
  prazoTotal: 95,
  responsavelTecnico: 'João Silva',
  coordenadorProjeto: 'João Silva',
  equipe: equipeExemplo,
  disciplinas: disciplinasExemplo,
  fases: fasesExemplo,
  faseAtual: 'PE',
  orcamento: {} as any,
  riscos: [],
  alertas: alertasExemplo,
  portalCliente: portalClienteExemplo,
  ultimaAtividade: '2024-01-30T16:00:00Z',
  proximoMarco: {
    id: 'marco-1',
    titulo: 'Entrega Arquitetura',
    descricao: 'Entrega completa da disciplina de arquitetura',
    data: '2024-02-28',
    tipo: 'Entrega',
    concluido: false,
    atrasado: false
  },
  metricas: metricasExemplo,
  criadoEm: '2024-01-10T10:00:00Z',
  criadoPor: 'user-1',
  atualizadoEm: '2024-01-30T16:00:00Z',
  atualizadoPor: 'user-2',
  configuracoes: configuracoesExemplo
};

// 📋 LISTA DE PROJETOS EXEMPLO
export const projetosExemplo: Projeto[] = [
  projetoExemplo,
  {
    ...projetoExemplo,
    id: 'proj-002',
    nome: 'Escritório TechCorp - Sede Corporativa',
    codigo: 'COM-2024-002',
    tipologia: 'Comercial',
    subtipo: 'Escritório Corporativo',
    complexidade: 'Alta',
    status: 'Planejamento',
    progressoGeral: 15,
    criadoEm: '2024-01-20T10:00:00Z'
  },
  {
    ...projetoExemplo,
    id: 'proj-003',
    nome: 'Galpão LogiFlow - Centro de Distribuição',
    codigo: 'IND-2024-003',
    tipologia: 'Industrial',
    subtipo: 'Galpão Industrial',
    complexidade: 'Média',
    status: 'Concluído',
    progressoGeral: 100,
    criadoEm: '2024-01-05T10:00:00Z'
  }
];

export default {
  projetos: projetosExemplo,
  projeto: projetoExemplo,
  disciplinas: disciplinasExemplo,
  tarefas: tarefasExemplo,
  metricas: metricasExemplo,
  alertas: alertasExemplo,
  equipe: equipeExemplo,
  portal: portalClienteExemplo,
  configuracoes: configuracoesExemplo
}; 