const fetch = require('node-fetch');

const briefingId = 'f777e9c8-6e7f-4b51-afa5-beaf984f0f71';

console.log('🔍 Testando rota de respostas rapidamente...');

// Teste simples
fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
  headers: {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Resposta:', data);
})
.catch(error => {
  console.error('Erro:', error.message);
});

// Teste do briefing
fetch(`http://localhost:3001/api/briefings/${briefingId}`, {
  headers: {
    'Authorization': 'Bearer test-token',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Status briefing:', response.status);
  return response.text();
})
.then(data => {
  console.log('Briefing data:', data);
})
.catch(error => {
  console.error('Erro briefing:', error.message);
}); 