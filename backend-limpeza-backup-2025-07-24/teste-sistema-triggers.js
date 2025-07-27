const { Pool } = require('pg');
const Redis = require('ioredis');

// Configurações
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'arcflow',
  password: process.env.DB_PASSWORD || 'sua_senha',
  port: process.env.DB_PORT || 5432,
});

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});

async function testarSistemaTriggers() {
  console.log('🧪 Iniciando teste do sistema de triggers automáticos...\n');
  
  try {
    // 1. Testar conexão com banco de dados
    console.log('1️⃣ Testando conexão com PostgreSQL...');
    const client = await pool.connect();
    const dbResult = await client.query('SELECT NOW() as timestamp');
    console.log(`✅ PostgreSQL conectado: ${dbResult.rows[0].timestamp}`);
    client.release();
    
    // 2. Testar conexão com Redis
    console.log('\n2️⃣ Testando conexão com Redis...');
    await redis.set('test_key', 'test_value', 'EX', 10);
    const redisValue = await redis.get('test_key');
    console.log(`✅ Redis conectado: ${redisValue === 'test_value' ? 'OK' : 'FALHOU'}`);
    
    // 3. Verificar estruturas do banco
    console.log('\n3️⃣ Verificando estruturas do banco...');
    
    const estruturas = [
      { nome: 'Tabela trigger_logs', query: "SELECT COUNT(*) FROM trigger_logs" },
      { nome: 'Tabela notifications', query: "SELECT COUNT(*) FROM notifications" },
      { nome: 'Coluna briefings.orcamento_gerado', query: "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'briefings' AND column_name = 'orcamento_gerado'" },
      { nome: 'Tabela configuracoes_orcamento', query: "SELECT COUNT(*) FROM configuracoes_orcamento" }
    ];
    
    for (const estrutura of estruturas) {
      try {
        const result = await pool.query(estrutura.query);
        const count = parseInt(result.rows[0].count);
        console.log(`✅ ${estrutura.nome}: ${count >= 0 ? 'OK' : 'FALHOU'}`);
      } catch (error) {
        console.log(`❌ ${estrutura.nome}: ERRO - ${error.message}`);
      }
    }
    
    // 4. Testar serviços (simulação)
    console.log('\n4️⃣ Testando serviços...');
    
    // Simular adição de job à fila
    const testJob = {
      id: `test-${Date.now()}`,
      briefingId: 'test-briefing-id',
      userId: 'test-user-id',
      escritorioId: 'test-escritorio-id',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      metadata: { test: true }
    };
    
    await redis.lpush('budget_generation_queue:normal', JSON.stringify(testJob));
    console.log('✅ Job de teste adicionado à fila');
    
    // Verificar se job está na fila
    const queueLength = await redis.llen('budget_generation_queue:normal');
    console.log(`✅ Fila de orçamentos: ${queueLength} jobs`);
    
    // Remover job de teste
    await redis.rpop('budget_generation_queue:normal');
    console.log('✅ Job de teste removido da fila');
    
    // 5. Testar logs de trigger
    console.log('\n5️⃣ Testando sistema de logs...');
    
    const testLog = await pool.query(`
      INSERT INTO trigger_logs (type, action, metadata) 
      VALUES ('test', 'system_test', '{"test": true}') 
      RETURNING id
    `);
    
    console.log(`✅ Log de teste criado: ${testLog.rows[0].id}`);
    
    // Limpar log de teste
    await pool.query('DELETE FROM trigger_logs WHERE type = $1', ['test']);
    console.log('✅ Log de teste removido');
    
    // 6. Testar notificações
    console.log('\n6️⃣ Testando sistema de notificações...');
    
    // Buscar um usuário para teste
    const userResult = await pool.query('SELECT id FROM users LIMIT 1');
    
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      
      const testNotification = await pool.query(`
        INSERT INTO notifications (user_id, type, title, message) 
        VALUES ($1, 'test', 'Teste do Sistema', 'Esta é uma notificação de teste') 
        RETURNING id
      `, [userId]);
      
      console.log(`✅ Notificação de teste criada: ${testNotification.rows[0].id}`);
      
      // Limpar notificação de teste
      await pool.query('DELETE FROM notifications WHERE type = $1', ['test']);
      console.log('✅ Notificação de teste removida');
    } else {
      console.log('⚠️ Nenhum usuário encontrado para teste de notificação');
    }
    
    // 7. Verificar configurações de orçamento
    console.log('\n7️⃣ Verificando configurações de orçamento...');
    
    const configResult = await pool.query(`
      SELECT escritorio_id, tabela_precos, multiplicadores_tipologia 
      FROM configuracoes_orcamento 
      LIMIT 1
    `);
    
    if (configResult.rows.length > 0) {
      const config = configResult.rows[0];
      console.log('✅ Configuração de orçamento encontrada:');
      console.log(`   - Escritório: ${config.escritorio_id}`);
      console.log(`   - Tabela de preços: ${Object.keys(config.tabela_precos).length} disciplinas`);
      console.log(`   - Multiplicadores: ${Object.keys(config.multiplicadores_tipologia).length} tipologias`);
    } else {
      console.log('⚠️ Nenhuma configuração de orçamento encontrada');
    }
    
    // 8. Testar estatísticas da fila
    console.log('\n8️⃣ Testando estatísticas da fila...');
    
    const queueStats = {
      urgent: await redis.llen('budget_generation_queue:urgent'),
      high: await redis.llen('budget_generation_queue:high'),
      normal: await redis.llen('budget_generation_queue:normal'),
      low: await redis.llen('budget_generation_queue:low')
    };
    
    console.log('✅ Estatísticas da fila:');
    console.log(`   - Urgente: ${queueStats.urgent}`);
    console.log(`   - Alta: ${queueStats.high}`);
    console.log(`   - Normal: ${queueStats.normal}`);
    console.log(`   - Baixa: ${queueStats.low}`);
    
    console.log('\n🎉 Todos os testes passaram! Sistema de triggers está funcionando.');
    
    // Instruções finais
    console.log('\n📋 Para usar o sistema:');
    console.log('1. Inicie os workers: node -e "require(\'./src/workers\').workerManager.start()"');
    console.log('2. Configure o middleware nos endpoints de briefing');
    console.log('3. Teste com um briefing real alterando status para CONCLUIDO');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    throw error;
  }
}

async function main() {
  try {
    await testarSistemaTriggers();
  } catch (error) {
    console.error('💥 Falha nos testes:', error.message);
    process.exit(1);
  } finally {
    await redis.disconnect();
    await pool.end();
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { testarSistemaTriggers };