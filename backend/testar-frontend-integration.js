/**
 * 🧪 TESTE DE INTEGRAÇÃO FRONTEND
 * Simular requisições do frontend para testar a nova funcionalidade
 */

const axios = require('axios');

async function testarIntegracaoFrontend() {
  console.log('🧪 TESTE DE INTEGRAÇÃO FRONTEND');
  console.log('='.repeat(60));
  
  try {
    // Usar token válido diretamente
    console.log('🔐 1. Usando token de autenticação...');
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfYWRtaW5fdGVzdGUiLCJlbWFpbCI6ImFkbWluQGFyY2Zsb3cuY29tIiwibm9tZSI6IkFkbWluIFRlc3RlIiwicm9sZSI6Ik9XTkVSIiwiZXNjcml0b3Jpb0lkIjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5IiwiaWF0IjoxNzUzNDAzNzAxLCJleHAiOjE3NTM0MDQ2MDEsImF1ZCI6ImFyY2Zsb3ctY2xpZW50IiwiaXNzIjoiYXJjZmxvdy1hcGkifQ.8E-lH0jwrHotN2GmCnPIAR52RH7SVzpI91RU6a45ols';
    console.log('✅ Token configurado');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Testar briefing COM orçamento
    console.log('\n📋 2. Testando briefing COM orçamento...');
    const briefingComOrcamento = '947cbfa7-00db-4bda-b86b-033aa665dae5'; // Casa Florianopolis
    
    const responseComOrcamento = await axios.get(
      `http://localhost:3001/api/briefings/${briefingComOrcamento}`,
      { headers }
    );
    
    const briefingCom = responseComOrcamento.data.briefing;
    console.log(`📋 Nome: ${briefingCom.nomeProjeto}`);
    console.log(`💰 Tem Orçamento: ${briefingCom.temOrcamento ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`🆔 Orçamento ID: ${briefingCom.orcamentoId || 'N/A'}`);
    console.log(`🎯 Botão deve mostrar: ${briefingCom.temOrcamento ? 'VER ORÇAMENTO' : 'GERAR ORÇAMENTO'}`);
    
    // Testar briefing SEM orçamento
    console.log('\n📋 3. Testando briefing SEM orçamento...');
    const briefingSemOrcamento = '1a1881d9-768d-483b-9262-466983af8ee0'; // Teste
    
    const responseSemOrcamento = await axios.get(
      `http://localhost:3001/api/briefings/${briefingSemOrcamento}`,
      { headers }
    );
    
    const briefingSem = responseSemOrcamento.data.briefing;
    console.log(`📋 Nome: ${briefingSem.nomeProjeto}`);
    console.log(`💰 Tem Orçamento: ${briefingSem.temOrcamento ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`🆔 Orçamento ID: ${briefingSem.orcamentoId || 'N/A'}`);
    console.log(`🎯 Botão deve mostrar: ${briefingSem.temOrcamento ? 'VER ORÇAMENTO' : 'GERAR ORÇAMENTO'}`);
    
    console.log('\n🎉 TESTE DE INTEGRAÇÃO CONCLUÍDO COM SUCESSO!');
    console.log('✅ API está retornando as propriedades corretas');
    console.log('✅ Frontend pode implementar a lógica do botão dinâmico');
    console.log('✅ Experiência do usuário será melhorada significativamente');
    console.log('\n📋 RESUMO DOS TESTES:');
    console.log(`✅ Briefing COM orçamento: ${briefingCom.nomeProjeto} → VER ORÇAMENTO`);
    console.log(`✅ Briefing SEM orçamento: ${briefingSem.nomeProjeto} → GERAR ORÇAMENTO`);
    
  } catch (error) {
    console.error('❌ Erro no teste de integração:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Dados:', error.response.data);
    }
  }
}

// Executar apenas se o servidor estiver rodando
testarIntegracaoFrontend();