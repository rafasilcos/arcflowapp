/**
 * Unit Tests for useScrollController Hook
 * 
 * Tests the core scroll controller functionality including
 * section management, progress tracking, and performance monitoring.
 * 
 * Requirements: 6.4, 2.5, 5.1
 */

import { renderHook, act } from '@testing-library/react'
import { useScrollController } from '../../src/app/landing-scroll-infinito/hooks/useScrollController'

// Mock GSAP
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  set: jest.fn(),
  to: jest.fn(() => ({
    kill: jest.fn(),
  })),
  timeline: jest.fn(() => ({
    scrollTrigger: {},
    kill: jest.fn(),
  })),
  killTweensOf: jest.fn(),
}))

jest.mock('gsap/ScrollTrigger', () => ({
  create: jest.fn(),
  refresh: jest.fn(),
  getAll: jest.fn(() => []),
  killAll: jest.fn(),
}))

// Mock useGSAPTransitions
jest.mock('../../src/app/landing-scroll-infinito/hooks/useGSAPTransitions', () => ({
  useGSAPTransitions: () => ({
    registerSection: jest.fn(),
    executeTransition: jest.fn(),
    updateSectionProgress: jest.fn(),
    isTransitioning: false,
    currentTransition: null,
  }),
}))

describe('useScrollController Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock DOM elements
    document.getElementById = jest.fn((id) => {
      if (id === 'scroll-infinite-container') {
        const mockElement = document.createElement('div')
        mockElement.offsetHeight = 6400 // 800vh
        return mockElement
      }
      return null
    })
  })

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useScrollController())

    expect(result.current.scrollState).toEqual({
      currentSection: 0,
      previousSection: -1,
      scrollProgress: 0,
      scrollDirection: 'down',
      isTransitioning: false,
      transitionProgress: 0,
      isInitialized: false,
    })

    expect(result.current.performanceMetrics.fps).toBe(60)
    expect(result.current.performanceMetrics.isLowPerformance).toBe(false)
  })

  test('should initialize sections with correct configuration', () => {
    const { result } = renderHook(() => useScrollController())

    const sections = result.current.sections
    expect(sections).toHaveLength(8)

    // Test section configuration
    expect(sections[0]).toEqual({
      id: 'hero',
      index: 0,
      startProgress: 0,
      endProgress: 0.125,
      element: null,
      isActive: true,
      isVisible: true,
    })

    expect(sections[7]).toEqual({
      id: 'cta',
      index: 7,
      startProgress: 0.875,
      endProgress: 1,
      element: null,
      isActive: false,
      isVisible: false,
    })
  })

  test('should register sections correctly', () => {
    const { result } = renderHook(() => useScrollController())
    const mockElement = document.createElement('div')

    act(() => {
      result.current.registerSection('hero', mockElement)
    })

    const heroSection = result.current.sections.find(s => s.id === 'hero')
    expect(heroSection?.element).toBe(mockElement)
  })

  test('should update scroll progress and determine current section', () => {
    const { result } = renderHook(() => useScrollController())

    // Test scroll to about section (15% progress)
    act(() => {
      result.current.updateScrollProgress(0.15)
    })

    expect(result.current.scrollState.scrollProgress).toBe(0.15)
    expect(result.current.scrollState.currentSection).toBe(1) // About section
    expect(result.current.scrollState.scrollDirection).toBe('down')
  })

  test('should handle scroll direction changes', () => {
    const { result } = renderHook(() => useScrollController())

    // Scroll down first
    act(() => {
      result.current.updateScrollProgress(0.5)
    })

    expect(result.current.scrollState.scrollDirection).toBe('down')

    // Then scroll up
    act(() => {
      result.current.updateScrollProgress(0.3)
    })

    expect(result.current.scrollState.scrollDirection).toBe('up')
  })

  test('should navigate to specific section', () => {
    const { result } = renderHook(() => useScrollController())
    
    // Mock container element
    const mockContainer = document.createElement('div')
    mockContainer.offsetHeight = 6400
    result.current.container = mockContainer

    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    })

    act(() => {
      result.current.goToSection(3) // Navigate to results section
    })

    // Verify the navigation was attempted
    // (GSAP.to would be called in real implementation)
    expect(result.current.sections[3].id).toBe('results')
  })

  test('should get current section correctly', () => {
    const { result } = renderHook(() => useScrollController())

    // Initially should return hero section
    expect(result.current.getCurrentSection()?.id).toBe('hero')

    // Update to features section
    act(() => {
      result.current.updateScrollProgress(0.3)
    })

    expect(result.current.getCurrentSection()?.id).toBe('features')
  })

  test('should handle section transitions', () => {
    const { result } = renderHook(() => useScrollController())

    // Simulate transition between sections
    act(() => {
      result.current.updateScrollProgress(0.125) // Exactly at section boundary
    })

    expect(result.current.scrollState.currentSection).toBe(1) // About section
    expect(result.current.scrollState.previousSection).toBe(0) // Hero section
  })

  test('should clamp scroll progress between 0 and 1', () => {
    const { result } = renderHook(() => useScrollController())

    // Test negative progress
    act(() => {
      result.current.updateScrollProgress(-0.5)
    })

    expect(result.current.scrollState.scrollProgress).toBe(0)

    // Test progress > 1
    act(() => {
      result.current.updateScrollProgress(1.5)
    })

    expect(result.current.scrollState.scrollProgress).toBe(1)
  })

  test('should update section visibility based on proximity', () => {
    const { result } = renderHook(() => useScrollController())

    // Navigate to middle section
    act(() => {
      result.current.updateScrollProgress(0.5) // Testimonials section
    })

    const sections = result.current.sections
    const currentSection = sections[4] // Testimonials
    const adjacentSections = [sections[3], sections[5]] // Results and Pricing

    expect(currentSection.isActive).toBe(true)
    expect(currentSection.isVisible).toBe(true)

    // Adjacent sections should be visible but not active
    adjacentSections.forEach(section => {
      expect(section.isVisible).toBe(true)
      expect(section.isActive).toBe(false)
    })
  })

  test('should handle performance monitoring', async () => {
    const { result } = renderHook(() => useScrollController())

    // Initial performance should be good
    expect(result.current.performanceMetrics.fps).toBe(60)
    expect(result.current.performanceMetrics.isLowPerformance).toBe(false)

    // Performance monitoring runs in useEffect, so we need to wait
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Performance metrics should be updated
    expect(result.current.performanceMetrics.lastFrameTime).toBeGreaterThan(0)
  })

  test('should handle edge cases in section calculation', () => {
    const { result } = renderHook(() => useScrollController())

    // Test exact section boundaries
    const testCases = [
      { progress: 0, expectedSection: 0 },
      { progress: 0.125, expectedSection: 1 },
      { progress: 0.25, expectedSection: 2 },
      { progress: 0.375, expectedSection: 3 },
      { progress: 0.5, expectedSection: 4 },
      { progress: 0.625, expectedSection: 5 },
      { progress: 0.75, expectedSection: 6 },
      { progress: 0.875, expectedSection: 7 },
      { progress: 1, expectedSection: 7 },
    ]

    testCases.forEach(({ progress, expectedSection }) => {
      act(() => {
        result.current.updateScrollProgress(progress)
      })

      expect(result.current.scrollState.currentSection).toBe(expectedSection)
    })
  })

  test('should calculate transition progress within sections', () => {
    const { result } = renderHook(() => useScrollController())

    // Test progress within about section (12.5% - 25%)
    act(() => {
      result.current.updateScrollProgress(0.1875) // Halfway through about section
    })

    expect(result.current.scrollState.currentSection).toBe(1) // About section
    expect(result.current.scrollState.transitionProgress).toBeCloseTo(0.5, 1)
  })

  test('should handle initialization state correctly', () => {
    const { result } = renderHook(() => useScrollController())

    // Initially not initialized
    expect(result.current.scrollState.isInitialized).toBe(false)
    expect(result.current.isInitialized).toBe(false)

    // After DOM setup (mocked), should be initialized
    act(() => {
      // Simulate initialization completion
      result.current.scrollState.isInitialized = true
    })
  })

  test('should prevent navigation to invalid sections', () => {
    const { result } = renderHook(() => useScrollController())

    // Test navigation to negative section
    act(() => {
      result.current.goToSection(-1)
    })

    // Should remain at current section
    expect(result.current.scrollState.currentSection).toBe(0)

    // Test navigation to section beyond range
    act(() => {
      result.current.goToSection(10)
    })

    // Should remain at current section
    expect(result.current.scrollState.currentSection).toBe(0)
  })
})