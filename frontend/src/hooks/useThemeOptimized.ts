'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useMemo } from 'react'

// Hook otimizado para performance máxima
export function useThemeOptimized() {
  const { tema, temaId, isLoading } = useTheme()
  
  // Memoizar classes CSS para evitar recálculos
  const classes = useMemo(() => ({
    // Backgrounds
    bg: `bg-gradient-to-br ${tema.bg}`,
    sidebar: tema.sidebar,
    card: tema.card,
    
    // Textos
    text: tema.text,
    textSecondary: tema.textSecondary,
    
    // Gradientes
    gradiente: `bg-gradient-to-r ${tema.gradiente}`,
    gradienteHover: `bg-gradient-to-r ${tema.gradienteHover}`,
    
    // Cores diretas
    primaria: tema.primaria,
    secundaria: tema.secundaria,
    acento: tema.acento,
  }), [tema])
  
  // Memoizar estilos inline para evitar recriação de objetos
  const styles = useMemo(() => ({
    primary: { color: tema.primaria },
    secondary: { color: tema.secundaria },
    accent: { color: tema.acento },
    accentBorder: { 
      color: tema.acento, 
      borderColor: `${tema.acento}33` 
    },
  }), [tema])
  
  return {
    tema,
    temaId,
    isLoading,
    classes,
    styles,
    // Helpers rápidos
    isElegante: temaId === 'elegante',
    isProfissional: temaId === 'profissional',
  }
}

// Hook específico para componentes que só precisam das classes CSS
export function useThemeClasses() {
  const { classes, isLoading } = useThemeOptimized()
  return { classes, isLoading }
}

// Hook específico para componentes que só precisam dos estilos inline
export function useThemeStyles() {
  const { styles, isLoading } = useThemeOptimized()
  return { styles, isLoading }
} 