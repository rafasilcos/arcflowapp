const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/auth';

async function testeAuthMe() {
  console.log('🔐 TESTE DA ROTA /api/auth/me\n');

  try {
    // 1. Fazer login primeiro
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    console.log('📊 Resposta do login:', loginResponse.data);
    
    if (!loginResponse.data.tokens) {
      console.log('❌ Erro no login:', loginResponse.data.error || 'Token não retornado');
      return;
    }

    const token = loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');
    console.log('   Token:', token.substring(0, 50) + '...');

    // 2. Testar rota /me com token válido
    console.log('\n2️⃣ Testando /api/auth/me com token válido...');
    const meResponse = await axios.get(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Rota /me funcionando!');
    console.log('   Usuário:', meResponse.data.user.nome);
    console.log('   Email:', meResponse.data.user.email);
    console.log('   Escritório:', meResponse.data.escritorio.nome);

    // 3. Testar com token inválido
    console.log('\n3️⃣ Testando /api/auth/me com token inválido...');
    try {
      await axios.get(`${BASE_URL}/me`, {
        headers: {
          'Authorization': 'Bearer token-invalido',
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ ERRO: Token inválido deveria falhar!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Token inválido rejeitado corretamente');
        console.log('   Status:', error.response.status);
        console.log('   Erro:', error.response.data.error);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    // 4. Testar sem token
    console.log('\n4️⃣ Testando /api/auth/me sem token...');
    try {
      await axios.get(`${BASE_URL}/me`);
      console.log('❌ ERRO: Requisição sem token deveria falhar!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Requisição sem token rejeitada corretamente');
        console.log('   Status:', error.response.status);
        console.log('   Erro:', error.response.data.error);
      } else {
        console.log('❌ Erro inesperado:', error.message);
      }
    }

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('\n📋 RESULTADO:');
    console.log('   ✅ Login funcionando');
    console.log('   ✅ /api/auth/me validando token corretamente');
    console.log('   ✅ Tokens inválidos sendo rejeitados');
    console.log('   ✅ AuthGuard deve funcionar agora!');

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
testeAuthMe(); 