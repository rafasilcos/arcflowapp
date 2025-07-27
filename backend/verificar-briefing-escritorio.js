/**
 * 🔍 VERIFICAR ESCRITÓRIO DO BRIEFING
 */

const { Client } = require('pg');

async function verificarBriefingEscritorio() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    const briefingId = '123e4567-e89b-12d3-a456-426614174003';
    
    const result = await client.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.escritorio_id,
        e.nome as escritorio_nome
      FROM briefings b
      LEFT JOIN escritorios e ON b.escritorio_id::text = e.id
      WHERE b.id = $1
    `, [briefingId]);
    
    if (result.rows.length > 0) {
      const briefing = result.rows[0];
      console.log('📋 Briefing:', briefing.nome_projeto);
      console.log('🏢 Escritório ID:', briefing.escritorio_id);
      console.log('🏢 Escritório Nome:', briefing.escritorio_nome);
    }
    
    // Verificar usuário admin
    const userResult = await client.query(`
      SELECT 
        u.id,
        u.nome,
        u.email,
        u.escritorio_id,
        e.nome as escritorio_nome
      FROM users u
      LEFT JOIN escritorios e ON u.escritorio_id::text = e.id
      WHERE u.email = 'admin@arcflow.com'
    `);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('\n👤 Usuário Admin:');
      console.log('🏢 Escritório ID:', user.escritorio_id);
      console.log('🏢 Escritório Nome:', user.escritorio_nome);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

verificarBriefingEscritorio();