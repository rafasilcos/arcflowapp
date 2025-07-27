const fs = require('fs');

try {
  const serverContent = fs.readFileSync('server-simple.js', 'utf8');
  
  // Encontrar a query INSERT
  const insertMatch = serverContent.match(/INSERT INTO clientes \(([\s\S]*?)\)\s*VALUES \(([\s\S]*?)\)/);
  
  if (insertMatch) {
    const columnsText = insertMatch[1];
    const valuesText = insertMatch[2];
    
    console.log('📊 ANÁLISE DA QUERY INSERT:');
    console.log('='.repeat(60));
    
    // Extrair colunas
    const columns = columnsText
      .split(',')
      .map(c => c.trim().replace(/"/g, '').replace(/\s+/g, ' '))
      .filter(c => c.length > 0);
    
    // Extrair valores (placeholders e funções)
    const values = valuesText
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
    
    console.log(`🔢 TOTAL DE COLUNAS: ${columns.length}`);
    console.log(`🔢 TOTAL DE VALORES: ${values.length}`);
    console.log('');
    
    if (columns.length !== values.length) {
      console.log('❌ ERRO: Número de colunas não confere com número de valores!');
    } else {
      console.log('✅ Número de colunas e valores confere');
    }
    
    console.log('');
    console.log('🗂️ COLUNAS DA QUERY:');
    columns.forEach((col, i) => {
      console.log(`${(i+1).toString().padStart(2, '0')}. ${col}`);
    });
    
    console.log('');
    console.log('🔣 VALORES DA QUERY:');
    values.forEach((val, i) => {
      console.log(`${(i+1).toString().padStart(2, '0')}. ${val}`);
    });
    
    console.log('');
    console.log('🔍 CAMPOS DE ENDEREÇO NA QUERY:');
    const enderecoFields = columns.filter(col => col.includes('endereco'));
    if (enderecoFields.length > 0) {
      enderecoFields.forEach(field => {
        const index = columns.indexOf(field);
        console.log(`  ✅ ${field} -> ${values[index]}`);
      });
    } else {
      console.log('  ❌ Nenhum campo de endereço encontrado!');
    }
    
  } else {
    console.log('❌ Query INSERT não encontrada no arquivo!');
  }
  
} catch (error) {
  console.error('❌ Erro ao analisar arquivo:', error.message);
} 