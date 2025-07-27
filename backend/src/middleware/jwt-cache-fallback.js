
const jwt = require('jsonwebtoken');

// 🔄 FALLBACK JWT CACHE - Sem Redis (Desenvolvimento)
class JWTCacheFallback {
  constructor() {
    this.memoryCache = new Map();
    this.CACHE_TTL = 15 * 60 * 1000; // 15 minutos em ms
    console.log('⚠️ [JWT-CACHE] Usando cache em memória (Redis indisponível)');
  }

  /**
   * 🚀 VALIDAÇÃO JWT COM CACHE EM MEMÓRIA
   */
  async validateJWTWithCache(token) {
    try {
      // 1. Verificar cache em memória
      const cached = this.memoryCache.get(token);
      if (cached && cached.expiresAt > Date.now()) {
        console.log('⚡ [JWT-CACHE] Cache HIT (memória)');
        return {
          success: true,
          userData: cached.userData,
          fromCache: true
        };
      }

      // 2. Cache MISS - validar JWT
      console.log('💾 [JWT-CACHE] Cache MISS - validando JWT');
      const validationResult = await this.validateJWTDatabase(token);
      
      if (validationResult.success) {
        // 3. Cachear em memória
        this.memoryCache.set(token, {
          userData: validationResult.userData,
          expiresAt: Date.now() + this.CACHE_TTL
        });
        
        console.log('✅ [JWT-CACHE] JWT validado e cacheado (memória)');
        return {
          success: true,
          userData: validationResult.userData,
          fromCache: false
        };
      }

      return { success: false, error: validationResult.error };

    } catch (error) {
      console.error('❌ [JWT-CACHE] Erro na validação:', error.message);
      return await this.validateJWTDatabase(token);
    }
  }

  /**
   * 🔒 VALIDAÇÃO JWT NO BANCO
   */
  async validateJWTDatabase(token) {
    try {
      const { Client } = require('pg');
      const JWT_SECRET = process.env.JWT_SECRET || 'arcflow-super-secret-jwt-key-development-2024';
      
      // Decodificar JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar usuário no banco
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
      
      if (!user.is_active || !user.escritorio_ativo) {
        return { 
          success: false, 
          error: 'Usuário ou escritório inativo',
          code: 'INACTIVE'
        };
      }
      
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

  async invalidateUserCache(userId) {
    // Limpar cache em memória para o usuário
    for (const [token, data] of this.memoryCache.entries()) {
      if (data.userData && data.userData.id === userId) {
        this.memoryCache.delete(token);
      }
    }
    console.log(`✅ [JWT-CACHE] Cache invalidado para usuário ${userId} (memória)`);
  }

  async getCacheStats() {
    return {
      connected: false,
      type: 'memory',
      keyCount: this.memoryCache.size,
      memoryUsed: 'N/A',
      hitRate: 'N/A'
    };
  }

  async healthCheck() {
    return {
      status: 'healthy',
      type: 'memory-fallback',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new JWTCacheFallback();
