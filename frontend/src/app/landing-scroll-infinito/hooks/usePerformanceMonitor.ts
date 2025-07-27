'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface PerformanceMetrics {
  fps: number
  averageFps: number
  minFps: number
  maxFps: number
  frameTime: number
  memoryUsage: number
  cpuUsage: number
  renderTime: number
  scrollPerformance: number
  animationComplexity: 'low' | 'medium' | 'high'
  isThrottled: boolean
  timestamp: number
}

interface PerformanceConfig {
  fpsThreshold: {
    critical: number
    warning: number
    good: number
  }
  memoryThreshold: {
    critical: number
    warning: number
  }
  autoOptimize: boolean
  debugMode: boolean
  sampleRate: number
}

interface OptimizationActions {
  reduceParticles: boolean
  simplifyAnimations: boolean
  disableBlur: boolean
  reduceStagger: boolean
  enableWillChange: boolean
  throttleScroll: boolean
  pauseNonCritical: boolean
}

const DEFAULT_CONFIG: PerformanceConfig = {
  fpsThreshold: {
    critical: 20,
    warning: 30,
    good: 50
  },
  memoryThreshold: {
    critical: 80,
    warning: 60
  },
  autoOptimize: true,
  debugMode: false,
  sampleRate: 60 // samples per second
}

