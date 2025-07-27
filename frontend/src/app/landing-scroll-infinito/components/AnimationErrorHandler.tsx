'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useAnimationFallback } from '../hooks/useAnimationFallback'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface AnimationErrorHandlerProps {
  children: React.ReactNode
  enableLogging?: boolean
  enableRecovery?: boolean
  maxRetries?: number
  onError?: (error: Error, context: string) => void
  onFallback?: (mode: string) => void
}

interface ErrorLog {
  id: string
  timestamp: number
  error: Error
  context: string
  stackTrace?: string
  userAgent?: string
  url?: string
}

/**
 * Comprehensive animation error handler component
 * Manages error detection, logging, recovery, and fallback modes
 */
export function AnimationErrorHandler({
  children,
  enableLogging = true,
  enableRecovery = true,
  maxRetries = 3,
  onError,
  onFallback
}: AnimationErrorHandlerProps) {
  const { 
    fallbackState, 
    capabilities, 
    handleAnimationError, 
    createSafeAnimation,
    attemptRecovery,
    shouldUseGSAP,
    shouldUseCSSFallback,
    shouldUseMinimalAnimations
  } = useAnimationFallback()

  const {
    motionState,
    motionSettings,
    prefersReducedMotion,
    createMotionSafeAnimation
  } = useReducedMotion()

  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const errorCountRef = useRef(0)
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Create error log entry
  const createErrorLog = useCallback((error: Error, context: string): ErrorLog => {
    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      error,
      context,
      stackTrace: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }, [])

  // Log error with details
  const logError = useCallback((error: Error, context: string) => {
    if (!enableLogging) return

    const errorLog = createErrorLog(error, context)
    
    setErrorLogs(prev => [...prev.slice(-9), errorLog]) // Keep last 10 errors
    
    console.group(`🚨 Animation Error [${context}]`)
    console.error('Error:', error)
    console.log('Context:', context)
    console.log('Timestamp:', new Date(errorLog.timestamp).toISOString())
    console.log('Fallback State:', fallbackState)
    console.log('Motion State:', motionState)
    console.log('Capabilities:', capabilities)
    console.groupEnd()

    // Call custom error handler
    if (onError) {
      onError(error, context)
    }
  }, [enableLogging, createErrorLog, fallbackState, motionState, capabilities, onError])

  // Enhanced error handler with context
  const handleError = useCallback((error: Error, context: string = 'unknown') => {
    errorCountRef.current += 1
    
    // Log the error
    logError(error, context)
    
    // Handle the error with fallback system
    handleAnimationError(error, context)
    
    // Attempt recovery if enabled
    if (enableRecovery && errorCountRef.current <= maxRetries) {
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
      }
      
      recoveryTimeoutRef.current = setTimeout(() => {
        console.log(`🔄 Attempting recovery (attempt ${errorCountRef.current}/${maxRetries})`)
        attemptRecovery()
      }, 2000 * errorCountRef.current) // Exponential backoff
    }
  }, [logError, handleAnimationError, enableRecovery, maxRetries, attemptRecovery])

  // Monitor for animation errors
  useEffect(() => {
    if (!isMonitoring) {
      setIsMonitoring(true)
      
      // Global error handler for unhandled errors
      const handleGlobalError = (event: ErrorEvent) => {
        const error = event.error
        if (error && (
          error.message?.toLowerCase().includes('gsap') ||
          error.message?.toLowerCase().includes('scrolltrigger') ||
          error.message?.toLowerCase().includes('animation') ||
          error.message?.toLowerCase().includes('transform') ||
          error.message?.toLowerCase().includes('timeline')
        )) {
          handleError(error, 'global-error')
        }
      }

      // Unhandled promise rejection handler
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const error = event.reason
        if (error instanceof Error && (
          error.message?.toLowerCase().includes('gsap') ||
          error.message?.toLowerCase().includes('animation')
        )) {
          handleError(error, 'unhandled-promise')
        }
      }

      // Console error interceptor
      const originalConsoleError = console.error
      console.error = (...args) => {
        const message = args.join(' ')
        if (message.toLowerCase().includes('gsap') || 
            message.toLowerCase().includes('scrolltrigger') ||
            message.toLowerCase().includes('animation')) {
          handleError(new Error(message), 'console-error')
        }
        originalConsoleError.apply(console, args)
      }

      // GSAP-specific error handlers
      if (typeof window !== 'undefined' && window.gsap) {
        // Override GSAP's error handling
        const originalGSAPError = window.gsap.utils?.checkPrefix
        if (originalGSAPError) {
          window.gsap.utils.checkPrefix = function(...args) {
            try {
              return originalGSAPError.apply(this, args)
            } catch (error) {
              handleError(error as Error, 'gsap-utils')
              return null
            }
          }
        }
      }

      window.addEventListener('error', handleGlobalError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      console.log('✅ Animation error monitoring started')

      return () => {
        window.removeEventListener('error', handleGlobalError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
        console.error = originalConsoleError
        setIsMonitoring(false)
      }
    }
  }, [isMonitoring, handleError])

  // Monitor fallback state changes
  useEffect(() => {
    if (onFallback && fallbackState.fallbackMode !== 'none') {
      onFallback(fallbackState.fallbackMode)
    }
  }, [fallbackState.fallbackMode, onFallback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
      }
    }
  }, [])

  // Create enhanced safe animation wrapper
  const createEnhancedSafeAnimation = useCallback((
    animationFn: () => void,
    fallbackFn?: () => void,
    context: string = 'animation'
  ) => {
    // Combine fallback and motion safety
    const motionSafeAnimation = createMotionSafeAnimation(
      animationFn,
      fallbackFn,
      fallbackFn
    )
    
    const safeAnimation = createSafeAnimation(
      motionSafeAnimation,
      fallbackFn,
      context
    )
    
    return safeAnimation
  }, [createMotionSafeAnimation, createSafeAnimation])

  // Provide context to children
  const contextValue = {
    // State
    fallbackState,
    motionState,
    capabilities,
    errorLogs,
    
    // Computed
    shouldUseGSAP: shouldUseGSAP && !prefersReducedMotion,
    shouldUseCSSFallback: shouldUseCSSFallback || prefersReducedMotion,
    shouldUseMinimalAnimations: shouldUseMinimalAnimations || prefersReducedMotion,
    
    // Methods
    handleError,
    createEnhancedSafeAnimation,
    attemptRecovery,
    
    // Settings
    animationDuration: motionSettings.animationDuration,
    transitionDuration: motionSettings.transitionDuration,
    enableAnimations: motionSettings.enableAnimations && fallbackState.fallbackMode !== 'disabled',
    enableTransitions: motionSettings.enableTransitions && fallbackState.fallbackMode !== 'disabled'
  }

  return (
    <AnimationErrorContext.Provider value={contextValue}>
      {children}
    </AnimationErrorContext.Provider>
  )
}

