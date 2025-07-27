const { connectDatabase, getClient } = require('./config/database');

async function verificarOrcamento76() {
  console.log('🔍 VERIFICANDO ORÇAMENTO ID 76 COMPLETO\n');
  
  try {
    await connectDatabase();
    const client = getClient();
    
    console.log('📊 Banco conectado:', { 
      timestamp: new Date(), 
      version: 'PostgreSQL' 
    });
    
    // Buscar orçamento completo
    const result = await client.query(`
      SELECT * FROM orcamentos WHERE id = $1
    `, [77]);
    
    if (result.rows.length === 0) {
      console.log('❌ ORÇAMENTO 76 NÃO ENCONTRADO!');
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('✅ ORÇAMENTO ENCONTRADO:');
    console.log('   ID:', orcamento.id);
    console.log('   Código:', orcamento.codigo);
    console.log('   Briefing ID:', orcamento.briefing_id);
    console.log('   Tipologia:', orcamento.tipologia);
    console.log('   Área Construída:', orcamento.area_construida + 'm²');
    console.log('   Área Terreno:', orcamento.area_terreno ? orcamento.area_terreno + 'm²' : 'Não informado');
    console.log('   Localização:', orcamento.localizacao || 'Não informado');
    console.log('   Valor Total:', 'R$', orcamento.valor_total);
    console.log('   Valor/m²:', 'R$', (orcamento.valor_total / orcamento.area_construida).toFixed(2));
    console.log('   Padrão:', orcamento.padrao);
    console.log('   Complexidade:', orcamento.complexidade);
    console.log('   Status:', orcamento.status);
    console.log('   Criado em:', orcamento.created_at);
    
    // Verificar dados extraídos
    if (orcamento.dados_extraidos) {
      console.log('\n📋 DADOS EXTRAÍDOS:');
      try {
        const dadosExtraidos = JSON.parse(orcamento.dados_extraidos);
        console.log('   Tipologia:', dadosExtraidos.tipologia);
        console.log('   Área Construída:', dadosExtraidos.areaConstruida + 'm²');
        console.log('   Área Terreno:', dadosExtraidos.areaTerreno ? dadosExtraidos.areaTerreno + 'm²' : 'Não informado');
        console.log('   Localização:', dadosExtraidos.localizacao || 'Não informado');
        console.log('   Padrão:', dadosExtraidos.padrao);
        console.log('   Complexidade:', dadosExtraidos.complexidade);
        console.log('   Disciplinas:', dadosExtraidos.disciplinasNecessarias?.join(', ') || 'Não informado');
        console.log('   Características:', dadosExtraidos.caracteristicasEspeciais?.join(', ') || 'Não informado');
        console.log('   Confiança:', dadosExtraidos.confianca + '%');
        console.log('   Versão Analyzer:', dadosExtraidos.versaoAnalyzer || 'Não informado');
      } catch (error) {
        console.error('❌ Erro ao parsear dados_extraidos:', error.message);
      }
    }
    
    // Verificar cronograma
    if (orcamento.cronograma) {
      console.log('\n📅 CRONOGRAMA:');
      try {
        const cronograma = JSON.parse(orcamento.cronograma);
        console.log('   Total de fases:', cronograma.length);
        cronograma.slice(0, 3).forEach((fase, index) => {
          console.log(`   ${index + 1}. ${fase.nome}: ${fase.duracao} dias - R$ ${fase.valor}`);
        });
        if (cronograma.length > 3) {
          console.log(`   ... e mais ${cronograma.length - 3} fases`);
        }
      } catch (error) {
        console.error('❌ Erro ao parsear cronograma:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

verificarOrcamento76();