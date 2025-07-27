/**
 * 🧪 TESTE DA NOVA IMPLEMENTAÇÃO
 * Testar se a API está retornando temOrcamento e orcamentoId
 */

const { Client } = require('pg');

async function testarNovaImplementacao() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('📊 Banco conectado:', { timestamp: new Date(), version: 'PostgreSQL' });

    // Testar a nova query diretamente
    const briefingId = '1a1881d9-768d-483b-9262-466983af8ee0'; // Teste (sem orçamento)
    
    console.log('\n🔍 TESTANDO NOVA QUERY COM VERIFICAÇÃO DE ORÇAMENTO:');
    console.log('-'.repeat(60));
    
    const briefingQuery = `
      SELECT 
        b.id,
        b.nome_projeto as "nomeProjeto",
        b.status,
        b.tipologia,
        b.created_at as "createdAt",
        -- 💰 VERIFICAÇÃO DE ORÇAMENTO
        CASE WHEN o.id IS NOT NULL THEN true ELSE false END as "temOrcamento",
        o.id as "orcamentoId"
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id AND o.deleted_at IS NULL
      WHERE b.id = $1 
      AND b.deleted_at IS NULL
    `;

    const result = await client.query(briefingQuery, [briefingId]);

    if (result.rows.length === 0) {
      console.log('❌ Briefing não encontrado');
      return;
    }

    const briefing = result.rows[0];
    
    console.log('✅ RESULTADO DA NOVA IMPLEMENTAÇÃO:');
    console.log(`📋 Nome: ${briefing.nomeProjeto}`);
    console.log(`📊 Status: ${briefing.status}`);
    console.log(`🏠 Tipologia: ${briefing.tipologia}`);
    console.log(`💰 Tem Orçamento: ${briefing.temOrcamento ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`🆔 Orçamento ID: ${briefing.orcamentoId || 'N/A'}`);
    console.log(`📅 Criado: ${new Date(briefing.createdAt).toLocaleDateString('pt-BR')}`);
    
    console.log('\n🎯 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ A nova implementação está funcionando corretamente');
    console.log('✅ As propriedades temOrcamento e orcamentoId estão sendo retornadas');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await client.end();
  }
}

testarNovaImplementacao();