'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Etapa, Tarefa } from '../../data/projectTemplates';

// ===== INTERFACES =====
interface EtapaCrudButtonsProps {
  etapa: Etapa;
  onEdit: (etapa: Etapa) => void;
  onDelete: (etapaId: number) => void;
  onDuplicate: (etapaId: number) => void;
  onAddTarefa: (etapaId: number) => void;
  isLoading?: boolean;
}

interface TarefaCrudButtonsProps {
  tarefa: Tarefa;
  etapa: Etapa;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (tarefaId: number) => void;
  onDuplicate: (tarefaId: number) => void;
  onMove: (tarefaId: number, novaEtapaId: number) => void;
  etapasDisponiveis: Etapa[];
  isLoading?: boolean;
}

// ===== COMPONENTE PARA BOTÕES DE ETAPA =====
export function EtapaCrudButtons({
  etapa,
  onEdit,
  onDelete,
  onDuplicate,
  onAddTarefa,
  isLoading = false
}: EtapaCrudButtonsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (etapa.tarefas.length > 0) {
      alert('Não é possível deletar etapa com tarefas. Mova ou delete as tarefas primeiro.');
      return;
    }
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(etapa.id);
    setShowConfirmDelete(false);
  };

  return (
    <div className="flex items-center gap-1">
      {/* Adicionar Tarefa */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onAddTarefa(etapa.id)}
        disabled={isLoading}
        className="h-7 px-2 text-xs"
        title="Adicionar tarefa"
      >
        ➕
      </Button>

      {/* Editar Etapa */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(etapa)}
        disabled={isLoading}
        className="h-7 px-2 text-xs"
        title="Editar etapa"
      >
        ✏️
      </Button>

      {/* Duplicar Etapa */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDuplicate(etapa.id)}
        disabled={isLoading}
        className="h-7 px-2 text-xs"
        title="Duplicar etapa"
      >
        📋
      </Button>

      {/* Deletar Etapa */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isLoading}
        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
        title="Deletar etapa"
      >
        🗑️
      </Button>

      {/* Modal de Confirmação */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar a etapa "{etapa.nome}"?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== COMPONENTE PARA BOTÕES DE TAREFA =====
export function TarefaCrudButtons({
  tarefa,
  etapa,
  onEdit,
  onDelete,
  onDuplicate,
  onMove,
  etapasDisponiveis,
  isLoading = false
}: TarefaCrudButtonsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(tarefa.id);
    setShowConfirmDelete(false);
  };

  const handleMove = (novaEtapaId: number) => {
    onMove(tarefa.id, novaEtapaId);
    setShowMoveMenu(false);
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Editar Tarefa */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(tarefa)}
        disabled={isLoading}
        className="h-6 px-1.5 text-xs"
        title="Editar tarefa"
      >
        ✏️
      </Button>

      {/* Duplicar Tarefa */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDuplicate(tarefa.id)}
        disabled={isLoading}
        className="h-6 px-1.5 text-xs"
        title="Duplicar tarefa"
      >
        📋
      </Button>

      {/* Mover Tarefa */}
      <div className="relative">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowMoveMenu(!showMoveMenu)}
          disabled={isLoading}
          className="h-6 px-1.5 text-xs"
          title="Mover para outra etapa"
        >
          🔄
        </Button>

        {/* Menu de Etapas */}
        {showMoveMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-700">Mover para:</p>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {etapasDisponiveis
                .filter(e => e.id !== etapa.id)
                .map((etapaDestino) => (
                  <button
                    key={etapaDestino.id}
                    onClick={() => handleMove(etapaDestino.id)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2"
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: etapaDestino.cor_tema }}
                    ></span>
                    {etapaDestino.icone} {etapaDestino.nome}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Deletar Tarefa */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isLoading}
        className="h-6 px-1.5 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
        title="Deletar tarefa"
      >
        🗑️
      </Button>

      {/* Modal de Confirmação */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar a tarefa "{tarefa.nome}"?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar menu */}
      {showMoveMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMoveMenu(false)}
        />
      )}
    </div>
  );
} 