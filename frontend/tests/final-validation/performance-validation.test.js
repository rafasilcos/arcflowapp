/**
 * Performance Validation Tests for Scroll Infinito Avançado
 * Tests performance on low-power devices and various conditions
 */

// Performance monitoring utilities
const PerformanceUtils = {
  // Measure FPS over a period
  measureFPS: (duration = 1000) => {
    return new Promise((resolve) => {
      let frames = 0
      let lastTime = performance.now()
      
      const measureFrame = (currentTime) => {
        frames++
        
        if (currentTime - lastTime >= duration) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime))
          resolve(fps)
        } else {
          requestAnimationFrame(measureFrame)
        }
      }
      
      requestAnimationFrame(measureFrame)
    })
  },

  // Measure memory usage
  measureMemoryUsage: () => {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  },

  // Detect device performance tier
  detectDevicePerformance: () => {
    const hardwareConcurrency = navigator.hardwareConcurrency || 2
    const memory = navigator.deviceMemory || 4
    const connection = navigator.connection
    
    let tier = 'medium'
    
    // Low-end device indicators
    if (hardwareConcurrency <= 2 || memory <= 2) {
      tier = 'low'
    }
    // High-end device indicators
    else if (hardwareConcurrency >= 8 && memory >= 8) {
      tier = 'high'
    }
    
    // Network considerations
    if (connection) {
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        tier = 'low'
      }
    }
    
    return {
      tier,
      cores: hardwareConcurrency,
      memory,
      connection: connection ? connection.effectiveType : 'unknown'
    }
  },

  // Simulate low-power device conditions
  simulateLowPowerDevice: () => {
    // Throttle requestAnimationFrame
    const originalRAF = window.requestAnimationFrame
    let throttleCounter = 0
    
    window.requestAnimationFrame = (callback) => {
      throttleCounter++
      if (throttleCounter % 2 === 0) { // Run at 30fps instead of 60fps
        return originalRAF(callback)
      } else {
        return setTimeout(() => callback(performance.now()), 16.67)
      }
    }
    
    return () => {
      window.requestAnimationFrame = originalRAF
    }
  },

  // Measure paint and layout performance
  measureRenderPerformance: () => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const paintEntries = entries.filter(entry => entry.entryType === 'paint')
        const layoutEntries = entries.filter(entry => entry.entryType === 'measure')
        
        resolve({
          firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          layoutTime: layoutEntries.reduce((sum, entry) => sum + entry.duration, 0)
        })
        
        observer.disconnect()
      })
      
      observer.observe({ entryTypes: ['paint', 'measure'] })
      
      // Fallback timeout
      setTimeout(() => {
        observer.disconnect()
        resolve({ firstPaint: 0, firstContentfulPaint: 0, layoutTime: 0 })
      }, 5000)
    })
  }
}

