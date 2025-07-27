import { useEffect, useRef, useState, useCallback } from 'react'

interface TokenPayload {
  exp: number
  iat: number
  userId: string
  email: string
  escritorioId: string
  role: string
}

interface SessionStatus {
  isValid: boolean
  expiresAt: Date | null
  timeUntilExpiry: number // segundos
  isRefreshing: boolean
  error: string | null
}

interface SessionManagerOptions {
  refreshThreshold?: number // segundos antes da expiração para refresh (padrão: 5 minutos)
  warningThreshold?: number // segundos antes da expiração para avisar usuário (padrão: 2 minutos)
  onSessionExpired?: () => void
  onSessionWarning?: (timeLeft: number) => void
  onRefreshSuccess?: () => void
  onRefreshError?: (error: string) => void
}

// Implementação própria de decodificação JWT
function decodeJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido')
    }

    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded as TokenPayload
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error)
    return null
  }
}

export function useSessionManager({
  refreshThreshold = 300, // 5 minutos
  warningThreshold = 120, // 2 minutos
  onSessionExpired,
  onSessionWarning,
  onRefreshSuccess,
  onRefreshError
}: SessionManagerOptions = {}) {
  const [status, setStatus] = useState<SessionStatus>({
    isValid: false,
    expiresAt: null,
    timeUntilExpiry: 0,
    isRefreshing: false,
    error: null
  })

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)
  const isRefreshingRef = useRef(false)
  const lastRefreshAttemptRef = useRef(0) // Prevenir múltiplas tentativas

  // 🔍 DECODIFICAR TOKEN e extrair informações
  const parseToken = useCallback((token: string): TokenPayload | null => {
    try {
      const decoded = decodeJWT(token)
      if (decoded) {
        console.log('🔍 [SESSION] Token decodificado:', {
          userId: decoded.userId,
          email: decoded.email,
          expiresAt: new Date(decoded.exp * 1000).toISOString()
        })
      }
      return decoded
    } catch (error) {
      console.error('❌ [SESSION] Erro ao decodificar token:', error)
      return null
    }
  }, [])

  // 🔄 REFRESH TOKEN no servidor com proteção anti-spam
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const now = Date.now()
    
    // PROTEÇÃO: Evitar múltiplas tentativas muito próximas (mínimo 30 segundos entre tentativas)
    if (now - lastRefreshAttemptRef.current < 30000) {
      console.log('⏭️ [SESSION] Tentativa de refresh muito recente, aguardando...')
      return false
    }
    
    if (isRefreshingRef.current) {
      console.log('⏭️ [SESSION] Refresh já em andamento, aguardando...')
      return false
    }

    isRefreshingRef.current = true
    lastRefreshAttemptRef.current = now
    setStatus(prev => ({ ...prev, isRefreshing: true, error: null }))

    try {
      console.log('🔄 [SESSION] Tentando refresh do token...')
      
      const currentRefreshToken = localStorage.getItem('arcflow_refresh_token')
      if (!currentRefreshToken) {
        throw new Error('Refresh token não encontrado')
      }

      const response = await fetch('http://localhost:3001/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken
        })
      })

      if (!response.ok) {
        // Se response é 429 (rate limit), não tentar novamente por um tempo
        if (response.status === 429) {
          console.warn('🚨 [SESSION] Rate limit atingido no refresh')
          lastRefreshAttemptRef.current = now + 300000 // Aguardar 5 minutos antes de tentar novamente
        }
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.tokens?.accessToken) {
        localStorage.setItem('arcflow_auth_token', data.tokens.accessToken)
        if (data.tokens.refreshToken) {
          localStorage.setItem('arcflow_refresh_token', data.tokens.refreshToken)
        }
        console.log('✅ [SESSION] Token renovado com sucesso')
        onRefreshSuccess?.()
        return true
      } else {
        throw new Error('Tokens não retornados pelo servidor')
      }

    } catch (error) {
      console.error('❌ [SESSION] Erro ao renovar token:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      setStatus(prev => ({ ...prev, error: errorMessage }))
      onRefreshError?.(errorMessage)
      
      // Se erro crítico, aguardar mais tempo antes de próxima tentativa
      if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        lastRefreshAttemptRef.current = now + 900000 // 15 minutos se rate limit
      }
      
      return false
    } finally {
      isRefreshingRef.current = false
      setStatus(prev => ({ ...prev, isRefreshing: false }))
    }
  }, [onRefreshSuccess, onRefreshError])

  // 📊 VERIFICAR STATUS DO TOKEN com proteção anti-spam
  const checkTokenStatus = useCallback(() => {
    const token = localStorage.getItem('arcflow_auth_token')
    
    if (!token) {
      setStatus({
        isValid: false,
        expiresAt: null,
        timeUntilExpiry: 0,
        isRefreshing: false,
        error: 'Token não encontrado'
      })
      return
    }

    const payload = parseToken(token)
    
    if (!payload) {
      setStatus({
        isValid: false,
        expiresAt: null,
        timeUntilExpiry: 0,
        isRefreshing: false,
        error: 'Token inválido'
      })
      return
    }

    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = payload.exp - now
    const expiresAt = new Date(payload.exp * 1000)

    setStatus(prev => ({
      ...prev,
      isValid: timeUntilExpiry > 0,
      expiresAt,
      timeUntilExpiry,
      error: timeUntilExpiry <= 0 ? 'Token expirado' : null
    }))

    // 🚨 TOKEN EXPIRADO - mas só chamar onSessionExpired uma vez
    if (timeUntilExpiry <= 0) {
      if (!warningShownRef.current) {
        console.warn('🚨 [SESSION] Token expirado!')
        warningShownRef.current = true
        onSessionExpired?.()
      }
      return
    }

    // 🔄 REFRESH AUTOMÁTICO - com proteção anti-spam
    if (timeUntilExpiry <= refreshThreshold && !isRefreshingRef.current) {
      const timeSinceLastAttempt = Date.now() - lastRefreshAttemptRef.current
      if (timeSinceLastAttempt >= 30000) { // Mínimo 30 segundos entre tentativas
        console.log(`🔄 [SESSION] Token expira em ${timeUntilExpiry}s, iniciando refresh...`)
        refreshToken()
      } else {
        console.log(`⏭️ [SESSION] Refresh muito recente, aguardando ${Math.ceil((30000 - timeSinceLastAttempt) / 1000)}s`)
      }
    }

    // ⚠️ AVISO DE EXPIRAÇÃO
    if (timeUntilExpiry <= warningThreshold && !warningShownRef.current) {
      console.warn(`⚠️ [SESSION] Token expira em ${timeUntilExpiry}s!`)
      warningShownRef.current = true
      onSessionWarning?.(timeUntilExpiry)
    }

    // Reset warning flag se ainda tem tempo
    if (timeUntilExpiry > warningThreshold) {
      warningShownRef.current = false
    }

  }, [parseToken, refreshThreshold, warningThreshold, refreshToken, onSessionExpired, onSessionWarning])

  // 🕐 MONITORAMENTO CONTÍNUO - mas menos frequente para evitar spam
  useEffect(() => {
    // Verificar status inicial
    checkTokenStatus()

    // Verificar a cada 60 segundos (era 30s) para reduzir carga
    refreshIntervalRef.current = setInterval(() => {
      checkTokenStatus()
    }, 60000) // Aumentado de 30s para 60s

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [checkTokenStatus])

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [])

  // 💪 ESTENDER SESSÃO MANUALMENTE
  const extendSession = useCallback(async (): Promise<boolean> => {
    console.log('💪 [SESSION] Extensão manual da sessão solicitada')
    return await refreshToken()
  }, [refreshToken])

  // 🚪 LOGOUT LIMPO
  const logout = useCallback(() => {
    console.log('🚪 [SESSION] Fazendo logout...')
    
    localStorage.removeItem('arcflow_auth_token')
    localStorage.removeItem('arcflow_refresh_token')
    
    setStatus({
      isValid: false,
      expiresAt: null,
      timeUntilExpiry: 0,
      isRefreshing: false,
      error: null
    })

    // Limpar intervalos
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }

    // Redirecionar para login
    window.location.href = '/auth/login'
  }, [])

  // 📈 FORMATAR TEMPO RESTANTE
  const formatTimeRemaining = useCallback((seconds: number): string => {
    if (seconds <= 0) return 'Expirado'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else if (minutes > 0) {
      return `${minutes}min ${secs}s`
    } else {
      return `${secs}s`
    }
  }, [])

  return {
    status,
    extendSession,
    logout,
    formatTimeRemaining,
    checkTokenStatus
  }
} 