export function usePerformanceMonitor(config: Partial<PerformanceConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    averageFps: 60,
    minFps: 60,
    maxFps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    cpuUsage: 0,
    renderTime: 0,
    scrollPerformance: 100,
    animationComplexity: 'high',
    isThrottled: false,
    timestamp: Date.now()
  })

  const [optimizations, setOptimizations] = useState<OptimizationActions>({
    reduceParticles: false,
    simplifyAnimations: false,
    disableBlur: false,
    reduceStagger: false,
    enableWillChange: false,
    throttleScroll: false,
    pauseNonCritical: false
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceMetrics[]>([])

  // Refs para tracking
  const rafId = useRef<number | undefined>(undefined)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const fpsHistory = useRef<number[]>([])
  const renderStartTime = useRef(0)
  const scrollStartTime = useRef(0)
  const memoryObserver = useRef<PerformanceObserver | undefined>(undefined)

  // Monitoramento de FPS em tempo real
  const measureFPS = useCallback(() => {
    const now = performance.now()
    const delta = now - lastTime.current
    
    frameCount.current++
    
    if (delta >= 1000) { // A cada segundo
      const currentFps = Math.round((frameCount.current * 1000) / delta)
      
      // Atualizar histórico de FPS
      fpsHistory.current.push(currentFps)
      if (fpsHistory.current.length > 60) { // Manter apenas últimos 60 segundos
        fpsHistory.current.shift()
      }
      
      // Calcular estatísticas
      const averageFps = Math.round(
        fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
      )
      const minFps = Math.min(...fpsHistory.current)
      const maxFps = Math.max(...fpsHistory.current)
      const frameTime = 1000 / currentFps
      
      // Medir uso de memória
      let memoryUsage = 0
      if ('memory' in performance) {
        const memory = (performance as any).memory
        memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      }
      
      // Determinar complexidade de animação baseada na performance
      let animationComplexity: 'low' | 'medium' | 'high' = 'high'
      if (currentFps < finalConfig.fpsThreshold.critical) {
        animationComplexity = 'low'
      } else if (currentFps < finalConfig.fpsThreshold.warning) {
        animationComplexity = 'medium'
      }
      
      const newMetrics: PerformanceMetrics = {
        fps: currentFps,
        averageFps,
        minFps,
        maxFps,
        frameTime,
        memoryUsage,
        cpuUsage: Math.max(0, 100 - (currentFps / 60) * 100), // Estimativa baseada em FPS
        renderTime: renderStartTime.current > 0 ? now - renderStartTime.current : 0,
        scrollPerformance: Math.min(100, (currentFps / 60) * 100),
        animationComplexity,
        isThrottled: optimizations.throttleScroll,
        timestamp: now
      }
      
      setMetrics(newMetrics)
      
      // Adicionar ao histórico
      setPerformanceHistory(prev => {
        const newHistory = [...prev, newMetrics]
        return newHistory.slice(-300) // Manter últimos 5 minutos (300 amostras)
      })
      
      // Auto-otimização se habilitada
      if (finalConfig.autoOptimize) {
        autoOptimize(newMetrics)
      }
      
      // Reset contadores
      frameCount.current = 0
      lastTime.current = now
      renderStartTime.current = 0
    }
    
    if (isMonitoring) {
      rafId.current = requestAnimationFrame(measureFPS)
    }
  }, [isMonitoring, finalConfig, optimizations.throttleScroll])

  // Sistema de auto-otimização
  const autoOptimize = useCallback((currentMetrics: PerformanceMetrics) => {
    const newOptimizations: OptimizationActions = { ...optimizations }
    let hasChanges = false

    // Performance crítica - ativar todas as otimizações
    if (currentMetrics.fps < finalConfig.fpsThreshold.critical) {
      newOptimizations.reduceParticles = true
      newOptimizations.simplifyAnimations = true
      newOptimizations.disableBlur = true
      newOptimizations.reduceStagger = true
      newOptimizations.enableWillChange = true
      newOptimizations.throttleScroll = true
      newOptimizations.pauseNonCritical = true
      hasChanges = true
    }
    // Performance baixa - otimizações moderadas
    else if (currentMetrics.fps < finalConfig.fpsThreshold.warning) {
      newOptimizations.reduceParticles = true
      newOptimizations.simplifyAnimations = true
      newOptimizations.throttleScroll = true
      newOptimizations.enableWillChange = true
      hasChanges = true
    }
    // Performance boa - remover otimizações desnecessárias
    else if (currentMetrics.fps > finalConfig.fpsThreshold.good) {
      if (optimizations.reduceParticles || optimizations.simplifyAnimations) {
        newOptimizations.reduceParticles = false
        newOptimizations.simplifyAnimations = false
        newOptimizations.disableBlur = false
        newOptimizations.reduceStagger = false
        newOptimizations.throttleScroll = false
        newOptimizations.pauseNonCritical = false
        hasChanges = true
      }
    }

    // Otimizações baseadas em memória
    if (currentMetrics.memoryUsage > finalConfig.memoryThreshold.critical) {
      newOptimizations.pauseNonCritical = true
      newOptimizations.reduceParticles = true
      hasChanges = true
    }

    if (hasChanges) {
      setOptimizations(newOptimizations)
      applyOptimizations(newOptimizations)
    }
  }, [optimizations, finalConfig])

  // Aplicar otimizações ao DOM
  const applyOptimizations = useCallback((opts: OptimizationActions) => {
    const root = document.documentElement
    
    // Aplicar classes CSS para otimizações
    root.classList.toggle('reduce-particles', opts.reduceParticles)
    root.classList.toggle('simplify-animations', opts.simplifyAnimations)
    root.classList.toggle('disable-blur', opts.disableBlur)
    root.classList.toggle('reduce-stagger', opts.reduceStagger)
    root.classList.toggle('enable-will-change', opts.enableWillChange)
    root.classList.toggle('throttle-scroll', opts.throttleScroll)
    root.classList.toggle('pause-non-critical', opts.pauseNonCritical)
    
    // Aplicar otimizações via CSS custom properties
    root.style.setProperty('--animation-complexity', 
      opts.simplifyAnimations ? '0.5' : '1'
    )
    root.style.setProperty('--particle-count', 
      opts.reduceParticles ? '0.3' : '1'
    )
    root.style.setProperty('--stagger-delay', 
      opts.reduceStagger ? '0.05s' : '0.1s'
    )
  }, [])

  // Marcar início de render
  const markRenderStart = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  // Marcar início de scroll
  const markScrollStart = useCallback(() => {
    scrollStartTime.current = performance.now()
  }, [])

  // Obter métricas de debugging
  const getDebugInfo = useCallback(() => {
    return {
      metrics,
      optimizations,
      history: performanceHistory.slice(-10), // Últimas 10 amostras
      config: finalConfig,
      browserInfo: {
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        connection: (navigator as any).connection
      }
    }
  }, [metrics, optimizations, performanceHistory, finalConfig])

  // Forçar otimização manual
  const forceOptimization = useCallback((level: 'none' | 'light' | 'aggressive') => {
    let newOptimizations: OptimizationActions

    switch (level) {
      case 'none':
        newOptimizations = {
          reduceParticles: false,
          simplifyAnimations: false,
          disableBlur: false,
          reduceStagger: false,
          enableWillChange: false,
          throttleScroll: false,
          pauseNonCritical: false
        }
        break
      case 'light':
        newOptimizations = {
          reduceParticles: true,
          simplifyAnimations: false,
          disableBlur: false,
          reduceStagger: false,
          enableWillChange: true,
          throttleScroll: true,
          pauseNonCritical: false
        }
        break
      case 'aggressive':
        newOptimizations = {
          reduceParticles: true,
          simplifyAnimations: true,
          disableBlur: true,
          reduceStagger: true,
          enableWillChange: true,
          throttleScroll: true,
          pauseNonCritical: true
        }
        break
    }

    setOptimizations(newOptimizations)
    applyOptimizations(newOptimizations)
  }, [applyOptimizations])

  // Iniciar monitoramento
  const startMonitoring = useCallback(() => {
    if (!isMonitoring) {
      setIsMonitoring(true)
      lastTime.current = performance.now()
      frameCount.current = 0
      
      // Configurar observer de memória se disponível
      if ('PerformanceObserver' in window) {
        try {
          memoryObserver.current = new PerformanceObserver((list) => {
            // Processar entradas de performance
          })
          memoryObserver.current.observe({ entryTypes: ['measure', 'navigation'] })
        } catch (e) {
          console.warn('PerformanceObserver não suportado:', e)
        }
      }
    }
  }, [isMonitoring])

  // Parar monitoramento
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }
    if (memoryObserver.current) {
      memoryObserver.current.disconnect()
    }
  }, [])

  // Inicializar monitoramento
  useEffect(() => {
    startMonitoring()
    return stopMonitoring
  }, [startMonitoring, stopMonitoring])

  // Executar medição de FPS
  useEffect(() => {
    if (isMonitoring) {
      rafId.current = requestAnimationFrame(measureFPS)
    }
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isMonitoring, measureFPS])

  return {
    // Métricas
    metrics,
    optimizations,
    performanceHistory,
    isMonitoring,
    
    // Controles
    startMonitoring,
    stopMonitoring,
    forceOptimization,
    
    // Utilitários
    markRenderStart,
    markScrollStart,
    getDebugInfo,
    
    // Estado
    isOptimized: Object.values(optimizations).some(Boolean),
    performanceLevel: metrics.fps >= finalConfig.fpsThreshold.good ? 'good' : 
                     metrics.fps >= finalConfig.fpsThreshold.warning ? 'warning' : 'critical'
  }
}