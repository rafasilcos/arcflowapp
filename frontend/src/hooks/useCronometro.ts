'use client';

// ===== HOOK CRONÔMETRO ENTERPRISE =====
// Implementação COMPLETA baseada na página original de 4277 linhas

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Projeto, Tarefa, Etapa, SessaoCronometro, AnotacaoSalva } from '@/types/dashboard';

export const useCronometro = (projeto: Projeto, setProjeto: React.Dispatch<React.SetStateAction<Projeto>>) => {
  // ===== ESTADOS DO CRONÔMETRO =====
  const [tarefaAtiva, setTarefaAtiva] = useState<string | null>(null);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [tempoSessaoAtual, setTempoSessaoAtual] = useState(0);
  const [anotacaoSessao, setAnotacaoSessao] = useState('');
  
  // Estados para histórico e persistência
  const [numeroSessoes, setNumeroSessoes] = useState(1);
  const [sessoesAnteriores, setSessoesAnteriores] = useState<SessaoCronometro[]>([]);
  const [anotacoesSalvas, setAnotacoesSalvas] = useState<AnotacaoSalva[]>([]);
  
  // Referencias para timers
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessaoInicioRef = useRef<number>(0);

  // ===== ATALHOS DE TECLADO =====
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Espaço = Iniciar/Pausar
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        if (tarefaAtiva) {
          if (cronometroAtivo) {
            pausarTarefa();
          } else {
            retomarTarefa(tarefaAtiva);
          }
        }
      }
      
      // Ctrl + Enter = Salvar nota
      if (e.ctrlKey && e.key === 'Enter' && tarefaAtiva && anotacaoSessao.trim()) {
        e.preventDefault();
        salvarNota();
      }
      
      // Ctrl + S = Salvar nota
      if (e.ctrlKey && e.key === 's' && tarefaAtiva && anotacaoSessao.trim()) {
        e.preventDefault();
        salvarNota();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [tarefaAtiva, cronometroAtivo, anotacaoSessao]);

  // ===== TIMER EFFECT =====
  useEffect(() => {
    if (cronometroAtivo && tarefaAtiva) {
      intervalRef.current = setInterval(() => {
        setTempoSessaoAtual(prev => prev + 1);
        
                 // Atualizar tempo total da tarefa no projeto
         setProjeto((projetoAtual: Projeto) => ({
           ...projetoAtual,
           etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
             ...etapa,
             tarefas: etapa.tarefas.map((tarefa: Tarefa) => 
               tarefa.id === tarefaAtiva 
                 ? { 
                     ...tarefa, 
                     tempo_total: tarefa.tempo_total + 1,
                     tempo_sessao_atual: tempoSessaoAtual + 1
                   }
                 : tarefa
             )
           }))
         }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cronometroAtivo, tarefaAtiva, tempoSessaoAtual, setProjeto]);

  // ===== FUNÇÕES PRINCIPAIS =====
  
  const iniciarTarefa = useCallback((tarefaId: string) => {
    console.log(`🚀 Iniciando tarefa: ${tarefaId}`);
    
    // Pausar qualquer tarefa ativa
    if (tarefaAtiva && tarefaAtiva !== tarefaId) {
      pausarTarefa();
    }
    
    setTarefaAtiva(tarefaId);
    setCronometroAtivo(true);
    setTempoSessaoAtual(0);
    setAnotacaoSessao('');
    sessaoInicioRef.current = Date.now();
    
         // Atualizar status da tarefa para em_progresso
     setProjeto((projetoAtual: Projeto) => ({
       ...projetoAtual,
       etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
         ...etapa,
         tarefas: etapa.tarefas.map((tarefa: Tarefa) => {
           if (tarefa.id === tarefaId) {
             return {
               ...tarefa,
               status: 'em_progresso' as const,
               cronometro_ativo: true,
               data_inicio: tarefa.data_inicio || new Date().toISOString(),
               anotacao_sessao_atual: ''
             };
           }
           // Pausar outras tarefas
           return { ...tarefa, cronometro_ativo: false };
         })
       }))
     }));
    
    console.log(`✅ Tarefa ${tarefaId} iniciada com sucesso`);
  }, [tarefaAtiva, setProjeto]);

  const pausarTarefa = useCallback(() => {
    if (!tarefaAtiva) return;
    
    console.log(`⏸️ Pausando tarefa: ${tarefaAtiva}`);
    
    setCronometroAtivo(false);
    
    // Salvar sessão atual no histórico
    if (tempoSessaoAtual > 0) {
      const novaSessao: SessaoCronometro = {
        id: `sessao_${Date.now()}`,
        tarefaId: tarefaAtiva,
        numero: numeroSessoes,
        inicio: new Date(sessaoInicioRef.current),
        fim: new Date(),
        duracao: tempoSessaoAtual,
        anotacao: anotacaoSessao
      };
      
      setSessoesAnteriores(prev => [...prev, novaSessao]);
      setNumeroSessoes(prev => prev + 1);
    }
    
         // Atualizar projeto
     setProjeto((projetoAtual: Projeto) => ({
       ...projetoAtual,
       etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
         ...etapa,
         tarefas: etapa.tarefas.map((tarefa: Tarefa) =>
           tarefa.id === tarefaAtiva
             ? { 
                 ...tarefa, 
                 cronometro_ativo: false,
                 tempo_sessao_atual: 0,
                 anotacao_sessao_atual: anotacaoSessao
               }
             : tarefa
         )
       }))
     }));
    
    console.log(`✅ Tarefa pausada com sucesso`);
  }, [tarefaAtiva, tempoSessaoAtual, anotacaoSessao, numeroSessoes, setProjeto]);

  const retomarTarefa = useCallback((tarefaId: string) => {
    console.log(`▶️ Retomando tarefa: ${tarefaId}`);
    
    setTarefaAtiva(tarefaId);
    setCronometroAtivo(true);
    setTempoSessaoAtual(0); // Nova sessão
    sessaoInicioRef.current = Date.now();
    
         setProjeto((projetoAtual: Projeto) => ({
       ...projetoAtual,
       etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
         ...etapa,
         tarefas: etapa.tarefas.map((tarefa: Tarefa) => {
           if (tarefa.id === tarefaId) {
             return {
               ...tarefa,
               cronometro_ativo: true,
               status: 'em_progresso' as const
             };
           }
           return { ...tarefa, cronometro_ativo: false };
         })
       }))
     }));
    
    console.log(`✅ Tarefa retomada com sucesso`);
  }, [setProjeto]);

  const salvarNota = useCallback(() => {
    if (!tarefaAtiva || !anotacaoSessao.trim()) return;
    
    console.log(`💾 Salvando nota para tarefa: ${tarefaAtiva}`);
    
    const novaAnotacao: AnotacaoSalva = {
      id: `anotacao_${Date.now()}`,
      tarefaId: tarefaAtiva,
      sessao: numeroSessoes,
      texto: anotacaoSessao,
      timestamp: new Date().toISOString(),
      tempo: tempoSessaoAtual
    };
    
    setAnotacoesSalvas(prev => [...prev, novaAnotacao]);
    
         // Atualizar anotação no projeto
     setProjeto((projetoAtual: Projeto) => ({
       ...projetoAtual,
       etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
         ...etapa,
         tarefas: etapa.tarefas.map((tarefa: Tarefa) =>
           tarefa.id === tarefaAtiva
             ? { 
                 ...tarefa, 
                 anotacao_sessao_atual: anotacaoSessao,
                 notas_sessoes: [...tarefa.notas_sessoes, novaAnotacao]
               }
             : tarefa
         )
       }))
     }));
    
    console.log(`✅ Nota salva: "${anotacaoSessao.substring(0, 50)}..."`);
  }, [tarefaAtiva, anotacaoSessao, numeroSessoes, tempoSessaoAtual, setProjeto]);

  const concluirTarefa = useCallback((tarefaId: string) => {
    console.log(`🎉 Concluindo tarefa: ${tarefaId}`);
    
    // Pausar cronômetro se estiver ativo
    if (cronometroAtivo && tarefaAtiva === tarefaId) {
      pausarTarefa();
    }
    
         setProjeto((projetoAtual: Projeto) => ({
       ...projetoAtual,
       etapas: projetoAtual.etapas.map((etapa: Etapa) => ({
         ...etapa,
         tarefas: etapa.tarefas.map((tarefa: Tarefa) =>
           tarefa.id === tarefaId
             ? { 
                 ...tarefa, 
                 status: 'concluida' as const,
                 cronometro_ativo: false,
                 data_conclusao: new Date().toISOString()
               }
             : tarefa
         )
       }))
     }));
    
    // Limpar tarefa ativa se for a que foi concluída
    if (tarefaAtiva === tarefaId) {
      setTarefaAtiva(null);
      setCronometroAtivo(false);
      setTempoSessaoAtual(0);
      setAnotacaoSessao('');
    }
    
    console.log(`✅ Tarefa ${tarefaId} concluída com sucesso`);
  }, [cronometroAtivo, tarefaAtiva, pausarTarefa, setProjeto]);

  // ===== FUNÇÕES DE CÁLCULO =====
  
  const calcularTempoTarefaAtualRealTime = useCallback(() => {
    if (!tarefaAtiva) return 0;
    
    const tarefa = projeto.etapas
      .flatMap(e => e.tarefas)
      .find(t => t.id === tarefaAtiva);
    
    if (!tarefa) return 0;
    
    return cronometroAtivo ? tarefa.tempo_total + tempoSessaoAtual : tarefa.tempo_total;
  }, [projeto, tarefaAtiva, cronometroAtivo, tempoSessaoAtual]);

  const calcularTempoTotalRealTime = useCallback(() => {
    const tempoBase = projeto.etapas
      .flatMap(e => e.tarefas)
      .reduce((total, tarefa) => total + tarefa.tempo_total, 0);
    
    return cronometroAtivo ? tempoBase + tempoSessaoAtual : tempoBase;
  }, [projeto, cronometroAtivo, tempoSessaoAtual]);

  // ===== FUNÇÕES DE BUSCA =====
  
  const obterTarefaAtiva = useCallback(() => {
    if (!tarefaAtiva) return null;
    
    return projeto.etapas
      .flatMap(e => e.tarefas)
      .find(t => t.id === tarefaAtiva) || null;
  }, [projeto, tarefaAtiva]);

  const obterAnotacoesTarefa = useCallback((tarefaId: string) => {
    return anotacoesSalvas.filter(a => a.tarefaId === tarefaId);
  }, [anotacoesSalvas]);

  const obterSessoesTarefa = useCallback((tarefaId: string) => {
    return sessoesAnteriores.filter(s => s.tarefaId === tarefaId);
  }, [sessoesAnteriores]);

  // ===== FORMATADORES =====
  
  const formatarTempo = useCallback((segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  }, []);

  const formatarTempoSimples = useCallback((segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }, []);

  return {
    // Estados principais
    tarefaAtiva,
    cronometroAtivo,
    tempoSessaoAtual,
    anotacaoSessao,
    numeroSessoes,
    sessoesAnteriores,
    anotacoesSalvas,
    
    // Setters
    setTarefaAtiva,
    setAnotacaoSessao,
    
    // Funções principais
    iniciarTarefa,
    pausarTarefa,
    retomarTarefa,
    salvarNota,
    concluirTarefa,
    
    // Funções de cálculo
    calcularTempoTarefaAtualRealTime,
    calcularTempoTotalRealTime,
    
    // Funções de busca
    obterTarefaAtiva,
    obterAnotacoesTarefa,
    obterSessoesTarefa,
    
    // Formatadores
    formatarTempo,
    formatarTempoSimples
  };
}; 