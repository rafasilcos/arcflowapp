import { createClient, RedisClientType } from 'redis';
import { logger, logError } from './logger';

// Cliente Redis principal
let redisClient: RedisClientType;

// Cliente Redis para pub/sub
let redisPubClient: RedisClientType;
let redisSubClient: RedisClientType;

// Configuração do Redis
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        logger.error('Redis: Máximo de tentativas de reconexão atingido');
        return false;
      }
      const delay = Math.min(retries * 100, 3000);
      logger.warn(`Redis: Tentativa de reconexão ${retries} em ${delay}ms`);
      return delay;
    }
  },
  database: 0
};

// Função para conectar ao Redis
export const connectRedis = async (): Promise<void> => {
  try {
    // Cliente principal
    redisClient = createClient(redisConfig);
    
    redisClient.on('error', (error) => {
      logError(error, { context: 'Redis Client Error' });
    });

    redisClient.on('connect', () => {
      logger.info('🔄 Redis: Conectando...');
    });

    redisClient.on('ready', () => {
      logger.info('✅ Redis: Cliente principal conectado');
    });

    redisClient.on('end', () => {
      logger.info('🔌 Redis: Conexão encerrada');
    });

    await redisClient.connect();

    // Clients para Pub/Sub
    redisPubClient = createClient(redisConfig);
    redisSubClient = createClient(redisConfig);

    await Promise.all([
      redisPubClient.connect(),
      redisSubClient.connect()
    ]);

    logger.info('✅ Redis: Todos os clientes conectados');

    // Teste de conexão
    await redisClient.ping();
    
  } catch (error) {
    logError(error as Error, { context: 'Redis Connection' });
    throw new Error('Falha ao conectar com o Redis');
  }
};

// Função para desconectar do Redis
export const disconnectRedis = async (): Promise<void> => {
  try {
    await Promise.all([
      redisClient?.quit(),
      redisPubClient?.quit(),
      redisSubClient?.quit()
    ]);
    logger.info('✅ Redis: Todos os clientes desconectados');
  } catch (error) {
    logError(error as Error, { context: 'Redis Disconnection' });
  }
};

// Health check do Redis
export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    await redisClient.ping();
    return true;
  } catch (error) {
    logError(error as Error, { context: 'Redis Health Check' });
    return false;
  }
};

// Cache Service
export class CacheService {
  // Definir TTL padrão por tipo de dados
  private static readonly TTL = {
    USER_SESSION: 60 * 60 * 24 * 7, // 7 dias
    USER_DATA: 60 * 60, // 1 hora
    PROJECT_DATA: 60 * 30, // 30 minutos
    BRIEFING_DATA: 60 * 15, // 15 minutos
    DASHBOARD_DATA: 60 * 5, // 5 minutos
    REAL_TIME_DATA: 60, // 1 minuto
    SEARCH_RESULTS: 60 * 10 // 10 minutos
  };

  // Get com fallback
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logError(error as Error, { context: 'Cache Get', key });
      return null;
    }
  }

  // Set com TTL automático
  static async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
      
      return true;
    } catch (error) {
      logError(error as Error, { context: 'Cache Set', key });
      return false;
    }
  }

  // Delete
  static async del(key: string | string[]): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logError(error as Error, { context: 'Cache Delete', key });
      return false;
    }
  }

  // Get ou Set (cache-aside pattern)
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      // Tentar buscar do cache
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Se não encontrou, buscar dos dados originais
      const data = await fetchFn();
      
      // Salvar no cache
      await this.set(key, data, ttl);
      
      return data;
    } catch (error) {
      logError(error as Error, { context: 'Cache GetOrSet', key });
      // Em caso de erro no cache, retornar dados originais
      return await fetchFn();
    }
  }

  // Invalidar padrão de chaves
  static async invalidatePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      logError(error as Error, { context: 'Cache Invalidate Pattern', pattern });
      return false;
    }
  }

  // Métodos específicos do ArcFlow
  static async setUserSession(userId: string, sessionData: any): Promise<boolean> {
    return this.set(`session:${userId}`, sessionData, this.TTL.USER_SESSION);
  }

  static async getUserSession(userId: string): Promise<any> {
    return this.get(`session:${userId}`);
  }

  static async setDashboardData(userId: string, data: any): Promise<boolean> {
    return this.set(`dashboard:${userId}`, data, this.TTL.DASHBOARD_DATA);
  }

  static async getDashboardData(userId: string): Promise<any> {
    return this.get(`dashboard:${userId}`);
  }

  static async setProjectData(projectId: string, data: any): Promise<boolean> {
    return this.set(`project:${projectId}`, data, this.TTL.PROJECT_DATA);
  }

  static async getProjectData(projectId: string): Promise<any> {
    return this.get(`project:${projectId}`);
  }

  static async invalidateUser(userId: string): Promise<boolean> {
    return this.invalidatePattern(`*:${userId}*`);
  }

  static async invalidateProject(projectId: string): Promise<boolean> {
    return this.invalidatePattern(`*project:${projectId}*`);
  }
}

// Real-time Service usando Pub/Sub
export class RealtimeService {
  // Publicar evento
  static async publish(channel: string, data: any): Promise<boolean> {
    try {
      await redisPubClient.publish(channel, JSON.stringify(data));
      return true;
    } catch (error) {
      logError(error as Error, { context: 'Realtime Publish', channel });
      return false;
    }
  }

  // Subscrever canal
  static async subscribe(channel: string, callback: (data: any) => void): Promise<void> {
    try {
      await redisSubClient.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          callback(data);
        } catch (parseError) {
          logError(parseError as Error, { context: 'Realtime Parse', channel });
        }
      });
    } catch (error) {
      logError(error as Error, { context: 'Realtime Subscribe', channel });
    }
  }

  // Métodos específicos do ArcFlow
  static async publishTimerUpdate(projectId: string, timerData: any): Promise<boolean> {
    return this.publish(`timer:${projectId}`, timerData);
  }

  static async publishNotification(userId: string, notification: any): Promise<boolean> {
    return this.publish(`notification:${userId}`, notification);
  }

  static async publishProjectUpdate(projectId: string, update: any): Promise<boolean> {
    return this.publish(`project:${projectId}:update`, update);
  }
}

export { redisClient, redisPubClient, redisSubClient }; 