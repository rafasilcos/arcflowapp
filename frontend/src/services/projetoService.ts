// 🤖 SERVIÇOS INTELIGENTES DO MÓDULO DE PROJETOS ARCFLOW
// Sistema Revolucionário de Criação e Gestão de Projetos AEC

import { 
  Projeto, 
  CriacaoProjetoWizard, 
  TemplateProjeto, 
  TarefaProjeto,
  MetricasProjeto,
  DisciplinaProjeto,
  FaseProjeto
} from '@/types/projeto';
import { BriefingResposta } from '@/types/briefing';

// 📊 DADOS MOCK PARA DEMONSTRAÇÃO
const PROJETO_MOCK: Projeto = {
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
  equipe: [
    {
      usuarioId: 'user-1',
      nome: 'João Silva',
      papel: 'Coordenador',
      disciplinas: ['ARQ'],
      horasSemanais: 40,
      cargaAtual: 85,
      disponibilidade: 'Ocupado',
      produtividade: 92,
      qualidade: 88,
      pontualidade: 95,
      dataEntrada: '2024-01-10',
      ativo: true
    }
  ],
  disciplinas: [
    {
      id: 'disc-arq-1',
      nome: 'Arquitetura',
      codigo: 'ARQ',
      icone: '🏛️',
      ativa: true,
      responsavelPrincipal: 'João Silva',
      equipe: ['user-1'],
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
    }
  ],
  fases: [],
  faseAtual: 'PE',
  orcamento: {} as any,
  riscos: [],
  alertas: [
    {
      id: 'alert-1',
      tipo: 'Crítico',
      titulo: 'Aprovação Cliente Pendente',
      descricao: 'Fachada principal aguarda aprovação há 3 dias',
      icone: '⏰',
      cor: 'red',
      criadoEm: '2024-01-30T10:00:00Z',
      visualizado: false
    }
  ],
  portalCliente: {
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
    aprovaçoesPendentes: [],
    acessos: [],
    ultimoAcesso: '2024-01-28T10:30:00Z'
  },
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
  metricas: {
    progressoGeral: 78,
    progressoPorDisciplina: { 'ARQ': 85 },
    progressoPorFase: { 'PE': 60 },
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
  },
  criadoEm: '2024-01-10T10:00:00Z',
  criadoPor: 'user-1',
  atualizadoEm: '2024-01-30T16:00:00Z',
  atualizadoPor: 'user-2',
  configuracoes: {
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
  }
};

const PROJETOS_MOCK: Projeto[] = [
  PROJETO_MOCK,
  {
    ...PROJETO_MOCK,
    id: 'proj-002',
    nome: 'Escritório TechCorp - Sede Corporativa',
    codigo: 'COM-2024-002',
    tipologia: 'Comercial',
    subtipo: 'Escritório Corporativo',
    complexidade: 'Alta',
    status: 'Planejamento',
    progressoGeral: 15
  },
  {
    ...PROJETO_MOCK,
    id: 'proj-003',
    nome: 'Galpão LogiFlow - Centro de Distribuição',
    codigo: 'IND-2024-003',
    tipologia: 'Industrial',
    subtipo: 'Galpão Industrial',
    complexidade: 'Média',
    status: 'Concluído',
    progressoGeral: 100
  }
];

export class ProjetoService {
  private static baseUrl = '/api/projetos';

