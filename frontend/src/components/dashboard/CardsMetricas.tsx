// ===== CARDS DE MÉTRICAS HORIZONTAIS =====
// Extraído da V7-Otimizado - 5 cards principais do dashboard

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Clock, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { Projeto } from '@/types/dashboard-core';

interface CardsMetricasProps {
  projeto: Projeto;
  cronometroAtivo: boolean;
  tempoTotalRealTime: string;
  tarefasConcluidas: number;
  totalTarefas: number;
}

export function CardsMetricas({ 
  projeto, 
  cronometroAtivo, 
  tempoTotalRealTime, 
  tarefasConcluidas, 
  totalTarefas 
}: CardsMetricasProps) {
  
  // ===== CÁLCULOS =====
  
  const calcularDiasRestantes = () => {
    const hoje = new Date();
    const prazoFinal = new Date(projeto.prazo_final);
    const diferenca = prazoFinal.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
  };

  const formatarTempoEstimado = () => {
    const horas = Math.floor(projeto.tempo_total_estimado);
    return `${horas}h`;
  };

  const diasRestantes = calcularDiasRestantes();
  const dataFormatada = new Date(projeto.prazo_final).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Card 1: Dados do Projeto */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardContent className="p-3 text-center">
          <Building className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-sm font-bold text-indigo-700 mb-2 truncate" title={projeto.nome}>
            {projeto.nome}
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-indigo-600 truncate" title={projeto.cliente}>
              👤 {projeto.cliente}
            </div>
            <div className="text-indigo-600 truncate" title={projeto.gerente}>
              🏗️ {projeto.gerente}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Tempo - CRONÔMETRO EM TEMPO REAL */}
      <Card className={`bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 transition-all duration-300 ${
        cronometroAtivo ? 'ring-2 ring-green-400 ring-opacity-60 shadow-lg' : ''
      }`}>
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className={`h-6 w-6 text-blue-600 transition-all duration-300 ${
              cronometroAtivo ? 'animate-pulse text-green-600' : ''
            }`} />
            {cronometroAtivo && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-1 animate-pulse"></div>
            )}
          </div>
          <div className={`font-mono text-base font-bold transition-colors duration-300 ${
            cronometroAtivo ? 'text-green-700' : 'text-blue-700'
          }`}>
            {tempoTotalRealTime}
          </div>
          <div className="text-xs text-blue-600">
            de {formatarTempoEstimado()}
          </div>
          <div className={`text-xs mt-1 transition-colors duration-300 ${
            cronometroAtivo ? 'text-green-600 font-medium' : 'text-gray-600'
          }`}>
            {cronometroAtivo ? '⏱️ Tempo Real' : 'Tempo Total'}
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Prazo */}
      <Card className={`bg-gradient-to-br border-2 transition-all duration-300 ${
        diasRestantes <= 7 
          ? 'from-red-50 to-red-100 border-red-200' 
          : diasRestantes <= 30 
            ? 'from-yellow-50 to-yellow-100 border-yellow-200'
            : 'from-green-50 to-green-100 border-green-200'
      }`}>
        <CardContent className="p-3 text-center">
          <Calendar className={`h-6 w-6 mx-auto mb-2 ${
            diasRestantes <= 7 
              ? 'text-red-600' 
              : diasRestantes <= 30 
                ? 'text-yellow-600'
                : 'text-green-600'
          }`} />
          <div className={`text-lg font-bold ${
            diasRestantes <= 7 
              ? 'text-red-700' 
              : diasRestantes <= 30 
                ? 'text-yellow-700'
                : 'text-green-700'
          }`}>
            {diasRestantes}
          </div>
          <div className={`text-xs ${
            diasRestantes <= 7 
              ? 'text-red-600' 
              : diasRestantes <= 30 
                ? 'text-yellow-600'
                : 'text-green-600'
          }`}>
            dias restantes
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Até {dataFormatada}
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Equipe */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-3 text-center">
          <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-700">
            {projeto.equipe.length}
          </div>
          <div className="text-xs text-purple-600">pessoas ativas</div>
          <div className="text-xs text-gray-600 mt-1">
            {projeto.equipe.filter(m => m.status === 'Online').length} online
          </div>
        </CardContent>
      </Card>

      {/* Card 5: Progresso */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-3 text-center">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-emerald-700">
            {tarefasConcluidas}/{totalTarefas}
          </div>
          <div className="text-xs text-emerald-600">tarefas concluídas</div>
          <div className="text-xs text-gray-600 mt-1">
            {Math.round((tarefasConcluidas / totalTarefas) * 100)}% completo
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 