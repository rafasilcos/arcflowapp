#!/usr/bin/env node

// VERIFICAR TIPOS DAS COLUNAS DA TABELA BRIEFINGS
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO TIPOS DAS COLUNAS');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarTipos() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar tipos das colunas da tabela briefings
    console.log('\n📋 TIPOS DAS COLUNAS DA TABELA BRIEFINGS:');
    const colunas = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      AND column_name IN ('id', 'cliente_id', 'responsavel_id', 'escritorio_id', 'created_by')
      ORDER BY ordinal_position
    `);
    
    colunas.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.udt_name})`);
    });
    
    // Verificar tipos das colunas das outras tabelas
    console.log('\n👥 TIPOS DAS COLUNAS DA TABELA USERS:');
    const colunasUsers = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('id', 'escritorio_id')
      ORDER BY ordinal_position
    `);
    
    colunasUsers.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.udt_name})`);
    });
    
    console.log('\n🏢 TIPOS DAS COLUNAS DA TABELA ESCRITORIOS:');
    const colunasEscritorios = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'escritorios' 
      AND column_name = 'id'
      ORDER BY ordinal_position
    `);
    
    colunasEscritorios.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.udt_name})`);
    });
    
    console.log('\n👥 TIPOS DAS COLUNAS DA TABELA CLIENTES:');
    const colunasClientes = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'clientes' 
      AND column_name IN ('id', 'escritorio_id')
      ORDER BY ordinal_position
    `);
    
    colunasClientes.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.udt_name})`);
    });
    
    await client.end();
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    try {
      await client.end();
    } catch (e) {}
  }
}

verificarTipos();