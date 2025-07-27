'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Pricing() {
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

  return (
    <section id="precos" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Escolha seu plano
          </motion.h2>
          <motion.p
            className="text-xl text-slate-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Preços transparentes e sem surpresas. Cancele quando quiser.
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">Sem surpresas</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">LGPD</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-200">PCI DSS</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">SLA garantido</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative bg-white rounded-lg border-2 p-8 ${
                plan.highlighted 
                  ? 'border-blue-200 shadow-lg' 
                  : 'border-slate-200'
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  {plan.description}
                </p>
                
                {/* Price */}
                <div className="flex items-end justify-center mb-6">
                  <span className="text-4xl font-bold text-slate-800">
                    R$ {plan.price}
                  </span>
                  <span className="text-slate-500 ml-1">
                    {plan.period}
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Começar agora
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

        {/* Logos de integrações */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-16 mb-4">
          <img src="/integracoes/autocad.png" alt="AutoCAD" className="h-8 grayscale hover:grayscale-0 transition" />
          <img src="/integracoes/revit.png" alt="Revit" className="h-8 grayscale hover:grayscale-0 transition" />
          <img src="/integracoes/whatsapp.png" alt="WhatsApp" className="h-8 grayscale hover:grayscale-0 transition" />
          <img src="/integracoes/banco.png" alt="Banco" className="h-8 grayscale hover:grayscale-0 transition" />
          {/* Adicione mais logos conforme necessário */}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 mb-6">
            Não tem certeza? Teste grátis por 14 dias, sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Ver demonstração
            </button>
            <span className="text-slate-400">•</span>
            <button className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Falar com especialista
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
} 