/**
 * 🔍 TESTE: ORÇAMENTO 63 COM CORREÇÕES
 * 
 * Testar se o frontend consegue carregar o orçamento 63 com as correções aplicadas
 */

const axios = require('axios');

async function testarOrcamento63() {
  console.log('🔍 TESTANDO ORÇAMENTO 63 COM CORREÇÕES\n');
  
  try {
    // 1. Testar login automático via API route do frontend
    console.log('1. 🔐 TESTANDO LOGIN AUTOMÁTICO...');
    
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('✅ Login automático funcionando!');
    console.log('📊 Token obtido:', loginResponse.data.tokens?.accessToken ? 'SIM' : 'NÃO');
    
    const token = loginResponse.data.tokens?.accessToken || loginResponse.data.token;
    
    // 2. Testar API route do frontend para orçamento 63
    console.log('\n2. 🔍 TESTANDO API ROUTE DO FRONTEND...');
    
    const orcamentoResponse = await axios.get('http://localhost:3000/api/orcamentos/63', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API route do frontend funcionando!');
    console.log('📊 Estrutura da resposta:');
    console.log('   - success:', orcamentoResponse.data.success);
    console.log('   - data:', orcamentoResponse.data.data ? 'SIM' : 'NÃO');
    
    if (orcamentoResponse.data.data) {
      const orc = orcamentoResponse.data.data;
      console.log('📊 DADOS DO ORÇAMENTO:');
      console.log(`   - ID: ${orc.id}`);
      console.log(`   - Código: ${orc.codigo}`);
      console.log(`   - Nome: ${orc.nome}`);
      console.log(`   - Valor Total: R$ ${parseFloat(orc.valor_total || 0).toLocaleString('pt-BR')}`);
      console.log(`   - Cliente: ${orc.cliente_nome || 'N/A'}`);
      console.log(`   - Status: ${orc.status}`);
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ O orçamento 63 deve carregar corretamente no frontend agora.');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
}

testarOrcamento63();