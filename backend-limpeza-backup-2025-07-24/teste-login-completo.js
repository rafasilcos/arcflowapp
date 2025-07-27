async function testarLoginCompleto() {
  try {
    console.log('🔐 Fazendo login...');
    
    // 1. Fazer login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@arcflow.com',
        password: '123456'
      })
    });
    
    console.log('📊 Status login:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Erro no login:', errorText);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Usuário:', loginData.user?.nome || 'N/A');
    console.log('📋 Resposta completa do login:');
    console.log(JSON.stringify(loginData, null, 2));
    
    // CORREÇÃO: Token está em tokens.accessToken
    const token = loginData.tokens?.accessToken || loginData.accessToken;
    
    if (!token) {
      console.log('❌ Token não foi encontrado na resposta');
      return;
    }
    
    console.log('🔑 Token extraído:', token.substring(0, 50) + '...');
    
    // 2. Testar API /users
    console.log('\n👥 Testando API /users...');
    const usersResponse = await fetch('http://localhost:3001/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status API users:', usersResponse.status);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ API /users funcionando!');
      console.log('📋 Resposta da API /users:');
      console.log(JSON.stringify(usersData, null, 2));
      
      if (usersData.users && Array.isArray(usersData.users)) {
        console.log(`\n👥 Total de usuários encontrados: ${usersData.users.length}`);
        usersData.users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.nome} (${user.email}) - Role: ${user.role}`);
        });
        
        if (usersData.users.length === 0) {
          console.log('⚠️ Nenhum usuário encontrado - verificar filtro por escritorio_id');
        }
      } else {
        console.log('⚠️ Formato de resposta inesperado');
      }
    } else {
      const errorText = await usersResponse.text();
      console.log('❌ Erro na API /users:', errorText);
    }
    
    // 3. Testar API /clientes
    console.log('\n👥 Testando API /clientes...');
    const clientesResponse = await fetch('http://localhost:3001/api/clientes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status API clientes:', clientesResponse.status);
    
    if (clientesResponse.ok) {
      const clientesData = await clientesResponse.json();
      console.log('✅ API /clientes funcionando!');
      console.log(`👥 Total de clientes: ${clientesData.clientes?.length || 0}`);
      
      if (clientesData.clientes && clientesData.clientes.length > 0) {
        clientesData.clientes.forEach((cliente, index) => {
          console.log(`  ${index + 1}. ${cliente.nome} (${cliente.email})`);
        });
      } else {
        console.log('⚠️ Nenhum cliente encontrado');
      }
    } else {
      const errorText = await clientesResponse.text();
      console.log('❌ Erro na API /clientes:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar teste
testarLoginCompleto(); 