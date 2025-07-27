// Sistema de Rate Limiting para 150k usuários simultâneos
interface RateLimitConfig {
  windowMs: number; // janela de tempo em ms
  maxRequests: number; // máximo de requests por janela
  keyGenerator?: (context: any) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RequestRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class RateLimiter {
  private requests = new Map<string, RequestRecord>();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (ctx) => ctx.userId || ctx.ip || 'anonymous',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };

    // Limpeza automática a cada minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  // Verificar se request pode ser processado
  async checkLimit(context: any): Promise<{ allowed: boolean; resetTime: number; remaining: number }> {
    const key = this.config.keyGenerator!(context);
    const now = Date.now();
    
    let record = this.requests.get(key);
    
    // Criar novo record se não existir ou se janela expirou
    if (!record || now >= record.resetTime) {
      record = {
        count: 0,
        resetTime: now + this.config.windowMs,
        blocked: false
      };
      this.requests.set(key, record);
    }

    // Verificar se está bloqueado
    if (record.blocked && now < record.resetTime) {
      return {
        allowed: false,
        resetTime: record.resetTime,
        remaining: 0
      };
    }

    // Incrementar contador
    record.count++;
    
    // Verificar se excedeu limite
    if (record.count > this.config.maxRequests) {
      record.blocked = true;
      return {
        allowed: false,
        resetTime: record.resetTime,
        remaining: 0
      };
    }

    const remaining = Math.max(0, this.config.maxRequests - record.count);
    
    return {
      allowed: true,
      resetTime: record.resetTime,
      remaining
    };
  }

  // Limpeza de records expirados
  private cleanup() {
    const now = Date.now();
    
    for (const [key, record] of this.requests.entries()) {
      if (now >= record.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  // Resetar limite para uma chave específica
  reset(context: any): void {
    const key = this.config.keyGenerator!(context);
    this.requests.delete(key);
  }

  // Obter estatísticas
  getStats() {
    return {
      activeKeys: this.requests.size,
      config: this.config
    };
  }

  // Destruir rate limiter
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.requests.clear();
  }
}

// Rate limiters específicos para diferentes operações
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  maxRequests: 100, // 100 requests por minuto por usuário
  keyGenerator: (ctx) => `api:${ctx.userId || ctx.ip}`
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 10 * 1000, // 10 segundos
  maxRequests: 20, // 20 buscas por 10 segundos
  keyGenerator: (ctx) => `search:${ctx.userId || ctx.ip}`
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  maxRequests: 10, // 10 uploads por 5 minutos
  keyGenerator: (ctx) => `upload:${ctx.userId}`
});

// Middleware para aplicar rate limiting
export const withRateLimit = (limiter: RateLimiter) => {
  return async (context: any, next: () => Promise<any>) => {
    const result = await limiter.checkLimit(context);
    
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Reset in ${Math.ceil((result.resetTime - Date.now()) / 1000)}s`);
    }

    // Adicionar headers de rate limit na resposta
    context.rateLimitHeaders = {
      'X-RateLimit-Limit': limiter['config'].maxRequests,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
    };

    return next();
  };
};

// Sistema de throttling para funções
export class Throttler {
  private lastExecution = new Map<string, number>();
  private timers = new Map<string, NodeJS.Timeout>();

  // Throttle uma função por chave
  throttle<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number
  ): T {
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      const lastTime = this.lastExecution.get(key) || 0;
      
      if (now - lastTime >= delay) {
        // Executar imediatamente
        this.lastExecution.set(key, now);
        return fn(...args);
      } else {
        // Agendar execução
        const existingTimer = this.timers.get(key);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
        
        const timer = setTimeout(() => {
          this.lastExecution.set(key, Date.now());
          this.timers.delete(key);
          fn(...args);
        }, delay - (now - lastTime));
        
        this.timers.set(key, timer);
      }
    }) as T;
  }

  // Debounce uma função por chave
  debounce<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    delay: number
  ): T {
    return ((...args: Parameters<T>) => {
      const existingTimer = this.timers.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      const timer = setTimeout(() => {
        this.timers.delete(key);
        fn(...args);
      }, delay);
      
      this.timers.set(key, timer);
    }) as T;
  }

  // Limpar todos os timers
  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.lastExecution.clear();
  }
}

// Instância global de throttler
export const globalThrottler = new Throttler();

// Utilitários específicos
export const throttledSearch = (fn: (...args: any[]) => any, delay = 300) =>
  globalThrottler.debounce('search', fn, delay);

export const throttledSave = (fn: (...args: any[]) => any, delay = 1000) =>
  globalThrottler.throttle('save', fn, delay);

export const throttledRefresh = (fn: (...args: any[]) => any, delay = 5000) =>
  globalThrottler.throttle('refresh', fn, delay); 