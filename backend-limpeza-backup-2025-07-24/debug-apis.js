const http = require('http');

// Fazer login primeiro
async function fazerLogin() {
  console.log('🔐 Fazendo login...');
  
  const loginData = JSON.stringify({
    email: 'rafasilcos@icloud.com',
    password: '123456'
  });
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.tokens && response.tokens.accessToken) {
            console.log('✅ Login realizado!');
            resolve(response.tokens.accessToken);
          } else {
            console.log('❌ Login falhou:', data);
            reject(new Error('Login falhou'));
          }
        } catch (error) {
          console.error('❌ Erro ao parsear login:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro no login:', e.message);
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

async function testarAPI(token, endpoint, nome) {
  console.log(`\n🔍 Testando ${nome}...`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: endpoint,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`📦 Resposta RAW:`);
        console.log(data);
        
        try {
          const response = JSON.parse(data);
          console.log(`🔧 Resposta PARSED:`);
          console.log(JSON.stringify(response, null, 2));
          
          // Analisar estrutura
          console.log(`📋 Estrutura da resposta:`);
          console.log(`- Tem campo 'metricas'?`, !!response.metricas);
          console.log(`- Tem campo 'briefings'?`, !!response.briefings);
          console.log(`- Tem campo 'status'?`, !!response.status);
          console.log(`- Tem campo 'data'?`, !!response.data);
          console.log(`- Tem campo 'message'?`, !!response.message);
          
          resolve(response);
        } catch (error) {
          console.error(`❌ Erro ao parsear ${nome}:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Erro na requisição ${nome}:`, e.message);
      reject(e);
    });

    req.end();
  });
}

async function executarDebug() {
  try {
    // 1. Login
    const token = await fazerLogin();
    
    // 2. Testar cada API
    const endpoints = [
      '/api/briefings/dashboard/metricas',
      '/api/briefings/dashboard/recentes?limit=3',
      '/api/briefings/dashboard/status'
    ];
    
    for (const endpoint of endpoints) {
      try {
        await testarAPI(token, endpoint, endpoint);
      } catch (error) {
        console.error(`❌ Falha no endpoint ${endpoint}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

executarDebug(); 