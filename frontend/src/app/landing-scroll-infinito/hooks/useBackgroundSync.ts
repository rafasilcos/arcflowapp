'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

// Background theme configuration for each section
export interface BackgroundTheme {
  id: string
  gradient: {
    primary: string
    secondary: string
    accent?: string
  }
  particles: {
    color: string
    intensity: number
    movement: 'slow' | 'medium' | 'fast'
    pattern: 'float' | 'orbit' | 'pulse' | 'drift'
  }
  atmosphere: {
    blur: number
    opacity: number
    scale: number
  }
}

// Section-specific background themes
const BACKGROUND_THEMES: Record<string, BackgroundTheme> = {
  hero: {
    id: 'hero',
    gradient: {
      primary: '#0f0f23',
      secondary: '#1a1a2e',
      accent: '#16213e'
    },
    particles: {
      color: '#3b82f6',
      intensity: 0.3,
      movement: 'slow',
      pattern: 'float'
    },
    atmosphere: {
      blur: 40,
      opacity: 0.1,
      scale: 1
    }
  },
  about: {
    id: 'about',
    gradient: {
      primary: '#1e1b4b',
      secondary: '#312e81',
      accent: '#4338ca'
    },
    particles: {
      color: '#6366f1',
      intensity: 0.4,
      movement: 'medium',
      pattern: 'drift'
    },
    atmosphere: {
      blur: 35,
      opacity: 0.15,
      scale: 1.1
    }
  },
  features: {
    id: 'features',
    gradient: {
      primary: '#581c87',
      secondary: '#7c3aed',
      accent: '#8b5cf6'
    },
    particles: {
      color: '#a855f7',
      intensity: 0.5,
      movement: 'medium',
      pattern: 'orbit'
    },
    atmosphere: {
      blur: 30,
      opacity: 0.2,
      scale: 1.2
    }
  },
  results: {
    id: 'results',
    gradient: {
      primary: '#1e40af',
      secondary: '#7c3aed',
      accent: '#be185d'
    },
    particles: {
      color: '#f59e0b',
      intensity: 0.7,
      movement: 'fast',
      pattern: 'pulse'
    },
    atmosphere: {
      blur: 25,
      opacity: 0.25,
      scale: 1.3
    }
  },
  testimonials: {
    id: 'testimonials',
    gradient: {
      primary: '#065f46',
      secondary: '#059669',
      accent: '#10b981'
    },
    particles: {
      color: '#34d399',
      intensity: 0.4,
      movement: 'slow',
      pattern: 'float'
    },
    atmosphere: {
      blur: 35,
      opacity: 0.18,
      scale: 1.1
    }
  },
  pricing: {
    id: 'pricing',
    gradient: {
      primary: '#7c2d12',
      secondary: '#ea580c',
      accent: '#f97316'
    },
    particles: {
      color: '#fb923c',
      intensity: 0.5,
      movement: 'medium',
      pattern: 'orbit'
    },
    atmosphere: {
      blur: 30,
      opacity: 0.2,
      scale: 1.15
    }
  },
  faq: {
    id: 'faq',
    gradient: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280'
    },
    particles: {
      color: '#9ca3af',
      intensity: 0.3,
      movement: 'slow',
      pattern: 'drift'
    },
    atmosphere: {
      blur: 40,
      opacity: 0.12,
      scale: 1
    }
  },
  cta: {
    id: 'cta',
    gradient: {
      primary: '#0f0f23',
      secondary: '#1a1a2e',
      accent: '#7c3aed'
    },
    particles: {
      color: '#8b5cf6',
      intensity: 0.6,
      movement: 'fast',
      pattern: 'pulse'
    },
    atmosphere: {
      blur: 20,
      opacity: 0.3,
      scale: 1.4
    }
  }
}

// Background sync state
export interface BackgroundSyncState {
  currentTheme: BackgroundTheme
  previousTheme: BackgroundTheme | null
  transitionProgress: number
  isTransitioning: boolean
}

/**
 * Hook for synchronizing background elements with scroll sections
 * Manages gradient transitions, particle animations, and atmospheric effects
 */
