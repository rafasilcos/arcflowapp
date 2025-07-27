const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 TESTANDO API DE CLIENTES - DIAGNÓSTICO...\n');
    
    // 1. Login
    console.log('1️⃣ Fazendo login...');
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (loginRes.status !== 200) {
      console.log('❌ Erro no login:', await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.tokens.accessToken;
    console.log('✅ Login OK');
    
    // 2. Testar API de clientes
    console.log('\n2️⃣ Testando GET /api/clientes...');
    const clientesRes = await fetch('http://localhost:3001/api/clientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`Status: ${clientesRes.status}`);
    
    if (clientesRes.status !== 200) {
      const errorText = await clientesRes.text();
      console.log('❌ Erro na API de clientes:');
      console.log(errorText);
    } else {
      const clientesData = await clientesRes.json();
      console.log('✅ API de clientes funcionando!');
      console.log(`Total de clientes: ${clientesData.clientes?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testAPI(); 