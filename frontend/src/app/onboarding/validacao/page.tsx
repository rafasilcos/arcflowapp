'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, Edit3, Eye, Rocket, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ValidacaoPage() {
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Validação e Ajustes Finais
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Revise seu workflow personalizado e faça os ajustes finais antes de começar a usar o ArcFlow.
          </p>
        </motion.div>

        {/* Workflow Summary */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-8">
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Seu ArcFlow Personalizado Está Pronto!</h2>
            </div>
            <p className="text-blue-100/80 mb-8">
              Baseado em todas as informações fornecidas, criamos um sistema único para seu escritório.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div
              className="bg-blue-500/10 rounded-2xl p-6 border border-blue-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Eye className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="font-bold text-white mb-3">Prévia do Sistema</h3>
              <p className="text-blue-100/70 text-sm mb-4">
                Visualize como ficará seu dashboard e principais funcionalidades configuradas.
              </p>
              <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                Ver Prévia
              </button>
            </motion.div>

            <motion.div
              className="bg-purple-500/10 rounded-2xl p-6 border border-purple-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Edit3 className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="font-bold text-white mb-3">Fazer Ajustes</h3>
              <p className="text-blue-100/70 text-sm mb-4">
                Modifique configurações, templates ou processos antes da finalização.
              </p>
              <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                Ajustar
              </button>
            </motion.div>

            <motion.div
              className="bg-green-500/10 rounded-2xl p-6 border border-green-400/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Rocket className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="font-bold text-white mb-3">Começar a Usar</h3>
              <p className="text-blue-100/70 text-sm mb-4">
                Tudo configurado! Seu primeiro projeto pode ser criado em 2 minutos.
              </p>
              <button className="w-full px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                Iniciar
              </button>
            </motion.div>

          </div>

          <motion.div
            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <h3 className="font-bold text-emerald-400 mb-3">🎉 Configuração 100% Completa!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100/80">
              <div className="space-y-2">
                <p>✅ Templates personalizados criados</p>
                <p>✅ Workflows específicos configurados</p>
                <p>✅ Checklists de compliance ativados</p>
                <p>✅ Integrações tecnológicas prontas</p>
              </div>
              <div className="space-y-2">
                <p>✅ Estrutura financeira definida</p>
                <p>✅ Métricas de produtividade ativadas</p>
                <p>✅ Portal do cliente configurado</p>
                <p>✅ Sistema pronto para usar!</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/workflow"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Workflow</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 8 de 8 - Finalização
          </div>
          
          <Link
            href="/dashboard"
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Rocket className="h-5 w-5" />
            <span>Começar a Usar ArcFlow!</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </motion.div>
  )
} 