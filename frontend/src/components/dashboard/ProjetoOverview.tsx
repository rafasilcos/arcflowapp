'use client';

import React from 'react';
import { Calendar, User, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';

export function ProjetoOverview() {
  const { state } = useDashboard();
  const { projeto } = state;

  if (!projeto) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Carregando projeto...
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          {projeto.nome}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Cliente</div>
                <div className="font-medium">{projeto.cliente}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Gerente</div>
                <div className="font-medium">{projeto.gerente}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Prazo Final</div>
                <div className="font-medium">{formatarData(projeto.prazo_final)}</div>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Tempo Trabalhado</div>
                <div className="font-medium">{formatarTempo(projeto.tempo_total_trabalhado)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Target className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Tempo Estimado</div>
                <div className="font-medium">{formatarTempo(projeto.tempo_total_estimado)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
              <div>
                <div className="text-sm text-gray-500">Progresso</div>
                <div className="font-medium">{projeto.progresso_geral}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progresso Geral</span>
            <span className="text-sm font-medium">{projeto.progresso_geral}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${projeto.progresso_geral}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 

import React from 'react';
import { Calendar, User, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';

export function ProjetoOverview() {
  const { state } = useDashboard();
  const { projeto } = state;

  if (!projeto) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Carregando projeto...
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          {projeto.nome}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Cliente</div>
                <div className="font-medium">{projeto.cliente}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Gerente</div>
                <div className="font-medium">{projeto.gerente}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Prazo Final</div>
                <div className="font-medium">{formatarData(projeto.prazo_final)}</div>
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Tempo Trabalhado</div>
                <div className="font-medium">{formatarTempo(projeto.tempo_total_trabalhado)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Target className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Tempo Estimado</div>
                <div className="font-medium">{formatarTempo(projeto.tempo_total_estimado)}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
              <div>
                <div className="text-sm text-gray-500">Progresso</div>
                <div className="font-medium">{projeto.progresso_geral}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Progresso Geral</span>
            <span className="text-sm font-medium">{projeto.progresso_geral}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${projeto.progresso_geral}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 