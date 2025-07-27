'use client'

import { useState, useEffect } from 'react'

interface ControlsHelpProps {
  isMobile: boolean
  onClose?: () => void
}

export function ControlsHelp({ isMobile, onClose }: ControlsHelpProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShownHelp, setHasShownHelp] = useState(false)

  // Mostrar ajuda automaticamente na primeira visita
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('arcflow-controls-help-seen')
    if (!hasSeenHelp && !hasShownHelp) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasShownHelp(true)
      }, 3000) // Mostrar após 3 segundos

      return () => clearTimeout(timer)
    }
  }, [hasShownHelp])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('arcflow-controls-help-seen', 'true')
    onClose?.()
  }

  const handleToggle = () => {
    setIsVisible(!isVisible)
  }

  if (!isVisible) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 bg-blue-600/80 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
        title="Mostrar controles disponíveis"
      >
        <span className="text-lg">🎮</span>
      </button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      
      {/* Help Modal */}
      <div className="fixed inset-4 md:inset-auto md:bottom-4 md:right-4 md:w-96 z-50 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🎮 Controles Disponíveis
          </h3>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Controles de Teclado */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
              ⌨️ Teclado
            </h4>
            <div className="space-y-2 text-blue-100">
              <div className="flex justify-between">
                <span>↑ ↓ Setas</span>
                <span className="text-white/60">Navegar seções</span>
              </div>
              <div className="flex justify-between">
                <span>Page Up/Down</span>
                <span className="text-white/60">Navegar seções</span>
              </div>
              <div className="flex justify-between">
                <span>Espaço</span>
                <span className="text-white/60">Próxima seção</span>
              </div>
              <div className="flex justify-between">
                <span>Home/End</span>
                <span className="text-white/60">Primeira/Última</span>
              </div>
              <div className="flex justify-between">
                <span>1-8</span>
                <span className="text-white/60">Seção específica</span>
              </div>
            </div>
          </div>

          {/* Controles de Mouse */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
              🖱️ Mouse
            </h4>
            <div className="space-y-2 text-blue-100">
              <div className="flex justify-between">
                <span>Scroll suave</span>
                <span className="text-white/60">Controle manual</span>
              </div>
              <div className="flex justify-between">
                <span>Scroll rápido</span>
                <span className="text-white/60">Navegação auto</span>
              </div>
            </div>
          </div>

          {/* Controles Touch (Mobile) */}
          {isMobile && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                👆 Touch
              </h4>
              <div className="space-y-2 text-blue-100">
                <div className="flex justify-between">
                  <span>Swipe vertical</span>
                  <span className="text-white/60">Navegar seções</span>
                </div>
                <div className="flex justify-between">
                  <span>Swipe rápido</span>
                  <span className="text-white/60">Navegação acelerada</span>
                </div>
              </div>
            </div>
          )}

          {/* Navegação Visual */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-300 mb-3 flex items-center gap-2">
              🎯 Navegação
            </h4>
            <div className="space-y-2 text-blue-100">
              <div className="flex justify-between">
                <span>Indicadores laterais</span>
                <span className="text-white/60">Clique direto</span>
              </div>
              <div className="flex justify-between">
                <span>Scroll natural</span>
                <span className="text-white/60">Controle fluido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/60 text-center">
            💡 Dica: Use as setas do teclado para navegação rápida
          </p>
        </div>
      </div>
    </>
  )
}