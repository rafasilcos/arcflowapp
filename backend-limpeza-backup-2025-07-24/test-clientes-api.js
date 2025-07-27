const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001';

async function testClientesAPI() {
  console.log('🧪 TESTANDO API DE CLIENTES...\n');
  
  try {
    // 1. Fazer login primeiro
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.status !== 200) {
      console.log('❌ Erro no login:', loginData);
      return;
    }
    
    const token = loginData.tokens.accessToken;
    console.log('✅ Login realizado com sucesso!');
    console.log('');
    
    // 2. Listar clientes (deve estar vazio inicialmente)
    console.log('2️⃣ Listando clientes...');
    const listResponse = await fetch(`${API_BASE}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const listData = await listResponse.json();
    console.log(`   Status: ${listResponse.status}`);
    
    if (listResponse.status === 200) {
      console.log(`   ✅ Encontrados ${listData.clientes?.length || 0} clientes`);
      console.log(`   📊 Paginação: Página ${listData.pagination.page}/${listData.pagination.totalPages}`);
    } else {
      console.log('   ❌ Erro:', listData);
    }
    console.log('');
    
    // 3. Criar um cliente de teste
    console.log('3️⃣ Criando cliente de teste...');
    const novoCliente = {
      nome: 'Cliente Teste ArcFlow',
      email: 'cliente.teste@arcflow.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco: {
        logradouro: 'Rua Teste, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      observacoes: 'Cliente criado automaticamente para teste da API'
    };
    
    const createResponse = await fetch(`${API_BASE}/api/clientes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(novoCliente)
    });
    
    const createData = await createResponse.json();
    console.log(`   Status: ${createResponse.status}`);
    
    if (createResponse.status === 201) {
      console.log('   ✅ Cliente criado com sucesso!');
      console.log(`   📝 ID: ${createData.cliente.id}`);
      console.log(`   👤 Nome: ${createData.cliente.nome}`);
      console.log(`   📧 Email: ${createData.cliente.email}`);
      
      const clienteId = createData.cliente.id;
      
      // 4. Buscar cliente específico
      console.log('');
      console.log('4️⃣ Buscando cliente específico...');
      const getResponse = await fetch(`${API_BASE}/api/clientes/${clienteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const getData = await getResponse.json();
      console.log(`   Status: ${getResponse.status}`);
      
      if (getResponse.status === 200) {
        console.log('   ✅ Cliente encontrado!');
        console.log(`   👤 Nome: ${getData.cliente.nome}`);
        console.log(`   📱 Telefone: ${getData.cliente.telefone}`);
        console.log(`   📊 Total projetos: ${getData.cliente.total_projetos || 0}`);
      } else {
        console.log('   ❌ Erro:', getData);
      }
      
    } else {
      console.log('   ❌ Erro ao criar cliente:', createData);
      return;
    }
    
    // 5. Listar novamente para confirmar
    console.log('');
    console.log('5️⃣ Listando clientes novamente...');
    const listResponse2 = await fetch(`${API_BASE}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const listData2 = await listResponse2.json();
    
    if (listResponse2.status === 200) {
      console.log(`   ✅ Agora temos ${listData2.clientes?.length || 0} cliente(s)!`);
      listData2.clientes?.forEach((cliente, index) => {
        console.log(`      ${index + 1}. ${cliente.nome} - ${cliente.email}`);
      });
    }
    
    console.log('');
    console.log('🎯 RESUMO DO TESTE DE CLIENTES:');
    console.log(`   Login: ${loginResponse.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`   Listar Clientes: ${listResponse.status === 200 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`   Criar Cliente: ${createResponse.status === 201 ? '✅ OK' : '❌ ERRO'}`);
    console.log(`   Buscar Cliente: ${getData ? (getData.cliente ? '✅ OK' : '❌ ERRO') : '❌ ERRO'}`);
    
    if (loginResponse.status === 200 && listResponse.status === 200 && createResponse.status === 201) {
      console.log('\n🚀 API DE CLIENTES FUNCIONANDO PERFEITAMENTE!');
      console.log('✅ Pronto para uso no frontend!');
    } else {
      console.log('\n⚠️ Ainda há problemas na API de clientes...');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testClientesAPI(); 