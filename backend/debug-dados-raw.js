const { connectDatabase, getClient } = require('./config/database');

async function debugDadosRaw() {
  console.log('🔍 DEBUG DOS DADOS RAW NO BANCO\n');
  
  try {
    await connectDatabase();
    const client = getClient();
    
    console.log('📊 Banco conectado:', { 
      timestamp: new Date(), 
      version: 'PostgreSQL' 
    });
    
    // Buscar orçamento completo
    const result = await client.query(`
      SELECT 
        id, 
        area_terreno, 
        localizacao,
        dados_extraidos,
        cronograma,
        composicao_financeira
      FROM orcamentos 
      WHERE id = $1
    `, [78]);
    
    if (result.rows.length === 0) {
      console.log('❌ ORÇAMENTO 78 NÃO ENCONTRADO!');
      return;
    }
    
    const orcamento = result.rows[0];
    
    console.log('✅ DADOS RAW DO BANCO:');
    console.log('   ID:', orcamento.id);
    console.log('   Área Terreno (raw):', orcamento.area_terreno);
    console.log('   Localização (raw):', orcamento.localizacao);
    console.log('   Dados Extraídos (raw):', orcamento.dados_extraidos);
    console.log('   Cronograma (raw):', orcamento.cronograma);
    console.log('   Composição Financeira (raw):', orcamento.composicao_financeira);
    
    console.log('\n🔍 TIPOS DOS DADOS:');
    console.log('   typeof area_terreno:', typeof orcamento.area_terreno);
    console.log('   typeof localizacao:', typeof orcamento.localizacao);
    console.log('   typeof dados_extraidos:', typeof orcamento.dados_extraidos);
    console.log('   typeof cronograma:', typeof orcamento.cronograma);
    console.log('   typeof composicao_financeira:', typeof orcamento.composicao_financeira);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugDadosRaw();