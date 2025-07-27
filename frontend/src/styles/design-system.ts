/**
 * 🎨 ARCFLOW DESIGN SYSTEM
 * Sistema de design completo para o ArcFlow - SaaS para escritórios AEC
 * Identidade visual profissional, confiável e inovadora
 */

// 🎯 CONCEITO VISUAL
// - Profissional mas acessível
// - Inovador mas confiável  
// - Limpo e funcional
// - Premium sem ser elitista

export const arcflowDesignSystem = {
  // 🎨 PALETA DE CORES PRINCIPAL
  colors: {
    // ---- MARCA PRINCIPAL ----
    primary: {
      50: '#eff6ff',   // Azul muito claro - backgrounds sutis
      100: '#dbeafe',  // Azul claro - hovers suaves
      200: '#bfdbfe',  // Azul médio claro - borders
      300: '#93c5fd',  // Azul médio - elementos secundários
      400: '#60a5fa',  // Azul vibrante - interactive states
      500: '#3b82f6',  // AZUL PRINCIPAL - CTAs, links, brand
      600: '#2563eb',  // Azul escuro - hovers primary
      700: '#1d4ed8',  // Azul mais escuro - pressed states
      800: '#1e40af',  // Azul muito escuro - text emphasis
      900: '#1e3a8a',  // Azul quase preto - headers
      950: '#172554',  // Azul escuríssimo - dark mode
    },

    // ---- CORES FUNCIONAIS POR MÓDULO ----
    modules: {
      // 📋 Briefing - Verde Menta (Criatividade + Precisão)
      briefing: {
        primary: '#10b981',   // Verde esmeralda
        background: '#ecfdf5', // Verde muito claro
        border: '#a7f3d0',    // Verde claro
        text: '#047857',      // Verde escuro
      },
      
      // 📅 Agenda - Laranja Suave (Energia + Organização)  
      agenda: {
        primary: '#f97316',   // Laranja vibrante
        background: '#fff7ed', // Laranja muito claro
        border: '#fed7aa',    // Laranja claro
        text: '#c2410c',      // Laranja escuro
      },

      // 💰 Orçamentos - Dourado (Valor + Precisão)
      orcamentos: {
        primary: '#eab308',   // Amarelo dourado
        background: '#fefce8', // Amarelo muito claro
        border: '#fde047',    // Amarelo claro
        text: '#a16207',      // Dourado escuro
      },

      // 🏗️ Projetos - Azul Aço (Solidez + Confiança)
      projetos: {
        primary: '#0891b2',   // Azul cyan
        background: '#f0f9ff', // Azul muito claro
        border: '#7dd3fc',    // Azul cyan claro
        text: '#0e7490',      // Azul cyan escuro
      },

      // 📊 Análise - Roxo (Inteligência + Insights)
      analise: {
        primary: '#9333ea',   // Roxo vibrante
        background: '#faf5ff', // Roxo muito claro
        border: '#d8b4fe',    // Roxo claro
        text: '#7c3aed',      // Roxo escuro
      },

      // 💼 Comercial - Verde Negócios (Crescimento + Sucesso)
      comercial: {
        primary: '#16a34a',   // Verde negócios
        background: '#f0fdf4', // Verde muito claro
        border: '#bbf7d0',    // Verde claro
        text: '#15803d',      // Verde escuro
      }
    },

    // ---- CORES NEUTRAS (SISTEMA) ----
    neutral: {
      0: '#ffffff',     // Branco puro
      50: '#f9fafb',    // Cinza quase branco - backgrounds
      100: '#f3f4f6',   // Cinza muito claro - cards
      200: '#e5e7eb',   // Cinza claro - borders
      300: '#d1d5db',   // Cinza médio - dividers
      400: '#9ca3af',   // Cinza - placeholders
      500: '#6b7280',   // Cinza escuro - secondary text
      600: '#4b5563',   // Cinza mais escuro - body text
      700: '#374151',   // Cinza escuro - headings
      800: '#1f2937',   // Cinza muito escuro - emphasis
      900: '#111827',   // Quase preto - high contrast
      950: '#030712',   // Preto
    },

    // ---- CORES DE ESTADO ----
    semantic: {
      // ✅ Sucesso
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        700: '#15803d',
        bg: '#dcfce7',
        border: '#86efac',
      },

      // ⚠️ Atenção  
      warning: {
        50: '#fffbeb', 
        500: '#f59e0b',
        700: '#b45309',
        bg: '#fef3c7',
        border: '#fcd34d',
      },

      // 🚨 Erro
      error: {
        50: '#fef2f2',
        500: '#ef4444', 
        700: '#b91c1c',
        bg: '#fee2e2',
        border: '#fca5a5',
      },

      // ℹ️ Informação
      info: {
        50: '#eff6ff',
        500: '#3b82f6',
        700: '#1d4ed8', 
        bg: '#dbeafe',
        border: '#93c5fd',
      }
    }
  },

  // 📝 TIPOGRAFIA HIERÁRQUICA
  typography: {
    // ---- FAMÍLIAS DE FONTE ----
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],           // Principal - Interface
      display: ['Cal Sans', 'Inter', 'system-ui'],          // Headlines - Marketing
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],    // Código - Técnico
    },

    // ---- TAMANHOS E HIERARQUIA ----
    fontSize: {
      // Marketing & Landing
      'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 72px
      'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 60px
      'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],    // 48px
      
      // Headings - Dashboard
      'h1': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],         // 36px
      'h2': ['1.875rem', { lineHeight: '1.3' }],                                  // 30px
      'h3': ['1.5rem', { lineHeight: '1.4' }],                                    // 24px
      'h4': ['1.25rem', { lineHeight: '1.4' }],                                   // 20px
      'h5': ['1.125rem', { lineHeight: '1.5' }],                                  // 18px
      'h6': ['1rem', { lineHeight: '1.5' }],                                      // 16px

      // Body Text
      'body-lg': ['1.125rem', { lineHeight: '1.6' }],                            // 18px
      'body': ['1rem', { lineHeight: '1.6' }],                                   // 16px
      'body-sm': ['0.875rem', { lineHeight: '1.5' }],                           // 14px
      'body-xs': ['0.75rem', { lineHeight: '1.5' }],                            // 12px
      
      // Interface
      'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],    // 12px
      'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],    // 12px
    },

    // ---- PESOS DE FONTE ----
    fontWeight: {
      light: '300',
      normal: '400', 
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },

  // 📏 SISTEMA DE ESPAÇAMENTO
  spacing: {
    // ---- ESCALA 4pt GRID ----
    'xs': '0.25rem',    // 4px
    'sm': '0.5rem',     // 8px 
    'md': '0.75rem',    // 12px
    'lg': '1rem',       // 16px
    'xl': '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px
    '4xl': '2.5rem',    // 40px
    '5xl': '3rem',      // 48px
    '6xl': '4rem',      // 64px
    '7xl': '5rem',      // 80px
    '8xl': '6rem',      // 96px

    // ---- CONTAINERS ----
    container: {
      mobile: '100%',
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
    },

    // ---- COMPONENTES ----
    component: {
      padding: {
        btn: '0.75rem 1.5rem',      // Botões
        card: '1.5rem',             // Cards
        modal: '2rem',              // Modals
        section: '4rem 0',          // Seções
      },
      height: {
        btn: '2.75rem',             // 44px - Botões
        input: '2.75rem',           // 44px - Inputs
        nav: '4rem',                // 64px - Navigation
        header: '5rem',             // 80px - Page headers
      }
    }
  },

  // 🎭 BORDAS E RAIOS
  borderRadius: {
    none: '0',
    xs: '0.125rem',     // 2px
    sm: '0.25rem',      // 4px
    md: '0.375rem',     // 6px - Padrão componentes
    lg: '0.5rem',       // 8px - Cards
    xl: '0.75rem',      // 12px - Modals
    '2xl': '1rem',      // 16px - Containers
    '3xl': '1.5rem',    // 24px - Special
    full: '9999px',     // Pills/Badges
  },

  // 🌫️ SOMBRAS E ELEVAÇÃO
  boxShadow: {
    // ---- ELEVAÇÃO SUTIL ----
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',                                      // Hover suave
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',  // Cards
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // Dropdowns
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // Modals
    
    // ---- SOMBRAS COLORIDAS ----
    'primary': '0 4px 14px 0 rgb(59 130 246 / 0.15)',                           // Azul suave
    'success': '0 4px 14px 0 rgb(34 197 94 / 0.15)',                           // Verde suave  
    'warning': '0 4px 14px 0 rgb(245 158 11 / 0.15)',                          // Amarelo suave
    'error': '0 4px 14px 0 rgb(239 68 68 / 0.15)',                             // Vermelho suave

    // ---- INNER SHADOWS ----
    'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',                           // Inputs pressionados
    'focus': '0 0 0 3px rgb(59 130 246 / 0.1)',                                // Focus rings
  },

  // 🎨 GRADIENTES
  gradients: {
    // ---- GRADIENTES DE MARCA ----
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',              // Azul principal
    secondary: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',            // Verde secundário
    
    // ---- GRADIENTES SUTIS ----
    subtle: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',               // Cinza suave
    card: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',                 // Cards
    
    // ---- GRADIENTES DE ESTADO ----
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',              // Verde sucesso
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',              // Amarelo atenção
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',                // Vermelho erro
  },

  // 🔤 ESTADOS DE INTERAÇÃO
  states: {
    hover: {
      scale: '1.02',              // Suave crescimento
      brightness: '1.05',         // Leve clarear
      transition: 'all 0.2s ease-in-out',
    },
    focus: {
      ring: '0 0 0 3px rgb(59 130 246 / 0.1)',
      outline: 'none',
    },
    active: {
      scale: '0.98',              // Leve encolhimento  
      brightness: '0.95',         // Leve escurecer
    },
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    }
  },

  // 📱 BREAKPOINTS RESPONSIVOS
  screens: {
    'xs': '475px',              // Mobile pequeno
    'sm': '640px',              // Mobile
    'md': '768px',              // Tablet
    'lg': '1024px',             // Desktop pequeno
    'xl': '1280px',             // Desktop
    '2xl': '1536px',            // Desktop grande
  },

  // ⚡ TRANSIÇÕES E ANIMAÇÕES
  animation: {
    duration: {
      fast: '0.15s',            // Micro-interações
      normal: '0.25s',          // Padrão
      slow: '0.35s',            // Complexas
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',           // Padrão
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',           // Entrada
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',          // Saída
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Entrada/Saída
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce suave
    }
  }
}

