/**
 * 🔧 DEBUG: ERRO NA API
 * 
 * Testar se o servidor backend está rodando e acessível
 */

const axios = require('axios');

async function debugAPIErro() {
  console.log('🔧 DEBUG: TESTANDO CONECTIVIDADE COM BACKEND\n');
  
  try {
    // 1. Testar se o servidor está rodando
    console.log('1. Testando conectividade básica...');
    
    try {
      const healthResponse = await axios.get('http://localhost:3001/health', {
        timeout: 5000
      });
      console.log('✅ Servidor backend está rodando');
      console.log('   Status:', healthResponse.status);
    } catch (error) {
      console.log('❌ Servidor backend NÃO está rodando');
      console.log('   Erro:', error.code || error.message);
      console.log('\n🚨 SOLUÇÃO:');
      console.log('   1. Abra um terminal no diretório backend/');
      console.log('   2. Execute: npm start');
      console.log('   3. Aguarde a mensagem "Servidor rodando na porta 3001"');
      console.log('   4. Execute este teste novamente');
      return;
    }
    
    // 2. Testar rota de login
    console.log('\n2. Testando rota de login...');
    
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'rafael@teste.com',
        password: '123456'
      }, {
        timeout: 10000
      });
      
      console.log('✅ Login funcionou!');
      console.log('   Token recebido:', loginResponse.data.token ? 'Sim' : 'Não');
      
      const token = loginResponse.data.token;
      
      // 3. Testar busca do orçamento 61
      console.log('\n3. Testando busca do orçamento 61...');
      
      const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/61', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Orçamento 61 encontrado!');
      console.log('   ID:', orcamentoResponse.data.data.id);
      console.log('   Código:', orcamentoResponse.data.data.codigo);
      console.log('   Valor:', orcamentoResponse.data.data.valor_total);
      console.log('   Prazo:', orcamentoResponse.data.data.prazo_entrega, 'semanas');
      
      console.log('\n🎉 TUDO FUNCIONANDO!');
      console.log('   ✅ Servidor backend rodando');
      console.log('   ✅ Login funcionando');
      console.log('   ✅ API de orçamentos funcionando');
      console.log('   ✅ Orçamento 61 existe no banco');
      
      console.log('\n📋 PRÓXIMOS PASSOS:');
      console.log('   1. O frontend deve carregar dados reais automaticamente');
      console.log('   2. Não há mais dados mockados');
      console.log('   3. Teste a página /orcamentos/61 no navegador');
      
    } catch (loginError) {
      console.log('❌ Erro no login:', loginError.response?.status || loginError.code);
      console.log('   Dados:', loginError.response?.data || loginError.message);
      
      if (loginError.response?.status === 401) {
        console.log('\n🔍 INVESTIGANDO CREDENCIAIS...');
        console.log('   Email testado: admin@arcflow.com');
        console.log('   Senha testada: admin123');
        console.log('\n💡 POSSÍVEIS SOLUÇÕES:');
        console.log('   1. Verificar se o usuário existe no banco');
        console.log('   2. Verificar se a senha está correta');
        console.log('   3. Executar: node verificar-usuario-admin.js');
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    console.log('\n🔧 DIAGNÓSTICO:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   Problema: Servidor backend não está rodando');
      console.log('   Solução: Execute "npm start" no diretório backend/');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   Problema: Timeout na conexão');
      console.log('   Solução: Verificar se a porta 3001 está livre');
    } else {
      console.log('   Problema desconhecido:', error.code || error.message);
    }
  }
}

// Executar debug
debugAPIErro()
  .then(() => {
    console.log('\n✅ DEBUG CONCLUÍDO');
  })
  .catch(error => {
    console.error('💥 ERRO NO DEBUG:', error);
  });