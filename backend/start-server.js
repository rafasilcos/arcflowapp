const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando ArcFlow Backend Server...');

// Usar o arquivo server.ts compilado ou diretamente com ts-node
const serverFile = path.join(__dirname, 'src', 'server.ts');

// Iniciar servidor com ts-node
const server = spawn('npx', ['ts-node', serverFile], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
});

server.on('exit', (code) => {
  console.log(`🔄 Servidor encerrado com código: ${code}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando servidor...');
  server.kill('SIGTERM');
  process.exit(0);
}); 