const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function debugPlans() {
  try {
    console.log('🔍 DEBUGANDO API DE PLANOS...');
    
    // Conectar
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Verificar se tabela existe
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'plans'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ ERRO: Tabela "plans" não existe!');
      return;
    }
    
    console.log('✅ Tabela "plans" existe');
    
    // Verificar estrutura da tabela
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'plans' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Estrutura da tabela plans:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Testar query original
    const result = await client.query(`
      SELECT id, name, type, price_monthly, price_yearly, max_users, max_projects, features, is_active
      FROM plans 
      WHERE is_active = true 
      ORDER BY price_monthly ASC
    `);
    
    console.log(`✅ Query executada! Encontrados ${result.rows.length} planos:`);
    result.rows.forEach(plan => {
      console.log(`  - ${plan.name}: R$ ${plan.price_monthly}/mês`);
    });
    
    // Testar processamento dos features
    const plans = result.rows.map(plan => {
      try {
        return {
          ...plan,
          features: JSON.parse(plan.features || '{}'),
          savings_yearly: plan.price_monthly > 0 ? Math.round(((plan.price_monthly * 12) - plan.price_yearly) / (plan.price_monthly * 12) * 100) : 0
        };
      } catch (featuresError) {
        console.log(`❌ Erro ao processar features do plano ${plan.name}:`, featuresError.message);
        console.log(`Features originais:`, plan.features);
        throw featuresError;
      }
    });
    
    console.log('✅ Processamento dos planos concluído!');
    console.log('📊 Resposta final seria:', JSON.stringify({
      message: 'Planos carregados com sucesso',
      plans
    }, null, 2));
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await client.end();
  }
}

debugPlans(); 