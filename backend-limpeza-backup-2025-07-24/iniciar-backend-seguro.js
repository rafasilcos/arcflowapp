// ===== SCRIPT SEGURO PARA INICIAR BACKEND ARCFLOW =====

const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');

console.log('🚀 ===============================================');
console.log('   INICIANDO BACKEND ARCFLOW (MODO SEGURO)');
console.log('🚀 ===============================================\n');

// Verificar se arquivo existe
if (!fs.existsSync('server-simple.js')) {
  console.log('❌ Erro: server-simple.js não encontrado!');
  console.log('📁 Execute este comando na pasta backend');
  process.exit(1);
}

// Verificar configuração de email
console.log('📧 Verificando email...');
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('✅ Email configurado');
} else {
  console.log('⚠️ Email não configurado (funcionará com links)');
}

// Função para verificar se porta está livre
function verificarPorta(porta) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(porta, () => {
      server.close(() => resolve(true));
    });
    
    server.on('error', () => resolve(false));
  });
}

// Função para encontrar processo na porta específica
function encontrarProcessoNaPorta(porta) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    
    // Comando para encontrar processo específico na porta
    exec(`netstat -ano | findstr :${porta}`, (error, stdout) => {
      if (error || !stdout) {
        resolve(null);
        return;
      }
      
      const linhas = stdout.split('\n');
      for (const linha of linhas) {
        if (linha.includes('LISTENING')) {
          const partes = linha.trim().split(/\s+/);
          const pid = partes[partes.length - 1];
          if (pid && pid !== '0') {
            resolve(pid);
            return;
          }
        }
      }
      resolve(null);
    });
  });
}

// Função para finalizar processo específico
function finalizarProcesso(pid) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    
    exec(`taskkill /f /pid ${pid}`, (error) => {
      resolve(!error);
    });
  });
}

// Função principal
async function iniciarServidor() {
  console.log('\n🔍 Verificando porta 3001...');
  
  const portaLivre = await verificarPorta(3001);
  
  if (!portaLivre) {
    console.log('⚠️ Porta 3001 ocupada');
    console.log('🔍 Procurando processo específico...');
    
    const pid = await encontrarProcessoNaPorta(3001);
    
    if (pid) {
      console.log(`🎯 Encontrado processo ${pid} na porta 3001`);
      console.log('🔄 Finalizando apenas este processo...');
      
      const sucesso = await finalizarProcesso(pid);
      
      if (sucesso) {
        console.log('✅ Processo finalizado com sucesso');
        
        // Aguardar um pouco
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const agora = await verificarPorta(3001);
        if (!agora) {
          console.log('❌ Porta ainda ocupada. Tente manualmente:');
          console.log(`   taskkill /f /pid ${pid}`);
          process.exit(1);
        }
      } else {
        console.log('❌ Não foi possível finalizar o processo');
        console.log('🔧 Execute manualmente:');
        console.log(`   taskkill /f /pid ${pid}`);
        process.exit(1);
      }
    } else {
      console.log('❌ Não foi possível identificar o processo');
      console.log('🔧 Tente manualmente:');
      console.log('   1. Feche outros servidores ArcFlow');
      console.log('   2. Ou use uma porta diferente');
      process.exit(1);
    }
  } else {
    console.log('✅ Porta 3001 disponível');
  }
  
  console.log('\n🚀 Iniciando servidor ArcFlow...\n');
  
  // Iniciar servidor
  const serverProcess = spawn('node', ['server-simple.js'], {
    stdio: 'inherit'
  });
  
  // Tratar encerramento
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  // Tratar erros
  serverProcess.on('error', (error) => {
    console.log('\n❌ Erro:', error.message);
    process.exit(1);
  });
  
  // Mostrar informações após iniciar
  setTimeout(() => {
    console.log('\n📊 BACKEND ARCFLOW FUNCIONANDO:');
    console.log('🌐 http://localhost:3001');
    console.log('🔍 http://localhost:3001/health');
    console.log('🔐 http://localhost:3001/api/auth/login');
    console.log('\n💡 Para parar: Ctrl+C');
    console.log('🔄 Para frontend: cd ../frontend && npm run dev');
  }, 3000);
}

// Executar
iniciarServidor(); 