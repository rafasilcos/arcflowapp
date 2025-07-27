const fetch = require('node-fetch');

async function testeRapido() {
  console.log('🚀 TESTE RÁPIDO COM admin@arcflow.com');

  try {
    // 1. Testar login
    console.log('\n1️⃣ Testando login...');
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
      console.log('✅ LOGIN OK!');
      console.log(`   Usuário: ${loginData.user?.email}`);
      console.log(`   EscritorioId: ${loginData.user?.escritorioId}`);
      
      // 2. Testar API briefings
      console.log('\n2️⃣ Testando API briefings...');
      const briefingsResponse = await fetch('http://localhost:3001/api/briefings?limit=5', {
        headers: { 
          'Authorization': `Bearer ${loginData.tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (briefingsResponse.ok) {
        const briefingsData = await briefingsResponse.json();
        console.log('✅ API BRIEFINGS OK!');
        console.log(`   Total: ${briefingsData.briefings?.length || 0}`);
        console.log(`   Total no banco: ${briefingsData.pagination?.total || 'N/A'}`);
        console.log('\n🎯 DASHBOARD DEVE FUNCIONAR AGORA!');
        console.log('   Acesse: http://localhost:3000/briefing-novo');
      } else {
        const errorText = await briefingsResponse.text();
        console.log('❌ API BRIEFINGS ERRO:', briefingsResponse.status);
        console.log('   Erro:', errorText);
      }

    } else {
      const errorText = await loginResponse.text();
      console.log('❌ LOGIN FALHOU:', loginResponse.status);
      console.log('   Erro:', errorText);
    }

  } catch (error) {
    console.log('❌ ERRO DE CONEXÃO:', error.message);
    console.log('\n💡 VERIFIQUE:');
    console.log('   - Servidor backend rodando: cd backend && node server-simple.js');
    console.log('   - PostgreSQL conectado');
  }
}

testeRapido(); 