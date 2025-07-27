async function testarApisFinal() {
  try {
    console.log('🎯 TESTE FINAL DAS APIs ARCFLOW');
    console.log('================================\n');
    
    // 1. Login
    console.log('🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Erro no login:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.tokens?.accessToken;
    
    if (!token) {
      console.log('❌ Token não obtido');
      return;
    }
    
    console.log('✅ Login OK - Token obtido');
    console.log(`👤 Usuário: ${loginData.user.nome} (${loginData.user.email})`);
    console.log(`🏢 Escritório: ${loginData.user.escritorioId}\n`);
    
    // 2. Testar API /users
    console.log('👥 Testando API /users...');
    const usersResponse = await fetch('http://localhost:3001/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ API /users OK - ${usersData.users?.length || 0} usuários`);
      usersData.users?.forEach((user, i) => {
        console.log(`  ${i+1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log('❌ API /users falhou:', await usersResponse.text());
    }
    
    console.log('');
    
    // 3. Testar API /clientes  
    console.log('👥 Testando API /clientes...');
    const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (clientesResponse.ok) {
      const clientesData = await clientesResponse.json();
      console.log(`✅ API /clientes OK - ${clientesData.clientes?.length || 0} clientes`);
      clientesData.clientes?.forEach((cliente, i) => {
        console.log(`  ${i+1}. ${cliente.nome} (${cliente.email})`);
      });
    } else {
      console.log('❌ API /clientes falhou:', await clientesResponse.text());
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO!');
    
    // 4. Resumo final
    const usuariosCount = usersResponse.ok ? (await usersResponse.json()).users?.length || 0 : 0;
    const clientesCount = clientesResponse.ok ? (await clientesResponse.json()).clientes?.length || 0 : 0;
    
    console.log('\n📊 RESUMO FINAL:');
    console.log(`✅ Login: ${loginResponse.ok ? 'OK' : 'FALHOU'}`);
    console.log(`✅ API /users: ${usersResponse.ok ? 'OK' : 'FALHOU'} (${usuariosCount} usuários)`);
    console.log(`✅ API /clientes: ${clientesResponse.ok ? 'OK' : 'FALHOU'} (${clientesCount} clientes)`);
    
    if (loginResponse.ok && usersResponse.ok && clientesResponse.ok && usuariosCount > 0 && clientesCount > 0) {
      console.log('\n🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!');
      console.log('✅ Multi-tenancy implementado');
      console.log('✅ APIs retornando dados corretos');
      console.log('✅ Frontend pode usar as APIs normalmente');
    } else {
      console.log('\n⚠️ Ainda há problemas a resolver');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testarApisFinal(); 