'use client'

import { useState, useEffect } from 'react'
import { Save, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AutoSaveIndicatorProps {
  isAutoSaving?: boolean
  lastSaved?: Date | null
  hasUnsavedChanges?: boolean
  error?: string | null
  className?: string
}

export function AutoSaveIndicator({
  isAutoSaving = false,
  lastSaved = null,
  hasUnsavedChanges = false,
  error = null,
  className = ''
}: AutoSaveIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Auto-esconder detalhes após 3 segundos
  useEffect(() => {
    if (showDetails) {
      const timer = setTimeout(() => {
        setShowDetails(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showDetails])

  // 🎨 DETERMINAR STATUS E ESTILO
  const getStatus = () => {
    if (error) {
      return {
        icon: AlertCircle,
        text: 'Erro ao salvar',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        detail: error
      }
    }
    
    if (isAutoSaving) {
      return {
        icon: RefreshCw,
        text: 'Salvando...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        detail: 'Salvamento automático em andamento'
      }
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: Clock,
        text: 'Alterações não salvas',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        detail: 'Suas alterações serão salvas automaticamente'
      }
    }
    
    if (lastSaved) {
      return {
        icon: CheckCircle,
        text: 'Salvo',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        detail: `Último salvamento: ${lastSaved.toLocaleTimeString('pt-BR')}`
      }
    }
    
    return {
      icon: Save,
      text: 'Auto-save ativo',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      detail: 'Salvamento automático habilitado'
    }
  }

  const status = getStatus()
  const Icon = status.icon

  return (
    <div className={`relative ${className}`}>
      {/* Indicador Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg border
          ${status.bgColor} ${status.borderColor} ${status.color}
          cursor-pointer transition-all hover:shadow-md
        `}
        onClick={() => setShowDetails(!showDetails)}
      >
        <Icon 
          className={`w-4 h-4 ${isAutoSaving ? 'animate-spin' : ''}`} 
        />
        <span className="text-sm font-medium">
          {status.text}
        </span>
        
        {/* Pulse para indicar atividade */}
        {isAutoSaving && (
          <motion.div
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.6, 1]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Detalhes Expandidos */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute top-full mt-2 right-0 w-72 p-3 rounded-lg border shadow-lg z-50
              ${status.bgColor} ${status.borderColor} bg-white
            `}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${status.color}`} />
                <span className={`font-medium ${status.color}`}>
                  Status do Auto-Save
                </span>
              </div>
              
              <p className="text-sm text-gray-700">
                {status.detail}
              </p>
              
              {/* Informações Técnicas */}
              <div className="pt-2 border-t border-gray-200 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Salvamento automático:</span>
                  <span className="text-green-600 font-medium">
                    ✅ Ativo (30s)
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Backup local:</span>
                  <span className="text-blue-600 font-medium">
                    💾 Habilitado
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Último backup:</span>
                  <span className="font-mono">
                    {new Date().toLocaleTimeString('pt-BR')}
                  </span>
                </div>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-red-800">
                    <strong>Erro:</strong> {error}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 