const fetch = require('node-fetch');

async function testarCriacaoCliente() {
  try {
    console.log('🧪 Testando criação de cliente...');
    
    // Dados do cliente como o frontend está enviando
    const clienteData = {
      nome: 'Cliente Teste Simples',
      email: `cliente.teste.${Date.now()}@email.com`, // Email único
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco: {
        cep: '01234-567',
        logradouro: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      },
      endereco_cep: '01234-567',
      endereco_logradouro: 'Rua Teste',
      endereco_numero: '123',
      endereco_bairro: 'Centro',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      status: 'ativo',
      profissao: 'Engenheiro',
      familia: {
        conjuge: { nome: 'Maria', idade: 30 },
        filhos: [{ nome: 'João', idade: 5 }],
        pets: [{ tipo: 'Cachorro', quantidade: 1 }]
      },
      origem: {
        fonte: 'Site',
        campanha: 'Teste',
        detalhes: 'Teste de sistema'
      },
      preferencias: {
        estilos: ['contemporaneo', 'moderno'],
        orcamento: { min: 100000, max: 300000 },
        prazo: '6 meses'
      },
      historicoProjetos: [
        {
          tipologia: 'residencial',
          ano: 2023,
          valorInvestido: 150000,
          satisfacao: 4
        }
      ]
    };
    
    console.log('📤 Enviando dados:', JSON.stringify(clienteData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Sem token de autorização para testar se é problema de auth
      },
      body: JSON.stringify(clienteData)
    });
    
    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', response.headers.raw());
    
    const responseText = await response.text();
    console.log('📄 Resposta:', responseText);
    
    if (response.ok) {
      console.log('✅ Cliente criado com sucesso!');
      const data = JSON.parse(responseText);
      console.log('🆔 ID do cliente:', data.cliente?.id);
    } else {
      console.log('❌ Erro na criação');
      if (response.status === 500) {
        console.log('🚨 Erro 500 - Problema no servidor backend');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarCriacaoCliente(); 