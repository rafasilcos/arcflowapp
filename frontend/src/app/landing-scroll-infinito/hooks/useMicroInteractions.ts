'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { MICRO_INTERACTIONS, TIMING_CONFIG } from '../config/animationConfig'

/**
 * Enhanced Micro-Interactions Hook
 * Task 19.3: Add micro-interactions and visual feedback
 */

interface MicroInteractionConfig {
  element: HTMLElement
  type: 'button' | 'card' | 'navigation' | 'text'
  variant: string
  enableHover?: boolean
  enableFocus?: boolean
  enableActive?: boolean
  enablePulse?: boolean
  customStates?: Record<string, any>
}

interface InteractionState {
  isHovered: boolean
  isFocused: boolean
  isActive: boolean
  isPulsing: boolean
}

export function useMicroInteractions() {
  const interactionsRef = useRef<Map<HTMLElement, MicroInteractionConfig>>(new Map())
  const statesRef = useRef<Map<HTMLElement, InteractionState>>(new Map())
  const timelinesRef = useRef<Map<HTMLElement, gsap.core.Timeline>>(new Map())

  // Register element for micro-interactions
  const registerElement = useCallback((config: MicroInteractionConfig) => {
    const { element, type, variant } = config
    
    if (!element || interactionsRef.current.has(element)) return

    // Store configuration
    interactionsRef.current.set(element, config)
    
    // Initialize state
    statesRef.current.set(element, {
      isHovered: false,
      isFocused: false,
      isActive: false,
      isPulsing: false
    })

    // Get interaction config
    const interactionConfig = MICRO_INTERACTIONS[type]?.[variant]
    if (!interactionConfig) {
      console.warn(`No micro-interaction config found for ${type}.${variant}`)
      return
    }

    // Set initial state
    if (interactionConfig.idle) {
      gsap.set(element, interactionConfig.idle)
    }

    // Add event listeners
    if (config.enableHover !== false) {
      element.addEventListener('mouseenter', () => handleHover(element, true))
      element.addEventListener('mouseleave', () => handleHover(element, false))
    }

    if (config.enableFocus !== false) {
      element.addEventListener('focus', () => handleFocus(element, true))
      element.addEventListener('blur', () => handleFocus(element, false))
    }

    if (config.enableActive !== false) {
      element.addEventListener('mousedown', () => handleActive(element, true))
      element.addEventListener('mouseup', () => handleActive(element, false))
      element.addEventListener('mouseleave', () => handleActive(element, false))
    }

    // Start pulse animation if enabled
    if (config.enablePulse) {
      startPulseAnimation(element)
    }

    console.log(`🎨 Micro-interaction registered: ${type}.${variant}`)
  }, [])

  // Handle hover state
  const handleHover = useCallback((element: HTMLElement, isHovered: boolean) => {
    const state = statesRef.current.get(element)
    const config = interactionsRef.current.get(element)
    
    if (!state || !config) return

    state.isHovered = isHovered
    updateElementState(element, config, state)
  }, [])

  // Handle focus state
  const handleFocus = useCallback((element: HTMLElement, isFocused: boolean) => {
    const state = statesRef.current.get(element)
    const config = interactionsRef.current.get(element)
    
    if (!state || !config) return

    state.isFocused = isFocused
    updateElementState(element, config, state)
  }, [])

  // Handle active state
  const handleActive = useCallback((element: HTMLElement, isActive: boolean) => {
    const state = statesRef.current.get(element)
    const config = interactionsRef.current.get(element)
    
    if (!state || !config) return

    state.isActive = isActive
    updateElementState(element, config, state)

    // Add haptic feedback for mobile
    if (isActive && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }, [])

  // Update element visual state based on interaction state
  const updateElementState = useCallback((
    element: HTMLElement, 
    config: MicroInteractionConfig, 
    state: InteractionState
  ) => {
    const { type, variant } = config
    const interactionConfig = MICRO_INTERACTIONS[type]?.[variant]
    
    if (!interactionConfig) return

    // Kill existing timeline
    const existingTimeline = timelinesRef.current.get(element)
    if (existingTimeline) {
      existingTimeline.kill()
    }

    // Determine target state based on priority
    let targetState = interactionConfig.idle
    let duration = TIMING_CONFIG.microInteractions.hover.duration
    let ease = TIMING_CONFIG.microInteractions.hover.ease

    if (state.isActive && interactionConfig.active) {
      targetState = interactionConfig.active
      duration = TIMING_CONFIG.microInteractions.click.duration
      ease = TIMING_CONFIG.microInteractions.click.ease
    } else if (state.isFocused && interactionConfig.focus) {
      targetState = interactionConfig.focus
      duration = TIMING_CONFIG.microInteractions.focus.duration
      ease = TIMING_CONFIG.microInteractions.focus.ease
    } else if (state.isHovered && interactionConfig.hover) {
      targetState = interactionConfig.hover
      duration = TIMING_CONFIG.microInteractions.hover.duration
      ease = TIMING_CONFIG.microInteractions.hover.ease
    }

    // Create and store new timeline
    const timeline = gsap.timeline()
    timeline.to(element, {
      ...targetState,
      duration,
      ease,
      force3D: true
    })

    timelinesRef.current.set(element, timeline)
  }, [])

  // Start pulse animation
  const startPulseAnimation = useCallback((element: HTMLElement) => {
    const config = interactionsRef.current.get(element)
    const state = statesRef.current.get(element)
    
    if (!config || !state) return

    state.isPulsing = true

    const pulseTimeline = gsap.timeline({ repeat: -1, yoyo: true })
    
    // Get pulse configuration based on element type
    let pulseConfig = { scale: 1.05, duration: 2.0 }
    
    if (config.type === 'button' && config.variant === 'primary') {
      pulseConfig = MICRO_INTERACTIONS.buttons.primary.hover
      pulseConfig.duration = TIMING_CONFIG.sections.cta.buttonPulse
    }

    pulseTimeline.to(element, {
      ...pulseConfig,
      duration: pulseConfig.duration,
      ease: TIMING_CONFIG.microInteractions.loading.ease,
      force3D: true
    })

    timelinesRef.current.set(element, pulseTimeline)
  }, [])

  // Stop pulse animation
  const stopPulseAnimation = useCallback((element: HTMLElement) => {
    const state = statesRef.current.get(element)
    const timeline = timelinesRef.current.get(element)
    
    if (!state) return

    state.isPulsing = false
    
    if (timeline) {
      timeline.kill()
      timelinesRef.current.delete(element)
    }

    // Return to idle state
    const config = interactionsRef.current.get(element)
    if (config) {
      updateElementState(element, config, state)
    }
  }, [updateElementState])

  // Create ripple effect for clicks
  const createRippleEffect = useCallback((element: HTMLElement, event: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    // Create ripple element
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      z-index: 1000;
    `

    // Ensure element has relative positioning
    const originalPosition = element.style.position
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = 'relative'
    }

    element.appendChild(ripple)

    // Animate ripple
    gsap.timeline()
      .to(ripple, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(ripple, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple)
          }
        }
      }, 0.2)
  }, [])

  // Enhanced button interactions
  const enhanceButton = useCallback((button: HTMLElement, variant: 'primary' | 'secondary' = 'primary') => {
    registerElement({
      element: button,
      type: 'button',
      variant,
      enableHover: true,
      enableFocus: true,
      enableActive: true
    })

    // Add ripple effect on click
    button.addEventListener('click', (event) => {
      createRippleEffect(button, event)
    })

    // Add loading state capability
    const originalText = button.textContent
    ;(button as any).setLoading = (isLoading: boolean) => {
      if (isLoading) {
        button.textContent = 'Carregando...'
        button.style.pointerEvents = 'none'
        startPulseAnimation(button)
      } else {
        button.textContent = originalText
        button.style.pointerEvents = 'auto'
        stopPulseAnimation(button)
      }
    }
  }, [registerElement, createRippleEffect, startPulseAnimation, stopPulseAnimation])

  // Enhanced card interactions
  const enhanceCard = useCallback((card: HTMLElement, variant: 'feature' | 'testimonial' | 'pricing' = 'feature') => {
    registerElement({
      element: card,
      type: 'card',
      variant,
      enableHover: true,
      enableFocus: true
    })

    // Add magnetic effect for feature cards
    if (variant === 'feature') {
      let magneticTimeline: gsap.core.Timeline | null = null

      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (event.clientX - centerX) * 0.1
        const deltaY = (event.clientY - centerY) * 0.1

        if (magneticTimeline) magneticTimeline.kill()
        
        magneticTimeline = gsap.timeline()
        magneticTimeline.to(card, {
          x: deltaX,
          y: deltaY,
          rotationX: -deltaY * 0.1,
          rotationY: deltaX * 0.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        if (magneticTimeline) magneticTimeline.kill()
        
        magneticTimeline = gsap.timeline()
        magneticTimeline.to(card, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    }
  }, [registerElement])

  // Enhanced navigation interactions
  const enhanceNavigation = useCallback((nav: HTMLElement, variant: 'indicator' | 'dot' = 'indicator') => {
    registerElement({
      element: nav,
      type: 'navigation',
      variant,
      enableHover: true,
      enableActive: true
    })

    // Add progress indicator for navigation dots
    if (variant === 'dot') {
      const progressRing = document.createElement('div')
      progressRing.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid transparent;
        border-radius: 50%;
        pointer-events: none;
      `
      nav.appendChild(progressRing)

      // Method to update progress
      ;(nav as any).updateProgress = (progress: number) => {
        const circumference = 2 * Math.PI * 10 // Assuming 10px radius
        const strokeDasharray = circumference
        const strokeDashoffset = circumference * (1 - progress)
        
        progressRing.style.borderTopColor = 'rgba(59, 130, 246, 1)'
        progressRing.style.transform = `rotate(${progress * 360}deg)`
      }
    }
  }, [registerElement])

  // Enhanced text interactions
  const enhanceText = useCallback((text: HTMLElement, variant: 'title' | 'link' = 'title') => {
    registerElement({
      element: text,
      type: 'text',
      variant,
      enableHover: true,
      enableFocus: variant === 'link'
    })

    // Add typewriter effect for titles
    if (variant === 'title') {
      ;(text as any).typewriter = (newText: string, speed: number = 50) => {
        const originalText = text.textContent || ''
        text.textContent = ''
        
        let i = 0
        const typeInterval = setInterval(() => {
          if (i < newText.length) {
            text.textContent += newText.charAt(i)
            i++
          } else {
            clearInterval(typeInterval)
          }
        }, speed)
      }
    }
  }, [registerElement])

  // Cleanup function
  const cleanup = useCallback(() => {
    // Kill all timelines
    timelinesRef.current.forEach(timeline => timeline.kill())
    timelinesRef.current.clear()

    // Clear all references
    interactionsRef.current.clear()
    statesRef.current.clear()

    console.log('🧹 Micro-interactions cleaned up')
  }, [])

  // Auto-enhance elements based on selectors
  const autoEnhanceElements = useCallback(() => {
    // Enhance buttons
    document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
      if (button instanceof HTMLElement && !interactionsRef.current.has(button)) {
        const isPrimary = button.classList.contains('btn-primary') || 
                         button.classList.contains('bg-gradient-to-r') ||
                         button.style.background.includes('gradient')
        enhanceButton(button, isPrimary ? 'primary' : 'secondary')
      }
    })

    // Enhance cards
    document.querySelectorAll('.glass-card, .feature-card, .card').forEach(card => {
      if (card instanceof HTMLElement && !interactionsRef.current.has(card)) {
        let variant: 'feature' | 'testimonial' | 'pricing' = 'feature'
        
        if (card.closest('.section-testimonials')) variant = 'testimonial'
        else if (card.closest('.section-pricing')) variant = 'pricing'
        
        enhanceCard(card, variant)
      }
    })

    // Enhance navigation elements
    document.querySelectorAll('.nav-indicator, .nav-dot, [data-nav]').forEach(nav => {
      if (nav instanceof HTMLElement && !interactionsRef.current.has(nav)) {
        const variant = nav.classList.contains('nav-dot') ? 'dot' : 'indicator'
        enhanceNavigation(nav, variant)
      }
    })

    // Enhance text elements
    document.querySelectorAll('h1, h2, h3, .title, a[href]').forEach(text => {
      if (text instanceof HTMLElement && !interactionsRef.current.has(text)) {
        const variant = text.tagName.toLowerCase().startsWith('h') || text.classList.contains('title') ? 'title' : 'link'
        if (variant === 'link' || text.tagName.toLowerCase().startsWith('h')) {
          enhanceText(text, variant)
        }
      }
    })

    console.log('🎨 Auto-enhanced elements with micro-interactions')
  }, [enhanceButton, enhanceCard, enhanceNavigation, enhanceText])

  // Initialize micro-interactions system
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Auto-enhance elements after DOM is ready
    const timer = setTimeout(autoEnhanceElements, 500)

    // Re-enhance on dynamic content changes
    const observer = new MutationObserver(() => {
      autoEnhanceElements()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      cleanup()
    }
  }, [autoEnhanceElements, cleanup])

  return {
    // Registration methods
    registerElement,
    enhanceButton,
    enhanceCard,
    enhanceNavigation,
    enhanceText,
    
    // Animation controls
    startPulseAnimation,
    stopPulseAnimation,
    createRippleEffect,
    
    // Utilities
    autoEnhanceElements,
    cleanup
  }
}