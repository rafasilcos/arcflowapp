// ===== INTERFACES PRINCIPAIS =====

export interface EnderecoCompleto {
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  pais: string
}

export interface ResponsavelTecnico {
  id: string
  nome: string
  email: string
  telefone: string
  registro: string // CREA, CAU, etc.
  orgao: string
  especialidade: string
  ativo: boolean
}

export interface CoresPrimarias {
  principal: string
  secundaria: string
  acento: string
  texto: string
  fundo: string
}

export interface AssinaturaConfig {
  incluirLogo: boolean
  incluirResponsavel: boolean
  incluirRegistro: boolean
  incluirContato: boolean
  posicao: 'superior' | 'inferior' | 'lateral'
  tamanho: 'pequeno' | 'medio' | 'grande'
}

// ===== 1. CONFIGURAÇÕES DE EMPRESA =====
export interface ConfiguracaoEmpresa {
  // Dados básicos
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  
  // Endereço
  endereco: EnderecoCompleto
  
  // Contatos
  telefone: string
  email: string
  website?: string
  
  // Responsáveis técnicos
  responsavelTecnico: ResponsavelTecnico[]
  
  // Branding
  logo?: string
  cores: CoresPrimarias
  assinaturaProjetos: AssinaturaConfig
  
  // Dados adicionais
  anoFundacao?: number
  numeroFuncionarios: number
  areaAtuacao: string[]
  certificacoes: string[]
}

// ===== 2. CONFIGURAÇÕES FINANCEIRAS =====
export interface RegiaoFiscal {
  nome: string
  codigo: string
  issVariavel: boolean
  aliquotaISS: number
}

export interface TabelaPreco {
  id: string
  nome: string
  valorPorM2: number
  valorPorHora: number
  horasEstimadas: number
  categoria: 'arquitetura' | 'engenharia' | 'complementar'
  ativo: boolean
}

export interface DescontoConfig {
  id: string
  nome: string
  tipo: 'percentual' | 'valor_fixo'
  valor: number
  condicoes: string[]
  ativo: boolean
}

export interface CondicaoPagamento {
  id: string
  nome: string
  descricao: string
  parcelas: number
  intervaloDias: number
  descontoAVista?: number
  ativo: boolean
}

export interface ConfiguracaoFinanceira {
  // Moeda e região
  moeda: 'BRL' | 'USD' | 'EUR'
  regiao: RegiaoFiscal
  
  // Impostos
  regimeTributario: 'Simples' | 'Lucro Presumido' | 'Lucro Real'
  aliquotaISS: number
  aliquotaIR: number
  aliquotaPIS: number
  aliquotaCOFINS: number
  
  // Precificação
  tabelaPrecos: TabelaPreco[]
  descontosAutomaticos: DescontoConfig[]
  
  // Pagamentos
  condicoesPagamento: CondicaoPagamento[]
  multaAtraso: number
  jurosAtraso: number
  
  // Configurações bancárias
  dadosBancarios: {
    banco: string
    agencia: string
    conta: string
    tipoConta: 'corrente' | 'poupanca'
    pix?: string
  }
}

// ===== 3. CONFIGURAÇÕES OPERACIONAIS =====
export interface EtapaProjeto {
  id: string
  nome: string
  descricao: string
  ordem: number
  prazoEstimado: number
  obrigatoria: boolean
  dependencias: string[]
  ativo: boolean
}

export interface MembroEquipe {
  id: string
  nome: string
  email: string
  telefone: string
  cargo: string
  especialidade: string[]
  horasSemanais: number
  custoPorHora: number
  ativo: boolean
}

export interface HorarioTrabalho {
  diasSemana: number[]
  horaInicio: string
  horaFim: string
  horasAlmoco: number
  horasDia: number
}

export interface CapacidadeConfig {
  projetosSimultaneos: number
  metrosQuadradosPorMes: number
  horasProducaoMes: number
  eficienciaEquipe: number
}

export interface EmailTemplate {
  id: string
  nome: string
  assunto: string
  corpo: string
  trigger: string
  ativo: boolean
}

