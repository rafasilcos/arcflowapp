'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Building, 
  BarChart3,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

// HEADER ESTILO CRAFTO EXATO
function CraftoHeader() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ArcFlow
            </span>
          </motion.div>

          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Sobre</a>
            <a href="#servicos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">O que fazemos</a>
            <a href="#processo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Processo</a>
            <a href="#precos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Preços</a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contato</a>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-gray-600 font-semibold">1 800 222 000</span>
                          <motion.a 
                href="/onboarding/v4/impacto" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SOLICITAR ORÇAMENTO
              </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default function LandingDream() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <CraftoHeader />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden" id="home">
        <div className="absolute inset-0 opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 text-gray-900"
            >
              Resultados{' '}
              <span className="text-blue-600">orgânicos</span>{' '}
              para escritórios AEC
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Oferecemos planos flexíveis para que nossos clientes possam aproveitar ao máximo nossos serviços especializados em AEC.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-16"
            >
              <motion.a 
                href="/onboarding/v4/impacto" 
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                ANÁLISE GRATUITA
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <BarChart3 className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Análise em tempo real</h3>
                <p className="text-gray-600 leading-relaxed">Entregamos campanhas de gestão de projetos para seu escritório.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Target className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Análise de briefings</h3>
                <p className="text-gray-600 leading-relaxed">Também ajudamos nossos clientes com estratégia de projetos AEC.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Zap className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Otimização AEC</h3>
                <p className="text-gray-600 leading-relaxed">Acreditamos em desafios e criamos soluções inovadoras.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <TrendingUp className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Aumento de performance</h3>
                <p className="text-gray-600 leading-relaxed">Nossa equipe entrega qualidade incomparável em design.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">99%</div>
                <p className="text-gray-600 font-medium">
                  Acompanhe e analise<br />relatórios de negócios.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">4.98</div>
                <p className="text-gray-600 font-medium">
                  Melhor agência<br />avaliada
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">98%</div>
                <p className="text-gray-600 font-medium">
                  Clientes genuinamente<br />satisfeitos e recorrentes.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-lg mb-8">Junte-se às 10.000+ empresas que confiam em nossa agência.</p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">ArcFlow</span>
          </div>
          <p className="text-gray-400">Landing page no estilo Crafto - Em construção</p>
        </div>
      </footer>
    </div>
  );
} 