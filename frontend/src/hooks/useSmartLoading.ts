import { useState, useCallback, useRef, useEffect } from 'react';

// ===== TIPOS DO SISTEMA DE LOADING =====
export interface LoadingState {
  loading: boolean;
  progress: number;
  message: string;
  error?: string;
  success?: boolean;
  startTime?: number;
  estimatedDuration?: number;
}

export interface LoadingOptions {
  message?: string;
  estimatedDuration?: number; // em milissegundos
  progressSteps?: number[];   // marcos de progresso personalizados
  successMessage?: string;
  errorMessage?: string;
  autoHide?: boolean;        // auto-remover após sucesso
  hideDelay?: number;        // delay para auto-hide (ms)
}

export interface UseSmartLoadingReturn {
  loadingStates: Record<string, LoadingState>;
  withLoading: <T>(key: string, action: () => Promise<T>, options?: LoadingOptions) => Promise<T>;
  setLoadingMessage: (key: string, message: string) => void;
  setLoadingProgress: (key: string, progress: number) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  isAnyLoading: boolean;
  getLoadingKeys: () => string[];
}

// ===== MENSAGENS PADRÃO CONTEXTUAIS =====
const DEFAULT_MESSAGES = {
  starting: 'Iniciando...',
  processing: 'Processando...',
  saving: 'Salvando alterações...',
  loading: 'Carregando dados...',
  deleting: 'Removendo...',
  uploading: 'Enviando arquivos...',
  downloading: 'Baixando arquivo...',
  success: 'Concluído com sucesso!',
  error: 'Ocorreu um erro inesperado.'
} as const;

// ===== HOOK PRINCIPAL =====
export const useSmartLoading = (): UseSmartLoadingReturn => {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  const intervalsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Limpar intervalos ao desmontar
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  // ===== SIMULADOR DE PROGRESSO INTELIGENTE =====
  const simulateProgress = useCallback((
    key: string, 
    estimatedDuration: number, 
    progressSteps?: number[]
  ) => {
    const startTime = Date.now();
    const updateInterval = Math.max(100, estimatedDuration / 50); // Atualizar a cada 2% do tempo estimado
    
    const defaultSteps = [10, 25, 40, 60, 75, 90]; // Marcos padrão de progresso
    const steps = progressSteps || defaultSteps;
    let currentStepIndex = 0;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / estimatedDuration) * 100, 90); // Nunca passar de 90% até a conclusão real

      setLoadingStates(prev => {
        if (!prev[key] || !prev[key].loading) {
          clearInterval(progressInterval);
          return prev;
        }

        // Atualizar mensagem baseada no progresso
        let message = prev[key].message;
        if (currentStepIndex < steps.length && progressPercent >= steps[currentStepIndex]) {
          const stepMessages = [
            'Iniciando processamento...',
            'Validando dados...',
            'Executando operação...',
            'Finalizando...',
            'Quase pronto...',
            'Concluindo...'
          ];
          message = stepMessages[currentStepIndex] || message;
          currentStepIndex++;
        }

        return {
          ...prev,
          [key]: {
            ...prev[key],
            progress: Math.round(progressPercent),
            message
          }
        };
      });
    }, updateInterval);

    intervalsRef.current[key] = progressInterval;
    return progressInterval;
  }, []);

  // ===== FUNÇÃO PRINCIPAL COM LOADING =====
  const withLoading = useCallback(async <T>(
    key: string,
    action: () => Promise<T>,
    options: LoadingOptions = {}
  ): Promise<T> => {
    const {
      message = DEFAULT_MESSAGES.processing,
      estimatedDuration = 2000,
      progressSteps,
      successMessage = DEFAULT_MESSAGES.success,
      errorMessage = DEFAULT_MESSAGES.error,
      autoHide = true,
      hideDelay = 1500
    } = options;

    // Inicializar loading state
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        loading: true,
        progress: 0,
        message,
        startTime: Date.now(),
        estimatedDuration
      }
    }));

    // Iniciar simulação de progresso
    const progressInterval = simulateProgress(key, estimatedDuration, progressSteps);

    try {
      // Executar a ação
      const result = await action();

      // Limpar progresso simulado
      if (intervalsRef.current[key]) {
        clearInterval(intervalsRef.current[key]);
        delete intervalsRef.current[key];
      }

      // Mostrar sucesso
      setLoadingStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          progress: 100,
          message: successMessage,
          success: true
        }
      }));

      // Auto-hide se habilitado
      if (autoHide) {
        const hideTimeout = setTimeout(() => {
          setLoadingStates(prev => {
            const { [key]: removed, ...rest } = prev;
            return rest;
          });
        }, hideDelay);
        
        timeoutsRef.current[key] = hideTimeout;
      }

      return result;

    } catch (error) {
      // Limpar progresso simulado
      if (intervalsRef.current[key]) {
        clearInterval(intervalsRef.current[key]);
        delete intervalsRef.current[key];
      }

      const errorMsg = error instanceof Error ? error.message : errorMessage;

      // Mostrar erro
      setLoadingStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          progress: 0,
          message: errorMsg,
          error: errorMsg,
          success: false
        }
      }));

      // Auto-hide erro após delay maior
      if (autoHide) {
        const hideTimeout = setTimeout(() => {
          setLoadingStates(prev => {
            const { [key]: removed, ...rest } = prev;
            return rest;
          });
        }, hideDelay * 2); // Erro fica visível por mais tempo
        
        timeoutsRef.current[key] = hideTimeout;
      }

      throw error;
    }
  }, [simulateProgress]);

  // ===== FUNÇÕES AUXILIARES =====
  const setLoadingMessage = useCallback((key: string, message: string) => {
    setLoadingStates(prev => prev[key] ? {
      ...prev,
      [key]: { ...prev[key], message }
    } : prev);
  }, []);

  const setLoadingProgress = useCallback((key: string, progress: number) => {
    setLoadingStates(prev => prev[key] ? {
      ...prev,
      [key]: { ...prev[key], progress: Math.max(0, Math.min(100, progress)) }
    } : prev);
  }, []);

  const clearLoading = useCallback((key: string) => {
    // Limpar intervalos e timeouts
    if (intervalsRef.current[key]) {
      clearInterval(intervalsRef.current[key]);
      delete intervalsRef.current[key];
    }
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    // Remover do state
    setLoadingStates(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    // Limpar todos os intervalos e timeouts
    Object.values(intervalsRef.current).forEach(clearInterval);
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    intervalsRef.current = {};
    timeoutsRef.current = {};

    // Limpar state
    setLoadingStates({});
  }, []);

  // ===== COMPUTED VALUES =====
  const isAnyLoading = Object.values(loadingStates).some(state => state.loading);
  const getLoadingKeys = () => Object.keys(loadingStates).filter(key => loadingStates[key].loading);

  return {
    loadingStates,
    withLoading,
    setLoadingMessage,
    setLoadingProgress,
    clearLoading,
    clearAllLoading,
    isAnyLoading,
    getLoadingKeys
  };
};

