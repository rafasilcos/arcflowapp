// 🏗️ TIPOS FUNDAMENTAIS DO MÓDULO DE PROJETOS ARCFLOW
// Sistema Revolucionário de Gestão de Projetos AEC

export interface Projeto {
  id: string;
  nome: string;
  codigo: string; // Código único do projeto (ex: RES-2024-001)
  
  // VINCULAÇÕES AUTOMÁTICAS
  clienteId: string;
  briefingId: string;
  orcamentoId?: string;
  
  // CLASSIFICAÇÃO
  tipologia: 'Residencial' | 'Comercial' | 'Industrial' | 'Institucional' | 'Urbanístico';
  subtipo: string;
  complexidade: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  
  // STATUS E PROGRESSO
  status: 'Planejamento' | 'Em Andamento' | 'Pausado' | 'Concluído' | 'Cancelado';
  progressoGeral: number;
  
  // INFORMAÇÕES BÁSICAS
  descricao: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  
  // DADOS TÉCNICOS
  areaTerreno?: number;
  areaConstruida?: number;
  valorObra?: number;
  
  // CRONOGRAMA
  dataInicio: string;
  dataPrevisaoTermino: string;
  dataTerminoReal?: string;
  prazoTotal: number; // em dias
  
  // EQUIPE
  responsavelTecnico: string; // ID do usuário
  coordenadorProjeto: string; // ID do usuário
  equipe: EquipeProjeto[];
  
  // DISCIPLINAS ATIVAS
  disciplinas: DisciplinaProjeto[];
  
  // FASES DO PROJETO
  fases: FaseProjeto[];
  faseAtual: string;
  
  // CONTROLES
  orcamento: OrcamentoProjeto;
  riscos: RiscoProjeto[];
  alertas: AlertaProjeto[];
  
  // PORTAL DO CLIENTE
  portalCliente: PortalCliente;
  
  // COMUNICAÇÃO
  ultimaAtividade: string;
  proximoMarco: MarcoRelevante;
  
  // MÉTRICAS
  metricas: MetricasProjeto;
  
  // METADADOS
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string;
  atualizadoPor: string;
  
  // CONFIGURAÇÕES
  configuracoes: ConfiguracoesProjeto;
}

export interface DisciplinaProjeto {
  id: string;
  nome: string;
  codigo: string; // ARQ, EST, ELE, HID, AVAC, PPCI, INT
  icone: string;
  ativa: boolean;
  
  // RESPONSÁVEIS
  responsavelPrincipal: string;
  equipe: string[];
  
  // PROGRESSO
  progresso: number;
  status: 'Não Iniciada' | 'Em Andamento' | 'Em Revisão' | 'Concluída' | 'Aprovada';
  
  // PRAZOS
  dataInicio: string;
  dataPrevisaoTermino: string;
  diasAtraso: number;
  
  // TAREFAS
  tarefas: TarefaProjeto[];
  tarefasConcluidas: number;
  tarefasTotal: number;
  
  // ARQUIVOS
  arquivos: ArquivoDisciplina[];
  ultimaRevisao: string;
  
  // DEPENDÊNCIAS
  dependeDe: string[]; // IDs de outras disciplinas
  
  // MÉTRICAS
  horasPlanejadas: number;
  horasRealizadas: number;
  eficiencia: number;
}

export interface FaseProjeto {
  id: string;
  nome: string;
  codigo: string; // LV, PN, EP, AP, PE, AS
  descricao: string;
  ordem: number;
  
  // STATUS
  status: 'Não Iniciada' | 'Em Andamento' | 'Concluída' | 'Aprovada';
  progresso: number;
  
  // PRAZOS
  dataInicio?: string;
  dataPrevisaoTermino: string;
  dataTerminoReal?: string;
  duracaoPlanejada: number; // em dias
  duracaoReal?: number;
  
  // ENTREGAS
  entregas: EntregaFase[];
  
  // APROVAÇÕES
  requererAprovacaoCliente: boolean;
  aprovadaCliente?: boolean;
  dataAprovacaoCliente?: string;
  comentariosAprovacao?: string;
  
  // MARCOS
  marcos: MarcoRelevante[];
  
  // DEPENDÊNCIAS
  dependeDe: string[]; // IDs de outras fases
  
  // CONFIGURAÇÕES
  obrigatoria: boolean;
  ativa: boolean;
}

