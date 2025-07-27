'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { useScrollController } from '../hooks/useScrollController'
import { useSectionManager } from '../hooks/useSectionManager'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Individual section component that integrates with scroll controller
 * Handles registration, animations, and state management
 */
export function Section({ id, children, className = '', style = {} }: SectionProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const { registerSection, sections, scrollState } = useScrollController()
  
  // Find this section's configuration
  const sectionConfig = sections.find(s => s.id === id)
  const sectionManager = useSectionManager(sectionConfig || {
    id,
    index: 0,
    startProgress: 0,
    endProgress: 1,
    element: null,
    isActive: false,
    isVisible: false
  })

  // Register element with scroll controller and section manager
  useEffect(() => {
    if (elementRef.current && sectionConfig) {
      registerSection(id, elementRef.current)
      sectionManager.registerElement(elementRef.current)
    }
  }, [id, registerSection, sectionManager, sectionConfig])

  // Update section visibility based on scroll state
  useEffect(() => {
    if (sectionConfig) {
      sectionManager.updateVisibility(
        sectionConfig.isActive,
        sectionConfig.isVisible,
        scrollState.transitionProgress
      )
    }
  }, [sectionConfig?.isActive, sectionConfig?.isVisible, scrollState.transitionProgress, sectionManager])

  return (
    <div
      ref={elementRef}
      id={`section-${id}`}
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{
        // Initial hidden state
        opacity: 0,
        visibility: 'hidden',
        // Performance optimizations
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        ...style
      }}
    >
      {children}
    </div>
  )
}