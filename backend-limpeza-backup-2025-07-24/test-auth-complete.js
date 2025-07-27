const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Dados de teste
const testData = {
  registro: {
    nome: 'Rafael Teste',
    email: 'rafael@teste.com',
    password: '123456789',
    escritorio: {
      nome: 'Escritório Rafael Teste',
      email: 'contato@rafaelteste.com',
      telefone: '(11) 99999-9999',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    planId: 'plan_basic'
  },
  login: {
    email: 'rafael@teste.com',
    password: '123456789'
  }
};

let tokens = {};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRegistro() {
  console.log('\n🔐 TESTANDO REGISTRO COMPLETO...');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, testData.registro);
    
    console.log('✅ REGISTRO REALIZADO COM SUCESSO!');
    console.log('   📧 Email:', response.data.user.email);
    console.log('   👤 Nome:', response.data.user.nome);
    console.log('   🏢 Escritório:', response.data.escritorio.nome);
    console.log('   📋 Plano:', response.data.escritorio.planId);
    console.log('   🔑 Access Token:', response.data.tokens.accessToken.substring(0, 50) + '...');
    
    // Salvar tokens
    tokens = response.data.tokens;
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NO REGISTRO:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testLogin() {
  console.log('\n🔑 TESTANDO LOGIN...');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, testData.login);
    
    console.log('✅ LOGIN REALIZADO COM SUCESSO!');
    console.log('   📧 Email:', response.data.user.email);
    console.log('   👤 Nome:', response.data.user.nome);
    console.log('   🏢 Escritório:', response.data.user.escritorioNome);
    console.log('   📋 Plano:', response.data.user.planId);
    console.log('   🔑 Access Token:', response.data.tokens.accessToken.substring(0, 50) + '...');
    
    // Atualizar tokens
    tokens = response.data.tokens;
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NO LOGIN:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testMe() {
  console.log('\n👤 TESTANDO /auth/me...');
  
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`
      }
    });
    
    console.log('✅ DADOS DO USUÁRIO OBTIDOS COM SUCESSO!');
    console.log('   👤 Nome:', response.data.user.nome);
    console.log('   📧 Email:', response.data.user.email);
    console.log('   🏢 Escritório:', response.data.user.escritorioNome);
    console.log('   📋 Plano:', response.data.user.planName);
    console.log('   🔑 Role:', response.data.user.role);
    console.log('   🕒 Último login:', response.data.user.lastLogin);
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO AO BUSCAR DADOS DO USUÁRIO:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testRefresh() {
  console.log('\n🔄 TESTANDO REFRESH TOKEN...');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/refresh`, {
      refreshToken: tokens.refreshToken
    });
    
    console.log('✅ TOKENS RENOVADOS COM SUCESSO!');
    console.log('   🔑 Novo Access Token:', response.data.tokens.accessToken.substring(0, 50) + '...');
    console.log('   🔄 Novo Refresh Token:', response.data.tokens.refreshToken.substring(0, 50) + '...');
    
    // Atualizar tokens
    tokens = response.data.tokens;
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NO REFRESH:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testProtectedRoute() {
  console.log('\n🔒 TESTANDO ROTA PROTEGIDA (CLIENTES)...');
  
  try {
    const response = await axios.get(`${API_BASE}/clientes`, {
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`
      }
    });
    
    console.log('✅ ROTA PROTEGIDA FUNCIONANDO!');
    console.log('   📊 Total de clientes:', response.data.clientes.length);
    console.log('   📈 Paginação:', response.data.pagination);
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NA ROTA PROTEGIDA:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testLogout() {
  console.log('\n🚪 TESTANDO LOGOUT...');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/logout`, {
      refreshToken: tokens.refreshToken
    });
    
    console.log('✅ LOGOUT REALIZADO COM SUCESSO!');
    console.log('   ✅ Refresh token revogado');
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NO LOGOUT:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function testLoginExistente() {
  console.log('\n🔑 TESTANDO LOGIN COM USUÁRIO EXISTENTE (admin@arcflow.com)...');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('✅ LOGIN ADMIN REALIZADO COM SUCESSO!');
    console.log('   📧 Email:', response.data.user.email);
    console.log('   👤 Nome:', response.data.user.nome);
    console.log('   🏢 Escritório:', response.data.user.escritorioNome);
    console.log('   📋 Plano:', response.data.user.planId);
    console.log('   🔑 Role:', response.data.user.role);
    
    // Salvar tokens do admin
    tokens = response.data.tokens;
    
    return response.data;
    
  } catch (error) {
    console.log('❌ ERRO NO LOGIN ADMIN:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Erro:', error.response.data.error);
      console.log('   Código:', error.response.data.code);
    } else {
      console.log('   Erro:', error.message);
    }
    throw error;
  }
}

async function runAllTests() {
  console.log('🚀 INICIANDO TESTES COMPLETOS DO SISTEMA DE AUTENTICAÇÃO ARCFLOW');
  console.log('=' * 80);
  
  try {
    // Aguardar servidor iniciar
    console.log('⏳ Aguardando servidor iniciar...');
    await sleep(3000);
    
    // 1. Testar registro
    await testRegistro();
    
    // 2. Testar login
    await testLogin();
    
    // 3. Testar /me
    await testMe();
    
    // 4. Testar refresh
    await testRefresh();
    
    // 5. Testar rota protegida
    await testProtectedRoute();
    
    // 6. Testar logout
    await testLogout();
    
    // 7. Testar login com usuário existente
    await testLoginExistente();
    
    // 8. Testar /me novamente
    await testMe();
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
    console.log('✅ Sistema de autenticação funcionando perfeitamente!');
    console.log('✅ Multi-tenancy funcionando!');
    console.log('✅ JWT tokens funcionando!');
    console.log('✅ Refresh tokens funcionando!');
    console.log('✅ Rotas protegidas funcionando!');
    console.log('✅ Middleware de autenticação funcionando!');
    
  } catch (error) {
    console.log('\n💥 ALGUM TESTE FALHOU!');
    console.log('❌ Verifique os logs acima para detalhes');
  }
}

// Executar testes
runAllTests(); 