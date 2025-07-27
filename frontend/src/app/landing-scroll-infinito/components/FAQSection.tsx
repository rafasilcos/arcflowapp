'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

const faqs = [
  {
    question: 'O ArcFlow funciona para qualquer tipo de escritório AEC?',
    answer: 'Sim! O ArcFlow foi desenvolvido especificamente para escritórios de Arquitetura, Engenharia e Construção. Funciona para escritórios de todos os tamanhos, desde freelancers até grandes empresas multidisciplinares.'
  },
  {
    question: 'Como é feita a migração dos dados do sistema atual?',
    answer: 'Nossa equipe técnica faz toda a migração sem custo adicional. Importamos projetos, clientes, colaboradores e histórico financeiro. O processo leva 2-3 dias úteis e você continua trabalhando normalmente.'
  },
  {
    question: 'Preciso de treinamento para usar o sistema?',
    answer: 'Oferecemos treinamento completo para toda sua equipe, incluído em todos os planos. São 4 horas de capacitação online + materiais de apoio + suporte especializado nos primeiros 30 dias.'
  },
  {
    question: 'Os dados ficam seguros na nuvem?',
    answer: 'Sim! Usamos criptografia militar (AES-256), backup automático diário, servidores no Brasil e certificação ISO 27001. Seus dados ficam mais seguros na nuvem do que no seu computador.'
  },
  {
    question: 'Quanto tempo leva para ver resultados?',
    answer: 'A maioria dos escritórios vê os primeiros resultados em 30 dias. Melhoria na organização é imediata, aumento de produtividade em 30-60 dias e aumento de margem em 60-90 dias.'
  }
]

export function FAQSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const answerRefs = useRef<(HTMLDivElement | null)[]>([])
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const { sectionRef } = useSectionAnimation({
    sectionId: 'faq',
    sectionIndex: 6,
    startProgress: 0.75,
    endProgress: 0.875,
    onRegister
  })

  // Handle accordion animation
  const toggleAccordion = (index: number) => {
    const newOpenIndex = openIndex === index ? null : index
    
    // Close currently open item
    if (openIndex !== null && answerRefs.current[openIndex]) {
      gsap.to(answerRefs.current[openIndex], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      })
    }
    
    // Open new item
    if (newOpenIndex !== null && answerRefs.current[newOpenIndex]) {
      const element = answerRefs.current[newOpenIndex]
      gsap.set(element, { height: 'auto' })
      const height = element.offsetHeight
      gsap.set(element, { height: 0, opacity: 0 })
      
      gsap.to(element, {
        height: height,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
    
    setOpenIndex(newOpenIndex)
  }

  // Initialize accordion states
  useEffect(() => {
    answerRefs.current.forEach((ref, index) => {
      if (ref) {
        if (index === openIndex) {
          gsap.set(ref, { height: 'auto', opacity: 1 })
        } else {
          gsap.set(ref, { height: 0, opacity: 0 })
        }
      }
    })
  }, [])

  return (
    <div 
      ref={sectionRef}
      id="faq-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="faq-header text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Perguntas frequentes
          </h2>
          <p className="text-xl text-blue-100">
            Tire suas dúvidas sobre o ArcFlow
          </p>
        </div>

        <div className="faq-items space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => { faqItemRefs.current[index] = el }}
              className="faq-item glass-card overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-medium text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-blue-300 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div 
                ref={(el) => { answerRefs.current[index] = el }}
                className="faq-answer overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-blue-100 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta text-center mt-16">
          <p className="text-blue-200 mb-6">
            Ainda tem dúvidas?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform">
              Falar com especialista
            </button>
            <button className="text-blue-300 hover:text-white font-medium transition-colors">
              Ver demonstração
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}