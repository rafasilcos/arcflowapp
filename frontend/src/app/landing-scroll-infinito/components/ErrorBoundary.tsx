'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  enableRecovery?: boolean
  maxRetries?: number
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
  isRecovering: boolean
  fallbackMode: 'none' | 'css' | 'minimal' | 'static'
}

export class AnimationErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null
  private errorCount = 0

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false,
      retryCount: 0,
      isRecovering: false,
      fallbackMode: 'none'
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.errorCount += 1
    
    console.error('🚨 Animation Error Boundary caught error:', error, errorInfo)
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Determine fallback mode based on error type and count
    let fallbackMode: State['fallbackMode'] = 'css'
    
    if (error.message?.includes('GSAP') || error.message?.includes('ScrollTrigger')) {
      fallbackMode = 'css'
      document.documentElement.classList.add('gsap-fallback')
      console.warn('⚠️ GSAP error detected, switching to CSS fallback')
    } else if (error.message?.includes('animation') || error.message?.includes('transform')) {
      fallbackMode = 'minimal'
      document.documentElement.classList.add('minimal-animations')
      console.warn('⚠️ Animation error detected, switching to minimal mode')
    } else if (this.errorCount >= 3) {
      fallbackMode = 'static'
      document.documentElement.classList.add('animations-disabled')
      console.warn('⚠️ Multiple errors detected, disabling animations')
    }

    this.setState({ 
      errorInfo,
      fallbackMode,
      retryCount: this.state.retryCount + 1
    })

    // Attempt automatic recovery if enabled
    if (this.props.enableRecovery && this.state.retryCount < (this.props.maxRetries || 3)) {
      this.attemptRecovery()
    }
  }

  attemptRecovery = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    this.setState({ isRecovering: true })
    
    console.log('🔄 Attempting error recovery...')

    this.retryTimeout = setTimeout(() => {
      try {
        // Clear error state and attempt to recover
        this.setState({ 
          hasError: false, 
          error: undefined, 
          errorInfo: undefined,
          isRecovering: false
        })
        
        console.log('✅ Error recovery completed')
      } catch (recoveryError) {
        console.error('❌ Recovery failed:', recoveryError)
        this.setState({ isRecovering: false })
      }
    }, 2000)
  }

  handleManualRetry = () => {
    this.attemptRecovery()
  }

  handleReload = () => {
    window.location.reload()
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  renderFallbackUI() {
    const { error, errorInfo, retryCount, isRecovering, fallbackMode } = this.state
    const maxRetries = this.props.maxRetries || 3
    const canRetry = this.props.enableRecovery && retryCount < maxRetries

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-x-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-8">
          {/* Logo/Title */}
          <h1 className="text-[clamp(3rem,10vw,6rem)] font-black mb-6 font-sans bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ARCFLOW
          </h1>
          
          {/* Error Status */}
          <div className="glass-card p-8 rounded-3xl mb-8">
            <div className="text-yellow-400 text-4xl mb-4">⚠️</div>
            
            {isRecovering ? (
              <>
                <h2 className="text-2xl font-bold mb-4 text-blue-200">Recuperando sistema...</h2>
                <div className="animate-pulse text-lg text-blue-300 mb-6">
                  Tentando restaurar as animações...
                </div>
                <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-blue-200">
                  Sistema de animação temporariamente indisponível
                </h2>
                
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Detectamos um problema com as animações avançadas. 
                  {fallbackMode === 'css' && ' Ativamos o modo de compatibilidade CSS.'}
                  {fallbackMode === 'minimal' && ' Ativamos o modo simplificado.'}
                  {fallbackMode === 'static' && ' Ativamos o modo estático para máxima estabilidade.'}
                </p>

                {/* Error Details (Development) */}
                {process.env.NODE_ENV === 'development' && error && (
                  <details className="text-left bg-black/30 p-4 rounded-lg mb-6 text-sm">
                    <summary className="cursor-pointer text-red-300 font-medium mb-2">
                      Detalhes técnicos (desenvolvimento)
                    </summary>
                    <div className="text-red-200 font-mono">
                      <div className="mb-2"><strong>Erro:</strong> {error.message}</div>
                      <div className="mb-2"><strong>Tentativas:</strong> {retryCount}/{maxRetries}</div>
                      <div className="mb-2"><strong>Modo:</strong> {fallbackMode}</div>
                      {errorInfo && (
                        <div className="text-xs text-gray-400 mt-2 max-h-32 overflow-y-auto">
                          {errorInfo.componentStack}
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {canRetry && (
                    <button 
                      onClick={this.handleManualRetry}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
                    >
                      Tentar novamente
                    </button>
                  )}
                  
                  <button 
                    onClick={this.handleReload}
                    className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium transition-colors border border-white/20"
                  >
                    Recarregar página
                  </button>
                </div>

                {/* Continue Link */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-200 mb-4">
                    Ou continue para a plataforma sem animações:
                  </p>
                  <a 
                    href="/onboarding/perfil"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Acessar ArcFlow
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="glass-card p-4 rounded-lg">
              <div className="text-blue-300 mb-1">Sistema Principal</div>
              <div className="text-green-400 font-medium">✅ Funcionando</div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-blue-300 mb-1">Animações</div>
              <div className="text-yellow-400 font-medium">
                {fallbackMode === 'css' && '🎨 CSS Fallback'}
                {fallbackMode === 'minimal' && '⚡ Modo Simples'}
                {fallbackMode === 'static' && '🚫 Desabilitado'}
                {fallbackMode === 'none' && '✅ Normal'}
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="text-blue-300 mb-1">Funcionalidades</div>
              <div className="text-green-400 font-medium">✅ Disponíveis</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderFallbackUI()
    }

    return this.props.children
  }
}

// Convenience wrapper with default props
export function AnimationErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return (
    <AnimationErrorBoundary 
      enableRecovery={true}
      maxRetries={3}
      onError={(error, errorInfo) => {
        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
          console.error('Production animation error:', { error, errorInfo })
          // TODO: Send to error tracking service
        }
      }}
    >
      {children}
    </AnimationErrorBoundary>
  )
}