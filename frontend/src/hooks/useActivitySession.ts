import { useEffect, useRef, useCallback, useState } from 'react'

interface ActivitySessionOptions {
  inactivityTimeout?: number // minutos de inatividade para logout (padrão: 30min)
  warningTime?: number // minutos antes do logout para avisar (padrão: 5min)
  onSessionWarning?: (timeLeft: number) => void
  onSessionExpired?: () => void
  onActivityDetected?: () => void
  enableExtendedSession?: boolean // permitir sessões de 12h+ (padrão: true)
}

interface ActivityStatus {
  isActive: boolean
  lastActivity: Date | null
  timeUntilLogout: number // segundos
  isWarningActive: boolean
  totalActiveTime: number // segundos de sessão ativa
}

export function useActivitySession({
  inactivityTimeout = 30, // 30 minutos de inatividade
  warningTime = 5, // avisar 5 minutos antes
  onSessionWarning,
  onSessionExpired,
  onActivityDetected,
  enableExtendedSession = true
}: ActivitySessionOptions = {}) {
  
  const [status, setStatus] = useState<ActivityStatus>({
    isActive: true,
    lastActivity: new Date(),
    timeUntilLogout: inactivityTimeout * 60,
    isWarningActive: false,
    totalActiveTime: 0
  })

  const lastActivityRef = useRef<Date>(new Date())
  const sessionStartRef = useRef<Date>(new Date())
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)
  const lastEventTimeRef = useRef<number>(0) // ✅ THROTTLING: Controle de frequência

  // 🎯 EVENTOS QUE INDICAM ATIVIDADE (OTIMIZADOS PARA PERFORMANCE)
  const activityEvents = [
    'mousedown', 'keypress', 'touchstart', 'click', 'keydown', 'change', 'input'
    // ✅ REMOVIDO: 'mousemove', 'scroll', 'keyup', 'focus', 'blur' (muito frequentes)
    // Mantidos apenas eventos significativos para reduzir spam
  ]

  // ⏰ INICIAR TIMER DE INATIVIDADE
  const startInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(() => {
      console.log('🚨 [ACTIVITY] Usuário inativo por', inactivityTimeout, 'minutos, fazendo logout...')
      
      setStatus(prev => ({
        ...prev,
        isActive: false,
        timeUntilLogout: 0
      }))

      onSessionExpired?.()
    }, inactivityTimeout * 60 * 1000)

  }, [inactivityTimeout, onSessionExpired])

  // 📊 REGISTRAR ATIVIDADE DO USUÁRIO (COM THROTTLING)
  const registerActivity = useCallback(() => {
    const now = new Date()
    const currentTime = now.getTime()
    
    // ✅ THROTTLING: Limitar execução a 1x por segundo para performance
    const THROTTLE_MS = 1000 // 1 segundo
    if (currentTime - lastEventTimeRef.current < THROTTLE_MS) {
      return // Ignorar eventos muito frequentes
    }
    
    lastEventTimeRef.current = currentTime
    lastActivityRef.current = now
    
    // Reset timer de inatividade
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    // Reset flag de aviso
    warningShownRef.current = false

    // Callback de atividade detectada (sem setState para evitar loops)
    onActivityDetected?.()

    // ✅ CORREÇÃO: Log de atividade removido para evitar spam no console
    // Apenas log de debug em desenvolvimento se necessário
    if (process.env.NODE_ENV === 'development' && isInitializedRef.current) {
      const activeTime = Math.floor((now.getTime() - sessionStartRef.current.getTime()) / 1000)
      // Log apenas a cada 5 minutos para debug
      if (activeTime % (5 * 60) === 0) {
        console.log('🔄 [ACTIVITY] Sessão ativa:', {
          tempoTotal: `${Math.floor(activeTime / 3600)}h ${Math.floor((activeTime % 3600) / 60)}m`
        })
      }
    }

    // Iniciar novo timer de inatividade
    startInactivityTimer()

  }, [inactivityTimeout, onActivityDetected, startInactivityTimer])

  // ⚠️ VERIFICAR STATUS E AVISOS
  const checkInactivityStatus = useCallback(() => {
    const now = new Date()
    const timeSinceActivity = (now.getTime() - lastActivityRef.current.getTime()) / 1000
    const timeUntilLogout = Math.max(0, (inactivityTimeout * 60) - timeSinceActivity)
    const warningThreshold = warningTime * 60
    const activeTime = Math.floor((now.getTime() - sessionStartRef.current.getTime()) / 1000)

    setStatus(prev => ({
      ...prev,
      timeUntilLogout,
      isWarningActive: timeUntilLogout <= warningThreshold && timeUntilLogout > 0,
      totalActiveTime: activeTime,
      lastActivity: lastActivityRef.current
    }))

    // Mostrar aviso se próximo do logout (apenas quando necessário)
    if (timeUntilLogout <= warningThreshold && timeUntilLogout > 0 && !warningShownRef.current) {
      warningShownRef.current = true
      // ✅ MANTIDO: Log importante de aviso de sessão (baixa frequência)
      console.log(`⚠️ [ACTIVITY] Aviso: ${Math.ceil(timeUntilLogout / 60)} minutos para logout por inatividade`)
      onSessionWarning?.(timeUntilLogout)
    }

  }, [inactivityTimeout, warningTime, onSessionWarning])

  // 🎮 CONFIGURAR LISTENERS DE ATIVIDADE (SEM LOOP)
  useEffect(() => {
    // Marcar como inicializado
    isInitializedRef.current = true

    // Adicionar listeners para todos os eventos de atividade
    activityEvents.forEach(event => {
      document.addEventListener(event, registerActivity, { passive: true })
    })

    // Iniciar timer de inatividade (sem chamar registerActivity)
    startInactivityTimer()

    // Verificar status a cada 10 segundos
    checkIntervalRef.current = setInterval(checkInactivityStatus, 10000)

    return () => {
      // Cleanup listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, registerActivity)
      })

      // Cleanup timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, []) // DEPENDÊNCIAS VAZIAS PARA EVITAR LOOP

  // 💪 ESTENDER SESSÃO MANUALMENTE (resetar timer)
  const extendSession = useCallback(() => {
    console.log('💪 [ACTIVITY] Sessão estendida manualmente pelo usuário')
    registerActivity()
  }, [registerActivity])

  // 📊 FORMATAR TEMPOS
  const formatActiveTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else {
      return `${minutes}min`
    }
  }, [])

  const formatTimeUntilLogout = useCallback((seconds: number): string => {
    if (seconds <= 0) return 'Sessão expirada'
    
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} min`
  }, [])

  // 🔄 PAUSAR/RETOMAR MONITORAMENTO (para debugging)
  const pauseActivityTracking = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
  }, [])

  const resumeActivityTracking = useCallback(() => {
    registerActivity()
    checkIntervalRef.current = setInterval(checkInactivityStatus, 10000)
  }, [registerActivity, checkInactivityStatus])

  // 📈 ESTATÍSTICAS DA SESSÃO
  const getSessionStats = useCallback(() => {
    const now = new Date()
    const sessionDuration = (now.getTime() - sessionStartRef.current.getTime()) / 1000
    const inactiveTime = (now.getTime() - lastActivityRef.current.getTime()) / 1000
    
    return {
      sessionStart: sessionStartRef.current,
      sessionDuration: formatActiveTime(sessionDuration),
      lastActivity: lastActivityRef.current,
      inactiveTime: formatActiveTime(inactiveTime),
      isExtendedSession: sessionDuration > 8 * 3600, // > 8 horas
      activityRate: status.totalActiveTime / sessionDuration // % tempo ativo
    }
  }, [status.totalActiveTime, formatActiveTime])

  return {
    status,
    extendSession,
    pauseActivityTracking,
    resumeActivityTracking,
    formatActiveTime,
    formatTimeUntilLogout,
    getSessionStats,
    // Informações úteis
    isWorkingSession: status.totalActiveTime > 30 * 60, // > 30min = sessão de trabalho
    isExtendedSession: status.totalActiveTime > 8 * 3600, // > 8h = sessão estendida
    activityEventsTracked: activityEvents
  }
} 