'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Shield, FileCheck, Clock, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ComplianceData {
  nbrsPorTipologia: Record<string, string[]>
  processoAprovacao: {
    bombeiros: boolean
    ambiental: boolean
    patrimonio: boolean
    anvisa: boolean
    municipais: string[]
  }
  prazosRegulamentares: {
    conhecePrazos: boolean
    prazosEspecificos: Record<string, number>
  }
  checklistsAutomaticos: {
    ativo: boolean
    categorias: string[]
  }
}

const nbrsPorTipologia = {
  'residencial': {
    name: 'Residencial',
    icon: '🏠',
    nbrs: ['NBR 9050 - Acessibilidade', 'NBR 15220 - Desempenho Térmico', 'NBR 15575 - Desempenho de Edificações']
  },
  'comercial': {
    name: 'Comercial', 
    icon: '🏢',
    nbrs: ['NBR 9077 - Saídas de Emergência', 'NBR 5410 - Instalações Elétricas', 'NBR 9050 - Acessibilidade']
  },
  'industrial': {
    name: 'Industrial',
    icon: '🏭', 
    nbrs: ['NBR 14432 - Exigências de Resistência ao Fogo', 'NR 18 - Segurança do Trabalho', 'NBR 7500 - Armazenamento']
  },
  'saude': {
    name: 'Saúde',
    icon: '🏥',
    nbrs: ['RDC 50 - ANVISA', 'NBR 7256 - Tratamento de Ar', 'NBR 9050 - Acessibilidade']
  },
  'educacional': {
    name: 'Educacional',
    icon: '🎓',
    nbrs: ['NBR 9050 - Acessibilidade', 'NBR 9077 - Saídas de Emergência', 'Normas Municipais de Ensino']
  }
}

const aprovacaoEspeciais = [
  { id: 'bombeiros', name: 'Corpo de Bombeiros', prazo: '30-60 dias' },
  { id: 'ambiental', name: 'Licenciamento Ambiental', prazo: '60-180 dias' }, 
  { id: 'patrimonio', name: 'Patrimônio Histórico', prazo: '90-365 dias' },
  { id: 'anvisa', name: 'ANVISA (Saúde)', prazo: '60-120 dias' }
]

export default function CompliancePage() {
  const [compliance, setCompliance] = useState<ComplianceData>({
    nbrsPorTipologia: {},
    processoAprovacao: {
      bombeiros: false,
      ambiental: false,
      patrimonio: false,
      anvisa: false,
      municipais: []
    },
    prazosRegulamentares: {
      conhecePrazos: false,
      prazosEspecificos: {}
    },
    checklistsAutomaticos: {
      ativo: false,
      categorias: []
    }
  })

  const handleNbrToggle = (tipologia: string, nbr: string) => {
    setCompliance(prev => ({
      ...prev,
      nbrsPorTipologia: {
        ...prev.nbrsPorTipologia,
        [tipologia]: prev.nbrsPorTipologia[tipologia]?.includes(nbr)
          ? prev.nbrsPorTipologia[tipologia].filter(n => n !== nbr)
          : [...(prev.nbrsPorTipologia[tipologia] || []), nbr]
      }
    }))
  }

  const handleAprovacaoToggle = (tipo: keyof typeof compliance.processoAprovacao) => {
    if (tipo === 'municipais') return
    
    setCompliance(prev => ({
      ...prev,
      processoAprovacao: {
        ...prev.processoAprovacao,
        [tipo]: !prev.processoAprovacao[tipo]
      }
    }))
  }

  const getTotalNbrs = () => {
    return Object.values(compliance.nbrsPorTipologia).reduce((total, nbrs) => total + nbrs.length, 0)
  }

  const getTotalAprovacoes = () => {
    const { municipais, ...outros } = compliance.processoAprovacao
    return Object.values(outros).filter(Boolean).length + municipais.length
  }

  const isFormValid = () => {
    return getTotalNbrs() > 0 && getTotalAprovacoes() > 0
  }

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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Compliance e Normas Técnicas
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Configure as normas NBR e processos de aprovação específicos para cada tipologia.
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
            href="/onboarding/metodologia"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar: Metodologia</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 4 de 8
          </div>
          
          <Link
            href="/onboarding/tecnologia"
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
          >
            <span>Continuar: Tecnologia</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

      </div>
    </motion.div>
  )
} 