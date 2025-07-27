// ===== UTILITÁRIOS DE PERFORMANCE ARCFLOW =====

/**
 * Debounce - Evita execução excessiva de funções
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle - Limita execução de funções por tempo
 */
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Cache Manager - Gerenciamento inteligente de cache local
 */
export const CacheManager = {
  set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`arcflow_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(`arcflow_${key}`);
      if (!item) return null;
      
      const { data, timestamp, ttl } = JSON.parse(item);
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`arcflow_${key}`);
        return null;
      }
      return data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  },
  
  clear: (pattern?: string) => {
    try {
      if (pattern) {
        Object.keys(localStorage)
          .filter(key => key.includes(pattern))
          .forEach(key => localStorage.removeItem(key));
      } else {
        Object.keys(localStorage)
          .filter(key => key.startsWith('arcflow_'))
          .forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Cache clear failed:', error);
    }
  },
  
  getStats: () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('arcflow_'));
      const totalSize = keys.reduce((acc, key) => {
        return acc + (localStorage.getItem(key)?.length || 0);
      }, 0);
      
      return {
        totalItems: keys.length,
        totalSizeKB: Math.round(totalSize / 1024),
        keys: keys.map(key => key.replace('arcflow_', ''))
      };
    } catch (error) {
      console.warn('Cache stats failed:', error);
      return { totalItems: 0, totalSizeKB: 0, keys: [] };
    }
  }
};

/**
 * Performance Monitor - Monitora performance da aplicação
 */
export const PerformanceMonitor = {
  trackPageLoad: (pageName: string) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        console.log(`📊 Performance - ${pageName}:`, {
          loadTime: `${loadTime.toFixed(2)}ms`,
          domContentLoaded: `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        });
        
        // Em produção: enviar para analytics
        if (process.env.NODE_ENV === 'production') {
          // Analytics tracking aqui
        }
      });
    }
  },
  
  trackUserInteraction: (action: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) { // Log apenas interações lentas
        console.warn(`⚠️ Slow interaction - ${action}: ${duration.toFixed(2)}ms`);
      }
      
      // Em produção: enviar para analytics
      if (process.env.NODE_ENV === 'production') {
        // Analytics tracking aqui
      }
    };
  },
  
  trackMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
        jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
      };
    }
    return null;
  }
};

/**
 * Lazy Loading Helper - Para componentes pesados
 */
export const createLazyComponent = (importFunc: () => Promise<any>, fallback?: React.ComponentType) => {
  const LazyComponent = React.lazy(importFunc);
  
  return function LazyWrapper(props: any) {
    return React.createElement(
      React.Suspense, 
      { fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Carregando...') },
      React.createElement(LazyComponent, props)
    );
  };
};

/**
 * Virtual Scrolling Helper - Para listas grandes
 */
export const VirtualList = {
  calculateVisibleItems: (
    containerHeight: number,
    itemHeight: number,
    scrollTop: number,
    totalItems: number,
    overscan: number = 5
  ) => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      totalItems - 1
    );
    
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(totalItems - 1, visibleEnd + overscan);
    
    return {
      start,
      end,
      visibleStart,
      visibleEnd,
      offsetY: start * itemHeight
    };
  }
};

/**
 * Error Tracking - Para monitoramento de erros
 */
export const ErrorTracker = {
  captureException: (error: Error, context?: any) => {
    console.error('🚨 Error captured:', error, context);
    
    // Em desenvolvimento: log detalhado
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
      console.error('Context:', context);
    }
    
    // Em produção: enviar para Sentry ou similar
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: context });
    }
  },
  
  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    console[level === 'info' ? 'log' : level === 'warning' ? 'warn' : 'error'](`📝 ${message}`);
    
    // Em produção: enviar para Sentry
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureMessage(message, level);
    }
  }
};

/**
 * Backup Service - Para recuperação de dados
 */
export const BackupService = {
  autoSave: (key: string, data: any, interval: number = 30000) => {
    const intervalId = setInterval(() => {
      try {
        CacheManager.set(`backup_${key}`, {
          data,
          timestamp: Date.now(),
          version: '1.0'
        }, 24 * 60 * 60 * 1000); // 24h TTL
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, interval);
    
    return () => clearInterval(intervalId);
  },
  
  restore: (key: string) => {
    try {
      const backup = CacheManager.get(`backup_${key}`);
      return backup?.data || null;
    } catch (error) {
      console.warn('Restore failed:', error);
      return null;
    }
  },
  
  clearBackups: () => {
    CacheManager.clear('backup_');
  }
};

/**
 * API Optimization - Para chamadas de API eficientes
 */
export const APIOptimizer = {
  createRequestQueue: (maxConcurrent: number = 5) => {
    const queue: Array<() => Promise<any>> = [];
    const running: Set<Promise<any>> = new Set();
    
    const processQueue = async () => {
      if (queue.length === 0 || running.size >= maxConcurrent) {
        return;
      }
      
      const request = queue.shift();
      if (!request) return;
      
      const promise = request();
      running.add(promise);
      
      try {
        await promise;
      } finally {
        running.delete(promise);
        processQueue(); // Process next in queue
      }
    };
    
    return {
      add: (request: () => Promise<any>) => {
        queue.push(request);
        processQueue();
      },
      getStats: () => ({
        queued: queue.length,
        running: running.size
      })
    };
  }
};

// React import para lazy components
import React from 'react'; 