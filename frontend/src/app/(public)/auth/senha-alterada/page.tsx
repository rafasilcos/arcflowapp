'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Shield, Lock } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SenhaAlteradaPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation after component mounts
    setTimeout(() => setShowConfetti(true), 500)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center py-8 relative overflow-hidden"
    >
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              initial={{ 
                opacity: 0,
                x: Math.random() * 400,
                y: -20,
                rotate: 0 
              }}
              animate={{
                opacity: [0, 1, 0],
                y: 400,
                rotate: 360,
                x: Math.random() * 400
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Success Icon with Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.3, 
          type: "spring", 
          stiffness: 200,
          damping: 15
        }}
        className="relative w-24 h-24 mx-auto mb-8"
      >
        {/* Pulsing Background */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
        />
        
        {/* Main Icon */}
        <div className="relative w-full h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
        >
          <Shield className="h-4 w-4 text-white" />
        </motion.div>
      </motion.div>
      
      {/* Success Message */}
      <motion.h1 
        className="text-4xl lg:text-5xl font-black text-white mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Senha Alterada! 🎉
      </motion.h1>
      
      <motion.div 
        className="space-y-4 mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <p className="text-xl text-green-100/90 leading-relaxed font-medium">
          Sua senha foi redefinida com <strong>sucesso</strong>!
        </p>
        <p className="text-blue-100/70 leading-relaxed max-w-md mx-auto">
          Sua conta está agora protegida com uma nova senha segura. 
          Faça login para acessar o ArcFlow.
        </p>
      </motion.div>

      {/* Security Features */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {[
          {
            icon: Lock,
            title: "Criptografia",
            description: "Senha protegida com hash seguro"
          },
          {
            icon: Shield,
            title: "Segurança",
            description: "Autenticação de dois fatores disponível"
          },
          {
            icon: CheckCircle2,
            title: "Confirmado",
            description: "Alteração validada e salva"
          }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <feature.icon className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
            <p className="text-blue-100/60 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        {/* Primary CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/auth/login"
            className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <span className="relative z-10">Fazer Login Agora</span>
            
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>

            {/* Button shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
            />
          </Link>
        </motion.div>

        {/* Secondary Actions */}
        <div className="flex justify-center space-x-6 pt-4">
          <Link 
            href="/auth/registro"
            className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
          >
            Criar nova conta
          </Link>
          <span className="text-white/30">•</span>
          <Link 
            href="/auth/esqueci-senha"
            className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
          >
            Esqueci novamente
          </Link>
        </div>
      </motion.div>

      {/* Bottom Message */}
      <motion.div 
        className="mt-12 pt-8 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="text-blue-100/50 text-sm">
          💡 <strong>Dica:</strong> Use um gerenciador de senhas para manter suas credenciais seguras
        </p>
      </motion.div>

    </motion.div>
  )
} 