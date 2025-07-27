// Teste simples do sistema de convites
const https = require('http');

console.log('🔍 Testando se o servidor correto está funcionando...');

// Testar API de convites
const req = https.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/status',
  method: 'GET'
}, (res) => {
  console.log('✅ Servidor respondendo na porta 3001');
  console.log('Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('\n🚀 Agora teste o convite novamente em:');
    console.log('http://localhost:3000/configuracoes/equipe');
  });
});

req.on('error', (error) => {
  console.error('❌ Erro: Servidor não está rodando:', error.message);
  console.log('\n💡 Execute: npm run dev');
});

req.end(); 