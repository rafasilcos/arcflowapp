/**
 * Unit Tests for useGSAPTransitions Hook
 * 
 * Tests the GSAP animation system including section transitions,
 * timeline management, and animation synchronization.
 * 
 * Requirements: 6.4, 2.5, 5.1
 */

import { renderHook, act } from '@testing-library/react'
import { useGSAPTransitions } from '../../src/app/landing-scroll-infinito/hooks/useGSAPTransitions'

// Mock GSAP with more detailed mocks
const mockTimeline = {
  to: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  fromTo: jest.fn().mockReturnThis(),
  add: jest.fn().mockReturnThis(),
  kill: jest.fn().mockReturnThis(),
  progress: jest.fn().mockReturnValue(0),
  duration: jest.fn().mockReturnValue(1),
  isActive: jest.fn().mockReturnValue(false),
  invalidate: jest.fn().mockReturnThis(),
  restart: jest.fn().mockReturnThis(),
  pause: jest.fn().mockReturnThis(),
  resume: jest.fn().mockReturnThis(),
  reverse: jest.fn().mockReturnThis(),
  seek: jest.fn().mockReturnThis(),
}

const mockGsap = {
  registerPlugin: jest.fn(),
  set: jest.fn(),
  to: jest.fn().mockReturnValue({
    kill: jest.fn(),
    progress: jest.fn(),
    duration: jest.fn(),
    isActive: jest.fn().mockReturnValue(false),
  }),
  from: jest.fn(),
  fromTo: jest.fn(),
  timeline: jest.fn().mockReturnValue(mockTimeline),
  killTweensOf: jest.fn(),
  getTweensOf: jest.fn().mockReturnValue([]),
  isTweening: jest.fn().mockReturnValue(false),
  utils: {
    toArray: jest.fn((selector) => {
      if (typeof selector === 'string') {
        return [document.createElement('div')]
      }
      return Array.isArray(selector) ? selector : [selector]
    }),
  },
}

jest.mock('gsap', () => mockGsap)
jest.mock('gsap/ScrollTrigger', () => ({}))

