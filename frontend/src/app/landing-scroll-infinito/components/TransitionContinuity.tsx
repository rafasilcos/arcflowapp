'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useBackgroundSync } from '../hooks/useBackgroundSync'

interface TransitionContinuityProps {
  currentSection: string
  previousSection?: string
  transitionProgress: number
  isTransitioning: boolean
}

/**
 * Component responsible for creating visual continuity during section transitions
 * Adds smooth overlay effects, particle bridges, and gradient morphing
 */
export function TransitionContinuity({
  currentSection,
  previousSection,
  transitionProgress,
  isTransitioning
}: TransitionContinuityProps) {
  const [isClient, setIsClient] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const particleBridgeRef = useRef<HTMLDivElement>(null)
  const morphingGradientRef = useRef<HTMLDivElement>(null)
  const backgroundSync = useBackgroundSync()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Create transition overlay effect
  useEffect(() => {
    if (!isClient || !isTransitioning || !overlayRef.current) return

    const overlay = overlayRef.current
    const currentTheme = backgroundSync.getThemeForSection(currentSection)
    const previousTheme = previousSection ? backgroundSync.getThemeForSection(previousSection) : null

    if (!previousTheme) return

    // Create smooth transition overlay
    gsap.set(overlay, {
      opacity: 0,
      background: `linear-gradient(45deg, ${previousTheme.gradient.primary}40, ${currentTheme.gradient.primary}40)`
    })

    // Animate overlay during transition
    gsap.to(overlay, {
      opacity: Math.sin(transitionProgress * Math.PI) * 0.3, // Peak opacity at 50% transition
      duration: 0.3,
      ease: 'sine.inOut'
    })

  }, [isClient, isTransitioning, currentSection, previousSection, transitionProgress, backgroundSync])

  // Create particle bridge effect
  useEffect(() => {
    if (!isClient || !isTransitioning || !particleBridgeRef.current) return

    const bridge = particleBridgeRef.current
    const currentTheme = backgroundSync.getThemeForSection(currentSection)

    // Clear existing particles
    bridge.innerHTML = ''

    // Create bridge particles during transition
    const particleCount = Math.floor(transitionProgress * 8) + 2
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute w-1 h-1 rounded-full transition-all duration-500'
      particle.style.background = currentTheme.particles.color
      particle.style.left = `${20 + (i * 60 / particleCount)}%`
      particle.style.top = `${30 + Math.sin(i * 0.5) * 40}%`
      particle.style.opacity = (transitionProgress * 0.6).toString()
      
      bridge.appendChild(particle)

      // Animate particle
      gsap.fromTo(particle, 
        { scale: 0, rotation: 0 },
        { 
          scale: 1 + Math.random() * 0.5, 
          rotation: 360,
          duration: 1 + Math.random() * 0.5,
          ease: 'power2.out',
          delay: i * 0.1
        }
      )
    }

    // Cleanup particles when transition ends
    if (transitionProgress >= 0.9) {
      setTimeout(() => {
        gsap.to(bridge.children, {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          stagger: 0.05,
          onComplete: () => {
            bridge.innerHTML = ''
          }
        })
      }, 200)
    }

  }, [isClient, isTransitioning, transitionProgress, currentSection, backgroundSync])

  // Create morphing gradient effect
  useEffect(() => {
    if (!isClient || !morphingGradientRef.current) return

    const morphGradient = morphingGradientRef.current
    const currentTheme = backgroundSync.getThemeForSection(currentSection)
    const previousTheme = previousSection ? backgroundSync.getThemeForSection(previousSection) : null

    if (isTransitioning && previousTheme) {
      // Show morphing gradient during transition
      const morphProgress = transitionProgress
      
      // Create complex gradient that morphs between themes
      const gradient = `
        radial-gradient(
          ellipse at ${50 + Math.sin(morphProgress * Math.PI) * 20}% ${50 + Math.cos(morphProgress * Math.PI) * 15}%,
          ${previousTheme.gradient.primary}${Math.floor((1 - morphProgress) * 40).toString(16).padStart(2, '0')} 0%,
          ${currentTheme.gradient.primary}${Math.floor(morphProgress * 40).toString(16).padStart(2, '0')} 40%,
          transparent 70%
        ),
        linear-gradient(
          ${morphProgress * 180}deg,
          ${previousTheme.gradient.secondary}${Math.floor((1 - morphProgress) * 30).toString(16).padStart(2, '0')} 0%,
          ${currentTheme.gradient.secondary}${Math.floor(morphProgress * 30).toString(16).padStart(2, '0')} 100%
        )
      `
      
      gsap.set(morphGradient, {
        background: gradient,
        opacity: Math.sin(morphProgress * Math.PI) * 0.4
      })
    } else {
      // Hide morphing gradient when not transitioning
      gsap.set(morphGradient, { opacity: 0 })
    }

  }, [isClient, isTransitioning, transitionProgress, currentSection, previousSection, backgroundSync])

  // Don't render on server side
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 transition-opacity duration-300"
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Particle bridge */}
      <div
        ref={particleBridgeRef}
        className="absolute inset-0"
      />

      {/* Morphing gradient */}
      <div
        ref={morphingGradientRef}
        className="absolute inset-0 transition-opacity duration-500"
        style={{ mixBlendMode: 'soft-light' }}
      />

      {/* Transition progress indicator (development only) */}
      {process.env.NODE_ENV === 'development' && isTransitioning && (
        <div className="fixed top-32 right-4 z-50 bg-black/70 text-white p-2 rounded text-xs font-mono">
          <div>🌊 Continuidade Visual</div>
          <div>{previousSection} → {currentSection}</div>
          <div>Progresso: {(transitionProgress * 100).toFixed(1)}%</div>
          <div className="w-20 h-1 bg-white/20 rounded mt-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded transition-all duration-200"
              style={{ width: `${transitionProgress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}