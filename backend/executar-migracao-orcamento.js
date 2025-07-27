#!/usr/bin/env node

/**
 * Script para executar migração de integração briefing-orçamento
 * Executa: node executar-migracao-orcamento.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuração do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function executarMigracao() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migração de integração briefing-orçamento...');
    
    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '001-integracao-briefing-orcamento.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executando SQL de migração...');
    
    // Executar migração
    const result = await client.query(migrationSQL);
    
    console.log('✅ Migração executada com sucesso!');
    console.log('📊 Resultado:', result[result.length - 1]?.rows?.[0]?.resultado || 'Concluído');
    
    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando estruturas criadas...');
    
    const verificacoes = [
      {
        nome: 'Colunas adicionadas em briefings',
        query: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'briefings' 
          AND column_name IN ('orcamento_gerado', 'orcamento_id', 'dados_extraidos', 'ultima_analise')
          ORDER BY column_name;
        `
      },
      {
        nome: 'Tabela orcamentos',
        query: `
          SELECT COUNT(*) as existe 
          FROM information_schema.tables 
          WHERE table_name = 'orcamentos';
        `
      },
      {
        nome: 'Tabela configuracoes_orcamento',
        query: `
          SELECT COUNT(*) as existe 
          FROM information_schema.tables 
          WHERE table_name = 'configuracoes_orcamento';
        `
      },
      {
        nome: 'Tabela historico_orcamentos',
        query: `
          SELECT COUNT(*) as existe 
          FROM information_schema.tables 
          WHERE table_name = 'historico_orcamentos';
        `
      },
      {
        nome: 'Índices criados',
        query: `
          SELECT indexname 
          FROM pg_indexes 
          WHERE tablename IN ('briefings', 'orcamentos', 'configuracoes_orcamento', 'historico_orcamentos')
          AND indexname LIKE 'idx_%'
          ORDER BY indexname;
        `
      },
      {
        nome: 'Configurações padrão inseridas',
        query: `
          SELECT COUNT(*) as total_configuracoes 
          FROM configuracoes_orcamento;
        `
      }
    ];
    
    for (const verificacao of verificacoes) {
      try {
        const resultado = await client.query(verificacao.query);
        console.log(`✅ ${verificacao.nome}:`, resultado.rows);
      } catch (error) {
        console.log(`❌ Erro ao verificar ${verificacao.nome}:`, error.message);
      }
    }
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('📋 Próximos passos:');
    console.log('   1. Implementar Briefing Analysis Engine');
    console.log('   2. Criar APIs de configuração de orçamento');
    console.log('   3. Desenvolver sistema de triggers automáticos');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar migração
if (require.main === module) {
  executarMigracao().catch(console.error);
}

module.exports = { executarMigracao };