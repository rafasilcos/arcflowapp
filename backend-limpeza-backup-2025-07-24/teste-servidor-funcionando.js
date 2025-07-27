const fetch = require('node-fetch');

async function testarServidor() {
  console.log('🔍 Testando se servidor está funcionando...');

  try {
    // 1. Testar se servidor responde
    console.log('1️⃣ Testando saúde do servidor...');
    const healthResponse = await fetch('http://localhost:3001/api/auth/status');
    console.log('   Status:', healthResponse.status);
    
    if (healthResponse.status === 200) {
      console.log('✅ Servidor está ONLINE!');
    } else {
      console.log('❌ Servidor responde mas com problema');
    }

    // 2. Testar login
    console.log('\n2️⃣ Testando login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'rafael@teste.com',
        password: '123456'
      })
    });

    console.log('   Status login:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login FUNCIONANDO!');
      console.log('   Usuário:', loginData.user?.email);
      console.log('   Token:', loginData.tokens?.accessToken ? 'OK' : 'ERRO');
      
      // 3. Testar API de briefings
      console.log('\n3️⃣ Testando API briefings...');
      const briefingsResponse = await fetch('http://localhost:3001/api/briefings?limit=5', {
        headers: { 
          'Authorization': `Bearer ${loginData.tokens.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('   Status briefings:', briefingsResponse.status);
      
      if (briefingsResponse.ok) {
        const briefingsData = await briefingsResponse.json();
        console.log('✅ API Briefings FUNCIONANDO!');
        console.log('   Total:', briefingsData.briefings?.length || 0);
      } else {
        const errorText = await briefingsResponse.text();
        console.log('❌ API Briefings ERRO:', errorText);
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login ERRO:', errorText);
    }

  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
    console.log('   1. Verificar se servidor está rodando: cd backend && node server-simple.js');
    console.log('   2. Verificar se usuário rafael@teste.com existe no banco');
    console.log('   3. Verificar conexão com PostgreSQL');
  }
}

testarServidor(); 