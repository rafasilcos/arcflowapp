#!/usr/bin/env node

// DEBUG DOS DADOS DOS BRIEFINGS
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 DEBUG DOS DADOS DOS BRIEFINGS');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugDados() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Buscar um briefing de teste para debug
    console.log('\n📋 BUSCANDO BRIEFING DE TESTE:');
    const briefing = await client.query(`
      SELECT id, nome_projeto, metadata, dados_extraidos, area
      FROM briefings 
      WHERE metadata->>'origem' = 'preenchimento_automatico'
      LIMIT 1
    `);
    
    if (briefing.rows.length > 0) {
      const b = briefing.rows[0];
      console.log('✅ BRIEFING ENCONTRADO:');
      console.log(`  ID: ${b.id}`);
      console.log(`  Nome: ${b.nome_projeto}`);
      console.log(`  Área: ${b.area}`);
      
      console.log('\n📊 METADATA:');
      if (b.metadata) {
        console.log(JSON.stringify(b.metadata, null, 2));
      } else {
        console.log('  Metadata vazio');
      }
      
      console.log('\n📊 DADOS_EXTRAIDOS:');
      if (b.dados_extraidos) {
        console.log(JSON.stringify(b.dados_extraidos, null, 2));
      } else {
        console.log('  Dados extraídos vazio');
      }
      
    } else {
      console.log('❌ Nenhum briefing de teste encontrado');
    }
    
    await client.end();
    console.log('\n🎉 DEBUG CONCLUÍDO!');
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    try {
      await client.end();
    } catch (e) {}
  }
}

debugDados();