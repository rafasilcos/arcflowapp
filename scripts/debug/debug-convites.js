const fetch = require('node-fetch');

async function debugConvites() {
  console.log('🔍 === DEBUG SISTEMA DE CONVITES ===\n');

  // 1. Testar se backend está funcionando
  console.log('1. Testando conexão com backend...');
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    console.log('✅ Backend funcionando:', data.status);
  } catch (error) {
    console.log('❌ Backend não está funcionando:', error.message);
    return;
  }

  // 2. Fazer login para obter token
  console.log('\n2. Fazendo login...');
  let token;
  try {
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      token = loginData.tokens.accessToken;
      console.log('✅ Login realizado com sucesso');
      console.log('🔑 Token:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Erro no login:', loginData.error);
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao fazer login:', error.message);
    return;
  }

  // 3. Criar convite
  console.log('\n3. Criando convite...');
  let conviteToken;
  try {
    const conviteResponse = await fetch('http://localhost:3001/api/convites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: 'colaborador@teste.com',
        nome: 'João Silva Debug',
        cargo: 'Arquiteto',
        role: 'ARCHITECT'
      })
    });

    const conviteData = await conviteResponse.json();
    
    if (conviteResponse.ok) {
      conviteToken = conviteData.convite.linkConvite.split('/convite/')[1];
      console.log('✅ Convite criado com sucesso');
      console.log('🔗 Link:', conviteData.convite.linkConvite);
      console.log('🎫 Token do convite:', conviteToken);
    } else {
      console.log('❌ Erro ao criar convite:', conviteData.error);
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao criar convite:', error.message);
    return;
  }

  // 4. Verificar se convite existe
  console.log('\n4. Verificando convite criado...');
  try {
    const verificarResponse = await fetch(`http://localhost:3001/api/convites/${conviteToken}`);
    const verificarData = await verificarResponse.json();
    
    if (verificarResponse.ok) {
      console.log('✅ Convite encontrado:', verificarData.convite.nome);
      console.log('📧 Email:', verificarData.convite.email);
      console.log('📊 Status:', verificarData.convite.status || 'PENDENTE');
    } else {
      console.log('❌ Convite não encontrado:', verificarData.error);
      console.log('📱 Status da resposta:', verificarResponse.status);
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar convite:', error.message);
    return;
  }

  // 5. Aceitar convite
  console.log('\n5. Aceitando convite...');
  try {
    const aceitarResponse = await fetch(`http://localhost:3001/api/convites/${conviteToken}/aceitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: '123456',
        confirmarPassword: '123456'
      })
    });

    const aceitarData = await aceitarResponse.json();
    
    if (aceitarResponse.ok) {
      console.log('✅ Convite aceito com sucesso!');
      console.log('👤 Usuário criado:', aceitarData.user.nome);
      console.log('🏢 Escritório:', aceitarData.user.escritorioId);
    } else {
      console.log('❌ Erro ao aceitar convite:', aceitarData.error);
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao aceitar convite:', error.message);
    return;
  }

  // 6. Verificar se usuário aparece na lista
  console.log('\n6. Verificando se usuário aparece na lista...');
  try {
    const usersResponse = await fetch('http://localhost:3001/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const usersData = await usersResponse.json();
    
    if (usersResponse.ok) {
      const colaboradorEncontrado = usersData.users.find(u => 
        u.email === 'colaborador@teste.com'
      );
      
      if (colaboradorEncontrado) {
        console.log('✅ Colaborador encontrado na lista de usuários!');
        console.log('👤 Nome:', colaboradorEncontrado.name || colaboradorEncontrado.nome);
        console.log('📧 Email:', colaboradorEncontrado.email);
        console.log('🎭 Role:', colaboradorEncontrado.role);
      } else {
        console.log('❌ Colaborador NÃO encontrado na lista de usuários');
        console.log('📋 Total de usuários:', usersData.users.length);
      }
    } else {
      console.log('❌ Erro ao listar usuários:', usersData.error);
    }
  } catch (error) {
    console.log('❌ Erro ao listar usuários:', error.message);
  }

  console.log('\n🎯 === FIM DO DEBUG ===');
}

// Executar debug
debugConvites().catch(console.error); 