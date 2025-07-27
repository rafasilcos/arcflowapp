'use client'

import { useState, useEffect } from 'react'
import { User, Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useActivitySession } from '@/hooks/useActivitySession'
import { motion, AnimatePresence } from 'framer-motion'

interface ActivityIndicatorProps {
  inactivityTimeout?: number // minutos
  warningTime?: number // minutos
  onSessionExpired?: () => void
  className?: string
  compact?: boolean // versão compacta para header
}

export function ActivityIndicator({
  inactivityTimeout = 30,
  warningTime = 5,
  onSessionExpired,
  className = '',
  compact = false
}: ActivityIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const {
    status,
    extendSession,
    formatActiveTime,
    formatTimeUntilLogout,
    getSessionStats,
    isWorkingSession,
    isExtendedSession
  } = useActivitySession({
    inactivityTimeout,
    warningTime,
    onSessionWarning: (timeLeft) => {
      console.log(`⚠️ [ACTIVITY-UI] Sessão expira em ${Math.ceil(timeLeft / 60)} minutos`)
    },
    onSessionExpired: () => {
      console.log('🚨 [ACTIVITY-UI] Sessão expirada por inatividade')
      onSessionExpired?.()
    },
    onActivityDetected: () => {
      // Pode ser usado para mostrar feedback visual
    }
  })

  const sessionStats = getSessionStats()

  // 🎨 DETERMINAR CORES E ÍCONES BASEADO NO STATUS
  const getStatusStyle = () => {
    if (!status.isActive || status.timeUntilLogout <= 0) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        text: 'Sessão Expirada',
        badge: 'bg-red-100 text-red-700'
      }
    }
    
    if (status.isWarningActive) {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: Clock,
        text: 'Sessão Expirando',
        badge: 'bg-orange-100 text-orange-700'
      }
    }
    
    if (isExtendedSession) {
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: Activity,
        text: 'Sessão Estendida',
        badge: 'bg-purple-100 text-purple-700'
      }
    }
    
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      text: 'Sessão Ativa',
      badge: 'bg-green-100 text-green-700'
    }
  }

  const style = getStatusStyle()
  const StatusIcon = style.icon

  // Versão compacta para header
  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          <StatusIcon className={`w-4 h-4 ${style.color}`} />
          <span className="text-sm font-medium text-gray-700">
            {formatActiveTime(status.totalActiveTime)}
          </span>
        </div>
        
        {status.isWarningActive && (
          <Badge className={style.badge}>
            {formatTimeUntilLogout(status.timeUntilLogout)} restante
          </Badge>
        )}
      </div>
    )
  }

  // Versão completa
  return (
    <div className={`relative ${className}`}>
      <Card 
        className={`${style.bgColor} ${style.borderColor} border cursor-pointer hover:shadow-md transition-all`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className={`w-5 h-5 ${style.color}`} />
              <div>
                <div className={`font-medium ${style.color}`}>
                  {style.text}
                </div>
                <div className="text-sm text-gray-600">
                  Ativo há {formatActiveTime(status.totalActiveTime)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {status.isWarningActive ? (
                <div className="space-y-1">
                  <Badge className={style.badge}>
                    {formatTimeUntilLogout(status.timeUntilLogout)}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      extendSession()
                    }}
                    className="text-xs"
                  >
                    Estender
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Timeout: {inactivityTimeout}min
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes expandidos */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-50"
          >
            <Card className="border shadow-lg bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2 border-b pb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Estatísticas da Sessão
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Início:</span>
                    <div className="font-medium">
                      {sessionStats.sessionStart.toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Duração total:</span>
                    <div className="font-medium">
                      {sessionStats.sessionDuration}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Última atividade:</span>
                    <div className="font-medium">
                      {status.lastActivity?.toLocaleTimeString('pt-BR') || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Tempo inativo:</span>
                    <div className="font-medium">
                      {sessionStats.inactiveTime}
                    </div>
                  </div>
                </div>

                {/* Status específicos */}
                <div className="pt-2 border-t space-y-2">
                  {isWorkingSession && (
                    <Badge variant="outline" className="text-xs">
                      📊 Sessão de Trabalho
                    </Badge>
                  )}
                  
                  {isExtendedSession && (
                    <Badge variant="outline" className="text-xs">
                      ⏰ Sessão Estendida (+8h)
                    </Badge>
                  )}
                  
                  {sessionStats.isExtendedSession && (
                    <Badge variant="outline" className="text-xs">
                      🏆 Maratona de Trabalho!
                    </Badge>
                  )}
                </div>

                {/* Informações do sistema */}
                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                  <div>⚡ Sistema baseado em atividade real</div>
                  <div>🛡️ Logout apenas por inatividade ({inactivityTimeout}min)</div>
                  <div>✅ Sessões longas permitidas (12h+)</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 