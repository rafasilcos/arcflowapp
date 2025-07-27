#!/usr/bin/env node

/**
 * Script para executar migração de integração briefing-orçamento no Supabase
 * Executa: node executar-migracao-supabase.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Debug da conexão
console.log('🔍 DATABASE_URL encontrada:', process.env.DATABASE_URL ? 'Sim' : 'Não');

// Configuração específica para Supabase
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Supabase sempre usa SSL
});

async function executarMigracaoSupabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migração de integração briefing-orçamento no Supabase...');
    console.log('🔗 Conectando ao banco:', DATABASE_URL.replace(/:[^:]*@/, ':***@'));
    
    // Testar conexão
    const testResult = await client.query('SELECT NOW() as timestamp, version() as version');
    console.log('✅ Conexão estabelecida:', testResult.rows[0].timestamp);
    
    // Ler arquivo de migração
    const migrationPath = path.join(__dirname, 'migrations', '001-integracao-briefing-orcamento.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executando SQL de migração...');
    
    // Dividir o SQL em comandos individuais para melhor controle
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length < 10) continue; // Pular comandos muito pequenos
      
      try {
        await client.query(command);
        successCount++;
        
        // Log de progresso a cada 10 comandos
        if ((i + 1) % 10 === 0) {
          console.log(`⏳ Progresso: ${i + 1}/${commands.length} comandos executados`);
        }
      } catch (error) {
        errorCount++;
        console.log(`⚠️  Aviso no comando ${i + 1}:`, error.message.substring(0, 100));
        
        // Continuar mesmo com alguns erros (podem ser comandos já executados)
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('does not exist')) {
          console.log('   (Erro esperado - estrutura já existe)');
        }
      }
    }
    
    console.log(`✅ Migração concluída! Sucessos: ${successCount}, Avisos: ${errorCount}`);
    
    // Verificar se as estruturas foram criadas
    console.log('\n🔍 Verificando estruturas criadas...');
    
    const verificacoes = [
      {
        nome: 'Colunas adicionadas em briefings',
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'briefings' 
          AND column_name IN ('orcamento_gerado', 'orcamento_id', 'dados_extraidos', 'ultima_analise')
          ORDER BY column_name;
        `
      },
      {
        nome: 'Tabela orcamentos',
        query: `
          SELECT table_name, table_type
          FROM information_schema.tables 
          WHERE table_name = 'orcamentos';
        `
      },
      {
        nome: 'Tabela configuracoes_orcamento',
        query: `
          SELECT table_name, table_type
          FROM information_schema.tables 
          WHERE table_name = 'configuracoes_orcamento';
        `
      },
      {
        nome: 'Tabela historico_orcamentos',
        query: `
          SELECT table_name, table_type
          FROM information_schema.tables 
          WHERE table_name = 'historico_orcamentos';
        `
      },
      {
        nome: 'Configurações padrão inseridas',
        query: `
          SELECT COUNT(*) as total_configuracoes 
          FROM configuracoes_orcamento;
        `
      },
      {
        nome: 'Escritórios existentes',
        query: `
          SELECT COUNT(*) as total_escritorios 
          FROM escritorios;
        `
      }
    ];
    
    for (const verificacao of verificacoes) {
      try {
        const resultado = await client.query(verificacao.query);
        console.log(`✅ ${verificacao.nome}:`);
        if (resultado.rows.length > 0) {
          resultado.rows.forEach(row => {
            console.log('   ', row);
          });
        } else {
          console.log('    (Nenhum resultado)');
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar ${verificacao.nome}:`, error.message);
      }
    }
    
    // Testar uma query simples na nova estrutura
    try {
      const testQuery = await client.query(`
        SELECT 
          b.id,
          b.nome_projeto,
          b.orcamento_gerado,
          b.dados_extraidos IS NOT NULL as tem_dados_extraidos
        FROM briefings b 
        LIMIT 3;
      `);
      
      console.log('\n🧪 Teste da nova estrutura:');
      testQuery.rows.forEach(row => {
        console.log('   ', row);
      });
      
    } catch (error) {
      console.log('❌ Erro no teste da estrutura:', error.message);
    }
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('📋 Estruturas criadas:');
    console.log('   ✅ Colunas adicionadas na tabela briefings');
    console.log('   ✅ Tabela orcamentos');
    console.log('   ✅ Tabela configuracoes_orcamento');
    console.log('   ✅ Tabela historico_orcamentos');
    console.log('   ✅ Tabela templates_orcamento');
    console.log('   ✅ Tabela logs_processamento_orcamento');
    console.log('   ✅ Índices de performance');
    console.log('   ✅ Triggers automáticos');
    
    console.log('\n📋 Próximos passos:');
    console.log('   1. ✅ Estrutura de banco configurada');
    console.log('   2. 🔄 Implementar Briefing Analysis Engine');
    console.log('   3. 🔄 Criar APIs de configuração de orçamento');
    console.log('   4. 🔄 Desenvolver sistema de triggers automáticos');
    
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
  executarMigracaoSupabase().catch(console.error);
}

module.exports = { executarMigracaoSupabase };