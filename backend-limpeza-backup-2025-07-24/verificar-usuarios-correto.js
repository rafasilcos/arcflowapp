#!/usr/bin/env node

// VERIFICAR USUÁRIOS E ROLES CORRETOS
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO USUÁRIOS E ROLES');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarUsuarios() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar enum UserRole
    console.log('\n📋 VERIFICANDO ENUM UserRole:');
    const enumValues = await client.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = (
        SELECT oid 
        FROM pg_type 
        WHERE typname = 'UserRole'
      )
    `);
    
    if (enumValues.rows.length > 0) {
      console.log('✅ Valores válidos para UserRole:');
      enumValues.rows.forEach(row => {
        console.log(`  - ${row.enumlabel}`);
      });
    } else {
      console.log('⚠️  Enum UserRole não encontrado');
    }
    
    // Verificar usuários existentes
    console.log('\n👥 USUÁRIOS EXISTENTES:');
    const usuarios = await client.query(`
      SELECT u.id, u.nome, u.email, u.role, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      ORDER BY u.created_at DESC
      LIMIT 10
    `);
    
    if (usuarios.rows.length > 0) {
      console.log(`Total: ${usuarios.rows.length} usuários`);
      usuarios.rows.forEach(user => {
        console.log(`  - ${user.nome} (${user.email}) - Role: ${user.role} - Escritório: ${user.escritorio_nome || 'Nenhum'}`);
      });
    } else {
      console.log('⚠️  Nenhum usuário encontrado');
    }
    
    // Verificar escritórios
    console.log('\n🏢 ESCRITÓRIOS EXISTENTES:');
    const escritorios = await client.query(`
      SELECT id, nome, email, 
             (SELECT COUNT(*) FROM users WHERE escritorio_id = escritorios.id) as total_usuarios
      FROM escritorios 
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (escritorios.rows.length > 0) {
      console.log(`Total: ${escritorios.rows.length} escritórios`);
      escritorios.rows.forEach(esc => {
        console.log(`  - ${esc.nome} (${esc.email || 'sem email'}) - ${esc.total_usuarios} usuários`);
      });
    }
    
    // Buscar usuário que pode ser usado como admin
    console.log('\n🔍 BUSCANDO USUÁRIO ADEQUADO PARA ADMIN:');
    const usuarioAdmin = await client.query(`
      SELECT u.id, u.nome, u.email, u.role, e.id as escritorio_id, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE e.id IS NOT NULL
      ORDER BY u.created_at DESC
      LIMIT 1
    `);
    
    if (usuarioAdmin.rows.length > 0) {
      const user = usuarioAdmin.rows[0];
      console.log('✅ USUÁRIO ENCONTRADO PARA USAR:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Nome: ${user.nome}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Escritório: ${user.escritorio_nome} (${user.escritorio_id})`);
    } else {
      console.log('❌ Nenhum usuário adequado encontrado');
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

verificarUsuarios();