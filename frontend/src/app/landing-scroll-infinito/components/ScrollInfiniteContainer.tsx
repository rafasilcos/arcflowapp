'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useScrollController } from '../hooks/useScrollController'

interface ScrollInfiniteContainerProps {
  children: ReactNode
}

export function ScrollInfiniteContainer({ children }: ScrollInfiniteContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const { scrollState } = useScrollController()

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    // Set initial styles for smooth scrolling
    const container = containerRef.current
    const sticky = stickyRef.current

    // Ensure proper setup
    container.style.position = 'relative'
    container.style.width = '100%'
    container.style.height = '800vh' // 8x viewport height for smooth scroll
    
    sticky.style.position = 'sticky'
    sticky.style.top = '0'
    sticky.style.width = '100%'
    sticky.style.height = '100vh'
    sticky.style.overflow = 'hidden'
    sticky.style.display = 'flex'
    sticky.style.alignItems = 'center'
    sticky.style.justifyContent = 'center'

    console.log('📦 Scroll Infinite Container initialized')
  }, [])

  return (
    <div 
      ref={containerRef}
      id="scroll-infinite-container"
      className="relative w-full"
      style={{ height: '800vh' }}
    >
      <div 
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
        style={{ 
          background: 'transparent',
          zIndex: 1
        }}
      >
        {/* Debug info - remove in production */}
        <div className="fixed top-4 right-4 z-50 bg-black/50 text-white p-2 rounded text-xs font-mono">
          <div>Section: {scrollState.currentSection}</div>
          <div>Progress: {(scrollState.scrollProgress * 100).toFixed(1)}%</div>
          <div>Direction: {scrollState.scrollDirection}</div>
          <div>Transitioning: {scrollState.isTransitioning ? 'Yes' : 'No'}</div>
        </div>

        {/* All sections will be positioned absolutely within this container */}
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    </div>
  )
}