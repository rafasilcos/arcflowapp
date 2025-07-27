'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Key, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PasswordChecks {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
}

export default function RedefinirSenhaPage() {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidToken, setIsValidToken] = useState(true) // Demo: assume token válido
  const [isCheckingToken, setIsCheckingToken] = useState(false)

  const passwordChecks: PasswordChecks = {
    length: senha.length >= 8,
    uppercase: /[A-Z]/.test(senha),
    lowercase: /[a-z]/.test(senha),
    number: /\d/.test(senha)
  }

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length
  const isPasswordValid = passwordScore === 4
  const isConfirmValid = senha === confirmarSenha && confirmarSenha.length > 0
  const canSubmit = isPasswordValid && isConfirmValid

  const getPasswordStrength = () => {
    switch (passwordScore) {
      case 0:
      case 1: return { text: 'Muito fraca', color: 'red' }
      case 2: return { text: 'Fraca', color: 'orange' }
      case 3: return { text: 'Boa', color: 'blue' }
      case 4: return { text: 'Excelente', color: 'green' }
      default: return { text: '', color: 'gray' }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) return
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/error
      if (Math.random() > 0.1) {
        setIsSuccess(true)
      } else {
        setError('Erro interno. Tente novamente.')
      }
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.')
    }
    
    setIsSubmitting(false)
  }

  // Success state
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
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
          Senha Redefinida! 🎉
        </motion.h2>
        
        <motion.p 
          className="text-green-100/80 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Sua senha foi alterada com sucesso.<br/>
          Agora você pode fazer login com sua nova senha.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/auth/login"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform"
          >
            <span>Fazer Login</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  const strength = getPasswordStrength()

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
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Key className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
          Nova Senha
        </h2>
        <p className="text-blue-100/80">
          Escolha uma senha forte para proteger sua conta
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
        
        {/* Password Input */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <label className="block text-sm font-semibold text-white/90">
            Nova senha
          </label>
          
          <div className="relative">
            <motion.div
              className={`
                relative flex items-center rounded-2xl backdrop-blur-md border transition-all duration-300
                ${isPasswordValid ? 'border-green-400/50 bg-green-500/10' :
                  senha ? 'border-yellow-400/50 bg-yellow-500/10' :
                  'border-white/20 bg-white/5'}
              `}
            >
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors ${
                  isPasswordValid ? 'text-green-400' :
                  senha ? 'text-yellow-400' : 'text-white/50'
                }`} />
              </div>
              
              <input
                type={showPassword ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none"
                disabled={isSubmitting}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-1 text-white/50 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </motion.div>
          </div>

          {/* Password Strength */}
          {senha && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Força da senha:</span>
                <span className={`text-sm font-semibold ${
                  strength.color === 'red' ? 'text-red-400' :
                  strength.color === 'orange' ? 'text-orange-400' :
                  strength.color === 'blue' ? 'text-blue-400' :
                  strength.color === 'green' ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {strength.text}
                </span>
              </div>
              
              <div className="flex space-x-1 mb-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordScore 
                        ? strength.color === 'red' ? 'bg-red-400' :
                          strength.color === 'orange' ? 'bg-orange-400' :
                          strength.color === 'blue' ? 'bg-blue-400' :
                          'bg-green-400'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              
              <div className="space-y-1">
                {[
                  { key: 'length', label: 'Mínimo 8 caracteres' },
                  { key: 'uppercase', label: 'Letra maiúscula' },
                  { key: 'lowercase', label: 'Letra minúscula' },
                  { key: 'number', label: 'Número' }
                ].map((check) => (
                  <motion.div
                    key={check.key}
                    className={`flex items-center space-x-2 text-xs transition-colors ${
                      passwordChecks[check.key as keyof PasswordChecks] ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    <motion.div
                      animate={{
                        scale: passwordChecks[check.key as keyof PasswordChecks] ? 1 : 0.8,
                      }}
                    >
                      {passwordChecks[check.key as keyof PasswordChecks] ? 
                        <CheckCircle2 className="h-3 w-3" /> : 
                        <div className="h-3 w-3 rounded-full border border-current" />
                      }
                    </motion.div>
                    <span>{check.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label className="block text-sm font-semibold text-white/90">
            Confirmar nova senha
          </label>
          
          <div className="relative">
            <motion.div
              className={`
                relative flex items-center rounded-2xl backdrop-blur-md border transition-all duration-300
                ${confirmarSenha && !isConfirmValid ? 'border-red-400/50 bg-red-500/10' :
                  isConfirmValid ? 'border-green-400/50 bg-green-500/10' :
                  'border-white/20 bg-white/5'}
              `}
            >
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors ${
                  confirmarSenha && !isConfirmValid ? 'text-red-400' :
                  isConfirmValid ? 'text-green-400' : 'text-white/50'
                }`} />
              </div>
              
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder-white/40 focus:outline-none"
                disabled={isSubmitting}
              />
              
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 p-1 text-white/50 hover:text-white/80 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </motion.div>
            
            {confirmarSenha && !isConfirmValid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-400 text-sm mt-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span>As senhas não coincidem</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-400 text-sm mt-2"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="group w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-2xl overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting || !canSubmit ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting || !canSubmit ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <span className="relative z-10">
            {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
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
        </motion.button>
      </motion.form>

    </motion.div>
  )
} 