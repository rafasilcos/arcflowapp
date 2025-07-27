'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

interface LazyAnimationConfig {
  threshold: number // Intersection threshold (0-1)
  rootMargin: string // Root margin for intersection observer
  enablePreloading: boolean // Preload animations before they're needed
  preloadDistance: number // Distance in pixels to preload
  enablePriority: boolean // Enable priority-based loading
  maxConcurrentLoads: number // Maximum concurrent animation loads
  debugMode: boolean
}

interface AnimationDefinition {
  id: string
  element: HTMLElement
  animationFactory: () => gsap.core.Timeline | Promise<gsap.core.Timeline>
  priority: 'low' | 'medium' | 'high'
  isComplex: boolean // Whether this is a complex animation that should be lazy loaded
  dependencies?: string[] // Other animations this depends on
  preloadCondition?: () => boolean // Custom condition for preloading
}

interface LoadedAnimation {
  id: string
  timeline: gsap.core.Timeline
  isLoaded: boolean
  isActive: boolean
  loadTime: number
  element: HTMLElement
}

const DEFAULT_CONFIG: LazyAnimationConfig = {
  threshold: 0.1,
  rootMargin: '50px',
  enablePreloading: true,
  preloadDistance: 200,
  enablePriority: true,
  maxConcurrentLoads: 3,
  debugMode: false
}

/**
 * Hook para carregamento lazy de animações complexas
 * Carrega animações apenas quando necessário para otimizar performance
 */
