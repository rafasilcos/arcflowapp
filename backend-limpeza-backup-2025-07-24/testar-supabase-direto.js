#!/usr/bin/env node

// TESTE DIRETO COM SUPABASE
const { Client } = require('pg');

console.log('🔍 TESTE DIRETO COM SUPABASE');
console.log('=' .repeat(40));

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔄 Testando conexão com Supabase...');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testarConexao() {
  try {
    console.log('📡 Conectando...');
    await client.connect();
    console.log('✅ CONEXÃO ESTABELECIDA!');
    
    // Testar query básica
    console.log('🔄 Testando query básica...');
    const result = await client.query('SELECT NOW() as tempo_atual, version() as versao');
    console.log(`⏰ Tempo: ${result.rows[0].tempo_atual}`);
    console.log(`🗄️  Versão: ${result.rows[0].versao.split(' ')[0]}`);
    
    // Verificar tabelas do ArcFlow
    console.log('\n🔄 Verificando tabelas do ArcFlow...');
    const tabelas = await client.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as colunas
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      AND table_name IN ('escritorios', 'users', 'clientes', 'briefings', 'orcamentos')
      ORDER BY table_name
    `);
    
    if (tabelas.rows.length > 0) {
      console.log('📋 TABELAS ENCONTRADAS:');
      tabelas.rows.forEach(row => {
        console.log(`  ✅ ${row.table_name} (${row.colunas} colunas)`);
      });
    } else {
      console.log('⚠️  NENHUMA TABELA DO ARCFLOW ENCONTRADA');
      console.log('💡 Pode ser necessário executar as migrações primeiro');
    }
    
    // Verificar se há dados de teste
    if (tabelas.rows.some(r => r.table_name === 'escritorios')) {
      console.log('\n🔄 Verificando escritórios...');
      const escritorios = await client.query('SELECT id, nome, email FROM escritorios LIMIT 5');
      console.log(`📊 Escritórios encontrados: ${escritorios.rows.length}`);
      
      if (escritorios.rows.length > 0) {
        escritorios.rows.forEach(esc => {
          console.log(`  - ${esc.nome} (${esc.email || 'sem email'})`);
        });
      }
    }
    
    if (tabelas.rows.some(r => r.table_name === 'briefings')) {
      console.log('\n🔄 Verificando briefings existentes...');
      const briefings = await client.query(`
        SELECT COUNT(*) as total,
               COUNT(CASE WHEN metadados->>'origem' = 'preenchimento_automatico' THEN 1 END) as automaticos
        FROM briefings
      `);
      
      console.log(`📊 Total de briefings: ${briefings.rows[0].total}`);
      console.log(`🤖 Briefings automáticos: ${briefings.rows[0].automaticos}`);
    }
    
    await client.end();
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ O banco está funcionando e pronto para uso');
    
    return true;
    
  } catch (error) {
    console.log(`\n❌ ERRO: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Problema de DNS - verifique sua conexão com internet');
    } else if (error.message.includes('password')) {
      console.log('💡 Problema de autenticação - credenciais podem estar incorretas');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Timeout de conexão - servidor pode estar sobrecarregado');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Conexão recusada - servidor pode estar offline');
    }
    
    try {
      await client.end();
    } catch (e) {
      // Ignorar erro ao fechar
    }
    
    return false;
  }
}

testarConexao().then(sucesso => {
  if (sucesso) {
    console.log('\n🚀 PRÓXIMO PASSO: Execute o script de preenchimento');
    console.log('   node script-preenchimento-briefings.js');
  } else {
    console.log('\n🔧 VERIFIQUE:');
    console.log('1. Conexão com internet');
    console.log('2. Credenciais do Supabase');
    console.log('3. Status do projeto Supabase');
  }
}).catch(error => {
  console.error('💥 Erro fatal:', error.message);
});