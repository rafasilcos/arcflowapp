/**
 * 🧪 TESTE DO PROXY DO FRONTEND
 */

const axios = require('axios');

async function testarProxy() {
  try {
    console.log('🧪 TESTANDO PROXY DO FRONTEND');
    
    // 1. Fazer login para obter token
    console.log('\n1. 🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
    console.log('✅ Token obtido:', token ? 'SIM' : 'NÃO');
    
    // 2. Testar chamada direta ao backend
    console.log('\n2. 🔗 Testando chamada DIRETA ao backend...');
    try {
      const backendResponse = await axios.get('http://localhost:3001/api/orcamentos/72', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Backend direto funcionou:', backendResponse.status);
    } catch (error) {
      console.error('❌ Backend direto falhou:', error.response?.status);
    }
    
    // 3. Testar chamada via proxy do frontend
    console.log('\n3. 🔄 Testando chamada via PROXY do frontend...');
    try {
      // Assumindo que o frontend está rodando na porta 3000 ou 3002
      const frontendPorts = [3000, 3002];
      
      for (const port of frontendPorts) {
        try {
          console.log(`   Tentando porta ${port}...`);
          const proxyResponse = await axios.get(`http://localhost:${port}/api/orcamentos/72`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
          
          console.log(`✅ Proxy na porta ${port} funcionou:`, proxyResponse.status);
          console.log('📊 Dados recebidos:', {
            success: proxyResponse.data.success,
            id: proxyResponse.data.data?.id,
            codigo: proxyResponse.data.data?.codigo
          });
          break;
          
        } catch (portError) {
          console.log(`   ❌ Porta ${port} falhou:`, portError.code || portError.response?.status);
        }
      }
      
    } catch (error) {
      console.error('❌ Proxy falhou:', error.message);
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
  }
}

testarProxy();