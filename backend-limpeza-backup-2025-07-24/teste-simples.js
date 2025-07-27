const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
});

async function testeSimples() {
  try {
    console.log('🔗 Conectando ao banco...');
    await client.connect();
    
    console.log('✅ Conectado! Verificando tabela orcamentos...');
    const result = await client.query("SELECT COUNT(*) FROM orcamentos");
    
    console.log('✅ Tabela orcamentos existe!');
    console.log('📊 Total de orçamentos:', result.rows[0].count);
    
    console.log('🎉 Teste básico OK!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

testeSimples(); 

const client = new Client({
  connectionString: "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
});

async function testeSimples() {
  try {
    console.log('🔗 Conectando ao banco...');
    await client.connect();
    
    console.log('✅ Conectado! Verificando tabela orcamentos...');
    const result = await client.query("SELECT COUNT(*) FROM orcamentos");
    
    console.log('✅ Tabela orcamentos existe!');
    console.log('📊 Total de orçamentos:', result.rows[0].count);
    
    console.log('🎉 Teste básico OK!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

testeSimples(); 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 