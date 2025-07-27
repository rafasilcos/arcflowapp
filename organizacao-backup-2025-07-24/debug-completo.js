console.log('🔍 DEBUG COMPLETO - SISTEMA ARCFLOW\n');

const { Client } = require('pg');
const fetch = require('node-fetch');

async function debugCompleto() {
  let loginStatus = false;
  
  // 1. TESTAR BANCO DE DADOS
  console.log('1️⃣ TESTANDO BANCO DE DADOS...');
  const client = new Client({ 
    connectionString: 'postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres' 
  });

  try {
    await client.connect();
    console.log('✅ Banco PostgreSQL: CONECTADO');

    // Verificar usuários
    const usuarios = await client.query(`
      SELECT email, nome, is_active, escritorio_id 
      FROM users 
      WHERE email IN ('admin@arcflow.com', 'teste@arcflow.com')
      ORDER BY email
    `);

    console.log(`📋 Usuários encontrados: ${usuarios.rows.length}`);
    usuarios.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.is_active ? 'ATIVO' : 'INATIVO'})`);
    });

    // Verificar briefings
    const briefings = await client.query('SELECT COUNT(*) as total FROM briefings');
    console.log(`📊 Total de briefings: ${briefings.rows[0].total}`);

  } catch (error) {
    console.log('❌ Banco PostgreSQL: ERRO -', error.message);
  } finally {
    await client.end();
  }

  // 2. TESTAR SERVIDOR BACKEND
  console.log('\n2️⃣ TESTANDO SERVIDOR BACKEND...');
  try {
    const response = await fetch('http://localhost:3001/api/auth/status');
    if (response.status === 200) {
      console.log('✅ Servidor Backend: RODANDO (porta 3001)');
    } else {
      console.log(`⚠️ Servidor Backend: Respondendo mas status ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Servidor Backend: OFFLINE ou ERRO');
    console.log('   💡 Solução: cd backend && node server-simple.js');
  }

  // 3. TESTAR LOGIN
  console.log('\n3️⃣ TESTANDO LOGIN...');
  try {
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login: FUNCIONANDO');
      console.log(`   Usuário: ${loginData.user?.email}`);
      console.log(`   Escritório: ${loginData.user?.escritorioId}`);
      loginStatus = true;

      // 4. TESTAR API BRIEFINGS
      console.log('\n4️⃣ TESTANDO API BRIEFINGS...');
      const briefingsResponse = await fetch('http://localhost:3001/api/briefings?limit=5', {
        headers: { 
          'Authorization': `Bearer ${loginData.tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (briefingsResponse.ok) {
        const briefingsData = await briefingsResponse.json();
        console.log('✅ API Briefings: FUNCIONANDO');
        console.log(`   Total carregado: ${briefingsData.briefings?.length || 0}`);
        console.log(`   Total no banco: ${briefingsData.pagination?.total || 'N/A'}`);
      } else {
        const errorText = await briefingsResponse.text();
        console.log('❌ API Briefings: ERRO');
        console.log(`   Status: ${briefingsResponse.status}`);
        console.log(`   Erro: ${errorText}`);
      }

    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login: FALHOU');
      console.log(`   Status: ${loginResponse.status}`);
      console.log(`   Erro: ${errorText}`);
    }

  } catch (error) {
    console.log('❌ Login: ERRO DE CONEXÃO');
    console.log(`   Erro: ${error.message}`);
  }

  // 5. TESTAR FRONTEND
  console.log('\n5️⃣ TESTANDO FRONTEND...');
  try {
    const frontendResponse = await fetch('http://localhost:3000');
    if (frontendResponse.ok) {
      console.log('✅ Frontend: RODANDO (porta 3000)');
    } else {
      console.log(`⚠️ Frontend: Respondendo mas status ${frontendResponse.status}`);
    }
  } catch (error) {
    console.log('❌ Frontend: OFFLINE');
    console.log('   💡 Solução: cd frontend && npm run dev');
  }

  // RESUMO FINAL
  console.log('\n🎯 SOLUÇÕES PARA OS PROBLEMAS:');
  
  if (!loginStatus) {
    console.log('   🔧 PROBLEMA DE LOGIN:');
    console.log('      Execute: resolver-login.bat');
    console.log('      Ou: cd backend && node criar-usuario-teste.js');
  }
  
  console.log('\n🚀 PARA TESTAR O SISTEMA:');
  console.log('   1. Backend: cd backend && node server-simple.js');
  console.log('   2. Frontend: cd frontend && npm run dev');
  console.log('   3. Acessar: http://localhost:3000/briefing-novo');
  console.log('   4. Ou testar: http://localhost:3000/briefing (dashboard antiga)');
}

debugCompleto(); 