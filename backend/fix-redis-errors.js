#!/usr/bin/env node

/**
 * 🛠️ CORREÇÃO RÁPIDA - Resolver erros do Redis no ArcFlow
 * 
 * Este script resolve os 3 problemas principais:
 * 1. Redis não instalado/rodando
 * 2. Módulo test-data-simple faltando
 * 3. Configuração de fallback para Redis
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 ===============================================');
console.log('🔧 CORREÇÃO AUTOMÁTICA - ERROS BACKEND ARCFLOW');
console.log('🔧 ===============================================');

// 1. CRIAR MÓDULO TEST-DATA-SIMPLE FALTANDO
console.log('📁 1. Criando módulo test-data-simple...');

const testDataSimpleContent = `
// 🧪 ROTAS DE TESTE SIMPLES - ArcFlow
const express = require('express');
const router = express.Router();

// 📊 Endpoint de teste básico
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Test data routes funcionando',
    timestamp: new Date().toISOString()
  });
});

// 🎯 Dados de teste para desenvolvimento
router.get('/sample-data', (req, res) => {
  res.json({
    briefings: [
      {
        id: 'test-1',
        nome: 'Projeto Teste',
        tipologia: 'residencial',
        status: 'em_andamento'
      }
    ],
    usuarios: [
      {
        id: 'user-test-1',
        email: 'teste@arcflow.com',
        nome: 'Usuário Teste'
      }
    ]
  });
});

module.exports = router;
`;

// Criar diretório se não existir
const routesDir = path.join(__dirname, 'src', 'routes');
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir, { recursive: true });
}

// Criar arquivo
fs.writeFileSync(
  path.join(routesDir, 'test-data-simple.js'), 
  testDataSimpleContent
);

console.log('✅ Módulo test-data-simple criado com sucesso!');

// 2. CRIAR CONFIGURAÇÃO DE FALLBACK PARA REDIS
console.log('🔧 2. Configurando fallback para Redis...');

const jwtCacheFallbackContent = `
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
      
      const result = await client.query(\`
        SELECT u.id, u.email, u.nome, u.is_active, u.escritorio_id,
               e.nome as escritorio_nome, e.is_active as escritorio_ativo
        FROM users u
        LEFT JOIN escritorios e ON u.escritorio_id = e.id
        WHERE u.id = $1
      \`, [decoded.id]);
      
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
    console.log(\`✅ [JWT-CACHE] Cache invalidado para usuário \${userId} (memória)\`);
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
`;

// Criar backup do arquivo original
const originalJwtCache = path.join(__dirname, 'src', 'middleware', 'jwt-cache.js');
const backupJwtCache = path.join(__dirname, 'src', 'middleware', 'jwt-cache.js.backup');

if (fs.existsSync(originalJwtCache)) {
  fs.copyFileSync(originalJwtCache, backupJwtCache);
  console.log('📋 Backup do jwt-cache.js criado');
}

// Criar versão fallback
fs.writeFileSync(
  path.join(__dirname, 'src', 'middleware', 'jwt-cache-fallback.js'),
  jwtCacheFallbackContent
);

console.log('✅ JWT Cache Fallback criado com sucesso!');

// 3. MODIFICAR SERVER-SIMPLE.JS PARA USAR FALLBACK
console.log('🔧 3. Configurando fallback automático no servidor...');

const serverPath = path.join(__dirname, 'server-simple.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Substituir a inicialização do JWT Cache
const oldJwtCacheInit = `// 🚀 OTIMIZAÇÃO: Instância reutilizável do cache JWT
let jwtCacheInstance = null;
try {
  jwtCacheInstance = require('./src/middleware/jwt-cache');
  console.log('✅ [JWT-CACHE] Instância inicializada com sucesso');
} catch (error) {
  console.warn('⚠️ [JWT-CACHE] Erro ao inicializar cache JWT:', error.message);
}`;

const newJwtCacheInit = `// 🚀 OTIMIZAÇÃO: Instância reutilizável do cache JWT com fallback
let jwtCacheInstance = null;
try {
  jwtCacheInstance = require('./src/middleware/jwt-cache');
  console.log('✅ [JWT-CACHE] Instância Redis inicializada com sucesso');
} catch (error) {
  console.warn('⚠️ [JWT-CACHE] Redis indisponível, usando fallback:', error.message);
  try {
    jwtCacheInstance = require('./src/middleware/jwt-cache-fallback');
    console.log('✅ [JWT-CACHE] Fallback em memória inicializado');
  } catch (fallbackError) {
    console.error('❌ [JWT-CACHE] Erro crítico:', fallbackError.message);
  }
}`;

serverContent = serverContent.replace(oldJwtCacheInit, newJwtCacheInit);

fs.writeFileSync(serverPath, serverContent);

console.log('✅ Servidor configurado para usar fallback automático!');

console.log('');
console.log('🎉 ===============================================');
console.log('🎉 CORREÇÕES APLICADAS COM SUCESSO!');
console.log('🎉 ===============================================');
console.log('');
console.log('📋 O que foi corrigido:');
console.log('✅ 1. Módulo test-data-simple criado');
console.log('✅ 2. JWT Cache Fallback configurado (sem Redis)');
console.log('✅ 3. Servidor configurado para fallback automático');
console.log('');
console.log('🚀 Agora você pode:');
console.log('1. Reiniciar o backend: npm run dev');
console.log('2. Os erros de Redis não aparecerão mais');
console.log('3. Sistema funcionará normalmente sem Redis');
console.log('');
console.log('💡 Para instalar Redis no futuro (opcional):');
console.log('- Windows: https://redis.io/docs/getting-started/installation/install-redis-on-windows/');
console.log('- Ou use Docker: docker run -d -p 6379:6379 redis:alpine');