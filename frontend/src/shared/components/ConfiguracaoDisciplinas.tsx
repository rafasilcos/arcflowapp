/**
 * 🎛️ COMPONENTE DE CONFIGURAÇÃO DE DISCIPLINAS
 * Interface intuitiva para ativar/desativar disciplinas com validações
 */

'use client';

import React, { useState } from 'react';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { SugestoesDisciplinas } from './SugestoesDisciplinas';
import { Disciplina, DisciplinaConfig } from '../types/disciplinas';

interface ConfiguracaoDisciplinasProps {
  className?: string;
}

export function ConfiguracaoDisciplinas({ className = '' }: ConfiguracaoDisciplinasProps) {
  const {
    disciplinasDisponiveis,
    disciplinasAtivas,
    configuracoes,
    loading,
    error,
    toggleDisciplina,
    updateDisciplinaConfig,
    canToggleDisciplina,
    getValorTotal
  } = useDisciplinas();

  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);

  const handleToggleDisciplina = async (codigo: string) => {
    try {
      await toggleDisciplina(codigo);
    } catch (error) {
      console.error('Erro ao alterar disciplina:', error);
    }
  };

  const handleConfigChange = (codigo: string, field: keyof DisciplinaConfig, value: any) => {
    updateDisciplinaConfig(codigo, { [field]: value });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Disciplinas e Serviços
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure quais disciplinas serão incluídas no orçamento
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            R$ {getValorTotal().toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-gray-500">
            {Array.from(disciplinasAtivas).length} disciplinas ativas
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 dark:text-red-400 text-sm">⚠️ {error}</span>
          </div>
        </div>
      )}

      {/* Disciplinas Grid */}
      <div className="grid gap-4">
        {disciplinasDisponiveis.map((disciplina) => {
          const isAtiva = disciplinasAtivas.has(disciplina.codigo);
          const config = configuracoes[disciplina.codigo] || { ativa: isAtiva };
          const { canToggle, reason } = canToggleDisciplina(disciplina.codigo);
          const isExpanded = expandedDisciplina === disciplina.codigo;

          return (
            <DisciplinaCard
              key={disciplina.id}
              disciplina={disciplina}
              isAtiva={isAtiva}
              config={config}
              canToggle={canToggle}
              reason={reason}
              isExpanded={isExpanded}
              loading={loading}
              onToggle={() => handleToggleDisciplina(disciplina.codigo)}
              onExpand={() => setExpandedDisciplina(isExpanded ? null : disciplina.codigo)}
              onConfigChange={(field, value) => handleConfigChange(disciplina.codigo, field, value)}
            />
          );
        })}
      </div>

      {/* Sugestões Inteligentes */}
      <SugestoesDisciplinas tipologiaProjeto="RESIDENCIAL" />

      {/* Resumo */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Resumo da Configuração
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Array.from(disciplinasAtivas).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Disciplinas Ativas
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {getValorTotal().toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Valor Total
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {disciplinasDisponiveis.filter(d => d.categoria === 'ESSENCIAL').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Essenciais
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {disciplinasDisponiveis.filter(d => d.categoria === 'COMPLEMENTAR').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Complementares
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente do Card de Disciplina
interface DisciplinaCardProps {
  disciplina: Disciplina;
  isAtiva: boolean;
  config: DisciplinaConfig;
  canToggle: boolean;
  reason?: string;
  isExpanded: boolean;
  loading: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onConfigChange: (field: keyof DisciplinaConfig, value: any) => void;
}

function DisciplinaCard({
  disciplina,
  isAtiva,
  config,
  canToggle,
  reason,
  isExpanded,
  loading,
  onToggle,
  onExpand,
  onConfigChange
}: DisciplinaCardProps) {
  // ✅ CORREÇÃO: Usar valor base da disciplina (será calculado pela Tabela de Preços)
  // Os valores reais vêm da Tabela de Preços, este é apenas um valor de referência
  const valorReferencia = disciplina.valorBase;

  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      isAtiva 
        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      {/* Header do Card */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Toggle Switch */}
            <button
              onClick={onToggle}
              disabled={!canToggle || loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAtiva
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-600'
              } ${
                !canToggle || loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              title={!canToggle ? reason : undefined}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAtiva ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>

            {/* Info da Disciplina */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{disciplina.icone}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {disciplina.nome}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  disciplina.categoria === 'ESSENCIAL'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : disciplina.categoria === 'COMPLEMENTAR'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                }`}>
                  {disciplina.categoria}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {disciplina.descricao}
              </p>
              
              {/* Dependências */}
              {disciplina.dependencias && disciplina.dependencias.length > 0 && (
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Depende de: {disciplina.dependencias.join(', ')}
                </div>
              )}
              
              {/* Razão para não poder toggle */}
              {!canToggle && reason && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  ⚠️ {reason}
                </div>
              )}
            </div>
          </div>

          {/* Valores e Controles */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                R$ {valorReferencia.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-500">
                {disciplina.horasBase}h base
              </div>
            </div>
            
            {isAtiva && (
              <button
                onClick={onExpand}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Configurações Expandidas */}
      {isAtiva && isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="space-y-4">
            {/* Informações sobre a Tabela de Preços */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600 dark:text-blue-400">💰</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Valores controlados pela Tabela de Preços
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Os valores por m², multiplicadores e configurações desta disciplina são gerenciados 
                centralmente na <strong>Tabela de Preços</strong>. 
                Acesse <strong>Configurações → Tabela de Preços</strong> para ajustar valores.
              </p>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={config.observacoes || ''}
                onChange={(e) => onConfigChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Observações específicas para esta disciplina (ex: requisitos especiais, considerações técnicas, etc.)..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}