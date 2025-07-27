'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollSection } from './useScrollController'

// Section animation configuration
export interface SectionAnimationConfig {
  enter: gsap.TweenVars
  exit: gsap.TweenVars
  duration: number
  ease: string
}

// Default animation configurations for each section type
const DEFAULT_ANIMATIONS: Record<string, SectionAnimationConfig> = {
  hero: {
    enter: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.2, y: -100 },
    duration: 0.8,
    ease: 'power2.inOut'
  },
  about: {
    enter: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: -50 },
    duration: 0.6,
    ease: 'power2.inOut'
  },
  features: {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    duration: 0.5,
    ease: 'power2.inOut'
  },
  results: {
    enter: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    duration: 0.4,
    ease: 'power2.inOut'
  },
  testimonials: {
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    duration: 0.5,
    ease: 'power2.inOut'
  },
  pricing: {
    enter: { opacity: 1, rotationY: 0 },
    exit: { opacity: 0, rotationY: 15 },
    duration: 0.6,
    ease: 'power2.inOut'
  },
  faq: {
    enter: { opacity: 1, scaleY: 1 },
    exit: { opacity: 0, scaleY: 0.8 },
    duration: 0.4,
    ease: 'power2.inOut'
  },
  cta: {
    enter: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    duration: 0.7,
    ease: 'power2.inOut'
  }
}

/**
 * Hook for managing individual section animations and states
 */
export function useSectionManager(section: ScrollSection) {
  const elementRef = useRef<HTMLElement | null>(null)
  const enterTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const isAnimatingRef = useRef(false)

  // Get animation configuration for this section
  const getAnimationConfig = useCallback((): SectionAnimationConfig => {
    return DEFAULT_ANIMATIONS[section.id] || DEFAULT_ANIMATIONS.hero
  }, [section.id])

  // Set initial state for section
  const setInitialState = useCallback(() => {
    if (!elementRef.current) return

    const config = getAnimationConfig()
    
    // Set initial hidden state (except for hero)
    if (section.index === 0) {
      gsap.set(elementRef.current, config.enter)
    } else {
      gsap.set(elementRef.current, {
        opacity: 0,
        visibility: 'hidden',
        ...config.exit
      })
    }
  }, [section.index, getAnimationConfig])

  // Animate section entrance
  const animateEnter = useCallback((progress: number = 0) => {
    if (!elementRef.current || isAnimatingRef.current) return

    isAnimatingRef.current = true
    const config = getAnimationConfig()

    // Kill any existing animations
    if (exitTimelineRef.current) {
      exitTimelineRef.current.kill()
      exitTimelineRef.current = null
    }

    // Create enter timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
        console.log(`✨ Section ${section.id} entered`)
      }
    })

    // Set visibility first
    timeline.set(elementRef.current, { visibility: 'visible' })

    // Animate to enter state
    timeline.to(elementRef.current, {
      ...config.enter,
      duration: config.duration * (1 - progress),
      ease: config.ease
    })

    enterTimelineRef.current = timeline

  }, [section.id, getAnimationConfig])

  // Animate section exit
  const animateExit = useCallback((progress: number = 0) => {
    if (!elementRef.current || isAnimatingRef.current) return

    isAnimatingRef.current = true
    const config = getAnimationConfig()

    // Kill any existing animations
    if (enterTimelineRef.current) {
      enterTimelineRef.current.kill()
      enterTimelineRef.current = null
    }

    // Create exit timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        if (elementRef.current) {
          gsap.set(elementRef.current, { visibility: 'hidden' })
        }
        isAnimatingRef.current = false
        console.log(`🌙 Section ${section.id} exited`)
      }
    })

    // Animate to exit state
    timeline.to(elementRef.current, {
      ...config.exit,
      duration: config.duration * (1 - progress),
      ease: config.ease
    })

    exitTimelineRef.current = timeline

  }, [section.id, getAnimationConfig])

  // Update section visibility based on scroll progress
  const updateVisibility = useCallback((isActive: boolean, isVisible: boolean, transitionProgress: number) => {
    if (!elementRef.current) return

    if (isActive && !isAnimatingRef.current) {
      // Section is becoming active - animate enter
      animateEnter(transitionProgress)
    } else if (!isVisible && !isAnimatingRef.current) {
      // Section is becoming invisible - animate exit
      animateExit(1 - transitionProgress)
    }
  }, [animateEnter, animateExit])

  // Register element with section manager
  const registerElement = useCallback((element: HTMLElement) => {
    elementRef.current = element
    setInitialState()
    console.log(`🎭 Section manager registered for: ${section.id}`)
  }, [section.id, setInitialState])

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (enterTimelineRef.current) {
        enterTimelineRef.current.kill()
      }
      if (exitTimelineRef.current) {
        exitTimelineRef.current.kill()
      }
      console.log(`🧹 Section manager cleaned up: ${section.id}`)
    }
  }, [section.id])

  return {
    // Methods
    registerElement,
    updateVisibility,
    animateEnter,
    animateExit,
    setInitialState,
    
    // State
    isAnimating: isAnimatingRef.current,
    element: elementRef.current,
    
    // Configuration
    animationConfig: getAnimationConfig()
  }
}