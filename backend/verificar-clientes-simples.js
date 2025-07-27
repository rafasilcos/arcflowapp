#!/usr/bin/env node

// VERIFICAR CLIENTES EXISTENTES
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO CLIENTES EXISTENTES');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarClientes() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    const escritorioId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    
    // Verificar clientes do escritório correto
    console.log('\n👥 CLIENTES DO ESCRITÓRIO CORRETO:');
    const clientes = await client.query(`
      SELECT id, nome, email, tipo_pessoa, status
      FROM clientes 
      WHERE escritorio_id = $1
      ORDER BY created_at DESC
    `, [escritorioId]);
    
    if (clientes.rows.length > 0) {
      console.log(`Total: ${clientes.rows.length} clientes`);
      clientes.rows.forEach(cliente => {
        console.log(`  - ${cliente.nome} (${cliente.email}) - ${cliente.tipo_pessoa} - ${cliente.status}`);
        console.log(`    ID: ${cliente.id}`);
      });
    } else {
      console.log('⚠️  Nenhum cliente encontrado neste escritório');
    }
    
    // Verificar se existe cliente com email específico
    console.log('\n🔍 VERIFICANDO EMAIL ESPECÍFICO:');
    const clienteEspecifico = await client.query(`
      SELECT id, nome, email, escritorio_id
      FROM clientes 
      WHERE email = 'cliente.teste@arcflow.com.br'
    `);
    
    if (clienteEspecifico.rows.length > 0) {
      const cliente = clienteEspecifico.rows[0];
      console.log('✅ Cliente com email específico encontrado:');
      console.log(`  Nome: ${cliente.nome}`);
      console.log(`  Email: ${cliente.email}`);
      console.log(`  Escritório: ${cliente.escritorio_id}`);
      console.log(`  ID: ${cliente.id}`);
      
      if (cliente.escritorio_id === escritorioId) {
        console.log('✅ Cliente está no escritório correto!');
      } else {
        console.log('⚠️  Cliente está em escritório diferente');
      }
    } else {
      console.log('❌ Cliente com email específico não encontrado');
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

verificarClientes();