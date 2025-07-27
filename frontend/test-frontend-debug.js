/**
 * 🔍 DEBUG RÁPIDO DO FRONTEND
 * Verificar se o problema está no carregamento dos dados
 */

console.log('🔍 INSTRUÇÕES PARA DEBUG DO FRONTEND:');
console.log('=====================================\n');

console.log('1. 📱 ABRA O NAVEGADOR em: http://localhost:3000/orcamentos/66');
console.log('2. 🔧 ABRA O CONSOLE DO NAVEGADOR (F12)');
console.log('3. 👀 PROCURE POR ESTAS MENSAGENS:');
console.log('   - "🔍 Carregando dados do orçamento: 66"');
console.log('   - "✅ Dados carregados dinamicamente"');
console.log('   - "✅ Usando dados REAIS do banco"');

console.log('\n❌ SE VOCÊ VER ERROS:');
console.log('   - Erro 401: Token expirado (normal, faz login automático)');
console.log('   - Erro 404: Orçamento não encontrado');
console.log('   - Erro de CORS: Problema no backend');
console.log('   - Erro de hook: Problema no useDisciplinas');

console.log('\n✅ SE ESTIVER FUNCIONANDO:');
console.log('   - Página carrega com dados corretos');
console.log('   - Nome: "Orçamento Inteligente - Casa Florianopolis"');
console.log('   - Cliente: "Ana Paula SIlva"');
console.log('   - Valor: R$ 18.000,00');
console.log('   - Cronograma com 8 fases');
console.log('   - TODOS os entregáveis são mostrados');

console.log('\n🚨 SE NÃO ESTIVER FUNCIONANDO:');
console.log('   - Copie os erros do console');
console.log('   - Verifique se o backend está rodando na porta 3001');
console.log('   - Verifique se o frontend está rodando na porta 3000');

console.log('\n📋 CHECKLIST:');
console.log('   □ Backend rodando: http://localhost:3001');
console.log('   □ Frontend rodando: http://localhost:3000');
console.log('   □ Orçamento 66 existe no banco');
console.log('   □ Login funcionando');
console.log('   □ API retornando dados');

console.log('\n🎯 TESTE AGORA: http://localhost:3000/orcamentos/66');