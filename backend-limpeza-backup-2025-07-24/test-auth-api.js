const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAuthAPI() {
  try {
    console.log('🔍 Testando API de Autenticação...\n');

    // 1. Testar status da auth
    console.log('1. Testando status da auth...');
    try {
      const statusResponse = await axios.get(`${BASE_URL}/auth/status`);
      console.log('✅ Status:', statusResponse.data);
    } catch (error) {
      console.log('❌ Erro no status:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 2. Testar login com credenciais corretas
    console.log('\n2. Testando login com credenciais corretas...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'rafael@teste.com',
        password: '123456'
      });
      
      console.log('✅ Login bem-sucedido!');
      console.log('👤 Usuário:', loginResponse.data.user.nome);
      console.log('🏢 Escritório:', loginResponse.data.escritorio.nome);
      console.log('🔑 Token:', loginResponse.data.tokens.accessToken.substring(0, 50) + '...');
      
      // Salvar token para próximos testes
      global.authToken = loginResponse.data.tokens.accessToken;
      global.refreshToken = loginResponse.data.tokens.refreshToken;
      
    } catch (error) {
      console.log('❌ Erro no login:', error.response?.data || error.message);
      return;
    }

    console.log('\n' + '='.repeat(50));

    // 3. Testar /auth/me com token válido
    console.log('\n3. Testando /auth/me com token válido...');
    try {
      const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${global.authToken}`
        }
      });
      
      console.log('✅ Dados do usuário obtidos!');
      console.log('👤 Nome:', meResponse.data.user.nome);
      console.log('📧 Email:', meResponse.data.user.email);
      console.log('🏢 Escritório:', meResponse.data.escritorio.nome);
      
    } catch (error) {
      console.log('❌ Erro ao buscar dados do usuário:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 4. Testar refresh token
    console.log('\n4. Testando refresh token...');
    try {
      const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: global.refreshToken
      });
      
      console.log('✅ Token renovado com sucesso!');
      console.log('🔑 Novo token:', refreshResponse.data.tokens.accessToken.substring(0, 50) + '...');
      
    } catch (error) {
      console.log('❌ Erro ao renovar token:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 5. Testar login com credenciais incorretas
    console.log('\n5. Testando login com credenciais incorretas...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'rafael@teste.com',
        password: 'senha_errada'
      });
      
      console.log('❌ Login deveria ter falhou!');
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login rejeitado corretamente:', error.response.data.error);
      } else {
        console.log('❌ Erro inesperado:', error.response?.data || error.message);
      }
    }

    console.log('\n' + '='.repeat(50));

    // 6. Testar logout
    console.log('\n6. Testando logout...');
    try {
      const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`);
      console.log('✅ Logout realizado:', logoutResponse.data.message);
      
    } catch (error) {
      console.log('❌ Erro no logout:', error.response?.data || error.message);
    }

    console.log('\n🎉 Teste da API de autenticação concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Instalar axios se necessário
async function installAxios() {
  try {
    require('axios');
  } catch (error) {
    console.log('📦 Instalando axios...');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
  }
}

// Executar teste
(async () => {
  await installAxios();
  await testAuthAPI();
})(); 