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
            console.log(`\n📈 RESULTADO: ${briefingsComRespostas.length}/${response.briefings.length} briefings com respostas`);
            
            if (briefingsComRespostas.length > 0) {
              console.log('🎉 SUCESSO! A contagem de respostas está funcionando!');
              console.log('\n📋 BRIEFINGS COM RESPOSTAS:');
              briefingsComRespostas.forEach((briefing, index) => {
                console.log(`${index + 1}. ${briefing.nomeProjeto} - ${briefing._count.respostas} respostas`);
              });
            } else {
              console.log('⚠️ PROBLEMA: Todos os briefings mostram 0 respostas');
            }
            
            resolve(briefingsComRespostas.length > 0);
          } else {
            console.log('❌ Nenhum briefing encontrado');
            console.log('Status:', res.statusCode);
            console.log('Resposta:', response);
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
    const sucesso = await testarBriefings(token);
    
    if (sucesso) {
      console.log('\n🎯 CONCLUSÃO: Sistema funcionando corretamente!');
    } else {
      console.log('\n❌ CONCLUSÃO: Sistema ainda tem problemas na contagem de respostas');
    }
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

executarTeste(); 