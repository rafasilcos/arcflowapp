'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface ScrollSection {
  id: string
  index: number
  startProgress: number
  endProgress: number
  element: HTMLElement | null
  isActive: boolean
  isVisible: boolean
}

export interface ScrollState {
  currentSection: number
  previousSection: number
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  isTransitioning: boolean
  transitionProgress: number
  isInitialized: boolean
}

export interface PerformanceMetrics {
  fps: number
  lastFrameTime: number
  isLowPerformance: boolean
}

export function useScrollController() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    currentSection: 0,
    previousSection: -1,
    scrollProgress: 0,
    scrollDirection: 'down',
    isTransitioning: false,
    transitionProgress: 0,
    isInitialized: true
  })

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    lastFrameTime: performance.now(),
    isLowPerformance: false
  })

  const sectionsRef = useRef<ScrollSection[]>([
    { id: 'hero', index: 0, startProgress: 0, endProgress: 0.125, element: null, isActive: true, isVisible: true },
    { id: 'about', index: 1, startProgress: 0.125, endProgress: 0.25, element: null, isActive: false, isVisible: false },
    { id: 'features', index: 2, startProgress: 0.25, endProgress: 0.375, element: null, isActive: false, isVisible: false },
    { id: 'results', index: 3, startProgress: 0.375, endProgress: 0.5, element: null, isActive: false, isVisible: false },
    { id: 'testimonials', index: 4, startProgress: 0.5, endProgress: 0.625, element: null, isActive: false, isVisible: false },
    { id: 'pricing', index: 5, startProgress: 0.625, endProgress: 0.75, element: null, isActive: false, isVisible: false },
    { id: 'faq', index: 6, startProgress: 0.75, endProgress: 0.875, element: null, isActive: false, isVisible: false },
    { id: 'cta', index: 7, startProgress: 0.875, endProgress: 1, element: null, isActive: false, isVisible: false }
  ])

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    const section = sectionsRef.current.find(s => s.id === id)
    if (section && element) {
      section.element = element
      console.log(`✅ Section registered: ${id}`)
    }
  }, [])

  const goToSection = useCallback((sectionIndex: number) => {
    const section = sectionsRef.current[sectionIndex]
    if (!section) return

    const targetProgress = section.startProgress + (section.endProgress - section.startProgress) * 0.5
    const targetScroll = targetProgress * (document.body.scrollHeight - window.innerHeight)

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })

    console.log(`🎯 Navigating to section: ${section.id}`)
  }, [])

  const getCurrentSection = useCallback(() => {
    return sectionsRef.current[scrollState.currentSection] || null
  }, [scrollState.currentSection])

  const updateScrollProgress = useCallback((progress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    
    let currentSection = 0
    for (let i = sectionsRef.current.length - 1; i >= 0; i--) {
      if (clampedProgress >= sectionsRef.current[i].startProgress) {
        currentSection = i
        break
      }
    }

    const section = sectionsRef.current[currentSection]
    const sectionProgress = section ? 
      (clampedProgress - section.startProgress) / (section.endProgress - section.startProgress) : 0

    setScrollState(prev => ({
      ...prev,
      currentSection,
      previousSection: prev.currentSection,
      scrollProgress: clampedProgress,
      scrollDirection: clampedProgress > prev.scrollProgress ? 'down' : 'up',
      isTransitioning: currentSection !== prev.currentSection,
      transitionProgress: Math.max(0, Math.min(1, sectionProgress))
    }))

    sectionsRef.current.forEach((section, index) => {
      section.isActive = index === currentSection
      section.isVisible = Math.abs(index - currentSection) <= 1
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
      updateScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScrollProgress])

  return {
    scrollState,
    performanceMetrics,
    sections: sectionsRef.current,
    registerSection,
    goToSection,
    getCurrentSection,
    updateScrollProgress,
    isInitialized: scrollState.isInitialized,
    container: null
  }
}