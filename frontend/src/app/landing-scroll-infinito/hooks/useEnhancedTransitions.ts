'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  TIMING_CONFIG, 
  ANIMATION_PROPERTIES, 
  EASING_CURVES, 
  SECTION_TRANSITIONS,
  PERFORMANCE_SETTINGS 
} from '../config/animationConfig'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Enhanced Transitions Hook
 * Task 19.2: Refined transitions between sections with improved timing and easing
 */

interface TransitionContext {
  fromSection: string | null
  toSection: string
  progress: number
  direction: 'up' | 'down'
  isReversed: boolean
}

interface SectionElements {
  container: HTMLElement
  title?: HTMLElement
  subtitle?: HTMLElement
  content?: HTMLElement[]
  cards?: HTMLElement[]
  buttons?: HTMLElement[]
  metrics?: HTMLElement[]
}

export function useEnhancedTransitions() {
  const sectionsRef = useRef<Map<string, SectionElements>>(new Map())
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const performanceLevel = useRef<'high' | 'medium' | 'low'>('high')
  const transitionQueueRef = useRef<TransitionContext[]>([])
  const isTransitioningRef = useRef(false)

  // Detect performance level
  const detectPerformanceLevel = useCallback(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) {
      performanceLevel.current = 'low'
      return
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
    
    // Simple heuristic based on common GPU patterns
    if (renderer.includes('Intel') || renderer.includes('Software')) {
      performanceLevel.current = 'medium'
    } else if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Apple')) {
      performanceLevel.current = 'high'
    } else {
      performanceLevel.current = 'medium'
    }

    console.log(`🎯 Performance level detected: ${performanceLevel.current}`)
  }, [])

  // Register section elements for enhanced transitions
  const registerSection = useCallback((sectionId: string, container: HTMLElement) => {
    if (!container) return

    // Find section elements
    const elements: SectionElements = {
      container,
      title: container.querySelector('h1, h2, .section-title') as HTMLElement,
      subtitle: container.querySelector('p, .subtitle') as HTMLElement,
      content: Array.from(container.querySelectorAll('.animate-element')) as HTMLElement[],
      cards: Array.from(container.querySelectorAll('.glass-card, .feature-card, .card')) as HTMLElement[],
      buttons: Array.from(container.querySelectorAll('button, .btn, [role="button"]')) as HTMLElement[],
      metrics: Array.from(container.querySelectorAll('.counter-element, .metric-card')) as HTMLElement[]
    }

    sectionsRef.current.set(sectionId, elements)
    
    // Set initial states based on section type
    setInitialSectionState(sectionId, elements)
    
    console.log(`🎬 Enhanced transition registered for: ${sectionId}`)
  }, [])

  // Set initial state for section elements
  const setInitialSectionState = useCallback((sectionId: string, elements: SectionElements) => {
    const properties = ANIMATION_PROPERTIES[sectionId as keyof typeof ANIMATION_PROPERTIES]
    if (!properties) return

    const { container, title, subtitle, content, cards, buttons, metrics } = elements
    const settings = PERFORMANCE_SETTINGS[performanceLevel.current]

    // Set container initial state
    if (sectionId === 'hero') {
      gsap.set(container, { opacity: 1, visibility: 'visible' })
    } else {
      gsap.set(container, { 
        opacity: 0, 
        visibility: 'hidden',
        ...properties.exit
      })
    }

    // Set title initial state with letter splitting for hero
    if (title) {
      if (sectionId === 'hero') {
        // Split title into characters for letter-by-letter animation
        const text = title.textContent || ''
        title.innerHTML = text.split('').map(char => 
          `<span class="char" style="display: inline-block; opacity: 0; transform: translateY(100px) rotateX(-90deg) scale(0.5);">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('')
      } else {
        gsap.set(title, { opacity: 0, y: 50 })
      }
    }

    // Set other elements initial states
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 30 })
    if (content.length) gsap.set(content, { opacity: 0, y: 40 })
    if (cards.length) gsap.set(cards, { opacity: 0, y: 60, scale: 0.9 })
    if (buttons.length) gsap.set(buttons, { opacity: 0, scale: 0.8 })
    if (metrics.length) gsap.set(metrics, { opacity: 0, scale: 0.5 })
  }, [])

  // Create enhanced enter animation
  const createEnterAnimation = useCallback((sectionId: string, progress: number = 1): gsap.core.Timeline => {
    const elements = sectionsRef.current.get(sectionId)
    const properties = ANIMATION_PROPERTIES[sectionId as keyof typeof ANIMATION_PROPERTIES]
    const timing = TIMING_CONFIG.sections[sectionId as keyof typeof TIMING_CONFIG.sections]
    const settings = PERFORMANCE_SETTINGS[performanceLevel.current]
    
    if (!elements || !properties || !timing) {
      return gsap.timeline()
    }

    const { container, title, subtitle, content, cards, buttons, metrics } = elements
    const timeline = gsap.timeline()

    // Set container visibility
    timeline.set(container, { visibility: 'visible' })

    // Animate container
    timeline.to(container, {
      ...properties.enter,
      duration: timing.enter.duration,
      delay: timing.enter.delay,
      ease: EASING_CURVES.entrance.dramatic,
      filter: settings.enableBlur ? properties.enter.filter : 'none'
    }, 0)

    // Animate title with special handling for hero
    if (title) {
      if (sectionId === 'hero') {
        const chars = title.querySelectorAll('.char')
        timeline.to(chars, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.8,
          ease: EASING_CURVES.entrance.elastic,
          stagger: timing.letterStagger * settings.staggerAmount
        }, timing.enter.delay + 0.2)
      } else {
        timeline.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: EASING_CURVES.entrance.smooth
        }, timing.enter.delay + 0.1)
      }
    }

    // Animate subtitle
    if (subtitle) {
      timeline.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: EASING_CURVES.entrance.gentle
      }, timing.enter.delay + 0.3)
    }

    // Animate content elements
    if (content.length) {
      timeline.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: EASING_CURVES.entrance.smooth,
        stagger: timing.elementStagger * settings.staggerAmount
      }, timing.enter.delay + 0.4)
    }

    // Animate cards with enhanced effects
    if (cards.length) {
      const cardProperties = properties.cards || properties.enter
      timeline.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: timing.enter.duration * 0.8,
        ease: EASING_CURVES.entrance.back,
        stagger: timing.cardStagger * settings.staggerAmount,
        boxShadow: settings.enableShadows ? '0 20px 40px rgba(59, 130, 246, 0.2)' : 'none'
      }, timing.enter.delay + 0.5)
    }

    // Animate buttons
    if (buttons.length) {
      timeline.to(buttons, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: EASING_CURVES.entrance.back,
        stagger: 0.1
      }, timing.enter.delay + 0.7)
    }

    // Animate metrics with counters
    if (metrics.length && sectionId === 'results') {
      timeline.to(metrics, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: EASING_CURVES.entrance.elastic,
        stagger: timing.counterStagger * settings.staggerAmount,
        onStart: () => {
          // Trigger counter animations
          metrics.forEach((metric, index) => {
            const counterTarget = metric.getAttribute('data-counter')
            if (counterTarget) {
              gsap.delayedCall(index * timing.counterStagger, () => {
                animateCounter(metric, parseInt(counterTarget))
              })
            }
          })
        }
      }, timing.enter.delay + 0.6)
    } else if (metrics.length) {
      timeline.to(metrics, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: EASING_CURVES.entrance.smooth,
        stagger: 0.1
      }, timing.enter.delay + 0.5)
    }

    // Scale timeline based on progress
    timeline.progress(progress)
    
    return timeline
  }, [])

  // Create enhanced exit animation
  const createExitAnimation = useCallback((sectionId: string, progress: number = 1): gsap.core.Timeline => {
    const elements = sectionsRef.current.get(sectionId)
    const properties = ANIMATION_PROPERTIES[sectionId as keyof typeof ANIMATION_PROPERTIES]
    const timing = TIMING_CONFIG.sections[sectionId as keyof typeof TIMING_CONFIG.sections]
    const settings = PERFORMANCE_SETTINGS[performanceLevel.current]
    
    if (!elements || !properties || !timing) {
      return gsap.timeline()
    }

    const { container, title, subtitle, content, cards, buttons, metrics } = elements
    const timeline = gsap.timeline()

    // Animate elements out in reverse order
    if (buttons.length) {
      timeline.to(buttons, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: EASING_CURVES.exit.quick,
        stagger: 0.05
      }, 0)
    }

    if (metrics.length) {
      timeline.to(metrics, {
        opacity: 0,
        scale: 0.5,
        rotationZ: 180,
        duration: 0.4,
        ease: EASING_CURVES.exit.dramatic,
        stagger: 0.05
      }, 0.1)
    }

    if (cards.length) {
      timeline.to(cards, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        rotationX: 15,
        duration: timing.exit.duration * 0.6,
        ease: EASING_CURVES.exit.smooth,
        stagger: 0.05
      }, 0.2)
    }

    if (content.length) {
      timeline.to(content, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: EASING_CURVES.exit.quick,
        stagger: 0.03
      }, 0.3)
    }

    if (subtitle) {
      timeline.to(subtitle, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: EASING_CURVES.exit.quick
      }, 0.4)
    }

    if (title) {
      if (sectionId === 'hero') {
        const chars = title.querySelectorAll('.char')
        timeline.to(chars, {
          opacity: 0,
          y: -50,
          rotationX: 90,
          scale: 0.5,
          duration: 0.6,
          ease: EASING_CURVES.exit.dramatic,
          stagger: 0.02
        }, 0.5)
      } else {
        timeline.to(title, {
          opacity: 0,
          y: -30,
          duration: 0.5,
          ease: EASING_CURVES.exit.smooth
        }, 0.5)
      }
    }

    // Animate container last
    timeline.to(container, {
      ...properties.exit,
      duration: timing.exit.duration,
      ease: EASING_CURVES.exit.dramatic,
      filter: settings.enableBlur ? properties.exit.filter : 'none'
    }, 0.6)

    // Hide container at the end
    timeline.set(container, { visibility: 'hidden' })

    // Scale timeline based on progress
    timeline.progress(progress)
    
    return timeline
  }, [])

  // Execute enhanced transition between sections
  const executeTransition = useCallback((context: TransitionContext) => {
    const { fromSection, toSection, progress, direction } = context
    
    // Kill active timeline
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill()
    }

    // Get transition configuration
    const transitionKey = fromSection ? `${fromSection}-to-${toSection}` : null
    const transitionConfig = transitionKey ? SECTION_TRANSITIONS[transitionKey as keyof typeof SECTION_TRANSITIONS] : null

    // Create master timeline
    const masterTimeline = gsap.timeline({
      onStart: () => {
        isTransitioningRef.current = true
        console.log(`🎬 Enhanced transition: ${fromSection} → ${toSection}`)
      },
      onComplete: () => {
        isTransitioningRef.current = false
        activeTimelineRef.current = null
        processTransitionQueue()
      }
    })

    if (transitionConfig && fromSection) {
      // Use custom transition configuration
      const { overlap, ease, duration, properties } = transitionConfig
      
      // Exit animation for previous section
      const exitTl = gsap.timeline()
      const fromElements = sectionsRef.current.get(fromSection)
      if (fromElements) {
        exitTl.to(fromElements.container, {
          ...properties[fromSection as keyof typeof properties],
          duration: duration * 0.6,
          ease
        })
      }

      // Enter animation for new section
      const enterTl = gsap.timeline()
      const toElements = sectionsRef.current.get(toSection)
      if (toElements) {
        enterTl.set(toElements.container, { visibility: 'visible' })
        enterTl.to(toElements.container, {
          ...properties[toSection as keyof typeof properties],
          duration: duration,
          ease
        })
      }

      // Add to master timeline with overlap
      masterTimeline.add(exitTl, 0)
      masterTimeline.add(enterTl, overlap)
      
      // Add detailed element animations
      masterTimeline.add(createEnterAnimation(toSection, progress), overlap + 0.2)
      
    } else {
      // Use standard animations
      if (fromSection) {
        const exitTl = createExitAnimation(fromSection, progress)
        masterTimeline.add(exitTl, 0)
      }

      const enterTl = createEnterAnimation(toSection, progress)
      masterTimeline.add(enterTl, fromSection ? 0.3 : 0)
    }

    activeTimelineRef.current = masterTimeline
    return masterTimeline
  }, [createEnterAnimation, createExitAnimation])

  // Process transition queue
  const processTransitionQueue = useCallback(() => {
    if (isTransitioningRef.current || transitionQueueRef.current.length === 0) return

    const nextTransition = transitionQueueRef.current.shift()
    if (nextTransition) {
      executeTransition(nextTransition)
    }
  }, [executeTransition])

  // Queue transition
  const queueTransition = useCallback((context: TransitionContext) => {
    if (isTransitioningRef.current) {
      transitionQueueRef.current.push(context)
    } else {
      executeTransition(context)
    }
  }, [executeTransition])

  // Animate counter with enhanced easing
  const animateCounter = useCallback((element: HTMLElement, target: number) => {
    const obj = { value: 0 }
    const suffix = element.textContent?.includes('%') ? '%' : 
                  element.textContent?.includes('+') ? '+' : ''
    
    gsap.to(obj, {
      value: target,
      duration: TIMING_CONFIG.sections.results.counterDuration,
      ease: EASING_CURVES.entrance.smooth,
      onUpdate: () => {
        element.textContent = Math.round(obj.value) + suffix
      }
    })
  }, [])

  // Initialize enhanced transitions
  useEffect(() => {
    if (typeof window === 'undefined') return

    detectPerformanceLevel()
    
    // Apply performance-based optimizations
    const settings = PERFORMANCE_SETTINGS[performanceLevel.current]
    document.documentElement.classList.toggle('enable-particles', settings.enableParticles)
    document.documentElement.classList.toggle('enable-blur', settings.enableBlur)
    document.documentElement.classList.toggle('enable-shadows', settings.enableShadows)

    console.log('✅ Enhanced transitions initialized')

    return () => {
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill()
      }
      transitionQueueRef.current = []
      console.log('🧹 Enhanced transitions cleaned up')
    }
  }, [detectPerformanceLevel])

  return {
    // Core methods
    registerSection,
    executeTransition,
    queueTransition,
    
    // Animation creators
    createEnterAnimation,
    createExitAnimation,
    
    // Utilities
    animateCounter,
    isTransitioning: isTransitioningRef.current,
    performanceLevel: performanceLevel.current
  }
}