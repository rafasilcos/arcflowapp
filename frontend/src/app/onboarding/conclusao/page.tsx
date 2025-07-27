'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowLeft, Rocket, Sparkles, Target, Building2, Layers, ClipboardList, DollarSign, Trophy, ArrowRight, Star, Zap, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const configuracoesSimuladas = {
  perfil: 'Escritório de Arquitetura',
  disciplinas: ['Arquitetura', 'Estrutural', 'Hidráulica'],
  tipologias: ['Casa Térrea', 'Casa Sobrado', 'Escritório', 'Galpão Industrial'],
  etapas: 6,
  totalPercentual: 100,
  duracaoMedia: 18,
  valorMedioHora: 65,
  margemIdeal: 35,
  escritorio: {
    cidade: 'São Paulo',
    estado: 'SP',
    responsavel: 'Ana Costa'
  }
}

const proximosPassos = [
  {
    id: 'briefing',
    titulo: 'Criar Primeiro Briefing',
    descricao: 'Use nosso questionário inteligente',
    tempo: '5 min',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    destaque: true
  },
  {
    id: 'projeto',
    titulo: 'Configurar Primeiro Projeto',
    descricao: 'Aplicar sua metodologia configurada',
    tempo: '8 min',
    icon: Building2,
    color: 'from-green-500 to-emerald-500',
    destaque: true
  },
  {
    id: 'equipe',
    titulo: 'Adicionar Sua Equipe',
    descricao: 'Convide colaboradores para o sistema',
    tempo: '3 min',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    destaque: false
  },
  {
    id: 'relatorios',
    titulo: 'Explorar Relatórios',
    descricao: 'Veja suas análises de produtividade',
    tempo: '5 min',
    icon: BarChart3,
    color: 'from-orange-500 to-red-500',
    destaque: false
  }
]

const beneficiosDesabilitados = [
  {
    titulo: 'Orçamentos 40% mais precisos',
    descricao: 'Com base na sua metodologia configurada',
    icon: '🎯'
  },
  {
    titulo: 'Cronogramas automáticos',
    descricao: 'Para todos os tipos de projeto',
    icon: '📅'
  },
  {
    titulo: 'Análise "onde vai seu dinheiro"',
    descricao: 'Única no mercado AEC brasileiro',
    icon: '📊'
  },
  {
    titulo: 'Templates personalizados',
    descricao: 'Baseados nas suas configurações',
    icon: '⚡'
  }
]

export default function ConclusaoPage() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Trigger celebration animation
    const timer = setTimeout(() => {
      setShowCelebration(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleIrParaDashboard = () => {
    // Aqui futuramente será o redirecionamento para o dashboard
    window.location.href = '/'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 relative overflow-hidden"
    >
      
      {/* Celebration Particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
              animate={{ 
                y: window.innerHeight + 100, 
                opacity: [0, 1, 1, 0],
                rotate: 360 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className={`absolute text-2xl ${
                i % 4 === 0 ? '🎉' : 
                i % 4 === 1 ? '🚀' : 
                i % 4 === 2 ? '⭐' : '🏆'
              }`}
            />
          ))}
        </div>
      )}

      {/* Header de Sucesso */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.4 }}
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -top-2 -right-2 text-2xl"
          >
            🎉
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-4xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Parabéns! Seu ArcFlow está pronto! 🚀
        </motion.h1>

        <motion.p 
          className="text-blue-100/80 leading-relaxed max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Você configurou completamente sua plataforma AEC personalizada. 
          Agora você tem acesso a funcionalidades que <span className="text-green-400 font-semibold">NENHUM outro sistema oferece</span>.
        </motion.p>
      </motion.div>

      {/* Resumo da Configuração */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="bg-white/5 rounded-3xl p-8 border border-white/10"
      >
        <div className="flex items-center justify-center mb-6">
          <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
          <h2 className="text-2xl font-bold text-white text-center">
            Configuração 100% Completa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{configuracoesSimuladas.perfil}</div>
            <div className="text-blue-100/60 text-sm">Perfil definido</div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{configuracoesSimuladas.disciplinas.length}</div>
            <div className="text-blue-100/60 text-sm">Disciplinas ativas</div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{configuracoesSimuladas.tipologias.length}</div>
            <div className="text-blue-100/60 text-sm">Tipologias configuradas</div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{configuracoesSimuladas.etapas}</div>
            <div className="text-blue-100/60 text-sm">Etapas metodologia</div>
          </motion.div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">R$ {configuracoesSimuladas.valorMedioHora}/h</div>
              <div className="text-blue-100/60 text-sm">Valor médio hora</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">{configuracoesSimuladas.margemIdeal}%</div>
              <div className="text-blue-100/60 text-sm">Margem ideal</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">{configuracoesSimuladas.duracaoMedia} sem</div>
              <div className="text-blue-100/60 text-sm">Duração média projeto</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Benefícios Desbloqueados */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold text-white text-center flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <span>Funcionalidades Desbloqueadas</span>
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beneficiosDesabilitados.map((beneficio, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
              className="flex items-center space-x-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4"
            >
              <div className="text-2xl">{beneficio.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-green-400 text-sm">{beneficio.titulo}</h3>
                <p className="text-blue-100/70 text-xs">{beneficio.descricao}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Próximos Passos */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold text-white text-center flex items-center justify-center space-x-2">
          <Rocket className="h-6 w-6 text-blue-400" />
          <span>Próximos Passos Recomendados</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proximosPassos.map((passo, index) => {
            const IconComponent = passo.icon
            
            return (
              <motion.div
                key={passo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  passo.destaque
                    ? 'border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 to-orange-500/10'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                {passo.destaque && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    PRIORIDADE
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${passo.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{passo.titulo}</h3>
                    <p className="text-blue-100/70 text-sm mb-2">{passo.descricao}</p>
                    <div className="flex items-center space-x-2">
                      <div className="bg-white/10 px-2 py-1 rounded-full text-xs text-blue-100/80">
                        ⏱️ {passo.tempo}
                      </div>
                      {passo.destaque && (
                        <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                          Recomendado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Call to Action Principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="text-center space-y-6"
      >
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            🎯 Você está pronto para revolucionar seu escritório!
          </h2>
          <p className="text-blue-100/80 mb-6 max-w-2xl mx-auto">
            Com o ArcFlow configurado, você terá orçamentos 40% mais precisos, cronogramas automáticos 
            e a única análise de produtividade AEC do Brasil. Hora de ver a magia acontecer!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleIrParaDashboard}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Rocket className="h-6 w-6" />
              <span>Ir para o Dashboard</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </button>
            
            <div className="text-sm text-blue-100/60">
              ✨ Suas configurações foram salvas automaticamente
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex justify-between items-center pt-8 border-t border-white/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.1 }}
      >
        <Link
          href="/onboarding/parametros"
          className="group flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
        >
          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
          <span>Voltar: Parâmetros</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="text-blue-100/60 text-sm">
            Etapa 6 de 6 - Concluído! 🎉
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <Star className="h-5 w-5 text-yellow-400" />
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}