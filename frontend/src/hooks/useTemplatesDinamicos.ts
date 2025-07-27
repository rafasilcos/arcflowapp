import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplatesDinamicosService } from '../services/templatesDinamicosService';
import type {
  AnaliseNecessidades,
  ResultadoTemplatesDinamicos,
  SimulacaoResultado,
  MetricasSistema,
  ConfiguracaoTemplatesEngine
} from '../types/templates-dinamicos';

// ===== HOOKS PARA TEMPLATES DINÂMICOS =====

// Chaves de query para cache
export const TEMPLATES_QUERY_KEYS = {
  health: ['templates-dinamicos', 'health'] as const,
  metricas: ['templates-dinamicos', 'metricas'] as const,
  deteccao: (briefingData: any) => ['templates-dinamicos', 'deteccao', briefingData] as const,
  projeto: (projetoId: string) => ['templates-dinamicos', 'projeto', projetoId] as const,
  cronograma: (projetoId: string) => ['templates-dinamicos', 'cronograma', projetoId] as const,
  simulacao: (briefingData: any, config?: ConfiguracaoTemplatesEngine) => 
    ['templates-dinamicos', 'simulacao', briefingData, config] as const,
};

/**
 * Hook para verificar saúde do sistema de templates dinâmicos
 */
export function useTemplatesDinamicosHealth() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEYS.health,
    queryFn: TemplatesDinamicosService.healthCheck,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obter métricas do sistema
 */
export function useTemplatesDinamicosMetricas() {
  return useQuery<MetricasSistema>({
    queryKey: TEMPLATES_QUERY_KEYS.metricas,
    queryFn: TemplatesDinamicosService.obterMetricas,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchInterval: 1000 * 60 * 15, // Atualizar a cada 15 minutos
  });
}

/**
 * Hook para detectar necessidades de templates
 */
export function useDeteccaoNecessidades(briefingData?: any, enabled = true) {
  return useQuery<AnaliseNecessidades>({
    queryKey: TEMPLATES_QUERY_KEYS.deteccao(briefingData),
    queryFn: () => TemplatesDinamicosService.detectarNecessidades(briefingData),
    enabled: enabled && !!briefingData,
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
  });
}

/**
 * Hook para obter projeto composto
 */
export function useProjetoComposto(projetoId?: string, enabled = true) {
  return useQuery<ResultadoTemplatesDinamicos>({
    queryKey: TEMPLATES_QUERY_KEYS.projeto(projetoId!),
    queryFn: () => TemplatesDinamicosService.obterProjeto(projetoId!),
    enabled: enabled && !!projetoId,
    staleTime: 1000 * 60 * 60, // 1 hora
    retry: 1,
  });
}

/**
 * Hook para obter cronograma de projeto
 */
export function useCronogramaProjeto(projetoId?: string, enabled = true) {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEYS.cronograma(projetoId!),
    queryFn: () => TemplatesDinamicosService.obterCronograma(projetoId!),
    enabled: enabled && !!projetoId,
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 1,
  });
}

/**
 * Hook para simulação de projeto (sem cache agressivo)
 */
export function useSimulacaoProjeto(
  briefingData?: any,
  configuracao?: ConfiguracaoTemplatesEngine,
  enabled = false
) {
  return useQuery<SimulacaoResultado>({
    queryKey: TEMPLATES_QUERY_KEYS.simulacao(briefingData, configuracao),
    queryFn: () => TemplatesDinamicosService.simularProjeto(briefingData, configuracao),
    enabled: enabled && !!briefingData,
    staleTime: 1000 * 60 * 5, // 5 minutos apenas
    retry: 1,
  });
}

/**
 * Mutation para detectar necessidades (com loading state)
 */
export function useDetectarNecessidadesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (briefingData: any) => 
      TemplatesDinamicosService.detectarNecessidades(briefingData),
    onSuccess: (data, variables) => {
      // Armazenar resultado no cache
      queryClient.setQueryData(
        TEMPLATES_QUERY_KEYS.deteccao(variables),
        data
      );
    },
    onError: (error) => {
      console.error('❌ Erro na detecção de necessidades:', error);
    }
  });
}

