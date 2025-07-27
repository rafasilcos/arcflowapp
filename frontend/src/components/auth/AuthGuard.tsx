'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, LogOut, RefreshCw, Clock } from 'lucide-react'
import { API_CONFIG } from '@/config/api-config'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showSessionExpired, setShowSessionExpired] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      setIsChecking(true)
      setError(null)

      // Verificar se há token no localStorage
      const token = localStorage.getItem('arcflow_auth_token')
      const userData = localStorage.getItem('arcflow_user')
      const escritorioData = localStorage.getItem('arcflow_escritorio')

      console.log('🔍 [AuthGuard] Verificando autenticação...')

      if (!token || !userData || !escritorioData) {
        console.log('🔒 [AuthGuard] Dados locais ausentes - redirecionando para login')
        clearAuthData()
        redirectToLogin()
        return
      }

      // Verificar se os dados não são "undefined" string
      if (userData === 'undefined' || escritorioData === 'undefined' || token === 'undefined') {
        console.log('🔒 [AuthGuard] Dados inválidos - redirecionando para login')
        clearAuthData()
        redirectToLogin()
        return
      }

      // 🔥 CORREÇÃO CRÍTICA: SEMPRE VALIDAR JWT NO SERVIDOR
      console.log('🛡️ [AuthGuard] Validando JWT no servidor...')
      const isValidToken = await validateTokenWithServer(token)
      
      if (!isValidToken) {
        console.log('❌ [AuthGuard] JWT inválido ou expirado - sessão encerrada')
        setShowSessionExpired(true)
        clearAuthData()
        redirectToLogin()
        return
      }

      // Token válido - usuário autenticado
      setIsAuthenticated(true)
      
      // Iniciar sistema de auto-refresh se ainda não estiver rodando
      await initAutoRefresh()

      console.log('✅ [AuthGuard] Autenticação válida confirmada pelo servidor')

    } catch (error: any) {
      console.error('🚨 [AuthGuard] Erro na verificação:', error.message)
      
      // Só redireciona para login após múltiplas tentativas falharem
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          checkAuthentication()
        }, 2000) // Retry em 2 segundos
      } else {
        setError('Erro de autenticação persistente. Faça login novamente.')
        clearAuthData()
        redirectToLogin()
      }
    } finally {
      setIsChecking(false)
    }
  }

  /**
   * 🔥 NOVA FUNÇÃO: Validar token JWT no servidor
   */
  const validateTokenWithServer = async (token: string): Promise<boolean> => {
    try {
      console.log('🔍 [AuthGuard] Iniciando validação JWT no servidor...')
      
      // Timeout de 10 segundos para a validação
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ [AuthGuard] Token válido confirmado pelo servidor:', data)
        return data.authenticated === true
      } else if (response.status === 401) {
        console.log('❌ [AuthGuard] Token expirado ou inválido (401) - FORÇANDO LOGOUT')
        return false
      } else {
        console.warn('⚠️ [AuthGuard] Erro na validação do token:', response.status)
        return false
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('❌ [AuthGuard] Timeout na validação do token - servidor não responde')
      } else {
        console.error('❌ [AuthGuard] Erro ao validar token no servidor:', error)
      }
      return false
    }
  }

  const initAutoRefresh = async () => {
    try {
      const { default: authService } = await import('@/services/authService')
      
      // Iniciar auto-refresh se ainda não estiver rodando
      authService.startAutoRefresh()
      
      console.log('✅ [AuthGuard] Auto-refresh iniciado')
    } catch (error) {
      console.warn('⚠️ [AuthGuard] Não foi possível iniciar auto-refresh:', error)
    }
  }

  const clearAuthData = () => {
    console.log('🧹 [AuthGuard] Limpando dados de autenticação...')
    localStorage.removeItem('arcflow_auth_token')
    localStorage.removeItem('arcflow_refresh_token')
    localStorage.removeItem('arcflow_user')
    localStorage.removeItem('arcflow_escritorio')
  }

  const redirectToLogin = () => {
    if (pathname !== '/auth/login') {
      console.log('🔄 [AuthGuard] Redirecionando para login...')
      router.push('/auth/login')
    }
  }

  const handleRetry = () => {
    setRetryCount(0)
    setShowSessionExpired(false)
    checkAuthentication()
  }

  const handleForceLogout = async () => {
    try {
      const { default: authService } = await import('@/services/authService')
      authService.logout()
    } catch (error) {
      clearAuthData()
    }
    setShowSessionExpired(false)
    redirectToLogin()
  }

  // 🔥 NOVA TELA: Sessão Expirada
  if (showSessionExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-4 text-center border border-orange-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-6 p-4 bg-orange-100 rounded-full"
          >
            <Clock className="w-full h-full text-orange-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sessão Expirada
          </h2>
          
          <p className="text-gray-600 mb-6">
            Sua sessão expirou por motivos de segurança. Faça login novamente para continuar.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleForceLogout}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Fazer Login
            </button>
            
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Sistema de segurança enterprise para proteção de dados.
          </p>
        </motion.div>
      </div>
    )
  }

  // Tela de carregamento suave
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </motion.div>
      </div>
    )
  }

  // Tela de erro apenas em casos críticos
  if (error && !isAuthenticated && retryCount >= 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-4 text-center border border-red-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-6 p-4 bg-red-100 rounded-full"
          >
            <AlertTriangle className="w-full h-full text-red-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Problema de Autenticação
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
            
            <button
              onClick={handleForceLogout}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Fazer Login
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Sistema de auto-refresh ativado para manter sessão estável.
          </p>
        </motion.div>
      </div>
    )
  }

  // Se autenticado, renderizar o conteúdo
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Se não autenticado, mostrar tela de carregamento
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
        <p className="text-gray-600 font-medium">Verificando autenticação...</p>
      </motion.div>
    </div>
  )
} 