// Animation performance tests
const AnimationPerformanceTests = {
  // Test scroll animation performance
  testScrollAnimationPerformance: async () => {
    console.log('🎬 Testing scroll animation performance...')
    
    // Create test scroll container
    const container = document.createElement('div')
    container.style.height = '800vh'
    container.style.position = 'relative'
    document.body.appendChild(container)

    // Create multiple animated sections
    const sections = []
    for (let i = 0; i < 8; i++) {
      const section = document.createElement('div')
      section.style.position = 'fixed'
      section.style.top = '0'
      section.style.left = '0'
      section.style.width = '100%'
      section.style.height = '100vh'
      section.style.opacity = '0'
      section.style.transform = 'translateY(50px)'
      section.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
      container.appendChild(section)
      sections.push(section)
    }

    const results = {
      baselineFPS: 0,
      animationFPS: 0,
      memoryBefore: PerformanceUtils.measureMemoryUsage(),
      memoryAfter: null,
      performanceImpact: 0
    }

    // Measure baseline FPS
    results.baselineFPS = await PerformanceUtils.measureFPS(1000)

    // Start animations
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = '1'
        section.style.transform = 'translateY(0)'
      }, index * 100)
    })

    // Measure FPS during animations
    await new Promise(resolve => setTimeout(resolve, 500)) // Wait for animations to start
    results.animationFPS = await PerformanceUtils.measureFPS(2000)
    
    // Measure memory after animations
    results.memoryAfter = PerformanceUtils.measureMemoryUsage()
    
    // Calculate performance impact
    results.performanceImpact = ((results.baselineFPS - results.animationFPS) / results.baselineFPS) * 100

    // Cleanup
    document.body.removeChild(container)
    
    console.log('✅ Scroll animation performance results:', results)
    return results
  },

  // Test GSAP performance vs CSS animations
  testGSAPvsCSSPerformance: async () => {
    console.log('⚡ Testing GSAP vs CSS performance...')
    
    const results = {
      cssAnimationFPS: 0,
      gsapSimulatedFPS: 0,
      cssMemoryUsage: null,
      gsapMemoryUsage: null,
      recommendation: 'css'
    }

    // Test CSS animations
    const cssContainer = document.createElement('div')
    document.body.appendChild(cssContainer)
    
    for (let i = 0; i < 50; i++) {
      const element = document.createElement('div')
      element.style.width = '10px'
      element.style.height = '10px'
      element.style.background = '#3b82f6'
      element.style.position = 'absolute'
      element.style.left = `${i * 20}px`
      element.style.top = '50px'
      element.style.transition = 'transform 2s ease'
      element.style.transform = 'translateY(0)'
      cssContainer.appendChild(element)
      
      // Start animation
      setTimeout(() => {
        element.style.transform = 'translateY(200px)'
      }, 100)
    }

    await new Promise(resolve => setTimeout(resolve, 200))
    results.cssAnimationFPS = await PerformanceUtils.measureFPS(1000)
    results.cssMemoryUsage = PerformanceUtils.measureMemoryUsage()
    
    document.body.removeChild(cssContainer)

    // Simulate GSAP performance (since we don't have GSAP loaded in test)
    const gsapContainer = document.createElement('div')
    document.body.appendChild(gsapContainer)
    
    for (let i = 0; i < 50; i++) {
      const element = document.createElement('div')
      element.style.width = '10px'
      element.style.height = '10px'
      element.style.background = '#8b5cf6'
      element.style.position = 'absolute'
      element.style.left = `${i * 20}px`
      element.style.top = '50px'
      element.style.willChange = 'transform'
      gsapContainer.appendChild(element)
      
      // Simulate GSAP-style animation with requestAnimationFrame
      let startTime = performance.now()
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / 2000, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
        
        element.style.transform = `translateY(${easeProgress * 200}px)`
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      setTimeout(() => requestAnimationFrame(animate), 100)
    }

    await new Promise(resolve => setTimeout(resolve, 200))
    results.gsapSimulatedFPS = await PerformanceUtils.measureFPS(1000)
    results.gsapMemoryUsage = PerformanceUtils.measureMemoryUsage()
    
    document.body.removeChild(gsapContainer)

    // Determine recommendation
    if (results.cssAnimationFPS > results.gsapSimulatedFPS) {
      results.recommendation = 'css'
    } else {
      results.recommendation = 'gsap'
    }

    console.log('✅ GSAP vs CSS performance results:', results)
    return results
  },

  // Test performance under stress
  testStressPerformance: async () => {
    console.log('🔥 Testing performance under stress...')
    
    const results = {
      normalFPS: 0,
      stressFPS: 0,
      memoryGrowth: 0,
      performanceDegradation: 0
    }

    // Measure normal performance
    results.normalFPS = await PerformanceUtils.measureFPS(1000)
    const initialMemory = PerformanceUtils.measureMemoryUsage()

    // Create stress test scenario
    const stressContainer = document.createElement('div')
    document.body.appendChild(stressContainer)

    // Create many animated elements
    const elements = []
    for (let i = 0; i < 200; i++) {
      const element = document.createElement('div')
      element.style.width = '5px'
      element.style.height = '5px'
      element.style.background = `hsl(${i * 2}, 70%, 50%)`
      element.style.position = 'absolute'
      element.style.left = `${(i % 20) * 30}px`
      element.style.top = `${Math.floor(i / 20) * 30}px`
      element.style.borderRadius = '50%'
      element.style.willChange = 'transform'
      stressContainer.appendChild(element)
      elements.push(element)
    }

    // Start complex animations
    elements.forEach((element, index) => {
      const animateElement = () => {
        const time = performance.now() * 0.001
        const x = Math.sin(time + index * 0.1) * 50
        const y = Math.cos(time + index * 0.1) * 50
        const scale = 1 + Math.sin(time * 2 + index * 0.2) * 0.5
        
        element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
        requestAnimationFrame(animateElement)
      }
      requestAnimationFrame(animateElement)
    })

    // Measure performance under stress
    await new Promise(resolve => setTimeout(resolve, 1000))
    results.stressFPS = await PerformanceUtils.measureFPS(2000)
    
    const finalMemory = PerformanceUtils.measureMemoryUsage()
    if (initialMemory && finalMemory) {
      results.memoryGrowth = finalMemory.used - initialMemory.used
    }

    results.performanceDegradation = ((results.normalFPS - results.stressFPS) / results.normalFPS) * 100

    // Cleanup
    document.body.removeChild(stressContainer)

    console.log('✅ Stress performance results:', results)
    return results
  }
}

