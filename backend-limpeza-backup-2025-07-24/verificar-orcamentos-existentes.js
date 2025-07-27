/**
 * VERIFICAR ORÇAMENTOS EXISTENTES - ARCFLOW
 * 
 * Analisa os orçamentos já gerados para identificar valores incorretos
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function verificarOrcamentosExistentes() {
  console.log('🔍 VERIFICANDO ORÇAMENTOS EXISTENTES');
  console.log('='.repeat(60));
  
  try {
    // Buscar orçamentos existentes
    const result = await pool.query(`
      SELECT 
        o.id,
        o.valor_total,
        o.valor_por_m2,
        o.area_construida,
        o.tipologia,
        o.complexidade,
        b.nome_projeto,
        b.area,
        o.created_at
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `);
    
    console.log(`📊 Encontrados ${result.rows.length} orçamentos`);
    
    if (result.rows.length === 0) {
      console.log('⚠️  Nenhum orçamento encontrado no banco.');
      return;
    }
    
    console.log('\n📋 ANÁLISE DOS ORÇAMENTOS:');
    console.log('-'.repeat(80));
    
    let orcamentosProblematicos = 0;
    let orcamentosOk = 0;
    
    result.rows.forEach((row, index) => {
      const valorTotal = parseFloat(row.valor_total || 0);
      const valorPorM2 = parseFloat(row.valor_por_m2 || 0);
      const area = parseFloat(row.area_construida || row.area || 0);
      
      console.log(`\n${index + 1}. ${row.nome_projeto || 'Sem nome'}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Tipologia: ${row.tipologia || 'N/A'}`);
      console.log(`   Área: ${area}m²`);
      console.log(`   Valor Total: R$ ${valorTotal.toLocaleString('pt-BR')}`);
      console.log(`   Valor/m²: R$ ${valorPorM2.toFixed(2)}`);
      console.log(`   Complexidade: ${row.complexidade || 'N/A'}`);
      console.log(`   Data: ${new Date(row.created_at).toLocaleDateString('pt-BR')}`);
      
      // Analisar se o valor está problemático
      let problematico = false;
      const motivos = [];
      
      if (valorPorM2 > 500) {
        problematico = true;
        motivos.push('Valor/m² muito alto (> R$ 500)');
      }
      
      if (valorPorM2 < 50 && valorPorM2 > 0) {
        problematico = true;
        motivos.push('Valor/m² muito baixo (< R$ 50)');
      }
      
      if (valorTotal > 200000 && area < 500) {
        problematico = true;
        motivos.push('Valor total desproporcional à área');
      }
      
      if (problematico) {
        orcamentosProblematicos++;
        console.log(`   ❌ PROBLEMÁTICO: ${motivos.join(', ')}`);
      } else {
        orcamentosOk++;
        console.log(`   ✅ OK: Valores dentro da faixa aceitável`);
      }
    });
    
    // Resumo
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA ANÁLISE');
    console.log('='.repeat(60));
    console.log(`Total de orçamentos: ${result.rows.length}`);
    console.log(`✅ Orçamentos OK: ${orcamentosOk}`);
    console.log(`❌ Orçamentos problemáticos: ${orcamentosProblematicos}`);
    
    if (orcamentosProblematicos > 0) {
      console.log('\n⚠️  AÇÃO NECESSÁRIA:');
      console.log('   Os orçamentos problemáticos precisam ser regenerados');
      console.log('   com o novo sistema de precificação realista.');
      console.log('\n📋 OPÇÕES:');
      console.log('   1. Excluir orçamentos problemáticos: node excluir-orcamentos-problematicos.js');
      console.log('   2. Regenerar todos os orçamentos: node regenerar-orcamentos.js');
      console.log('   3. Criar novos briefings de teste: node criar-briefings-teste-limpos.js');
    } else {
      console.log('\n🎉 TODOS OS ORÇAMENTOS ESTÃO OK!');
      console.log('   O sistema de precificação está funcionando corretamente.');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

// Executar verificação
if (require.main === module) {
  verificarOrcamentosExistentes();
}

module.exports = { verificarOrcamentosExistentes };