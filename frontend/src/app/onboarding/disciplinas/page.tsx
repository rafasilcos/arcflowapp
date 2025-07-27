'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Lightbulb, Zap } from 'lucide-react'
import Link from 'next/link'

const disciplinasDisponiveis = [
  {
    categoria: 'Arquitetura',
    especialidades: [
      {
        id: 'arquitetura-residencial',
        nome: 'Arquitetura Residencial',
        descricao: 'Casas, apartamentos, condomínios',
        icon: '🏠',
        popular: true
      },
      {
        id: 'arquitetura-comercial',
        nome: 'Arquitetura Comercial',
        descricao: 'Lojas, escritórios, restaurantes',
        icon: '🏢',
        popular: true
      },
      {
        id: 'arquitetura-industrial',
        nome: 'Arquitetura Industrial',
        descricao: 'Fábricas, galpões, depósitos',
        icon: '🏭',
        popular: false
      },
      {
        id: 'arquitetura-interiores',
        nome: 'Arquitetura de Interiores',
        descricao: 'Design interior, mobiliário',
        icon: '🪑',
        popular: true
      },
      {
        id: 'paisagismo',
        nome: 'Paisagismo',
        descricao: 'Jardins, praças, parques',
        icon: '🌳',
        popular: false
      },
      {
        id: 'urbanismo',
        nome: 'Urbanismo',
        descricao: 'Planejamento urbano, loteamentos',
        icon: '🏙️',
        popular: false
      }
    ]
  },
  {
    categoria: 'Engenharia',
    especialidades: [
      {
        id: 'engenharia-estrutural',
        nome: 'Engenharia Estrutural',
        descricao: 'Cálculos estruturais, fundações',
        icon: '🏗️',
        popular: true
      },
      {
        id: 'engenharia-eletrica',
        nome: 'Engenharia Elétrica',
        descricao: 'Instalações elétricas, automação',
        icon: '⚡',
        popular: true
      },
      {
        id: 'engenharia-hidraulica',
        nome: 'Engenharia Hidráulica',
        descricao: 'Instalações hidráulicas, saneamento',
        icon: '💧',
        popular: true
      },
      {
        id: 'engenharia-mecanica',
        nome: 'Engenharia Mecânica',
        descricao: 'HVAC, climatização',
        icon: '🌡️',
        popular: false
      },
      {
        id: 'engenharia-seguranca',
        nome: 'Engenharia de Segurança',
        descricao: 'Prevenção incêndio, segurança',
        icon: '🚨',
        popular: false
      },
      {
        id: 'engenharia-ambiental',
        nome: 'Engenharia Ambiental',
        descricao: 'Sustentabilidade, certificações',
        icon: '🌱',
        popular: false
      }
    ]
  },
  {
    categoria: 'Consultoria',
    especialidades: [
      {
        id: 'consultoria-tecnica',
        nome: 'Consultoria Técnica',
        descricao: 'Pareceres, perícias técnicas',
        icon: '📋',
        popular: false
      },
      {
        id: 'gerenciamento-projetos',
        nome: 'Gerenciamento de Projetos',
        descricao: 'Coordenação, compatibilização',
        icon: '📊',
        popular: true
      },
      {
        id: 'consultoria-sustentabilidade',
        nome: 'Consultoria em Sustentabilidade',
        descricao: 'LEED, AQUA, eficiência energética',
        icon: '♻️',
        popular: false
      },
      {
        id: 'consultoria-bim',
        nome: 'Consultoria BIM',
        descricao: 'Implementação BIM, treinamentos',
        icon: '🖥️',
        popular: false
      }
    ]
  }
]

