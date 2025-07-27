const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testarFluxoCompleto() {
  console.log('🚀 Iniciando teste completo do fluxo...\n');
  
  try {
    // 1. Teste de Health Check
    console.log('1️⃣ Testando Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
    
    // 2. Teste de Login
    console.log('\n2️⃣ Testando Login...');
    const loginData = {
      email: 'rafael@teste.com',
      password: '123456'
    };
    
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falhou. Vamos tentar criar o usuário primeiro...');
      
      // Tentar criar usuário
      console.log('📝 Criando usuário de teste...');
      const registerData = {
        nome: 'Rafael Teste',
        email: 'rafael@teste.com',
        password: '123456',
        escritorio: {
          nome: 'Escritório Teste',
          email: 'escritorio@teste.com'
        }
      };
      
      const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      
      if (registerResponse.ok) {
        console.log('✅ Usuário criado com sucesso');
      } else {
        const registerError = await registerResponse.text();
        console.log('⚠️ Erro ao criar usuário:', registerError);
      }
      
      // Tentar login novamente
      const loginResponse2 = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      if (!loginResponse2.ok) {
        const loginError = await loginResponse2.text();
        console.log('❌ Login ainda falhou:', loginError);
        return;
      }
      
      const loginResult = await loginResponse2.json();
      console.log('✅ Login bem-sucedido:', { token: loginResult.token ? 'OK' : 'MISSING' });
      var token = loginResult.token;
      
    } else {
      const loginResult = await loginResponse.json();
      console.log('✅ Login bem-sucedido:', { token: loginResult.token ? 'OK' : 'MISSING' });
      var token = loginResult.token;
    }
    
    if (!token) {
      console.log('❌ Token não obtido, parando teste');
      return;
    }
    
    // 3. Teste de Status de Auth
    console.log('\n3️⃣ Testando Status de Autenticação...');
    const statusResponse = await fetch(`${BASE_URL}/api/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Status auth:', statusData);
    } else {
      console.log('❌ Status auth falhou:', await statusResponse.text());
    }
    
    // 4. Teste de Listagem de Clientes
    console.log('\n4️⃣ Testando Listagem de Clientes...');
    const clientesListResponse = await fetch(`${BASE_URL}/api/clientes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (clientesListResponse.ok) {
      const clientesData = await clientesListResponse.json();
      console.log('✅ Clientes listados:', clientesData);
    } else {
      console.log('❌ Listagem de clientes falhou:', await clientesListResponse.text());
    }
    
    // 5. Teste de Criação de Cliente (dados simples)
    console.log('\n5️⃣ Testando Criação de Cliente (dados simples)...');
    const clienteSimples = {
      nome: 'Cliente Teste Simples',
      email: 'cliente.simples@teste.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      status: 'ativo'
    };
    
    const criarClienteSimplesResponse = await fetch(`${BASE_URL}/api/clientes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteSimples)
    });
    
    if (criarClienteSimplesResponse.ok) {
      const clienteCriado = await criarClienteSimplesResponse.json();
      console.log('✅ Cliente simples criado:', clienteCriado);
    } else {
      const erro = await criarClienteSimplesResponse.text();
      console.log('❌ Criação de cliente simples falhou:', erro);
    }
    
    // 6. Teste de Criação de Cliente (dados completos como o frontend envia)
    console.log('\n6️⃣ Testando Criação de Cliente (dados completos)...');
    const clienteCompleto = {
      nome: 'Cliente Teste Completo',
      email: 'cliente.completo@teste.com',
      telefone: '(11) 88888-8888',
      tipoPessoa: 'fisica',
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
      endereco_cep: '01234-567',
      endereco_logradouro: 'Rua Teste',
      endereco_numero: '123',
      endereco_complemento: 'Apto 45',
      endereco_bairro: 'Centro',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      status: 'ativo',
      profissao: 'Engenheiro',
      dataNascimento: '1985-05-15',
      familia: {
        conjuge: { nome: 'Maria Silva', idade: 32 },
        filhos: [{ nome: 'João Silva', idade: 8, necessidadesEspeciais: '' }],
        pets: [{ tipo: 'Cachorro', quantidade: 1 }]
      },
      origem: {
        fonte: 'Site',
        campanha: 'Google Ads',
        detalhes: 'Busca orgânica por arquiteto'
      },
      preferencias: {
        estilos: ['contemporaneo', 'moderno'],
        orcamento: { min: 150000, max: 300000 },
        prazo: '8 meses',
        observacoes: 'Prefere materiais sustentáveis'
      },
      historicoProjetos: [
        {
          tipologia: 'residencial',
          ano: 2022,
          valorInvestido: 180000,
          satisfacao: 4
        }
      ],
      conversasComerciais: [
        {
          data: '2024-01-15',
          canal: 'email',
          responsavel: 'Equipe Comercial',
          resumo: 'Primeiro contato via site'
        }
      ]
    };
    
    const criarClienteCompletoResponse = await fetch(`${BASE_URL}/api/clientes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteCompleto)
    });
    
    if (criarClienteCompletoResponse.ok) {
      const clienteCriado = await criarClienteCompletoResponse.json();
      console.log('✅ Cliente completo criado:', clienteCriado);
    } else {
      const erro = await criarClienteCompletoResponse.text();
      console.log('❌ Criação de cliente completo falhou:', erro);
      console.log('📊 Status:', criarClienteCompletoResponse.status);
    }
    
    console.log('\n🎉 Teste completo finalizado!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarFluxoCompleto(); 