'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useGPUAcceleration } from '../hooks/useGPUAcceleration'
import { useLazyAnimations } from '../hooks/useLazyAnimations'
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor'

interface PerformanceOptimizerProps {
  enableGPUAcceleration?: boolean
  enableLazyAnimations?: boolean
  enablePerformanceMonitoring?: boolean
  aggressiveOptimization?: boolean
  debugMode?: boolean
  onOptimizationChange?: (optimizations: OptimizationState) => void
}

interface OptimizationState {
  gpuAcceleration: boolean
  lazyAnimations: boolean
  willChangeOptimization: boolean
  transform3D: boolean
  performanceLevel: 'low' | 'medium' | 'high'
  activeOptimizations: string[]
}

/**
 * Componente principal de otimização de performance
 * Integra GPU acceleration, lazy loading e monitoramento de performance
 */
export function PerformanceOptimizer({
  enableGPUAcceleration = true,
  enableLazyAnimations = true,
  enablePerformanceMonitoring = true,
  aggressiveOptimization = false,
  debugMode = false,
  onOptimizationChange
}: PerformanceOptimizerProps) {
  const isInitialized = useRef(false)
  const optimizationState = useRef<OptimizationState>({
    gpuAcceleration: false,
    lazyAnimations: false,
    willChangeOptimization: false,
    transform3D: false,
    performanceLevel: 'high',
    activeOptimizations: []
  })

  // Initialize GPU acceleration
  const gpuAcceleration = useGPUAcceleration({
    enableForceGPU: enableGPUAcceleration,
    enableWillChange: true,
    enableTransform3D: true,
    enableBackfaceVisibility: true,
    enablePerspective: true,
    autoCleanup: true,
    debugMode
  })

  // Initialize lazy animations
  const lazyAnimations = useLazyAnimations({
    threshold: 0.1,
    rootMargin: '100px',
    enablePreloading: true,
    preloadDistance: aggressiveOptimization ? 100 : 200,
    enablePriority: true,
    maxConcurrentLoads: aggressiveOptimization ? 2 : 3,
    debugMode
  })

  // Initialize performance monitoring
  const performanceMonitor = usePerformanceMonitor({
    autoOptimize: true,
    debugMode,
    fpsThreshold: {
      critical: aggressiveOptimization ? 25 : 20,
      warning: aggressiveOptimization ? 35 : 30,
      good: aggressiveOptimization ? 45 : 50
    }
  })

  // Register complex animations for lazy loading
  const registerScrollAnimations = useCallback(() => {
    if (!enableLazyAnimations) return

    // Hero section - complex letter animation
    const heroSection = document.querySelector('#hero')
    if (heroSection instanceof HTMLElement) {
      lazyAnimations.registerLazyAnimation(
        'hero-letters',
        heroSection,
        () => {
          const title = heroSection.querySelector('h1')
          if (!title) return gsap.timeline()

          const chars = title.querySelectorAll('.char')
          return gsap.timeline()
            .set(chars, { opacity: 0, y: 50, rotationX: -90 })
            .to(chars, {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.8,
              stagger: 0.05,
              ease: 'back.out(1.7)'
            })
        },
        {
          priority: 'high',
          isComplex: true
        }
      )
    }

    // Features section - complex card animations
    const featuresSection = document.querySelector('#features')
    if (featuresSection instanceof HTMLElement) {
      lazyAnimations.registerLazyAnimation(
        'features-cards',
        featuresSection,
        () => {
          const cards = featuresSection.querySelectorAll('.feature-card, .glass-card')
          return gsap.timeline()
            .set(cards, { opacity: 0, y: 100, rotationY: 45, scale: 0.8 })
            .to(cards, {
              opacity: 1,
              y: 0,
              rotationY: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.15,
              ease: 'back.out(1.7)'
            })
        },
        {
          priority: 'medium',
          isComplex: true
        }
      )
    }

    // Results section - complex counter animations
    const resultsSection = document.querySelector('#results')
    if (resultsSection instanceof HTMLElement) {
      lazyAnimations.registerLazyAnimation(
        'results-counters',
        resultsSection,
        () => {
          const counters = resultsSection.querySelectorAll('.counter-element')
          const tl = gsap.timeline()

          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-counter') || '0')
            const obj = { value: 0 }
            
            tl.to(obj, {
              value: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = Math.round(obj.value).toString() + 
                  (counter.textContent?.includes('%') ? '%' : 
                   counter.textContent?.includes('+') ? '+' : '')
              }
            }, 0)
          })

          return tl
        },
        {
          priority: 'high',
          isComplex: true,
          preloadCondition: () => performanceMonitor.metrics.fps > 40
        }
      )
    }

    // Testimonials section - complex rotation animation
    const testimonialsSection = document.querySelector('#testimonials')
    if (testimonialsSection instanceof HTMLElement) {
      lazyAnimations.registerLazyAnimation(
        'testimonials-rotation',
        testimonialsSection,
        () => {
          const cards = testimonialsSection.querySelectorAll('.glass-card')
          return gsap.timeline({ repeat: -1, yoyo: true })
            .to(cards, {
              rotationY: 5,
              z: 50,
              duration: 4,
              stagger: 0.5,
              ease: 'sine.inOut'
            })
        },
        {
          priority: 'low',
          isComplex: true,
          preloadCondition: () => performanceMonitor.performanceLevel !== 'critical'
        }
      )
    }

    if (debugMode) {
      console.log('🎬 Complex animations registered for lazy loading')
    }
  }, [lazyAnimations, enableLazyAnimations, performanceMonitor, debugMode])

  // Apply GPU optimizations to scroll elements
  const optimizeScrollElements = useCallback(() => {
    if (!enableGPUAcceleration) return

    // Optimize main container
    const container = document.getElementById('scroll-infinite-container')
    if (container) {
      gpuAcceleration.applyGPUAcceleration(container, 'main-container', ['transform'])
    }

    // Optimize all sections
    const sections = document.querySelectorAll('[id^="section-"], .scroll-section')
    sections.forEach((section, index) => {
      if (section instanceof HTMLElement) {
        gpuAcceleration.applyGPUAcceleration(
          section,
          `section-${section.id || index}`,
          ['transform', 'opacity']
        )
      }
    })

    // Optimize animated elements
    const animatedElements = document.querySelectorAll(
      '.animate-element, .glass-card, .feature-card, .counter-element'
    )
    animatedElements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        gpuAcceleration.applyGPUAcceleration(
          element,
          `animated-${index}`,
          ['transform', 'opacity', 'scale']
        )
      }
    })

    if (debugMode) {
      console.log(`🚀 GPU optimization applied to ${sections.length} sections and ${animatedElements.length} elements`)
    }
  }, [gpuAcceleration, enableGPUAcceleration, debugMode])

  // Dynamic will-change optimization based on scroll state
  const optimizeWillChangeForScroll = useCallback((scrollProgress: number, isScrolling: boolean) => {
    if (!enableGPUAcceleration) return

    const currentSection = Math.floor(scrollProgress * 8) // 8 sections total
    
    // Optimize will-change for current and adjacent sections
    for (let i = 0; i < 8; i++) {
      const sectionId = `section-${i}`
      const isNearby = Math.abs(i - currentSection) <= 1
      
      if (isScrolling && isNearby) {
        gpuAcceleration.optimizeWillChange(sectionId, 'start', ['transform', 'opacity'])
      } else if (!isScrolling) {
        gpuAcceleration.optimizeWillChange(sectionId, 'end')
      }
    }
  }, [gpuAcceleration, enableGPUAcceleration])

  // Adaptive optimization based on performance
  const adaptiveOptimization = useCallback(() => {
    const { fps, memoryUsage } = performanceMonitor.metrics
    const performanceLevel = performanceMonitor.performanceLevel
    
    let activeOptimizations: string[] = []
    let newPerformanceLevel: 'low' | 'medium' | 'high' = 'high'

    // Determine performance level and apply optimizations
    if (fps < 20 || memoryUsage > 80) {
      newPerformanceLevel = 'low'
      
      // Aggressive optimizations
      document.documentElement.classList.add(
        'reduce-particles',
        'simplify-animations', 
        'disable-blur',
        'throttle-scroll',
        'pause-non-critical'
      )
      
      activeOptimizations = [
        'reduce-particles',
        'simplify-animations',
        'disable-blur',
        'throttle-scroll',
        'pause-non-critical'
      ]

      // Unload non-critical animations
      lazyAnimations.unloadAnimation('testimonials-rotation')
      
    } else if (fps < 40 || memoryUsage > 60) {
      newPerformanceLevel = 'medium'
      
      // Moderate optimizations
      document.documentElement.classList.add(
        'reduce-particles',
        'throttle-scroll'
      )
      document.documentElement.classList.remove(
        'simplify-animations',
        'disable-blur',
        'pause-non-critical'
      )
      
      activeOptimizations = ['reduce-particles', 'throttle-scroll']
      
    } else {
      newPerformanceLevel = 'high'
      
      // Remove all optimizations
      document.documentElement.classList.remove(
        'reduce-particles',
        'simplify-animations',
        'disable-blur',
        'throttle-scroll',
        'pause-non-critical'
      )
      
      activeOptimizations = []
    }

    // Update optimization state
    const newState: OptimizationState = {
      gpuAcceleration: enableGPUAcceleration,
      lazyAnimations: enableLazyAnimations,
      willChangeOptimization: true,
      transform3D: enableGPUAcceleration,
      performanceLevel: newPerformanceLevel,
      activeOptimizations
    }

    if (JSON.stringify(optimizationState.current) !== JSON.stringify(newState)) {
      optimizationState.current = newState
      onOptimizationChange?.(newState)

      if (debugMode) {
        console.log('🎯 Adaptive optimization applied:', newState)
      }
    }
  }, [
    performanceMonitor,
    enableGPUAcceleration,
    enableLazyAnimations,
    lazyAnimations,
    onOptimizationChange,
    debugMode
  ])

  // Initialize all optimizations
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    console.log('🚀 Initializing Performance Optimizer...')

    const initTimer = setTimeout(() => {
      // Apply GPU optimizations
      if (enableGPUAcceleration) {
        optimizeScrollElements()
      }

      // Register lazy animations
      if (enableLazyAnimations) {
        registerScrollAnimations()
      }

      // Start adaptive optimization monitoring
      if (enablePerformanceMonitoring) {
        const adaptiveTimer = setInterval(adaptiveOptimization, 2000)
        
        // Cleanup function for adaptive monitoring
        return () => clearInterval(adaptiveTimer)
      }

      isInitialized.current = true
      console.log('✅ Performance Optimizer initialized')
    }, 500)

    return () => {
      clearTimeout(initTimer)
      isInitialized.current = false
    }
  }, [
    enableGPUAcceleration,
    enableLazyAnimations,
    enablePerformanceMonitoring,
    optimizeScrollElements,
    registerScrollAnimations,
    adaptiveOptimization
  ])

  // Expose scroll optimization method for external use
  useEffect(() => {
    // Add global method for scroll optimization
    ;(window as any).optimizeScrollPerformance = (scrollProgress: number, isScrolling: boolean) => {
      optimizeWillChangeForScroll(scrollProgress, isScrolling)
    }

    return () => {
      delete (window as any).optimizeScrollPerformance
    }
  }, [optimizeWillChangeForScroll])

  // Debug information
  useEffect(() => {
    if (!debugMode) return

    const debugInterval = setInterval(() => {
      const stats = lazyAnimations.getStats()
      console.log('📊 Performance Optimizer Stats:', {
        optimizationState: optimizationState.current,
        lazyAnimationStats: stats,
        gpuOptimizedElements: gpuAcceleration.optimizedElements.length,
        performanceMetrics: {
          fps: performanceMonitor.metrics.fps,
          memoryUsage: performanceMonitor.metrics.memoryUsage,
          level: performanceMonitor.performanceLevel
        }
      })
    }, 5000)

    return () => clearInterval(debugInterval)
  }, [debugMode, lazyAnimations, gpuAcceleration, performanceMonitor])

  // This component doesn't render anything - it's purely for optimization
  return null
}

// Export optimization state type for external use
export type { OptimizationState }