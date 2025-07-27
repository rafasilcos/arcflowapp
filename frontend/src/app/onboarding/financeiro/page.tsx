'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { DollarSign, TrendingUp, Target, Calculator, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EstruturaFinanceira {
  modeloPrecificacao: {
    principal: string
    variacao: string[]
    fatoresAjuste: string[]
  }
  
  estruturaCustos: {
    pessoal: number
    operacional: number
    impostos: number
    margem: number
  }
  
  metasFinanceiras: {
    faturamentoAnual: string
    margemDesejada: number
    crescimentoAnual: number
    ticketMedio: string
  }
  
  controleFinanceiro: {
    frequenciaAnalise: string
    indicadores: string[]
    ferramentas: string[]
  }
}

const modelosPrecificacao = [
  {
    id: 'hora',
    nome: 'Por Hora',
    desc: 'Cobrança baseada em horas trabalhadas',
    vantagens: ['Transparente', 'Flexível'],
    adequado: 'Projetos com escopo variável'
  },
  {
    id: 'm2',
    nome: 'Por m²',
    desc: 'Valor fixo por metro quadrado',
    vantagens: ['Previsível', 'Fácil comparação'],
    adequado: 'Projetos residenciais padrão'
  },
  {
    id: 'valor-fixo',
    nome: 'Valor Fixo',
    desc: 'Preço fechado por projeto',
    vantagens: ['Cliente sabe total', 'Margem protegida'],
    adequado: 'Projetos bem definidos'
  },
  {
    id: 'misto',
    nome: 'Modelo Misto',
    desc: 'Combinação de diferentes modelos',
    vantagens: ['Flexível', 'Personalizado'],
    adequado: 'Escritórios experientes'
  }
]

export default function FinanceiroPage() {
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
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Estrutura Financeira
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Configure sua estratégia de precificação, estrutura de custos e metas financeiras.
          </p>
        </motion.div>

        {/* Coming Soon */}
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Em Desenvolvimento</h2>
          <p className="text-blue-100/80 mb-6">
            Esta página está sendo desenvolvida com base na nova metodologia V2.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link
            href="/onboarding/tecnologia"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Tecnologia</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 6 de 8
          </div>
          
          <Link
            href="/onboarding/workflow"
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Continuar: Workflow</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </motion.div>
  )
} 