/**
 * 🎯 PÁGINA DE DEMONSTRAÇÃO DO SISTEMA DE DISCIPLINAS DINÂMICAS
 * Demonstra o funcionamento completo da lógica implementada
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ConfiguracaoDisciplinas } from '@/shared/components/ConfiguracaoDisciplinas';
import { VisualizacaoOrcamento } from '@/shared/components/VisualizacaoOrcamento';
import { useDisciplinas } from '@/shared/hooks/useDisciplinas';

export default function DemoPage() {
  const { initializeDisciplinas, loading, error } = useDisciplinas();
  const [activeDemo, setActiveDemo] = useState<'config' | 'visualizacao' | 'ambos'>('ambos');

  useEffect(() => {
    // Inicializar com dados de demonstração
    const initAsync = async () => {
      try {
        await initializeDisciplinas(undefined, undefined, 'demo');
      } catch (error) {
        console.error('Erro ao inicializar disciplinas:', error);
      }
    };
    
    initAsync();
  }, [initializeDisciplinas]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando demonstração...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Demonstração: Sistema de Disciplinas Dinâmicas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Veja como o orçamento se atualiza automaticamente ao ativar/desativar disciplinas
          </p>
          
          {/* Demo Controls */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Visualização:
            </span>
            {[
              { id: 'config', name: 'Configuração', icon: '⚙️' },
              { id: 'visualizacao', name: 'Orçamento', icon: '📊' },
              { id: 'ambos', name: 'Lado a Lado', icon: '🔄' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveDemo(option.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDemo === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.icon} {option.name}
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Como testar:
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              <li>• <strong>Ative/desative disciplinas</strong> na seção de configuração</li>
              <li>• <strong>Observe o orçamento</strong> se atualizando automaticamente</li>
              <li>• <strong>Veja o cronograma</strong> mudando conforme as disciplinas ativas</li>
              <li>• <strong>Teste as dependências</strong> - algumas disciplinas dependem de outras</li>
              <li>• <strong>Arquitetura é essencial</strong> - não pode ser desativada</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-600 dark:text-red-400 mr-2">⚠️</span>
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeDemo === 'config' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ConfiguracaoDisciplinas />
            </div>
          )}

          {activeDemo === 'visualizacao' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <VisualizacaoOrcamento />
            </div>
          )}

          {activeDemo === 'ambos' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Configuração */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    ⚙️ Configuração de Disciplinas
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Ative/desative disciplinas e veja o impacto em tempo real
                  </p>
                </div>
                <div className="p-6">
                  <ConfiguracaoDisciplinas />
                </div>
              </div>

              {/* Visualização */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    📊 Orçamento Dinâmico
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Valores e cronograma atualizados automaticamente
                  </p>
                </div>
                <div className="p-6">
                  <VisualizacaoOrcamento />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Atualização em Tempo Real
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Orçamento se atualiza instantaneamente ao modificar disciplinas, sem necessidade de reload.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Validação de Dependências
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sistema inteligente que gerencia dependências entre disciplinas automaticamente.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Cronograma Dinâmico
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Fases do cronograma aparecem/desaparecem conforme disciplinas ativas.
            </p>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            🛠️ Detalhes Técnicos da Implementação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Tecnologias Utilizadas:
              </h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>Zustand</strong> - Gerenciamento de estado</li>
                <li>• <strong>React Hooks</strong> - Lógica de componentes</li>
                <li>• <strong>TypeScript</strong> - Tipagem robusta</li>
                <li>• <strong>Lodash</strong> - Debouncing para performance</li>
                <li>• <strong>TailwindCSS</strong> - Estilização responsiva</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Características:
              </h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>Performance</strong> - Otimizado para 5k+ usuários</li>
                <li>• <strong>Escalabilidade</strong> - Arquitetura modular</li>
                <li>• <strong>Robustez</strong> - Validações e tratamento de erros</li>
                <li>• <strong>UX</strong> - Interface intuitiva e responsiva</li>
                <li>• <strong>Manutenibilidade</strong> - Código limpo e documentado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}