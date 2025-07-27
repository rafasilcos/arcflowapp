'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

// Interface para configuração de gestos
interface TouchGestureConfig {
  swipeThreshold: number
  velocityThreshold: number
  maxTouchDuration: number
  preventDefaultScroll: boolean
  enableMultiTouch: boolean
  touchSensitivity: number
}

// Interface para estado do gesto
interface TouchGestureState {
  isActive: boolean
  startTime: number
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  velocity: number
  direction: 'up' | 'down' | 'left' | 'right' | null
  touchCount: number
  isSwipe: boolean
  isPinch: boolean
}

// Interface para métricas de performance de touch
interface TouchPerformanceMetrics {
  averageResponseTime: number
  touchEventCount: number
  droppedTouchEvents: number
  lastTouchLatency: number
}

/**
 * Hook otimizado para gestos de touch em dispositivos móveis
 * Implementa detecção avançada de gestos com otimizações de performance
 */
export function useTouchGestureOptimization(
  onSwipeUp: () => void,
  onSwipeDown: () => void,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  // Estados
  const [config, setConfig] = useState<TouchGestureConfig>({
    swipeThreshold: 50,
    velocityThreshold: 0.5,
    maxTouchDuration: 1000,
    preventDefaultScroll: true,
    enableMultiTouch: false,
    touchSensitivity: 1
  })

  const [gestureState, setGestureState] = useState<TouchGestureState>({
    isActive: false,
    startTime: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null,
    touchCount: 0,
    isSwipe: false,
    isPinch: false
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<TouchPerformanceMetrics>({
    averageResponseTime: 0,
    touchEventCount: 0,
    droppedTouchEvents: 0,
    lastTouchLatency: 0
  })

  // Refs para otimização
  const touchStartTimeRef = useRef<number>(0)
  const touchHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([])
  const rafIdRef = useRef<number>()
  const isProcessingRef = useRef<boolean>(false)
  const responseTimesRef = useRef<number[]>([])

  // Detectar se é dispositivo móvel
  const isMobileDevice = useCallback(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, [])

  // Calcular velocidade do gesto
  const calculateVelocity = useCallback((deltaX: number, deltaY: number, deltaTime: number): number => {
    if (deltaTime === 0) return 0
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    return distance / deltaTime
  }, [])

  // Determinar direção do gesto
  const determineDirection = useCallback((deltaX: number, deltaY: number): 'up' | 'down' | 'left' | 'right' | null => {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    
    // Verificar se o movimento é significativo
    if (absX < 10 && absY < 10) return null
    
    // Determinar direção principal
    if (absY > absX) {
      return deltaY > 0 ? 'down' : 'up'
    } else {
      return deltaX > 0 ? 'right' : 'left'
    }
  }, [])

  // Otimizar evento de touch usando RAF
  const optimizedTouchHandler = useCallback((handler: () => void) => {
    if (isProcessingRef.current) return
    
    isProcessingRef.current = true
    rafIdRef.current = requestAnimationFrame(() => {
      handler()
      isProcessingRef.current = false
    })
  }, [])

  // Handler para início do touch
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isMobileDevice()) return
    
    const startTime = performance.now()
    touchStartTimeRef.current = startTime
    
    const touch = event.touches[0]
    if (!touch) return

    // Atualizar métricas de performance
    setPerformanceMetrics(prev => ({
      ...prev,
      touchEventCount: prev.touchEventCount + 1
    }))

    optimizedTouchHandler(() => {
      const newState: TouchGestureState = {
        isActive: true,
        startTime,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        velocity: 0,
        direction: null,
        touchCount: event.touches.length,
        isSwipe: false,
        isPinch: event.touches.length > 1
      }

      setGestureState(newState)

      // Inicializar histórico de touch
      touchHistoryRef.current = [{
        x: touch.clientX,
        y: touch.clientY,
        time: startTime
      }]

      // Prevenir scroll padrão se configurado
      if (config.preventDefaultScroll) {
        event.preventDefault()
      }

      console.log('👆 Touch start otimizado:', {
        x: touch.clientX,
        y: touch.clientY,
        touchCount: event.touches.length
      })
    })
  }, [isMobileDevice, optimizedTouchHandler, config.preventDefaultScroll])

  // Handler para movimento do touch
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!gestureState.isActive) return
    
    const touch = event.touches[0]
    if (!touch) return

    const currentTime = performance.now()
    const responseTime = currentTime - touchStartTimeRef.current

    optimizedTouchHandler(() => {
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY
      const deltaTime = currentTime - gestureState.startTime
      
      const velocity = calculateVelocity(deltaX, deltaY, deltaTime)
      const direction = determineDirection(deltaX, deltaY)

      // Atualizar histórico (manter apenas últimos 5 pontos)
      touchHistoryRef.current.push({
        x: touch.clientX,
        y: touch.clientY,
        time: currentTime
      })
      
      if (touchHistoryRef.current.length > 5) {
        touchHistoryRef.current.shift()
      }

      // Atualizar estado
      setGestureState(prev => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: deltaX * config.touchSensitivity,
        deltaY: deltaY * config.touchSensitivity,
        velocity,
        direction,
        touchCount: event.touches.length,
        isPinch: event.touches.length > 1
      }))

      // Atualizar métricas de performance
      responseTimesRef.current.push(responseTime)
      if (responseTimesRef.current.length > 10) {
        responseTimesRef.current.shift()
      }

      const avgResponseTime = responseTimesRef.current.reduce((sum, time) => sum + time, 0) / responseTimesRef.current.length

      setPerformanceMetrics(prev => ({
        ...prev,
        lastTouchLatency: responseTime,
        averageResponseTime: avgResponseTime
      }))

      // Prevenir scroll se movimento vertical significativo
      if (Math.abs(deltaY) > 20 && config.preventDefaultScroll) {
        event.preventDefault()
      }
    })
  }, [gestureState, calculateVelocity, determineDirection, optimizedTouchHandler, config])

  // Handler para fim do touch
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!gestureState.isActive) return

    const endTime = performance.now()
    const totalDuration = endTime - gestureState.startTime

    optimizedTouchHandler(() => {
      const { deltaX, deltaY, velocity, direction } = gestureState
      
      // Verificar se é um swipe válido
      const isValidSwipe = 
        Math.abs(deltaX) > config.swipeThreshold || 
        Math.abs(deltaY) > config.swipeThreshold
      
      const isQuickSwipe = velocity > config.velocityThreshold
      const isWithinTimeLimit = totalDuration < config.maxTouchDuration

      const isSwipe = isValidSwipe && isQuickSwipe && isWithinTimeLimit

      console.log('👆 Touch end otimizado:', {
        deltaX,
        deltaY,
        velocity,
        direction,
        isSwipe,
        duration: totalDuration
      })

      if (isSwipe && direction) {
        // Executar ação baseada na direção
        switch (direction) {
          case 'up':
            console.log('👆 Swipe up detectado')
            onSwipeUp()
            break
          case 'down':
            console.log('👆 Swipe down detectado')
            onSwipeDown()
            break
          case 'left':
            if (onSwipeLeft) {
              console.log('👆 Swipe left detectado')
              onSwipeLeft()
            }
            break
          case 'right':
            if (onSwipeRight) {
              console.log('👆 Swipe right detectado')
              onSwipeRight()
            }
            break
        }

        // Prevenir comportamento padrão para swipes válidos
        event.preventDefault()
      }

      // Reset do estado
      setGestureState(prev => ({
        ...prev,
        isActive: false,
        deltaX: 0,
        deltaY: 0,
        velocity: 0,
        direction: null,
        isSwipe,
        isPinch: false
      }))

      // Limpar histórico
      touchHistoryRef.current = []
    })
  }, [gestureState, config, optimizedTouchHandler, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight])

  // Handler para cancelamento do touch
  const handleTouchCancel = useCallback((event: TouchEvent) => {
    console.log('👆 Touch cancelado')
    
    setGestureState(prev => ({
      ...prev,
      isActive: false,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null,
      isSwipe: false,
      isPinch: false
    }))

    touchHistoryRef.current = []
    
    setPerformanceMetrics(prev => ({
      ...prev,
      droppedTouchEvents: prev.droppedTouchEvents + 1
    }))
  }, [])

  // Configurar event listeners otimizados
  useEffect(() => {
    if (!isMobileDevice()) {
      console.log('📱 Não é dispositivo móvel - touch gestures desabilitados')
      return
    }

    console.log('📱 Configurando touch gestures otimizados...')

    // Opções otimizadas para performance
    const passiveOptions = { passive: false, capture: false }
    const activeOptions = { passive: true, capture: false }

    // Event listeners
    document.addEventListener('touchstart', handleTouchStart, passiveOptions)
    document.addEventListener('touchmove', handleTouchMove, passiveOptions)
    document.addEventListener('touchend', handleTouchEnd, activeOptions)
    document.addEventListener('touchcancel', handleTouchCancel, activeOptions)

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchCancel)
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      
      console.log('📱 Touch gestures limpos')
    }
  }, [isMobileDevice, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel])

  // Métodos públicos
  const updateConfig = useCallback((newConfig: Partial<TouchGestureConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
    console.log('📱 Configuração de touch atualizada:', newConfig)
  }, [])

  const resetMetrics = useCallback(() => {
    setPerformanceMetrics({
      averageResponseTime: 0,
      touchEventCount: 0,
      droppedTouchEvents: 0,
      lastTouchLatency: 0
    })
    responseTimesRef.current = []
    console.log('📱 Métricas de touch resetadas')
  }, [])

  const getGestureInfo = useCallback(() => {
    return {
      isActive: gestureState.isActive,
      direction: gestureState.direction,
      velocity: gestureState.velocity,
      touchCount: gestureState.touchCount,
      isPinch: gestureState.isPinch,
      isSwipe: gestureState.isSwipe
    }
  }, [gestureState])

  const getPerformanceReport = useCallback(() => {
    const dropRate = performanceMetrics.touchEventCount > 0 
      ? (performanceMetrics.droppedTouchEvents / performanceMetrics.touchEventCount) * 100 
      : 0

    return {
      ...performanceMetrics,
      dropRate: Math.round(dropRate * 100) / 100,
      isPerformanceGood: performanceMetrics.averageResponseTime < 16 && dropRate < 5
    }
  }, [performanceMetrics])

  return {
    // Estados
    config,
    gestureState,
    performanceMetrics,
    
    // Métodos
    updateConfig,
    resetMetrics,
    getGestureInfo,
    getPerformanceReport,
    
    // Utilitários
    isMobile: isMobileDevice(),
    isGestureActive: gestureState.isActive,
    currentDirection: gestureState.direction,
    
    // Debug info
    debugInfo: {
      touchHistory: touchHistoryRef.current,
      responseTime: performanceMetrics.lastTouchLatency,
      avgResponseTime: performanceMetrics.averageResponseTime,
      touchCount: performanceMetrics.touchEventCount,
      dropRate: performanceMetrics.touchEventCount > 0 
        ? Math.round((performanceMetrics.droppedTouchEvents / performanceMetrics.touchEventCount) * 100)
        : 0
    }
  }
}