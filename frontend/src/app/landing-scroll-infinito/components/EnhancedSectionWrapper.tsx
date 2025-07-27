'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { useMicroInteractions } from '../hooks/useMicroInteractions'
import { useEnhancedTransitions } from '../hooks/useEnhancedTransitions'

/**
 * Enhanced Section Wrapper Component
 * Integrates micro-interactions and enhanced transitions for each section
 */

interface EnhancedSectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
}

export function EnhancedSectionWrapper({ id, children, className = '' }: EnhancedSectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const microInteractions = useMicroInteractions()
  const enhancedTransitions = useEnhancedTransitions()

  useEffect(() => {
    if (!sectionRef.current) return

    // Register section with enhanced transitions
    enhancedTransitions.registerSection(id, sectionRef.current)

    // Auto-enhance interactive elements within this section
    const enhanceElements = () => {
      if (!sectionRef.current) return

      // Enhance buttons
      const buttons = sectionRef.current.querySelectorAll('button, .btn, [role="button"], a[href]')
      buttons.forEach(button => {
        if (button instanceof HTMLElement) {
          const isPrimary = button.classList.contains('bg-gradient-to-r') || 
                           button.style.background.includes('gradient') ||
                           button.classList.contains('btn-primary')
          microInteractions.enhanceButton(button, isPrimary ? 'primary' : 'secondary')
        }
      })

      // Enhance cards
      const cards = sectionRef.current.querySelectorAll('.glass-card, .feature-card, .card')
      cards.forEach(card => {
        if (card instanceof HTMLElement) {
          let variant: 'feature' | 'testimonial' | 'pricing' = 'feature'
          
          if (id === 'testimonials') variant = 'testimonial'
          else if (id === 'pricing') variant = 'pricing'
          
          microInteractions.enhanceCard(card, variant)
        }
      })

      // Enhance titles and text
      const titles = sectionRef.current.querySelectorAll('h1, h2, h3, .title')
      titles.forEach(title => {
        if (title instanceof HTMLElement) {
          microInteractions.enhanceText(title, 'title')
        }
      })

      // Add special enhancements based on section type
      if (id === 'hero') {
        enhanceHeroSection()
      } else if (id === 'results') {
        enhanceResultsSection()
      } else if (id === 'cta') {
        enhanceCTASection()
      }
    }

    // Delay enhancement to ensure DOM is ready
    const timer = setTimeout(enhanceElements, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [id, microInteractions, enhancedTransitions])

  // Special enhancements for hero section
  const enhanceHeroSection = () => {
    if (!sectionRef.current) return

    const heroTitle = sectionRef.current.querySelector('.hero-title')
    if (heroTitle instanceof HTMLElement) {
      // Add magnetic effect to hero title
      let magneticTimeline: any = null

      heroTitle.addEventListener('mousemove', (event) => {
        const rect = heroTitle.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (event.clientX - centerX) * 0.02
        const deltaY = (event.clientY - centerY) * 0.02

        if (magneticTimeline) magneticTimeline.kill()
        
        const { gsap } = require('gsap')
        magneticTimeline = gsap.timeline()
        magneticTimeline.to(heroTitle, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      heroTitle.addEventListener('mouseleave', () => {
        if (magneticTimeline) magneticTimeline.kill()
        
        const { gsap } = require('gsap')
        magneticTimeline = gsap.timeline()
        magneticTimeline.to(heroTitle, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    }
  }

  // Special enhancements for results section
  const enhanceResultsSection = () => {
    if (!sectionRef.current) return

    const counterElements = sectionRef.current.querySelectorAll('.counter-element')
    counterElements.forEach(counter => {
      if (counter instanceof HTMLElement) {
        // Add pulsing effect to counters
        microInteractions.startPulseAnimation(counter)
        
        // Add hover effect
        counter.addEventListener('mouseenter', () => {
          const { gsap } = require('gsap')
          gsap.to(counter, {
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.7)'
          })
        })

        counter.addEventListener('mouseleave', () => {
          const { gsap } = require('gsap')
          gsap.to(counter, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })
  }

  // Special enhancements for CTA section
  const enhanceCTASection = () => {
    if (!sectionRef.current) return

    const ctaButton = sectionRef.current.querySelector('a[href="/onboarding/perfil"]')
    if (ctaButton instanceof HTMLElement) {
      // Add continuous pulse animation
      ctaButton.classList.add('cta-button')
      
      // Add enhanced click effect
      ctaButton.addEventListener('click', (event) => {
        microInteractions.createRippleEffect(ctaButton, event as MouseEvent)
        
        // Add success feedback
        const originalText = ctaButton.textContent
        ctaButton.textContent = 'Redirecionando...'
        
        setTimeout(() => {
          if (ctaButton.textContent === 'Redirecionando...') {
            ctaButton.textContent = originalText
          }
        }, 2000)
      })
    }

    // Enhance trust indicators
    const trustIndicators = sectionRef.current.querySelectorAll('.grid > div')
    trustIndicators.forEach((indicator, index) => {
      if (indicator instanceof HTMLElement) {
        // Add staggered hover effects
        indicator.addEventListener('mouseenter', () => {
          const { gsap } = require('gsap')
          gsap.to(indicator, {
            y: -5,
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(1.7)',
            delay: index * 0.05
          })
        })

        indicator.addEventListener('mouseleave', () => {
          const { gsap } = require('gsap')
          gsap.to(indicator, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      }
    })
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section-wrapper ${className}`}
      data-section={id}
    >
      {children}
    </section>
  )
}