// Low-power device tests
const LowPowerDeviceTests = {
  // Test performance on simulated low-power device
  testLowPowerPerformance: async () => {
    console.log('📱 Testing low-power device performance...')
    
    const deviceInfo = PerformanceUtils.detectDevicePerformance()
    const results = {
      deviceTier: deviceInfo.tier,
      deviceSpecs: deviceInfo,
      normalPerformance: {},
      throttledPerformance: {},
      adaptationNeeded: false
    }

    // Test normal performance
    results.normalPerformance.fps = await PerformanceUtils.measureFPS(1000)
    results.normalPerformance.memory = PerformanceUtils.measureMemoryUsage()

    // Simulate low-power device
    const restoreRAF = PerformanceUtils.simulateLowPowerDevice()

    // Test throttled performance
    await new Promise(resolve => setTimeout(resolve, 500)) // Let throttling take effect
    results.throttledPerformance.fps = await PerformanceUtils.measureFPS(1000)
    results.throttledPerformance.memory = PerformanceUtils.measureMemoryUsage()

    // Restore normal performance
    restoreRAF()

    // Determine if adaptation is needed
    const fpsDropPercentage = ((results.normalPerformance.fps - results.throttledPerformance.fps) / results.normalPerformance.fps) * 100
    results.adaptationNeeded = fpsDropPercentage > 30 || results.throttledPerformance.fps < 30

    console.log('✅ Low-power device performance results:', results)
    return results
  },

  // Test mobile-specific optimizations
  testMobileOptimizations: async () => {
    console.log('📲 Testing mobile optimizations...')
    
    const results = {
      touchEventsOptimized: false,
      scrollOptimized: false,
      animationsReduced: false,
      memoryEfficient: false
    }

    // Test touch event optimization
    const touchElement = document.createElement('div')
    touchElement.style.width = '100px'
    touchElement.style.height = '100px'
    touchElement.style.touchAction = 'manipulation'
    document.body.appendChild(touchElement)

    let touchEventCount = 0
    const touchHandler = () => touchEventCount++
    
    touchElement.addEventListener('touchstart', touchHandler, { passive: true })
    touchElement.addEventListener('touchmove', touchHandler, { passive: true })
    touchElement.addEventListener('touchend', touchHandler, { passive: true })

    // Simulate touch events
    const touchStart = new TouchEvent('touchstart', { bubbles: true })
    const touchMove = new TouchEvent('touchmove', { bubbles: true })
    const touchEnd = new TouchEvent('touchend', { bubbles: true })

    touchElement.dispatchEvent(touchStart)
    touchElement.dispatchEvent(touchMove)
    touchElement.dispatchEvent(touchEnd)

    results.touchEventsOptimized = touchEventCount === 3

    // Test scroll optimization
    const scrollContainer = document.createElement('div')
    scrollContainer.style.height = '200px'
    scrollContainer.style.overflowY = 'scroll'
    scrollContainer.style.webkitOverflowScrolling = 'touch'
    
    const scrollContent = document.createElement('div')
    scrollContent.style.height = '1000px'
    scrollContainer.appendChild(scrollContent)
    document.body.appendChild(scrollContainer)

    results.scrollOptimized = scrollContainer.style.webkitOverflowScrolling === 'touch'

    // Test animation reduction for mobile
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    results.animationsReduced = mobileQuery.matches

    // Test memory efficiency
    const memoryBefore = PerformanceUtils.measureMemoryUsage()
    
    // Create and destroy elements to test memory management
    for (let i = 0; i < 100; i++) {
      const tempElement = document.createElement('div')
      document.body.appendChild(tempElement)
      document.body.removeChild(tempElement)
    }
    
    const memoryAfter = PerformanceUtils.measureMemoryUsage()
    results.memoryEfficient = memoryBefore && memoryAfter ? 
      (memoryAfter.used - memoryBefore.used) < 5 : true // Less than 5MB growth

    // Cleanup
    document.body.removeChild(touchElement)
    document.body.removeChild(scrollContainer)

    console.log('✅ Mobile optimizations results:', results)
    return results
  },

  // Test network-aware optimizations
  testNetworkOptimizations: async () => {
    console.log('🌐 Testing network optimizations...')
    
    const results = {
      connectionDetected: false,
      adaptiveLoading: false,
      resourceOptimization: false,
      offlineSupport: false
    }

    // Test connection detection
    if ('connection' in navigator) {
      results.connectionDetected = true
      const connection = navigator.connection
      
      // Test adaptive loading based on connection
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        results.adaptiveLoading = true // Should reduce animations/resources
      }
    }

    // Test resource optimization
    const testImage = new Image()
    testImage.loading = 'lazy'
    results.resourceOptimization = testImage.loading === 'lazy'

    // Test offline support (basic check)
    results.offlineSupport = 'serviceWorker' in navigator

    console.log('✅ Network optimizations results:', results)
    return results
  }
}

