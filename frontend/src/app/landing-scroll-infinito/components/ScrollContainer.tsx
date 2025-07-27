'use client'

import { ReactNode, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollContainerProps {
  children: ReactNode
  totalHeight?: string
  className?: string
  onScrollProgress?: (progress: number) => void
}

/**
 * Main scroll container component for infinite scroll system
 * Provides 800vh height for smooth infinite scrolling experience
 */
export function ScrollContainer({ 
  children, 
  totalHeight = '800vh', 
  className = '',
  onScrollProgress 
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<number>(0)

  // Update scroll progress with throttling
  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const containerHeight = containerRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    
    // Calculate scroll progress (0 to 1)
    const scrolled = Math.abs(rect.top)
    const totalScrollable = Math.max(containerHeight - viewportHeight, 1)
    const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1)
    
    // Only update if progress changed significantly
    if (Math.abs(progress - progressRef.current) > 0.001) {
      progressRef.current = progress
      
      // Update CSS custom property for other components
      document.documentElement.style.setProperty('--scroll-progress', progress.toString())
      
      // Call callback if provided
      onScrollProgress?.(progress)
    }
  }, [onScrollProgress])

  // Setup scroll tracking
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Use passive listener for better performance
    const handleScroll = () => {
      requestAnimationFrame(updateScrollProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })
    
    // Initial progress calculation
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollProgress)
    }
  }, [updateScrollProgress])

  // Setup container for scroll trigger
  useEffect(() => {
    if (!containerRef.current) return

    // Ensure container has proper ID for scroll controller
    containerRef.current.id = 'scroll-infinite-container'
    
    console.log('📦 Scroll Container initialized with height:', totalHeight)
  }, [totalHeight])

  return (
    <div 
      ref={containerRef}
      id="scroll-infinite-container"
      className={`relative w-full ${className}`}
      style={{ 
        height: totalHeight,
        // Ensure proper stacking context
        zIndex: 1
      }}
    >
      {/* Sticky viewport that contains all sections */}
      <div 
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{
          // Ensure smooth rendering
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {/* Content wrapper with proper centering */}
        <div className="relative w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="fixed bottom-4 left-4 z-50 bg-black/70 text-white p-2 rounded text-xs font-mono"
          style={{ pointerEvents: 'none' }}
        >
          <div>Container Height: {totalHeight}</div>
          <div>Progress: {(progressRef.current * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  )
}