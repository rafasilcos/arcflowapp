// Sistema de Monitoramento de Performance para 150k usuários
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
  page: string;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private userId?: string;
  private isMonitoring = false;
  private batchSize = 10;
  private flushInterval = 30000; // 30 segundos
  private observer?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getCurrentUserId();
    
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || undefined;
    }
    return undefined;
  }

  private initializeMonitoring() {
    // Monitorar Web Vitals
    this.observeWebVitals();
    
    // Monitorar recursos
    this.observeResourceTiming();
    
    // Monitorar navegação
    this.observeNavigationTiming();
    
    // Monitorar memória
    this.startMemoryMonitoring();
    
    // Monitorar conexão de rede
    this.monitorNetworkInfo();
    
    // Flush periódico de métricas
    this.startPeriodicFlush();
    
    // Flush ao sair da página
    this.setupPageUnloadFlush();
  }

  private observeWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entry: any) => {
      this.recordMetric('LCP', entry.renderTime || entry.loadTime);
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entry: any) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime);
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entry: any) => {
      if (!entry.hadRecentInput) {
        this.recordMetric('CLS', entry.value);
      }
    });
  }

  private observeResourceTiming() {
    this.observePerformanceEntry('resource', (entry: PerformanceResourceTiming) => {
      // Monitorar apenas recursos críticos
      if (this.isCriticalResource(entry.name)) {
        this.recordMetric('resource-load-time', entry.responseEnd - entry.startTime, {
          resourceName: entry.name,
          resourceType: entry.initiatorType
        });
      }
    });
  }

  private observeNavigationTiming() {
    this.observePerformanceEntry('navigation', (entry: PerformanceNavigationTiming) => {
      // Time to First Byte
      this.recordMetric('TTFB', entry.responseStart - entry.requestStart);
      
      // DOM Content Loaded
      this.recordMetric('DCL', entry.domContentLoadedEventEnd - entry.fetchStart);
      
      // Load Complete
      this.recordMetric('Load', entry.loadEventEnd - entry.fetchStart);
    });
  }

  private observePerformanceEntry(entryType: string, callback: (entry: any) => void) {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      observer.observe({ entryTypes: [entryType] });
      
      if (!this.observer) {
        this.observer = observer;
      }
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  private isCriticalResource(url: string): boolean {
    const criticalPatterns = [
      '/api/',
      '.js',
      '.css',
      '/dashboard',
      '/briefing'
    ];
    
    return criticalPatterns.some(pattern => url.includes(pattern));
  }

  private startMemoryMonitoring() {
    if (!('memory' in performance)) return;

    const monitorMemory = () => {
      const memory = (performance as any).memory as MemoryInfo;
      
      this.recordMetric('memory-used', memory.usedJSHeapSize);
      this.recordMetric('memory-total', memory.totalJSHeapSize);
      this.recordMetric('memory-limit', memory.jsHeapSizeLimit);
      
      // Calcular porcentagem de uso
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      this.recordMetric('memory-usage-percent', usagePercent);
      
      // Alerta se uso de memória alto
      if (usagePercent > 80) {
        console.warn('High memory usage detected:', usagePercent.toFixed(2) + '%');
      }
    };

    // Monitorar a cada 10 segundos
    setInterval(monitorMemory, 10000);
    monitorMemory(); // Primeira medição
  }

  private monitorNetworkInfo() {
    if (!('connection' in navigator)) return;

    const connection = (navigator as any).connection as NetworkInfo;
    
    this.recordMetric('network-effective-type', 0, {
      effectiveType: connection.effectiveType
    });
    
    this.recordMetric('network-downlink', connection.downlink);
    this.recordMetric('network-rtt', connection.rtt);
    
    // Monitorar mudanças na conexão
    if ('addEventListener' in connection) {
      (connection as any).addEventListener('change', () => {
        this.recordMetric('network-change', Date.now(), {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  private recordMetric(name: string, value: number, metadata?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: window.location.pathname,
      ...metadata
    };

    this.metrics.push(metric);

    // Flush se atingiu o tamanho do batch
    if (this.metrics.length >= this.batchSize) {
      this.flushMetrics();
    }
  }

  private startPeriodicFlush() {
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.flushMetrics();
      }
    }, this.flushInterval);
  }

  private setupPageUnloadFlush() {
    const flushOnUnload = () => {
      if (this.metrics.length > 0) {
        this.flushMetricsSync();
      }
    };

    window.addEventListener('beforeunload', flushOnUnload);
    window.addEventListener('pagehide', flushOnUnload);
    
    // Para navegadores modernos
    if ('visibilitychange' in document) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          flushOnUnload();
        }
      });
    }
  }

  private async flushMetrics() {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      // Enviar métricas para o servidor
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: metricsToSend,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.warn('Failed to send performance metrics:', error);
      
      // Recolocar métricas na fila em caso de erro
      this.metrics.unshift(...metricsToSend);
    }
  }

  private flushMetricsSync() {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      // Usar sendBeacon para envio síncrono
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify({
          metrics: metricsToSend,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });
        
        navigator.sendBeacon('/api/performance/metrics', data);
      }
    } catch (error) {
      console.warn('Failed to send performance metrics synchronously:', error);
    }
  }

  // Métricas customizadas para o ArcFlow
  public measureUserAction(action: string, duration: number) {
    this.recordMetric('user-action', duration, { action });
  }

  public measureAPICall(endpoint: string, duration: number, success: boolean) {
    this.recordMetric('api-call', duration, { 
      endpoint, 
      success,
      status: success ? 'success' : 'error'
    });
  }

  public measureRenderTime(component: string, duration: number) {
    this.recordMetric('component-render', duration, { component });
  }

  public recordError(error: Error, context?: string) {
    this.recordMetric('error', 1, {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  // Obter estatísticas de performance
  public getPerformanceStats() {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < 60000); // Últimos 60s
    
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      totalMetrics: this.metrics.length,
      recentMetrics: recentMetrics.length,
      averageValues: this.calculateAverages(recentMetrics),
      memoryUsage: this.getMemoryUsage(),
      networkInfo: this.getNetworkInfo()
    };
  }

  private calculateAverages(metrics: PerformanceMetric[]) {
    const grouped = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    const averages: Record<string, number> = {};
    Object.entries(grouped).forEach(([name, values]) => {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return averages;
  }

  private getMemoryUsage() {
    if (!('memory' in performance)) return null;
    
    const memory = (performance as any).memory as MemoryInfo;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  private getNetworkInfo() {
    if (!('connection' in navigator)) return null;
    
    const connection = (navigator as any).connection as NetworkInfo;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  // Parar monitoramento
  public stop() {
    this.isMonitoring = false;
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Flush métricas finais
    this.flushMetricsSync();
  }
}

// Instância global
export const performanceMonitor = new PerformanceMonitor();

// Hook para componentes React
export const usePerformanceMonitor = () => {
  const measureRender = (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.measureRenderTime(componentName, duration);
    };
  };

  const measureUserAction = (actionName: string) => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.measureUserAction(actionName, duration);
    };
  };

  return {
    measureRender,
    measureUserAction,
    recordError: performanceMonitor.recordError.bind(performanceMonitor),
    getStats: performanceMonitor.getPerformanceStats.bind(performanceMonitor)
  };
}; 