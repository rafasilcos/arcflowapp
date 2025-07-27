const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testeClientesRapido() {
  console.log('🧪 TESTE RÁPIDO - ROTAS DE CLIENTES');
  console.log('====================================');

  try {
    // 1. Fazer login primeiro
    console.log('\n1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    if (loginResponse.status !== 200) {
      throw new Error('Falha no login');
    }

    const token = loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');

    // 2. Testar GET /api/clientes
    console.log('\n2️⃣ Testando GET /api/clientes...');
    const clientesResponse = await axios.get(`${API_BASE}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(`✅ Status: ${clientesResponse.status}`);
    console.log(`📊 Total de clientes: ${clientesResponse.data.clientes?.length || 0}`);
    
    if (clientesResponse.data.pagination) {
      console.log(`📄 Paginação: ${clientesResponse.data.pagination.page}/${clientesResponse.data.pagination.totalPages}`);
    }

    // 3. Testar POST /api/clientes (criar novo)
    console.log('\n3️⃣ Testando POST /api/clientes...');
    const novoCliente = {
      nome: 'Cliente Teste API',
      email: `teste.${Date.now()}@arcflow.com`,
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco: {
        logradouro: 'Rua Teste',
        numero: '123',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      observacoes: 'Cliente criado via teste da API'
    };

    const criarResponse = await axios.post(`${API_BASE}/api/clientes`, novoCliente, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Status: ${criarResponse.status}`);
    console.log(`👤 Cliente criado: ${criarResponse.data.cliente?.nome}`);
    console.log(`🆔 ID: ${criarResponse.data.cliente?.id}`);

    const clienteId = criarResponse.data.cliente?.id;

    // 4. Testar GET /api/clientes/:id
    if (clienteId) {
      console.log('\n4️⃣ Testando GET /api/clientes/:id...');
      const clienteResponse = await axios.get(`${API_BASE}/api/clientes/${clienteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log(`✅ Status: ${clienteResponse.status}`);
      console.log(`👤 Cliente encontrado: ${clienteResponse.data.cliente?.nome}`);
    }

    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ As rotas de clientes estão funcionando corretamente');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📝 Dados:`, error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Servidor não está rodando. Execute: node server-simple.js');
    }
  }
}

// Executar teste
testeClientesRapido(); 