// Mock Framer Motion for testing
const React = require('react')

const mockMotionComponent = React.forwardRef((props, ref) => {
  const { children, ...otherProps } = props
  return React.createElement('div', { ...otherProps, ref }, children)
})

module.exports = {
  motion: {
    div: mockMotionComponent,
    span: mockMotionComponent,
    h1: mockMotionComponent,
    h2: mockMotionComponent,
    h3: mockMotionComponent,
    p: mockMotionComponent,
    section: mockMotionComponent,
    article: mockMotionComponent,
    button: mockMotionComponent,
    a: mockMotionComponent,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: (initial) => ({
    get: () => initial,
    set: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  }),
  useTransform: () => ({
    get: () => 0,
    set: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
  }),
  useSpring: (value) => value,
  useScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useViewportScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useInView: () => true,
}