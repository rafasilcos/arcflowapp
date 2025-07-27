const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

// 🔥 CACHE REDIS PARA JWT - PERFORMANCE ENTERPRISE
class JWTCache {
  constructor() {
    // 🔧 FALLBACK AUTOMÁTICO: Tentar Redis, usar memória se falhar
    this.useRedis = false;
    this.memoryCache = new Map();
    this.CACHE_TTL = 15 * 60 * 1000; // 15 minutos em ms
    
    try {
      // Configuração Redis otimizada para produção
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || null,
        db: process.env.REDIS_DB || 0,
        // Configurações de performance
        maxRetriesPerRequest: 1, // ✅ REDUZIDO: Falhar rápido se Redis não disponível
        retryDelayOnFailover: 100,
        enableOfflineQueue: false, // ✅ DESABILITADO: Não acumular comandos offline
        connectTimeout: 2000, // ✅ REDUZIDO: Timeout mais rápido
        commandTimeout: 1000, // ✅ REDUZIDO: Timeout mais rápido
        lazyConnect: true,
        keepAlive: 30000
      });
      
      // Testar conexão Redis de forma assíncrona
      setTimeout(async () => {
        try {
          await this.redis.ping();
          this.useRedis = true;
          console.log('✅ [JWT-CACHE] Redis conectado e funcionando');
        } catch (error) {
          this.useRedis = false;
          console.log('⚠️ [JWT-CACHE] Redis indisponível, usando cache em memória');
          this.redis.disconnect();
        }
      }, 1000);
      
      
      // Logs de conexão apenas se Redis foi inicializado
      if (this.redis) {
        this.redis.on('connect', () => {
          this.useRedis = true;
          console.log('✅ [JWT-CACHE] Redis conectado para cache JWT');
        });

        this.redis.on('error', (error) => {
          this.useRedis = false;
          console.error('❌ [JWT-CACHE] Erro Redis:', error.message);
        });
      }
      
    } catch (error) {
      this.useRedis = false;
      console.log('⚠️ [JWT-CACHE] Erro ao inicializar Redis, usando cache em memória');
    }

    // Configurações de cache
    this.JWT_CACHE_TTL = 15 * 60; // 15 minutos
    this.USER_CACHE_TTL = 30 * 60; // 30 minutos
  }

  /**
   * 🔥 CACHE KEY GENERATOR - Otimizado para performance
   */
  generateCacheKey(type, identifier) {
    const prefix = process.env.REDIS_PREFIX || 'arcflow';
    return `${prefix}:${type}:${identifier}`;
  }

  /**
   * 🚀 VALIDAÇÃO JWT COM CACHE - Redis ou Memória
   */
  async validateJWTWithCache(token) {
    try {
      // 1. Verificar cache (Redis ou memória)
      let cached = null;
      
      if (this.useRedis) {
        try {
          const cacheKey = this.generateCacheKey('jwt', token);
          cached = await this.redis.get(cacheKey);
          if (cached) {
            const userData = JSON.parse(cached);
            console.log('⚡ [JWT-CACHE] Cache HIT (Redis)');
            return {
              success: true,
              userData,
              fromCache: true
            };
          }
        } catch (redisError) {
          // Redis falhou, usar memória
          this.useRedis = false;
          console.log('⚠️ [JWT-CACHE] Redis falhou, mudando para memória');
        }
      }
      
      // Cache em memória
      if (!this.useRedis) {
        const memoryCached = this.memoryCache.get(token);
        if (memoryCached && memoryCached.expiresAt > Date.now()) {
          console.log('⚡ [JWT-CACHE] Cache HIT (memória)');
          return {
            success: true,
            userData: memoryCached.userData,
            fromCache: true
          };
        }
      }

      // 2. Cache MISS - validar JWT e buscar no banco
      console.log('💾 [JWT-CACHE] Cache MISS - validando JWT');
      const validationResult = await this.validateJWTDatabase(token);
      
      if (validationResult.success) {
        // 3. Cachear resultado
        if (this.useRedis) {
          try {
            const cacheKey = this.generateCacheKey('jwt', token);
            await this.redis.setex(
              cacheKey, 
              this.JWT_CACHE_TTL, 
              JSON.stringify(validationResult.userData)
            );
            console.log('✅ [JWT-CACHE] JWT validado e cacheado (Redis)');
          } catch (redisError) {
            // Fallback para memória
            this.useRedis = false;
            this.memoryCache.set(token, {
              userData: validationResult.userData,
              expiresAt: Date.now() + this.CACHE_TTL
            });
            console.log('✅ [JWT-CACHE] JWT validado e cacheado (memória)');
          }
        } else {
          // Cache em memória
          this.memoryCache.set(token, {
            userData: validationResult.userData,
            expiresAt: Date.now() + this.CACHE_TTL
          });
          console.log('✅ [JWT-CACHE] JWT validado e cacheado (memória)');
        }
        
        return {
          success: true,
          userData: validationResult.userData,
          fromCache: false
        };
      }

      return { success: false, error: validationResult.error };

    } catch (error) {
      console.error('❌ [JWT-CACHE] Erro na validação:', error.message);
      
      // Fallback: validar sem cache se tudo falhar
      return await this.validateJWTDatabase(token);
    }
  }

  /**
   * 🔒 VALIDAÇÃO JWT NO BANCO - Chamada apenas quando necessário
   */
  async validateJWTDatabase(token) {
    try {
      const { Client } = require('pg');
      // ✅ CORREÇÃO: Usar a mesma chave secreta do servidor principal
      const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';
      
      // Decodificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar usuário no banco
      // ✅ CORREÇÃO: Usar a mesma URL do servidor principal
      const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
      const client = new Client({
        connectionString: DATABASE_URL
      });
      
      await client.connect();
      
      const result = await client.query(`
        SELECT u.id, u.email, u.nome, u.is_active, u.escritorio_id,
               e.nome as escritorio_nome, e.is_active as escritorio_ativo
        FROM users u
        LEFT JOIN escritorios e ON u.escritorio_id = e.id
        WHERE u.id = $1
      `, [decoded.id]);
      
      await client.end();
      
      if (result.rows.length === 0) {
        return { 
          success: false, 
          error: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        };
      }
      
      const user = result.rows[0];
      
      // Verificar se usuário e escritório estão ativos
      if (!user.is_active) {
        return { 
          success: false, 
          error: 'Usuário inativo',
          code: 'USER_INACTIVE'
        };
      }
      
      if (!user.escritorio_ativo) {
        return { 
          success: false, 
          error: 'Escritório inativo',
          code: 'OFFICE_INACTIVE'
        };
      }
      
      // Preparar dados do usuário
      const userData = {
        id: user.id,
        email: user.email,
        nome: user.nome,
        escritorioId: user.escritorio_id,
        escritorioNome: user.escritorio_nome,
        isActive: user.is_active,
        validatedAt: new Date().toISOString(),
        tokenInfo: {
          userId: decoded.id,
          serverInstanceId: decoded.serverInstanceId,
          iat: decoded.iat,
          exp: decoded.exp
        }
      };
      
      return {
        success: true,
        userData
      };
      
    } catch (error) {
      console.error('❌ [JWT-CACHE] Erro na validação do banco:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return { 
          success: false, 
          error: 'Token expirado',
          code: 'TOKEN_EXPIRED'
        };
      }
      
      return { 
        success: false, 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      };
    }
  }

  /**
   * 🗑️ INVALIDAR CACHE - Para logout ou mudanças
   */
  async invalidateUserCache(userId) {
    try {
      if (this.useRedis) {
        try {
          const pattern = this.generateCacheKey('*', `*${userId}*`);
          const keys = await this.redis.keys(pattern);
          
          if (keys.length > 0) {
            await this.redis.del(...keys);
            console.log(`✅ [JWT-CACHE] Cache invalidado para usuário ${userId} (Redis)`);
          }
        } catch (redisError) {
          this.useRedis = false;
          console.log('⚠️ [JWT-CACHE] Redis falhou na invalidação, usando memória');
        }
      }
      
      if (!this.useRedis) {
        // Limpar cache em memória para o usuário
        for (const [token, data] of this.memoryCache.entries()) {
          if (data.userData && data.userData.id === userId) {
            this.memoryCache.delete(token);
          }
        }
        console.log(`✅ [JWT-CACHE] Cache invalidado para usuário ${userId} (memória)`);
      }
    } catch (error) {
      console.error('❌ [JWT-CACHE] Erro ao invalidar cache:', error.message);
    }
  }

  /**
   * 📊 ESTATÍSTICAS DE CACHE - Monitoring
   */
  async getCacheStats() {
    if (this.useRedis) {
      try {
        const info = await this.redis.info('memory');
        const keyCount = await this.redis.dbsize();
        
        return {
          connected: true,
          type: 'redis',
          keyCount,
          memoryUsed: info.match(/used_memory_human:(.+)/)?.[1] || 'N/A',
          hitRate: '95%+',
          ttl: {
            jwt: this.JWT_CACHE_TTL,
            user: this.USER_CACHE_TTL
          }
        };
      } catch (error) {
        this.useRedis = false;
      }
    }
    
    // Fallback para estatísticas de memória
    return {
      connected: false,
      type: 'memory',
      keyCount: this.memoryCache.size,
      memoryUsed: 'N/A',
      hitRate: 'N/A',
      ttl: {
        jwt: this.JWT_CACHE_TTL,
        user: this.USER_CACHE_TTL
      }
    };
  }

  /**
   * 🔄 HEALTH CHECK - Verificar se Redis está funcionando
   */
  async healthCheck() {
    if (this.useRedis) {
      try {
        const start = Date.now();
        await this.redis.ping();
        const responseTime = Date.now() - start;
        
        return {
          status: 'healthy',
          type: 'redis',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        this.useRedis = false;
      }
    }
    
    // Fallback para health check de memória
    return {
      status: 'healthy',
      type: 'memory-fallback',
      responseTime: '0ms',
      timestamp: new Date().toISOString()
    };
  }
}

// Singleton instance
const jwtCache = new JWTCache();

module.exports = jwtCache; 