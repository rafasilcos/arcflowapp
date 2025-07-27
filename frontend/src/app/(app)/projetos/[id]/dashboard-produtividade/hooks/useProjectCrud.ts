import { useState, useCallback } from 'react';
import { Etapa, Tarefa, HistoricoItem } from '../data/projectTemplates';
import { useCrudNotifications } from '../components/NotificationSystem';
import { useCrudPermissions } from '../components/PermissionSystem';

// ===== INTERFACE PARA DADOS DE NOVA ETAPA =====
export interface NovaEtapaData {
  nome: string;
  icone: string;
  cor_tema: string;
  progresso: number;
}

// ===== INTERFACE PARA DADOS DE NOVA TAREFA =====
export interface NovaTarefaData {
  nome: string;
  descricao: string;
  responsavel: string;
  disciplina: string;
  tempoEstimado: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataVencimento: string;
  template_notas?: string;
  checklist?: string[];
  etapaId: number;
}

// ===== HOOK PRINCIPAL PARA CRUD =====
export function useProjectCrud(
  etapas: Etapa[],
  updateEtapas: (etapas: Etapa[]) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notifications = useCrudNotifications();
  const permissions = useCrudPermissions();

  // ===== UTILITÁRIOS =====
  const generateId = useCallback(() => {
    return Date.now() + Math.random();
  }, []);

  const generateTarefaId = useCallback(() => {
    const allTarefas = etapas.flatMap(etapa => etapa.tarefas);
    return allTarefas.length > 0 ? Math.max(...allTarefas.map(t => t.id)) + 1 : 1;
  }, [etapas]);

  const addHistoricoItem = useCallback((tarefaId: number, item: Omit<HistoricoItem, 'id'>) => {
    const novasEtapas = etapas.map(etapa => ({
      ...etapa,
      tarefas: etapa.tarefas.map(tarefa => {
        if (tarefa.id === tarefaId) {
          return {
            ...tarefa,
            historico: [
              { ...item, id: Date.now() },
              ...tarefa.historico
            ]
          };
        }
        return tarefa;
      })
    }));
    updateEtapas(novasEtapas);
  }, [etapas, updateEtapas]);

  // ===== CRUD DE ETAPAS =====
  
  const createEtapa = useCallback(async (dados: NovaEtapaData, posicao?: number) => {
    if (!permissions.canCreateEtapa()) {
      notifications.erroGenerico('criar etapa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novaEtapa: Etapa = {
        id: generateId(),
        nome: dados.nome,
        status: 'nao_iniciada',
        progresso: dados.progresso,
        cor_tema: dados.cor_tema,
        icone: dados.icone,
        tarefas: []
      };

      const novasEtapas = [...etapas];
      if (posicao !== undefined && posicao >= 0 && posicao <= etapas.length) {
        novasEtapas.splice(posicao, 0, novaEtapa);
      } else {
        novasEtapas.push(novaEtapa);
      }

      updateEtapas(novasEtapas);
      console.log(`✅ Etapa criada: ${dados.nome}`);
      notifications.etapaCriada(dados.nome);
      return novaEtapa;
    } catch (err) {
      setError('Erro ao criar etapa');
      console.error('Erro ao criar etapa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, generateId, permissions, notifications]);

  const updateEtapa = useCallback(async (etapaId: number, updates: Partial<Etapa>) => {
    if (!permissions.canEditEtapa()) {
      notifications.erroGenerico('editar etapa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novasEtapas = etapas.map(etapa => 
        etapa.id === etapaId ? { ...etapa, ...updates } : etapa
      );

      updateEtapas(novasEtapas);
      console.log(`✅ Etapa atualizada: ${etapaId}`);
      notifications.etapaEditada(etapas.find(e => e.id === etapaId)?.nome || '');
    } catch (err) {
      setError('Erro ao atualizar etapa');
      console.error('Erro ao atualizar etapa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, permissions, notifications]);

  const deleteEtapa = useCallback(async (etapaId: number) => {
    if (!permissions.canDeleteEtapa()) {
      notifications.erroGenerico('deletar etapa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const etapa = etapas.find(e => e.id === etapaId);
      if (!etapa) {
        throw new Error('Etapa não encontrada');
      }

      if (etapa.tarefas.length > 0) {
        throw new Error('Não é possível deletar etapa com tarefas. Remova as tarefas primeiro.');
      }

      const novasEtapas = etapas.filter(e => e.id !== etapaId);
      updateEtapas(novasEtapas);
      console.log(`🗑️ Etapa deletada: ${etapa.nome}`);
      notifications.etapaDeletada(etapa.nome);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar etapa');
      console.error('Erro ao deletar etapa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, permissions, notifications]);

  const reorderEtapas = useCallback(async (newOrder: number[]) => {
    if (!permissions.canReorderEtapas()) {
      notifications.erroGenerico('reordenar etapas', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novasEtapas = newOrder.map(id => etapas.find(e => e.id === id)!).filter(Boolean);
      updateEtapas(novasEtapas);
      console.log('🔄 Etapas reordenadas');
      notifications.etapaReordenada();
    } catch (err) {
      setError('Erro ao reordenar etapas');
      console.error('Erro ao reordenar etapas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, permissions, notifications]);

  const duplicateEtapa = useCallback(async (etapaId: number) => {
    if (!permissions.canDuplicateEtapa()) {
      notifications.erroGenerico('duplicar etapa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const etapaOriginal = etapas.find(e => e.id === etapaId);
      if (!etapaOriginal) {
        throw new Error('Etapa não encontrada');
      }

      const novaEtapa: Etapa = {
        ...etapaOriginal,
        id: generateId(),
        nome: `${etapaOriginal.nome} (Cópia)`,
        status: 'nao_iniciada',
        progresso: 0,
        tarefas: etapaOriginal.tarefas.map(tarefa => ({
          ...tarefa,
          id: generateTarefaId(),
          status: 'pendente' as const,
          progresso: 0,
          tempoGasto: '0h',
          historico: []
        }))
      };

      const novasEtapas = [...etapas, novaEtapa];
      updateEtapas(novasEtapas);
      console.log(`📋 Etapa duplicada: ${etapaOriginal.nome}`);
      notifications.etapaDuplicada(etapaOriginal.nome);
      return novaEtapa;
    } catch (err) {
      setError('Erro ao duplicar etapa');
      console.error('Erro ao duplicar etapa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, generateId, generateTarefaId, permissions, notifications]);

  // ===== CRUD DE TAREFAS =====

  const createTarefa = useCallback(async (dados: NovaTarefaData) => {
    if (!permissions.canCreateTarefa()) {
      notifications.erroGenerico('criar tarefa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novaTarefa: Tarefa = {
        id: generateTarefaId(),
        nome: dados.nome,
        descricao: dados.descricao,
        status: 'pendente',
        prioridade: dados.prioridade,
        responsavel: dados.responsavel,
        disciplina: dados.disciplina,
        tempoEstimado: dados.tempoEstimado,
        tempoGasto: '0h',
        progresso: 0,
        dataVencimento: dados.dataVencimento,
        template_notas: dados.template_notas,
        checklist: dados.checklist || [],
        historico: []
      };

      const novasEtapas = etapas.map(etapa => {
        if (etapa.id === dados.etapaId) {
          return {
            ...etapa,
            tarefas: [...etapa.tarefas, novaTarefa]
          };
        }
        return etapa;
      });

      updateEtapas(novasEtapas);
      console.log(`✅ Tarefa criada: ${dados.nome}`);
      notifications.tarefaCriada(dados.nome);
      return novaTarefa;
    } catch (err) {
      setError('Erro ao criar tarefa');
      console.error('Erro ao criar tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, generateTarefaId, permissions, notifications]);

  const updateTarefa = useCallback(async (tarefaId: number, updates: Partial<Tarefa>) => {
    if (!permissions.canEditTarefa()) {
      notifications.erroGenerico('editar tarefa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novasEtapas = etapas.map(etapa => ({
        ...etapa,
        tarefas: etapa.tarefas.map(tarefa => {
          if (tarefa.id === tarefaId) {
            return { ...tarefa, ...updates };
          }
          return tarefa;
        })
      }));

      updateEtapas(novasEtapas);
      console.log(`✅ Tarefa atualizada: ${tarefaId}`);
      
      // Encontrar nome da tarefa para notificação
      const tarefaAtualizada = etapas
        .find(e => e.tarefas.some(t => t.id === tarefaId))
        ?.tarefas.find(t => t.id === tarefaId);
      
      notifications.tarefaEditada(tarefaAtualizada?.nome || '');
    } catch (err) {
      setError('Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, addHistoricoItem, permissions, notifications]);

  const deleteTarefa = useCallback(async (tarefaId: number) => {
    if (!permissions.canDeleteTarefa()) {
      notifications.erroGenerico('deletar tarefa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let tarefaDeletada: Tarefa | null = null;

      const novasEtapas = etapas.map(etapa => {
        const tarefaIndex = etapa.tarefas.findIndex(t => t.id === tarefaId);
        if (tarefaIndex !== -1) {
          tarefaDeletada = etapa.tarefas[tarefaIndex];
          return {
            ...etapa,
            tarefas: etapa.tarefas.filter(t => t.id !== tarefaId)
          };
        }
        return etapa;
      });

      updateEtapas(novasEtapas);
      console.log('🗑️ Tarefa deletada com sucesso');
      notifications.tarefaDeletada(tarefaDeletada?.nome || '');
    } catch (err) {
      setError('Erro ao deletar tarefa');
      console.error('Erro ao deletar tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, permissions, notifications]);

  const moveTarefa = useCallback(async (tarefaId: number, novaEtapaId: number, posicao?: number) => {
    if (!permissions.canMoveTarefa()) {
      notifications.erroGenerico('mover tarefa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let tarefaMovida: Tarefa | null = null;
      let etapaDestino: Etapa | null = null;

      // Encontrar e remover tarefa da etapa atual
      const etapasSemTarefa = etapas.map(etapa => {
        const tarefaIndex = etapa.tarefas.findIndex(t => t.id === tarefaId);
        if (tarefaIndex !== -1) {
          tarefaMovida = etapa.tarefas[tarefaIndex];
          return {
            ...etapa,
            tarefas: etapa.tarefas.filter(t => t.id !== tarefaId)
          };
        }
        return etapa;
      });

      // Adicionar tarefa na nova etapa
      const novasEtapas = etapasSemTarefa.map(etapa => {
        if (etapa.id === novaEtapaId && tarefaMovida) {
          etapaDestino = etapa;
          const novasTarefas = [...etapa.tarefas];
          if (posicao !== undefined && posicao >= 0 && posicao <= etapa.tarefas.length) {
            novasTarefas.splice(posicao, 0, tarefaMovida);
          } else {
            novasTarefas.push(tarefaMovida);
          }
          return { ...etapa, tarefas: novasTarefas };
        }
        return etapa;
      });

      updateEtapas(novasEtapas);
      
      // Adicionar histórico
      if (tarefaMovida) {
        addHistoricoItem(tarefaId, {
          tipo: 'nota',
          descricao: `Tarefa movida para etapa "${etapaDestino?.nome}"`,
          timestamp: new Date().toISOString(),
          usuario: 'Usuário Atual'
        });
      }
      
      console.log('🔄 Tarefa movida com sucesso');
      if (tarefaMovida && etapaDestino) {
        notifications.tarefaMovida(tarefaMovida.nome, etapaDestino.nome);
      }
    } catch (err) {
      setError('Erro ao mover tarefa');
      console.error('Erro ao mover tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, addHistoricoItem, permissions, notifications]);

  const duplicateTarefa = useCallback(async (tarefaId: number) => {
    if (!permissions.canDuplicateTarefa()) {
      notifications.erroGenerico('duplicar tarefa', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let tarefaOriginal: Tarefa | null = null;
      let etapaOriginal: Etapa | null = null;

      // Encontrar tarefa original
      for (const etapa of etapas) {
        const tarefa = etapa.tarefas.find(t => t.id === tarefaId);
        if (tarefa) {
          tarefaOriginal = tarefa;
          etapaOriginal = etapa;
          break;
        }
      }

      if (!tarefaOriginal || !etapaOriginal) {
        throw new Error('Tarefa não encontrada');
      }

      const novaTarefa: Tarefa = {
        ...tarefaOriginal,
        id: generateTarefaId(),
        nome: `${tarefaOriginal.nome} (Cópia)`,
        status: 'pendente',
        progresso: 0,
        tempoGasto: '0h',
        historico: []
      };

      const novasEtapas = etapas.map(etapa => {
        if (etapa.id === etapaOriginal!.id) {
          return {
            ...etapa,
            tarefas: [...etapa.tarefas, novaTarefa]
          };
        }
        return etapa;
      });

      updateEtapas(novasEtapas);
      console.log('📋 Tarefa duplicada com sucesso');
      notifications.tarefaDuplicada(tarefaOriginal.nome);
      return novaTarefa;
    } catch (err) {
      setError('Erro ao duplicar tarefa');
      console.error('Erro ao duplicar tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, generateTarefaId, permissions, notifications]);

  const reorderTarefas = useCallback(async (etapaId: number, newOrder: number[]) => {
    if (!permissions.canReorderTarefas()) {
      notifications.erroGenerico('reordenar tarefas', 'Permissão negada');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const novasEtapas = etapas.map(etapa => {
        if (etapa.id === etapaId) {
          const novasTarefas = newOrder.map(id => etapa.tarefas.find(t => t.id === id)!).filter(Boolean);
          return { ...etapa, tarefas: novasTarefas };
        }
        return etapa;
      });

      updateEtapas(novasEtapas);
      console.log('🔄 Tarefas reordenadas');
      notifications.tarefaReordenada();
    } catch (err) {
      setError('Erro ao reordenar tarefas');
      console.error('Erro ao reordenar tarefas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [etapas, updateEtapas, permissions, notifications]);

  // ===== FUNÇÕES AUXILIARES =====

  const getTarefaById = useCallback((tarefaId: number): Tarefa | null => {
    for (const etapa of etapas) {
      const tarefa = etapa.tarefas.find(t => t.id === tarefaId);
      if (tarefa) return tarefa;
    }
    return null;
  }, [etapas]);

  const getEtapaById = useCallback((etapaId: number): Etapa | null => {
    return etapas.find(e => e.id === etapaId) || null;
  }, [etapas]);

  const getEtapaByTarefaId = useCallback((tarefaId: number): Etapa | null => {
    return etapas.find(e => e.tarefas.some(t => t.id === tarefaId)) || null;
  }, [etapas]);

  // ===== DRAG & DROP HANDLERS =====
  const handleReorderEtapas = useCallback((newOrder: number[]) => {
    reorderEtapas(newOrder);
  }, [reorderEtapas]);

  const handleReorderTarefas = useCallback((etapaId: number, newOrder: number[]) => {
    reorderTarefas(etapaId, newOrder);
  }, [reorderTarefas]);

  const handleMoveTarefa = useCallback((tarefaId: number, sourceEtapaId: number, destEtapaId: number, destIndex: number) => {
    moveTarefa(tarefaId, destEtapaId, destIndex);
  }, [moveTarefa]);

  return {
    // Estado
    isLoading,
    error,
    
    // CRUD Etapas
    createEtapa,
    updateEtapa,
    deleteEtapa,
    reorderEtapas,
    duplicateEtapa,
    
    // CRUD Tarefas
    createTarefa,
    updateTarefa,
    deleteTarefa,
    moveTarefa,
    duplicateTarefa,
    reorderTarefas,
    
    // Auxiliares
    getTarefaById,
    getEtapaById,
    getEtapaByTarefaId,
    addHistoricoItem,

    // Drag & Drop handlers
    handleReorderEtapas,
    handleReorderTarefas,
    handleMoveTarefa,

    // Permission checks
    permissions,
  };
} 