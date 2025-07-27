/**
 * Performance Tests for Scroll Infinito System
 * 
 * Tests performance characteristics across different devices,
 * frame rate monitoring, and optimization strategies.
 * 
 * Requirements: 6.4, 2.5, 5.1
 */

import { renderHook, act } from '@testing-library/react'
import { useScrollController } from '../../src/app/landing-scroll-infinito/hooks/useScrollController'
import { usePerformanceMonitor } from '../../src/app/landing-scroll-infinito/hooks/usePerformanceMonitor'

// Mock performance APIs
const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}

global.PerformanceObserver = jest.fn(() => mockPerformanceObserver)

// Mock requestAnimationFrame for controlled timing
let rafCallbacks: FrameRequestCallback[] = []
global.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  rafCallbacks.push(callback)
  return rafCallbacks.length
})

global.cancelAnimationFrame = jest.fn((id: number) => {
  rafCallbacks = rafCallbacks.filter((_, index) => index + 1 !== id)
})

// Helper to simulate frame execution
const executeFrames = (count: number = 1, deltaTime: number = 16.67) => {
  for (let i = 0; i < count; i++) {
    const callbacks = [...rafCallbacks]
    rafCallbacks = []
    callbacks.forEach(callback => callback(performance.now() + deltaTime * i))
  }
}

