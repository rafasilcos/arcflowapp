const fetch = require('node-fetch');

async function debugClientes() {
  console.log('🔍 DEBUGANDO ERRO NA API DE CLIENTES...\n');
  
  try {
    // 1. Verificar se servidor está rodando
    console.log('1️⃣ Verificando servidor...');
    try {
      const healthRes = await fetch('http://localhost:3001/health');
      if (healthRes.status === 200) {
        console.log('✅ Servidor rodando');
      } else {
        console.log('❌ Servidor com problema:', healthRes.status);
        return;
      }
    } catch (error) {
      console.log('❌ Servidor não está rodando:', error.message);
      return;
    }
    
    // 2. Fazer login
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
      const loginError = await loginRes.text();
      console.log('❌ Erro no login:', loginError);
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.tokens.accessToken;
    console.log('✅ Login OK');
    console.log('👤 Usuário:', loginData.user.nome);
    console.log('🏢 Escritório ID:', loginData.user.escritorioId);
    
    // 3. Testar API de clientes (que está dando erro)
    console.log('\n3️⃣ Testando GET /api/clientes...');
    const clientesRes = await fetch('http://localhost:3001/api/clientes', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status da resposta: ${clientesRes.status}`);
    
    if (clientesRes.status === 200) {
      const clientesData = await clientesRes.json();
      console.log('✅ API de clientes funcionando!');
      console.log(`📊 Total de clientes: ${clientesData.clientes?.length || 0}`);
      console.log(`📄 Paginação: ${clientesData.pagination?.page}/${clientesData.pagination?.totalPages}`);
      
      if (clientesData.clientes && clientesData.clientes.length > 0) {
        console.log('\n📋 Clientes encontrados:');
        clientesData.clientes.forEach((cliente, index) => {
          console.log(`   ${index + 1}. ${cliente.nome} - ${cliente.email}`);
        });
      } else {
        console.log('📝 Nenhum cliente encontrado (lista vazia)');
      }
    } else {
      console.log('❌ ERRO NA API DE CLIENTES:');
      const errorText = await clientesRes.text();
      console.log('Resposta completa:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Erro estruturado:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('Erro como texto simples:', errorText);
      }
    }
    
    console.log('\n🎯 CONCLUSÃO:');
    console.log(`Servidor: ${healthRes?.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`Login: ${loginRes.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`API Clientes: ${clientesRes.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    
  } catch (error) {
    console.error('❌ Erro geral no debug:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugClientes(); 