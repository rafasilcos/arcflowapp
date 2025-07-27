const https = require('https');

async function testarAPIRespostas() {
  // ID de um briefing que sabemos que tem respostas
  const briefingId = '9127234a-50f2-45b1-ba21-8b6a8a4c6b45';
  
  console.log('🔍 Testando API de Respostas');
  console.log('Briefing ID:', briefingId);
  
  try {
    // Simular requisição da API (sem autenticação por enquanto)
    const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}/respostas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Precisaríamos do token JWT real aqui
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ RESPOSTA DA API:');
      console.log('Total Respostas:', data.totalRespostas);
      console.log('Fonte:', data.fonte);
      console.log('Estrutura Personalizada:', data.estruturaPersonalizada ? 'SIM' : 'NÃO');
      console.log('Briefing ID:', data.briefingId);
      
      if (data.respostas && Object.keys(data.respostas).length > 0) {
        console.log('\n📝 PRIMEIRAS 5 RESPOSTAS:');
        Object.entries(data.respostas).slice(0, 5).forEach(([key, value]) => {
          console.log(`- ${key}: ${value}`);
        });
      } else {
        console.log('⚠️ Nenhuma resposta encontrada na API');
      }
    } else {
      const errorData = await response.text();
      console.log('❌ ERRO NA API:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
  }
}

// Versão alternativa usando curl para testar sem autenticação
console.log('\n🔧 Para testar manualmente, execute:');
console.log(`curl -X GET "http://localhost:3001/api/briefings/9127234a-50f2-45b1-ba21-8b6a8a4c6b45/respostas" -H "Content-Type: application/json"`);

testarAPIRespostas(); 