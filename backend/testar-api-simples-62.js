/**
 * 🔍 TESTE SIMPLES: API ORÇAMENTO 62
 */

const axios = require('axios');

async function testarApiSimples() {
  console.log('🔍 TESTE SIMPLES API ORÇAMENTO 62\n');
  
  try {
    // Usar token fixo para evitar rate limit
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfYWRtaW5fdGVzdGUiLCJlbWFpbCI6ImFkbWluQGFyY2Zsb3cuY29tIiwibm9tZSI6IkFkbWluIFRlc3RlIiwicm9sZSI6Ik9XTkVSIiwiZXNjcml0b3Jpb0lkIjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5Iiwic2VydmVySW5zdGFuY2VJZCI6IjE3NTM0NzMzNjY2MjMiLCJpc3N1ZWRBdCI6MTc1MzQ4MDQ5MywiaWF0IjoxNzUzNDgwNDkzLCJleHAiOjE3NTM0OTQ4OTMsImF1ZCI6ImFyY2Zsb3ctY2xpZW50IiwiaXNzIjoiYXJjZmxvdy1hcGkifQ.J1H7l6nnbOt_aSY3kUyKcJpP6b9fQz9GS0lVpKD1aRc';
    
    const response = await axios.get('http://localhost:3001/api/orcamentos/63', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ RESPOSTA DA API:');
    console.log('📊 Status:', response.status);
    console.log('📊 Estrutura da resposta:');
    console.log('   - Tem success?', 'success' in response.data);
    console.log('   - Tem data?', 'data' in response.data);
    console.log('   - Tem orcamento?', 'orcamento' in response.data);
    
    if (response.data.success && response.data.data) {
      console.log('✅ FORMATO CORRETO - success: true, data: {...}');
      console.log(`   - ID: ${response.data.data.id}`);
      console.log(`   - Código: ${response.data.data.codigo}`);
    } else if (response.data.orcamento) {
      console.log('❌ FORMATO ANTIGO - orcamento: {...}');
      console.log(`   - ID: ${response.data.orcamento.id}`);
      console.log(`   - Código: ${response.data.orcamento.codigo}`);
    } else {
      console.log('❓ FORMATO DESCONHECIDO');
      console.log('   Resposta completa:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ ERRO COMPLETO:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
  }
}

testarApiSimples();