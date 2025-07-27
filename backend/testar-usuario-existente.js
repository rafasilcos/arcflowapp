const http = require('http');

async function testarLogin(email, password) {
  console.log(`🔐 Testando login com: ${email}`);
  
  const loginData = JSON.stringify({
    email: email,
    password: password
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
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        console.log('Response:', data);
        
        try {
          const response = JSON.parse(data);
          
          if (response.user && response.accessToken) {
            console.log('✅ Login realizado com sucesso!');
            resolve(response.accessToken);
          } else {
            console.log('❌ Login falhou');
            reject(new Error('Login falhou'));
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

// Testar com usuário que sabemos que existe
testarLogin('rafasilcos@icloud.com', '123456'); 