/**
 * 🐛 DEBUG DA PÁGINA DE ORÇAMENTO
 */

const axios = require('axios');

async function debugPaginaOrcamento() {
  try {
    console.log('🐛 DEBUG DA PÁGINA DE ORÇAMENTO');
    
    // 1. Simular o que a página faz - obter token
    console.log('\n1. 🔐 Simulando obtenção de token...');
    
    // Primeiro tentar login via API do frontend
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'admin@arcflow.com',
        password: '123456'
      });
      
      const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
      console.log('✅ Token via frontend API:', token ? 'SIM' : 'NÃO');
      
      if (token) {
        // 2. Testar com diferentes IDs de orçamento
        const idsParaTestar = [72, 71, 67, 59, 56];
        
        for (const id of idsParaTestar) {
          console.log(`\n2. 🔍 Testando orçamento ID: ${id}`);
          
          try {
            const response = await axios.get(`http://localhost:3000/api/orcamentos/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              timeout: 10000
            });
            
            console.log(`✅ ID ${id} funcionou:`, {
              status: response.status,
              success: response.data.success,
              codigo: response.data.data?.codigo,
              nome: response.data.data?.nome?.substring(0, 50) + '...'
            });
            
            // Testar se a página carregaria corretamente
            console.log(`📄 Página deveria carregar: http://localhost:3000/orcamentos/${id}`);
            break;
            
          } catch (error) {
            console.log(`❌ ID ${id} falhou:`, {
              status: error.response?.status,
              message: error.response?.data?.message,
              error: error.code
            });
          }
        }
      }
      
    } catch (loginError) {
      console.log('❌ Login via frontend falhou, tentando backend direto...');
      
      // Fallback: login direto no backend
      const backendLoginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'admin@arcflow.com',
        password: '123456'
      });
      
      const token = backendLoginResponse.data.tokens?.accessToken || backendLoginResponse.data.token;
      console.log('✅ Token via backend:', token ? 'SIM' : 'NÃO');
      
      if (token) {
        // Testar proxy com token do backend
        console.log('\n3. 🔄 Testando proxy com token do backend...');
        
        try {
          const response = await axios.get('http://localhost:3000/api/orcamentos/72', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('✅ Proxy funcionou com token do backend:', response.status);
          
        } catch (proxyError) {
          console.error('❌ Proxy falhou:', {
            status: proxyError.response?.status,
            message: proxyError.response?.data?.message,
            url: proxyError.config?.url
          });
        }
      }
    }
    
    // 4. Verificar se o frontend está realmente rodando
    console.log('\n4. 🌐 Verificando se o frontend está rodando...');
    
    try {
      const healthResponse = await axios.get('http://localhost:3000/', {
        timeout: 5000
      });
      console.log('✅ Frontend está rodando na porta 3000');
    } catch (error) {
      console.log('❌ Frontend não está rodando na porta 3000');
      
      // Tentar porta 3002
      try {
        const healthResponse = await axios.get('http://localhost:3002/', {
          timeout: 5000
        });
        console.log('✅ Frontend está rodando na porta 3002');
        console.log('⚠️ PROBLEMA: Página pode estar tentando acessar porta errada!');
      } catch (error2) {
        console.log('❌ Frontend não está rodando em nenhuma porta');
      }
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
  }
}

debugPaginaOrcamento();