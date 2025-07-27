/**
 * 🔍 TESTE FINAL: ORÇAMENTO 63 COM TODAS AS CORREÇÕES
 * 
 * Testar se o orçamento 63 carrega sem erros de JSON.parse
 */

const axios = require('axios');

async function testeFinalOrcamento63() {
  console.log('🔍 TESTE FINAL - ORÇAMENTO 63 COM CORREÇÕES\n');
  
  try {
    // 1. Testar backend direto primeiro
    console.log('1. 🔍 TESTANDO BACKEND DIRETO...');
    
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    
    const backendResponse = await axios.get('http://localhost:3001/api/orcamentos/63', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ BACKEND FUNCIONANDO!');
    console.log('📊 DADOS DO BACKEND:');
    
    const orcamento = backendResponse.data.data;
    console.log(`   - ID: ${orcamento.id}`);
    console.log(`   - Código: ${orcamento.codigo}`);
    console.log(`   - Nome: ${orcamento.nome}`);
    console.log(`   - Valor Total: R$ ${parseFloat(orcamento.valor_total).toLocaleString('pt-BR')}`);
    console.log(`   - Cliente: ${orcamento.cliente_nome}`);
    console.log(`   - Status: ${orcamento.status}`);
    
    // Verificar estrutura dos dados JSON
    console.log('\n📊 ANÁLISE DOS CAMPOS JSON:');
    console.log(`   - Disciplinas (tipo): ${typeof orcamento.disciplinas}`);
    console.log(`   - Disciplinas (valor):`, orcamento.disciplinas);
    console.log(`   - Cronograma (tipo): ${typeof orcamento.cronograma}`);
    console.log(`   - Composição Financeira (tipo): ${typeof orcamento.composicao_financeira}`);
    console.log(`   - Proposta (tipo): ${typeof orcamento.proposta}`);
    
    // Verificar se são objetos válidos (não strings)
    const disciplinasOk = Array.isArray(orcamento.disciplinas) || typeof orcamento.disciplinas === 'object';
    const cronogramaOk = typeof orcamento.cronograma === 'object' && orcamento.cronograma !== null;
    const composicaoOk = typeof orcamento.composicao_financeira === 'object';
    const propostaOk = typeof orcamento.proposta === 'object';
    
    console.log('\n✅ VALIDAÇÃO DOS DADOS:');
    console.log(`   - Disciplinas válidas: ${disciplinasOk ? '✅' : '❌'}`);
    console.log(`   - Cronograma válido: ${cronogramaOk ? '✅' : '❌'}`);
    console.log(`   - Composição válida: ${composicaoOk ? '✅' : '❌'}`);
    console.log(`   - Proposta válida: ${propostaOk ? '✅' : '❌'}`);
    
    if (disciplinasOk && cronogramaOk && composicaoOk && propostaOk) {
      console.log('\n🎉 SUCESSO TOTAL!');
      console.log('✅ Todos os dados estão em formato correto');
      console.log('✅ O frontend não deve mais ter erro de JSON.parse');
      console.log('✅ O orçamento 63 deve carregar perfeitamente na página');
    } else {
      console.log('\n⚠️ AINDA HÁ PROBLEMAS:');
      console.log('❌ Alguns dados ainda estão em formato incorreto');
      console.log('❌ Pode haver erro de JSON.parse no frontend');
    }
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
}

testeFinalOrcamento63();