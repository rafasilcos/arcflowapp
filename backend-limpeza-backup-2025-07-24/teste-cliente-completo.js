const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testeClienteCompleto() {
  console.log('🧪 TESTE CLIENTE COMPLETO - CADASTRO E EDIÇÃO');
  console.log('==============================================');

  try {
    // 1. Fazer login
    console.log('\n1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'admin@arcflow.com',
      password: '123456'
    });

    const token = loginResponse.data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');

    // 2. Criar cliente com TODOS os campos
    console.log('\n2️⃣ Criando cliente com todos os campos...');
    const clienteCompleto = {
      nome: 'Maria Silva Santos',
      email: `maria.teste.${Date.now()}@arcflow.com`,
      telefone: '(11) 98765-4321',
      tipoPessoa: 'fisica',
      cpf: '987.654.321-00',
      profissao: 'Arquiteta',
      dataNascimento: '1985-05-15',
      endereco: {
        cep: '01310-100',
        logradouro: 'Av. Paulista',
        numero: '2000',
        complemento: 'Apto 502',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      },
      familia: {
        conjuge: 'João Santos',
        filhos: [
          { nome: 'Ana', idade: 8, necessidadesEspeciais: '' },
          { nome: 'Pedro', idade: 12, necessidadesEspeciais: '' }
        ],
        pets: [
          { tipo: 'Cachorro', quantidade: 1 },
          { tipo: 'Gato', quantidade: 2 }
        ]
      },
      origem: {
        fonte: 'site',
        dataContato: new Date().toISOString(),
        responsavelComercial: 'Carlos Silva',
        conversasAnteriores: []
      },
      preferencias: {
        estilosArquitetonicos: ['Moderno', 'Minimalista'],
        materiaisPreferidos: ['Madeira', 'Concreto', 'Vidro'],
        coresPreferidas: ['Branco', 'Cinza', 'Azul'],
        orcamentoMedioHistorico: 250000,
        prazoTipicoPreferido: 16
      },
      historicoProjetos: [
        {
          projetoId: 'PROJ-001',
          tipologia: 'Casa Unifamiliar',
          ano: 2022,
          valor: 180000,
          satisfacao: 9,
          observacoes: 'Projeto muito bem executado'
        }
      ],
      observacoes: 'Cliente VIP com histórico excelente',
      status: 'ativo'
    };

    const criarResponse = await axios.post(`${API_BASE}/api/clientes`, clienteCompleto, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Status: ${criarResponse.status}`);
    console.log(`👤 Cliente criado: ${criarResponse.data.cliente?.nome}`);
    const clienteId = criarResponse.data.cliente?.id;

    // 3. Buscar cliente criado para verificar se todos os campos foram salvos
    console.log('\n3️⃣ Verificando se todos os campos foram salvos...');
    const buscarResponse = await axios.get(`${API_BASE}/api/clientes/${clienteId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const cliente = buscarResponse.data.cliente;
    console.log('📋 Campos verificados:');
    console.log(`   Nome: ${cliente.nome}`);
    console.log(`   Email: ${cliente.email}`);
    console.log(`   Telefone: ${cliente.telefone}`);
    console.log(`   CPF: ${cliente.cpf}`);
    console.log(`   Profissão: ${cliente.profissao || 'NÃO SALVO'}`);
    console.log(`   Data Nascimento: ${cliente.data_nascimento || 'NÃO SALVO'}`);
    console.log(`   Endereço: ${cliente.endereco ? 'SALVO' : 'NÃO SALVO'}`);
    console.log(`   Família: ${cliente.familia ? 'SALVO' : 'NÃO SALVO'}`);
    console.log(`   Origem: ${cliente.origem ? 'SALVO' : 'NÃO SALVO'}`);
    console.log(`   Preferências: ${cliente.preferencias ? 'SALVO' : 'NÃO SALVO'}`);
    console.log(`   Histórico: ${cliente.historico_projetos ? 'SALVO' : 'NÃO SALVO'}`);

    // 4. Verificar campos específicos
    const camposFaltando = [];
    if (!cliente.profissao) camposFaltando.push('profissao');
    if (!cliente.data_nascimento) camposFaltando.push('data_nascimento');
    if (!cliente.familia) camposFaltando.push('familia');
    if (!cliente.origem) camposFaltando.push('origem');
    if (!cliente.preferencias) camposFaltando.push('preferencias');
    if (!cliente.historico_projetos) camposFaltando.push('historico_projetos');

    if (camposFaltando.length > 0) {
      console.log('\n❌ CAMPOS NÃO SALVOS:', camposFaltando.join(', '));
      console.log('🔧 É necessário verificar o backend e a estrutura do banco');
    } else {
      console.log('\n✅ TODOS OS CAMPOS FORAM SALVOS CORRETAMENTE!');
      console.log('🎉 O problema da divergência entre cadastro e edição foi resolvido!');
    }

    // 5. Testar atualização
    console.log('\n4️⃣ Testando atualização do cliente...');
    const dadosAtualizacao = {
      profissao: 'Arquiteta Sênior',
      observacoes: 'Cliente atualizado via teste'
    };

    const atualizarResponse = await axios.put(`${API_BASE}/api/clientes/${clienteId}`, dadosAtualizacao, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Atualização: Status ${atualizarResponse.status}`);

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

testeClienteCompleto(); 