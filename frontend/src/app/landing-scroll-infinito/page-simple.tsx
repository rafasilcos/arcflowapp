'use client'

import { Suspense } from 'react'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[clamp(4rem,15vw,12rem)] font-black mb-8 font-sans bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ARCFLOW
        </h1>
        <div className="animate-pulse text-xl text-blue-200">Carregando experiência imersiva...</div>
      </div>
    </div>
  )
}

export default function LandingScrollInfinitoSimple() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center text-center">
          <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-[clamp(4rem,15vw,12rem)] font-black mb-8 text-white tracking-tight">
              ARCFLOW
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              A plataforma SaaS definitiva para escritórios AEC
            </p>
            <a 
              href="/onboarding/perfil"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
            >
              Começar Agora
            </a>
          </div>
        </div>

        {/* About Section */}
        <div className="min-h-screen flex items-center justify-center text-center px-8">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 p-12 rounded-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-blue-200 mb-8">
              Sistema especializado para escritórios AEC
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              A plataforma SaaS definitiva para{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                escritórios AEC
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-6 max-w-3xl mx-auto">
              Gestão, produtividade, financeiro e clientes em um só lugar — com IA, segurança enterprise e resultados comprovados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
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

        {/* Features Section */}
        <div className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Funcionalidades que fazem a diferença
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
                O ArcFlow integra gestão de projetos, financeiro, produtividade, clientes e equipe em um só lugar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-white text-xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Briefing Estruturado</h3>
                <p className="text-blue-100 leading-relaxed">
                  Capture necessidades com precisão através de questionários inteligentes por tipologia de projeto.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-white text-xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Agenda Integrada</h3>
                <p className="text-blue-100 leading-relaxed">
                  Sincronize equipe e projetos com otimização automática de rotas e integração completa.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-white text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Análise de Produtividade</h3>
                <p className="text-blue-100 leading-relaxed">
                  Identifique gargalos e otimize processos com dashboard "Onde vai seu dinheiro".
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="min-h-screen flex items-center justify-center px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-12 rounded-3xl">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Entre no Fluxo.
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Junte-se a mais de 500 escritórios que já aumentaram sua margem em 35% com o ArcFlow. Resultados comprovados em até 90 dias.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <a 
                  href="/onboarding/perfil"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:scale-110 transition-all duration-300 inline-block"
                >
                  Começar agora
                </a>
                <button className="text-blue-300 hover:text-white font-medium transition-colors text-lg">
                  Falar com especialista
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-blue-200">Escritórios ativos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">35%</div>
                  <div className="text-sm text-blue-200">Aumento de margem</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">40%</div>
                  <div className="text-sm text-blue-200">Mais produtividade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">95%</div>
                  <div className="text-sm text-blue-200">Satisfação cliente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}