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
        try {
          const response = JSON.parse(data);
          
          if (response.user && response.accessToken) {
            console.log('✅ Login realizado com sucesso!');
            console.log('👤 Usuário:', response.user.email);
            console.log('🏢 Escritório:', response.user.escritorioId);
            resolve(response.accessToken);
          } else {
            console.log('❌ Erro no login:', response.error || 'Erro desconhecido');
            reject(new Error(`Login falhou: ${response.error || 'Erro desconhecido'}`));
          }
        } catch (error) {
          console.error('❌ Erro ao parsear resposta login:', error.message);
          console.log('Resposta raw:', data);
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro na requisição login:', e.message);
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

async function testarBriefings(token) {
  console.log('\n🔍 Testando listagem de briefings...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/briefings',
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
          
          if (response.briefings && response.briefings.length > 0) {
            console.log('✅ Briefings encontrados:', response.briefings.length);
            console.log('\n📊 CONTAGEM DE RESPOSTAS:');
            
            response.briefings.forEach((briefing, index) => {
              const respostas = briefing._count ? briefing._count.respostas : 0;
              console.log(`${index + 1}. ${briefing.nomeProjeto} - ${respostas} respostas (${briefing.status})`);
            });
            
            // Verificar se há briefings com respostas
            const briefingsComRespostas = response.briefings.filter(b => b._count && b._count.respostas > 0);
            console.log(`\n✅ Briefings com respostas: ${briefingsComRespostas.length}/${response.briefings.length}`);
            
            if (briefingsComRespostas.length > 0) {
              console.log('🎉 SUCESSO! A contagem de respostas está funcionando!');
            } else {
              console.log('⚠️ PROBLEMA: Nenhum briefing mostra respostas');
            }
            
            resolve(response);
          } else {
            console.log('❌ Resposta:', response);
            reject(new Error('Nenhum briefing encontrado'));
          }
        } catch (error) {
          console.error('❌ Erro ao parsear resposta:', error.message);
          console.log('Resposta raw:', data);
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro na requisição:', e.message);
      reject(e);
    });

    req.end();
  });
}

async function executarTeste() {
  // Lista de credenciais para testar
  const credenciais = [
    { email: 'admin@arcflow.com', password: '123456' },
    { email: 'rafael@arcflow.com', password: '123456' },
    { email: 'teste@arcflow.com', password: '123456' },
    { email: 'admin@arcflow.com', password: 'admin' },
    { email: 'rafael@arcflow.com', password: 'admin' }
  ];
  
  for (const cred of credenciais) {
    try {
      const token = await testarLogin(cred.email, cred.password);
      await testarBriefings(token);
      break; // Se chegou aqui, funcionou!
    } catch (error) {
      console.log(`❌ Falha com ${cred.email}: ${error.message}\n`);
    }
  }
}

executarTeste(); 