'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Settings, Users, Wrench, CheckSquare, ArrowRight, ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'

interface MetodologiaTrabalho {
  estruturaEquipe: {
    hierarquia: string[]
    especializacoes: Record<string, string[]>
  }
  
  ferramentasTrabalho: {
    cad: string[]
    bim: boolean
    renderizacao: string[]
    calculo: string[]
    gestao: string
  }
  
  controleQualidade: {
    revisoes: {
      internas: boolean
      externas: boolean
      checklistPadrao: boolean
    }
    aprovacoes: {
      hierarquicas: boolean
      cruzadas: boolean
      cliente: string
    }
  }
  
  processoTipico: {
    fases: string[]
    pontosCriticos: string[]
    duracaoTotal: number
  }
}

const ferramentasDisponiveis = {
  cad: ['AutoCAD', 'ArchiCAD', 'Revit', 'SketchUp', 'Vectorworks', 'Outros'],
  renderizacao: ['3ds Max', 'V-Ray', 'Lumion', 'Twinmotion', 'Corona', 'Enscape', 'Outros'],
  calculo: ['TQS', 'Cypecad', 'Robot', 'SAP2000', 'AltoQi', 'Ftool', 'Outros'],
  gestao: ['Nenhum', 'Excel', 'Trello', 'Monday', 'Asana', 'Notion', 'Outros']
}

const hierarquiaOpcoes = [
  'Sócio/Diretor',
  'Coordenador',
  'Arquiteto Senior',
  'Engenheiro Senior', 
  'Arquiteto Pleno',
  'Engenheiro Pleno',
  'Arquiteto Junior',
  'Engenheiro Junior',
  'Estagiário',
  'Desenhista'
]

export default function MetodologiaPage() {
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
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Metodologia Real de Trabalho
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Vamos mapear como seu escritório realmente trabalha: equipe, ferramentas, processos e controles de qualidade.
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
            href="/onboarding/mercado"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Mercado</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 3 de 8
          </div>
          
          <Link
            href="/onboarding/compliance"
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Continuar: Compliance</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </motion.div>
  )
} 