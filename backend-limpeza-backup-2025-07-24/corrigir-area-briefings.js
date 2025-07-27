/**
 * CORRIGIR ÁREA DOS BRIEFINGS - ARCFLOW
 * 
 * Corrige a extração de área dos briefings e regenera orçamentos
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function corrigirAreaBriefings() {
  console.log('🔧 CORRIGINDO ÁREA DOS BRIEFINGS E REGENERANDO ORÇAMENTOS');
  console.log('='.repeat(70));
  
  try {
    // 1. Buscar briefings com problemas de área
    const briefingsResult = await pool.query(`
      SELECT 
        b.id, b.nome_projeto, b.tipologia, b.area, b.observacoes,
        o.id as orcamento_id, o.area_construida as orcamento_area
      FROM briefings b
      LEFT JOIN orcamentos o ON b.id = o.briefing_id
      WHERE b.nome_projeto ILIKE '%teste%'
      ORDER BY b.created_at DESC
    `);
    
    console.log(`📋 Encontrados ${briefingsResult.rows.length} briefings de teste`);
    
    for (const briefing of briefingsResult.rows) {
      console.log(`\n🔍 Processando: ${briefing.nome_projeto}`);
      console.log(`   ID: ${briefing.id}`);
      console.log(`   Área no briefing: ${briefing.area}m²`);
      console.log(`   Área no orçamento: ${briefing.orcamento_area || 'N/A'}m²`);
      
      // 2. Extrair área correta das respostas
      let areaCorreta = briefing.area;
      
      if (briefing.observacoes) {
        try {
          const obs = JSON.parse(briefing.observacoes);
          if (obs.respostas) {
            // Procurar área nas respostas (pergunta 2 geralmente é área)
            const areaResposta = obs.respostas['2'] || obs.respostas['area'] || obs.respostas['Area'];
            if (areaResposta && !isNaN(parseFloat(areaResposta))) {
              areaCorreta = parseFloat(areaResposta);
              console.log(`   ✅ Área encontrada nas respostas: ${areaCorreta}m²`);
            }
          }
        } catch (e) {
          console.log(`   ⚠️  Erro ao processar observações: ${e.message}`);
        }
      }
      
      // 3. Atualizar área do briefing se necessário
      if (areaCorreta !== briefing.area) {
        console.log(`   🔄 Atualizando área: ${briefing.area}m² → ${areaCorreta}m²`);
        
        await pool.query(`
          UPDATE briefings 
          SET area = $1, updated_at = NOW()
          WHERE id = $2
        `, [areaCorreta, briefing.id]);
      }
      
      // 4. Excluir orçamento antigo se existir
      if (briefing.orcamento_id) {
        console.log(`   🗑️  Excluindo orçamento antigo (ID: ${briefing.orcamento_id})`);
        await pool.query('DELETE FROM orcamentos WHERE id = $1', [briefing.orcamento_id]);
      }
      
      // 5. Gerar novo orçamento com área correta
      console.log(`   💰 Gerando novo orçamento com área ${areaCorreta}m²...`);
      
      const novoOrcamento = await gerarOrcamentoCorreto({
        id: briefing.id,
        nome_projeto: briefing.nome_projeto,
        tipologia: briefing.tipologia,
        area: areaCorreta,
        observacoes: briefing.observacoes
      });
      
      if (novoOrcamento) {
        console.log(`   ✅ Novo orçamento gerado:`);
        console.log(`      Valor Total: R$ ${novoOrcamento.valor_total.toLocaleString('pt-BR')}`);
        console.log(`      Valor/m²: R$ ${novoOrcamento.valor_por_m2.toFixed(2)}`);
        console.log(`      Área: ${novoOrcamento.area_construida}m²`);
        console.log(`      Complexidade: ${novoOrcamento.complexidade}`);
      } else {
        console.log(`   ❌ Falha ao gerar orçamento`);
      }
    }
    
    // 6. Resumo final
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO DA CORREÇÃO');
    console.log('='.repeat(70));
    
    const resumoResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        AVG(valor_por_m2) as media_valor_m2,
        MIN(valor_por_m2) as min_valor_m2,
        MAX(valor_por_m2) as max_valor_m2,
        AVG(area_construida) as media_area
      FROM orcamentos 
      WHERE created_at > NOW() - INTERVAL '1 hour'
      AND valor_por_m2 > 0
    `);
    
    if (resumoResult.rows[0].total > 0) {
      const stats = resumoResult.rows[0];
      console.log(`✅ ${stats.total} orçamentos regenerados com sucesso!`);
      console.log(`📊 Estatísticas dos novos orçamentos:`);
      console.log(`   Área média: ${parseFloat(stats.media_area).toFixed(0)}m²`);
      console.log(`   Valor/m² médio: R$ ${parseFloat(stats.media_valor_m2).toFixed(2)}`);
      console.log(`   Faixa de valores: R$ ${parseFloat(stats.min_valor_m2).toFixed(2)} - R$ ${parseFloat(stats.max_valor_m2).toFixed(2)}`);
      
      if (parseFloat(stats.max_valor_m2) <= 500 && parseFloat(stats.min_valor_m2) >= 50) {
        console.log(`   ✅ Todos os valores estão dentro da faixa realista!`);
      } else {
        console.log(`   ⚠️  Alguns valores podem estar fora da faixa ideal`);
      }
    }
    
    console.log('\n🎉 CORREÇÃO CONCLUÍDA!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Acesse o sistema ArcFlow');
    console.log('   2. Verifique os orçamentos atualizados');
    console.log('   3. Confirme se os valores estão realistas');
    console.log('   4. Execute: node verificar-orcamentos-existentes.js para validar');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

async function gerarOrcamentoCorreto(briefing) {
  try {
    // Determinar tipologia correta
    let tipologia = briefing.tipologia?.toUpperCase() || 'RESIDENCIAL';
    if (tipologia === 'RESIDENCIAL' || tipologia === 'residencial') {
      tipologia = 'RESIDENCIAL';
    }
    
    const area = briefing.area || 150;
    
    // Analisar complexidade baseado no nome e respostas
    let complexidade = 'MEDIO';
    let disciplinas = ['ARQUITETURA'];
    
    const nomeProjetoLower = briefing.nome_projeto?.toLowerCase() || '';
    
    if (nomeProjetoLower.includes('simples') || nomeProjetoLower.includes('básico')) {
      complexidade = 'SIMPLES';
      disciplinas = ['ARQUITETURA'];
    } else if (nomeProjetoLower.includes('luxo') || nomeProjetoLower.includes('alto padrão') || nomeProjetoLower.includes('sobrado')) {
      complexidade = 'COMPLEXO';
      disciplinas = ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'];
    } else if (nomeProjetoLower.includes('apartamento') || nomeProjetoLower.includes('médio')) {
      complexidade = 'MEDIO';
      disciplinas = ['ARQUITETURA', 'ESTRUTURAL'];
    } else if (nomeProjetoLower.includes('comercial') || nomeProjetoLower.includes('escritório')) {
      tipologia = 'COMERCIAL';
      complexidade = 'MEDIO';
      disciplinas = ['ARQUITETURA', 'INSTALACOES'];
    } else if (nomeProjetoLower.includes('industrial') || nomeProjetoLower.includes('galpão')) {
      tipologia = 'INDUSTRIAL';
      complexidade = 'MEDIO';
      disciplinas = ['ARQUITETURA', 'ESTRUTURAL'];
    } else if (nomeProjetoLower.includes('clínica') || nomeProjetoLower.includes('hospital')) {
      tipologia = 'INSTITUCIONAL';
      complexidade = 'COMPLEXO';
      disciplinas = ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'];
    }
    
    // Buscar preços base do banco
    const precosResult = await pool.query(`
      SELECT disciplina, price_average
      FROM pricing_base
      WHERE tipologia = $1 AND complexidade = $2 AND disciplina = ANY($3) AND active = true
    `, [tipologia, complexidade, disciplinas]);
    
    let valorPorM2 = 0;
    
    if (precosResult.rows.length > 0) {
      for (const row of precosResult.rows) {
        valorPorM2 += parseFloat(row.price_average);
      }
    } else {
      // Valores padrão realistas
      const valoresPadrao = {
        'RESIDENCIAL': { 'SIMPLES': 115, 'MEDIO': 160, 'COMPLEXO': 240 },
        'COMERCIAL': { 'SIMPLES': 135, 'MEDIO': 180, 'COMPLEXO': 260 },
        'INDUSTRIAL': { 'SIMPLES': 60, 'MEDIO': 80, 'COMPLEXO': 100 },
        'INSTITUCIONAL': { 'SIMPLES': 140, 'MEDIO': 200, 'COMPLEXO': 285 }
      };
      
      valorPorM2 = valoresPadrao[tipologia]?.[complexidade] || 160;
    }
    
    // Aplicar multiplicadores
    let multiplicador = 1.0;
    
    // Multiplicador por complexidade
    const multiplicadoresComplexidade = {
      'SIMPLES': 0.8,
      'MEDIO': 1.0,
      'COMPLEXO': 1.5
    };
    multiplicador *= multiplicadoresComplexidade[complexidade] || 1.0;
    
    // Multiplicador por localização (assumir capital para projetos de luxo)
    if (nomeProjetoLower.includes('luxo') || nomeProjetoLower.includes('alto padrão')) {
      multiplicador *= 1.2; // Capital
    } else {
      multiplicador *= 0.9; // Interior
    }
    
    // Calcular valores finais
    const valorFinalPorM2 = valorPorM2 * multiplicador;
    const valorTotal = Math.round(valorFinalPorM2 * area);
    
    // Gerar código único para o orçamento
    const codigo = `ORC-${tipologia.substring(0,2)}-${Date.now().toString(36).toUpperCase()}`;
    
    // Salvar no banco
    const orcamentoResult = await pool.query(`
      INSERT INTO orcamentos (
        codigo, nome, briefing_id, valor_total, valor_por_m2, 
        tipologia, area_construida, complexidade, disciplinas, 
        status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'RASCUNHO', NOW())
      RETURNING *
    `, [
      codigo,
      `Orçamento - ${briefing.nome_projeto}`,
      briefing.id,
      valorTotal,
      Math.round(valorFinalPorM2 * 100) / 100,
      tipologia,
      area,
      complexidade,
      JSON.stringify(disciplinas)
    ]);
    
    return orcamentoResult.rows[0];
    
  } catch (error) {
    console.error('Erro ao gerar orçamento:', error.message);
    return null;
  }
}

// Executar correção
if (require.main === module) {
  corrigirAreaBriefings();
}

module.exports = { corrigirAreaBriefings };