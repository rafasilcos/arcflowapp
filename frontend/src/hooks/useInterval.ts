'use client';

import { useEffect, useRef, useCallback } from 'react';

// Hook seguro para intervals que previne memory leaks
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Salvar callback mais recente
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configurar interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      intervalRef.current = global.setInterval(tick, delay);
      
      return () => {
        if (intervalRef.current) {
          global.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [delay]);

  // Função para limpar manualmente
  const clearIntervalManually = useCallback(() => {
    if (intervalRef.current) {
      global.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { clearInterval: clearIntervalManually };
}

// Hook para timeout seguro
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      timeoutRef.current = global.setTimeout(tick, delay);
      
      return () => {
        if (timeoutRef.current) {
          global.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [delay]);

  const clearTimeoutManually = useCallback(() => {
    if (timeoutRef.current) {
      global.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { clearTimeout: clearTimeoutManually };
}

// Hook para múltiplos intervals com cleanup automático
export function useMultipleIntervals() {
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setIntervalSafe = useCallback((id: string, callback: () => void, delay: number): NodeJS.Timeout => {
    // Limpar interval existente se houver
    const existingInterval = intervalsRef.current.get(id);
    if (existingInterval) {
      global.clearInterval(existingInterval);
    }

    // Criar novo interval
    const intervalId = global.setInterval(callback, delay);
    intervalsRef.current.set(id, intervalId);

    return intervalId;
  }, []);

  const clearIntervalSafe = useCallback((id: string) => {
    const intervalId = intervalsRef.current.get(id);
    if (intervalId) {
      global.clearInterval(intervalId);
      intervalsRef.current.delete(id);
    }
  }, []);

  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach((intervalId) => {
      global.clearInterval(intervalId);
    });
    intervalsRef.current.clear();
  }, []);

  // Cleanup automático ao desmontar
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  return {
    setInterval: setIntervalSafe,
    clearInterval: clearIntervalSafe,
    clearAllIntervals,
    activeIntervals: Array.from(intervalsRef.current.keys())
  };
} 

import { useEffect, useRef, useCallback } from 'react';

// Hook seguro para intervals que previne memory leaks
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Salvar callback mais recente
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configurar interval
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      intervalRef.current = global.setInterval(tick, delay);
      
      return () => {
        if (intervalRef.current) {
          global.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [delay]);

  // Função para limpar manualmente
  const clearIntervalManually = useCallback(() => {
    if (intervalRef.current) {
      global.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { clearInterval: clearIntervalManually };
}

// Hook para timeout seguro
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      timeoutRef.current = global.setTimeout(tick, delay);
      
      return () => {
        if (timeoutRef.current) {
          global.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [delay]);

  const clearTimeoutManually = useCallback(() => {
    if (timeoutRef.current) {
      global.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { clearTimeout: clearTimeoutManually };
}

// Hook para múltiplos intervals com cleanup automático
export function useMultipleIntervals() {
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setIntervalSafe = useCallback((id: string, callback: () => void, delay: number): NodeJS.Timeout => {
    // Limpar interval existente se houver
    const existingInterval = intervalsRef.current.get(id);
    if (existingInterval) {
      global.clearInterval(existingInterval);
    }

    // Criar novo interval
    const intervalId = global.setInterval(callback, delay);
    intervalsRef.current.set(id, intervalId);

    return intervalId;
  }, []);

  const clearIntervalSafe = useCallback((id: string) => {
    const intervalId = intervalsRef.current.get(id);
    if (intervalId) {
      global.clearInterval(intervalId);
      intervalsRef.current.delete(id);
    }
  }, []);

  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach((intervalId) => {
      global.clearInterval(intervalId);
    });
    intervalsRef.current.clear();
  }, []);

  // Cleanup automático ao desmontar
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  return {
    setInterval: setIntervalSafe,
    clearInterval: clearIntervalSafe,
    clearAllIntervals,
    activeIntervals: Array.from(intervalsRef.current.keys())
  };
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 