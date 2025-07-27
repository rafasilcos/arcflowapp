// ===== SCRIPT PARA LIMPAR E INICIAR SERVIDOR ARCFLOW =====

const { exec, spawn } = require('child_process');

console.log('🧹 ===============================================');
console.log('   LIMPANDO E INICIANDO SERVIDOR ARCFLOW');
console.log('🧹 ===============================================\n');

console.log('🔄 Finalizando processos Node.js anteriores...');

// Finalizar todos os processos Node.js
exec('taskkill /f /im node.exe', (error, stdout, stderr) => {
  if (error && !error.message.includes('não foi possível localizar')) {
    console.log('⚠️ Aviso ao finalizar processos:', error.message);
  }
  
  console.log('✅ Processos finalizados');
  console.log('⏳ Aguardando 2 segundos...\n');
  
  // Aguardar um pouco e iniciar o servidor
  setTimeout(() => {
    console.log('🚀 Iniciando servidor ArcFlow...\n');
    
    // Iniciar o servidor
    const serverProcess = spawn('node', ['server-simple.js'], {
      stdio: 'inherit',
      cwd: __dirname
    });

    // Capturar Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n🛑 Encerrando servidor...');
      serverProcess.kill('SIGINT');
      process.exit(0);
    });

    // Capturar erros
    serverProcess.on('error', (error) => {
      console.log('\n❌ Erro ao iniciar servidor:', error.message);
      process.exit(1);
    });

    // Mostrar informações após iniciar
    setTimeout(() => {
      console.log('\n📊 SERVIDOR ARCFLOW FUNCIONANDO:');
      console.log('🌐 Backend: http://localhost:3001');
      console.log('🔍 Health: http://localhost:3001/health');
      console.log('🔐 Login: http://localhost:3001/api/auth/login');
      console.log('👥 Usuários: http://localhost:3001/api/users');
      console.log('📧 Convites: http://localhost:3001/api/convites');
      console.log('\n💡 Para parar: Ctrl+C');
    }, 3000);

  }, 2000);
}); 