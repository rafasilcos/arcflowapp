'use client'

import { Quote } from 'lucide-react'
import { useSectionAnimation } from '../hooks/useSectionAnimation'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const testimonials = [
  {
    content: "O ArcFlow transformou completamente nossa operação. Em 6 meses aumentamos nossa margem em 40% e eliminamos praticamente todo retrabalho. A análise de produtividade é revolucionária.",
    author: "Ana Beatriz Costa",
    role: "Arquiteta Sócia",
    company: "Costa & Associados"
  },
  {
    content: "Finalmente um sistema feito por quem entende arquitetura. O briefing estruturado sozinho já vale o investimento. Nossos clientes ficam impressionados com o profissionalismo.",
    author: "Carlos Eduardo Silva",
    role: "Engenheiro Civil", 
    company: "Silva Projetos"
  },
  {
    content: "Gestão financeira por projeto mudou nossa vida. Agora sabemos exatamente onde ganhamos e onde perdemos dinheiro. ROI foi 380% no primeiro ano.",
    author: "Marina Santos",
    role: "Diretora Executiva",
    company: "Santos Arquitetura"
  },
  {
    content: "A automação de orçamentos nos economiza 15 horas por semana. O que antes levava dias, agora fazemos em minutos. Nossos clientes recebem propostas muito mais rápido.",
    author: "Roberto Mendes",
    role: "Arquiteto Titular",
    company: "Mendes Arquitetura"
  },
  {
    content: "O controle de prazos e entregas mudou nossa reputação no mercado. Zero atrasos nos últimos 8 meses. Nossos clientes nos indicam constantemente.",
    author: "Fernanda Lima",
    role: "Engenheira de Projetos",
    company: "Lima & Partners"
  }
]

export function TestimonialsSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const { sectionRef } = useSectionAnimation({
    sectionId: 'testimonials',
    sectionIndex: 4,
    startProgress: 0.5,
    endProgress: 0.625,
    onRegister
  })

  const [currentTestimonialSet, setCurrentTestimonialSet] = useState(0)
  const rotationTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  // Divide testimonials into sets of 3 for rotation
  const testimonialSets: typeof testimonials[] = []
  for (let i = 0; i < testimonials.length; i += 3) {
    testimonialSets.push(testimonials.slice(i, i + 3))
  }

  // Setup rotation animation
  useEffect(() => {
    if (typeof window === 'undefined' || !cardsRef.current) return

    const timeline = gsap.timeline({ repeat: -1, paused: true })
    
    // Create rotation cycle for each testimonial set
    testimonialSets.forEach((_, setIndex) => {
      if (setIndex === 0) return // Skip first set as it's initial

      timeline
        .to(cardsRef.current, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.inOut'
        })
        .call(() => {
          setCurrentTestimonialSet(setIndex)
        })
        .to(cardsRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.inOut'
        })
        .to({}, { duration: 3 }) // Hold for 3 seconds
    })

    // Return to first set
    timeline
      .to(cardsRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.inOut'
      })
      .call(() => {
        setCurrentTestimonialSet(0)
      })
      .to(cardsRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      })
      .to({}, { duration: 3 }) // Hold for 3 seconds

    rotationTimelineRef.current = timeline

    return () => {
      if (rotationTimelineRef.current) {
        rotationTimelineRef.current.kill()
      }
    }
  }, [testimonialSets.length])

  // Start/stop rotation based on section visibility
  useEffect(() => {
    if (!rotationTimelineRef.current) return

    const handleVisibilityChange = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (isVisible && section.style.opacity !== '0') {
        rotationTimelineRef.current?.play()
      } else {
        rotationTimelineRef.current?.pause()
      }
    }

    // Check visibility on scroll
    window.addEventListener('scroll', handleVisibilityChange)
    handleVisibilityChange() // Initial check

    return () => {
      window.removeEventListener('scroll', handleVisibilityChange)
    }
  }, [])

  const currentTestimonials = testimonialSets[currentTestimonialSet] || testimonialSets[0]

  return (
    <div 
      ref={sectionRef}
      id="testimonials-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header with slide in animation */}
        <div ref={headerRef} className="testimonials-header text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Quem usa, recomenda
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Descubra como escritórios AEC estão transformando seus resultados
          </p>
        </div>
        
        {/* Stats with slide in animation */}
        <div ref={statsRef} className="testimonials-stats grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center stat-item">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-blue-200">Escritórios confiam</div>
          </div>
          <div className="text-center stat-item">
            <div className="text-3xl font-bold text-white mb-2">R$ 2,8B</div>
            <div className="text-blue-200">Em projetos gerenciados</div>
          </div>
          <div className="text-center stat-item">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-blue-200">NPS médio</div>
          </div>
        </div>

        {/* Testimonials Grid with rotation */}
        <div 
          ref={cardsRef}
          className="testimonials-cards grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {currentTestimonials.map((testimonial, index) => (
            <div
              key={`${currentTestimonialSet}-${index}`}
              className="testimonial-card glass-card p-8 hover:scale-105 transition-transform duration-300"
            >
              <Quote className="h-8 w-8 text-blue-300 mb-6" />

              <blockquote className="text-blue-100 leading-relaxed mb-8">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-medium text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-blue-200">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-blue-300">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rotation indicators */}
        <div className="flex justify-center mt-12 space-x-2">
          {testimonialSets.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentTestimonialSet(index)
                rotationTimelineRef.current?.restart()
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonialSet 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
              aria-label={`Ver conjunto de depoimentos ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}