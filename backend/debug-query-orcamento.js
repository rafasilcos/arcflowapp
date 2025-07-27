/**
 * 🐛 DEBUG DA QUERY DE ORÇAMENTO
 */

const { Client } = require('pg');

async function debugQueryOrcamento() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    const briefingId = '947cbfa7-00db-4bda-b86b-033aa665dae5'; // Casa Florianopolis
    
    console.log('🐛 DEBUG: Testando query step by step');
    console.log('📋 Briefing ID:', briefingId);
    
    // 1. Verificar se briefing existe
    const briefingResult = await client.query(`
      SELECT id, nome_projeto FROM briefings WHERE id = $1
    `, [briefingId]);
    
    console.log('\n1️⃣ Briefing encontrado:', briefingResult.rows.length > 0);
    if (briefingResult.rows.length > 0) {
      console.log('   Nome:', briefingResult.rows[0].nome_projeto);
    }
    
    // 2. Verificar orçamentos para este briefing
    const orcamentoResult = await client.query(`
      SELECT id, briefing_id, deleted_at FROM orcamentos WHERE briefing_id = $1
    `, [briefingId]);
    
    console.log('\n2️⃣ Orçamentos encontrados:', orcamentoResult.rows.length);
    orcamentoResult.rows.forEach((orc, i) => {
      console.log(`   ${i+1}. ID: ${orc.id}, Deleted: ${orc.deleted_at ? 'SIM' : 'NÃO'}`);
    });
    
    // 3. Testar a query completa
    const queryCompleta = `
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        CASE WHEN o.id IS NOT NULL THEN true ELSE false END as "temOrcamento",
        o.id as "orcamentoId"
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
      WHERE b.id = $1 
      AND b.deleted_at IS NULL
    `;
    
    const resultCompleto = await client.query(queryCompleta, [briefingId]);
    
    console.log('\n3️⃣ Query completa:');
    if (resultCompleto.rows.length > 0) {
      const row = resultCompleto.rows[0];
      console.log('   Nome:', row.nomeProjeto);
      console.log('   Tem Orçamento:', row.temOrcamento);
      console.log('   Orçamento ID:', row.orcamentoId);
    }
    
    // 4. Verificar tipos de dados
    console.log('\n4️⃣ Verificando tipos de dados:');
    const tiposResult = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name IN ('briefings', 'orcamentos')
      AND column_name IN ('id', 'briefing_id')
      ORDER BY table_name, column_name
    `);
    
    tiposResult.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}): ${col.is_nullable}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

debugQueryOrcamento();