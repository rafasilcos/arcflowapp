const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO PROBLEMAS RESTANTES DE TIPOS UUID\n');

// Lista de padrões problemáticos que ainda podem existir
const padroesProblemáticos = [
  {
    nome: 'JOIN sem cast entre briefings.cliente_id e clientes.id',
    regex: /LEFT JOIN clientes.*ON.*cliente_id\s*=\s*c\.id(?!\s*::)/g,
    correcao: 'Adicionar ::text no cliente_id'
  },
  {
    nome: 'JOIN sem cast entre briefings.responsavel_id e users.id',
    regex: /LEFT JOIN users.*ON.*responsavel_id\s*=\s*u\.id(?!\s*::)/g,
    correcao: 'Adicionar ::text no responsavel_id'
  },
  {
    nome: 'JOIN sem cast entre orcamentos.cliente_id e clientes.id',
    regex: /LEFT JOIN clientes.*ON.*o\.cliente_id\s*=\s*c\.id(?!\s*::)/g,
    correcao: 'Adicionar ::text no o.cliente_id'
  },
  {
    nome: 'JOIN sem cast entre orcamentos.responsavel_id e users.id',
    regex: /LEFT JOIN users.*ON.*o\.responsavel_id\s*=\s*u\.id(?!\s*::)/g,
    correcao: 'Adicionar ::text no o.responsavel_id'
  }
];

// Arquivos principais para verificar
const arquivosParaVerificar = [
  'server-simple.js',
  'server-working.js', 
  'server-complete.js',
  'dist/routes/orcamentos.js',
  'dist/routes/briefings.js'
];

let problemasEncontrados = 0;

console.log('📁 VERIFICANDO ARQUIVOS PRINCIPAIS:\n');

arquivosParaVerificar.forEach(arquivo => {
  const filePath = path.join(__dirname, arquivo);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${arquivo} - Arquivo não encontrado`);
    return;
  }
  
  const conteudo = fs.readFileSync(filePath, 'utf8');
  let problemasNoArquivo = 0;
  
  console.log(`🔍 ${arquivo}:`);
  
  padroesProblemáticos.forEach(padrao => {
    const matches = conteudo.match(padrao.regex);
    if (matches && matches.length > 0) {
      console.log(`   ❌ ${padrao.nome}: ${matches.length} ocorrência(s)`);
      console.log(`      Correção: ${padrao.correcao}`);
      problemasNoArquivo += matches.length;
      problemasEncontrados += matches.length;
    }
  });
  
  if (problemasNoArquivo === 0) {
    console.log('   ✅ Nenhum problema encontrado');
  }
  
  console.log('');
});

console.log('📊 RESUMO FINAL:');
if (problemasEncontrados === 0) {
  console.log('✅ Nenhum problema de tipos UUID encontrado!');
  console.log('🎉 Todas as correções foram aplicadas com sucesso!');
} else {
  console.log(`❌ ${problemasEncontrados} problema(s) ainda precisam ser corrigidos`);
  console.log('🔧 Execute as correções sugeridas acima');
}

console.log('\n🚀 Verificação concluída!');