/**
 * 🔍 BUSCAR BRIEFING DO MESMO ESCRITÓRIO
 */

const { Client } = require('pg');

async function buscarBriefingMesmoEscritorio() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    const escritorioAdmin = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    
    const result = await client.query(`
      SELECT 
        b.id,
        b.nome_projeto,
        b.status,
        b.tipologia,
        CASE WHEN o.id IS NOT NULL THEN true ELSE false END as tem_orcamento,
        o.id as orcamento_id
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
      WHERE b.escritorio_id::text = $1
      AND b.deleted_at IS NULL
      ORDER BY b.created_at DESC
      LIMIT 5
    `, [escritorioAdmin]);
    
    console.log('📋 BRIEFINGS DO ESCRITÓRIO ADMIN:');
    console.log('-'.repeat(50));
    
    result.rows.forEach((briefing, index) => {
      console.log(`${index + 1}. 📋 ${briefing.nome_projeto}`);
      console.log(`   🆔 ID: ${briefing.id}`);
      console.log(`   📊 Status: ${briefing.status}`);
      console.log(`   🏠 Tipologia: ${briefing.tipologia}`);
      console.log(`   💰 Tem Orçamento: ${briefing.tem_orcamento ? '✅ SIM' : '❌ NÃO'}`);
      console.log(`   🆔 Orçamento ID: ${briefing.orcamento_id || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

buscarBriefingMesmoEscritorio();