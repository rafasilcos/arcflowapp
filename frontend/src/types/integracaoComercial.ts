// TIPOS PARA INTEGRAÇÃO COMERCIAL - ARCFLOW
// Sistema completo de integração CRM → Briefing → Orçamento → Projeto

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  fonte: 'site' | 'indicacao' | 'telefone' | 'evento' | 'redes_sociais';
  dataContato: string;
  responsavelComercial: string;
  status: 'novo' | 'qualificado' | 'em_negociacao' | 'convertido' | 'perdido';
  score: number; // 0-100
  observacoes: string;
  
  // Dados preliminares coletados
  dadosPreliminares: {
    tipoProjetoIndicado: string;
    orcamentoEstimado: number;
    prazoDesejado: string;
    localProjeto: string;
    urgencia: 'baixa' | 'media' | 'alta';
  };
  
  // Histórico de interações
  interacoes: InteracaoComercial[];
  
  criadoEm: string;
  atualizadoEm: string;
}

export interface InteracaoComercial {
  id: string;
  tipo: 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'visita';
  data: string;
  responsavel: string;
  resumo: string;
  proximaAcao?: string;
  dataProximaAcao?: string;
}

export interface EnderecoCompleto {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
}

export interface ConversaComercial {
  data: string;
  responsavel: string;
  canal: 'email' | 'telefone' | 'whatsapp' | 'site' | 'outro';
  resumo: string;
}

export interface ProjetoAnterior {
  projetoId: string;
  tipologia: string;
  ano: number;
  valor: number;
  satisfacao: number;
  observacoes: string;
}

export interface PreferenciasCliente {
  estilosArquitetonicos: string[];
  materiaisPreferidos: string[];
  coresPreferidas: string[];
  orcamentoMedioHistorico: number;
  prazoTipicoPreferido: number;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipoPessoa?: 'fisica' | 'juridica';
  cpf?: string;
  cnpj?: string;
  // Campos de endereço desmembrados
  endereco_cep?: string;
  endereco_logradouro?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_uf?: string;
  endereco_pais?: string;
  // Campo antigo (pode ser removido depois)
  endereco?: EnderecoCompleto | any;
  observacoes?: string;
  status: 'ativo' | 'inativo' | 'vip' | 'problema';
  isActive?: boolean;
  deletedAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  escritorioId?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Campos adicionais de pessoa física/jurídica
  profissao?: string;
  dataNascimento?: string;
  dataFundacao?: string;
  
  // Campos opcionais para compatibilidade com versão anterior
  familia?: {
    conjuge?: string;
    filhos?: { nome: string; idade: number; necessidadesEspeciais?: string }[];
    pets?: { tipo: string; quantidade: number }[];
  };
  origem?: {
    fonte: 'site' | 'indicacao' | 'telefone' | 'evento';
    dataContato: string;
    responsavelComercial: string;
    conversasAnteriores?: ConversaComercial[];
  };
  historicoProjetos?: ProjetoAnterior[];
  preferencias?: PreferenciasCliente;
}

export interface ContextoBriefing {
  // Dados do lead/cliente
  cliente: Cliente;
  leadOriginal?: Lead;
  
  // Contexto da reunião
  reuniao: {
    dataAgendada: string;
    local: 'escritorio' | 'cliente' | 'online' | 'obra';
    endereco?: string;
    participantes: string[];
    tempoEstimado: number; // minutos
    observacoesPreparacao: string;
  };
  
  // Dados preliminares já coletados
  dadosPreliminares: {
    tipoProjetoConfirmado: string;
    orcamentoConfirmado: number;
    prazoConfirmado: string;
    motivacaoProjeto: string;
    expectativasCliente: string[];
    restricoesConhecidas: string[];
    inspiracoes: string[];
  };
  
  // Contexto do escritório
  contextoEscritorio: {
    responsavelBriefing: string;
    equipeEnvolvida: string[];
    projetosSimilaresRealizados: string[];
    capacidadeAtual: 'baixa' | 'media' | 'alta';
    prazoInicioDisponivel: string;
  };
}

