// Debug usando a mesma configuração do sistema
console.log('🔍 Testando conexão com banco e briefing...');

// Verificar se há variáveis de ambiente ou usar SQLite
const isDev = process.env.NODE_ENV !== 'production';

// Configuração flexível - tenta encontrar o banco correto
let dbConfig = {
  url: "file:./dev.db"  // SQLite como fallback
};

// Se houver DATABASE_URL, usa ela
if (process.env.DATABASE_URL) {
  dbConfig.url = process.env.DATABASE_URL;
  console.log('✅ Usando DATABASE_URL do ambiente');
} else {
  console.log('⚠️ DATABASE_URL não encontrada, usando SQLite local');
}

console.log('📊 Configuração do banco:', dbConfig.url.substring(0, 20) + '...');

// Tentar conectar usando diferentes métodos
async function debugConexao() {
  try {
    // Método 1: Testar se o servidor está recebendo a requisição
    console.log('\n🌐 Testando se o servidor está respondendo...');
    
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch('http://localhost:3001/health');
      const health = await response.json();
      console.log('✅ Servidor respondendo:', health);
    } catch (error) {
      console.log('❌ Servidor não está respondendo:', error.message);
      return;
    }

    // Método 2: Testar rota de briefings
    console.log('\n📋 Testando rota de briefings...');
    
    try {
      const response = await fetch('http://localhost:3001/api/briefings', {
        headers: {
          'Authorization': 'Bearer token_teste'
        }
      });
      
      console.log('📊 Status da rota briefings:', response.status);
      
      if (response.status === 401) {
        console.log('⚠️ Erro 401 - Problema de autenticação (normal)');
      } else if (response.status === 404) {
        console.log('❌ Erro 404 - Rota não encontrada');
      } else {
        const data = await response.text();
        console.log('📝 Resposta:', data.substring(0, 200));
      }
    } catch (error) {
      console.log('❌ Erro ao testar rota:', error.message);
    }

    // Método 3: Testar rota específica do briefing
    console.log('\n🎯 Testando rota específica do briefing...');
    
    try {
      const briefingId = '9185d1ae-827a-4efb-984b-7eacf47559d9';
      const response = await fetch(`http://localhost:3001/api/briefings/${briefingId}`, {
        headers: {
          'Authorization': 'Bearer token_teste'
        }
      });
      
      console.log('📊 Status da rota específica:', response.status);
      
      if (response.status === 404) {
        console.log('❌ Briefing não encontrado - problema confirmado');
      } else if (response.status === 401) {
        console.log('⚠️ Erro de autenticação');
      } else {
        const data = await response.text();
        console.log('📝 Resposta:', data.substring(0, 200));
      }
    } catch (error) {
      console.log('❌ Erro na rota específica:', error.message);
    }

    // Método 4: Listar rotas disponíveis
    console.log('\n🗺️ Testando rotas disponíveis...');
    
    const rotasParaTestar = [
      '/api/health',
      '/api/auth/status',
      '/health'
    ];
    
    for (const rota of rotasParaTestar) {
      try {
        const response = await fetch(`http://localhost:3001${rota}`);
        console.log(`📍 ${rota}: Status ${response.status}`);
      } catch (error) {
        console.log(`📍 ${rota}: Erro - ${error.message}`);
      }
    }

    console.log('\n🔧 DIAGNÓSTICO FINAL:');
    console.log('1. Verifique se o backend está rodando: npm run dev');
    console.log('2. Verifique se há briefings no banco de dados');
    console.log('3. Verifique se o token de autenticação está correto');
    console.log('4. Considere criar dados de teste');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

debugConexao(); 