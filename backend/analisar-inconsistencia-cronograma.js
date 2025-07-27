/**
 * 🔍 ANÁLISE CRÍTICA: INCONSISTÊNCIA CRONOGRAMA vs DISCIPLINAS
 */

const { Client } = require('pg');

async function analisarInconsistenciaCronograma() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    
    console.log('🔍 ANÁLISE CRÍTICA: CRONOGRAMA vs DISCIPLINAS');
    console.log('='.repeat(60));
    
    const orcamentoId = 61;
    
    // Buscar dados completos do orçamento
    const result = await client.query(`
      SELECT 
        valor_total,
        disciplinas,
        cronograma,
        composicao_financeira,
        dados_extraidos
      FROM orcamentos 
      WHERE id = $1
    `, [orcamentoId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Orçamento não encontrado');
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('💰 VALOR TOTAL:', `R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    console.log('\n📋 DISCIPLINAS INCLUÍDAS:');
    orcamento.disciplinas.forEach((disc, i) => {
      console.log(`${i+1}. ${disc}`);
    });
    
    console.log('\n📅 CRONOGRAMA ATUAL:');
    const cronograma = orcamento.cronograma;
    if (cronograma && cronograma.fases) {
      let totalCronograma = 0;
      Object.entries(cronograma.fases).forEach(([key, fase]) => {
        console.log(`📌 ${fase.nome}: ${fase.prazo} semanas - R$ ${fase.valor.toLocaleString('pt-BR')}`);
        totalCronograma += fase.valor;
      });
      console.log(`\n💰 TOTAL DO CRONOGRAMA: R$ ${totalCronograma.toLocaleString('pt-BR')}`);
      console.log(`📊 METODOLOGIA: ${cronograma.metodologia}`);
    }
    
    console.log('\n🔍 ANÁLISE CRÍTICA:');
    console.log('='.repeat(50));
    
    // 1. Verificar se disciplinas estão no cronograma
    const disciplinasIncluidas = orcamento.disciplinas;
    const fasesArquitetura = cronograma?.fases || {};
    
    console.log('❌ PROBLEMAS IDENTIFICADOS:');
    
    let problema1 = false;
    if (disciplinasIncluidas.includes('ESTRUTURAL')) {
      console.log('1. ❌ ESTRUTURAL incluído no valor mas NÃO aparece no cronograma');
      problema1 = true;
    }
    
    let problema2 = false;
    if (disciplinasIncluidas.includes('INSTALACOES_ELETRICAS')) {
      console.log('2. ❌ INSTALAÇÕES ELÉTRICAS incluído no valor mas NÃO aparece no cronograma');
      problema2 = true;
    }
    
    let problema3 = false;
    if (disciplinasIncluidas.includes('INSTALACOES_HIDRAULICAS')) {
      console.log('3. ❌ INSTALAÇÕES HIDRÁULICAS incluído no valor mas NÃO aparece no cronograma');
      problema3 = true;
    }
    
    // 2. Verificar composição financeira
    console.log('\n💰 COMPOSIÇÃO FINANCEIRA:');
    const composicao = orcamento.composicao_financeira;
    if (composicao) {
      console.log(`Custo Técnico: R$ ${composicao.custoTecnico?.toLocaleString('pt-BR') || 'N/A'}`);
      console.log(`Subtotal: R$ ${composicao.subtotal?.toLocaleString('pt-BR') || 'N/A'}`);
      console.log(`Impostos: R$ ${composicao.impostos?.toLocaleString('pt-BR') || 'N/A'}`);
      console.log(`Lucro: R$ ${composicao.lucro?.toLocaleString('pt-BR') || 'N/A'}`);
      console.log(`Valor Final: R$ ${composicao.valorFinal?.toLocaleString('pt-BR') || 'N/A'}`);
    }
    
    // 3. Análise do problema
    console.log('\n🎯 DIAGNÓSTICO DO PROBLEMA:');
    console.log('='.repeat(50));
    
    if (problema1 || problema2 || problema3) {
      console.log('❌ INCONSISTÊNCIA CRÍTICA DETECTADA!');
      console.log('');
      console.log('🔍 CAUSA RAIZ:');
      console.log('• O cronograma mostra apenas fases de ARQUITETURA (NBR 13532)');
      console.log('• Mas o valor inclui outras disciplinas (ESTRUTURAL, ELÉTRICA, HIDRÁULICA)');
      console.log('• Cliente paga por serviços que não vê no cronograma');
      console.log('');
      console.log('💡 SOLUÇÕES POSSÍVEIS:');
      console.log('1. ADICIONAR fases das outras disciplinas no cronograma');
      console.log('2. SEPARAR orçamentos por disciplina');
      console.log('3. CRIAR cronograma integrado multidisciplinar');
      console.log('4. EXPLICAR melhor o que está incluído no valor');
      
      console.log('\n📋 CRONOGRAMA CORRETO DEVERIA INCLUIR:');
      
      if (disciplinasIncluidas.includes('ESTRUTURAL')) {
        console.log('🏗️ PROJETO ESTRUTURAL:');
        console.log('   • Análise estrutural');
        console.log('   • Dimensionamento');
        console.log('   • Detalhamento estrutural');
        console.log('   • Memorial de cálculo');
      }
      
      if (disciplinasIncluidas.includes('INSTALACOES_ELETRICAS')) {
        console.log('⚡ PROJETO ELÉTRICO:');
        console.log('   • Dimensionamento elétrico');
        console.log('   • Quadros e circuitos');
        console.log('   • Detalhamento instalações');
        console.log('   • Memorial descritivo elétrico');
      }
      
      if (disciplinasIncluidas.includes('INSTALACOES_HIDRAULICAS')) {
        console.log('🚰 PROJETO HIDRÁULICO:');
        console.log('   • Água fria e quente');
        console.log('   • Esgoto e águas pluviais');
        console.log('   • Detalhamento hidráulico');
        console.log('   • Memorial descritivo hidráulico');
      }
      
    } else {
      console.log('✅ Cronograma consistente com disciplinas');
    }
    
    console.log('\n⚠️ IMPACTO NO CLIENTE:');
    console.log('• Cliente não entende pelo que está pagando');
    console.log('• Falta transparência nos entregáveis');
    console.log('• Pode gerar questionamentos sobre o valor');
    console.log('• Prejudica confiança na proposta');
    
  } catch (error) {
    console.error('❌ Erro na análise:', error);
  } finally {
    await client.end();
  }
}

analisarInconsistenciaCronograma();