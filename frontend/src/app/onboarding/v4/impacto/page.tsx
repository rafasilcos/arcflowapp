'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Rocket, 
  Building2, 
  Zap, 
  Target, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Brain,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';

export default function ImpactoInicial() {
  const router = useRouter();
  const [currentStat, setCurrentStat] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  // Estatísticas impressionantes
  const stats = [
    {
      number: 68,
      label: 'Templates Especializados',
      comparison: 'vs 3-5 dos concorrentes',
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      description: 'Cobertura completa de Arquitetura, Estrutural e Instalações'
    },
    {
      number: 59,
      label: 'Briefings Ultra-Detalhados',
      comparison: 'vs 1-2 genéricos dos concorrentes',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      description: 'De 120 a 350 perguntas especializadas por projeto'
    },
    {
      number: 12868,
      label: 'Tarefas Especializadas',
      comparison: 'vs 50-100 genéricas dos concorrentes',
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      description: 'Metodologia mais completa do mundo AEC'
    },
    {
      number: 52,
      label: 'NBRs Integradas',
      comparison: 'vs 0-5 dos concorrentes',
      icon: Award,
      color: 'from-orange-500 to-red-500',
      description: 'Conformidade técnica e legal garantida'
    }
  ];

  // Animação automática das estatísticas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    // Mostrar comparação após 2 segundos
    const comparisonTimer = setTimeout(() => {
      setShowComparison(true);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(comparisonTimer);
    };
  }, []);

  const handleContinue = () => {
    router.push('/onboarding/v4/identificacao');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Cinematográfico */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <Rocket className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">Bem-vindo ao futuro da AEC</span>
            <Sparkles className="h-6 w-6 text-purple-400" />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ArcFlow
            </span>
            <br />
            <span className="text-4xl md:text-5xl text-white/90">
              Revolução Metodológica
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blue-200/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            O <strong>ÚNICO</strong> sistema que se adapta 100% ao seu escritório.
            <br />
            Não somos apenas mais um software. <strong>Somos uma revolução metodológica.</strong>
          </motion.p>
        </motion.div>

        {/* Estatísticas Impressionantes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            const isActive = index === currentStat;
            
            return (
              <motion.div
                key={index}
                className={`
                  relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center
                  transition-all duration-500 hover:scale-105 cursor-pointer
                  ${isActive ? 'ring-2 ring-blue-400/50 shadow-2xl shadow-blue-500/20' : ''}
                `}
                animate={isActive ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 rgba(59,130,246,0.2)',
                    '0 0 40px rgba(59,130,246,0.4)',
                    '0 0 0 rgba(59,130,246,0.2)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => setCurrentStat(index)}
              >
                {/* Ícone */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                  animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <StatIcon className="h-8 w-8 text-white" />
                </motion.div>

                {/* Número */}
                <motion.div
                  className="text-5xl font-bold text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1, type: "spring" }}
                >
                  {stat.number.toLocaleString()}
                </motion.div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {stat.label}
                </h3>

                {/* Descrição */}
                <p className="text-blue-200/70 text-sm mb-4">
                  {stat.description}
                </p>

                {/* Comparação */}
                <AnimatePresence>
                  {showComparison && (
                    <motion.div
                      className="bg-red-500/20 border border-red-400/30 rounded-lg p-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <p className="text-red-200 text-sm font-medium">
                        {stat.comparison}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Comparação Visual Épica */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-16"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                🆚 ArcFlow vs Concorrentes
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ArcFlow */}
                <motion.div
                  className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">ArcFlow</h3>
                      <p className="text-blue-200/70">Revolução Metodológica</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Templates:</span>
                      <span className="text-green-400 font-bold">68 especializados</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Briefings:</span>
                      <span className="text-green-400 font-bold">59 ultra-detalhados</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Perguntas:</span>
                      <span className="text-green-400 font-bold">120-350 por projeto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">NBRs:</span>
                      <span className="text-green-400 font-bold">52+ integradas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Personalização:</span>
                      <span className="text-green-400 font-bold">100% customizável</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">IA Especializada:</span>
                      <span className="text-green-400 font-bold">✅ Completa</span>
                    </div>
                  </div>
                </motion.div>

                {/* Concorrentes */}
                <motion.div
                  className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-400/30"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.7 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Concorrentes</h3>
                      <p className="text-red-200/70">Soluções Genéricas</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Templates:</span>
                      <span className="text-red-400 font-bold">3-5 genéricos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Briefings:</span>
                      <span className="text-red-400 font-bold">1-2 básicos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Perguntas:</span>
                      <span className="text-red-400 font-bold">20-30 genéricas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">NBRs:</span>
                      <span className="text-red-400 font-bold">0-5 básicas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Personalização:</span>
                      <span className="text-red-400 font-bold">Limitada/Inexistente</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">IA Especializada:</span>
                      <span className="text-red-400 font-bold">❌ Inexistente</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefícios Únicos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ROI Comprovado</h3>
            <p className="text-blue-200/70">
              300-1000% de retorno em 24 meses. Redução de 80% em revisões e 70% no tempo de briefing.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">IA Especializada</h3>
            <p className="text-blue-200/70">
              Análise automática de viabilidade, detecção de inconsistências e sugestões de otimização.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Diferenciação Absoluta</h3>
            <p className="text-blue-200/70">
              ÚNICO sistema com personalização total. Nenhum concorrente oferece essa flexibilidade.
            </p>
          </div>
        </motion.div>

        {/* Call to Action Épico */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <motion.button
            onClick={handleContinue}
            className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 rgba(59,130,246,0.5)',
                '0 0 30px rgba(59,130,246,0.8)',
                '0 0 0 rgba(59,130,246,0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket className="h-6 w-6" />
            <span>Vamos Revolucionar Seu Escritório</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-6 w-6" />
            </motion.div>
          </motion.button>

          <motion.p
            className="text-blue-200/60 mt-6 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
          >
            Próximo: Vamos conhecer seu escritório em detalhes
          </motion.p>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 