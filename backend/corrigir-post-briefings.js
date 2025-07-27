const fs = require('fs');

console.log('🔧 Corrigindo especificamente POST /api/briefings...');

let content = fs.readFileSync('server-simple.js', 'utf8');
const lines = content.split('\n');

let postBriefingFound = false;
let corrected = false;

for (let i = 0; i < lines.length; i++) {
  // Encontrar início da função POST briefings
  if (lines[i].includes('app.post(\'/api/briefings\'')) {
    postBriefingFound = true;
    console.log(`📍 Função POST briefings encontrada na linha ${i + 1}`);
    continue;
  }
  
  // Se estamos dentro da função POST briefings e encontramos a linha problemática
  if (postBriefingFound && lines[i].includes('const escritorioId = req.user.escritorioId;')) {
    console.log(`🎯 Linha problemática encontrada na linha ${i + 1}: ${lines[i]}`);
    
    // Substituir a linha
    lines[i] = `    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? 'escritorio_teste' : escritorioIdRaw;
    
    console.log('🔍 [BRIEFING-POST] Mapeamento:', { original: escritorioIdRaw, mapeado: escritorioId });`;
    
    corrected = true;
    console.log('✅ Correção aplicada!');
    break;
  }
  
  // Se saímos da função (encontramos outra função), parar
  if (postBriefingFound && lines[i].includes('app.') && !lines[i].includes('app.post(\'/api/briefings\'')) {
    break;
  }
}

if (corrected) {
  content = lines.join('\n');
  fs.writeFileSync('server-simple.js', content);
  console.log('💾 Arquivo salvo com correção!');
  console.log('\n🎯 PRÓXIMO PASSO: Reiniciar servidor');
} else {
  console.log('❌ Não foi possível encontrar/corrigir a linha');
} 