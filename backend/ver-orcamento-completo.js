/**
 * 🔍 VER ORÇAMENTO 61 COMPLETO - DADOS REAIS DO BANCO
 * 
 * Mostrar EXATAMENTE os dados que o frontend deve usar
 */

const { connectDatabase, getClient } = require('./config/database');

async function verOrcamentoCompleto() {
  console.log('🔍 DADOS REAIS DO ORÇAMENTO 61 NO BANCO\n');
  
  await connectDatabase();
  const client = getClient();
  
  try {
    const result = await client.query(`
      SELECT 
        id,
        codigo,
        nome,
        descricao,
        status,
        area_construida,
        area_terreno,
        valor_total,
        valor_por_m2,
        tipologia,
        padrao,
        complexidade,
        localizacao,
        disciplinas,
        cronograma,
        composicao_financeira,
        cliente_id,
        escritorio_id,
        created_at,
        updated_at
      FROM orcamentos 
      WHERE id = $1
    `, [61]);
    
    if (result.rows.length === 0) {
      console.log('❌ ORÇAMENTO 61 NÃO ENCONTRADO!');
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('📊 DADOS REAIS QUE O FRONTEND DEVE MOSTRAR:');
    console.log('=' .repeat(70));
    console.log(`🆔 ID: ${orcamento.id}`);
    console.log(`📋 Código: ${orcamento.codigo}`);
    console.log(`📝 Nome: ${orcamento.nome}`);
    console.log(`📄 Descrição: ${orcamento.descricao || 'N/A'}`);
    console.log(`🏷️ Status: ${orcamento.status}`);
    console.log(`🏠 Área Construída: ${orcamento.area_construida}m²`);
    console.log(`🌍 Área Terreno: ${orcamento.area_terreno}m²`);
    console.log(`💰 Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`💵 Valor por m²: R$ ${parseFloat(orcamento.valor_por_m2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/m²`);
    console.log(`🏗️ Tipologia: ${orcamento.tipologia}`);
    console.log(`⭐ Padrão: ${orcamento.padrao}`);
    console.log(`🔧 Complexidade: ${orcamento.complexidade}`);
    console.log(`📍 Localização: ${orcamento.localizacao}`);
    console.log(`👤 Cliente ID: ${orcamento.cliente_id}`);
    console.log(`🏢 Escritório ID: ${orcamento.escritorio_id}`);
    console.log(`📅 Criado em: ${new Date(orcamento.created_at).toLocaleString('pt-BR')}`);
    console.log(`🔄 Atualizado em: ${new Date(orcamento.updated_at).toLocaleString('pt-BR')}`);
    console.log('=' .repeat(70));
    
    // Disciplinas
    if (orcamento.disciplinas) {
      const disciplinas = Array.isArray(orcamento.disciplinas) 
        ? orcamento.disciplinas 
        : JSON.parse(orcamento.disciplinas);
      
      console.log('\n🔧 DISCIPLINAS ATIVAS:');
      disciplinas.forEach((disciplina, index) => {
        console.log(`   ${index + 1}. ${disciplina}`);
      });
      console.log(`   Total: ${disciplinas.length} disciplinas`);
    }
    
    // Cronograma
    if (orcamento.cronograma) {
      const cronograma = typeof orcamento.cronograma === 'string' 
        ? JSON.parse(orcamento.cronograma) 
        : orcamento.cronograma;
      
      console.log('\n📅 CRONOGRAMA REAL:');
      console.log(`   ⏱️ Prazo Total: ${cronograma.prazoTotal} semanas`);
      console.log(`   📊 Metodologia: ${cronograma.metodologia}`);
      console.log(`   💰 Valor Técnico Total: R$ ${cronograma.valorTecnicoTotal?.toLocaleString('pt-BR') || 0}`);
      
      if (cronograma.fases) {
        console.log('\n   📋 FASES DO CRONOGRAMA:');
        const fases = Object.values(cronograma.fases).sort((a, b) => a.ordem - b.ordem);
        
        fases.forEach((fase, index) => {
          console.log(`   ${fase.ordem}. ${fase.nome}`);
          console.log(`      ⏱️ Prazo: ${fase.prazo} semanas`);
          console.log(`      💰 Valor: R$ ${fase.valor?.toLocaleString('pt-BR') || 0}`);
          console.log(`      📊 Percentual: ${(fase.percentual * 100).toFixed(1)}%`);
          console.log(`      🔧 Disciplinas: ${fase.disciplinas?.join(', ') || 'N/A'}`);
          console.log('');
        });
      }
    }
    
    // Composição Financeira
    if (orcamento.composicao_financeira) {
      const composicao = typeof orcamento.composicao_financeira === 'string' 
        ? JSON.parse(orcamento.composicao_financeira) 
        : orcamento.composicao_financeira;
      
      console.log('\n💼 COMPOSIÇÃO FINANCEIRA:');
      console.log(`   💰 Custo Técnico: R$ ${composicao.custoTecnico?.toLocaleString('pt-BR') || 0}`);
      console.log(`   🏢 Custos Indiretos: R$ ${composicao.custosIndiretos?.toLocaleString('pt-BR') || 0}`);
      console.log(`   📊 Impostos: R$ ${composicao.impostos?.toLocaleString('pt-BR') || 0}`);
      console.log(`   🛡️ Contingência: R$ ${composicao.contingencia?.toLocaleString('pt-BR') || 0}`);
      console.log(`   💎 Lucro: R$ ${composicao.lucro?.toLocaleString('pt-BR') || 0}`);
      console.log(`   🎯 Valor Final: R$ ${composicao.valorFinal?.toLocaleString('pt-BR') || 0}`);
    }
    
    console.log('\n🎯 RESUMO PARA O FRONTEND:');
    console.log('=' .repeat(70));
    console.log(`Card "Valor Total": R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    
    if (orcamento.cronograma) {
      const cronograma = typeof orcamento.cronograma === 'string' 
        ? JSON.parse(orcamento.cronograma) 
        : orcamento.cronograma;
      console.log(`Card "Prazo": ${cronograma.prazoTotal} semanas`);
    }
    
    console.log(`Card "Disciplinas": ${orcamento.disciplinas ? (Array.isArray(orcamento.disciplinas) ? orcamento.disciplinas.length : JSON.parse(orcamento.disciplinas).length) : 0}`);
    console.log(`Card "Área": ${orcamento.area_construida}m²`);
    console.log('=' .repeat(70));
    
    console.log('\n🚨 IMPORTANTE:');
    console.log('✅ Estes são os dados REAIS que devem aparecer no frontend');
    console.log('❌ Qualquer valor diferente indica uso de dados mockados');
    console.log('🔧 O frontend deve fazer chamada para /api/orcamentos/61');
    console.log('📱 Teste no navegador: http://localhost:3000/orcamentos/61');
    
    console.log('\n📋 CHECKLIST PARA VERIFICAÇÃO:');
    console.log('□ Card "Valor Total" mostra R$ 36.210,00');
    console.log('□ Card "Prazo" mostra 26 semanas');
    console.log('□ Card "Disciplinas" mostra 4');
    console.log('□ Card "Área" mostra 250m²');
    console.log('□ Todos os valores têm 2 casas decimais');
    console.log('□ Não há card "Orçamento Dinâmico"');
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}

verOrcamentoCompleto()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 FALHA:', error);
    process.exit(1);
  });