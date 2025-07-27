/**
 * VERIFICAR BRIEFING ESPECÍFICO - ARCFLOW
 * 
 * Analisa o briefing "Sobrado de Luxo - TESTE" para identificar o problema
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarBriefingEspecifico() {
  console.log('🔍 VERIFICANDO BRIEFING "SOBRADO DE LUXO - TESTE"');
  console.log('='.repeat(70));
  
  try {
    // Buscar o briefing específico
    const briefingResult = await pool.query(`
      SELECT 
        id, nome_projeto, tipologia, area, descricao, objetivos,
        observacoes, dados_extraidos, created_at
      FROM briefings 
      WHERE nome_projeto ILIKE '%sobrado%luxo%teste%'
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    if (briefingResult.rows.length === 0) {
      console.log('❌ Briefing "Sobrado de Luxo - TESTE" não encontrado');
      return;
    }
    
    const briefing = briefingResult.rows[0];
    
    console.log('📋 DADOS DO BRIEFING:');
    console.log(`   ID: ${briefing.id}`);
    console.log(`   Nome: ${briefing.nome_projeto}`);
    console.log(`   Tipologia: ${briefing.tipologia}`);
    console.log(`   Área: ${briefing.area}m² ⚠️  PROBLEMA AQUI!`);
    console.log(`   Descrição: ${briefing.descricao || 'N/A'}`);
    console.log(`   Objetivos: ${briefing.objetivos || 'N/A'}`);
    console.log(`   Data: ${new Date(briefing.created_at).toLocaleDateString('pt-BR')}`);
    
    // Analisar observações
    if (briefing.observacoes) {
      try {
        const obs = JSON.parse(briefing.observacoes);
        console.log('\n📝 OBSERVAÇÕES:');
        console.log(JSON.stringify(obs, null, 2));
      } catch (e) {
        console.log('\n📝 OBSERVAÇÕES (texto):');
        console.log(briefing.observacoes);
      }
    }
    
    // Analisar dados extraídos
    if (briefing.dados_extraidos) {
      try {
        const dados = JSON.parse(briefing.dados_extraidos);
        console.log('\n📊 DADOS EXTRAÍDOS:');
        console.log(JSON.stringify(dados, null, 2));
      } catch (e) {
        console.log('\n📊 DADOS EXTRAÍDOS (texto):');
        console.log(briefing.dados_extraidos);
      }
    }
    
    // Buscar orçamento relacionado
    const orcamentoResult = await pool.query(`
      SELECT 
        id, valor_total, valor_por_m2, area_construida, 
        complexidade, disciplinas, created_at
      FROM orcamentos 
      WHERE briefing_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [briefing.id]);
    
    if (orcamentoResult.rows.length > 0) {
      const orcamento = orcamentoResult.rows[0];
      console.log('\n💰 ORÇAMENTO ATUAL:');
      console.log(`   ID: ${orcamento.id}`);
      console.log(`   Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
      console.log(`   Valor/m²: R$ ${parseFloat(orcamento.valor_por_m2).toFixed(2)}`);
      console.log(`   Área Construída: ${orcamento.area_construida}m²`);
      console.log(`   Complexidade: ${orcamento.complexidade}`);
      console.log(`   Disciplinas: ${orcamento.disciplinas}`);
      console.log(`   Data: ${new Date(orcamento.created_at).toLocaleDateString('pt-BR')}`);
    }
    
    // Análise do problema
    console.log('\n🚨 ANÁLISE DO PROBLEMA:');
    console.log('='.repeat(50));
    
    if (briefing.area <= 10) {
      console.log('❌ PROBLEMA CRÍTICO: Área muito pequena!');
      console.log(`   Área atual: ${briefing.area}m²`);
      console.log('   Área esperada para sobrado de luxo: 300-500m²');
      console.log('   Impacto: Valor total baixo devido à área incorreta');
    }
    
    if (briefing.tipologia !== 'RESIDENCIAL') {
      console.log('❌ PROBLEMA: Tipologia incorreta!');
      console.log(`   Tipologia atual: ${briefing.tipologia}`);
      console.log('   Tipologia esperada: RESIDENCIAL');
    }
    
    console.log('\n🔧 SOLUÇÕES PROPOSTAS:');
    console.log('1. Corrigir área do briefing para 350m² (típico para sobrado de luxo)');
    console.log('2. Corrigir tipologia para RESIDENCIAL');
    console.log('3. Regenerar orçamento com dados corretos');
    console.log('4. Verificar outros briefings com problemas similares');
    
    // Buscar outros briefings com áreas suspeitas
    const briefingsProblematicos = await pool.query(`
      SELECT id, nome_projeto, tipologia, area
      FROM briefings 
      WHERE area < 20 OR area > 5000
      ORDER BY area ASC
    `);
    
    if (briefingsProblematicos.rows.length > 0) {
      console.log('\n⚠️  OUTROS BRIEFINGS COM ÁREAS SUSPEITAS:');
      briefingsProblematicos.rows.forEach(row => {
        console.log(`   - ${row.nome_projeto}: ${row.area}m² (${row.tipologia})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

// Executar verificação
if (require.main === module) {
  verificarBriefingEspecifico();
}

module.exports = { verificarBriefingEspecifico };