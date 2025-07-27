const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 INICIANDO ARCFLOW SISTEMA COMPLETO...\n');

// Função para iniciar processo
function startProcess(name, command, args, cwd) {
  console.log(`📦 Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: cwd
  });

  process.on('error', (error) => {
    console.error(`❌ Erro ao iniciar ${name}:`, error);
  });

  process.on('exit', (code) => {
    console.log(`🔄 ${name} encerrado com código: ${code}`);
  });

  return process;
}

// Iniciar Backend
const backend = startProcess(
  'Backend Server',
  'node',
  ['start-server.js'],
  path.join(__dirname, 'backend')
);

// Aguardar 3 segundos e iniciar Frontend
setTimeout(() => {
  const frontend = startProcess(
    'Frontend Server',
    'node',
    ['start-frontend.js'],
    path.join(__dirname, 'frontend')
  );

  console.log('\n🎯 ARCFLOW INICIADO COM SUCESSO!');
  console.log('📊 Backend: http://localhost:3001');
  console.log('🎨 Frontend: http://localhost:3000');
  console.log('📋 Dashboard: http://localhost:3000/projetos/[id]/dashboard');
  console.log('\n⚡ Pressione Ctrl+C para parar todos os serviços\n');

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando ArcFlow...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Encerrando ArcFlow...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    process.exit(0);
  });

}, 3000); 