const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkUserEscritorio() {
  try {
    console.log('🔍 VERIFICANDO ESCRITÓRIO DO USUÁRIO...\n');
    
    await client.connect();
    console.log('✅ Conectado ao banco');
    
    // 1. Buscar dados do usuário admin@arcflow.com
    const userResult = await client.query(`
      SELECT u.*, e.nome as escritorio_nome, e.id as escritorio_id_real
      FROM users u 
      LEFT JOIN escritorios e ON u.escritorio_id = e.id 
      WHERE u.email = $1
    `, ['admin@arcflow.com']);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuário admin@arcflow.com não encontrado!');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('👤 DADOS DO USUÁRIO:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.nome}`);
    console.log(`   Escritório ID: ${user.escritorio_id}`);
    console.log(`   Escritório Nome: ${user.escritorio_nome || 'NÃO ENCONTRADO'}`);
    console.log(`   Ativo: ${user.is_active}`);
    
    // 2. Listar todos os escritórios
    const escritoriosResult = await client.query(`
      SELECT id, nome FROM escritorios ORDER BY created_at DESC
    `);
    
    console.log('\n🏢 TODOS OS ESCRITÓRIOS:');
    escritoriosResult.rows.forEach((escritorio, index) => {
      const isUserEscritorio = escritorio.id === user.escritorio_id;
      console.log(`   ${index + 1}. ${escritorio.nome} (ID: ${escritorio.id}) ${isUserEscritorio ? '← USUÁRIO ADMIN' : ''}`);
    });
    
    // 3. Verificar clientes por escritório
    console.log('\n📊 CLIENTES POR ESCRITÓRIO:');
    for (const escritorio of escritoriosResult.rows) {
      const clientesResult = await client.query(`
        SELECT COUNT(*) as total FROM clientes WHERE escritorio_id = $1
      `, [escritorio.id]);
      
      const total = clientesResult.rows[0].total;
      const isUserEscritorio = escritorio.id === user.escritorio_id;
      console.log(`   ${escritorio.nome}: ${total} cliente(s) ${isUserEscritorio ? '← ESCRITÓRIO DO ADMIN' : ''}`);
    }
    
    // 4. DIAGNÓSTICO
    console.log('\n🎯 DIAGNÓSTICO:');
    if (user.escritorio_id) {
      const clientesDoUsuario = await client.query(`
        SELECT COUNT(*) as total FROM clientes WHERE escritorio_id = $1
      `, [user.escritorio_id]);
      
      const totalClientesUsuario = clientesDoUsuario.rows[0].total;
      console.log(`   O usuário admin@arcflow.com pertence ao escritório: ${user.escritorio_nome || 'NOME NÃO ENCONTRADO'}`);
      console.log(`   Este escritório tem ${totalClientesUsuario} cliente(s)`);
      
      if (totalClientesUsuario === 0) {
        console.log('   ❌ PROBLEMA: O escritório do usuário não tem clientes!');
        console.log('   💡 SOLUÇÃO: Precisa criar clientes para este escritório ou mudar o usuário de escritório');
      } else {
        console.log('   ✅ Este escritório tem clientes, mas API pode ter outro problema');
      }
    } else {
      console.log('   ❌ PROBLEMA CRÍTICO: Usuário não tem escritório_id definido!');
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await client.end();
  }
}

checkUserEscritorio(); 