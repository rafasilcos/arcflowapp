const fetch = require('node-fetch');

async function debugLoginCompleto() {
  console.log('🔍 DEBUG COMPLETO DO LOGIN...\n');
  
  try {
    // 1. Testar login
    console.log('1️⃣ Fazendo login com admin@arcflow.com...');
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    console.log(`📊 Status da resposta: ${response.status}`);
    
    if (response.status !== 200) {
      const errorText = await response.text();
      console.log('❌ ERRO NO LOGIN:');
      console.log(errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ LOGIN SUCESSO!');
    console.log('\n📋 DADOS RETORNADOS:');
    console.log(JSON.stringify(data, null, 2));
    
    // 2. Verificar se tem todos os campos necessários
    console.log('\n🔍 VERIFICANDO CAMPOS OBRIGATÓRIOS:');
    console.log(`✓ tokens.accessToken: ${data.tokens?.accessToken ? 'SIM' : 'NÃO'}`);
    console.log(`✓ tokens.refreshToken: ${data.tokens?.refreshToken ? 'SIM' : 'NÃO'}`);
    console.log(`✓ user: ${data.user ? 'SIM' : 'NÃO'}`);
    console.log(`✓ user.id: ${data.user?.id ? 'SIM' : 'NÃO'}`);
    console.log(`✓ user.nome: ${data.user?.nome ? 'SIM' : 'NÃO'}`);
    console.log(`✓ user.escritorioId: ${data.user?.escritorioId ? 'SIM' : 'NÃO'}`);
    
    // 3. Testar se o token funciona
    console.log('\n3️⃣ Testando token em rota protegida...');
    const testResponse = await fetch('http://localhost:3001/api/clientes', {
      headers: {
        'Authorization': `Bearer ${data.tokens.accessToken}`
      }
    });
    
    console.log(`📊 Status da rota protegida: ${testResponse.status}`);
    
    if (testResponse.status === 200) {
      console.log('✅ TOKEN VÁLIDO - Rota protegida funcionando!');
    } else {
      console.log('❌ TOKEN INVÁLIDO - Rota protegida falhou!');
      const errorText = await testResponse.text();
      console.log('Erro:', errorText);
    }
    
    // 4. Verificar estrutura do usuário
    console.log('\n👤 ESTRUTURA DO USUÁRIO:');
    if (data.user) {
      Object.keys(data.user).forEach(key => {
        console.log(`   ${key}: ${data.user[key]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

debugLoginCompleto(); 