export function useBackgroundSync() {
  const [syncState, setSyncState] = useState<BackgroundSyncState>({
    currentTheme: BACKGROUND_THEMES.hero,
    previousTheme: null,
    transitionProgress: 0,
    isTransitioning: false
  })

  const gradientTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const particleTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const atmosphereTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const currentSectionRef = useRef<string>('hero')

  // Get theme for specific section
  const getThemeForSection = useCallback((sectionId: string): BackgroundTheme => {
    return BACKGROUND_THEMES[sectionId] || BACKGROUND_THEMES.hero
  }, [])

  // Generate CSS gradient string from theme
  const generateGradientCSS = useCallback((theme: BackgroundTheme, progress: number = 1): string => {
    const { primary, secondary, accent } = theme.gradient
    
    if (accent) {
      return `linear-gradient(135deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)`
    }
    
    return `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
  }, [])

  // Interpolate between two colors
  const interpolateColor = useCallback((color1: string, color2: string, progress: number): string => {
    // Simple color interpolation - in production, use a proper color library
    const hex1 = color1.replace('#', '')
    const hex2 = color2.replace('#', '')
    
    const r1 = parseInt(hex1.substr(0, 2), 16)
    const g1 = parseInt(hex1.substr(2, 2), 16)
    const b1 = parseInt(hex1.substr(4, 2), 16)
    
    const r2 = parseInt(hex2.substr(0, 2), 16)
    const g2 = parseInt(hex2.substr(2, 2), 16)
    const b2 = parseInt(hex2.substr(4, 2), 16)
    
    const r = Math.round(r1 + (r2 - r1) * progress)
    const g = Math.round(g1 + (g2 - g1) * progress)
    const b = Math.round(b1 + (b2 - b1) * progress)
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }, [])

  // Generate interpolated gradient between two themes
  const generateTransitionGradient = useCallback((
    fromTheme: BackgroundTheme, 
    toTheme: BackgroundTheme, 
    progress: number
  ): string => {
    const primaryColor = interpolateColor(fromTheme.gradient.primary, toTheme.gradient.primary, progress)
    const secondaryColor = interpolateColor(fromTheme.gradient.secondary, toTheme.gradient.secondary, progress)
    
    let accentColor = null
    if (fromTheme.gradient.accent && toTheme.gradient.accent) {
      accentColor = interpolateColor(fromTheme.gradient.accent, toTheme.gradient.accent, progress)
    }
    
    if (accentColor) {
      return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`
    }
    
    return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
  }, [interpolateColor])

  // Sync background with section change
  const syncWithSection = useCallback((sectionId: string, transitionProgress: number = 0) => {
    const newTheme = getThemeForSection(sectionId)
    const previousTheme = syncState.currentTheme
    
    // Skip if same section and not transitioning
    if (sectionId === currentSectionRef.current && transitionProgress === 0) return
    
    console.log(`🎨 Background sync: ${currentSectionRef.current} → ${sectionId} (${(transitionProgress * 100).toFixed(1)}%)`)
    
    // Update current section reference
    currentSectionRef.current = sectionId
    
    // Update sync state
    setSyncState({
      currentTheme: newTheme,
      previousTheme: sectionId !== previousTheme.id ? previousTheme : null,
      transitionProgress,
      isTransitioning: transitionProgress > 0 && transitionProgress < 1
    })
    
    // Trigger background element updates
    updateBackgroundElements(newTheme, previousTheme, transitionProgress)
    
  }, [syncState.currentTheme, getThemeForSection])

  // Update background elements (gradient, particles, atmosphere)
  const updateBackgroundElements = useCallback((
    currentTheme: BackgroundTheme,
    previousTheme: BackgroundTheme | null,
    progress: number
  ) => {
    // Update gradient background
    const gradientElement = document.querySelector('[data-background-gradient]') as HTMLElement
    if (gradientElement) {
      let gradientCSS: string
      
      if (previousTheme && progress > 0 && progress < 1) {
        // Transitioning between themes
        gradientCSS = generateTransitionGradient(previousTheme, currentTheme, progress)
      } else {
        // Static theme
        gradientCSS = generateGradientCSS(currentTheme)
      }
      
      gradientElement.style.background = gradientCSS
    }
    
    // Update particle colors and behavior
    const particleElements = document.querySelectorAll('[data-particle]')
    particleElements.forEach((particle) => {
      const element = particle as HTMLElement
      const currentColor = currentTheme.particles.color
      
      // Update particle color
      element.style.color = currentColor
      
      // Update particle intensity (opacity)
      const intensity = currentTheme.particles.intensity
      element.style.opacity = intensity.toString()
      
      // Update particle movement based on pattern
      updateParticleMovement(element, currentTheme.particles.pattern, currentTheme.particles.movement)
    })
    
    // Update atmospheric elements
    const atmosphereElements = document.querySelectorAll('[data-atmosphere]')
    atmosphereElements.forEach((atmosphere) => {
      const element = atmosphere as HTMLElement
      const { blur, opacity, scale } = currentTheme.atmosphere
      
      element.style.filter = `blur(${blur}px)`
      element.style.opacity = opacity.toString()
      element.style.transform = `scale(${scale})`
    })
    
  }, [generateGradientCSS, generateTransitionGradient])

  // Update particle movement patterns
  const updateParticleMovement = useCallback((
    element: HTMLElement,
    pattern: 'float' | 'orbit' | 'pulse' | 'drift',
    speed: 'slow' | 'medium' | 'fast'
  ) => {
    // Kill existing animations
    gsap.killTweensOf(element)
    
    // Speed multipliers
    const speedMultiplier = {
      slow: 0.5,
      medium: 1,
      fast: 1.5
    }[speed]
    
    // Apply movement pattern
    switch (pattern) {
      case 'float':
        gsap.to(element, {
          y: '+=20',
          duration: 3 * speedMultiplier,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        break
        
      case 'orbit':
        gsap.to(element, {
          rotation: 360,
          duration: 8 * speedMultiplier,
          repeat: -1,
          ease: 'none'
        })
        gsap.to(element, {
          x: '+=15',
          y: '+=10',
          duration: 4 * speedMultiplier,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        break
        
      case 'pulse':
        gsap.to(element, {
          scale: 1.2,
          opacity: 0.8,
          duration: 1.5 * speedMultiplier,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        })
        break
        
      case 'drift':
        gsap.to(element, {
          x: '+=30',
          y: '+=15',
          rotation: 15,
          duration: 6 * speedMultiplier,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })
        break
    }
  }, [])

  // Get current background CSS for external use
  const getCurrentBackgroundCSS = useCallback((): string => {
    if (syncState.isTransitioning && syncState.previousTheme) {
      return generateTransitionGradient(
        syncState.previousTheme,
        syncState.currentTheme,
        syncState.transitionProgress
      )
    }
    
    return generateGradientCSS(syncState.currentTheme)
  }, [syncState, generateGradientCSS, generateTransitionGradient])

  // Get current particle configuration
  const getCurrentParticleConfig = useCallback(() => {
    return {
      color: syncState.currentTheme.particles.color,
      intensity: syncState.currentTheme.particles.intensity,
      movement: syncState.currentTheme.particles.movement,
      pattern: syncState.currentTheme.particles.pattern
    }
  }, [syncState.currentTheme])

  // Get current atmosphere configuration
  const getCurrentAtmosphereConfig = useCallback(() => {
    return syncState.currentTheme.atmosphere
  }, [syncState.currentTheme])

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (gradientTimelineRef.current) {
        gradientTimelineRef.current.kill()
      }
      if (particleTimelineRef.current) {
        particleTimelineRef.current.kill()
      }
      if (atmosphereTimelineRef.current) {
        atmosphereTimelineRef.current.kill()
      }
      
      console.log('🧹 Background sync cleaned up')
    }
  }, [])

  return {
    // State
    syncState,
    currentTheme: syncState.currentTheme,
    isTransitioning: syncState.isTransitioning,
    
    // Methods
    syncWithSection,
    getThemeForSection,
    getCurrentBackgroundCSS,
    getCurrentParticleConfig,
    getCurrentAtmosphereConfig,
    
    // Utilities
    themes: BACKGROUND_THEMES
  }
}