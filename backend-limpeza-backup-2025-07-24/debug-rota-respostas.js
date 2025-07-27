// Teste da rota de respostas do briefing
const fetch = require('node-fetch');

async function testarRotaRespostas() {
  const briefingId = '9185d1ae-827a-4efb-984b-7eacf47559d9';
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Testando rota de respostas do briefing:', briefingId);
  console.log('==========================================');
  
  try {
    // 1. Testar se o servidor está respondendo
    console.log('1. Testando servidor...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    
    if (!healthResponse.ok) {
      console.log('❌ Servidor não está respondendo');
      return;
    }
    
    console.log('✅ Servidor funcionando');
    
    // 2. Testar rota de briefings geral
    console.log('\n2. Testando rota de briefings geral...');
    const briefingsResponse = await fetch(`${baseUrl}/api/briefings`);
    console.log('📊 Status:', briefingsResponse.status);
    
    if (briefingsResponse.status === 401) {
      console.log('⚠️ Erro 401 - Precisa de autenticação (normal)');
    } else if (briefingsResponse.status === 404) {
      console.log('❌ Erro 404 - Rota não encontrada');
      return;
    }
    
    // 3. Testar rota específica do briefing
    console.log('\n3. Testando rota específica do briefing...');
    const briefingResponse = await fetch(`${baseUrl}/api/briefings/${briefingId}`);
    console.log('📊 Status:', briefingResponse.status);
    
    if (briefingResponse.status === 404) {
      console.log('❌ Briefing não encontrado');
      return;
    } else if (briefingResponse.status === 401) {
      console.log('⚠️ Erro 401 - Precisa de autenticação');
    }
    
    // 4. Testar rota de respostas SEM token
    console.log('\n4. Testando rota de respostas SEM token...');
    const respostasSemTokenResponse = await fetch(`${baseUrl}/api/briefings/${briefingId}/respostas`);
    console.log('📊 Status:', respostasSemTokenResponse.status);
    
    if (respostasSemTokenResponse.status === 404) {
      console.log('❌ Rota de respostas não encontrada - PROBLEMA CONFIRMADO!');
    } else if (respostasSemTokenResponse.status === 401) {
      console.log('✅ Rota existe, mas precisa de autenticação');
    }
    
    // 5. Testar com token mockado
    console.log('\n5. Testando rota de respostas COM token mockado...');
    const respostasComTokenResponse = await fetch(`${baseUrl}/api/briefings/${briefingId}/respostas`, {
      headers: {
        'Authorization': 'Bearer token_mock',
        'Content-Type': 'application/json'
      }
    });
    console.log('📊 Status:', respostasComTokenResponse.status);
    
    if (respostasComTokenResponse.status === 401) {
      console.log('⚠️ Token inválido (esperado)');
    } else if (respostasComTokenResponse.status === 404) {
      console.log('❌ Rota ainda não encontrada - PROBLEMA CONFIRMADO!');
    } else if (respostasComTokenResponse.status === 200) {
      console.log('✅ Rota funcionando!');
      const data = await respostasComTokenResponse.json();
      console.log('📝 Dados retornados:', data);
    }
    
    // 6. Testar outras rotas para comparar
    console.log('\n6. Testando outras rotas do briefing...');
    const outrasRotas = [
      `/api/briefings/${briefingId}/historico`,
      `/api/briefings/${briefingId}/duplicar`
    ];
    
    for (const rota of outrasRotas) {
      try {
        const response = await fetch(`${baseUrl}${rota}`, {
          method: rota.includes('duplicar') ? 'POST' : 'GET',
          headers: {
            'Authorization': 'Bearer token_mock',
            'Content-Type': 'application/json'
          }
        });
        console.log(`📍 ${rota}: Status ${response.status}`);
      } catch (error) {
        console.log(`📍 ${rota}: Erro - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  console.log('\n🔧 DIAGNÓSTICO:');
  console.log('Se a rota retornar 404, o problema é que ela não está registrada corretamente');
  console.log('Se retornar 401, a rota existe mas precisa de autenticação válida');
  console.log('Se retornar 200, a rota está funcionando');
}

testarRotaRespostas(); 