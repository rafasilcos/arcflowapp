/**
 * ⚙️ HOOK PARA SINCRONIZAÇÃO COM CONFIGURAÇÕES
 * 
 * Responsável por:
 * - Carregar configurações da Tabela de Preços
 * - Sincronizar disciplinas ativas
 * - Detectar mudanças em tempo real
 * - Manter consistência entre páginas
 */

import { useState, useEffect, useCallback } from 'react';
import { ConfigurationData } from '../types/configuration';

interface UseConfigurationSyncReturn {
  configurations: ConfigurationData | null;
  activeDisciplines: string[];
  loading: boolean;
  error: string | null;
  syncWithConfigurations: () => Promise<void>;
}

export function useConfigurationSync(budgetId: string): UseConfigurationSyncReturn {
  const [configurations, setConfigurations] = useState<ConfigurationData | null>(null);
  const [activeDisciplines, setActiveDisciplines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔄 CARREGAR CONFIGURAÇÕES DA TABELA DE PREÇOS
   */
  const fetchConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('⚙️ Carregando configurações da Tabela de Preços...');

      // Carregar configurações do escritório
      const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // ID padrão
      const response = await fetch(`/api/escritorios/${escritorioId}/configuracoes`);
      
      if (!response.ok) {
        throw new Error(`Erro ao carregar configurações: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar configurações');
      }

      setConfigurations(result.data);

      // Extrair disciplinas ativas
      const activeDisc = Object.entries(result.data.disciplinas || {})
        .filter(([_, config]: [string, any]) => config.ativo)
        .map(([code, _]) => code);

      setActiveDisciplines(activeDisc);

      console.log('✅ Configurações carregadas:', {
        disciplinasAtivas: activeDisc.length,
        totalConfiguracoes: Object.keys(result.data.disciplinas || {}).length
      });

    } catch (error: any) {
      console.error('❌ Erro ao carregar configurações:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ CORREÇÃO: Dependências vazias para evitar re-criação

  /**
   * 🔄 CARREGAR DISCIPLINAS ESPECÍFICAS DO ORÇAMENTO
   */
  const fetchBudgetDisciplines = useCallback(async () => {
    if (!budgetId) return;

    try {
      console.log('📋 Carregando disciplinas específicas do orçamento...');

      const response = await fetch(`/api/orcamentos/${budgetId}/disciplinas`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data.disciplinasAtivas) {
          // Usar disciplinas específicas do orçamento se existirem
          setActiveDisciplines(result.data.disciplinasAtivas);
          console.log('✅ Disciplinas específicas do orçamento carregadas:', result.data.disciplinasAtivas);
          return;
        }
      }

      // Fallback: usar disciplinas das configurações globais
      console.log('⚠️ Usando disciplinas das configurações globais como fallback');
      
    } catch (error) {
      console.warn('⚠️ Erro ao carregar disciplinas específicas, usando configurações globais:', error);
    }
  }, [budgetId]);

  /**
   * 🔄 SINCRONIZAÇÃO COMPLETA - VERSÃO ESTÁVEL
   */
  const syncWithConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar configurações
      const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
      const configResponse = await fetch(`/api/escritorios/${escritorioId}/configuracoes`);
      
      if (configResponse.ok) {
        const configResult = await configResponse.json();
        if (configResult.success) {
          setConfigurations(configResult.data);
          
          // Extrair disciplinas ativas das configurações
          const activeDisc = Object.entries(configResult.data.disciplinas || {})
            .filter(([_, config]: [string, any]) => config.ativo)
            .map(([code, _]) => code);
          
          setActiveDisciplines(activeDisc);
        }
      }

      // Tentar carregar disciplinas específicas do orçamento
      if (budgetId) {
        const budgetResponse = await fetch(`/api/orcamentos/${budgetId}/disciplinas`);
        if (budgetResponse.ok) {
          const budgetResult = await budgetResponse.json();
          if (budgetResult.success && budgetResult.data.disciplinasAtivas) {
            setActiveDisciplines(budgetResult.data.disciplinasAtivas);
          }
        }
      }

    } catch (error: any) {
      console.error('❌ Erro na sincronização:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [budgetId]); // ✅ CORREÇÃO: Apenas budgetId como dependência

  // ✅ CORREÇÃO: Carregar apenas uma vez na inicialização
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (!isMounted || !budgetId) return;
      
      try {
        setLoading(true);
        setError(null);

        console.log('⚙️ Carregando configurações iniciais...');

        // Carregar configurações
        const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
        const configResponse = await fetch(`/api/escritorios/${escritorioId}/configuracoes`);
        
        if (configResponse.ok && isMounted) {
          const configResult = await configResponse.json();
          if (configResult.success) {
            setConfigurations(configResult.data);
            
            // Extrair disciplinas ativas das configurações
            const activeDisc = Object.entries(configResult.data.disciplinas || {})
              .filter(([_, config]: [string, any]) => config.ativo)
              .map(([code, _]) => code);
            
            setActiveDisciplines(activeDisc);
          }
        }

        // Tentar carregar disciplinas específicas do orçamento
        const budgetResponse = await fetch(`/api/orcamentos/${budgetId}/disciplinas`);
        if (budgetResponse.ok && isMounted) {
          const budgetResult = await budgetResponse.json();
          if (budgetResult.success && budgetResult.data.disciplinasAtivas) {
            setActiveDisciplines(budgetResult.data.disciplinasAtivas);
          }
        }

        console.log('✅ Configurações iniciais carregadas');

      } catch (error: any) {
        if (isMounted) {
          console.error('❌ Erro ao carregar configurações iniciais:', error);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, [budgetId]); // ✅ CORREÇÃO: Dependência apenas do budgetId

  // ❌ REMOVIDO: Polling automático que causava loop infinito
  // O polling será implementado apenas quando necessário via user action

  return {
    configurations,
    activeDisciplines,
    loading,
    error,
    syncWithConfigurations
  };
}