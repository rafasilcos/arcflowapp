'use client'

import { ReactNode } from 'react'

// Simple component implementations for scroll infinito

export function AnimationErrorHandler({ children, enableLogging, enableRecovery, maxRetries, onError, onFallback }: {
  children: ReactNode
  enableLogging?: boolean
  enableRecovery?: boolean
  maxRetries?: number
  onError?: (error: Error, context: string) => void
  onFallback?: (mode: string) => void
}) {
  return <>{children}</>
}

export function AnimationErrorDisplay() {
  return null
}

export function GSAPTransitionManager({ children, containerId }: { children: ReactNode; containerId: string }) {
  return <div id={containerId}>{children}</div>
}

export function ControlsHelp({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="fixed bottom-4 left-4 z-40 bg-black/70 text-white p-3 rounded-lg text-xs">
      <div className="font-semibold mb-2">🎮 Controles:</div>
      {isMobile ? (
        <div>👆 Deslize para navegar</div>
      ) : (
        <div>
          <div>⌨️ Setas: Navegar</div>
          <div>🖱️ Scroll: Controlar</div>
        </div>
      )}
    </div>
  )
}

export function TransitionContinuity({ currentSection, previousSection, transitionProgress, isTransitioning }: {
  currentSection?: string
  previousSection?: string
  transitionProgress?: number
  isTransitioning?: boolean
}) {
  if (!isTransitioning) return null
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-opacity duration-500"
      style={{ opacity: transitionProgress }}
    />
  )
}

export function MobilePerformanceMonitor({ showDebugInfo, position, onPerformanceChange }: {
  showDebugInfo?: boolean
  position?: string
  onPerformanceChange?: (metrics: any) => void
}) {
  return null
}

export function PerformanceMonitor({ showDebugPanel, position, autoHide, enableControls, onPerformanceAlert }: {
  showDebugPanel?: boolean
  position?: string
  autoHide?: boolean
  enableControls?: boolean
  onPerformanceAlert?: (level: string) => void
}) {
  return null
}

export function PerformanceOptimizer({ enableGPUAcceleration, enableLazyAnimations, enablePerformanceMonitoring, aggressiveOptimization, debugMode, onOptimizationChange }: {
  enableGPUAcceleration?: boolean
  enableLazyAnimations?: boolean
  enablePerformanceMonitoring?: boolean
  aggressiveOptimization?: boolean
  debugMode?: boolean
  onOptimizationChange?: (optimizations: any) => void
}) {
  return null
}