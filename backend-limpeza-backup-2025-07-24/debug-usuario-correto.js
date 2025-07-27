#!/usr/bin/env node

// DEBUG DO USUÁRIO CORRETO
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 DEBUG DO USUÁRIO CORRETO');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugUsuario() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Buscar pelo ID específico que você mencionou
    console.log('\n🎯 BUSCANDO PELO ID ESPECÍFICO:');
    const porId = await client.query(`
      SELECT u.id, u.nome, u.email, u.escritorio_id, u.role, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    `);
    
    if (porId.rows.length > 0) {
      const user = porId.rows[0];
      console.log('✅ USUÁRIO ENCONTRADO PELO ID:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nome: ${user.nome}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Escritório ID: ${user.escritorio_id}`);
      console.log(`  Escritório Nome: ${user.escritorio_nome}`);
    } else {
      console.log('❌ Usuário não encontrado pelo ID específico');
    }
    
    // Buscar pelo email
    console.log('\n📧 BUSCANDO PELO EMAIL:');
    const porEmail = await client.query(`
      SELECT u.id, u.nome, u.email, u.escritorio_id, u.role, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.email = 'admin@arcflow.com'
    `);
    
    if (porEmail.rows.length > 0) {
      const user = porEmail.rows[0];
      console.log('✅ USUÁRIO ENCONTRADO PELO EMAIL:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nome: ${user.nome}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Escritório ID: ${user.escritorio_id}`);
      console.log(`  Escritório Nome: ${user.escritorio_nome}`);
    } else {
      console.log('❌ Usuário não encontrado pelo email');
    }
    
    // Listar todos os usuários para debug
    console.log('\n📋 TODOS OS USUÁRIOS (para debug):');
    const todos = await client.query(`
      SELECT u.id, u.nome, u.email, u.escritorio_id, u.role
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 10
    `);
    
    todos.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nome} (${user.email})`);
      console.log(`     ID: ${user.id}`);
      console.log(`     Escritório: ${user.escritorio_id}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     ---`);
    });
    
    await client.end();
    console.log('\n🎉 DEBUG CONCLUÍDO!');
    
  } catch (error) {
    console.log(`❌ ERRO: ${error.message}`);
    try {
      await client.end();
    } catch (e) {}
  }
}

debugUsuario();