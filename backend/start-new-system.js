/**
 * 🧪 SCRIPT DE TESTE PARA O NOVO SISTEMA
 * 
 * Use este script para testar o novo sistema sem afetar o atual
 * COMANDO: node start-new-system.js
 */

console.log('🚀 Iniciando NOVO sistema ArcFlow (TESTE)...');
console.log('⚠️  ATENÇÃO: Este é o sistema novo em desenvolvimento');
console.log('📍 Para usar o sistema atual, use: npm start');
console.log('');

// Verificar se todos os arquivos necessários existem
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'app.js',
  'server.js',
  'config/database.js',
  'config/cors.js',
  'config/security.js',
  'config/rateLimiting.js',
  'middleware/errorHandler.js',
  'middleware/requestLogger.js',
  'routes/index.js',
  'routes/auth.js',
  'controllers/authController.js',
  'services/authService.js'
];

console.log('🔍 Verificando arquivos necessários...');
let missingFiles = [];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  } else {
    console.log(`✅ ${file}`);
  }
}

if (missingFiles.length > 0) {
  console.log('\n❌ ARQUIVOS FALTANDO:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\n🚨 SISTEMA NOVO NÃO ESTÁ COMPLETO AINDA!');
  console.log('📋 Use o sistema atual: npm start');
  process.exit(1);
}

console.log('\n✅ Todos os arquivos encontrados!');
console.log('🚀 Iniciando novo sistema na porta 3002 (para não conflitar)...');

// Definir porta diferente para teste
process.env.PORT = 3002;

// Iniciar novo sistema
try {
  require('./server.js');
} catch (error) {
  console.error('❌ Erro ao iniciar novo sistema:', error.message);
  console.log('\n📋 Use o sistema atual: npm start');
  process.exit(1);
}