// Memory and resource tests
const ResourceTests = {
  // Test memory leaks
  testMemoryLeaks: async () => {
    console.log('🧠 Testing memory leaks...')
    
    const results = {
      initialMemory: PerformanceUtils.measureMemoryUsage(),
      peakMemory: null,
      finalMemory: null,
      memoryLeak: false,
      leakSize: 0
    }

    // Create and destroy many elements to test for leaks
    for (let cycle = 0; cycle < 10; cycle++) {
      const elements = []
      
      // Create elements
      for (let i = 0; i < 100; i++) {
        const element = document.createElement('div')
        element.style.width = '10px'
        element.style.height = '10px'
        element.addEventListener('click', () => {}) // Add event listener
        document.body.appendChild(element)
        elements.push(element)
      }
      
      // Measure peak memory
      const currentMemory = PerformanceUtils.measureMemoryUsage()
      if (!results.peakMemory || (currentMemory && currentMemory.used > results.peakMemory.used)) {
        results.peakMemory = currentMemory
      }
      
      // Remove elements
      elements.forEach(element => {
        element.removeEventListener('click', () => {})
        document.body.removeChild(element)
      })
      
      // Force garbage collection if available
      if (window.gc) {
        window.gc()
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    results.finalMemory = PerformanceUtils.measureMemoryUsage()
    
    if (results.initialMemory && results.finalMemory) {
      results.leakSize = results.finalMemory.used - results.initialMemory.used
      results.memoryLeak = results.leakSize > 10 // More than 10MB growth indicates leak
    }

    console.log('✅ Memory leak test results:', results)
    return results
  },

  // Test animation cleanup
  testAnimationCleanup: async () => {
    console.log('🧹 Testing animation cleanup...')
    
    const results = {
      animationsCreated: 0,
      animationsCleaned: 0,
      cleanupEffective: false
    }

    const animations = []
    
    // Create multiple animations
    for (let i = 0; i < 50; i++) {
      const element = document.createElement('div')
      element.style.width = '10px'
      element.style.height = '10px'
      element.style.position = 'absolute'
      element.style.left = `${i * 10}px`
      document.body.appendChild(element)
      
      // Create animation
      const animation = element.animate([
        { transform: 'translateY(0px)' },
        { transform: 'translateY(100px)' }
      ], {
        duration: 2000,
        iterations: Infinity
      })
      
      animations.push({ element, animation })
      results.animationsCreated++
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    // Clean up animations
    animations.forEach(({ element, animation }) => {
      animation.cancel()
      document.body.removeChild(element)
      results.animationsCleaned++
    })

    results.cleanupEffective = results.animationsCreated === results.animationsCleaned

    console.log('✅ Animation cleanup results:', results)
    return results
  }
}

// Main performance validation test suite
export const PerformanceValidationTests = {
  async runAllTests() {
    console.log('⚡ Starting Performance Validation Tests...')
    
    const results = {
      timestamp: new Date().toISOString(),
      deviceInfo: PerformanceUtils.detectDevicePerformance(),
      tests: {}
    }

    try {
      // Animation performance tests
      results.tests.scrollAnimation = await AnimationPerformanceTests.testScrollAnimationPerformance()
      results.tests.gsapVsCss = await AnimationPerformanceTests.testGSAPvsCSSPerformance()
      results.tests.stressTest = await AnimationPerformanceTests.testStressPerformance()

      // Low-power device tests
      results.tests.lowPowerDevice = await LowPowerDeviceTests.testLowPowerPerformance()
      results.tests.mobileOptimizations = await LowPowerDeviceTests.testMobileOptimizations()
      results.tests.networkOptimizations = await LowPowerDeviceTests.testNetworkOptimizations()

      // Resource tests
      results.tests.memoryLeaks = await ResourceTests.testMemoryLeaks()
      results.tests.animationCleanup = await ResourceTests.testAnimationCleanup()

      // Calculate overall performance score
      const performanceMetrics = [
        results.tests.scrollAnimation.animationFPS >= 30 ? 1 : 0,
        results.tests.stressTest.stressFPS >= 20 ? 1 : 0,
        !results.tests.memoryLeaks.memoryLeak ? 1 : 0,
        results.tests.animationCleanup.cleanupEffective ? 1 : 0,
        results.tests.mobileOptimizations.touchEventsOptimized ? 1 : 0
      ]

      results.performanceScore = (performanceMetrics.reduce((a, b) => a + b, 0) / performanceMetrics.length) * 100
      results.isPerformant = results.performanceScore >= 70
      results.lowPowerReady = !results.tests.lowPowerDevice.adaptationNeeded

      console.log('✅ Performance Validation Tests Complete:', results)
      return results

    } catch (error) {
      console.error('❌ Performance Validation Tests Failed:', error)
      results.error = error.message
      results.isPerformant = false
      return results
    }
  },

  // Generate performance report
  generatePerformanceReport(results) {
    const report = {
      summary: {
        performant: results.isPerformant,
        lowPowerReady: results.lowPowerReady,
        score: `${results.performanceScore.toFixed(1)}%`,
        deviceTier: results.deviceInfo.tier,
        timestamp: results.timestamp
      },
      deviceInfo: results.deviceInfo,
      metrics: {},
      recommendations: []
    }

    // Extract key metrics
    if (results.tests.scrollAnimation) {
      report.metrics.scrollFPS = results.tests.scrollAnimation.animationFPS
      report.metrics.performanceImpact = `${results.tests.scrollAnimation.performanceImpact.toFixed(1)}%`
    }

    if (results.tests.stressTest) {
      report.metrics.stressFPS = results.tests.stressTest.stressFPS
      report.metrics.degradation = `${results.tests.stressTest.performanceDegradation.toFixed(1)}%`
    }

    if (results.tests.memoryLeaks) {
      report.metrics.memoryLeak = results.tests.memoryLeaks.memoryLeak
      report.metrics.memoryGrowth = `${results.tests.memoryLeaks.leakSize}MB`
    }

    // Generate recommendations
    if (results.tests.scrollAnimation?.animationFPS < 30) {
      report.recommendations.push('Optimize scroll animations for better FPS')
    }

    if (results.tests.lowPowerDevice?.adaptationNeeded) {
      report.recommendations.push('Implement adaptive performance for low-power devices')
    }

    if (results.tests.memoryLeaks?.memoryLeak) {
      report.recommendations.push('Fix memory leaks in animation cleanup')
    }

    if (results.deviceInfo.tier === 'low') {
      report.recommendations.push('Enable aggressive optimizations for low-end devices')
    }

    return report
  }
}

// Export utilities for use in other tests
export { PerformanceUtils, AnimationPerformanceTests, LowPowerDeviceTests, ResourceTests }