const http = require('http');

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
            console.log('✅ Login realizado com sucesso!');
            console.log('👤 Usuário:', response.user.email);
            console.log('🏢 Escritório:', response.user.escritorioId);
            resolve(response.tokens.accessToken);
          } else {
            console.log('❌ Token não encontrado na resposta');
            reject(new Error('Token não encontrado'));
          }
        } catch (error) {
          console.error('❌ Erro ao parsear resposta:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro na requisição:', e.message);
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

async function testarAPI(token, endpoint, nome) {
  console.log(`\n🔍 Testando ${nome}...`);
  
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
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log(`✅ ${nome} funcionando!`);
            console.log('📊 Dados recebidos:', JSON.stringify(response, null, 2));
            resolve(response);
          } else {
            console.log(`❌ ${nome} falhou - Status: ${res.statusCode}`);
            console.log('Erro:', response);
            reject(new Error(`${nome} falhou`));
          }
        } catch (error) {
          console.error(`❌ Erro ao parsear ${nome}:`, error.message);
          console.log('Resposta raw:', data);
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

async function executarTestes() {
  try {
    // 1. Login
    const token = await fazerLogin();
    
    // 2. Testar APIs do Dashboard
    const endpoints = [
      { url: '/api/briefings/dashboard/metricas', nome: 'Métricas do Dashboard' },
      { url: '/api/briefings/dashboard/recentes?limit=5', nome: 'Briefings Recentes' },
      { url: '/api/briefings/dashboard/status', nome: 'Status do Sistema' },
      { url: '/api/briefings?limit=3', nome: 'Listagem Original (comparação)' }
    ];
    
    let sucessos = 0;
    let falhas = 0;
    
    for (const endpoint of endpoints) {
      try {
        await testarAPI(token, endpoint.url, endpoint.nome);
        sucessos++;
      } catch (error) {
        falhas++;
        console.error(`❌ Falha em ${endpoint.nome}:`, error.message);
      }
    }
    
    // 3. Resultado Final
    console.log(`\n🎯 RESULTADO DOS TESTES:`);
    console.log(`✅ Sucessos: ${sucessos}`);
    console.log(`❌ Falhas: ${falhas}`);
    console.log(`📊 Taxa de sucesso: ${Math.round((sucessos / endpoints.length) * 100)}%`);
    
    if (falhas === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!');
      console.log('🚀 Dashboard está pronto para integração total!');
    } else {
      console.log('\n⚠️ Alguns testes falharam. Verificar logs acima.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error.message);
  }
}

executarTestes(); 