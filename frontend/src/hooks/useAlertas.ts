// ===== HOOK DE ALERTAS =====
// Sistema completo de alertas críticos

import { useState, useEffect, useCallback } from 'react';
import { alertasService, AlertaCritico, ContagemAlertas } from '@/services/alertasService';
import { Projeto } from '@/types/dashboard-core';

export interface UseAlertasReturn {
  // Estado
  alertas: AlertaCritico[];
  contagem: ContagemAlertas;
  
  // Ações
  analisarProjeto: (projeto: Projeto) => void;
  marcarComoLido: (alertaId: string) => void;
  limparAlertasTipo: (tipo: AlertaCritico['tipo']) => void;
  
  // Filtros
  obterAlertasPorTipo: (tipo: AlertaCritico['tipo']) => AlertaCritico[];
  obterAlertasCriticos: () => AlertaCritico[];
}

export function useAlertas(): UseAlertasReturn {
  const [alertas, setAlertas] = useState<AlertaCritico[]>([]);
  const [contagem, setContagem] = useState<ContagemAlertas>({
    atrasadas: 0,
    vencendo_hoje: 0,
    aguardando_aprovacao: 0,
    em_revisao: 0,
    aprovadas_hoje: 0,
    total: 0
  });

  // ===== EFEITOS =====
  
  useEffect(() => {
    // Registra callback para atualizações
    const callback = (novosAlertas: AlertaCritico[], novaContagem: ContagemAlertas) => {
      setAlertas(novosAlertas);
      setContagem(novaContagem);
    };

    alertasService.adicionarCallback(callback);

    // Cleanup
    return () => {
      alertasService.removerCallback(callback);
    };
  }, []);

  // ===== AÇÕES =====
  
  const analisarProjeto = useCallback((projeto: Projeto) => {
    alertasService.analisarProjeto(projeto);
  }, []);

  const marcarComoLido = useCallback((alertaId: string) => {
    alertasService.marcarComoLido(alertaId);
  }, []);

  const limparAlertasTipo = useCallback((tipo: AlertaCritico['tipo']) => {
    alertasService.limparAlertasTipo(tipo);
  }, []);

  // ===== FILTROS =====
  
  const obterAlertasPorTipo = useCallback((tipo: AlertaCritico['tipo']) => {
    return alertasService.obterAlertasPorTipo(tipo);
  }, []);

  const obterAlertasCriticos = useCallback(() => {
    return alertasService.obterAlertasCriticos();
  }, []);

  return {
    alertas,
    contagem,
    analisarProjeto,
    marcarComoLido,
    limparAlertasTipo,
    obterAlertasPorTipo,
    obterAlertasCriticos
  };
} 