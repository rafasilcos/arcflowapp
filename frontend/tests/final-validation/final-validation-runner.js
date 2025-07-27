/**
 * Final Validation Test Runner for Scroll Infinito Avançado
 * Orchestrates browser compatibility, accessibility, and performance tests
 */

import { BrowserCompatibilityTests } from './browser-compatibility.test.js'
import { AccessibilityValidationTests } from './accessibility-validation.test.js'
import { PerformanceValidationTests } from './performance-validation.test.js'

// Test configuration
const TEST_CONFIG = {
  browsers: ['chrome', 'firefox', 'safari', 'edge'],
  performanceThresholds: {
    minFPS: 30,
    maxMemoryGrowth: 50, // MB
    maxPerformanceImpact: 40 // %
  },
  accessibilityThresholds: {
    minScore: 85,
    wcagCompliance: 90
  },
  compatibilityThresholds: {
    minScore: 80
  }
}

// Test result aggregator
class TestResultAggregator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Scroll Infinito Avançado - Final Validation',
      overall: {
        passed: false,
        score: 0,
        readyForProduction: false
      },
      browserCompatibility: null,
      accessibility: null,
      performance: null,
      summary: {},
      recommendations: []
    }
  }

  addBrowserResults(results) {
    this.results.browserCompatibility = results
  }

  addAccessibilityResults(results) {
    this.results.accessibility = results
  }

  addPerformanceResults(results) {
    this.results.performance = results
  }

  calculateOverallScore() {
    const scores = []
    
    if (this.results.browserCompatibility) {
      scores.push(this.results.browserCompatibility.compatibilityScore || 0)
    }
    
    if (this.results.accessibility) {
      scores.push(this.results.accessibility.accessibilityScore || 0)
    }
    
    if (this.results.performance) {
      scores.push(this.results.performance.performanceScore || 0)
    }

    this.results.overall.score = scores.length > 0 ? 
      scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Determine if ready for production
    this.results.overall.passed = this.results.overall.score >= 75
    this.results.overall.readyForProduction = 
      this.results.overall.passed &&
      (this.results.browserCompatibility?.isCompatible !== false) &&
      (this.results.accessibility?.isAccessible !== false) &&
      (this.results.performance?.isPerformant !== false)
  }

  generateSummary() {
    this.results.summary = {
      browserCompatibility: {
        status: this.results.browserCompatibility?.isCompatible ? 'PASS' : 'FAIL',
        score: this.results.browserCompatibility?.compatibilityScore?.toFixed(1) + '%' || 'N/A',
        issues: this.results.browserCompatibility?.isCompatible ? 0 : 1
      },
      accessibility: {
        status: this.results.accessibility?.isAccessible ? 'PASS' : 'FAIL',
        score: this.results.accessibility?.accessibilityScore?.toFixed(1) + '%' || 'N/A',
        wcagCompliant: this.results.accessibility?.wcagCompliant || false,
        reducedMotionSupport: this.results.accessibility?.userPreferences?.reducedMotion || false
      },
      performance: {
        status: this.results.performance?.isPerformant ? 'PASS' : 'FAIL',
        score: this.results.performance?.performanceScore?.toFixed(1) + '%' || 'N/A',
        lowPowerReady: this.results.performance?.lowPowerReady || false,
        deviceTier: this.results.performance?.deviceInfo?.tier || 'unknown'
      }
    }
  }

  generateRecommendations() {
    this.results.recommendations = []

    // Browser compatibility recommendations
    if (this.results.browserCompatibility && !this.results.browserCompatibility.isCompatible) {
      this.results.recommendations.push({
        category: 'Browser Compatibility',
        priority: 'high',
        message: 'Implement fallbacks for unsupported browser features'
      })
    }

    // Accessibility recommendations
    if (this.results.accessibility) {
      if (!this.results.accessibility.isAccessible) {
        this.results.recommendations.push({
          category: 'Accessibility',
          priority: 'high',
          message: 'Fix accessibility issues to meet WCAG guidelines'
        })
      }
      
      if (this.results.accessibility.userPreferences?.reducedMotion) {
        this.results.recommendations.push({
          category: 'Accessibility',
          priority: 'medium',
          message: 'User prefers reduced motion - ensure animations are disabled'
        })
      }
    }

    // Performance recommendations
    if (this.results.performance) {
      if (!this.results.performance.isPerformant) {
        this.results.recommendations.push({
          category: 'Performance',
          priority: 'high',
          message: 'Optimize animations and reduce performance impact'
        })
      }
      
      if (this.results.performance.deviceInfo?.tier === 'low') {
        this.results.recommendations.push({
          category: 'Performance',
          priority: 'medium',
          message: 'Enable aggressive optimizations for low-end device'
        })
      }
      
      if (!this.results.performance.lowPowerReady) {
        this.results.recommendations.push({
          category: 'Performance',
          priority: 'medium',
          message: 'Implement adaptive performance for low-power devices'
        })
      }
    }
  }

  getResults() {
    this.calculateOverallScore()
    this.generateSummary()
    this.generateRecommendations()
    return this.results
  }
}

