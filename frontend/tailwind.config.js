/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 🎨 CORES ARCFLOW
      colors: {
        // ---- TEMA ARCFLOW PROFESSIONAL ----
        'arcflow': {
          primary: {
            DEFAULT: '#0F62FE', // IBM Blue
            50: '#E5F0FF',
            100: '#CCE1FF', 
            200: '#99C3FF',
            300: '#66A5FF',
            400: '#3387FF',
            500: '#0F62FE',
            600: '#0043CE',
            700: '#003399',
            800: '#002266',
            900: '#001133',
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          accent: {
            purple: '#8B5CF6',
            teal: '#14B8A6',
          },
          sidebar: '#1E293B',
        },
        
        // ---- MARCA PRINCIPAL ----
        primary: {
          50: '#eff6ff',   
          100: '#dbeafe',  
          200: '#bfdbfe',  
          300: '#93c5fd',  
          400: '#60a5fa',  
          500: '#3b82f6',  // AZUL PRINCIPAL
          600: '#2563eb',  
          700: '#1d4ed8',  
          800: '#1e40af',  
          900: '#1e3a8a',  
          950: '#172554',  
        },

        // ---- CORES MÓDULOS ----
        // 📋 Briefing - Verde Esmeralda
        briefing: {
          primary: '#10b981',
          bg: '#ecfdf5',
        },
        
        // 📅 Agenda - Laranja Energia
        agenda: {
          primary: '#f59e0b',
          bg: '#fffbeb',
        },

        // 💰 Orçamentos - Dourado Premium
        orcamentos: {
          DEFAULT: '#eab308',
          50: '#fefce8',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },

        // 🏗️ Projetos - Azul Aço
        projetos: {
          DEFAULT: '#0891b2',
          50: '#f0f9ff',
          500: '#0891b2',
          600: '#0e7490',
          700: '#0f766e',
        },

        // 📊 Análise - Roxo Inteligência
        analise: {
          DEFAULT: '#9333ea',
          50: '#faf5ff',
          500: '#9333ea',
          600: '#9333ea',
          700: '#7c3aed',
        },

        // 💼 Comercial - Verde Negócios
        comercial: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          500: '#16a34a',
          600: '#16a34a',
          700: '#15803d',
        },

        // Cores por módulo
        produtividade: {
          primary: '#8b5cf6',
          bg: '#f3f4f6',
        },

        // ---- CORES SEMÂNTICAS ----
        success: {
          50: '#ecfdf5',
          500: '#10b981',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },

        // ---- NEUTROS REFINADOS ----
        neutral: {
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },

        // ---- ALIASES PARA CONTEXTOS ----
        background: '#ffffff',
        foreground: '#111827',
        muted: '#6b7280',
        'muted-foreground': '#9ca3af',
        border: '#e5e7eb',
        input: '#f9fafb',
        card: '#ffffff',
        'card-foreground': '#374151',
      },

      // 📝 TIPOGRAFIA PROFISSIONAL
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        // ---- DISPLAY (MARKETING) ----
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        
        // ---- HEADINGS (DASHBOARD) ----
        'h1': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h2': ['1.875rem', { lineHeight: '1.3' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.4' }],
        'h5': ['1.125rem', { lineHeight: '1.5' }],
        'h6': ['1rem', { lineHeight: '1.5' }],

        // ---- BODY TEXT ----
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
        
        // ---- INTERFACE ----
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },

      // 📏 ESPAÇAMENTO 4PT GRID
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
        '144': '36rem',   // 576px
      },

      // 🎭 BORDAS E ELEVAÇÃO
      borderRadius: {
        'xs': '0.125rem',
        '4xl': '2rem',
      },

      boxShadow: {
        // ---- ELEVAÇÃO SUTIL ----
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        
        // ---- SOMBRAS COLORIDAS ----
        'primary': '0 4px 14px 0 rgb(59 130 246 / 0.15)',
        'success': '0 4px 14px 0 rgb(34 197 94 / 0.15)',
        'warning': '0 4px 14px 0 rgb(245 158 11 / 0.15)',
        'error': '0 4px 14px 0 rgb(239 68 68 / 0.15)',

        // ---- FOCUS E INNER ----
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'focus': '0 0 0 3px rgb(59 130 246 / 0.1)',
      },

      // ⚡ ANIMAÇÕES FLUIDAS
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },

      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // 📱 BREAKPOINTS PERSONALIZADOS  
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },

      // 🎨 GRADIENTES
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        'gradient-card': 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      },

      // 🔤 ALTURA E LARGURA ESPECÍFICAS
      height: {
        'btn': '2.75rem',     // 44px
        'input': '2.75rem',   // 44px  
        'nav': '4rem',        // 64px
        'header': '5rem',     // 80px
      },

      minHeight: {
        'screen-mobile': '100dvh',  // Dynamic viewport height
      },

      // 📐 ASPECT RATIOS
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '21/9': '21 / 9',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    // Plugin para variáveis CSS customizadas
    function({ addBase, theme }) {
      addBase({
        ':root': {
          '--primary': theme('colors.primary.500'),
          '--primary-foreground': theme('colors.neutral.0'),
          '--background': theme('colors.background'),
          '--foreground': theme('colors.foreground'),
          '--muted': theme('colors.neutral.100'),
          '--muted-foreground': theme('colors.neutral.500'),
          '--border': theme('colors.border'),
          '--input': theme('colors.input'),
          '--radius': theme('borderRadius.md'),
        },
        
        // ---- DARK MODE ----
        '[data-theme="dark"]': {
          '--background': theme('colors.neutral.950'),
          '--foreground': theme('colors.neutral.50'),
          '--muted': theme('colors.neutral.800'),
          '--muted-foreground': theme('colors.neutral.400'),
          '--border': theme('colors.neutral.800'),
          '--input': theme('colors.neutral.800'),
        }
      })
    }
  ],
}
