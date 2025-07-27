// ===== HOOK CRONÔMETRO AVANÇADO =====
// Extraído da V7-Otimizado - Hook completo para cronometragem

import { useState, useEffect, useCallback } from 'react';
import { cronometroService, EstadoCronometro, SessaoCronometro } from '@/services/cronometroService';

export interface UseCronometroReturn {
  // Estado
  cronometroAtivo: boolean;
  tarefaAtiva: string | null;
  tempoSessaoAtual: number;
  numeroSessoes: number;
  
  // Ações principais
  iniciarTarefa: (tarefaId: string) => void;
  pausarTarefa: () => void;
  finalizarTarefa: (tarefaId: string) => SessaoCronometro | null;
  sairDaTarefa: () => void;
  
  // Dados e utilitários
  obterTempoTotalTarefa: (tarefaId: string) => number;
  obterSessoesTarefa: (tarefaId: string) => SessaoCronometro[];
  formatarTempo: (segundos: number) => string;
  formatarTempoSimples: (segundos: number) => string;
  
  // Estado completo
  estadoCompleto: EstadoCronometro;
}

export function useCronometroAvancado(): UseCronometroReturn {
  const [estado, setEstado] = useState<EstadoCronometro>(cronometroService.obterEstado());

  // ===== EFEITOS =====
  
  useEffect(() => {
    // Carrega estado salvo ao inicializar
    cronometroService.carregarEstado();
    setEstado(cronometroService.obterEstado());

    // Registra callback para atualizações
    const callback = (novoEstado: EstadoCronometro) => {
      setEstado(novoEstado);
      cronometroService.salvarEstado(); // Auto-save
    };

    cronometroService.adicionarCallback(callback);

    // Cleanup
    return () => {
      cronometroService.removerCallback(callback);
    };
  }, []);

  // ===== AÇÕES PRINCIPAIS =====
  
  const iniciarTarefa = useCallback((tarefaId: string) => {
    cronometroService.iniciarTarefa(tarefaId);
  }, []);

  const pausarTarefa = useCallback(() => {
    cronometroService.pausarTarefa();
  }, []);

  const finalizarTarefa = useCallback((tarefaId: string) => {
    return cronometroService.finalizarTarefa(tarefaId);
  }, []);

  const sairDaTarefa = useCallback(() => {
    cronometroService.sairDaTarefa();
  }, []);

  // ===== UTILITÁRIOS =====
  
  const obterTempoTotalTarefa = useCallback((tarefaId: string) => {
    return cronometroService.obterTempoTotalTarefa(tarefaId);
  }, []);

  const obterSessoesTarefa = useCallback((tarefaId: string) => {
    return cronometroService.obterSessoesTarefa(tarefaId);
  }, []);

  const formatarTempo = useCallback((segundos: number) => {
    return cronometroService.formatarTempo(segundos);
  }, []);

  const formatarTempoSimples = useCallback((segundos: number) => {
    return cronometroService.formatarTempoSimples(segundos);
  }, []);

  // ===== RETORNO =====
  
  return {
    // Estado básico
    cronometroAtivo: estado.ativo,
    tarefaAtiva: estado.tarefa_ativa,
    tempoSessaoAtual: estado.tempo_sessao_atual,
    numeroSessoes: estado.numero_sessoes,
    
    // Ações
    iniciarTarefa,
    pausarTarefa,
    finalizarTarefa,
    sairDaTarefa,
    
    // Utilitários
    obterTempoTotalTarefa,
    obterSessoesTarefa,
    formatarTempo,
    formatarTempoSimples,
    
    // Estado completo
    estadoCompleto: estado
  };
} 