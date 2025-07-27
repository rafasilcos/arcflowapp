// ===== TIPOS ENTERPRISE ARCFLOW =====

export interface TenantEnterprise {
  id: string
  nome: string
  cnpj: string
  razaoSocial: string
  
  // Plano e configurações
  plano: 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE'
  status: 'ATIVO' | 'INADIMPLENTE' | 'SUSPENSO' | 'CANCELADO' | 'TRIAL'
  
  // Configurações Enterprise
  configuracoes: {
    whiteLabel: WhiteLabelConfig
    compliance: ComplianceConfig
    integracao: IntegracaoConfig
    backup: BackupConfig
    suporte: SuporteConfig
    infraestrutura: InfraestruturaConfig
  }
  
  // Limites e quotas
  limites: TenantLimites
  
  // Cobrança e financeiro
  cobranca: CobrancaConfig
  
  // Auditoria e logs
  auditoria: AuditoriaConfig
  
  // Metadados
  criadoEm: Date
  atualizadoEm: Date
  criadoPor: string
}

export interface WhiteLabelConfig {
  habilitado: boolean
  logo: {
    principal: string      // URL do logo principal
    favicon: string        // URL do favicon
    loading: string        // Logo para tela de loading
    email: string          // Logo para emails
  }
  cores: {
    primaria: string       // #FF6B35
    secundaria: string     // #2E86AB
    acento: string         // #A23B72
    fundo: string          // #F18F01
    texto: string          // #C73E1D
  }
  dominio: {
    customizado: string    // app.escritorio.com.br
    ssl: boolean           // Certificado SSL próprio
    cdn: boolean           // CDN dedicada
  }
  marca: {
    nomeExibicao: string   // "Silva Arquitetura Pro"
    slogan: string         // "Projetos que transformam"
    copyright: string      // "© 2024 Silva Arquitetura"
  }
  personalizacao: {
    tema: 'light' | 'dark' | 'custom'
    layout: 'moderno' | 'classico' | 'minimalista'
    tipografia: string     // Font family customizada
  }
}

export interface ComplianceConfig {
  lgpd: {
    habilitado: boolean
    dpo: string            // Data Protection Officer
    politicaPrivacidade: string
    termosUso: string
    retencaoDados: number  // dias
  }
  iso27001: {
    habilitado: boolean
    certificado: string
    auditoriaAnual: boolean
    politicasSeguranca: string[]
  }
  sox: {
    habilitado: boolean
    controleInterno: boolean
    auditoriaFinanceira: boolean
  }
  backup: {
    frequencia: 'diaria' | 'semanal' | 'mensal'
    retencao: number       // meses
    localizacao: 'brasil' | 'eua' | 'europa'
    criptografia: boolean
  }
}

export interface IntegracaoConfig {
  api: {
    habilitada: boolean
    chaveApi: string
    limiteChamadas: number // por hora
    webhooks: WebhookConfig[]
    graphql: boolean
  }
  software: {
    autocad: boolean
    revit: boolean
    sketchup: boolean
    archicad: boolean
    vectorworks: boolean
  }
  erp: {
    sap: boolean
    oracle: boolean
    totvs: boolean
    senior: boolean
    custom: CustomIntegration[]
  }
  contabilidade: {
    contabilizei: boolean
    dominio: boolean
    sage: boolean
  }
}

export interface WebhookConfig {
  id: string
  nome: string
  url: string
  eventos: string[]
  ativo: boolean
  secret: string
}

export interface CustomIntegration {
  nome: string
  tipo: 'REST' | 'SOAP' | 'GraphQL' | 'FTP' | 'Database'
  configuracao: Record<string, any>
  mapeamentoCampos: Record<string, string>
}

