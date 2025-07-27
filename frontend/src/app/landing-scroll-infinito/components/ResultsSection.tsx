'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp, Target, Heart, CheckCircle, Users } from 'lucide-react'
import { gsap } from 'gsap'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

function AnimatedCounter({ value, duration = 2000, suffix = '', className = '' }: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!counterRef.current) return

    // Create counter object for GSAP animation
    const counterObj = { value: 0 }
    
    // Kill previous animation if exists
    if (animationRef.current) {
      animationRef.current.kill()
    }

    // Create GSAP counter animation
    animationRef.current = gsap.to(counterObj, {
      value: value,
      duration: duration / 1000,
      ease: 'power2.out',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counterObj.value).toString()
        }
      },
      paused: true // Start paused, will be triggered by section animation
    })

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [value, duration])

  // Expose animation trigger method
  useEffect(() => {
    if (counterRef.current && animationRef.current) {
      // Store animation reference on element for external triggering
      ;(counterRef.current as any)._counterAnimation = animationRef.current
    }
  }, [])

  return (
    <span ref={counterRef} className={className} data-counter-target={value}>
      0
    </span>
  )
}

const metrics = [
  {
    value: 40,
    suffix: '%',
    title: 'Produtividade Transformada',
    description: 'Aumento médio documentado em projetos residenciais e comerciais através de otimização de processos',
    icon: TrendingUp,
    size: 'hero' as const
  },
  {
    value: 35,
    suffix: '%',
    title: 'Margem Otimizada',
    description: 'Melhoria através de análise de produtividade',
    icon: Target,
    size: 'large' as const
  },
  {
    value: 95,
    suffix: '%',
    title: 'Clientes Satisfeitos',
    description: 'NPS excepcional',
    icon: Heart,
    size: 'normal' as const
  },
  {
    value: 60,
    suffix: '%',
    title: 'Menos Retrabalho',
    description: 'Com briefing estruturado',
    icon: CheckCircle,
    size: 'normal' as const
  },
  {
    value: 500,
    suffix: '+',
    title: 'Escritórios',
    description: 'Já transformados',
    icon: Users,
    size: 'small' as const
  }
]

