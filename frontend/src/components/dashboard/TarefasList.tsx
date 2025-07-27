'use client';

import React from 'react';
import { CheckCircle, Clock, User, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

export function TarefasList() {
  const { state, dispatch } = useDashboard();
  const { projeto } = state;

  if (!projeto) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Carregando tarefas...
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em_progresso':
        return 'bg-blue-100 text-blue-800';
      case 'em_revisao':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'em_progresso':
        return 'Em Progresso';
      case 'em_revisao':
        return 'Em Revisão';
      case 'atrasada':
        return 'Atrasada';
      case 'nao_iniciada':
        return 'Não Iniciada';
      default:
        return status;
    }
  };

  const handleIniciarTarefa = (tarefaId: string) => {
    dispatch({ type: 'INICIAR_CRONOMETRO', payload: { tarefaId } });
  };

  const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Tarefas ({todasTarefas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todasTarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              {/* Header da tarefa */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {tarefa.nome}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {tarefa.responsavel}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatarTempo(tarefa.tempo_total)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tarefa.status)}`}>
                    {getStatusText(tarefa.status)}
                  </span>
                  
                  {tarefa.status !== 'concluida' && (
                    <Button
                      onClick={() => handleIniciarTarefa(tarefa.id)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Iniciar
                    </Button>
                  )}
                </div>
              </div>

              {/* Progresso */}
              {tarefa.tempo_estimado > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progresso</span>
                    <span className="text-xs text-gray-500">
                      {formatarTempo(tarefa.tempo_total)} / {formatarTempo(tarefa.tempo_estimado)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (tarefa.tempo_total / tarefa.tempo_estimado) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {todasTarefas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma tarefa encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 

import React from 'react';
import { CheckCircle, Clock, User, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

export function TarefasList() {
  const { state, dispatch } = useDashboard();
  const { projeto } = state;

  if (!projeto) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Carregando tarefas...
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em_progresso':
        return 'bg-blue-100 text-blue-800';
      case 'em_revisao':
        return 'bg-yellow-100 text-yellow-800';
      case 'atrasada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'em_progresso':
        return 'Em Progresso';
      case 'em_revisao':
        return 'Em Revisão';
      case 'atrasada':
        return 'Atrasada';
      case 'nao_iniciada':
        return 'Não Iniciada';
      default:
        return status;
    }
  };

  const handleIniciarTarefa = (tarefaId: string) => {
    dispatch({ type: 'INICIAR_CRONOMETRO', payload: { tarefaId } });
  };

  const todasTarefas = projeto.etapas.flatMap(etapa => etapa.tarefas);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Tarefas ({todasTarefas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todasTarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              {/* Header da tarefa */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {tarefa.nome}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {tarefa.responsavel}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatarTempo(tarefa.tempo_total)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(tarefa.status)}`}>
                    {getStatusText(tarefa.status)}
                  </span>
                  
                  {tarefa.status !== 'concluida' && (
                    <Button
                      onClick={() => handleIniciarTarefa(tarefa.id)}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Iniciar
                    </Button>
                  )}
                </div>
              </div>

              {/* Progresso */}
              {tarefa.tempo_estimado > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progresso</span>
                    <span className="text-xs text-gray-500">
                      {formatarTempo(tarefa.tempo_total)} / {formatarTempo(tarefa.tempo_estimado)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (tarefa.tempo_total / tarefa.tempo_estimado) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {todasTarefas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhuma tarefa encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 