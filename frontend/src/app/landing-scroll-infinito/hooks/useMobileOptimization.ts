'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

// Interface para métricas de performance
interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  devicePixelRatio: number
  connectionSpeed: 'slow' | 'medium' | 'fast'
  batteryLevel?: number
  isLowPowerMode?: boolean
}

// Interface para configurações de otimização
interface OptimizationConfig {
  enableReducedAnimations: boolean
  enableGPUAcceleration: boolean
  enableParticleReduction: boolean
  enableImageOptimization: boolean
  touchSensitivity: number
  scrollThrottleMs: number
  animationQuality: 'low' | 'medium' | 'high'
}

// Interface para detecção de dispositivo
interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isLowEndDevice: boolean
  screenSize: 'small' | 'medium' | 'large'
  orientation: 'portrait' | 'landscape'
  hasTouch: boolean
  supportsWebGL: boolean
  maxTouchPoints: number
}

/**
 * Hook para otimizações específicas de mobile
 * Implementa detecção automática de performance e ajustes dinâmicos
 */
export function useMobileOptimization() {
  // Estados principais
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    devicePixelRatio: 1,
    connectionSpeed: 'medium'
  })

  const [optimizationConfig, setOptimizationConfig] = useState<OptimizationConfig>({
    enableReducedAnimations: false,
    enableGPUAcceleration: true,
    enableParticleReduction: false,
    enableImageOptimization: false,
    touchSensitivity: 1,
    scrollThrottleMs: 16,
    animationQuality: 'high'
  })

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isLowEndDevice: false,
    screenSize: 'large',
    orientation: 'landscape',
    hasTouch: false,
    supportsWebGL: false,
    maxTouchPoints: 0
  })

  // Refs para controle
  const performanceMonitorRef = useRef<number>()
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 })
  const optimizationAppliedRef = useRef<boolean>(false)

  // Detectar informações do dispositivo
  const detectDeviceInfo = useCallback((): DeviceInfo => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isLowEndDevice: false,
        screenSize: 'large',
        orientation: 'landscape',
        hasTouch: false,
        supportsWebGL: false,
        maxTouchPoints: 0
      }
    }

    const userAgent = navigator?.userAgent?.toLowerCase() || ''
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
    
    // Detectar dispositivos de baixo desempenho
    const isLowEndDevice = (() => {
      // Verificar memória disponível (se suportado)
      const memory = (navigator as any).deviceMemory
      if (memory && memory <= 2) return true
      
      // Verificar CPU cores (se suportado)
      const cores = navigator.hardwareConcurrency
      if (cores && cores <= 2) return true
      
      // Verificar user agent para dispositivos conhecidamente lentos
      if (/android 4|android 5|iphone 5|iphone 6(?!s)/i.test(userAgent)) return true
      
      return false
    })()

    const screenWidth = window.innerWidth
    const screenSize: 'small' | 'medium' | 'large' = 
      screenWidth < 640 ? 'small' : 
      screenWidth < 1024 ? 'medium' : 'large'

    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const maxTouchPoints = navigator.maxTouchPoints || 0

    // Detectar suporte WebGL
    const supportsWebGL = (() => {
      try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      } catch {
        return false
      }
    })()

    return {
      isMobile,
      isTablet,
      isLowEndDevice,
      screenSize,
      orientation,
      hasTouch,
      supportsWebGL,
      maxTouchPoints
    }
  }, [])

  // Detectar velocidade de conexão
  const detectConnectionSpeed = useCallback((): 'slow' | 'medium' | 'fast' => {
    if (typeof navigator === 'undefined') return 'medium'
    
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    if (!connection) return 'medium'
    
    const effectiveType = connection.effectiveType
    const downlink = connection.downlink
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
      return 'slow'
    } else if (effectiveType === '3g' || downlink < 5) {
      return 'medium'
    } else {
      return 'fast'
    }
  }, [])

  // Monitorar FPS em tempo real
  const monitorFPS = useCallback(() => {
    const monitor = () => {
      fpsCounterRef.current.frames++
      const currentTime = performance.now()
      
      if (currentTime >= fpsCounterRef.current.lastTime + 1000) {
        const fps = Math.round(
          (fpsCounterRef.current.frames * 1000) / 
          (currentTime - fpsCounterRef.current.lastTime)
        )
        
        setPerformanceMetrics(prev => ({ ...prev, fps }))
        
        fpsCounterRef.current.frames = 0
        fpsCounterRef.current.lastTime = currentTime
      }
      
      performanceMonitorRef.current = requestAnimationFrame(monitor)
    }
    
    performanceMonitorRef.current = requestAnimationFrame(monitor)
  }, [])

  // Detectar uso de memória
  const detectMemoryUsage = useCallback((): number => {
    if (typeof performance === 'undefined' || !(performance as any).memory) return 0
    
    const memory = (performance as any).memory
    return Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
  }, [])

  // Detectar nível de bateria
  const detectBatteryInfo = useCallback(async () => {
    if (typeof navigator === 'undefined' || !(navigator as any).getBattery) return
    
    try {
      const battery = await (navigator as any).getBattery()
      setPerformanceMetrics(prev => ({
        ...prev,
        batteryLevel: Math.round(battery.level * 100),
        isLowPowerMode: battery.level < 0.2
      }))
    } catch {
      // Battery API não suportada
    }
  }, [])

  // Aplicar otimizações baseadas na performance
  const applyOptimizations = useCallback((metrics: PerformanceMetrics, device: DeviceInfo) => {
    const shouldOptimize = 
      metrics.fps < 45 || 
      device.isLowEndDevice || 
      metrics.connectionSpeed === 'slow' ||
      metrics.memoryUsage > 80 ||
      metrics.isLowPowerMode

    if (shouldOptimize && !optimizationAppliedRef.current) {
      console.log('📱 Aplicando otimizações para mobile/dispositivo lento...')
      
      const newConfig: OptimizationConfig = {
        enableReducedAnimations: true,
        enableGPUAcceleration: device.supportsWebGL,
        enableParticleReduction: true,
        enableImageOptimization: true,
        touchSensitivity: device.isMobile ? 0.8 : 1,
        scrollThrottleMs: device.isLowEndDevice ? 32 : 16,
        animationQuality: metrics.fps < 30 ? 'low' : metrics.fps < 45 ? 'medium' : 'high'
      }
      
      setOptimizationConfig(newConfig)
      optimizationAppliedRef.current = true
      
      // Aplicar classes CSS para otimizações
      document.documentElement.classList.add('mobile-optimized')
      
      if (device.isLowEndDevice) {
        document.documentElement.classList.add('low-end-device')
      }
      
      if (metrics.fps < 30) {
        document.documentElement.classList.add('low-performance')
      }
      
      if (device.isMobile) {
        document.documentElement.classList.add('mobile-device')
      }
      
    } else if (!shouldOptimize && optimizationAppliedRef.current) {
      console.log('📱 Removendo otimizações - performance melhorou')
      
      setOptimizationConfig({
        enableReducedAnimations: false,
        enableGPUAcceleration: true,
        enableParticleReduction: false,
        enableImageOptimization: false,
        touchSensitivity: 1,
        scrollThrottleMs: 16,
        animationQuality: 'high'
      })
      
      optimizationAppliedRef.current = false
      
      // Remover classes CSS
      document.documentElement.classList.remove('mobile-optimized', 'low-end-device', 'low-performance', 'mobile-device')
    }
  }, [])

  // Otimizar touch events
  const optimizeTouchEvents = useCallback(() => {
    if (!deviceInfo.hasTouch) return

    // Configurar passive listeners para melhor performance
    const touchOptions = { passive: true, capture: false }
    
    // Prevenir zoom em double tap (iOS)
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }
    
    document.addEventListener('touchend', preventZoom, touchOptions)
    
    // Otimizar scroll em iOS
    document.body.style.webkitOverflowScrolling = 'touch'
    
    return () => {
      document.removeEventListener('touchend', preventZoom)
    }
  }, [deviceInfo.hasTouch])

  // Reduzir complexidade de animações
  const reduceAnimationComplexity = useCallback(() => {
    if (!optimizationConfig.enableReducedAnimations) return

    // Reduzir partículas flutuantes
    const particles = document.querySelectorAll('.floating-particle')
    particles.forEach((particle, index) => {
      if (index % 2 === 0) {
        (particle as HTMLElement).style.display = 'none'
      }
    })

    // Simplificar gradientes de fundo
    const gradients = document.querySelectorAll('.background-gradient')
    gradients.forEach(gradient => {
      (gradient as HTMLElement).style.filter = 'blur(0px)'
    })

    // Reduzir stagger em animações
    document.documentElement.style.setProperty('--stagger-delay', '0.05s')
    
    console.log('🎨 Complexidade de animações reduzida para melhor performance')
  }, [optimizationConfig.enableReducedAnimations])

  // Inicialização
  useEffect(() => {
    console.log('📱 Inicializando otimizações para mobile...')
    
    // Detectar informações do dispositivo
    const device = detectDeviceInfo()
    setDeviceInfo(device)
    
    // Detectar velocidade de conexão
    const connectionSpeed = detectConnectionSpeed()
    
    // Inicializar métricas
    setPerformanceMetrics(prev => ({
      ...prev,
      devicePixelRatio: window.devicePixelRatio || 1,
      connectionSpeed,
      memoryUsage: detectMemoryUsage()
    }))
    
    // Detectar informações de bateria
    detectBatteryInfo()
    
    // Iniciar monitoramento de FPS
    monitorFPS()
    
    // Otimizar touch events
    const touchCleanup = optimizeTouchEvents()
    
    console.log('📱 Dispositivo detectado:', device)
    console.log('📡 Velocidade de conexão:', connectionSpeed)
    
    return () => {
      if (performanceMonitorRef.current) {
        cancelAnimationFrame(performanceMonitorRef.current)
      }
      touchCleanup?.()
    }
  }, [detectDeviceInfo, detectConnectionSpeed, detectMemoryUsage, detectBatteryInfo, monitorFPS, optimizeTouchEvents])

  // Aplicar otimizações quando métricas mudarem
  useEffect(() => {
    applyOptimizations(performanceMetrics, deviceInfo)
  }, [performanceMetrics, deviceInfo, applyOptimizations])

  // Aplicar redução de complexidade quando configuração mudar
  useEffect(() => {
    reduceAnimationComplexity()
  }, [optimizationConfig.enableReducedAnimations, reduceAnimationComplexity])

  // Monitorar mudanças de orientação
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        setDeviceInfo(prev => ({ ...prev, orientation: newOrientation }))
        console.log('📱 Orientação alterada para:', newOrientation)
      }, 100)
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  // Métodos públicos
  const forceOptimization = useCallback((enable: boolean) => {
    if (enable) {
      setOptimizationConfig({
        enableReducedAnimations: true,
        enableGPUAcceleration: deviceInfo.supportsWebGL,
        enableParticleReduction: true,
        enableImageOptimization: true,
        touchSensitivity: 0.7,
        scrollThrottleMs: 32,
        animationQuality: 'low'
      })
      document.documentElement.classList.add('force-optimized')
      console.log('📱 Otimizações forçadas ativadas')
    } else {
      setOptimizationConfig({
        enableReducedAnimations: false,
        enableGPUAcceleration: true,
        enableParticleReduction: false,
        enableImageOptimization: false,
        touchSensitivity: 1,
        scrollThrottleMs: 16,
        animationQuality: 'high'
      })
      document.documentElement.classList.remove('force-optimized')
      console.log('📱 Otimizações forçadas desativadas')
    }
  }, [deviceInfo.supportsWebGL])

  const getOptimizationSummary = useCallback(() => {
    return {
      isOptimized: optimizationAppliedRef.current,
      reason: performanceMetrics.fps < 45 ? 'Low FPS' :
              deviceInfo.isLowEndDevice ? 'Low-end device' :
              performanceMetrics.connectionSpeed === 'slow' ? 'Slow connection' :
              performanceMetrics.memoryUsage > 80 ? 'High memory usage' :
              performanceMetrics.isLowPowerMode ? 'Low power mode' : 'None',
      optimizations: Object.entries(optimizationConfig)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
    }
  }, [performanceMetrics, deviceInfo, optimizationConfig])

  return {
    // Estados
    performanceMetrics,
    optimizationConfig,
    deviceInfo,
    
    // Métodos
    forceOptimization,
    getOptimizationSummary,
    
    // Utilitários
    isOptimized: optimizationAppliedRef.current,
    isMobile: deviceInfo.isMobile,
    isLowEndDevice: deviceInfo.isLowEndDevice,
    
    // Debug info
    debugInfo: {
      fps: performanceMetrics.fps,
      memoryUsage: performanceMetrics.memoryUsage,
      connectionSpeed: performanceMetrics.connectionSpeed,
      batteryLevel: performanceMetrics.batteryLevel,
      animationQuality: optimizationConfig.animationQuality,
      touchSensitivity: optimizationConfig.touchSensitivity
    }
  }
}