/**
 * 🔍 TESTE: ORÇAMENTO 66 FUNCIONANDO
 */

const axios = require('axios');

async function testarOrcamento66() {
  console.log('🔍 TESTANDO ORÇAMENTO 66\n');
  
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // Buscar orçamento 66
    const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/66', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (orcamentoResponse.status === 200) {
      const orcamento = orcamentoResponse.data.data;
      console.log(`✅ Orçamento 66 encontrado: ${orcamento.codigo}`);
      console.log(`📊 Valor: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
      
      if (orcamento.cronograma && orcamento.cronograma.fases) {
        const totalEntregaveis = Object.values(orcamento.cronograma.fases).reduce((total, fase) => 
          total + (fase.entregaveis?.length || 0), 0
        );
        console.log(`📅 Cronograma: ${Object.keys(orcamento.cronograma.fases).length} fases, ${totalEntregaveis} entregáveis`);
        
        if (totalEntregaveis === 72) {
          console.log('🎉 ORÇAMENTO 66 ESTÁ PERFEITO!');
          console.log('✅ Sistema de geração funcionando corretamente');
        } else {
          console.log(`❌ Problema: ${totalEntregaveis} entregáveis (esperado: 72)`);
        }
      }
    }
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Orçamento 66 não encontrado');
      console.log('💡 Precisa gerar um novo orçamento');
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

testarOrcamento66();