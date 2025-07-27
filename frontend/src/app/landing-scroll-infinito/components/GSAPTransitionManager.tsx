'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GSAPTransitionManagerProps {
  children: React.ReactNode
  containerId: string
}

/**
 * GSAP Transition Manager Component
 * Manages ScrollTrigger setup and cleanup for the infinite scroll system
 */
export function GSAPTransitionManager({ children, containerId }: GSAPTransitionManagerProps) {
  const contextRef = useRef<gsap.Context | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || isInitializedRef.current) return

    console.log('🎬 Initializing GSAP Transition Manager...')

    // Create GSAP context for better cleanup
    contextRef.current = gsap.context(() => {
      // Set GSAP defaults for optimal performance
      gsap.defaults({
        ease: 'power2.out',
        duration: 1,
        force3D: true // Force GPU acceleration
      })

      // Configure ScrollTrigger for better performance
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        ignoreMobileResize: true,
        limitCallbacks: true // Limit callback frequency for better performance
      })

      // Setup main scroll trigger after container is ready
      const setupMainScrollTrigger = () => {
        const container = document.getElementById(containerId)
        if (!container) {
          setTimeout(setupMainScrollTrigger, 100)
          return
        }

        // Create master timeline with scrub for smooth scrolling
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // Smooth scrubbing
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Dispatch custom event with scroll progress
              window.dispatchEvent(new CustomEvent('gsap-scroll-update', {
                detail: { 
                  progress: self.progress,
                  direction: self.direction,
                  velocity: self.getVelocity()
                }
              }))
            },
            onRefresh: () => {
              console.log('🔄 GSAP ScrollTrigger refreshed')
            }
          }
        })

        // Add performance monitoring
        let frameCount = 0
        let lastTime = performance.now()
        
        const monitorPerformance = () => {
          frameCount++
          const currentTime = performance.now()
          
          if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
            
            // Adjust scrub value based on performance
            if (fps < 30) {
              ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.scrub) {
                  trigger.vars.scrub = 2 // Slower scrub for better performance
                }
              })
              console.warn('⚠️ Low FPS detected, adjusting scrub performance')
            } else if (fps > 50) {
              ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.scrub) {
                  trigger.vars.scrub = 1 // Normal scrub speed
                }
              })
            }
            
            frameCount = 0
            lastTime = currentTime
          }
          
          requestAnimationFrame(monitorPerformance)
        }
        
        monitorPerformance()

        console.log('✅ GSAP Master ScrollTrigger initialized')
      }

      // Delay setup to ensure DOM is ready
      setTimeout(setupMainScrollTrigger, 200)

      isInitializedRef.current = true
    })

    return () => {
      console.log('🧹 Cleaning up GSAP Transition Manager...')
      
      // Cleanup GSAP context
      if (contextRef.current) {
        contextRef.current.revert()
        contextRef.current = null
      }
      
      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      
      isInitializedRef.current = false
    }
  }, [containerId])

  // Enhanced reduced motion and fallback handling
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleReducedMotion = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Apply reduced motion settings
        gsap.globalTimeline.timeScale(0.1)
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.animation) {
            trigger.animation.timeScale(0.1)
          }
        })
        
        // Apply CSS fallback class
        document.documentElement.classList.add('motion-reduced')
        console.log('♿ Reduced motion activated')
      } else {
        // Restore normal animation speed
        gsap.globalTimeline.timeScale(1)
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.animation) {
            trigger.animation.timeScale(1)
          }
        })
        
        // Remove reduced motion class
        document.documentElement.classList.remove('motion-reduced')
        console.log('🎬 Normal motion restored')
      }
    }

    // GSAP error handling with fallback
    const handleGSAPError = (error: Error) => {
      console.error('🚨 GSAP Error detected:', error)
      
      // Switch to CSS fallback mode
      document.documentElement.classList.add('gsap-fallback')
      
      // Disable GSAP animations
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      
      // Dispatch fallback event
      window.dispatchEvent(new CustomEvent('gsap-fallback-activated', {
        detail: { error, timestamp: Date.now() }
      }))
      
      console.warn('⚠️ Switched to CSS fallback due to GSAP error')
    }

    // Test GSAP availability
    try {
      if (!gsap || typeof gsap.to !== 'function') {
        throw new Error('GSAP not available')
      }
      
      // Test basic GSAP functionality
      const testElement = document.createElement('div')
      gsap.set(testElement, { opacity: 0 })
      
      console.log('✅ GSAP availability confirmed')
    } catch (error) {
      handleGSAPError(error as Error)
    }

    // Check initial reduced motion state
    if (mediaQuery.matches) {
      handleReducedMotion({ matches: true } as MediaQueryListEvent)
    }

    // Listen for changes
    mediaQuery.addEventListener('change', handleReducedMotion)

    // Global error handler for GSAP
    const originalGSAPError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.toLowerCase().includes('gsap') || 
          message.toLowerCase().includes('scrolltrigger')) {
        handleGSAPError(new Error(message))
      }
      originalGSAPError.apply(console, args)
    }

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion)
      console.error = originalGSAPError
    }
  }, [])

  return <>{children}</>
}