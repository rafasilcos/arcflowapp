const { performance } = require('perf_hooks');

// 🔥 SISTEMA DE MONITORING ENTERPRISE - 10K USUÁRIOS
class MonitoringSystem {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byEndpoint: new Map(),
        byMethod: new Map(),
        byStatus: new Map()
      },
      performance: {
        avgResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        responseTimes: []
      },
      auth: {
        loginAttempts: 0,
        loginSuccess: 0,
        loginFailed: 0,
        jwtValidations: 0,
        jwtCacheHits: 0,
        jwtCacheMisses: 0,
        activeUsers: new Set(),
        heartbeats: 0
      },
      errors: {
        total: 0,
        by5xx: 0,
        by4xx: 0,
        byType: new Map(),
        critical: []
      },
      system: {
        startTime: Date.now(),
        uptime: 0,
        memoryUsage: 0,
        cpuUsage: 0
      }
    };
    
    // Limpar métricas antigas periodicamente
    setInterval(() => this.cleanupMetrics(), 5 * 60 * 1000); // 5 minutos
    
    // Atualizar métricas do sistema
    setInterval(() => this.updateSystemMetrics(), 30 * 1000); // 30 segundos
  }

  // 🚀 MIDDLEWARE DE MONITORAMENTO
  requestMiddleware() {
    return (req, res, next) => {
      const startTime = performance.now();
      const startMemory = process.memoryUsage();
      
      // Incrementar contador de requests
      this.metrics.requests.total++;
      
      // Contar por método
      const methodCount = this.metrics.requests.byMethod.get(req.method) || 0;
      this.metrics.requests.byMethod.set(req.method, methodCount + 1);
      
      // Contar por endpoint
      const endpoint = this.normalizeEndpoint(req.url);
      const endpointCount = this.metrics.requests.byEndpoint.get(endpoint) || 0;
      this.metrics.requests.byEndpoint.set(endpoint, endpointCount + 1);
      
      // Interceptar fim da resposta
      res.on('finish', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        const endMemory = process.memoryUsage();
        
        // Registrar tempo de resposta
        this.recordResponseTime(responseTime);
        
        // Contar por status
        const statusCount = this.metrics.requests.byStatus.get(res.statusCode) || 0;
        this.metrics.requests.byStatus.set(res.statusCode, statusCount + 1);
        
        // Classificar sucesso/falha
        if (res.statusCode >= 200 && res.statusCode < 400) {
          this.metrics.requests.successful++;
        } else {
          this.metrics.requests.failed++;
          
          // Contar erros
          if (res.statusCode >= 400 && res.statusCode < 500) {
            this.metrics.errors.by4xx++;
          } else if (res.statusCode >= 500) {
            this.metrics.errors.by5xx++;
          }
        }
        
        // Log detalhado para performance
        if (responseTime > 1000) { // > 1 segundo
          console.warn('🐌 [MONITORING] Slow request:', {
            method: req.method,
            url: req.url,
            responseTime: `${responseTime.toFixed(2)}ms`,
            status: res.statusCode,
            memoryDelta: endMemory.heapUsed - startMemory.heapUsed
          });
        }
        
        // Detectar erros críticos
        if (res.statusCode >= 500) {
          this.recordCriticalError(req, res, responseTime);
        }
      });
      
      next();
    };
  }

  // 🔥 NORMALIZAR ENDPOINT - Remover IDs dinâmicos
  normalizeEndpoint(url) {
    return url
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id') // UUIDs
      .replace(/\/\d+/g, '/:id') // Números
      .replace(/\?.*$/, ''); // Query params
  }

  // 📊 REGISTRAR TEMPO DE RESPOSTA
  recordResponseTime(responseTime) {
    this.metrics.performance.responseTimes.push(responseTime);
    
    // Manter apenas últimos 1000 registros
    if (this.metrics.performance.responseTimes.length > 1000) {
      this.metrics.performance.responseTimes.shift();
    }
    
    // Calcular estatísticas
    this.calculatePerformanceStats();
  }

  // 📈 CALCULAR ESTATÍSTICAS DE PERFORMANCE
  calculatePerformanceStats() {
    const times = this.metrics.performance.responseTimes;
    if (times.length === 0) return;
    
    const sorted = [...times].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    this.metrics.performance.avgResponseTime = sum / times.length;
    this.metrics.performance.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)];
    this.metrics.performance.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)];
  }

  // 🔐 MÉTRICAS DE AUTENTICAÇÃO
  recordAuthMetric(type, success = true, userId = null) {
    switch (type) {
      case 'login':
        this.metrics.auth.loginAttempts++;
        if (success) {
          this.metrics.auth.loginSuccess++;
          if (userId) this.metrics.auth.activeUsers.add(userId);
        } else {
          this.metrics.auth.loginFailed++;
        }
        break;
      
      case 'jwt_validation':
        this.metrics.auth.jwtValidations++;
        if (userId) this.metrics.auth.activeUsers.add(userId);
        break;
      
      case 'jwt_cache_hit':
        this.metrics.auth.jwtCacheHits++;
        break;
      
      case 'jwt_cache_miss':
        this.metrics.auth.jwtCacheMisses++;
        break;
      
      case 'heartbeat':
        this.metrics.auth.heartbeats++;
        if (userId) this.metrics.auth.activeUsers.add(userId);
        break;
    }
  }

  // 🚨 REGISTRAR ERRO CRÍTICO
  recordCriticalError(req, res, responseTime) {
    const error = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${responseTime.toFixed(2)}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      headers: req.headers
    };
    
    this.metrics.errors.critical.push(error);
    
    // Manter apenas últimos 100 erros críticos
    if (this.metrics.errors.critical.length > 100) {
      this.metrics.errors.critical.shift();
    }
    
    console.error('🚨 [MONITORING] Critical error:', error);
  }

  // 🔧 ATUALIZAR MÉTRICAS DO SISTEMA
  updateSystemMetrics() {
    const now = Date.now();
    this.metrics.system.uptime = now - this.metrics.system.startTime;
    
    const memUsage = process.memoryUsage();
    this.metrics.system.memoryUsage = memUsage.heapUsed;
    
    // CPU usage seria implementado com bibliotecas específicas
    // this.metrics.system.cpuUsage = getCPUUsage();
  }

  // 🧹 LIMPAR MÉTRICAS ANTIGAS
  cleanupMetrics() {
    // Limpar tempos de resposta antigos
    if (this.metrics.performance.responseTimes.length > 500) {
      this.metrics.performance.responseTimes = this.metrics.performance.responseTimes.slice(-500);
    }
    
    // Limpar usuários ativos antigos (manter apenas últimos 1000)
    if (this.metrics.auth.activeUsers.size > 1000) {
      const activeArray = Array.from(this.metrics.auth.activeUsers);
      this.metrics.auth.activeUsers = new Set(activeArray.slice(-1000));
    }
    
    console.log('🧹 [MONITORING] Métricas limpas');
  }

  // 📊 OBTER RELATÓRIO COMPLETO
  getReport() {
    const now = Date.now();
    
    return {
      timestamp: new Date().toISOString(),
      uptime: now - this.metrics.system.startTime,
      
      requests: {
        total: this.metrics.requests.total,
        successful: this.metrics.requests.successful,
        failed: this.metrics.requests.failed,
        successRate: this.metrics.requests.total > 0 ? 
          (this.metrics.requests.successful / this.metrics.requests.total * 100).toFixed(2) + '%' : '0%',
        
        byMethod: Object.fromEntries(this.metrics.requests.byMethod),
        byEndpoint: Object.fromEntries(this.metrics.requests.byEndpoint),
        byStatus: Object.fromEntries(this.metrics.requests.byStatus)
      },
      
      performance: {
        avgResponseTime: `${this.metrics.performance.avgResponseTime.toFixed(2)}ms`,
        p95ResponseTime: `${this.metrics.performance.p95ResponseTime.toFixed(2)}ms`,
        p99ResponseTime: `${this.metrics.performance.p99ResponseTime.toFixed(2)}ms`
      },
      
      authentication: {
        loginAttempts: this.metrics.auth.loginAttempts,
        loginSuccess: this.metrics.auth.loginSuccess,
        loginFailed: this.metrics.auth.loginFailed,
        loginSuccessRate: this.metrics.auth.loginAttempts > 0 ?
          (this.metrics.auth.loginSuccess / this.metrics.auth.loginAttempts * 100).toFixed(2) + '%' : '0%',
        
        jwtValidations: this.metrics.auth.jwtValidations,
        jwtCacheHits: this.metrics.auth.jwtCacheHits,
        jwtCacheMisses: this.metrics.auth.jwtCacheMisses,
        jwtCacheHitRate: this.metrics.auth.jwtValidations > 0 ?
          (this.metrics.auth.jwtCacheHits / this.metrics.auth.jwtValidations * 100).toFixed(2) + '%' : '0%',
        
        activeUsers: this.metrics.auth.activeUsers.size,
        heartbeats: this.metrics.auth.heartbeats
      },
      
      errors: {
        total: this.metrics.errors.total,
        by4xx: this.metrics.errors.by4xx,
        by5xx: this.metrics.errors.by5xx,
        critical: this.metrics.errors.critical.length
      },
      
      system: {
        memoryUsage: `${(this.metrics.system.memoryUsage / 1024 / 1024).toFixed(2)} MB`,
        uptime: `${Math.floor(this.metrics.system.uptime / 1000 / 60)} minutes`
      }
    };
  }

  // 🔍 HEALTH CHECK INTELIGENTE
  getHealthStatus() {
    const avgResponseTime = this.metrics.performance.avgResponseTime;
    const errorRate = this.metrics.requests.total > 0 ? 
      (this.metrics.requests.failed / this.metrics.requests.total) : 0;
    
    let status = 'healthy';
    let issues = [];
    
    // Verificar tempo de resposta
    if (avgResponseTime > 1000) {
      status = 'degraded';
      issues.push('High response time');
    }
    
    // Verificar taxa de erro
    if (errorRate > 0.05) { // > 5%
      status = 'unhealthy';
      issues.push('High error rate');
    }
    
    // Verificar erros críticos recentes
    const recentCriticalErrors = this.metrics.errors.critical.filter(
      error => Date.now() - new Date(error.timestamp).getTime() < 5 * 60 * 1000 // 5 minutos
    );
    
    if (recentCriticalErrors.length > 3) {
      status = 'critical';
      issues.push('Multiple critical errors');
    }
    
    return {
      status,
      issues,
      metrics: {
        avgResponseTime: `${avgResponseTime.toFixed(2)}ms`,
        errorRate: `${(errorRate * 100).toFixed(2)}%`,
        activeUsers: this.metrics.auth.activeUsers.size,
        uptime: Math.floor(this.metrics.system.uptime / 1000 / 60)
      }
    };
  }
}

// Instância singleton
const monitoring = new MonitoringSystem();

module.exports = monitoring; 