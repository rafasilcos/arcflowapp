import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 16)
}

global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// Mock performance.now
global.performance = {
  ...global.performance,
  now: () => Date.now(),
}

// Mock window.scrollTo
global.scrollTo = jest.fn()

// Mock window.getComputedStyle
global.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(() => ''),
}))

// Mock HTMLElement methods
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 800,
})

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 1200,
})

Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  configurable: true,
  value: 6400, // 800vh equivalent
})

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 800,
})

// Mock window dimensions
Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 800,
})

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1200,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Suppress GSAP warnings in tests
global.gsap = {
  registerPlugin: jest.fn(),
  set: jest.fn(),
  to: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    set: jest.fn(),
    kill: jest.fn(),
  })),
  killTweensOf: jest.fn(),
}