export interface IntegracaoConfig {
  id: string
  nome: string
  tipo: 'email' | 'whatsapp' | 'google_drive' | 'dropbox' | 'autocad' | 'revit'
  configuracoes: Record<string, any>
  ativo: boolean
}

export interface ConfiguracaoOperacional {
  // Fluxo de trabalho
  etapasProjeto: EtapaProjeto[]
  aprovacaoInterna: boolean
  revisaoTecnica: boolean
  
  // Equipe
  membrosEquipe: MembroEquipe[]
  horariosTrabalho: HorarioTrabalho
  capacidadeProducao: CapacidadeConfig
  
  // Automatizações
  emailsAutomaticos: EmailTemplate[]
  notificacoesCliente: boolean
  backupAutomatico: boolean
  
  // Integrações
  integracoes: IntegracaoConfig[]
}

// ===== 4. CONFIGURAÇÕES DE PROJETO =====
export interface TemplateBriefing {
  id: string
  nome: string
  categoria: string
  perguntas: string[]
  ativo: boolean
}

export interface TemplateContrato {
  id: string
  nome: string
  categoria: string
  template: string
  ativo: boolean
}

export interface TemplateProposta {
  id: string
  nome: string
  categoria: string
  template: string
  ativo: boolean
}

export interface PadraoDesenho {
  escalasPreferidas: string[]
  formatosPapel: string[]
  layersEstrutura: string[]
  fontesPadrao: string[]
  estiloCotas: string
}

export interface NomenclaturaConfig {
  prefixoProjeto: string
  sufixoVersao: string
  separadorElementos: string
  formatoData: string
}

export interface FormatoExportacao {
  id: string
  nome: string
  extensao: string
  qualidade: 'baixa' | 'media' | 'alta'
  ativo: boolean
}

export interface ChecklistItem {
  id: string
  nome: string
  categoria: string
  obrigatorio: boolean
  ordem: number
}

export interface ValidacaoTecnica {
  id: string
  nome: string
  tipo: 'automatica' | 'manual'
  criterios: string[]
  ativo: boolean
}

export interface EntregavelConfig {
  id: string
  nome: string
  tipo: 'arquivo' | 'documento' | 'relatorio'
  obrigatorio: boolean
  template?: string
}

export interface ConfiguracaoProjeto {
  // Templates
  templatesBriefing: TemplateBriefing[]
  templatesContrato: TemplateContrato[]
  templatesProposta: TemplateProposta[]
  
  // Padrões técnicos
  padroesDesenho: PadraoDesenho
  nomenclaturaArquivos: NomenclaturaConfig
  formatosExportacao: FormatoExportacao[]
  
  // Qualidade
  checklistQualidade: ChecklistItem[]
  validacoesTecnicas: ValidacaoTecnica[]
  
  // Entregáveis
  entregaveisPadrao: EntregavelConfig[]
}

// ===== 5. CONFIGURAÇÕES DE SEGURANÇA =====
export interface PoliticaSenha {
  tamanhoMinimo: number
  exigirMaiuscula: boolean
  exigirMinuscula: boolean
  exigirNumero: boolean
  exigirCaracterEspecial: boolean
  validadeDias: number
}

export interface SSOConfig {
  provedor: 'google' | 'microsoft' | 'linkedin'
  clientId: string
  dominio?: string
  ativo: boolean
}

export interface ConfiguracaoSeguranca {
  // Acesso
  politicaSenha: PoliticaSenha
  mfaObrigatorio: boolean
  ssoConfig?: SSOConfig
  
  // Auditoria
  logAcesso: boolean
  logAlteracoes: boolean
  retencaoLogs: number // dias
  
  // Backup
  frequenciaBackup: 'diario' | 'semanal' | 'mensal'
  localBackup: 'local' | 'nuvem' | 'ambos'
  
  // LGPD
  consentimentoDados: boolean
  politicaPrivacidade: string
  termoUso: string
}

// ===== CONFIGURAÇÃO GERAL =====
export interface ConfiguracaoGeral {
  empresa: ConfiguracaoEmpresa
  financeira: ConfiguracaoFinanceira
  operacional: ConfiguracaoOperacional
  projeto: ConfiguracaoProjeto
  seguranca: ConfiguracaoSeguranca
  
