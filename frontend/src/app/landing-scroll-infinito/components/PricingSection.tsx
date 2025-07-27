'use client'

import { Check } from 'lucide-react'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

const plans = [
  {
    name: 'Starter',
    price: '97',
    period: '/mês',
    description: 'Ideal para escritórios iniciantes',
    features: [
      'Até 3 usuários',
      'Briefing estruturado',
      'Agenda básica',
      '5 projetos simultâneos',
      'Suporte por email',
      'Relatórios básicos'
    ],
    highlighted: false
  },
  {
    name: 'Professional',
    price: '197',
    period: '/mês',
    description: 'Para escritórios em crescimento',
    features: [
      'Usuários ilimitados',
      'Todos os módulos',
      'Análise de produtividade',
      'Projetos ilimitados',
      'Portal do cliente',
      'Suporte prioritário',
      'Integrações avançadas',
      'Relatórios personalizados'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '397',
    period: '/mês',
    description: 'Para grandes escritórios',
    features: [
      'Tudo do Professional',
      'API personalizada',
      'Consultoria especializada',
      'Treinamento dedicado',
      'SLA garantido',
      'Suporte 24/7',
      'Customizações exclusivas',
      'Gerente de sucesso'
    ],
    highlighted: false
  }
]

export function PricingSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const { sectionRef } = useSectionAnimation({
    sectionId: 'pricing',
    sectionIndex: 5,
    startProgress: 0.625,
    endProgress: 0.75,
    onRegister
  })

  return (
    <div 
      ref={sectionRef}
      id="pricing-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="pricing-header text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Escolha seu plano
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Preços transparentes e sem surpresas. Cancele quando quiser.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-400/30">
              Sem surpresas
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              LGPD
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold border border-yellow-400/30">
              PCI DSS
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              SLA garantido
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card relative glass-card p-8 hover:scale-105 transition-all duration-300 ${
                plan.highlighted 
                  ? 'professional ring-2 ring-blue-400/50 shadow-2xl shadow-blue-500/20' 
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-blue-200 text-sm mb-6">
                  {plan.description}
                </p>
                
                {/* Price */}
                <div className="flex items-end justify-center mb-6">
                  <span className="text-4xl font-bold text-white">
                    R$ {plan.price}
                  </span>
                  <span className="text-blue-200 ml-1">
                    {plan.period}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 shadow-lg' 
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Começar agora
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="pricing-bottom-cta text-center mt-20">
          <p className="text-blue-200 mb-6">
            Não tem certeza? Teste grátis por 14 dias, sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="text-blue-300 hover:text-white font-medium transition-colors">
              Ver demonstração
            </button>
            <span className="text-blue-400">•</span>
            <button className="text-blue-300 hover:text-white font-medium transition-colors">
              Falar com especialista
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}