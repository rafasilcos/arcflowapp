'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Info, X, Clock } from 'lucide-react'
import { toastManager } from '@/lib/toast-manager'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'session-expired'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function Toast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  action 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose(id), 300) // Wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        }
      case 'session-expired':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: Clock,
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-800',
          messageColor: 'text-orange-700'
        }
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        }
    }
  }

  const styles = getToastStyles()
  const IconComponent = styles.icon

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`
        relative w-full max-w-md mx-auto mb-4 p-4 rounded-lg border shadow-lg
        ${styles.bg}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Ícone */}
        <div className={`flex-shrink-0 ${styles.iconColor}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${styles.titleColor}`}>
            {title}
          </h4>
          <p className={`mt-1 text-sm ${styles.messageColor}`}>
            {message}
          </p>

          {/* Ação opcional */}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`
                  text-sm font-medium px-3 py-1 rounded-md transition-colors
                  ${type === 'session-expired' 
                    ? 'bg-orange-600 text-white hover:bg-orange-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {/* Botão fechar */}
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className={`flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors ${styles.iconColor}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progresso para toasts com duração */}
      {duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`
            absolute bottom-0 left-0 h-1 rounded-b-lg
            ${type === 'session-expired' ? 'bg-orange-400' : 'bg-current opacity-20'}
          `}
        />
      )}
    </motion.div>
  )
}

// Context para gerenciar toasts globalmente
interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
  showSessionExpired: (message: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }])
  }

  const showSessionExpired = (message: string) => {
    // Limpar toasts existentes para dar prioridade à sessão expirada
    setToasts([])
    
    showToast({
      type: 'session-expired',
      title: 'Sessão Expirada',
      message,
      duration: 8000, // 8 segundos para dar tempo de ler
      action: {
        label: 'Fazer Login',
        onClick: () => {
          window.location.href = '/auth/login'
        }
      }
    })
  }

  // 🔥 CONECTAR COM TOAST MANAGER GLOBAL
  useEffect(() => {
    console.log('🔗 [TOAST-PROVIDER] Registrando handlers com ToastManager')
    
    // Registrar handlers com o ToastManager
    toastManager.registerHandlers(
      (toast) => {
        showToast({
          type: toast.type,
          title: toast.title,
          message: toast.message,
          duration: toast.duration,
          action: toast.action
        })
      },
      showSessionExpired
    )
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, showSessionExpired }}>
      {children}
      
      {/* Container de toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
} 