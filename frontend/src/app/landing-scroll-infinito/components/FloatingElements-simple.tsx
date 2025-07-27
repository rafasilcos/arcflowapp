'use client'

import { useEffect, useState } from 'react'

interface FloatingElementsProps {
  currentSection?: string
  transitionProgress?: number
}

export function FloatingElements({ currentSection = 'hero', transitionProgress = 0 }: FloatingElementsProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1
    }))
    setParticles(newParticles)
  }, [currentSection])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white floating-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity * (1 - transitionProgress * 0.5),
            transform: `translateY(${transitionProgress * -20}px) scale(${1 + transitionProgress * 0.2})`,
            animation: `float ${3 + particle.id % 3}s ease-in-out infinite`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}