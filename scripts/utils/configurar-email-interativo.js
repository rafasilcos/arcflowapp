// ===== CONFIGURADOR INTERATIVO DE EMAIL - ARCFLOW =====

const readline = require('readline');
const { exec } = require('child_process');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 ===============================================');
console.log('   CONFIGURADOR INTERATIVO DE EMAIL - ARCFLOW');
console.log('📧 ===============================================\n');

console.log('🎯 Vou te ajudar a configurar o email em 3 minutos!\n');

// Função para fazer perguntas
function pergunta(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (resposta) => {
      resolve(resposta.trim());
    });
  });
}

// Função para executar comandos
function executarComando(comando) {
  return new Promise((resolve, reject) => {
    exec(comando, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Função principal
async function configurarEmail() {
  try {
    console.log('📋 PASSO 1: Escolha seu provedor de email\n');
    console.log('1. 📧 Gmail (Recomendado - Mais fácil)');
    console.log('2. 📧 Outlook/Hotmail');
    console.log('3. 📧 Email profissional (seu domínio)');
    console.log('4. ❌ Pular configuração (usar só links)\n');

    const opcao = await pergunta('👆 Digite o número da sua escolha (1-4): ');

    switch (opcao) {
      case '1':
        await configurarGmail();
        break;
      case '2':
        await configurarOutlook();
        break;
      case '3':
        await configurarEmailProfissional();
        break;
      case '4':
        console.log('\n⚠️ Email não configurado. O sistema funcionará apenas com links.');
        await testarSistema();
        break;
      default:
        console.log('\n❌ Opção inválida. Configurando Gmail por padrão...');
        await configurarGmail();
    }

  } catch (error) {
    console.log('\n❌ Erro durante a configuração:', error.message);
  } finally {
    rl.close();
  }
}

// Configurar Gmail
async function configurarGmail() {
  console.log('\n🚀 CONFIGURANDO GMAIL...\n');
  
  console.log('📋 Primeiro, você precisa:');
  console.log('1. ✅ Ativar verificação em duas etapas no Gmail');
  console.log('2. 🔑 Gerar uma senha de app');
  console.log('3. 📧 Ter seu email Gmail\n');

  const temVerificacao = await pergunta('✅ Você já tem verificação em duas etapas ativa? (s/n): ');
  
  if (temVerificacao.toLowerCase() !== 's') {
    console.log('\n🔗 Acesse: https://myaccount.google.com/security');
    console.log('📱 Ative a verificação em duas etapas primeiro');
    console.log('🔄 Execute este script novamente após ativar\n');
    return;
  }

  const temSenhaApp = await pergunta('🔑 Você já gerou uma senha de app? (s/n): ');
  
  if (temSenhaApp.toLowerCase() !== 's') {
    console.log('\n🔗 Acesse: https://myaccount.google.com/apppasswords');
    console.log('➕ Clique em "Gerar senha de app"');
    console.log('📧 Escolha "Email" ou "Outro" > "ArcFlow"');
    console.log('📋 Copie a senha gerada (16 caracteres)\n');
    
    await pergunta('⏳ Pressione Enter após gerar a senha de app...');
  }

  const email = await pergunta('📧 Digite seu email Gmail: ');
  const senha = await pergunta('🔑 Digite sua senha de app (16 caracteres): ');

  // Validar email
  if (!email.includes('@gmail.com')) {
    console.log('❌ Email deve ser do Gmail (@gmail.com)');
    return;
  }

  // Validar senha de app
  if (senha.length < 10) {
    console.log('❌ Senha de app deve ter pelo menos 10 caracteres');
    return;
  }

  // Configurar variáveis
  await configurarVariaveis('smtp.gmail.com', '587', email, senha);
  await testarConfiguracao();
}

// Configurar Outlook
async function configurarOutlook() {
  console.log('\n🚀 CONFIGURANDO OUTLOOK...\n');
  
  const email = await pergunta('📧 Digite seu email Outlook/Hotmail: ');
  const senha = await pergunta('🔑 Digite sua senha normal: ');

  // Validar email
  if (!email.includes('@outlook.') && !email.includes('@hotmail.') && !email.includes('@live.')) {
    console.log('❌ Email deve ser Outlook, Hotmail ou Live');
    return;
  }

  // Configurar variáveis
  await configurarVariaveis('smtp.office365.com', '587', email, senha);
  await testarConfiguracao();
}

// Configurar email profissional
async function configurarEmailProfissional() {
  console.log('\n🚀 CONFIGURANDO EMAIL PROFISSIONAL...\n');
  
  console.log('📋 Você precisa das informações SMTP do seu provedor:');
  console.log('- Host SMTP (ex: smtp.seudominio.com)');
  console.log('- Porta (geralmente 587 ou 465)');
  console.log('- Email e senha\n');

  const host = await pergunta('🌐 Digite o host SMTP: ');
  const porta = await pergunta('🔌 Digite a porta (587 ou 465): ') || '587';
  const email = await pergunta('📧 Digite seu email: ');
  const senha = await pergunta('🔑 Digite sua senha: ');

  // Configurar variáveis
  await configurarVariaveis(host, porta, email, senha);
  await testarConfiguracao();
}

// Configurar variáveis de ambiente
async function configurarVariaveis(host, porta, email, senha) {
  console.log('\n⚙️ Configurando variáveis de ambiente...\n');

  try {
    // Configurar no Windows
    await executarComando(`setx SMTP_HOST "${host}"`);
    await executarComando(`setx SMTP_PORT "${porta}"`);
    await executarComando(`setx SMTP_USER "${email}"`);
    await executarComando(`setx SMTP_PASS "${senha}"`);

    console.log('✅ Variáveis configuradas com sucesso!');
    console.log(`📧 Host: ${host}`);
    console.log(`🔌 Porta: ${porta}`);
    console.log(`👤 Email: ${email}`);
    console.log(`🔑 Senha: ${'*'.repeat(senha.length)}\n`);

    // Criar arquivo .env local também
    const envContent = `# CONFIGURAÇÃO DE EMAIL - ARCFLOW
SMTP_HOST=${host}
SMTP_PORT=${porta}
SMTP_USER=${email}
SMTP_PASS=${senha}
`;

    fs.writeFileSync('backend/.env', envContent);
    console.log('📁 Arquivo .env criado em backend/.env');

  } catch (error) {
    console.log('❌ Erro ao configurar variáveis:', error.message);
    console.log('\n🔧 Configure manualmente no PowerShell:');
    console.log(`set SMTP_HOST=${host}`);
    console.log(`set SMTP_PORT=${porta}`);
    console.log(`set SMTP_USER=${email}`);
    console.log(`set SMTP_PASS=${senha}`);
  }
}

// Testar configuração
async function testarConfiguracao() {
  console.log('\n🧪 TESTANDO CONFIGURAÇÃO...\n');

  const testar = await pergunta('🔬 Quer testar o sistema agora? (s/n): ');
  
  if (testar.toLowerCase() === 's') {
    await testarSistema();
  } else {
    console.log('\n✅ Configuração concluída!');
    console.log('🚀 Para testar depois, execute:');
    console.log('   cd backend && node server-simple.js');
    console.log('   cd frontend && npm run dev');
  }
}

// Testar sistema
async function testarSistema() {
  console.log('\n🚀 INICIANDO TESTE DO SISTEMA...\n');

  try {
    console.log('1️⃣ Iniciando backend...');
    
    // Verificar se backend existe
    if (!fs.existsSync('backend/server-simple.js')) {
      console.log('❌ Arquivo backend/server-simple.js não encontrado');
      console.log('📁 Certifique-se de estar na pasta raiz do projeto');
      return;
    }

    console.log('✅ Backend encontrado');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Abra um terminal e execute: cd backend && node server-simple.js');
    console.log('2. Abra outro terminal e execute: cd frontend && npm run dev');
    console.log('3. Acesse: http://localhost:3000/configuracoes/equipe');
    console.log('4. Teste enviando um convite para seu próprio email');
    console.log('\n🎯 Se aparecer "📧 Sistema de email configurado" = Sucesso!');

  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

// Executar configurador
console.log('🎯 Vamos começar!\n');
configurarEmail(); 