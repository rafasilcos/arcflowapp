// Gerenciador global de toasts para ser usado por APIs e serviços
interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info' | 'session-expired'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

class ToastManager {
  private toastHandler: ((toast: ToastMessage) => void) | null = null
  private sessionExpiredHandler: ((message: string) => void) | null = null
  
  // 🔥 THROTTLING - Evita spam de toasts
  private lastToastTime: Map<string, number> = new Map()
  private readonly THROTTLE_TIME = 3000 // 3 segundos
  private readonly MAX_TOASTS_PER_MINUTE = 10
  private toastCount: Map<string, number> = new Map()

  // Registrar handlers do ToastProvider
  registerHandlers(
    toastHandler: (toast: ToastMessage) => void,
    sessionExpiredHandler: (message: string) => void
  ) {
    this.toastHandler = toastHandler
    this.sessionExpiredHandler = sessionExpiredHandler
    
    // Limpar contadores a cada minuto
    setInterval(() => {
      this.toastCount.clear()
    }, 60000)
  }

  // 🚀 VERIFICAR THROTTLING - Otimizado para 10k usuários
  private shouldShowToast(type: string, message: string): boolean {
    if (typeof window === 'undefined') return false // SSR check
    
    const now = Date.now()
    const key = `${type}:${message}`
    
    // Verificar throttling por mensagem específica
    const lastTime = this.lastToastTime.get(key)
    if (lastTime && now - lastTime < this.THROTTLE_TIME) {
      console.log('🚫 [TOAST-MANAGER] Throttled:', key)
      return false
    }
    
    // Verificar limite de toasts por minuto
    const typeCount = this.toastCount.get(type) || 0
    if (typeCount >= this.MAX_TOASTS_PER_MINUTE) {
      console.log('🚫 [TOAST-MANAGER] Rate limit exceeded for:', type)
      return false
    }
    
    // Atualizar contadores
    this.lastToastTime.set(key, now)
    this.toastCount.set(type, typeCount + 1)
    
    return true
  }

  // Métodos públicos para mostrar toasts COM THROTTLING
  showSuccess(title: string, message: string, duration?: number) {
    if (!this.shouldShowToast('success', message)) return
    
    this.toastHandler?.({
      type: 'success',
      title,
      message,
      duration
    })
  }

  showError(title: string, message: string, duration?: number) {
    if (!this.shouldShowToast('error', message)) return
    
    this.toastHandler?.({
      type: 'error',
      title,
      message,
      duration
    })
  }

  showWarning(title: string, message: string, duration?: number) {
    if (!this.shouldShowToast('warning', message)) return
    
    this.toastHandler?.({
      type: 'warning',
      title,
      message,
      duration
    })
  }

  showInfo(title: string, message: string, duration?: number) {
    if (!this.shouldShowToast('info', message)) return
    
    this.toastHandler?.({
      type: 'info',
      title,
      message,
      duration
    })
  }

  // Método específico para sessão expirada
  showSessionExpired(message: string) {
    if (typeof window === 'undefined') return // SSR check
    
    console.log('🚨 [TOAST-MANAGER] Notificando sessão expirada:', message)
    this.sessionExpiredHandler?.(message)
  }

  // Método para erros de autenticação em APIs
  handleAuthError(errorCode: string, errorMessage?: string) {
    if (typeof window === 'undefined') return // SSR check
    
    let message = 'Sua sessão expirou por motivos de segurança.'
    
    switch (errorCode) {
      case 'SERVER_RESTART_REQUIRED_REAUTH':
        message = 'O servidor foi reiniciado. Faça login novamente.'
        break
      case 'TOKEN_EXPIRED':
        message = 'Sua sessão expirou. Faça login novamente.'
        break
      case 'INVALID_TOKEN':
        message = 'Token de acesso inválido. Faça login novamente.'
        break
      case 'MISSING_TOKEN':
        message = 'Token de acesso ausente. Faça login novamente.'
        break
      case 'USER_NOT_FOUND_OR_INACTIVE':
        message = 'Usuário inativo ou não encontrado. Faça login novamente.'
        break
      default:
        message = errorMessage || 'Erro de autenticação. Faça login novamente.'
    }
    
    this.showSessionExpired(message)
  }

  // Fallback para casos onde o toast não está disponível
  private fallbackAlert(message: string) {
    if (typeof window !== 'undefined') {
      alert(message)
    }
  }
}

// Instância singleton
export const toastManager = new ToastManager()

// Função utilitária para notificações rápidas
export const notify = {
  success: (title: string, message: string) => toastManager.showSuccess(title, message),
  error: (title: string, message: string) => toastManager.showError(title, message),
  warning: (title: string, message: string) => toastManager.showWarning(title, message),
  info: (title: string, message: string) => toastManager.showInfo(title, message),
  sessionExpired: (message: string) => toastManager.showSessionExpired(message),
  authError: (code: string, message?: string) => toastManager.handleAuthError(code, message)
} 