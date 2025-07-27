/**
 * Componente de Indicador de Progresso
 * Mostra progresso visual detalhado da geração de dados
 */

import React from 'react'
import { GenerationProgress } from '../types/testData'

interface ProgressIndicatorProps {
  progress: GenerationProgress
  onCancel?: () => void
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  progress, 
  onCancel 
}) => {
  const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0
  
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return 'bg-blue-600'
      case 'completed': return 'bg-green-600'
      case 'error': return 'bg-red-600'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'idle': return 'Aguardando'
      case 'running': return 'Gerando'
      case 'completed': return 'Concluído'
      case 'error': return 'Erro'
      default: return 'Desconhecido'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Progresso da Geração
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(progress.status)}`} />
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(progress.status)}
          </span>
        </div>
      </div>

      {/* Barra de Progresso Principal */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {progress.current} de {progress.total} briefings
          </span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${getStatusColor(progress.status)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {progress.currentType && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Tipo Atual
            </div>
            <div className="text-sm font-medium text-gray-900">
              {progress.currentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        )}

        {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Tempo Restante
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatTime(progress.estimatedTimeRemaining)}
            </div>
          </div>
        )}
      </div>

      {/* Animação de Loading */}
      {progress.status === 'running' && (
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-gray-600">Processando...</span>
          </div>
        </div>
      )}

      {/* Botão de Cancelar */}
      {progress.status === 'running' && onCancel && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar Geração
          </button>
        </div>
      )}

      {/* Mensagem de Conclusão */}
      {progress.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Geração concluída com sucesso!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {progress.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Erro na geração de dados
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressIndicator