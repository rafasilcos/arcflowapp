/**
 * EXCLUIR ORÇAMENTOS PROBLEMÁTICOS - ARCFLOW
 * 
 * Remove orçamentos com valores absurdos para permitir regeneração
 * com o novo sistema de precificação realista
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function excluirOrcamentosProblematicos() {
  console.log('🗑️  EXCLUINDO ORÇAMENTOS PROBLEMÁTICOS');
  console.log('='.repeat(60));
  
  try {
    // 1. Identificar orçamentos problemáticos
    const problematicoResult = await pool.query(`
      SELECT 
        o.id,
        o.valor_total,
        o.valor_por_m2,
        o.area_construida,
        b.nome_projeto,
        b.area
      FROM orcamentos o
      LEFT JOIN briefings b ON o.briefing_id = b.id
      WHERE 
        o.valor_por_m2 > 500 OR 
        (o.valor_total > 200000 AND o.area_construida < 500)
      ORDER BY o.valor_por_m2 DESC
    `);
    
    console.log(`🔍 Encontrados ${problematicoResult.rows.length} orçamentos problemáticos:`);
    
    if (problematicoResult.rows.length === 0) {
      console.log('✅ Nenhum orçamento problemático encontrado!');
      return;
    }
    
    // 2. Mostrar orçamentos que serão excluídos
    problematicoResult.rows.forEach((row, index) => {
      const valorTotal = parseFloat(row.valor_total || 0);
      const valorPorM2 = parseFloat(row.valor_por_m2 || 0);
      const area = parseFloat(row.area_construida || row.area || 0);
      
      console.log(`\\n${index + 1}. ${row.nome_projeto || 'Sem nome'} (ID: ${row.id})`);
      console.log(`   Valor Total: R$ ${valorTotal.toLocaleString('pt-BR')}`);
      console.log(`   Valor/m²: R$ ${valorPorM2.toFixed(2)} ❌ PROBLEMÁTICO`);
      console.log(`   Área: ${area}m²`);
    });
    
    // 3. Confirmar exclusão
    console.log('\\n⚠️  ATENÇÃO: Estes orçamentos serão EXCLUÍDOS permanentemente!');
    console.log('   Após a exclusão, você poderá gerar novos orçamentos com valores realistas.');
    
    // 4. Executar exclusão
    console.log('\\n🗑️  Executando exclusão...');
    
    const idsParaExcluir = problematicoResult.rows.map(row => row.id);
    
    const deleteResult = await pool.query(`
      DELETE FROM orcamentos 
      WHERE id = ANY($1)
    `, [idsParaExcluir]);
    
    console.log(`✅ ${deleteResult.rowCount} orçamentos problemáticos excluídos com sucesso!`);
    
    // 5. Verificar orçamentos restantes
    const restantesResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        AVG(valor_por_m2) as media_valor_m2,
        MIN(valor_por_m2) as min_valor_m2,
        MAX(valor_por_m2) as max_valor_m2
      FROM orcamentos 
      WHERE valor_por_m2 > 0
    `);
    
    if (restantesResult.rows[0].total > 0) {
      const stats = restantesResult.rows[0];
      console.log('\\n📊 ORÇAMENTOS RESTANTES:');
      console.log(`   Total: ${stats.total}`);
      console.log(`   Valor/m² médio: R$ ${parseFloat(stats.media_valor_m2).toFixed(2)}`);
      console.log(`   Faixa: R$ ${parseFloat(stats.min_valor_m2).toFixed(2)} - R$ ${parseFloat(stats.max_valor_m2).toFixed(2)}`);
      
      if (parseFloat(stats.max_valor_m2) <= 500) {
        console.log('   ✅ Todos os orçamentos restantes têm valores realistas!');
      }
    } else {
      console.log('\\n📊 Nenhum orçamento restante no banco.');
    }
    
    console.log('\\n🎉 LIMPEZA CONCLUÍDA!');
    console.log('\\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Acesse o sistema ArcFlow');
    console.log('   2. Vá para os briefings que tiveram orçamentos excluídos');
    console.log('   3. Clique em "Gerar Orçamento" novamente');
    console.log('   4. Os novos orçamentos usarão valores realistas (R$ 80-400/m²)');
    
    // 6. Listar briefings que precisam de novos orçamentos
    const briefingsSemOrcamento = await pool.query(`
      SELECT b.id, b.nome_projeto, b.tipologia, b.area
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE o.id IS NULL
      AND b.nome_projeto IS NOT NULL
      ORDER BY b.created_at DESC
      LIMIT 10
    `);
    
    if (briefingsSemOrcamento.rows.length > 0) {
      console.log('\\n📋 BRIEFINGS QUE PRECISAM DE NOVOS ORÇAMENTOS:');
      briefingsSemOrcamento.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.nome_projeto} (${row.tipologia}, ${row.area}m²)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

// Executar exclusão
if (require.main === module) {
  excluirOrcamentosProblematicos();
}

module.exports = { excluirOrcamentosProblematicos };