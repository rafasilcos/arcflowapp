// ===== TESTE COMPLETO DO SISTEMA DE EMAIL - ARCFLOW =====

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Dados de teste
const USUARIO_TESTE = {
  email: 'rafael@teste.com',
  password: '123456'
};

const CONVITE_TESTE = {
  email: 'maria.santos@exemplo.com', // Use um email real para testar
  nome: 'Maria Santos',
  cargo: 'Arquiteta Senior',
  role: 'ARCHITECT',
  mensagemPersonalizada: 'Bem-vinda à nossa equipe! Estamos ansiosos para trabalhar com você.'
};

let authToken = null;

console.log('🧪 ===============================================');
console.log('   TESTE COMPLETO - SISTEMA DE EMAIL ARCFLOW');
console.log('🧪 ===============================================\n');

// Função para fazer login e obter token
async function fazerLogin() {
  try {
    console.log('1️⃣ Fazendo login...');
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: USUARIO_TESTE.email,
      password: USUARIO_TESTE.password
    });

    if (response.data.tokens) {
      authToken = response.data.tokens.accessToken;
      console.log('✅ Login realizado com sucesso');
      console.log(`👤 Usuário: ${response.data.user.nome}`);
      console.log(`🏢 Escritório: ${response.data.user.escritorioNome}\n`);
      return true;
    }
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data?.error || error.message);
    return false;
  }
}

