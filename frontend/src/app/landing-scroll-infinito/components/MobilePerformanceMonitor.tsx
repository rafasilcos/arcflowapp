'use client'

import { useState, useEffect } from 'react'
import { useMobileOptimization } from '../hooks/useMobileOptimization'

interface MobilePerformanceMonitorProps {
  showDebugInfo?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onPerformanceChange?: (metrics: any) => void
}

export function MobilePerformanceMonitor({ 
  showDebugInfo = false, 
  position = 'top-right',
  onPerformanceChange 
}: MobilePerformanceMonitorProps) {
  const {
    performanceMetrics,
    optimizationConfig,
    deviceInfo,
    isOptimized,
    forceOptimization,
    getOptimizationSummary,
    debugInfo
  } = useMobileOptimization()

  const [isExpanded, setIsExpanded] = useState(false)
  const [showControls, setShowControls] = useState(false)

  // Notificar mudanças de performance
  useEffect(() => {
    if (onPerformanceChange) {
      onPerformanceChange({
        performanceMetrics,
        optimizationConfig,
        deviceInfo,
        isOptimized
      })
    }
  }, [performanceMetrics, optimizationConfig, deviceInfo, isOptimized, onPerformanceChange])

  // Determinar cor do indicador baseado na performance
  const getPerformanceColor = () => {
    if (performanceMetrics.fps >= 50) return 'bg-green-500'
    if (performanceMetrics.fps >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Determinar posição do monitor
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  // Obter resumo de otimização
  const optimizationSummary = getOptimizationSummary()

  if (!showDebugInfo && !deviceInfo.isMobile) {
    return null
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 font-mono text-xs`}>
      {/* Indicador compacto */}
      <div 
        className={`
          bg-black/80 text-white rounded-lg p-2 cursor-pointer
          transition-all duration-300 backdrop-blur-sm
          ${isExpanded ? 'w-80' : 'w-auto'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header sempre visível */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getPerformanceColor()}`} />
            <span className="text-white font-medium">
              {performanceMetrics.fps}fps
            </span>
            {isOptimized && (
              <span className="text-yellow-400 text-xs">⚡</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {deviceInfo.isMobile && (
              <span className="text-blue-400">📱</span>
            )}
            {deviceInfo.isLowEndDevice && (
              <span className="text-orange-400">⚠️</span>
            )}
            <span className="text-gray-400 text-xs">
              {isExpanded ? '−' : '+'}
            </span>
          </div>
        </div>

        {/* Informações expandidas */}
        {isExpanded && (
          <div className="mt-3 space-y-2 border-t border-gray-600 pt-2">
            {/* Métricas de performance */}
            <div>
              <div className="text-gray-300 mb-1">Performance</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>FPS: <span className="text-white">{performanceMetrics.fps}</span></div>
                <div>Mem: <span className="text-white">{performanceMetrics.memoryUsage}%</span></div>
                <div>DPR: <span className="text-white">{performanceMetrics.devicePixelRatio}</span></div>
                <div>Net: <span className="text-white">{performanceMetrics.connectionSpeed}</span></div>
              </div>
              
              {performanceMetrics.batteryLevel && (
                <div className="mt-1">
                  Bateria: <span className="text-white">{performanceMetrics.batteryLevel}%</span>
                  {performanceMetrics.isLowPowerMode && (
                    <span className="text-red-400 ml-1">🔋</span>
                  )}
                </div>
              )}
            </div>

            {/* Informações do dispositivo */}
            <div>
              <div className="text-gray-300 mb-1">Dispositivo</div>
              <div className="text-xs space-y-1">
                <div>Tipo: {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}</div>
                <div>Tela: {deviceInfo.screenSize}</div>
                <div>Orient: {deviceInfo.orientation}</div>
                <div>Touch: {deviceInfo.maxTouchPoints} pontos</div>
                {deviceInfo.isLowEndDevice && (
                  <div className="text-orange-400">⚠️ Dispositivo lento</div>
                )}
              </div>
            </div>

            {/* Status de otimização */}
            <div>
              <div className="text-gray-300 mb-1">Otimizações</div>
              <div className="text-xs space-y-1">
                <div className={isOptimized ? 'text-green-400' : 'text-gray-400'}>
                  Status: {isOptimized ? 'Ativas' : 'Desativadas'}
                </div>
                {isOptimized && (
                  <div className="text-yellow-400">
                    Motivo: {optimizationSummary.reason}
                  </div>
                )}
                <div>
                  Qualidade: <span className="text-white">{optimizationConfig.animationQuality}</span>
                </div>
                <div>
                  Touch: <span className="text-white">{optimizationConfig.touchSensitivity}x</span>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="border-t border-gray-600 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowControls(!showControls)
                }}
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                {showControls ? 'Ocultar' : 'Mostrar'} Controles
              </button>
              
              {showControls && (
                <div className="mt-2 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      forceOptimization(!isOptimized)
                    }}
                    className={`
                      w-full px-2 py-1 rounded text-xs font-medium
                      ${isOptimized 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    {isOptimized ? 'Desativar' : 'Forçar'} Otimizações
                  </button>
                  
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('📱 Debug Info:', debugInfo)
                      }}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      Log Debug
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.location.reload()
                      }}
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                    >
                      Reload
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Otimizações ativas */}
            {optimizationSummary.optimizations.length > 0 && (
              <div>
                <div className="text-gray-300 mb-1">Ativas</div>
                <div className="text-xs text-yellow-400">
                  {optimizationSummary.optimizations.map(opt => 
                    opt.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()
                  ).join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indicador de performance crítica */}
      {performanceMetrics.fps < 20 && (
        <div className="mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
          ⚠️ Performance crítica
        </div>
      )}

      {/* Indicador de bateria baixa */}
      {performanceMetrics.isLowPowerMode && (
        <div className="mt-2 bg-orange-600 text-white px-2 py-1 rounded text-xs">
          🔋 Modo economia
        </div>
      )}
    </div>
  )
}

// Componente simplificado para produção
export function MobilePerformanceIndicator() {
  const { performanceMetrics, isOptimized, deviceInfo } = useMobileOptimization()

  if (!deviceInfo.isMobile) return null

  const getPerformanceColor = () => {
    if (performanceMetrics.fps >= 50) return 'bg-green-500'
    if (performanceMetrics.fps >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getPerformanceColor()}`} />
        <span className="text-white text-xs font-mono">
          {performanceMetrics.fps}fps
        </span>
        {isOptimized && (
          <span className="text-yellow-400 text-xs">⚡</span>
        )}
      </div>
    </div>
  )
}