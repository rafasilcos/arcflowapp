const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testConnection() {
  console.log('🔄 Testando conexão com a API...');
  
  try {
    // Teste 1: Health check
    console.log('1️⃣ Testando /health...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health OK:', health.data.status);
    
    // Teste 2: API Health check  
    console.log('2️⃣ Testando /api/health...');
    const apiHealth = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ API Health OK:', apiHealth.data.status);
    
    // Teste 3: Login com usuário existente
    console.log('3️⃣ Testando login...');
    const login = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    console.log('✅ Login OK:', login.data.user.email);
    
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    
  } catch (error) {
    console.log('❌ ERRO:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testConnection(); 