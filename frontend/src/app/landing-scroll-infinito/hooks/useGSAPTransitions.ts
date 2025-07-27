'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins only on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Animation configuration interfaces
interface AnimationConfig {
  duration: number
  ease: string
  stagger?: number
  delay?: number
  properties: Record<string, any>
  customAnimation?: (progress: number) => gsap.core.Timeline
}

interface SectionTransition {
  id: string
  element: HTMLElement
  enterAnimation: AnimationConfig
  exitAnimation: AnimationConfig
  updateAnimation?: (progress: number) => void
}

interface TransitionState {
  isActive: boolean
  currentTimeline: gsap.core.Timeline | null
  cleanupFunctions: (() => void)[]
}

/**
 * Advanced GSAP transitions system for infinite scroll
 * Manages smooth transitions between sections with optimized performance
 */
export function useGSAPTransitions() {
  const transitionStateRef = useRef<TransitionState>({
    isActive: false,
    currentTimeline: null,
    cleanupFunctions: []
  })

  const sectionsRef = useRef<Map<string, SectionTransition>>(new Map())
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const isInitializedRef = useRef(false)

  // Enhanced animation configurations with refined timing and easing
  const defaultAnimations = {
    hero: {
      enter: {
        duration: 1.8,
        ease: 'power3.out',
        stagger: 0.08,
        properties: { opacity: 1, scale: 1, y: 0, rotationX: 0, filter: 'blur(0px)' }
      },
      exit: {
        duration: 1.2,
        ease: 'power3.in',
        stagger: 0.05,
        properties: { opacity: 0, scale: 1.1, y: -80, rotationX: -15, filter: 'blur(8px)' }
      }
    },
    about: {
      enter: {
        duration: 1.0,
        ease: 'power2.out',
        delay: 0.2,
        properties: { opacity: 1, y: 0, scale: 1 }
      },
      exit: {
        duration: 0.8,
        ease: 'power2.in',
        properties: { opacity: 0, y: 30, scale: 0.95 }
      }
    },
    features: {
      enter: {
        duration: 1.2,
        ease: 'back.out(1.7)',
        stagger: 0.15,
        properties: { opacity: 1, y: 0, scale: 1, rotationY: 0 }
      },
      exit: {
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.05,
        properties: { opacity: 0, y: -30, scale: 0.9 }
      }
    },
    results: {
      enter: {
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.2,
        properties: { opacity: 1, scale: 1, rotationX: 0, y: 0 }
      },
      exit: {
        duration: 1.0,
        ease: 'power2.in',
        stagger: 0.1,
        properties: { opacity: 0, scale: 1.1, rotationX: 15, y: -30 }
      }
    },
    testimonials: {
      enter: {
        duration: 1.0,
        ease: 'power2.out',
        stagger: 0.2,
        properties: { opacity: 1, x: 0, rotationY: 0 }
      },
      exit: {
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.1,
        properties: { opacity: 0, x: -100, rotationY: -15 }
      }
    },
    pricing: {
      enter: {
        duration: 1.2,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        properties: { opacity: 1, y: 0, rotationX: 0, scale: 1 }
      },
      exit: {
        duration: 0.8,
        ease: 'power2.in',
        stagger: 0.05,
        properties: { opacity: 0, y: 50, scale: 0.8 }
      }
    },
    faq: {
      enter: {
        duration: 1.0,
        ease: 'power2.out',
        stagger: 0.1,
        properties: { opacity: 1, height: 'auto', y: 0 }
      },
      exit: {
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.05,
        properties: { opacity: 0, height: 0, y: -20 }
      }
    },
    cta: {
      enter: {
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        properties: { opacity: 1, scale: 1, rotationZ: 0 }
      },
      exit: {
        duration: 0.8,
        ease: 'power2.in',
        properties: { opacity: 0, scale: 0.9 }
      }
    }
  }

  // Register section for transitions
  const registerSection = useCallback((id: string, element: HTMLElement) => {
    if (!element) return

    const config = defaultAnimations[id as keyof typeof defaultAnimations]
    if (!config) {
      console.warn(`No animation config found for section: ${id}`)
      return
    }

    const sectionTransition: SectionTransition = {
      id,
      element,
      enterAnimation: config.enter,
      exitAnimation: config.exit
    }

    sectionsRef.current.set(id, sectionTransition)
    
    // Set initial state - only hero visible initially
    if (id === 'hero') {
      gsap.set(element, { opacity: 1, visibility: 'visible' })
    } else {
      gsap.set(element, { 
        opacity: 0, 
        visibility: 'hidden',
        y: 50,
        scale: 0.9
      })
    }

    console.log(`🎬 Section registered for transitions: ${id}`)
  }, [])

  // Create section enter animation
  const createEnterAnimation = useCallback((sectionId: string, progress: number = 1) => {
    const section = sectionsRef.current.get(sectionId)
    if (!section) return null

    const { element, enterAnimation } = section
    
    // Check if section has custom animation
    if ((enterAnimation as any).customAnimation) {
      return (enterAnimation as any).customAnimation(progress)
    }

    const { duration, ease, stagger, delay, properties } = enterAnimation

    // Create timeline for enter animation
    const tl = gsap.timeline()

    // Set visibility first
    tl.set(element, { visibility: 'visible' })

    // Find animatable children for stagger effects
    const children = element.querySelectorAll('.glass-card, .animate-element, h1, h2, h3, p, button, .feature-card, .metric-card')
    
    if (children.length > 0 && stagger) {
      // Animate children with stagger
      tl.to(children, {
        ...properties,
        duration,
        ease,
        stagger,
        delay: delay || 0
      }, 0)
    } else {
      // Animate main element
      tl.to(element, {
        ...properties,
        duration,
        ease,
        delay: delay || 0
      }, 0)
    }

    // Scale timeline based on progress
    tl.progress(progress)

    return tl
  }, [])

  // Create section exit animation
  const createExitAnimation = useCallback((sectionId: string, progress: number = 1) => {
    const section = sectionsRef.current.get(sectionId)
    if (!section) return null

    const { element, exitAnimation } = section
    const { duration, ease, stagger, properties } = exitAnimation

    // Create timeline for exit animation
    const tl = gsap.timeline()

    // Find animatable children for stagger effects
    const children = element.querySelectorAll('.glass-card, .animate-element, h1, h2, h3, p, button, .feature-card')
    
    if (children.length > 0 && stagger) {
      // Animate children with stagger
      tl.to(children, {
        ...properties,
        duration,
        ease,
        stagger
      }, 0)
    } else {
      // Animate main element
      tl.to(element, {
        ...properties,
        duration,
        ease
      }, 0)
    }

    // Hide element at the end
    tl.set(element, { visibility: 'hidden' }, '>')

    // Scale timeline based on progress
    tl.progress(progress)

    return tl
  }, [])

  // Execute transition between sections
  const executeTransition = useCallback((fromSectionId: string | null, toSectionId: string, progress: number = 1) => {
    // Kill current timeline if running
    if (transitionStateRef.current.currentTimeline) {
      transitionStateRef.current.currentTimeline.kill()
    }

    // Create master timeline for the transition
    const masterTl = gsap.timeline({
      onStart: () => {
        transitionStateRef.current.isActive = true
        console.log(`🎬 Transition started: ${fromSectionId} → ${toSectionId}`)
      },
      onComplete: () => {
        transitionStateRef.current.isActive = false
        transitionStateRef.current.currentTimeline = null
        console.log(`✅ Transition completed: ${fromSectionId} → ${toSectionId}`)
      }
    })

    // Exit animation for previous section
    if (fromSectionId && fromSectionId !== toSectionId) {
      const exitTl = createExitAnimation(fromSectionId, progress)
      if (exitTl) {
        masterTl.add(exitTl, 0)
      }
    }

    // Enter animation for new section
    const enterTl = createEnterAnimation(toSectionId, progress)
    if (enterTl) {
      // Slight overlap for smoother transition
      masterTl.add(enterTl, fromSectionId ? 0.2 : 0)
    }

    transitionStateRef.current.currentTimeline = masterTl
    return masterTl
  }, [createEnterAnimation, createExitAnimation])

  // Update section based on scroll progress
  const updateSectionProgress = useCallback((sectionId: string, progress: number) => {
    const section = sectionsRef.current.get(sectionId)
    if (!section || !section.updateAnimation) return

    section.updateAnimation(progress)
  }, [])

  // Create specialized animations for specific sections
  const createSpecializedAnimations = useCallback(() => {
    // Hero section letter-by-letter animation
    const heroSection = sectionsRef.current.get('hero')
    if (heroSection) {
      const titleElement = heroSection.element.querySelector('h1')
      if (titleElement) {
        // Split text into characters
        const text = titleElement.textContent || ''
        titleElement.innerHTML = text.split('').map(char => 
          `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('')

        // Create letter animation
        const chars = titleElement.querySelectorAll('.char')
        gsap.set(chars, { opacity: 0, y: 50, rotationX: -90 })
        
        // Override enter animation for hero
        const originalEnter = sectionsRef.current.get('hero')?.enterAnimation
        if (originalEnter) {
          sectionsRef.current.set('hero', {
            ...sectionsRef.current.get('hero')!,
            enterAnimation: {
              ...originalEnter,
              properties: { opacity: 1, y: 0, rotationX: 0 }
            }
          })
        }
      }
    }

    // Results section counter animations
    const resultsSection = sectionsRef.current.get('results')
    if (resultsSection) {
      const counters = resultsSection.element.querySelectorAll('[data-counter-target]')
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter-target') || '0')
        const obj = { value: 0 }
        
        const counterAnimation = gsap.to(obj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = Math.round(obj.value).toString()
          },
          paused: true
        })

        // Store animation reference for external triggering
        ;(counter as any)._counterAnimation = counterAnimation
      })

      // Create custom enter animation for Results section
      const customEnterAnimation = (progress: number = 1) => {
        const element = resultsSection.element
        const title = element.querySelector('h2')
        const subtitle = element.querySelector('p')
        const metricCards = element.querySelectorAll('.metric-card')
        const cta = element.querySelector('.text-center:last-child')

        const tl = gsap.timeline()

        // Set visibility
        tl.set(element, { visibility: 'visible' })

        // 1. Dramatic fade in of title
        if (title) {
          tl.to(title, {
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 1.5,
            ease: 'power3.out'
          }, 0)
        }

        // 2. Subtitle fade in
        if (subtitle) {
          tl.to(subtitle, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          }, 0.3)
        }

        // 3. Animate metric cards with stagger and trigger counters
        if (metricCards.length > 0) {
          tl.to(metricCards, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            stagger: {
              amount: 0.8,
              from: 'start'
            },
            onStart: () => {
              // Trigger counter animations with stagger
              metricCards.forEach((card, index) => {
                const counter = card.querySelector('[data-counter-target]') as any
                if (counter && counter._counterAnimation) {
                  gsap.delayedCall(0.5 + (index * 0.2), () => {
                    counter._counterAnimation.restart()
                  })
                }
              })
            }
          }, 0.8)
        }

        // 4. CTA fade in
        if (cta) {
          tl.to(cta, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
          }, 1.5)
        }

        tl.progress(progress)
        return tl
      }

      // Override the default enter animation
      sectionsRef.current.set('results', {
        ...resultsSection,
        enterAnimation: {
          ...resultsSection.enterAnimation,
          customAnimation: customEnterAnimation
        }
      })
    }

    console.log('🎨 Specialized animations created')
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    // Kill all timelines
    if (transitionStateRef.current.currentTimeline) {
      transitionStateRef.current.currentTimeline.kill()
    }
    
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill()
    }

    // Run cleanup functions
    transitionStateRef.current.cleanupFunctions.forEach(fn => fn())
    transitionStateRef.current.cleanupFunctions = []

    // Clear sections
    sectionsRef.current.clear()

    // Kill all ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    console.log('🧹 GSAP Transitions cleaned up')
  }, [])

  // Initialize GSAP transitions system
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return

    console.log('🚀 Initializing GSAP Transitions System...')

    // Set GSAP defaults for performance - force3D: true
    gsap.defaults({
      ease: 'power2.out',
      duration: 1,
      force3D: true
    })

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      ignoreMobileResize: true
    })

    // Create specialized animations after DOM is ready
    const timer = setTimeout(() => {
      createSpecializedAnimations()
      isInitializedRef.current = true
      console.log('✅ GSAP Transitions System initialized')
    }, 300)

    return () => {
      clearTimeout(timer)
      cleanup()
      isInitializedRef.current = false
    }
  }, [createSpecializedAnimations, cleanup])

  // Enhanced performance monitoring and optimization
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let performanceHistory: number[] = []
    
    const monitorPerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        performanceHistory.push(fps)
        
        // Keep only last 10 seconds of history
        if (performanceHistory.length > 10) {
          performanceHistory.shift()
        }
        
        const averageFps = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length
        
        // Apply GPU acceleration optimizations based on performance
        if (averageFps < 20) {
          // Critical performance - apply aggressive optimizations
          document.documentElement.classList.add('gpu-accelerated', 'enable-will-change')
          gsap.globalTimeline.timeScale(0.3) // Significantly slow down animations
          
          // Force GPU acceleration on all animated elements
          document.querySelectorAll('.animate-element, .glass-card, .feature-card').forEach((el, index) => {
            if (el instanceof HTMLElement) {
              el.style.transform = 'translate3d(0,0,0)'
              el.style.willChange = 'transform, opacity'
              el.style.backfaceVisibility = 'hidden'
            }
          })
          
          console.warn('🚨 Critical performance detected, applying aggressive GPU optimizations')
        } else if (averageFps < 30) {
          // Low performance - apply moderate optimizations
          document.documentElement.classList.add('gpu-accelerated')
          gsap.globalTimeline.timeScale(0.6) // Moderately slow down animations
          
          console.warn('⚠️ Low performance detected, applying GPU acceleration')
        } else if (averageFps > 50) {
          // Good performance - restore normal speed and cleanup unnecessary optimizations
          gsap.globalTimeline.timeScale(1) // Normal speed
          
          // Clean up will-change properties that are no longer needed
          document.querySelectorAll('[style*="will-change"]').forEach((el) => {
            if (el instanceof HTMLElement && !el.classList.contains('animating')) {
              el.style.willChange = 'auto'
            }
          })
        }
        
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(monitorPerformance)
    }
    
    const rafId = requestAnimationFrame(monitorPerformance)
    
    return () => cancelAnimationFrame(rafId)
  }, [])

  return {
    // Core methods
    registerSection,
    executeTransition,
    updateSectionProgress,
    
    // Animation creators
    createEnterAnimation,
    createExitAnimation,
    
    // State
    isTransitioning: transitionStateRef.current.isActive,
    currentTimeline: transitionStateRef.current.currentTimeline,
    
    // Utilities
    cleanup,
    isInitialized: isInitializedRef.current
  }
}