export interface BackupConfig {
  automatico: boolean
  frequencia: 'tempo_real' | 'horaria' | 'diaria' | 'semanal'
  retencao: number        // meses
  localizacao: 'brasil' | 'multiregiao'
  criptografia: boolean
  sla: {
    rto: number           // Recovery Time Objective (horas)
    rpo: number           // Recovery Point Objective (minutos)
  }
  teste: {
    frequencia: 'mensal' | 'trimestral'
    ultimoTeste: Date
    resultado: 'sucesso' | 'falha' | 'parcial'
  }
}

export interface SuporteConfig {
  nivel: 'basico' | 'premium' | 'enterprise' | 'vip'
  csm: {                  // Customer Success Manager
    habilitado: boolean
    nome: string
    email: string
    telefone: string
  }
  sla: {
    tempoResposta: number // horas
    tempoResolucao: number // horas
    disponibilidade: '8x5' | '12x5' | '24x7'
  }
  canais: {
    email: boolean
    telefone: boolean
    chat: boolean
    videoconferencia: boolean
    onsite: boolean       // Suporte presencial
  }
  treinamento: {
    onboarding: boolean
    periodico: boolean
    certificacao: boolean
  }
}

export interface InfraestruturaConfig {
  dedicada: boolean
  regiao: 'brasil' | 'eua' | 'europa' | 'asia'
  cdn: {
    habilitada: boolean
    regioes: string[]
    cache: number         // TTL em segundos
  }
  performance: {
    garantiaUptime: number // 99.9%, 99.95%, 99.99%
    monitoramento: boolean
    alertas: boolean
    relatorioMensal: boolean
  }
  seguranca: {
    waf: boolean          // Web Application Firewall
    ddosProtection: boolean
    ipsBlocking: boolean
    geoBlocking: string[] // Países bloqueados
  }
  recursos: {
    cpu: number           // vCPUs dedicadas
    memoria: number       // GB RAM
    storage: number       // GB SSD
    bandwidth: number     // GB/mês
  }
}

export interface TenantLimites {
  usuarios: {
    maximo: number
    atual: number
    roles: Record<string, number> // Limite por role
  }
  projetos: {
    maximo: number
    atual: number
    simultaneos: number   // Projetos ativos simultâneos
  }
  armazenamento: {
    maximo: number        // GB
    atual: number
    arquivos: number      // Número máximo de arquivos
  }
  api: {
    chamadas: number      // Por hora
    webhooks: number      // Número máximo de webhooks
    integracao: number    // Integrações simultâneas
  }
  recursos: {
    relatorios: number    // Relatórios por mês
    exports: number       // Exports por mês
    backups: number       // Backups manuais por mês
  }
}

export interface CobrancaConfig {
  plano: {
    nome: string
    valor: number
    moeda: 'BRL' | 'USD'
    ciclo: 'mensal' | 'anual'
    desconto: number      // Percentual
  }
  pagamento: {
    metodo: 'cartao' | 'boleto' | 'pix' | 'transferencia'
    proximoVencimento: Date
    status: 'em_dia' | 'vencido' | 'cancelado'
    tentativas: number
  }
  faturamento: {
    nf: boolean           // Emissão de Nota Fiscal
    cnpj: string
    inscricaoEstadual: string
    enderecoFaturamento: EnderecoFaturamento
  }
  historico: HistoricoPagamento[]
}

export interface EnderecoFaturamento {
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  pais: string
}

export interface HistoricoPagamento {
  id: string
  data: Date
  valor: number
  status: 'pago' | 'pendente' | 'cancelado' | 'estornado'
  metodo: string
  referencia: string    // ID da transação
  notaFiscal?: string
}

export interface AuditoriaConfig {
  habilitada: boolean
  retencao: number      // meses
  eventos: {
    login: boolean
    acoes: boolean
    alteracoes: boolean
    exports: boolean
    api: boolean
  }
  relatorios: {
    automaticos: boolean
    frequencia: 'semanal' | 'mensal' | 'trimestral'
    destinatarios: string[]
  }
}

// ===== TIPOS DE USUÁRIO ENTERPRISE =====