// 🎯 TOKENS ESPECÍFICOS POR CONTEXTO
export const contextTokens = {
  // 🌐 PÚBLICO (Landing, Marketing)
  public: {
    background: arcflowDesignSystem.colors.neutral[0],
    text: arcflowDesignSystem.colors.neutral[900],
    accent: arcflowDesignSystem.colors.primary[500],
    muted: arcflowDesignSystem.colors.neutral[500],
  },

  // 🏢 DASHBOARD (Aplicação principal)
  dashboard: {
    background: arcflowDesignSystem.colors.neutral[50],
    surface: arcflowDesignSystem.colors.neutral[0], 
    border: arcflowDesignSystem.colors.neutral[200],
    text: arcflowDesignSystem.colors.neutral[700],
  },

  // ⚙️ ADMIN (Painel administrativo)
  admin: {
    background: arcflowDesignSystem.colors.neutral[900],
    surface: arcflowDesignSystem.colors.neutral[800],
    accent: arcflowDesignSystem.colors.primary[400],
    text: arcflowDesignSystem.colors.neutral[100],
  },

  // 👤 CLIENTE (Portal externo)
  client: {
    background: arcflowDesignSystem.colors.primary[50],
    surface: arcflowDesignSystem.colors.neutral[0],
    accent: arcflowDesignSystem.colors.primary[600],
    text: arcflowDesignSystem.colors.neutral[700],
  }
}

export default arcflowDesignSystem 