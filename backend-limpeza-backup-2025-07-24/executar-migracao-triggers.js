const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'arcflow',
  password: process.env.DB_PASSWORD || 'sua_senha',
  port: process.env.DB_PORT || 5432,
});

async function executarMigracao() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migração do sistema de triggers automáticos...');
    
    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '002-sistema-triggers-automaticos.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Executa a migração
    console.log('📝 Executando migração...');
    await client.query(migrationSQL);
    
    console.log('✅ Migração executada com sucesso!');
    
    // Verifica se as tabelas foram criadas
    console.log('🔍 Verificando estruturas criadas...');
    
    const verificacoes = [
      {
        nome: 'trigger_logs',
        query: "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'trigger_logs'"
      },
      {
        nome: 'notifications',
        query: "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'notifications'"
      },
      {
        nome: 'briefings.orcamento_gerado',
        query: "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'briefings' AND column_name = 'orcamento_gerado'"
      },
      {
        nome: 'orcamentos.gerado_automaticamente',
        query: "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'orcamentos' AND column_name = 'gerado_automaticamente'"
      }
    ];
    
    for (const verificacao of verificacoes) {
      const result = await client.query(verificacao.query);
      const existe = parseInt(result.rows[0].count) > 0;
      console.log(`${existe ? '✅' : '❌'} ${verificacao.nome}: ${existe ? 'OK' : 'FALHOU'}`);
    }
    
    // Verifica índices criados
    console.log('🔍 Verificando índices...');
    const indices = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename IN ('briefings', 'orcamentos', 'trigger_logs', 'notifications')
      AND indexname LIKE 'idx_%'
      ORDER BY indexname
    `);
    
    console.log(`📊 Índices criados: ${indices.rows.length}`);
    indices.rows.forEach(row => {
      console.log(`   - ${row.indexname}`);
    });
    
    // Verifica configurações padrão
    console.log('🔍 Verificando configurações padrão...');
    const configCount = await client.query('SELECT COUNT(*) FROM configuracoes_orcamento');
    console.log(`⚙️ Configurações de orçamento criadas: ${configCount.rows[0].count}`);
    
    console.log('\n🎉 Sistema de triggers automáticos configurado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configurar Redis para as filas de processamento');
    console.log('2. Iniciar os workers de orçamento');
    console.log('3. Configurar SMTP para notificações por email (opcional)');
    console.log('4. Testar o sistema com um briefing de exemplo');
    
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await executarMigracao();
  } catch (error) {
    console.error('💥 Falha na migração:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { executarMigracao };