export interface TarefaProjeto {
  id: string;
  titulo: string;
  descricao: string;
  
  // CLASSIFICAÇÃO
  disciplinaId: string;
  faseId: string;
  categoria: string;
  prioridade: 'Baixa' | 'Normal' | 'Alta' | 'Crítica';
  
  // STATUS
  status: 'A Fazer' | 'Fazendo' | 'Revisão' | 'Concluído';
  progresso: number;
  
  // RESPONSÁVEIS
  responsavel: string;
  colaboradores: string[];
  
  // PRAZOS
  dataInicio?: string;
  dataPrevisaoTermino: string;
  dataTerminoReal?: string;
  estimativaHoras: number;
  horasRealizadas: number;
  
  // DEPENDÊNCIAS
  dependeDe: string[]; // IDs de outras tarefas
  bloqueia: string[]; // IDs de tarefas que esta tarefa bloqueia
  
  // ARQUIVOS E ANEXOS
  arquivos: string[];
  comentarios: ComentarioTarefa[];
  
  // HISTÓRICO
  historico: HistoricoTarefa[];
  
  // CHECKLIST
  checklist: ChecklistItem[];
  
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string;
}

export interface EquipeProjeto {
  usuarioId: string;
  nome: string;
  papel: 'Coordenador' | 'Arquiteto Senior' | 'Arquiteto' | 'Estagiário' | 'Consultor';
  disciplinas: string[]; // IDs das disciplinas que atua
  
  // CARGA DE TRABALHO
  horasSemanais: number;
  cargaAtual: number; // percentual
  disponibilidade: 'Disponível' | 'Ocupado' | 'Sobrecarregado' | 'Indisponível';
  
  // MÉTRICAS
  produtividade: number;
  qualidade: number;
  pontualidade: number;
  
  // PERÍODOS
  dataEntrada: string;
  dataSaida?: string;
  ativo: boolean;
}

export interface PortalCliente {
  ativo: boolean;
  urlAcesso: string;
  senhaAcesso: string;
  
  // CONFIGURAÇÕES
  permitirDownloads: boolean;
  permitirComentarios: boolean;
  mostrarProgresso: boolean;
  mostrarEquipe: boolean;
  
  // NOTIFICAÇÕES
  notificarPorEmail: boolean;
  notificarPorWhatsApp: boolean;
  frequenciaRelatorios: 'Semanal' | 'Quinzenal' | 'Mensal';
  
  // APROVAÇÕES PENDENTES
  aprovaçoesPendentes: AprovacaoPendente[];
  
  // HISTÓRICO
  acessos: AcessoPortal[];
  ultimoAcesso?: string;
}

export interface MetricasProjeto {
  // PROGRESSO
  progressoGeral: number;
  progressoPorDisciplina: Record<string, number>;
  progressoPorFase: Record<string, number>;
  
  // TEMPO
  diasDecorridos: number;
  diasRestantes: number;
  percentualTempo: number;
  estimativaTermino: string;
  
  // PRODUTIVIDADE
  horasPlanejadas: number;
  horasRealizadas: number;
  eficienciaGeral: number;
  velocidadeMedia: number; // tarefas por semana
  
  // QUALIDADE
  tarefasRefeitas: number;
  percentualRetrabalho: number;
  satisfacaoCliente?: number;
  
  // FINANCEIRO
  custoPlanejado: number;
  custoRealizado: number;
  margem: number;
  roi: number;
  
  // RISCOS
  riscosCriticos: number;
  riscosAltos: number;
  scoreFinal: number;
  
  // COMPARAÇÃO
  benchmarkMercado: {
    prazo: 'Melhor' | 'Média' | 'Pior';
    custo: 'Melhor' | 'Média' | 'Pior';
    qualidade: 'Melhor' | 'Média' | 'Pior';
  };
}

export interface TemplateProjeto {
  id: string;
  nome: string;
  tipologia: string;
  subtipo?: string;
  padraoComplexidade?: string;
  complexidade?: string;
  areaMinima?: number;
  areaMaxima?: number;
  caracteristicas?: string[];
  recomendada?: boolean;
  fases: FaseTemplate[];
  disciplinasInclusas?: string[];
  prazoEstimado?: number;
  valorBase?: number;
}

