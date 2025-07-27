// Sistema de Cache Avançado para 150k usuários simultâneos
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
  size: number;
  accessCount: number;
  lastAccess: number;
}

interface CacheConfig {
  maxSize: number; // MB
  defaultTTL: number; // ms
  compressionThreshold: number; // bytes
  enableIndexedDB: boolean;
  enableCompression: boolean;
}

class AdvancedCacheManager {
  private memoryCache = new Map<string, CacheItem>();
  private dbCache: IDBDatabase | null = null;
  private config: CacheConfig;
  private currentSize = 0; // bytes
  private compressionWorker: Worker | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50, // 50MB
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      compressionThreshold: 1024, // 1KB
      enableIndexedDB: true,
      enableCompression: true,
      ...config
    };

    this.initIndexedDB();
    this.initCompressionWorker();
    this.startCleanupInterval();
  }

  // Inicializar IndexedDB para cache persistente
  private async initIndexedDB() {
    if (!this.config.enableIndexedDB || typeof window === 'undefined') return;

    try {
      const request = indexedDB.open('ArcFlowCache', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          const store = db.createObjectStore('cache', { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('lastAccess', 'lastAccess');
        }
      };

      request.onsuccess = (event) => {
        this.dbCache = (event.target as IDBOpenDBRequest).result;
      };

      request.onerror = () => {
        console.warn('IndexedDB não disponível, usando apenas cache de memória');
      };
    } catch (error) {
      console.warn('Erro ao inicializar IndexedDB:', error);
    }
  }

  // Worker para compressão assíncrona
  private initCompressionWorker() {
    if (!this.config.enableCompression || typeof window === 'undefined') return;

    try {
      const workerCode = `
        // Compressão LZ-string simplificada
        function compress(str) {
          const dict = {};
          const data = (str + "").split("");
          const out = [];
          let dictSize = 256;
          let phrase = data[0];
          
          for (let i = 1; i < data.length; i++) {
            const currChar = data[i];
            
            if (dict[phrase + currChar] != null) {
              phrase += currChar;
            } else {
              out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
              dict[phrase + currChar] = dictSize++;
              phrase = currChar;
            }
          }
          
          out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
          return JSON.stringify(out);
        }

        function decompress(compressed) {
          try {
            const data = JSON.parse(compressed);
            const dict = {};
            let dictSize = 256;
            let entry = String.fromCharCode(data[0]);
            let result = entry;
            
            for (let i = 1; i < data.length; i++) {
              let k = data[i];
              if (dict[k]) {
                entry = dict[k];
              } else if (k === dictSize) {
                entry = entry + entry.charAt(0);
              } else {
                return null;
              }
              
              result += entry;
              dict[dictSize++] = entry + entry.charAt(0);
              entry = dict[k] || entry;
            }
            
            return result;
          } catch {
            return null;
          }
        }

        self.onmessage = function(e) {
          const { action, data, id } = e.data;
          
          if (action === 'compress') {
            const compressed = compress(data);
            self.postMessage({ action: 'compressed', data: compressed, id });
          } else if (action === 'decompress') {
            const decompressed = decompress(data);
            self.postMessage({ action: 'decompressed', data: decompressed, id });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.compressionWorker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Compression Worker não disponível');
    }
  }

  // Limpeza automática de cache
  private startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, 60000); // Limpeza a cada minuto
  }

  // Calcular tamanho de um objeto
  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  // Comprimir dados se necessário
  private async compressIfNeeded(data: any): Promise<{ data: any; compressed: boolean }> {
    const size = this.calculateSize(data);
    
    if (!this.config.enableCompression || 
        size < this.config.compressionThreshold || 
        !this.compressionWorker) {
      return { data, compressed: false };
    }

    return new Promise((resolve) => {
      const id = Math.random().toString(36);
      
      const handler = (e: MessageEvent) => {
        if (e.data.id === id && e.data.action === 'compressed') {
          this.compressionWorker?.removeEventListener('message', handler);
          resolve({ data: e.data.data, compressed: true });
        }
      };

      this.compressionWorker!.addEventListener('message', handler);
      this.compressionWorker!.postMessage({ 
        action: 'compress', 
        data: JSON.stringify(data), 
        id 
      });

      // Timeout fallback
      setTimeout(() => {
        this.compressionWorker?.removeEventListener('message', handler);
        resolve({ data, compressed: false });
      }, 1000);
    });
  }

  // Descomprimir dados
  private async decompressIfNeeded(data: any, compressed: boolean): Promise<any> {
    if (!compressed || !this.compressionWorker) {
      return data;
    }

    return new Promise((resolve) => {
      const id = Math.random().toString(36);
      
      const handler = (e: MessageEvent) => {
        if (e.data.id === id && e.data.action === 'decompressed') {
          this.compressionWorker?.removeEventListener('message', handler);
          const result = e.data.data ? JSON.parse(e.data.data) : data;
          resolve(result);
        }
      };

      this.compressionWorker!.addEventListener('message', handler);
      this.compressionWorker!.postMessage({ 
        action: 'decompress', 
        data, 
        id 
      });

      // Timeout fallback
      setTimeout(() => {
        this.compressionWorker?.removeEventListener('message', handler);
        resolve(data);
      }, 1000);
    });
  }

  // Estratégia LRU para remoção de cache
  private evictLRU() {
    const entries = Array.from(this.memoryCache.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    
    // Remove 20% dos itens menos acessados
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      const [key, item] = entries[i];
      this.currentSize -= item.size;
      this.memoryCache.delete(key);
    }
  }

  // Limpeza de itens expirados
  private cleanup() {
    const now = Date.now();
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now > item.timestamp + item.ttl) {
        this.currentSize -= item.size;
        this.memoryCache.delete(key);
      }
    }

    // Verificar limite de tamanho
    const maxSizeBytes = this.config.maxSize * 1024 * 1024;
    if (this.currentSize > maxSizeBytes) {
      this.evictLRU();
    }
  }

  // Definir item no cache
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const now = Date.now();
    const itemTTL = ttl || this.config.defaultTTL;
    
    // Comprimir se necessário
    const { data: processedData, compressed } = await this.compressIfNeeded(data);
    
    const item: CacheItem<T> = {
      data: processedData,
      timestamp: now,
      ttl: itemTTL,
      version: '1.0',
      size: this.calculateSize(processedData),
      accessCount: 0,
      lastAccess: now
    };

    // Adicionar metadados sobre compressão
    (item as any).compressed = compressed;

    // Cache de memória
    if (this.memoryCache.has(key)) {
      this.currentSize -= this.memoryCache.get(key)!.size;
    }
    this.memoryCache.set(key, item);
    this.currentSize += item.size;

    // Cache persistente (IndexedDB)
    if (this.dbCache) {
      try {
        const transaction = this.dbCache.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.put({ key, ...item });
      } catch (error) {
        console.warn('Erro ao salvar no IndexedDB:', error);
      }
    }

    // Limpeza se necessário
    this.cleanup();
  }

  // Obter item do cache
  async get<T>(key: string): Promise<T | null> {
    const now = Date.now();
    
    // Verificar cache de memória primeiro
    let item = this.memoryCache.get(key);
    
    // Se não encontrou na memória, verificar IndexedDB
    if (!item && this.dbCache) {
      try {
        const transaction = this.dbCache.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const request = store.get(key);
        
        item = await new Promise<CacheItem | undefined>((resolve) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(undefined);
        });

        // Se encontrou no IndexedDB, adicionar na memória
        if (item) {
          this.memoryCache.set(key, item);
          this.currentSize += item.size;
        }
      } catch (error) {
        console.warn('Erro ao ler do IndexedDB:', error);
      }
    }

    // Verificar se item existe e não expirou
    if (!item || now > item.timestamp + item.ttl) {
      if (item) {
        this.memoryCache.delete(key);
        this.currentSize -= item.size;
      }
      return null;
    }

    // Atualizar estatísticas de acesso
    item.accessCount++;
    item.lastAccess = now;

    // Descomprimir se necessário
    const data = await this.decompressIfNeeded(item.data, (item as any).compressed || false);
    
    return data;
  }

  // Invalidar cache por padrão
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (regex.test(key)) {
        this.currentSize -= item.size;
        this.memoryCache.delete(key);
      }
    }
  }

  // Estatísticas do cache
  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      totalSize: `${(this.currentSize / 1024 / 1024).toFixed(2)} MB`,
      maxSize: `${this.config.maxSize} MB`,
      hitRate: this.calculateHitRate(),
      compressionEnabled: this.config.enableCompression,
      indexedDBEnabled: !!this.dbCache
    };
  }

  private calculateHitRate(): string {
    const items = Array.from(this.memoryCache.values());
    if (items.length === 0) return '0%';
    
    const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0);
    const avgAccess = totalAccess / items.length;
    return `${(avgAccess * 100).toFixed(1)}%`;
  }

  // Limpar todo o cache
  clear(): void {
    this.memoryCache.clear();
    this.currentSize = 0;
    
    if (this.dbCache) {
      try {
        const transaction = this.dbCache.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.clear();
      } catch (error) {
        console.warn('Erro ao limpar IndexedDB:', error);
      }
    }
  }

  // Destruir cache manager
  destroy(): void {
    this.clear();
    
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
    }
    
    if (this.dbCache) {
      this.dbCache.close();
    }
  }
}

// Instância global otimizada para 150k usuários
export const cacheManager = new AdvancedCacheManager({
  maxSize: 100, // 100MB para alta performance
  defaultTTL: 10 * 60 * 1000, // 10 minutos
  compressionThreshold: 512, // Comprimir a partir de 512 bytes
  enableIndexedDB: true,
  enableCompression: true
});

// Utilitários para cache específico
export const ProjectCache = {
  set: (projectId: string, data: any, ttl?: number) => 
    cacheManager.set(`project:${projectId}`, data, ttl),
  
  get: (projectId: string) => 
    cacheManager.get(`project:${projectId}`),
  
  invalidate: (projectId: string) => 
    cacheManager.invalidatePattern(`project:${projectId}.*`),
  
  setTask: (projectId: string, taskId: string, data: any) =>
    cacheManager.set(`project:${projectId}:task:${taskId}`, data),
  
  getTask: (projectId: string, taskId: string) =>
    cacheManager.get(`project:${projectId}:task:${taskId}`)
}; 