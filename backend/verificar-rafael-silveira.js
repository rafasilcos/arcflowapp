const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
});

async function verificarRafaelSilveira() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Buscar Rafael Silveira
    const result = await client.query(`
      SELECT id, nome, email, telefone, profissao,
             endereco_cep, endereco_logradouro, endereco_numero, 
             endereco_complemento, endereco_bairro, endereco_cidade, 
             endereco_uf, endereco_pais, endereco,
             created_at, updated_at
      FROM clientes 
      WHERE nome ILIKE '%rafael%silveira%' 
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    console.log('\n🔍 CLIENTE RAFAEL SILVEIRA COSTA:');
    console.log('='.repeat(60));
    
    if (result.rows.length > 0) {
      const cliente = result.rows[0];
      console.log('✅ Cliente encontrado:');
      console.log(`  ID: ${cliente.id}`);
      console.log(`  Nome: ${cliente.nome}`);
      console.log(`  Email: ${cliente.email}`);
      console.log(`  Telefone: ${cliente.telefone || 'NÃO INFORMADO'}`);
      console.log(`  Profissão: ${cliente.profissao || 'NÃO INFORMADO'}`);
      console.log('');
      console.log('📍 ENDEREÇO:');
      console.log(`  CEP: ${cliente.endereco_cep || '❌ NÃO SALVO'}`);
      console.log(`  Logradouro: ${cliente.endereco_logradouro || '❌ NÃO SALVO'}`);
      console.log(`  Número: ${cliente.endereco_numero || '❌ NÃO SALVO'}`);
      console.log(`  Complemento: ${cliente.endereco_complemento || '❌ NÃO SALVO'}`);
      console.log(`  Bairro: ${cliente.endereco_bairro || '❌ NÃO SALVO'}`);
      console.log(`  Cidade: ${cliente.endereco_cidade || '❌ NÃO SALVO'}`);
      console.log(`  UF: ${cliente.endereco_uf || '❌ NÃO SALVO'}`);
      console.log(`  País: ${cliente.endereco_pais || '❌ NÃO SALVO'}`);
      console.log('');
      console.log('📦 CAMPO ENDERECO (JSON):');
      console.log(`  ${cliente.endereco || '❌ NÃO SALVO'}`);
      console.log('');
      console.log('⏰ TIMESTAMPS:');
      console.log(`  Criado em: ${cliente.created_at}`);
      console.log(`  Atualizado em: ${cliente.updated_at}`);
    } else {
      console.log('❌ Cliente Rafael Silveira Costa não encontrado!');
      
      // Mostrar últimos clientes criados
      const ultimosClientes = await client.query(`
        SELECT nome, email, created_at 
        FROM clientes 
        ORDER BY created_at DESC 
        LIMIT 5
      `);
      
      console.log('\n📋 Últimos 5 clientes criados:');
      ultimosClientes.rows.forEach((c, i) => {
        console.log(`  ${i+1}. ${c.nome} (${c.email}) - ${c.created_at}`);
      });
    }
    
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

verificarRafaelSilveira(); 