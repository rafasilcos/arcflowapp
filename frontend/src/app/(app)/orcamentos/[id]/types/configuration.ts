/**
 * ⚙️ TIPOS TYPESCRIPT PARA CONFIGURAÇÕES
 * 
 * Define todas as interfaces relacionadas às configurações
 * da Tabela de Preços e disciplinas.
 */

export interface ConfigurationData {
  disciplinas: Record<string, DisciplineConfig>;
  multiplicadores_regionais: Record<string, RegionalMultiplier>;
  padroes_construcao: Record<string, StandardMultiplier>;
  custos_indiretos: IndirectCosts;
  multiplicadores_complexidade: Record<string, number>;
  configuracoes_comerciais: CommercialSettings;
  configuracoes_escritorio: OfficeSettings;
}

export interface DisciplineConfig {
  ativo: boolean;
  valor_base: number;
  valor_por_m2: number;
  valor_por_hora: number;
  horas_estimadas: number;
  multiplicador_complexidade_padrao: number;
}

export interface RegionalMultiplier {
  nome: string;
  multiplicador: number;
}

export interface StandardMultiplier {
  nome: string;
  multiplicador: number;
}

export interface IndirectCosts {
  margem_lucro: number;
  overhead: number;
  impostos: number;
  reserva_contingencia: number;
  comissao_vendas: number;
  marketing?: number;
  capacitacao?: number;
  seguros?: number;
}

export interface CommercialSettings {
  desconto_maximo_permitido: number;
  valor_minimo_projeto: number;
  forma_pagamento_padrao: string;
  juros_parcelamento: number;
  desconto_pagamento_vista: number;
  multa_atraso_pagamento?: number;
  juros_mora?: number;
  reajuste_anual?: number;
  prazo_garantia_projeto?: number;
  prazo_revisao_gratuita?: number;
}

export interface OfficeSettings {
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  regime_tributario: string;
  regiao_principal: string;
  especialidade: string;
  nivel_experiencia: string;
  ano_fundacao?: number;
  numero_funcionarios?: number;
  responsavel_tecnico?: {
    nome: string;
    registro_profissional: string;
    email: string;
  };
  areas_atuacao?: string[];
}