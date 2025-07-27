'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function AboutSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitle1Ref = useRef<HTMLParagraphElement>(null)
  const subtitle2Ref = useRef<HTMLParagraphElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    const section = sectionRef.current
    const container = containerRef.current
    const badge = badgeRef.current
    const title = titleRef.current
    const subtitle1 = subtitle1Ref.current
    const subtitle2 = subtitle2Ref.current
    const metrics = metricsRef.current

    // Register section with parent controller
    if (onRegister) {
      onRegister('about', section)
    }

    // Set initial states - everything invisible
    gsap.set(section, { opacity: 0 })
    gsap.set(container, { opacity: 0, scale: 0.8, y: 50 })
    gsap.set([badge, title, subtitle1, subtitle2], { opacity: 0, y: 30 })
    gsap.set(metrics, { opacity: 0, y: 40 })

    // Create main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-infinite-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const sectionStart = 0.125  // 12.5%
          const sectionEnd = 0.25     // 25%
          
          if (progress >= sectionStart && progress <= sectionEnd) {
            // Calculate section progress (0 to 1)
            const sectionProgress = (progress - sectionStart) / (sectionEnd - sectionStart)
            
            // Show section
            gsap.set(section, { opacity: 1 })
            
            // Phase 1: Fade in container (12.5% - 15% = 0 - 0.2 section progress)
            if (sectionProgress <= 0.2) {
              const fadeProgress = sectionProgress / 0.2
              gsap.set(container, {
                opacity: fadeProgress,
                scale: 0.8 + (0.2 * fadeProgress),
                y: 50 - (50 * fadeProgress)
              })
            }
            
            // Phase 2: Animate internal elements with stagger (15% - 20% = 0.2 - 0.6 section progress)
            else if (sectionProgress <= 0.6) {
              // Container fully visible
              gsap.set(container, { opacity: 1, scale: 1, y: 0 })
              
              const staggerProgress = (sectionProgress - 0.2) / 0.4
              
              // Badge animation (first)
              if (staggerProgress >= 0) {
                const badgeProgress = Math.min(staggerProgress / 0.2, 1)
                gsap.set(badge, {
                  opacity: badgeProgress,
                  y: 30 - (30 * badgeProgress)
                })
              }
              
              // Title animation (second)
              if (staggerProgress >= 0.2) {
                const titleProgress = Math.min((staggerProgress - 0.2) / 0.2, 1)
                gsap.set(title, {
                  opacity: titleProgress,
                  y: 30 - (30 * titleProgress)
                })
              }
              
              // Subtitle 1 animation (third)
              if (staggerProgress >= 0.4) {
                const sub1Progress = Math.min((staggerProgress - 0.4) / 0.2, 1)
                gsap.set(subtitle1, {
                  opacity: sub1Progress,
                  y: 30 - (30 * sub1Progress)
                })
              }
              
              // Subtitle 2 animation (fourth)
              if (staggerProgress >= 0.6) {
                const sub2Progress = Math.min((staggerProgress - 0.6) / 0.2, 1)
                gsap.set(subtitle2, {
                  opacity: sub2Progress,
                  y: 30 - (30 * sub2Progress)
                })
              }
              
              // Metrics animation (last)
              if (staggerProgress >= 0.8) {
                const metricsProgress = Math.min((staggerProgress - 0.8) / 0.2, 1)
                gsap.set(metrics, {
                  opacity: metricsProgress,
                  y: 40 - (40 * metricsProgress)
                })
              }
            }
            
            // Phase 3: Section fully visible (20% - 22.5% = 0.6 - 0.8 section progress)
            else if (sectionProgress <= 0.8) {
              // All elements fully visible
              gsap.set(container, { opacity: 1, scale: 1, y: 0 })
              gsap.set([badge, title, subtitle1, subtitle2], { opacity: 1, y: 0 })
              gsap.set(metrics, { opacity: 1, y: 0 })
            }
            
            // Phase 4: Fade out preparing next section (22.5% - 25% = 0.8 - 1.0 section progress)
            else {
              const fadeOutProgress = (sectionProgress - 0.8) / 0.2
              const fadeOpacity = 1 - fadeOutProgress
              
              gsap.set(container, {
                opacity: fadeOpacity,
                scale: 1 - (0.2 * fadeOutProgress),
                y: -50 * fadeOutProgress
              })
            }
          } else {
            // Section out of range - hide completely
            gsap.set(section, { opacity: 0 })
          }
        }
      }
    })

    timelineRef.current = tl

    console.log('🎬 About Section animation initialized with enhanced stagger effects')

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [onRegister])

  return (
    <div 
      ref={sectionRef}
      id="about-section"
      className="absolute inset-0 flex items-center justify-center text-center px-8"
    >
      <div 
        ref={containerRef}
        className="max-w-4xl mx-auto glass-card p-12 rounded-3xl"
      >
        <div 
          ref={badgeRef}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-200 mb-8"
        >
          Sistema especializado para escritórios AEC
        </div>
        
        <h2 
          ref={titleRef}
          className="section-title text-white mb-6"
        >
          A plataforma SaaS definitiva para{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            escritórios AEC
          </span>
        </h2>
        
        <p 
          ref={subtitle1Ref}
          className="text-xl text-blue-100 leading-relaxed mb-6 max-w-3xl mx-auto"
        >
          Gestão, produtividade, financeiro e clientes em um só lugar — com IA, segurança enterprise e resultados comprovados.
        </p>
        
        <p 
          ref={subtitle2Ref}
          className="text-lg text-blue-200/80 max-w-2xl mx-auto leading-relaxed"
        >
          Workflows baseados em NBR 13532, IA treinada em projetos reais, compliance LGPD, integrações nativas e suporte de especialistas do setor. Pronto para crescer com você: API pública, mobile app, digital twins e muito mais no roadmap.
        </p>

        <div 
          ref={metricsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">40%</div>
            <div className="text-sm text-blue-200 font-medium">Mais Produtividade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">35%</div>
            <div className="text-sm text-blue-200 font-medium">Mais Margem</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-sm text-blue-200 font-medium">Satisfação</div>
          </div>
        </div>
      </div>
    </div>
  )
}