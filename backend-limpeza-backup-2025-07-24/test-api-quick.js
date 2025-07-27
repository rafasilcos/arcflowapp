const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testAPIs() {
  try {
    console.log('🧪 Testando APIs de Clientes...\n');

    // 1. Health Check
    console.log('1. Testando Health Check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', health.data.status);

    // 2. Login para obter token
    console.log('\n2. Fazendo login...');
    const login = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = login.data.tokens.accessToken;
    console.log('✅ Login realizado, token obtido');

    // 3. Listar clientes
    console.log('\n3. Listando clientes...');
    const clientes = await axios.get(`${API_BASE}/api/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Clientes encontrados: ${clientes.data.clientes?.length || 0}`);
    if (clientes.data.clientes?.length > 0) {
      console.log('   Primeiro cliente:', clientes.data.clientes[0].nome);
    }

    // 4. Criar cliente de teste
    console.log('\n4. Criando cliente de teste...');
    const novoCliente = await axios.post(`${API_BASE}/api/clientes`, {
      nome: 'Cliente API Teste',
      email: 'teste-api@exemplo.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco: {
        logradouro: 'Rua Teste API, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      observacoes: 'Cliente criado via teste de API'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Cliente criado:', novoCliente.data.cliente.nome);
    const clienteId = novoCliente.data.cliente.id;

    // 5. Atualizar cliente
    console.log('\n5. Atualizando cliente...');
    const clienteAtualizado = await axios.put(`${API_BASE}/api/clientes/${clienteId}`, {
      nome: 'Cliente API Teste ATUALIZADO',
      email: 'teste-api-atualizado@exemplo.com',
      telefone: '(11) 88888-8888',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco: {
        logradouro: 'Rua Teste API Atualizada, 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      observacoes: 'Cliente atualizado via teste de API'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Cliente atualizado:', clienteAtualizado.data.cliente.nome);
    console.log('   Novo telefone:', clienteAtualizado.data.cliente.telefone);

    // 6. Buscar cliente específico
    console.log('\n6. Buscando cliente específico...');
    const clienteEspecifico = await axios.get(`${API_BASE}/api/clientes/${clienteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Cliente encontrado:', clienteEspecifico.data.cliente.nome);

    // 7. Listar clientes novamente para confirmar
    console.log('\n7. Listando clientes novamente...');
    const clientesFinais = await axios.get(`${API_BASE}/api/clientes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Total de clientes agora: ${clientesFinais.data.clientes?.length || 0}`);

    console.log('\n🎉 Todos os testes passaram! APIs funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

testAPIs(); 