// import { apiClient } from '@/lib/api-client'; // Temporariamente usando fetch direto
// import { 
//   getCargoProfissional, 
//   getFuncaoOrganizacional, 
//   getPermissaoSistema,
//   type CargoProfissional as CargoProfissionalType,
//   type FuncaoOrganizacional as FuncaoOrganizacionalType 
// } from '@/types/equipe';

export interface Colaborador {
  id: string;
  nome: string;
  email: string;
  role: string;
  
  // Nova estrutura separada
  cargo?: string;      // Formação profissional (enum)
  funcao?: string;     // Papel na organização (enum)
  
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  _count?: {
    projetoUsers: number;
    atividades: number;
  };
}

export interface ColaboradorCreate {
  nome: string;
  email: string;
  role: string;
  cargo?: string;      // Formação profissional
  funcao?: string;     // Papel na organização
  password: string;
}

export interface ColaboradorUpdate {
  nome?: string;
  email?: string;
  role?: string;
  cargo?: string;      // Formação profissional
  funcao?: string;     // Papel na organização
  isActive?: boolean;
}

export interface ColaboradoresResponse {
  users: Colaborador[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ColaboradoresFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

class ColaboradoresService {
  private readonly baseUrl = '/api/users';

  /**
   * Buscar todos os colaboradores do escritório
   */
  async listar(filters: ColaboradoresFilters = {}): Promise<ColaboradoresResponse> {
    try {
      console.log('👥 [ColaboradoresService] Buscando colaboradores com filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('🔗 [ColaboradoresService] URL:', url);
      
      // CORREÇÃO: Usar fetch direto para compatibilidade com backend atual
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [ColaboradoresService] Resposta:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao listar colaboradores:', error);
      throw new Error('Erro ao buscar colaboradores');
    }
  }

  /**
   * Buscar colaborador por ID
   */
  async buscarPorId(id: string): Promise<Colaborador> {
    try {
      console.log('👤 [ColaboradoresService] Buscando colaborador ID:', id);
      
      // CORREÇÃO: Usar fetch direto para compatibilidade com backend atual
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [ColaboradoresService] Colaborador encontrado:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao buscar colaborador:', error);
      throw new Error('Erro ao buscar colaborador');
    }
  }

  /**
   * Criar novo colaborador
   */
  async criar(dados: ColaboradorCreate): Promise<Colaborador> {
    try {
      console.log('➕ [ColaboradoresService] Criando colaborador:', dados.nome);
      
      // CORREÇÃO: Usar fetch direto para compatibilidade com backend atual
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [ColaboradoresService] Colaborador criado:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao criar colaborador:', error);
      throw new Error('Erro ao criar colaborador');
    }
  }

  /**
   * Atualizar colaborador
   */
  async atualizar(id: string, dados: ColaboradorUpdate): Promise<Colaborador> {
    try {
      console.log('📝 [ColaboradoresService] Atualizando colaborador ID:', id);
      
      // CORREÇÃO: Usar fetch direto para compatibilidade com backend atual
      const token = localStorage.getItem('arcflow_auth_token');
      const response = await fetch(`http://localhost:3001${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [ColaboradoresService] Colaborador atualizado:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao atualizar colaborador:', error);
      throw new Error('Erro ao atualizar colaborador');
    }
  }

  /**
   * Desativar colaborador
   */
  async desativar(id: string): Promise<void> {
    try {
      console.log('🚫 [ColaboradoresService] Desativando colaborador ID:', id);
      
      await this.atualizar(id, { isActive: false });
      console.log('✅ [ColaboradoresService] Colaborador desativado');
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao desativar colaborador:', error);
      throw new Error('Erro ao desativar colaborador');
    }
  }

  /**
   * Reativar colaborador
   */
  async reativar(id: string): Promise<void> {
    try {
      console.log('✅ [ColaboradoresService] Reativando colaborador ID:', id);
      
      await this.atualizar(id, { isActive: true });
      console.log('✅ [ColaboradoresService] Colaborador reativado');
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao reativar colaborador:', error);
      throw new Error('Erro ao reativar colaborador');
    }
  }

  /**
   * Buscar colaboradores ativos para seleção em formulários
   */
  async listarAtivos(): Promise<Colaborador[]> {
    try {
      console.log('👥 [ColaboradoresService] Buscando colaboradores ativos');
      
      const response = await this.listar({ 
        isActive: true,
        limit: 100 // Limite alto para pegar todos os ativos
      });
      
      console.log('✅ [ColaboradoresService] Colaboradores ativos encontrados:', response.users.length);
      
      return response.users;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao buscar colaboradores ativos:', error);
      throw new Error('Erro ao buscar colaboradores ativos');
    }
  }

  /**
   * Buscar colaboradores por role específica
   */
  async listarPorRole(role: string): Promise<Colaborador[]> {
    try {
      console.log('👥 [ColaboradoresService] Buscando colaboradores por role:', role);
      
      const response = await this.listar({ 
        role,
        isActive: true,
        limit: 100
      });
      
      console.log('✅ [ColaboradoresService] Colaboradores por role encontrados:', response.users.length);
      
      return response.users;
      
    } catch (error) {
      console.error('❌ [ColaboradoresService] Erro ao buscar colaboradores por role:', error);
      throw new Error('Erro ao buscar colaboradores por role');
    }
  }

  /**
   * Mapear role para display - VERSÃO TEMPORÁRIA
   */
  getRoleDisplay(role: string): string {
    const roleMap: Record<string, string> = {
      'OWNER': 'Proprietário',
      'ADMIN': 'Administrador',
      'MANAGER': 'Gerente',
      'ARCHITECT': 'Arquiteto',
      'ENGINEER': 'Engenheiro',
      'DESIGNER': 'Designer',
      'USER': 'Usuário'
    };
    
    return roleMap[role] || role;
  }

  /**
   * Obter display do cargo profissional
   * TEMPORÁRIO: desabilitado até migração completa
   */
  getCargoDisplay(cargo?: string): string {
    // if (!cargo) return '';
    // const cargoInfo = getCargoProfissional(cargo);
    // return cargoInfo?.label || cargo;
    return cargo || '';
  }

  /**
   * Obter display da função organizacional
   * TEMPORÁRIO: desabilitado até migração completa
   */
  getFuncaoDisplay(funcao?: string): string {
    // if (!funcao) return '';
    // const funcaoInfo = getFuncaoOrganizacional(funcao);
    // return funcaoInfo?.label || funcao;
    return funcao || '';
  }

  /**
   * Mapear role para cor do badge
   */
  getRoleBadgeColor(role: string): string {
    const colorMap: Record<string, string> = {
      'OWNER': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800',
      'MANAGER': 'bg-blue-100 text-blue-800',
      'ARCHITECT': 'bg-green-100 text-green-800',
      'ENGINEER': 'bg-yellow-100 text-yellow-800',
      'DESIGNER': 'bg-pink-100 text-pink-800',
      'USER': 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Validar se o usuário pode gerenciar colaboradores
   */
  podeGerenciarColaboradores(userRole: string): boolean {
    const rolesPermitidas = ['OWNER', 'ADMIN', 'MANAGER'];
    return rolesPermitidas.includes(userRole);
  }

  /**
   * Validar se o usuário pode ser selecionado como responsável
   * VERSÃO TEMPORÁRIA: usa apenas role até migração completa
   */
  podeSerResponsavel(colaborador: Colaborador): boolean {
    if (!colaborador.isActive) return false;
    
    // Roles que sempre podem ser responsáveis
    const rolesTecnicas = ['OWNER', 'ADMIN', 'MANAGER', 'ARCHITECT', 'ENGINEER'];
    return rolesTecnicas.includes(colaborador.role);
  }

  /**
   * Obter descrição completa do colaborador para exibição
   * VERSÃO TEMPORÁRIA: usa apenas role até migração completa
   */
  getDescricaoCompleta(colaborador: Colaborador): string {
    const partes: string[] = [];
    
    // Temporariamente usar apenas role
    const roleDisplay = this.getRoleDisplay(colaborador.role);
    if (roleDisplay) partes.push(roleDisplay);
    
    // Futuro: quando cargo/funcao estiverem no banco
    // if (colaborador.cargo) {
    //   const cargoDisplay = this.getCargoDisplay(colaborador.cargo);
    //   if (cargoDisplay) partes.push(cargoDisplay);
    // }
    
    // if (colaborador.funcao) {
    //   const funcaoDisplay = this.getFuncaoDisplay(colaborador.funcao);
    //   if (funcaoDisplay) partes.push(funcaoDisplay);
    // }
    
    return partes.join(' • ') || 'Colaborador';
  }
}

export const colaboradoresService = new ColaboradoresService();
export default colaboradoresService; 