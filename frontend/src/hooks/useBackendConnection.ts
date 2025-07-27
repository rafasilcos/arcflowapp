import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface BackendConnectionState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  user: any;
  currentProject: any;
  cronometroAtivo: any;
}

interface UseBackendConnectionReturn extends BackendConnectionState {
  // Autenticação
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Projetos
  loadProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, data: any) => Promise<void>;
  
  // Cronômetros
  startTimer: (projectId: string, atividadeId?: string, observacoes?: string) => Promise<void>;
  stopTimer: (cronometroId: string, observacoes?: string) => Promise<void>;
  loadActiveTimers: () => Promise<void>;
  
  // Dashboard
  loadDashboardData: () => Promise<void>;
  
  // Clientes
  loadClientes: (params?: any) => Promise<any>;
  createCliente: (clienteData: any) => Promise<any>;
  updateCliente: (id: string, clienteData: any) => Promise<any>;
  deleteCliente: (id: string) => Promise<void>;
  
  // Briefings
  loadBriefings: (projectId: string) => Promise<any>;
  createBriefing: (briefingData: any) => Promise<any>;
  saveBriefingRespostas: (id: string, respostas: any, status?: string) => Promise<any>;
  finalizarBriefing: (id: string, observacoes?: string) => Promise<any>;
  
  // Utilitários
  reconnect: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
}

