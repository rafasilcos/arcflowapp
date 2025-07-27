// ===== SCRIPT ROBUSTO PARA INICIAR SERVIDOR ARCFLOW =====

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ===============================================');
console.log('   INICIANDO SERVIDOR ARCFLOW BACKEND');
console.log('🚀 ===============================================\n');

// Verificar se o arquivo do servidor existe
const serverFile = path.join(__dirname, 'server-simple.js');

if (!fs.existsSync(serverFile)) {
  console.log('❌ Erro: Arquivo server-simple.js não encontrado!');
  console.log('📁 Certifique-se de estar na pasta backend');
  process.exit(1);
}

console.log('✅ Arquivo do servidor encontrado');
console.log('📁 Caminho:', serverFile);

// Verificar variáveis de ambiente de email
console.log('\n📧 Verificando configuração de email...');
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('✅ Email configurado:');
  console.log(`   📧 Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
  console.log(`   👤 User: ${process.env.SMTP_USER}`);
  console.log(`   🔑 Pass: ${'*'.repeat(process.env.SMTP_PASS.length)}`);
} else {
  console.log('⚠️ Email não configurado (sistema funcionará apenas com links)');
}

// Verificar se a porta está livre
const net = require('net');
const PORT = 3001;

function verificarPorta() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(PORT, (err) => {
      if (err) {
        server.close();
        reject(err);
      } else {
        server.close(() => {
          resolve(true);
        });
      }
    });
    
    server.on('error', (err) => {
      reject(err);
    });
  });
}

async function verificarEIniciar() {
  try {
    await verificarPorta();
    console.log(`✅ Porta ${PORT} disponível`);
    iniciarServidor();
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`❌ Porta ${PORT} já está em uso!`);
      console.log('🔧 Soluções:');
      console.log('   1. Feche outros servidores ArcFlow');
      console.log('   2. Execute: taskkill /f /im node.exe');
      console.log('   3. Aguarde alguns segundos e tente novamente');
      console.log('\n🔄 Tentando finalizar processos automaticamente...');
      
      try {
        const { exec } = require('child_process');
        exec('taskkill /f /im node.exe', (err, stdout, stderr) => {
          if (!err) {
            console.log('✅ Processos Node.js finalizados');
            console.log('⏳ Aguardando 3 segundos...');
            setTimeout(() => {
              console.log('🔄 Tentando iniciar novamente...');
              verificarEIniciar();
            }, 3000);
          } else {
            console.log('⚠️ Não foi possível finalizar automaticamente');
            console.log('🔧 Execute manualmente: taskkill /f /im node.exe');
            process.exit(1);
          }
        });
      } catch (killError) {
        console.log('⚠️ Erro ao tentar finalizar processos:', killError.message);
        process.exit(1);
      }
    } else {
      console.log('❌ Erro ao verificar porta:', error.message);
      process.exit(1);
    }
  }
}

verificarEIniciar();

function iniciarServidor() {
  console.log('\n🚀 Iniciando servidor...\n');
  
  // Iniciar o servidor
  const serverProcess = spawn('node', ['server-simple.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  // Capturar erros
  serverProcess.on('error', (error) => {
    console.log('\n❌ Erro ao iniciar servidor:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o Node.js está instalado');
    console.log('2. Execute: npm install');
    console.log('3. Reinicie o terminal como administrador');
  });

  // Capturar saída
  serverProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log(`\n❌ Servidor encerrou com código: ${code}`);
      console.log('\n🔧 Para reiniciar, execute novamente:');
      console.log('   node iniciar-servidor.js');
      console.log('   ou');
      console.log('   npm run dev');
    }
  });

  // Capturar Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Encerrando servidor...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });

  // Mostrar informações úteis
  setTimeout(() => {
    console.log('\n📊 INFORMAÇÕES DO SERVIDOR:');
    console.log('🌐 Backend: http://localhost:3001');
    console.log('🔍 Health: http://localhost:3001/health');
    console.log('🔐 Auth: http://localhost:3001/api/auth/login');
    console.log('👥 Users: http://localhost:3001/api/users');
    console.log('📧 Convites: http://localhost:3001/api/convites');
    console.log('\n💡 Para parar o servidor: Ctrl+C');
    console.log('🔄 Para reiniciar: npm run dev');
  }, 2000);
} 