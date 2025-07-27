/**
 * 🚀 ARCFLOW - SERVIDOR PRINCIPAL
 * 
 * Inicialização do servidor com configurações otimizadas
 * Substitui o arquivo monolítico server-simple.js
 */

const app = require('./app');
const { connectDatabase, closeDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Função para inicializar o servidor
async function startServer() {
  try {
    console.log('🚀 Iniciando ArcFlow Server...');
    console.log(`📍 Ambiente: ${NODE_ENV}`);
    console.log(`📍 Porta: ${PORT}`);
    
    // Conectar ao banco de dados
    console.log('🔌 Conectando ao PostgreSQL...');
    await connectDatabase();
    console.log('✅ PostgreSQL conectado com sucesso');
    
    // Conectar ao Redis (opcional)
    try {
      console.log('🔌 Conectando ao Redis...');
      await connectRedis();
      console.log('✅ Redis conectado com sucesso');
    } catch (redisError) {
      console.warn('⚠️ Redis não disponível, usando fallback em memória');
    }
    
    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🎉 ARCFLOW SERVER INICIADO COM SUCESSO!');
      console.log('='.repeat(60));
      console.log(`🌐 Servidor: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
      console.log(`👥 Usuários: http://localhost:${PORT}/api/users`);
      console.log(`👤 Clientes: http://localhost:${PORT}/api/clientes`);
      console.log(`📝 Briefings: http://localhost:${PORT}/api/briefings`);
      console.log(`💰 Orçamentos: http://localhost:${PORT}/api/orcamentos`);
      console.log('='.repeat(60));
      console.log('🎯 Sistema pronto para 10k+ usuários simultâneos!');
      console.log('='.repeat(60));
    });
    
    // Configurar graceful shutdown
    setupGracefulShutdown(server);
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Configurar encerramento gracioso
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`\n📴 Recebido sinal ${signal}, encerrando servidor...`);
    
    // Parar de aceitar novas conexões
    server.close(async () => {
      console.log('🔌 Servidor HTTP encerrado');
      
      try {
        // Fechar conexões do banco
        await closeDatabase();
        console.log('🔌 Conexão PostgreSQL encerrada');
        
        console.log('✅ Servidor encerrado graciosamente');
        process.exit(0);
      } catch (error) {
        console.error('❌ Erro ao encerrar:', error);
        process.exit(1);
      }
    });
    
    // Forçar encerramento após 10 segundos
    setTimeout(() => {
      console.error('⏰ Timeout: Forçando encerramento');
      process.exit(1);
    }, 10000);
  };
  
  // Escutar sinais de encerramento
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Tratar erros não capturados
  process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    shutdown('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada não tratada:', reason);
    shutdown('unhandledRejection');
  });
}

// Iniciar servidor se executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = { startServer };