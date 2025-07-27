'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function Hero() {
  const metrics = [
    { value: '40%', label: 'Mais Produtividade' },
    { value: '35%', label: 'Mais Margem' },
    { value: '95%', label: 'Satisfação' }
  ]

  return (
    <section className="bg-white pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge Sutil */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Sistema especializado para escritórios AEC
          </motion.div>

          {/* Título Principal */}
          <motion.h1
            className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A plataforma SaaS definitiva para <span className="text-blue-600">escritórios AEC</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-xl lg:text-2xl text-slate-500 leading-relaxed mb-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Gestão, produtividade, financeiro e clientes em um só lugar — com IA, segurança enterprise e resultados comprovados.
          </motion.p>

          {/* Argumento de valor */}
          <motion.p
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Workflows baseados em NBR 13532, IA treinada em projetos reais, compliance LGPD, integrações nativas e suporte de especialistas do setor. Pronto para crescer com você: API pública, mobile app, digital twins e muito mais no roadmap.
          </motion.p>

          {/* CTA Principal */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant="primary" 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
              asChild
            >
              <a href="/onboarding/perfil">Começar agora</a>
            </Button>
          </motion.div>

          {/* Espaço para vídeo/print do sistema */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white max-w-2xl">
              {/* Substitua o src abaixo por um print real ou vídeo curto do sistema */}
              <img src="/screenshot-dashboard.png" alt="Dashboard ArcFlow" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Métricas */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Mockup Sutil */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          
          {/* Browser Frame Minimalista */}
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            
            {/* Browser Header */}
            <div className="flex items-center px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="flex-1 mx-6">
                <div className="bg-white rounded px-3 py-1 text-xs text-slate-500 border border-slate-200">
                  app.arcflow.com.br/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 bg-gradient-to-br from-slate-50 to-white">
              
              {/* Header Dashboard */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
                  <p className="text-sm text-slate-500">Visão geral dos seus projetos</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>

              {/* Cards Projetos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                      <div className="w-16 h-2 bg-blue-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                  <div className="flex space-x-2">
                    <div className="w-16 h-6 bg-slate-100 rounded"></div>
                    <div className="w-16 h-6 bg-blue-100 rounded"></div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-t from-slate-50 to-transparent rounded"></div>
              </div>

            </div>
          </div>

          {/* Elementos Flutuantes Discretos */}
          <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-md border border-slate-200 p-4 hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-slate-600">12 projetos ativos</span>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-md border border-slate-200 p-4 hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-slate-600">R$ 245.000 em pipeline</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  )
} 