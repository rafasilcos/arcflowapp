'use client';

import React from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CronometroCard } from './CronometroCard';
import { ProjetoOverview } from './ProjetoOverview';
import { TarefasList } from './TarefasList';
import { AutoSaveIndicator } from './AutoSaveIndicator';

interface DashboardModularProps {
  projetoId: string;
}

export function DashboardModular({ projetoId }: DashboardModularProps) {
  return (
    <ErrorBoundary>
      <DashboardProvider projetoId={projetoId}>
        <div className="min-h-screen bg-gray-50">
          {/* Header com indicador de auto-save */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Produtividade V8 - Modular
              </h1>
              <AutoSaveIndicator />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna 1: Cronômetro e projeto overview */}
              <div className="lg:col-span-2 space-y-6">
                <CronometroCard />
                <ProjetoOverview />
              </div>

              {/* Coluna 2: Lista de tarefas */}
              <div className="space-y-6">
                <TarefasList />
              </div>
            </div>
          </div>
        </div>
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default DashboardModular; 

import React from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CronometroCard } from './CronometroCard';
import { ProjetoOverview } from './ProjetoOverview';
import { TarefasList } from './TarefasList';
import { AutoSaveIndicator } from './AutoSaveIndicator';

interface DashboardModularProps {
  projetoId: string;
}

export function DashboardModular({ projetoId }: DashboardModularProps) {
  return (
    <ErrorBoundary>
      <DashboardProvider projetoId={projetoId}>
        <div className="min-h-screen bg-gray-50">
          {/* Header com indicador de auto-save */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Produtividade V8 - Modular
              </h1>
              <AutoSaveIndicator />
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna 1: Cronômetro e projeto overview */}
              <div className="lg:col-span-2 space-y-6">
                <CronometroCard />
                <ProjetoOverview />
              </div>

              {/* Coluna 2: Lista de tarefas */}
              <div className="space-y-6">
                <TarefasList />
              </div>
            </div>
          </div>
        </div>
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default DashboardModular; 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 