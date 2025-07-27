// Mock GSAP for testing
const mockTimeline = {
  to: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  fromTo: jest.fn().mockReturnThis(),
  add: jest.fn().mockReturnThis(),
  kill: jest.fn().mockReturnThis(),
  progress: jest.fn().mockReturnValue(0),
  duration: jest.fn().mockReturnValue(1),
  totalDuration: jest.fn().mockReturnValue(1),
  isActive: jest.fn().mockReturnValue(false),
  invalidate: jest.fn().mockReturnThis(),
  restart: jest.fn().mockReturnThis(),
  pause: jest.fn().mockReturnThis(),
  resume: jest.fn().mockReturnThis(),
  reverse: jest.fn().mockReturnThis(),
  seek: jest.fn().mockReturnThis(),
  time: jest.fn().mockReturnValue(0),
  totalTime: jest.fn().mockReturnValue(0),
}

const mockScrollTrigger = {
  create: jest.fn().mockReturnValue({
    kill: jest.fn(),
    refresh: jest.fn(),
    update: jest.fn(),
    progress: 0,
    isActive: true,
  }),
  refresh: jest.fn(),
  update: jest.fn(),
  getAll: jest.fn().mockReturnValue([]),
  killAll: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  batch: jest.fn(),
  defaults: jest.fn(),
}

const gsap = {
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
  delayedCall: jest.fn(),
  ticker: {
    add: jest.fn(),
    remove: jest.fn(),
    fps: jest.fn().mockReturnValue(60),
  },
  utils: {
    toArray: jest.fn((selector) => {
      if (typeof selector === 'string') {
        return document.querySelectorAll(selector)
      }
      return Array.isArray(selector) ? selector : [selector]
    }),
    selector: jest.fn(),
    random: jest.fn().mockReturnValue(0.5),
    clamp: jest.fn((min, max, value) => Math.max(min, Math.min(max, value))),
    interpolate: jest.fn(),
    mapRange: jest.fn(),
    normalize: jest.fn(),
    pipe: jest.fn(),
    unitize: jest.fn(),
    wrap: jest.fn(),
  },
  config: jest.fn(),
  globalTimeline: mockTimeline,
  exportRoot: jest.fn().mockReturnValue(mockTimeline),
}

// ScrollTrigger as separate export
gsap.ScrollTrigger = mockScrollTrigger

// Export both named and default
module.exports = gsap
module.exports.gsap = gsap
module.exports.ScrollTrigger = mockScrollTrigger
module.exports.default = gsap