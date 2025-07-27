'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface AnimationConfig {
  duration: number
  ease: string
  stagger?: number
  delay?: number
}

export interface SectionAnimationProps {
  sectionId: string
  sectionIndex: number
  startProgress: number
  endProgress: number
  onRegister?: (id: string, element: HTMLElement) => void
}

export function useSectionAnimation({
  sectionId,
  sectionIndex,
  startProgress,
  endProgress,
  onRegister
}: SectionAnimationProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const isInitializedRef = useRef(false)

  // Animation configurations for different section types
  const getAnimationConfig = useCallback((sectionId: string): AnimationConfig => {
    const configs: Record<string, AnimationConfig> = {
      hero: { duration: 0.8, ease: 'power2.inOut' },
      about: { duration: 1.0, ease: 'power2.out', stagger: 0.1 },
      features: { duration: 1.2, ease: 'power2.out', stagger: 0.15 },
      results: { duration: 1.0, ease: 'power3.out', stagger: 0.2 },
      testimonials: { duration: 0.9, ease: 'power2.inOut', stagger: 0.1 },
      pricing: { duration: 1.1, ease: 'back.out(1.7)', stagger: 0.1 },
      faq: { duration: 0.8, ease: 'power2.out', stagger: 0.05 },
      cta: { duration: 1.5, ease: 'power3.out' }
    }
    return configs[sectionId] || { duration: 1.0, ease: 'power2.out' }
  }, [])

  // Create enter animation based on section type
  const createEnterAnimation = useCallback((timeline: gsap.core.Timeline, element: HTMLElement) => {
    const config = getAnimationConfig(sectionId)
    
    switch (sectionId) {
      case 'hero':
        // Hero: Simple fade in, title is always visible initially
        timeline.fromTo(element, 
          { opacity: 1, scale: 1 },
          { opacity: 1, scale: 1, duration: config.duration, ease: config.ease }
        )
        break

      case 'about':
        // About: Fade in with scale from small
        timeline.fromTo(element,
          { opacity: 0, scale: 0.8, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: config.duration, ease: config.ease }
        )
        break

      case 'features':
        // Features: First animate the header sliding up
        const featuresHeader = element.querySelector('.features-header')
        if (featuresHeader) {
          timeline.fromTo(featuresHeader,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: config.duration * 0.6, ease: config.ease }
          )
        }
        
        // Then animate feature cards with enhanced stagger effect
        const featureCards = element.querySelectorAll('.feature-card')
        if (featureCards.length > 0) {
          timeline.fromTo(featureCards,
            { 
              opacity: 0, 
              y: 100, 
              scale: 0.8,
              rotationY: 15
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotationY: 0,
              duration: config.duration * 0.9,
              stagger: {
                amount: (config.stagger ?? 0.15) * 2,
                from: "start",
                ease: "power2.out"
              },
              ease: config.ease 
            }, '-=0.3'
          )
          
          // Add subtle hover-ready state
          timeline.set(featureCards, {
            transformOrigin: "center center"
          })
        }
        
        // Animate bottom CTA hint
        const ctaHint = element.querySelector('.text-center.mt-16')
        if (ctaHint) {
          timeline.fromTo(ctaHint,
            { opacity: 0, y: 30 },
            { opacity: 0.7, y: 0, duration: config.duration * 0.4, ease: config.ease },
            '-=0.2'
          )
        }
        break

      case 'results':
        // Results: Dramatic fade in with scale
        timeline.fromTo(element,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: config.duration, ease: config.ease }
        )
        
        // Animate metric cards
        const metricCards = element.querySelectorAll('.metric-card')
        if (metricCards.length > 0) {
          timeline.fromTo(metricCards,
            { opacity: 0, scale: 0.8, rotationY: 45 },
            { 
              opacity: 1, 
              scale: 1, 
              rotationY: 0,
              duration: config.duration * 0.7,
              stagger: config.stagger,
              ease: config.ease 
            }, '-=0.3'
          )
        }
        break

      case 'testimonials':
        // Testimonials: Slide in from left with stagger
        const testimonialsHeader = element.querySelector('.testimonials-header')
        const testimonialsStats = element.querySelector('.testimonials-stats')
        const testimonialsCards = element.querySelector('.testimonials-cards')
        const statItems = element.querySelectorAll('.stat-item')
        const testimonialCards = element.querySelectorAll('.testimonial-card')
        
        // Header slides in from left
        if (testimonialsHeader) {
          timeline.fromTo(testimonialsHeader,
            { opacity: 0, x: -80, y: 20 },
            { opacity: 1, x: 0, y: 0, duration: config.duration * 0.8, ease: config.ease }
          )
        }
        
        // Stats slide in with stagger
        if (statItems.length > 0) {
          timeline.fromTo(statItems,
            { opacity: 0, x: -60, scale: 0.8 },
            { 
              opacity: 1, 
              x: 0, 
              scale: 1,
              duration: config.duration * 0.7,
              stagger: config.stagger || 0.1,
              ease: config.ease 
            }, '-=0.4'
          )
        }
        
        // Testimonial cards slide in from left with enhanced stagger
        if (testimonialCards.length > 0) {
          timeline.fromTo(testimonialCards,
            { 
              opacity: 0, 
              x: -120, 
              y: 30,
              scale: 0.9,
              rotationY: -15
            },
            { 
              opacity: 1, 
              x: 0, 
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: config.duration,
              stagger: {
                amount: (config.stagger || 0.1) * 3,
                from: "start",
                ease: "power2.out"
              },
              ease: config.ease 
            }, '-=0.3'
          )
          
          // Add subtle floating animation during visibility
          timeline.to(testimonialCards, {
            y: -5,
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: {
              amount: 0.5,
              from: "random"
            }
          }, '-=0.2')
        }
        
        // Rotation indicators fade in
        const indicators = element.querySelector('.flex.justify-center.mt-12')
        if (indicators) {
          timeline.fromTo(indicators,
            { opacity: 0, y: 20 },
            { opacity: 0.8, y: 0, duration: config.duration * 0.5, ease: config.ease },
            '-=0.2'
          )
        }
        break

      case 'pricing':
        // Pricing: Enhanced flip in effect with card-specific animations
        const pricingHeader = element.querySelector('.pricing-header')
        const pricingCards = element.querySelectorAll('.pricing-card')
        const professionalCard = element.querySelector('.pricing-card.professional')
        const bottomCta = element.querySelector('.pricing-bottom-cta')
        
        // Header slides in from top
        if (pricingHeader) {
          timeline.fromTo(pricingHeader,
            { opacity: 0, y: -60, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: config.duration * 0.7, ease: config.ease }
          )
        }
        
        // Cards flip in with enhanced stagger
        if (pricingCards.length > 0) {
          timeline.fromTo(pricingCards,
            { 
              opacity: 0, 
              rotationY: 90, 
              scale: 0.8,
              z: -100,
              transformOrigin: "center center"
            },
            { 
              opacity: 1, 
              rotationY: 0, 
              scale: 1,
              z: 0,
              duration: config.duration,
              stagger: {
                amount: (config.stagger ?? 0.1) * 2,
                from: "center",
                ease: "back.out(1.7)"
              },
              ease: config.ease 
            }, '-=0.3'
          )
          
          // Special highlight animation for Professional plan
          if (professionalCard) {
            timeline.to(professionalCard, {
              scale: 1.05,
              y: -10,
              boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
              duration: 0.6,
              ease: "back.out(1.7)",
              repeat: 1,
              yoyo: true
            }, '-=0.2')
          }
        }
        
        // Bottom CTA fades in
        if (bottomCta) {
          timeline.fromTo(bottomCta,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: config.duration * 0.6, ease: config.ease },
            '-=0.4'
          )
        }
        break

      case 'faq':
        // FAQ: Accordion effect de entrada
        const faqHeader = element.querySelector('.faq-header')
        const faqItems = element.querySelectorAll('.faq-item')
        const faqCta = element.querySelector('.faq-cta')
        
        // Header slides down with accordion effect
        if (faqHeader) {
          timeline.fromTo(faqHeader,
            { 
              opacity: 0, 
              scaleY: 0.3, 
              y: -30,
              transformOrigin: 'top center' 
            },
            { 
              opacity: 1, 
              scaleY: 1, 
              y: 0,
              duration: config.duration * 0.8, 
              ease: config.ease 
            }
          )
        }
        
        // FAQ items accordion in with stagger
        if (faqItems.length > 0) {
          timeline.fromTo(faqItems,
            { 
              opacity: 0, 
              scaleY: 0.2, 
              y: 20,
              transformOrigin: 'top center' 
            },
            { 
              opacity: 1, 
              scaleY: 1, 
              y: 0,
              duration: config.duration,
              stagger: {
                amount: (config.stagger ?? 0.05) * faqItems.length,
                from: "start",
                ease: "power2.out"
              },
              ease: config.ease 
            }, '-=0.4'
          )
          
          // Add subtle hover-ready state for interactivity
          timeline.set(faqItems, {
            transformOrigin: "center center"
          })
        }
        
        // CTA section fades in last
        if (faqCta) {
          timeline.fromTo(faqCta,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: config.duration * 0.6, ease: config.ease },
            '-=0.2'
          )
        }
        break

      case 'cta':
        // CTA: Implementação completa com zoom dramático e animações sequenciais
        const ctaMainContainer = element.querySelector('.cta-main-container')
        const ctaTitle = element.querySelector('.cta-title')
        const ctaSubtitle = element.querySelector('.cta-subtitle')
        const ctaButtons = element.querySelector('.cta-buttons')
        const ctaTrustMetrics = element.querySelector('.cta-trust-metrics')
        const trustMetrics = element.querySelectorAll('.trust-metric')
        const ctaPrimaryButton = element.querySelector('.cta-primary-button')
        const ctaGuarantee = element.querySelector('.cta-guarantee')
        
        // Fase 1: Zoom in dramático de entrada (87.5-90%)
        if (ctaMainContainer) {
          timeline.fromTo(ctaMainContainer,
            { 
              opacity: 0, 
              scale: 3,
              rotationY: 45,
              z: -200,
              transformOrigin: 'center center'
            },
            { 
              opacity: 1, 
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: config.duration * 0.4,
              ease: 'power3.out'
            }
          )
        }
        
        // Fase 2: Animação sequencial dos elementos internos (90-95%)
        // Título aparece com efeito de escala
        if (ctaTitle) {
          timeline.fromTo(ctaTitle,
            { 
              opacity: 0, 
              scale: 0.5,
              y: 30
            },
            { 
              opacity: 1, 
              scale: 1,
              y: 0,
              duration: config.duration * 0.3,
              ease: 'back.out(1.7)'
            }, '-=0.2'
          )
        }
        
        // Subtítulo desliza para cima
        if (ctaSubtitle) {
          timeline.fromTo(ctaSubtitle,
            { 
              opacity: 0, 
              y: 40,
              scale: 0.9
            },
            { 
              opacity: 1, 
              y: 0,
              scale: 1,
              duration: config.duration * 0.25,
              ease: config.ease
            }, '-=0.1'
          )
        }
        
        // Botões aparecem com bounce
        if (ctaButtons) {
          timeline.fromTo(ctaButtons,
            { 
              opacity: 0, 
              scale: 0.8,
              y: 30
            },
            { 
              opacity: 1, 
              scale: 1,
              y: 0,
              duration: config.duration * 0.3,
              ease: 'back.out(1.7)'
            }, '-=0.05'
          )
        }
        
        // Fase 3: Animação dos elementos de confiança com stagger (90-95%)
        if (trustMetrics.length > 0) {
          timeline.fromTo(trustMetrics,
            { 
              opacity: 0, 
              scale: 0.6,
              y: 50,
              rotationX: 45
            },
            { 
              opacity: 1, 
              scale: 1,
              y: 0,
              rotationX: 0,
              duration: config.duration * 0.4,
              stagger: {
                amount: 0.3,
                from: "start",
                ease: "power2.out"
              },
              ease: 'back.out(1.7)'
            }, '-=0.1'
          )
          
          // Animação contínua de pulsação nas métricas
          timeline.to(trustMetrics, {
            scale: 1.05,
            duration: 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: {
              amount: 0.5,
              from: "random"
            }
          }, '-=0.2')
        }
        
        // Garantia aparece por último
        if (ctaGuarantee) {
          timeline.fromTo(ctaGuarantee,
            { 
              opacity: 0, 
              scale: 0.8,
              y: 20
            },
            { 
              opacity: 1, 
              scale: 1,
              y: 0,
              duration: config.duration * 0.25,
              ease: 'back.out(1.7)'
            }, '-=0.05'
          )
        }
        
        // Fase 4: Call to action pulsante contínuo (95-100%)
        if (ctaPrimaryButton) {
          timeline.to(ctaPrimaryButton, {
            scale: 1.1,
            boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.6)",
            duration: 1.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.5
          }, '-=0.1')
          
          // Efeito de brilho pulsante
          timeline.to(ctaPrimaryButton, {
            filter: "brightness(1.2)",
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.3
          }, '-=1')
        }
        break

      default:
        // Default: Simple fade in
        timeline.fromTo(element,
          { opacity: 0 },
          { opacity: 1, duration: config.duration, ease: config.ease }
        )
    }
  }, [sectionId, getAnimationConfig])

  // Create exit animation based on section type
  const createExitAnimation = useCallback((timeline: gsap.core.Timeline, element: HTMLElement) => {
    const config = getAnimationConfig(sectionId)
    
    switch (sectionId) {
      case 'hero':
        // Hero: Dissolve with scale up
        timeline.to(element, {
          opacity: 0,
          scale: 2,
          y: -100,
          duration: config.duration,
          ease: config.ease
        })
        break

      case 'about':
        // About: Scale down and fade
        timeline.to(element, {
          opacity: 0,
          scale: 0.8,
          y: -50,
          duration: config.duration * 0.8,
          ease: config.ease
        })
        break

      case 'features':
        // Features: Scale down uniform
        timeline.to(element, {
          opacity: 0,
          scale: 0.9,
          duration: config.duration * 0.6,
          ease: config.ease
        })
        break

      case 'results':
        // Results: Zoom out effect
        timeline.to(element, {
          opacity: 0,
          scale: 1.2,
          duration: config.duration * 0.7,
          ease: config.ease
        })
        break

      case 'testimonials':
        // Testimonials: Fade out lateral (slide out to right with stagger)
        const testimonialsCardsExit = element.querySelectorAll('.testimonial-card')
        const testimonialsHeaderExit = element.querySelector('.testimonials-header')
        const testimonialsStatsExit = element.querySelector('.testimonials-stats')
        const indicatorsExit = element.querySelector('.flex.justify-center.mt-12')
        
        // Cards slide out to right with stagger
        if (testimonialsCardsExit.length > 0) {
          timeline.to(testimonialsCardsExit, {
            opacity: 0,
            x: 120,
            y: -20,
            scale: 0.9,
            rotationY: 15,
            duration: config.duration * 0.8,
            stagger: {
              amount: (config.stagger || 0.1) * 2,
              from: "end",
              ease: "power2.in"
            },
            ease: config.ease
          })
        }
        
        // Header slides out to right
        if (testimonialsHeaderExit) {
          timeline.to(testimonialsHeaderExit, {
            opacity: 0,
            x: 80,
            y: -10,
            duration: config.duration * 0.6,
            ease: config.ease
          }, '-=0.4')
        }
        
        // Stats slide out to right
        if (testimonialsStatsExit) {
          timeline.to(testimonialsStatsExit, {
            opacity: 0,
            x: 60,
            scale: 0.8,
            duration: config.duration * 0.5,
            ease: config.ease
          }, '-=0.3')
        }
        
        // Indicators fade out
        if (indicatorsExit) {
          timeline.to(indicatorsExit, {
            opacity: 0,
            y: 10,
            duration: config.duration * 0.4,
            ease: config.ease
          }, '-=0.2')
        }
        break

      case 'pricing':
        // Pricing: Scale down uniform na saída
        const pricingCardsExit = element.querySelectorAll('.pricing-card')
        const pricingHeaderExit = element.querySelector('.pricing-header')
        const bottomCtaExit = element.querySelector('.pricing-bottom-cta')
        
        // All elements scale down uniformly
        timeline.to([pricingHeaderExit, pricingCardsExit, bottomCtaExit], {
          opacity: 0,
          scale: 0.85,
          y: 30,
          duration: config.duration * 0.8,
          stagger: {
            amount: 0.1,
            from: "start"
          },
          ease: config.ease
        })
        break

      case 'faq':
        // FAQ: Collapse effect na saída
        const faqItemsExit = element.querySelectorAll('.faq-item')
        const faqHeaderExit = element.querySelector('.faq-header')
        const faqCtaExit = element.querySelector('.faq-cta')
        
        // FAQ items collapse with reverse stagger
        if (faqItemsExit.length > 0) {
          timeline.to(faqItemsExit, {
            opacity: 0,
            scaleY: 0.1,
            y: -10,
            transformOrigin: 'bottom center',
            duration: config.duration * 0.7,
            stagger: {
              amount: (config.stagger ?? 0.05) * faqItemsExit.length,
              from: "end",
              ease: "power2.in"
            },
            ease: config.ease
          })
        }
        
        // Header collapses
        if (faqHeaderExit) {
          timeline.to(faqHeaderExit, {
            opacity: 0,
            scaleY: 0.2,
            y: -20,
            transformOrigin: 'bottom center',
            duration: config.duration * 0.5,
            ease: config.ease
          }, '-=0.3')
        }
        
        // CTA collapses last
        if (faqCtaExit) {
          timeline.to(faqCtaExit, {
            opacity: 0,
            scaleY: 0.1,
            y: -15,
            transformOrigin: 'bottom center',
            duration: config.duration * 0.4,
            ease: config.ease
          }, '-=0.2')
        }
        break

      case 'cta':
        // CTA: No exit (final section)
        break

      default:
        // Default: Simple fade out
        timeline.to(element, {
          opacity: 0,
          duration: config.duration * 0.8,
          ease: config.ease
        })
    }
  }, [sectionId, getAnimationConfig])

  // Initialize section animation
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || isInitializedRef.current) return

    const element = sectionRef.current
    
    // Register section with parent controller
    if (onRegister) {
      onRegister(sectionId, element)
    }

    // Set initial state - all sections start invisible except hero
    if (sectionId !== 'hero') {
      gsap.set(element, { opacity: 0 })
    }

    // Create section timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-infinite-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const sectionStart = startProgress
          const sectionEnd = endProgress
          
          // Calculate if this section should be visible
          if (progress >= sectionStart && progress <= sectionEnd) {
            // Section is in view range
            const sectionProgress = (progress - sectionStart) / (sectionEnd - sectionStart)
            
            // Show section if not already visible
            if (element.style.opacity === '0' || !element.style.opacity) {
              gsap.set(element, { opacity: 1 })
            }
          } else {
            // Section is out of view range
            if (element.style.opacity !== '0') {
              gsap.set(element, { opacity: 0 })
            }
          }
        }
      }
    })

    // Create enter and exit animations
    const enterStart = startProgress
    const enterEnd = startProgress + (endProgress - startProgress) * 0.3
    const exitStart = startProgress + (endProgress - startProgress) * 0.7
    const exitEnd = endProgress

    // Add enter animation
    timeline.add(() => {
      createEnterAnimation(timeline, element)
    }, enterStart)

    // Add exit animation (except for CTA which is final)
    if (sectionId !== 'cta') {
      timeline.add(() => {
        createExitAnimation(timeline, element)
      }, exitStart)
    }

    timelineRef.current = timeline
    isInitializedRef.current = true

    console.log(`🎬 Animation initialized for section: ${sectionId}`)

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [sectionId, startProgress, endProgress, onRegister, createEnterAnimation, createExitAnimation])

  return {
    sectionRef,
    timeline: timelineRef.current
  }
}