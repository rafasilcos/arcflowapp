'use client'

import { useEffect, useState, useCallback } from 'react'

export interface ReducedMotionState {
  prefersReducedMotion: boolean
  isSystemDetected: boolean
  isUserOverride: boolean
  motionLevel: 'full' | 'reduced' | 'minimal' | 'none'
}

export interface MotionSettings {
  enableAnimations: boolean
  enableTransitions: boolean
  enableParallax: boolean
  enableAutoplay: boolean
  animationDuration: number
  transitionDuration: number
}

/**
 * Hook for detecting and managing reduced motion preferences
 * Provides comprehensive accessibility support for motion-sensitive users
 */
export function useReducedMotion() {
  const [motionState, setMotionState] = useState<ReducedMotionState>({
    prefersReducedMotion: false,
    isSystemDetected: false,
    isUserOverride: false,
    motionLevel: 'full'
  })

  const [motionSettings, setMotionSettings] = useState<MotionSettings>({
    enableAnimations: true,
    enableTransitions: true,
    enableParallax: true,
    enableAutoplay: true,
    animationDuration: 1,
    transitionDuration: 0.3
  })

  // Detect system reduced motion preference
  const detectSystemPreference = useCallback((): boolean => {
    if (typeof window === 'undefined') return false

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      return mediaQuery.matches
    } catch (error) {
      console.warn('⚠️ Could not detect reduced motion preference:', error)
      return false
    }
  }, [])

  // Check for user override in localStorage
  const getUserOverride = useCallback((): string | null => {
    if (typeof window === 'undefined') return null

    try {
      return localStorage.getItem('arcflow-motion-preference')
    } catch (error) {
      console.warn('⚠️ Could not access motion preference from localStorage:', error)
      return null
    }
  }, [])

  // Save user override to localStorage
  const setUserOverride = useCallback((preference: string) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('arcflow-motion-preference', preference)
      console.log(`💾 Motion preference saved: ${preference}`)
    } catch (error) {
      console.warn('⚠️ Could not save motion preference to localStorage:', error)
    }
  }, [])

  // Determine motion level based on preferences
  const determineMotionLevel = useCallback((
    systemPreference: boolean,
    userOverride: string | null
  ): ReducedMotionState['motionLevel'] => {
    // User override takes precedence
    if (userOverride) {
      switch (userOverride) {
        case 'full': return 'full'
        case 'reduced': return 'reduced'
        case 'minimal': return 'minimal'
        case 'none': return 'none'
        default: break
      }
    }

    // Fall back to system preference
    return systemPreference ? 'reduced' : 'full'
  }, [])

  // Apply motion settings based on level
  const applyMotionSettings = useCallback((level: ReducedMotionState['motionLevel']) => {
    let settings: MotionSettings

    switch (level) {
      case 'none':
        settings = {
          enableAnimations: false,
          enableTransitions: false,
          enableParallax: false,
          enableAutoplay: false,
          animationDuration: 0,
          transitionDuration: 0
        }
        break

      case 'minimal':
        settings = {
          enableAnimations: false,
          enableTransitions: true,
          enableParallax: false,
          enableAutoplay: false,
          animationDuration: 0,
          transitionDuration: 0.1
        }
        break

      case 'reduced':
        settings = {
          enableAnimations: true,
          enableTransitions: true,
          enableParallax: false,
          enableAutoplay: false,
          animationDuration: 0.3,
          transitionDuration: 0.2
        }
        break

      case 'full':
      default:
        settings = {
          enableAnimations: true,
          enableTransitions: true,
          enableParallax: true,
          enableAutoplay: true,
          animationDuration: 1,
          transitionDuration: 0.3
        }
        break
    }

    setMotionSettings(settings)
    return settings
  }, [])

  // Apply CSS classes based on motion level
  const applyCSSClasses = useCallback((level: ReducedMotionState['motionLevel']) => {
    if (typeof document === 'undefined') return

    // Remove existing classes
    document.documentElement.classList.remove(
      'motion-full',
      'motion-reduced', 
      'motion-minimal',
      'motion-none'
    )

    // Add appropriate class
    document.documentElement.classList.add(`motion-${level}`)

    // Apply legacy classes for compatibility
    if (level === 'reduced' || level === 'minimal' || level === 'none') {
      document.documentElement.classList.add('minimal-animations')
    }

    if (level === 'none') {
      document.documentElement.classList.add('animations-disabled')
    }

    console.log(`🎬 Applied motion level: ${level}`)
  }, [])

  // Update motion preference
  const updateMotionPreference = useCallback((
    level: ReducedMotionState['motionLevel'],
    isUserOverride: boolean = true
  ) => {
    setMotionState(prev => ({
      ...prev,
      motionLevel: level,
      isUserOverride,
      prefersReducedMotion: level !== 'full'
    }))

    // Save user preference
    if (isUserOverride) {
      setUserOverride(level)
    }

    // Apply settings and CSS
    applyMotionSettings(level)
    applyCSSClasses(level)

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('motion-preference-changed', {
      detail: { level, isUserOverride }
    }))
  }, [setUserOverride, applyMotionSettings, applyCSSClasses])

  // Initialize motion detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🔍 Initializing reduced motion detection...')

    // Detect system preference
    const systemPreference = detectSystemPreference()
    const userOverride = getUserOverride()

    // Determine motion level
    const motionLevel = determineMotionLevel(systemPreference, userOverride)

    // Update state
    setMotionState({
      prefersReducedMotion: motionLevel !== 'full',
      isSystemDetected: systemPreference,
      isUserOverride: !!userOverride,
      motionLevel
    })

    // Apply settings
    const settings = applyMotionSettings(motionLevel)
    applyCSSClasses(motionLevel)

    console.log('✅ Motion detection initialized:', {
      system: systemPreference,
      user: userOverride,
      level: motionLevel,
      settings
    })

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!motionState.isUserOverride) {
        const newLevel = e.matches ? 'reduced' : 'full'
        updateMotionPreference(newLevel, false)
        console.log(`🔄 System motion preference changed: ${newLevel}`)
      }
    }

    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [detectSystemPreference, getUserOverride, determineMotionLevel, applyMotionSettings, applyCSSClasses, updateMotionPreference, motionState.isUserOverride])

  // Provide motion-safe animation wrapper
  const createMotionSafeAnimation = useCallback((
    fullAnimation: () => void,
    reducedAnimation?: () => void,
    minimalAnimation?: () => void
  ) => {
    return () => {
      switch (motionState.motionLevel) {
        case 'none':
          // No animation
          break

        case 'minimal':
          if (minimalAnimation) {
            minimalAnimation()
          } else if (reducedAnimation) {
            reducedAnimation()
          }
          break

        case 'reduced':
          if (reducedAnimation) {
            reducedAnimation()
          } else {
            fullAnimation()
          }
          break

        case 'full':
        default:
          fullAnimation()
          break
      }
    }
  }, [motionState.motionLevel])

  // Get motion-appropriate duration
  const getMotionDuration = useCallback((baseDuration: number): number => {
    return baseDuration * motionSettings.animationDuration
  }, [motionSettings.animationDuration])

  // Get motion-appropriate transition duration
  const getTransitionDuration = useCallback((baseDuration: number): number => {
    return baseDuration * motionSettings.transitionDuration
  }, [motionSettings.transitionDuration])

  return {
    // State
    motionState,
    motionSettings,
    
    // Computed values
    prefersReducedMotion: motionState.prefersReducedMotion,
    motionLevel: motionState.motionLevel,
    isAnimationsEnabled: motionSettings.enableAnimations,
    isTransitionsEnabled: motionSettings.enableTransitions,
    isParallaxEnabled: motionSettings.enableParallax,
    isAutoplayEnabled: motionSettings.enableAutoplay,
    
    // Methods
    updateMotionPreference,
    createMotionSafeAnimation,
    getMotionDuration,
    getTransitionDuration,
    
    // Utilities
    shouldSkipAnimation: motionState.motionLevel === 'none',
    shouldUseMinimalAnimation: motionState.motionLevel === 'minimal',
    shouldUseReducedAnimation: motionState.motionLevel === 'reduced' || motionState.motionLevel === 'minimal',
    shouldUseFullAnimation: motionState.motionLevel === 'full'
  }
}