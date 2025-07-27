const fetch = require('node-fetch');

async function testarLogin() {
  try {
    console.log('🔐 Testando login direto...');
    
    const loginData = {
      email: 'rafael@teste.com',
      password: '123456'
    };
    
    console.log('📤 Enviando dados:', loginData);
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('📊 Status da resposta:', response.status);
    console.log('📋 Headers:', response.headers.raw());
    
    const responseText = await response.text();
    console.log('📄 Resposta completa:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Login bem-sucedido!');
      console.log('🔑 Token:', data.tokens?.accessToken ? 'OK' : 'MISSING');
      console.log('👤 Usuário:', data.user?.nome);
      console.log('🏢 Escritório:', data.escritorio?.nome);
    } else {
      console.log('❌ Login falhou');
      try {
        const errorData = JSON.parse(responseText);
        console.log('🚨 Erro:', errorData);
      } catch (e) {
        console.log('🚨 Erro (texto):', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarLogin(); 