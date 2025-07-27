const { spawn } = require('child_process');

console.log('🎨 Iniciando ArcFlow Frontend...');

// Iniciar Next.js dev server
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

frontend.on('error', (error) => {
  console.error('❌ Erro ao iniciar frontend:', error);
});

frontend.on('exit', (code) => {
  console.log(`🔄 Frontend encerrado com código: ${code}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando frontend...');
  frontend.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Encerrando frontend...');
  frontend.kill('SIGTERM');
  process.exit(0);
}); 