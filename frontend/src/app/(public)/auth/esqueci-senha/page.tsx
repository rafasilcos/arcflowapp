'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import InputFormatado from '@/components/ui/InputFormatado'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const validateEmail = (email: string): string => {
    if (!email) return 'E-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido'
    return ''
  }

  const emailError = validateEmail(email)
  const hasError = emailError && touched
  const isValid = !emailError && email

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    
    if (emailError) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/error for demo
      if (Math.random() > 0.3) {
        setIsSuccess(true)
      } else {
        setError('E-mail não encontrado em nossa base de dados.')
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    }
    
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          E-mail Enviado! 📧
        </motion.h2>
        
        <motion.div 
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-blue-100/80 leading-relaxed">
            Enviamos um link de recuperação para:
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20">
            <Mail className="h-4 w-4 text-blue-300" />
            <span className="text-white font-medium">{email}</span>
          </div>
          <p className="text-blue-100/60 text-sm">
            Verifique sua caixa de entrada e spam. O link expira em 15 minutos.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => {
              setIsSuccess(false)
              setEmail('')
              setTouched(false)
            }}
            className="w-full px-6 py-3 text-blue-300 hover:text-blue-200 transition-colors"
          >
            Reenviar e-mail
          </button>
          
          <Link 
            href="/auth/login"
            className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform"
          >
            Voltar ao Login
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
          Esqueci Minha Senha
        </h2>
        <p className="text-blue-100/80">
          Digite seu e-mail e enviaremos um link para redefinir sua senha
        </p>
      </motion.div>

      {/* Form */}
      <motion.form 
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        
        {/* Email Input */}
        <InputFormatado
          tipo="email"
          label="E-mail cadastrado"
          value={email}
          onChange={(value) => setEmail(value)}
          placeholder="seu@email.com"
          temaId="dark"
          obrigatoria
          disabled={isSubmitting}
        />
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-400 text-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="group w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-2xl overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting || !isValid ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || !isValid ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="relative z-10">
            {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </span>
          
          {!isSubmitting && (
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          )}
          
          {isSubmitting && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
            </motion.div>
          )}

          {/* Button shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        </motion.button>
      </motion.form>

      {/* Back to Login */}
      <motion.div 
        className="flex justify-center mt-8 pt-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <Link 
          href="/auth/login"
          className="group flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
        >
          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowLeft className="h-4 w-4" />
          </motion.div>
          <span>Voltar ao login</span>
        </Link>
      </motion.div>

    </motion.div>
  )
} 