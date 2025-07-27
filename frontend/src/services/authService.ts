'use client';

import { API_CONFIG } from '@/config/api-config';

interface TokenRefreshResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  escritorioId: string;
}

class AuthService {
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  // ===== AUTO-REFRESH SYSTEM =====
  
  /**
   * Inicia o sistema de auto-refresh de tokens
   * Agenda refresh automático para 3.5 horas (30 min antes de expirar)
   */
  startAutoRefresh(): void {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('arcflow_auth_token');
    const refreshToken = localStorage.getItem('arcflow_refresh_token');
    
    if (!token || !refreshToken) {
      console.log('🔐 [AUTO-REFRESH] Tokens não encontrados, não iniciando auto-refresh');
      return;
    }

    // Limpar timer anterior se existir
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Agendar refresh para 3.5 horas (30 min antes de expirar)
    const refreshInterval = 3.5 * 60 * 60 * 1000; // 3.5 horas em millisegundos
    
    this.refreshTimer = setTimeout(async () => {
      await this.refreshTokens();
    }, refreshInterval);

    console.log('✅ [AUTO-REFRESH] Sistema iniciado - próximo refresh em 3.5 horas');
  }

  /**
   * Para o sistema de auto-refresh
   */
  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      console.log('🛑 [AUTO-REFRESH] Sistema parado');
    }
  }

  /**
   * Executa o refresh dos tokens
   */
  async refreshTokens(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if (this.isRefreshing) {
      console.log('🔄 [AUTO-REFRESH] Refresh já em andamento, aguardando...');
      return false;
    }

    this.isRefreshing = true;
    
    try {
      const refreshToken = localStorage.getItem('arcflow_refresh_token');
      
      if (!refreshToken) {
        console.log('❌ [AUTO-REFRESH] Refresh token não encontrado');
        this.handleRefreshFailure();
        return false;
      }

      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data: TokenRefreshResponse = await response.json();
        
        // Salvar novos tokens
        localStorage.setItem('arcflow_auth_token', data.tokens.accessToken);
        localStorage.setItem('arcflow_refresh_token', data.tokens.refreshToken);
        
        console.log('✅ [AUTO-REFRESH] Tokens atualizados com sucesso');
        
        // Reagendar próximo refresh
        this.startAutoRefresh();
        
        return true;
      } else {
        console.log('❌ [AUTO-REFRESH] Falha no refresh:', response.status);
        this.handleRefreshFailure();
        return false;
      }
    } catch (error) {
      console.error('❌ [AUTO-REFRESH] Erro no refresh:', error);
      this.handleRefreshFailure();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Trata falhas no refresh de tokens
   */
  private handleRefreshFailure(): void {
    console.log('🚨 [AUTO-REFRESH] Falha no refresh - redirecionando para login');
    this.logout();
    window.location.href = '/auth/login';
  }

  // ===== AUTH METHODS =====

  /**
   * Faz login e inicia auto-refresh
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar tokens e dados
        localStorage.setItem('arcflow_auth_token', data.tokens.accessToken);
        localStorage.setItem('arcflow_refresh_token', data.tokens.refreshToken);
        localStorage.setItem('arcflow_user', JSON.stringify(data.user));
        localStorage.setItem('arcflow_escritorio', JSON.stringify(data.escritorio));
        
        // Iniciar auto-refresh
        this.startAutoRefresh();
        
        console.log('✅ [AUTH] Login realizado com auto-refresh ativado');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Erro no login' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  }

  /**
   * Faz logout e para auto-refresh
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    
    // Parar auto-refresh
    this.stopAutoRefresh();
    
    // Limpar storage
    localStorage.removeItem('arcflow_auth_token');
    localStorage.removeItem('arcflow_refresh_token');
    localStorage.removeItem('arcflow_user');
    localStorage.removeItem('arcflow_escritorio');
    
    console.log('✅ [AUTH] Logout realizado');
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('arcflow_auth_token');
    const user = localStorage.getItem('arcflow_user');
    const escritorio = localStorage.getItem('arcflow_escritorio');
    
    return !!(token && user && escritorio && 
             user !== 'undefined' && escritorio !== 'undefined');
  }

  /**
   * Obtém dados do usuário atual
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('arcflow_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Força refresh manual dos tokens
   */
  async forceRefresh(): Promise<boolean> {
    return await this.refreshTokens();
  }
}

// Instância singleton
export const authService = new AuthService();
export default authService; 