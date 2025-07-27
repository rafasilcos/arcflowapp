const fetch = require('node-fetch');

async function testarComAutenticacao() {
  try {
    console.log('🔐 Fazendo login primeiro...');
    
    // 1. Fazer login para obter token
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'rafael@teste.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falhou:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.tokens?.accessToken || loginData.token;
    
    if (!token) {
      console.log('❌ Token não encontrado na resposta do login');
      return;
    }
    
    console.log('✅ Login bem-sucedido, token obtido');
    
    // 2. Agora criar cliente com token
    console.log('\n📝 Criando cliente com autenticação...');
    
    const clienteData = {
      nome: 'João Silva Autenticado',
      email: `joao.auth.${Date.now()}@email.com`,
      telefone: '(11) 99999-7777',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      
      endereco: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        complemento: 'Apto 101',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      },
      endereco_cep: '01310-100',
      endereco_logradouro: 'Avenida Paulista',
      endereco_numero: '1000',
      endereco_complemento: 'Apto 101',
      endereco_bairro: 'Bela Vista',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      
      observacoes: 'Cliente criado via sistema',
      status: 'ativo',
      profissao: 'Arquiteto',
      dataNascimento: '1985-03-15',
      
      familia: {
        conjuge: {
          nome: 'Maria Silva',
          idade: 32
        },
        filhos: [
          {
            nome: 'Pedro Silva',
            idade: 8,
            necessidadesEspeciais: 'Nenhuma'
          }
        ],
        pets: [
          {
            tipo: 'Cachorro',
            quantidade: 1
          }
        ]
      },
      
      historicoProjetos: [
        {
          tipologia: 'residencial',
          ano: 2022,
          valorInvestido: 250000,
          satisfacao: 5
        }
      ],
      
      preferencias: {
        estilos: ['contemporaneo', 'moderno', 'minimalista'],
        orcamento: {
          min: 200000,
          max: 400000
        },
        prazo: '12 meses',
        observacoes: 'Prefere materiais sustentáveis'
      },
      
      origem: {
        fonte: 'Site',
        campanha: 'Google Ads',
        detalhes: 'Busca por arquiteto residencial'
      }
    };
    
    const clienteResponse = await fetch('http://localhost:3001/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clienteData)
    });
    
    console.log(`📊 Status da criação: ${clienteResponse.status}`);
    
    const responseText = await clienteResponse.text();
    console.log('📄 Resposta da criação:');
    console.log(responseText);
    
    if (clienteResponse.status === 500) {
      console.log('\n🚨 ERRO 500 AINDA PERSISTE!');
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Detalhes do erro:', errorData);
      } catch (e) {
        console.log('❌ Resposta de erro:', responseText);
      }
    } else if (clienteResponse.ok) {
      console.log('✅ Cliente criado com sucesso!');
      const data = JSON.parse(responseText);
      console.log('🆔 ID do cliente:', data.cliente?.id);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarComAutenticacao(); 