// Context for accessing error handler throughout the app
import { createContext, useContext } from 'react'

const AnimationErrorContext = createContext<any>(null)

export function useAnimationErrorHandler() {
  const context = useContext(AnimationErrorContext)
  if (!context) {
    throw new Error('useAnimationErrorHandler must be used within AnimationErrorHandler')
  }
  return context
}

// Development-only error display component
export function AnimationErrorDisplay() {
  const { errorLogs, fallbackState, capabilities } = useAnimationErrorHandler()

  if (process.env.NODE_ENV !== 'development' || errorLogs.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <details className="bg-red-900/90 text-white p-4 rounded-lg backdrop-blur-sm">
        <summary className="cursor-pointer font-bold text-red-200 mb-2">
          🚨 Animation Errors ({errorLogs.length})
        </summary>
        
        <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
          <div className="mb-2 p-2 bg-black/30 rounded">
            <div><strong>Fallback Mode:</strong> {fallbackState.fallbackMode}</div>
            <div><strong>GSAP Available:</strong> {fallbackState.isGSAPAvailable ? '✅' : '❌'}</div>
            <div><strong>Reduced Motion:</strong> {fallbackState.isReducedMotion ? '✅' : '❌'}</div>
          </div>
          
          {errorLogs.slice(-3).map(log => (
            <div key={log.id} className="p-2 bg-black/20 rounded text-xs">
              <div className="font-medium text-red-300">{log.context}</div>
              <div className="text-red-200">{log.error.message}</div>
              <div className="text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}