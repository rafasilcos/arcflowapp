// ===== INTERFACES PARA OPERAÇÕES CRUD =====
// Sistema completo de Create, Read, Update, Delete

import { Tarefa, Etapa, Projeto } from './dashboard-core';

export interface OperacoesCrud {
  // ETAPAS
  criarEtapa: (dadosEtapa: Partial<Etapa>) => Promise<void>;
  editarEtapa: (etapaId: string, dadosAtualizados: Partial<Etapa>) => Promise<void>;
  duplicarEtapa: (etapaId: string) => Promise<void>;
  excluirEtapa: (etapaId: string) => Promise<void>;
  reordenarEtapa: (etapaId: string, novaPosicao: number) => Promise<void>;
  
  // TAREFAS
  criarTarefa: (etapaId: string, dadosTarefa: Partial<Tarefa>) => Promise<void>;
  editarTarefa: (tarefaId: string, dadosAtualizados: Partial<Tarefa>) => Promise<void>;
  duplicarTarefa: (tarefaId: string) => Promise<void>;
  excluirTarefa: (tarefaId: string) => Promise<void>;
  moverTarefa: (tarefaId: string, etapaOrigemId: string, etapaDestinoId: string, novaPosicao?: number) => Promise<void>;
  
  // PROJETO
  editarProjeto: (dadosAtualizados: Partial<Projeto>) => Promise<void>;
}

export interface DragDropContext {
  draggedItem: {
    type: 'etapa' | 'tarefa';
    id: string;
  } | null;
  setDraggedItem: (item: { type: 'etapa' | 'tarefa'; id: string } | null) => void;
  handleDragStart: (type: 'etapa' | 'tarefa', id: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetId: string, targetType: 'etapa' | 'tarefa') => void;
}

export interface UploadArquivo {
  arquivo: File;
  progresso: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
} 