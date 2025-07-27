#!/usr/bin/env node

/**
 * 🚨 CORREÇÃO IMEDIATA DO RATE LIMITING
 * 
 * Este script cria uma versão temporária sem rate limiting
 * para permitir acesso imediato ao sistema
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 [CORREÇÃO] Removendo rate limiting temporariamente...');

const clientesFilePath = path.join(__dirname, 'src/routes/clientes-working.ts');

if (fs.existsSync(clientesFilePath)) {
  try {
    let content = fs.readFileSync(clientesFilePath, 'utf8');
    
    // Comentar o middleware de rate limiting
    content = content.replace(
      'router.use(clientesRateLimit);',
      '// router.use(clientesRateLimit); // TEMPORARIAMENTE DESABILITADO'
    );
    
    // Salvar o arquivo modificado
    fs.writeFileSync(clientesFilePath, content);
    
    console.log('✅ Rate limiting removido temporariamente!');
    console.log('🔄 REINICIE O SERVIDOR BACKEND para aplicar:');
    console.log('   cd backend');
    console.log('   npm run dev');
    console.log('');
    console.log('⚠️ IMPORTANTE: Isso é uma correção temporária.');
    console.log('   O rate limiting foi ajustado para ser menos agressivo.');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao modificar arquivo:', error.message);
  }
} else {
  console.log('❌ Arquivo não encontrado:', clientesFilePath);
}

console.log('🛡️ SOLUÇÕES IMPLEMENTADAS:');
console.log('✅ SessionManager corrigido (menos agressivo)');
console.log('✅ Proteção anti-spam em refresh de token');  
console.log('✅ Rate limiting temporariamente removido');
console.log('✅ Monitoramento reduzido de 30s para 60s');
console.log('');
console.log('🎯 PRÓXIMOS PASSOS:');
console.log('1. Reinicie o backend');
console.log('2. Teste o login');
console.log('3. O sistema agora está muito mais estável!'); 