  // 🚀 CRIAÇÃO INTELIGENTE EM 2 MINUTOS
  static async criarProjetoComIA(dados: CriacaoProjetoWizard): Promise<Projeto> {
    console.log('🤖 Iniciando criação inteligente de projeto...');
    
    try {
      // Simular criação com IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const novoProjeto: Projeto = {
        ...PROJETO_MOCK,
        id: `proj-${Date.now()}`,
        nome: dados.passo1.nome,
        tipologia: dados.passo1.tipologia as any,
        clienteId: dados.passo1.clienteId,
        briefingId: dados.passo1.briefingId,
        criadoEm: new Date().toISOString(),
        status: 'Em Andamento',
        progressoGeral: 0
      };
      
      console.log('✅ Projeto criado com sucesso:', novoProjeto.codigo);
      return novoProjeto;
      
    } catch (error) {
      console.error('❌ Erro na criação do projeto:', error);
      throw new Error('Falha na criação inteligente do projeto');
    }
  }

  // 🧠 ANÁLISE INTELIGENTE DO BRIEFING
  static async analisarBriefingComIA(briefingId: string) {
    console.log('🧠 Analisando briefing com IA...');
    
    // Simular análise IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      complexidade: 'Média-Alta',
      templateRecomendado: 'casa-alto-padrao-pro',
      personalizacoes: [
        { tipo: 'remover', item: 'piscina' },
        { tipo: 'adicionar', item: 'home-theater' },
        { tipo: 'otimizar', item: 'prazo-20-menor' },
        { tipo: 'equipe', item: '3-pessoas' }
      ],
      alertas: [
        'Terreno em declive - considerar projeto estrutural especial',
        'Zona residencial - verificar recuos obrigatórios'
      ],
      confianca: 94,
      estimativas: {
        prazo: 120,
        equipe: ['arq-senior', 'arq-junior', 'estagiario'],
        fases: ['LV', 'PN', 'EP', 'AP', 'PE', 'AS']
      }
    };
  }

  // 🔧 PERSONALIZAÇÃO INTELIGENTE DE TEMPLATES
  static async personalizarTemplate(templateId: string, personalizacoes: any[]) {
    console.log('🔧 Personalizando template com IA...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      templateId,
      personalizacoes,
      tarefasGeradas: 245,
      disciplinasAtivas: 5,
      cronogramaOtimizado: true
    };
  }

  // 📊 DASHBOARD DO PROJETO EM TEMPO REAL
  static async obterDashboardProjeto(projetoId: string): Promise<MetricasProjeto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PROJETO_MOCK.metricas;
  }

  // 📋 KANBAN INTELIGENTE POR DISCIPLINA
  static async obterKanbanDisciplina(projetoId: string, disciplinaId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tarefasMock: TarefaProjeto[] = [
      {
        id: 'tar-1',
        titulo: 'Planta Baixa Térreo',
        descricao: 'Desenvolvimento da planta baixa do pavimento térreo',
        disciplinaId,
        faseId: 'PE',
        categoria: 'Plantas',
        prioridade: 'Alta',
        status: 'Concluído',
        progresso: 100,
        responsavel: 'João Silva',
        colaboradores: [],
        dataPrevisaoTermino: '2024-01-25',
        dataTerminoReal: '2024-01-24',
        estimativaHoras: 20,
        horasRealizadas: 18,
        dependeDe: [],
        bloqueia: [],
        arquivos: [],
        comentarios: [],
        historico: [],
        checklist: [],
        criadoEm: '2024-01-10T10:00:00Z',
        criadoPor: 'user-1',
        atualizadoEm: '2024-01-24T17:00:00Z'
      },
      {
        id: 'tar-2',
        titulo: 'Cortes AA e BB',
        descricao: 'Desenvolvimento dos cortes principais',
        disciplinaId,
        faseId: 'PE',
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
        bloqueia: [],
        arquivos: [],
        comentarios: [],
        historico: [],
        checklist: [],
        criadoEm: '2024-01-10T10:00:00Z',
        criadoPor: 'user-1',
        atualizadoEm: '2024-01-28T14:30:00Z'
      },
      {
        id: 'tar-3',
        titulo: 'Fachada Principal',
        descricao: 'Desenho da fachada principal',
        disciplinaId,
        faseId: 'PE',
        categoria: 'Fachadas',
        prioridade: 'Normal',
        status: 'Revisão',
        progresso: 100,
        responsavel: 'Maria Santos',
        colaboradores: [],
        dataPrevisaoTermino: '2024-01-30',
        estimativaHoras: 14,
        horasRealizadas: 14,
        dependeDe: [],
        bloqueia: [],
        arquivos: [],
        comentarios: [],
        historico: [],
        checklist: [],
        criadoEm: '2024-01-10T10:00:00Z',
        criadoPor: 'user-2',
        atualizadoEm: '2024-01-29T16:00:00Z'
      },
      {
        id: 'tar-4',
        titulo: 'Planta de Cobertura',
        descricao: 'Desenvolver planta de cobertura',
        disciplinaId,
        faseId: 'PE',
        categoria: 'Plantas',
        prioridade: 'Alta',
        status: 'A Fazer',
        progresso: 0,
        responsavel: 'Maria Santos',
        colaboradores: [],
        dataPrevisaoTermino: '2024-02-08',
        estimativaHoras: 12,
        horasRealizadas: 0,
        dependeDe: [],
        bloqueia: [],
        arquivos: [],
        comentarios: [],
        historico: [],
        checklist: [],
        criadoEm: '2024-01-10T10:00:00Z',
        criadoPor: 'user-1',
        atualizadoEm: '2024-01-10T10:00:00Z'
      }
    ];
    
    return {
      disciplina: PROJETO_MOCK.disciplinas[0],
      colunas: {
        aFazer: tarefasMock.filter(t => t.status === 'A Fazer'),
        fazendo: tarefasMock.filter(t => t.status === 'Fazendo'),
        revisao: tarefasMock.filter(t => t.status === 'Revisão'),
        concluido: tarefasMock.filter(t => t.status === 'Concluído')
      },
      metricas: {
        totalTarefas: tarefasMock.length,
        concluidas: tarefasMock.filter(t => t.status === 'Concluído').length,
        emAndamento: tarefasMock.filter(t => t.status === 'Fazendo').length,
        atrasadas: 0
      }
    };
  }

  // MÉTODOS BÁSICOS CRUD
  static async listarProjetos(): Promise<Projeto[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PROJETOS_MOCK;
  }

  static async obterProjeto(id: string): Promise<Projeto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PROJETOS_MOCK.find(p => p.id === id) || PROJETO_MOCK;
  }

  static async atualizarProjeto(id: string, dados: Partial<Projeto>): Promise<Projeto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...PROJETO_MOCK, ...dados };
  }

  static async excluirProjeto(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // MÉTODOS AUXILIARES MOCK
  static async executarAutomacao(projetoId: string, tipo: string, parametros: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sucesso: true, mensagem: `Automação ${tipo} executada com sucesso` };
  }

  static async verificarAlertas(projetoId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PROJETO_MOCK.alertas;
  }

  static async obterMetricasAvancadas(projetoId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      produtividade: {
        eficienciaGeral: 93,
        velocidadeMedia: 12,
        horasOtimizadas: 35,
        retrabalhoEvitado: 88
      },
      qualidade: {
        scoreFinal: 87,
        satisfacaoCliente: 94,
        taxaAprovacao: 96,
        cicloRevisao: 2.3
      },
      financeiro: {
        margemRealizada: 45,
        custoRealizado: 118500,
        roiProjeto: 185,
        economiaGerada: 25000
      },
      benchmarks: {
        posicaoMercado: 'Top 10%',
        melhoriasSugeridas: ['Otimizar fase EP', 'Automatizar aprovações'],
        proximosProjetos: ['Padrão detectado: +20% eficiência']
      }
    };
  }
}