  // Metadados
  versao: string
  ultimaAtualizacao: Date
  criadoPor: string
}

// ===== TIPOS AUXILIARES =====
export type ConfigTipo = 'empresa' | 'financeira' | 'operacional' | 'projeto' | 'seguranca'

export interface ConfiguracaoSugerida {
  tipo: ConfigTipo
  campo: string
  valorAtual: any
  valorSugerido: any
  motivo: string
  impacto: 'baixo' | 'medio' | 'alto'
}

// ===== CONFIGURAÇÕES PADRÃO =====
export const CONFIGURACOES_PADRAO: ConfiguracaoGeral = {
  empresa: {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    },
    telefone: '',
    email: '',
    responsavelTecnico: [],
    cores: {
      principal: '#3B82F6',
      secundaria: '#1E40AF',
      acento: '#F59E0B',
      texto: '#111827',
      fundo: '#FFFFFF'
    },
    assinaturaProjetos: {
      incluirLogo: true,
      incluirResponsavel: true,
      incluirRegistro: true,
      incluirContato: true,
      posicao: 'inferior',
      tamanho: 'medio'
    },
    numeroFuncionarios: 1,
    areaAtuacao: [],
    certificacoes: []
  },
  financeira: {
    moeda: 'BRL',
    regiao: {
      nome: 'São Paulo',
      codigo: 'SP',
      issVariavel: true,
      aliquotaISS: 2.5
    },
    regimeTributario: 'Simples',
    aliquotaISS: 2.5,
    aliquotaIR: 0,
    aliquotaPIS: 0,
    aliquotaCOFINS: 0,
    tabelaPrecos: [],
    descontosAutomaticos: [],
    condicoesPagamento: [],
    multaAtraso: 2,
    jurosAtraso: 1,
    dadosBancarios: {
      banco: '',
      agencia: '',
      conta: '',
      tipoConta: 'corrente'
    }
  },
  operacional: {
    etapasProjeto: [],
    aprovacaoInterna: false,
    revisaoTecnica: false,
    membrosEquipe: [],
    horariosTrabalho: {
      diasSemana: [1, 2, 3, 4, 5],
      horaInicio: '08:00',
      horaFim: '18:00',
      horasAlmoco: 1,
      horasDia: 8
    },
    capacidadeProducao: {
      projetosSimultaneos: 5,
      metrosQuadradosPorMes: 1000,
      horasProducaoMes: 160,
      eficienciaEquipe: 80
    },
    emailsAutomaticos: [],
    notificacoesCliente: true,
    backupAutomatico: true,
    integracoes: []
  },
  projeto: {
    templatesBriefing: [],
    templatesContrato: [],
    templatesProposta: [],
    padroesDesenho: {
      escalasPreferidas: ['1:100', '1:50', '1:25'],
      formatosPapel: ['A0', 'A1', 'A2', 'A3'],
      layersEstrutura: [],
      fontesPadrao: ['Arial', 'Times New Roman'],
      estiloCotas: 'Arquitetônico'
    },
    nomenclaturaArquivos: {
      prefixoProjeto: 'PROJ',
      sufixoVersao: 'v',
      separadorElementos: '_',
      formatoData: 'YYYY-MM-DD'
    },
    formatosExportacao: [],
    checklistQualidade: [],
    validacoesTecnicas: [],
    entregaveisPadrao: []
  },
  seguranca: {
    politicaSenha: {
      tamanhoMinimo: 8,
      exigirMaiuscula: true,
      exigirMinuscula: true,
      exigirNumero: true,
      exigirCaracterEspecial: false,
      validadeDias: 90
    },
    mfaObrigatorio: false,
    logAcesso: true,
    logAlteracoes: true,
    retencaoLogs: 90,
    frequenciaBackup: 'semanal',
    localBackup: 'nuvem',
    consentimentoDados: false,
    politicaPrivacidade: '',
    termoUso: ''
  },
  versao: '1.0.0',
  ultimaAtualizacao: new Date(),
  criadoPor: 'Sistema'
} 