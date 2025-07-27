const fetch = require('node-fetch');

async function testarCriacaoCliente() {
  try {
    console.log('🔐 Fazendo login...');
    
    // 1. Login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // 2. Criar cliente
    console.log('👤 Criando cliente...');
    
    const clienteData = {
      nome: 'João Silva Teste',
      email: 'joao.teste@email.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco_cep: '01234-567',
      endereco_logradouro: 'Rua das Flores',
      endereco_numero: '123',
      endereco_bairro: 'Centro',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      profissao: 'Engenheiro Civil',
      dataNascimento: '15/06/1985',
      status: 'ativo',
      familia: {
        conjuge: 'Maria Silva',
        filhos: [{ nome: 'Pedro', idade: 10 }],
        pets: [{ tipo: 'Cão', quantidade: 1 }]
      },
      origem: {
        fonte: 'site',
        dataContato: new Date().toISOString(),
        responsavelComercial: 'Ana Santos'
      },
      preferencias: {
        estilosArquitetonicos: ['moderno', 'contemporaneo'],
        materiaisPreferidos: ['vidro', 'concreto'],
        coresPreferidas: ['branco', 'cinza']
      },
      observacoes: 'Cliente de teste para verificar nova estrutura'
    };
    
    const clienteResponse = await fetch('http://localhost:3001/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clienteData)
    });
    
    if (!clienteResponse.ok) {
      const errorText = await clienteResponse.text();
      throw new Error(`Criação de cliente falhou: ${clienteResponse.status} - ${errorText}`);
    }
    
    const clienteCriado = await clienteResponse.json();
    console.log('✅ Cliente criado com sucesso:', {
      id: clienteCriado.cliente?.id,
      nome: clienteCriado.cliente?.nome,
      email: clienteCriado.cliente?.email
    });
    
    console.log('\n🎉 TESTE PASSOU! A nova estrutura está funcionando.');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testarCriacaoCliente(); 