// 🎯 SERVIÇO DE TEMPLATES INTELIGENTES
export class TemplateService {
  private static baseUrl = '/api/templates';

  static async obterTemplatesPorTipologia(tipologia: string): Promise<TemplateProjeto[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }

  static async recomendarTemplate(briefingId: string): Promise<TemplateProjeto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {} as TemplateProjeto;
  }
}

// 🤖 SERVIÇO DE IA PARA PROJETOS
export class ProjetoIAService {
  private static baseUrl = '/api/projeto-ia';

  static async analisarViabilidade(projetoId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      viabilidade: 'Alta',
      score: 87,
      recomendacoes: [
        'Projeto bem estruturado',
        'Cronograma realista',
        'Equipe adequada'
      ],
      riscos: ['Prazo apertado na fase PE']
    };
  }

  static async sugerirOtimizacoes(projetoId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      otimizacoes: [
        'Paralelizar tarefas de elétrica e hidráulica',
        'Antecipar aprovações críticas',
        'Automatizar revisões internas'
      ],
      impacto: {
        prazo: '-15%',
        custo: '-8%',
        qualidade: '+12%'
      }
    };
  }

  static async preverAtrasos(projetoId: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      previsao: 'Baixo risco de atraso',
      probabilidade: 15,
      fatoresRisco: [
        'Aprovação cliente pendente',
        'Sobrecarga da equipe estrutural'
      ],
      acoesPrevencao: [
        'Acelerar aprovações',
        'Realocar recursos'
      ]
    };
  }
}

export default ProjetoService; 