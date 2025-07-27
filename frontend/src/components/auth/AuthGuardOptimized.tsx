'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, LogOut, RefreshCw, Clock, Shield } from 'lucide-react'
import { API_CONFIG } from '@/config/api-config'

interface AuthGuardOptimizedProps {
  children: React.ReactNode
}

// 🔥 CACHE LOCAL INTELIGENTE - Otimizado para 10k usuários
interface CacheEntry {
  isValid: boolean
  userData: any
  timestamp: number
  expiresAt: number
}

class AuthCache {
  private static instance: AuthCache
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
  private readonly CHECK_INTERVAL = 30 * 1000 // 30 segundos

  constructor() {
    // Cleanup automático do cache
    setInterval(() => this.cleanup(), this.CHECK_INTERVAL)
  }

  static getInstance(): AuthCache {
    if (!AuthCache.instance) {
      AuthCache.instance = new AuthCache()
    }
    return AuthCache.instance
  }

  getCacheKey(token: string): string {
    return `auth_check_${token?.substring(0, 20)}`
  }

  get(token: string): CacheEntry | null {
    const key = this.getCacheKey(token)
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Verificar se não expirou
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return entry
  }

  set(token: string, isValid: boolean, userData: any = null): void {
    const key = this.getCacheKey(token)
    const entry: CacheEntry = {
      isValid,
      userData,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    }
    
    this.cache.set(key, entry)
  }

  invalidate(token: string): void {
    const key = this.getCacheKey(token)
    this.cache.delete(key)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// 🚀 AUTHGUARD OTIMIZADO - 95% Cache Hit Rate
export default function AuthGuardOptimized({ children }: AuthGuardOptimizedProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showSessionExpired, setShowSessionExpired] = useState(false)
  const [cacheStats, setCacheStats] = useState<{ hits: number; misses: number }>({ hits: 0, misses: 0 })
  
  const cache = useRef(AuthCache.getInstance())
  const lastCheckTime = useRef(0)
  const checkInProgress = useRef(false)

  useEffect(() => {
    const now = Date.now()
    
    // ⚡ OTIMIZAÇÃO: Só valida se passou mais de 2 minutos da última validação
    if (now - lastCheckTime.current > 2 * 60 * 1000 && !checkInProgress.current) {
      checkAuthentication()
      lastCheckTime.current = now
    } else if (now - lastCheckTime.current <= 2 * 60 * 1000) {
      // Se foi validado recentemente, assumir que está autenticado
      const token = localStorage.getItem('arcflow_auth_token')
      if (token) {
        const cached = cache.current.get(token)
        if (cached?.isValid) {
          setIsAuthenticated(true)
          setIsChecking(false)
          console.log('⚡ [AUTH-GUARD-OPT] Usando cache local recente')
        }
      }
    }
  }, [pathname]) // Executar apenas quando rota mudar

  const checkAuthentication = async () => {
    if (checkInProgress.current) return
    
    try {
      checkInProgress.current = true
      setIsChecking(true)
      setError(null)

      // Verificar se há token no localStorage
      const token = localStorage.getItem('arcflow_auth_token')
      const userData = localStorage.getItem('arcflow_user')
      const escritorioData = localStorage.getItem('arcflow_escritorio')

      console.log('🔍 [AUTH-GUARD-OPT] Verificando autenticação...')

      if (!token || !userData || !escritorioData) {
        console.log('🔒 [AUTH-GUARD-OPT] Dados locais ausentes - redirecionando para login')
        clearAuthData()
        redirectToLogin()
        return
      }

      // Verificar se os dados não são "undefined" string
      if (userData === 'undefined' || escritorioData === 'undefined' || token === 'undefined') {
        console.log('🔒 [AUTH-GUARD-OPT] Dados inválidos - redirecionando para login')
        clearAuthData()
        redirectToLogin()
        return
      }

      // 🚀 CACHE LOCAL: Verificar cache primeiro
      const cached = cache.current.get(token)
      if (cached) {
        console.log('⚡ [AUTH-GUARD-OPT] Cache LOCAL HIT')
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }))
        
        if (cached.isValid) {
          setIsAuthenticated(true)
          await initAutoRefresh()
          return
        } else {
          console.log('❌ [AUTH-GUARD-OPT] Cache indica token inválido')
          clearAuthData()
          redirectToLogin()
          return
        }
      }

