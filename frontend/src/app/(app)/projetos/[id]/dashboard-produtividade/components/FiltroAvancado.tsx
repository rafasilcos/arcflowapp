'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Etapa, Tarefa } from '../data/projectTemplates';

export interface FiltrosAtivos {
  status: string[];
  prioridade: string[];
  responsavel: string[];
  disciplina: string[];
  etapa: string[];
  prazo: 'todos' | 'hoje' | 'amanha' | 'semana' | 'atrasadas';
  busca: string;
}

interface FiltroAvancadoProps {
  etapas: Etapa[];
  filtros: FiltrosAtivos;
  onFiltrosChange: (filtros: FiltrosAtivos) => void;
  totalTarefas: number;
  tarefasFiltradas: number;
}

export function FiltroAvancado({
  etapas,
  filtros,
  onFiltrosChange,
  totalTarefas,
  tarefasFiltradas
}: FiltroAvancadoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extrair valores únicos das tarefas
  const responsaveis = React.useMemo(() => {
    const uniqueResponsaveis = new Set<string>();
    etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        uniqueResponsaveis.add(tarefa.responsavel);
      });
    });
    return Array.from(uniqueResponsaveis).sort();
  }, [etapas]);

  const disciplinas = React.useMemo(() => {
    const uniqueDisciplinas = new Set<string>();
    etapas.forEach(etapa => {
      etapa.tarefas.forEach(tarefa => {
        uniqueDisciplinas.add(tarefa.disciplina);
      });
    });
    return Array.from(uniqueDisciplinas).sort();
  }, [etapas]);

  const statusOptions = [
    { value: 'nao_iniciada', label: 'Não Iniciada', color: 'bg-gray-100 text-gray-800' },
    { value: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
    { value: 'pausada', label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'concluida', label: 'Concluída', color: 'bg-green-100 text-green-800' },
    { value: 'revisao', label: 'Em Revisão', color: 'bg-purple-100 text-purple-800' },
  ];

  const prioridadeOptions = [
    { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800' },
    { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800' },
  ];

  const prazoOptions = [
    { value: 'todos', label: 'Todos os Prazos' },
    { value: 'hoje', label: 'Vence Hoje' },
    { value: 'amanha', label: 'Vence Amanhã' },
    { value: 'semana', label: 'Vence Esta Semana' },
    { value: 'atrasadas', label: 'Atrasadas' },
  ];

  const handleMultiSelectChange = (field: keyof FiltrosAtivos, value: string) => {
    const currentValues = filtros[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltrosChange({
      ...filtros,
      [field]: newValues
    });
  };

  const handleSingleSelectChange = (field: keyof FiltrosAtivos, value: any) => {
    onFiltrosChange({
      ...filtros,
      [field]: value
    });
  };

  const limparFiltros = () => {
    onFiltrosChange({
      status: [],
      prioridade: [],
      responsavel: [],
      disciplina: [],
      etapa: [],
      prazo: 'todos',
      busca: ''
    });
  };

  const temFiltrosAtivos = () => {
    return (
      filtros.status.length > 0 ||
      filtros.prioridade.length > 0 ||
      filtros.responsavel.length > 0 ||
      filtros.disciplina.length > 0 ||
      filtros.etapa.length > 0 ||
      filtros.prazo !== 'todos' ||
      filtros.busca.trim() !== ''
    );
  };

  const contarFiltrosAtivos = () => {
    let count = 0;
    if (filtros.status.length > 0) count++;
    if (filtros.prioridade.length > 0) count++;
    if (filtros.responsavel.length > 0) count++;
    if (filtros.disciplina.length > 0) count++;
    if (filtros.etapa.length > 0) count++;
    if (filtros.prazo !== 'todos') count++;
    if (filtros.busca.trim() !== '') count++;
    return count;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header do Filtro */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filtros Avançados
            {contarFiltrosAtivos() > 0 && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                {contarFiltrosAtivos()}
              </span>
            )}
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Busca Rápida */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={filtros.busca}
              onChange={(e) => handleSingleSelectChange('busca', e.target.value)}
              className="w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {filtros.busca && (
              <button
                onClick={() => handleSingleSelectChange('busca', '')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {tarefasFiltradas} de {totalTarefas} tarefas
          </span>
          {temFiltrosAtivos() && (
            <button
              onClick={limparFiltros}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Painel de Filtros */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.status.includes(option.value)}
                      onChange={() => handleMultiSelectChange('status', option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <div className="space-y-2">
                {prioridadeOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.prioridade.includes(option.value)}
                      onChange={() => handleMultiSelectChange('prioridade', option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Prazo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo
              </label>
              <select
                value={filtros.prazo}
                onChange={(e) => handleSingleSelectChange('prazo', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {prazoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {responsaveis.map(responsavel => (
                  <label key={responsavel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.responsavel.includes(responsavel)}
                      onChange={() => handleMultiSelectChange('responsavel', responsavel)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{responsavel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Disciplina */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {disciplinas.map(disciplina => (
                  <label key={disciplina} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.disciplina.includes(disciplina)}
                      onChange={() => handleMultiSelectChange('disciplina', disciplina)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{disciplina}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Etapa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etapa
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {etapas.map(etapa => (
                  <label key={etapa.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtros.etapa.includes(etapa.id.toString())}
                      onChange={() => handleMultiSelectChange('etapa', etapa.id.toString())}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-2 flex items-center gap-2">
                      <span className="text-lg">{etapa.icone}</span>
                      <span className="text-sm text-gray-700">{etapa.nome}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros Ativos (Tags) */}
          {temFiltrosAtivos() && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filtros.status.map(status => {
                  const option = statusOptions.find(o => o.value === status);
                  return (
                    <span key={status} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${option?.color}`}>
                      {option?.label}
                      <button
                        onClick={() => handleMultiSelectChange('status', status)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {filtros.prioridade.map(prioridade => {
                  const option = prioridadeOptions.find(o => o.value === prioridade);
                  return (
                    <span key={prioridade} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${option?.color}`}>
                      {option?.label}
                      <button
                        onClick={() => handleMultiSelectChange('prioridade', prioridade)}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {filtros.responsavel.map(responsavel => (
                  <span key={responsavel} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {responsavel}
                    <button
                      onClick={() => handleMultiSelectChange('responsavel', responsavel)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filtros.disciplina.map(disciplina => (
                  <span key={disciplina} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {disciplina}
                    <button
                      onClick={() => handleMultiSelectChange('disciplina', disciplina)}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filtros.etapa.map(etapaId => {
                  const etapa = etapas.find(e => e.id.toString() === etapaId);
                  return (
                    <span key={etapaId} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      <span>{etapa?.icone}</span>
                      {etapa?.nome}
                      <button
                        onClick={() => handleMultiSelectChange('etapa', etapaId)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}

                {filtros.prazo !== 'todos' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    {prazoOptions.find(o => o.value === filtros.prazo)?.label}
                    <button
                      onClick={() => handleSingleSelectChange('prazo', 'todos')}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filtros.busca && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Busca: "{filtros.busca}"
                    <button
                      onClick={() => handleSingleSelectChange('busca', '')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 