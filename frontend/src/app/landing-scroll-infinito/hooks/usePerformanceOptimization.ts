'use client'

import { useEffect, useRef } from 'react'

export function usePerformanceOptimization() {
  const rafId = useRef<number>()
  const lastTime = useRef<number>(0)

  useEffect(() => {
    // Throttle scroll events for better performance
    const throttledScrollHandler = (callback: () => void, delay: number = 16) => {
      return () => {
        const now = Date.now()
        if (now - lastTime.current >= delay) {
          lastTime.current = now
          callback()
        }
      }
    }

    // Monitor FPS
    const monitorFPS = () => {
      let frames = 0
      let lastTime = performance.now()

      const countFrames = () => {
        frames++
        const currentTime = performance.now()
        
        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime))
          
          // Reduce animation quality if FPS is low
          if (fps < 30) {
            document.documentElement.classList.add('low-performance')
          } else {
            document.documentElement.classList.remove('low-performance')
          }
          
          frames = 0
          lastTime = currentTime
        }
        
        rafId.current = requestAnimationFrame(countFrames)
      }
      
      rafId.current = requestAnimationFrame(countFrames)
    }

    // Start monitoring
    monitorFPS()

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return { throttledScrollHandler }
}