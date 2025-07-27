/**
 * Componente de Card de Resultado da Geração
 * Exibe resultados detalhados da geração de dados de teste
 */

import React from 'react'
import { GenerationResult } from '../types/testData'

interface GenerationResultCardProps {
  result: GenerationResult
  onViewBriefings?: () => void
  onGenerateMore?: () => void
}

export const GenerationResultCard: React.FC<GenerationResultCardProps> = ({
  result,
  onViewBriefings,
  onGenerateMore
}) => {
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    const seconds = Math.floor(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  const formatDateTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  const calculateRate = (): string => {
    if (result.duration === 0) return '0'
    const rate = (result.briefingsCreated / result.duration) * 1000 // por segundo
    return rate.toFixed(1)
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${
      result.success 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            result.success ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {result.success ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Geração Concluída' : 'Geração com Problemas'}
            </h3>
            <p className={`text-sm ${
              result.success ? 'text-green-600' : 'text-red-600'
            }`}>
              Lote: {result.batchId}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.briefingsCreated}
          </div>
          <div className={`text-sm ${
            result.success ? 'text-green-600' : 'text-red-600'
          }`}>
            briefings criados
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Duração
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDuration(result.duration)}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Taxa
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {calculateRate()}/s
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Sucesso
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {result.success ? '100%' : `${Math.round((result.briefingsCreated / (result.briefingsCreated + result.errors.length)) * 100)}%`}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Erros
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {result.errors.length}
          </div>
        </div>
      </div>

      {/* Erros */}
      {result.errors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Erros Encontrados ({result.errors.length})
          </h4>
          <div className="bg-white rounded-lg border border-red-200 max-h-32 overflow-y-auto">
            <ul className="divide-y divide-red-100">
              {result.errors.slice(0, 5).map((error, index) => (
                <li key={index} className="px-3 py-2 text-sm text-red-700">
                  {error}
                </li>
              ))}
              {result.errors.length > 5 && (
                <li className="px-3 py-2 text-sm text-red-600 font-medium">
                  ... e mais {result.errors.length - 5} erros
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-3">
        {result.success && result.briefingsCreated > 0 && onViewBriefings && (
          <button
            onClick={onViewBriefings}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver Briefings
          </button>
        )}

        {onGenerateMore && (
          <button
            onClick={onGenerateMore}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Gerar Mais
          </button>
        )}

        <button
          onClick={() => navigator.clipboard.writeText(result.batchId)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar ID
        </button>
      </div>

      {/* Detalhes Expandidos */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          Ver Detalhes Técnicos
        </summary>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm font-mono">
          <div className="space-y-1">
            <div><span className="text-gray-600">Batch ID:</span> {result.batchId}</div>
            <div><span className="text-gray-600">Briefings Criados:</span> {result.briefingsCreated}</div>
            <div><span className="text-gray-600">Duração:</span> {result.duration}ms</div>
            <div><span className="text-gray-600">Taxa:</span> {calculateRate()} briefings/segundo</div>
            <div><span className="text-gray-600">Sucesso:</span> {result.success ? 'true' : 'false'}</div>
            <div><span className="text-gray-600">Total de Erros:</span> {result.errors.length}</div>
          </div>
        </div>
      </details>
    </div>
  )
}

export default GenerationResultCard