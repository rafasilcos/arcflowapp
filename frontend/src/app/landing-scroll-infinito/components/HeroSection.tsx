'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

export function HeroSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const [titleChars, setTitleChars] = useState<string[]>([])
  const [gsapAvailable, setGsapAvailable] = useState(true)
  const [hasReducedMotion, setHasReducedMotion] = useState(false)
  
  const { sectionRef } = useSectionAnimation({
    sectionId: 'hero',
    sectionIndex: 0,
    startProgress: 0,
    endProgress: 0.125,
    onRegister
  })

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setHasReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setHasReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Split title into individual characters for animation
  useEffect(() => {
    const title = 'ARCFLOW'
    setTitleChars(title.split(''))
  }, [])

  // Enhanced CSS Fallback animation function
  const applyCSSFallback = useCallback(() => {
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return

    const chars = titleRef.current.querySelectorAll('.char')
    
    // Apply enhanced CSS-based animations with letter-by-letter effect
    chars.forEach((char, index) => {
      const element = char as HTMLElement
      element.classList.add('hero-char-fallback')
      element.style.animationDelay = `${index * 0.12}s`
    })

    subtitleRef.current.classList.add('hero-subtitle-fallback')
    ctaRef.current.classList.add('hero-cta-fallback')

    console.log('🎨 Enhanced CSS fallback animations applied with letter-by-letter effect')
  }, [])

  // Enhanced GSAP dissolution animation with letter-by-letter effect
  useEffect(() => {
    if (typeof window === 'undefined' || !titleRef.current || titleChars.length === 0) return
    if (hasReducedMotion) {
      applyCSSFallback()
      return
    }

    const chars = titleRef.current.querySelectorAll('.char')
    const subtitle = subtitleRef.current
    const cta = ctaRef.current
    
    if (chars.length === 0 || !subtitle || !cta) return

    try {
      // Set initial state - letters start invisible for entrance animation
      gsap.set(chars, { 
        opacity: 0, 
        y: -150, 
        scale: 0.3, 
        rotationX: -90,
        rotationZ: 0,
        transformOrigin: 'center center',
        filter: 'blur(20px)'
      })
      gsap.set([subtitle, cta], { opacity: 0, y: 100, scale: 0.8, filter: 'blur(10px)' })

      // Create enhanced dissolution timeline with letter-by-letter animation
      const dissolutionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-infinite-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress
            
            // Hero section is active from 0% to 12.5%
            if (progress >= 0 && progress <= 0.125) {
              const sectionProgress = progress / 0.125
              
              if (sectionProgress <= 0.5) {
                // First 50% - letter-by-letter entrance animation
                const entranceProgress = sectionProgress / 0.5
                
                chars.forEach((char, index) => {
                  // Staggered delay for each letter
                  const letterDelay = index * 0.12
                  const charProgress = Math.max(0, Math.min(1, (entranceProgress - letterDelay) / (1 - letterDelay)))
                  
                  // Smooth easing for each letter
                  const easedProgress = charProgress < 0.5 
                    ? 2 * charProgress * charProgress 
                    : 1 - Math.pow(-2 * charProgress + 2, 3) / 2
                  
                  gsap.set(char, {
                    opacity: easedProgress,
                    y: (1 - easedProgress) * -150,
                    scale: 0.3 + (easedProgress * 0.7),
                    rotationX: (1 - easedProgress) * -90,
                    rotationZ: (1 - easedProgress) * (index % 2 === 0 ? 15 : -15),
                    filter: `blur(${(1 - easedProgress) * 20}px)`
                  })
                })

                // Animate subtitle and CTA with delay
                const subtitleProgress = Math.max(0, entranceProgress - 0.4)
                gsap.set(subtitle, {
                  opacity: subtitleProgress * 0.8,
                  y: (1 - subtitleProgress) * 100,
                  scale: 0.8 + (subtitleProgress * 0.2),
                  filter: `blur(${(1 - subtitleProgress) * 10}px)`
                })
                
                const ctaProgress = Math.max(0, entranceProgress - 0.6)
                gsap.set(cta, {
                  opacity: ctaProgress * 0.9,
                  y: (1 - ctaProgress) * 80,
                  scale: 0.8 + (ctaProgress * 0.2),
                  filter: `blur(${(1 - ctaProgress) * 8}px)`
                })
                
              } else if (sectionProgress <= 0.65) {
                // Middle 15% - fully visible with subtle breathing effect
                const breathingEffect = Math.sin(Date.now() * 0.002) * 0.02
                gsap.set(chars, { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 + breathingEffect, 
                  rotationX: 0,
                  rotationZ: 0,
                  filter: 'blur(0px)'
                })
                gsap.set(subtitle, { opacity: 0.8, y: 0, scale: 1, filter: 'blur(0px)' })
                gsap.set(cta, { opacity: 0.9, y: 0, scale: 1, filter: 'blur(0px)' })
                
              } else {
                // Last 35% - enhanced dissolution animation letter by letter
                const dissolutionProgress = (sectionProgress - 0.65) / 0.35
                
                chars.forEach((char, index) => {
                  // Reverse staggered delay for dissolution
                  const letterDelay = (titleChars.length - 1 - index) * 0.1
                  const charProgress = Math.max(0, Math.min(1, (dissolutionProgress - letterDelay) / (1 - letterDelay)))
                  
                  // Multiple dissolution effects
                  const randomFactor = (index % 3 === 0 ? 1 : index % 3 === 1 ? -1 : 0.5)
                  const spiralEffect = charProgress * Math.sin(charProgress * Math.PI * 2) * 50
                  
                  gsap.set(char, {
                    opacity: Math.max(0, 1 - charProgress * 1.5),
                    y: -charProgress * 400 + spiralEffect,
                    x: charProgress * randomFactor * 200,
                    scale: 1 + charProgress * 3,
                    rotationX: charProgress * 180,
                    rotationZ: charProgress * randomFactor * 120,
                    filter: `blur(${charProgress * 15}px) brightness(${1 + charProgress * 2})`,
                    transformOrigin: '50% 50%'
                  })
                })

                // Dramatic fade out for subtitle and CTA
                gsap.set(subtitle, {
                  opacity: Math.max(0, 0.8 - dissolutionProgress * 2),
                  y: -dissolutionProgress * 150,
                  scale: 1 - dissolutionProgress * 0.5,
                  rotationX: dissolutionProgress * 45,
                  filter: `blur(${dissolutionProgress * 8}px)`
                })
                
                gsap.set(cta, {
                  opacity: Math.max(0, 0.9 - dissolutionProgress * 2.5),
                  y: -dissolutionProgress * 120,
                  scale: 1 - dissolutionProgress * 0.4,
                  rotationY: dissolutionProgress * 90,
                  filter: `blur(${dissolutionProgress * 6}px)`
                })
              }
            } else {
              // Section is not active - hide all elements
              gsap.set(chars, { opacity: 0, filter: 'blur(0px)', x: 0, rotationX: 0, rotationZ: 0 })
              gsap.set([subtitle, cta], { opacity: 0, filter: 'blur(0px)', rotationX: 0, rotationY: 0 })
            }
          }
        }
      })

      console.log('🎭 Enhanced Hero letter-by-letter dissolution animation initialized')

      return () => {
        dissolutionTimeline.kill()
      }
      
    } catch (error) {
      console.warn('⚠️ GSAP animation failed, falling back to CSS:', error)
      setGsapAvailable(false)
      applyCSSFallback()
    }
  }, [titleChars, hasReducedMotion, applyCSSFallback])

  return (
    <>
      {/* Enhanced CSS Fallback Styles with Letter-by-Letter Animation */}
      <style jsx>{`
        @keyframes heroCharEntrance {
          0% {
            opacity: 0;
            transform: translateY(-150px) scale(0.3) rotateX(-90deg) rotateZ(15deg);
            filter: blur(20px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-50px) scale(0.6) rotateX(-30deg) rotateZ(5deg);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
            filter: blur(0px);
          }
        }
        
        @keyframes heroCharDissolution {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1) rotateX(0deg) rotateZ(0deg);
            filter: blur(0px) brightness(1);
          }
          25% {
            opacity: 0.8;
            transform: translateY(-100px) translateX(50px) scale(1.5) rotateX(45deg) rotateZ(30deg);
            filter: blur(3px) brightness(1.2);
          }
          75% {
            opacity: 0.3;
            transform: translateY(-300px) translateX(150px) scale(2.5) rotateX(135deg) rotateZ(90deg);
            filter: blur(10px) brightness(1.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-400px) translateX(200px) scale(3) rotateX(180deg) rotateZ(120deg);
            filter: blur(15px) brightness(2);
          }
        }
        
        @keyframes heroFadeIn {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
            filter: blur(10px);
          }
          100% {
            opacity: 0.8;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes heroCtaFadeIn {
          0% {
            opacity: 0;
            transform: translateY(80px) scale(0.8);
            filter: blur(8px);
          }
          100% {
            opacity: 0.9;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes heroBreathing {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        
        .hero-char-fallback {
          display: inline-block;
          transform-origin: center center;
          animation: heroCharEntrance 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
        }
        
        .hero-char-fallback:nth-child(1) { animation-delay: 0s; }
        .hero-char-fallback:nth-child(2) { animation-delay: 0.12s; }
        .hero-char-fallback:nth-child(3) { animation-delay: 0.24s; }
        .hero-char-fallback:nth-child(4) { animation-delay: 0.36s; }
        .hero-char-fallback:nth-child(5) { animation-delay: 0.48s; }
        .hero-char-fallback:nth-child(6) { animation-delay: 0.6s; }
        .hero-char-fallback:nth-child(7) { animation-delay: 0.72s; }
        
        .hero-char-breathing {
          animation: heroBreathing 3s ease-in-out infinite;
        }
        
        .hero-subtitle-fallback {
          animation: heroFadeIn 1.5s ease-out 0.8s both;
        }
        
        .hero-cta-fallback {
          animation: heroCtaFadeIn 1.5s ease-out 1.2s both;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .hero-char-fallback,
          .hero-char-breathing,
          .hero-subtitle-fallback,
          .hero-cta-fallback {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
        
        /* Performance optimizations */
        .hero-char-fallback,
        .hero-subtitle-fallback,
        .hero-cta-fallback {
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>

      <div 
        ref={sectionRef}
        id="hero-section"
        className="absolute inset-0 flex items-center justify-center text-center"
        style={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto px-8">
          <h1 
            ref={titleRef}
            className="hero-title text-white font-black tracking-tight mb-8"
            style={{
              fontSize: 'clamp(4rem, 15vw, 12rem)',
              lineHeight: '0.9',
              fontFamily: '"Outfit", sans-serif',
              willChange: gsapAvailable ? 'transform, opacity, filter' : 'auto'
            }}
          >
            {titleChars.map((char, index) => (
              <span 
                key={index}
                className={`char inline-block ${!gsapAvailable ? 'hero-char-fallback' : ''}`}
                style={{ 
                  transformOrigin: 'center center',
                  display: 'inline-block',
                  willChange: gsapAvailable ? 'transform, opacity, filter' : 'auto'
                }}
              >
                {char}
              </span>
            ))}
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto"
            style={{
              willChange: gsapAvailable ? 'transform, opacity, filter' : 'auto'
            }}
          >
            A plataforma SaaS definitiva para escritórios AEC
          </p>
          
          <a 
            ref={ctaRef}
            href="/onboarding/perfil"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
            style={{
              willChange: gsapAvailable ? 'transform, opacity, filter' : 'auto'
            }}
          >
            Começar Agora
          </a>
        </div>
      </div>
    </>
  )
}