const NodeCache = require('node-cache');

// Cache para CPFs verificados (TTL: 5 minutos)
const cpfCache = new NodeCache({ 
  stdTTL: 300, // 5 minutos
  checkperiod: 60, // Verifica expiração a cada 1 minuto
  maxKeys: 10000 // Máximo 10k CPFs em cache
});

// Cache para estatísticas de rate limiting
const rateLimitCache = new NodeCache({ 
  stdTTL: 60, // 1 minuto
  checkperiod: 10 // Verifica a cada 10 segundos
});

/**
 * Gerar chave única para cache de CPF por escritório
 */
const gerarChaveCpf = (cpf, escritorioId) => {
  return `cpf:${cpf}:${escritorioId}`;
};

/**
 * Verificar se CPF está em cache
 */
const obterCpfCache = (cpf, escritorioId) => {
  const chave = gerarChaveCpf(cpf, escritorioId);
  const resultado = cpfCache.get(chave);
  
  if (resultado) {
    console.log(`🚀 [CACHE HIT] CPF ${cpf} encontrado em cache`);
    return resultado;
  }
  
  console.log(`💾 [CACHE MISS] CPF ${cpf} não encontrado em cache`);
  return null;
};

/**
 * Armazenar resultado da verificação de CPF em cache
 */
const armazenarCpfCache = (cpf, escritorioId, resultado) => {
  const chave = gerarChaveCpf(cpf, escritorioId);
  cpfCache.set(chave, resultado);
  console.log(`💾 [CACHE SET] CPF ${cpf} armazenado em cache`);
};

/**
 * Invalidar cache de CPF específico (quando cliente é criado/atualizado)
 */
const invalidarCpfCache = (cpf, escritorioId) => {
  const chave = gerarChaveCpf(cpf, escritorioId);
  cpfCache.del(chave);
  console.log(`🗑️ [CACHE DEL] CPF ${cpf} removido do cache`);
};

/**
 * Rate limiting inteligente por usuário
 */
const verificarRateLimit = (userId, limite = 30) => { // 30 verificações por minuto por usuário
  const chave = `ratelimit:${userId}`;
  const contador = rateLimitCache.get(chave) || 0;
  
  if (contador >= limite) {
    console.log(`🚫 [RATE LIMIT] Usuário ${userId} excedeu limite de ${limite}/min`);
    return false;
  }
  
  rateLimitCache.set(chave, contador + 1);
  return true;
};

/**
 * Estatísticas do cache
 */
const obterEstatisticasCache = () => {
  const cpfStats = cpfCache.getStats();
  const rateLimitStats = rateLimitCache.getStats();
  
  return {
    cpf: {
      keys: cpfStats.keys,
      hits: cpfStats.hits,
      misses: cpfStats.misses,
      hitRate: cpfStats.hits / (cpfStats.hits + cpfStats.misses) * 100
    },
    rateLimit: {
      keys: rateLimitStats.keys,
      hits: rateLimitStats.hits,
      misses: rateLimitStats.misses
    }
  };
};

/**
 * Limpar cache periodicamente (para evitar vazamento de memória)
 */
const limparCacheAntigo = () => {
  const antes = cpfCache.getStats().keys;
  cpfCache.flushAll();
  const depois = cpfCache.getStats().keys;
  
  console.log(`🧹 [CACHE CLEAN] Removidas ${antes - depois} entradas do cache`);
};

// Limpeza automática a cada 10 minutos
setInterval(limparCacheAntigo, 10 * 60 * 1000);

module.exports = {
  obterCpfCache,
  armazenarCpfCache,
  invalidarCpfCache,
  verificarRateLimit,
  obterEstatisticasCache,
  limparCacheAntigo
}; 