// ===== HOOKS ESPECIALIZADOS =====

// Hook para operações CRUD
export const useCrudLoading = () => {
  const smartLoading = useSmartLoading();
  
  return {
    ...smartLoading,
    withCreate: <T>(action: () => Promise<T>) => 
      smartLoading.withLoading('create', action, { 
        message: 'Criando registro...', 
        successMessage: 'Registro criado com sucesso!',
        estimatedDuration: 1500
      }),
    withUpdate: <T>(action: () => Promise<T>) => 
      smartLoading.withLoading('update', action, { 
        message: 'Atualizando registro...', 
        successMessage: 'Registro atualizado com sucesso!',
        estimatedDuration: 1200
      }),
    withDelete: <T>(action: () => Promise<T>) => 
      smartLoading.withLoading('delete', action, { 
        message: 'Removendo registro...', 
        successMessage: 'Registro removido com sucesso!',
        estimatedDuration: 800
      })
  };
};

// Hook para operações de arquivo
export const useFileLoading = () => {
  const smartLoading = useSmartLoading();
  
  return {
    ...smartLoading,
    withUpload: <T>(action: () => Promise<T>) => 
      smartLoading.withLoading('upload', action, { 
        message: 'Enviando arquivo...', 
        successMessage: 'Arquivo enviado com sucesso!',
        estimatedDuration: 3000,
        progressSteps: [5, 15, 30, 50, 70, 85, 95]
      }),
    withDownload: <T>(action: () => Promise<T>) => 
      smartLoading.withLoading('download', action, { 
        message: 'Baixando arquivo...', 
        successMessage: 'Download concluído!',
        estimatedDuration: 2000
      })
  };
}; 