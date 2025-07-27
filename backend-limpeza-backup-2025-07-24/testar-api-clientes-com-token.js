const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testarAPIClientes() {
  try {
    console.log('🔐 Fazendo login...');
    
    // 1. Fazer login para obter token
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('Resposta completa:', loginResponse.data);
    
    const accessToken = loginResponse.data.tokens?.accessToken || loginResponse.data.accessToken || loginResponse.data.token;
    if (!accessToken) {
      console.log('❌ Token não encontrado na resposta!');
      return;
    }
    
    console.log('Token:', accessToken.substring(0, 50) + '...');
    
    // 2. Testar criação de cliente
    console.log('\n👤 Criando cliente...');
    
    const clienteData = {
      nome: 'Cliente Teste API',
      email: 'cliente.teste@email.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'FISICA',
      cpf: '123.456.789-00',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      },
      observacoes: 'Cliente criado via API para teste',
      status: 'ATIVO',
      profissao: 'Engenheiro',
      dataNascimento: '1990-01-01',
      familia: {
        conjuge: { nome: 'Cônjuge Teste', idade: 30 },
        filhos: [{ nome: 'Filho Teste', idade: 5 }],
        pets: [{ tipo: 'Cachorro', quantidade: 1 }]
      },
      origem: {
        canal: 'Site',
        responsavel: 'Admin Teste',
        data: '2024-01-01'
      },
      preferencias: {
        estilos: ['contemporaneo', 'moderno'],
        orcamento: 100000
      },
      historicoProjetos: [
        {
          tipologia: 'Residencial',
          ano: 2023,
          valor: 50000,
          satisfacao: 5
        }
      ]
    };
    
    const createResponse = await axios.post(`${API_BASE}/api/clientes`, clienteData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Cliente criado com sucesso!');
    console.log('ID:', createResponse.data.cliente.id);
    console.log('Nome:', createResponse.data.cliente.nome);
    console.log('Email:', createResponse.data.cliente.email);
    
    // 3. Testar listagem de clientes
    console.log('\n📋 Listando clientes...');
    
    const listResponse = await axios.get(`${API_BASE}/api/clientes`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Clientes listados com sucesso!');
    console.log('Total de clientes:', listResponse.data.clientes.length);
    
    listResponse.data.clientes.forEach((cliente, index) => {
      console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
    });
    
  } catch (error) {
    console.error('❌ Erro na API:', error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 Erro 500 detectado - verificando logs do servidor...');
    }
  }
}

testarAPIClientes(); 