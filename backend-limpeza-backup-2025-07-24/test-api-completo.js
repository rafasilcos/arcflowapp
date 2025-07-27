const fetch = require('node-fetch');

async function testAPICompleto() {
  console.log('🧪 TESTE COMPLETO DA API DE CLIENTES...\n');
  
  try {
    // 1. Verificar servidor
    console.log('1️⃣ Verificando servidor...');
    const healthRes = await fetch('http://localhost:3001/health');
    
    if (healthRes.status !== 200) {
      console.log('❌ Servidor não está funcionando');
      return;
    }
    console.log('✅ Servidor OK');
    
    // 2. Login
    console.log('\n2️⃣ Fazendo login...');
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (loginRes.status !== 200) {
      console.log('❌ Erro no login:', await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.tokens.accessToken;
    
    console.log('✅ Login OK');
    console.log(`👤 Usuário: ${loginData.user.nome}`);
    console.log(`🏢 Escritório: ${loginData.user.escritorioNome} (ID: ${loginData.user.escritorioId})`);
    
    // 3. Testar API de clientes COM LOGS DETALHADOS
    console.log('\n3️⃣ Testando API /api/clientes...');
    console.log('📞 Fazendo requisição para: http://localhost:3001/api/clientes');
    console.log('🔑 Token JWT: ' + token.substring(0, 50) + '...');
    
    const clientesRes = await fetch('http://localhost:3001/api/clientes', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status da resposta: ${clientesRes.status}`);
    console.log(`📋 Headers da resposta:`, Object.fromEntries(clientesRes.headers.entries()));
    
    // Capturar resposta como texto primeiro
    const responseText = await clientesRes.text();
    console.log(`📄 Resposta bruta (${responseText.length} chars):`, responseText.substring(0, 500));
    
    if (clientesRes.status === 200) {
      try {
        const clientesData = JSON.parse(responseText);
        console.log('\n✅ API de clientes funcionando!');
        console.log(`📊 Total de clientes: ${clientesData.clientes?.length || 0}`);
        console.log(`📄 Paginação: Página ${clientesData.pagination?.page}/${clientesData.pagination?.totalPages}`);
        
        if (clientesData.clientes && clientesData.clientes.length > 0) {
          console.log('\n📋 Clientes retornados pela API:');
          clientesData.clientes.forEach((cliente, index) => {
            console.log(`   ${index + 1}. ${cliente.nome} - ${cliente.email} (Total projetos: ${cliente.total_projetos})`);
          });
        } else {
          console.log('📝 API retornou lista vazia de clientes');
        }
      } catch (parseError) {
        console.log('❌ Erro ao fazer parse da resposta JSON:', parseError.message);
      }
    } else {
      console.log('\n❌ ERRO NA API DE CLIENTES:');
      console.log('📄 Resposta de erro:', responseText);
    }
    
    console.log('\n🎯 RESUMO:');
    console.log(`Servidor: ${healthRes.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`Login: ${loginRes.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`API Clientes: ${clientesRes.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAPICompleto(); 