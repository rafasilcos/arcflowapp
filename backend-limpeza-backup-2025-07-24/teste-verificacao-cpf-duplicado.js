const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testeVerificacaoCpfDuplicado() {
  console.log('🧪 TESTE DE VERIFICAÇÃO DE CPF DUPLICADO');
  console.log('=======================================');

  try {
    // 1. Fazer login
    console.log('\n1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    const token = loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');

    // 2. Criar um cliente com CPF
    console.log('\n2️⃣ Criando cliente com CPF para testar duplicação...');
    const cpfTeste = '12345678901'; // CPF sem formatação
    const clienteOriginal = {
      nome: 'Cliente Original CPF Teste',
      email: `original.${Date.now()}@teste.com`,
      telefone: '(11) 99999-8888',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-01', // CPF formatado
      endereco_cep: '01234-567',
      endereco_logradouro: 'Rua Teste Original',
      endereco_numero: '100',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      status: 'ativo'
    };

    const createResponse = await axios.post(`${API_BASE}/api/clientes`, clienteOriginal, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Cliente original criado:', createResponse.data.cliente.nome);

    // 3. Verificar se CPF está duplicado (deve retornar duplicado: true)
    console.log('\n3️⃣ Verificando se CPF está duplicado...');
    const verificacaoResponse = await axios.get(`${API_BASE}/api/clientes/verificar-cpf/${cpfTeste}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('📋 Resultado da verificação:', verificacaoResponse.data);
    
    if (verificacaoResponse.data.duplicado) {
      console.log('✅ TESTE PASSOU: CPF foi detectado como duplicado');
      console.log(`   Cliente existente: ${verificacaoResponse.data.nomeCliente}`);
    } else {
      console.log('❌ TESTE FALHOU: CPF deveria ter sido detectado como duplicado');
    }

    // 4. Tentar criar outro cliente com mesmo CPF (deve falhar)
    console.log('\n4️⃣ Tentando criar cliente com CPF duplicado...');
    const clienteDuplicado = {
      nome: 'Cliente Duplicado',
      email: `duplicado.${Date.now()}@teste.com`,
      telefone: '(11) 88888-7777',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-01', // Mesmo CPF
      endereco_cep: '09876-543',
      endereco_logradouro: 'Rua Teste Duplicado',
      endereco_numero: '200',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      status: 'ativo'
    };

    try {
      await axios.post(`${API_BASE}/api/clientes`, clienteDuplicado, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('❌ TESTE FALHOU: Cliente com CPF duplicado foi criado');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ TESTE PASSOU: Criação bloqueada por CPF duplicado');
        console.log(`   Erro: ${error.response.data.error}`);
      } else {
        console.log('❌ TESTE FALHOU: Erro inesperado:', error.message);
      }
    }

    // 5. Verificar CPF não existente
    console.log('\n5️⃣ Verificando CPF não existente...');
    const cpfInexistente = '98765432109';
    const verificacaoInexistente = await axios.get(`${API_BASE}/api/clientes/verificar-cpf/${cpfInexistente}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('📋 Resultado da verificação:', verificacaoInexistente.data);
    
    if (!verificacaoInexistente.data.duplicado) {
      console.log('✅ TESTE PASSOU: CPF inexistente foi detectado como não duplicado');
    } else {
      console.log('❌ TESTE FALHOU: CPF inexistente foi detectado como duplicado');
    }

    console.log('\n🎉 TESTES DE VERIFICAÇÃO DE CPF DUPLICADO CONCLUÍDOS!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
  }
}

// Executar teste
testeVerificacaoCpfDuplicado(); 