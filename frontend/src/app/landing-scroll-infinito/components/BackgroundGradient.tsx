'use client'

import { useEffect, useState } from 'react'
import { useBackgroundSync } from '../hooks/useBackgroundSync'

interface BackgroundGradientProps {
  currentSection?: string
  transitionProgress?: number
}

export function BackgroundGradient({ 
  currentSection = 'hero', 
  transitionProgress = 0 
}: BackgroundGradientProps) {
  const [isClient, setIsClient] = useState(false)
  const backgroundSync = useBackgroundSync()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sync background when section changes
  useEffect(() => {
    if (isClient && currentSection) {
      backgroundSync.syncWithSection(currentSection, transitionProgress)
    }
  }, [isClient, currentSection, transitionProgress, backgroundSync])

  // Get current background CSS
  const backgroundCSS = isClient ? backgroundSync.getCurrentBackgroundCSS() : 
    'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)'

  if (!isClient) {
    return (
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-out"
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' }}
        data-background-gradient
      />
    )
  }

  return (
    <>
      {/* Main gradient background */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-out"
        style={{ background: backgroundCSS }}
        data-background-gradient
      />
      
      {/* Atmospheric overlay for depth */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${backgroundSync.currentTheme.particles.color}15 0%, transparent 70%)`,
          filter: `blur(${backgroundSync.getCurrentAtmosphereConfig().blur}px)`,
          opacity: backgroundSync.getCurrentAtmosphereConfig().opacity,
          transform: `scale(${backgroundSync.getCurrentAtmosphereConfig().scale})`
        }}
        data-atmosphere
      />
      
      {/* Transition indicator for debugging */}
      {process.env.NODE_ENV === 'development' && backgroundSync.isTransitioning && (
        <div className="fixed top-20 right-4 z-50 bg-black/70 text-white p-2 rounded text-xs font-mono">
          🎨 Background Transition: {(transitionProgress * 100).toFixed(1)}%
        </div>
      )}
    </>
  )
}