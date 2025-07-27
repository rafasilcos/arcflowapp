'use client';

import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  delay?: number;
  key: string;
  enabled?: boolean;
}

export const useAutoSave = (
  data: any,
  options: UseAutoSaveOptions
) => {
  const { delay = 2000, key, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled || !data) return;

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Agendar novo auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        const dataToSave = {
          data,
          timestamp: new Date().toISOString(),
          version: '1.0'
        };
        localStorage.setItem(`arcflow_autosave_${key}`, JSON.stringify(dataToSave));
        console.log('💾 Auto-save realizado:', key);
      } catch (error) {
        console.warn('⚠️ Erro no auto-save:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, key, enabled]);

  // Função para recuperar dados salvos
  const loadAutoSavedData = () => {
    try {
      const saved = localStorage.getItem(`arcflow_autosave_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.data;
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar auto-save:', error);
    }
    return null;
  };

  // Função para limpar auto-save
  const clearAutoSave = () => {
    try {
      localStorage.removeItem(`arcflow_autosave_${key}`);
      console.log('🧹 Auto-save limpo:', key);
    } catch (error) {
      console.warn('⚠️ Erro ao limpar auto-save:', error);
    }
  };

  return {
    loadAutoSavedData,
    clearAutoSave
  };
}; 
 
 
 
 
 
 
 
 
 
 
 
 
 