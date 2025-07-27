'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Home, ArrowRight, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import FooterSection from '@/components/ui/FooterSection'

export default function BriefingIntegradoPage() {
  const { tema, temaId } = useTheme()
  const searchParams = useSearchParams()
  
  // Obter parâmetros da URL
  const templateId = searchParams.get('templateId')
  const clienteId = searchParams.get('clienteId')
  
  console.log('🎯 BriefingIntegrado - Redirecionando para novo sistema manual')

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 mb-8 bg-white border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/briefing"
              className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema Manual Profissional
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Sistema de IA removido - Nova experiência manual disponível
              </p>
            </div>
          </div>
          
          <Link 
            href="/"
            className="p-3 rounded-xl transition-all text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 max-w-4xl mx-auto"
      >
        <div className="rounded-2xl p-8 text-center bg-gradient-to-br from-green-50 to-blue-100 border border-green-200">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100 text-green-600">
              <Zap className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              Evolução Completa!
            </h2>
            <p className="text-lg text-gray-600">
              O sistema de IA foi removido para dar lugar a uma experiência manual mais profissional
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/briefing/manual"
              className="inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
            >
              🚀 Experimentar Sistema Manual
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <Link 
                href="/briefing"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Voltar aos Briefings
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <FooterSection 
        titulo="📋 Sistema Manual Profissional"
        subtitulo="Sem IA • Controle Total • Escalável"
      />
    </div>
  )
} 