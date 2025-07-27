/**
 * 🔍 TESTE: API ORÇAMENTO 62
 * 
 * Testar se a API consegue buscar o orçamento 62
 */

const axios = require('axios');

async function testarApiOrcamento62() {
  console.log('🔍 TESTANDO API ORÇAMENTO 62\n');
  
  try {
    // Fazer login primeiro
    console.log('1. 🔐 FAZENDO LOGIN...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    console.log('📊 Resposta do login:', loginResponse.data);
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    
    if (!token) {
      console.log('❌ Token não encontrado na resposta');
      return;
    }
    
    console.log('✅ Login realizado com sucesso');
    
    // Testar busca do orçamento 62
    console.log('\n2. 🔍 BUSCANDO ORÇAMENTO 62...');
    
    try {
      const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/62', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ ORÇAMENTO 62 ENCONTRADO VIA API!');
      console.log('📊 RESPOSTA COMPLETA:', JSON.stringify(orcamentoResponse.data, null, 2));
      
      if (orcamentoResponse.data.data) {
        console.log('📊 DADOS RETORNADOS:');
        console.log(`   - ID: ${orcamentoResponse.data.data.id}`);
        console.log(`   - Código: ${orcamentoResponse.data.data.codigo}`);
        console.log(`   - Nome: ${orcamentoResponse.data.data.nome}`);
        console.log(`   - Valor Total: R$ ${orcamentoResponse.data.data.valor_total?.toLocaleString('pt-BR') || 'NULL'}`);
        console.log(`   - Status: ${orcamentoResponse.data.data.status}`);
      }
      
    } catch (apiError) {
      console.log('❌ ERRO NA API:');
      console.log(`   - Status: ${apiError.response?.status}`);
      console.log(`   - Mensagem: ${apiError.response?.data?.message}`);
      console.log(`   - Erro: ${apiError.response?.data?.error}`);
      console.log(`   - Resposta completa:`, JSON.stringify(apiError.response?.data, null, 2));
      
      if (apiError.response?.status === 400) {
        console.log('\n🔍 PROBLEMA IDENTIFICADO:');
        console.log('   A API está rejeitando o ID 62 porque espera UUID');
        console.log('   Mas o orçamento 62 tem ID numérico no banco');
        console.log('   Isso explica por que o frontend não consegue carregar os dados');
      }
    }
    
    // Testar com outros orçamentos para comparar
    console.log('\n3. 🔍 TESTANDO OUTROS ORÇAMENTOS...');
    
    const outrosIds = [59, 58, 56];
    
    for (const id of outrosIds) {
      try {
        const response = await axios.get(`http://localhost:3001/api/orcamentos/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Orçamento ${id}: ${response.data.data.codigo}`);
        
      } catch (error) {
        console.log(`❌ Orçamento ${id}: ${error.response?.data?.message || 'Erro'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
  }
}

testarApiOrcamento62()
  .then(() => {
    console.log('\n🔍 TESTE CONCLUÍDO');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FALHA NO TESTE:', error);
    process.exit(1);
  });