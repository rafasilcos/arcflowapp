/**
 * 🎨 HOOK DO SISTEMA DE TEMAS DINÂMICOS
 * 
 * Gerencia temas claros/escuros e 6 variações de cores
 * Retorna classes CSS otimizadas para Tailwind
 */

import { useState, useEffect } from 'react';

export interface ThemeClasses {
  // Backgrounds
  background: string;
  card: string;
  cardSecondary: string;
  cardTertiary: string;
  backgroundPrimary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textPrimary: string;
  
  // Buttons
  buttonPrimary: string;
  buttonSecondary: string;
  buttonTertiary: string;
  
  // Interactive elements
  badge: string;
  progressBar: string;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  isDark: boolean;
}

const THEMES: Theme[] = [
  {
    name: 'light',
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#10B981',
    isDark: false
  },
  {
    name: 'dark',
    primary: '#60A5FA',
    secondary: '#818CF8',
    accent: '#34D399',
    isDark: true
  },
  {
    name: 'blue',
    primary: '#2563EB',
    secondary: '#1D4ED8',
    accent: '#0EA5E9',
    isDark: false
  },
  {
    name: 'purple',
    primary: '#7C3AED',
    secondary: '#6D28D9',
    accent: '#A855F7',
    isDark: false
  },
  {
    name: 'green',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10B981',
    isDark: false
  },
  {
    name: 'orange',
    primary: '#EA580C',
    secondary: '#DC2626',
    accent: '#F59E0B',
    isDark: false
  }
];

export function useThemeSystem() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);

  // Detectar preferência do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('arcflow_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      const theme = THEMES.find(t => t.name === savedTheme) || THEMES[0];
      setCurrentTheme(theme);
    } else if (systemPrefersDark) {
      setCurrentTheme(THEMES[1]); // dark theme
    }
  }, []);

  // Gerar classes CSS baseadas no tema
  const generateClasses = (theme: Theme): ThemeClasses => {
    if (theme.isDark) {
      return {
        background: 'bg-gray-900',
        card: 'bg-gray-800 border-gray-700',
        cardSecondary: 'bg-gray-700 border-gray-600',
        cardTertiary: 'bg-gray-600 border-gray-500',
        backgroundPrimary: 'bg-blue-600',
        
        text: 'text-white',
        textSecondary: 'text-gray-300',
        textPrimary: 'text-blue-400',
        
        buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
        buttonSecondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600',
        buttonTertiary: 'bg-transparent text-gray-300 hover:bg-gray-800 border border-gray-600',
        
        badge: 'bg-blue-900/30 text-blue-300 border border-blue-800',
        progressBar: 'bg-blue-600'
      };
    } else {
      return {
        background: 'bg-gray-50',
        card: 'bg-white border-gray-200',
        cardSecondary: 'bg-gray-50 border-gray-200',
        cardTertiary: 'bg-blue-50 border-blue-200',
        backgroundPrimary: 'bg-blue-600',
        
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textPrimary: 'text-blue-600',
        
        buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
        buttonSecondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
        buttonTertiary: 'bg-transparent text-gray-600 hover:bg-gray-100 border border-gray-300',
        
        badge: 'bg-blue-100 text-blue-800 border border-blue-200',
        progressBar: 'bg-blue-600'
      };
    }
  };

  const classes = generateClasses(currentTheme);

  const changeTheme = (themeName: string) => {
    const theme = THEMES.find(t => t.name === themeName) || THEMES[0];
    setCurrentTheme(theme);
    localStorage.setItem('arcflow_theme', theme.name);
  };

  return {
    theme: currentTheme,
    isDark: currentTheme.isDark,
    classes,
    availableThemes: THEMES,
    changeTheme
  };
}