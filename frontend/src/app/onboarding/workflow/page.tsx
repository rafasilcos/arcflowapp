'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Zap, Cpu, Sparkles, Wand2, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WorkflowPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Geração de Workflow Personalizado
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Nossa IA está criando um workflow único baseado em todas as informações fornecidas.
          </p>
        </motion.div>

        {/* AI Generation Process */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center space-y-8">
          
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Cpu className="h-8 w-8 text-purple-400 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">IA Processando Dados</h2>
              <p className="text-blue-100/80">
                Analisando perfil, mercado, metodologia, compliance, tecnologia e financeiro
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-purple-500/10 rounded-2xl p-6 border border-purple-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Personalização</h3>
              <p className="text-blue-100/70 text-sm">
                Criando templates específicos para seu perfil de cliente e tipologias
              </p>
            </motion.div>

            <motion.div
              className="bg-blue-500/10 rounded-2xl p-6 border border-blue-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Wand2 className="h-6 w-6 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Automação</h3>
              <p className="text-blue-100/70 text-sm">
                Configurando checklists e aprovações baseados em suas normas
              </p>
            </motion.div>

            <motion.div
              className="bg-green-500/10 rounded-2xl p-6 border border-green-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Zap className="h-6 w-6 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Otimização</h3>
              <p className="text-blue-100/70 text-sm">
                Definindo métricas e KPIs para maximizar sua rentabilidade
              </p>
            </motion.div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <h3 className="font-bold text-purple-400 mb-2">🚀 Workflow Único Criado!</h3>
            <p className="text-blue-100/80 text-sm">
              Seu sistema está sendo configurado com processos únicos para seu escritório. 
              Na próxima etapa você poderá revisar e ajustar tudo antes da finalização.
            </p>
          </motion.div>

        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/financeiro"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Financeiro</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 7 de 8
          </div>
          
          <Link
            href="/onboarding/validacao"
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Continuar: Validação</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </motion.div>
  )
} 