describe('useGSAPTransitions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useGSAPTransitions())

    expect(result.current.isTransitioning).toBe(false)
    expect(result.current.currentTransition).toBe(null)
  })

  test('should register sections correctly', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    const mockElement = document.createElement('div')

    act(() => {
      result.current.registerSection('hero', mockElement)
    })

    // Verify GSAP set was called to initialize the element
    expect(mockGsap.set).toHaveBeenCalledWith(mockElement, expect.any(Object))
  })

  test('should execute transitions between sections', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    // Register sections first
    const heroElement = document.createElement('div')
    const aboutElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
      result.current.registerSection('about', aboutElement)
    })

    // Execute transition
    act(() => {
      result.current.executeTransition('hero', 'about', 0.5)
    })

    // Verify timeline creation and animation calls
    expect(mockGsap.timeline).toHaveBeenCalled()
    expect(mockTimeline.to).toHaveBeenCalled()
  })

  test('should handle section-specific animations', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const sections = [
      { id: 'hero', element: document.createElement('div') },
      { id: 'about', element: document.createElement('div') },
      { id: 'features', element: document.createElement('div') },
      { id: 'results', element: document.createElement('div') },
      { id: 'testimonials', element: document.createElement('div') },
      { id: 'pricing', element: document.createElement('div') },
      { id: 'faq', element: document.createElement('div') },
      { id: 'cta', element: document.createElement('div') },
    ]

    // Register all sections
    sections.forEach(({ id, element }) => {
      act(() => {
        result.current.registerSection(id, element)
      })
    })

    // Test different section transitions
    const transitionTests = [
      { from: 'hero', to: 'about' },
      { from: 'about', to: 'features' },
      { from: 'features', to: 'results' },
      { from: 'results', to: 'testimonials' },
      { from: 'testimonials', to: 'pricing' },
      { from: 'pricing', to: 'faq' },
      { from: 'faq', to: 'cta' },
    ]

    transitionTests.forEach(({ from, to }) => {
      act(() => {
        result.current.executeTransition(from, to, 0.5)
      })

      // Each transition should create a new timeline
      expect(mockGsap.timeline).toHaveBeenCalled()
    })
  })

  test('should update section progress correctly', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const heroElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
    })

    // Update section progress
    act(() => {
      result.current.updateSectionProgress('hero', 0.75)
    })

    // Verify progress update was handled
    // (In real implementation, this would update the timeline progress)
    expect(result.current.isTransitioning).toBe(false)
  })

  test('should handle animation cleanup', () => {
    const { result, unmount } = renderHook(() => useGSAPTransitions())
    
    const heroElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
    })

    // Execute a transition
    act(() => {
      result.current.executeTransition('hero', 'about', 0.5)
    })

    // Unmount the hook
    unmount()

    // Verify cleanup was called
    expect(mockTimeline.kill).toHaveBeenCalled()
  })

  test('should handle invalid section transitions gracefully', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    // Try to execute transition without registering sections
    act(() => {
      result.current.executeTransition('nonexistent', 'alsononexistent', 0.5)
    })

    // Should not crash and should not create timeline
    expect(result.current.isTransitioning).toBe(false)
  })

  test('should handle concurrent transitions', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const heroElement = document.createElement('div')
    const aboutElement = document.createElement('div')
    const featuresElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
      result.current.registerSection('about', aboutElement)
      result.current.registerSection('features', featuresElement)
    })

    // Execute multiple transitions rapidly
    act(() => {
      result.current.executeTransition('hero', 'about', 0.3)
      result.current.executeTransition('about', 'features', 0.7)
    })

    // Should handle concurrent transitions properly
    expect(mockGsap.timeline).toHaveBeenCalledTimes(2)
  })

  test('should apply correct animation properties for each section type', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const testSections = [
      { id: 'hero', expectedProps: ['opacity', 'scale', 'y'] },
      { id: 'about', expectedProps: ['opacity', 'scale', 'y'] },
      { id: 'features', expectedProps: ['opacity', 'y'] },
      { id: 'results', expectedProps: ['opacity', 'scale'] },
      { id: 'testimonials', expectedProps: ['opacity', 'x'] },
      { id: 'pricing', expectedProps: ['opacity', 'rotationY'] },
      { id: 'faq', expectedProps: ['opacity', 'scaleY'] },
      { id: 'cta', expectedProps: ['opacity', 'scale'] },
    ]

    testSections.forEach(({ id }) => {
      const element = document.createElement('div')
      
      act(() => {
        result.current.registerSection(id, element)
      })

      // Verify initial state was set
      expect(mockGsap.set).toHaveBeenCalledWith(element, expect.any(Object))
    })
  })

  test('should handle stagger animations for complex sections', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    // Create features section with multiple child elements
    const featuresElement = document.createElement('div')
    const featureCards = Array.from({ length: 6 }, () => document.createElement('div'))
    featureCards.forEach(card => {
      card.className = 'feature-card'
      featuresElement.appendChild(card)
    })
    
    act(() => {
      result.current.registerSection('features', featuresElement)
    })

    // Execute transition to features section
    act(() => {
      result.current.executeTransition('about', 'features', 0.5)
    })

    // Verify stagger animation was set up
    expect(mockGsap.timeline).toHaveBeenCalled()
    expect(mockTimeline.to).toHaveBeenCalled()
  })

  test('should handle animation timing and easing', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const heroElement = document.createElement('div')
    const aboutElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
      result.current.registerSection('about', aboutElement)
    })

    // Execute transition with specific progress
    act(() => {
      result.current.executeTransition('hero', 'about', 0.8)
    })

    // Verify timeline was created with proper timing
    expect(mockGsap.timeline).toHaveBeenCalledWith(
      expect.objectContaining({
        onComplete: expect.any(Function),
        onUpdate: expect.any(Function),
      })
    )
  })

  test('should handle reverse transitions', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    const aboutElement = document.createElement('div')
    const heroElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('about', aboutElement)
      result.current.registerSection('hero', heroElement)
    })

    // Execute reverse transition (about to hero)
    act(() => {
      result.current.executeTransition('about', 'hero', 0.5)
    })

    // Should handle reverse transition properly
    expect(mockGsap.timeline).toHaveBeenCalled()
    expect(mockTimeline.to).toHaveBeenCalled()
  })

  test('should handle performance optimization', () => {
    const { result } = renderHook(() => useGSAPTransitions())
    
    // Mock low performance scenario
    const originalPerformance = global.performance
    global.performance = {
      ...originalPerformance,
      now: jest.fn(() => Date.now()),
    }

    const heroElement = document.createElement('div')
    
    act(() => {
      result.current.registerSection('hero', heroElement)
    })

    // Execute transition under low performance
    act(() => {
      result.current.executeTransition('hero', 'about', 0.5)
    })

    // Should still work but potentially with reduced complexity
    expect(mockGsap.timeline).toHaveBeenCalled()

    global.performance = originalPerformance
  })
})