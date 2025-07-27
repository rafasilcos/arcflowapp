const { Client } = require('pg');

async function limparTokens() {
  const client = new Client({ 
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!');

    // Verificar quantos tokens existem
    const count = await client.query('SELECT COUNT(*) as total FROM refresh_tokens');
    console.log(`📊 Tokens existentes: ${count.rows[0].total}`);

    // Limpar todos os refresh tokens antigos
    const result = await client.query('DELETE FROM refresh_tokens');
    console.log(`🗑️ Removidos ${result.rowCount} tokens antigos`);

    // Verificar se limpou
    const newCount = await client.query('SELECT COUNT(*) as total FROM refresh_tokens');
    console.log(`✅ Tokens restantes: ${newCount.rows[0].total}`);

    console.log('\n🎯 REFRESH TOKENS LIMPOS!');
    console.log('   Agora o login deve funcionar sem erro de duplicação');

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await client.end();
  }
}

limparTokens(); 