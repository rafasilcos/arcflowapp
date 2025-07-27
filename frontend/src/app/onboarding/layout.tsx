'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Check, Building2, Target, Layers, ClipboardList, DollarSign, CheckCircle2, Zap, Sparkles, Brain, Palette, Settings, Rocket } from 'lucide-react'
import Link from 'next/link'

const onboardingSteps = [
  {
    id: 'impacto',
    title: 'Impacto',
    subtitle: 'Inicial',
    description: 'WOW Factor - Superioridade técnica',
    icon: Rocket,
    path: '/onboarding/v4/impacto'
  },
  {
    id: 'identificacao',
    title: 'Identificação',
    subtitle: 'do Escritório',
    description: 'Perfil e dados estratégicos',
    icon: Building2,
    path: '/onboarding/v4/identificacao'
  },
  {
    id: 'perfil-tecnico',
    title: 'Perfil',
    subtitle: 'Multidisciplinar',
    description: '68 templates especializados',
    icon: Target,
    path: '/onboarding/v4/perfil-tecnico'
  },
  {
    id: 'maturidade',
    title: 'Análise',
    subtitle: 'de Maturidade',
    description: 'Situação atual vs potencial',
    icon: ClipboardList,
    path: '/onboarding/v4/maturidade'
  },
  {
    id: 'templates',
    title: 'Demonstração',
    subtitle: 'de Superioridade',
    description: '68 templates vs 3-5 concorrentes',
    icon: Layers,
    path: '/onboarding/v4/templates'
  },
  {
    id: 'briefings',
    title: 'Briefings',
    subtitle: 'Ultra-Detalhados',
    description: '350 perguntas vs 25 concorrentes',
    icon: ClipboardList,
    path: '/onboarding/v4/briefings'
  },
  {
    id: 'ia-especializada',
    title: 'IA',
    subtitle: 'Especializada',
    description: 'Análise técnica automática',
    icon: Brain,
    path: '/onboarding/v4/ia-especializada'
  },
  {
    id: 'personalizacao-total',
    title: 'Personalização',
    subtitle: 'Total',
    description: 'Diferencial único no mercado',
    icon: Palette,
    path: '/onboarding/v4/personalizacao-total'
  },
  {
    id: 'precificacao',
    title: 'Precificação',
    subtitle: 'Inteligente',
    description: 'ROI e valores otimizados',
    icon: DollarSign,
    path: '/onboarding/v4/precificacao'
  },
  {
    id: 'configuracao',
    title: 'Configuração',
    subtitle: 'Avançada',
    description: 'Setup técnico personalizado',
    icon: Settings,
    path: '/onboarding/v4/configuracao'
  },
  {
    id: 'identidade',
    title: 'Identidade',
    subtitle: 'Visual',
    description: 'Logo, cores e branding',
    icon: Sparkles,
    path: '/onboarding/v4/identidade'
  },
  {
    id: 'conclusao',
    title: 'Conclusão',
    subtitle: 'Épica',
    description: 'Bem-vindo ao futuro AEC',
    icon: CheckCircle2,
    path: '/onboarding/v4/conclusao'
  }
]

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Determinar step atual baseado na URL
  const currentStepIndex = onboardingSteps.findIndex(step => {
    const pathSegments = pathname.split('/')
    return pathSegments.includes(step.id)
  })
  const currentStep = currentStepIndex >= 0 ? currentStepIndex : 0
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      
      {/* Background Effects Revolucionários */}
      <div className="absolute inset-0">
        {/* Animated Gradient Épico */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-indigo-600/30"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59,130,246,0.3), rgba(147,51,234,0.3), rgba(99,102,241,0.3))',
              'linear-gradient(225deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3), rgba(147,51,234,0.3))',
              'linear-gradient(45deg, rgba(59,130,246,0.3), rgba(147,51,234,0.3), rgba(99,102,241,0.3))'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Particles Épicos */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full"
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              scale: [1, 2, 1],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rotate-45"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rotate-12"></div>
          <div className="absolute bottom-32 left-40 w-40 h-40 border border-white/20 -rotate-12"></div>
        </div>
      </div>

      {/* Header Revolucionário com Progress */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-6xl mx-auto">
          
          {/* Back Button + Logo Épico */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/auth/login" 
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
            >
              <motion.div
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
              <span>Voltar ao login</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(59,130,246,0.5)',
                    '0 0 30px rgba(147,51,234,0.7)',
                    '0 0 20px rgba(59,130,246,0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Building2 className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-white font-bold text-xl">ArcFlow V4</h1>
                <p className="text-blue-200/70 text-sm">Onboarding Revolucionário</p>
              </div>
            </div>
          </div>

          {/* Progress Bar Épico */}
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between">
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {onboardingSteps[currentStep]?.title || 'Configuração'}{' '}
                  <span className="text-blue-300">
                    {onboardingSteps[currentStep]?.subtitle}
                  </span>
                </motion.h2>
                <motion.p 
                  className="text-blue-200/80 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {onboardingSteps[currentStep]?.description || 'Configure seu escritório'}
                </motion.p>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-3xl font-bold text-white mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {currentStep + 1}/{onboardingSteps.length}
                </motion.div>
                <div className="text-blue-200/70 text-sm">
                  {Math.round(progress)}% concluído
                </div>
              </div>
            </div>

            {/* Progress Bar Visual Épico */}
            <div className="relative">
              {/* Background Track */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                {/* Progress Fill */}
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-between mt-4">
                {onboardingSteps.map((step, index) => {
                  const StepIcon = step.icon
                  const isCompleted = index < currentStep
                  const isCurrent = index === currentStep
                  
                  return (
                    <motion.div
                      key={step.id}
                      className="flex flex-col items-center space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${isCompleted 
                            ? 'bg-green-500 border-green-400 text-white' 
                            : isCurrent 
                              ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/50' 
                              : 'bg-white/10 border-white/30 text-white/50'
                          }
                        `}
                        animate={isCurrent ? { 
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 0 rgba(59,130,246,0.5)',
                            '0 0 20px rgba(59,130,246,0.8)',
                            '0 0 0 rgba(59,130,246,0.5)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </motion.div>
                      
                      <div className="text-center">
                        <div className={`text-xs font-medium ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs ${isCurrent ? 'text-blue-200' : 'text-white/40'}`}>
                          {step.subtitle}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Épico */}
      <motion.footer 
        className="relative z-10 px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between text-white/60 text-sm">
            <div className="flex items-center space-x-4">
              <span>🚀 ArcFlow V4 - Revolução AEC</span>
              <span>•</span>
              <span>68 Templates Especializados</span>
              <span>•</span>
              <span>59 Briefings Ultra-Detalhados</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by</span>
              <span className="text-blue-300 font-semibold">IA Especializada AEC</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
} 