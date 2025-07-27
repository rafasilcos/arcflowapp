const { createAuthTables } = require('./src/config/database-simple.ts');

async function main() {
  console.log('🚀 Iniciando criação das tabelas de autenticação...');
  
  try {
    await createAuthTables();
    console.log('✅ Sistema de autenticação configurado com sucesso!');
    console.log('📋 Tabelas criadas:');
    console.log('   - plans (planos)');
    console.log('   - escritorios (tenants)');
    console.log('   - users (usuários)');
    console.log('   - refresh_tokens');
    console.log('   - payments (pagamentos)');
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('   1. Implementar rotas de autenticação');
    console.log('   2. Criar sistema de registro');
    console.log('   3. Implementar JWT tokens');
    console.log('   4. Conectar frontend');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    process.exit(1);
  }
}

main(); 