const fetch = require('node-fetch');

async function debugEnderecoCompleto() {
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
    
    // 2. Dados do cliente com endereço preenchido
    console.log('👤 Preparando dados do cliente...');
    
    const clienteData = {
      nome: 'João Silva Debug',
      email: 'joao.debug@email.com',
      telefone: '(11) 99999-9999',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      endereco_cep: '01234-567',
      endereco_logradouro: 'Rua das Flores Debug',
      endereco_numero: '123',
      endereco_complemento: 'Apartamento 45',
      endereco_bairro: 'Centro',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      profissao: 'Engenheiro Civil',
      dataNascimento: '15/06/1985',
      status: 'ativo',
      observacoes: 'Cliente de debug para testar endereço'
    };
    
    console.log('📋 Dados que serão enviados:');
    console.log('  endereco_cep:', clienteData.endereco_cep);
    console.log('  endereco_logradouro:', clienteData.endereco_logradouro);
    console.log('  endereco_numero:', clienteData.endereco_numero);
    console.log('  endereco_complemento:', clienteData.endereco_complemento);
    console.log('  endereco_bairro:', clienteData.endereco_bairro);
    console.log('  endereco_cidade:', clienteData.endereco_cidade);
    console.log('  endereco_uf:', clienteData.endereco_uf);
    console.log('  endereco_pais:', clienteData.endereco_pais);
    
    // 3. Criar cliente
    console.log('\n🚀 Enviando requisição...');
    
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
      throw new Error(`Criação falhou: ${clienteResponse.status} - ${errorText}`);
    }
    
    const clienteCriado = await clienteResponse.json();
    console.log('✅ Cliente criado com sucesso!');
    
    // 4. Verificar dados salvos
    console.log('\n📊 Dados salvos no banco:');
    const cliente = clienteCriado.cliente;
    console.log('  endereco_cep:', cliente.endereco_cep);
    console.log('  endereco_logradouro:', cliente.endereco_logradouro);
    console.log('  endereco_numero:', cliente.endereco_numero);
    console.log('  endereco_complemento:', cliente.endereco_complemento);
    console.log('  endereco_bairro:', cliente.endereco_bairro);
    console.log('  endereco_cidade:', cliente.endereco_cidade);
    console.log('  endereco_uf:', cliente.endereco_uf);
    console.log('  endereco_pais:', cliente.endereco_pais);
    
    // 5. Verificar se algum campo está NULL
    const camposVazios = [];
    if (!cliente.endereco_cep) camposVazios.push('endereco_cep');
    if (!cliente.endereco_logradouro) camposVazios.push('endereco_logradouro');
    if (!cliente.endereco_numero) camposVazios.push('endereco_numero');
    if (!cliente.endereco_bairro) camposVazios.push('endereco_bairro');
    if (!cliente.endereco_cidade) camposVazios.push('endereco_cidade');
    if (!cliente.endereco_uf) camposVazios.push('endereco_uf');
    
    if (camposVazios.length > 0) {
      console.log('\n❌ PROBLEMA ENCONTRADO! Campos vazios:', camposVazios);
    } else {
      console.log('\n🎉 SUCESSO! Todos os campos de endereço foram salvos corretamente.');
    }
    
    // 6. Limpeza - remover cliente de teste
    console.log('\n🧹 Removendo cliente de teste...');
    await fetch(`http://localhost:3001/api/clientes/${cliente.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Cliente de teste removido');
    
  } catch (error) {
    console.error('❌ Erro no debug:', error.message);
  }
}

debugEnderecoCompleto(); 