/**
 * Mutation para gerar projeto completo
 */
export function useGerarProjetoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      projetoId, 
      briefingData, 
      configuracao 
    }: {
      projetoId: string;
      briefingData: any;
      configuracao?: ConfiguracaoTemplatesEngine;
    }) => 
      TemplatesDinamicosService.gerarProjeto(projetoId, briefingData, configuracao),
    onSuccess: (data, variables) => {
      // Armazenar resultado no cache
      queryClient.setQueryData(
        TEMPLATES_QUERY_KEYS.projeto(variables.projetoId),
        data
      );

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['templates-dinamicos', 'metricas']
      });
    },
    onError: (error) => {
      console.error('❌ Erro na geração do projeto:', error);
    }
  });
}

/**
 * Mutation para simulação de projeto
 */
export function useSimularProjetoMutation() {
  return useMutation({
    mutationFn: ({ 
      briefingData, 
      configuracao 
    }: {
      briefingData: any;
      configuracao?: ConfiguracaoTemplatesEngine;
    }) => 
      TemplatesDinamicosService.simularProjeto(briefingData, configuracao),
    onError: (error) => {
      console.error('❌ Erro na simulação do projeto:', error);
    }
  });
}

/**
 * Hook customizado para status geral do sistema
 */
export function useTemplatesDinamicosStatus() {
  const healthQuery = useTemplatesDinamicosHealth();
  const metricasQuery = useTemplatesDinamicosMetricas();

  return {
    isHealthy: healthQuery.data?.status === 'healthy',
    isLoading: healthQuery.isLoading || metricasQuery.isLoading,
    error: healthQuery.error || metricasQuery.error,
    metricas: metricasQuery.data,
    health: healthQuery.data,
    refetch: () => {
      healthQuery.refetch();
      metricasQuery.refetch();
    }
  };
}

/**
 * Hook para invalidar todas as queries de templates dinâmicos
 */
export function useInvalidateTemplatesDinamicos() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ['templates-dinamicos']
    });
  };
}

/**
 * Hook para limpar cache específico
 */
export function useLimparCacheTemplates() {
  const queryClient = useQueryClient();

  return {
    limparTudo: () => {
      queryClient.removeQueries({
        queryKey: ['templates-dinamicos']
      });
    },
    limparProjeto: (projetoId: string) => {
      queryClient.removeQueries({
        queryKey: ['templates-dinamicos', 'projeto', projetoId]
      });
      queryClient.removeQueries({
        queryKey: ['templates-dinamicos', 'cronograma', projetoId]
      });
    },
    limparDeteccao: (briefingData: any) => {
      queryClient.removeQueries({
        queryKey: TEMPLATES_QUERY_KEYS.deteccao(briefingData)
      });
    }
  };
}

/**
 * Hook para otimizar performance em componentes de lista
 */
export function useTemplatesDinamicosOptimizado() {
  const queryClient = useQueryClient();

  return {
    prefetchDeteccao: (briefingData: any) => {
      queryClient.prefetchQuery({
        queryKey: TEMPLATES_QUERY_KEYS.deteccao(briefingData),
        queryFn: () => TemplatesDinamicosService.detectarNecessidades(briefingData),
        staleTime: 1000 * 60 * 30,
      });
    },
    prefetchProjeto: (projetoId: string) => {
      queryClient.prefetchQuery({
        queryKey: TEMPLATES_QUERY_KEYS.projeto(projetoId),
        queryFn: () => TemplatesDinamicosService.obterProjeto(projetoId),
        staleTime: 1000 * 60 * 60,
      });
    },
    setOptimisticData: (projetoId: string, data: ResultadoTemplatesDinamicos) => {
      queryClient.setQueryData(
        TEMPLATES_QUERY_KEYS.projeto(projetoId),
        data
      );
    }
  };
} 