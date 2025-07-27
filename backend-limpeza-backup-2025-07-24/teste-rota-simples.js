// Teste simples da rota de respostas
const http = require('http');

function testarRota() {
  console.log('🔍 Testando rota de respostas...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/briefings/9185d1ae-827a-4efb-984b-7eacf47559d9/respostas',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('📊 Status Code:', res.statusCode);
    console.log('📝 Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:', data);
      
      if (res.statusCode === 401) {
        console.log('✅ Rota EXISTE e precisa de autenticação (normal)');
      } else if (res.statusCode === 404) {
        console.log('❌ Rota NÃO EXISTE - problema confirmado!');
      } else {
        console.log('🔧 Status inesperado:', res.statusCode);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Erro:', error.message);
  });
  
  req.end();
}

// Testar também uma rota que sabemos que funciona
function testarRotaHealth() {
  console.log('\n🔍 Testando rota de health (controle)...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('📊 Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:', data);
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Erro:', error.message);
  });
  
  req.end();
}

// Executar testes
testarRotaHealth();
setTimeout(() => {
  testarRota();
}, 1000); 