const { Client } = require('pg');

// Configuração do banco
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

async function corrigirEscritorioClientes() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    console.log('🔗 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');
    
    // 1. Verificar escritorio_id atual dos clientes
    console.log('\n📋 Verificando escritorio_id atual dos clientes...');
    const clientesAtual = await client.query(`
      SELECT id, nome, email, escritorio_id 
      FROM clientes 
      ORDER BY created_at DESC
    `);
    
    console.log('📊 Status atual dos clientes:');
    clientesAtual.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} - escritorio_id: "${cliente.escritorio_id}"`);
    });
    
    // 2. Definir o escritorio_id correto
    const escritorioIdCorreto = "e24bb076-9318-497a-9f0e-3813d2cca2ce";
    console.log(`\n🎯 Escritório ID correto: ${escritorioIdCorreto}`);
    
    // 3. Atualizar todos os clientes para o escritorio_id correto
    console.log('\n🔧 Corrigindo escritorio_id dos clientes...');
    const updateResult = await client.query(`
      UPDATE clientes 
      SET escritorio_id = $1, updated_at = NOW()
      WHERE escritorio_id != $1 OR escritorio_id IS NULL
      RETURNING id, nome, email
    `, [escritorioIdCorreto]);
    
    console.log(`✅ ${updateResult.rows.length} clientes corrigidos:`);
    updateResult.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
    });
    
    // 4. Verificar se a correção funcionou
    console.log('\n🔍 Verificando correção...');
    const clientesCorrigidos = await client.query(`
      SELECT id, nome, email, escritorio_id 
      FROM clientes 
      WHERE escritorio_id = $1
      ORDER BY created_at DESC
    `, [escritorioIdCorreto]);
    
    console.log(`📊 Clientes com escritorio_id correto: ${clientesCorrigidos.rows.length}`);
    clientesCorrigidos.rows.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} - ✅ escritorio_id correto`);
    });
    
    // 5. Testar query da API
    console.log('\n🧪 Testando query da API após correção...');
    const testeAPI = await client.query(`
      SELECT COUNT(*) as total FROM clientes c 
      WHERE c.escritorio_id = $1 AND c.is_active = true
    `, [escritorioIdCorreto]);
    
    console.log(`🎯 Query da API agora retorna: ${testeAPI.rows[0].total} clientes`);
    
    if (testeAPI.rows[0].total > 0) {
      console.log('\n🎉 CORREÇÃO APLICADA COM SUCESSO!');
      console.log('✅ A página de clientes deve funcionar agora!');
    } else {
      console.log('\n❌ AINDA HÁ PROBLEMAS - verificar is_active');
      
      // Verificar is_active
      const activeCheck = await client.query(`
        SELECT id, nome, is_active 
        FROM clientes 
        WHERE escritorio_id = $1
      `, [escritorioIdCorreto]);
      
      console.log('🔍 Status is_active dos clientes:');
      activeCheck.rows.forEach(cliente => {
        console.log(`  - ${cliente.nome}: is_active = ${cliente.is_active}`);
      });
      
      // Corrigir is_active se necessário
      if (activeCheck.rows.some(c => !c.is_active)) {
        console.log('\n🔧 Corrigindo is_active...');
        await client.query(`
          UPDATE clientes 
          SET is_active = true, updated_at = NOW()
          WHERE escritorio_id = $1 AND (is_active = false OR is_active IS NULL)
        `, [escritorioIdCorreto]);
        
        console.log('✅ is_active corrigido!');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.end();
    console.log('\n🔚 Conexão encerrada.');
  }
}

// Executar correção
corrigirEscritorioClientes().catch(console.error); 