// 🎯 INTERFACES CENTRALIZADAS ARCFLOW - PADRÃO DEFINITIVO
// Este arquivo define as interfaces oficiais seguindo o padrão de nomenclatura

/**
 * 🔧 INTERFACE PRINCIPAL DE BRIEFING
 * Seguindo padrão: snake_case (banco) → camelCase (backend/frontend)
 */
export interface BriefingData {
  // 🆔 Identificação
  id: string
  
  // 📝 Dados do Projeto (PADRÃO CAMELCASE)
  nomeProjeto: string               // Backend: nomeProjeto ✅
  descricao?: string                // Backend: descricao ✅
  objetivos?: string                // Backend: objetivos ✅
  prazo?: string                    // Backend: prazo ✅
  orcamento?: string                // Backend: orcamento ✅
  
  // 📊 Status e Progresso
  status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'EM_EDICAO' | 'ORCAMENTO_ELABORACAO' | 'PROJETO_INICIADO'
  progresso: number
  
  // 🏗️ Classificação
  disciplina: string
  area: string
  tipologia: string
  
  // 🔗 Relacionamentos (PADRÃO CAMELCASE)
  clienteId?: string                // Backend: clienteId ✅
  responsavelId?: string            // Backend: responsavelId ✅
  escritorioId: string              // Backend: escritorioId ✅
  
  // 📅 Auditoria (PADRÃO CAMELCASE)
  createdAt: string                 // Backend: createdAt ✅
  updatedAt: string                 // Backend: updatedAt ✅
  deletedAt?: string                // Backend: deletedAt ✅
  createdBy?: string                // Backend: createdBy ✅
  updatedBy?: string                // Backend: updatedBy ✅
  
  // 📄 Dados Estruturados
  metadata?: any
  observacoes?: any
  
  // 🧮 Contadores
  _count?: {
    respostas: number
  }
  
  // 💰 Orçamento
  temOrcamento?: boolean
  orcamentoId?: string
  
  // 🔗 Dados Relacionados (podem ser carregados separadamente)
  cliente?: ClienteData
  responsavel?: UsuarioData
}

/**
 * 🔧 INTERFACE DE CLIENTE
 * Seguindo padrão: snake_case (banco) → camelCase (backend/frontend)
 */
export interface ClienteData {
  // 🆔 Identificação
  id: string
  
  // 📝 Dados Pessoais/Empresariais
  nome: string
  email?: string
  telefone?: string
  documento?: string
  
  // 📍 Endereço
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  
  // 📊 Status
  status: 'ATIVO' | 'INATIVO'
  
  // 🔗 Relacionamentos (PADRÃO CAMELCASE)
  escritorioId: string              // Backend: escritorioId ✅
  
  // 📅 Auditoria (PADRÃO CAMELCASE)
  createdAt: string                 // Backend: createdAt ✅
  updatedAt: string                 // Backend: updatedAt ✅
  deletedAt?: string                // Backend: deletedAt ✅
}

/**
 * 🔧 INTERFACE DE USUÁRIO
 * Seguindo padrão: snake_case (banco) → camelCase (backend/frontend)
 */
export interface UsuarioData {
  // 🆔 Identificação
  id: string
  
  // 📝 Dados Pessoais
  nome: string
  email: string
  cargo?: string
  
  // 🔐 Autenticação
  role: 'OWNER' | 'ADMIN' | 'ARCHITECT' | 'ENGINEER' | 'DESIGNER'
  
  // 📊 Status
  isActive: boolean
  status: 'ATIVO' | 'INATIVO'
  
  // 🔗 Relacionamentos (PADRÃO CAMELCASE)
  escritorioId: string              // Backend: escritorioId ✅
  
  // 📅 Auditoria (PADRÃO CAMELCASE)
  createdAt: string                 // Backend: createdAt ✅
  updatedAt: string                 // Backend: updatedAt ✅
  lastLogin?: string                // Backend: lastLogin ✅
  ultimoLogin?: string              // Backend: ultimoLogin ✅
}

/**
 * 🔧 INTERFACE DE PROJETO
 * Seguindo padrão: snake_case (banco) → camelCase (backend/frontend)
 */
export interface ProjetoData {
  // 🆔 Identificação
  id: string
  
  // 📝 Dados do Projeto
  nomeProjeto: string               // Backend: nomeProjeto ✅
  descricao?: string
  
  // 🔗 Relacionamentos (PADRÃO CAMELCASE)
  clienteId?: string                // Backend: clienteId ✅
  responsavelId?: string            // Backend: responsavelId ✅
  escritorioId: string              // Backend: escritorioId ✅
  briefingId?: string               // Backend: briefingId ✅
  
  // 📅 Auditoria (PADRÃO CAMELCASE)
  createdAt: string                 // Backend: createdAt ✅
  updatedAt: string                 // Backend: updatedAt ✅
}

/**
 * 🛠️ UTILITÁRIOS PARA NORMALIZAÇÃO
 */
export type NormalizeBriefingData = (data: any) => BriefingData;
export type NormalizeClienteData = (data: any) => ClienteData;
export type NormalizeUsuarioData = (data: any) => UsuarioData;

/**
 * 🔧 MAPEAMENTO DE CONVERSÃO
 * Para garantir compatibilidade entre snake_case e camelCase
 */
export const FIELD_MAPPINGS = {
  // Briefing
  nome_projeto: 'nomeProjeto',
  cliente_id: 'clienteId',
  responsavel_id: 'responsavelId',
  escritorio_id: 'escritorioId',
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  deleted_at: 'deletedAt',
  created_by: 'createdBy',
  updated_by: 'updatedBy',
  briefing_id: 'briefingId',
  ultimo_login: 'ultimoLogin',
  last_login: 'lastLogin'
} as const;

/**
 * 🎯 FUNÇÃO UTILITÁRIA PARA NORMALIZAÇÃO
 * Converte dados snake_case para camelCase automaticamente
 */
export function normalizeBriefingData(rawData: any): BriefingData {
  const normalized = { ...rawData };
  
  // Aplicar mapeamento de campos
  for (const [snakeCase, camelCase] of Object.entries(FIELD_MAPPINGS)) {
    if (rawData[snakeCase] !== undefined) {
      normalized[camelCase] = rawData[snakeCase];
    }
  }
  
  return normalized as BriefingData;
}

/**
 * 🔧 FUNÇÃO UTILITÁRIA PARA FALLBACK
 * Garantir compatibilidade com dados antigos
 */
export function getBriefingValue<T>(data: any, field: keyof typeof FIELD_MAPPINGS): T | undefined {
  const camelCase = FIELD_MAPPINGS[field];
  return data[camelCase] || data[field];
}

/**
 * 📋 REGRAS DE VALIDAÇÃO
 */
export const VALIDATION_RULES = {
  // Campos obrigatórios
  REQUIRED_FIELDS: ['id', 'nomeProjeto', 'status', 'progresso'] as const,
  
  // Campos com fallback
  FALLBACK_FIELDS: Object.keys(FIELD_MAPPINGS) as Array<keyof typeof FIELD_MAPPINGS>,
  
  // Status válidos
  VALID_STATUS: ['EM_ANDAMENTO', 'CONCLUIDO', 'EM_EDICAO', 'ORCAMENTO_ELABORACAO', 'PROJETO_INICIADO'] as const,
  
  // Roles válidos
  VALID_ROLES: ['OWNER', 'ADMIN', 'ARCHITECT', 'ENGINEER', 'DESIGNER'] as const
} as const; 