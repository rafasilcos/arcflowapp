import { useEffect, useRef, useState } from 'react'
import { API_CONFIG } from '@/config/api-config'
import { notify } from '@/lib/toast-manager'

// 🔥 HOOK DE HEARTBEAT - Mantém sessão ativa para 10k usuários
export function useSessionHeartbeat() {
  const [isActive, setIsActive] = useState(true)
  const [heartbeatStats, setHeartbeatStats] = useState({
    lastBeat: null as Date | null,
    consecutiveFailures: 0,
    totalBeats: 0
  })
  
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef(Date.now())
  const consecutiveFailuresRef = useRef(0)
  
  // Configurações otimizadas
  const HEARTBEAT_INTERVAL = 5 * 60 * 1000 // 5 minutos
  const INACTIVITY_THRESHOLD = 30 * 60 * 1000 // 30 minutos de inatividade
  const MAX_CONSECUTIVE_FAILURES = 3
  
  // Detectar atividade do usuário
  useEffect(() => {
    const updateLastActivity = () => {
      lastActivityRef.current = Date.now()
    }
    
    // Eventos de atividade (otimizados para performance)
    const events = ['click', 'keydown', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity, { passive: true })
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity)
      })
    }
  }, [])
  
  // Função de heartbeat otimizada
  const sendHeartbeat = async () => {
    try {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current
      
      // Só enviar heartbeat se usuário estiver ativo
      if (timeSinceLastActivity > INACTIVITY_THRESHOLD) {
        console.log('⏰ [HEARTBEAT] Usuário inativo há', Math.round(timeSinceLastActivity / 1000 / 60), 'minutos')
        return
      }
      
      const token = localStorage.getItem('arcflow_auth_token')
      if (!token) {
        console.log('🔒 [HEARTBEAT] Token não encontrado - parando heartbeat')
        stopHeartbeat()
        return
      }
      
      const response = await fetch(`${API_CONFIG.baseURL}/api/auth/heartbeat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          activity: {
            lastActivity: new Date(lastActivityRef.current).toISOString(),
            timeSinceLastActivity: timeSinceLastActivity
          }
        })
      })
      
      if (response.ok) {
        consecutiveFailuresRef.current = 0
        setHeartbeatStats(prev => ({
          lastBeat: new Date(),
          consecutiveFailures: 0,
          totalBeats: prev.totalBeats + 1
        }))
        
        console.log('💓 [HEARTBEAT] Enviado com sucesso')
      } else if (response.status === 401) {
        console.log('❌ [HEARTBEAT] Sessão expirada - redirecionando para login')
        
        // Limpar dados e redirecionar
        localStorage.removeItem('arcflow_auth_token')
        localStorage.removeItem('arcflow_refresh_token')
        localStorage.removeItem('arcflow_user')
        localStorage.removeItem('arcflow_escritorio')
        
        window.location.href = '/auth/login'
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error: any) {
      consecutiveFailuresRef.current++
      
      setHeartbeatStats(prev => ({
        ...prev,
        consecutiveFailures: consecutiveFailuresRef.current
      }))
      
      console.warn('⚠️ [HEARTBEAT] Erro:', error.message)
      
      // Se muitas falhas consecutivas, parar heartbeat
      if (consecutiveFailuresRef.current >= MAX_CONSECUTIVE_FAILURES) {
        console.error('🚨 [HEARTBEAT] Muitas falhas consecutivas - parando heartbeat')
        stopHeartbeat()
        
        // Notificar usuário
        notify.error('Conexão perdida', 'Verifique sua internet.')
      }
    }
  }
  
  // Iniciar heartbeat
  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    console.log('🚀 [HEARTBEAT] Iniciando heartbeat a cada', HEARTBEAT_INTERVAL / 1000 / 60, 'minutos')
    
    // Primeiro heartbeat imediato
    sendHeartbeat()
    
    // Heartbeat periódico
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL)
    
    setIsActive(true)
  }
  
  // Parar heartbeat
  const stopHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
    
    setIsActive(false)
    console.log('🛑 [HEARTBEAT] Heartbeat parado')
  }
  
  // Iniciar automaticamente quando componente montar
  useEffect(() => {
    // Só iniciar se tiver token
    const token = localStorage.getItem('arcflow_auth_token')
    if (token) {
      startHeartbeat()
    }
    
    return () => {
      stopHeartbeat()
    }
  }, [])
  
  // Detectar mudanças de visibilidade da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Página ficou visível - reativar heartbeat
        const token = localStorage.getItem('arcflow_auth_token')
        if (token && !isActive) {
          console.log('👁️ [HEARTBEAT] Página visível - reativando heartbeat')
          startHeartbeat()
        }
      } else {
        // Página ficou oculta - pode reduzir frequência
        console.log('🙈 [HEARTBEAT] Página oculta')
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive])
  
  // Detectar mudanças no token
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arcflow_auth_token') {
        if (e.newValue) {
          // Novo token - iniciar heartbeat
          console.log('🔄 [HEARTBEAT] Novo token detectado')
          startHeartbeat()
        } else {
          // Token removido - parar heartbeat
          console.log('❌ [HEARTBEAT] Token removido')
          stopHeartbeat()
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  return {
    isActive,
    heartbeatStats,
    startHeartbeat,
    stopHeartbeat,
    sendHeartbeat
  }
}

// 🔥 HOOK DE INATIVIDADE - Detecta quando usuário fica inativo
export function useInactivityDetector(onInactive: () => void, threshold: number = 30 * 60 * 1000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef(Date.now())
  
  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(onInactive, threshold)
  }
  
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true })
    })
    
    // Iniciar timer
    resetTimer()
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onInactive, threshold])
  
  return {
    lastActivity: new Date(lastActivityRef.current),
    resetTimer
  }
}

// 🔥 HOOK DE MONITORING DE SESSÃO - Estatísticas completas
export function useSessionMonitoring() {
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    totalTime: 0,
    activeTime: 0,
    inactiveTime: 0,
    heartbeats: 0,
    errors: 0
  })
  
  const startTimeRef = useRef(Date.now())
  const lastActiveRef = useRef(Date.now())
  
  // Atualizar estatísticas periodicamente
  useEffect(() => {
    const updateStats = () => {
      const now = Date.now()
      const totalTime = now - startTimeRef.current
      
      setSessionStats(prev => ({
        ...prev,
        totalTime,
        activeTime: now - lastActiveRef.current
      }))
    }
    
    const interval = setInterval(updateStats, 30000) // A cada 30 segundos
    
    return () => clearInterval(interval)
  }, [])
  
  const logActivity = () => {
    lastActiveRef.current = Date.now()
  }
  
  const incrementHeartbeat = () => {
    setSessionStats(prev => ({
      ...prev,
      heartbeats: prev.heartbeats + 1
    }))
  }
  
  const incrementError = () => {
    setSessionStats(prev => ({
      ...prev,
      errors: prev.errors + 1
    }))
  }
  
  return {
    sessionStats,
    logActivity,
    incrementHeartbeat,
    incrementError
  }
} 