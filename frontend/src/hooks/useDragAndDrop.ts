'use client';

// ===== HOOK DRAG AND DROP ENTERPRISE =====
// Extraído da lógica da página original de 4277 linhas do Rafael

import { useState, useCallback } from 'react';
import { Projeto, DraggedItem } from '@/types/dashboard';

export const useDragAndDrop = (projeto: Projeto, setProjeto: (projeto: Projeto) => void) => {
  // Estado para drag and drop
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  // ===== FUNÇÕES DE DRAG AND DROP =====
  
  const handleDragStart = useCallback((type: 'etapa' | 'tarefa', id: string) => {
    setDraggedItem({ type, id });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent, 
    targetId: string, 
    targetType: 'etapa' | 'tarefa'
  ) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    // Reordenar etapas
    if (draggedItem.type === 'etapa' && targetType === 'etapa') {
      reordenarEtapas(draggedItem.id, targetId);
    }
    
    // Mover tarefa entre etapas
    if (draggedItem.type === 'tarefa' && targetType === 'etapa') {
      moverTarefaParaEtapa(draggedItem.id, targetId);
    }
    
    // Reordenar tarefas dentro da mesma etapa
    if (draggedItem.type === 'tarefa' && targetType === 'tarefa') {
      reordenarTarefas(draggedItem.id, targetId);
    }
    
    setDraggedItem(null);
  }, [draggedItem]);

  const reordenarEtapas = useCallback((etapaId: string, targetEtapaId: string) => {
    const etapas = [...projeto.etapas];
    const sourceIndex = etapas.findIndex(e => e.id === etapaId);
    const targetIndex = etapas.findIndex(e => e.id === targetEtapaId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Remover etapa da posição original
    const [etapaMovida] = etapas.splice(sourceIndex, 1);
    
    // Inserir na nova posição
    etapas.splice(targetIndex, 0, etapaMovida);
    
    // Atualizar numeração
    const etapasAtualizadas = etapas.map((etapa, index) => ({
      ...etapa,
      numero: index + 1
    }));
    
    const projetoAtualizado = {
      ...projeto,
      etapas: etapasAtualizadas
    };
    
    setProjeto(projetoAtualizado);
    
    console.log(`🔄 Etapas reordenadas: ${etapaId} -> posição ${targetIndex + 1}`);
  }, [projeto, setProjeto]);

  const moverTarefaParaEtapa = useCallback((tarefaId: string, etapaDestinoId: string) => {
    const etapaOrigemId = projeto.etapas.find(etapa => 
      etapa.tarefas.some(tarefa => tarefa.id === tarefaId)
    )?.id;
    
    if (!etapaOrigemId || etapaOrigemId === etapaDestinoId) return;
    
    const tarefaMovida = projeto.etapas
      .find(etapa => etapa.id === etapaOrigemId)
      ?.tarefas.find(tarefa => tarefa.id === tarefaId);
    
    if (!tarefaMovida) return;
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapa => {
        if (etapa.id === etapaOrigemId) {
          // Remover tarefa da etapa origem
          return {
            ...etapa,
            tarefas: etapa.tarefas.filter(tarefa => tarefa.id !== tarefaId)
          };
        }
        
        if (etapa.id === etapaDestinoId) {
          // Adicionar tarefa na etapa destino
          return {
            ...etapa,
            tarefas: [...etapa.tarefas, tarefaMovida]
          };
        }
        
        return etapa;
      })
    };
    
    setProjeto(projetoAtualizado);
    
    console.log(`🔄 Tarefa movida: ${tarefaId} -> etapa ${etapaDestinoId}`);
  }, [projeto, setProjeto]);

  const reordenarTarefas = useCallback((tarefaId: string, targetTarefaId: string) => {
    // Encontrar a etapa que contém ambas as tarefas
    const etapaComTarefas = projeto.etapas.find(etapa => 
      etapa.tarefas.some(t => t.id === tarefaId) && 
      etapa.tarefas.some(t => t.id === targetTarefaId)
    );
    
    if (!etapaComTarefas) return;
    
    const tarefas = [...etapaComTarefas.tarefas];
    const sourceIndex = tarefas.findIndex(t => t.id === tarefaId);
    const targetIndex = tarefas.findIndex(t => t.id === targetTarefaId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Remover tarefa da posição original
    const [tarefaMovida] = tarefas.splice(sourceIndex, 1);
    
    // Inserir na nova posição
    tarefas.splice(targetIndex, 0, tarefaMovida);
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapa => 
        etapa.id === etapaComTarefas.id 
          ? { ...etapa, tarefas }
          : etapa
      )
    };
    
    setProjeto(projetoAtualizado);
    
    console.log(`🔄 Tarefas reordenadas: ${tarefaId} -> posição ${targetIndex}`);
  }, [projeto, setProjeto]);

  const reordenarTarefaDentroEtapa = useCallback((
    tarefaId: string, 
    targetTarefaId: string, 
    etapaId: string
  ) => {
    const etapa = projeto.etapas.find(e => e.id === etapaId);
    if (!etapa) return;
    
    const tarefas = [...etapa.tarefas];
    const sourceIndex = tarefas.findIndex(t => t.id === tarefaId);
    const targetIndex = tarefas.findIndex(t => t.id === targetTarefaId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;
    
    // Remover tarefa da posição original
    const [tarefaMovida] = tarefas.splice(sourceIndex, 1);
    
    // Inserir na nova posição
    tarefas.splice(targetIndex, 0, tarefaMovida);
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapaAtual => 
        etapaAtual.id === etapaId 
          ? { ...etapaAtual, tarefas }
          : etapaAtual
      )
    };
    
    setProjeto(projetoAtualizado);
    
    console.log(`🔄 Tarefa reordenada dentro da etapa ${etapaId}: ${tarefaId} -> posição ${targetIndex}`);
  }, [projeto, setProjeto]);

  const moverTarefa = useCallback((
    tarefaId: string,
    etapaOrigemId: string,
    etapaDestinoId: string,
    novaPosicao?: number
  ) => {
    const tarefaMovida = projeto.etapas
      .find(etapa => etapa.id === etapaOrigemId)
      ?.tarefas.find(tarefa => tarefa.id === tarefaId);
    
    if (!tarefaMovida) return;
    
    const projetoAtualizado = {
      ...projeto,
      etapas: projeto.etapas.map(etapa => {
        if (etapa.id === etapaOrigemId) {
          // Remover tarefa da etapa origem
          return {
            ...etapa,
            tarefas: etapa.tarefas.filter(tarefa => tarefa.id !== tarefaId)
          };
        }
        
        if (etapa.id === etapaDestinoId) {
          // Adicionar tarefa na etapa destino
          const novasTarefas = [...etapa.tarefas];
          
          if (novaPosicao !== undefined && novaPosicao <= novasTarefas.length) {
            novasTarefas.splice(novaPosicao, 0, tarefaMovida);
          } else {
            novasTarefas.push(tarefaMovida);
          }
          
          return {
            ...etapa,
            tarefas: novasTarefas
          };
        }
        
        return etapa;
      })
    };
    
    setProjeto(projetoAtualizado);
    
    const posicaoTexto = novaPosicao !== undefined ? ` na posição ${novaPosicao}` : '';
    console.log(`🔄 Tarefa movida: ${tarefaId} -> etapa ${etapaDestinoId}${posicaoTexto}`);
  }, [projeto, setProjeto]);

  // ===== FUNÇÕES DE UTILIDADE =====
  
  const obterEtapaTarefa = useCallback((tarefaId: string) => {
    return projeto.etapas.find(etapa => 
      etapa.tarefas.some(tarefa => tarefa.id === tarefaId)
    );
  }, [projeto]);

  const obterTarefa = useCallback((tarefaId: string) => {
    return projeto.etapas
      .flatMap(etapa => etapa.tarefas)
      .find(tarefa => tarefa.id === tarefaId);
  }, [projeto]);

  const obterPosicaoTarefa = useCallback((tarefaId: string) => {
    for (const etapa of projeto.etapas) {
      const posicao = etapa.tarefas.findIndex(tarefa => tarefa.id === tarefaId);
      if (posicao !== -1) {
        return { etapaId: etapa.id, posicao };
      }
    }
    return null;
  }, [projeto]);

  const podeDropar = useCallback((
    draggedType: 'etapa' | 'tarefa',
    draggedId: string,
    targetType: 'etapa' | 'tarefa',
    targetId: string
  ) => {
    // Não pode dropar sobre si mesmo
    if (draggedId === targetId) return false;
    
    // Validações específicas por tipo
    if (draggedType === 'etapa' && targetType === 'etapa') {
      return true; // Sempre pode reordenar etapas
    }
    
    if (draggedType === 'tarefa' && targetType === 'etapa') {
      return true; // Sempre pode mover tarefa para etapa
    }
    
    if (draggedType === 'tarefa' && targetType === 'tarefa') {
      // Só pode dropar se as tarefas estão na mesma etapa
      const etapaDragged = obterEtapaTarefa(draggedId);
      const etapaTarget = obterEtapaTarefa(targetId);
      return etapaDragged?.id === etapaTarget?.id;
    }
    
    return false;
  }, [obterEtapaTarefa]);

  return {
    // Estados
    draggedItem,
    
    // Setters
    setDraggedItem,
    
    // Funções principais
    handleDragStart,
    handleDragOver,
    handleDrop,
    
    // Funções específicas
    reordenarEtapas,
    moverTarefaParaEtapa,
    reordenarTarefas,
    reordenarTarefaDentroEtapa,
    moverTarefa,
    
    // Funções de utilidade
    obterEtapaTarefa,
    obterTarefa,
    obterPosicaoTarefa,
    podeDropar
  };
}; 