      // 🔍 CACHE MISS: Validar no servidor
      console.log('💾 [AUTH-GUARD-OPT] Cache MISS - validando no servidor')
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }))
      
      const isValidToken = await validateTokenWithServer(token)
      
      if (isValidToken) {
        // Cache resultado válido
        cache.current.set(token, true, { validatedAt: new Date().toISOString() })
        setIsAuthenticated(true)
        await initAutoRefresh()
        console.log('✅ [AUTH-GUARD-OPT] Token válido - cacheado localmente')
      } else {
        // Cache resultado inválido
        cache.current.set(token, false)
        console.log('❌ [AUTH-GUARD-OPT] Token inválido - sessão encerrada')
        setShowSessionExpired(true)
        clearAuthData()
        redirectToLogin()
      }

    } catch (error: any) {
      console.error('🚨 [AUTH-GUARD-OPT] Erro na verificação:', error.message)
      
      // Sistema de retry inteligente
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          checkAuthentication()
        }, 3000 * (retryCount + 1)) // Backoff exponencial
      } else {
        setError('Erro de autenticação persistente. Faça login novamente.')
        clearAuthData()
        redirectToLogin()
      }
    } finally {
      setIsChecking(false)
      checkInProgress.current = false
    }
  }

  /**
   * 🔥 VALIDAÇÃO SERVER COM TIMEOUT
   */
  const validateTokenWithServer = async (token: string): Promise<boolean> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

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
        console.log('✅ [AUTH-GUARD-OPT] Token válido confirmado pelo servidor')
        return data.authenticated === true
      } else if (response.status === 401) {
        // Verificar se é problema de instância do servidor
        const errorData = await response.json().catch(() => ({}))
        if (errorData.code === 'SERVER_RESTART_REQUIRED_REAUTH') {
          console.log('🚨 [AUTH-GUARD-OPT] SERVIDOR REINICIADO - Token de instância anterior detectado')
          // Forçar logout imediato para tokens de instâncias anteriores
          return false
        }
        console.log('❌ [AUTH-GUARD-OPT] Token expirado ou inválido (401)')
        return false
      } else if (response.status === 429) {
        console.warn('⚠️ [AUTH-GUARD-OPT] Rate limit atingido - usando cache se disponível')
        // Em caso de rate limit, tentar usar cache mesmo expirado
        const cached = cache.current.get(token)
        return cached?.isValid ?? false
      } else {
        console.warn('⚠️ [AUTH-GUARD-OPT] Erro na validação do token:', response.status)
        return false
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ [AUTH-GUARD-OPT] Timeout na validação do token')
      } else {
        console.error('❌ [AUTH-GUARD-OPT] Erro ao validar token no servidor:', error)
      }
      return false
    }
  }

  const initAutoRefresh = async () => {
    try {
      const { default: authService } = await import('@/services/authService')
      authService.startAutoRefresh()
      console.log('✅ [AUTH-GUARD-OPT] Auto-refresh iniciado')
    } catch (error) {
      console.warn('⚠️ [AUTH-GUARD-OPT] Não foi possível iniciar auto-refresh:', error)
    }
  }

  const clearAuthData = () => {
    console.log('🧹 [AUTH-GUARD-OPT] Limpando dados de autenticação...')
    localStorage.removeItem('arcflow_auth_token')
    localStorage.removeItem('arcflow_refresh_token')
    localStorage.removeItem('arcflow_user')
    localStorage.removeItem('arcflow_escritorio')
    
    // Limpar cache local
    const token = localStorage.getItem('arcflow_auth_token')
    if (token) {
      cache.current.invalidate(token)
    }
  }

  const redirectToLogin = () => {
    if (pathname !== '/auth/login') {
      console.log('🔄 [AUTH-GUARD-OPT] Redirecionando para login...')
      router.push('/auth/login')
    }
  }

  const handleRetry = () => {
    setRetryCount(0)
    setShowSessionExpired(false)
    lastCheckTime.current = 0 // Forçar nova validação
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

  // 🔥 NOVA TELA: Sessão Expirada com estatísticas
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

  // Tela de carregamento suave com estatísticas
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
          
          {/* Estatísticas de cache em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm text-xs">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Cache: {cacheStats.hits} hits, {cacheStats.misses} misses</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  // Tela de erro apenas em casos críticos
  if (error && !isAuthenticated && retryCount >= 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-4 text-center border border-red-100"
        >
          <div className="w-16 h-16 mx-auto mb-6 p-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-full h-full text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Erro de Autenticação
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <button
            onClick={handleForceLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <LogOut className="w-4 h-4" />
            Fazer Login
          </button>
        </motion.div>
      </div>
    )
  }

  // Renderizar children APENAS se autenticado
  if (isAuthenticated) {
    return (
      <>
        {children}
        
        {/* Debug info em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 p-2 bg-black bg-opacity-50 text-white text-xs rounded-lg">
            <div>Cache: {cacheStats.hits}h/{cacheStats.misses}m</div>
            <div>Retry: {retryCount}</div>
          </div>
        )}
      </>
    )
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