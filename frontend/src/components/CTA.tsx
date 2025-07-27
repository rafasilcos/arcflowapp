'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          
          {/* Main CTA */}
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-3">
            Pronto para transformar seu escritório?
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 animate-pulse">+40% produtividade</span>
          </h2>
          
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
            Junte-se a mais de 500 escritórios que já aumentaram sua margem em 35% com o ArcFlow. Resultados comprovados em até 90 dias.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="primary"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
              asChild
            >
              <a href="/onboarding/perfil">Começar agora</a>
            </Button>
            <button className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
              Falar com especialista
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center mt-8">
            <div>
              <div className="text-2xl font-bold text-slate-800">500+</div>
              <div className="text-sm text-slate-500">Escritórios ativos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">35%</div>
              <div className="text-sm text-slate-500">Aumento de margem</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">40%</div>
              <div className="text-sm text-slate-500">Mais produtividade</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">95%</div>
              <div className="text-sm text-slate-500">Satisfação cliente</div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">Garantia de satisfação</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 