export interface OrcamentoAutomatico {
  id: string;
  briefingId: string;
  clienteId: string;
  
  // Dados base para cálculo
  dadosBase: {
    tipologia: string;
    subtipo: string;
    padrao: string;
    areaEstimada: number;
    complexidade: number; // 1-10
    prazoSolicitado: number; // semanas
    localProjeto: string;
  };
  
  // Cálculos automáticos
  calculos: {
    horasPorEtapa: Record<string, number>;
    valorHoraPorProfissional: Record<string, number>;
    custoTotalPorEtapa: Record<string, number>;
    custoTotalProjeto: number;
    margemAplicada: number; // %
    valorFinalProjeto: number;
  };
  
  // Comparação com histórico
  benchmarking: {
    projetosSimilares: {
      projetoId: string;
      similaridade: number; // %
      valorRealizado: number;
      prazoRealizado: number;
      margemFinal: number;
    }[];
    mediaHistorica: {
      valorPorM2: number;
      prazoMedio: number;
      margemMedia: number;
    };
    ajustesRecomendados: {
      valorSugerido: number;
      prazoSugerido: number;
      justificativa: string;
    };
  };
  
  // Cronograma preliminar
  cronograma: {
    etapas: {
      nome: string;
      duracao: number; // semanas
      dependencias: string[];
      responsavel: string;
      entregaveis: string[];
    }[];
    dataInicioEstimada: string;
    dataFimEstimada: string;
    marcosPrincipais: {
      nome: string;
      data: string;
      tipo: 'entrega' | 'aprovacao' | 'reuniao';
    }[];
  };
  
  // Proposta comercial
  proposta: {
    valorTotal: number;
    formaPagamento: {
      entrada: number; // %
      parcelas: number;
      valorParcela: number;
      vencimentos: string[];
    };
    prazoEntrega: number; // semanas
    garantias: string[];
    observacoes: string;
    validadeProposta: number; // dias
  };
  
  // Status e aprovações
  status: 'rascunho' | 'calculado' | 'revisado' | 'aprovado' | 'enviado' | 'aceito' | 'rejeitado';
  geradoEm: string;
  geradoPor: string;
  revisadoPor?: string;
  enviadoEm?: string;
  respostaClienteEm?: string;
}

export interface ProjetoAutomatico {
  id: string;
  briefingId: string;
  orcamentoId: string;
  clienteId: string;
  
  // Dados básicos do projeto
  dadosBasicos: {
    nome: string;
    tipologia: string;
    subtipo: string;
    descricao: string;
    enderecoProjeto: string;
    areaTerreno?: number;
    areaConstruida?: number;
    numeroAndares?: number;
  };
  
  // Equipe do projeto
  equipe: {
    coordenador: string;
    arquitetoResponsavel: string;
    engenheiros: string[];
    estagiarios: string[];
    consultores: string[];
    terceirizados: string[];
  };
  
  // Cronograma do projeto
  cronograma: {
    dataInicio: string;
    dataFimPrevista: string;
    etapas: {
      id: string;
      nome: string;
      descricao: string;
      dataInicio: string;
      dataFim: string;
      duracao: number; // dias
      dependencias: string[];
      responsavel: string;
      status: 'nao_iniciada' | 'em_andamento' | 'concluida' | 'atrasada' | 'cancelada';
      progresso: number; // %
      entregaveis: {
        nome: string;
        tipo: 'documento' | 'desenho' | 'modelo' | 'relatorio';
        status: 'pendente' | 'em_desenvolvimento' | 'concluido';
      }[];
    }[];
  };
  
  // Orçamento e controle financeiro
  orcamento: {
    valorContrato: number;
    valorRecebido: number;
    valorPendente: number;
    custoRealizado: number;
    custoEstimado: number;
    margemAtual: number;
    alertasFinanceiros: string[];
  };
  