export interface FaseTemplate {
  nome: string;
  prazo: number;
  ordem: number;
  disciplina?: string;
  tarefas?: TarefaTemplate[];
}

export interface TarefaTemplate {
  nome: string;
  prazo: number;
  ordem: number;
}

export interface CriacaoProjetoWizard {
  // PASSO 1: BÁSICO
  passo1: {
    clienteId: string;
    briefingId: string;
    nome: string;
    tipologia: string;
    subtipo: string;
  };
  
  // PASSO 2: IA ANÁLISE
  passo2: {
    analiseIA: {
      complexidade: string;
      templateRecomendado: string;
      personalizacoes: PersonalizacaoIA[];
      alertas: string[];
      confianca: number;
    };
  };
  
  // PASSO 3: CONFIRMAÇÃO
  passo3: {
    templateSelecionado: string;
    personalizacoesAceitas: string[];
    equipeSugerida: string[];
    cronogramaSugerido: any;
    confirma: boolean;
  };
}

// INTERFACES AUXILIARES
export interface ComentarioTarefa {
  id: string;
  autor: string;
  conteudo: string;
  criadoEm: string;
  arquivos?: string[];
}

export interface HistoricoTarefa {
  id: string;
  acao: string;
  usuario: string;
  dadosAntes?: any;
  dadosDepois?: any;
  timestamp: string;
}

export interface ChecklistItem {
  id: string;
  titulo: string;
  concluido: boolean;
  obrigatorio: boolean;
}

export interface ArquivoDisciplina {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
  versao: string;
  criadoEm: string;
  criadoPor: string;
}

export interface RiscoProjeto {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  probabilidade: number;
  impacto: number;
  severidade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  planoMitigacao: string;
  responsavel: string;
  status: 'Identificado' | 'Mitigando' | 'Resolvido' | 'Materializado';
}

export interface AlertaProjeto {
  id: string;
  tipo: 'Info' | 'Aviso' | 'Atenção' | 'Crítico';
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
  acao?: {
    label: string;
    url: string;
  };
  criadoEm: string;
  visualizado: boolean;
}

export interface AprovacaoPendente {
  id: string;
  titulo: string;
  descricao: string;
  fase: string;
  disciplina: string;
  arquivos: string[];
  prazoAprovacao: string;
  criadoEm: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
}

export interface MarcoRelevante {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: 'Início Fase' | 'Entrega' | 'Aprovação' | 'Pagamento' | 'Marco Crítico';
  concluido: boolean;
  atrasado: boolean;
}

export interface ConfiguracoesProjeto {
  // NOTIFICAÇÕES
  notificacoes: {
    emailEquipe: boolean;
    emailCliente: boolean;
    whatsappCliente: boolean;
    frequencia: string;
  };
  
  // APROVAÇÕES
  aprovacoes: {
    automaticarInterna: boolean;
    prazoAprovacaoCliente: number; // dias
    lembreteAntecedencia: number; // dias
  };
  
  // PORTAL CLIENTE
  portalCliente: {
    ativo: boolean;
    mostrarProgresso: boolean;
    permitirDownload: boolean;
    permitirComentarios: boolean;
  };
  
  // AUTOMAÇÕES
  automacoes: {
    criarTarefasProximaFase: boolean;
    notificarAtrasos: boolean;
    gerarRelatoriosSemanal: boolean;
    backupAutomatico: boolean;
  };
}

export interface OrcamentoProjeto {
  // ORÇAMENTO PLANEJADO
  valorPlanejado: number;
  custoPlanejado: number;
  margemPlanejada: number;
  
  // ORÇAMENTO REALIZADO
  valorRealizado: number;
  custoRealizado: number;
  margemRealizada: number;
  
  // PROJEÇÕES
  valorProjetado: number;
  custoProjetado: number;
  margemProjetada: number;
  
  // DETALHAMENTO
  custoPorDisciplina: Record<string, number>;
  custoPorFase: Record<string, number>;
  
  // CONTROLE
  orcamentoAtualizado: string;
  responsavelOrcamento: string;
}

export interface EntregaFase {
  id: string;
  nome: string;
  descricao: string;
  arquivo?: string;
  dataEntrega?: string;
  concluida: boolean;
}

export interface AcessoPortal {
  id: string;
  dataAcesso: string;
  ip: string;
  navegador: string;
  dispositivo: string;
}

