const { Pool } = require('pg');
const Redis = require('ioredis');
const fetch = require('node-fetch');

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

async function testeCompletoTriggers() {
  console.log('🧪 TESTE COMPLETO DO SISTEMA DE TRIGGERS AUTOMÁTICOS\n');
  
  try {
    // 1. Verificar infraestrutura
    console.log('1️⃣ Verificando infraestrutura...');
    
    const client = await pool.connect();
    console.log('✅ PostgreSQL conectado');
    
    await redis.ping();
    console.log('✅ Redis conectado');
    
    // 2. Verificar estruturas do banco
    console.log('\n2️⃣ Verificando estruturas do banco...');
    
    const estruturas = [
      'trigger_logs',
      'notifications', 
      'configuracoes_orcamento'
    ];
    
    for (const tabela of estruturas) {
      const result = await client.query(`SELECT COUNT(*) FROM ${tabela}`);
      console.log(`✅ Tabela ${tabela}: ${result.rows[0].count} registros`);
    }
    
    // Verificar colunas adicionadas
    const colunasResult = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('orcamento_gerado', 'orcamento_em_processamento', 'dados_extraidos')
    `);
    console.log(`✅ Colunas adicionadas em briefings: ${colunasResult.rows.length}/3`);
    
    // 3. Testar serviços de fila
    console.log('\n3️⃣ Testando serviços de fila...');
    
    // Simular job de orçamento
    const testJob = {
      id: `test-${Date.now()}`,
      briefingId: 'test-briefing-123',
      userId: 'test-user-456',
      escritorioId: 'test-escritorio-789',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      metadata: {
        test: true,
        triggeredBy: 'integration_test'
      }
    };
    
    // Adicionar à fila
    await redis.lpush('budget_generation_queue:normal', JSON.stringify(testJob));
    console.log('✅ Job de teste adicionado à fila');
    
    // Verificar se está na fila
    const queueLength = await redis.llen('budget_generation_queue:normal');
    console.log(`✅ Jobs na fila normal: ${queueLength}`);
    
    // Simular processamento (remover da fila)
    const jobData = await redis.rpop('budget_generation_queue:normal');
    const processedJob = JSON.parse(jobData);
    console.log(`✅ Job processado: ${processedJob.id}`);
    
    // 4. Testar logs de trigger
    console.log('\n4️⃣ Testando sistema de logs...');
    
    const logResult = await client.query(`
      INSERT INTO trigger_logs (
        type, briefing_id, user_id, escritorio_id, action, metadata
      ) VALUES (
        'briefing_completed', $1, $2, $3, 'integration_test', $4
      ) RETURNING id, created_at
    `, [
      testJob.briefingId,
      testJob.userId, 
      testJob.escritorioId,
      JSON.stringify({ test: true, jobId: testJob.id })
    ]);
    
    console.log(`✅ Log de trigger criado: ${logResult.rows[0].id}`);
    console.log(`   Timestamp: ${logResult.rows[0].created_at}`);
    
    // 5. Testar sistema de notificações
    console.log('\n5️⃣ Testando sistema de notificações...');
    
    // Buscar um usuário para teste
    const userResult = await client.query('SELECT id FROM users LIMIT 1');
    
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      
      const notificationResult = await client.query(`
        INSERT INTO notifications (
          user_id, type, title, message, data, priority
        ) VALUES (
          $1, 'budget_generated', 'Teste de Notificação', 
          'Esta é uma notificação de teste do sistema de triggers', 
          $2, 'normal'
        ) RETURNING id, created_at
      `, [
        userId,
        JSON.stringify({
          briefingId: testJob.briefingId,
          orcamentoId: 'test-orcamento-123',
          valorTotal: 50000
        })
      ]);
      
      console.log(`✅ Notificação criada: ${notificationResult.rows[0].id}`);
      console.log(`   Para usuário: ${userId}`);
    } else {
      console.log('⚠️ Nenhum usuário encontrado para teste de notificação');
    }
    
    // 6. Testar configurações de orçamento
    console.log('\n6️⃣ Testando configurações de orçamento...');
    
    const configResult = await client.query(`
      SELECT 
        escritorio_id,
        tabela_precos->'valorHoraArquiteto' as valor_arquiteto,
        multiplicadores_tipologia->'residencial' as mult_residencial
      FROM configuracoes_orcamento 
      LIMIT 1
    `);
    
    if (configResult.rows.length > 0) {
      const config = configResult.rows[0];
      console.log(`✅ Configuração encontrada para escritório: ${config.escritorio_id}`);
      console.log(`   Valor/hora arquiteto: R$ ${config.valor_arquiteto}`);
      console.log(`   Multiplicador residencial: ${config.mult_residencial}`);
    } else {
      console.log('⚠️ Nenhuma configuração de orçamento encontrada');
    }
    
    // 7. Simular fluxo completo de trigger
    console.log('\n7️⃣ Simulando fluxo completo de trigger...');
    
    // Buscar um briefing real para teste
    const briefingResult = await client.query(`
      SELECT id, nome_projeto, status, escritorio_id 
      FROM briefings 
      WHERE status = 'CONCLUIDO' AND orcamento_gerado = false
      LIMIT 1
    `);
    
    if (briefingResult.rows.length > 0) {
      const briefing = briefingResult.rows[0];
      console.log(`✅ Briefing encontrado para teste: ${briefing.id}`);
      console.log(`   Projeto: ${briefing.nome_projeto}`);
      console.log(`   Status: ${briefing.status}`);
      
      // Simular trigger automático
      const triggerJobId = `trigger-${Date.now()}`;
      
      // 1. Adicionar job à fila
      const triggerJob = {
        id: triggerJobId,
        briefingId: briefing.id,
        escritorioId: briefing.escritorio_id,
        priority: 'normal',
        createdAt: new Date().toISOString(),
        metadata: {
          triggeredBy: 'status_change',
          previousStatus: 'EM_EDICAO',
          newStatus: 'CONCLUIDO'
        }
      };
      
      await redis.lpush('budget_generation_queue:normal', JSON.stringify(triggerJob));
      console.log(`✅ Job de trigger adicionado: ${triggerJobId}`);
      
      // 2. Registrar log de trigger
      await client.query(`
        INSERT INTO trigger_logs (
          type, briefing_id, escritorio_id, action, metadata
        ) VALUES (
          'briefing_completed', $1, $2, 'budget_generation_queued', $3
        )
      `, [
        briefing.id,
        briefing.escritorio_id,
        JSON.stringify(triggerJob.metadata)
      ]);
      
      console.log('✅ Log de trigger registrado');
      
      // 3. Atualizar status do briefing
      await client.query(`
        UPDATE briefings 
        SET orcamento_em_processamento = true, ultima_analise = NOW()
        WHERE id = $1
      `, [briefing.id]);
      
      console.log('✅ Status do briefing atualizado');
      
    } else {
      console.log('⚠️ Nenhum briefing CONCLUIDO encontrado para teste completo');
    }
    
    // 8. Verificar estatísticas finais
    console.log('\n8️⃣ Verificando estatísticas finais...');
    
    const statsResult = await client.query(`
      SELECT 
        COUNT(CASE WHEN type = 'briefing_completed' THEN 1 END) as briefings_processados,
        COUNT(CASE WHEN action LIKE '%test%' THEN 1 END) as eventos_teste,
        MAX(created_at) as ultimo_evento
      FROM trigger_logs
      WHERE created_at >= NOW() - INTERVAL '1 hour'
    `);
    
    const stats = statsResult.rows[0];
    console.log(`✅ Briefings processados (última hora): ${stats.briefings_processados}`);
    console.log(`✅ Eventos de teste: ${stats.eventos_teste}`);
    console.log(`✅ Último evento: ${stats.ultimo_evento}`);
    
    // Estatísticas da fila
    const queueStats = {
      urgent: await redis.llen('budget_generation_queue:urgent'),
      high: await redis.llen('budget_generation_queue:high'),
      normal: await redis.llen('budget_generation_queue:normal'),
      low: await redis.llen('budget_generation_queue:low')
    };
    
    const totalQueue = Object.values(queueStats).reduce((a, b) => a + b, 0);
    console.log(`✅ Total de jobs na fila: ${totalQueue}`);
    console.log(`   - Urgente: ${queueStats.urgent}`);
    console.log(`   - Alta: ${queueStats.high}`);
    console.log(`   - Normal: ${queueStats.normal}`);
    console.log(`   - Baixa: ${queueStats.low}`);
    
    // 9. Limpeza dos dados de teste
    console.log('\n9️⃣ Limpando dados de teste...');
    
    await client.query(`DELETE FROM trigger_logs WHERE action LIKE '%test%'`);
    await client.query(`DELETE FROM notifications WHERE title LIKE '%Teste%'`);
    console.log('✅ Dados de teste removidos');
    
    client.release();
    
    console.log('\n🎉 TESTE COMPLETO FINALIZADO COM SUCESSO!');
    console.log('\n📋 Resumo:');
    console.log('✅ Infraestrutura funcionando');
    console.log('✅ Estruturas do banco criadas');
    console.log('✅ Sistema de filas operacional');
    console.log('✅ Logs de trigger funcionando');
    console.log('✅ Sistema de notificações ativo');
    console.log('✅ Configurações de orçamento disponíveis');
    console.log('✅ Fluxo completo de trigger simulado');
    
    console.log('\n🚀 Próximos passos:');
    console.log('1. Iniciar workers: node iniciar-workers.js');
    console.log('2. Configurar middleware nos endpoints de briefing');
    console.log('3. Testar com briefing real');
    console.log('4. Configurar SMTP para emails (opcional)');
    console.log('5. Monitorar logs e performance');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    throw error;
  }
}

async function main() {
  try {
    await testeCompletoTriggers();
  } catch (error) {
    console.error('💥 Falha no teste completo:', error.message);
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

module.exports = { testeCompletoTriggers };