// Main test runner
export class FinalValidationRunner {
  constructor(config = TEST_CONFIG) {
    this.config = config
    this.aggregator = new TestResultAggregator()
  }

  async runAllTests() {
    console.log('🚀 Starting Final Validation Tests for Scroll Infinito Avançado')
    console.log('=' .repeat(60))

    try {
      // Run browser compatibility tests
      console.log('\n🌐 Running Browser Compatibility Tests...')
      const browserResults = await BrowserCompatibilityTests.runAllTests()
      this.aggregator.addBrowserResults(browserResults)
      
      if (browserResults.isCompatible) {
        console.log('✅ Browser compatibility: PASSED')
      } else {
        console.log('❌ Browser compatibility: FAILED')
      }

      // Run accessibility validation tests
      console.log('\n♿ Running Accessibility Validation Tests...')
      const accessibilityResults = await AccessibilityValidationTests.runAllTests()
      this.aggregator.addAccessibilityResults(accessibilityResults)
      
      if (accessibilityResults.isAccessible) {
        console.log('✅ Accessibility validation: PASSED')
      } else {
        console.log('❌ Accessibility validation: FAILED')
      }

      // Run performance validation tests
      console.log('\n⚡ Running Performance Validation Tests...')
      const performanceResults = await PerformanceValidationTests.runAllTests()
      this.aggregator.addPerformanceResults(performanceResults)
      
      if (performanceResults.isPerformant) {
        console.log('✅ Performance validation: PASSED')
      } else {
        console.log('❌ Performance validation: FAILED')
      }

      // Generate final results
      const finalResults = this.aggregator.getResults()
      
      console.log('\n' + '=' .repeat(60))
      console.log('📊 FINAL VALIDATION RESULTS')
      console.log('=' .repeat(60))
      
      this.printSummary(finalResults)
      
      return finalResults

    } catch (error) {
      console.error('💥 Final validation tests failed:', error)
      return {
        error: error.message,
        passed: false,
        readyForProduction: false
      }
    }
  }

  async runBrowserSpecificTests() {
    console.log('🌐 Running Browser-Specific Tests...')
    
    const browserResults = {}
    
    for (const browser of this.config.browsers) {
      console.log(`\nTesting ${browser.toUpperCase()}...`)
      try {
        const result = await BrowserCompatibilityTests.testBrowser(browser)
        browserResults[browser] = result
        
        if (result.skipped) {
          console.log(`⏭️ ${browser}: SKIPPED (${result.reason})`)
        } else if (result.isCompatible) {
          console.log(`✅ ${browser}: COMPATIBLE`)
        } else {
          console.log(`❌ ${browser}: INCOMPATIBLE`)
        }
      } catch (error) {
        console.error(`💥 ${browser}: ERROR - ${error.message}`)
        browserResults[browser] = { error: error.message }
      }
    }
    
    return browserResults
  }

  printSummary(results) {
    console.log(`Overall Score: ${results.overall.score.toFixed(1)}%`)
    console.log(`Status: ${results.overall.passed ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`Production Ready: ${results.overall.readyForProduction ? '✅ YES' : '❌ NO'}`)
    
    console.log('\nDetailed Results:')
    console.log(`├─ Browser Compatibility: ${results.summary.browserCompatibility.status} (${results.summary.browserCompatibility.score})`)
    console.log(`├─ Accessibility: ${results.summary.accessibility.status} (${results.summary.accessibility.score})`)
    console.log(`│  ├─ WCAG Compliant: ${results.summary.accessibility.wcagCompliant ? '✅' : '❌'}`)
    console.log(`│  └─ Reduced Motion: ${results.summary.accessibility.reducedMotionSupport ? '🎭 Active' : '🎬 Normal'}`)
    console.log(`└─ Performance: ${results.summary.performance.status} (${results.summary.performance.score})`)
    console.log(`   ├─ Low Power Ready: ${results.summary.performance.lowPowerReady ? '✅' : '❌'}`)
    console.log(`   └─ Device Tier: ${results.summary.performance.deviceTier.toUpperCase()}`)
    
    if (results.recommendations.length > 0) {
      console.log('\n🔧 Recommendations:')
      results.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢'
        console.log(`${index + 1}. ${priority} [${rec.category}] ${rec.message}`)
      })
    }
  }

  generateDetailedReport(results) {
    const report = {
      metadata: {
        testSuite: results.testSuite,
        timestamp: results.timestamp,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      summary: results.summary,
      overall: results.overall,
      recommendations: results.recommendations,
      detailedResults: {
        browserCompatibility: results.browserCompatibility,
        accessibility: results.accessibility,
        performance: results.performance
      }
    }

    return report
  }

  async exportResults(results, format = 'json') {
    const report = this.generateDetailedReport(results)
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `scroll-infinito-validation-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    return report
  }
}

// Convenience function to run all tests
export async function runFinalValidation() {
  const runner = new FinalValidationRunner()
  return await runner.runAllTests()
}

// Export for manual testing
export { TEST_CONFIG }