export interface DisciplinaTemplate {
  codigo: string;
  nome: string;
  ativa: boolean;
  horasEstimadas: number;
}

export interface PersonalizacaoIA {
  tipo: string;
  descricao: string;
  impacto: string;
  recomendada: boolean;
}

export interface EtapaPersonalizada {
  nome: string;
  disciplina: string;
  prazoAdicional: number;
  descricao: string;
  justificativa?: string;
  regraId?: string;
}

export interface TarefaModificacao {
  tarefa: string;
  prazoAdicional: number;
  justificativa: string;
  regraId?: string;
}

export interface AjusteCronograma {
  prazoOriginal: number;
  prazoAjustado: number;
  justificativa: string;
  regraId?: string;
}

export interface RecomendacaoIA {
  tipo: 'ATENCAO' | 'OPORTUNIDADE' | 'MELHORIA' | 'RISCO';
  titulo: string;
  descricao: string;
  acao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
}

export interface AnalisePersonalizacao {
  etapasRemover: string[];
  etapasAdicionar: EtapaPersonalizada[];
  tarefasModificar: TarefaModificacao[];
  cronogramaAjustado: AjusteCronograma | null;
  complexidadeCalculada: 'Baixa' | 'Média' | 'Alta' | 'Muito Alta';
  recomendacoes: RecomendacaoIA[];
  confidenciaAnalise: number;
  tipoAnalise?: 'REGRAS' | 'IA' | 'HIBRIDA';
  regrasAplicadas?: {
    id: string;
    nome: string;
    justificativa: string;
    peso: number;
  }[];
  sugestaoUpgrade?: {
    titulo: string;
    descricao: string;
    link: string;
    beneficios: string[];
  };
  aviso?: {
    tipo: 'INFO' | 'WARNING' | 'ERROR';
    titulo: string;
    descricao: string;
    acao?: string;
  };
  tempoProcessamento?: number;
  analiseDetalhada?: {
    regras: {
      confidencia: number;
      regrasAplicadas: number;
    };
    ia?: {
      confidencia: number;
      modelo: string;
    };
  };
}

// CONSTANTES
export const TIPOLOGIAS_PROJETO = [
  'Residencial', 'Comercial', 'Industrial', 'Institucional', 'Urbanístico'
] as const;

export const STATUS_PROJETO = [
  'Planejamento', 'Em Andamento', 'Pausado', 'Concluído', 'Cancelado'
] as const;

export const STATUS_TAREFA = [
  'A Fazer', 'Fazendo', 'Revisão', 'Concluído'
] as const;

export const DISCIPLINAS_PADRAO = [
  { codigo: 'ARQ', nome: 'Arquitetura', icone: '🏛️' },
  { codigo: 'EST', nome: 'Estrutural', icone: '🏗️' },
  { codigo: 'ELE', nome: 'Elétrica', icone: '💡' },
  { codigo: 'HID', nome: 'Hidráulica', icone: '💧' },
  { codigo: 'AVAC', nome: 'AVAC', icone: '❄️' },
  { codigo: 'PPCI', nome: 'PPCI', icone: '🔥' },
  { codigo: 'INT', nome: 'Interiores', icone: '🎨' }
] as const;

export const FASES_NBR = [
  { codigo: 'LV', nome: 'Levantamento', ordem: 1 },
  { codigo: 'PN', nome: 'Programa de Necessidades', ordem: 2 },
  { codigo: 'EP', nome: 'Estudo Preliminar', ordem: 3 },
  { codigo: 'AP', nome: 'Anteprojeto', ordem: 4 },
  { codigo: 'PE', nome: 'Projeto Executivo', ordem: 5 },
  { codigo: 'AS', nome: 'Assistência à Execução', ordem: 6 }
] as const;

export interface ProjetoCompleto {
  id: string;
  nome: string;
  descricao: string;
  tipologia: string;
  status: string;
  dataInicio: string;
  dataPrevisaoFim: string;
  prazoEstimado: number;
  valorEstimado?: number;
  complexidade: string;
  briefingId: string;
  templateId: string;
  avisoRevisao?: {
    obrigatoria: boolean;
    titulo: string;
    mensagem: string;
    itensParaRevisar: string[];
    acaoNecessaria: string;
  };
  disciplinas: any[];
  fases: any[];
  personalizacao?: any;
  logModificacoes?: any[];
  equipe: any[];
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  };
} 