/**
 * Serviço de cache simples para otimizar performance
 * Usado para cachear dados frequentemente acessados
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutos

  /**
   * Armazena um item no cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    
    this.cache.set(key, item)
  }

  /**
   * Recupera um item do cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // Verifica se o item expirou
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data as T
  }

  /**
   * Remove um item do cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove itens expirados do cache
   */
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats(): {
    totalItems: number
    expiredItems: number
    hitRate: number
  } {
    const now = Date.now()
    let expiredItems = 0
    
    for (const item of this.cache.values()) {
      if (now - item.timestamp > item.ttl) {
        expiredItems++
      }
    }
    
    return {
      totalItems: this.cache.size,
      expiredItems,
      hitRate: 0 // Seria necessário implementar contadores para calcular
    }
  }

  /**
   * Executa função com cache
   */
  async withCache<T>(
    key: string, 
    fn: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Tenta buscar do cache primeiro
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }
    
    // Executa função e armazena resultado
    const result = await fn()
    this.set(key, result, ttl)
    
    return result
  }
}

// Instância singleton do serviço de cache
export const cacheService = new CacheService()

// Limpa cache expirado a cada 10 minutos
setInterval(() => {
  cacheService.cleanup()
}, 10 * 60 * 1000)