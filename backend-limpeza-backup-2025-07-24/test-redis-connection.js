const redis = require('redis');
const winston = require('winston');

// Logger simples
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

async function testRedisConnection() {
  logger.info('🔍 Testando conexão Redis...');
  
  const client = redis.createClient({
    url: 'redis://localhost:6379'
  });
  
  client.on('error', (err) => {
    logger.error('❌ Redis Error:', err.message);
  });
  
  client.on('connect', () => {
    logger.info('✅ Redis conectado!');
  });
  
  try {
    await client.connect();
    logger.info('✅ Conexão Redis estabelecida');
    
    // Teste básico
    await client.set('arcflow:test', 'Redis funcionando!');
    const value = await client.get('arcflow:test');
    logger.info('✅ Teste Redis:', value);
    
    // Teste com TTL
    await client.setEx('arcflow:test:ttl', 10, 'Expira em 10 segundos');
    const ttl = await client.ttl('arcflow:test:ttl');
    logger.info('✅ TTL teste:', ttl, 'segundos');
    
    // Limpeza
    await client.del('arcflow:test');
    await client.del('arcflow:test:ttl');
    
    logger.info('🎉 Redis funcionando perfeitamente!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error('❌ Redis não está rodando!');
      logger.info('💡 Para iniciar Redis:');
      logger.info('   - Windows: Baixar Redis para Windows');
      logger.info('   - Linux/Mac: sudo service redis-server start');
      logger.info('   - Docker: docker run -d -p 6379:6379 redis:alpine');
    } else {
      logger.error('❌ Erro Redis:', error.message);
    }
  } finally {
    try {
      await client.quit();
      logger.info('✅ Conexão Redis fechada');
    } catch (error) {
      // Ignorar erros ao fechar
    }
  }
}

// Executar teste
testRedisConnection().catch(console.error); 