'use client';

import React from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

export function CronometroCard() {
  const { state, dispatch } = useDashboard();
  const { projeto, cronometro } = state;

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const obterTarefaAtiva = () => {
    if (!projeto || !cronometro.tarefaAtiva) return null;
    
    return projeto.etapas
      .flatMap(etapa => etapa.tarefas)
      .find(tarefa => tarefa.id === cronometro.tarefaAtiva) || null;
  };

  const handleIniciarCronometro = (tarefaId: string) => {
    dispatch({ type: 'INICIAR_CRONOMETRO', payload: { tarefaId } });
  };

  const handlePausarCronometro = () => {
    dispatch({ type: 'PAUSAR_CRONOMETRO' });
  };

  const handlePararCronometro = () => {
    dispatch({ type: 'PARAR_CRONOMETRO' });
  };

  const tarefaAtual = obterTarefaAtiva();

  if (!tarefaAtual) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Cronômetro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma tarefa ativa</p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em "Iniciar" em uma tarefa para começar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Tarefa Atual
          </div>
          <div className="text-sm font-normal text-gray-500">
            Sessão {cronometro.numeroSessoes}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nome da tarefa */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1">
            {tarefaAtual.nome}
          </h3>
          <p className="text-sm text-gray-500">
            Responsável: {tarefaAtual.responsavel}
          </p>
        </div>

        {/* Cronômetro */}
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatarTempo(cronometro.tempoSessaoAtual)}
          </div>
          <div className="text-sm text-gray-500">
            Tempo da sessão atual
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center space-x-3">
          {!cronometro.cronometroAtivo ? (
            <Button
              onClick={() => handleIniciarCronometro(tarefaAtual.id)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              <span>{cronometro.tempoSessaoAtual > 0 ? 'Retomar' : 'Iniciar'}</span>
            </Button>
          ) : (
            <Button
              onClick={handlePausarCronometro}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700"
            >
              <Pause className="h-4 w-4" />
              <span>Pausar</span>
            </Button>
          )}

          <Button
            onClick={handlePararCronometro}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <Square className="h-4 w-4" />
            <span>Finalizar</span>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatarTempo(tarefaAtual.tempo_total + cronometro.tempoSessaoAtual)}
            </div>
            <div className="text-xs text-gray-500">Tempo Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatarTempo(tarefaAtual.tempo_estimado)}
            </div>
            <div className="text-xs text-gray-500">Estimado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 

import React from 'react';
import { Play, Pause, Square, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/contexts/DashboardContext';

export function CronometroCard() {
  const { state, dispatch } = useDashboard();
  const { projeto, cronometro } = state;

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const obterTarefaAtiva = () => {
    if (!projeto || !cronometro.tarefaAtiva) return null;
    
    return projeto.etapas
      .flatMap(etapa => etapa.tarefas)
      .find(tarefa => tarefa.id === cronometro.tarefaAtiva) || null;
  };

  const handleIniciarCronometro = (tarefaId: string) => {
    dispatch({ type: 'INICIAR_CRONOMETRO', payload: { tarefaId } });
  };

  const handlePausarCronometro = () => {
    dispatch({ type: 'PAUSAR_CRONOMETRO' });
  };

  const handlePararCronometro = () => {
    dispatch({ type: 'PARAR_CRONOMETRO' });
  };

  const tarefaAtual = obterTarefaAtiva();

  if (!tarefaAtual) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Cronômetro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma tarefa ativa</p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em "Iniciar" em uma tarefa para começar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Timer className="h-5 w-5 mr-2" />
            Tarefa Atual
          </div>
          <div className="text-sm font-normal text-gray-500">
            Sessão {cronometro.numeroSessoes}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nome da tarefa */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1">
            {tarefaAtual.nome}
          </h3>
          <p className="text-sm text-gray-500">
            Responsável: {tarefaAtual.responsavel}
          </p>
        </div>

        {/* Cronômetro */}
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {formatarTempo(cronometro.tempoSessaoAtual)}
          </div>
          <div className="text-sm text-gray-500">
            Tempo da sessão atual
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center space-x-3">
          {!cronometro.cronometroAtivo ? (
            <Button
              onClick={() => handleIniciarCronometro(tarefaAtual.id)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              <span>{cronometro.tempoSessaoAtual > 0 ? 'Retomar' : 'Iniciar'}</span>
            </Button>
          ) : (
            <Button
              onClick={handlePausarCronometro}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700"
            >
              <Pause className="h-4 w-4" />
              <span>Pausar</span>
            </Button>
          )}

          <Button
            onClick={handlePararCronometro}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <Square className="h-4 w-4" />
            <span>Finalizar</span>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatarTempo(tarefaAtual.tempo_total + cronometro.tempoSessaoAtual)}
            </div>
            <div className="text-xs text-gray-500">Tempo Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatarTempo(tarefaAtual.tempo_estimado)}
            </div>
            <div className="text-xs text-gray-500">Estimado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 