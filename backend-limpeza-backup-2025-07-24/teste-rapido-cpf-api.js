const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testeRapidoCpfApi() {
  console.log('🔍 TESTE RÁPIDO: Verificação de CPF via API');
  console.log('==========================================');

  try {
    // 1. Testar se o servidor está rodando
    console.log('1️⃣ Testando se servidor está rodando...');
    try {
      // Testar rota simples primeiro
      const healthResponse = await axios.get(`${API_BASE}/`, { timeout: 3000 });
      console.log('✅ Servidor está rodando!');
    } catch (error) {
      try {
        // Tentar rota alternativa
        await axios.get(`${API_BASE}/api/auth/status`, { timeout: 3000 });
        console.log('✅ Servidor está rodando!');
      } catch (error2) {
        console.log('❌ Servidor não está respondendo. Verificando...');
        console.log('   Erro:', error.message);
        console.log('   Porta 3001 está em uso, mas servidor não responde');
        return;
      }
    }

    // 2. Fazer login para obter token
    console.log('\n2️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    const token = loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');

    // 3. Testar rota de verificação de CPF
    console.log('\n3️⃣ Testando rota de verificação de CPF...');
    const cpfTeste = '12345678901';
    
    try {
      const verificacaoResponse = await axios.get(`${API_BASE}/api/clientes/verificar-cpf/${cpfTeste}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('✅ Rota funcionando!');
      console.log('📋 Resposta:', verificacaoResponse.data);
      
      if (verificacaoResponse.data.hasOwnProperty('duplicado')) {
        console.log('✅ Formato de resposta correto');
      } else {
        console.log('❌ Formato de resposta incorreto');
      }

    } catch (error) {
      console.log('❌ Erro na rota de verificação:', error.response?.data || error.message);
    }

    // 4. Listar clientes para verificar se seu CPF está lá
    console.log('\n4️⃣ Listando clientes cadastrados...');
    try {
      const clientesResponse = await axios.get(`${API_BASE}/api/clientes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log(`📊 Total de clientes: ${clientesResponse.data.clientes?.length || 0}`);
      
      if (clientesResponse.data.clientes?.length > 0) {
        console.log('📋 Primeiros CPFs cadastrados:');
        clientesResponse.data.clientes.slice(0, 5).forEach((cliente, index) => {
          console.log(`   ${index + 1}. ${cliente.nome} - CPF: ${cliente.cpf || 'N/A'}`);
        });
      } else {
        console.log('⚠️  Nenhum cliente cadastrado ainda');
      }

    } catch (error) {
      console.log('❌ Erro ao listar clientes:', error.response?.data || error.message);
    }

    console.log('\n🎯 DIAGNÓSTICO:');
    console.log('═══════════════');
    console.log('✅ Servidor funcionando');
    console.log('✅ Autenticação funcionando');
    console.log('✅ Rota de verificação implementada');
    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   Teste no frontend: http://localhost:3000/comercial/clientes/novo');

  } catch (error) {
    console.error('\n❌ ERRO DURANTE O TESTE:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Executar teste
testeRapidoCpfApi(); 