export function useLazyAnimations(config: Partial<LazyAnimationConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const [loadedAnimations, setLoadedAnimations] = useState<Map<string, LoadedAnimation>>(new Map())
  const [loadingQueue, setLoadingQueue] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const animationDefinitions = useRef<Map<string, AnimationDefinition>>(new Map())
  const intersectionObserver = useRef<IntersectionObserver | null>(null)
  const loadingPromises = useRef<Map<string, Promise<void>>>(new Map())
  const currentlyLoading = useRef<Set<string>>(new Set())
  const preloadedAnimations = useRef<Set<string>>(new Set())

  // Registrar uma animação para carregamento lazy
  const registerLazyAnimation = useCallback((
    id: string,
    element: HTMLElement,
    animationFactory: () => gsap.core.Timeline | Promise<gsap.core.Timeline>,
    options: {
      priority?: 'low' | 'medium' | 'high'
      isComplex?: boolean
      dependencies?: string[]
      preloadCondition?: () => boolean
    } = {}
  ) => {
    const animationDef: AnimationDefinition = {
      id,
      element,
      animationFactory,
      priority: options.priority || 'medium',
      isComplex: options.isComplex || false,
      dependencies: options.dependencies || [],
      preloadCondition: options.preloadCondition
    }

    animationDefinitions.current.set(id, animationDef)

    // Se não é complexa, carregar imediatamente
    if (!animationDef.isComplex) {
      loadAnimation(id)
    } else {
      // Observar elemento para carregamento lazy
      if (intersectionObserver.current) {
        intersectionObserver.current.observe(element)
      }
    }

    if (finalConfig.debugMode) {
      console.log(`📝 Lazy animation registered: ${id}`, {
        priority: animationDef.priority,
        isComplex: animationDef.isComplex,
        dependencies: animationDef.dependencies
      })
    }
  }, [finalConfig.debugMode])

  // Carregar uma animação específica
  const loadAnimation = useCallback(async (id: string): Promise<LoadedAnimation | null> => {
    const animationDef = animationDefinitions.current.get(id)
    if (!animationDef || loadedAnimations.has(id) || currentlyLoading.current.has(id)) {
      return loadedAnimations.get(id) || null
    }

    // Verificar se já existe uma promise de carregamento
    const existingPromise = loadingPromises.current.get(id)
    if (existingPromise) {
      await existingPromise
      return loadedAnimations.get(id) || null
    }

    // Criar promise de carregamento
    const loadPromise = (async () => {
      currentlyLoading.current.add(id)
      const startTime = performance.now()

      try {
        // Carregar dependências primeiro
        if (animationDef.dependencies && animationDef.dependencies.length > 0) {
          await Promise.all(
            animationDef.dependencies.map(depId => loadAnimation(depId))
          )
        }

        // Executar factory da animação
        const timeline = await Promise.resolve(animationDef.animationFactory())
        const loadTime = performance.now() - startTime

        const loadedAnimation: LoadedAnimation = {
          id,
          timeline,
          isLoaded: true,
          isActive: false,
          loadTime,
          element: animationDef.element
        }

        // Atualizar estado
        setLoadedAnimations(prev => new Map(prev).set(id, loadedAnimation))

        if (finalConfig.debugMode) {
          console.log(`✅ Animation loaded: ${id} (${loadTime.toFixed(2)}ms)`)
        }

        return loadedAnimation
      } catch (error) {
        console.error(`❌ Failed to load animation: ${id}`, error)
        return null
      } finally {
        currentlyLoading.current.delete(id)
        loadingPromises.current.delete(id)
      }
    })()

    loadingPromises.current.set(id, loadPromise)
    return await loadPromise
  }, [loadedAnimations, finalConfig.debugMode])

  // Carregar animações em lote com prioridade
  const loadAnimationsBatch = useCallback(async (animationIds: string[]) => {
    if (currentlyLoading.current.size >= finalConfig.maxConcurrentLoads) {
      // Adicionar à fila se já estamos carregando muitas animações
      setLoadingQueue(prev => [...prev, ...animationIds.filter(id => !prev.includes(id))])
      return
    }

    setIsLoading(true)

    try {
      // Ordenar por prioridade
      const sortedIds = finalConfig.enablePriority 
        ? animationIds.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            const aPriority = animationDefinitions.current.get(a)?.priority || 'medium'
            const bPriority = animationDefinitions.current.get(b)?.priority || 'medium'
            return priorityOrder[bPriority] - priorityOrder[aPriority]
          })
        : animationIds

      // Carregar em lotes respeitando o limite de concorrência
      const batches = []
      for (let i = 0; i < sortedIds.length; i += finalConfig.maxConcurrentLoads) {
        batches.push(sortedIds.slice(i, i + finalConfig.maxConcurrentLoads))
      }

      for (const batch of batches) {
        await Promise.all(batch.map(id => loadAnimation(id)))
      }

      if (finalConfig.debugMode) {
        console.log(`🚀 Batch loaded: ${animationIds.length} animations`)
      }
    } finally {
      setIsLoading(false)
      
      // Processar fila se houver itens pendentes
      if (loadingQueue.length > 0) {
        const nextBatch = loadingQueue.splice(0, finalConfig.maxConcurrentLoads)
        setLoadingQueue(prev => prev.slice(finalConfig.maxConcurrentLoads))
        setTimeout(() => loadAnimationsBatch(nextBatch), 100)
      }
    }
  }, [loadAnimation, loadingQueue, finalConfig])

  // Precarregar animações baseado em condições
  const preloadAnimations = useCallback(() => {
    const toPreload: string[] = []

    animationDefinitions.current.forEach((animationDef, id) => {
      if (preloadedAnimations.current.has(id) || loadedAnimations.has(id)) return

      // Verificar condição de preload personalizada
      if (animationDef.preloadCondition && !animationDef.preloadCondition()) return

      // Verificar distância do elemento
      if (finalConfig.enablePreloading) {
        const rect = animationDef.element.getBoundingClientRect()
        const distanceFromViewport = Math.max(
          0,
          rect.top - window.innerHeight,
          0 - rect.bottom
        )

        if (distanceFromViewport <= finalConfig.preloadDistance) {
          toPreload.push(id)
          preloadedAnimations.current.add(id)
        }
      }
    })

    if (toPreload.length > 0) {
      loadAnimationsBatch(toPreload)
    }
  }, [loadedAnimations, loadAnimationsBatch, finalConfig])

  // Executar uma animação carregada
  const playAnimation = useCallback(async (id: string, options: gsap.TweenVars = {}) => {
    let loadedAnimation = loadedAnimations.get(id)
    
    // Carregar se não estiver carregada
    if (!loadedAnimation) {
      loadedAnimation = await loadAnimation(id)
      if (!loadedAnimation) return null
    }

    // Configurar e executar timeline
    const { timeline } = loadedAnimation
    
    // Aplicar opções se fornecidas
    if (options.duration !== undefined) timeline.duration(options.duration)
    if (options.delay !== undefined) timeline.delay(options.delay)
    if (options.ease !== undefined) timeline.ease(options.ease)

    // Marcar como ativa
    loadedAnimation.isActive = true
    setLoadedAnimations(prev => new Map(prev).set(id, loadedAnimation!))

    // Executar animação
    timeline.restart()

    if (finalConfig.debugMode) {
      console.log(`▶️ Animation played: ${id}`)
    }

    return timeline
  }, [loadedAnimations, loadAnimation, finalConfig.debugMode])

  // Pausar uma animação
  const pauseAnimation = useCallback((id: string) => {
    const loadedAnimation = loadedAnimations.get(id)
    if (loadedAnimation) {
      loadedAnimation.timeline.pause()
      loadedAnimation.isActive = false
      setLoadedAnimations(prev => new Map(prev).set(id, loadedAnimation))
    }
  }, [loadedAnimations])

  // Parar uma animação
  const stopAnimation = useCallback((id: string) => {
    const loadedAnimation = loadedAnimations.get(id)
    if (loadedAnimation) {
      loadedAnimation.timeline.kill()
      loadedAnimation.isActive = false
      setLoadedAnimations(prev => new Map(prev).set(id, loadedAnimation))
    }
  }, [loadedAnimations])

  // Descarregar uma animação para liberar memória
  const unloadAnimation = useCallback((id: string) => {
    const loadedAnimation = loadedAnimations.get(id)
    if (loadedAnimation) {
      loadedAnimation.timeline.kill()
      setLoadedAnimations(prev => {
        const newMap = new Map(prev)
        newMap.delete(id)
        return newMap
      })
      preloadedAnimations.current.delete(id)

      if (finalConfig.debugMode) {
        console.log(`🗑️ Animation unloaded: ${id}`)
      }
    }
  }, [loadedAnimations, finalConfig.debugMode])

  // Configurar intersection observer
  useEffect(() => {
    if (typeof window === 'undefined') return

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        const toLoad: string[] = []

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Encontrar animação correspondente ao elemento
            animationDefinitions.current.forEach((animationDef, id) => {
              if (animationDef.element === entry.target && !loadedAnimations.has(id)) {
                toLoad.push(id)
              }
            })
          }
        })

        if (toLoad.length > 0) {
          loadAnimationsBatch(toLoad)
        }
      },
      {
        threshold: finalConfig.threshold,
        rootMargin: finalConfig.rootMargin
      }
    )

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect()
      }
    }
  }, [loadedAnimations, loadAnimationsBatch, finalConfig])

  // Preload periódico
  useEffect(() => {
    if (!finalConfig.enablePreloading) return

    const preloadInterval = setInterval(preloadAnimations, 1000)
    return () => clearInterval(preloadInterval)
  }, [preloadAnimations, finalConfig.enablePreloading])

  // Cleanup
  const cleanup = useCallback(() => {
    // Parar todas as animações
    loadedAnimations.forEach((animation) => {
      animation.timeline.kill()
    })

    // Limpar observers
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect()
    }

    // Limpar promises
    loadingPromises.current.clear()
    currentlyLoading.current.clear()
    preloadedAnimations.current.clear()

    // Limpar estado
    setLoadedAnimations(new Map())
    setLoadingQueue([])

    if (finalConfig.debugMode) {
      console.log('🧹 Lazy animations cleanup completed')
    }
  }, [loadedAnimations, finalConfig.debugMode])

  // Estatísticas de debug
  const getStats = useCallback(() => {
    const totalAnimations = animationDefinitions.current.size
    const loadedCount = loadedAnimations.size
    const loadingCount = currentlyLoading.current.size
    const queuedCount = loadingQueue.length
    const preloadedCount = preloadedAnimations.current.size

    const averageLoadTime = Array.from(loadedAnimations.values())
      .reduce((sum, anim) => sum + anim.loadTime, 0) / loadedCount || 0

    return {
      totalAnimations,
      loadedCount,
      loadingCount,
      queuedCount,
      preloadedCount,
      averageLoadTime: Math.round(averageLoadTime * 100) / 100,
      loadingProgress: totalAnimations > 0 ? (loadedCount / totalAnimations) * 100 : 0
    }
  }, [loadedAnimations, loadingQueue])

  return {
    // Core methods
    registerLazyAnimation,
    loadAnimation,
    loadAnimationsBatch,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    unloadAnimation,
    
    // Preloading
    preloadAnimations,
    
    // State
    loadedAnimations: Array.from(loadedAnimations.keys()),
    isLoading,
    loadingQueue,
    
    // Utilities
    getStats,
    cleanup
  }
}