// Função para verificar configuração de email
async function verificarConfiguracaoEmail() {
  console.log('2️⃣ Verificando configuração de email...');
  
  // Verificar variáveis de ambiente
  const emailConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;
  
  if (emailConfigured) {
    console.log('✅ Configuração de email detectada:');
    console.log(`📧 SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
    console.log(`👤 SMTP User: ${process.env.SMTP_USER}`);
    console.log(`🔑 SMTP Pass: ${'*'.repeat(process.env.SMTP_PASS?.length || 0)}`);
  } else {
    console.log('⚠️ Configuração de email não detectada');
    console.log('💡 Para testar email, configure as variáveis:');
    console.log('   set SMTP_HOST=smtp.gmail.com');
    console.log('   set SMTP_PORT=587');
    console.log('   set SMTP_USER=seu-email@gmail.com');
    console.log('   set SMTP_PASS=sua-senha-de-app');
  }
  
  console.log('');
  return emailConfigured;
}

// Função para enviar convite
async function enviarConvite() {
  try {
    console.log('3️⃣ Enviando convite...');
    console.log(`📧 Para: ${CONVITE_TESTE.email}`);
    console.log(`👤 Nome: ${CONVITE_TESTE.nome}`);
    console.log(`💼 Cargo: ${CONVITE_TESTE.cargo}`);
    
    const response = await axios.post(`${BASE_URL}/api/convites`, CONVITE_TESTE, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.convite) {
      const convite = response.data.convite;
      console.log('✅ Convite criado com sucesso!');
      console.log(`📬 Mensagem: ${response.data.message}`);
      console.log(`🔗 Link: ${convite.linkConvite}`);
      console.log(`📧 Email enviado: ${convite.emailEnviado ? '✅ Sim' : '❌ Não'}`);
      console.log(`🎫 Token: ${convite.token}`);
      console.log('');
      
      return {
        token: convite.token,
        linkConvite: convite.linkConvite,
        emailEnviado: convite.emailEnviado
      };
    }
  } catch (error) {
    console.log('❌ Erro ao enviar convite:', error.response?.data?.error || error.message);
    return null;
  }
}

// Função para verificar convite
async function verificarConvite(token) {
  try {
    console.log('4️⃣ Verificando convite...');
    
    const response = await axios.get(`${BASE_URL}/api/convites/${token}`);
    
    if (response.data.convite) {
      const convite = response.data.convite;
      console.log('✅ Convite válido encontrado!');
      console.log(`👤 Para: ${convite.nome} (${convite.email})`);
      console.log(`💼 Cargo: ${convite.cargo}`);
      console.log(`🏢 Escritório: ${convite.escritorio.nome}`);
      console.log(`👨‍💼 Enviado por: ${convite.enviadoPor.nome}`);
      console.log('');
      return true;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar convite:', error.response?.data?.error || error.message);
    return false;
  }
}

// Função para listar convites
async function listarConvites() {
  try {
    console.log('5️⃣ Listando convites do escritório...');
    
    const response = await axios.get(`${BASE_URL}/api/convites`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.convites) {
      const convites = response.data.convites;
      console.log(`✅ ${convites.length} convite(s) encontrado(s):`);
      
      convites.forEach((convite, index) => {
        console.log(`   ${index + 1}. ${convite.nome} (${convite.email}) - ${convite.status}`);
      });
      console.log('');
      return convites;
    }
  } catch (error) {
    console.log('❌ Erro ao listar convites:', error.response?.data?.error || error.message);
    return [];
  }
}

// Função para mostrar instruções de teste manual
function mostrarInstrucoesTeste(linkConvite, emailEnviado) {
  console.log('6️⃣ Instruções para teste manual:');
  console.log('');
  
  if (emailEnviado) {
    console.log('📧 EMAIL ENVIADO! Verifique a caixa de entrada:');
    console.log(`   📬 Email: ${CONVITE_TESTE.email}`);
    console.log('   📂 Verifique também a pasta de spam');
    console.log('   🔗 Clique no botão "Aceitar Convite" no email');
    console.log('');
  }
  
  console.log('🌐 TESTE MANUAL NO NAVEGADOR:');
  console.log(`   1. Abra: ${linkConvite}`);
  console.log('   2. Preencha uma senha (mín. 6 caracteres)');
  console.log('   3. Clique em "Aceitar Convite"');
  console.log('   4. Verifique se a conta foi criada');
  console.log('   5. Verifique se o login foi feito automaticamente');
  console.log('');
  
  console.log('✅ VERIFICAR RESULTADO:');
  console.log(`   - Acesse: ${FRONTEND_URL}/configuracoes/equipe`);
  console.log('   - Verifique se o novo membro aparece na lista');
  console.log('   - Status do convite deve mudar para "ACEITO"');
  console.log('');
}

// Função principal
async function executarTeste() {
  try {
    // 1. Login
    const loginOk = await fazerLogin();
    if (!loginOk) {
      console.log('❌ Teste interrompido: falha no login');
      return;
    }

    // 2. Verificar configuração de email
    const emailConfigured = await verificarConfiguracaoEmail();

    // 3. Enviar convite
    const conviteData = await enviarConvite();
    if (!conviteData) {
      console.log('❌ Teste interrompido: falha ao enviar convite');
      return;
    }

    // 4. Verificar convite
    const conviteValido = await verificarConvite(conviteData.token);
    if (!conviteValido) {
      console.log('❌ Teste interrompido: convite inválido');
      return;
    }

    // 5. Listar convites
    await listarConvites();

    // 6. Instruções para teste manual
    mostrarInstrucoesTeste(conviteData.linkConvite, conviteData.emailEnviado);

    // Resultado final
    console.log('🎉 ===============================================');
    console.log('   TESTE CONCLUÍDO COM SUCESSO!');
    console.log('🎉 ===============================================');
    console.log('');
    console.log('📊 RESUMO:');
    console.log(`✅ Login: OK`);
    console.log(`📧 Email configurado: ${emailConfigured ? 'Sim' : 'Não'}`);
    console.log(`✅ Convite criado: OK`);
    console.log(`📬 Email enviado: ${conviteData.emailEnviado ? 'Sim' : 'Não'}`);
    console.log(`✅ Convite válido: OK`);
    console.log('');
    
    if (emailConfigured && conviteData.emailEnviado) {
      console.log('🎯 PRÓXIMOS PASSOS:');
      console.log('1. Verifique o email na caixa de entrada');
      console.log('2. Clique no botão "Aceitar Convite"');
      console.log('3. Complete o processo de criação de conta');
      console.log('');
    } else {
      console.log('💡 PARA ATIVAR EMAIL:');
      console.log('1. Configure as variáveis SMTP_*');
      console.log('2. Reinicie o servidor backend');
      console.log('3. Execute este teste novamente');
      console.log('');
    }

  } catch (error) {
    console.log('❌ Erro geral no teste:', error.message);
  }
}

// Executar teste
executarTeste(); 