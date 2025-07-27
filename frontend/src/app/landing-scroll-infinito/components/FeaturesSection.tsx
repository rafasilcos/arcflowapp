'use client'

import { 
  FileText, 
  Calendar, 
  BarChart3, 
  Building, 
  DollarSign, 
  Users 
} from 'lucide-react'
import { useSectionAnimation } from '../hooks/useSectionAnimation'

const features = [
  {
    icon: FileText,
    title: 'Briefing Estruturado',
    description: 'Capture necessidades com precisão através de questionários inteligentes por tipologia de projeto.',
    tag: 'Único no mercado',
    gradient: 'from-blue-500 to-purple-600',
    highlight: true
  },
  {
    icon: Calendar,
    title: 'Agenda Integrada',
    description: 'Sincronize equipe e projetos com otimização automática de rotas e integração completa.',
    tag: 'Diferencial',
    gradient: 'from-green-500 to-blue-500',
    highlight: false
  },
  {
    icon: BarChart3,
    title: 'Análise de Produtividade',
    description: 'Identifique gargalos e otimize processos com dashboard "Onde vai seu dinheiro".',
    tag: 'Exclusivo',
    gradient: 'from-purple-500 to-pink-500',
    highlight: false
  },
  {
    icon: Building,
    title: 'Gestão de Projetos',
    description: 'Controle completo do workflow com metodologia AEC especializada e timesheet integrado.',
    tag: 'Completo',
    gradient: 'from-orange-500 to-red-500',
    highlight: false
  },
  {
    icon: DollarSign,
    title: 'Financeiro Inteligente',
    description: 'Maximize rentabilidade com controle separado por projeto e análise de margem em tempo real.',
    tag: 'Avançado',
    gradient: 'from-green-500 to-emerald-500',
    highlight: false
  },
  {
    icon: Users,
    title: 'Portal do Cliente',
    description: 'Transparência total com acompanhamento online, aprovações digitais e comunicação integrada.',
    tag: 'Premium',
    gradient: 'from-indigo-500 to-purple-500',
    highlight: false
  }
]

export function FeaturesSection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const { sectionRef } = useSectionAnimation({
    sectionId: 'features',
    sectionIndex: 2,
    startProgress: 0.25,
    endProgress: 0.375,
    onRegister
  })

  return (
    <div 
      ref={sectionRef}
      id="features-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header - Will slide up */}
        <div className="text-center mb-16 features-header">
          <h2 className="section-title text-white mb-6 flex items-center justify-center gap-3">
            Funcionalidades que fazem a diferença
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 animate-pulse">
              Especialização AEC
            </span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
            O ArcFlow integra gestão de projetos, financeiro, produtividade, clientes e equipe em um só lugar, 
            com inteligência artificial, automação total e segurança enterprise.
          </p>
        </div>

        {/* Features Grid - Cards will animate with stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="feature-card glass-card p-8 group relative overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Tag Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-blue-200 mb-6 group-hover:bg-white/20 transition-colors duration-300">
                  {feature.tag}
                </div>

                {/* Icon with enhanced hover effect */}
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                </div>

                {/* Title with conditional highlight */}
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 group-hover:text-blue-100 transition-colors duration-300">
                  {feature.title}
                  {feature.highlight && (
                    <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-bold border border-green-400/30 animate-pulse">
                      Exclusivo
                    </span>
                  )}
                </h3>
                
                {/* Description with enhanced readability */}
                <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Subtle hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA hint */}
        <div className="text-center mt-16 opacity-70 hover:opacity-100 transition-opacity duration-300">
          <p className="text-blue-200 text-sm">
            ✨ Todas as funcionalidades incluídas nos planos Professional e Enterprise
          </p>
        </div>
      </div>
    </div>
  )
}