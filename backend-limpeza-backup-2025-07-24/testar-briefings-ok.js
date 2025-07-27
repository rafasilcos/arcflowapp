const fetch = require('node-fetch');

async function testLogin() {
  console.log('🧪 TESTE RÁPIDO DE LOGIN...\n');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 200) {
      console.log('\n✅ API DE LOGIN FUNCIONANDO!');
      console.log('🎯 O problema é no frontend ou na comunicação');
    } else {
      console.log('\n❌ Problema na API de login');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLogin(); 