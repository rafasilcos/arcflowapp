'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'

// Interface para configuração de controles
interface ControlsConfig {
  enableKeyboard: boolean
  enableGestures: boolean
  enableScrollVelocity: boolean
  keyboardSensitivity: number
  swipeSensitivity: number
  velocityThreshold: number
}

// Interface para estado dos gestos
interface GestureState {
  isActive: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  velocity: number
  direction: 'up' | 'down' | 'left' | 'right' | null
}

// Interface para métricas de scroll
interface ScrollMetrics {
  velocity: number
  acceleration: number
  lastScrollTime: number
  scrollDirection: 'up' | 'down'
  isRapidScroll: boolean
}

/**
 * Hook para controles de teclado e gestos no scroll infinito
 * Implementa navegação por setas, gestos de swipe e controle de velocidade
 */
export function useKeyboardGestureControls(
  goToSection: (index: number) => void,
  currentSection: number,
  totalSections: number = 8
) {
  // Estado dos controles
  const [config, setConfig] = useState<ControlsConfig>({
    enableKeyboard: true,
    enableGestures: true,
    enableScrollVelocity: true,
    keyboardSensitivity: 1,
    swipeSensitivity: 50,
    velocityThreshold: 1000
  })

  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null
  })

  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    velocity: 0,
    acceleration: 0,
    lastScrollTime: 0,
    scrollDirection: 'down',
    isRapidScroll: false
  })

  // Refs para controle de estado
  const lastKeyPressRef = useRef<number>(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const velocityHistoryRef = useRef<number[]>([])
  const isNavigatingRef = useRef<boolean>(false)

  // Detectar se é dispositivo móvel
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, [])

  // Calcular velocidade de scroll
  const calculateScrollVelocity = useCallback((currentTime: number, deltaY: number) => {
    const timeDelta = currentTime - scrollMetrics.lastScrollTime
    const velocity = Math.abs(deltaY) / Math.max(timeDelta, 1)
    
    // Manter histórico de velocidade para suavização
    velocityHistoryRef.current.push(velocity)
    if (velocityHistoryRef.current.length > 5) {
      velocityHistoryRef.current.shift()
    }
    
    // Calcular velocidade média
    const avgVelocity = velocityHistoryRef.current.reduce((sum, v) => sum + v, 0) / velocityHistoryRef.current.length
    
    return {
      instantVelocity: velocity,
      averageVelocity: avgVelocity,
      isRapid: avgVelocity > config.velocityThreshold
    }
  }, [scrollMetrics.lastScrollTime, config.velocityThreshold])

  // Navegação por teclado
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!config.enableKeyboard || isNavigatingRef.current) return

    const now = Date.now()
    const timeSinceLastPress = now - lastKeyPressRef.current

    // Throttle para evitar navegação muito rápida
    if (timeSinceLastPress < 300) return

    let targetSection = currentSection

    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Espaço
        event.preventDefault()
        targetSection = Math.min(currentSection + 1, totalSections - 1)
        break

      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        targetSection = Math.max(currentSection - 1, 0)
        break

      case 'Home':
        event.preventDefault()
        targetSection = 0
        break

      case 'End':
        event.preventDefault()
        targetSection = totalSections - 1
        break

      // Navegação numérica (1-8)
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
        event.preventDefault()
        const sectionNumber = parseInt(event.key) - 1
        if (sectionNumber >= 0 && sectionNumber < totalSections) {
          targetSection = sectionNumber
        }
        break

      default:
        return
    }

    if (targetSection !== currentSection) {
      console.log(`⌨️ Keyboard navigation: ${currentSection} → ${targetSection}`)
      lastKeyPressRef.current = now
      isNavigatingRef.current = true
      
      goToSection(targetSection)
      
      // Reset navigation flag após animação
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 1500)
    }
  }, [config.enableKeyboard, currentSection, totalSections, goToSection])

  // Controle de velocidade de scroll
  const handleScrollVelocity = useCallback((event: WheelEvent) => {
    if (!config.enableScrollVelocity) return

    const now = performance.now()
    const deltaY = event.deltaY
    const direction = deltaY > 0 ? 'down' : 'up'
    
    const velocityData = calculateScrollVelocity(now, deltaY)
    
    setScrollMetrics(prev => ({
      velocity: velocityData.averageVelocity,
      acceleration: velocityData.averageVelocity - prev.velocity,
      lastScrollTime: now,
      scrollDirection: direction,
      isRapidScroll: velocityData.isRapid
    }))

    // Se scroll rápido, acelerar transições
    if (velocityData.isRapid && !isNavigatingRef.current) {
      const targetSection = direction === 'down' 
        ? Math.min(currentSection + 1, totalSections - 1)
        : Math.max(currentSection - 1, 0)
      
      if (targetSection !== currentSection) {
        console.log(`🚀 Rapid scroll navigation: ${currentSection} → ${targetSection}`)
        event.preventDefault()
        isNavigatingRef.current = true
        
        goToSection(targetSection)
        
        setTimeout(() => {
          isNavigatingRef.current = false
        }, 1000)
      }
    }
  }, [config.enableScrollVelocity, calculateScrollVelocity, currentSection, totalSections, goToSection])

  // Gestos de touch - início
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!config.enableGestures || !isMobile()) return

    const touch = event.touches[0]
    if (!touch) return

    setGestureState(prev => ({
      ...prev,
      isActive: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null
    }))

    console.log('👆 Touch start:', { x: touch.clientX, y: touch.clientY })
  }, [config.enableGestures, isMobile])

  // Gestos de touch - movimento
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!config.enableGestures || !gestureState.isActive) return

    const touch = event.touches[0]
    if (!touch) return

    const deltaX = touch.clientX - gestureState.startX
    const deltaY = touch.clientY - gestureState.startY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / (performance.now() - scrollMetrics.lastScrollTime || 1)

    // Determinar direção principal
    let direction: 'up' | 'down' | 'left' | 'right' | null = null
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      direction = deltaY > 0 ? 'down' : 'up'
    } else {
      direction = deltaX > 0 ? 'right' : 'left'
    }

    setGestureState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
      velocity,
      direction
    }))

    // Prevenir scroll padrão se movimento vertical significativo
    if (Math.abs(deltaY) > 10) {
      event.preventDefault()
    }
  }, [config.enableGestures, gestureState.isActive, gestureState.startX, gestureState.startY, scrollMetrics.lastScrollTime])

  // Gestos de touch - fim
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!config.enableGestures || !gestureState.isActive) return

    const { deltaY, velocity, direction } = gestureState
    const minSwipeDistance = config.swipeSensitivity
    const minSwipeVelocity = 0.5

    console.log('👆 Touch end:', { deltaY, velocity, direction, minDistance: minSwipeDistance })

    // Verificar se é um swipe válido
    if (Math.abs(deltaY) > minSwipeDistance && velocity > minSwipeVelocity) {
      let targetSection = currentSection

      if (direction === 'up') {
        // Swipe para cima = próxima seção
        targetSection = Math.min(currentSection + 1, totalSections - 1)
      } else if (direction === 'down') {
        // Swipe para baixo = seção anterior
        targetSection = Math.max(currentSection - 1, 0)
      }

      if (targetSection !== currentSection) {
        console.log(`👆 Swipe navigation: ${currentSection} → ${targetSection} (${direction})`)
        event.preventDefault()
        isNavigatingRef.current = true
        
        goToSection(targetSection)
        
        setTimeout(() => {
          isNavigatingRef.current = false
        }, 1500)
      }
    }

    // Reset gesture state
    setGestureState(prev => ({
      ...prev,
      isActive: false,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null
    }))
  }, [config.enableGestures, config.swipeSensitivity, gestureState, currentSection, totalSections, goToSection])

  // Configurar event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🎮 Setting up keyboard and gesture controls...')

    // Event listeners para teclado
    const keydownHandler = (e: KeyboardEvent) => handleKeyboardNavigation(e)
    
    // Event listeners para scroll velocity
    const wheelHandler = (e: WheelEvent) => handleScrollVelocity(e)
    
    // Event listeners para gestos touch
    const touchStartHandler = (e: TouchEvent) => handleTouchStart(e)
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e)
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e)

    // Adicionar listeners
    document.addEventListener('keydown', keydownHandler)
    document.addEventListener('wheel', wheelHandler, { passive: false })
    
    if (isMobile()) {
      document.addEventListener('touchstart', touchStartHandler, { passive: false })
      document.addEventListener('touchmove', touchMoveHandler, { passive: false })
      document.addEventListener('touchend', touchEndHandler, { passive: false })
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', keydownHandler)
      document.removeEventListener('wheel', wheelHandler)
      
      if (isMobile()) {
        document.removeEventListener('touchstart', touchStartHandler)
        document.removeEventListener('touchmove', touchMoveHandler)
        document.removeEventListener('touchend', touchEndHandler)
      }
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      console.log('🧹 Keyboard and gesture controls cleaned up')
    }
  }, [handleKeyboardNavigation, handleScrollVelocity, handleTouchStart, handleTouchMove, handleTouchEnd, isMobile])

  // Métodos para configuração
  const updateConfig = useCallback((newConfig: Partial<ControlsConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
    console.log('⚙️ Controls config updated:', newConfig)
  }, [])

  // Método para mostrar ajuda de controles
  const showControlsHelp = useCallback(() => {
    const helpText = `
🎮 CONTROLES DISPONÍVEIS:

⌨️ TECLADO:
• ↑/↓ - Navegar entre seções
• Page Up/Down - Navegar entre seções
• Espaço - Próxima seção
• Home/End - Primeira/Última seção
• 1-8 - Ir para seção específica

👆 GESTOS (Mobile):
• Swipe vertical - Navegar entre seções
• Swipe rápido - Navegação acelerada

🖱️ MOUSE:
• Scroll rápido - Navegação automática
• Scroll suave - Controle manual
    `
    console.log(helpText)
    return helpText
  }, [])

  return {
    // Estado
    config,
    gestureState,
    scrollMetrics,
    
    // Métodos
    updateConfig,
    showControlsHelp,
    
    // Utilitários
    isMobile: isMobile(),
    isNavigating: isNavigatingRef.current,
    
    // Debug info
    debugInfo: {
      lastKeyPress: lastKeyPressRef.current,
      velocityHistory: velocityHistoryRef.current,
      currentGesture: gestureState.direction,
      scrollVelocity: scrollMetrics.velocity
    }
  }
}