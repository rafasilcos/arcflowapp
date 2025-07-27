'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DollarSign, PieChart, ArrowRight } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

export default function FinanceiroPage() {
  const { tema, temaId } = useTheme()
  const router = useRouter()

  const opcoes = [
    {
      titulo: 'Financeiro Escritório',
      descricao: 'Gestão financeira operacional do escritório',
      rota: '/financeiro-escritorio',
      icone: DollarSign,
      cor: 'from-green-500 to-emerald-600'
    },
    {
      titulo: 'Financeiro Projetos',
      descricao: 'Análise de rentabilidade por projeto',
      rota: '/financeiro-projetos',
      icone: PieChart,
      cor: 'from-blue-500 to-indigo-600'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            temaId === 'elegante' ? 'text-gray-900' : 'text-white'
          }`}>
            💰 Gestão Financeira
          </h1>
          <p className={`text-lg ${
            temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
          }`}>
            Escolha o módulo financeiro que deseja acessar
          </p>
        </div>

        {/* Opções */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opcoes.map((opcao) => {
            const IconeOpcao = opcao.icone
            
            return (
              <Link key={opcao.rota} href={opcao.rota}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                    temaId === 'elegante'
                      ? 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                      : 'bg-white/5 border-white/10 hover:border-white/20 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${opcao.cor}`}>
                      <IconeOpcao className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className={`w-6 h-6 ${
                      temaId === 'elegante' ? 'text-gray-400' : 'text-white/40'
                    }`} />
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 ${
                    temaId === 'elegante' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {opcao.titulo}
                  </h3>
                  
                  <p className={`${
                    temaId === 'elegante' ? 'text-gray-600' : 'text-white/60'
                  }`}>
                    {opcao.descricao}
                  </p>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 