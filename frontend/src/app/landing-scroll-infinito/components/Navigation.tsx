'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { gsap } from 'gsap'

// Navigation section configuration - matches the 8 sections from useScrollController
const navigationSections = [
  { id: 'hero', label: 'Início', icon: '🏠' },
  { id: 'about', label: 'Sobre', icon: '📖' },
  { id: 'features', label: 'Funcionalidades', icon: '⚡' },
  { id: 'results', label: 'Resultados', icon: '📊' },
  { id: 'testimonials', label: 'Depoimentos', icon: '💬' },
  { id: 'pricing', label: 'Preços', icon: '💰' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'cta', label: 'Começar', icon: '🚀' }
]

interface NavigationProps {
  currentSection?: number
  scrollProgress?: number
  onSectionClick?: (sectionIndex: number) => void
}

export function Navigation({ 
  currentSection = 0,
  scrollProgress = 0,
  onSectionClick
}: NavigationProps = {}) {
  const [localActiveSection, setLocalActiveSection] = useState(0)
  const [localScrollProgress, setLocalScrollProgress] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const navigationTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const dotsContainerRef = useRef<HTMLDivElement>(null)

  // Use props if provided, otherwise use local state for standalone mode
  const activeSection = currentSection ?? localActiveSection
  const currentProgress = scrollProgress ?? localScrollProgress

  // Standalone scroll tracking (when not receiving props from parent)
  useEffect(() => {
    if (currentSection !== undefined && scrollProgress !== undefined) return

    const updateProgress = () => {
      const container = document.getElementById('scroll-infinite-container')
      if (!container) return

      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewportHeight = window.innerHeight
      
      const scrolled = Math.abs(rect.top)
      const totalScrollable = containerHeight - viewportHeight
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1)
      
      setLocalScrollProgress(progress)

      // Calculate active section based on 8 sections
      const sectionIndex = Math.floor(progress * navigationSections.length)
      const clampedIndex = Math.min(sectionIndex, navigationSections.length - 1)
      
      setLocalActiveSection(clampedIndex)
    }

    const handleScroll = () => {
      if (!isNavigating) {
        updateProgress()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [currentSection, scrollProgress, isNavigating])

  // Smooth navigation to section
  const navigateToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex < 0 || sectionIndex >= navigationSections.length) return

    setIsNavigating(true)
    
    // Call parent callback if provided
    if (onSectionClick) {
      onSectionClick(sectionIndex)
      // Reset navigation state after a delay
      setTimeout(() => setIsNavigating(false), 1500)
      return
    }

    // Fallback navigation for standalone mode
    const container = document.getElementById('scroll-infinite-container')
    if (!container) {
      setIsNavigating(false)
      return
    }

    // Calculate target scroll position
    const targetProgress = (sectionIndex / navigationSections.length) + (0.5 / navigationSections.length)
    const containerHeight = container.offsetHeight
    const viewportHeight = window.innerHeight
    const totalScrollable = containerHeight - viewportHeight
    const targetScroll = targetProgress * totalScrollable

    console.log(`🎯 Navigating to section: ${navigationSections[sectionIndex].id} (${(targetProgress * 100).toFixed(1)}%)`)

    // Animate scroll with GSAP for smooth transition
    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        setIsNavigating(false)
      }
    })
  }, [onSectionClick])

  // Animate progress bar updates
  useEffect(() => {
    if (!progressBarRef.current) return

    gsap.to(progressBarRef.current, {
      width: `${currentProgress * 100}%`,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [currentProgress])

  // Animate active dot indicator
  useEffect(() => {
    if (!dotsContainerRef.current) return

    const dots = dotsContainerRef.current.querySelectorAll('.nav-dot')
    
    dots.forEach((dot, index) => {
      const isActive = index === activeSection
      
      gsap.to(dot, {
        scale: isActive ? 1.5 : 1,
        opacity: isActive ? 1 : 0.6,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  }, [activeSection])

  return (
    <>
      {/* Fixed Top Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-card px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-bold text-white text-sm">ArcFlow</span>
            </div>

            {/* Navigation dots */}
            <div ref={dotsContainerRef} className="flex items-center space-x-3">
              {navigationSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(index)}
                  className={`nav-dot group relative w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === index 
                      ? 'bg-blue-400' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  title={section.label}
                  disabled={isNavigating}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {section.icon} {section.label}
                  </span>
                  
                  {/* Active indicator ring */}
                  {activeSection === index && (
                    <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <a 
              href="/onboarding/perfil"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-medium rounded-full hover:scale-105 transition-transform inline-block"
            >
              Começar
            </a>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
        <div 
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: '0%' }}
        />
      </div>

      {/* Side Navigation (Desktop) */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="glass-card p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
          <div className="flex flex-col space-y-4">
            {navigationSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => navigateToSection(index)}
                className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-blue-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                title={section.label}
                disabled={isNavigating}
              >
                {/* Side tooltip */}
                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm text-white bg-black/70 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {section.icon} {section.label}
                </span>
                
                {/* Progress indicator */}
                {activeSection === index && (
                  <div className="absolute -inset-1 rounded-full border border-blue-300/50 animate-pulse" />
                )}
              </button>
            ))}
          </div>
          
          {/* Section progress indicator */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-white/70 text-center mb-2">
              {navigationSections[activeSection]?.label}
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                style={{ width: `${((activeSection + 1) / navigationSections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Bottom) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
        <div className="glass-card px-4 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20">
          <div className="flex items-center space-x-4">
            {navigationSections.slice(0, 4).map((section, index) => (
              <button
                key={section.id}
                onClick={() => navigateToSection(index)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-blue-500/20 text-blue-300' 
                    : 'text-white/60 hover:text-white/80'
                }`}
                disabled={isNavigating}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-xs font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation State Debug (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/70 text-white p-2 rounded text-xs font-mono">
          <div>Section: {activeSection} ({navigationSections[activeSection]?.id})</div>
          <div>Progress: {(currentProgress * 100).toFixed(1)}%</div>
          <div>Navigating: {isNavigating ? '🔄' : '✅'}</div>
        </div>
      )}
    </>
  )
}