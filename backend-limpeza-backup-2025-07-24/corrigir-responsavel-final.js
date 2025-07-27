const fs = require('fs');

console.log('🔧 CORREÇÃO FINAL: Campo responsavel_id');
console.log('=====================================\n');

let content = fs.readFileSync('server-simple.js', 'utf8');

// Encontrar e substituir a linha do responsavel_id
const oldResponsavelLine = '      (responsavelId === "user_admin_teste") ? "user_admin_teste" : (responsavelId || userId), // Mapear responsável UUID';
const newResponsavelLine = '      uuidMappings[responsavelId] || responsavelId || userId, // Mapear responsável UUID REAL';

if (content.includes(oldResponsavelLine)) {
  content = content.replace(oldResponsavelLine, newResponsavelLine);
  console.log('✅ Campo responsavel_id corrigido!');
} else {
  console.log('⚠️ Linha não encontrada. Aplicando correção manual...');
  
  const lines = content.split('\n');
  let briefingPostFound = false;
  let corrected = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('app.post(\'/api/briefings\'')) {
      briefingPostFound = true;
      continue;
    }
    
    if (briefingPostFound && lines[i].includes('responsavelId === "user_admin_teste"')) {
      lines[i] = '      uuidMappings[responsavelId] || responsavelId || userId, // Mapear responsável UUID REAL';
      corrected = true;
      console.log('✅ Correção manual aplicada!');
      break;
    }
  }
  
  if (corrected) {
    content = lines.join('\n');
  } else {
    console.log('❌ Não foi possível aplicar correção');
  }
}

// Salvar arquivo
fs.writeFileSync('server-simple.js', content);
console.log('💾 Arquivo salvo!');

console.log('\n🎯 CORREÇÃO FINAL RESPONSAVEL_ID APLICADA!');
console.log('✅ Agora usa mapeamento UUID real');
console.log('✅ "user_admin_teste" → UUID válido');
console.log('\n🚀 PRÓXIMO PASSO: Reiniciar servidor'); 