#!/usr/bin/env node

// VERIFICAR ESTRUTURA DA TABELA BRIEFINGS
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO ESTRUTURA DA TABELA BRIEFINGS');
console.log('=' .repeat(50));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarEstrutura() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar colunas da tabela briefings
    console.log('\n📋 COLUNAS DA TABELA BRIEFINGS:');
    const colunas = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'briefings' 
      ORDER BY ordinal_position
    `);
    
    colunas.rows.forEach((col, index) => {
      console.log(`  ${index + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Verificar se existe algum briefing
    console.log('\n📊 BRIEFINGS EXISTENTES:');
    const briefings = await client.query('SELECT COUNT(*) as total FROM briefings');
    console.log(`Total: ${briefings.rows[0].total}`);
    
    if (briefings.rows[0].total > 0) {
      const exemplos = await client.query('SELECT id, nome_projeto, tipo, subtipo, status FROM briefings LIMIT 3');
      console.log('\nExemplos:');
      exemplos.rows.forEach(b => {
        console.log(`  - ${b.nome_projeto} (${b.tipo}/${b.subtipo}) - ${b.status}`);
      });
    }
    
    // Verificar se precisa adicionar coluna metadados
    const temMetadados = colunas.rows.some(col => col.column_name === 'metadados');
    
    if (!temMetadados) {
      console.log('\n⚠️  COLUNA "metadados" NÃO EXISTE');
      console.log('💡 Será necessário adicionar a coluna para o script funcionar');
      
      console.log('\n🔧 EXECUTANDO ALTERAÇÃO DA TABELA...');
      await client.query('ALTER TABLE briefings ADD COLUMN IF NOT EXISTS metadados JSONB');
      console.log('✅ Coluna "metadados" adicionada com sucesso!');
    } else {
      console.log('\n✅ Coluna "metadados" já existe');
    }
    
    // Verificar escritórios admin
    console.log('\n👤 VERIFICANDO ESCRITÓRIOS ADMIN:');
    const escritoriosAdmin = await client.query(`
      SELECT id, nome, email 
      FROM escritorios 
      WHERE email ILIKE '%admin%' OR email ILIKE '%arcflow%' OR nome ILIKE '%admin%'
    `);
    
    if (escritoriosAdmin.rows.length > 0) {
      console.log('✅ Escritórios admin encontrados:');
      escritoriosAdmin.rows.forEach(esc => {
        console.log(`  - ${esc.nome} (${esc.email})`);
      });
    } else {
      console.log('⚠️  Nenhum escritório admin encontrado');
    }
    
    // Verificar usuários admin
    console.log('\n👥 VERIFICANDO USUÁRIOS ADMIN:');
    const usuariosAdmin = await client.query(`
      SELECT u.id, u.nome, u.email, e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id = e.id
      WHERE u.role = 'admin' OR u.email ILIKE '%admin%'
      LIMIT 5
    `);
    
    if (usuariosAdmin.rows.length > 0) {
      console.log('✅ Usuários admin encontrados:');
      usuariosAdmin.rows.forEach(user => {
        console.log(`  - ${user.nome} (${user.email}) - ${user.escritorio_nome || 'Sem escritório'}`);
      });
    } else {
      console.log('⚠️  Nenhum usuário admin encontrado');
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