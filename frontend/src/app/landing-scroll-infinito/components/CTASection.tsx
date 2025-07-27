'use client'

import { useSectionAnimation } from '../hooks/useSectionAnimation'

export function CTASection({ onRegister }: { onRegister?: (id: string, element: HTMLElement) => void }) {
  const { sectionRef } = useSectionAnimation({
    sectionId: 'cta',
    sectionIndex: 7,
    startProgress: 0.875,
    endProgress: 1,
    onRegister
  })

  return (
    <div 
      ref={sectionRef}
      id="cta-section"
      className="absolute inset-0 flex items-center justify-center px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="cta-main-container glass-card p-12 rounded-3xl">
          <h2 className="cta-title text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Entre no Fluxo.
            </span>
          </h2>
          
          <p className="cta-subtitle text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Junte-se a mais de 500 escritórios que já aumentaram sua margem em 35% com o ArcFlow. Resultados comprovados em até 90 dias.
          </p>

          <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <a 
              href="/onboarding/perfil"
              className="cta-primary-button group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:scale-110 transition-all duration-300 overflow-hidden relative inline-block"
            >
              <span className="relative z-10">Começar agora</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <button className="cta-secondary-button text-blue-300 hover:text-white font-medium transition-colors text-lg">
              Falar com especialista
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="cta-trust-metrics grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="trust-metric">
              <div className="trust-number text-2xl font-bold text-white mb-1">500+</div>
              <div className="trust-label text-sm text-blue-200">Escritórios ativos</div>
            </div>
            <div className="trust-metric">
              <div className="trust-number text-2xl font-bold text-white mb-1">35%</div>
              <div className="trust-label text-sm text-blue-200">Aumento de margem</div>
            </div>
            <div className="trust-metric">
              <div className="trust-number text-2xl font-bold text-white mb-1">40%</div>
              <div className="trust-label text-sm text-blue-200">Mais produtividade</div>
            </div>
            <div className="trust-metric">
              <div className="trust-number text-2xl font-bold text-white mb-1">95%</div>
              <div className="trust-label text-sm text-blue-200">Satisfação cliente</div>
            </div>
          </div>
          
          <div className="cta-guarantee flex justify-center mt-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-300 text-sm font-bold border border-green-400/30">
              ✓ Garantia de satisfação
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}