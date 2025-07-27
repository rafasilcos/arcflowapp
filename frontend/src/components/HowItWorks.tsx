'use client'

import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Target, Heart, CheckCircle, Users, Award, Zap, ArrowUpRight } from 'lucide-react'

interface FloatingParticle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  icon: React.ElementType
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef(null)
  const isInView = useInView(nodeRef, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const increment = value / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start > value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])

  return <span ref={nodeRef}>{count}</span>
}

function FloatingParticles() {
  const [particles] = useState<FloatingParticle[]>(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 4,
      icon: [Users, Award, Zap, TrendingUp][Math.floor(Math.random() * 4)]
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-4 h-4 text-blue-200 opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <particle.icon className="w-4 h-4" />
        </motion.div>
      ))}
    </div>
  )
}

function MetricCard({ 
  value, 
  suffix = '%', 
  title, 
  description, 
  icon: Icon, 
  className = '', 
  delay = 0,
  size = 'normal'
}: {
  value: number
  suffix?: string
  title: string
  description: string
  icon: React.ElementType
  className?: string
  delay?: number
  size?: 'small' | 'normal' | 'large' | 'hero'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const sizeClasses = {
    small: 'p-6',
    normal: 'p-8',
    large: 'p-10',
    hero: 'p-12'
  }

  const textSizes = {
    small: 'text-2xl',
    normal: 'text-3xl',
    large: 'text-4xl',
    hero: 'text-6xl lg:text-7xl'
  }

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 60, scale: 0.8 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        background: [
          'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)',
          'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
        ]
      } : { opacity: 0, y: 60, scale: 0.8 }}
      transition={{ 
        duration: 0.8, 
        delay,
        background: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)',
        transition: { duration: 0.2 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(59,130,246,0.1) 50%, transparent 70%)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Icon with special effects */}
      <motion.div 
        className="relative mb-6"
        whileHover={{ rotate: 12, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative">
          <motion.div 
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.3)',
                '0 0 30px rgba(147,51,234,0.4)',
                '0 0 20px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="h-7 w-7 text-white" />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Animated number */}
      <motion.div 
        className={`font-black text-white mb-4 tracking-tight ${textSizes[size]}`}
        style={{
          fontFeatureSettings: '"tnum"',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
      >
        <AnimatedCounter value={value} />
        <span className="text-blue-300">{suffix}</span>
      </motion.div>

      {/* Title */}
      <h3 className={`font-bold text-white mb-3 ${size === 'hero' ? 'text-2xl' : size === 'large' ? 'text-xl' : 'text-lg'}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`text-blue-100 leading-relaxed ${size === 'hero' ? 'text-lg' : 'text-sm'}`}>
        {description}
      </p>

      {/* Special elements for hero card */}
      {size === 'hero' && (
        <>
          <motion.div 
            className="mt-8 pt-6 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
          >
            <div className="flex items-center space-x-4 text-sm text-blue-200">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Dados verificados</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                <span>+500 empresas</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <ArrowUpRight className="h-6 w-6 text-blue-300 opacity-50" />
          </motion.div>
        </>
      )}

      {/* Floating micro-elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-40"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20" />
        <FloatingParticles />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header with special effects */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            animate={{
              textShadow: [
                '0 4px 20px rgba(59,130,246,0.3)',
                '0 4px 20px rgba(147,51,234,0.3)',
                '0 4px 20px rgba(59,130,246,0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Resultados que
            <motion.span 
              className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Impressionam
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Dados reais de <strong>500+ escritórios</strong> que transformaram 
            completamente seus resultados com nossa metodologia exclusiva
          </motion.p>
        </motion.div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          
          {/* Hero card - spans 3 columns on large screens */}
          <MetricCard
            value={40}
            suffix="%"
            title="Produtividade Transformada"
            description="Aumento médio documentado em projetos residenciais e comerciais através de otimização de processos"
            icon={TrendingUp}
            className="md:col-span-2 lg:col-span-3 md:row-span-2"
            size="hero"
            delay={0}
          />

          {/* Secondary cards */}
          <MetricCard
            value={35}
            suffix="%"
            title="Margem Otimizada"
            description="Melhoria através de análise de produtividade"
            icon={Target}
            className="lg:col-span-2"
            size="large"
            delay={0.2}
          />

          <MetricCard
            value={95}
            suffix="%"
            title="Clientes Satisfeitos"
            description="NPS excepcional"
            icon={Heart}
            className="lg:col-span-1"
            size="normal"
            delay={0.4}
          />

          <MetricCard
            value={60}
            suffix="%"
            title="Menos Retrabalho"
            description="Com briefing estruturado"
            icon={CheckCircle}
            className="lg:col-span-2"
            size="normal"
            delay={0.6}
          />

          <MetricCard
            value={500}
            suffix="+"
            title="Escritórios"
            description="Já transformados"
            icon={Users}
            className="lg:col-span-1"
            size="small"
            delay={0.8}
          />

        </div>

        {/* Enhanced CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-block p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Pronto para estes resultados?
            </h3>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Descubra exatamente onde seu escritório está perdendo dinheiro
            </p>
            <motion.button
              className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 mr-3">Começar Análise Gratuita</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight className="h-5 w-5 relative z-10" />
              </motion.div>
              
              {/* Button hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "linear",
                }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
} 