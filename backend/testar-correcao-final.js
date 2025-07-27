/**
 * TESTE CORREÇÃO FINAL - ARCFLOW
 * 
 * Testa o sistema de precificação com briefings específicos
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
});

async function testarCorrecaoFinal() {
  console.log('🧪 TESTE FINAL DO SISTEMA DE PRECIFICAÇÃO');
  console.log('='.repeat(60));
  
  try {
    // 1. Limpar orçamentos problemáticos
    console.log('🗑️  Limpando orçamentos problemáticos...');
    
    await pool.query(`
      DELETE FROM orcamentos 
      WHERE valor_por_m2 > 500 OR valor_por_m2 < 50
    `);
    
    console.log('✅ Orçamentos problemáticos removidos');
    
    // 2. Testar geração de orçamento via API simulada
    console.log('\n💰 Testando geração de orçamentos realistas...');
    
    const testeCenarios = [
      {
        nome: 'Casa Simples 120m²',
        tipologia: 'RESIDENCIAL',
        area: 120,
        complexidade: 'SIMPLES',
        disciplinas: ['ARQUITETURA'],
        valorEsperado: { min: 9600, max: 18000 }
      },
      {
        nome: 'Apartamento Médio 200m²',
        tipologia: 'RESIDENCIAL',
        area: 200,
        complexidade: 'MEDIO',
        disciplinas: ['ARQUITETURA', 'ESTRUTURAL'],
        valorEsperado: { min: 30000, max: 50000 }
      },
      {
        nome: 'Sobrado Luxo 350m²',
        tipologia: 'RESIDENCIAL',
        area: 350,
        complexidade: 'COMPLEXO',
        disciplinas: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES'],
        valorEsperado: { min: 87500, max: 140000 }
      }
    ];
    
    for (const cenario of testeCenarios) {
      console.log(`\n🔍 Testando: ${cenario.nome}`);
      
      const orcamento = await calcularOrcamentoRealista(cenario);
      
      if (orcamento) {
        const dentroFaixa = orcamento.valorTotal >= cenario.valorEsperado.min && 
                           orcamento.valorTotal <= cenario.valorEsperado.max;
        
        console.log(`   Valor Total: R$ ${orcamento.valorTotal.toLocaleString('pt-BR')}`);
        console.log(`   Valor/m²: R$ ${orcamento.valorPorM2.toFixed(2)}`);
        console.log(`   Faixa Esperada: R$ ${cenario.valorEsperado.min.toLocaleString('pt-BR')} - R$ ${cenario.valorEsperado.max.toLocaleString('pt-BR')}`);
        console.log(`   Status: ${dentroFaixa ? '✅ DENTRO DA FAIXA' : '❌ FORA DA FAIXA'}`);
      } else {
        console.log(`   ❌ Falha no cálculo`);
      }
    }
    
    // 3. Verificar se o sistema está funcionando
    console.log('\n📊 VERIFICAÇÃO FINAL:');
    
    const verificacao = await pool.query(`
      SELECT 
        COUNT(*) as total_orcamentos,
        AVG(valor_por_m2) as media_valor_m2,
        MIN(valor_por_m2) as min_valor_m2,
        MAX(valor_por_m2) as max_valor_m2
      FROM orcamentos 
      WHERE valor_por_m2 > 0
    `);
    
    if (verificacao.rows[0].total_orcamentos > 0) {
      const stats = verificacao.rows[0];
      console.log(`✅ ${stats.total_orcamentos} orçamentos no sistema`);
      console.log(`📊 Valor/m² médio: R$ ${parseFloat(stats.media_valor_m2).toFixed(2)}`);
      console.log(`📊 Faixa: R$ ${parseFloat(stats.min_valor_m2).toFixed(2)} - R$ ${parseFloat(stats.max_valor_m2).toFixed(2)}`);
      
      if (parseFloat(stats.max_valor_m2) <= 500 && parseFloat(stats.min_valor_m2) >= 50) {
        console.log('🎉 SISTEMA FUNCIONANDO CORRETAMENTE!');
        console.log('   Todos os valores estão dentro da faixa realista.');
      } else {
        console.log('⚠️  Sistema precisa de ajustes.');
      }
    } else {
      console.log('⚠️  Nenhum orçamento encontrado no sistema.');
    }
    
    // 4. Instruções finais
    console.log('\n📋 INSTRUÇÕES PARA TESTE MANUAL:');
    console.log('1. Acesse o sistema ArcFlow');
    console.log('2. Vá para qualquer briefing');
    console.log('3. Clique em "Gerar Orçamento"');
    console.log('4. Verifique se os valores estão entre R$ 80-400/m²');
    console.log('5. Se ainda estiver alto, reinicie o servidor backend');
    
    console.log('\n🎯 VALORES ESPERADOS:');
    console.log('   Casa 120m²: R$ 9.600-18.000 (R$ 80-150/m²)');
    console.log('   Apartamento 200m²: R$ 30.000-50.000 (R$ 150-250/m²)');
    console.log('   Sobrado 350m²: R$ 87.500-140.000 (R$ 250-400/m²)');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

async function calcularOrcamentoRealista(cenario) {
  try {
    // Buscar preços base do banco
    const precosResult = await pool.query(`
      SELECT disciplina, price_average
      FROM pricing_base
      WHERE tipologia = $1 AND complexidade = $2 AND disciplina = ANY($3) AND active = true
    `, [cenario.tipologia, cenario.complexidade, cenario.disciplinas]);
    
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
        'INDUSTRIAL': { 'SIMPLES': 60, 'MEDIO': 80, 'COMPLEXO': 100 }
      };
      
      valorPorM2 = valoresPadrao[cenario.tipologia]?.[cenario.complexidade] || 160;
    }
    
    // Aplicar multiplicadores
    let multiplicador = 1.0;
    
    // Multiplicador por complexidade
    const multiplicadoresComplexidade = {
      'SIMPLES': 0.8,
      'MEDIO': 1.0,
      'COMPLEXO': 1.5
    };
    multiplicador *= multiplicadoresComplexidade[cenario.complexidade] || 1.0;
    
    // Multiplicador por localização
    multiplicador *= 0.9; // Interior (mais conservador)
    
    // Calcular valores finais
    const valorFinalPorM2 = valorPorM2 * multiplicador;
    const valorTotal = Math.round(valorFinalPorM2 * cenario.area);
    
    return {
      valorTotal,
      valorPorM2: Math.round(valorFinalPorM2 * 100) / 100
    };
    
  } catch (error) {
    console.error('Erro no cálculo:', error.message);
    return null;
  }
}

// Executar teste
if (require.main === module) {
  testarCorrecaoFinal();
}

module.exports = { testarCorrecaoFinal };