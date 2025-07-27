const fs = require('fs');

console.log('🔧 Corrigindo responsavelId na API briefings...');

let content = fs.readFileSync('server-simple.js', 'utf8');

// Encontrar e substituir a linha específica do responsavelId
const oldLine = '      responsavelId || userId, // Se não especificado, usa o usuário atual';
const newLine = '      (responsavelId === "user_admin_teste") ? "user_admin_teste" : (responsavelId || userId), // Mapear responsável UUID';

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  console.log('✅ Linha responsavelId corrigida!');
} else {
  console.log('⚠️ Linha não encontrada. Tentando padrão alternativo...');
  
  // Tentar padrão mais simples
  const oldSimple = 'responsavelId || userId,';
  const newSimple = '(responsavelId === "user_admin_teste") ? "user_admin_teste" : (responsavelId || userId),';
  
  if (content.includes(oldSimple)) {
    content = content.replace(oldSimple, newSimple);
    console.log('✅ Padrão alternativo aplicado!');
  } else {
    console.log('❌ Não foi possível encontrar a linha');
  }
}

// Salvar arquivo
fs.writeFileSync('server-simple.js', content);
console.log('💾 Arquivo salvo!');

console.log('\n🎯 PRÓXIMO PASSO: Reiniciar servidor e testar'); 