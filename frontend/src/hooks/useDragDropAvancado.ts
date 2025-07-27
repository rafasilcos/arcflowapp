import { useState, useCallback, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { ValidacaoInteligenteService } from '@/services/validacaoInteligente';
import { OperacaoCrud } from '@/types/validacao';

interface DragState {
  isDragging: boolean;
  draggedItem: any;
  draggedType: 'etapa' | 'tarefa';
  dropZone: string | null;
  dragOverlay: {
    x: number;
    y: number;
    visible: boolean;
  };
}

interface DropZone {
  id: string;
  type: 'etapa' | 'tarefa';
  accepts: string[];
  onDrop: (item: any) => void;
  validation?: boolean;
}

export function useDragDropAvancado() {
  const { state } = useDashboard();
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    draggedType: 'tarefa',
    dropZone: null,
    dragOverlay: { x: 0, y: 0, visible: false }
  });

  const dragRef = useRef<HTMLElement | null>(null);
  const dropZones = useRef<Map<string, DropZone>>(new Map());

  // Registrar zona de drop
  const registerDropZone = useCallback((dropZone: DropZone) => {
    dropZones.current.set(dropZone.id, dropZone);
    
    return () => {
      dropZones.current.delete(dropZone.id);
    };
  }, []);

  // Utilitários
  const getEtapaByTarefaId = (tarefaId: string) => {
    for (const etapa of state.projeto.etapas) {
      if (etapa.tarefas.some(t => t.id === tarefaId)) {
        return etapa;
      }
    }
    return null;
  };

  const createDragImage = (item: any, type: 'etapa' | 'tarefa') => {
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.background = 'white';
    dragImage.style.border = '2px solid #3b82f6';
    dragImage.style.borderRadius = '8px';
    dragImage.style.padding = '12px';
    dragImage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    dragImage.style.maxWidth = '300px';
    dragImage.style.zIndex = '9999';
    
    const icon = type === 'etapa' ? '📁' : '📋';
    dragImage.innerHTML = `
      <div style="display: flex; align-items: center; font-family: system-ui;">
        <span style="font-size: 20px; margin-right: 8px;">${icon}</span>
        <div>
          <div style="font-weight: 600; color: #1f2937; font-size: 14px;">
            ${item.nome}
          </div>
          <div style="color: #6b7280; font-size: 12px;">
            ${type === 'etapa' ? `${item.tarefas?.length || 0} tarefas` : item.responsavel || 'Sem responsável'}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(dragImage);
    return dragImage;
  };

  // Iniciar drag
  const startDrag = useCallback((item: any, type: 'etapa' | 'tarefa', event: React.DragEvent) => {
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: item,
      draggedType: type,
      dragOverlay: { x: event.clientX, y: event.clientY, visible: true }
    }));

    // Configurar dados do drag
    event.dataTransfer.setData('application/json', JSON.stringify({ item, type }));
    event.dataTransfer.effectAllowed = 'move';

    // Criar imagem personalizada para o drag
    const dragImage = createDragImage(item, type);
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    // Cleanup da imagem após um tempo
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }, []);

  // Drag over
  const handleDragOver = useCallback((event: React.DragEvent, dropZoneId: string) => {
    event.preventDefault();
    
    const dropZone = dropZones.current.get(dropZoneId);
    if (!dropZone || !dragState.draggedItem) return;

    // Verificar se o drop é permitido
    const canDrop = dropZone.accepts.includes(dragState.draggedType);
    
    if (canDrop) {
      event.dataTransfer.dropEffect = 'move';
      setDragState(prev => ({
        ...prev,
        dropZone: dropZoneId,
        dragOverlay: { x: event.clientX, y: event.clientY, visible: true }
      }));
    } else {
      event.dataTransfer.dropEffect = 'none';
    }
  }, [dragState.draggedItem, dragState.draggedType]);

  // Drag enter
  const handleDragEnter = useCallback((event: React.DragEvent, dropZoneId: string) => {
    event.preventDefault();
    setDragState(prev => ({ ...prev, dropZone: dropZoneId }));
  }, []);

  // Drag leave
  const handleDragLeave = useCallback((event: React.DragEvent, dropZoneId: string) => {
    // Verificar se realmente saiu da zona (não apenas mudou de elemento filho)
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragState(prev => ({
        ...prev,
        dropZone: prev.dropZone === dropZoneId ? null : prev.dropZone
      }));
    }
  }, []);

  // Drop
  const handleDrop = useCallback(async (event: React.DragEvent, dropZoneId: string) => {
    event.preventDefault();
    
    const dropZone = dropZones.current.get(dropZoneId);
    if (!dropZone || !dragState.draggedItem) return;

    try {
      // Validação inteligente se habilitada
      if (dropZone.validation && dragState.draggedType === 'tarefa') {
        const operacao: OperacaoCrud = {
          tipo: 'mover',
          entidade: 'tarefa',
          id: dragState.draggedItem.id,
          contexto: {
            etapa_origem: getEtapaByTarefaId(dragState.draggedItem.id)?.id,
            etapa_destino: dropZoneId,
          }
        };

        const resultado = await ValidacaoInteligenteService.validarOperacao(operacao, state.projeto);
        
        if (!resultado.pode_prosseguir) {
          // Mostrar modal de validação
          console.warn('Drop bloqueado pela validação:', resultado.validacoes);
          return;
        }
        
        if (resultado.requer_confirmacao) {
          // Mostrar modal de confirmação
          console.log('Drop requer confirmação:', resultado.validacoes);
        }
      }

      // Executar drop
      dropZone.onDrop(dragState.draggedItem);
      
    } catch (error) {
      console.error('Erro no drop:', error);
    } finally {
      // Reset drag state
      setDragState({
        isDragging: false,
        draggedItem: null,
        draggedType: 'tarefa',
        dropZone: null,
        dragOverlay: { x: 0, y: 0, visible: false }
      });
    }
  }, [dragState.draggedItem, dragState.draggedType, state.projeto]);

  // Finalizar drag
  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      draggedType: 'tarefa',
      dropZone: null,
      dragOverlay: { x: 0, y: 0, visible: false }
    });
  }, []);

  // Props para elementos draggable
  const getDraggableProps = (item: any, type: 'etapa' | 'tarefa') => ({
    draggable: true,
    onDragStart: (event: React.DragEvent) => startDrag(item, type, event),
    onDragEnd: endDrag,
    style: {
      cursor: dragState.isDragging ? 'grabbing' : 'grab',
      opacity: dragState.isDragging && dragState.draggedItem?.id === item.id ? 0.5 : 1,
      transform: dragState.isDragging && dragState.draggedItem?.id === item.id ? 'scale(0.95)' : 'scale(1)',
      transition: 'all 0.2s ease'
    }
  });

  // Props para zonas de drop
  const getDropZoneProps = (dropZoneId: string) => ({
    onDragOver: (event: React.DragEvent) => handleDragOver(event, dropZoneId),
    onDragEnter: (event: React.DragEvent) => handleDragEnter(event, dropZoneId),
    onDragLeave: (event: React.DragEvent) => handleDragLeave(event, dropZoneId),
    onDrop: (event: React.DragEvent) => handleDrop(event, dropZoneId),
    style: {
      backgroundColor: dragState.dropZone === dropZoneId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      borderColor: dragState.dropZone === dropZoneId ? '#3b82f6' : 'transparent',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    }
  });

  // Verificar se um item pode ser dropado em uma zona
  const canDropInZone = (dropZoneId: string, itemType: 'etapa' | 'tarefa') => {
    const dropZone = dropZones.current.get(dropZoneId);
    return dropZone ? dropZone.accepts.includes(itemType) : false;
  };

  return {
    dragState,
    registerDropZone,
    getDraggableProps,
    getDropZoneProps,
    canDropInZone
  };
} 