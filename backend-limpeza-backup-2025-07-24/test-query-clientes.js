const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testQueryClientes() {
  try {
    console.log('🔍 TESTANDO QUERY EXATA DA API DE CLIENTES...\n');
    
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // Esta é a EXATA query que a API está usando
    const escritorioId = 'escritorio_teste'; // ID do escritório do admin
    
    console.log(`🏢 Testando para escritório: ${escritorioId}`);
    
    // 1. Teste da query COUNT
    console.log('\n1️⃣ Testando query COUNT...');
    try {
      const whereClause = 'WHERE c.escritorio_id = $1 AND c.is_active = true';
      const queryParams = [escritorioId];
      
      const countResult = await client.query(`
        SELECT COUNT(*) as total FROM clientes c ${whereClause}
      `, queryParams);
      
      console.log(`✅ Query COUNT executada: ${countResult.rows[0].total} clientes encontrados`);
      
    } catch (error) {
      console.log('❌ Erro na query COUNT:', error.message);
      return;
    }
    
    // 2. Teste da query principal
    console.log('\n2️⃣ Testando query principal...');
    try {
      const page = 1;
      const limit = 20;
      const offset = (Number(page) - 1) * Number(limit);
      
      const whereClause = 'WHERE c.escritorio_id = $1 AND c.is_active = true';
      const queryParams = [escritorioId];
      
      const result = await client.query(`
        SELECT c.*, 
               (SELECT COUNT(*) FROM projetos p WHERE p.cliente_id::text = c.id) as total_projetos
        FROM clientes c 
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `, [...queryParams, Number(limit), offset]);
      
      console.log(`✅ Query principal executada: ${result.rows.length} clientes retornados`);
      
      if (result.rows.length > 0) {
        console.log('\n📋 Clientes encontrados:');
        result.rows.forEach((cliente, index) => {
          console.log(`   ${index + 1}. ${cliente.nome} - ${cliente.email} (Projetos: ${cliente.total_projetos})`);
        });
      } else {
        console.log('📝 Nenhum cliente retornado pela query');
      }
      
    } catch (error) {
      console.log('❌ Erro na query principal:', error.message);
      console.log('Stack:', error.stack);
      return;
    }
    
    // 3. Verificar condições específicas
    console.log('\n3️⃣ Verificando condições específicas...');
    
    // Verificar is_active
    const activeCheck = await client.query(`
      SELECT nome, is_active FROM clientes WHERE escritorio_id = $1
    `, [escritorioId]);
    
    console.log('📊 Status is_active dos clientes:');
    activeCheck.rows.forEach((cliente, index) => {
      console.log(`   ${index + 1}. ${cliente.nome}: is_active = ${cliente.is_active}`);
    });
    
    console.log('\n🎯 CONCLUSÃO:');
    console.log('Se a query funcionou aqui mas não na API, o problema pode ser:');
    console.log('1. Escritório ID diferente chegando na API');
    console.log('2. Erro de autenticação/JWT');
    console.log('3. Erro de parsing na API');
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

testQueryClientes(); 