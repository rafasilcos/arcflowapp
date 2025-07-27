'use client'

import React from 'react'
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react'
import { useBriefingTimer } from '@/hooks/useBriefingTimer'

interface BriefingTimerProps {
  briefingId: string
  dataInicio?: string
  dataFim?: string
  className?: string
}

export const BriefingTimer: React.FC<BriefingTimerProps> = ({
  briefingId,
  dataInicio,
  dataFim,
  className = ''
}) => {
  const {
    isActive,
    currentTime,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    formatTime,
    calculateTotalTime
  } = useBriefingTimer(briefingId)

  // Se tem dataInicio e dataFim, usar o tempo calculado
  const displayTime = (dataInicio && dataFim) 
    ? calculateTotalTime(dataInicio, dataFim)
    : currentTime

  const displayTimeFormatted = formatTime(displayTime)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Display do tempo */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="font-mono text-sm font-medium text-gray-800">
          {displayTimeFormatted}
        </span>
        {isActive && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Controles - apenas se não tiver dataFim (briefing ainda em andamento) */}
      {!dataFim && (
        <div className="flex items-center gap-1">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Iniciar cronômetro"
            >
              <Play className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Pausar cronômetro"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={stopTimer}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Parar cronômetro"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={resetTimer}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Resetar cronômetro"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status */}
      {dataFim && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Finalizado
        </span>
      )}
    </div>
  )
} 