  // Documentos e arquivos
  documentos: {
    briefingOriginal: string;
    contratoAssinado?: string;
    artRrt?: string;
    aprovacoesPrefeitura?: string[];
    desenhosTecnicos: string[];
    memoriais: string[];
    especificacoes: string[];
    fotos: string[];
    outros: string[];
  };
  
  // Comunicação com cliente
  comunicacao: {
    reunioesRealizadas: {
      data: string;
      tipo: 'briefing' | 'apresentacao' | 'revisao' | 'aprovacao';
      participantes: string[];
      ata: string;
      decisoes: string[];
      proximosPassos: string[];
    }[];
    emailsEnviados: number;
    whatsappsEnviados: number;
    ligacoesRealizadas: number;
    satisfacaoAtual: number; // 1-10
  };
  
  // Status e controle
  status: 'iniciado' | 'em_desenvolvimento' | 'em_aprovacao' | 'aprovado' | 'em_execucao' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  riscos: {
    tipo: 'prazo' | 'orcamento' | 'qualidade' | 'cliente' | 'tecnico';
    descricao: string;
    probabilidade: number; // %
    impacto: number; // 1-5
    mitigacao: string;
  }[];
  
  criadoEm: string;
  criadoPor: string;
  atualizadoEm: string;
  atualizadoPor: string;
}

export interface WorkflowIntegracao {
  // Configurações de automação
  automacoes: {
    gerarOrcamentoAutomatico: boolean;
    criarProjetoAutomatico: boolean;
    agendarReuniaoApresentacao: boolean;
    notificarEquipeResponsavel: boolean;
    atualizarCrmCliente: boolean;
    enviarEmailConfirmacao: boolean;
    criarTarefasIniciais: boolean;
  };
  
  // Templates e configurações
  templates: {
    emailConfirmacao: string;
    propostaComercial: string;
    contratoModelo: string;
    estruturaProjeto: string;
    checklistInicial: string[];
  };
  
  // Integrações externas
  integracoes: {
    sistemaAgenda: boolean;
    whatsappBusiness: boolean;
    emailMarketing: boolean;
    assinaturaDigital: boolean;
    sistemaFinanceiro: boolean;
  };
  
  // Métricas e acompanhamento
  metricas: {
    tempoMedioBriefingOrcamento: number; // horas
    taxaConversaoBriefingContrato: number; // %
    satisfacaoMediaClientes: number; // 1-10
    eficienciaProcesso: number; // %
  };
}

// Funções de integração
export interface IntegracaoComercialService {
  // Gestão de leads
  criarLeadDoBriefing(briefingData: any): Promise<Lead>;
  atualizarLeadComBriefing(leadId: string, briefingData: any): Promise<Lead>;
  
  // Gestão de clientes
  buscarCliente(termo: string): Promise<Cliente[]>;
  criarCliente(dadosCliente: Partial<Cliente>): Promise<Cliente>;
  atualizarCliente(clienteId: string, dados: Partial<Cliente>): Promise<Cliente>;
  obterHistoricoCliente(clienteId: string): Promise<Cliente>;
  
  // Geração de orçamento
  gerarOrcamentoAutomatico(briefingId: string, clienteId: string): Promise<OrcamentoAutomatico>;
  calcularBenchmarking(tipologia: string, area: number, complexidade: number): Promise<any>;
  
  // Criação de projeto
  criarProjetoAutomatico(briefingId: string, orcamentoId: string): Promise<ProjetoAutomatico>;
  configurarEquipeProjeto(projetoId: string, tipologia: string): Promise<void>;
  
  // Workflow e automações
  executarWorkflowPosBriefing(briefingId: string, configuracoes: WorkflowIntegracao): Promise<void>;
  agendarReuniaoApresentacao(clienteId: string, orcamentoId: string): Promise<void>;
  notificarEquipe(projetoId: string, tipo: string): Promise<void>;
}

export default IntegracaoComercialService; 