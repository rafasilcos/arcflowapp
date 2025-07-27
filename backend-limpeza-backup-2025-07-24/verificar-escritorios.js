#!/usr/bin/env node

// VERIFICAR ESCRITÓRIOS E IDS CORRETOS
const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

console.log('🔍 VERIFICANDO ESCRITÓRIOS E IDS');
console.log('=' .repeat(40));

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificarEscritorios() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar estrutura da tabela escritorios
    console.log('\n📋 ESTRUTURA DA TABELA ESCRITORIOS:');
    const colunas = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'escritorios' 
      ORDER BY ordinal_position
    `);
    
    colunas.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Verificar escritórios existentes
    console.log('\n🏢 ESCRITÓRIOS EXISTENTES:');
    const escritorios = await client.query(`
      SELECT id, nome, email, 
             (SELECT COUNT(*) FROM users WHERE escritorio_id = escritorios.id) as total_usuarios
      FROM escritorios 
      ORDER BY created_at DESC
    `);
    
    if (escritorios.rows.length > 0) {
      escritorios.rows.forEach(esc => {
        console.log(`  ID: ${esc.id}`);
        console.log(`  Nome: ${esc.nome}`);
        console.log(`  Email: ${esc.email || 'sem email'}`);
        console.log(`  Usuários: ${esc.total_usuarios}`);
        console.log(`  ---`);
      });
    }
    
    // Buscar escritório específico para usar
    console.log('\n🎯 ESCRITÓRIO RECOMENDADO PARA USO:');
    const escritorioRecomendado = await client.query(`
      SELECT e.id, e.nome, e.email,
             u.id as usuario_id, u.nome as usuario_nome, u.email as usuario_email
      FROM escritorios e
      LEFT JOIN users u ON u.escritorio_id = e.id
      WHERE e.nome ILIKE '%arcflow%' OR e.nome ILIKE '%teste%'
      ORDER BY e.created_at DESC, u.created_at DESC
      LIMIT 1
    `);
    
    if (escritorioRecomendado.rows.length > 0) {
      const rec = escritorioRecomendado.rows[0];
      console.log('✅ DADOS PARA USAR NO SCRIPT:');
      console.log(`  Escritório ID: ${rec.id}`);
      console.log(`  Escritório Nome: ${rec.nome}`);
      console.log(`  Usuário ID: ${rec.usuario_id}`);
      console.log(`  Usuário Nome: ${rec.usuario_nome}`);
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

verificarEscritorios();