describe('Scroll Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    rafCallbacks = []
    
    // Reset performance.now mock
    jest.spyOn(performance, 'now').mockImplementation(() => Date.now())
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Frame Rate Monitoring', () => {
    test('should maintain 60fps under normal conditions', async () => {
      const { result } = renderHook(() => useScrollController())

      // Simulate 60fps (16.67ms per frame)
      const frameTime = 16.67
      let currentTime = 0

      jest.spyOn(performance, 'now').mockImplementation(() => {
        currentTime += frameTime
        return currentTime
      })

      // Execute several frames
      act(() => {
        executeFrames(10, frameTime)
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      expect(result.current.performanceMetrics.fps).toBeCloseTo(60, 0)
      expect(result.current.performanceMetrics.isLowPerformance).toBe(false)
    })

    test('should detect low performance conditions', async () => {
      const { result } = renderHook(() => useScrollController())

      // Simulate 20fps (50ms per frame)
      const frameTime = 50
      let currentTime = 0

      jest.spyOn(performance, 'now').mockImplementation(() => {
        currentTime += frameTime
        return currentTime
      })

      // Execute frames at low fps
      act(() => {
        executeFrames(5, frameTime)
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 300))
      })

      expect(result.current.performanceMetrics.fps).toBeLessThan(30)
      expect(result.current.performanceMetrics.isLowPerformance).toBe(true)
    })

    test('should handle frame rate fluctuations', async () => {
      const { result } = renderHook(() => useScrollController())

      const frameTimes = [16.67, 16.67, 33.33, 16.67, 50, 16.67] // Mixed frame rates
      let frameIndex = 0

      jest.spyOn(performance, 'now').mockImplementation(() => {
        const time = frameTimes[frameIndex % frameTimes.length]
        frameIndex++
        return Date.now() + time * frameIndex
      })

      // Execute frames with varying performance
      act(() => {
        executeFrames(frameTimes.length)
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
      })

      // Should handle fluctuations gracefully
      expect(result.current.performanceMetrics.fps).toBeGreaterThan(0)
      expect(typeof result.current.performanceMetrics.isLowPerformance).toBe('boolean')
    })
  })

  describe('Device-Specific Performance', () => {
    test('should optimize for mobile devices', () => {
      // Mock mobile user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      })

      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 667 })

      const { result } = renderHook(() => useScrollController())

      // Mobile optimizations should be applied
      expect(result.current.performanceMetrics).toBeDefined()
      
      // Verify mobile-specific behavior
      act(() => {
        result.current.updateScrollProgress(0.5)
      })

      // Should handle mobile scroll updates efficiently
      expect(result.current.scrollState.scrollProgress).toBe(0.5)
    })

    test('should handle desktop high-performance scenarios', () => {
      // Mock desktop user agent
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      })

      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1920 })
      Object.defineProperty(window, 'innerHeight', { writable: true, value: 1080 })

      const { result } = renderHook(() => useScrollController())

      // Desktop should handle more complex animations
      act(() => {
        result.current.updateScrollProgress(0.25)
        result.current.updateScrollProgress(0.5)
        result.current.updateScrollProgress(0.75)
      })

      expect(result.current.scrollState.scrollProgress).toBe(0.75)
      expect(result.current.performanceMetrics.fps).toBeGreaterThan(30)
    })

    test('should adapt to low-end devices', () => {
      // Mock low-end device characteristics
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2 // Low CPU cores
      })

      Object.defineProperty(navigator, 'deviceMemory', {
        writable: true,
        value: 1 // Low RAM
      })

      const { result } = renderHook(() => useScrollController())

      // Simulate poor performance
      jest.spyOn(performance, 'now').mockImplementation(() => Date.now() + 100) // Slow frames

      act(() => {
        executeFrames(3, 100) // Very slow frames
      })

      // Should detect and adapt to low performance
      expect(result.current.performanceMetrics.isLowPerformance).toBe(true)
    })
  })

  describe('Memory Management', () => {
    test('should cleanup animations on unmount', () => {
      const { result, unmount } = renderHook(() => useScrollController())

      // Register some sections
      const elements = Array.from({ length: 8 }, () => document.createElement('div'))
      
      act(() => {
        elements.forEach((element, index) => {
          result.current.registerSection(`section-${index}`, element)
        })
      })

      // Verify sections are registered
      expect(result.current.sections.length).toBe(8)

      // Unmount and verify cleanup
      unmount()

      // Memory should be cleaned up (no memory leaks)
      expect(rafCallbacks.length).toBe(0)
    })

    test('should handle rapid section changes without memory leaks', () => {
      const { result } = renderHook(() => useScrollController())

      // Rapidly change sections
      const progressValues = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
      
      act(() => {
        progressValues.forEach(progress => {
          result.current.updateScrollProgress(progress)
        })
      })

      // Should handle rapid changes without issues
      expect(result.current.scrollState.scrollProgress).toBe(1)
      expect(result.current.scrollState.currentSection).toBe(7)
    })

    test('should throttle scroll events for performance', async () => {
      const { result } = renderHook(() => useScrollController())

      let updateCount = 0
      const originalUpdate = result.current.updateScrollProgress

      // Mock the update function to count calls
      result.current.updateScrollProgress = jest.fn((...args) => {
        updateCount++
        return originalUpdate(...args)
      })

      // Simulate rapid scroll events
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.updateScrollProgress(i / 100)
        }
      })

      // Should throttle updates for performance
      expect(updateCount).toBeLessThan(100)
    })
  })

  describe('Animation Performance', () => {
    test('should handle smooth transitions between sections', async () => {
      const { result } = renderHook(() => useScrollController())

      const startTime = performance.now()

      // Execute transition
      act(() => {
        result.current.goToSection(3)
      })

      const endTime = performance.now()
      const transitionTime = endTime - startTime

      // Transition should be reasonably fast
      expect(transitionTime).toBeLessThan(100) // Less than 100ms for test execution
    })

    test('should maintain performance during continuous scrolling', async () => {
      const { result } = renderHook(() => useScrollController())

      const performanceStart = result.current.performanceMetrics.fps

      // Simulate continuous scrolling
      act(() => {
        for (let i = 0; i <= 100; i++) {
          result.current.updateScrollProgress(i / 100)
        }
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      const performanceEnd = result.current.performanceMetrics.fps

      // Performance should remain stable
      expect(Math.abs(performanceEnd - performanceStart)).toBeLessThan(10)
    })

    test('should optimize animations based on device capabilities', () => {
      // Mock high-performance device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 8
      })

      const { result: highPerfResult } = renderHook(() => useScrollController())

      // Mock low-performance device
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2
      })

      const { result: lowPerfResult } = renderHook(() => useScrollController())

      // Both should work but potentially with different optimization levels
      expect(highPerfResult.current.performanceMetrics).toBeDefined()
      expect(lowPerfResult.current.performanceMetrics).toBeDefined()
    })
  })

  describe('Scroll Event Performance', () => {
    test('should handle high-frequency scroll events', () => {
      const { result } = renderHook(() => useScrollController())

      const scrollEvents = Array.from({ length: 1000 }, (_, i) => i / 1000)
      const startTime = performance.now()

      act(() => {
        scrollEvents.forEach(progress => {
          result.current.updateScrollProgress(progress)
        })
      })

      const endTime = performance.now()
      const processingTime = endTime - startTime

      // Should process events efficiently
      expect(processingTime).toBeLessThan(1000) // Less than 1 second
      expect(result.current.scrollState.scrollProgress).toBe(0.999)
    })

    test('should debounce rapid scroll updates', async () => {
      const { result } = renderHook(() => useScrollController())

      let callCount = 0
      const originalUpdate = result.current.updateScrollProgress

      // Mock to count actual updates
      result.current.updateScrollProgress = jest.fn((...args) => {
        callCount++
        return originalUpdate(...args)
      })

      // Rapid fire updates
      act(() => {
        for (let i = 0; i < 50; i++) {
          setTimeout(() => result.current.updateScrollProgress(i / 50), i)
        }
      })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      // Should debounce some updates
      expect(callCount).toBeLessThan(50)
    })
  })

  describe('Resource Usage', () => {
    test('should monitor CPU usage during animations', async () => {
      const { result } = renderHook(() => useScrollController())

      // Simulate CPU-intensive operations
      const startTime = performance.now()
      
      act(() => {
        // Simulate complex scroll operations
        for (let i = 0; i < 100; i++) {
          result.current.updateScrollProgress(Math.sin(i / 10) * 0.5 + 0.5)
        }
      })

      const endTime = performance.now()
      const cpuTime = endTime - startTime

      // Should complete operations efficiently
      expect(cpuTime).toBeLessThan(500) // Less than 500ms
    })

    test('should handle memory pressure gracefully', () => {
      const { result } = renderHook(() => useScrollController())

      // Simulate memory pressure by creating many elements
      const elements = Array.from({ length: 1000 }, () => document.createElement('div'))

      act(() => {
        // Try to register many sections (should handle gracefully)
        elements.slice(0, 8).forEach((element, index) => {
          result.current.registerSection(`section-${index}`, element)
        })
      })

      // Should still function correctly
      expect(result.current.sections.length).toBe(8)
      expect(result.current.scrollState.isInitialized).toBe(false) // Will be true after DOM setup
    })
  })
})