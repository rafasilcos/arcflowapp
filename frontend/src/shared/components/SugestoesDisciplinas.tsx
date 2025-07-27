/**
 * 💡 COMPONENTE DE SUGESTÕES INTELIGENTES DE DISCIPLINAS
 * Sugere disciplinas complementares baseado no projeto atual
 */

'use client';

import React from 'react';
import { useDisciplinas } from '../hooks/useDisciplinas';
import { useDisciplinasValidator } from '../utils/disciplinasValidator';
import { Disciplina } from '../types/disciplinas';

interface SugestoesDisciplinasProps {
  tipologiaProjeto?: string;
  className?: string;
}

export function SugestoesDisciplinas({ 
  tipologiaProjeto = 'RESIDENCIAL', 
  className = '' 
}: SugestoesDisciplinasProps) {
  const {
    disciplinasDisponiveis,
    disciplinasAtivas,
    toggleDisciplina,
    loading
  } = useDisciplinas();

  const { suggestComplementary, calculateCompleteness } = useDisciplinasValidator();

  const disciplinasAtivasArray = Array.from(disciplinasAtivas);
  
  // Calcular sugestões
  const sugestoes = suggestComplementary(
    disciplinasAtivasArray,
    tipologiaProjeto,
    disciplinasDisponiveis
  );

  // Calcular score de completude
  const completeness = calculateCompleteness(
    disciplinasAtivasArray,
    tipologiaProjeto,
    disciplinasDisponiveis
  );

  const handleAddDisciplina = async (codigo: string) => {
    try {
      await toggleDisciplina(codigo);
    } catch (error) {
      console.error('Erro ao adicionar disciplina:', error);
    }
  };

  if (sugestoes.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Score de Completude */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">
            📊 Completude do Projeto
          </h4>
          <span className={`text-lg font-bold ${
            completeness.percentage >= 80 
              ? 'text-green-600 dark:text-green-400'
              : completeness.percentage >= 60
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {completeness.percentage}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              completeness.percentage >= 80 
                ? 'bg-green-500'
                : completeness.percentage >= 60
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${completeness.percentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {completeness.score} de {completeness.maxScore} disciplinas recomendadas para projetos {tipologiaProjeto.toLowerCase()}
        </p>
      </div>

      {/* Sugestões */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          💡 Disciplinas Sugeridas
        </h4>
        
        <div className="space-y-2">
          {sugestoes.map((disciplina) => (
            <SugestaoCard
              key={disciplina.codigo}
              disciplina={disciplina}
              onAdd={() => handleAddDisciplina(disciplina.codigo)}
              loading={loading}
            />
          ))}
        </div>
        
        {sugestoes.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm">
              Todas as disciplinas recomendadas já estão ativas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente do Card de Sugestão
interface SugestaoCardProps {
  disciplina: Disciplina;
  onAdd: () => void;
  loading: boolean;
}

function SugestaoCard({ disciplina, onAdd, loading }: SugestaoCardProps) {
  const getBeneficioText = (categoria: string) => {
    switch (categoria) {
      case 'COMPLEMENTAR':
        return 'Agrega valor ao projeto';
      case 'ESPECIALIZADA':
        return 'Essencial para aprovações';
      default:
        return 'Melhora a qualidade';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'ESSENCIAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'COMPLEMENTAR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ESPECIALIZADA':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <span className="text-xl">{disciplina.icone}</span>
        <div>
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-gray-900 dark:text-white">
              {disciplina.nome}
            </h5>
            <span className={`px-2 py-1 text-xs rounded-full ${getCategoriaColor(disciplina.categoria)}`}>
              {disciplina.categoria}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getBeneficioText(disciplina.categoria)} • R$ {disciplina.valorBase}/m²
          </p>
        </div>
      </div>
      
      <button
        onClick={onAdd}
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '...' : '+ Adicionar'}
      </button>
    </div>
  );
}