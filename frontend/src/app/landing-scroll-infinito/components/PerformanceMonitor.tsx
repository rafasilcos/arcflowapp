'use client'

import { useState, useEffect } from 'react'
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor'

interface PerformanceMonitorProps {
  showDebugPanel?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  autoHide?: boolean
  enableControls?: boolean
  onPerformanceAlert?: (level: 'critical' | 'warning' | 'good') => void
}

export function PerformanceMonitor({
  showDebugPanel = false,
  position = 'top-right',
  autoHide = false,
  enableControls = true,
  onPerformanceAlert
}: PerformanceMonitorProps) {
  const {
    metrics,
    optimizations,
    performanceHistory,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    forceOptimization,
    getDebugInfo,
    isOptimized,
    performanceLevel
  } = usePerformanceMonitor({
    debugMode: showDebugPanel,
    autoOptimize: true
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const [alertHistory, setAlertHistory] = useState<string[]>([])

  // Notificar mudanças críticas de performance
  useEffect(() => {
    if (onPerformanceAlert) {
      onPerformanceAlert(performanceLevel as 'critical' | 'warning' | 'good')
    }

    // Adicionar alertas ao histórico
    if (performanceLevel === 'critical' && metrics.fps < 15) {
      const alert = `${new Date().toLocaleTimeString()}: FPS crítico (${metrics.fps})`
      setAlertHistory(prev => [...prev.slice(-9), alert])
    }
  }, [performanceLevel, metrics.fps, onPerformanceAlert])

  // Auto-hide em performance boa
  const shouldShow = !autoHide || performanceLevel !== 'good' || isExpanded

  // Determinar cor do indicador
  const getPerformanceColor = () => {
    switch (performanceLevel) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Determinar posição
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4'
      case 'top-right': return 'top-4 right-4'
      case 'bottom-left': return 'bottom-4 left-4'
      case 'bottom-right': return 'bottom-4 right-4'
      default: return 'top-4 right-4'
    }
  }

  // Gerar gráfico simples de FPS
  const generateFPSChart = () => {
    const recent = performanceHistory.slice(-20)
    const max = Math.max(...recent.map(m => m.fps), 60)
    
    return recent.map((metric, index) => (
      <div
        key={index}
        className="bg-blue-400 rounded-sm"
        style={{
          height: `${(metric.fps / max) * 40}px`,
          width: '3px',
          marginRight: '1px'
        }}
        title={`${metric.fps} FPS`}
      />
    ))
  }

  if (!shouldShow && !showDebugPanel) {
    return null
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 font-mono text-xs max-w-sm`}>
      {/* Indicador principal */}
      <div 
        className={`
          bg-black/90 text-white rounded-lg p-3 cursor-pointer
          transition-all duration-300 backdrop-blur-sm border border-gray-700
          ${isExpanded ? 'w-80' : 'w-auto'}
          ${performanceLevel === 'critical' ? 'animate-pulse' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPerformanceColor()}`} />
            <span className="text-white font-bold">
              {metrics.fps} FPS
            </span>
            {isOptimized && (
              <span className="text-yellow-400 text-sm">⚡</span>
            )}
            {!isMonitoring && (
              <span className="text-red-400 text-sm">⏸️</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded ${
              performanceLevel === 'good' ? 'bg-green-600' :
              performanceLevel === 'warning' ? 'bg-yellow-600' :
              'bg-red-600'
            }`}>
              {performanceLevel.toUpperCase()}
            </span>
            <span className="text-gray-400">
              {isExpanded ? '−' : '+'}
            </span>
          </div>
        </div>

        {/* Informações expandidas */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Métricas principais */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-gray-300 text-xs font-semibold">Performance</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>FPS Atual:</span>
                    <span className="text-white font-mono">{metrics.fps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FPS Médio:</span>
                    <span className="text-white font-mono">{metrics.averageFps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min/Max:</span>
                    <span className="text-white font-mono">{metrics.minFps}/{metrics.maxFps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frame Time:</span>
                    <span className="text-white font-mono">{metrics.frameTime.toFixed(1)}ms</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-gray-300 text-xs font-semibold">Sistema</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Memória:</span>
                    <span className={`font-mono ${
                      metrics.memoryUsage > 80 ? 'text-red-400' :
                      metrics.memoryUsage > 60 ? 'text-yellow-400' :
                      'text-white'
                    }`}>
                      {metrics.memoryUsage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU Est:</span>
                    <span className="text-white font-mono">{metrics.cpuUsage.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Render:</span>
                    <span className="text-white font-mono">{metrics.renderTime.toFixed(1)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qualidade:</span>
                    <span className={`font-mono ${
                      metrics.animationComplexity === 'high' ? 'text-green-400' :
                      metrics.animationComplexity === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {metrics.animationComplexity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de FPS */}
            {showChart && performanceHistory.length > 0 && (
              <div>
                <div className="text-gray-300 text-xs font-semibold mb-2">
                  FPS History (últimos 20 frames)
                </div>
                <div className="flex items-end h-12 bg-gray-800 rounded p-2">
                  {generateFPSChart()}
                </div>
              </div>
            )}

            {/* Otimizações ativas */}
            {isOptimized && (
              <div>
                <div className="text-gray-300 text-xs font-semibold mb-1">
                  Otimizações Ativas
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {optimizations.reduceParticles && (
                    <span className="text-yellow-400">• Partículas ↓</span>
                  )}
                  {optimizations.simplifyAnimations && (
                    <span className="text-yellow-400">• Animações ↓</span>
                  )}
                  {optimizations.disableBlur && (
                    <span className="text-yellow-400">• Blur OFF</span>
                  )}
                  {optimizations.throttleScroll && (
                    <span className="text-yellow-400">• Scroll ↓</span>
                  )}
                  {optimizations.enableWillChange && (
                    <span className="text-yellow-400">• Will-change</span>
                  )}
                  {optimizations.pauseNonCritical && (
                    <span className="text-yellow-400">• Pausar NC</span>
                  )}
                </div>
              </div>
            )}

            {/* Alertas recentes */}
            {alertHistory.length > 0 && (
              <div>
                <div className="text-gray-300 text-xs font-semibold mb-1">
                  Alertas Recentes
                </div>
                <div className="bg-gray-800 rounded p-2 max-h-20 overflow-y-auto">
                  {alertHistory.slice(-3).map((alert, index) => (
                    <div key={index} className="text-red-400 text-xs">
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controles */}
            {enableControls && (
              <div className="border-t border-gray-600 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs">Controles</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowChart(!showChart)
                      }}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      {showChart ? 'Ocultar' : 'Gráfico'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        isMonitoring ? stopMonitoring() : startMonitoring()
                      }}
                      className={`px-2 py-1 rounded text-xs ${
                        isMonitoring 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isMonitoring ? 'Parar' : 'Iniciar'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      forceOptimization('none')
                    }}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                  >
                    Alta
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      forceOptimization('light')
                    }}
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs"
                  >
                    Média
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      forceOptimization('aggressive')
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  >
                    Baixa
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('🔍 Performance Debug Info:', getDebugInfo())
                  }}
                  className="w-full px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs"
                >
                  Log Debug Info
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indicadores de alerta */}
      {performanceLevel === 'critical' && (
        <div className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-xs animate-pulse">
          ⚠️ Performance crítica - Otimizações ativas
        </div>
      )}

      {metrics.memoryUsage > 80 && (
        <div className="mt-2 bg-orange-600 text-white px-3 py-1 rounded text-xs">
          🧠 Memória alta ({metrics.memoryUsage}%)
        </div>
      )}
    </div>
  )
}

// Componente simplificado para produção
export function PerformanceIndicator() {
  const { metrics, performanceLevel, isOptimized } = usePerformanceMonitor()

  const getPerformanceColor = () => {
    switch (performanceLevel) {
      case 'good': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getPerformanceColor()}`} />
        <span className="text-white text-xs font-mono">
          {metrics.fps}fps
        </span>
        {isOptimized && (
          <span className="text-yellow-400 text-xs">⚡</span>
        )}
      </div>
    </div>
  )
}