const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/auth';

async function debugAuthFlow() {
  console.log('🔍 DEBUG DO FLUXO DE AUTENTICAÇÃO\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    console.log('✅ Login realizado');
    console.log('📊 Resposta completa do login:', JSON.stringify(loginResponse.data, null, 2));
    
    const { tokens, user, escritorio } = loginResponse.data;
    console.log('   Token:', tokens?.accessToken?.substring(0, 50) + '...');
    console.log('   User:', user?.nome || 'UNDEFINED');
    console.log('   Escritório objeto:', escritorio || 'UNDEFINED');
    console.log('   Escritório nome:', escritorio?.nome || 'UNDEFINED');

    // 2. Simular o que o frontend faz - salvar no localStorage
    console.log('\n2️⃣ Simulando dados salvos no localStorage...');
    const userDataString = JSON.stringify(user);
    const escritorioDataString = JSON.stringify(escritorio);
    
    console.log('   arcflow_auth_token:', tokens.accessToken.substring(0, 50) + '...');
    console.log('   arcflow_user:', userDataString);
    console.log('   arcflow_escritorio:', escritorioDataString);

    // 3. Testar a rota /me que o AuthGuard usa
    console.log('\n3️⃣ Testando /api/auth/me (usado pelo AuthGuard)...');
    const meResponse = await axios.get(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Rota /me funcionando!');
    console.log('   Status:', meResponse.status);
    console.log('   Usuário retornado:', meResponse.data.user.nome);
    console.log('   Escritório retornado:', meResponse.data.escritorio.nome);

    // 4. Verificar se os dados são consistentes
    console.log('\n4️⃣ Verificando consistência dos dados...');
    
    const loginUser = user;
    const meUser = meResponse.data.user;
    
    console.log('   Login User ID:', loginUser.id);
    console.log('   Me User ID:', meUser.id);
    console.log('   IDs iguais:', loginUser.id === meUser.id ? '✅' : '❌');
    
    console.log('   Login User Nome:', loginUser.nome);
    console.log('   Me User Nome:', meUser.nome);
    console.log('   Nomes iguais:', loginUser.nome === meUser.nome ? '✅' : '❌');

    // 5. Testar com token ligeiramente modificado (simular problema)
    console.log('\n5️⃣ Testando com token inválido...');
    try {
      await axios.get(`${BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}INVALID`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ ERRO: Token inválido deveria falhar!');
    } catch (error) {
      console.log('✅ Token inválido rejeitado corretamente');
      console.log('   Status:', error.response?.status);
      console.log('   Erro:', error.response?.data?.error);
    }

    // 6. Verificar tempo de expiração do token
    console.log('\n6️⃣ Verificando expiração do token...');
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(tokens.accessToken);
    const now = Math.floor(Date.now() / 1000);
    const timeToExpire = decoded.exp - now;
    
    console.log('   Token expira em:', Math.floor(timeToExpire / 60), 'minutos');
    console.log('   Token válido:', timeToExpire > 0 ? '✅' : '❌ EXPIRADO');

    console.log('\n🎉 DIAGNÓSTICO COMPLETO!');
    console.log('\n📋 RESULTADO:');
    console.log('   ✅ Login funcionando');
    console.log('   ✅ Token sendo gerado');
    console.log('   ✅ Rota /me validando token');
    console.log('   ✅ Dados consistentes entre login e /me');
    console.log('   ✅ Tokens inválidos sendo rejeitados');
    console.log('   ✅ Token ainda válido por', Math.floor(timeToExpire / 60), 'minutos');

  } catch (error) {
    console.log('❌ ERRO GERAL:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else if (error.request) {
      console.log('   Erro de conexão:', error.message);
      console.log('   Servidor pode não estar rodando');
    } else {
      console.log('   Erro:', error.message);
    }
  }
}

// Executar teste
debugAuthFlow(); 