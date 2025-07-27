'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Users, Award, Zap, TrendingUp, Building, Target, Briefcase, Star, Globe, Rocket, Shield, Heart } from 'lucide-react'
import { useBackgroundSync } from '../hooks/useBackgroundSync'

interface FloatingParticle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  icon: React.ElementType
  size: number
  category: 'business' | 'tech' | 'success'
}

interface FloatingElementsProps {
  currentSection?: string
  transitionProgress?: number
}

export function FloatingElements({ 
  currentSection = 'hero', 
  transitionProgress = 0 
}: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const atmosphereRef = useRef<HTMLDivElement[]>([])
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const backgroundSync = useBackgroundSync()

  // Icon sets for different section themes
  const iconSets = {
    business: [Users, Briefcase, Building, Target, TrendingUp, Globe],
    tech: [Zap, Rocket, Shield, Star, Award, Heart],
    success: [Award, Star, TrendingUp, Target, Users, Building]
  }

  useEffect(() => {
    setIsClient(true)
    
    // Generate particles with categories for different themes
    const generatedParticles: FloatingParticle[] = Array.from({ length: 15 }, (_, i) => {
      const categories: ('business' | 'tech' | 'success')[] = ['business', 'tech', 'success']
      const category = categories[i % 3]
      const iconSet = iconSets[category]
      
      return {
        id: i,
        x: (i * 6.67) % 100, // More distributed
        y: (i * 6.25) % 100,
        delay: i * 0.2,
        duration: 3 + (i % 4) * 1.5,
        icon: iconSet[i % iconSet.length],
        size: 14 + (i % 4) * 6,
        category
      }
    })
    
    setParticles(generatedParticles)
  }, [])

  // Sync particles with current section
  useEffect(() => {
    if (!isClient || !currentSection) return
    
    backgroundSync.syncWithSection(currentSection, transitionProgress)
  }, [isClient, currentSection, transitionProgress, backgroundSync])

  // Update particle animations based on current theme
  useEffect(() => {
    if (!isClient || particles.length === 0) return

    const particleConfig = backgroundSync.getCurrentParticleConfig()
    
    // Update each particle with new theme
    particlesRef.current.forEach((particle, index) => {
      if (!particle || !particles[index]) return

      const particleData = particles[index]
      
      // Set initial position and size
      gsap.set(particle, {
        left: `${particleData.x}%`,
        top: `${particleData.y}%`,
        width: particleData.size,
        height: particleData.size,
        color: particleConfig.color,
        opacity: particleConfig.intensity
      })

      // Kill existing animations
      gsap.killTweensOf(particle)
      
      // Apply movement pattern based on current theme
      applyParticleMovement(particle, particleConfig.pattern, particleConfig.movement, particleData)
    })

    return () => {
      gsap.killTweensOf(particlesRef.current)
    }
  }, [isClient, particles, backgroundSync.currentTheme])

  // Apply specific movement patterns to particles
  const applyParticleMovement = (
    element: HTMLElement,
    pattern: 'float' | 'orbit' | 'pulse' | 'drift',
    speed: 'slow' | 'medium' | 'fast',
    particleData: FloatingParticle
  ) => {
    const speedMultiplier = {
      slow: 0.7,
      medium: 1,
      fast: 1.4
    }[speed]
    
    const baseDelay = particleData.delay
    const baseDuration = particleData.duration * speedMultiplier

    switch (pattern) {
      case 'float':
        gsap.to(element, {
          y: `+=${15 + (particleData.id % 3) * 10}`,
          duration: baseDuration,
          delay: baseDelay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        gsap.to(element, {
          x: `+=${5 + (particleData.id % 2) * 8}`,
          duration: baseDuration * 1.3,
          delay: baseDelay * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        break
        
      case 'orbit':
        gsap.to(element, {
          rotation: 360,
          duration: baseDuration * 2,
          delay: baseDelay,
          repeat: -1,
          ease: 'none'
        })
        gsap.to(element, {
          x: `+=${20 + (particleData.id % 3) * 10}`,
          y: `+=${15 + (particleData.id % 2) * 12}`,
          duration: baseDuration,
          delay: baseDelay,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })
        break
        
      case 'pulse':
        gsap.to(element, {
          scale: 1.3 + (particleData.id % 3) * 0.2,
          opacity: backgroundSync.getCurrentParticleConfig().intensity * 1.5,
          duration: baseDuration * 0.8,
          delay: baseDelay,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        })
        gsap.to(element, {
          rotation: (particleData.id % 2) * 180,
          duration: baseDuration * 1.5,
          delay: baseDelay * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
        break
        
      case 'drift':
        gsap.to(element, {
          x: `+=${25 + (particleData.id % 4) * 15}`,
          y: `+=${20 + (particleData.id % 3) * 10}`,
          rotation: (particleData.id % 2) * 30 - 15,
          duration: baseDuration * 1.2,
          delay: baseDelay,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })
        break
    }
  }

  // Don't render particles on server side
  if (!isClient) {
    return (
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      >
        {/* Only gradient orbs on server side */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" data-atmosphere></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000" data-atmosphere></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-xl animate-pulse delay-2000" data-atmosphere></div>
      </div>
    )
  }

  const particleConfig = backgroundSync.getCurrentParticleConfig()
  const atmosphereConfig = backgroundSync.getCurrentAtmosphereConfig()

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Synchronized particles */}
      {particles.map((particle, index) => {
        const Icon = particle.icon
        return (
          <div
            key={particle.id}
            ref={el => {
              if (el) particlesRef.current[index] = el
            }}
            className="absolute transition-colors duration-1000"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              color: particleConfig.color,
              opacity: particleConfig.intensity
            }}
            data-particle
            data-particle-category={particle.category}
          >
            <Icon size={particle.size} />
          </div>
        )
      })}

      {/* Synchronized atmospheric orbs */}
      <div 
        ref={el => {
          if (el) atmosphereRef.current[0] = el
        }}
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${particleConfig.color}20 0%, transparent 70%)`,
          filter: `blur(${atmosphereConfig.blur * 0.8}px)`,
          opacity: atmosphereConfig.opacity,
          transform: `scale(${atmosphereConfig.scale})`
        }}
        data-atmosphere
      />
      
      <div 
        ref={el => {
          if (el) atmosphereRef.current[1] = el
        }}
        className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${particleConfig.color}25 0%, transparent 70%)`,
          filter: `blur(${atmosphereConfig.blur * 0.6}px)`,
          opacity: atmosphereConfig.opacity * 1.2,
          transform: `scale(${atmosphereConfig.scale * 0.8})`
        }}
        data-atmosphere
      />
      
      <div 
        ref={el => {
          if (el) atmosphereRef.current[2] = el
        }}
        className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${particleConfig.color}30 0%, transparent 70%)`,
          filter: `blur(${atmosphereConfig.blur * 0.5}px)`,
          opacity: atmosphereConfig.opacity * 0.8,
          transform: `scale(${atmosphereConfig.scale * 1.1})`
        }}
        data-atmosphere
      />

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 bg-black/70 text-white p-2 rounded text-xs font-mono">
          <div>🎭 Particles: {particleConfig.pattern} | {particleConfig.movement}</div>
          <div>🎨 Color: {particleConfig.color}</div>
          <div>💫 Intensity: {(particleConfig.intensity * 100).toFixed(0)}%</div>
        </div>
      )}
    </div>
  )
}