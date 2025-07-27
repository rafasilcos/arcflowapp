const http = require('http');

async function fazerLogin() {
  console.log('🔐 Fazendo login...');
  
  const loginData = JSON.stringify({
    email: 'rafael@arcflow.com',
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
          
          if (response.user && response.accessToken) {
            console.log('✅ Login realizado com sucesso!');
            console.log('👤 Usuário:', response.user.email);
            console.log('🏢 Escritório:', response.user.escritorioId);
            resolve(response.accessToken);
          } else {
            console.log('❌ Erro no login:', response);
            reject(new Error('Login falhou'));
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
              
              // Mostrar detalhes dos briefings com respostas
              console.log('\n📋 BRIEFINGS COM RESPOSTAS:');
              briefingsComRespostas.forEach((briefing, index) => {
                console.log(`${index + 1}. ${briefing.nomeProjeto} - ${briefing._count.respostas} respostas`);
              });
            } else {
              console.log('⚠️ PROBLEMA: Nenhum briefing mostra respostas');
            }
            
            resolve(response);
          } else {
            console.log('❌ Nenhum briefing encontrado');
            console.log('Resposta completa:', response);
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
  try {
    const token = await fazerLogin();
    await testarBriefings(token);
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

executarTeste(); 