'use client'

import { motion } from 'framer-motion'
import { Users, Award, Zap, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FloatingParticle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  icon: React.ElementType
}

function FloatingParticles() {
  // Só renderizar no cliente para evitar erro de hidratação
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Usar valores fixos para evitar erro de hidratação
  const particles: FloatingParticle[] = [
    { id: 0, x: 15, y: 20, delay: 0, duration: 8, icon: Users },
    { id: 1, x: 85, y: 30, delay: 1, duration: 10, icon: Award },
    { id: 2, x: 25, y: 70, delay: 2, duration: 9, icon: Zap },
    { id: 3, x: 75, y: 80, delay: 3, duration: 11, icon: TrendingUp },
    { id: 4, x: 45, y: 15, delay: 1.5, duration: 7, icon: Users },
    { id: 5, x: 65, y: 45, delay: 4, duration: 12, icon: Award },
    { id: 6, x: 35, y: 55, delay: 2.5, duration: 8.5, icon: Zap },
    { id: 7, x: 80, y: 65, delay: 3.5, duration: 9.5, icon: TrendingUp },
    { id: 8, x: 10, y: 85, delay: 5, duration: 10.5, icon: Users },
    { id: 9, x: 90, y: 10, delay: 0.5, duration: 11.5, icon: Award },
    { id: 10, x: 55, y: 40, delay: 4.5, duration: 7.5, icon: Zap },
    { id: 11, x: 20, y: 50, delay: 1.8, duration: 9.8, icon: TrendingUp }
  ]

  // Não renderizar no servidor
  if (!isClient) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 text-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            rotate: [0, 360, 720],
            opacity: [0.05, 0.2, 0.05],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <particle.icon className="w-3 h-3" />
        </motion.div>
      ))}
    </div>
  )
}

function AnimatedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1, type: "spring", stiffness: 200 }}
      className="flex items-center space-x-3 mb-8"
    >
      <motion.div 
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
        animate={{
          boxShadow: [
            '0 0 30px rgba(59,130,246,0.3)',
            '0 0 50px rgba(147,51,234,0.4)',
            '0 0 30px rgba(59,130,246,0.3)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 12,
          boxShadow: '0 0 60px rgba(147,51,234,0.6)'
        }}
      >
        <span className="text-white font-bold text-xl">A</span>
      </motion.div>
      <motion.h1 
        className="text-3xl font-black text-white tracking-tight"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
        animate={{
          textShadow: [
            '0 2px 20px rgba(59,130,246,0.3)',
            '0 2px 20px rgba(147,51,234,0.3)',
            '0 2px 20px rgba(59,130,246,0.3)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        ArcFlow
      </motion.h1>
    </motion.div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/40 to-pink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        
        {/* Floating particles */}
        <FloatingParticles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        
        {/* Left Side - Branding */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="max-w-md text-center">
            
            <AnimatedLogo />
            
            <motion.h2 
              className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Transforme seu
              <motion.span 
                className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                escritório AEC
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-blue-100 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              A primeira plataforma que mostra exatamente <strong>onde você está perdendo dinheiro</strong> 
              e como aumentar sua margem em +35%
            </motion.p>

            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {[
                { value: '500+', label: 'Escritórios' },
                { value: '35%', label: 'Mais Margem' },
                { value: '95%', label: 'Satisfação' },
                { value: '60%', label: 'Menos Retrabalho' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div 
          className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="w-full max-w-md">
            
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <AnimatedLogo />
            </div>

            {/* Glass Container */}
            <motion.div
              className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(30px)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 200 
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10 p-8 lg:p-10">
                {children}
              </div>

              {/* Floating micro-elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${10 + i * 15}%`,
                    }}
                    animate={{
                      y: [-8, 8, -8],
                      opacity: [0.1, 0.5, 0.1],
                      scale: [0.5, 1.2, 0.5]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 