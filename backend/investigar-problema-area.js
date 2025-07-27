/**
 * 🔍 INVESTIGAR PROBLEMA DA ÁREA
 */

const { Client } = require('pg');

async function investigarProblemaArea() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 INVESTIGANDO PROBLEMA DA ÁREA');
    console.log('='.repeat(50));
    
    const result = await client.query(`
      SELECT 
        b.nome_projeto,
        b.observacoes,
        o.area_construida as orcamento_area,
        o.dados_extraidos
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.id = '947cbfa7-00db-4bda-b86b-033aa665dae5'
    `);
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log('📋 Briefing:', row.nome_projeto);
      console.log('💰 Área no orçamento:', row.orcamento_area, 'm²');
      
      // Extrair área das respostas do briefing
      if (row.observacoes) {
        try {
          const obs = JSON.parse(row.observacoes);
          const area = obs.respostas?.['24'];
          console.log('📝 Área no briefing (pergunta 24):', area, 'm²');
          
          // Mostrar algumas outras respostas relevantes
          console.log('\n📋 OUTRAS RESPOSTAS RELEVANTES:');
          console.log('Pergunta 1 (tipo):', obs.respostas?.['1']);
          console.log('Pergunta 2 (investimento):', obs.respostas?.['2']);
          console.log('Pergunta 61 (localização):', obs.respostas?.['61']);
          
        } catch (e) {
          console.log('❌ Erro ao parsear observações:', e.message);
        }
      }
      
      // Verificar dados extraídos do orçamento
      if (row.dados_extraidos) {
        console.log('\n🔍 DADOS EXTRAÍDOS PELA IA:');
        console.log('Área construída:', row.dados_extraidos.areaConstruida, 'm²');
        console.log('Área terreno:', row.dados_extraidos.areaTerreno, 'm²');
        console.log('Tipologia:', row.dados_extraidos.tipologia);
        console.log('Complexidade:', row.dados_extraidos.complexidade);
        console.log('Confiança da análise:', row.dados_extraidos.confiancaAnalise);
      }
      
      console.log('\n🎯 DIAGNÓSTICO:');
      const areaCorreta = row.observacoes ? JSON.parse(row.observacoes).respostas?.['24'] : null;
      const areaOrcamento = row.orcamento_area;
      
      if (areaCorreta && areaOrcamento && areaCorreta !== areaOrcamento.toString()) {
        console.log('❌ INCONSISTÊNCIA DETECTADA!');
        console.log(`   Briefing: ${areaCorreta}m²`);
        console.log(`   Orçamento: ${areaOrcamento}m²`);
        console.log('   🔧 CORREÇÃO NECESSÁRIA');
      } else {
        console.log('✅ Dados consistentes');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
  }
}

investigarProblemaArea();