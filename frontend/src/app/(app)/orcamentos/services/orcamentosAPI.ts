/**
 * 🔌 SERVIÇO DE API UNIFICADO PARA ORÇAMENTOS
 * 
 * Centraliza todas as operações de API relacionadas a orçamentos:
 * - Listagem, criação, atualização, exclusão
 * - Integração com briefings
 * - Configurações e disciplinas
 * - Autenticação automática
 */

// Tipos principais
export interface OrcamentoListItem {
  id: string;
  codigo: string;
  nome: string;
  cliente_nome: string;
  status: 'RASCUNHO' | 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  valor_total: number;
  valor_por_m2: number;
  area_construida: number;
  tipologia: string;
  created_at: string;
  updated_at: string;
}

export interface OrcamentoDetalhado extends OrcamentoListItem {
  area_terreno: number;
  padrao: string;
  complexidade: string;
  localizacao: string;
  prazo_entrega: number;
  disciplinas: string[];
  cronograma: any;
  composicao_financeira: any;
  proposta: any;
}

export interface CriarOrcamentoData {
  nome: string;
  cliente_nome: string;
  tipologia: string;
  area_construida: number;
  area_terreno?: number;
  padrao: string;
  complexidade: string;
  localizacao: string;
  disciplinas: string[];
  briefing_id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 🔐 CLASSE PRINCIPAL DO SERVIÇO DE API
 */
class OrcamentosAPIService {
  private baseURL = '/api/orcamentos';
  private token: string | null = null;

  constructor() {
    // Inicializar token do localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('arcflow_auth_token');
    }
  }

  /**
   * 🔑 OBTER TOKEN DE AUTENTICAÇÃO
   */
  private async getAuthToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    // Tentar login automático
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@arcflow.com',
          password: '123456'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.tokens?.accessToken || data.token;
        if (this.token && typeof window !== 'undefined') {
          localStorage.setItem('arcflow_auth_token', this.token);
        }
        return this.token || '';
      }
    } catch (error) {
      console.error('❌ Erro no login automático:', error);
    }

    throw new Error('Não foi possível obter token de autenticação');
  }

  /**
   * 🌐 FAZER REQUISIÇÃO HTTP COM AUTENTICAÇÃO
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } catch (error: any) {
      console.error(`❌ Erro na API ${endpoint}:`, error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido na API'
      };
    }
  }

  /**
   * 📋 LISTAR TODOS OS ORÇAMENTOS
   */
  async listarOrcamentos(): Promise<ApiResponse<OrcamentoListItem[]>> {
    console.log('📋 Carregando lista de orçamentos...');
    return this.makeRequest<OrcamentoListItem[]>('');
  }

  /**
   * 👁️ OBTER ORÇAMENTO POR ID
   */
  async obterOrcamento(id: string): Promise<ApiResponse<OrcamentoDetalhado>> {
    console.log(`👁️ Carregando orçamento ${id}...`);
    return this.makeRequest<OrcamentoDetalhado>(`/${id}`);
  }

  /**
   * ➕ CRIAR NOVO ORÇAMENTO
   */
  async criarOrcamento(dados: CriarOrcamentoData): Promise<ApiResponse<OrcamentoDetalhado>> {
    console.log('➕ Criando novo orçamento:', dados.nome);
    return this.makeRequest<OrcamentoDetalhado>('', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
  }

  /**
   * ✏️ ATUALIZAR ORÇAMENTO
   */
  async atualizarOrcamento(id: string, dados: Partial<CriarOrcamentoData>): Promise<ApiResponse<OrcamentoDetalhado>> {
    console.log(`✏️ Atualizando orçamento ${id}...`);
    return this.makeRequest<OrcamentoDetalhado>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });
  }

  /**
   * 🗑️ EXCLUIR ORÇAMENTO
   */
  async excluirOrcamento(id: string): Promise<ApiResponse<void>> {
    console.log(`🗑️ Excluindo orçamento ${id}...`);
    return this.makeRequest<void>(`/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * 🧠 GERAR ORÇAMENTO A PARTIR DE BRIEFING
   */
  async gerarOrcamentoDoBriefing(briefingId: string): Promise<ApiResponse<OrcamentoDetalhado>> {
    console.log(`🧠 Gerando orçamento do briefing ${briefingId}...`);
    return this.makeRequest<OrcamentoDetalhado>(`/gerar-briefing/${briefingId}`, {
      method: 'POST'
    });
  }

  /**
   * 📋 LISTAR BRIEFINGS DISPONÍVEIS
   */
  async listarBriefingsDisponiveis(): Promise<ApiResponse<any[]>> {
    console.log('📋 Carregando briefings disponíveis...');
    return this.makeRequest<any[]>('/briefings-disponiveis');
  }

  /**
   * 📊 OBTER MÉTRICAS DO DASHBOARD
   */
  async obterMetricas(): Promise<ApiResponse<any>> {
    console.log('📊 Carregando métricas do dashboard...');
    return this.makeRequest<any>('/metricas');
  }

  /**
   * ⚙️ OBTER CONFIGURAÇÕES DE DISCIPLINAS
   */
  async obterConfiguracoesDisciplinas(): Promise<ApiResponse<any>> {
    console.log('⚙️ Carregando configurações de disciplinas...');
    return this.makeRequest<any>('/configuracoes/disciplinas');
  }

  /**
   * 💾 SALVAR CONFIGURAÇÕES DE DISCIPLINAS
   */
  async salvarConfiguracoesDisciplinas(configuracoes: any): Promise<ApiResponse<any>> {
    console.log('💾 Salvando configurações de disciplinas...');
    return this.makeRequest<any>('/configuracoes/disciplinas', {
      method: 'POST',
      body: JSON.stringify(configuracoes)
    });
  }
}

// Instância singleton do serviço
export const orcamentosAPI = new OrcamentosAPIService();

// Exportar também como default
export default orcamentosAPI;