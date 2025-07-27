#!/usr/bin/env node

// VERIFICAR ESTRUTURA DA TABELA CLIENTES
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA CLIENTES');
console.log('=' .repeat(50));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarEstrutura() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar colunas da tabela clientes
    console.log('\n📋 COLUNAS DA TABELA CLIENTES:');
    const colunas = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      ORDER BY ordinal_position
    `);
    
    colunas.rows.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Verificar clientes existentes
    console.log('\n📊 CLIENTES EXISTENTES:');
    const clientes = await client.query('SELECT COUNT(*) as total FROM clientes');
    console.log(`Total: ${clientes.rows[0].total}`);
    
    if (clientes.rows[0].total > 0) {
      const exemplos = await client.query('SELECT id, nome, email FROM clientes LIMIT 5');
      console.log('\nExemplos:');
      exemplos.rows.forEach(c => {
        console.log(`  - ${c.nome} (${c.email || 'sem email'})`);
      });
    }
    
    await client.end();
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    try {
      await client.end();
    } catch (e) {}
  }
}

verificarEstrutura();