// ===== TESTE COMPLETO DO SISTEMA DE CONVITES =====
// Testa todo o fluxo: envio → verificação → aceite → login

console.log('🚀 ===============================================');
console.log('   TESTE COMPLETO - SISTEMA DE CONVITES');
console.log('🚀 ===============================================\n');

const BASE_URL = 'http://localhost:3001';
let token = null;
let conviteToken = null;

// Dados de teste
const dadosLogin = {
  email: 'rafael@teste.com',
  password: '123456'
};

const dadosConvite = {
  email: 'joao.silva@exemplo.com',
  nome: 'João Silva',
  cargo: 'Arquiteto Senior',
  role: 'ARCHITECT',
  mensagemPersonalizada: 'Estamos ansiosos para ter você na nossa equipe! Você será responsável pelos projetos residenciais.'
};

const dadosAceite = {
  password: 'senha123',
  confirmarPassword: 'senha123'
};

// Função para fazer requisições
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    return { response: null, data: null };
  }
}

// 1. Fazer login para obter token
async function fazerLogin() {
  console.log('1️⃣ Fazendo login...');
  
  const { response, data } = await request(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(dadosLogin)
  });

  if (response && response.ok) {
    token = data.tokens.accessToken;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Usuário: ${data.user.nome}`);
    console.log(`   Escritório: ${data.user.escritorioNome}`);
    return true;
  } else {
    console.log('❌ Erro no login:', data?.error || 'Erro desconhecido');
    return false;
  }
}

// 2. Enviar convite
async function enviarConvite() {
  console.log('\n2️⃣ Enviando convite...');
  
  const { response, data } = await request(`${BASE_URL}/api/convites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(dadosConvite)
  });

  if (response && response.ok) {
    conviteToken = data.convite.token;
    console.log('✅ Convite enviado com sucesso');
    console.log(`   Para: ${data.convite.email}`);
    console.log(`   Nome: ${data.convite.nome}`);
    console.log(`   Cargo: ${data.convite.cargo}`);
    console.log(`   Link: ${data.convite.linkConvite}`);
    console.log(`   Token: ${conviteToken}`);
    return true;
  } else {
    console.log('❌ Erro ao enviar convite:', data?.error || 'Erro desconhecido');
    return false;
  }
}

// 3. Listar convites
async function listarConvites() {
  console.log('\n3️⃣ Listando convites...');
  
  const { response, data } = await request(`${BASE_URL}/api/convites`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response && response.ok) {
    console.log('✅ Convites carregados');
    console.log(`   Total: ${data.convites.length}`);
    
    data.convites.forEach((convite, index) => {
      console.log(`   ${index + 1}. ${convite.nome} (${convite.email}) - ${convite.status}`);
    });
    return true;
  } else {
    console.log('❌ Erro ao listar convites:', data?.error || 'Erro desconhecido');
    return false;
  }
}

// 4. Listar usuários da equipe
async function listarUsuarios() {
  console.log('\n4️⃣ Listando usuários da equipe...');
  
  const { response, data } = await request(`${BASE_URL}/api/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response && response.ok) {
    console.log('✅ Usuários carregados');
    console.log(`   Total: ${data.users.length}`);
    
    data.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
    });
    return true;
  } else {
    console.log('❌ Erro ao listar usuários:', data?.error || 'Erro desconhecido');
    return false;
  }
}

// 5. Verificar convite (sem autenticação)
async function verificarConvite() {
  console.log('\n5️⃣ Verificando convite...');
  
  const { response, data } = await request(`${BASE_URL}/api/convites/${conviteToken}`);

  if (response && response.ok) {
    console.log('✅ Convite verificado');
    console.log(`   Para: ${data.convite.nome} (${data.convite.email})`);
    console.log(`   Escritório: ${data.convite.escritorio.nome}`);
    console.log(`   Enviado por: ${data.convite.enviadoPor.nome}`);
    console.log(`   Cargo: ${data.convite.cargo}`);
    console.log(`   Função: ${data.convite.role}`);
    if (data.convite.mensagemPersonalizada) {
      console.log(`   Mensagem: "${data.convite.mensagemPersonalizada}"`);
    }
    return true;
  } else {
    console.log('❌ Erro ao verificar convite:', data?.error || 'Erro desconhecido');
    return false;
  }
}

// 6. Aceitar convite
async function aceitarConvite() {
  console.log('\n6️⃣ Aceitando convite...');
  
  const { response, data } = await request(`${BASE_URL}/api/convites/${conviteToken}/aceitar`, {
    method: 'POST',
    body: JSON.stringify(dadosAceite)
  });

  if (response && response.ok) {
    console.log('✅ Convite aceito com sucesso!');
    console.log(`   Usuário criado: ${data.user.nome}`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   Role: ${data.user.role}`);
    console.log(`   Escritório: ${data.user.escritorioNome}`);
    console.log(`   Token JWT: ${data.tokens.accessToken.substring(0, 50)}...`);
    return { success: true, newToken: data.tokens.accessToken };
  } else {
    console.log('❌ Erro ao aceitar convite:', data?.error || 'Erro desconhecido');
    return { success: false };
  }
}

