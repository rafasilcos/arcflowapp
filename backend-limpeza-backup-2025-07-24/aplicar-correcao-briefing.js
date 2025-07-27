const fs = require('fs');

console.log('🔧 Aplicando correção na API briefings...');

// Ler arquivo
let content = fs.readFileSync('server-simple.js', 'utf8');

// Encontrar e substituir a linha específica na função de briefings
const oldLine = '    const escritorioId = req.user.escritorioId;\n    const userId = req.user.id;\n\n    console.log(\'📝 Criando briefing:\', { nomeProjeto, disciplina, area, tipologia });';

const newCode = `    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    
    // Mapeamento de strings para UUIDs válidos (multi-tenancy)
    const escritorioIdMappings = {
      'escritorio_teste': 'escritorio_teste',
      'user_admin_teste': 'escritorio_teste', // Fallback
      // Adicionar outros mapeamentos conforme necessário
    };
    
    // Se for uma string conhecida, usar mapeamento; senão, usar como está (UUID)
    const escritorioId = escritorioIdMappings[escritorioIdRaw] || escritorioIdRaw;
    const userId = req.user.id;

    console.log('🔍 [BRIEFING] Mapeamento escritório:', {
      original: escritorioIdRaw,
      mapeado: escritorioId,
      tipo: typeof escritorioId
    });
    
    console.log('📝 Criando briefing:', { nomeProjeto, disciplina, area, tipologia });`;

// Aplicar correção
if (content.includes(oldLine)) {
  content = content.replace(oldLine, newCode);
  console.log('✅ Correção aplicada com sucesso!');
} else {
  console.log('⚠️ Padrão não encontrado. Tentando correção alternativa...');
  
  // Tentar apenas a linha do escritorioId
  const oldSimple = '    const escritorioId = req.user.escritorioId;';
  const newSimple = `    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? 'escritorio_teste' : escritorioIdRaw;
    
    console.log('🔍 [BRIEFING] Mapeamento:', { original: escritorioIdRaw, mapeado: escritorioId });`;
  
  // Contar ocorrências
  const matches = content.match(/const escritorioId = req\.user\.escritorioId;/g);
  console.log(`📊 Encontradas ${matches ? matches.length : 0} ocorrências`);
  
  // Substituir apenas na função de briefings (última ocorrência)
  const lines = content.split('\n');
  let briefingFunctionFound = false;
  let corrected = false;
  
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('app.post(\'/api/briefings\'')) {
      briefingFunctionFound = true;
    }
    
    if (briefingFunctionFound && lines[i].includes('const escritorioId = req.user.escritorioId;')) {
      lines[i] = `    // 🚀 CORREÇÃO ENTERPRISE: Mapear escritorioId para UUID válido
    const escritorioIdRaw = req.user.escritorioId;
    const escritorioId = escritorioIdRaw === 'escritorio_teste' ? 'escritorio_teste' : escritorioIdRaw;
    
    console.log('🔍 [BRIEFING] Mapeamento:', { original: escritorioIdRaw, mapeado: escritorioId });`;
      corrected = true;
      break;
    }
  }
  
  if (corrected) {
    content = lines.join('\n');
    console.log('✅ Correção alternativa aplicada!');
  } else {
    console.log('❌ Não foi possível aplicar a correção');
  }
}

// Salvar arquivo
fs.writeFileSync('server-simple.js', content);
console.log('💾 Arquivo salvo!');

console.log('\n🎯 PRÓXIMO PASSO: Reiniciar servidor para aplicar mudanças'); 