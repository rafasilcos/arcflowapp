// ===== ARCFLOW DESIGN SYSTEM TOKENS =====
// Otimizado para uso prolongado (8-10h/dia) e 10k usuários simultâneos

export const designTokens = {
  // ===== TIPOGRAFIA HIERÁRQUICA =====
  typography: {
    display: "text-4xl font-bold tracking-tight leading-tight",
    h1: "text-3xl font-bold leading-tight",
    h2: "text-2xl font-semibold leading-snug", 
    h3: "text-xl font-medium leading-normal",
    h4: "text-lg font-medium leading-normal",
    body: "text-base font-normal leading-relaxed",
    caption: "text-sm font-normal leading-relaxed",
    micro: "text-xs font-medium leading-normal",
    code: "font-mono text-sm"
  },

  // ===== CORES OTIMIZADAS PARA FADIGA OCULAR =====
  colors: {
    // Primary - Azul suave para reduzir fadiga
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe', 
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Principal (menos saturado)
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },

    // Semantic Colors - Status claros
    semantic: {
      success: {
        50: '#f0fdf4',
        500: '#10b981',
        700: '#047857',
        900: '#064e3b'
      },
      warning: {
        50: '#fffbeb', 
        500: '#f59e0b',
        700: '#b45309',
        900: '#78350f'
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444', 
        700: '#b91c1c',
        900: '#7f1d1d'
      },
      info: {
        50: '#eef2ff',
        500: '#6366f1',
        700: '#4338ca',
        900: '#312e81'
      }
    },

    // Neutral - Escala otimizada para contraste WCAG AA
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5', 
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252', // Texto secundário
      700: '#404040',
      800: '#262626',
      900: '#171717', // Texto principal
      950: '#0a0a0a'
    },

    // Background gradients suaves
    gradients: {
      primarySubtle: 'from-blue-50 to-indigo-50',
      successSubtle: 'from-green-50 to-emerald-50',
      warningSubtle: 'from-amber-50 to-orange-50', 
      errorSubtle: 'from-red-50 to-rose-50'
    }
  },

  // ===== ESPAÇAMENTO SISTEMA 8PX =====
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem'      // 384px
  },

  // ===== BORDAS E RAIOS =====
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px  
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // ===== SOMBRAS SUAVES =====
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000'
  },

  // ===== BREAKPOINTS RESPONSIVOS =====
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // ===== Z-INDEX HIERARQUIA =====
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50', // Dropdowns
    60: '60', // Tooltips
    70: '70', // Modals
    80: '80', // Loading overlays
    90: '90', // Notifications
    100: '100' // Critical overlays
  },

  // ===== TRANSIÇÕES SUAVES =====
  transitions: {
    fast: '150ms ease-in-out',
    DEFAULT: '200ms ease-in-out', 
    slow: '300ms ease-in-out',
    slowest: '500ms ease-in-out'
  },

  // ===== CONFIGURAÇÕES DE ACESSIBILIDADE =====
  accessibility: {
    minTouchTarget: '44px', // Tamanho mínimo para touch
    focusRing: '2px solid #3b82f6',
    skipLinkOffset: '8px'
  }
} as const;

// ===== HELPER TYPES =====
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingScale = keyof typeof designTokens.spacing;
export type TypographyScale = keyof typeof designTokens.typography; 