export default function DisciplinasPage() {
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const handleToggleDisciplina = (disciplinaId: string) => {
    setDisciplinasSelecionadas(prev => {
      const isSelected = prev.includes(disciplinaId)
      if (isSelected) {
        return prev.filter(id => id !== disciplinaId)
      } else {
        return [...prev, disciplinaId]
      }
    })
    
    // Limpar erro quando selecionar algo
    if (error) {
      setError('')
    }
  }

  const handleContinue = () => {
    if (disciplinasSelecionadas.length === 0) {
      setError('Selecione pelo menos uma disciplina para continuar')
      return false
    }
    return true
  }

  const getDisciplinasPopulares = () => {
    const todasEspecialidades = disciplinasDisponiveis.flatMap(cat => cat.especialidades)
    return todasEspecialidades.filter(esp => esp.popular)
  }

  const getInsightPersonalizado = () => {
    if (disciplinasSelecionadas.length === 0) return null
    
    const selecionadas = disciplinasDisponiveis
      .flatMap(cat => cat.especialidades)
      .filter(esp => disciplinasSelecionadas.includes(esp.id))
    
    const temArquitetura = selecionadas.some(esp => esp.id.includes('arquitetura'))
    const temEngenharia = selecionadas.some(esp => esp.id.includes('engenharia'))
    const temConsultoria = selecionadas.some(esp => esp.id.includes('consultoria'))
    
    if (temArquitetura && temEngenharia) {
      return {
        tipo: 'multidisciplinar',
        titulo: 'Escritório Multidisciplinar Detectado! 🚀',
        descricao: 'Perfeito! Escritórios que combinam arquitetura e engenharia têm 40% mais oportunidades de projetos completos.',
        cor: 'from-purple-500 to-pink-500'
      }
    } else if (temArquitetura) {
      return {
        tipo: 'arquitetura',
        titulo: 'Foco em Arquitetura 🏛️',
        descricao: 'Ótima escolha! O ArcFlow tem templates específicos para cada tipo de projeto arquitetônico.',
        cor: 'from-blue-500 to-cyan-500'
      }
    } else if (temEngenharia) {
      return {
        tipo: 'engenharia',
        titulo: 'Especialista em Engenharia ⚙️',
        descricao: 'Excelente! Criamos workflows otimizados para cálculos e controle de qualidade técnica.',
        cor: 'from-green-500 to-emerald-500'
      }
    } else if (temConsultoria) {
      return {
        tipo: 'consultoria',
        titulo: 'Foco em Consultoria 💼',
        descricao: 'Perfeito para expertise! O sistema prioriza análises e relatórios técnicos detalhados.',
        cor: 'from-orange-500 to-red-500'
      }
    }
    
    return null
  }

  const insight = getInsightPersonalizado()

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.1),_transparent_50%)]" />

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Quais são suas especialidades? 🎯
          </h1>
          <p className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            Selecione todas as disciplinas que seu escritório atua. Isso nos ajudará a 
            personalizar templates e workflows específicos para cada área.
          </p>
        </motion.div>

        {/* Disciplinas Populares */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Zap className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Mais Populares</h2>
            <div className="px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full">
              TOP
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getDisciplinasPopulares().map((disciplina) => (
              <motion.button
                key={disciplina.id}
                onClick={() => handleToggleDisciplina(disciplina.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                  disciplinasSelecionadas.includes(disciplina.id)
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{disciplina.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm">{disciplina.nome}</h3>
                    <p className="text-blue-100/70 text-xs">{disciplina.descricao}</p>
                  </div>
                  {disciplinasSelecionadas.includes(disciplina.id) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-purple-400"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  )}
                </div>
                
                {disciplina.popular && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Todas as Disciplinas por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-xl font-bold text-white">Todas as Disciplinas</h2>
          
          {disciplinasDisponiveis.map((categoria, categoryIndex) => (
            <div key={categoria.categoria} className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100/90 border-b border-white/10 pb-2">
                {categoria.categoria}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoria.especialidades.map((disciplina) => (
                  <motion.button
                    key={disciplina.id}
                    onClick={() => handleToggleDisciplina(disciplina.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative ${
                      disciplinasSelecionadas.includes(disciplina.id)
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{disciplina.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{disciplina.nome}</h4>
                        <p className="text-blue-100/70 text-xs">{disciplina.descricao}</p>
                      </div>
                      {disciplinasSelecionadas.includes(disciplina.id) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-blue-400"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Insight Personalizado */}
        {insight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${insight.cor} bg-opacity-10 border border-white/20 rounded-2xl p-6`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-2">{insight.titulo}</h3>
                <p className="text-blue-100/80 text-sm">{insight.descricao}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resumo Seleção */}
        {disciplinasSelecionadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="font-bold text-white mb-3">
              Disciplinas Selecionadas ({disciplinasSelecionadas.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {disciplinasSelecionadas.map(disciplinaId => {
                const disciplina = disciplinasDisponiveis
                  .flatMap(cat => cat.especialidades)
                  .find(esp => esp.id === disciplinaId)
                
                return (
                  <div
                    key={disciplinaId}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-sm"
                  >
                    <span>{disciplina?.icon}</span>
                    <span>{disciplina?.nome}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 text-red-400"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link
            href="/onboarding/perfil"
            className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
          >
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
            <span>Voltar: Perfil</span>
          </Link>
          
          <div className="text-blue-100/60 text-sm">
            Etapa 2 de 6
          </div>
          
          <Link
            href="/onboarding/tipologias"
            className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
              disciplinasSelecionadas.length > 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (!handleContinue()) {
                e.preventDefault()
              }
            }}
          >
            <span>Próxima Etapa: Tipologias</span>
            <motion.div
              animate={disciplinasSelecionadas.length > 0 ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </Link>
        </motion.div>

      </div>
    </motion.div>
  )
} 