// 7. Testar login do novo usuário
async function testarLoginNovoUsuario(newToken) {
  console.log('\n7️⃣ Testando acesso do novo usuário...');
  
  // Testar acesso às APIs com o novo token
  const { response, data } = await request(`${BASE_URL}/api/users`, {
    headers: {
      'Authorization': `Bearer ${newToken}`
    }
  });

  if (response && response.ok) {
    console.log('✅ Novo usuário tem acesso ao sistema');
    console.log(`   Pode ver ${data.users.length} usuários da equipe`);
    return true;
  } else {
    console.log('❌ Novo usuário não consegue acessar o sistema');
    return false;
  }
}

// 8. Verificar se convite foi marcado como aceito
async function verificarConviteAceito() {
  console.log('\n8️⃣ Verificando status do convite...');
  
  const { response, data } = await request(`${BASE_URL}/api/convites/${conviteToken}`);

  if (response && !response.ok && data?.error?.includes('processado')) {
    console.log('✅ Convite marcado como aceito (não pode ser usado novamente)');
    return true;
  } else if (response && response.ok) {
    console.log('⚠️  Convite ainda está ativo (deveria estar aceito)');
    return false;
  } else {
    console.log('❌ Erro ao verificar status do convite');
    return false;
  }
}

// Executar teste completo
async function executarTesteCompleto() {
  console.log('🧪 Iniciando teste completo do sistema de convites...\n');
  
  let resultados = {
    login: false,
    enviarConvite: false,
    listarConvites: false,
    listarUsuarios: false,
    verificarConvite: false,
    aceitarConvite: false,
    testarNovoUsuario: false,
    verificarStatus: false
  };

  // Executar testes em sequência
  resultados.login = await fazerLogin();
  
  if (resultados.login) {
    resultados.enviarConvite = await enviarConvite();
    resultados.listarConvites = await listarConvites();
    resultados.listarUsuarios = await listarUsuarios();
  }
  
  if (resultados.enviarConvite && conviteToken) {
    resultados.verificarConvite = await verificarConvite();
    
    const aceitarResult = await aceitarConvite();
    resultados.aceitarConvite = aceitarResult.success;
    
    if (aceitarResult.success) {
      resultados.testarNovoUsuario = await testarLoginNovoUsuario(aceitarResult.newToken);
      resultados.verificarStatus = await verificarConviteAceito();
    }
  }

  // Resumo final
  console.log('\n🎯 ===============================================');
  console.log('   RESUMO DOS TESTES');
  console.log('🎯 ===============================================');
  
  const testes = [
    { nome: 'Login de usuário existente', status: resultados.login },
    { nome: 'Envio de convite', status: resultados.enviarConvite },
    { nome: 'Listagem de convites', status: resultados.listarConvites },
    { nome: 'Listagem de usuários', status: resultados.listarUsuarios },
    { nome: 'Verificação de convite', status: resultados.verificarConvite },
    { nome: 'Aceite de convite', status: resultados.aceitarConvite },
    { nome: 'Acesso do novo usuário', status: resultados.testarNovoUsuario },
    { nome: 'Status do convite aceito', status: resultados.verificarStatus }
  ];

  let sucessos = 0;
  testes.forEach(teste => {
    const icon = teste.status ? '✅' : '❌';
    console.log(`${icon} ${teste.nome}`);
    if (teste.status) sucessos++;
  });

  const porcentagem = Math.round((sucessos / testes.length) * 100);
  
  console.log(`\n📊 RESULTADO FINAL: ${sucessos}/${testes.length} testes passaram (${porcentagem}%)`);
  
  if (porcentagem === 100) {
    console.log('🎉 PARABÉNS! Sistema de convites 100% funcional!');
    console.log('\n🚀 PRÓXIMOS PASSOS:');
    console.log('   1. Testar no frontend: http://localhost:3000/configuracoes/equipe');
    console.log('   2. Enviar convite real e testar página de aceite');
    console.log('   3. Configurar envio de emails em produção');
  } else if (porcentagem >= 75) {
    console.log('✨ Sistema de convites quase pronto! Faltam alguns ajustes.');
  } else {
    console.log('⚠️  Sistema precisa de correções antes de usar em produção.');
  }
  
  console.log('\n📋 URLS PARA TESTAR:');
  console.log('   • Gestão de equipe: http://localhost:3000/configuracoes/equipe');
  console.log('   • Aceitar convite: http://localhost:3000/convite/[token]');
  console.log('   • API convites: http://localhost:3001/api/convites');
}

// Verificar se servidor está rodando
async function verificarServidor() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Servidor backend rodando\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Servidor backend não está rodando');
    console.log('   Execute: cd backend && node server-simple.js\n');
    return false;
  }
}

// Executar
verificarServidor().then(serverOk => {
  if (serverOk) {
    executarTesteCompleto();
  }
}); 