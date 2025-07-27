/**
 * 🔍 TESTE: API FRONTEND ORÇAMENTO 62
 * 
 * Testar se o frontend consegue acessar a API do orçamento 62
 */

const axios = require('axios');

async function testarApiFrontendOrcamento62() {
  console.log('🔍 TESTANDO API FRONTEND ORÇAMENTO 62\n');
  
  try {
    // Testar a API route do Next.js (frontend)
    console.log('1. 🔍 TESTANDO API ROUTE DO NEXT.JS...');
    
    try {
      const frontendResponse = await axios.get('http://localhost:3000/api/orcamentos/62', {
        headers: {
          'Authorization': 'Bearer demo-token',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API ROUTE DO FRONTEND FUNCIONANDO!');
      console.log('📊 DADOS RETORNADOS:');
      console.log(JSON.stringify(frontendResponse.data, null, 2));
      
    } catch (frontendError) {
      console.log('❌ ERRO NA API ROUTE DO FRONTEND:');
      console.log(`   - Status: ${frontendError.response?.status}`);
      console.log(`   - Mensagem: ${frontendError.response?.data?.message}`);
      console.log(`   - Erro: ${frontendError.response?.data?.error}`);
      console.log(`   - Resposta completa:`, JSON.stringify(frontendError.response?.data, null, 2));
      
      if (frontendError.code === 'ECONNREFUSED') {
        console.log('\n⚠️ PROBLEMA IDENTIFICADO:');
        console.log('   O servidor Next.js (frontend) não está rodando na porta 3000');
        console.log('   Execute: npm run dev no diretório frontend');
        return;
      }
    }
    
    // Testar diretamente o backend
    console.log('\n2. 🔍 TESTANDO BACKEND DIRETO...');
    
    // Fazer login primeiro
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    
    const backendResponse = await axios.get('http://localhost:3001/api/orcamentos/62', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ BACKEND FUNCIONANDO!');
    console.log('📊 DADOS DO BACKEND:');
    console.log('   Estrutura da resposta:', Object.keys(backendResponse.data));
    
    const orcamento = backendResponse.data.data || backendResponse.data.orcamento;
    if (orcamento) {
      console.log(`   - ID: ${orcamento.id}`);
      console.log(`   - Código: ${orcamento.codigo}`);
      console.log(`   - Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    } else {
      console.log('   - Estrutura inesperada:', JSON.stringify(backendResponse.data, null, 2));
    }
    
    // Comparar respostas
    console.log('\n3. 🔍 ANÁLISE DO PROBLEMA...');
    
    if (frontendError && !backendResponse) {
      console.log('❌ PROBLEMA: Frontend não consegue acessar backend');
      console.log('   Possíveis causas:');
      console.log('   - Problema de CORS');
      console.log('   - URL incorreta no frontend');
      console.log('   - Problema de autenticação');
    } else if (frontendError && backendResponse) {
      console.log('❌ PROBLEMA: API route do frontend tem erro');
      console.log('   O backend funciona, mas o proxy do frontend não');
    } else {
      console.log('✅ TUDO FUNCIONANDO!');
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
  }
}

testarApiFrontendOrcamento62()
  .then(() => {
    console.log('\n🔍 TESTE CONCLUÍDO');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NO TESTE:', error);
    process.exit(1);
  });