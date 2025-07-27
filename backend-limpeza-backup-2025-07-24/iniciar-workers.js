#!/usr/bin/env node

const { workerManager } = require('./src/workers');

// Configuração dos workers baseada em variáveis de ambiente
const config = {
  orcamentoWorkers: parseInt(process.env.ORCAMENTO_WORKERS || '2'),
  enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info'
};

console.log('🚀 Iniciando ArcFlow Workers...');
console.log('⚙️ Configuração:');
console.log(`   - Workers de Orçamento: ${config.orcamentoWorkers}`);
console.log(`   - Notificações: ${config.enableNotifications ? 'Habilitadas' : 'Desabilitadas'}`);
console.log(`   - Log Level: ${config.logLevel}`);
console.log('');

async function iniciarWorkers() {
  try {
    // Inicia o gerenciador de workers
    await workerManager.start({
      orcamentoWorkers: config.orcamentoWorkers,
      enableNotifications: config.enableNotifications
    });

    console.log('✅ Workers iniciados com sucesso!');
    console.log('');
    
    // Exibe estatísticas iniciais
    const stats = await workerManager.getFullStats();
    console.log('📊 Status inicial:');
    console.log(`   - Workers de orçamento ativos: ${stats.orcamentoWorkers.length}`);
    console.log(`   - Fila de orçamentos: ${JSON.stringify(stats.queueStats.queued)}`);
    console.log(`   - Jobs em processamento: ${stats.queueStats.processing}`);
    console.log('');

    // Configura monitoramento periódico
    setInterval(async () => {
      try {
        const currentStats = await workerManager.getFullStats();
        const totalQueued = Object.values(currentStats.queueStats.queued).reduce((a, b) => a + b, 0);
        
        if (totalQueued > 0 || currentStats.queueStats.processing > 0) {
          console.log(`📈 [${new Date().toLocaleTimeString()}] Fila: ${totalQueued} | Processando: ${currentStats.queueStats.processing}`);
        }
      } catch (error) {
        console.error('Erro ao obter estatísticas:', error.message);
      }
    }, 30000); // A cada 30 segundos

    // Configura relatório detalhado a cada 5 minutos
    setInterval(async () => {
      try {
        const detailedStats = await workerManager.getFullStats();
        console.log('\n📊 Relatório detalhado:');
        console.log(`   - Uptime: ${Math.round(detailedStats.uptime / 1000 / 60)} minutos`);
        console.log(`   - Jobs concluídos: ${detailedStats.queueStats.completed}`);
        console.log(`   - Jobs falhados: ${detailedStats.queueStats.failed}`);
        
        detailedStats.orcamentoWorkers.forEach((worker, index) => {
          console.log(`   - Worker ${index + 1}: ${worker.successfulJobs}/${worker.processedJobs} sucessos (${Math.round(worker.averageProcessingTime)}ms médio)`);
        });
        console.log('');
      } catch (error) {
        console.error('Erro ao gerar relatório:', error.message);
      }
    }, 300000); // A cada 5 minutos

    console.log('🔄 Workers rodando... (Ctrl+C para parar)');
    console.log('📝 Logs serão exibidos conforme jobs são processados');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao iniciar workers:', error);
    process.exit(1);
  }
}

// Handlers para shutdown graceful
process.on('SIGTERM', async () => {
  console.log('\n🛑 Recebido SIGTERM, parando workers...');
  await workerManager.stop();
  console.log('✅ Workers parados com sucesso');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Recebido SIGINT (Ctrl+C), parando workers...');
  await workerManager.stop();
  console.log('✅ Workers parados com sucesso');
  process.exit(0);
});

// Handler para erros não capturados
process.on('uncaughtException', async (error) => {
  console.error('💥 Erro não capturado:', error);
  await workerManager.stop();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Promise rejeitada não tratada:', reason);
  await workerManager.stop();
  process.exit(1);
});

// Inicia os workers
iniciarWorkers();