export function useBackendConnection(projectId?: string): UseBackendConnectionReturn {
  const [state, setState] = useState<BackendConnectionState>({
    isConnected: false,
    isLoading: true,
    error: null,
    user: null,
    currentProject: null,
    cronometroAtivo: null,
  });

  // ===== FUNÇÕES DE AUTENTICAÇÃO =====
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const authData = await apiClient.login({ email, password });
      const user = await apiClient.getCurrentUser();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        user,
        error: null
      }));
      
      console.log('✅ Login realizado com sucesso:', user);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error.message || 'Erro ao fazer login'
      }));
      console.error('❌ Erro no login:', error);
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await apiClient.logout();
      setState({
        isConnected: false,
        isLoading: false,
        error: null,
        user: null,
        currentProject: null,
        cronometroAtivo: null,
      });
      console.log('✅ Logout realizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setState({
        isConnected: false,
        isLoading: false,
        error: null,
        user: null,
        currentProject: null,
        cronometroAtivo: null,
      });
    }
  }, []);

  // ===== FUNÇÕES DE PROJETOS =====
  const loadProject = useCallback(async (projectId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const project = await apiClient.getProjeto(projectId);
      setState(prev => ({
        ...prev,
        currentProject: project,
        isLoading: false,
        error: null
      }));
      console.log('✅ Projeto carregado:', project);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao carregar projeto'
      }));
      console.error('❌ Erro ao carregar projeto:', error);
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, data: any) => {
    try {
      const updatedProject = await apiClient.updateProjeto(projectId, data);
      setState(prev => ({
        ...prev,
        currentProject: updatedProject
      }));
      console.log('✅ Projeto atualizado:', updatedProject);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao atualizar projeto'
      }));
      console.error('❌ Erro ao atualizar projeto:', error);
    }
  }, []);

  // ===== FUNÇÕES DE CRONÔMETROS =====
  const startTimer = useCallback(async (projectId: string, atividadeId?: string, observacoes?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const cronometro = await apiClient.startCronometro({
        projectId,
        atividadeId,
        observacoes
      });
      
      setState(prev => ({
        ...prev,
        cronometroAtivo: cronometro,
        isLoading: false,
        error: null
      }));
      
      console.log('✅ Cronômetro iniciado:', cronometro);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao iniciar cronômetro'
      }));
      console.error('❌ Erro ao iniciar cronômetro:', error);
    }
  }, []);

  const stopTimer = useCallback(async (cronometroId: string, observacoes?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const cronometro = await apiClient.stopCronometro(cronometroId, observacoes);
      setState(prev => ({
        ...prev,
        cronometroAtivo: null,
        isLoading: false,
        error: null
      }));
      
      console.log('✅ Cronômetro parado:', cronometro);
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao parar cronômetro'
      }));
      console.error('❌ Erro ao parar cronômetro:', error);
    }
  }, []);

  const loadActiveTimers = useCallback(async () => {
    try {
      const { activeCronometros } = await apiClient.getCronometrosAtivos();
      const cronometroAtivo = activeCronometros.length > 0 ? activeCronometros[0] : null;
      
      setState(prev => ({
        ...prev,
        cronometroAtivo
      }));
      
      console.log('✅ Cronômetros ativos carregados:', activeCronometros);
    } catch (error: any) {
      console.error('❌ Erro ao carregar cronômetros ativos:', error);
    }
  }, []);

  // ===== FUNÇÕES DE DASHBOARD =====
  const loadDashboardData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [overview, projects, activeTimers] = await Promise.all([
        apiClient.getDashboardOverview(),
        apiClient.getDashboardProjects(10),
        apiClient.getCronometrosAtivos()
      ]);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        cronometroAtivo: activeTimers.activeCronometros.length > 0 ? activeTimers.activeCronometros[0] : null
      }));
      
      console.log('✅ Dados do dashboard carregados:', { overview, projects, activeTimers });
      return { overview, projects, activeTimers };
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro ao carregar dashboard'
      }));
      console.error('❌ Erro ao carregar dashboard:', error);
      throw error;
    }
  }, []);

  // ===== FUNÇÕES DE CONEXÃO =====
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      await apiClient.healthCheck();
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      return true;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        error: 'Conexão com servidor perdida' 
      }));
      console.error('❌ Erro na conexão:', error);
      return false;
    }
  }, []);

  const reconnect = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Tentar reconectar
      const isConnected = await checkConnection();
      
      if (isConnected && apiClient.isAuthenticated()) {
        // Recarregar dados do usuário
        const user = await apiClient.getCurrentUser();
        setState(prev => ({
          ...prev,
          user,
          isConnected: true,
          isLoading: false,
          error: null
        }));
        
        // Recarregar projeto se necessário
        if (projectId) {
          await loadProject(projectId);
        }
        
        // Recarregar cronômetros ativos
        await loadActiveTimers();
        
        console.log('✅ Reconexão realizada com sucesso');
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Falha na reconexão'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erro na reconexão'
      }));
      console.error('❌ Erro na reconexão:', error);
    }
  }, [projectId, checkConnection, loadProject, loadActiveTimers]);

  // ===== EFEITOS =====
  useEffect(() => {
    const initializeConnection = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Verificar se há token salvo
        if (apiClient.isAuthenticated()) {
          // Verificar conexão
          const isConnected = await checkConnection();
          
          if (isConnected) {
            // Carregar dados do usuário
            const user = await apiClient.getCurrentUser();
            setState(prev => ({
              ...prev,
              user,
              isConnected: true,
              isLoading: false,
              error: null
            }));
            
            // Carregar projeto se fornecido
            if (projectId) {
              await loadProject(projectId);
            }
            
            // Carregar cronômetros ativos
            await loadActiveTimers();
            
            console.log('✅ Conexão inicializada com sucesso');
          } else {
            setState(prev => ({
              ...prev,
              isConnected: false,
              isLoading: false,
              error: 'Servidor indisponível'
            }));
          }
        } else {
          setState(prev => ({
            ...prev,
            isConnected: false,
            isLoading: false,
            error: null
          }));
          console.log('ℹ️ Usuário não autenticado');
        }
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isLoading: false,
          error: error.message || 'Erro na inicialização'
        }));
        console.error('❌ Erro na inicialização:', error);
      }
    };

    initializeConnection();
  }, [projectId, checkConnection, loadProject, loadActiveTimers]);

  // Polling para manter cronômetros atualizados
  useEffect(() => {
    if (!state.isConnected) return;

    const interval = setInterval(() => {
      loadActiveTimers();
    }, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [state.isConnected, loadActiveTimers]);

  return {
    ...state,
    login,
    logout,
    loadProject,
    updateProject,
    startTimer,
    stopTimer,
    loadActiveTimers,
    loadDashboardData,
    reconnect,
    checkConnection,
  };
} 