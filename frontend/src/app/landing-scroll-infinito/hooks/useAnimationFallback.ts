'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface AnimationFallbackState {
  isGSAPAvailable: boolean
  isReducedMotion: boolean
  fallbackMode: 'none' | 'css' | 'minimal' | 'disabled'
  errorCount: number
  lastError: Error | null
}

export interface AnimationCapabilities {
  supportsGSAP: boolean
  supportsCSS3D: boolean
  supportsBackdropFilter: boolean
  supportsWillChange: boolean
  devicePixelRatio: number
  isLowEndDevice: boolean
}

/**
 * Hook for managing animation fallbacks and error handling
 * Provides graceful degradation when GSAP fails or reduced motion is preferred
 */
export function useAnimationFallback() {
  const [fallbackState, setFallbackState] = useState<AnimationFallbackState>({
    isGSAPAvailable: true,
    isReducedMotion: false,
    fallbackMode: 'none',
    errorCount: 0,
    lastError: null
  })

  const [capabilities, setCapabilities] = useState<AnimationCapabilities>({
    supportsGSAP: true,
    supportsCSS3D: true,
    supportsBackdropFilter: true,
    supportsWillChange: true,
    devicePixelRatio: 1,
    isLowEndDevice: false
  })

  const errorCountRef = useRef(0)
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Test device capabilities
  const testDeviceCapabilities = useCallback((): AnimationCapabilities => {
    if (typeof window === 'undefined') {
      return capabilities
    }

    const testElement = document.createElement('div')
    document.body.appendChild(testElement)

    const caps: AnimationCapabilities = {
      supportsGSAP: true, // Will be tested separately
      supportsCSS3D: false,
      supportsBackdropFilter: false,
      supportsWillChange: false,
      devicePixelRatio: window.devicePixelRatio || 1,
      isLowEndDevice: false
    }

    try {
      // Test CSS 3D transforms
      testElement.style.transform = 'translateZ(0)'
      caps.supportsCSS3D = testElement.style.transform === 'translateZ(0)'

      // Test backdrop-filter
      testElement.style.backdropFilter = 'blur(10px)'
      caps.supportsBackdropFilter = testElement.style.backdropFilter === 'blur(10px)'

      // Test will-change
      testElement.style.willChange = 'transform'
      caps.supportsWillChange = testElement.style.willChange === 'transform'

      // Detect low-end devices
      const memory = (navigator as any).deviceMemory
      const hardwareConcurrency = navigator.hardwareConcurrency || 1
      const isLowMemory = memory && memory < 4
      const isLowCPU = hardwareConcurrency < 4
      const isHighDPI = caps.devicePixelRatio > 2

      caps.isLowEndDevice = isLowMemory || isLowCPU || (isHighDPI && hardwareConcurrency < 8)

      console.log('🔍 Device capabilities detected:', caps)
    } catch (error) {
      console.warn('⚠️ Error testing device capabilities:', error)
    } finally {
      document.body.removeChild(testElement)
    }

    return caps
  }, [capabilities])

  // Test GSAP availability
  const testGSAPAvailability = useCallback((): boolean => {
    try {
      // Try to import and use GSAP
      const gsap = require('gsap')
      if (!gsap || typeof gsap.to !== 'function') {
        throw new Error('GSAP not properly loaded')
      }

      // Test basic GSAP functionality
      const testDiv = document.createElement('div')
      gsap.set(testDiv, { opacity: 0 })
      
      return true
    } catch (error) {
      console.error('❌ GSAP availability test failed:', error)
      return false
    }
  }, [])

  // Handle animation errors
  const handleAnimationError = useCallback((error: Error, context: string = 'unknown') => {
    errorCountRef.current += 1
    
    console.error(`🚨 Animation error in ${context}:`, error)

    setFallbackState(prev => ({
      ...prev,
      errorCount: errorCountRef.current,
      lastError: error
    }))

    // Escalate fallback mode based on error count
    if (errorCountRef.current >= 3) {
      setFallbackState(prev => ({
        ...prev,
        isGSAPAvailable: false,
        fallbackMode: 'css'
      }))
      
      // Apply CSS fallback class
      document.documentElement.classList.add('gsap-fallback')
      console.warn('⚠️ Switching to CSS fallback mode due to repeated errors')
    }

    if (errorCountRef.current >= 5) {
      setFallbackState(prev => ({
        ...prev,
        fallbackMode: 'minimal'
      }))
      
      // Apply minimal animation class
      document.documentElement.classList.add('minimal-animations')
      console.warn('⚠️ Switching to minimal animation mode')
    }

    if (errorCountRef.current >= 8) {
      setFallbackState(prev => ({
        ...prev,
        fallbackMode: 'disabled'
      }))
      
      // Disable all animations
      document.documentElement.classList.add('animations-disabled')
      console.warn('⚠️ Disabling all animations due to critical errors')
    }
  }, [])

  // Apply fallback mode
  const applyFallbackMode = useCallback((mode: AnimationFallbackState['fallbackMode']) => {
    // Remove existing classes
    document.documentElement.classList.remove(
      'gsap-fallback',
      'minimal-animations', 
      'animations-disabled'
    )

    switch (mode) {
      case 'css':
        document.documentElement.classList.add('gsap-fallback')
        console.log('🎨 Applied CSS fallback mode')
        break
      
      case 'minimal':
        document.documentElement.classList.add('gsap-fallback', 'minimal-animations')
        console.log('⚡ Applied minimal animation mode')
        break
      
      case 'disabled':
        document.documentElement.classList.add('animations-disabled')
        console.log('🚫 Disabled all animations')
        break
      
      default:
        console.log('✅ Normal animation mode active')
    }
  }, [])

  // Create safe animation wrapper
  const createSafeAnimation = useCallback((
    animationFn: () => void,
    fallbackFn?: () => void,
    context: string = 'animation'
  ) => {
    return () => {
      try {
        if (fallbackState.fallbackMode === 'disabled') {
          console.log(`🚫 Animation skipped (disabled): ${context}`)
          return
        }

        if (fallbackState.fallbackMode === 'css' || !fallbackState.isGSAPAvailable) {
          if (fallbackFn) {
            fallbackFn()
          } else {
            console.log(`🎨 Using CSS fallback for: ${context}`)
          }
          return
        }

        animationFn()
      } catch (error) {
        handleAnimationError(error as Error, context)
        
        // Try fallback if available
        if (fallbackFn) {
          try {
            fallbackFn()
          } catch (fallbackError) {
            console.error(`❌ Fallback also failed for ${context}:`, fallbackError)
          }
        }
      }
    }
  }, [fallbackState, handleAnimationError])

  // Initialize fallback system
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🔧 Initializing animation fallback system...')

    // Test device capabilities
    const deviceCaps = testDeviceCapabilities()
    setCapabilities(deviceCaps)

    // Test GSAP availability
    const gsapAvailable = testGSAPAvailability()
    
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reducedMotion = mediaQuery.matches

    // Determine initial fallback mode
    let initialMode: AnimationFallbackState['fallbackMode'] = 'none'
    
    if (reducedMotion) {
      initialMode = 'minimal'
    } else if (!gsapAvailable) {
      initialMode = 'css'
    } else if (deviceCaps.isLowEndDevice) {
      initialMode = 'minimal'
    }

    setFallbackState(prev => ({
      ...prev,
      isGSAPAvailable: gsapAvailable,
      isReducedMotion: reducedMotion,
      fallbackMode: initialMode
    }))

    // Apply initial fallback mode
    applyFallbackMode(initialMode)

    // Listen for reduced motion changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      const newReducedMotion = e.matches
      
      setFallbackState(prev => ({
        ...prev,
        isReducedMotion: newReducedMotion,
        fallbackMode: newReducedMotion ? 'minimal' : (prev.isGSAPAvailable ? 'none' : 'css')
      }))

      applyFallbackMode(newReducedMotion ? 'minimal' : 'none')
      
      console.log(`♿ Reduced motion ${newReducedMotion ? 'enabled' : 'disabled'}`)
    }

    mediaQuery.addEventListener('change', handleReducedMotionChange)

    // Global error handler for unhandled animation errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.error && (
        event.error.message?.includes('gsap') ||
        event.error.message?.includes('ScrollTrigger') ||
        event.error.message?.includes('animation')
      )) {
        handleAnimationError(event.error, 'global')
      }
    }

    window.addEventListener('error', handleGlobalError)

    console.log('✅ Animation fallback system initialized')

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange)
      window.removeEventListener('error', handleGlobalError)
      
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current)
      }
    }
  }, [testDeviceCapabilities, testGSAPAvailability, handleAnimationError, applyFallbackMode])

  // Recovery mechanism
  const attemptRecovery = useCallback(() => {
    console.log('🔄 Attempting animation system recovery...')
    
    // Reset error count
    errorCountRef.current = 0
    
    // Test GSAP again
    const gsapAvailable = testGSAPAvailability()
    
    setFallbackState(prev => ({
      ...prev,
      isGSAPAvailable: gsapAvailable,
      errorCount: 0,
      lastError: null,
      fallbackMode: gsapAvailable && !prev.isReducedMotion ? 'none' : 'css'
    }))

    // Reapply appropriate mode
    const newMode = gsapAvailable && !fallbackState.isReducedMotion ? 'none' : 'css'
    applyFallbackMode(newMode)
    
    console.log('✅ Recovery attempt completed')
  }, [testGSAPAvailability, fallbackState.isReducedMotion, applyFallbackMode])

  return {
    // State
    fallbackState,
    capabilities,
    
    // Methods
    handleAnimationError,
    createSafeAnimation,
    attemptRecovery,
    applyFallbackMode,
    
    // Utilities
    isAnimationsEnabled: fallbackState.fallbackMode !== 'disabled',
    shouldUseGSAP: fallbackState.isGSAPAvailable && fallbackState.fallbackMode === 'none',
    shouldUseCSSFallback: fallbackState.fallbackMode === 'css' || !fallbackState.isGSAPAvailable,
    shouldUseMinimalAnimations: fallbackState.fallbackMode === 'minimal' || fallbackState.isReducedMotion
  }
}