export function ResultsSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const animationsInitialized = useRef(false)

  const { sectionRef } = useSectionAnimation({
    sectionId: 'results',
    sectionIndex: 3,
    startProgress: 0.375,
    endProgress: 0.5,
    onRegister
  })

  // Initialize GSAP animations for Results Section
  useEffect(() => {
    if (!sectionRef.current || animationsInitialized.current) return

    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const grid = gridRef.current
    const cta = ctaRef.current

    if (!title || !subtitle || !grid || !cta) return

    // Set initial states
    gsap.set([title, subtitle, grid, cta], {
      opacity: 0,
      visibility: 'hidden'
    })

    // Set initial state for title with dramatic effect
    gsap.set(title, {
      opacity: 0,
      scale: 0.8,
      rotationX: -15,
      transformOrigin: 'center center',
      visibility: 'hidden'
    })

    // Set initial state for metric cards
    const metricCards = grid.querySelectorAll('.metric-card')
    gsap.set(metricCards, {
      opacity: 0,
      scale: 0.9,
      y: 50,
      rotationY: 15
    })

    // Set initial state for CTA
    gsap.set(cta, {
      opacity: 0,
      scale: 0.95,
      y: 30
    })

    // Create enter animation timeline
    const enterTl = gsap.timeline({ paused: true })

    // 1. Dramatic fade in of title (37.5-40% scroll)
    enterTl.to(title, {
      opacity: 1,
      scale: 1,
      rotationX: 0,
      duration: 1.5,
      ease: 'power3.out',
      onStart: () => {
        gsap.set(title, { visibility: 'visible' })
      }
    }, 0)

    // 2. Subtitle fade in
    enterTl.to(subtitle, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      onStart: () => {
        gsap.set(subtitle, { visibility: 'visible' })
      }
    }, 0.3)

    // 3. Animate metric cards with stagger (40-45% scroll)
    enterTl.to(metricCards, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationY: 0,
      duration: 1.2,
      ease: 'back.out(1.7)',
      stagger: {
        amount: 0.8,
        from: 'start'
      },
      onStart: () => {
        // Trigger counter animations
        metricCards.forEach((card) => {
          const counter = card.querySelector('[data-counter-target]') as any
          if (counter && counter._counterAnimation) {
            // Add delay based on stagger
            gsap.delayedCall(0.5, () => {
              counter._counterAnimation.play()
            })
          }
        })
      }
    }, 0.8)

    // 4. CTA fade in
    enterTl.to(cta, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      onStart: () => {
        gsap.set(cta, { visibility: 'visible' })
      }
    }, 1.5)

    // Create exit animation timeline with zoom out effect (47.5-50% scroll)
    const exitTl = gsap.timeline({ paused: true })

    exitTl.to([title, subtitle], {
      opacity: 0,
      scale: 1.1,
      rotationX: 15,
      duration: 1,
      ease: 'power2.in'
    }, 0)

    exitTl.to(metricCards, {
      opacity: 0,
      scale: 1.1,
      y: -30,
      rotationY: -15,
      duration: 0.8,
      ease: 'power2.in',
      stagger: {
        amount: 0.3,
        from: 'end'
      }
    }, 0.2)

    exitTl.to(cta, {
      opacity: 0,
      scale: 1.1,
      y: -20,
      duration: 0.8,
      ease: 'power2.in'
    }, 0.3)

    exitTl.set([title, subtitle, grid, cta], { visibility: 'hidden' })

    // Store animations on section element for external control
    ;(section as any)._resultsEnterAnimation = enterTl
    ;(section as any)._resultsExitAnimation = exitTl

    animationsInitialized.current = true

    return () => {
      enterTl.kill()
      exitTl.kill()
    }
  }, [])

  // Add method to trigger animations externally
  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current
    
    // Expose animation control methods
    ;(section as any).playEnterAnimation = () => {
      const enterTl = (section as any)._resultsEnterAnimation
      if (enterTl) {
        enterTl.restart()
      }
    }

    ;(section as any).playExitAnimation = () => {
      const exitTl = (section as any)._resultsExitAnimation
      if (exitTl) {
        exitTl.restart()
      }
    }
  }, [])

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'hero':
        return 'md:col-span-2 lg:col-span-3 md:row-span-2 p-12'
      case 'large':
        return 'lg:col-span-2 p-10'
      case 'normal':
        return 'lg:col-span-2 p-8'
      case 'small':
        return 'lg:col-span-1 p-6'
      default:
        return 'p-8'
    }
  }

  const getTextSizes = (size: string) => {
    switch (size) {
      case 'hero':
        return 'text-6xl lg:text-7xl'
      case 'large':
        return 'text-4xl'
      case 'normal':
        return 'text-3xl'
      case 'small':
        return 'text-2xl'
      default:
        return 'text-3xl'
    }
  }

  return (
    <div 
      ref={sectionRef}
      id="results-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h2 
            ref={titleRef}
            className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight"
          >
            Resultados que{' '}
            <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Impressionam
            </span>
          </h2>
          <p 
            ref={subtitleRef}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            Dados reais de <strong>500+ escritórios</strong> que transformaram 
            completamente seus resultados com nossa metodologia exclusiva
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className={`metric-card group relative overflow-hidden rounded-3xl glass-card hover:scale-105 transition-all duration-500 ${getSizeClasses(metric.size)}`}
              >
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Animated number */}
                <div className={`font-black text-white mb-4 tracking-tight ${getTextSizes(metric.size)}`}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>

                {/* Title */}
                <h3 className={`font-bold text-white mb-3 ${metric.size === 'hero' ? 'text-2xl' : metric.size === 'large' ? 'text-xl' : 'text-lg'}`}>
                  {metric.title}
                </h3>

                {/* Description */}
                <p className={`text-blue-100 leading-relaxed ${metric.size === 'hero' ? 'text-lg' : 'text-sm'}`}>
                  {metric.description}
                </p>

                {/* Special elements for hero card */}
                {metric.size === 'hero' && (
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex items-center space-x-4 text-sm text-blue-200">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Dados verificados</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        <span>+500 empresas</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="text-center mt-20">
          <div className="inline-block p-8 rounded-3xl glass-card">
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para estes resultados?
            </h3>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Descubra exatamente onde seu escritório está perdendo dinheiro
            </p>
            <button className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform">
              <span className="mr-3">Começar Análise Gratuita</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}