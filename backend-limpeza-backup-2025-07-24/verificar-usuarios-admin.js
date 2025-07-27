#!/usr/bin/env node

// VERIFICAR USUÁRIO ADMIN ESPECÍFICO
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO USUÁRIO ADMIN ESPECÍFICO');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarUsuarioAdmin() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Buscar usuário admin@arcflow.com específico
    console.log('\n👤 BUSCANDO admin@arcflow.com:');
    const usuario = await client.query(`
      SELECT u.id, u.nome, u.email, u.escritorio_id, u.role, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.email = 'admin@arcflow.com'
    `);
    
    if (usuario.rows.length > 0) {
      const user = usuario.rows[0];
      console.log('✅ USUÁRIO ENCONTRADO:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nome: ${user.nome}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Escritório ID: ${user.escritorio_id}`);
      console.log(`  Escritório Nome: ${user.escritorio_nome}`);
      
      // Verificar se o ID é um UUID válido
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id);
      console.log(`  UUID válido: ${isValidUUID ? 'SIM' : 'NÃO'}`);
      
    } else {
      console.log('❌ Usuário admin@arcflow.com não encontrado');
      
      // Buscar usuários similares
      console.log('\n🔍 BUSCANDO USUÁRIOS SIMILARES:');
      const similares = await client.query(`
        SELECT id, nome, email, escritorio_id, role
        FROM users 
        WHERE email ILIKE '%admin%' OR email ILIKE '%arcflow%'
        ORDER BY created_at DESC
      `);
      
      if (similares.rows.length > 0) {
        console.log('Usuários similares encontrados:');
        similares.rows.forEach(user => {
          console.log(`  - ${user.nome} (${user.email}) - ${user.role}`);
          console.log(`    ID: ${user.id}`);
          console.log(`    Escritório: ${user.escritorio_id}`);
        });
      }
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

verificarUsuarioAdmin();