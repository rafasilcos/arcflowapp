const axios = require('axios');

async function testarLogin() {
  try {
    console.log('🔐 Testando login...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'teste@arcflow.com',
      password: 'senha123'
    });
    
    console.log('✅ Login bem-sucedido!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    
    // Tentar com outro usuário
    try {
      console.log('🔐 Tentando com outro usuário...');
      
      const response2 = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'rafael@teste.com',
        password: 'senha123'
      });
      
      console.log('✅ Login bem-sucedido com segundo usuário!');
      console.log('Token:', response2.data.token);
      console.log('User:', response2.data.user);
      
    } catch (error2) {
      console.error('❌ Erro no segundo login:', error2.response?.data || error2.message);
    }
  }
}

testarLogin();