export interface UsuarioEnterprise {
  id: string
  nome: string
  email: string
  tenantId: string
  
  // Roles e permissões avançadas
  role: EnterpriseRole
  permissoes: PermissaoDetalhada[]
  grupos: GrupoUsuario[]
  
  // Configurações pessoais
  configuracoes: {
    tema: string
    idioma: 'pt-BR' | 'en-US' | 'es-ES'
    timezone: string
    notificacoes: NotificacaoConfig
  }
  
  // Auditoria
  ultimoLogin: Date
  tentativasLogin: number
  bloqueado: boolean
  motivoBloqueio?: string
  
  // Metadados
  criadoEm: Date
  criadoPor: string
  atualizadoEm: Date
}

export type EnterpriseRole = 
  | 'SUPER_ADMIN'     // Acesso total ao sistema
  | 'TENANT_ADMIN'    // Admin do escritório
  | 'MANAGER'         // Gerente de projetos
  | 'ARCHITECT'       // Arquiteto sênior
  | 'ENGINEER'        // Engenheiro
  | 'DESIGNER'        // Designer
  | 'INTERN'          // Estagiário
  | 'CLIENT'          // Cliente externo
  | 'VIEWER'          // Apenas visualização
  | 'API_USER'        // Usuário de API
  | 'CUSTOM'          // Role customizada

export interface PermissaoDetalhada {
  modulo: string        // 'projetos', 'clientes', 'financeiro'
  acao: string          // 'create', 'read', 'update', 'delete'
  escopo: 'proprio' | 'equipe' | 'escritorio' | 'todos'
  condicoes?: Record<string, any>
}

export interface GrupoUsuario {
  id: string
  nome: string
  descricao: string
  permissoes: PermissaoDetalhada[]
  usuarios: string[]   // IDs dos usuários
}

export interface NotificacaoConfig {
  email: boolean
  push: boolean
  sms: boolean
  whatsapp: boolean
  canais: {
    projetos: boolean
    financeiro: boolean
    sistema: boolean
    marketing: boolean
  }
}

// ===== TIPOS DE RELATÓRIOS ENTERPRISE =====

export interface RelatorioEnterprise {
  id: string
  nome: string
  tipo: 'financeiro' | 'produtividade' | 'compliance' | 'custom'
  categoria: 'dashboard' | 'export' | 'agendado'
  
  configuracao: {
    filtros: Record<string, any>
    colunas: string[]
    formato: 'pdf' | 'excel' | 'csv' | 'json'
    agendamento?: AgendamentoRelatorio
  }
  
  permissoes: {
    visualizar: EnterpriseRole[]
    exportar: EnterpriseRole[]
    agendar: EnterpriseRole[]
  }
  
  metadados: {
    criadoEm: Date
    criadoPor: string
    ultimaExecucao?: Date
    proximaExecucao?: Date
  }
}

export interface AgendamentoRelatorio {
  frequencia: 'diaria' | 'semanal' | 'mensal' | 'trimestral'
  diaExecucao?: number
  horaExecucao: string
  destinatarios: string[]
  ativo: boolean
}

// ===== TIPOS DE API ENTERPRISE =====

export interface ApiKeyEnterprise {
  id: string
  nome: string
  chave: string
  tenantId: string
  
  permissoes: {
    leitura: boolean
    escrita: boolean
    admin: boolean
    modulos: string[]
  }
  
  limites: {
    chamadas: number      // Por hora
    rateLimit: number     // Por minuto
    ips: string[]         // IPs permitidos
  }
  
  webhook: {
    url?: string
    eventos: string[]
    secret: string
  }
  
  estatisticas: {
    totalChamadas: number
    ultimaChamada: Date
    erros: number
  }
  
  metadados: {
    criadaEm: Date
    expiraEm?: Date
    ativa: boolean
  }
}

// ===== EXPORTAÇÕES =====
// Todos os tipos estão definidos neste arquivo 