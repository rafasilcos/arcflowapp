'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, 
  Save, 
  Clock, 
  Users, 
  Wifi, 
  WifiOff, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEnterprise } from '@/contexts/EnterpriseContext'

interface EnterpriseStatusBarProps {
  compact?: boolean
  position?: 'top' | 'bottom'
  className?: string
}

export function EnterpriseStatusBar({ 
  compact = false, 
  position = 'top',
  className = '' 
}: EnterpriseStatusBarProps) {
  const enterprise = useEnterprise()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // 🚨 ALERTAS DE SESSÃO
  useEffect(() => {
    const timeRemaining = enterprise.sessionStatus.timeRemaining
    const shouldWarn = timeRemaining <= 300 && timeRemaining > 0 // 5 minutos

    if (shouldWarn && !showWarning) {
      setShowWarning(true)
      setIsExpanded(true) // Expandir automaticamente em aviso
    } else if (!shouldWarn && showWarning) {
      setShowWarning(false)
    }
  }, [enterprise.sessionStatus.timeRemaining, showWarning])

  // 🎨 DETERMINAR STATUS GERAL
  const getOverallStatus = () => {
    if (!enterprise.sessionStatus.isActive) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        text: 'Sessão Expirada'
      }
    }

    if (showWarning) {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: Clock,
        text: 'Sessão Expirando'
      }
    }

    if (enterprise.sessionStatus.isExtendedSession) {
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: Activity,
        text: 'Sessão Estendida'
      }
    }

    return {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      text: 'Sistema Ativo'
    }
  }

  const status = getOverallStatus()
  const StatusIcon = status.icon

  // Versão compacta (barra superior)
  if (compact) {
    return (
      <motion.div
        initial={{ y: position === 'top' ? -50 : 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${className}`}
      >
        <div className={`${status.bgColor} ${status.borderColor} border-b px-4 py-2`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Status Principal */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`w-4 h-4 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>

              {/* Tempo Ativo */}
              <div className="flex items-center space-x-1 text-gray-600">
                <Activity className="w-3 h-3" />
                <span className="text-xs">
                  {enterprise.utils.formatTime(enterprise.sessionStatus.totalActiveTime)}
                </span>
              </div>

              {/* Multi-tab */}
              {enterprise.multiTab.tabCount > 1 && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">{enterprise.multiTab.tabCount} abas</span>
                </div>
              )}
            </div>

            {/* Ações Rápidas */}
            <div className="flex items-center space-x-2">
              {/* Aviso de Sessão */}
              {showWarning && (
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  {Math.ceil(enterprise.sessionStatus.timeRemaining / 60)}min restante
                </Badge>
              )}

              {/* Botão Expandir */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 px-2"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Painel Expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${status.bgColor} border-b overflow-hidden`}
            >
              <div className="max-w-7xl mx-auto p-4">
                <EnterpriseDetailedStatus enterprise={enterprise} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Versão completa (widget lateral ou modal)
  return (
    <Card className={`${status.bgColor} ${status.borderColor} border ${className}`}>
      <CardContent className="p-4">
        <EnterpriseDetailedStatus enterprise={enterprise} showHeader />
      </CardContent>
    </Card>
  )
}

// 📊 COMPONENTE DE STATUS DETALHADO
function EnterpriseDetailedStatus({ 
  enterprise, 
  showHeader = false 
}: { 
  enterprise: any
  showHeader?: boolean 
}) {
  const productivity = enterprise.utils.getProductivityStats()

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center space-x-2 border-b pb-2">
          <Shield className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">
            Status Enterprise
          </span>
        </div>
      )}

      {/* Métricas em Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Sessão */}
        <div className="space-y-1">
          <span className="text-gray-600 font-medium">Sessão</span>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Tempo ativo:</span>
              <span className="font-medium">
                {enterprise.utils.formatTime(enterprise.sessionStatus.totalActiveTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge variant="outline" className="text-xs">
                {enterprise.sessionStatus.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Multi-tab */}
        <div className="space-y-1">
          <span className="text-gray-600 font-medium">Multi-tab</span>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Abas abertas:</span>
              <span className="font-medium">{enterprise.multiTab.tabCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Aba ativa:</span>
              <Badge variant="outline" className="text-xs">
                {enterprise.multiTab.isActiveTab ? 'Sim' : 'Não'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Produtividade */}
        <div className="space-y-1">
          <span className="text-gray-600 font-medium">Produtividade</span>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Sessões hoje:</span>
              <span className="font-medium">{productivity.sessionsToday}</span>
            </div>
            <div className="flex justify-between">
              <span>Horário de pico:</span>
              <span className="font-medium">{productivity.peakProductivityHour}h</span>
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="space-y-1">
          <span className="text-gray-600 font-medium">Sistema</span>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Horário comercial:</span>
              <Badge variant="outline" className="text-xs">
                {enterprise.utils.isWorkingHours() ? 'Sim' : 'Não'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Auto-save:</span>
              <Badge variant="outline" className="text-xs text-green-700">
                Ativo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="pt-2 border-t space-y-2">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => enterprise.extendSession()}
            className="flex-1 text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Estender Sessão
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => enterprise.autoSave.forceSave()}
            className="flex-1 text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Salvar Tudo
          </Button>
        </div>

        {/* Informações do Sistema */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>⚡ Enterprise features ativas</div>
          <div>🛡️ Logout por inatividade: 30min</div>
          <div>💾 Auto-save: 30s (inteligente)</div>
          <div>🔄 Sync multi-aba: Ativo</div>
        </div>
      </div>
    </div>
  )
}

// 🎛️ COMPONENTE FLUTUANTE PARA SITUAÇÕES CRÍTICAS
export function EnterpriseFloatingAlert({ 
  type, 
  message, 
  onAction, 
  onDismiss 
}: {
  type: 'warning' | 'error' | 'info'
  message: string
  onAction?: () => void
  onDismiss?: () => void
}) {
  const getAlertStyle = () => {
    switch (type) {
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: AlertTriangle
        }
      case 'warning':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          icon: Clock
        }
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: Shield
        }
    }
  }

  const alertStyle = getAlertStyle()
  const Icon = alertStyle.icon

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className={`${alertStyle.bgColor} ${alertStyle.borderColor} border shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className={`w-5 h-5 ${alertStyle.textColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`text-sm ${alertStyle.textColor} mb-3`}>
                {message}
              </p>
              <div className="flex space-x-2">
                {onAction && (
                  <Button size="sm" onClick={onAction}>
                    Ação
                  </Button>
                )}
                {onDismiss && (
                  <Button size="sm" variant="outline" onClick={onDismiss}>
                    Dispensar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 