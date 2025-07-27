'use client'

import { useEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'

interface GPUAccelerationConfig {
  enableForceGPU: boolean
  enableWillChange: boolean
  enableTransform3D: boolean
  enableBackfaceVisibility: boolean
  enablePerspective: boolean
  autoCleanup: boolean
  debugMode: boolean
}

interface GPUOptimizedElement {
  element: HTMLElement
  originalStyles: Partial<CSSStyleDeclaration>
  isOptimized: boolean
  willChangeProperties: string[]
  animationState: 'idle' | 'animating' | 'complete'
}

const DEFAULT_CONFIG: GPUAccelerationConfig = {
  enableForceGPU: true,
  enableWillChange: true,
  enableTransform3D: true,
  enableBackfaceVisibility: true,
  enablePerspective: true,
  autoCleanup: true,
  debugMode: false
}

/**
 * Hook para otimização de GPU e aceleração de hardware
 * Aplica transform3d, will-change e outras otimizações de performance
 */
export function useGPUAcceleration(config: Partial<GPUAccelerationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const optimizedElements = useRef<Map<string, GPUOptimizedElement>>(new Map())
  const cleanupTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const isInitialized = useRef(false)

  // Aplicar aceleração GPU a um elemento
  const applyGPUAcceleration = useCallback((
    element: HTMLElement, 
    elementId: string,
    willChangeProps: string[] = ['transform', 'opacity']
  ) => {
    if (!element || optimizedElements.current.has(elementId)) return

    // Salvar estilos originais
    const originalStyles: Partial<CSSStyleDeclaration> = {
      transform: element.style.transform,
      willChange: element.style.willChange,
      backfaceVisibility: element.style.backfaceVisibility,
      perspective: element.style.perspective,
      transformStyle: element.style.transformStyle
    }

    // Aplicar otimizações de GPU
    if (finalConfig.enableTransform3D) {
      // Forçar aceleração GPU com transform3d(0,0,0)
      const currentTransform = element.style.transform || ''
      if (!currentTransform.includes('translate3d')) {
        element.style.transform = currentTransform + ' translate3d(0,0,0)'
      }
    }

    if (finalConfig.enableWillChange) {
      // Aplicar will-change para propriedades que serão animadas
      element.style.willChange = willChangeProps.join(', ')
    }

    if (finalConfig.enableBackfaceVisibility) {
      // Ocultar face traseira para melhor performance - backface-visibility: hidden
      element.style.setProperty('backface-visibility', 'hidden')
    }

    if (finalConfig.enablePerspective) {
      // Adicionar perspectiva para ativar aceleração 3D - perspective: 1000px
      element.style.setProperty('perspective', '1000px')
      element.style.transformStyle = 'preserve-3d'
    }

    // Registrar elemento otimizado
    optimizedElements.current.set(elementId, {
      element,
      originalStyles,
      isOptimized: true,
      willChangeProperties: willChangeProps,
      animationState: 'idle'
    })

    if (finalConfig.debugMode) {
      console.log(`🚀 GPU acceleration applied to: ${elementId}`, {
        willChange: willChangeProps,
        transform: element.style.transform
      })
    }
  }, [finalConfig])

  // Remover aceleração GPU de um elemento
  const removeGPUAcceleration = useCallback((elementId: string) => {
    const optimizedElement = optimizedElements.current.get(elementId)
    if (!optimizedElement) return

    const { element, originalStyles } = optimizedElement

    // Restaurar estilos originais
    Object.entries(originalStyles).forEach(([property, value]) => {
      if (value !== undefined) {
        ;(element.style as any)[property] = value
      } else {
        element.style.removeProperty(property.replace(/([A-Z])/g, '-$1').toLowerCase())
      }
    })

    // Limpar will-change para economizar recursos
    element.style.willChange = 'auto'

    optimizedElements.current.delete(elementId)

    if (finalConfig.debugMode) {
      console.log(`🧹 GPU acceleration removed from: ${elementId}`)
    }
  }, [finalConfig.debugMode])

  // Otimizar will-change dinamicamente baseado no estado da animação
  const optimizeWillChange = useCallback((
    elementId: string, 
    animationState: 'start' | 'end' | 'update',
    properties?: string[]
  ) => {
    const optimizedElement = optimizedElements.current.get(elementId)
    if (!optimizedElement) return

    const { element } = optimizedElement

    switch (animationState) {
      case 'start':
        // Aplicar will-change no início da animação
        const willChangeProps = properties || optimizedElement.willChangeProperties
        element.style.willChange = willChangeProps.join(', ')
        optimizedElement.animationState = 'animating'
        
        // Cancelar cleanup automático se existir
        const existingTimeout = cleanupTimeouts.current.get(elementId)
        if (existingTimeout) {
          clearTimeout(existingTimeout)
          cleanupTimeouts.current.delete(elementId)
        }
        break

      case 'end':
        // Remover will-change no final da animação para economizar recursos - will-change: auto
        if (finalConfig.autoCleanup) {
          const timeout = setTimeout(() => {
            element.style.setProperty('will-change', 'auto')
            optimizedElement.animationState = 'complete'
            cleanupTimeouts.current.delete(elementId)
          }, 100) // Pequeno delay para garantir que a animação terminou
          
          cleanupTimeouts.current.set(elementId, timeout)
        }
        break

      case 'update':
        // Atualizar propriedades will-change durante animação
        if (properties && optimizedElement.animationState === 'animating') {
          element.style.willChange = properties.join(', ')
          optimizedElement.willChangeProperties = properties
        }
        break
    }

    if (finalConfig.debugMode) {
      console.log(`🎯 Will-change optimized for ${elementId}: ${animationState}`, {
        willChange: element.style.willChange,
        state: optimizedElement.animationState
      })
    }
  }, [finalConfig])

  // Aplicar otimizações em lote para múltiplos elementos
  const batchOptimizeElements = useCallback((
    elements: { element: HTMLElement; id: string; willChange?: string[] }[]
  ) => {
    elements.forEach(({ element, id, willChange }) => {
      applyGPUAcceleration(element, id, willChange)
    })

    if (finalConfig.debugMode) {
      console.log(`🚀 Batch GPU optimization applied to ${elements.length} elements`)
    }
  }, [applyGPUAcceleration, finalConfig.debugMode])

  // Otimizar elementos de scroll infinito
  const optimizeScrollElements = useCallback(() => {
    // Otimizar container principal
    const scrollContainer = document.getElementById('scroll-infinite-container')
    if (scrollContainer) {
      applyGPUAcceleration(scrollContainer, 'scroll-container', ['transform'])
    }

    // Otimizar seções
    const sections = document.querySelectorAll('.scroll-section, [id^="section-"]')
    sections.forEach((section, index) => {
      if (section instanceof HTMLElement) {
        applyGPUAcceleration(
          section, 
          `section-${index}`, 
          ['transform', 'opacity', 'scale']
        )
      }
    })

    // Otimizar elementos animados
    const animatedElements = document.querySelectorAll(
      '.animate-element, .glass-card, .feature-card, .gsap-element'
    )
    animatedElements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        applyGPUAcceleration(
          element, 
          `animated-${index}`, 
          ['transform', 'opacity', 'scale', 'rotateX', 'rotateY']
        )
      }
    })

    if (finalConfig.debugMode) {
      console.log(`🚀 Scroll elements optimized: ${sections.length} sections, ${animatedElements.length} animated elements`)
    }
  }, [applyGPUAcceleration, finalConfig.debugMode])

  // Integração com GSAP para otimização automática
  const setupGSAPIntegration = useCallback(() => {
    // Configurar GSAP para usar aceleração GPU por padrão - force3D: true
    gsap.config({
      force3D: finalConfig.enableForceGPU,
      nullTargetWarn: false
    })

    // Configurar defaults do GSAP para performance - force3D: true
    gsap.defaults({
      force3D: true,
      transformOrigin: 'center center',
      ease: 'power2.out'
    })

    // Hook para otimizar will-change automaticamente
    gsap.registerEffect({
      name: 'optimizedTo',
      effect: (targets: any, config: any) => {
        const tl = gsap.timeline()
        
        // Aplicar will-change no início
        tl.call(() => {
          gsap.utils.toArray(targets).forEach((target: HTMLElement, index: number) => {
            const elementId = target.id || `gsap-target-${index}`
            optimizeWillChange(elementId, 'start', Object.keys(config.vars || {}))
          })
        })
        
        // Executar animação
        tl.to(targets, config)
        
        // Remover will-change no final
        tl.call(() => {
          gsap.utils.toArray(targets).forEach((target: HTMLElement, index: number) => {
            const elementId = target.id || `gsap-target-${index}`
            optimizeWillChange(elementId, 'end')
          })
        })
        
        return tl
      },
      defaults: { duration: 1 },
      extendTimeline: true
    })

    if (finalConfig.debugMode) {
      console.log('🎬 GSAP integration configured for GPU optimization')
    }
  }, [finalConfig, optimizeWillChange])

  // Monitorar performance e ajustar otimizações
  const monitorAndAdjust = useCallback(() => {
    let frameCount = 0
    let lastTime = performance.now()
    
    const checkPerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        // Ajustar otimizações baseado na performance
        if (fps < 30) {
          // Performance baixa - aplicar otimizações agressivas
          document.documentElement.classList.add('gpu-accelerated', 'enable-will-change')
          
          if (finalConfig.debugMode) {
            console.warn(`⚠️ Low FPS detected (${fps}), applying aggressive GPU optimizations`)
          }
        } else if (fps > 50) {
          // Performance boa - remover otimizações desnecessárias se aplicável
          if (finalConfig.autoCleanup) {
            // Manter otimizações básicas mas limpar will-change desnecessários
            optimizedElements.current.forEach((element, id) => {
              if (element.animationState === 'complete') {
                element.element.style.willChange = 'auto'
              }
            })
          }
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(checkPerformance)
    }
    
    requestAnimationFrame(checkPerformance)
  }, [finalConfig])

  // Cleanup geral
  const cleanup = useCallback(() => {
    // Limpar todos os timeouts
    cleanupTimeouts.current.forEach(timeout => clearTimeout(timeout))
    cleanupTimeouts.current.clear()

    // Remover otimizações de todos os elementos
    optimizedElements.current.forEach((_, elementId) => {
      removeGPUAcceleration(elementId)
    })

    // Remover classes CSS globais
    document.documentElement.classList.remove('gpu-accelerated', 'enable-will-change')

    if (finalConfig.debugMode) {
      console.log('🧹 GPU acceleration cleanup completed')
    }
  }, [removeGPUAcceleration, finalConfig.debugMode])

  // Inicialização
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    console.log('🚀 Initializing GPU Acceleration System...')

    // Aplicar classes CSS globais
    document.documentElement.classList.add('gpu-accelerated')
    if (finalConfig.enableWillChange) {
      document.documentElement.classList.add('enable-will-change')
    }

    // Configurar GSAP
    setupGSAPIntegration()

    // Otimizar elementos existentes após DOM estar pronto
    const timer = setTimeout(() => {
      optimizeScrollElements()
      monitorAndAdjust()
      isInitialized.current = true
      console.log('✅ GPU Acceleration System initialized')
    }, 300)

    return () => {
      clearTimeout(timer)
      cleanup()
      isInitialized.current = false
    }
  }, [setupGSAPIntegration, optimizeScrollElements, monitorAndAdjust, cleanup, finalConfig])

  return {
    // Core methods
    applyGPUAcceleration,
    removeGPUAcceleration,
    optimizeWillChange,
    batchOptimizeElements,
    
    // Specialized methods
    optimizeScrollElements,
    
    // State
    optimizedElements: Array.from(optimizedElements.current.keys()),
    isInitialized: isInitialized.current,
    
    // Utilities
    cleanup
  }
}