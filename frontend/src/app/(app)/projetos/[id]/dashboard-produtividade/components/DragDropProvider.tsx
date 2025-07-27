'use client';

import React, { ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Etapa, Tarefa } from '../data/projectTemplates';

interface DragDropProviderProps {
  children: ReactNode;
  etapas: Etapa[];
  onReorderEtapas: (newOrder: number[]) => void;
  onReorderTarefas: (etapaId: number, newOrder: number[]) => void;
  onMoveTarefa: (tarefaId: number, sourceEtapaId: number, destEtapaId: number, destIndex: number) => void;
}

export function DragDropProvider({
  children,
  etapas,
  onReorderEtapas,
  onReorderTarefas,
  onMoveTarefa
}: DragDropProviderProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeItem, setActiveItem] = React.useState<{ type: 'etapa' | 'tarefa'; item: Etapa | Tarefa } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Determinar o tipo e item sendo arrastado
    const id = active.id as string;
    if (id.startsWith('etapa-')) {
      const etapaId = parseInt(id.replace('etapa-', ''));
      const etapa = etapas.find(e => e.id === etapaId);
      if (etapa) {
        setActiveItem({ type: 'etapa', item: etapa });
      }
    } else if (id.startsWith('tarefa-')) {
      const tarefaId = parseInt(id.replace('tarefa-', ''));
      let tarefa: Tarefa | undefined;
      for (const etapa of etapas) {
        tarefa = etapa.tarefas.find(t => t.id === tarefaId);
        if (tarefa) break;
      }
      if (tarefa) {
        setActiveItem({ type: 'tarefa', item: tarefa });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // DRAG & DROP DE ETAPAS
    if (activeId.startsWith('etapa-') && overId.startsWith('etapa-')) {
      const activeEtapaId = parseInt(activeId.replace('etapa-', ''));
      const overEtapaId = parseInt(overId.replace('etapa-', ''));

      if (activeEtapaId !== overEtapaId) {
        const oldIndex = etapas.findIndex(e => e.id === activeEtapaId);
        const newIndex = etapas.findIndex(e => e.id === overEtapaId);
        
        const newOrder = arrayMove(etapas.map(e => e.id), oldIndex, newIndex);
        onReorderEtapas(newOrder);
      }
      return;
    }

    // DRAG & DROP DE TAREFAS
    if (activeId.startsWith('tarefa-')) {
      const tarefaId = parseInt(activeId.replace('tarefa-', ''));
      
      // Encontrar etapa de origem
      let sourceEtapaId: number | null = null;
      let sourceIndex = -1;
      for (const etapa of etapas) {
        const index = etapa.tarefas.findIndex(t => t.id === tarefaId);
        if (index !== -1) {
          sourceEtapaId = etapa.id;
          sourceIndex = index;
          break;
        }
      }

      if (sourceEtapaId === null) return;

      // Se foi solto em uma etapa (container)
      if (overId.startsWith('etapa-container-')) {
        const destEtapaId = parseInt(overId.replace('etapa-container-', ''));
        if (sourceEtapaId !== destEtapaId) {
          onMoveTarefa(tarefaId, sourceEtapaId, destEtapaId, 0);
        }
        return;
      }

      // Se foi solto em outra tarefa
      if (overId.startsWith('tarefa-')) {
        const overTarefaId = parseInt(overId.replace('tarefa-', ''));
        
        // Encontrar etapa de destino
        let destEtapaId: number | null = null;
        let destIndex = -1;
        for (const etapa of etapas) {
          const index = etapa.tarefas.findIndex(t => t.id === overTarefaId);
          if (index !== -1) {
            destEtapaId = etapa.id;
            destIndex = index;
            break;
          }
        }

        if (destEtapaId === null) return;

        // Se moveu para outra etapa
        if (sourceEtapaId !== destEtapaId) {
          onMoveTarefa(tarefaId, sourceEtapaId, destEtapaId, destIndex);
        } else {
          // Reordenação dentro da mesma etapa
          const etapa = etapas.find(e => e.id === sourceEtapaId);
          if (etapa) {
            const newOrder = arrayMove(etapa.tarefas.map(t => t.id), sourceIndex, destIndex);
            onReorderTarefas(sourceEtapaId, newOrder);
          }
        }
      }
    }
  };

  const etapaIds = etapas.map(e => `etapa-${e.id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={etapaIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      
      <DragOverlay>
        {activeItem && (
          <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
            {activeItem.type === 'etapa' ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{(activeItem.item as Etapa).icone}</span>
                <span className="font-semibold">{activeItem.item.nome}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{activeItem.item.nome}</span>
              </div>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// Componente para Etapa Draggable
interface DraggableEtapaProps {
  etapa: Etapa;
  children: ReactNode;
}

export function DraggableEtapa({ etapa, children }: DraggableEtapaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `etapa-${etapa.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      {/* Handle de drag para etapa */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-4 cursor-grab hover:cursor-grabbing z-10 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Arrastar etapa"
      >
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      {children}
    </div>
  );
}

// Componente para Tarefa Draggable
interface DraggableTarefaProps {
  tarefa: Tarefa;
  etapaId: number;
  children: ReactNode;
}

export function DraggableTarefa({ tarefa, etapaId, children }: DraggableTarefaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `tarefa-${tarefa.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      {/* Handle de drag para tarefa */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab hover:cursor-grabbing z-10 p-1 rounded hover:bg-gray-100 transition-colors"
        title="Arrastar tarefa"
      >
        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </div>
      {children}
    </div>
  );
}

// Componente para área de drop de tarefas
interface DroppableTarefasProps {
  etapaId: number;
  tarefas: Tarefa[];
  children: ReactNode;
}

export function DroppableTarefas({ etapaId, tarefas, children }: DroppableTarefasProps) {
  const tarefaIds = tarefas.map(t => `tarefa-${t.id}`);

  return (
    <SortableContext items={tarefaIds} strategy={verticalListSortingStrategy}>
      <div
        id={`etapa-container-${etapaId}`}
        className="space-y-3 min-h-[100px] p-2 rounded-lg border-2 border-dashed border-transparent hover:border-gray-300 transition-colors"
      >
        {children}
      </div>
    </SortableContext>
  );
} 