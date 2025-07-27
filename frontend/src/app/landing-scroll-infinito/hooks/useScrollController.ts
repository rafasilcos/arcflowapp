'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAPTransitions } from './useGSAPTransitions'

// Register GSAP plugins only on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Section configuration interface
export interface ScrollSection {
  id: string
  index: number
  startProgress: number
  endProgress: number
  element: HTMLElement | null
  isActive: boolean
  isVisible: boolean
}

// Global scroll state interface
export interface ScrollState {
  currentSection: number
  previousSection: number
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  isTransitioning: boolean
  transitionProgress: number
  isInitialized: boolean
}

// Performance monitoring interface
export interface PerformanceMetrics {
  fps: number
  lastFrameTime: number
  isLowPerformance: boolean
}

/**
 * Main scroll controller hook for infinite scroll system
 * Manages global scroll state, section transitions, and performance monitoring
 */
export function useScrollController() {
  // Initialize GSAP transitions system
  const gsapTransitions = useGSAPTransitions()

  // Core state management
  const [scrollState, setScrollState] = useState<ScrollState>({
    currentSection: 0,
    previousSection: -1,
    scrollProgress: 0,
    scrollDirection: 'down',
    isTransitioning: false,
    transitionProgress: 0,
    isInitialized: false
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    lastFrameTime: performance.now(),
    isLowPerformance: false
  })

  // Refs for managing sections and timeline
  const sectionsRef = useRef<ScrollSection[]>([])
  const mainTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)
  const performanceMonitorRef = useRef<number | null>(null)
  const isInitializedRef = useRef(false)
  const lastActiveSectionRef = useRef<string | null>(null)

  // Section configuration - 8 sections with equal distribution
  const initializeSections = useCallback(() => {
    const sectionCount = 8
    const sectionDuration = 1 / sectionCount

    const sections: ScrollSection[] = [
      { id: 'hero', index: 0, startProgress: 0, endProgress: sectionDuration, element: null, isActive: true, isVisible: true },
      { id: 'about', index: 1, startProgress: sectionDuration, endProgress: sectionDuration * 2, element: null, isActive: false, isVisible: false },
      { id: 'features', index: 2, startProgress: sectionDuration * 2, endProgress: sectionDuration * 3, element: null, isActive: false, isVisible: false },
      { id: 'results', index: 3, startProgress: sectionDuration * 3, endProgress: sectionDuration * 4, element: null, isActive: false, isVisible: false },
      { id: 'testimonials', index: 4, startProgress: sectionDuration * 4, endProgress: sectionDuration * 5, element: null, isActive: false, isVisible: false },
      { id: 'pricing', index: 5, startProgress: sectionDuration * 5, endProgress: sectionDuration * 6, element: null, isActive: false, isVisible: false },
      { id: 'faq', index: 6, startProgress: sectionDuration * 6, endProgress: sectionDuration * 7, element: null, isActive: false, isVisible: false },
      { id: 'cta', index: 7, startProgress: sectionDuration * 7, endProgress: 1, element: null, isActive: false, isVisible: false }
    ]
    
    sectionsRef.current = sections
    console.log('📋 Sections initialized:', sections.map(s => ({ id: s.id, start: s.startProgress, end: s.endProgress })))
    return sections
  }, [])

  // Register section element with the controller
  const registerSection = useCallback((id: string, element: HTMLElement) => {
    const section = sectionsRef.current.find(s => s.id === id)
    if (section && element) {
      section.element = element
      console.log(`✅ Section registered: ${id}`)
      
      // Register with GSAP transitions system
      gsapTransitions.registerSection(id, element)
      
      // Set initial visibility state
      if (section.index === 0) {
        gsap.set(element, { opacity: 1, visibility: 'visible' })
      } else {
        gsap.set(element, { opacity: 0, visibility: 'hidden' })
      }
    }
  }, [gsapTransitions])

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - performanceMetrics.lastFrameTime
    const fps = Math.round(1000 / deltaTime)
    
    setPerformanceMetrics(prev => ({
      fps,
      lastFrameTime: now,
      isLowPerformance: fps < 30
    }))

    performanceMonitorRef.current = requestAnimationFrame(monitorPerformance)
  }, [performanceMetrics.lastFrameTime])

  // Update scroll progress and manage section transitions
  const updateScrollProgress = useCallback((progress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    
    // Find current active section
    let currentSection = 0
    for (let i = sectionsRef.current.length - 1; i >= 0; i--) {
      if (clampedProgress >= sectionsRef.current[i].startProgress) {
        currentSection = i
        break
      }
    }

    // Calculate transition progress within current section
    const section = sectionsRef.current[currentSection]
    const sectionProgress = section ? 
      (clampedProgress - section.startProgress) / (section.endProgress - section.startProgress) : 0

    // Get current section ID
    const currentSectionId = sectionsRef.current[currentSection]?.id
    const previousSectionId = lastActiveSectionRef.current

    // Determine if we're actively scrolling
    const isScrolling = Math.abs(clampedProgress - (scrollState?.scrollProgress || 0)) > 0.001

    // Call global performance optimization method if available
    if (typeof window !== 'undefined' && (window as any).optimizeScrollPerformance) {
      (window as any).optimizeScrollPerformance(clampedProgress, isScrolling)
    }

    // Execute GSAP transition if section changed
    if (currentSectionId && currentSectionId !== previousSectionId) {
      console.log(`🎬 Executing transition: ${previousSectionId} → ${currentSectionId}`)
      
      // Execute transition with GSAP
      gsapTransitions.executeTransition(
        previousSectionId, 
        currentSectionId, 
        Math.max(0.3, sectionProgress) // Minimum progress for smooth transitions
      )
      
      lastActiveSectionRef.current = currentSectionId
    }

    // Update section progress for current section
    if (currentSectionId) {
      gsapTransitions.updateSectionProgress(currentSectionId, sectionProgress)
    }

    // Update scroll state
    setScrollState(prev => {
      const direction = clampedProgress > prev.scrollProgress ? 'down' : 'up'
      const isTransitioning = currentSection !== prev.currentSection || gsapTransitions.isTransitioning
      
      return {
        ...prev,
        currentSection,
        previousSection: isTransitioning ? prev.currentSection : prev.previousSection,
        scrollProgress: clampedProgress,
        scrollDirection: direction,
        isTransitioning,
        transitionProgress: Math.max(0, Math.min(1, sectionProgress))
      }
    })

    // Update section states
    sectionsRef.current.forEach((section, index) => {
      const wasActive = section.isActive
      section.isActive = index === currentSection
      
      // Determine visibility based on proximity to current section
      const isVisible = Math.abs(index - currentSection) <= 1
      section.isVisible = isVisible
      
      // Log section changes
      if (section.isActive && !wasActive) {
        console.log(`🎯 Active section: ${section.id} (${(clampedProgress * 100).toFixed(1)}%)`)
      }
    })

  }, [gsapTransitions])

  // Navigate to specific section programmatically
  const goToSection = useCallback((sectionIndex: number) => {
    if (!containerRef.current || sectionIndex < 0 || sectionIndex >= sectionsRef.current.length) return
    
    const section = sectionsRef.current[sectionIndex]
    if (!section) return

    // Calculate target scroll position
    const targetProgress = section.startProgress + (section.endProgress - section.startProgress) * 0.5
    const containerHeight = containerRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const totalScrollable = containerHeight - viewportHeight
    const targetScroll = targetProgress * totalScrollable

    console.log(`🎯 Navigating to section: ${section.id} (progress: ${(targetProgress * 100).toFixed(1)}%)`)

    // Smooth scroll to target
    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }, [])

  // Get current section info
  const getCurrentSection = useCallback(() => {
    return sectionsRef.current[scrollState.currentSection] || null
  }, [scrollState.currentSection])

  // Initialize scroll controller system
  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return

    console.log('🚀 Initializing Scroll Controller...')

    // Initialize sections
    initializeSections()

    // Setup scroll trigger after DOM is ready
    const setupScrollTrigger = () => {
      const container = document.getElementById('scroll-infinite-container')
      if (!container) {
        console.warn('⚠️ Scroll container not found, retrying...')
        setTimeout(setupScrollTrigger, 100)
        return
      }

      containerRef.current = container

      // Create main scroll timeline
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            updateScrollProgress(self.progress)
          },
          onRefresh: () => {
            console.log('🔄 ScrollTrigger refreshed')
          },
          onToggle: (self) => {
            console.log('🔄 ScrollTrigger toggled:', self.isActive)
          }
        }
      })

      mainTimelineRef.current = mainTimeline
      isInitializedRef.current = true

      // Update initialization state
      setScrollState(prev => ({ ...prev, isInitialized: true }))

      console.log('✅ Scroll Controller initialized successfully')
    }

    // Start performance monitoring
    monitorPerformance()

    // Delay setup to ensure DOM is ready
    const timer = setTimeout(setupScrollTrigger, 200)

    return () => {
      clearTimeout(timer)
      
      // Cleanup performance monitor
      if (performanceMonitorRef.current) {
        cancelAnimationFrame(performanceMonitorRef.current)
      }
      
      // Cleanup GSAP instances
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill()
        mainTimelineRef.current = null
      }
      
      // Cleanup all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      
      isInitializedRef.current = false
      console.log('🧹 Scroll Controller cleaned up')
    }
  }, [initializeSections, updateScrollProgress, monitorPerformance])

  return {
    // State
    scrollState,
    performanceMetrics,
    sections: sectionsRef.current,
    
    // Methods
    registerSection,
    goToSection,
    getCurrentSection,
    updateScrollProgress,
    
    // Utilities
    isInitialized: scrollState.isInitialized,
    container: containerRef.current
  }
}