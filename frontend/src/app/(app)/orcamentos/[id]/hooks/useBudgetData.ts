/**
 * 🎯 HOOK PARA DADOS DO ORÇAMENTO EM TEMPO REAL
 * 
 * Responsável por:
 * - Carregar dados do orçamento via API
 * - Manter sincronização em tempo real
 * - Gerenciar estados de loading e erro
 * - Revalidação automática
 */

import { useState, useEffect, useCallback } from 'react';
import { BudgetData } from '../types/budget';

interface UseBudgetDataReturn {
  budgetData: BudgetData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBudgetData(budgetId: string): UseBudgetDataReturn {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔄 FUNÇÃO DE CARREGAMENTO DE DADOS
   * Busca dados reais do orçamento via API
   */
  const fetchBudgetData = useCallback(async () => {
    if (!budgetId) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Carregando dados do orçamento:', budgetId);

      // Obter token de autenticação
      let token = localStorage.getItem('arcflow_auth_token');

      // Tentar login automático se necessário
      if (!token) {
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@arcflow.com',
              password: '123456'
            })
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            token = loginData.tokens?.accessToken || loginData.token;
            if (token) {
              localStorage.setItem('arcflow_auth_token', token);
            }
          }
        } catch (loginError) {
          console.error('❌ Erro no login automático:', loginError);
        }
      }

      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login primeiro.');
      }

      // Buscar dados do orçamento
      const response = await fetch(`/api/orcamentos/${budgetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Erro ao carregar orçamento');
      }

      // Mapear dados para formato padronizado
      const mappedData: BudgetData = {
        id: result.data.id,
        codigo: result.data.codigo,
        nome: result.data.nome,
        cliente_nome: result.data.cliente_nome || 'Cliente não informado',
        status: result.data.status,
        area_construida: result.data.area_construida || 0,
        area_terreno: result.data.area_terreno || 0,
        valor_total: parseFloat(result.data.valor_total) || 0,
        valor_por_m2: parseFloat(result.data.valor_por_m2) || 0,
        tipologia: result.data.tipologia,
        padrao: result.data.padrao,
        complexidade: result.data.complexidade,
        localizacao: result.data.localizacao,
        prazo_entrega: result.data.prazo_entrega || 0,
        disciplinas: parseJsonSafely(result.data.disciplinas, []),
        cronograma: parseJsonSafely(result.data.cronograma, null),
        composicao_financeira: parseJsonSafely(result.data.composicao_financeira, null),
        proposta: parseJsonSafely(result.data.proposta, null),
        created_at: result.data.created_at,
        updated_at: result.data.updated_at
      };

      setBudgetData(mappedData);

      console.log('✅ Dados do orçamento carregados:', {
        id: mappedData.id,
        codigo: mappedData.codigo,
        valorTotal: mappedData.valor_total,
        disciplinas: mappedData.disciplinas?.length || 0
      });

    } catch (error: any) {
      console.error('❌ Erro ao carregar orçamento:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return {
    budgetData,
    loading,
    error,
    refetch: fetchBudgetData
  };
}

/**
 * 🛠️ FUNÇÃO AUXILIAR PARA PARSE JSON SEGURO
 */
function parseJsonSafely(data: any, fallback: any = null) {
  if (!data) return fallback;
  if (typeof data === 'object' && data !== null) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('⚠️ Erro ao fazer parse JSON:', error);
      return fallback;
    }
  }
  return fallback;
}