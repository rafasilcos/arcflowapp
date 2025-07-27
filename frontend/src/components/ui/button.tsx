'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 🎨 VARIANTES DO BOTÃO ARCFLOW
const buttonVariants = cva(
  // ---- BASE STYLES ----
  "inline-flex items-center justify-center rounded-md text-body font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      // ---- VARIANTES PRINCIPAIS ----
      variant: {
        // 🔵 Primary - Ação principal
        primary: "bg-primary-500 text-white shadow-primary hover:bg-primary-600 hover:scale-[1.02] hover:shadow-lg",
        
        // 🟢 Secondary - Ação secundária  
        secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-[1.02]",
        
        // 🔴 Destructive - Ações destrutivas
        destructive: "bg-error-500 text-white shadow-error hover:bg-error-600 hover:scale-[1.02]",
        
        // 👻 Ghost - Ação sutil
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        
        // 🖇️ Link - Parece link
        link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600",
        
        // 📋 Outline - Com borda
        outline: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-400",

        // ---- VARIANTES ESPECIAIS DOS MÓDULOS ----
        
        // 📋 Briefing - Verde esmeralda
        briefing: "bg-briefing-500 text-white shadow-success hover:bg-briefing-600 hover:scale-[1.02]",
        
        // 📅 Agenda - Laranja energia
        agenda: "bg-agenda-500 text-white shadow-warning hover:bg-agenda-600 hover:scale-[1.02]",
        
        // 💰 Orçamentos - Dourado premium
        orcamentos: "bg-orcamentos-500 text-white shadow-warning hover:bg-orcamentos-600 hover:scale-[1.02]",
        
        // 🏗️ Projetos - Azul aço
        projetos: "bg-projetos-500 text-white shadow-primary hover:bg-projetos-600 hover:scale-[1.02]",
        
        // 📊 Análise - Roxo inteligência
        analise: "bg-analise-500 text-white shadow-lg hover:bg-analise-600 hover:scale-[1.02]",
        
        // 💼 Comercial - Verde negócios
        comercial: "bg-comercial-500 text-white shadow-success hover:bg-comercial-600 hover:scale-[1.02]",
      },
      
      // ---- TAMANHOS ----
      size: {
        sm: "h-8 px-3 text-body-sm",         // Pequeno
        md: "h-btn px-6 text-body",          // Padrão (44px)
        lg: "h-12 px-8 text-body-lg",        // Grande  
        xl: "h-14 px-10 text-h6",            // Extra grande
        icon: "h-btn w-btn p-0",             // Quadrado para ícones
      },
      
      // ---- LARGURA ----
      width: {
        auto: "w-auto",
        full: "w-full",
        fit: "w-fit",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      width: "auto",
    },
  }
)

// 🏷️ TIPOS TYPESCRIPT
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// 🧩 COMPONENTE BUTTON
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    width,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    // Remove asChild from props to prevent it from being passed to DOM
    const { asChild: _, ...domProps } = props as any
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...domProps}
      >
        {/* 🔄 Loading Spinner */}
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* 👈 Left Icon */}
        {leftIcon && !loading && (
          <span className="mr-2 flex items-center">
            {leftIcon}
          </span>
        )}
        
        {/* 📝 Children Content */}
        {children}
        
        {/* 👉 Right Icon */}
        {rightIcon && (
          <span className="ml-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants } 