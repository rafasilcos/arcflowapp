/**
 * LIMPAR RATE LIMIT
 * 
 * Este script limpa o rate limit do Redis para permitir novos logins
 */

const redis = require('redis');

async function limparRateLimit() {
  let client;
  
  try {
    console.log('🔍 LIMPANDO RATE LIMIT');
    console.log('='.repeat(50));

    // Conectar ao Redis
    client = redis.createClient({
      host: 'localhost',
      port: 6379
    });

    await client.connect();
    console.log('✅ Conectado ao Redis');

    // Limpar todas as chaves de rate limit
    const keys = await client.keys('rate_limit:*');
    console.log(`📊 Encontradas ${keys.length} chaves de rate limit`);

    if (keys.length > 0) {
      await client.del(keys);
      console.log('✅ Rate limit limpo com sucesso');
    } else {
      console.log('ℹ️ Nenhuma chave de rate limit encontrada');
    }

    // Limpar também chaves de login attempts
    const loginKeys = await client.keys('login_attempts:*');
    console.log(`📊 Encontradas ${loginKeys.length} chaves de login attempts`);

    if (loginKeys.length > 0) {
      await client.del(loginKeys);
      console.log('✅ Login attempts limpos com sucesso');
    }

    console.log('\n🎯 Rate limit limpo! Agora pode tentar fazer login novamente.');

  } catch (error) {
    console.error('❌ Erro ao limpar rate limit:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('ℹ️ Redis não está rodando - rate limit pode estar em memória');
      console.log('   Reinicie o servidor backend para limpar o rate limit');
    }
  } finally {
    if (client) {
      await client.quit();
    }
  }
}

limparRateLimit();